/* ============================================================
   MODULAR APP ENHANCEMENTS
   - Multi-page routing for Vercel static hosting
   - Persistent quiz attempt / resume after reload
   - Persistent result view after navigation/reload
   - Global Chat media: image, video, document, audio, voice note
   ============================================================ */
(function modularEnhancements(){
    const ROUTES = {
        auth: 'index.html',
        home: 'home.html',
        quiz: 'quiz.html',
        result: 'result.html',
        history: 'history.html',
        admin: 'admin.html'
    };

    function currentPage(){
        return document.body?.dataset?.page || 'auth';
    }

    function pageUrl(name){
        return ROUTES[name] || ROUTES.home;
    }

    window.navigate = function(screenId){
        const target = pageUrl(screenId);
        if (location.pathname.endsWith('/' + target) || location.pathname === '/' && target === 'index.html') {
            window.scrollTo(0, 0);
            return;
        }
        window.location.href = target;
    };

    window.getQuizStorageKey = function(){
        const uid = localStorage.getItem('jft_user_id') || 'guest';
        const did = localStorage.getItem('jft_device_id') || 'unknown-device';
        return `jft_active_quiz_v2_${uid}_${did}`;
    };

    function readActiveQuiz(){
        try {
            const raw = localStorage.getItem(window.getQuizStorageKey());
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.questions) || !Array.isArray(parsed.userAnswers)) return null;
            return parsed;
        } catch (e) {
            console.warn('Gagal membaca latihan tersimpan:', e);
            return null;
        }
    }

    window.saveQuizProgress = function(){
        if (!state || !Array.isArray(state.questions) || !state.questions.length) return;
        try {
            const payload = {
                version: 2,
                attemptId: state.attemptId || `ATTEMPT-${Date.now()}`,
                questionCount: state.questions.length,
                questions: state.questions,
                currentQuestionIndex: state.currentQuestionIndex,
                userAnswers: state.userAnswers,
                startTime: state.startTime,
                selectedPeriod: state.selectedPeriod || 'sep-nov',
                audioPlayCounts: (typeof audioPlayCounts !== 'undefined' ? audioPlayCounts : {}),
                savedAt: Date.now()
            };
            state.attemptId = payload.attemptId;
            localStorage.setItem(window.getQuizStorageKey(), JSON.stringify(payload));
        } catch (e) {
            console.warn('Gagal menyimpan progres quiz:', e);
        }
    };

    window.clearQuizProgress = function(){
        try { localStorage.removeItem(window.getQuizStorageKey()); } catch (_) {}
    };

    window.restoreActiveQuiz = function(){
        const saved = readActiveQuiz();
        if (!saved) return false;
        state.questions = saved.questions;
        state.currentQuestionIndex = Math.max(0, Math.min(Number(saved.currentQuestionIndex || 0), state.questions.length - 1));
        state.userAnswers = Array.isArray(saved.userAnswers)
            ? saved.userAnswers.slice(0, state.questions.length).concat(new Array(Math.max(0, state.questions.length - saved.userAnswers.length)).fill(null))
            : new Array(state.questions.length).fill(null);
        state.userAnswers.length = state.questions.length;
        state.startTime = Number(saved.startTime) || Date.now();
        state.endTime = null;
        state.selectedPeriod = saved.selectedPeriod || 'sep-nov';
        state.attemptId = saved.attemptId || `ATTEMPT-${Date.now()}`;
        audioPlayCounts = saved.audioPlayCounts || {}; 

        clearInterval(state.timerInterval);
        state.timerInterval = setInterval(() => {
            const timer = document.getElementById('quiz-timer');
            if (!timer) return;
            const s = Math.floor((Date.now() - state.startTime) / 1000);
            timer.innerHTML = `<i class="fa-regular fa-clock"></i> <span>${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}</span>`;
        }, 1000);

        if (typeof renderQuestion === 'function') renderQuestion();
        return true;
    };

    // Start quiz: gunakan bank + riwayat anti-repeat versi terbaru.
    // Jangan bergantung pada navigate('quiz') karena halaman quiz adalah multi-page.
    window.startQuiz = async function(){
        const btn = document.querySelector('button[onclick="startQuiz()"]');
        if (btn) {
            if (btn.dataset.starting === '1') return;
            btn.dataset.starting = '1';
            btn.disabled = true;
            btn.classList.add('opacity-70', 'cursor-wait');
        }

        try {
            const nameInput = document.getElementById('user-name-input');
            const userName = nameInput ? userName.value.trim() : '';
            if (!userName) {
                showCustomConfirm('Silakan masukkan nama Anda terlebih dahulu!', null, 'Oke');
                return;
            }

            const accountName = (localStorage.getItem('jft_account_name') || '').trim().toUpperCase();
            const normalizedName = userName.toUpperCase();
            if (normalizedName === accountName) {
                showCustomConfirm('Nama tidak boleh sama dengan nama yang dibuat admin!', null, 'Oke');
                return;
            }

            localStorage.setItem(getChatNameStorageKey(), normalizedName);
            localStorage.setItem('jft_display_name', normalizedName);
            localStorage.setItem('jft_user_name', normalizedName);

            const qCountRadio = document.querySelector('input[name="q_count"]:checked');
            const reqCount = qCountRadio ? parseInt(qCountRadio.value, 10) : 10;
            const periodRadio = document.querySelector('input[name="period"]:checked');
            const selectedPeriod = periodRadio ? periodRadio.value : 'sep-nov';

            // Hapus sesi lama sebelum membuat sesi baru.
            // Ini mencegah sesi selesai/tertinggal mengunci tombol Mulai Latihan.
            if (typeof window.clearQuizProgress === 'function') {
                window.clearQuizProgress();
            }

            // Selalu gunakan history bank v2 agar soal yang sudah keluar
            // tidak dipilih lagi sampai seluruh bank habis.
            const questionHistory = (typeof loadQuestionHistory === 'function')
                ? await loadQuestionHistory()
                : { bankVersion: 'jft-basic-500-v2-2026-10-07', seen: {} };

            const selected = (typeof selectQuizQuestions === 'function')
                ? selectQuizQuestions(reqCount, questionHistory)
                : [];

            if (!Array.isArray(selected) || selected.length === 0) {
                throw new Error('Bank soal tidak menghasilkan soal. Silakan refresh halaman.');
            }

            if (typeof markQuestionsSeen === 'function') {
                const updatedHistory = markQuestionsSeen(questionHistory, selected);
                await saveQuestionHistory(updatedHistory);
            }

            state.questions = selected;
            state.currentQuestionIndex = 0;
            state.userAnswers = new Array(selected.length).fill(null);
            state.endTime = null;
            state.startTime = Date.now();
            state.selectedPeriod = selectedPeriod;
            state.attemptId = `ATTEMPT-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
            if (typeof audioPlayCounts !== 'undefined') audioPlayCounts = {};

            window.saveQuizProgress();

            // Multi-page routing: jangan panggil navigate('quiz') dari home.html.
            window.location.href = 'quiz.html';
        } catch (error) {
            console.error('Gagal memulai latihan:', error);
            showCustomConfirm(
                'Latihan tidak dapat dimulai. Silakan coba lagi. Jika masih gagal, refresh halaman.',
                null,
                'Oke'
            );
        } finally {
            if (btn) {
                btn.dataset.starting = '0';
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-wait');
            }
        }
    };

    // Save after every answer and every render, so reload is safe even before pressing Next.
    const legacyPilihJawaban = window.pilihJawaban;
    window.pilihJawaban = function(val){
        if (typeof legacyPilihJawaban === 'function') legacyPilihJawaban(val);
        window.saveQuizProgress();
    };
    const legacyRenderQuestion = window.renderQuestion;
    window.renderQuestion = function(){
        if (typeof legacyRenderQuestion === 'function') legacyRenderQuestion();
        window.saveQuizProgress();
    };

    // A second guard for logout on pages that don't contain the login input.
    window.handleLogout = function(){
        showCustomConfirm('Yakin ingin keluar dari akun ini?', () => {
            localStorage.removeItem('jft_user_id');
            localStorage.removeItem('jft_user_role');
            localStorage.removeItem('jft_display_name');
            localStorage.removeItem('jft_user_name');
            isEditingMode = false;
            editingMessageId = null;
            if (typeof cancelReply === 'function') cancelReply();
            window.location.href = 'index.html';
        }, 'Keluar');
    };

    // Result persistence renderer. finishQuiz already computes and saves the exact same result to jft_last_result.
    window.renderStoredResult = function(){
        const raw = localStorage.getItem('jft_last_result');
        if (!raw) return false;
        let r;
        try { r = JSON.parse(raw); } catch (_) { return false; }
        const set = (id, value) => { const el=document.getElementById(id); if(el) el.textContent=value ?? ''; };
        set('res-date', r.date ? new Date(r.date).toLocaleDateString('id-ID') : '-');
        set('res-reg-num', r.regNum || `PRACTICE-${Math.floor(Math.random()*900000+100000)}`);
        set('res-name', r.name || 'SISWA');
        set('res-total-score', r.score);
        set('res-level', r.level);
        set('res-score-val-float', r.score);
        set('eval-total', r.total);
        set('eval-correct', r.correct);
        set('eval-wrong', Array.isArray(r.mistakes) ? r.mistakes.length : Math.max(0, (r.total || 0) - (r.correct || 0)));
        set('eval-accuracy', `${r.total ? Math.round((r.correct/r.total)*100) : 0}%`);
        const indicator = document.getElementById('res-score-indicator');
        if (indicator) indicator.style.left = `${Math.max(0, Math.min(100, ((Number(r.score)-10)/240)*100))}%`;

        const sc = r.sections || {};
        const container = document.getElementById('res-sections-container');
        if (container) {
            container.innerHTML = '';
            SECTIONS.forEach(s => {
                const st = sc[s.id] || {total:0, correct:0};
                const pct = st.total > 0 ? Math.round((st.correct/st.total)*100) : 0;
                container.innerHTML += `<div class="flex items-center justify-between gap-4 text-sm"><div class="w-1/3"><div class="font-bold text-slate-800 japanese-text">${s.nameJP}</div><div class="text-[11px] text-slate-500">${s.nameEN}</div></div><div class="w-1/2"><div class="section-bar-bg"><div class="section-bar-fill" style="width:${pct}%"></div></div></div><div class="w-12 text-right font-bold text-slate-800">${pct}%</div></div>`;
            });
        }
        const mistakes = Array.isArray(r.mistakes) ? r.mistakes : [];
        const mc = document.getElementById('mistakes-container');
        if (mc) {
            mc.innerHTML = '';
            if (!mistakes.length) mc.innerHTML = '<p class="text-green-600 bg-green-50 p-4 rounded">Sempurna!</p>';
            mistakes.forEach(m => {
                const q=m.q || {}; const wrongIndex=m.a; const wrongText=wrongIndex !== null && wrongIndex !== undefined && q.options ? q.options[wrongIndex] : 'Kosong'; const rightText=q.options ? q.options[q.answer] : '-';
                mc.innerHTML += `<div class="bg-red-50 p-4 rounded mb-4"><div class="font-bold">Soal ${m.n}</div><div class="japanese-text text-lg mb-2">${escapeHtml(q.text || '')}</div><div class="text-sm text-red-600 mb-1">Salah: ${escapeHtml(wrongText || 'Kosong')}</div><div class="text-sm text-green-600 font-bold mb-2">Benar: ${escapeHtml(rightText || '-')}</div><div class="text-xs bg-white p-2 rounded">Penjelasan: ${escapeHtml(q.explanation || '')}</div></div>`;
            });
        }
        const photo=localStorage.getItem('jft_user_photo'); const img=document.getElementById('user-photo-img'); if(photo && img){ img.src=photo; img.classList.remove('hidden'); const ph=document.getElementById('photo-placeholder'); if(ph) ph.classList.add('hidden'); }
        return true;
    };

    // Home resume card.
    window.renderResumeCard = function(){
        const host=document.getElementById('resume-quiz-card');
        if(!host) return;
        const saved=readActiveQuiz();
        if(!saved){ host.classList.add('hidden'); return; }
        const idx=Number(saved.currentQuestionIndex||0)+1;
        const total=Number(saved.questionCount||saved.questions?.length||0);
        const answered=(saved.userAnswers||[]).filter(x=>x!==null && x!==undefined).length;
        host.classList.remove('hidden');
        host.innerHTML=`<div class="resume-card bg-[#43c9bd] border-[2px] border-[#181818] rounded-2xl p-5 shadow-[4px_4px_0_#181818]"><div class="resume-card-main flex items-start justify-between gap-5"><div class="resume-card-text min-w-0 flex-1"><div class="text-[10px] font-black uppercase tracking-wider">Latihan tersimpan</div><div class="font-black text-lg mt-1">Lanjutkan ${total} soal</div><div class="text-sm font-bold text-slate-700 mt-2 leading-6">Posisi: soal ${idx}/${total} · ${answered} jawaban tersimpan</div></div><button onclick="continueQuiz()" class="resume-action-button shrink-0 bg-white text-[#181818] border-[2px] border-[#181818] rounded-xl font-black shadow-[3px_3px_0_#181818]">Lanjutkan</button></div><div class="mt-5 pt-3 border-t-2 border-[#181818]/20"><button onclick="discardSavedQuiz()" class="text-[10px] font-black underline">Hapus latihan tersimpan</button></div></div>`;
    };
    window.continueQuiz = function(){ window.location.href='quiz.html'; };
    window.discardSavedQuiz = function(){ showCustomConfirm('Hapus latihan yang tersimpan dan mulai dari awal?', () => { clearQuizProgress(); renderResumeCard(); }, 'Hapus'); };

    // Page-aware session handler.
    window.checkSession = function(){
        const page=currentPage();
        const userId=localStorage.getItem('jft_user_id');
        const role=String(localStorage.getItem('jft_user_role')||'').trim().toLowerCase();
        if(!userId){
            if(page!=='auth') window.location.href='index.html';
            return;
        }
        if(page==='auth'){ window.location.href = role==='admin' ? 'admin.html' : 'home.html'; return; }
        if(page==='admin'){
            if(role!=='admin'){ window.location.href='home.html'; return; }
            setTimeout(()=>{ if(typeof loadAdminData==='function') loadAdminData(); if(typeof updateAdminChatNameDisplay==='function') updateAdminChatNameDisplay(); if(typeof checkAdminChatFeature==='function') checkAdminChatFeature(); },0);
            return;
        }
        if(page==='quiz'){
            if(!window.restoreActiveQuiz()) window.location.href='home.html';
            return;
        }
        if(page==='result'){
            if(!window.renderStoredResult()) window.location.href='home.html';
            return;
        }
        if(page==='history'){ if(typeof renderHistory==='function') renderHistory(); return; }
        if(page==='home'){
            const accountName=localStorage.getItem('jft_account_name')||'SISWA';
            const custom=(localStorage.getItem(getChatNameStorageKey())||'').trim().toUpperCase();
            const input=document.getElementById('user-name-input'); if(input) input.value=custom||accountName;
            if(custom){ localStorage.setItem('jft_display_name',custom); localStorage.setItem('jft_user_name',custom); } else if(typeof showRequiredNameModal==='function'){ setTimeout(showRequiredNameModal,200); }
            renderResumeCard();
            return;
        }
    };
})();

// Visual polish for the saved-practice card: keep the action separated from the progress copy.
(function(){
  function polishResume(){
    const card=document.getElementById('resume-quiz-card');
    if(!card || card.dataset.polished==='1') return;
    if(!card.innerHTML.trim()) return;
    card.dataset.polished='1';
    const buttons=[...card.querySelectorAll('button')];
    buttons.forEach(b=>{ b.classList.add('resume-action-button'); });
    const text=card.querySelector('.resume-card-text'); if(text) text.style.maxWidth='58%';
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(polishResume,250));
  const obs=new MutationObserver(polishResume);
  document.addEventListener('DOMContentLoaded',()=>{ const el=document.getElementById('resume-quiz-card'); if(el) obs.observe(el,{childList:true,subtree:true}); });

    window.addEventListener('pageshow', function(){
        const btn = document.querySelector('button[onclick="startQuiz()"]');
        if (btn) {
            btn.dataset.starting = '0';
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-wait');
        }
    });

})();
