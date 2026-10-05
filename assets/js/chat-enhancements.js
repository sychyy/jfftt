/* JFT Global Chat UX + Home Announcement Center — mentions, notifications, announcements, stickers & rich links. */
(function(){
'use strict';
const DAY=24*60*60*1000;
const MAX_ANNOUNCEMENT_FILE_BYTES=25*1024*1024;
let usersCache=[];
let announcementCache=[];
let featureChannel=null;

function identity(){
  try { return typeof getChatIdentity==='function' ? String(getChatIdentity()) : String(localStorage.getItem('jft_user_id')||'guest'); } catch(_){ return String(localStorage.getItem('jft_user_id')||'guest'); }
}
function role(){ return String(localStorage.getItem('jft_user_role')||'').trim().toLowerCase(); }
function esc(v){ return typeof escapeHtml==='function' ? escapeHtml(String(v??'')) : String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function attr(v){ return typeof escapeAttr==='function' ? escapeAttr(String(v??'')) : esc(v); }
function toast(t,m,e=false){ if(typeof showToast==='function') showToast(t,m,e); }
function isAdmin(){ return role()==='admin'; }
function currentUserName(){ try{return typeof getCurrentChatName==='function'?String(getCurrentChatName()||'ADMIN'):String(localStorage.getItem('jft_chat_name')||'ADMIN')}catch(_){return 'ADMIN'} }

async function loadChatUsers(force=false){
  if(usersCache.length && !force) return usersCache;
  if(!window.supabaseClient) return [];
  const {data,error}=await window.supabaseClient.from('Jft-Basic').select('id,name,status,role').order('name',{ascending:true});
  if(error){ console.warn('Gagal memuat daftar tag:',error); return usersCache; }
  usersCache=(data||[]).filter(u=>u && String(u.status||'active').toLowerCase()==='active' && u.name).map(u=>({id:String(u.id),name:String(u.name).trim().toUpperCase(),role:String(u.role||'user').toLowerCase()}));
  return usersCache;
}

function currentMentionToken(input){
  const value=String(input?.value||'');
  const pos=Number.isInteger(input?.selectionStart)?input.selectionStart:value.length;
  const before=value.slice(0,pos);
  const match=before.match(/(^|\s)@([^\s@]*)$/);
  return match ? {query:match[2].toUpperCase(),start:pos-match[2].length-1,end:pos} : null;
}
window.checkChatInput=async function(e){
  const input=e?.target||document.getElementById('chat-input-msg');
  const box=document.getElementById('tag-suggestions');
  if(!input||!box) return;
  const token=currentMentionToken(input);
  if(!token){ box.classList.add('hidden'); box.innerHTML=''; return; }
  const users=await loadChatUsers();
  const q=token.query;
  const matches=users.filter(u=>u.name.includes(q)).slice(0,8);
  if(!matches.length){ box.classList.add('hidden'); box.innerHTML=''; return; }
  box.classList.remove('hidden');
  box.innerHTML=matches.map(u=>`<button type="button" class="jft-tag-suggestion" data-tag-id="${attr(u.id)}" data-tag-name="${attr(u.name)}"><span class="jft-tag-avatar">${esc(u.name.slice(0,1))}</span><span class="min-w-0 truncate">@${esc(u.name)}</span></button>`).join('');
  box.querySelectorAll('[data-tag-name]').forEach(btn=>btn.addEventListener('click',()=>insertMention(btn.dataset.tagName,token.start,token.end)));
};
function insertMention(name,start,end){
  const input=document.getElementById('chat-input-msg'); if(!input)return;
  const value=input.value; input.value=value.slice(0,start)+'@'+name+' '+value.slice(end); const pos=start+name.length+2; input.focus(); input.setSelectionRange(pos,pos);
  const box=document.getElementById('tag-suggestions'); if(box){box.classList.add('hidden');box.innerHTML='';}
}
window.insertTagUser=function(username){ const input=document.getElementById('chat-input-msg'); if(!input)return; const token=currentMentionToken(input); if(token) insertMention(String(username).toUpperCase(),token.start,token.end); else { input.value=input.value.replace(/\s*$/,'')+' @'+String(username).toUpperCase()+' '; input.focus(); } };

window.createTagNotifications=async function(message){
  if(!message || !window.supabaseClient) return;
  const text=String(message.message||''); if(!text) return;
  const sender=String(message.sender_id||'');
  const users=await loadChatUsers();
  const lower=text.toUpperCase();
  const targets=users.filter(u=>u.id!==sender && new RegExp(`(^|\\s)@${u.name.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}(?=\\s|$|[.,!?])`,'i').test(lower));
  if(!targets.length) return;
  const rows=targets.map(u=>({recipient_id:u.id,recipient_name:u.name,sender_id:sender,sender_name:String(message.sender_name||'SISWA'),message_id:String(message.id),type:'mention',content:text,read_at:null}));
  const {error}=await window.supabaseClient.from('chat_notifications').insert(rows);
  if(error) console.warn('Gagal membuat notifikasi tag:',error);
};

async function markNotificationsRead(){
  if(!window.supabaseClient) return;
  const {error}=await window.supabaseClient.from('chat_notifications').update({read_at:new Date().toISOString()}).eq('recipient_id',identity()).is('read_at',null);
  if(error) console.warn('Gagal menandai notifikasi tag:',error);
}
async function hasUnreadTagNotifications(){
  if(!window.supabaseClient) return false;
  const {data,error}=await window.supabaseClient.from('chat_notifications').select('id').eq('recipient_id',identity()).is('read_at',null).limit(1);
  if(error) return false;
  return !!(data&&data.length);
}
async function refreshChatDot(){
  const dot=document.getElementById('chat-notification-dot'); if(!dot)return;
  const unread=await hasUnreadTagNotifications(); dot.classList.toggle('hidden',!unread);
  try{localStorage.setItem('jft_has_unread_tag',unread?'true':'false');}catch(_){ }
}

function formatAnnDate(value){
  const d=new Date(value);
  return d.toLocaleString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'});
}
function formatAnnShort(value){
  const d=new Date(value);
  return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'});
}
function mediaTypeFromFile(file){
  const t=String(file?.type||'').toLowerCase();
  if(t.startsWith('image/')) return 'image';
  if(t.startsWith('video/')) return 'video';
  if(t.startsWith('audio/')) return 'audio';
  return 'document';
}
async function getAnnouncementMediaDuration(file){
  if(!file || !/^(audio|video)\//i.test(String(file.type||''))) return null;
  return new Promise(resolve=>{
    const el=document.createElement(file.type.startsWith('audio/')?'audio':'video');
    const url=URL.createObjectURL(file); let done=false;
    const finish=value=>{if(done)return;done=true;URL.revokeObjectURL(url);el.remove();resolve(Number.isFinite(value)&&value>0?Math.round(value):null)};
    el.preload='metadata'; el.onloadedmetadata=()=>finish(el.duration); el.onerror=()=>finish(null); setTimeout(()=>finish(null),5000); el.src=url;
  });
}
function announcementPlayerMarkup(url,duration,mime){
  const bars=Array.from({length:52},(_,i)=>`<span class="jft-vn-bar" style="--i:${i}"></span>`).join('');
  return `<div class="jft-vn-player jft-ann-audio jft-ann-audio-premium" data-vn-player data-vn-duration="${Number(duration)||0}">
    <audio class="jft-vn-audio" preload="metadata" aria-hidden="true"><source src="${attr(url)}" type="${attr(mime||'audio/mpeg')}"></audio>
    <div class="jft-ann-audio-icon" aria-hidden="true"><i class="fa-solid fa-music"></i></div>
    <div class="jft-ann-audio-center">
      <div class="jft-ann-audio-top"><span class="jft-ann-audio-label">AUDIO</span><span class="jft-ann-audio-name">Pengumuman JFT-Basic</span><span class="jft-ann-audio-time" data-vn-time>0:00 / ${formatAnnTime(duration)}</span></div>
      <button type="button" class="jft-vn-wave jft-ann-audio-wave" data-vn-seek aria-label="Atur posisi audio"><span class="jft-vn-track" data-vn-track></span><span class="jft-vn-progress" data-vn-progress></span><span class="jft-vn-bars">${bars}</span></button>
    </div>
    <div class="jft-ann-audio-controls">
      <button type="button" class="jft-ann-audio-skip" data-vn-skip="-10" aria-label="Mundur 10 detik"><i class="fa-solid fa-rotate-left"></i><span>10</span></button>
      <button type="button" class="jft-ann-audio-play jft-vn-play" data-vn-play aria-label="Putar audio pengumuman"><i class="fa-solid fa-play"></i></button>
      <button type="button" class="jft-ann-audio-skip" data-vn-skip="10" aria-label="Maju 10 detik"><i class="fa-solid fa-rotate-right"></i><span>10</span></button>
      <button type="button" class="jft-vn-speed jft-ann-audio-speed" data-vn-speed>1x</button>
    </div>
  </div>`;
}
function formatAnnTime(seconds){ const n=Math.max(0,Number(seconds)||0); return formatDuration(n); }
function announcementMediaMarkup(item){
  const url=String(item.file_url||''); if(!url)return '';
  const type=String(item.media_type||'').toLowerCase();
  const mode=String(item.media_mode||'video').toLowerCase();
  if(type==='image') return `<div class="jft-ann-media jft-ann-image"><a href="${attr(url)}" target="_blank" rel="noopener noreferrer"><img src="${attr(url)}" alt="Media pengumuman" loading="lazy"></a></div>`;
  if(type==='video'){
    if(mode==='gif') return `<div class="jft-ann-media jft-ann-video jft-ann-video-gif"><video autoplay muted loop playsinline preload="auto" aria-label="Media animasi pengumuman"><source src="${attr(url)}" type="${attr(item.mime_type||'video/*')}"></video></div>`;
    return `<div class="jft-ann-media jft-ann-video"><video controls preload="metadata" playsinline><source src="${attr(url)}" type="${attr(item.mime_type||'video/*')}"></video></div>`;
  }
  if(type==='audio') return `<div class="jft-ann-media jft-ann-audio-wrap">${announcementPlayerMarkup(url,item.duration_seconds,item.mime_type)}</div>`;
  return `<div class="jft-ann-media jft-ann-file"><a href="${attr(url)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-file-arrow-down"></i><span>${esc(item.file_name||'Lampiran pengumuman')}</span></a></div>`;
}
function mediaBadge(item){
  const type=String(item.media_type||'').toLowerCase();
  const mode=String(item.media_mode||'video').toLowerCase();
  if(type==='image') return '<span class="jft-ann-badge"><i class="fa-solid fa-image"></i> Foto</span>';
  if(type==='video') return mode==='gif' ? '<span class="jft-ann-badge jft-ann-badge-gif"><i class="fa-solid fa-repeat"></i> GIF</span>' : '<span class="jft-ann-badge"><i class="fa-solid fa-video"></i> Video</span>';
  if(type==='audio') return '<span class="jft-ann-badge"><i class="fa-solid fa-music"></i> Lagu</span>';
  if(type==='document') return '<span class="jft-ann-badge"><i class="fa-solid fa-paperclip"></i> File</span>';
  return '';
}
function announcementListItem(item, unread){
  const media=mediaBadge(item);
  return `<article class="jft-ann-item ${unread?'is-unread':''}" data-announcement-id="${attr(item.id)}">
    <button type="button" class="jft-ann-summary" data-ann-open="${attr(item.id)}">
      <span class="jft-ann-summary-icon"><i class="fa-solid fa-bullhorn"></i></span>
      <span class="jft-ann-summary-body"><strong>${esc(item.title||'Pengumuman Admin')}</strong><small>${formatAnnDate(item.created_at)}</small></span>
      <span class="jft-ann-summary-meta">${media}${unread?'<span class="jft-ann-unread" title="Belum dibuka"><i class="fa-solid fa-envelope"></i></span>':''}<i class="fa-solid fa-chevron-down jft-ann-chevron"></i></span>
    </button>
    <div class="jft-ann-detail" aria-hidden="true">
      ${announcementMediaMarkup(item)}
      <div class="jft-ann-detail-title">${esc(item.title||'Pengumuman Admin')}</div>
      <div class="jft-ann-detail-date"><i class="fa-regular fa-calendar"></i> ${formatAnnDate(item.created_at)}</div>
      <div class="jft-ann-detail-message">${typeof window.jftLinkifyText==='function'?window.jftLinkifyText(item.message||''):esc(item.message||'')}</div>
      <div class="jft-ann-detail-foot"><span><i class="fa-regular fa-clock"></i> Berlaku sampai ${formatAnnDate(item.expires_at)}</span>${isAdmin()?`<button type="button" class="jft-ann-delete" data-delete-ann="${attr(item.id)}"><i class="fa-solid fa-trash"></i> Hapus</button>`:''}</div>
    </div>
  </article>`;
}
async function activeAnnouncements(){
  if(!window.supabaseClient) return [];
  const now=new Date().toISOString();
  const {data,error}=await window.supabaseClient.from('chat_announcements').select('*').gt('expires_at',now).order('created_at',{ascending:false}).limit(30);
  if(error){console.warn('Pengumuman gagal dimuat:',error);return []}
  return data||[];
}
async function cleanupExpiredAnnouncements(){
  if(!isAdmin()||!window.supabaseClient)return;
  try{
    const now=new Date().toISOString();
    const {data}=await window.supabaseClient.from('chat_announcements').select('id,file_path').lte('expires_at',now).limit(100);
    if(!data?.length)return;
    const paths=data.map(x=>x.file_path).filter(Boolean);
    if(paths.length&&typeof window.deleteChatStoragePaths==='function') await window.deleteChatStoragePaths(paths);
    await window.supabaseClient.from('chat_announcements').delete().in('id',data.map(x=>x.id));
  }catch(e){console.warn('Cleanup pengumuman kadaluarsa gagal:',e)}
}
async function readAnnouncement(id){
  if(!window.supabaseClient||!id)return;
  const {error}=await window.supabaseClient.from('announcement_reads').upsert([{announcement_id:String(id),reader_id:identity(),read_at:new Date().toISOString()}],{onConflict:'announcement_id,reader_id'});
  if(error)console.warn('Gagal menandai pengumuman dibaca:',error);
}
async function loadAnnouncementReads(){
  if(!window.supabaseClient)return new Set();
  const {data}=await window.supabaseClient.from('announcement_reads').select('announcement_id').eq('reader_id',identity()).limit(500);
  return new Set((data||[]).map(x=>String(x.announcement_id)));
}
async function renderAnnouncementCenter(){
  const list=document.getElementById('announcement-list'); if(!list)return;
  await cleanupExpiredAnnouncements();
  announcementCache=await activeAnnouncements();
  const readSet=await loadAnnouncementReads();
  const box=document.getElementById('announcement-center-empty');
  if(!announcementCache.length){list.innerHTML='';if(box)box.classList.remove('hidden');refreshAnnouncementDot();return}
  if(box)box.classList.add('hidden');
  list.innerHTML=announcementCache.map(a=>announcementListItem(a,!readSet.has(String(a.id)))).join('');
  list.querySelectorAll('[data-ann-open]').forEach(btn=>btn.addEventListener('click',async()=>{
    const card=btn.closest('.jft-ann-item'); const id=btn.dataset.annOpen; const opened=card.classList.contains('is-open');
    document.querySelectorAll('.jft-ann-item.is-open').forEach(other=>{if(other!==card){other.classList.remove('is-open');other.querySelector('.jft-ann-detail')?.setAttribute('aria-hidden','true')}});
    if(opened){card.classList.remove('is-open');card.querySelector('.jft-ann-detail')?.setAttribute('aria-hidden','true');return}
    card.classList.add('is-open');card.querySelector('.jft-ann-detail')?.setAttribute('aria-hidden','false');
    await readAnnouncement(id);
    const unread=card.classList.contains('is-unread'); if(unread){card.classList.remove('is-unread');card.querySelector('.jft-ann-unread')?.remove();}
    if(typeof window.initJftVNPlayers==='function') window.initJftVNPlayers(card);
    await refreshAnnouncementDot();
  }));
  list.querySelectorAll('[data-delete-ann]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();deleteAnnouncement(btn.dataset.deleteAnn)}));
  if(typeof window.initJftVNPlayers==='function') window.initJftVNPlayers(list);
  refreshAnnouncementDot();
}
async function hasUnreadAnnouncements(){
  if(!window.supabaseClient)return false;
  const active=await activeAnnouncements(); if(!active.length)return false;
  const readSet=await loadAnnouncementReads(); return active.some(x=>!readSet.has(String(x.id)));
}
async function refreshAnnouncementDot(){
  const dot=document.getElementById('announcement-notification-dot'); if(!dot)return;
  const unread=await hasUnreadAnnouncements(); dot.classList.toggle('hidden',!unread); dot.setAttribute('aria-hidden',unread?'false':'true');
}
function openAnnouncementCenter(){
  const modal=document.getElementById('announcement-center-modal'); if(!modal)return;
  modal.classList.remove('hidden');modal.classList.add('flex');document.body.classList.add('jft-modal-open');
  renderAnnouncementCenter();
}
function closeAnnouncementCenter(){
  const modal=document.getElementById('announcement-center-modal'); if(!modal)return;
  modal.classList.add('hidden');modal.classList.remove('flex');document.body.classList.remove('jft-modal-open');
}
window.openAnnouncementCenter=openAnnouncementCenter;
window.closeAnnouncementCenter=closeAnnouncementCenter;
window.toggleAnnouncementCenter=function(){const modal=document.getElementById('announcement-center-modal'); if(modal?.classList.contains('hidden'))openAnnouncementCenter();else closeAnnouncementCenter();};

async function sendAnnouncement(){
  if(!isAdmin()){toast('Tidak diizinkan','Hanya admin yang bisa membuat pengumuman.',true);return}
  if(!window.supabaseClient)return;
  const titleInput=document.getElementById('announcement-title-input');
  const messageInput=document.getElementById('announcement-input');
  const fileInput=document.getElementById('announcement-file-input');
  const title=String(titleInput?.value||'').trim(); const text=String(messageInput?.value||'').trim();
  const file=fileInput?.files?.[0]||null;
  const mediaMode=String(document.querySelector('input[name="announcement-media-mode"]:checked')?.value||'video').toLowerCase();
  if(!title){toast('Judul belum diisi','Tambahkan judul pengumuman dulu.',true);return}
  if(!text&&!file){toast('Isi pengumuman kosong','Tulis pesan atau pilih media.',true);return}
  if(file&&file.size>MAX_ANNOUNCEMENT_FILE_BYTES){toast('File terlalu besar','Maksimal 25 MB.',true);return}
  const btn=document.getElementById('announcement-send'); if(btn)btn.disabled=true;
  try{
    let uploadMeta={};
    if(file){
      if(typeof window.uploadChatFile!=='function')throw new Error('Modul upload belum siap.');
      uploadMeta=await window.uploadChatFile(file,{subfolder:'announcements'});
    }
    const now=new Date(); const expires=new Date(now.getTime()+DAY);
    const resolvedMime=String(uploadMeta.mime_type||file?.type||'').toLowerCase();
    const mediaType=uploadMeta.publicUrl ? mediaTypeFromFile({type:resolvedMime}) : null;
    const effectiveMode=mediaType==='video' ? (mediaMode==='gif' ? 'gif' : 'video') : (mediaType?mediaType:'none');
    let mediaDuration=null;
    // Durasi hanya disimpan untuk AUDIO. Video/GIF tidak perlu disimpan ke database.
    if(file && mediaType==='audio') {
      try {
        const durationFile = file.type ? file : new File([file], file.name||'announcement-audio', {type:resolvedMime||'audio/mpeg'});
        mediaDuration=await getAnnouncementMediaDuration(durationFile);
      } catch(_) { mediaDuration=null; }
    }
    const payload={admin_id:String(localStorage.getItem('jft_user_id')||''),admin_name:currentUserName(),title,message:text,created_at:now.toISOString(),expires_at:expires.toISOString(),file_url:uploadMeta.publicUrl||null,file_path:uploadMeta.path||null,file_name:file?.name||null,mime_type:resolvedMime||null,file_size:file?.size||null,media_type:mediaType,media_mode:effectiveMode,duration_seconds:mediaType==='audio'?mediaDuration:null};
    const {error}=await window.supabaseClient.from('chat_announcements').insert([payload]);
    if(error){ if(uploadMeta.path&&typeof window.deleteChatStoragePaths==='function')await window.deleteChatStoragePaths([uploadMeta.path]); throw error; }
    if(titleInput)titleInput.value=''; if(messageInput)messageInput.value=''; if(fileInput)fileInput.value='';
    const defaultMode=document.querySelector('input[name="announcement-media-mode"][value="video"]'); if(defaultMode)defaultMode.checked=true;
    const modeWrap=document.getElementById('announcement-media-mode-wrap'); if(modeWrap)modeWrap.classList.add('hidden');
    const preview=document.getElementById('announcement-file-preview'); if(preview){preview.innerHTML='';preview.classList.add('hidden');}
    toast('Pengumuman diterbitkan','Pengumuman aktif selama 24 jam.');
    await renderAnnouncementCenter();
  }catch(e){console.error(e);toast('Pengumuman gagal',e.message||'Tidak bisa menerbitkan pengumuman.',true)}
  if(btn)btn.disabled=false;
}
window.sendAnnouncement=sendAnnouncement;
async function deleteAnnouncement(id){
  if(!isAdmin()||!window.supabaseClient)return;
  const perform=async()=>{
    const item=announcementCache.find(x=>String(x.id)===String(id));
    try{
      if(item?.file_path&&typeof window.deleteChatStoragePaths==='function')await window.deleteChatStoragePaths([item.file_path]);
      const {error}=await window.supabaseClient.from('chat_announcements').delete().eq('id',id); if(error)throw error;
      toast('Terhapus','Pengumuman dan medianya berhasil dihapus.'); await renderAnnouncementCenter();
    }catch(e){toast('Gagal menghapus',e.message||'Tidak dapat menghapus pengumuman.',true)}
  };
  if(typeof showCustomConfirm==='function')showCustomConfirm('Hapus pengumuman ini beserta medianya?',perform,'Hapus');else if(confirm('Hapus pengumuman ini beserta medianya?'))perform();
}

function ensureAnnouncementUI(){
  let mount=document.getElementById('announcement-center-modal');
  if(!mount){
    mount=document.createElement('div'); mount.id='announcement-center-modal'; mount.className='jft-ann-modal hidden';
    mount.innerHTML=`<div class="jft-ann-backdrop" data-ann-close></div><section class="jft-ann-dialog" role="dialog" aria-modal="true" aria-label="Pengumuman"><header class="jft-ann-dialog-head"><div class="jft-ann-dialog-title"><span class="jft-ann-dialog-icon"><i class="fa-solid fa-envelope-open-text"></i></span><div><span class="jft-ann-dialog-kicker">PUSAT INFORMASI</span><h3>Pengumuman JFT-Basic</h3><p>Informasi dari admin · aktif 24 jam</p></div></div><button type="button" class="jft-ann-dialog-close" data-ann-close><i class="fa-solid fa-xmark"></i></button></header><div id="announcement-admin-slot"></div><div class="jft-ann-list-head"><div><span class="jft-ann-list-kicker">ARSIP AKTIF</span><strong>Daftar pengumuman</strong></div><span class="jft-ann-list-note">Tekan judul untuk membuka</span></div><div id="announcement-list" class="jft-ann-list"></div><div id="announcement-center-empty" class="jft-ann-empty hidden"><i class="fa-regular fa-envelope-open"></i><strong>Belum ada pengumuman</strong><span>Pengumuman dari admin akan muncul di sini.</span></div></section>`;
    document.body.appendChild(mount);
  }
  mount.querySelectorAll('[data-ann-close]').forEach(el=>{if(!el.dataset.bound){el.dataset.bound='1';el.addEventListener('click',closeAnnouncementCenter)}});
  if(isAdmin()){
    let slot=mount.querySelector('#announcement-admin-slot');
    if(slot && !slot.querySelector('#announcement-title-input')){
      slot.innerHTML=`<div class="jft-ann-compose"><div class="jft-ann-compose-title"><i class="fa-solid fa-bullhorn"></i><span>Buat pengumuman baru</span><small>Judul, isi, dan media opsional</small></div><input id="announcement-title-input" maxlength="120" placeholder="Judul pengumuman..." class="jft-ann-input" type="text"><textarea id="announcement-input" maxlength="4000" placeholder="Tulis isi pengumuman..."></textarea><div class="jft-ann-compose-row"><label class="jft-ann-filepick"><input id="announcement-file-input" accept="image/*,video/*,audio/*" type="file"><i class="fa-solid fa-paperclip"></i><span>Tambah foto, video, atau lagu</span></label><button type="button" id="announcement-send" class="jft-ann-send"><i class="fa-solid fa-paper-plane"></i> Terbitkan 24 jam</button></div><div id="announcement-media-mode-wrap" class="jft-ann-media-mode hidden"><div class="jft-ann-media-mode-head"><span><i class="fa-solid fa-sliders"></i> Mode video</span><small>Pilih cara media ini diputar</small></div><div class="jft-ann-media-mode-options"><label class="jft-ann-mode-option is-active"><input type="radio" name="announcement-media-mode" value="video" checked><span><i class="fa-solid fa-video"></i><b>Video</b><small>Bisa pause &amp; atur menit</small></span></label><label class="jft-ann-mode-option"><input type="radio" name="announcement-media-mode" value="gif"><span><i class="fa-solid fa-repeat"></i><b>GIF</b><small>Autoplay tanpa kontrol</small></span></label></div></div><div id="announcement-file-preview" class="jft-ann-file-preview hidden"></div></div>`;
    }
    const sendBtn=mount.querySelector('#announcement-send');
    if(sendBtn && !sendBtn.dataset.bound){sendBtn.dataset.bound='1';sendBtn.addEventListener('click',sendAnnouncement)}
    const fileInput=mount.querySelector('#announcement-file-input');
    if(fileInput && !fileInput.dataset.bound){
      fileInput.dataset.bound='1';
      fileInput.addEventListener('change',e=>{
        const file=e.target.files?.[0]; const preview=mount.querySelector('#announcement-file-preview'); if(!preview)return;
        if(!file){preview.classList.add('hidden');preview.innerHTML='';return}
        const type=mediaTypeFromFile(file); const icon=type==='image'?'fa-image':type==='video'?'fa-video':type==='audio'?'fa-music':'fa-file';
        const modeWrap=mount.querySelector('#announcement-media-mode-wrap');
        const modeOptions=[...mount.querySelectorAll('label.jft-ann-mode-option')];
        if(type==='video'){ modeWrap?.classList.remove('hidden'); modeOptions.forEach(x=>x.classList.toggle('is-active',x.querySelector('input')?.checked)); } else { modeWrap?.classList.add('hidden'); }
        preview.classList.remove('hidden'); preview.innerHTML=`<span class="jft-ann-preview-icon"><i class="fa-solid ${icon}"></i></span><span class="min-w-0 flex-1"><strong>${esc(file.name)}</strong><small>${typeof formatBytes==='function'?formatBytes(file.size):Math.round(file.size/1024)+' KB'}${type==='video'?' · Pilih mode di atas':''}</small></span><button type="button" id="announcement-file-clear"><i class="fa-solid fa-xmark"></i></button>`;
        preview.querySelector('#announcement-file-clear')?.addEventListener('click',()=>{fileInput.value='';preview.classList.add('hidden');preview.innerHTML='';modeWrap?.classList.add('hidden');});
      });
    }
    mount.querySelectorAll('input[name="announcement-media-mode"]').forEach(input=>{
      if(input.dataset.boundMode)return; input.dataset.boundMode='1';
      input.addEventListener('change',()=>{
        mount.querySelectorAll('label.jft-ann-mode-option').forEach(label=>label.classList.toggle('is-active',label.querySelector('input')?.checked));
      });
    });
  }
}

function highlightMentions(){
  document.querySelectorAll('#chat-messages-container .chat-message-text').forEach(el=>{
    if(el.dataset.mentionsStyled)return;
    el.dataset.mentionsStyled='1';
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const text=node.nodeValue||'';if(!/@/.test(text))return;
      const frag=document.createDocumentFragment();let last=0;const re=/(^|\s)(@[A-Z0-9_\-\. ]{1,80})(?=\s|$|[.,!?])/gi;let m;
      while((m=re.exec(text))){const raw=m[2];const known=usersCache.some(u=>raw.slice(1).trim().toUpperCase()===u.name);if(!known)continue;frag.append(document.createTextNode(text.slice(last,m.index)+m[1]));const span=document.createElement('span');span.className='jft-mention';span.textContent=raw.trim();frag.append(span);last=m.index+m[1].length+raw.length;}
      if(last){frag.append(document.createTextNode(text.slice(last)));node.parentNode.replaceChild(frag,node)}
    });
  });
}

async function setupFeatures(){
  ensureAnnouncementUI();
  await loadChatUsers();
  await renderAnnouncementCenter();
  await refreshAnnouncementDot();
  await refreshChatDot();
  if(featureChannel||!window.supabaseClient)return;
  featureChannel=window.supabaseClient.channel('jft-chat-features-v6')
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_notifications',filter:`recipient_id=eq.${identity()}`},()=>{refreshChatDot();toast('Kamu ditag','Ada pesan baru yang menyebut kamu di Global Chat.');})
    .on('postgres_changes',{event:'*',schema:'public',table:'chat_announcements'},()=>{renderAnnouncementCenter();refreshAnnouncementDot();})
    .subscribe();
}

const oldToggle=window.toggleGlobalChat;
window.toggleGlobalChat=async function(){
  const wasHidden=document.getElementById('global-chat-modal')?.classList.contains('hidden');
  const result=oldToggle?await oldToggle.apply(this,arguments):undefined;
  if(wasHidden){await loadChatUsers();await markNotificationsRead();setTimeout(refreshChatDot,120);}
  return result;
};
const oldRender=window.renderMessages;
if(typeof oldRender==='function')window.renderMessages=function(messages){const r=oldRender.apply(this,arguments);highlightMentions();return r;};

document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{ensureAnnouncementUI();setupFeatures();},300);});
})();
