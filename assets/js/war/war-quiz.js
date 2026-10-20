const SUPABASE_URL='https://lnthciiomeppirzucqwu.supabase.co',SUPABASE_ANON_KEY='sb_publishable_1TYGD_KXkkxJEiFug566zQ_CjZfmUN-';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY), RULES={10:300,20:600,30:900,40:1200,50:1500,60:1800,70:2100,80:2400,90:2700,100:3000};
const SECTIONS={vocab:['文字と語彙','Script and Vocabulary'],grammar:['文法・表現','Grammar & Expressions'],listening:['聴解','Listening Comprehension'],reading:['読解','Reading Comprehension'],kanji:['漢字','Kanji']};
const EMOJIS=['😹','🗿','😋','🥰','🤪','🇯🇵','😠','😂','😭','🥲','🥳'];
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
 const requestedIds=Array.isArray(room.question_ids)?room.question_ids:[];
 if(room.quiz_mode==='kanji'){
   const response=await fetch('data/kanji-bank.json');if(!response.ok)throw new Error('Bank Kanji tidak ditemukan.');
   const baseBank=await response.json();
   const canonicalEntries=new Set(baseBank.map(x=>JSON.stringify([Number(x.chapter),x.kanji,x.kana,x.meaning])));
   const seenKanji=new Set();
   questions=requestedIds.filter(q=>{if(!q||typeof q!=='object'||q.type!=='kanji'||!canonicalEntries.has(JSON.stringify([Number(q.chapter),q.kanji,q.kana,q.meaning]))||!Array.isArray(q.options)||q.options.length!==4||!Number.isInteger(Number(q.answer))||Number(q.answer)<0||Number(q.answer)>=q.options.length)return false;const key=JSON.stringify([Number(q.chapter),String(q.kanji||'').normalize('NFKC'),String(q.kana||'').normalize('NFKC'),String(q.meaning||'').normalize('NFKC').toLowerCase()]);if(seenKanji.has(key))return false;seenKanji.add(key);return true;});
   questions=questions.map(q=>{const answerText=q.answer_mode==='romaji'?kanjiKanaToRomaji(q.kana):String(q.meaning||'').trim();const answer=q.options.findIndex(x=>String(x).normalize('NFKC').toLowerCase()===answerText.normalize('NFKC').toLowerCase());return {...q,section:'kanji',answer};});
   if(questions.some(q=>q.answer<0)){redirectWithToast('Daftar soal Kanji room tidak memiliki kunci yang valid. Minta host memulai War baru.');return}
 }else{
   if(!window.JFTQuestionBank)throw new Error('Modul bank soal belum dimuat.');bank=await window.JFTQuestionBank.load();
   const questionById=new Map(bank.map(q=>[String(q.id),q]));
   const resolved=requestedIds.map(id=>questionById.get(String(id))).filter(Boolean);
   // Jangan membuang soal hanya karena teksnya mirip/identik: bank bisa memiliki
   // soal dengan teks sama tetapi opsi/konteks berbeda. Validasi hanya ID yang hilang.
   questions=resolved;
 }
 if(!questions.length){redirectWithToast(room.quiz_mode==='kanji'?'Bank soal Kanji untuk room ini tidak valid. Minta host memulai ulang.':'Bank soal War tidak ditemukan.');return}
 if(questions.length!==Number(room.question_count)){
   console.error('Daftar soal War tidak valid.',{mode:room.quiz_mode,expected:room.question_count,received:requestedIds.length,unique:questions.length});
   redirectWithToast('Daftar soal room ini tidak valid. Minta host memulai War baru.','war.html');return;
 }
 document.getElementById('roomCodeTop').textContent=room.code;document.getElementById('quiz-progress-text').textContent=`Soal 1 / ${questions.length}`;
 const resumeKey=`jft_war_progress_${room.id}_${player.id}`;let saved=null;try{saved=JSON.parse(sessionStorage.getItem(resumeKey)||'null')}catch(_){}
 answers=new Array(questions.length).fill(null);startedAt=new Date(room.started_at).getTime();idx=0;maxReached=1;correct=0;
 if(saved&&saved.round===String(room.started_at||room.id)&&Array.isArray(saved.answers)&&saved.answers.length===questions.length){answers=saved.answers;idx=Math.max(0,Math.min(questions.length-1,Number(saved.idx)||0));maxReached=Math.max(idx+1,Number(saved.maxReached)||1);correct=answers.reduce((sum,a,i)=>sum+(a!==null&&a===questions[i]?.answer?1:0),0)}
 // Cegah tombol Back meninggalkan kuis; jika browser tetap direfresh, progres dipulihkan.
 history.pushState({warQuiz:true},'',location.href);window.addEventListener('popstate',()=>{history.pushState({warQuiz:true},'',location.href);toast('War belum selesai. Selesaikan soal terlebih dahulu.');});
 subscribe();renderQuestion();renderPlayers();tick();timerHandle=setInterval(tick,500);progressHandle=setInterval(pushProgress,2500);pushProgress();
}
function subscribe(){channel=sb.channel('jft-war-live-'+room.id);channel.on('postgres_changes',{event:'*',schema:'public',table:'jft_war_players',filter:'room_id=eq.'+room.id},payload=>{if(payload.eventType==='DELETE'&&payload.old?.id===player.id){redirectWithToast('Kamu dikeluarkan dari War.');return}renderPlayers()});channel.on('postgres_changes',{event:'*',schema:'public',table:'jft_war_rooms',filter:'id=eq.'+room.id},payload=>{if(payload.new){room=payload.new;if(room.status==='closed'){redirectWithToast('Room sudah ditutup.');}}});channel.on('broadcast',{event:'reaction'},({payload})=>showReaction(payload||{}));channel.subscribe();}
function tick(){if(finished)return;const elapsed=Math.floor((Date.now()-startedAt)/1000);document.getElementById('warTimer').textContent=fmt(elapsed);document.getElementById('quiz-timer').textContent=fmt(elapsed);}
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
  maxReached=Math.max(maxReached,idx+1);saveLocalProgress();
  document.getElementById('quiz-progress-text').textContent=`Soal ${idx+1} / ${questions.length}`;
  document.getElementById('quiz-progress-bar').style.width=`${((idx+1)/questions.length)*100}%`;
  const sec=SECTIONS[q.section];
  const levelText=room.quiz_mode==='kanji'?`Kanji ${String(room.kanji_level||'all').toUpperCase()}`:'';
  document.getElementById('quiz-section-badge').textContent=q.type==='kanji'?`${sec[0]} / ${levelText}`:(sec?`${sec[0]} / ${sec[1]}`:q.section);
  const instruction=document.getElementById('quiz-instruction');
  if(instruction)instruction.textContent=q.type==='kanji'?(q.answer_mode==='romaji'?'Pilih bacaan romaji yang paling tepat untuk kosakata berikut.':'Pilih arti bahasa Indonesia yang paling tepat untuk kanji berikut.'):(q.instruction||((q.section==='grammar'&&/（\s*　*）|\(\s*\)/.test(q.text||''))?'つぎの ぶんの （　　　）に なにを いれますか。':''));
  const questionEl=document.getElementById('quiz-question');
  const listeningAudioEnabled=localStorage.getItem('jft_listening_audio')!=='off';
  const questionForDisplay=q;
  questionEl.innerHTML=q.type==='kanji'?`<div class="text-center py-7"><div class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Kosakata Kanji</div><div class="japanese-text text-5xl sm:text-7xl font-black leading-tight">${esc(q.kanji||'')}</div><div id="kanjiHint" class="text-base font-bold text-slate-600 mt-3 hidden"></div><button type="button" id="kanjiHintToggle" class="mt-3 px-4 py-2 rounded-xl border-2 border-slate-900 bg-yellow-200 text-sm font-black shadow-[2px_2px_0_#181818]">${q.answer_mode==='romaji'?'Lihat arti':'Lihat hiragana'}</button><div class="text-xs text-slate-400 mt-4">Bab ${esc(q.chapter||'')}</div></div>`:(window.JFTQuestionBank?.renderQuestionMarkup?window.JFTQuestionBank.renderQuestionMarkup(questionForDisplay):`<div class="jft-question-text">${esc(q.text||'')}</div>`); 
  if(q.type==='kanji'){
    const hint=document.getElementById('kanjiHint'),toggle=document.getElementById('kanjiHintToggle');
    const hintText=q.answer_mode==='romaji'?String(q.meaning||''):`${String(q.kana||'')} · ${String(q.romaji||'')}`;
    toggle.onclick=()=>{const visible=hint.classList.toggle('hidden')===false;hint.textContent=visible?hintText:'';toggle.textContent=visible?'Sembunyikan':(q.answer_mode==='romaji'?'Lihat arti':'Lihat hiragana');};
  }
  questionEl.classList.remove('jft-question-enter');void questionEl.offsetWidth;questionEl.classList.add('jft-question-enter');
  const a=document.getElementById('btn-play-audio'),t=document.getElementById('btn-show-transcript'),fb=document.getElementById('audio-transcript-fallback');
  a.classList.add('hidden');t.classList.add('hidden');fb.classList.add('hidden');
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  if(q.audioText){
    fb.textContent=q.audioText;
    if(listeningAudioEnabled){a.classList.remove('hidden');}else{fb.classList.remove('hidden');}
    const playKey=String(q.id??idx),plays=Number(warAudioPlayCounts[playKey]||0);a.disabled=!listeningAudioEnabled||plays>=2;a.innerHTML=`<i class="fa-solid fa-volume-high"></i> Putar Audio (${plays}/2)`;
    a.onclick=async()=>{const count=Number(warAudioPlayCounts[playKey]||0);if(!listeningAudioEnabled||count>=2)return;warAudioPlayCounts[playKey]=count+1;a.innerHTML=`<i class="fa-solid fa-volume-high"></i> Putar Audio (${count+1}/2)`;a.disabled=count+1>=2;try{if(window.JFTSpeakDialogue)await window.JFTSpeakDialogue(q.audioText,{rate:.85});else{const u=new SpeechSynthesisUtterance(q.audioText);u.lang='ja-JP';u.rate=.85;speechSynthesis.speak(u)}}catch(err){console.warn('War listening TTS gagal; popup dinonaktifkan:',err)}};
  }
  const opts=document.getElementById('quiz-options');opts.innerHTML='';opts.classList.remove('jft-question-enter');void opts.offsetWidth;opts.classList.add('jft-question-enter');
  const sourceOptions=Array.isArray(q.options)?q.options:[];
  if(sourceOptions.length<2){
    opts.innerHTML='<div class="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-sm text-red-700">Opsi jawaban soal ini tidak tersedia. Muat ulang halaman atau minta host memulai War baru.</div>';
    toast('Opsi jawaban tidak tersedia untuk soal ini.');
    updateNav();return;
  }
  if(!Array.isArray(q._warOptions)||q._warOptions.length!==sourceOptions.length){q._warOptions=randomize(sourceOptions.map((t,i)=>({t,i})));}
  q._warOptions.forEach((o,n)=>{
    const label=document.createElement('label');label.className='option-label block';
    const optionText=q.type==='kanji'?esc(o.t):(window.JFTQuestionBank?.renderJapaneseText?window.JFTQuestionBank.renderJapaneseText(o.t):esc(o.t));
    label.innerHTML=`<input type="radio" name="warqo" value="${o.i}" class="option-input peer sr-only" ${answers[idx]===o.i?'checked':''}><div class="option-content flex items-center p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-all"><div class="radio-letter w-8 h-8 flex items-center justify-center rounded bg-slate-100 font-bold mr-3">${['A','B','C','D'][n]}</div><span class="text-lg ${q.type==='kanji'?'':'japanese-text'}">${optionText}</span></div>`;
    label.querySelector('input').onchange=()=>choose(o.i);opts.appendChild(label);
  });
  updateNav();
}
function saveLocalProgress(){if(!room||!player||finished)return;try{sessionStorage.setItem(`jft_war_progress_${room.id}_${player.id}`,JSON.stringify({round:String(room.started_at||room.id),answers,idx,maxReached,updatedAt:Date.now()}))}catch(_){}}
function choose(choice){
  answers[idx]=choice;saveLocalProgress();
  correct=answers.reduce((sum,a,i)=>sum+(a!==null&&a===questions[i]?.answer?1:0),0);
  updateNav();pushProgress();
}
function updateNav(){
  const prev=document.getElementById('btn-prev-question'),next=document.getElementById('btn-next-question');
  const prevSame=idx>0;
  prev.disabled=!prevSame;
  prev.className='bg-slate-200 text-slate-700 font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 border-2 border-slate-700 shadow-[3px_3px_0_#1f2937] '+(prev.disabled?'opacity-50 cursor-not-allowed':'hover:bg-slate-300');
  next.disabled=answers[idx]===null;
  next.innerHTML=idx===questions.length-1?'Selesai <i class="fa-solid fa-flag-checkered"></i>':'Selanjutnya <i class="fa-solid fa-angle-right"></i>';
  next.className='bg-brand-600 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 border-2 border-slate-700 shadow-[3px_3px_0_#1f2937] '+(next.disabled?'opacity-50 cursor-not-allowed':'hover:bg-brand-700');
}
function goPrevious(){
  if(document.getElementById('btn-prev-question').disabled)return;
  if(window.speechSynthesis)window.speechSynthesis.cancel();
  idx--;saveLocalProgress();renderQuestion();window.scrollTo(0,0);pushProgress();
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

Lanjut ke ${nextName}?`,()=>{idx=nextIdx;saveLocalProgress();renderQuestion();window.scrollTo(0,0);pushProgress()},'Lanjut');
    return;
  }
  idx=nextIdx;saveLocalProgress();renderQuestion();window.scrollTo(0,0);pushProgress();
}
document.getElementById('btn-prev-question').onclick=goPrevious;document.getElementById('btn-next-question').onclick=goNext;
async function pushProgress(){if(!player||finished)return;const elapsed=Math.floor((Date.now()-startedAt)/1000);const q=questions[idx];const answeredCount=answers.filter(v=>v!==null).length;await sb.from('jft_war_players').update({current_question:Math.max(maxReached,1),current_section:q?.section||null,elapsed_seconds:elapsed,status:'running',last_seen_at:new Date().toISOString()}).eq('id',player.id)}
function renderPlayers(){
 const grid=document.getElementById('playersGrid');if(!grid)return;
 sb.from('jft_war_players').select('id,player_name,current_question,current_section,elapsed_seconds,status,created_at').eq('room_id',room.id).then(({data,error})=>{
  if(error){console.warn('Leaderboard War gagal dimuat:',error);return}
  const ps=(data||[]).filter(p=>!['kicked','left'].includes(p.status)).sort((a,b)=>Number(b.current_question||0)-Number(a.current_question||0)||Number(a.elapsed_seconds||0)-Number(b.elapsed_seconds||0));
  grid.innerHTML=ps.map((p,i)=>{const q=Math.min(Number(p.current_question||0),room.question_count),sc=Number(p.score||0);return `<div class="monitor-row ${p.id===player.id?'me':''} rounded-xl border border-slate-200 p-3 bg-white"><div class="flex justify-between gap-2"><b class="text-sm truncate">#${i+1} ${esc(p.player_name)} ${p.id===player.id?'<span class="text-[9px] text-slate-400">(KAMU)</span>':''}</b><b class="text-xs">${p.status==='finished'?'Selesai':'Mengerjakan'}</b></div><div class="flex items-center justify-between mt-1"><span class="text-[10px] text-slate-500">Soal ${q}/${room.question_count} • ${fmt(p.elapsed_seconds||0)}</span><b class="text-xs text-slate-500">${p.status==='finished'?'Selesai':'Berlangsung'}</b></div><div class="text-[10px] text-slate-400 mt-1">${sectionName(p.current_section)}</div><div class="mini-progress mt-2"><div style="width:${room.question_count?q/room.question_count*100:0}%"></div></div></div>`}).join('')||'<div class="text-xs text-slate-400">Belum ada pemain.</div>'
 })
}
async function completeWar(){
  if(finished)return;
  finished=true;clearInterval(timerHandle);clearInterval(progressHandle);try{sessionStorage.removeItem(`jft_war_progress_${room.id}_${player.id}`)}catch(_){}
  const elapsed=Math.floor((Date.now()-startedAt)/1000),score=scoreOf(correct,questions.length),warRank=rank(score);
  const old=Number(localStorage.getItem('jft_war_total_points')||0),total=old+score;
  localStorage.setItem('jft_war_total_points',String(total));
  const reviewRows=questions.map((q,i)=>({question:q.text||q.question||q.prompt||'',prompt:q.prompt||'',kanji:q.kanji||'',kana:q.kana||'',romaji:q.romaji||'',meaning:q.meaning||'',chapter:q.chapter||'',section:q.section||'',options:Array.isArray(q.options)?q.options:[],selected:answers[i]===null?'Tidak dijawab':(q.options?.[answers[i]]??'Tidak dijawab'),answer:q.options?.[q.answer]??'',answerIndex:q.answer,isCorrect:answers[i]===q.answer,mode:q.answer_mode||''}));
  const reviewData={allRows:reviewRows,total:questions.length,mode:room.quiz_mode||'jft'};
  const completedAt=new Date().toISOString();
  const baseResult={current_question:room.question_count,current_section:questions.at(-1)?.section||null,elapsed_seconds:elapsed,correct,score,status:'finished',completed_at:completedAt,last_seen_at:completedAt};
  let {error:playerError}=await sb.from('jft_war_players').update({...baseResult,review_data:reviewData}).eq('id',player.id);
  if(playerError && /review_data|column/i.test(playerError.message||'')){
    console.warn('Kolom review_data belum tersedia; menyimpan hasil tanpa data koreksi.',playerError);
    ({error:playerError}=await sb.from('jft_war_players').update(baseResult).eq('id',player.id));
    if(!playerError)toast('Hasil tersimpan. Jalankan SQL review migration untuk koreksi bersama.');
  }
  if(playerError){finished=false;toast('Gagal menyimpan hasil War: '+(playerError.message||'periksa izin database'));return}
  try{
    const {data:all}=await sb.from('jft_war_players').select('id,status').eq('room_id',room.id).not('status','in','(kicked,left)');
    const active=(all||[]);
    if(active.length>=2 && active.every(p=>p.status==='finished')){
      await sb.from('jft_war_rooms').update({status:'waiting',started_at:null}).eq('id',room.id).eq('status','running');
    }
  }catch(e){console.warn('Gagal mengembalikan room ke waiting:',e)}
  sessionStorage.setItem('jft_war_result',JSON.stringify({roomId:room.id,playerId:player.id,score,correct,total:questions.length,elapsed,rank:warRank,warPoints:score,totalPoints:total}));
  const allRows=questions.map((q,i)=>({question:q.text||q.question||q.prompt||'',prompt:q.prompt||'',kanji:q.kanji||'',kana:q.kana||'',romaji:q.romaji||'',meaning:q.meaning||'',chapter:q.chapter||'',section:q.section||'',options:Array.isArray(q.options)?q.options:[],selected:answers[i]===null?'Tidak dijawab':(q.options?.[answers[i]]??'Tidak dijawab'),answer:q.options?.[q.answer]??'',answerIndex:q.answer,isCorrect:answers[i]===q.answer,mode:q.answer_mode||''}));
  sessionStorage.setItem('jft_war_review',JSON.stringify({allRows,total:questions.length,mode:room.quiz_mode||'jft'}));
  if(room.quiz_mode==='kanji')sessionStorage.setItem('jft_war_kanji_review',JSON.stringify({allRows,mistakes:allRows.filter(x=>!x.isCorrect),mode:room.kanji_answer_mode||'meaning',total:questions.length,wrong:allRows.filter(x=>!x.isCorrect).length}));
  else sessionStorage.removeItem('jft_war_kanji_review');
  location.href='war-result.html';
}
function showReaction(x){if(!x.id||lastReactionIds.has(x.id)||x.playerId===player.id)return;lastReactionIds.add(x.id);const d=document.createElement('div');d.className='reaction-pop reaction-out bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0_#181818] px-3 py-2 text-2xl font-bold';d.textContent=`${x.emoji||x.text||''} ${x.name||''}`;document.getElementById('reactionFeed').appendChild(d);setTimeout(()=>{d.remove();lastReactionIds.delete(x.id)},2000)}
const picker=document.getElementById('emojiPicker'),emojiChoices=document.getElementById('emojiChoices');EMOJIS.forEach(e=>{const b=document.createElement('button');b.className='w-9 h-9 rounded-lg hover:bg-slate-100 text-xl';b.textContent=e;b.onclick=()=>sendReaction(e);emojiChoices.appendChild(b)});document.getElementById('messageButton').onclick=()=>picker.classList.toggle('hidden');document.getElementById('sendReactionText').onclick=()=>{const input=document.getElementById('reactionText');const value=input.value.trim();if(value){sendReaction(value);input.value='';}};
async function sendReaction(e){if(!channel||Date.now()<reactionCooldownUntil){if(Date.now()<reactionCooldownUntil){const sec=Math.ceil((reactionCooldownUntil-Date.now())/1000);document.getElementById('messageButton').title=`Reaction cooldown ${sec} detik`;}return}reactionCooldownUntil=Date.now()+5000;picker.classList.add('hidden');await channel.send({type:'broadcast',event:'reaction',payload:{id:crypto.randomUUID(),...(/^[\p{Extended_Pictographic}\uFE0F\u200D]+$/u.test(e)?{emoji:e}:{text:e}),name:player.player_name,playerId:player.id,ts:Date.now()}});const b=document.getElementById('messageButton');b.classList.add('opacity-50');setTimeout(()=>b.classList.remove('opacity-50'),5000)}
window.addEventListener('beforeunload',()=>{if(!finished){saveLocalProgress();pushProgress()}});init().catch(error=>{console.error("Gagal memulai War Quiz:",error);redirectWithToast("Bank soal gagal dimuat. Muat ulang halaman.","war.html")});
