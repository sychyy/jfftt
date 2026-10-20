
        const SECTIONS = [
            { id: 'vocab', nameJP: '文字と語彙', nameEN: 'Script and Vocabulary' },
            { id: 'grammar', nameJP: '文法・表現', nameEN: 'Grammar & Expressions' },
            { id: 'listening', nameJP: '聴解', nameEN: 'Listening Comprehension' },
            { id: 'reading', nameJP: '読解', nameEN: 'Reading Comprehension' }
        ];

        const MATERIAL_SHELF = [
          { title: 'Minna no Nihongo V1', subtitle: 'Minna no Nihongo', description: 'Materi Minna no Nihongo versi 1 yang kamu bagikan secara gratis.', url: 'https://drive.google.com/file/d/1EQ_fETz_S3kypo6vIVGjMR6p4-A_B6eT/view?usp=drivesdk' },
          { title: 'Minna no Nihongo V2', subtitle: 'Minna no Nihongo', description: 'Materi Minna no Nihongo versi 2 yang kamu bagikan secara gratis.', url: 'https://drive.google.com/file/d/1e3Mv-gDcKL7vC7PI7VXouLyRR37NE2CI/view?usp=drivesdk' },
          { title: 'Full Jepang V1', subtitle: 'Minna no Nihongo — Full Jepang', description: 'Versi bahasa Jepang untuk Minna no Nihongo V1.', url: 'https://drive.google.com/file/d/16xGs1meRe964-PU2PWTlBkBpjdd3EoZV/view?usp=drivesdk' },
          { title: 'Full Jepang V2', subtitle: 'Minna no Nihongo — Full Jepang', description: 'Versi bahasa Jepang untuk Minna no Nihongo V2.', url: 'https://drive.google.com/file/d/1SL8KvzGQVf4f2pGLU2ZRRHUTnzX80oEu/view?usp=drivesdk' },
          { title: 'Kotoba Bab 1–50', subtitle: 'Kotoba', description: 'Materi kosakata Bab 1 sampai Bab 50 yang kamu bagikan secara gratis.', url: 'https://drive.google.com/file/d/1synFNOto3RifCp2360b2w1HvRbwmCcmA/view?usp=drivesdk' }
        ];
        function openMaterialShelf(index) {
          const item = MATERIAL_SHELF[index]; const modal = document.getElementById('material-shelf-modal'); if (!item || !modal) return;
          document.getElementById('material-shelf-title').textContent = item.title;
          document.getElementById('material-shelf-subtitle').textContent = item.subtitle;
          document.getElementById('material-shelf-description').textContent = item.description;
          document.getElementById('material-shelf-open').href = item.url;
          modal.classList.remove('hidden'); modal.classList.add('flex');
        }
        function closeMaterialShelf() { const modal = document.getElementById('material-shelf-modal'); if (!modal) return; modal.classList.add('hidden'); modal.classList.remove('flex'); }

        // ==========================================
        // KUIS HIRAGANA / KATAKANA PEMULA
        // ==========================================
        const HIRAGANA_BEGINNER = [
          ['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],
          ['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],
          ['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],
          ['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],['や','ya'],['ゆ','yu'],['よ','yo'],['ら','ra'],['り','ri'],
          ['る','ru'],['れ','re'],['ろ','ro'],['わ','wa'],['を','wo'],['ん','n']
        ];
        const KATAKANA_BEGINNER = HIRAGANA_BEGINNER.map(([_, romaji], index) => [
          ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'][index], romaji
        ]);
        let kanaQuizState = { type: 'hiragana', questions: [], index: 0, score: 0, answered: false };

        function kanaShuffle(arr) {
          const copy = [...arr];
          for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
          return copy;
        }
        function buildKanaQuestions(type) {
          const bank = type === 'katakana' ? KATAKANA_BEGINNER : HIRAGANA_BEGINNER;
          return kanaShuffle(bank).slice(0, 10).map(([character, answer]) => {
            const distinct = [...new Set(bank.map(x => x[1]).filter(x => x !== answer))];
            const options = kanaShuffle([answer, ...kanaShuffle(distinct).slice(0, 3)]);
            return { character, answer, options };
          });
        }
        function openKanaQuiz(type) {
          kanaQuizState = { type, questions: buildKanaQuestions(type), index: 0, score: 0, answered: false };
          const modal = document.getElementById('kana-quiz-modal'); if (!modal) return;
          modal.classList.remove('hidden'); modal.classList.add('flex'); renderKanaQuizQuestion();
        }
        function renderKanaQuizQuestion() {
          const q = kanaQuizState.questions[kanaQuizState.index]; if (!q) return;
          document.getElementById('kana-quiz-title').textContent = kanaQuizState.type === 'katakana' ? 'カタカナ' : 'ひらがな';
          document.getElementById('kana-quiz-progress').textContent = `Soal ${kanaQuizState.index + 1} / ${kanaQuizState.questions.length}`;
          document.getElementById('kana-quiz-score').textContent = `Skor: ${kanaQuizState.score}`;
          document.getElementById('kana-quiz-character').textContent = q.character;
          const feedback = document.getElementById('kana-quiz-feedback'); feedback.textContent = ''; feedback.className = 'text-sm font-black mt-4 min-h-[20px]';
          document.getElementById('kana-quiz-question').classList.remove('hidden');
          document.getElementById('kana-quiz-result').classList.add('hidden');
          document.getElementById('kana-quiz-options').innerHTML = q.options.map(option => `<button type="button" onclick="answerKanaQuestion('${option}')" class="kana-option py-3 px-3 bg-white border-[2px] border-[#181818] rounded-xl font-black text-base shadow-[3px_3px_0_#181818] hover:-translate-y-0.5 transition">${option}</button>`).join('');
          kanaQuizState.answered = false;
        }
        function answerKanaQuestion(selected) {
          if (kanaQuizState.answered) return; const q = kanaQuizState.questions[kanaQuizState.index]; if (!q) return;
          kanaQuizState.answered = true; const correct = selected === q.answer; if (correct) kanaQuizState.score++;
          document.querySelectorAll('#kana-quiz-options .kana-option').forEach(btn => { btn.disabled = true; if (btn.textContent === q.answer) btn.classList.add('bg-[#43c9bd]'); else if (btn.textContent === selected) btn.classList.add('bg-[#ff7373]'); });
          const feedback = document.getElementById('kana-quiz-feedback'); feedback.textContent = correct ? 'Benar' : `Belum tepat. Jawaban: ${q.answer}`; feedback.className = `text-sm font-black mt-4 min-h-[20px] ${correct ? 'text-emerald-600' : 'text-rose-600'}`;
          document.getElementById('kana-quiz-score').textContent = `Skor: ${kanaQuizState.score}`;
          setTimeout(() => { if (kanaQuizState.index < kanaQuizState.questions.length - 1) { kanaQuizState.index++; renderKanaQuizQuestion(); } else finishKanaQuiz(); }, 650);
        }
        function finishKanaQuiz() {
          document.getElementById('kana-quiz-options').innerHTML = ''; document.getElementById('kana-quiz-question').classList.add('hidden'); document.getElementById('kana-quiz-result').classList.remove('hidden');
          document.getElementById('kana-quiz-result-score').textContent = `${kanaQuizState.score} / ${kanaQuizState.questions.length}`;
          document.getElementById('kana-quiz-result-text').textContent = kanaQuizState.score === 10 ? 'Sempurna.' : kanaQuizState.score >= 7 ? 'Bagus! Tinggal sedikit lagi.' : 'Ayo ulangi sampai makin hafal.';
        }
        function restartKanaQuiz() { openKanaQuiz(kanaQuizState.type); }
        function closeKanaQuiz() { const modal = document.getElementById('kana-quiz-modal'); if (!modal) return; modal.classList.add('hidden'); modal.classList.remove('flex'); }

        // MOCK QUESTION BANK
                let QUESTION_BANK = [];
        async function ensureQuestionBankLoaded() {
            if (QUESTION_BANK.length) return QUESTION_BANK;
            if (!window.JFTQuestionBank) throw new Error("Modul bank soal belum dimuat.");
            QUESTION_BANK = await window.JFTQuestionBank.load();
            window.JFT_QUESTION_BANK = QUESTION_BANK;
            return QUESTION_BANK;
        };


        let state = {
            currentScreen: 'home',
            questions: [],
            currentQuestionIndex: 0,
            userAnswers: [],
            timerInterval: null,
            startTime: null,
            endTime: null,
            selectedPeriod: 'sep-nov'
        };
        
let audioPlayCounts = {};
        // Stable public references used by the multi-page router.
        // This avoids relying on window.* for top-level let/const bindings.
        window.JFT_STATE = state;
        window.JFT_GET_DEVICE_ID = getOrCreateDeviceId;
        const SUPABASE_URL = 'https://lnthciiomeppirzucqwu.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_1TYGD_KXkkxJEiFug566zQ_CjZfmUN-';
        try {
            window.supabaseClient = (window.supabase && typeof window.supabase.createClient === 'function')
                ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
                : null;
        } catch (e) {
            console.warn('Supabase tidak tersedia; fitur kuis tetap memakai penyimpanan lokal.', e);
            window.supabaseClient = null;
        }

        function navigate(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(`screen-${screenId}`).classList.add('active');
            window.scrollTo(0, 0);

            const header = document.getElementById('main-header');
            if (header) {
                if (screenId === 'auth' || screenId === 'admin') {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            }

            if (screenId === 'history') renderHistory();
            if (screenId === 'admin') {
                loadAdminData();
                if (typeof checkAdminChatFeature === 'function') {
                    checkAdminChatFeature();
                }
                if (typeof updateAdminChatNameDisplay === 'function') {
                    updateAdminChatNameDisplay();
                }
            }
            if(state.currentScreen === 'quiz' && screenId !== 'quiz') clearInterval(state.timerInterval);
            state.currentScreen = screenId;
        }

        function getOrCreateDeviceId() {
            let deviceId = localStorage.getItem('jft_device_id');
            if (!deviceId) {
                deviceId = 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase();
                localStorage.setItem('jft_device_id', deviceId);
            }
            return deviceId;
        }
        
        let currentLeaderboardFilter = 10;

        function toggleLeaderboard() {
            const container = document.getElementById('leaderboard-container');
            container.classList.toggle('hidden');
            if (!container.classList.contains('hidden')) {
                loadLeaderboardData(currentLeaderboardFilter);
            }
        }
        
         async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const btnLogin = document.getElementById('btn-login');
    const errorMsg = document.getElementById('login-error');

    if (!email || !password) {
        errorMsg.textContent = "Email dan password harus diisi!";
        errorMsg.classList.remove('hidden');
        return;
    }

    btnLogin.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Memeriksa...';

    btnLogin.disabled = true;
    errorMsg.classList.add('hidden');

    try {
        const { data: dbData, error: dbError } =
            await window.supabaseClient
                .from('Jft-Basic')
                .select('*')
                .eq('email', email)
                .eq('auth_code', password);

        if (dbError) throw dbError;

        if (!dbData || dbData.length === 0) {
            errorMsg.innerHTML = "❌ Auth Code atau Email salah.";
            errorMsg.classList.remove('hidden');

            btnLogin.innerHTML =
                'Masuk <i class="fa-solid fa-right-to-bracket"></i>';

            btnLogin.disabled = false;
            return;
        }

        const user = dbData[0];

        if (user.status !== 'active') {
            errorMsg.innerHTML = "❌ Akun Anda dinonaktifkan.";
            errorMsg.classList.remove('hidden');

            btnLogin.innerHTML =
                'Masuk <i class="fa-solid fa-right-to-bracket"></i>';

            btnLogin.disabled = false;
            return;
        }

        // ==========================================
        // DEVICE ID
        // ==========================================
        let deviceId = null;

        if (user.role !== 'admin') {
            deviceId = getOrCreateDeviceId();

            let devices = user.registered_devices || [];

            if (typeof devices === 'string') {
                try {
                    devices = JSON.parse(devices);
                } catch (e) {
                    devices = [];
                }
            }

            if (!devices.includes(deviceId)) {
                const max = user.max_users || 1;

                if (devices.length >= max) {
                    errorMsg.innerHTML =
                        `❌ Gagal: Akun ini sudah mencapai batas maksimal (${max} Perangkat).`;

                    errorMsg.classList.remove('hidden');

                    btnLogin.innerHTML =
                        'Masuk <i class="fa-solid fa-right-to-bracket"></i>';

                    btnLogin.disabled = false;
                    return;
                }

                devices.push(deviceId);

                const { error: updateError } =
                    await window.supabaseClient
                        .from('Jft-Basic')
                        .update({
                            registered_devices: devices
                        })
                        .eq('id', user.id);

                if (updateError) throw updateError;
            }
        }

        // ==========================================
        // SIMPAN DATA LOGIN
        // ==========================================
        localStorage.setItem(
            'jft_user_id',
            user.id
        );

        localStorage.setItem(
            'jft_user_role',
            user.role
        );

        const accountName =
            (user.name || 'SISWA').trim().toUpperCase();

        localStorage.setItem(
            'jft_account_name',
            accountName
        );

        // ==========================================
        // ADMIN
        // ==========================================
        if (user.role === 'admin') {

            localStorage.setItem(
                'jft_display_name',
                accountName
            );

            localStorage.setItem(
                'jft_user_name',
                accountName
            );

            navigate('admin');

            // Admin wajib memilih nama yang akan tampil di Global Chat.
            setTimeout(() => {
                updateAdminChatNameDisplay();
                if (!getAdminChatName()) openAdminChatNameModal(true);
            }, 250);

        } else {

            // ==========================================
            // USER BIASA
            // ==========================================
            navigate('home');

            // PENTING:
            // Gunakan deviceId yang sudah dibuat di atas.
            const customKey =
                `jft_custom_name_${deviceId}`;

            const savedCustomName = (
                localStorage.getItem(customKey) || ''
            ).trim().toUpperCase();

            const nameInput =
                document.getElementById('user-name-input');

            // ==========================================
            // DEVICE INI SUDAH PUNYA NAMA
            // ==========================================
            if (savedCustomName) {

                localStorage.setItem(
                    'jft_display_name',
                    savedCustomName
                );

                localStorage.setItem(
                    'jft_user_name',
                    savedCustomName
                );

                if (nameInput) {
                    nameInput.value =
                        savedCustomName;
                }

            } else {

                // ==========================================
                // DEVICE BARU
                // WAJIB MEMASUKKAN NAMA SENDIRI
                // ==========================================
                localStorage.removeItem(
                    'jft_display_name'
                );

                localStorage.removeItem(
                    'jft_user_name'
                );

                setTimeout(() => {
                    showRequiredNameModal();
                }, 200);
            }
        }

    } catch (err) {

        console.error(
            "Login error:",
            err
        );

        errorMsg.innerHTML =
            `❌ Error: ${err.message}`;

        errorMsg.classList.remove('hidden');

    }

    btnLogin.innerHTML =
        'Masuk <i class="fa-solid fa-right-to-bracket"></i>';

    btnLogin.disabled = false;
}


        function setLeaderboardFilter(count) {
            currentLeaderboardFilter = count;
            [10, 20, 30, 50].forEach(n => {
                const btn = document.getElementById(`l-btn-${n}`);
                if (n === count) {
                    btn.className = "py-1.5 px-1 rounded-lg border-[2px] border-[#181818] bg-[#ffe45c] text-center shadow-[2px_2px_0_#181818] font-black";
                } else {
                    btn.className = "py-1.5 px-1 rounded-lg border-[2px] border-[#181818] bg-white text-center shadow-[2px_2px_0_#181818] font-bold text-slate-600";
                }
            });
            loadLeaderboardData(count);
        }

        function parseDurationToSeconds(value) {
            if (value === null || value === undefined || value === '-' || value === '') return Number.POSITIVE_INFINITY;
            const text = String(value).trim();
            const hm = text.match(/(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s\s*)?/i);
            if (!hm || (!hm[1] && !hm[2] && !hm[3])) return Number.POSITIVE_INFINITY;
            return (Number(hm[1] || 0) * 3600) + (Number(hm[2] || 0) * 60) + Number(hm[3] || 0);
        }

        function formatLeaderboardDateTime(value) {
            if (!value) return '';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return '';
            return d.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        function formatLeaderboardClock(value) {
            if (!value) return '';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return '';
            return d.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }

        function formatLeaderboardDateRange(item) {
            let start = item.startedAt || item.startTime || item.attemptedAt || '';
            let end = item.finishedAt || item.endTime || item.completedAt || item.completed_at || item.updatedAt || '';

            // Kompatibel dengan data lama yang hanya punya waktu selesai + durasi.
            if (!start && end && item.duration) {
                const endMs = new Date(end).getTime();
                const durationSec = parseDurationToSeconds(item.duration);
                if (Number.isFinite(endMs) && Number.isFinite(durationSec)) {
                    start = new Date(endMs - (durationSec * 1000)).toISOString();
                }
            }
            if (!end && start && item.duration) {
                const startMs = new Date(start).getTime();
                const durationSec = parseDurationToSeconds(item.duration);
                if (Number.isFinite(startMs) && Number.isFinite(durationSec)) {
                    end = new Date(startMs + (durationSec * 1000)).toISOString();
                }
            }

            const date = formatLeaderboardDateTime(start || end);
            const startClock = formatLeaderboardClock(start);
            const endClock = formatLeaderboardClock(end);

            if (date && startClock && endClock) {
                return `<i class="fa-regular fa-calendar-days text-slate-400 mr-1"></i>${date}<span class="mx-1">•</span><i class="fa-regular fa-clock text-slate-400 mr-1"></i>${startClock} - ${endClock}`;
            }
            if (date && startClock) {
                return `<i class="fa-regular fa-calendar-days text-slate-400 mr-1"></i>${date}<span class="mx-1">•</span><i class="fa-regular fa-clock text-slate-400 mr-1"></i>${startClock}`;
            }
            if (date) return `<i class="fa-regular fa-calendar-days text-slate-400 mr-1"></i>${date}`;
            return '<span class="text-slate-400">Waktu belum tersimpan</span>';
        }

        async function loadLeaderboardData(filterCount) {
            const listEl = document.getElementById('leaderboard-list');
            listEl.innerHTML = '<p class="text-center text-xs text-slate-500 py-4 font-bold">Mengambil data peringkat...</p>';

            const { data, error } = await window.supabaseClient.from('Jft-Basic').select('*');
            if (error) {
                listEl.innerHTML = `<p class="text-center text-xs text-red-500 py-2">Gagal memuat: ${escapeHtml(error.message)}</p>`;
                return;
            }

            // Setiap PERANGKAT + JUMLAH SOAL adalah entri leaderboard terpisah.
            // Jangan dedupe berdasarkan akun saja: satu akun dapat memiliki beberapa
            // perangkat (max_users), sehingga skor siswa lain pada perangkat berbeda
            // tidak boleh terlihat seperti tertimpa.
            const allScores = [];

            (data || []).forEach(user => {
                let scores = user.device_scores || {};
                if (typeof scores === 'string') {
                    try { scores = JSON.parse(scores); } catch (_) { scores = {}; }
                }
                if (!scores || typeof scores !== 'object' || Array.isArray(scores)) return;

                Object.entries(scores).forEach(([storageKey, s], index) => {
                    if (!s || s.score === undefined || s.score === null) return;

                    let sCount = Number(s.qCount || s.questionCount || 0);
                    if (!sCount) {
                        const keyMatch = String(storageKey).match(/(?:^|__)q(\d+)$/i);
                        if (keyMatch) sCount = Number(keyMatch[1]);
                    }
                    if (!sCount) sCount = 10;
                    if (sCount !== Number(filterCount)) return;

                    const item = {
                        accountId: String(user.id),
                        deviceId: String(s.device_id || String(storageKey).split('__')[0] || 'UNKNOWN'),
                        storageKey,
                        name: s.name || user.name || 'Siswa',
                        score: Number(s.score) || 0,
                        level: s.level || '-',
                        duration: s.duration || '-',
                        durationSeconds: parseDurationToSeconds(s.duration),
                        os: s.os || 'Lainnya',
                        startedAt: s.startedAt || s.startTime || s.started_at || s.attemptedAt || null,
                        finishedAt: s.finishedAt || s.endTime || s.finished_at || s.completedAt || s.completed_at || null,
                        updatedAt: s.updatedAt || s.finishedAt || s.endTime || s.completedAt || s.completed_at || s.updated_at || s.startedAt || s.startTime || null,
                        legacyIndex: index
                    };

                    allScores.push(item);
                });
            });

            allScores.sort((a, b) => {
                const scoreDiff = b.score - a.score;
                if (scoreDiff !== 0) return scoreDiff;

                const durationDiff = a.durationSeconds - b.durationSeconds;
                if (durationDiff !== 0) return durationDiff;

                const aStamp = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                const bStamp = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                if (bStamp !== aStamp) return bStamp - aStamp;

                return String(a.storageKey).localeCompare(String(b.storageKey));
            });

            if (allScores.length === 0) {
                listEl.innerHTML = `<p class="text-center text-xs text-slate-400 py-4 font-medium italic">Belum ada data untuk kategori ${filterCount} soal.</p>`;
                return;
            }

            listEl.innerHTML = '';

            allScores.slice(0, 15).forEach((item, index) => {
                let rankClass = 'bg-slate-100 text-slate-700';
                let rankIcon = `<span class="font-black text-xs">#${index + 1}</span>`;

                if (index === 0) {
                    rankClass = 'rank-badge-1';
                    rankIcon = '<i class="fa-solid fa-crown text-amber-600 text-xs"></i> 1';
                } else if (index === 1) {
                    rankClass = 'rank-badge-2';
                    rankIcon = '<i class="fa-solid fa-medal text-slate-600 text-xs"></i> 2';
                } else if (index === 2) {
                    rankClass = 'rank-badge-3';
                    rankIcon = '<i class="fa-solid fa-medal text-amber-800 text-xs"></i> 3';
                }

                listEl.innerHTML += `
                    <div class="leaderboard-card p-2.5 rounded-xl flex items-center justify-between text-xs bg-white">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center font-black ${rankClass} shrink-0">
                                ${rankIcon}
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-black text-slate-800 uppercase truncate">${escapeHtml(item.name)}</div>
                                <div class="text-[10px] text-slate-500 flex items-center flex-wrap gap-x-1">
                                    <span><i class="fa-solid fa-mobile-screen-button"></i> ${escapeHtml(item.os)}</span>
                                    <span>•</span>
                                    <span><i class="fa-regular fa-clock"></i> ${escapeHtml(item.duration)}</span>
                                </div>
                                <div class="text-[10px] text-slate-400 mt-0.5 leading-4 whitespace-normal">
                                    ${formatLeaderboardDateRange(item)}
                                </div>
                            </div>
                        </div>
                        <div class="text-right ml-2 shrink-0">
                            <div class="font-black text-brand-600 text-sm">${item.score} <span class="text-[10px] text-slate-400">Pts</span></div>
                            <div class="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">${escapeHtml(item.level)}</div>
                        </div>
                    </div>
                `;
            });
        }


        async function clearAllDevices(userId) {
            showCustomConfirm("Yakin ingin mereset dan menghapus SEMUA perangkat yang terhubung ke akun ini?", async () => {
                const { error } = await window.supabaseClient.from('Jft-Basic').update({
                    registered_devices: [],
                    device_scores: {}
                }).eq('id', userId);

                if (error) {
                    showCustomConfirm("Gagal mereset: " + error.message, null, "Oke");
                } else {
                    loadAdminData(); 
                }
            }, "Reset Semua");
        }
        
        function removeDeviceSession(userId, deviceId) {
            showCustomConfirm("Yakin ingin menghapus perangkat ini dari akun?", async () => {
                const { data: user, error } = await window.supabaseClient.from('Jft-Basic').select('*').eq('id', userId).single();
                if (error) {
                    showCustomConfirm("Gagal mengambil data: " + error.message, null, "Oke");
                    return;
                }

                let devices = user.registered_devices || [];
                if (typeof devices === 'string') devices = JSON.parse(devices);
                devices = devices.filter(d => d !== deviceId);

                let scores = user.device_scores || {};
                if (typeof scores === 'string') scores = JSON.parse(scores);
                Object.keys(scores).forEach(key => {
                    const entry = scores[key];
                    if (key === deviceId || (entry && entry.device_id === deviceId)) {
                        delete scores[key];
                    }
                });

                const { error: updateError } = await window.supabaseClient.from('Jft-Basic').update({
                    registered_devices: devices,
                    device_scores: scores
                }).eq('id', userId);

                if (updateError) {
                    showCustomConfirm("Gagal menghapus: " + updateError.message, null, "Oke");
                } else {
                    loadAdminData(); 
                }
            }, "Hapus Perangkat");
        }

        async function finishQuiz() {
            clearInterval(state.timerInterval);
            state.endTime = Date.now();
            let cor = 0, mis = [];
            state.questions.forEach((q, i) => { if(state.userAnswers[i] === q.answer) cor++; else mis.push({q, a: state.userAnswers[i], n: i+1}); });

            const score = Math.round(10 + ((cor/state.questions.length)*(250-10)));
            const lvl = score<145?"Below A1":score<175?"A1":score<200?"A2.1":"A2.2(A2)";

            let hist = JSON.parse(localStorage.getItem('jft_history')||'[]');
            hist.unshift({
                id: Date.now(),
                date: new Date().toISOString(),
                startTime: state.startTime ? new Date(state.startTime).toISOString() : null,
                endTime: new Date(state.endTime).toISOString(),
                score,
                level: lvl,
                correct: cor,
                total: state.questions.length,
                duration: state.startTime ? `${Math.floor(Math.max(0, state.endTime - state.startTime)/1000/60)}m ${Math.floor((Math.max(0, state.endTime - state.startTime)/1000)%60)}s` : '-'
            });
            localStorage.setItem('jft_history', JSON.stringify(hist.slice(0,20)));

            const resultRegNum = `PRACTICE-${Math.floor(Math.random()*900000+100000)}`;
            const currentUserName = localStorage.getItem('jft_user_name') || "SISWA";

            const secStats = {};
            SECTIONS.forEach(s => secStats[s.id] = { total: 0, correct: 0 });
            state.questions.forEach((q, i) => {
                if(secStats[q.section]) {
                    secStats[q.section].total++;
                    if(state.userAnswers[i] === q.answer) secStats[q.section].correct++;
                }
            });

            const userId = localStorage.getItem('jft_user_id');
            const deviceId = localStorage.getItem('jft_device_id');
            if (userId && deviceId && window.supabaseClient) {
                const elapsedMs = state.startTime ? Math.max(0, state.endTime - state.startTime) : 0;
                const sTime = Math.floor(elapsedMs / 1000);
                const durationText = `${Math.floor(sTime/60)}m ${sTime%60}s`;

                const ua = navigator.userAgent;
                let os = "Lainnya";
                if (/android/i.test(ua)) os = "Android";
                else if (/iPad|iPhone|iPod/.test(ua)) os = "iOS";
                else if (/windows/i.test(ua)) os = "Windows";
                else if (/mac/i.test(ua)) os = "Mac";

                try {
                    const { data, error: readError } = await window.supabaseClient
                        .from('Jft-Basic')
                        .select('device_scores')
                        .eq('id', userId)
                        .single();

                    if (!readError) {
                        let scores = data?.device_scores || {};
                        if (typeof scores === 'string') {
                            try { scores = JSON.parse(scores); } catch (_) { scores = {}; }
                        }
                        if (!scores || typeof scores !== 'object' || Array.isArray(scores)) scores = {};

                        // Satu device + satu jumlah soal = satu hasil aktif.
                        // Pengulangan jumlah soal yang sama akan menimpa record ini.
                        // Jumlah soal berbeda tetap disimpan terpisah.
                        const storageKey = `${deviceId}__q${state.questions.length}`;
                        const startIso = state.startTime ? new Date(state.startTime).toISOString() : null;
                        const endIso = new Date(state.endTime).toISOString();

                        scores[storageKey] = {
                            device_id: deviceId,
                            name: currentUserName,
                            score: score,
                            level: lvl,
                            duration: durationText,
                            os: os,
                            qCount: state.questions.length,
                            startedAt: startIso,
                            finishedAt: endIso,
                            completedAt: endIso,
                            updatedAt: endIso,
                            attemptId: storageKey
                        };

                        // Simpan dengan merge + verifikasi ulang. Ini mencegah update dari
                        // dua perangkat yang selesai hampir bersamaan saling menimpa data.
                        let mergedSaved = false;
                        let lastSaveError = null;

                        for (let attempt = 0; attempt < 4 && !mergedSaved; attempt++) {
                            if (attempt > 0) {
                                const { data: latestRow, error: latestReadError } = await window.supabaseClient
                                    .from('Jft-Basic')
                                    .select('device_scores')
                                    .eq('id', userId)
                                    .single();

                                if (latestReadError) {
                                    lastSaveError = latestReadError;
                                    continue;
                                }

                                let latestScores = latestRow?.device_scores || {};
                                if (typeof latestScores === 'string') {
                                    try { latestScores = JSON.parse(latestScores); } catch (_) { latestScores = {}; }
                                }
                                if (!latestScores || typeof latestScores !== 'object' || Array.isArray(latestScores)) latestScores = {};

                                // Prioritaskan data terbaru dari server, lalu pasang entri kita.
                                scores = { ...latestScores, [storageKey]: {
                                    ...(latestScores[storageKey] || {}),
                                    device_id: deviceId,
                                    name: currentUserName,
                                    score,
                                    level: lvl,
                                    duration: durationText,
                                    os,
                                    qCount: state.questions.length,
                                    startedAt: startIso,
                                    finishedAt: endIso,
                                    completedAt: endIso,
                                    updatedAt: endIso,
                                    attemptId: storageKey
                                }};
                            }

                            const { error: saveError } = await window.supabaseClient
                                .from('Jft-Basic')
                                .update({ device_scores: scores })
                                .eq('id', userId);

                            if (saveError) {
                                lastSaveError = saveError;
                                continue;
                            }

                            const { data: verifyRow, error: verifyError } = await window.supabaseClient
                                .from('Jft-Basic')
                                .select('device_scores')
                                .eq('id', userId)
                                .single();

                            if (verifyError) {
                                lastSaveError = verifyError;
                                continue;
                            }

                            let verifyScores = verifyRow?.device_scores || {};
                            if (typeof verifyScores === 'string') {
                                try { verifyScores = JSON.parse(verifyScores); } catch (_) { verifyScores = {}; }
                            }

                            const verifiedEntry = verifyScores && !Array.isArray(verifyScores) ? verifyScores[storageKey] : null;
                            const verifiedAt = verifiedEntry?.updatedAt || null;
                            const verifiedScore = verifiedEntry?.score;
                            mergedSaved = String(verifiedAt || '') === String(endIso) && Number(verifiedScore) === Number(score);

                            if (!mergedSaved && attempt === 3) {
                                lastSaveError = new Error('Verifikasi penyimpanan skor gagal setelah beberapa percobaan.');
                            }
                        }

                        if (!mergedSaved && lastSaveError) {
                            console.error('Gagal menyimpan skor leaderboard:', lastSaveError);
                        }
                    } else {
                        console.error('Gagal membaca skor leaderboard:', readError);
                    }
                } catch (saveException) {
                    console.error('Gagal menyimpan data leaderboard:', saveException);
                }
            }

            const resultSnapshot = {
                id: Date.now(),
                date: new Date().toISOString(),
                regNum: resultRegNum,
                name: currentUserName,
                score,
                level: lvl,
                correct: cor,
                total: state.questions.length,
                duration: state.startTime ? `${Math.floor(Math.max(0, state.endTime - state.startTime)/1000/60)}m ${Math.floor((Math.max(0, state.endTime - state.startTime)/1000)%60)}s` : '-',
                startTime: state.startTime ? new Date(state.startTime).toISOString() : null,
                endTime: new Date(state.endTime).toISOString(),
                mistakes: mis.map(m => ({ q: m.q, a: m.a, n: m.n })),
                sections: secStats
            };
            localStorage.setItem('jft_last_result', JSON.stringify(resultSnapshot));
            localStorage.removeItem(getQuizStorageKey());

            navigate('result');
        }

                async function loadAdminData() {
            const tbody = document.getElementById('admin-user-table');
            if(!tbody) return;
            tbody.innerHTML = '<tr><td colspan="5" class="px-5 py-10 text-center font-black text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i> Memuat data akun...</td></tr>';
            
            const { data, error } = await window.supabaseClient.from('Jft-Basic').select('*').order('created_at', { ascending: false });
            if (error) { 
                tbody.innerHTML = `<tr><td colspan="5" class="px-5 py-6 text-center text-red-500 font-bold">Gagal memuat data: ${error.message}</td></tr>`; 
                return; 
            }
            
            tbody.innerHTML = '';
            data.forEach(user => {
                let devices = user.registered_devices || [];
                if (typeof devices === 'string') devices = JSON.parse(devices);
                
                let scores = user.device_scores || {};
                if (typeof scores === 'string') scores = JSON.parse(scores);
                
                const max = user.max_users || 1;
                const isFull = devices.length >= max;
                
                let quotaBadge = `<div class="flex flex-col items-center gap-1.5"><span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 border-[2px] border-emerald-400 rounded-lg text-xs font-black shadow-[2px_2px_0_#181818]">${devices.length} / ${max} Aktif</span>`;
                if (isFull && user.role !== 'admin') {
                    quotaBadge = `<div class="flex flex-col items-center gap-1.5"><span class="px-2.5 py-1 bg-rose-100 text-rose-800 border-[2px] border-rose-400 rounded-lg text-xs font-black shadow-[2px_2px_0_#181818]">Penuh (${devices.length}/${max})</span>`;
                }
                if (user.role === 'admin') {
                    quotaBadge = `<span class="text-slate-400 font-bold text-xs bg-slate-100 px-2 py-1 rounded border">Unlimited</span>`;
                } else if (devices.length > 0) {
                    quotaBadge += `<button onclick="clearAllDevices('${user.id}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border-[1.5px] border-rose-300 rounded-md text-[10px] font-bold transition shadow-sm" title="Hapus semua sesi perangkat"><i class="fa-solid fa-rotate-left mr-1"></i> Reset Sesi</button>`;
                }
                quotaBadge += `</div>`;

                let scoreHTML = '';
                if (user.role !== 'admin') {
                    if (devices.length === 0) {
                        scoreHTML = `<div class="text-[11px] text-slate-400 italic mt-1.5 bg-slate-50 p-2 rounded-lg border border-dashed border-slate-300">Belum ada perangkat/siswa yang login.</div>`;
                    } else {
                        scoreHTML = `<div class="mt-2.5 space-y-2">`;
                        devices.forEach((dev, idx) => {
                            const deviceAttempts = Object.values(scores).filter(s => s && s.device_id === dev);
                            const s = deviceAttempts.length
                                ? deviceAttempts.sort((a, b) => new Date(b.completedAt || b.completed_at || 0) - new Date(a.completedAt || a.completed_at || 0))[0]
                                : scores[dev]; // dukung data lama
                            // Di sinilah nama yang diketik siswa saat latihan (seperti "Raihan Fitri") akan muncul rapi!
                            const activeName = s ? s.name : `Perangkat #${idx + 1}`;
                            const deviceOs = s ? s.os : 'Web Browser';
                            const userScore = s ? s.score : '-';
                            const duration = s ? s.duration : '-';

                            scoreHTML += `
                            <div class="text-xs bg-[#f8f3e8] p-2.5 rounded-xl border-[2px] border-[#181818] shadow-[2px_2px_0_#181818] flex justify-between items-center">
                                <div class="space-y-0.5">
                                    <div class="font-black text-[#181818] flex items-center gap-1.5">
                                        <i class="fa-solid fa-user-tag text-brand-600"></i> <span class="uppercase">${activeName}</span>
                                    </div>
                                    <div class="text-slate-500 text-[10px] font-bold">
                                        <i class="fa-solid fa-mobile-screen-button text-slate-400 mr-0.5"></i> ${deviceOs} &bull; <i class="fa-regular fa-clock ml-1"></i> ${duration}
                                    </div>
                                    <div class="pt-1 flex items-center gap-2">
                                        <span class="bg-[#ffe45c] text-[#181818] px-2 py-0.5 rounded font-black text-[10px] border border-[#181818]">Skor: ${userScore} Pts</span>
                                    </div>
                                </div>
                                <button onclick="removeDeviceSession('${user.id}', '${dev}')" class="text-rose-600 hover:text-rose-800 p-2 bg-white border-[2px] border-[#181818] rounded-lg shadow-[2px_2px_0_#181818] hover:-translate-y-0.5 transition-all text-xs" title="Hapus sesi perangkat ini">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>`;
                        });
                        scoreHTML += `</div>`;
                    }
                }

                tbody.innerHTML += `
                    <tr class="hover:bg-[#fffcf4] transition">
                        <td class="px-5 py-4 border-r-[2px] border-b-[2px] border-[#181818] align-top w-2/5">
                            <div class="font-black text-base text-[#181818] flex items-center gap-2">
                                <i class="fa-solid fa-id-card text-brand-500"></i> ${user.name}
                            </div>
                            <div class="text-xs text-slate-500 font-medium mb-1">${user.email && user.email !== '-' ? user.email : 'Tanpa email terdaftar'}</div>
                            ${scoreHTML}
                        </td>
                        <td class="px-5 py-4 font-mono text-brand-700 font-black border-r-[2px] border-b-[2px] border-[#181818] align-top pt-5 text-sm">
                            <span class="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">${user.auth_code}</span>
                        </td>
                        <td class="px-5 py-4 text-center border-r-[2px] border-b-[2px] border-[#181818] align-top pt-4">
                            ${quotaBadge}
                        </td>
                        <td class="px-5 py-4 uppercase text-xs font-black border-r-[2px] border-b-[2px] border-[#181818] align-top pt-5">
                            <span class="px-2.5 py-1 rounded-lg border-[2px] border-[#181818] ${user.role === 'admin' ? 'bg-[#ff7373] text-white shadow-[2px_2px_0_#181818]' : 'bg-[#43c9bd] text-[#181818] shadow-[2px_2px_0_#181818]'}">
                                ${user.role}
                            </span>
                        </td>
                        <td class="px-5 py-4 text-center border-b-[2px] border-[#181818] align-top pt-5">
                            <button onclick="deleteUser('${user.id}')" class="px-3 py-2 bg-rose-500 text-white border-[2px] border-[#181818] rounded-xl shadow-[3px_3px_0_#181818] hover:-translate-y-0.5 hover:bg-rose-600 transition-all text-xs font-black flex items-center justify-center gap-1.5 mx-auto" title="Hapus Akun">
                                <i class="fa-solid fa-trash-can"></i> Hapus
                            </button>
                        </td>
                    </tr>
                `;
            });
        }


        async function simpanUserBaru() {
            const name = document.getElementById('new-name').value.trim();
            const email = document.getElementById('new-email').value.trim();
            const authCode = document.getElementById('new-authcode').value.trim();
            const role = document.getElementById('new-role').value;
            const maxUsers = parseInt(document.getElementById('new-max-users').value) || 1;
            
            if (!name || !authCode) { 
                showCustomConfirm("Nama dan Auth Code wajib diisi!", null, "Oke"); 
                return; 
            }
            
            const btn = document.getElementById('btn-simpan-user');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
            
            const { error } = await window.supabaseClient.from('Jft-Basic').insert([{ 
                name, 
                email: email || '-', 
                auth_code: authCode, 
                role, 
                status: 'active',
                max_users: maxUsers,
                registered_devices: [],
                device_scores: {} 
            }]);
            
            if (error) {
                showCustomConfirm("Gagal: " + error.message, null, "Oke");
            } else { 
                toggleAddUserForm(); 
                loadAdminData(); 
            }
            
            btn.disabled = false;
            btn.innerHTML = 'Simpan Data';
        }

        function getChatIdentity() {
            const userId = localStorage.getItem('jft_user_id');
            const deviceId = getOrCreateDeviceId();
            return userId ? `${userId}:${deviceId}` : deviceId;
        }

        function getChatNameStorageKey() {
            const userId = localStorage.getItem('jft_user_id') || 'guest';
            const deviceId = getOrCreateDeviceId();
            return `jft_custom_name_${userId}_${deviceId}`;
        }

        function getAdminChatNameStorageKey() {
            // Nama admin disimpan berdasarkan ID akun, bukan device ID.
            // Jadi nama tetap bertahan setelah reload / buka ulang web.
            const userId = localStorage.getItem('jft_user_id') || 'guest';
            return `jft_admin_chat_name_${userId}`;
        }

        function getLegacyAdminChatNameStorageKey() {
            const userId = localStorage.getItem('jft_user_id') || 'guest';
            const deviceId = getOrCreateDeviceId();
            return `jft_admin_chat_name_${userId}_${deviceId}`;
        }

        function getAdminChatName() {
            const stableKey = getAdminChatNameStorageKey();
            let name = (localStorage.getItem(stableKey) || '').trim().toUpperCase();

            if (!name && String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase() === 'admin') {
                // Cari nama dari SEMUA key lama milik akun ini, bukan hanya device aktif.
                // Ini membuat migrasi tetap berhasil walaupun device ID versi lama berubah.
                const prefix = `jft_admin_chat_name_${localStorage.getItem('jft_user_id') || 'guest'}_`;
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key || !key.startsWith(prefix)) continue;
                    const candidate = (localStorage.getItem(key) || '').trim().toUpperCase();
                    if (candidate) { name = candidate; break; }
                }
                if (name) localStorage.setItem(stableKey, name);
            }

            return name;
        }

        function getCurrentChatName() {
            const role = String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase();

            if (role === 'admin') {
                let adminName = getAdminChatName();
                if (!adminName) {
                    try {
                        adminName = (localStorage.getItem(getLegacyAdminChatNameStorageKey()) || '').trim().toUpperCase();
                        if (adminName) localStorage.setItem(getAdminChatNameStorageKey(), adminName);
                    } catch (_) {}
                }
                return adminName || 'ADMIN';
            }

            const saved = (
                localStorage.getItem(getChatNameStorageKey()) || ''
            ).trim().toUpperCase();

            return saved || 'USER1';
        }

        function updateAdminChatNameDisplay() {
            const el = document.getElementById('admin-chat-name-display');
            if (!el) return;
            el.textContent = getAdminChatName() || 'Belum diatur';
        }

        function openAdminChatNameModal(force = false) {
            if (String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase() !== 'admin') return;
            const modal = document.getElementById('admin-chat-name-modal');
            const input = document.getElementById('admin-chat-name-input');
            const error = document.getElementById('admin-chat-name-error');
            if (!modal || !input) return;

            input.value = getAdminChatName();
            if (error) { error.textContent = ''; error.classList.add('hidden'); }
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => input.focus(), 100);
        }

        function closeAdminChatNameModal() {
            const modal = document.getElementById('admin-chat-name-modal');
            if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
        }

        let adminChatOpenAfterName = false;

        async function saveAdminChatName() {
            const input = document.getElementById('admin-chat-name-input');
            const error = document.getElementById('admin-chat-name-error');
            if (!input) return;

            const name = input.value.trim().toUpperCase();
            if (!name) {
                if (error) { error.textContent = 'Nama admin wajib diisi.'; error.classList.remove('hidden'); }
                input.focus();
                return;
            }

            if (name.length < 2) {
                if (error) { error.textContent = 'Nama minimal 2 karakter.'; error.classList.remove('hidden'); }
                input.focus();
                return;
            }

            localStorage.setItem(getAdminChatNameStorageKey(), name);
            try { localStorage.setItem(getLegacyAdminChatNameStorageKey(), name); } catch (_) {}
            updateAdminChatNameDisplay();

            const shouldOpenChat = adminChatOpenAfterName;
            adminChatOpenAfterName = false;

            const currentNameEl = document.getElementById('chat-current-name');
            if (currentNameEl) currentNameEl.textContent = getCurrentChatName();

            closeAdminChatNameModal();
            showToast('Identitas Admin', `Nama Global Chat sekarang ${name}.`);

            if (shouldOpenChat) {
                await toggleGlobalChat();
            }
        }

        async function openAdminGlobalChat() {
            const role = String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase();
            if (role !== 'admin') {
                showToast('Akses Admin', 'Sesi admin tidak terdeteksi. Silakan login admin kembali.', true);
                return;
            }

            // Pastikan modal nama tidak menghalangi pembukaan room.
            if (!getAdminChatName()) {
                adminChatOpenAfterName = true;
                openAdminChatNameModal(true);
                return;
            }

            const modal = document.getElementById('global-chat-modal');
            if (!modal) {
                showToast('Global Chat', 'Elemen room chat tidak ditemukan di halaman.', true);
                return;
            }

            // Buka room TERLEBIH DAHULU. Proses Supabase dijalankan setelahnya,
            // jadi room tetap tampil walaupun query status/pesan sedang gagal.
            modal.classList.remove('hidden');
            const currentNameEl = document.getElementById('chat-current-name');
            if (currentNameEl) currentNameEl.textContent = getCurrentChatName();
            hideChatNotificationDot();

            try {
                await checkRoomStatus();
                await fetchChatMessages();
                subscribeToGlobalChat();
            } catch (err) {
                console.error('Global Chat init error:', err);
                showToast('Global Chat', 'Room terbuka, tetapi data chat gagal dimuat.', true);
            }
        }

        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('admin-chat-name-modal');
            if (!modal || modal.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeAdminChatNameModal();
            if (e.key === 'Enter' && e.target?.id === 'admin-chat-name-input') {
                e.preventDefault();
                saveAdminChatName();
            }
        });

        function isCurrentDeviceMessage(msg) {
            const senderId = String(msg?.sender_id || '');
            const myIdentity = String(getChatIdentity());
            return !!senderId && senderId === myIdentity;
        }

        function checkSession() {
            const userId = localStorage.getItem('jft_user_id');
            if (!userId) {
                navigate('auth');
                return;
            }

            const role = String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase();
            if (role === 'admin') {
                navigate('admin');
                setTimeout(() => {
                    updateAdminChatNameDisplay();
                    const currentNameEl = document.getElementById('chat-current-name');
                    if (currentNameEl) currentNameEl.textContent = getCurrentChatName();
                }, 0);
                return;
            }

            navigate('home');

            const accountName =
                localStorage.getItem('jft_account_name') || 'SISWA';

            const customName = (
                localStorage.getItem(getChatNameStorageKey()) || ''
            ).trim().toUpperCase();

            const nameInput =
                document.getElementById('user-name-input');

            if (nameInput) {
                nameInput.value = customName || accountName;
            }

            if (customName) {
                localStorage.setItem('jft_display_name', customName);
                localStorage.setItem('jft_user_name', customName);
            } else {
                localStorage.removeItem('jft_display_name');
                localStorage.removeItem('jft_user_name');

                setTimeout(() => {
                    showRequiredNameModal();
                }, 200);
            }

            sessionStorage.removeItem('show_name_prompt');
        }


        function handleNameChoice(choice) {
            const nameModal = document.getElementById('custom-name-modal');
            if (nameModal) {
                nameModal.classList.remove('flex');
                nameModal.classList.add('hidden');
            }

            const savedCustomName = (
                localStorage.getItem(getChatNameStorageKey()) || ''
            ).trim().toUpperCase();

            const input = document.getElementById('user-name-input');

            if (choice === 'keep' && savedCustomName) {
                if (input) input.value = savedCustomName;
            } else {
                if (input) {
                    input.value = '';
                    input.focus();
                }
            }
        }

        async function saveChatName(newName, options = {}) {
            const normalizedName = String(newName || '').trim().toUpperCase();
            const accountName = (
                localStorage.getItem('jft_account_name') || ''
            ).trim().toUpperCase();

            if (!normalizedName) {
                throw new Error('Nama wajib diisi.');
            }

            if (normalizedName === accountName) {
                throw new Error('Nama tidak boleh sama dengan nama akun dari admin.');
            }

            const identity = getChatIdentity();

            // Ubah semua pesan MILIK DEVICE ini sehingga nama baru
            // langsung terlihat di semua perangkat yang membuka room.
            const { error: chatError } = await window.supabaseClient
                .from('global_chats')
                .update({
                    sender_name: normalizedName
                })
                .eq('sender_id', identity);

            if (chatError) throw chatError;

            // Sinkronkan nama perangkat ini ke skor leaderboard yang sudah tersimpan.
            const userId = localStorage.getItem('jft_user_id');
            const deviceId = getOrCreateDeviceId();

            if (userId && deviceId) {
                const { data: scoreRow, error: scoreReadError } =
                    await window.supabaseClient
                        .from('Jft-Basic')
                        .select('device_scores')
                        .eq('id', userId)
                        .single();

                if (scoreReadError) throw scoreReadError;

                let scores = scoreRow?.device_scores || {};
                if (typeof scores === 'string') {
                    try {
                        scores = JSON.parse(scores);
                    } catch (_) {
                        scores = {};
                    }
                }

                if (scores && typeof scores === 'object' && !Array.isArray(scores)) {
                    let changed = false;
                    Object.entries(scores).forEach(([scoreKey, scoreValue]) => {
                        if (!scoreValue || typeof scoreValue !== 'object') return;
                        const scoreDeviceId = String(scoreValue.device_id || String(scoreKey).split('__')[0] || '');
                        if (scoreDeviceId === String(deviceId)) {
                            scores[scoreKey] = { ...scoreValue, name: normalizedName };
                            changed = true;
                        }
                    });

                    if (changed) {
                        const { error: scoreUpdateError } =
                            await window.supabaseClient
                                .from('Jft-Basic')
                                .update({ device_scores: scores })
                                .eq('id', userId);

                        if (scoreUpdateError) throw scoreUpdateError;
                    }
                }
            }

            localStorage.setItem(
                getChatNameStorageKey(),
                normalizedName
            );
            localStorage.setItem('jft_display_name', normalizedName);
            localStorage.setItem('jft_user_name', normalizedName);

            const nameInput = document.getElementById('user-name-input');
            if (nameInput) nameInput.value = normalizedName;

            const resultName = document.getElementById('res-name');
            if (resultName) resultName.textContent = normalizedName;

            const chatCurrentName = document.getElementById('chat-current-name');
            if (chatCurrentName) chatCurrentName.textContent = normalizedName;

            if (typeof fetchChatMessages === 'function') {
                await fetchChatMessages();
            }

            if (options.showToast !== false) {
                showToast('Berhasil', `Nama chat sekarang ${normalizedName}.`);
            }

            return normalizedName;
        }

        function showRequiredNameModal() {
            const modal = document.getElementById('custom-name-modal');
            const input = document.getElementById('required-custom-name');
            const error = document.getElementById('required-name-error');

            if (!modal || !input) return;

            const savedName = (
                localStorage.getItem(getChatNameStorageKey()) || ''
            ).trim().toUpperCase();

            input.value = savedName;

            if (error) {
                error.textContent = '';
                error.classList.add('hidden');
            }

            modal.classList.remove('hidden');
            modal.classList.add('flex');

            setTimeout(() => input.focus(), 100);
        }

        document.addEventListener('change', async (e) => {
            if (e.target.id !== 'user-name-input') return;

            const input = e.target;
            const newName = input.value.trim().toUpperCase();

            if (!newName) return;

            try {
                await saveChatName(newName);
            } catch (error) {
                console.error('Gagal mengganti nama:', error);
                input.value = getCurrentChatName();
                showToast('Gagal', error.message, true);
            }
        });

        async function saveRequiredCustomName() {
            const input = document.getElementById('required-custom-name');
            const error = document.getElementById('required-name-error');

            if (!input || !error) return;

            const name = input.value.trim().toUpperCase();

            if (!name) {
                error.textContent = 'Nama wajib diisi.';
                error.classList.remove('hidden');
                input.focus();
                return;
            }

            try {
                await saveChatName(name, { showToast: true });

                const modal = document.getElementById('custom-name-modal');
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            } catch (err) {
                error.textContent = err.message;
                error.classList.remove('hidden');
                input.focus();
            }
        }

        function toggleAddUserForm() { document.getElementById('add-user-form').classList.toggle('hidden'); }
        
        let confirmCallback = null;

        function showCustomConfirm(message, callback, okText = "Ya") {
            const modal = document.getElementById('custom-confirm-modal');
            const box = document.getElementById('custom-confirm-box');
            document.getElementById('custom-confirm-msg').textContent = message;
            
            const btnOk = document.getElementById('btn-confirm-ok');
            btnOk.textContent = okText;
            btnOk.onclick = () => { hideCustomConfirm(); if (callback) callback(); };
            
            modal.classList.remove('hidden'); modal.classList.add('flex');
            setTimeout(() => { box.classList.remove('scale-95', 'opacity-0'); box.classList.add('scale-100', 'opacity-100'); }, 10);
        }

        function hideCustomConfirm() {
            const modal = document.getElementById('custom-confirm-modal');
            const box = document.getElementById('custom-confirm-box');
            box.classList.remove('scale-100', 'opacity-100'); box.classList.add('scale-95', 'opacity-0');
            setTimeout(() => { modal.classList.add('hidden'); modal.classList.remove('flex'); }, 200);
        }

        function deleteUser(uid) {
            showCustomConfirm("Yakin ingin menghapus user ini?", async () => {
                await window.supabaseClient.from('Jft-Basic').delete().eq('id', uid);
                loadAdminData();
            }, "Hapus User");
        }

        function handleLogout() {
            showCustomConfirm("Yakin ingin keluar dari akun ini?", () => {
                localStorage.removeItem('jft_user_id');
                localStorage.removeItem('jft_user_role');
                localStorage.removeItem('jft_display_name');
                localStorage.removeItem('jft_user_name');
                isEditingMode = false;
                editingMessageId = null;
                cancelReply();
                const loginPassword = document.getElementById('login-password');
                if (loginPassword) loginPassword.value = '';
                navigate('auth');
            }, "Keluar");
        }

        function confirmQuit() {
            showCustomConfirm("Akhiri latihan lebih awal?", () => {
                if(window.speechSynthesis) window.speechSynthesis.cancel();
                navigate('home');
            }, "Akhiri");
        }

        function clearHistory() {
            showCustomConfirm("Hapus semua riwayat latihan?", () => {
                localStorage.removeItem('jft_history');
                renderHistory();
            }, "Hapus Semua");
        }

        let adminQuestionPage = 1;
        const questionsPerPage = 50;

        function switchAdminTab(tabName) {
            const vUsers = document.getElementById('admin-view-users');
            const vQs = document.getElementById('admin-view-questions');
            const bUsers = document.getElementById('tab-users');
            const bQs = document.getElementById('tab-questions');

            if (tabName === 'users') {
                vUsers.classList.remove('hidden'); vQs.classList.add('hidden');
                bUsers.className = "bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
                bQs.className = "bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition";
            } else {
                vUsers.classList.add('hidden'); vQs.classList.remove('hidden');
                bUsers.className = "bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium transition";
                bQs.className = "bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition";
                
                adminQuestionPage = 1;
                renderAdminQuestions();
            }
        }
        
        // 1. Fungsi untuk mengecek dan menampilkan tombol Clear Chat jika user adalah Admin
function checkAdminChatFeature() {
    const adminControls = document.getElementById("admin-chat-controls");
    if (!adminControls) return;

    // Ambil data user yang sedang login dari localStorage (sesuaikan key-nya dengan aplikasi kamu)
    const currentUserRole = localStorage.getItem('jft_user_role') || ''; // atau 'role' dari data user
    const currentUserEmail = localStorage.getItem('jft_user_email') || '';

    // Tulis email admin kamu di sini atau cek berdasarkan role 'admin'
    const isAdmin = currentUserRole.toLowerCase() === 'admin' || currentUserEmail === 'email_admin_kamu@gmail.com';

    if (isAdmin) {
        adminControls.style.display = "block"; // Tampilkan tombol khusus admin
    } else {
        adminControls.style.display = "none";  // Sembunyikan jika bukan admin
    }
}

// Panggil fungsi ini setiap halaman chat dimuat atau setelah login berhasil
window.addEventListener('DOMContentLoaded', () => {
    checkAdminChatFeature();
});


// 2. Fungsi untuk menghapus semua pesan di database Supabase
// Fungsi untuk memunculkan notifikasi (Toast) yang modern
// 1. Fungsi Toast Notifikasi (Pastikan fungsi ini ada di file JS kamu)
// Fungsi Toast Notifikasi
function showToast(title, message, isError = false) {
    // Kompatibel dengan pemanggilan lama: showToast('pesan', 'success').
    if (arguments.length === 2 && (message === 'success' || message === 'error')) {
        isError = message === 'error';
        message = title;
        title = isError ? 'Gagal' : 'Berhasil';
    }

    const modal = document.getElementById('custom-toast-modal');
    if (modal) {
        const iconEl = document.getElementById('toast-icon');
        document.getElementById('toast-title').textContent = title || 'Informasi';
        document.getElementById('toast-message').textContent = message || '';

        if (iconEl) {
            iconEl.className = isError
                ? 'w-12 h-12 bg-[#ff7373] border-[2px] border-[#181818] rounded-xl flex items-center justify-center shadow-[3px_3px_0_#181818] text-xl mx-auto mb-3 text-white'
                : 'w-12 h-12 bg-[#ffe45c] border-[2px] border-[#181818] rounded-xl flex items-center justify-center shadow-[3px_3px_0_#181818] text-xl mx-auto mb-3 text-[#181818]';
            iconEl.innerHTML = isError
                ? '<i class="fa-solid fa-triangle-exclamation"></i>'
                : '<i class="fa-solid fa-circle-check"></i>';
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        return;
    }

    // Fallback jika modal toast tidak tersedia.
    let container = document.getElementById('custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'custom-toast-container';
        container.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `background:${isError ? '#ff7373' : '#43c9bd'};color:#181818;border:2px solid #181818;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:700;box-shadow:3px 3px 0 #181818;`;
    toast.textContent = `${title}: ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Logika Interaksi Modal dan Tombol Hapus
const modal = document.getElementById("custom-confirm-modal");
/// Menggunakan fungsi terisolasi agar variabel tidak bentrok dengan tombol Logout
(function() {
    const confirmModal = document.getElementById("jft-confirm-modal");
    const successModal = document.getElementById("jft-success-modal");
    const clearBtn = document.getElementById("jft-clear-chat-btn");
    const yesDeleteBtn = document.getElementById("jft-yes-delete-btn");
    const cancelBtn = document.getElementById("jft-cancel-btn");
    const successOkBtn = document.getElementById("jft-success-ok-btn");

    // Buka modal konfirmasi saat tombol Clear Chat diklik
    clearBtn?.addEventListener("click", () => {
        if (confirmModal) confirmModal.style.display = "flex";
    });

    // Tutup modal saat Batal diklik
    cancelBtn?.addEventListener("click", () => {
        if (confirmModal) confirmModal.style.display = "none";
    });

    // Eksekusi hapus Storage + database saat tombol Hapus diklik
    yesDeleteBtn?.addEventListener("click", async () => {
        if (confirmModal) confirmModal.style.display = "none";

        try {
            const { data: chatRows, error: readError } = await supabaseClient
                .from('global_chats')
                .select('id,file_path');
            if (readError) throw readError;

            const paths = (chatRows || []).map(row => row.file_path).filter(Boolean);
            if (paths.length && typeof window.deleteChatStoragePaths === 'function') {
                const storageResult = await window.deleteChatStoragePaths(paths);
                if (storageResult?.error) throw storageResult.error;
            }

            const { error } = await supabaseClient
                .from('global_chats')
                .delete()
                .neq('id', 0);

            if (error) throw error;

            const chatContainer = document.getElementById("chat-messages-container");
            if (chatContainer) chatContainer.innerHTML = "";

            if (successModal) successModal.style.display = "flex";
        } catch (err) {
            console.error("Gagal menghapus chat/file:", err);
            alert("Gagal menghapus chat atau file. Coba lagi.");
        }
    });

    // Tutup modal sukses saat OK diklik
    successOkBtn?.addEventListener("click", () => {
        if (successModal) successModal.style.display = "none";
    });
})();





// Fungsi Hapus Chat dengan Konfirmasi & Notifikasi Cantik
async function clearAllChats() {
    // Bisa pakai custom modal konfirmasi, atau konfirmasi standar tapi aman
    const confirmation = window.confirm("⚠️ Yakin ingin menghapus seluruh riwayat chat? Tindakan ini permanen.");
    if (!confirmation) return;

    try {
        const { data: chatRows, error: readError } = await supabaseClient
            .from('global_chats')
            .select('id,file_path');
        if (readError) throw readError;

        const paths = (chatRows || []).map(row => row.file_path).filter(Boolean);
        if (paths.length && typeof window.deleteChatStoragePaths === 'function') {
            const storageResult = await window.deleteChatStoragePaths(paths);
            if (storageResult?.error) throw storageResult.error;
        }

        const { error } = await supabaseClient
            .from('global_chats')
            .delete()
            .neq('id', 0);

        if (error) throw error;

        showToast("Semua riwayat chat berhasil dibersihkan!", "success");
        
        // Kosongkan tampilan chat lokal
        const chatContainer = document.getElementById("chat-messages-container");
        if (chatContainer) {
            chatContainer.innerHTML = "";
        }
    } catch (err) {
        console.error("Gagal menghapus chat:", err.message);
        showToast("Gagal menghapus chat. Coba lagi.", "error");
    }
}






        function renderAdminQuestions() {
            const qContainer = document.getElementById('admin-questions-list');
            if (!qContainer) return;
            if (!Array.isArray(QUESTION_BANK) || !QUESTION_BANK.length) {
                qContainer.innerHTML = '<div class="p-5 rounded-xl border bg-white text-sm font-bold text-slate-500">Bank soal belum dimuat. Coba muat ulang halaman admin.</div>';
                const countEl = document.getElementById('total-questions-count'); if (countEl) countEl.textContent = '0 Soal';
                return;
            }
            const safe = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
            document.getElementById('total-questions-count').textContent = `${QUESTION_BANK.length} Soal`;
            
            const totalPages = Math.max(1, Math.ceil(QUESTION_BANK.length / questionsPerPage));
            const startIdx = (adminQuestionPage - 1) * questionsPerPage;
            const endIdx = startIdx + questionsPerPage;
            
            const currentQs = QUESTION_BANK.slice(startIdx, endIdx);

            let html = currentQs.map(q => {
                const options = Array.isArray(q.options) ? q.options : [];
                const optionHtml = options.length
                    ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">${options.map((opt, idx) => `<div class="p-2 border rounded text-sm break-words ${idx===Number(q.answer)?'bg-green-100 border-green-500 font-bold text-green-700':''}">${safe(opt)}</div>`).join('')}</div>`
                    : `<div class="text-xs bg-amber-50 border border-amber-200 rounded p-3 mb-3 text-amber-800">Soal ini tidak memiliki pilihan ganda.</div>`;
                const visualText = q.visual ? [q.visual.title, q.visual.body].filter(Boolean).join(' — ') : '';
                return `
                <div class="bg-slate-50 border p-4 rounded-xl shadow-sm mb-3 min-w-0">
                    <div class="flex justify-between gap-2 mb-2">
                        <span class="text-xs font-bold bg-slate-200 px-2 py-1 rounded">ID: ${safe(q.id)}</span>
                        <span class="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded uppercase">${safe(q.section || 'umum')}</span>
                    </div>
                    <div class="japanese-text text-lg font-medium mb-3 whitespace-pre-wrap break-words">${safe(q.text || q.question || visualText || '(Teks soal kosong)')}</div>
                    ${optionHtml}
                    <div class="text-xs bg-white p-3 border rounded text-slate-600 whitespace-pre-wrap break-words"><strong>Penjelasan:</strong> ${safe(q.explanation || q.reason || 'Tidak ada penjelasan.')}</div>
                </div>`;
            }).join('');

            html += `
                <div class="flex justify-between items-center mt-6 bg-white p-3 rounded-xl border-[2px] border-slate-200 sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <button onclick="changeQuestionPage(-1)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition disabled:opacity-30 disabled:cursor-not-allowed" ${adminQuestionPage === 1 ? 'disabled' : ''}>
                        <i class="fa-solid fa-angle-left mr-1"></i> Sebelumnya
                    </button>
                    <span class="text-sm font-bold text-slate-500">Hal. ${adminQuestionPage} dari ${totalPages}</span>
                    <button onclick="changeQuestionPage(1)" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition disabled:opacity-30 disabled:cursor-not-allowed" ${adminQuestionPage === totalPages ? 'disabled' : ''}>
                        Selanjutnya <i class="fa-solid fa-angle-right ml-1"></i>
                    </button>
                </div>
            `;

            qContainer.innerHTML = html;
            qContainer.scrollTop = 0;
        }

        function changeQuestionPage(direction) {
            adminQuestionPage += direction;
            renderAdminQuestions();
        }

        function shuffleArray(array) {
            let currentIndex = array.length, randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            return array;
        }

        function getQuizSectionIndex(index) {
            const q = state.questions[index];
            if (!q) return -1;
            return SECTIONS.findIndex(s => s.id === q.section);
        }

function getNextSectionIndex(index) {
            const currentSectionIndex = getQuizSectionIndex(index);
            if (currentSectionIndex < 0) return -1;
            for (let i = currentSectionIndex + 1; i < SECTIONS.length; i++) {
                if (state.questions.some(q => q.section === SECTIONS[i].id)) return i;
            }
            return -1;
        }


        // ==========================================
        // JFT QUESTION HISTORY — BANK V3 / 1000 SOAL
        // ==========================================
        const QUESTION_BANK_VERSION = 'minna-no-nihongo-i-ii-grammar-expression-merged-2026-10-19-v2';
        const QUESTION_HISTORY_LOCAL_PREFIX = 'jft_question_history_v2_';

        function getQuestionHistoryStorageKey() {
            const uid = (localStorage.getItem('jft_user_id') || 'guest').trim();
            return QUESTION_HISTORY_LOCAL_PREFIX + (uid || 'guest');
        }

        function getQuestionSeenCount(q, history) {
            const raw = history?.seen?.[String(q.id)];
            if (typeof raw === 'number') return Number(raw) || 0;
            if (raw && typeof raw === 'object') return Number(raw.count) || 0;
            return 0;
        }

        function normalizeQuestionHistory(raw) {
            let source = raw;
            if (typeof source === 'string') {
                try { source = JSON.parse(source); } catch (_) { source = null; }
            }
            if (!source || typeof source !== 'object' || Array.isArray(source)) {
                source = {};
            }

            // ID lama harus dianggap sudah tidak berlaku setelah bank diganti.
            if (source.bankVersion !== QUESTION_BANK_VERSION) {
                return { bankVersion: QUESTION_BANK_VERSION, seen: {}, updatedAt: null };
            }

            const seen = {};
            const allowedIds = new Set(QUESTION_BANK.map(q => String(q.id)));
            Object.entries(source.seen || {}).forEach(([id, value]) => {
                if (!allowedIds.has(String(id))) return;
                const count = typeof value === 'number' ? value : Number(value?.count || 0);
                if (count > 0) {
                    seen[String(id)] = {
                        count,
                        lastSeenAt: value?.lastSeenAt || null
                    };
                }
            });
            return {
                bankVersion: QUESTION_BANK_VERSION,
                seen,
                updatedAt: source.updatedAt || null
            };
        }

        function mergeQuestionHistories(a, b) {
            const left = normalizeQuestionHistory(a);
            const right = normalizeQuestionHistory(b);
            const merged = { bankVersion: QUESTION_BANK_VERSION, seen: {}, updatedAt: null };
            const ids = new Set([...Object.keys(left.seen), ...Object.keys(right.seen)]);
            ids.forEach(id => {
                const l = left.seen[id] || {};
                const r = right.seen[id] || {};
                const lc = Number(l.count) || 0;
                const rc = Number(r.count) || 0;
                if (lc || rc) {
                    merged.seen[id] = {
                        count: Math.max(lc, rc),
                        lastSeenAt: String(l.lastSeenAt || '') >= String(r.lastSeenAt || '') ? (l.lastSeenAt || r.lastSeenAt || null) : (r.lastSeenAt || l.lastSeenAt || null)
                    };
                }
            });
            merged.updatedAt = new Date().toISOString();
            return merged;
        }

        async function loadQuestionHistory() {
            const localKey = getQuestionHistoryStorageKey();
            let localHistory = normalizeQuestionHistory(localStorage.getItem(localKey));

            const userId = localStorage.getItem('jft_user_id');
            if (!userId || !window.supabaseClient) {
                localStorage.setItem(localKey, JSON.stringify(localHistory));
                return localHistory;
            }

            try {
                const { data, error } = await window.supabaseClient
                    .from('Jft-Basic')
                    .select('question_history')
                    .eq('id', userId)
                    .single();

                if (error) throw error;
                const remoteHistory = normalizeQuestionHistory(data?.question_history);
                const merged = mergeQuestionHistories(localHistory, remoteHistory);
                localStorage.setItem(localKey, JSON.stringify(merged));
                return merged;
            } catch (error) {
                // Fallback tetap bekerja dengan localStorage bila kolom/migrasi belum tersedia.
                console.warn('Riwayat soal online belum tersedia; memakai penyimpanan lokal.', error?.message || error);
                localStorage.setItem(localKey, JSON.stringify(localHistory));
                return localHistory;
            }
        }

        async function saveQuestionHistory(history) {
            const localKey = getQuestionHistoryStorageKey();
            const localHistory = normalizeQuestionHistory(history);
            localHistory.updatedAt = new Date().toISOString();
            localStorage.setItem(localKey, JSON.stringify(localHistory));

            const userId = localStorage.getItem('jft_user_id');
            if (!userId || !window.supabaseClient) return false;

            let lastError = null;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    let remote = null;
                    const { data, error: readError } = await window.supabaseClient
                        .from('Jft-Basic')
                        .select('question_history')
                        .eq('id', userId)
                        .single();
                    if (readError) throw readError;
                    remote = normalizeQuestionHistory(data?.question_history);

                    const merged = mergeQuestionHistories(remote, localHistory);
                    merged.updatedAt = localHistory.updatedAt;

                    const { error: saveError } = await window.supabaseClient
                        .from('Jft-Basic')
                        .update({ question_history: merged })
                        .eq('id', userId);
                    if (saveError) throw saveError;

                    localStorage.setItem(localKey, JSON.stringify(merged));
                    return true;
                } catch (error) {
                    lastError = error;
                }
            }

            console.warn('Riwayat soal online gagal disimpan; localStorage tetap digunakan.', lastError?.message || lastError);
            return false;
        }

        function markQuestionsSeen(history, questions) {
            const next = normalizeQuestionHistory(history);
            const now = new Date().toISOString();
            questions.forEach(q => {
                const id = String(q.id);
                const current = next.seen[id];
                const count = typeof current === 'number' ? current : Number(current?.count || 0);
                next.seen[id] = { count: count + 1, lastSeenAt: now };
            });
            next.updatedAt = now;
            return next;
        }

        function randomSample(array, count) {
            return shuffleArray([...array]).slice(0, Math.max(0, count));
        }

        function questionContentKey(q) {
            const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[\s　、。,.!?！？「」『』（）()【】［］\-‐‑–—]/g, '');
            return [q.section, q.text, ...(q.options || []), q.audioText || '', q.visual?.title || '', q.visual?.body || '', JSON.stringify(q.visual?.rows || [])].map(norm).join('|');
        }
        function uniqueQuestionBank() {
            // Gunakan filter konten bersama agar soal dengan stem umum yang sama
            // tetapi pilihan berbeda (misalnya listening dengan dialog berbeda) tidak dibuang.
            // JFTQuestionBank sudah mencegah ID ganda dan identitas soal duplikat berdasarkan
            // kategori, teks pertanyaan, serta pilihan yang dinormalisasi.
            if (window.JFTQuestionBank?.uniqueBank) return window.JFTQuestionBank.uniqueBank(QUESTION_BANK);
            const seenIds = new Set();
            const seenQuestions = new Set();
            const norm = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[\s　、。,.!?！？「」『』（）()【】［］\-‐‑–—]/g, '');
            return QUESTION_BANK.filter(q => {
                const id = String(q?.id ?? '');
                const options = Array.isArray(q?.options) ? q.options.map(norm).sort() : [];
                const key = `${String(q?.section || '').trim().toLowerCase()}|${norm(q?.text || '')}|${options.join('|')}`;
                if (!id || !norm(q?.text || '') || seenIds.has(id) || seenQuestions.has(key)) return false;
                seenIds.add(id); seenQuestions.add(key); return true;
            });
        }
        function selectQuizQuestions(totalQuestions, history, selectedSection = 'all') {
            const allBank = uniqueQuestionBank();
            const sectionFilter = ['vocab', 'grammar', 'listening', 'reading'].includes(selectedSection) ? selectedSection : 'all';
            const bank = sectionFilter === 'all' ? allBank : allBank.filter(q => q.section === sectionFilter);
            const total = Math.min(Math.max(1, Number(totalQuestions) || 10), bank.length);
            const sectionOrder = ['vocab', 'grammar', 'listening', 'reading'];

            // Jangan memilih ulang soal yang sudah pernah diberikan pada cycle aktif.
            // Untuk latihan satu kategori, reset cycle kategori itu saja saat habis;
            // riwayat kategori lain tetap dipertahankan.
            let workingHistory = normalizeQuestionHistory(history);
            let unseen = bank.filter(q => getQuestionSeenCount(q, workingHistory) === 0);
            if (unseen.length === 0 && bank.length) {
                if (history && typeof history === 'object' && !Array.isArray(history)) {
                    history.bankVersion = QUESTION_BANK_VERSION;
                    history.seen = { ...(workingHistory.seen || {}) };
                    bank.forEach(q => { delete history.seen[String(q.id)]; });
                    history.updatedAt = new Date().toISOString();
                    workingHistory = history;
                } else {
                    workingHistory = { bankVersion: QUESTION_BANK_VERSION, seen: {}, updatedAt: new Date().toISOString() };
                }
                unseen = [...bank];
            }

            // Campuran memakai picker seimbang yang sudah ada; kategori khusus memakai
            // shuffle sederhana atas pool kategori itu. Keduanya hanya mengambil unseen.
            if (sectionFilter === 'all' && window.JFTQuestionBank) return window.JFTQuestionBank.selectBalanced(unseen, total);
            const selected = randomSample(unseen, total);
            return sectionOrder.flatMap(sec => selected.filter(q => q.section === sec));
        }

