/* JFT Global Chat UX — mentions, notifications, announcements, stickers & rich links. */
(function(){
'use strict';
const DAY=24*60*60*1000;
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
async function hasUnreadNotifications(){
  if(!window.supabaseClient) return false;
  const [{data:n}, {data:a}]=await Promise.all([
    window.supabaseClient.from('chat_notifications').select('id').eq('recipient_id',identity()).is('read_at',null).limit(1),
    window.supabaseClient.from('announcement_reads').select('announcement_id').eq('reader_id',identity()).limit(100)
  ]);
  const readIds=new Set((a||[]).map(x=>String(x.announcement_id)));
  const now=new Date().toISOString();
  const {data:anns}=await window.supabaseClient.from('chat_announcements').select('id').gt('expires_at',now).limit(100);
  const unreadAnn=(anns||[]).some(x=>!readIds.has(String(x.id)));
  return !!(n?.length || unreadAnn);
}
async function refreshChatDot(){
  const dot=document.getElementById('chat-notification-dot'); if(!dot)return;
  const unread=await hasUnreadNotifications(); dot.classList.toggle('hidden',!unread);
  try{localStorage.setItem('jft_has_unread_tag',unread?'true':'false');}catch(_){ }
}

function announcementMarkup(item, unread){
  const admin=role()==='admin';
  return `<article class="jft-announcement-card ${unread?'is-unread':''}" data-announcement-id="${attr(item.id)}">
    <div class="jft-announcement-head"><div class="jft-announcement-icon"><i class="fa-solid fa-bullhorn"></i></div><div class="min-w-0 flex-1"><div class="jft-announcement-label">PENGUMUMAN ADMIN ${unread?'<span class="jft-unread-pill"><i class="fa-solid fa-envelope"></i> Belum dibuka</span>':''}</div><div class="jft-announcement-title">${esc(item.admin_name||'ADMIN')}</div></div><div class="jft-announcement-time">${new Date(item.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div></div>
    <div class="jft-announcement-message">${typeof linkifyText==='function'?linkifyText(item.message||''):esc(item.message||'')}</div>
    <div class="jft-announcement-foot"><span><i class="fa-regular fa-clock"></i> Berlaku 24 jam</span>${admin?`<button type="button" class="jft-announcement-delete" data-delete-ann="${attr(item.id)}"><i class="fa-solid fa-trash"></i> Hapus</button>`:''}</div>
  </article>`;
}

async function loadAnnouncements(markRead=false){
  const box=document.getElementById('chat-announcements'); if(!box||!window.supabaseClient)return;
  const now=new Date().toISOString();
  const {data,error}=await window.supabaseClient.from('chat_announcements').select('*').gt('expires_at',now).order('created_at',{ascending:false}).limit(20);
  if(error){console.warn('Pengumuman gagal dimuat:',error);box.classList.add('hidden');return;}
  announcementCache=data||[];
  if(!announcementCache.length){box.classList.add('hidden');box.innerHTML='';return;}
  const {data:reads}=await window.supabaseClient.from('announcement_reads').select('announcement_id').eq('reader_id',identity());
  const readSet=new Set((reads||[]).map(r=>String(r.announcement_id)));
  box.classList.remove('hidden');
  box.innerHTML=`<div class="jft-announcement-titlebar"><div><span class="jft-announcement-kicker">PUSAT INFORMASI</span><strong>Pengumuman</strong></div><span class="jft-announcement-count">${announcementCache.length}</span></div>${announcementCache.map(a=>announcementMarkup(a,!readSet.has(String(a.id)))).join('')}`;
  box.querySelectorAll('[data-delete-ann]').forEach(btn=>btn.addEventListener('click',()=>deleteAnnouncement(btn.dataset.deleteAnn)));
  if(markRead && role()!=='admin') setTimeout(()=>markAnnouncementsRead(),350);
}
async function markAnnouncementsRead(){
  if(!announcementCache.length||!window.supabaseClient)return;
  const rows=announcementCache.map(a=>({announcement_id:String(a.id),reader_id:identity(),read_at:new Date().toISOString()}));
  const {error}=await window.supabaseClient.from('announcement_reads').upsert(rows,{onConflict:'announcement_id,reader_id'});
  if(error) console.warn('Gagal menandai pengumuman dibaca:',error);
  document.querySelectorAll('.jft-unread-pill').forEach(x=>x.remove());
  document.querySelectorAll('.jft-announcement-card.is-unread').forEach(x=>x.classList.remove('is-unread'));
  refreshChatDot();
}
window.markAnnouncementsRead=markAnnouncementsRead;
async function sendAnnouncement(){
  if(role()!=='admin'){toast('Tidak diizinkan','Hanya admin yang bisa membuat pengumuman.',true);return;}
  const input=document.getElementById('announcement-input'); const text=String(input?.value||'').trim(); if(!text)return;
  const btn=document.getElementById('announcement-send'); if(btn)btn.disabled=true;
  const now=new Date(); const expires=new Date(now.getTime()+DAY);
  const {error}=await window.supabaseClient.from('chat_announcements').insert([{admin_id:String(localStorage.getItem('jft_user_id')||''),admin_name:(typeof getCurrentChatName==='function'?getCurrentChatName():'ADMIN'),message:text,expires_at:expires.toISOString()}]);
  if(btn)btn.disabled=false;
  if(error){toast('Pengumuman gagal',error.message,true);return;}
  input.value=''; toast('Pengumuman terkirim','Semua orang bisa melihatnya selama 24 jam.'); await loadAnnouncements();
}
window.sendAnnouncement=sendAnnouncement;
async function deleteAnnouncement(id){
  if(role()!=='admin')return;
  if(typeof showCustomConfirm==='function'){
    showCustomConfirm('Hapus pengumuman ini?',async()=>{await doDeleteAnnouncement(id)},'Hapus');
  }else if(confirm('Hapus pengumuman ini?')) await doDeleteAnnouncement(id);
}
async function doDeleteAnnouncement(id){
  const {error}=await window.supabaseClient.from('chat_announcements').delete().eq('id',id);
  if(error){toast('Gagal menghapus',error.message,true);return;}
  toast('Terhapus','Pengumuman berhasil dihapus.'); await loadAnnouncements();
}

function ensureAnnouncementUI(){
  const modal=document.getElementById('global-chat-modal'); if(!modal||document.getElementById('chat-announcements'))return;
  const messages=document.getElementById('chat-messages-container'); if(!messages)return;
  const box=document.createElement('div'); box.id='chat-announcements'; box.className='hidden';
  messages.parentNode.insertBefore(box,messages);
  if(role()==='admin'){
    const composer=document.createElement('div'); composer.id='admin-announcement-composer'; composer.innerHTML=`<div class="jft-announcement-compose"><div class="jft-compose-label"><i class="fa-solid fa-bullhorn"></i> Buat pengumuman</div><textarea id="announcement-input" maxlength="1200" placeholder="Tulis pengumuman untuk semua siswa..."></textarea><button type="button" id="announcement-send"><i class="fa-solid fa-paper-plane"></i> Terbitkan 24 jam</button></div>`;
    messages.parentNode.insertBefore(composer,messages);
    composer.querySelector('#announcement-send').addEventListener('click',sendAnnouncement);
  }
}

function highlightMentions(){
  document.querySelectorAll('#chat-messages-container .chat-message-text').forEach(el=>{
    if(el.dataset.mentionsStyled)return;
    el.dataset.mentionsStyled='1';
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const text=node.nodeValue||''; if(!/@/.test(text))return;
      const frag=document.createDocumentFragment(); let last=0; const re=/(^|\s)(@[A-Z0-9_\-\. ]{1,80})(?=\s|$|[.,!?])/gi; let m;
      while((m=re.exec(text))){
        const raw=m[2]; const known=usersCache.some(u=>raw.slice(1).trim().toUpperCase()===u.name);
        if(!known)continue;
        frag.append(document.createTextNode(text.slice(last,m.index)+m[1])); const span=document.createElement('span'); span.className='jft-mention'; span.textContent=raw.trim(); frag.append(span); last=m.index+m[1].length+raw.length;
      }
      if(last){frag.append(document.createTextNode(text.slice(last)));node.parentNode.replaceChild(frag,node);}
    });
  });
}

