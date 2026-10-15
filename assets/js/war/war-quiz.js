const SUPABASE_URL='https://lnthciiomeppirzucqwu.supabase.co',SUPABASE_ANON_KEY='sb_publishable_1TYGD_KXkkxJEiFug566zQ_CjZfmUN-';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY), RULES={10:300,20:600,30:1800,50:3600};
const SECTIONS={vocab:['文字と語彙','Script and Vocabulary'],grammar:['会話と表現','Conversation and Expression'],listening:['聴解','Listening Comprehension'],reading:['読解','Reading Comprehension']};
const EMOJIS=['🔥','😹','😋','🤪','😲','🤓','😠','😂','😎','👏','💀','❤️'];
let session,room,player,bank=[],questions=[],idx=0,answers=[],startedAt=0,correct=0,channel,timerHandle,progressHandle,finished=false,answerLocked=false,lastReactionIds=new Set(),reactionCooldownUntil=0,maxReached=1;
const warAudioPlayCounts={};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const fmt=s=>`${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.max(0,s)%60).padStart(2,'0')}`;
const scoreOf=(c,t)=>t?Math.round(c/t*250):0;const rank=s=>s===250?'S':s>=200?'A':s>=150?'B':s>=100?'C':'D';
function toast(msg,duration=2200){const host=document.getElementById('warToastContainer');if(!host)return;const d=document.createElement('div');d.className='bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[3px_3px_0_#181818]';d.textContent=msg;host.appendChild(d);setTimeout(()=>d.remove(),duration)}
function redirectWithToast(msg,url='war.html'){toast(msg,1800);setTimeout(()=>{location.href=url},1800)}
function sectionName(s){return SECTIONS[s]?.[0]||s||'-'}
async function init(){
 const raw=sessionStorage.getItem('jft_war_session');if(!raw){location.href='war.html';return}try{session=JSON.parse(raw)}catch{location.href='war.html';return}
 const [{data:r,error:re},{data:p,error:pe}]=await Promise.all([sb.from('jft_war_rooms').select('*').eq('id',session.roomId).single(),sb.from('jft_war_players').select('*').eq('id',session.playerId).single()]);
 if(re||pe||!r||!p){redirectWithToast('Sesi War tidak ditemukan.');return} room=r;player=p;
 if(room.status==='waiting'){location.href='war.html';return}
 // Status 'finished' dari ronde sebelumnya boleh terbawa sesaat ke ronde baru.
 // Hanya anggap selesai jika completed_at memang terjadi pada ronde aktif.
 const roundStartedAt=room.started_at?new Date(room.started_at).getTime():0;
 const completedAt=p.completed_at?new Date(p.completed_at).getTime():0;
 const finishedThisRound=p.status==='finished' && (!roundStartedAt || (completedAt && completedAt>=roundStartedAt));
 if(room.status==='finished'||finishedThisRound){location.href='war-result.html';return}
 if(!window.JFTQuestionBank)throw new Error('Modul bank soal belum dimuat.');bank=await window.JFTQuestionBank.load();questions=(room.question_ids||[]).map(id=>bank.find(q=>String(q.id)===String(id))).filter(Boolean);
 if(!questions.length){redirectWithToast('Bank soal War tidak ditemukan.');return}
 document.getElementById('roomCodeTop').textContent=room.code;document.getElementById('quiz-progress-text').textContent=`Soal 1 / ${questions.length}`;
 answers=new Array(questions.length).fill(null);startedAt=new Date(room.started_at).getTime();idx=0;maxReached=1;correct=0;
 subscribe();renderQuestion();renderPlayers();tick();timerHandle=setInterval(tick,500);progressHandle=setInterval(pushProgress,2500);pushProgress();
}
function subscribe(){channel=sb.channel('jft-war-live-'+room.id);channel.on('postgres_changes',{event:'*',schema:'public',table:'jft_war_players',filter:'room_id=eq.'+room.id},payload=>{if(payload.eventType==='DELETE'&&payload.old?.id===player.id){redirectWithToast('Kamu dikeluarkan dari War.');return}renderPlayers()});channel.on('postgres_changes',{event:'*',schema:'public',table:'jft_war_rooms',filter:'id=eq.'+room.id},payload=>{if(payload.new){room=payload.new;if(room.status==='closed'){redirectWithToast('Room sudah ditutup.');}}});channel.on('broadcast',{event:'reaction'},({payload})=>showReaction(payload||{}));channel.subscribe();}
function tick(){if(finished)return;const elapsed=Math.floor((Date.now()-startedAt)/1000);document.getElementById('warTimer').textContent=fmt(elapsed);document.getElementById('quiz-timer').textContent=fmt(elapsed);document.getElementById('myPoints').textContent=localStorage.getItem('jft_war_total_points')||'0';}
let confirmAction=null;
function showWarConfirm(message,onOk,okText='Lanjut'){
  const modal=document.getElementById('war-confirm-modal'),box=document.getElementById('war-confirm-box'),msg=document.getElementById('war-confirm-msg'),ok=document.getElementById('war-confirm-ok');
  if(!modal||!box||!msg||!ok){onOk?.();return}
  confirmAction=typeof onOk==='function'?onOk:null;msg.textContent=message;ok.textContent=okText;modal.classList.remove('hidden');modal.classList.add('flex');requestAnimationFrame(()=>{box.classList.remove('scale-95','opacity-0');box.classList.add('scale-100','opacity-100')});
}
function hideWarConfirm(){
  const modal=document.getElementById('war-confirm-modal'),box=document.getElementById('war-confirm-box');
  if(!modal)return;box?.classList.add('scale-95','opacity-0');setTimeout(()=>{modal.classList.add('hidden');modal.classList.remove('flex');confirmAction=null},120);
}
document.getElementById('war-confirm-ok').onclick=()=>{const fn=confirmAction;hideWarConfirm();fn?.()};
// Fisher-Yates shuffle: helper ini wajib tersedia sebelum renderQuestion dipanggil.
function randomize(items){return window.JFTQuestionBank ? window.JFTQuestionBank.shuffle(items) : (Array.isArray(items)?items.slice():[]);}