let quizStartLock = false;

async function startQuiz() {
    try { await ensureQuestionBankLoaded(); } catch (error) { console.error(error); showToast("Bank soal", "Bank soal gagal dimuat. Periksa koneksi lalu muat ulang halaman.", true); return; }
    // Mencegah dua klik cepat membuat dua sesi membaca history yang sama secara bersamaan.
    if (quizStartLock) return;
    quizStartLock = true;
    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.classList.add('opacity-60', 'cursor-wait');
    }
    const nameInput = document.getElementById('user-name-input');
    const userName = nameInput ? nameInput.value.trim() : '';

    if (!userName) {
        quizStartLock = false;
        if (startBtn) { startBtn.disabled = false; startBtn.classList.remove('opacity-60', 'cursor-wait'); }
        showCustomConfirm("Silakan masukkan nama Anda terlebih dahulu!", null, "Oke");
        return;
    }

    const accountName = (
        localStorage.getItem('jft_account_name') || ''
    ).trim().toUpperCase();

    const normalizedName = userName.toUpperCase();

    if (normalizedName === accountName) {
        showCustomConfirm(
            "Nama tidak boleh sama dengan nama yang dibuat admin!",
            null,
            "Oke"
        );
        quizStartLock = false;
        if (startBtn) { startBtn.disabled = false; startBtn.classList.remove('opacity-60', 'cursor-wait'); }
        return;
    }

    // Simpan nama untuk akun + device ini saja.
    localStorage.setItem(
        getChatNameStorageKey(),
        normalizedName
    );
    localStorage.setItem('jft_display_name', normalizedName);
    localStorage.setItem('jft_user_name', normalizedName);

    const chatCurrentName = document.getElementById('chat-current-name');
    if (chatCurrentName) chatCurrentName.textContent = normalizedName;

    // ... (lanjutan kode kuis Anda)


            const qCountRadio = document.querySelector('input[name="q_count"]:checked');
            const reqCount = qCountRadio ? parseInt(qCountRadio.value, 10) : 10;

            // Sinkronkan riwayat soal dari web + perangkat ini sebelum membuat set baru.
            const questionHistory = await loadQuestionHistory();
            const categorySelector = document.getElementById('quiz-category-select');
            const chosenCategory = categorySelector ? categorySelector.value : 'all';
            const selected = selectQuizQuestions(reqCount, questionHistory, chosenCategory);
            if (selected.length < reqCount) {
                const categoryText = chosenCategory === 'all' ? 'seluruh kategori' : (SECTIONS.find(x => x.id === chosenCategory)?.nameEN || chosenCategory);
                showToast('Jumlah soal', `Tersedia ${selected.length} soal yang belum dikerjakan di ${categoryText}; sesi dibuat tanpa mengulang soal.`, false);
            }

            // Soal ditandai telah diberikan sejak latihan dimulai, sehingga refresh/keluar
            // tidak membuat set yang sama muncul lagi pada percobaan berikutnya.
            const updatedQuestionHistory = markQuestionsSeen(questionHistory, selected);
            await saveQuestionHistory(updatedQuestionHistory);

            state.questions = selected;
            // Batas 2 kali berlaku per soal dalam satu attempt, bukan antar-attempt.
            audioPlayCounts = {};
            state.currentQuestionIndex = 0;
            state.userAnswers = new Array(state.questions.length).fill(null);

            state.endTime = null;
            navigate('quiz');
            state.startTime = Date.now();
            state.timerInterval = setInterval(() => {
                const s = Math.floor((Date.now() - state.startTime) / 1000);
                document.getElementById('quiz-timer').innerHTML = `<i class="fa-regular fa-clock"></i> <span>${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}</span>`;
            }, 1000);
            renderQuestion();
        }
        
        function previousQuestion() {
    if (state.currentQuestionIndex > 0) {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        state.currentQuestionIndex--;
        renderQuestion();
        window.scrollTo(0, 0);
    }
}


        function renderJapaneseText(value) {
            if (window.JFTQuestionBank?.renderJapaneseText) return window.JFTQuestionBank.renderJapaneseText(value);
            return String(value ?? '').split(/(\{[^{}|]+\|[^{}|]+\})/g).map(part => {
                const m = part.match(/^\{([^{}|]+)\|([^{}|]+)\}$/);
                if (m) return `<ruby>${escapeHtml(m[1])}<rt>${escapeHtml(m[2])}</rt></ruby>`;
                return escapeHtml(part).replace(/\n/g, '<br>');
            }).join('');
        }
        function renderQuestionVisual(v) {
            if (window.JFTQuestionBank?.renderQuestionVisual) return window.JFTQuestionBank.renderQuestionVisual(v);
            if (!v) return '';
            const esc = (x) => escapeHtml(String(x ?? ''));
            const rows = (v.rows || []).map(r => `<div class="jft-visual-row"><span>${esc(r.time || r.label || '')}</span><strong>${esc(r.activity || r.value || '')}</strong></div>`).join('');
            const heading = v.title ? `<h3>${esc(v.title)}</h3>` : '';
            const body = v.body ? `<p class="jft-visual-body">${renderJapaneseText(v.body)}</p>` : '';
            return `<section class="jft-visual jft-${esc(v.type || 'table')}">${heading}${body}${rows}</section>`;
        }

        function renderQuestion() {
            const q = state.questions[state.currentQuestionIndex];
            // Listening Experience: ON = audio tanpa transkrip; OFF = transkrip tanpa audio.
            const listeningAudioEnabled = localStorage.getItem('jft_listening_audio') !== 'off';
            const questionForDisplay = q.section === 'listening' ? { ...q, visual: null } : q;
            
            document.getElementById('quiz-progress-text').textContent = `Soal ${state.currentQuestionIndex + 1} / ${state.questions.length}`;
            document.getElementById('quiz-progress-bar').style.width = `${((state.currentQuestionIndex) / state.questions.length) * 100}%`;
            const badge=document.getElementById('quiz-section-badge');
            if (badge) {
                const sec = SECTIONS.find(x => x.id === q.section);
                badge.textContent = sec ? `${sec.nameJP} / ${sec.nameEN}` : q.section;
            }
            let vocabKanjiVisual = '';
            if (q.section === 'vocab' && !q.visual?.kanji && q.visual?.type !== 'kanji') {
                const quoted = String(q.text || '').match(/[「『]([^」』]{1,12})[」』]/);
                const candidate = quoted ? quoted[1] : (String(q.text || '').match(/[一-龯々〆ヵヶ]{1,4}/) || [])[0];
                if (candidate && /[一-龯々〆ヵヶ]/.test(candidate)) {
                    vocabKanjiVisual = `<section class="jft-visual jft-kanji-card jft-kanji-minimal" aria-label="Kanji"><div class="jft-kanji-glyph">${renderJapaneseText(candidate)}</div></section>`;
                }
            }
            const questionEl = document.getElementById('quiz-question');
            questionEl.innerHTML = window.JFTQuestionBank?.renderQuestionMarkup ? window.JFTQuestionBank.renderQuestionMarkup(questionForDisplay) : ((questionForDisplay.label ? `<div class="jft-question-label">${renderJapaneseText(questionForDisplay.label)}</div>` : '') + (questionForDisplay.visual ? renderQuestionVisual(questionForDisplay.visual) : vocabKanjiVisual) + `<div class="jft-question-text">${renderJapaneseText(questionForDisplay.text)}</div>`);
            questionEl.classList.remove('jft-question-enter'); void questionEl.offsetWidth; questionEl.classList.add('jft-question-enter');
            
            const btnNext = document.getElementById('btn-next-question');
            const btnPrev = document.getElementById('btn-prev-question');

// Tombol kembali hanya terkunci di awal sesi. Soal sebelumnya selalu
// dipulihkan dari state sesi yang sama, termasuk ketika berganti kategori.
btnPrev.disabled = state.currentQuestionIndex === 0;

if (btnPrev.disabled) {
    btnPrev.classList.add('opacity-50', 'cursor-not-allowed');
} else {
    btnPrev.classList.remove('opacity-50', 'cursor-not-allowed');
}
            btnNext.innerHTML = state.currentQuestionIndex === state.questions.length - 1 ? `Lihat Hasil <i class="fa-solid fa-flag-checkered"></i>` : `Selanjutnya <i class="fa-solid fa-angle-right"></i>`;
            btnNext.disabled = state.userAnswers[state.currentQuestionIndex] === null;
            btnNext.className = `bg-brand-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2 ${btnNext.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-700'}`;

            const aBtn = document.getElementById('btn-play-audio');
const tBtn = document.getElementById('btn-show-transcript');
const fb = document.getElementById('audio-transcript-fallback');

aBtn.classList.add('hidden');
tBtn.classList.add('hidden');
fb.classList.add('hidden');

// Jangan langsung memanggil speechSynthesis tanpa pengecekan
if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
}