async function setupFeatures(){
  ensureAnnouncementUI();
  await loadChatUsers();
  await loadAnnouncements();
  await refreshChatDot();
  if(featureChannel||!window.supabaseClient)return;
  featureChannel=window.supabaseClient.channel('jft-chat-features')
    .on('postgres_changes',{event:'*',schema:'public',table:'chat_announcements'},()=>loadAnnouncements())
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_notifications',filter:`recipient_id=eq.${identity()}`},()=>{refreshChatDot();toast('Kamu ditag','Ada pesan baru yang menyebut kamu di Global Chat.');})
    .subscribe();
}

const oldToggle=window.toggleGlobalChat;
window.toggleGlobalChat=async function(){
  ensureAnnouncementUI();
  const wasHidden=document.getElementById('global-chat-modal')?.classList.contains('hidden');
  const result=oldToggle?await oldToggle.apply(this,arguments):undefined;
  if(wasHidden){ await setupFeatures(); await loadAnnouncements(true); await markNotificationsRead(); setTimeout(refreshChatDot,100); }
  return result;
};

const oldRender=window.renderMessages;
if(typeof oldRender==='function'){
  window.renderMessages=function(messages){ const r=oldRender.apply(this,arguments); highlightMentions(); return r; };
}

document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ensureAnnouncementUI();setupFeatures();},300); });
})();