function renderQuestion(){
  const q=questions[idx];
  // Simpan progres tertinggi yang sudah dicapai agar monitor lawan ikut bergerak.
  maxReached=Math.max(maxReached,idx+1);
  document.getElementById('quiz-progress-text').textContent=`Soal ${idx+1} / ${questions.length}`;
  document.getElementById('quiz-progress-bar').style.width=`${((idx+1)/questions.length)*100}%`;
  const sec=SECTIONS[q.section];
  document.getElementById('quiz-section-badge').textContent=sec?`${sec[0]} / ${sec[1]}`:q.section;
  document.getElementById('quiz-question').innerHTML=window.JFTQuestionBank?.renderQuestionMarkup?window.JFTQuestionBank.renderQuestionMarkup(q):`<div class="jft-question-text">${esc(q.text||'')}</div>`;
  const a=document.getElementById('btn-play-audio'),t=document.getElementById('btn-show-transcript'),fb=document.getElementById('audio-transcript-fallback');
  a.classList.add('hidden');t.classList.add('hidden');fb.classList.add('hidden');
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  if(q.audioText){
    a.classList.remove('hidden');t.classList.remove('hidden');fb.textContent=q.audioText;t.onclick=()=>{fb.classList.remove('hidden');t.classList.add('hidden')};
    const playKey=String(q.id??idx),plays=Number(warAudioPlayCounts[playKey]||0);a.disabled=plays>=2;a.innerHTML=`<i class="fa-solid fa-volume-high"></i> Putar Audio (${plays}/2)`;
    a.onclick=async()=>{const count=Number(warAudioPlayCounts[playKey]||0);if(count>=2)return;warAudioPlayCounts[playKey]=count+1;a.innerHTML=`<i class="fa-solid fa-volume-high"></i> Putar Audio (${count+1}/2)`;a.disabled=count+1>=2;try{if(window.JFTSpeakDialogue)await window.JFTSpeakDialogue(q.audioText,{rate:.85});else{const u=new SpeechSynthesisUtterance(q.audioText);u.lang='ja-JP';u.rate=.85;speechSynthesis.speak(u)}}catch(err){console.warn('War listening TTS gagal:',err);toast('Audio tidak tersedia di perangkat ini.')}};
  }
  const opts=document.getElementById('quiz-options');opts.innerHTML='';
  const sourceOptions=Array.isArray(q.options)?q.options:[];
  if(sourceOptions.length<2){
    opts.innerHTML='<div class="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700">Opsi jawaban soal ini tidak tersedia. Muat ulang halaman atau minta host memulai War baru.</div>';
    toast('Opsi jawaban tidak tersedia untuk soal ini.');
    updateNav();return;
  }
  if(!Array.isArray(q._warOptions)||q._warOptions.length!==sourceOptions.length){q._warOptions=randomize(sourceOptions.map((t,i)=>({t,i})));}
  q._warOptions.forEach((o,n)=>{
    const label=document.createElement('label');label.className='option-label block';
    label.innerHTML=`<input type="radio" name="warqo" value="${o.i}" class="option-input peer sr-only" ${answers[idx]===o.i?'checked':''}><div class="option-content flex items-center p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-all"><div class="radio-letter w-8 h-8 flex items-center justify-center rounded bg-slate-100 font-bold mr-3">${['A','B','C','D'][n]}</div><span class="text-lg japanese-text">${esc(o.t)}</span></div>`;
    label.querySelector('input').onchange=()=>choose(o.i);opts.appendChild(label);
  });
  updateNav();
}
function choose(choice){
  answers[idx]=choice;
  correct=answers.reduce((sum,a,i)=>sum+(a!==null&&a===questions[i]?.answer?1:0),0);
  updateNav();pushProgress();
}
function updateNav(){
  const prev=document.getElementById('btn-prev-question'),next=document.getElementById('btn-next-question');
  const prevSame=idx>0&&questions[idx-1]?.section===questions[idx]?.section;
  prev.disabled=!prevSame;
  prev.className='bg-slate-200 text-slate-700 font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 border-2 border-slate-700 shadow-[3px_3px_0_#1f2937] '+(prev.disabled?'opacity-50 cursor-not-allowed':'hover:bg-slate-300');
  next.disabled=answers[idx]===null;
  next.innerHTML=idx===questions.length-1?'Selesai <i class="fa-solid fa-flag-checkered"></i>':'Selanjutnya <i class="fa-solid fa-angle-right"></i>';
  next.className='bg-brand-600 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 border-2 border-slate-700 shadow-[3px_3px_0_#1f2937] '+(next.disabled?'opacity-50 cursor-not-allowed':'hover:bg-brand-700');
}
function goPrevious(){
  if(document.getElementById('btn-prev-question').disabled)return;
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  idx--;renderQuestion();window.scrollTo(0,0);pushProgress();
}
function goNext(){
  if(document.getElementById('btn-next-question').disabled)return;
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  const currentSection=questions[idx]?.section;
  const nextIdx=idx+1;
  if(nextIdx>=questions.length){completeWar();return}
  const nextSection=questions[nextIdx]?.section;
  if(nextSection!==currentSection){
    const currentName=SECTIONS[currentSection]?`${SECTIONS[currentSection][0]} / ${SECTIONS[currentSection][1]}`:currentSection;
    const nextName=SECTIONS[nextSection]?`${SECTIONS[nextSection][0]} / ${SECTIONS[nextSection][1]}`:nextSection;
    showWarConfirm(`Sesi ${currentName} sudah selesai.

Lanjut ke ${nextName}?`,()=>{idx=nextIdx;renderQuestion();window.scrollTo(0,0);pushProgress()},'Lanjut');
    return;
  }
  idx=nextIdx;renderQuestion();window.scrollTo(0,0);pushProgress();
}
document.getElementById('btn-prev-question').onclick=goPrevious;document.getElementById('btn-next-question').onclick=goNext;
async function pushProgress(){if(!player||finished)return;const elapsed=Math.floor((Date.now()-startedAt)/1000);const q=questions[idx];const answeredCount=answers.filter(v=>v!==null).length;await sb.from('jft_war_players').update({current_question:Math.max(maxReached,1),current_section:q?.section||null,elapsed_seconds:elapsed,correct,score:scoreOf(correct,answeredCount),status:'running',last_seen_at:new Date().toISOString()}).eq('id',player.id)}
function renderPlayers(){const grid=document.getElementById('playersGrid');if(!grid)return;sb.from('jft_war_players').select('*').eq('room_id',room.id).order('created_at').then(({data})=>{const ps=(data||[]).sort((a,b)=>Number(b.score||0)-Number(a.score||0)||Number(b.correct||0)-Number(a.correct||0));grid.innerHTML=ps.map((p,i)=>{const q=Math.min(Number(p.current_question||0),room.question_count);const sc=Number(p.score||0);return `<div class="monitor-row ${p.id===player.id?'me':''} rounded-xl border border-slate-200 p-3 bg-white"><div class="flex justify-between gap-2"><b class="text-sm truncate">#${i+1} ${esc(p.player_name)} ${p.id===player.id?'<span class="text-[9px] text-slate-400">(KAMU)</span>':''}</b><b class="text-xs">${rank(sc)} • ${sc}/250</b></div><div class="flex justify-between text-[10px] text-slate-500 mt-1"><span>Soal ${q}/${room.question_count}</span><span>${fmt(p.elapsed_seconds||0)}</span></div><div class="text-[10px] text-slate-400 mt-1">${sectionName(p.current_section)} • ${p.status==='finished'?'Selesai':'Mengerjakan'}</div><div class="mini-progress mt-2"><div style="width:${room.question_count?q/room.question_count*100:0}%"></div></div></div>`}).join('')})}
async function completeWar(){
  if(finished)return;
  finished=true;clearInterval(timerHandle);clearInterval(progressHandle);
  const elapsed=Math.floor((Date.now()-startedAt)/1000),score=scoreOf(correct,questions.length),warRank=rank(score);
  const old=Number(localStorage.getItem('jft_war_total_points')||0),total=old+score;
  localStorage.setItem('jft_war_total_points',String(total));
  const {error:playerError}=await sb.from('jft_war_players').update({current_question:room.question_count,current_section:questions.at(-1)?.section||null,elapsed_seconds:elapsed,correct,score,status:'finished',completed_at:new Date().toISOString(),last_seen_at:new Date().toISOString()}).eq('id',player.id);
  if(playerError){finished=false;toast('Gagal menyimpan hasil War. Coba lagi.');return}
  try{
    const {data:all}=await sb.from('jft_war_players').select('id,status').eq('room_id',room.id).not('status','in','(kicked,left)');
    const active=(all||[]);
    if(active.length>=2 && active.every(p=>p.status==='finished')){
      await sb.from('jft_war_rooms').update({status:'waiting',started_at:null}).eq('id',room.id).eq('status','running');
    }
  }catch(e){console.warn('Gagal mengembalikan room ke waiting:',e)}
  sessionStorage.setItem('jft_war_result',JSON.stringify({roomId:room.id,playerId:player.id,score,correct,total:questions.length,elapsed,rank:warRank,warPoints:score,totalPoints:total}));
  location.href='war-result.html';
}
function showReaction(x){if(!x.id||lastReactionIds.has(x.id)||x.playerId===player.id)return;lastReactionIds.add(x.id);const d=document.createElement('div');d.className='reaction-pop reaction-out bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0_#181818] px-3 py-2 text-2xl font-bold';d.textContent=`${x.emoji} ${x.name||''}`;document.getElementById('reactionFeed').appendChild(d);setTimeout(()=>{d.remove();lastReactionIds.delete(x.id)},2000)}
const picker=document.getElementById('emojiPicker');EMOJIS.forEach(e=>{const b=document.createElement('button');b.className='w-9 h-9 rounded-lg hover:bg-slate-100 text-xl';b.textContent=e;b.onclick=()=>sendReaction(e);picker.appendChild(b)});document.getElementById('messageButton').onclick=()=>picker.classList.toggle('hidden');
async function sendReaction(e){if(!channel||Date.now()<reactionCooldownUntil){if(Date.now()<reactionCooldownUntil){const sec=Math.ceil((reactionCooldownUntil-Date.now())/1000);document.getElementById('messageButton').title=`Reaction cooldown ${sec} detik`;}return}reactionCooldownUntil=Date.now()+5000;picker.classList.add('hidden');await channel.send({type:'broadcast',event:'reaction',payload:{id:crypto.randomUUID(),emoji:e,name:player.player_name,playerId:player.id,ts:Date.now()}});const b=document.getElementById('messageButton');b.classList.add('opacity-50');setTimeout(()=>b.classList.remove('opacity-50'),5000)}
window.addEventListener('beforeunload',()=>{if(!finished)pushProgress()});init().catch(error=>{console.error("Gagal memulai War Quiz:",error);redirectWithToast("Bank soal gagal dimuat. Muat ulang halaman.","war.html")});