if (q.audioText) {
    const audioEnabled = listeningAudioEnabled;
    const playKey = String(q.id ?? `${state.currentQuestionIndex}`);
    const plays = Number(audioPlayCounts[playKey] || 0);
    if (audioEnabled) aBtn.classList.remove('hidden');
    else { fb.classList.remove('hidden'); fb.innerHTML = `<strong>Transkrip listening (mode teks)</strong><div class="mt-2">${renderJapaneseText(q.audioText)}</div>`; }
    // Transkrip dikendalikan oleh toggle; jangan tampilkan tombol transkrip manual.
    if (audioEnabled) {
        aBtn.disabled = plays >= 2;
        aBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Putar Audio (${plays}/2)`;
        aBtn.onclick = async () => {
            const count = Number(audioPlayCounts[playKey] || 0);
            if (count >= 2) return;
            audioPlayCounts[playKey] = count + 1;
            aBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Putar Audio (${count + 1}/2)`;
            aBtn.disabled = count + 1 >= 2;
            window.saveQuizProgress?.();
            try {
                if (window.JFTSpeakDialogue) await window.JFTSpeakDialogue(q.audioText, { rate: .86 });
                else { const u = new SpeechSynthesisUtterance(q.audioText); u.lang = 'ja-JP'; u.rate = .86; speechSynthesis.speak(u); }
            } catch (err) { console.warn('TTS gagal; tidak menampilkan popup agar latihan tetap berjalan:', err); }
        };
    }
}
            const opts = document.getElementById('quiz-options'); opts.innerHTML = '';
            
            if (!q.shuffledOptions) {
                q.shuffledOptions = shuffleArray(q.options.map((t,i)=>({t,i})));
            }
            
            q.shuffledOptions.forEach((opt, idx) => {
                const isChecked = state.userAnswers[state.currentQuestionIndex] === opt.i ? 'checked' : '';
                opts.innerHTML += `<label class="option-label block"><input type="radio" name="qo" value="${opt.i}" class="option-input peer sr-only" onchange="pilihJawaban(${opt.i})" ${isChecked}><div class="option-content flex items-center p-4 border rounded-xl hover:bg-slate-50 cursor-pointer transition-all"><div class="radio-letter w-8 h-8 flex items-center justify-center rounded bg-slate-100 font-bold mr-3">${['A','B','C','D'][idx]}</div><span class="text-lg japanese-text">${opt.t}</span></div></label>`;
            });
        }
        
        function pilihJawaban(val) {
            state.userAnswers[state.currentQuestionIndex] = val;
            const btnNext = document.getElementById('btn-next-question');
            btnNext.disabled = false;
            btnNext.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
let chatChannel = null;
let roomStatusChannel = null;
let activeReplyData = null;
let activeActiveUsers = new Map();
let selectedMessageForAction = null;
let isEditingMode = false;
let editingMessageId = null;
let isRoomClosed = false;



function closeToast() {
    document.getElementById('custom-toast-modal').classList.remove('flex');
    document.getElementById('custom-toast-modal').classList.add('hidden');
}

async function toggleGlobalChat() {
    const modal = document.getElementById('global-chat-modal');
    if (!modal) return;

    const role = String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase();
    if (role === 'admin' && !getAdminChatName()) {
        adminChatOpenAfterName = true;
        openAdminChatNameModal(true);
        return;
    }

    const isOpening = modal.classList.contains('hidden');

    if (!isOpening) {
        modal.classList.add('hidden');
        return;
    }

    // Penting: tampilkan room terlebih dahulu. Modal sekarang berada di level <body>,
    // bukan di dalam .screen-home yang disembunyikan saat Admin aktif.
    modal.classList.remove('hidden');

    const currentNameEl = document.getElementById('chat-current-name');
    if (currentNameEl) currentNameEl.textContent = getCurrentChatName();
    hideChatNotificationDot();

    try {
        await checkRoomStatus();
        await fetchChatMessages();
        subscribeToGlobalChat();
    } catch (err) {
        console.error('Global Chat init error:', err);
        showToast('Global Chat', 'Room terbuka, tetapi data chat gagal dimuat.', true);
    }
}

async function checkRoomStatus() {
    const { data, error } = await window.supabaseClient
        .from('room_settings')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        console.warn('Gagal membaca status room:', error.message);
        return;
    }

    if (data) {
        isRoomClosed = !!data.is_closed;
        updateRoomUIState();
    }
}

