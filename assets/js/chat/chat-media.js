/* Global Chat Media extension. Depends on app-legacy.js + resume-router.js. */
(function modularChatMedia(){
const CHAT_BUCKET = 'chat-media';
    const MAX_CHAT_FILE_BYTES = 25 * 1024 * 1024;
    const MIME_BY_EXT = {
        html:'text/html', htm:'text/html', css:'text/css', js:'text/javascript', mjs:'text/javascript', cjs:'text/javascript',
        json:'application/json', map:'application/json', xml:'application/xml', csv:'text/csv', txt:'text/plain', md:'text/markdown',
        pdf:'application/pdf', zip:'application/zip', rar:'application/vnd.rar', '7z':'application/x-7z-compressed', gz:'application/gzip',
        tar:'application/x-tar', wasm:'application/wasm',
        doc:'application/msword', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls:'application/vnd.ms-excel', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ppt:'application/vnd.ms-powerpoint', pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        odt:'application/vnd.oasis.opendocument.text', ods:'application/vnd.oasis.opendocument.spreadsheet', odp:'application/vnd.oasis.opendocument.presentation',
        png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', gif:'image/gif', webp:'image/webp', svg:'image/svg+xml', ico:'image/x-icon',
        mp4:'video/mp4', webm:'video/webm', mov:'video/quicktime', mkv:'video/x-matroska', avi:'video/x-msvideo',
        mp3:'audio/mpeg', wav:'audio/wav', ogg:'audio/ogg', m4a:'audio/mp4', flac:'audio/flac'
    };

    function getChatFileMime(file){
        const reported=String(file?.type||'').trim().toLowerCase();
        if(reported) return reported;
        const name=String(file?.name||'');
        const ext=(name.includes('.') ? name.split('.').pop() : '').toLowerCase();
        return MIME_BY_EXT[ext] || 'application/octet-stream';
    }
    let selectedChatFile = null;
    let recordedVoiceBlob = null;
    let voiceRecorder = null;
    let voiceChunks = [];
    let voiceStartedAt = 0;
    let voiceTimer = null;

    function chatFileInput(){ return document.getElementById('chat-file-input'); }
    function setUploadStatus(text, pct){
        const box=document.getElementById('chat-upload-progress');
        const label=document.getElementById('chat-upload-progress-text');
        const bar=document.getElementById('chat-upload-progress-bar');
        if(!box) return;
        box.classList.remove('hidden'); if(label) label.textContent=text||''; if(bar) bar.style.width=`${Math.max(0,Math.min(100,Number(pct)||0))}%`;
        if(pct>=100) setTimeout(()=>box.classList.add('hidden'),700);
    }
    function clearChatAttachment(){
        selectedChatFile=null; recordedVoiceBlob=null;
        const fi=chatFileInput(); if(fi) fi.value='';
        const preview=document.getElementById('chat-attachment-preview'); if(preview){ preview.classList.add('hidden'); preview.innerHTML=''; }
    }
    function showAttachmentPreview(file, kind){
        const preview=document.getElementById('chat-attachment-preview'); if(!preview) return;
        const label=kind==='voice'?'Voice note':`${file.name||'File'}`;
        preview.classList.remove('hidden'); preview.innerHTML=`<div class="flex items-center gap-2 min-w-0"><span class="shrink-0 w-8 h-8 rounded-lg border-[2px] border-[#181818] bg-white flex items-center justify-center"><i class="fa-solid ${kind==='voice'?'fa-microphone':file.type?.startsWith('image/')?'fa-image':file.type?.startsWith('video/')?'fa-video':file.type?.startsWith('audio/')?'fa-music':'fa-file'}"></i></span><div class="min-w-0 flex-1"><div class="font-black truncate">${escapeHtml(label)}</div><div class="text-[9px] text-slate-500">${formatBytes(file.size||0)}</div></div><button type="button" onclick="clearChatAttachment()" class="shrink-0 text-rose-600 font-black"><i class="fa-solid fa-xmark"></i></button></div>`;
    }
    window.clearChatAttachment=clearChatAttachment;

    window.handleChatFileSelected=function(e){
        const file=e.target.files?.[0]; if(!file) return;
        if(file.size>MAX_CHAT_FILE_BYTES){ showToast('File terlalu besar', 'Maksimal 25 MB per file.', true); e.target.value=''; return; }
        selectedChatFile=file; recordedVoiceBlob=null; showAttachmentPreview(file,'file');
    };

    window.toggleChatFilePicker=function(){ const fi=chatFileInput(); if(fi) fi.click(); };

    window.startVoiceRecording=async function(){
        if(voiceRecorder){ voiceRecorder.stop(); return; }
        if(!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){ showToast('Voice Note','Browser ini tidak mendukung perekaman suara.',true); return; }
        try{
            const stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true,sampleRate:48000}});
            voiceChunks=[]; voiceStartedAt=Date.now(); recordedVoiceBlob=null; selectedChatFile=null;
            const preferredMime=['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus'].find(t=>window.MediaRecorder.isTypeSupported?.(t));
            voiceRecorder=new MediaRecorder(stream, preferredMime ? {mimeType:preferredMime,audioBitsPerSecond:128000} : {audioBitsPerSecond:128000});
            voiceRecorder.ondataavailable=e=>{ if(e.data?.size) voiceChunks.push(e.data); };
            voiceRecorder.onstop=()=>{
                stream.getTracks().forEach(t=>t.stop());
                const mime=voiceRecorder?.mimeType || preferredMime || 'audio/webm';
                recordedVoiceBlob=new Blob(voiceChunks,{type:mime});
                const minutes=Math.floor((Date.now()-voiceStartedAt)/60000); const seconds=Math.floor(((Date.now()-voiceStartedAt)/1000)%60);
                const fakeFile={name:`voice-note-${Date.now()}.webm`,size:recordedVoiceBlob.size,type:mime};
                showAttachmentPreview(fakeFile,'voice');
                voiceRecorder=null; clearInterval(voiceTimer); voiceTimer=null;
                const btn=document.getElementById('chat-record-btn'); if(btn){btn.innerHTML='<i class="fa-solid fa-microphone"></i>';btn.classList.remove('bg-rose-300');}
                const status=document.getElementById('chat-record-status'); if(status) status.textContent=`Rekaman ${minutes}:${String(seconds).padStart(2,'0')}`;
            };
            voiceRecorder.start();
            const btn=document.getElementById('chat-record-btn'); if(btn){btn.innerHTML='<i class="fa-solid fa-stop"></i>';btn.classList.add('bg-rose-300');}
            const status=document.getElementById('chat-record-status'); if(status) status.textContent='Merekam 0:00';
            voiceTimer=setInterval(()=>{const s=Math.floor((Date.now()-voiceStartedAt)/1000); if(status) status.textContent=`Merekam ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;},500);
        }catch(e){ console.error(e); showToast('Voice Note','Izin mikrofon tidak diberikan atau tidak tersedia.',true); }
    };

    function formatBytes(n){
        const x=Number(n)||0; if(x<1024) return `${x} B`; if(x<1024**2) return `${(x/1024).toFixed(1)} KB`; if(x<1024**3) return `${(x/1024**2).toFixed(1)} MB`; return `${(x/1024**3).toFixed(1)} GB`;
    }
    window.formatBytes=formatBytes;

    async function uploadChatFile(file, options={}){
        const contentType=getChatFileMime(file);
        const subfolder=String(options?.subfolder||'').replace(/[^a-zA-Z0-9_-]+/g,'').slice(0,40);

        const userId=localStorage.getItem('jft_user_id')||'guest'; const deviceId=getOrCreateDeviceId();
        const safeName=String(file.name||'file').replace(/[^a-zA-Z0-9._-]+/g,'_').slice(-120);
        const baseFolder=subfolder?`chat/${subfolder}`:`chat/${userId}/${deviceId}`;
        const path=`${baseFolder}/${userId}-${deviceId}-${Date.now()}-${Math.random().toString(36).slice(2,8)}-${safeName}`;
        setUploadStatus('Mengunggah 0%',0);
        if(file.size>6*1024*1024 && window.tus && !/^text\/(html|css|javascript)|application\/(json|xml)$/i.test(contentType)){
            try{
                const projectId=(SUPABASE_URL.match(/^https?:\/\/([^.]+)\.supabase\.co/i)||[])[1];
                const storageEndpoint=projectId ? `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable` : `${SUPABASE_URL}/storage/v1/upload/resumable`;
                const result=await new Promise((resolve,reject)=>{
                    const upload=new tus.Upload(file,{endpoint:storageEndpoint,retryDelays:[0,3000,5000,10000,20000],headers:{authorization:`Bearer ${SUPABASE_ANON_KEY}`,apikey:SUPABASE_ANON_KEY},uploadDataDuringCreation:true,removeFingerprintOnSuccess:true,chunkSize:6*1024*1024,metadata:{bucketName:CHAT_BUCKET,objectName:path,contentType,cacheControl:'3600'},onError:reject,onProgress:(bytes,total)=>setUploadStatus(`Mengunggah ${Math.round(bytes/total*100)}%`,bytes/total*100),onSuccess:()=>resolve(true)});
                    upload.findPreviousUploads().then(prev=>{if(prev.length) upload.resumeFromPreviousUpload(prev[0]); upload.start();}).catch(reject);
                });
                if(!result) throw new Error('Upload TUS gagal.');
                const publicUrl=window.supabaseClient.storage.from(CHAT_BUCKET).getPublicUrl(path).data.publicUrl;
                setUploadStatus('Selesai',100); return {path,publicUrl};
            }catch(e){ console.warn('TUS upload gagal, fallback ke standard upload:',e); }
        }
        let result=await window.supabaseClient.storage.from(CHAT_BUCKET).upload(path,file,{cacheControl:'3600',contentType,upsert:false});
        if(result.error && contentType !== 'application/octet-stream'){
            console.warn('Upload dengan MIME spesifik gagal, mencoba application/octet-stream:', result.error);
            result=await window.supabaseClient.storage.from(CHAT_BUCKET).upload(path,file,{cacheControl:'3600',contentType:'application/octet-stream',upsert:false});
        }
        if(result.error){
            const e=new Error(result.error.message || 'Upload file gagal.');
            e.statusCode=result.error.statusCode; e.storageError=result.error;
            throw e;
        }
        const publicUrl=window.supabaseClient.storage.from(CHAT_BUCKET).getPublicUrl(path).data.publicUrl;
        setUploadStatus('Selesai',100);
        return {path,publicUrl,mime_type:contentType};
    }
    window.uploadChatFile=uploadChatFile;

    function linkifyText(text){
        const raw=String(text||'');
        if(!raw) return '';
        const urlRe=/(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;
        let out=''; let last=0; let match;
        while((match=urlRe.exec(raw))){
            const before=raw.slice(last,match.index);
            out+=escapeHtml(before);
            let display=match[0];
            let trailing='';
            const trailingMatch=display.match(/[),.!?;:]+$/);
            if(trailingMatch){ trailing=trailingMatch[0]; display=display.slice(0,-trailing.length); }
            const href=display.toLowerCase().startsWith('www.')?`https://${display}`:display;
            const safeHref=escapeAttr(href);
            const safeDisplay=escapeHtml(display);
            let parsedUrl=null; try{parsedUrl=new URL(href);}catch(_){ }
            const isJftSite=parsedUrl && parsedUrl.hostname.toLowerCase()==='jft.shuraa.web.id';
            const isTikTok=parsedUrl && /(^|\.)tiktok\.com$/i.test(parsedUrl.hostname.toLowerCase());
            const isTikTokShort=parsedUrl && /^(vt\.tiktok(?:\.com)?)$/i.test(parsedUrl.hostname.toLowerCase());
            if(isJftSite){
                out+=`<span class="jft-site-link-card"><span class="jft-site-link-icon"><i class="fa-solid fa-graduation-cap"></i></span><span class="jft-site-link-body"><strong>JFT-Basic Shuraa</strong><small>jft.shuraa.web.id</small></span><a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="jft-site-link-open"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka</a><button type="button" class="jft-site-link-copy" data-copy-link="${safeHref}" title="Salin link"><i class="fa-regular fa-copy"></i></button></span>${escapeHtml(trailing)}`;
            }else if(isTikTok || isTikTokShort){
                out+=`<span class="jft-tiktok-link-card"><span class="jft-tiktok-link-icon"><i class="fa-brands fa-tiktok"></i></span><span class="jft-tiktok-link-body"><strong>TikTok</strong><small>${safeDisplay}</small></span><button type="button" class="jft-tiktok-copy" data-copy-link="${safeHref}" title="Salin link"><i class="fa-regular fa-copy"></i></button><a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="jft-tiktok-open"><i class="fa-solid fa-play"></i> Buka</a></span>${escapeHtml(trailing)}`;
            }else{
                out+=`<span class="chat-link-wrap inline-flex max-w-full items-center gap-1 align-middle"><a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="chat-link underline font-bold break-all">${safeDisplay}</a><button type="button" class="chat-link-copy shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md border border-[#181818] bg-white hover:bg-slate-100" data-copy-link="${safeHref}" title="Salin link" aria-label="Salin link"><i class="fa-regular fa-copy text-[10px]"></i></button><a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="chat-link-open shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md border border-[#181818] bg-[#ffe45c]" title="Buka link" aria-label="Buka link"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i></a></span>${escapeHtml(trailing)}`;
            }
            last=urlRe.lastIndex;
        }
        out+=escapeHtml(raw.slice(last));
        return out.replace(/\n/g,'<br>');
    }
    window.jftLinkifyText=linkifyText;

    async function copyLink(url){
        try{
            await navigator.clipboard.writeText(url);
            if(typeof showToast==='function') showToast('Link disalin','Link sudah disalin ke clipboard.');
        }catch(e){
            const ta=document.createElement('textarea'); ta.value=url; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
            try{document.execCommand('copy'); if(typeof showToast==='function') showToast('Link disalin','Link sudah disalin ke clipboard.');}catch(_){ if(typeof showToast==='function') showToast('Gagal menyalin','Tidak bisa mengakses clipboard.',true); }
            ta.remove();
        }
    }
    window.copyChatLink=copyLink;

    async function deleteChatStoragePaths(paths){
        const unique=[...new Set((Array.isArray(paths)?paths:[paths]).map(v=>String(v||'').trim()).filter(v=>v.startsWith('chat/')))];
        if(!unique.length) return {error:null, deleted:[]};
        const deleted=[];
        for(let i=0;i<unique.length;i+=1000){
            const batch=unique.slice(i,i+1000);
            const {data,error}=await window.supabaseClient.storage.from(CHAT_BUCKET).remove(batch);
            if(error) return {error, deleted};
            deleted.push(...batch);
        }
        return {error:null, deleted};
    }
    window.deleteChatStoragePaths=deleteChatStoragePaths;

    async function getChatFilePathsForRows(rows){
        return (Array.isArray(rows)?rows:[]).map(row=>String(row?.file_path||'').trim()).filter(Boolean);
    }

    function mediaHTML(msg){
        const type=String(msg.message_type||'text'); const url=String(msg.file_url||''); const name=escapeHtml(msg.file_name||'File'); const mime=String(msg.mime_type||'');
        if(!url || type==='text') return '';
        const linkButtons=`<div class="flex items-center gap-1 mt-2"><a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-[2px] border-[#181818] bg-[#ffe45c] text-[10px] font-black"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka</a><button type="button" onclick="copyChatLink('${escapeAttr(url)}')" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-[2px] border-[#181818] bg-white text-[10px] font-black"><i class="fa-regular fa-copy"></i> Salin link</button></div>`;
        if(type==='image') return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer" class="block"><img src="${escapeAttr(url)}" alt="Gambar" loading="lazy" class="max-w-full rounded-xl border-[2px] border-[#181818] max-h-72 object-cover"></a>${linkButtons}`;
        if(type==='video') return `<video controls preload="metadata" class="max-w-full rounded-xl border-[2px] border-[#181818] max-h-72"><source src="${escapeAttr(url)}" type="${escapeAttr(mime)}"></video>${linkButtons}`;
        if(type==='voice' || type==='audio') {
            const fallbackDuration=Number(msg.duration_seconds)||0;
            const isVoice=type==='voice';
            const mediaLabel=isVoice?'Voice note':'Audio';
            const mediaIcon=isVoice?'fa-microphone':'fa-music';
            const playLabel=isVoice?'Putar voice note':'Putar audio';
            const seekLabel=isVoice?'Atur posisi voice note':'Atur posisi audio';
            const bars=Array.from({length:34},(_,i)=>`<span class="jft-vn-bar" style="--i:${i}"></span>`).join('');
            return `<div class="jft-vn-player ${isVoice?'is-voice':'is-audio'}" data-vn-player data-vn-duration="${fallbackDuration}">
                <audio class="jft-vn-audio" preload="metadata" aria-hidden="true"><source src="${escapeAttr(url)}" type="${escapeAttr(mime)}"></audio>
                <button type="button" class="jft-vn-play" data-vn-play aria-label="${playLabel}"><i class="fa-solid fa-play"></i></button>
                <div class="jft-vn-content">
                    <div class="jft-vn-meta"><span class="jft-vn-title"><i class="fa-solid ${mediaIcon}"></i> ${mediaLabel}</span><span data-vn-time>0:00 / ${formatDuration(fallbackDuration)}</span></div>
                    <button type="button" class="jft-vn-wave" data-vn-seek aria-label="${seekLabel}"><span class="jft-vn-progress" data-vn-progress></span><span class="jft-vn-bars">${bars}</span></button>
                </div>
                <button type="button" class="jft-vn-speed" data-vn-speed>1x</button>
            </div>${linkButtons}`;
        }
        return `<div class="flex items-center gap-2 bg-black/5 rounded-xl p-2 border border-[#181818]"><span class="w-9 h-9 rounded-lg bg-white border-[2px] border-[#181818] flex items-center justify-center"><i class="fa-solid fa-file"></i></span><span class="min-w-0 flex-1"><span class="block font-black text-xs truncate">${name}</span><span class="block text-[9px] text-slate-500">${formatBytes(msg.file_size||0)}</span></span></div>${linkButtons}`;
    }
    function formatDuration(seconds){
        const n=Math.max(0,Number(seconds)||0);
        const mins=Math.floor(n/60);
        const secs=Math.floor(n%60);
        return `${mins}:${String(secs).padStart(2,'0')}`;
    }

    function setVNProgress(player, audio){
        const duration=Number.isFinite(audio.duration)&&audio.duration>0 ? audio.duration : Number(player.dataset.vnDuration)||0;
        const current=Number(audio.currentTime)||0;
        const pct=duration>0 ? Math.min(100,Math.max(0,(current/duration)*100)) : 0;
        const progress=player.querySelector('[data-vn-progress]');
        if(progress) progress.style.width=`${pct}%`;
        const time=player.querySelector('[data-vn-time]');
        if(time) time.textContent=`${formatDuration(current)} / ${formatDuration(duration)}`;
        player.style.setProperty('--vn-progress',`${pct}%`);
        player.classList.toggle('is-playing',!audio.paused);
        const icon=player.querySelector('[data-vn-play] i');
        if(icon){ icon.className = audio.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'; }
    }

    function bindVNPlayer(player){
        if(!player || player.dataset.vnBound==='1') return;
        const audio=player.querySelector('.jft-vn-audio');
        const playBtn=player.querySelector('[data-vn-play]');
        const seekBtn=player.querySelector('[data-vn-seek]');
        const speedBtn=player.querySelector('[data-vn-speed]');
        if(!audio || !playBtn) return;
        player.dataset.vnBound='1';
        audio.addEventListener('loadedmetadata',()=>setVNProgress(player,audio));
        audio.addEventListener('timeupdate',()=>setVNProgress(player,audio));
        audio.addEventListener('play',()=>setVNProgress(player,audio));
        audio.addEventListener('pause',()=>setVNProgress(player,audio));
        audio.addEventListener('ended',()=>{ audio.currentTime=0; setVNProgress(player,audio); });
        playBtn.addEventListener('click',async e=>{
            e.preventDefault(); e.stopPropagation();
            try{
                document.querySelectorAll('.jft-vn-audio').forEach(other=>{if(other!==audio&&!other.paused) other.pause();});
                if(audio.paused){ await audio.play(); } else { audio.pause(); }
                setVNProgress(player,audio);
            }catch(err){ console.warn('Voice note playback failed:',err); }
        });
        if(seekBtn){
            seekBtn.addEventListener('click',e=>{
                e.preventDefault(); e.stopPropagation();
                const rect=seekBtn.getBoundingClientRect();
                const ratio=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
                const duration=Number.isFinite(audio.duration)&&audio.duration>0 ? audio.duration : Number(player.dataset.vnDuration)||0;
                if(duration>0){ audio.currentTime=duration*ratio; setVNProgress(player,audio); }
            });
        }
        if(speedBtn){
            const speeds=[1,1.25,1.5,2];
            speedBtn.addEventListener('click',e=>{
                e.preventDefault(); e.stopPropagation();
                const current=Number(audio.playbackRate)||1;
                const idx=speeds.indexOf(current);
                const next=speeds[(idx+1)%speeds.length];
                audio.playbackRate=next;
                speedBtn.textContent=`${next}x`;
            });
        }
        player.querySelectorAll('[data-vn-skip]').forEach(btn=>btn.addEventListener('click',e=>{
            e.preventDefault(); e.stopPropagation();
            const delta=Number(btn.dataset.vnSkip)||0;
            const duration=Number.isFinite(audio.duration)&&audio.duration>0 ? audio.duration : Number(player.dataset.vnDuration)||0;
            if(duration>0){ audio.currentTime=Math.max(0,Math.min(duration,(Number(audio.currentTime)||0)+delta)); setVNProgress(player,audio); }
        }));
        setVNProgress(player,audio);
    }

    function initVNPlayers(root=document){
        root.querySelectorAll?.('[data-vn-player]').forEach(bindVNPlayer);
    }
    window.initJftVNPlayers=initVNPlayers;

    function escapeAttr(v){ return escapeHtml(String(v||'')); }
    function isPlaceholderMessage(msg){
        const type=String(msg.message_type||'');
        const value=String(msg.message||'').trim().toLowerCase();
        return type!=='text' && ['[foto]','[video]','[audio]','[voice note]','[dokumen]','[file]'].includes(value);
    }

    window.appendMessageElement=function(msg,container){
        const senderId=String(msg.sender_id||''); const senderName=(msg.sender_name||'SISWA').trim().toUpperCase(); const isMe=isCurrentDeviceMessage(msg); const isAdmin=msg.sender_role==='admin';
        const nameColor=isAdmin?'#ef4444':getUserColor(senderId||`legacy:${senderName}`); const timeStr=new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
        const isTagged=messageContainsMyTag(msg.message||'',getCurrentChatName()); const modal=document.getElementById('global-chat-modal'); const modalIsOpen=modal&&!modal.classList.contains('hidden'); if(isTagged&&!isMe&&!modalIsOpen) showChatNotificationDot();
        const editedTag=msg.edited_at?' <span class="text-[9px] italic opacity-60">(diedit)</span>':'';
        let htmlReplyPart=''; if(msg.reply_to) htmlReplyPart=`<div class="reply-card bg-black/5 border-l-[3px] border-[#181818] p-2 mb-2 rounded-lg text-[10px]"><span class="font-black text-slate-700">${escapeHtml(msg.reply_user||'Seseorang')}</span><p class="truncate text-slate-600 mt-0.5">${escapeHtml(msg.reply_to)}</p></div>`;
        const bubbleColorClass=isAdmin?'bg-[#62bddb] text-[#181818]':isMe?'bg-[#ffe45c] text-[#181818]':'bg-white text-[#181818]';
        const messageText=(!isPlaceholderMessage(msg) && msg.message) ? `<div class="chat-message-text">${linkifyText(msg.message)}${editedTag}</div>` : '';
        const media=mediaHTML(msg);
        const div=document.createElement('div'); div.className=`chat-message-row w-full flex flex-col ${isMe?'items-end':'items-start'} relative select-none`;
        div.innerHTML=`<div class="chat-author flex items-center gap-1 px-1 mb-1 max-w-[90%]">${isAdmin?'<span class="text-[12px] leading-none text-[#2f80ed]" title="Admin"><i class="fa-solid fa-crown"></i></span>':''}<span class="text-[10px] font-black uppercase truncate" style="color:${nameColor}">${escapeHtml(senderName)}</span><span class="text-[9px] text-slate-400 whitespace-nowrap">• ${timeStr}</span></div><div class="chat-bubble-wrap relative max-w-[84%]" data-message-id="${escapeHtml(String(msg.id||''))}"><div class="chat-swipe-indicator absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 pointer-events-none text-[#181818] font-black text-sm">↪</div><div class="chat-bubble-card ${bubbleColorClass} p-3 rounded-2xl border-[2px] border-[#181818] text-left text-xs font-medium shadow-[3px_3px_0_#181818] relative cursor-pointer touch-pan-y will-change-transform">${htmlReplyPart}${media}${messageText}</div></div>`;
        const bubbleWrap=div.querySelector('.chat-bubble-wrap'); const bubble=div.querySelector('.chat-bubble-card'); const indicator=div.querySelector('.chat-swipe-indicator');
        initVNPlayers(div);
        div.querySelectorAll('[data-copy-link]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation(); copyLink(btn.getAttribute('data-copy-link')||'');}));
        div.querySelectorAll('.chat-link-open, .chat-link, video, audio, img, button').forEach(el=>el.addEventListener('pointerdown',e=>e.stopPropagation()));
        let startX=0,startY=0,currentDx=0,swiping=false,longPressTimer=null;
        const reset=()=>{bubble.style.transform='';bubble.style.transition='transform .18s ease';indicator.style.opacity='0';indicator.style.transform='translate(-2rem,-50%)';currentDx=0;swiping=false;};
        bubble.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,video,audio,img'))return;if(e.pointerType==='mouse'&&e.button!==0)return;startX=e.clientX;startY=e.clientY;currentDx=0;swiping=true;bubble.style.transition='none';try{bubble.setPointerCapture(e.pointerId)}catch(_){};longPressTimer=setTimeout(()=>{if(Math.abs(currentDx)>=8||!swiping)return;selectedMessageForAction=msg;openChatActionModal(msg)},550)});
        bubble.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-startX)>12||Math.abs(e.clientY-startY)>12){clearTimeout(longPressTimer)} if(!swiping)return; const dx=e.clientX-startX,dy=e.clientY-startY; if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){swiping=false;reset();return;} if(dx>8){currentDx=Math.min(dx,95);bubble.style.transform=`translateX(${currentDx}px)`;indicator.style.opacity=String(Math.min(currentDx/55,1));indicator.style.transform=`translate(${Math.min(-32+currentDx*.25,-2)}px,-50%)`}});
        bubble.addEventListener('pointerup',e=>{clearTimeout(longPressTimer);if(!swiping)return;try{bubble.releasePointerCapture(e.pointerId)}catch(_){} if(currentDx>=55){bubble.style.transition='transform .15s ease';bubble.style.transform='translateX(35px)';setTimeout(()=>{reset();triggerReply(senderName,msg.message||'',senderId)},120)}else reset()});
        bubble.addEventListener('pointercancel',()=>{clearTimeout(longPressTimer);reset()}); bubble.addEventListener('contextmenu',e=>{e.preventDefault();clearTimeout(longPressTimer);selectedMessageForAction=msg;openChatActionModal(msg)});
        container.appendChild(div);
    };

    window.sendGlobalMessage=async function(){
        const input=document.getElementById('chat-input-msg'); if(!input)return;
        const message=input.value.trim(); const senderName=getCurrentChatName(); const userRole=localStorage.getItem('jft_user_role')||'user';
        const voice=recordedVoiceBlob; const file=selectedChatFile;
        if(!message && !voice && !file) return;
        if(isRoomClosed && String(userRole).trim().toLowerCase()!=='admin'){showToast('Peringatan','Room chat sedang ditutup oleh admin.',true);return;}
        if(isEditingMode && editingMessageId && !voice && !file){
            const query=window.supabaseClient.from('global_chats').update({message,edited_at:new Date().toISOString()}).eq('id',editingMessageId); const result=String(userRole).trim().toLowerCase()==='admin'?await query:await query.eq('sender_id',getChatIdentity());
            if(result.error) showToast('Gagal',result.error.message,true); else await fetchChatMessages(); isEditingMode=false;editingMessageId=null;input.value='';cancelReply();return;
        }
        let uploadMeta={};
        try{
            if(voice){
                const fileObj=new File([voice],`voice-note-${Date.now()}.webm`,{type:voice.type||'audio/webm'}); uploadMeta=await uploadChatFile(fileObj); uploadMeta.message_type='voice'; uploadMeta.file_name=fileObj.name; uploadMeta.mime_type=fileObj.type; uploadMeta.file_size=fileObj.size; uploadMeta.duration=Math.round((Date.now()-voiceStartedAt)/1000);
            } else if(file){
                const fileMime=getChatFileMime(file);
                uploadMeta=await uploadChatFile(file);
                uploadMeta.message_type=fileMime.startsWith('image/')?'image':fileMime.startsWith('video/')?'video':fileMime.startsWith('audio/')?'audio':'document';
                uploadMeta.file_name=file.name; uploadMeta.mime_type=fileMime; uploadMeta.file_size=file.size;
            }
            const payload={sender_id:getChatIdentity(),sender_name:senderName,sender_role:userRole,message: message || '',reply_to:activeReplyData?activeReplyData.text:null,reply_user:activeReplyData?activeReplyData.sender:null,message_type:uploadMeta.message_type||'text',file_url:uploadMeta.publicUrl||null,file_path:uploadMeta.path||null,file_name:uploadMeta.file_name||null,mime_type:uploadMeta.mime_type||null,file_size:uploadMeta.file_size||null,duration_seconds:uploadMeta.duration||null};
            const {data:inserted,error}=await window.supabaseClient.from('global_chats').insert([payload]).select('*').single();
            if(error) throw error;
            if(inserted && typeof window.createTagNotifications === 'function') await window.createTagNotifications(inserted);
            input.value=''; cancelReply(); clearChatAttachment(); const status=document.getElementById('chat-record-status'); if(status) status.textContent=''; const tagSuggestions=document.getElementById('tag-suggestions'); if(tagSuggestions) tagSuggestions.classList.add('hidden'); await fetchChatMessages();
        }catch(e){console.error(e);showToast('Gagal mengirim',e.message||'Upload gagal.',true)}
    };

    function bindChatPaste(){
        const input=document.getElementById('chat-input-msg');
        if(!input || input.dataset.pasteBound) return;
        input.dataset.pasteBound='1';
        input.addEventListener('paste', e=>{
            const items=[...(e.clipboardData?.items||[])];
            const imageItem=items.find(item=>item.kind==='file' && String(item.type||'').startsWith('image/'));
            if(!imageItem) return;
            const file=imageItem.getAsFile();
            if(!file) return;
            e.preventDefault();
            if(file.size>MAX_CHAT_FILE_BYTES){ showToast('Sticker/Gambar terlalu besar','Maksimal 25 MB.',true); return; }
            selectedChatFile=new File([file], `sticker-${Date.now()}.${(file.type.split('/')[1]||'png').replace('jpeg','jpg')}`, {type:file.type});
            recordedVoiceBlob=null;
            showAttachmentPreview(selectedChatFile,'file');
            showToast('Sticker siap','Tekan Kirim untuk mengirim gambar dari keyboard.');
        });
    }

    function bindLinkCopyButtons(){
        document.querySelectorAll('[data-copy-link]').forEach(btn=>{
            if(btn.dataset.boundCopy) return;
            btn.dataset.boundCopy='1';
            btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();copyLink(btn.getAttribute('data-copy-link')||'');});
        });
    }
    const _oldAppendMessageElement=window.appendMessageElement;
    if(typeof _oldAppendMessageElement==='function'){
        window.appendMessageElement=function(){ const r=_oldAppendMessageElement.apply(this,arguments); bindLinkCopyButtons(); return r; };
    }

    function initMediaControls(){
        bindLinkCopyButtons();
        bindChatPaste();
        const fi=chatFileInput(); if(fi&&!fi.dataset.bound){fi.dataset.bound='1';fi.addEventListener('change',window.handleChatFileSelected)}
        const rb=document.getElementById('chat-record-btn'); if(rb&&!rb.dataset.bound){rb.dataset.bound='1';rb.addEventListener('click',window.startVoiceRecording)}
    }
    const oldToggle=window.toggleGlobalChat;
    window.toggleGlobalChat=async function(){ initMediaControls(); return oldToggle.apply(this,arguments); };

    const oldActionReply = document.querySelector('#chat-action-modal button[onclick*="triggerReply"]');
    if(oldActionReply) oldActionReply.setAttribute('onclick',"selectedMessageForAction && triggerReply((selectedMessageForAction.sender_name || 'Seseorang').toUpperCase(), selectedMessageForAction.message || '', selectedMessageForAction.sender_id || ''); closeChatActionModal();");

    document.addEventListener('DOMContentLoaded',()=>{
        initMediaControls();
        const page=currentPage();
        if(page==='home' || page==='admin'){
            const chat=document.getElementById('global-chat-modal'); if(chat) { const input=document.getElementById('chat-input-msg'); if(input) input.setAttribute('autocomplete','off'); }
        }
    });
})();