function updateRoomUIState() {
    const inputMsg = document.getElementById('chat-input-msg');
    const sendBtn = document.getElementById('chat-send-btn');
    const container = document.getElementById('chat-messages-container');

    if (!inputMsg) return;

    const userRole = localStorage.getItem('jft_user_role');
    const isAdmin = String(userRole || '').trim().toLowerCase() === 'admin';

    let notice = document.getElementById('room-closed-notice');

    if (isRoomClosed && !isAdmin) {
        inputMsg.disabled = true;
        inputMsg.placeholder = 'Room chat sedang ditutup oleh Admin.';
        if (sendBtn) sendBtn.disabled = true;

        if (!notice && container) {
            notice = document.createElement('div');
            notice.id = 'room-closed-notice';
            notice.className = 'sticky top-0 z-10 bg-rose-100 border-2 border-rose-400 text-rose-800 px-3 py-2 rounded-xl text-center text-[10px] font-black mb-2';
            notice.innerHTML = '<i class="fa-solid fa-lock mr-1"></i> Room chat sedang ditutup oleh Admin.';
            container.prepend(notice);
        }
    } else {
        inputMsg.disabled = false;
        inputMsg.placeholder = isAdmin
            ? 'Room ditutup — Admin tetap bisa mengetik...'
            : 'Tulis pesan (gunakan @ untuk tag)...';
        if (sendBtn) sendBtn.disabled = false;
        if (notice) notice.remove();
    }
}

async function fetchChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const { data, error } = await window.supabaseClient
        .from('global_chats')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

    if (error) {
        container.innerHTML = `<p class="text-center text-xs text-rose-500 font-bold py-10">Gagal memuat pesan: ${escapeHtml(error.message)}</p>`;
        return;
    }

    renderMessages(data || []);
}

function showChatNotificationDot() {
    const dot = document.getElementById('chat-notification-dot');
    if (!dot) return;
    dot.classList.remove('hidden');
    localStorage.setItem('jft_has_unread_tag', 'true');
}

function hideChatNotificationDot() {
    const dot = document.getElementById('chat-notification-dot');
    if (!dot) return;
    dot.classList.add('hidden');
    localStorage.setItem('jft_has_unread_tag', 'false');
}

function restoreChatNotificationDot() {
    if (localStorage.getItem('jft_has_unread_tag') === 'true') {
        showChatNotificationDot();
    } else {
        hideChatNotificationDot();
    }
}

function messageContainsMyTag(message, myName) {
    if (!message || !myName) return false;

    const text = String(message).toUpperCase();
    const name = String(myName).trim().toUpperCase();

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
        `(^|\\s)@${escapedName}(?=\\s|$|[.,!?])`,
        'i'
    );

    return regex.test(text);
}

async function checkUnreadTagNotification() {
    const currentUserName = getCurrentChatName();
    const myIdentity = getChatIdentity();

    if (!currentUserName || currentUserName === 'SISWA') return;

    const { data, error } = await window.supabaseClient
        .from('global_chats')
        .select('sender_id, sender_name, message, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error || !data) return;

    const modal = document.getElementById('global-chat-modal');
    if (modal && !modal.classList.contains('hidden')) return;

    const tagged = data.some(msg =>
        String(msg.sender_id || '') !== String(myIdentity) &&
        messageContainsMyTag(msg.message, currentUserName)
    );

    if (tagged) showChatNotificationDot();
}

function renderMessages(messages) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    if (!messages.length) {
        container.innerHTML = '<div class="flex items-center justify-center h-full text-center text-xs text-slate-400 font-bold"><div><i class="fa-regular fa-comments text-2xl mb-2 opacity-50"></i><p>Belum ada percakapan.<br>Yuk sapa teman-temanmu!</p></div></div>';
        activeActiveUsers.clear();
        return;
    }

    container.innerHTML = '';
    activeActiveUsers.clear();

    messages.forEach(msg => {
        const senderId = String(msg.sender_id || '');
        const senderName = (msg.sender_name || 'SISWA').trim().toUpperCase();

        if (senderId) {
            activeActiveUsers.set(senderId, senderName);
        }

        appendMessageElement(msg, container);
    });

    updateRoomUIState();
    container.scrollTop = container.scrollHeight;
}

function getUserColor(identity) {
    const input = String(identity || '');
    const totalColors = 240;
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        hash = ((hash << 5) - hash) + input.charCodeAt(i);
        hash |= 0;
    }

    const index = Math.abs(hash) % totalColors;
    const hue = Math.round((index * 360) / totalColors);
    const saturation = 75 + (index % 3) * 5;
    const lightness = 28 + (index % 3) * 3;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function canModifyMessage(msg) {
    const role = localStorage.getItem('jft_user_role');
    return role === 'admin' || isCurrentDeviceMessage(msg);
}

function appendMessageElement(msg, container) {
    const senderId = String(msg.sender_id || '');
    const senderName = (msg.sender_name || 'SISWA')
        .trim()
        .toUpperCase();
    const isMe = isCurrentDeviceMessage(msg);
    const isAdmin = msg.sender_role === 'admin';
    const nameColor = isAdmin ? '#ef4444' : getUserColor(senderId || `legacy:${senderName}`);
    const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const isTagged = messageContainsMyTag(
        msg.message,
        getCurrentChatName()
    );

    const modal = document.getElementById('global-chat-modal');
    const modalIsOpen = modal && !modal.classList.contains('hidden');

    if (isTagged && !isMe && !modalIsOpen) {
        showChatNotificationDot();
    }

    const editedTag = msg.edited_at
        ? ' <span class="text-[9px] italic opacity-60">(diedit)</span>'
        : '';

    let htmlReplyPart = '';
    if (msg.reply_to) {
        htmlReplyPart = `
            <div class="reply-card bg-black/5 border-l-[3px] border-[#181818] p-2 mb-2 rounded-lg text-[10px]">
                <span class="font-black text-slate-700">${escapeHtml(msg.reply_user || 'Seseorang')}</span>
                <p class="truncate text-slate-600 mt-0.5">${escapeHtml(msg.reply_to)}</p>
            </div>
        `;
    }

    let bubbleColorClass = 'bg-white text-[#181818]';
    if (isAdmin) {
        bubbleColorClass = 'bg-[#62bddb] text-[#181818]';
    } else if (isMe) {
        bubbleColorClass = 'bg-[#ffe45c] text-[#181818]';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message-row w-full flex flex-col ${isMe ? 'items-end' : 'items-start'} relative select-none`;

    messageDiv.innerHTML = `
        <div class="chat-author flex items-center gap-1 px-1 mb-1 max-w-[90%]">
            ${isAdmin ? '<span class="text-[12px] leading-none text-[#2f80ed]" title="Admin" aria-label="Admin"><i class="fa-solid fa-crown"></i></span>' : ''}
            <span class="text-[10px] font-black uppercase truncate" style="color: ${nameColor};">${escapeHtml(senderName)}</span>
            
            <span class="text-[9px] text-slate-400 whitespace-nowrap">• ${timeStr}</span>
        </div>

        <div class="chat-bubble-wrap relative max-w-[84%]" data-message-id="${escapeHtml(String(msg.id || ''))}">
            <div class="chat-swipe-indicator absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 pointer-events-none text-[#181818] font-black text-sm">↪</div>
            <div class="chat-bubble-card ${bubbleColorClass} p-3 rounded-2xl border-[2px] border-[#181818] text-left text-xs font-medium shadow-[3px_3px_0_#181818] relative cursor-pointer touch-pan-y will-change-transform">
                ${htmlReplyPart}
                <div class="chat-message-text">${escapeHtml(msg.message)}${editedTag}</div>
            </div>
        </div>
    `;

    const bubbleWrap = messageDiv.querySelector('.chat-bubble-wrap');
    const bubble = messageDiv.querySelector('.chat-bubble-card');
    const swipeIndicator = messageDiv.querySelector('.chat-swipe-indicator');

    let startX = 0;
    let startY = 0;
    let currentDx = 0;
    let swiping = false;
    let didSwipe = false;

    const resetSwipe = () => {
        bubble.style.transform = '';
        bubble.style.transition = 'transform .18s ease';
        swipeIndicator.style.opacity = '0';
        swipeIndicator.style.transform = 'translate(-2rem, -50%)';
        currentDx = 0;
        swiping = false;
    };

    bubble.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        startX = e.clientX;
        startY = e.clientY;
        currentDx = 0;
        didSwipe = false;
        swiping = true;
        bubble.style.transition = 'none';
        try { bubble.setPointerCapture(e.pointerId); } catch (_) {}
    });

    bubble.addEventListener('pointermove', (e) => {
        if (!swiping) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
            swiping = false;
            resetSwipe();
            return;
        }

        if (dx > 8) {
            currentDx = Math.min(dx, 95);
            bubble.style.transform = `translateX(${currentDx}px)`;
            swipeIndicator.style.opacity = String(Math.min(currentDx / 55, 1));
            swipeIndicator.style.transform = `translate(${Math.min(-32 + currentDx * 0.25, -2)}px, -50%)`;
        }
    });

    bubble.addEventListener('pointerup', (e) => {
        if (!swiping) return;
        try { bubble.releasePointerCapture(e.pointerId); } catch (_) {}

        if (currentDx >= 55) {
            didSwipe = true;
            bubble.style.transition = 'transform .15s ease';
            bubble.style.transform = 'translateX(35px)';

            setTimeout(() => {
                resetSwipe();
                triggerReply(senderName, msg.message, senderId);
            }, 120);
        } else {
            resetSwipe();
        }
    });

    bubble.addEventListener('pointercancel', resetSwipe);

    // Tekan lama untuk membuka menu pesan. Tap biasa tidak melakukan apa-apa.
    let longPressTimer = null;
    let longPressTriggered = false;

    const cancelLongPress = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    };

    bubble.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        longPressTriggered = false;
        cancelLongPress();

        longPressTimer = setTimeout(() => {
            // Jangan membuka menu jika gesture sedang dipakai untuk swipe reply.
            if (Math.abs(currentDx) >= 8 || !swiping) return;
            longPressTriggered = true;
            selectedMessageForAction = msg;
            openChatActionModal(msg);
        }, 550);
    });

    bubble.addEventListener('pointermove', (e) => {
        if (Math.abs(e.clientX - startX) > 12 || Math.abs(e.clientY - startY) > 12) {
            cancelLongPress();
        }
    });

    bubble.addEventListener('pointerup', () => {
        cancelLongPress();
    });

    bubble.addEventListener('pointercancel', () => {
        cancelLongPress();
    });

    bubble.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        cancelLongPress();
        selectedMessageForAction = msg;
        openChatActionModal(msg);
    });

    container.appendChild(messageDiv);
}

function openChatActionModal(msg) {
    selectedMessageForAction = msg;

    const modal = document.getElementById('chat-action-modal');
    const editBtn = document.getElementById('btn-action-edit');
    const deleteBtn = document.getElementById('btn-action-delete');

    if (!modal) return;

    const canModify = canModifyMessage(msg);

    if (editBtn) {
        editBtn.classList.toggle('hidden', !canModify);
    }

    if (deleteBtn) {
        deleteBtn.classList.toggle('hidden', !canModify);
    }

    const isMe = isCurrentDeviceMessage(msg);
    const title = modal.querySelector('[data-chat-action-title]');

    if (title) {
        title.textContent = isMe
            ? 'Opsi Pesan Saya'
            : `Pesan ${msg.sender_name || 'Seseorang'}`;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeChatActionModal() {
    const modal = document.getElementById('chat-action-modal');
    if (!modal) return;
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

function handleActionEdit() {
    if (!selectedMessageForAction) return;

    if (!canModifyMessage(selectedMessageForAction)) {
        showToast('Tidak diizinkan', 'Kamu hanya bisa mengedit pesan milikmu sendiri.', true);
        closeChatActionModal();
        return;
    }

    closeChatActionModal();
    isEditingMode = true;
    editingMessageId = selectedMessageForAction.id;

    const input = document.getElementById('chat-input-msg');
    input.value = selectedMessageForAction.message || '';
    input.focus();

    showToast('Mode Edit', 'Ubah pesan lalu tekan Kirim.');
}

async function handleActionDelete() {
    if (!selectedMessageForAction) return;

    if (!canModifyMessage(selectedMessageForAction)) {
        closeChatActionModal();
        showToast('Tidak diizinkan', 'Kamu hanya bisa menghapus pesan milikmu sendiri.', true);
        return;
    }

    const messageId = selectedMessageForAction.id;
    const filePath = String(selectedMessageForAction.file_path || '').trim();
    closeChatActionModal();

    // Hapus file Storage terlebih dahulu, lalu baris database, agar tidak meninggalkan orphan file.
    showCustomConfirm('Yakin ingin menghapus pesan ini?', async () => {
        try {
            if (filePath && typeof window.deleteChatStoragePaths === 'function') {
                const storageResult = await window.deleteChatStoragePaths([filePath]);
                if (storageResult?.error) throw storageResult.error;
            }

            const query = window.supabaseClient
                .from('global_chats')
                .delete()
                .eq('id', messageId);

            const role = localStorage.getItem('jft_user_role');
            const result = String(role || '').trim().toLowerCase() === 'admin'
                ? await query
                : await query.eq('sender_id', getChatIdentity());

            if (result.error) throw result.error;

            await fetchChatMessages();
            showToast('Berhasil', 'Pesan dan file-nya telah dihapus.');
        } catch (err) {
            console.error('Gagal menghapus pesan/file:', err);
            showToast('Gagal', err?.message || 'Pesan atau file gagal dihapus.', true);
        }
    }, 'Hapus');
}

function triggerReply(sender, text, senderId = '') {
    activeReplyData = {
        sender,
        text,
        senderId
    };

    const previewBox = document.getElementById('reply-preview-box');
    if (!previewBox) return;

    previewBox.classList.remove('hidden');
    document.getElementById('reply-preview-user').textContent = `Membalas @${sender}:`;
    document.getElementById('reply-preview-text').textContent = text;
    document.getElementById('chat-input-msg').focus();
}

function cancelReply() {
    activeReplyData = null;
    const preview = document.getElementById('reply-preview-box');
    if (preview) preview.classList.add('hidden');
}

function subscribeToGlobalChat() {
    if (chatChannel) return;

    chatChannel = window.supabaseClient
        .channel('public:global_chats')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'global_chats' },
            () => fetchChatMessages()
        )
        .subscribe();

    if (!roomStatusChannel) {
        roomStatusChannel = window.supabaseClient
            .channel('public:room_settings')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'room_settings' },
                payload => {
                    if (payload.new) {
                        isRoomClosed = !!payload.new.is_closed;
                        updateRoomUIState();
                    }
                }
            )
            .subscribe();
    }
}

async function adminToggleRoomChat() {
    isRoomClosed = !isRoomClosed;

    const { error } = await window.supabaseClient
        .from('room_settings')
        .upsert({ id: 1, is_closed: isRoomClosed });

    if (error) {
        showToast('Gagal', error.message, true);
        return;
    }

    updateAdminRoomButton();
    updateRoomUIState();
    showToast(
        'Status Room',
        isRoomClosed ? 'Room Chat berhasil DITUTUP.' : 'Room Chat berhasil DIBUKA.'
    );
}

function updateAdminRoomButton() {
    const btn = document.getElementById('btn-toggle-room');
    if (!btn) return;

    if (isRoomClosed) {
        btn.textContent = 'Buka Kembali Room Chat';
        btn.className = 'px-4 py-2 bg-[#43c9bd] text-[#181818] border-[2px] border-[#181818] rounded-xl text-xs font-black shadow-[2px_2px_0_#181818] hover:-translate-y-0.5 transition';
    } else {
        btn.textContent = 'Tutup Room Chat';
        btn.className = 'px-4 py-2 bg-[#ff7373] text-[#181818] border-[2px] border-[#181818] rounded-xl text-xs font-black shadow-[2px_2px_0_#181818] hover:-translate-y-0.5 transition';
    }
}

async function sendGlobalMessage() {
    const input = document.getElementById('chat-input-msg');
    const message = input.value.trim();
    const senderName = getCurrentChatName();
    const userRole = localStorage.getItem('jft_user_role') || 'user';

    if (!message) return;

    if (isRoomClosed && String(userRole || '').trim().toLowerCase() !== 'admin') {
        showToast('Peringatan', 'Room chat sedang ditutup oleh admin.', true);
        return;
    }

    if (isEditingMode && editingMessageId) {
        const query = window.supabaseClient
            .from('global_chats')
            .update({
                message,
                edited_at: new Date().toISOString()
            })
            .eq('id', editingMessageId);

        const result = String(userRole || '').trim().toLowerCase() === 'admin'
            ? await query
            : await query.eq('sender_id', getChatIdentity());

        isEditingMode = false;
        const editedId = editingMessageId;
        editingMessageId = null;
        input.value = '';

        if (result.error) {
            showToast('Gagal', result.error.message, true);
        } else {
            await fetchChatMessages();
        }

        return;
    }

    const senderId = getChatIdentity();

    const payloadData = {
        sender_id: senderId,
        sender_name: senderName,
        sender_role: userRole,
        message,
        reply_to: activeReplyData ? activeReplyData.text : null,
        reply_user: activeReplyData ? activeReplyData.sender : null
    };

    input.value = '';
    cancelReply();

    const tagSuggestions = document.getElementById('tag-suggestions');
    if (tagSuggestions) tagSuggestions.classList.add('hidden');

    const { error } = await window.supabaseClient
        .from('global_chats')
        .insert([payloadData]);

    if (error) {
        showToast('Gagal', error.message, true);
        return;
    }

    await fetchChatMessages();
}

document.addEventListener('DOMContentLoaded', () => {
    restoreChatNotificationDot();
    checkRoomStatus();
    if (String(localStorage.getItem('jft_user_role') || '').trim().toLowerCase() === 'admin') {
        updateAdminChatNameDisplay();
        const currentNameEl = document.getElementById('chat-current-name');
        if (currentNameEl) currentNameEl.textContent = getCurrentChatName();
    }
});

function checkChatInput(e) {
    const val = e.target.value;
    const tagContainer = document.getElementById('tag-suggestions');
    if (!tagContainer) return;

    if (val.includes('@')) {
        tagContainer.classList.remove('hidden');
        tagContainer.innerHTML = '';

        activeActiveUsers.forEach((username, senderId) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'px-2.5 py-1.5 bg-[#ffe45c] border-[1.5px] border-[#181818] rounded-lg font-black text-[10px] whitespace-nowrap shadow-[2px_2px_0_#181818]';
            button.textContent = `@${username}`;
            button.onclick = () => insertTagUser(username);
            tagContainer.appendChild(button);
        });
    } else {
        tagContainer.classList.add('hidden');
    }
}

function insertTagUser(username) {
    const input = document.getElementById('chat-input-msg');
    if (!input) return;

    const current = input.value.trimEnd();
    const prefix = current && !current.endsWith(' ') ? ' ' : '';
    input.value = `${current}${prefix}@${username} `;

    const tagSuggestions = document.getElementById('tag-suggestions');
    if (tagSuggestions) tagSuggestions.classList.add('hidden');

    input.focus();
}

function handleChatKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendGlobalMessage();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}


        
        function showTranscript() { document.getElementById('audio-transcript-fallback').classList.remove('hidden'); document.getElementById('btn-show-transcript').classList.add('hidden'); }
        
        function nextQuestion() {
            if(window.speechSynthesis) window.speechSynthesis.cancel();

            const currentIndex = state.currentQuestionIndex;
            const currentSection = state.questions[currentIndex]?.section;
            const nextIndex = currentIndex + 1;
            const isLastQuestion = currentIndex >= state.questions.length - 1;
            const nextQuestionSection = state.questions[nextIndex]?.section;

            // Masih di sesi yang sama: lanjut biasa.
            if (!isLastQuestion && nextQuestionSection === currentSection) {
                state.currentQuestionIndex++;
                renderQuestion();
                window.scrollTo(0,0);
                return;
            }

            // Soal terakhir pada sebuah sesi: minta konfirmasi sebelum
            // mengunci sesi tersebut dan masuk ke sesi berikutnya.
            if (!isLastQuestion && nextQuestionSection !== currentSection) {
                const nextSec = SECTIONS.find(s => s.id === nextQuestionSection);
                const currentSec = SECTIONS.find(s => s.id === currentSection);
                const nextName = nextSec ? `${nextSec.nameJP} / ${nextSec.nameEN}` : 'sesi berikutnya';
                const currentName = currentSec ? `${currentSec.nameJP} / ${currentSec.nameEN}` : 'sesi ini';

                showCustomConfirm(
                    `Sesi ${currentName} sudah selesai. Jika Anda memilih \"Lanjut\", sesi ini akan dikunci dan Anda tidak dapat kembali melihat atau mengerjakan soal di sesi sebelumnya.\n\nLanjut ke ${nextName}?`,
                    () => {
                        state.currentQuestionIndex++;
                        renderQuestion();
                        window.scrollTo(0,0);
                    },
                    'Lanjut'
                );
                return;
            }

            // Semua sesi sudah selesai.
            finishQuiz();
        }
        
        function previousQuestion() {
    if (state.currentQuestionIndex > 0) {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        state.currentQuestionIndex--;
        renderQuestion();
        window.scrollTo(0, 0);
    }
}

        function renderHistory() {
            const h = JSON.parse(localStorage.getItem('jft_history')||'[]');
            const c = document.getElementById('history-container'); c.innerHTML = '';
            if(!h.length) document.getElementById('empty-history').classList.remove('hidden');
            else {
                document.getElementById('empty-history').classList.add('hidden');
                h.forEach(i => c.innerHTML += `<div class="bg-white p-4 border rounded shadow-sm mb-3 flex justify-between"><div class="text-sm"><div>${new Date(i.date).toLocaleString('id-ID')}</div><div class="font-bold">Skor: ${i.score}</div></div><div class="text-right font-bold text-brand-600">${i.level}<div class="text-xs text-slate-500">${i.correct}/${i.total} Benar</div></div></div>`);
            }
        }
        
        async function editName() {
            const currentName = getCurrentChatName();
            const n = prompt('Nama:', currentName);

            if (n === null) return;

            const normalizedName = n.trim().toUpperCase();

            if (!normalizedName) {
                showCustomConfirm('Nama tidak boleh kosong!', null, 'Oke');
                return;
            }

            try {
                await saveChatName(normalizedName);
            } catch (error) {
                console.error('Gagal mengganti nama:', error);
                showToast('Gagal', error.message, true);
            }
        }

        function handlePhotoUpload(e) { if(e.target.files[0]) { const r = new FileReader(); r.onload = (ev) => { const img=document.getElementById('user-photo-img'); if(img){ img.src=ev.target.result; img.classList.remove('hidden'); } localStorage.setItem('jft_user_photo', ev.target.result); }; r.readAsDataURL(e.target.files[0]); } }
        
// Fungsi untuk memunculkan/menutup modal konfirmasi kustom


        document.addEventListener('DOMContentLoaded', async () => {
            const p = localStorage.getItem('jft_user_photo');
            if(p) { const img=document.getElementById('user-photo-img'); if(img){ img.src = p; img.classList.remove('hidden'); } }
            try { await ensureQuestionBankLoaded(); }
            catch (error) { console.error('Bank soal gagal dimuat:', error); showToast('Bank soal', 'Bank soal gagal dimuat. Periksa koneksi lalu muat ulang halaman.', true); }
            checkSession();
        });
        // Penyelamat otomatis: Paksa nama di chat selalu pakai nama yang sudah kamu ganti
window.addEventListener('DOMContentLoaded', () => {
    const originalSend = window.sendGlobalMessage || window.kirimPesan;
    // Ini memastikan setiap kali tombol kirim dikunci, nama yang dipakai dari memori browser terbaru
    console.log("Sistem sinkronisasi nama aktif!");
});


/* ============================================================
   JFT PUBLIC QUIZ API — stable bridge for multi-page router
   ============================================================ */
(function(){
    try {
        window.JFT_QUESTION_BANK = QUESTION_BANK;
        window.JFT_QUESTION_BANK_VERSION = QUESTION_BANK_VERSION;
        window.JFTQuiz = {
            getState: () => state,
            getQuestionBank: () => QUESTION_BANK,
            loadQuestionHistory: () => loadQuestionHistory(),
            saveQuestionHistory: (history) => saveQuestionHistory(history),
            markQuestionsSeen: (history, questions) => markQuestionsSeen(history, questions),
            selectQuizQuestions: (count, history) => selectQuizQuestions(count, history),
            getHistoryStorageKey: () => getQuestionHistoryStorageKey(),
            normalizeHistory: (raw) => normalizeQuestionHistory(raw),
            mergeHistories: (a,b) => mergeQuestionHistories(a,b)
        };
    } catch (e) {
        console.warn('Quiz API bridge gagal dibuat:', e);
    }
})();
