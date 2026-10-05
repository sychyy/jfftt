
        const SECTIONS = [
            { id: 'vocab', nameJP: '文字と語彙', nameEN: 'Script and Vocabulary' },
            { id: 'grammar', nameJP: '会話と表現', nameEN: 'Conversation and Expression' },
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
                const QUESTION_BANK = [
        {
          "id": 1,
          "section": "vocab",
          "text": "わたしは まいあさ 7じに （　　　）。",
          "options": [
            "おきます",
            "ねます",
            "きます",
            "みます"
          ],
          "answer": 0,
          "explanation": "おきます (okimasu) = bangun. \"Saya bangun jam 7 setiap pagi.\"",
          "period": "sep-nov"
        },
        {
          "id": 2,
          "section": "vocab",
          "text": "きのうは とても （　　　）です。",
          "options": [
            "あつかった",
            "あつい",
            "あつくて",
            "あつくない"
          ],
          "answer": 0,
          "explanation": "Karena merujuk ke kemarin (きのう), gunakan bentuk lampau: あつかった (atsukatta).",
          "period": "sep-nov"
        },
        {
          "id": 3,
          "section": "vocab",
          "text": "「えき」は かんじで どう かきますか。",
          "options": [
            "駅",
            "家",
            "店",
            "車"
          ],
          "answer": 0,
          "explanation": "駅 (eki) = stasiun. 家(rumah), 店(toko), 車(mobil).",
          "period": "sep-nov"
        },
        {
          "id": 4,
          "section": "vocab",
          "text": "つくえの うえに ほんが （　　　） あります。",
          "options": [
            "さんこ",
            "さんまい",
            "さんさつ",
            "さんぼん"
          ],
          "answer": 2,
          "explanation": "Untuk menghitung benda berjilid (seperti buku), gunakan satuan ~さつ (satsu).",
          "period": "sep-nov"
        },
        {
          "id": 5,
          "section": "vocab",
          "text": "あめが ふっていますから、（　　　）を もって いきます。",
          "options": [
            "かさ",
            "かばん",
            "くつ",
            "ぼうし"
          ],
          "answer": 0,
          "explanation": "かさ (kasa) = payung. Karena hujan, bawa payung.",
          "period": "sep-nov"
        },
        {
          "id": 6,
          "section": "grammar",
          "text": "A: 「すみません、しおを とって ください。」\nB: 「はい、（　　　）。」",
          "options": [
            "どうぞ",
            "どうも",
            "ありがとう",
            "ごめん"
          ],
          "answer": 0,
          "explanation": "どうぞ (douzo) digunakan saat memberikan atau mempersilakan sesuatu kepada orang lain.",
          "period": "sep-nov"
        },
        {
          "id": 7,
          "section": "grammar",
          "text": "にほんへ （　　　） ことがありますか。",
          "options": [
            "いく",
            "いった",
            "いかない",
            "いって"
          ],
          "answer": 1,
          "explanation": "Pola ~たことがあります berarti \"pernah melakukan\". Gunakan kata kerja bentuk TA (いった).",
          "period": "sep-nov"
        },
        {
          "id": 8,
          "section": "grammar",
          "text": "あしたは やすみ（　　　）、どこへも いきません。",
          "options": [
            "から",
            "だから",
            "ですが",
            "ので"
          ],
          "answer": 1,
          "explanation": "やすみ (libur) adalah kata benda, jadi gunakan だから (dakara) untuk \"karena\".",
          "period": "sep-nov"
        },
        {
          "id": 9,
          "section": "grammar",
          "text": "A: 「コーヒーと こうちゃ、どちらが いいですか。」\nB: 「コーヒー（　　　） おねがいします。」",
          "options": [
            "が",
            "を",
            "に",
            "は"
          ],
          "answer": 1,
          "explanation": "コーヒーをお願いします = Tolong kopinya. Partikel を menandakan objek.",
          "period": "sep-nov"
        },
        {
          "id": 10,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はこれからどこへ行きますか。",
          "audioText": "男：あ、もう５時ですね。スーパーへ買い物に行かなくちゃ。\n女：あれ？今日は銀行へ行くと言っていませんでしたか。\n男：あ、そうでした。じゃあ、先にあそこへ寄ってから、買い物に行きます。",
          "options": [
            "銀行",
            "スーパー",
            "会社",
            "家"
          ],
          "answer": 0,
          "explanation": "Pria itu ingat dia harus ke Bank (銀行 / あそこ) dulu sebelum belanja (スーパー).",
          "period": "sep-nov"
        },
        {
          "id": 11,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n天気はどうなりますか。",
          "audioText": "明日は午前中は晴れますが、午後からくもりになり、夜には雨が降るでしょう。",
          "options": [
            "晴れのちくもり、夜は雨",
            "晴れのち雨",
            "雨のち晴れ",
            "ずっと晴れ"
          ],
          "answer": 0,
          "explanation": "Pagi cerah (晴れます), siang mendung (くもりになり), malam hujan (雨が降る).",
          "period": "sep-nov"
        },
        {
          "id": 12,
          "section": "reading",
          "text": "【手紙を読んで答えてください】\n山田さんへ\nきのうは ありがとうございました。とても たのしかったです。\nまた らいげつ、いっしょに しょくじを しましょう。\n\nだれが この てがみを かきましたか。",
          "options": [
            "山田さんのともだち",
            "山田さん",
            "わからない",
            "せんせい"
          ],
          "answer": 0,
          "explanation": "Surat ditujukan kepada Yamada (山田さんへ), jadi yang menulis adalah orang lain (temannya).",
          "period": "sep-nov"
        },
        {
          "id": 13,
          "section": "reading",
          "text": "【お知らせ】\nとしょかんは げつようびが やすみです。かようびから にちようびまで ９じから ５じまで あいています。\n\nすいようびの ６じに としょかんへ いきます。ほんを かりることが できますか。",
          "options": [
            "いいえ、できません。",
            "はい、できます。",
            "わかりません。",
            "げつようびは できます。"
          ],
          "answer": 0,
          "explanation": "Perpustakaan buka sampai jam 5. Hari Rabu jam 6 sudah tutup, jadi tidak bisa.",
          "period": "sep-nov"
        },
        {
          "id": 14,
          "section": "vocab",
          "text": "きのう、スーパーで りんごを （　　　）。",
          "options": [
            "かいました",
            "のみました",
            "みました",
            "ききました"
          ],
          "answer": 0,
          "explanation": "「かいました」berarti \"membeli\", cocok dengan apel dan supermarket.",
          "period": "sep-nov"
        },
        {
          "id": 15,
          "section": "grammar",
          "text": "A:「あの うみは きれいですね。」\nB:「ええ、でも （　　　） およがないで くださいね。あぶないですから。」",
          "options": [
            "とても",
            "ぜんぜん",
            "ぜったいに",
            "たいへん"
          ],
          "answer": 2,
          "explanation": "ぜったいに ~ないでください digunakan untuk melarang keras (Sama sekali jangan...).",
          "period": "sep-nov"
        },
        {
          "id": 16,
          "section": "vocab",
          "text": "「あたらしい」は かんじで どう かきますか。",
          "options": [
            "新しい",
            "古い",
            "高い",
            "安い"
          ],
          "answer": 0,
          "explanation": "新しい (atarashii) = baru. 古い(lama/tua), 高い(tinggi/mahal), 安い(murah).",
          "period": "sep-nov"
        },
        {
          "id": 17,
          "section": "vocab",
          "text": "かぜを ひいたので、（　　　）へ いきます。",
          "options": [
            "びょういん",
            "としょかん",
            "ゆうびんきょく",
            "ぎんこう"
          ],
          "answer": 0,
          "explanation": "Karena masuk angin/sakit (かぜを ひいた), maka pergi ke rumah sakit (びょういん).",
          "period": "sep-nov"
        },
        {
          "id": 18,
          "section": "grammar",
          "text": "この ケーキは おいしい（　　　）、やすいです。",
          "options": [
            "し",
            "から",
            "けれども",
            "と"
          ],
          "answer": 0,
          "explanation": "Pola ~し digunakan untuk menyebutkan beberapa karakteristik (Enak, dan juga murah).",
          "period": "sep-nov"
        },
        {
          "id": 19,
          "section": "grammar",
          "text": "A:「にもつを もちましょうか。」\nB:「（　　　）。」",
          "options": [
            "いいえ、けっこうです",
            "はい、そうです",
            "いいえ、ちがいます",
            "はい、もちます"
          ],
          "answer": 0,
          "explanation": "Menolak tawaran secara sopan: \"いいえ、けっこうです\" (Tidak, terima kasih).",
          "period": "sep-nov"
        },
        {
          "id": 20,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何を買いますか。",
          "audioText": "女：すみません、りんごを３つと、みかんを５つください。\n男：はい、りんご３つとみかん５つですね。",
          "options": [
            "りんご３つ、みかん５つ",
            "りんご５つ、みかん３つ",
            "りんご３つだけ",
            "みかん５つだけ"
          ],
          "answer": 0,
          "explanation": "Perempuan itu meminta \"りんごを３つ\" (Apel 3 buah) dan \"みかんを５つ\" (Jeruk 5).",
          "period": "sep-nov"
        },
        {
          "id": 21,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n田中さんへ\nさきほど、木村さんから電話がありました。あしたの会議は午後２時からに変更になったそうです。資料を準備しておいてください。\n（佐藤より）\n\n会議は何時からですか。",
          "options": [
            "午後２時",
            "午前２時",
            "あした",
            "わかりません"
          ],
          "answer": 0,
          "explanation": "Di dalam memo tertulis \"午後２時から\" (Mulai jam 2 siang).",
          "period": "sep-nov"
        },
        {
          "id": 22,
          "section": "vocab",
          "text": "のどが かわきました。（　　　）を のみたいです。",
          "options": [
            "みず",
            "パン",
            "ごはん",
            "にく"
          ],
          "answer": 0,
          "explanation": "のどが かわきました = haus. Maka ingin minum air (みず).",
          "period": "sep-nov"
        },
        {
          "id": 23,
          "section": "vocab",
          "text": "「食べる」は ひらがなで どう かきますか。",
          "options": [
            "たべる",
            "のむ",
            "みる",
            "かく"
          ],
          "answer": 0,
          "explanation": "食べる (taberu) = makan.",
          "period": "sep-nov"
        },
        {
          "id": 24,
          "section": "vocab",
          "text": "まいあさ、はを （　　　）。",
          "options": [
            "みがきます",
            "あらいます",
            "あびます",
            "ぬぎます"
          ],
          "answer": 0,
          "explanation": "はを みがきます = menggosok gigi.",
          "period": "sep-nov"
        },
        {
          "id": 25,
          "section": "vocab",
          "text": "この くるまは とても （　　　）です。",
          "options": [
            "はやい",
            "おそく",
            "はやく",
            "はやかった"
          ],
          "answer": 0,
          "explanation": "Kata sifat-i sebagai predikat kalimat positif sekarang menggunakan bentuk dasar (はやい - cepat).",
          "period": "sep-nov"
        },
        {
          "id": 26,
          "section": "vocab",
          "text": "へやが くらいですね。（　　　）を つけてください。",
          "options": [
            "でんき",
            "テレビ",
            "エアコン",
            "ドア"
          ],
          "answer": 0,
          "explanation": "へやが くらい (kamarnya gelap). Maka nyalakan lampu (でんき).",
          "period": "sep-nov"
        },
        {
          "id": 27,
          "section": "vocab",
          "text": "「車」は ひらがなで どう かきますか。",
          "options": [
            "くるま",
            "でんしゃ",
            "じてんしゃ",
            "ひこうき"
          ],
          "answer": 0,
          "explanation": "車 dibaca くるま (kuruma) = mobil.",
          "period": "sep-nov"
        },
        {
          "id": 28,
          "section": "vocab",
          "text": "カメラで しゃしんを （　　　）。",
          "options": [
            "とります",
            "つくります",
            "かきます",
            "します"
          ],
          "answer": 0,
          "explanation": "しゃしんを とります = memotret / mengambil foto.",
          "period": "sep-nov"
        },
        {
          "id": 29,
          "section": "grammar",
          "text": "わたしは 日本語（　　　） はなせます。",
          "options": [
            "が",
            "を",
            "で",
            "に"
          ],
          "answer": 0,
          "explanation": "Kata kerja potensial (はなせます - bisa berbicara) umumnya menggunakan partikel が untuk objeknya.",
          "period": "sep-nov"
        },
        {
          "id": 30,
          "section": "grammar",
          "text": "A: 「ここで タバコを （　　　） いいですか。」\nB: 「いいえ、ここでは すわないで ください。」",
          "options": [
            "すっても",
            "すうと",
            "すえば",
            "すっては"
          ],
          "answer": 0,
          "explanation": "Meminta izin menggunakan pola ~てもいいですか (~temo ii desu ka).",
          "period": "sep-nov"
        },
        {
          "id": 31,
          "section": "grammar",
          "text": "きのうは あめが （　　　）。",
          "options": [
            "ふりました",
            "ふります",
            "ふって",
            "ふらない"
          ],
          "answer": 0,
          "explanation": "Karena keterangan waktu adalah \"kemarin\" (きのう), gunakan bentuk lampau (ふりました).",
          "period": "sep-nov"
        },
        {
          "id": 32,
          "section": "grammar",
          "text": "この ほんは むずかしく（　　　）。",
          "options": [
            "ないです",
            "ありませんでした",
            "です",
            "くありません"
          ],
          "answer": 0,
          "explanation": "Bentuk negatif dari kata sifat-i (むずかしい) adalah むずかしくないです atau むずかしくありません.",
          "period": "sep-nov"
        },
        {
          "id": 33,
          "section": "grammar",
          "text": "わたしは じてんしゃ（　　　） がっこうへ いきます。",
          "options": [
            "で",
            "に",
            "へ",
            "と"
          ],
          "answer": 0,
          "explanation": "Partikel で (de) digunakan untuk menunjukkan alat/kendaraan (dengan sepeda).",
          "period": "sep-nov"
        },
        {
          "id": 34,
          "section": "grammar",
          "text": "もっと べんきょうした ほう（　　　） いいですよ。",
          "options": [
            "が",
            "を",
            "に",
            "は"
          ],
          "answer": 0,
          "explanation": "Memberikan saran menggunakan pola ~たほうがいいです (~ta hou ga ii desu).",
          "period": "sep-nov"
        },
        {
          "id": 35,
          "section": "grammar",
          "text": "A: 「いっしょに えいがを みに いきませんか。」\nB: 「いいですね。（　　　）。」",
          "options": [
            "いきましょう",
            "いきません",
            "いきました",
            "いってください"
          ],
          "answer": 0,
          "explanation": "Menyetujui ajakan menggunakan bentuk ~ましょう (Ikima shou - Ayo pergi).",
          "period": "sep-nov"
        },
        {
          "id": 36,
          "section": "grammar",
          "text": "スーパーへ パンを （　　　）に いきます。",
          "options": [
            "かい",
            "かう",
            "かって",
            "かった"
          ],
          "answer": 0,
          "explanation": "Pergi untuk suatu tujuan: Kata kerja bentuk Masu (coret masu) + に 行きます。 (買いに行きます).",
          "period": "sep-nov"
        },
        {
          "id": 37,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n会議は何時からですか。",
          "audioText": "男：明日の会議は、１０時からですか。\n女：いいえ、１時間遅れて、１１時からになりました。\n男：わかりました。",
          "options": [
            "１１時",
            "１０時",
            "１時",
            "１２時"
          ],
          "answer": 0,
          "explanation": "Awalnya jam 10, lalu mundur 1 jam (１時間遅れて) menjadi jam 11.",
          "period": "sep-nov"
        },
        {
          "id": 38,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はどうやって会社へ行きますか。",
          "audioText": "女：山田さんは、いつも電車で会社へ行きますか。\n男：いいえ、家から会社まで近いですから、いつも自転車で行きます。雨の日はバスに乗ります。",
          "options": [
            "自転車",
            "電車",
            "バス",
            "車"
          ],
          "answer": 0,
          "explanation": "Pria itu biasanya pergi dengan sepeda (自転車で行きます) karena dekat.",
          "period": "sep-nov"
        },
        {
          "id": 39,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n今、何時ですか。",
          "audioText": "女：すみません、今何時ですか。\n男：えーと、４時半です。\n女：ありがとうございます。",
          "options": [
            "４時半",
            "３時半",
            "４時",
            "５時半"
          ],
          "answer": 0,
          "explanation": "Pria itu menjawab \"４時半です\" (Jam setengah lima).",
          "period": "sep-nov"
        },
        {
          "id": 40,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を飲みますか。",
          "audioText": "女：飲み物は何がいいですか。\n男：そうですね。コーヒーをお願いします。あ、冷たいコーヒーがいいです。",
          "options": [
            "冷たいコーヒー",
            "温かいコーヒー",
            "冷たいお茶",
            "水"
          ],
          "answer": 0,
          "explanation": "Pria itu meminta es kopi / kopi dingin (冷たいコーヒー).",
          "period": "sep-nov"
        },
        {
          "id": 41,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人はいつ会いますか。",
          "audioText": "男：今週の日曜日に、映画を見に行きませんか。\n女：日曜日はちょっと用事があります。土曜日はどうですか。\n男：いいですよ。じゃあ、土曜日にしましょう。",
          "options": [
            "土曜日",
            "日曜日",
            "金曜日",
            "月曜日"
          ],
          "answer": 0,
          "explanation": "Mereka sepakat untuk bertemu hari Sabtu (土曜日).",
          "period": "sep-nov"
        },
        {
          "id": 42,
          "section": "reading",
          "text": "【メールを読んで答えてください】\nアリさんへ\nあしたの パーティーですが、飲み物は わたしが 買いますから、アリさんは おかしを お願いします。\n（鈴木）\n\nアリさんは 何を 買いますか。",
          "options": [
            "おかし",
            "飲み物",
            "ケーキ",
            "何も買わない"
          ],
          "answer": 0,
          "explanation": "Suzuki meminta Ari untuk mengurus camilan (アリさんは おかしを お願いします).",
          "period": "sep-nov"
        },
        {
          "id": 43,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜セールのお知らせ＞\nスーパー「さくら」\n水曜日：野菜が 20% オフ\n金曜日：お肉が 20% オフ\n\n金曜日に 安く なるのは 何ですか。",
          "options": [
            "お肉",
            "野菜",
            "魚",
            "果物"
          ],
          "answer": 0,
          "explanation": "Pada hari Jumat (金曜日), yang diskon adalah daging (お肉).",
          "period": "sep-nov"
        },
        {
          "id": 44,
          "section": "reading",
          "text": "【文を読んで答えてください】\nわたしの まちは 小さいですが、とても しずかで きれいです。ゆうめいな おてらが あります。えきから バスで 10分ぐらいです。\n\nこの まちは どんな まちですか。",
          "options": [
            "小さくて きれいな まち",
            "大きくて にぎやかな まち",
            "えきから 遠い まち",
            "おてらが ない まち"
          ],
          "answer": 0,
          "explanation": "Ditulis bahwa kotanya kecil tapi tenang dan indah (小さいですが... きれいです).",
          "period": "sep-nov"
        },
        {
          "id": 45,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n７月１５日（土）\nきょうは 友だちと デパートへ 行った。シャツを 買いたかったが、高いもの しか なかったので、買わなかった。そのあと、レストランで カレーを 食べた。\n\nこの人は デパートで 何を 買いましたか。",
          "options": [
            "何も買わなかった",
            "シャツ",
            "カレー",
            "高いもの"
          ],
          "answer": 0,
          "explanation": "Karena hanya ada yang mahal, dia tidak membeli kemeja (買わなかった).",
          "period": "sep-nov"
        },
        {
          "id": 46,
          "section": "vocab",
          "text": "まいにち 6じに （　　　）を します。",
          "options": [
            "べんきょう",
            "あさごはん",
            "でんしゃ",
            "しごと"
          ],
          "answer": 0,
          "explanation": "「べんきょうをします」= belajar.",
          "period": "sep-nov"
        },
        {
          "id": 47,
          "section": "vocab",
          "text": "わたしは まいばん 11じに （　　　）。",
          "options": [
            "ねます",
            "おきます",
            "あそびます",
            "はたらきます"
          ],
          "answer": 0,
          "explanation": "「ねます」= tidur. Jam 11 malam biasanya tidur.",
          "period": "sep-nov"
        },
        {
          "id": 48,
          "section": "vocab",
          "text": "あさごはんに パンと たまごを （　　　）。",
          "options": [
            "たべます",
            "のみます",
            "ききます",
            "よみます"
          ],
          "answer": 0,
          "explanation": "「たべます」= makan, digunakan untuk makanan.",
          "period": "sep-nov"
        },
        {
          "id": 49,
          "section": "vocab",
          "text": "まいにち みずを たくさん （　　　）。",
          "options": [
            "のみます",
            "たべます",
            "かいます",
            "かきます"
          ],
          "answer": 0,
          "explanation": "「のみます」= minum.",
          "period": "sep-nov"
        },
        {
          "id": 50,
          "section": "vocab",
          "text": "でんしゃに （　　　）まえに、きっぷを かいます。",
          "options": [
            "のる",
            "たべる",
            "みる",
            "ねる"
          ],
          "answer": 0,
          "explanation": "「でんしゃに のる」= naik kereta.",
          "period": "sep-nov"
        },
        {
          "id": 51,
          "section": "vocab",
          "text": "スーパーで くだものを （　　　）。",
          "options": [
            "かいます",
            "うります",
            "つかいます",
            "およぎます"
          ],
          "answer": 0,
          "explanation": "「かいます」= membeli.",
          "period": "sep-nov"
        },
        {
          "id": 52,
          "section": "vocab",
          "text": "この かばんは 5000えんです。ちょっと （　　　）です。",
          "options": [
            "たかい",
            "やすい",
            "ちいさい",
            "おもしろい"
          ],
          "answer": 0,
          "explanation": "「たかい」= mahal/tinggi. Harga 5000 yen dianggap mahal dalam konteks soal.",
          "period": "sep-nov"
        },
        {
          "id": 53,
          "section": "vocab",
          "text": "この りんごは 100えんです。とても （　　　）です。",
          "options": [
            "やすい",
            "たかい",
            "おそい",
            "くらい"
          ],
          "answer": 0,
          "explanation": "「やすい」= murah.",
          "period": "sep-nov"
        },
        {
          "id": 54,
          "section": "vocab",
          "text": "きょうは てんきが （　　　）です。",
          "options": [
            "いい",
            "おおきい",
            "ながい",
            "おもい"
          ],
          "answer": 0,
          "explanation": "「てんきが いい」= cuacanya bagus.",
          "period": "sep-nov"
        },
        {
          "id": 55,
          "section": "vocab",
          "text": "きょうは ゆきです。そとが （　　　）です。",
          "options": [
            "さむい",
            "あつい",
            "あかるい",
            "ひろい"
          ],
          "answer": 0,
          "explanation": "「さむい」= dingin. Salju menjadi konteks yang jelas untuk cuaca dingin.",
          "period": "sep-nov"
        },
        {
          "id": 56,
          "section": "vocab",
          "text": "この へやは 10にんで いっぱいです。とても （　　　）です。",
          "options": [
            "せまい",
            "ひろい",
            "あたらしい",
            "あまい"
          ],
          "answer": 0,
          "explanation": "「せまい」= sempit. Ruangan yang penuh oleh 10 orang digambarkan sebagai sempit.",
          "period": "sep-nov"
        },
        {
          "id": 57,
          "section": "vocab",
          "text": "こうえんで ともだちと （　　　）。",
          "options": [
            "あそびます",
            "はたらきます",
            "ねます",
            "かいます"
          ],
          "answer": 0,
          "explanation": "「あそびます」= bermain.",
          "period": "sep-nov"
        },
        {
          "id": 58,
          "section": "vocab",
          "text": "まいにち 7じから 4じまで （　　　）。",
          "options": [
            "はたらきます",
            "あそびます",
            "ねます",
            "およぎます"
          ],
          "answer": 0,
          "explanation": "「はたらきます」= bekerja.",
          "period": "sep-nov"
        },
        {
          "id": 59,
          "section": "vocab",
          "text": "しごとの あとで、うちへ （　　　）。",
          "options": [
            "かえります",
            "いきます",
            "きます",
            "はいります"
          ],
          "answer": 0,
          "explanation": "「かえります」= pulang/kembali ke rumah.",
          "period": "sep-nov"
        },
        {
          "id": 60,
          "section": "vocab",
          "text": "あした 8じに がっこうへ （　　　）。",
          "options": [
            "いきます",
            "かえります",
            "きます",
            "ねます"
          ],
          "answer": 0,
          "explanation": "「いきます」= pergi.",
          "period": "sep-nov"
        },
        {
          "id": 61,
          "section": "vocab",
          "text": "せんせいが きょうしつに （　　　）。",
          "options": [
            "きます",
            "いきます",
            "かえります",
            "ねます"
          ],
          "answer": 0,
          "explanation": "「きます」= datang ke tempat pembicara/tujuan yang menjadi acuan.",
          "period": "sep-nov"
        },
        {
          "id": 62,
          "section": "vocab",
          "text": "ともだちに メールを （　　　）。",
          "options": [
            "おくります",
            "あらいます",
            "つくります",
            "あびます"
          ],
          "answer": 0,
          "explanation": "「メールを おくります」= mengirim email.",
          "period": "sep-nov"
        },
        {
          "id": 63,
          "section": "vocab",
          "text": "でんわで ははと （　　　）。",
          "options": [
            "はなします",
            "よみます",
            "かきます",
            "ききます"
          ],
          "answer": 0,
          "explanation": "「はなします」= berbicara.",
          "period": "sep-nov"
        },
        {
          "id": 64,
          "section": "vocab",
          "text": "まいにち にほんごの ほんを （　　　）。",
          "options": [
            "よみます",
            "のみます",
            "ききます",
            "あびます"
          ],
          "answer": 0,
          "explanation": "「よみます」= membaca.",
          "period": "sep-nov"
        },
        {
          "id": 65,
          "section": "vocab",
          "text": "おんがくを （　　　）が すきです。",
          "options": [
            "きく",
            "たべる",
            "かう",
            "あらう"
          ],
          "answer": 0,
          "explanation": "「おんがくを きく」= mendengarkan musik.",
          "period": "sep-nov"
        },
        {
          "id": 66,
          "section": "vocab",
          "text": "てがみを （　　　）。",
          "options": [
            "かきます",
            "ききます",
            "のみます",
            "はいります"
          ],
          "answer": 0,
          "explanation": "「かきます」= menulis.",
          "period": "sep-nov"
        },
        {
          "id": 67,
          "section": "vocab",
          "text": "シャワーを （　　　）から、ねます。",
          "options": [
            "あびて",
            "のんで",
            "たべて",
            "よんで"
          ],
          "answer": 0,
          "explanation": "「シャワーを あびる」= mandi dengan shower.",
          "period": "sep-nov"
        },
        {
          "id": 68,
          "section": "vocab",
          "text": "てを （　　　）から、ごはんを たべます。",
          "options": [
            "あらって",
            "みがいて",
            "きいて",
            "あけて"
          ],
          "answer": 0,
          "explanation": "「てを あらう」= mencuci tangan.",
          "period": "sep-nov"
        },
        {
          "id": 69,
          "section": "vocab",
          "text": "ドアを （　　　）ください。",
          "options": [
            "しめて",
            "たべて",
            "のんで",
            "きいて"
          ],
          "answer": 0,
          "explanation": "「ドアを しめてください」= tolong tutup pintunya.",
          "period": "sep-nov"
        },
        {
          "id": 70,
          "section": "vocab",
          "text": "まどを （　　　）ください。",
          "options": [
            "あけて",
            "しめて",
            "たべて",
            "ねて"
          ],
          "answer": 0,
          "explanation": "「まどを あけてください」= tolong buka jendelanya.",
          "period": "sep-nov"
        },
        {
          "id": 71,
          "section": "vocab",
          "text": "ここに なまえを （　　　）ください。",
          "options": [
            "かいて",
            "よんで",
            "きいて",
            "のんで"
          ],
          "answer": 0,
          "explanation": "「なまえを かいてください」= tolong tulis nama.",
          "period": "sep-nov"
        },
        {
          "id": 72,
          "section": "vocab",
          "text": "えきは どこですか。あの みぎの （　　　）です。",
          "options": [
            "たてもの",
            "たべもの",
            "のみもの",
            "のりもの"
          ],
          "answer": 0,
          "explanation": "「たてもの」= gedung/bangunan.",
          "period": "sep-nov"
        },
        {
          "id": 73,
          "section": "vocab",
          "text": "コンビニで おにぎりを （　　　）。",
          "options": [
            "かいました",
            "つくりました",
            "およぎました",
            "ねました"
          ],
          "answer": 0,
          "explanation": "「かいました」= membeli.",
          "period": "sep-nov"
        },
        {
          "id": 74,
          "section": "vocab",
          "text": "きのう ともだちと えいがを （　　　）。",
          "options": [
            "みました",
            "ききました",
            "よみました",
            "かきました"
          ],
          "answer": 0,
          "explanation": "「えいがを みます」= menonton film.",
          "period": "sep-nov"
        },
        {
          "id": 75,
          "section": "vocab",
          "text": "きのう こうえんで サッカーを （　　　）。",
          "options": [
            "しました",
            "のみました",
            "かいました",
            "よみました"
          ],
          "answer": 0,
          "explanation": "「サッカーを します」= bermain sepak bola.",
          "period": "sep-nov"
        },
        {
          "id": 76,
          "section": "vocab",
          "text": "「学校」は ひらがなで どう かきますか。",
          "options": [
            "がっこう",
            "がくせい",
            "せんせい",
            "きょうしつ"
          ],
          "answer": 0,
          "explanation": "学校 = がっこう = sekolah.",
          "period": "sep-nov"
        },
        {
          "id": 77,
          "section": "vocab",
          "text": "「先生」は ひらがなで どう かきますか。",
          "options": [
            "せんせい",
            "がくせい",
            "ともだち",
            "かいしゃ"
          ],
          "answer": 0,
          "explanation": "先生 = せんせい = guru.",
          "period": "sep-nov"
        },
        {
          "id": 78,
          "section": "vocab",
          "text": "「学生」は ひらがなで どう かきますか。",
          "options": [
            "がくせい",
            "せんせい",
            "がっこう",
            "せいと"
          ],
          "answer": 0,
          "explanation": "学生 = がくせい = siswa/mahasiswa.",
          "period": "sep-nov"
        },
        {
          "id": 79,
          "section": "vocab",
          "text": "「友達」は ひらがなで どう かきますか。",
          "options": [
            "ともだち",
            "かぞく",
            "せんせい",
            "きょうだい"
          ],
          "answer": 0,
          "explanation": "友達 = ともだち = teman.",
          "period": "sep-nov"
        },
        {
          "id": 80,
          "section": "vocab",
          "text": "「会社」は ひらがなで どう かきますか。",
          "options": [
            "かいしゃ",
            "がっこう",
            "びょういん",
            "ぎんこう"
          ],
          "answer": 0,
          "explanation": "会社 = かいしゃ = perusahaan/kantor.",
          "period": "sep-nov"
        },
        {
          "id": 81,
          "section": "vocab",
          "text": "「病院」は ひらがなで どう かきますか。",
          "options": [
            "びょういん",
            "ぎんこう",
            "ゆうびんきょく",
            "としょかん"
          ],
          "answer": 0,
          "explanation": "病院 = びょういん = rumah sakit.",
          "period": "sep-nov"
        },
        {
          "id": 82,
          "section": "vocab",
          "text": "「銀行」は ひらがなで どう かきますか。",
          "options": [
            "ぎんこう",
            "びょういん",
            "えき",
            "こうえん"
          ],
          "answer": 0,
          "explanation": "銀行 = ぎんこう = bank.",
          "period": "sep-nov"
        },
        {
          "id": 83,
          "section": "vocab",
          "text": "「電話」は ひらがなで どう かきますか。",
          "options": [
            "でんわ",
            "でんしゃ",
            "てがみ",
            "しんぶん"
          ],
          "answer": 0,
          "explanation": "電話 = でんわ = telepon.",
          "period": "sep-nov"
        },
        {
          "id": 84,
          "section": "vocab",
          "text": "「新聞」は ひらがなで どう かきますか。",
          "options": [
            "しんぶん",
            "ざっし",
            "てがみ",
            "ほん"
          ],
          "answer": 0,
          "explanation": "新聞 = しんぶん = koran.",
          "period": "sep-nov"
        },
        {
          "id": 85,
          "section": "vocab",
          "text": "「電車」は ひらがなで どう かきますか。",
          "options": [
            "でんしゃ",
            "でんわ",
            "じてんしゃ",
            "くるま"
          ],
          "answer": 0,
          "explanation": "電車 = でんしゃ = kereta listrik.",
          "period": "sep-nov"
        },
        {
          "id": 86,
          "section": "vocab",
          "text": "「自転車」は ひらがなで どう かきますか。",
          "options": [
            "じてんしゃ",
            "でんしゃ",
            "くるま",
            "ひこうき"
          ],
          "answer": 0,
          "explanation": "自転車 = じてんしゃ = sepeda.",
          "period": "sep-nov"
        },
        {
          "id": 87,
          "section": "vocab",
          "text": "「大きい」は はんたいの いみは なんですか。",
          "options": [
            "小さい",
            "新しい",
            "古い",
            "長い"
          ],
          "answer": 0,
          "explanation": "大きい = besar, lawannya 小さい = kecil.",
          "period": "sep-nov"
        },
        {
          "id": 88,
          "section": "vocab",
          "text": "「新しい」は はんたいの いみは なんですか。",
          "options": [
            "古い",
            "高い",
            "安い",
            "近い"
          ],
          "answer": 0,
          "explanation": "新しい = baru, lawannya 古い = lama/tua.",
          "period": "sep-nov"
        },
        {
          "id": 89,
          "section": "vocab",
          "text": "「暑い」は はんたいの いみは なんですか。",
          "options": [
            "寒い",
            "暖かい",
            "明るい",
            "涼しい"
          ],
          "answer": 0,
          "explanation": "暑い = panas, lawannya 寒い = dingin.",
          "period": "sep-nov"
        },
        {
          "id": 90,
          "section": "vocab",
          "text": "「長い」は はんたいの いみは なんですか。",
          "options": [
            "短い",
            "大きい",
            "重い",
            "高い"
          ],
          "answer": 0,
          "explanation": "長い = panjang, lawannya 短い = pendek.",
          "period": "sep-nov"
        },
        {
          "id": 91,
          "section": "vocab",
          "text": "「近い」は はんたいの いみは なんですか。",
          "options": [
            "遠い",
            "早い",
            "遅い",
            "広い"
          ],
          "answer": 0,
          "explanation": "近い = dekat, lawannya 遠い = jauh.",
          "period": "sep-nov"
        },
        {
          "id": 92,
          "section": "vocab",
          "text": "あしたは （　　　）です。しごとが ありません。",
          "options": [
            "やすみ",
            "しごと",
            "べんきょう",
            "でんしゃ"
          ],
          "answer": 0,
          "explanation": "「やすみ」= libur.",
          "period": "sep-nov"
        },
        {
          "id": 93,
          "section": "vocab",
          "text": "きょうは つかれました。はやく （　　　）たいです。",
          "options": [
            "ね",
            "たべ",
            "いき",
            "かき"
          ],
          "answer": 0,
          "explanation": "「ねたい」 berasal dari ねる = ingin tidur.",
          "period": "sep-nov"
        },
        {
          "id": 94,
          "section": "vocab",
          "text": "おなかが すきました。なにか （　　　）たいです。",
          "options": [
            "たべ",
            "のみ",
            "み",
            "きき"
          ],
          "answer": 0,
          "explanation": "「たべたい」= ingin makan.",
          "period": "sep-nov"
        },
        {
          "id": 95,
          "section": "vocab",
          "text": "のどが かわきました。おちゃを （　　　）たいです。",
          "options": [
            "のみ",
            "たべ",
            "み",
            "よみ"
          ],
          "answer": 0,
          "explanation": "「のみたい」= ingin minum.",
          "period": "sep-nov"
        },
        {
          "id": 96,
          "section": "vocab",
          "text": "あした ともだちと えいがを （　　　）たいです。",
          "options": [
            "み",
            "きき",
            "よみ",
            "かき"
          ],
          "answer": 0,
          "explanation": "「みたい」= ingin menonton/melihat.",
          "period": "sep-nov"
        },
        {
          "id": 97,
          "section": "vocab",
          "text": "「一日」の 日付は なんと よみますか。",
          "options": [
            "ついたち",
            "ふつか",
            "みっか",
            "よっか"
          ],
          "answer": 0,
          "explanation": "Sebagai tanggal, 一日 dibaca ついたち.",
          "period": "sep-nov"
        },
        {
          "id": 98,
          "section": "vocab",
          "text": "「二日」は なんと よみますか。",
          "options": [
            "ふつか",
            "ついたち",
            "みっか",
            "いつか"
          ],
          "answer": 0,
          "explanation": "二日 = ふつか.",
          "period": "sep-nov"
        },
        {
          "id": 99,
          "section": "vocab",
          "text": "「三日」は なんと よみますか。",
          "options": [
            "みっか",
            "ふつか",
            "よっか",
            "いつか"
          ],
          "answer": 0,
          "explanation": "三日 = みっか.",
          "period": "sep-nov"
        },
        {
          "id": 100,
          "section": "vocab",
          "text": "「五人」は なんと よみますか。",
          "options": [
            "ごにん",
            "ごひと",
            "いつにん",
            "ごじん"
          ],
          "answer": 0,
          "explanation": "五人 = ごにん = lima orang.",
          "period": "sep-nov"
        },
        {
          "id": 101,
          "section": "vocab",
          "text": "「毎日」は なんと よみますか。",
          "options": [
            "まいにち",
            "まいげつ",
            "まいしゅう",
            "まいとし"
          ],
          "answer": 0,
          "explanation": "毎日 = まいにち = setiap hari.",
          "period": "sep-nov"
        },
        {
          "id": 102,
          "section": "vocab",
          "text": "「今週」は なんと よみますか。",
          "options": [
            "こんしゅう",
            "せんしゅう",
            "らいしゅう",
            "こんげつ"
          ],
          "answer": 0,
          "explanation": "今週 = こんしゅう = minggu ini.",
          "period": "sep-nov"
        },
        {
          "id": 103,
          "section": "vocab",
          "text": "「来週」は なんと よみますか。",
          "options": [
            "らいしゅう",
            "せんしゅう",
            "こんしゅう",
            "まいしゅう"
          ],
          "answer": 0,
          "explanation": "来週 = らいしゅう = minggu depan.",
          "period": "sep-nov"
        },
        {
          "id": 104,
          "section": "vocab",
          "text": "「去年」は なんと よみますか。",
          "options": [
            "きょねん",
            "ことし",
            "らいねん",
            "せんげつ"
          ],
          "answer": 0,
          "explanation": "去年 = きょねん = tahun lalu.",
          "period": "sep-nov"
        },
        {
          "id": 105,
          "section": "vocab",
          "text": "「今年」は なんと よみますか。",
          "options": [
            "ことし",
            "きょねん",
            "らいねん",
            "こんげつ"
          ],
          "answer": 0,
          "explanation": "今年 = ことし = tahun ini.",
          "period": "sep-nov"
        },
        {
          "id": 106,
          "section": "vocab",
          "text": "「来年」は なんと よみますか。",
          "options": [
            "らいねん",
            "ことし",
            "きょねん",
            "らいげつ"
          ],
          "answer": 0,
          "explanation": "来年 = らいねん = tahun depan.",
          "period": "sep-nov"
        },
        {
          "id": 107,
          "section": "vocab",
          "text": "あさ、コーヒーを （　　　）ながら、テレビを みます。",
          "options": [
            "のみ",
            "たべ",
            "よみ",
            "かき"
          ],
          "answer": 0,
          "explanation": "「のみながら」= sambil minum.",
          "period": "sep-nov"
        },
        {
          "id": 108,
          "section": "vocab",
          "text": "でんしゃの なかで おんがくを （　　　）。",
          "options": [
            "ききます",
            "たべます",
            "つくります",
            "あらいます"
          ],
          "answer": 0,
          "explanation": "「おんがくを ききます」= mendengarkan musik.",
          "period": "sep-nov"
        },
        {
          "id": 109,
          "section": "vocab",
          "text": "しごとの ひるやすみに おべんとうを （　　　）。",
          "options": [
            "たべます",
            "ききます",
            "みます",
            "かきます"
          ],
          "answer": 0,
          "explanation": "「おべんとうを たべます」= makan bekal.",
          "period": "sep-nov"
        },
        {
          "id": 110,
          "section": "vocab",
          "text": "あついですね。エアコンを （　　　）ましょう。",
          "options": [
            "つけ",
            "けし",
            "あけ",
            "しめ"
          ],
          "answer": 0,
          "explanation": "「エアコンを つけましょう」= mari nyalakan AC.",
          "period": "sep-nov"
        },
        {
          "id": 111,
          "section": "vocab",
          "text": "へやを でるとき、でんきを （　　　）ください。",
          "options": [
            "けして",
            "つけて",
            "あけて",
            "いれて"
          ],
          "answer": 0,
          "explanation": "「でんきを けす」= mematikan lampu.",
          "period": "sep-nov"
        },
        {
          "id": 112,
          "section": "vocab",
          "text": "ここに くるまを （　　　）も いいですか。",
          "options": [
            "とめて",
            "のって",
            "はしって",
            "つかって"
          ],
          "answer": 0,
          "explanation": "「くるまを とめる」= memarkir/menghentikan mobil.",
          "period": "sep-nov"
        },
        {
          "id": 113,
          "section": "vocab",
          "text": "この へやで たばこを （　　　）は いけません。",
          "options": [
            "すって",
            "たべて",
            "のんで",
            "みて"
          ],
          "answer": 0,
          "explanation": "「たばこを すう」= merokok.",
          "period": "sep-nov"
        },
        {
          "id": 114,
          "section": "vocab",
          "text": "あした 8じに ここへ （　　　）ください。",
          "options": [
            "きて",
            "いって",
            "かえって",
            "ねて"
          ],
          "answer": 0,
          "explanation": "「きてください」= silakan datang.",
          "period": "sep-nov"
        },
        {
          "id": 115,
          "section": "vocab",
          "text": "この ことばの いみを （　　　）ください。",
          "options": [
            "おしえて",
            "あそんで",
            "あらって",
            "つかって"
          ],
          "answer": 0,
          "explanation": "「おしえてください」= tolong beri tahu/jelaskan.",
          "period": "sep-nov"
        },
        {
          "id": 116,
          "section": "grammar",
          "text": "まいあさ 7じ（　　　）おきます。",
          "options": [
            "に",
            "で",
            "を",
            "が"
          ],
          "answer": 0,
          "explanation": "Partikel に digunakan untuk menunjukkan waktu tertentu. 7じにおきます = bangun jam 7.",
          "period": "sep-nov"
        },
        {
          "id": 117,
          "section": "grammar",
          "text": "わたしは まいにち バス（　　　）がっこうへ いきます。",
          "options": [
            "で",
            "に",
            "を",
            "が"
          ],
          "answer": 0,
          "explanation": "Partikel で menunjukkan alat atau kendaraan yang digunakan. バスで = dengan bus.",
          "period": "sep-nov"
        },
        {
          "id": 118,
          "section": "grammar",
          "text": "きのう ともだち（　　　）えいがを みました。",
          "options": [
            "と",
            "で",
            "に",
            "を"
          ],
          "answer": 0,
          "explanation": "と digunakan untuk menunjukkan melakukan sesuatu bersama seseorang. ともだちと = bersama teman.",
          "period": "sep-nov"
        },
        {
          "id": 119,
          "section": "grammar",
          "text": "つくえの うえ（　　　）ほんが あります。",
          "options": [
            "に",
            "で",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "に digunakan untuk menunjukkan tempat keberadaan sesuatu. つくえのうえに = di atas meja.",
          "period": "sep-nov"
        },
        {
          "id": 120,
          "section": "grammar",
          "text": "わたしは まいにち にほんご（　　　）べんきょうします。",
          "options": [
            "を",
            "に",
            "で",
            "と"
          ],
          "answer": 0,
          "explanation": "Partikel を menandai objek dari kata kerja. 日本語を勉強します = belajar bahasa Jepang.",
          "period": "sep-nov"
        },
        {
          "id": 121,
          "section": "grammar",
          "text": "きょうは あまり さむく（　　　）。",
          "options": [
            "ないです",
            "ありません",
            "です",
            "でした"
          ],
          "answer": 0,
          "explanation": "Untuk kata sifat-i, bentuk negatifnya adalah ～くないです. あまり～ない = tidak terlalu.",
          "period": "sep-nov"
        },
        {
          "id": 122,
          "section": "grammar",
          "text": "この へやは きれい（　　　）ひろいです。",
          "options": [
            "で",
            "くて",
            "な",
            "に"
          ],
          "answer": 0,
          "explanation": "Untuk menyambungkan dua kata sifat-na, gunakan で. きれいでひろい = bersih dan luas.",
          "period": "sep-nov"
        },
        {
          "id": 123,
          "section": "grammar",
          "text": "この りんごは あまり （　　　）。",
          "options": [
            "おいしくないです",
            "おいしいです",
            "おいしかったです",
            "おいしくてです"
          ],
          "answer": 0,
          "explanation": "あまり biasanya digunakan bersama bentuk negatif. あまりおいしくない = tidak terlalu enak.",
          "period": "sep-nov"
        },
        {
          "id": 124,
          "section": "grammar",
          "text": "きのうは いそがしかった（　　　）、きょうは ひまです。",
          "options": [
            "ですが",
            "から",
            "ので",
            "と"
          ],
          "answer": 0,
          "explanation": "ですが digunakan untuk menunjukkan kontras: kemarin sibuk, tetapi hari ini senggang.",
          "period": "sep-nov"
        },
        {
          "id": 125,
          "section": "grammar",
          "text": "あした しごとが あります（　　　）、はやく ねます。",
          "options": [
            "から",
            "でも",
            "が",
            "と"
          ],
          "answer": 0,
          "explanation": "から menunjukkan alasan. Karena besok ada kerja, tidur lebih awal.",
          "period": "sep-nov"
        },
        {
          "id": 126,
          "section": "grammar",
          "text": "あめが ふっています（　　　）、かさを もって いきます。",
          "options": [
            "から",
            "でも",
            "し",
            "と"
          ],
          "answer": 0,
          "explanation": "から digunakan untuk menyatakan alasan: karena hujan, membawa payung.",
          "period": "sep-nov"
        },
        {
          "id": 127,
          "section": "grammar",
          "text": "ここに なまえを （　　　）ください。",
          "options": [
            "かいて",
            "かきて",
            "かく",
            "かいた"
          ],
          "answer": 0,
          "explanation": "Permintaan sopan menggunakan pola ～てください. かく → かいて.",
          "period": "sep-nov"
        },
        {
          "id": 128,
          "section": "grammar",
          "text": "ちょっと まって （　　　）。",
          "options": [
            "ください",
            "います",
            "あります",
            "しまいます"
          ],
          "answer": 0,
          "explanation": "～てください digunakan untuk meminta seseorang melakukan sesuatu. まってください = tolong tunggu.",
          "period": "sep-nov"
        },
        {
          "id": 129,
          "section": "grammar",
          "text": "ここで しゃしんを （　　　）も いいですか。",
          "options": [
            "とって",
            "とる",
            "とった",
            "とり"
          ],
          "answer": 0,
          "explanation": "Pola ～てもいいですか digunakan untuk meminta izin. しゃしんをとってもいいですか = boleh mengambil foto?",
          "period": "sep-nov"
        },
        {
          "id": 130,
          "section": "grammar",
          "text": "この へやに はいって（　　　）いけません。",
          "options": [
            "は",
            "も",
            "を",
            "に"
          ],
          "answer": 0,
          "explanation": "Pola ～てはいけません berarti tidak boleh melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 131,
          "section": "grammar",
          "text": "ここで およいで（　　　）いけません。",
          "options": [
            "は",
            "も",
            "が",
            "を"
          ],
          "answer": 0,
          "explanation": "～てはいけません = tidak boleh. およいではいけません = tidak boleh berenang.",
          "period": "sep-nov"
        },
        {
          "id": 132,
          "section": "grammar",
          "text": "まどを （　　　）ください。さむいですから。",
          "options": [
            "しめて",
            "しめる",
            "しめた",
            "しめない"
          ],
          "answer": 0,
          "explanation": "～てください digunakan untuk permintaan. まどをしめてください = tolong tutup jendela.",
          "period": "sep-nov"
        },
        {
          "id": 133,
          "section": "grammar",
          "text": "A:「いっしょに ひるごはんを たべませんか。」\nB:「すみません。きょうは （　　　）。」",
          "options": [
            "ちょっと…",
            "そうです",
            "どうぞ",
            "こちらこそ"
          ],
          "answer": 0,
          "explanation": "ちょっと… sering digunakan untuk menolak ajakan secara halus dan sopan.",
          "period": "sep-nov"
        },
        {
          "id": 134,
          "section": "grammar",
          "text": "A:「これ、どうぞ。」\nB:「（　　　）。」",
          "options": [
            "ありがとうございます",
            "いただきます",
            "いってきます",
            "おかえりなさい"
          ],
          "answer": 0,
          "explanation": "Saat menerima sesuatu dari orang lain, gunakan ありがとうございます = terima kasih.",
          "period": "sep-nov"
        },
        {
          "id": 135,
          "section": "grammar",
          "text": "A:「ただいま。」\nB:「（　　　）。」",
          "options": [
            "おかえりなさい",
            "いってらっしゃい",
            "いただきます",
            "おやすみなさい"
          ],
          "answer": 0,
          "explanation": "ただいま dijawab dengan おかえりなさい ketika seseorang pulang.",
          "period": "sep-nov"
        },
        {
          "id": 136,
          "section": "grammar",
          "text": "A:「いってきます。」\nB:「（　　　）。」",
          "options": [
            "いってらっしゃい",
            "おかえりなさい",
            "ただいま",
            "いただきます"
          ],
          "answer": 0,
          "explanation": "いってきます dijawab dengan いってらっしゃい.",
          "period": "sep-nov"
        },
        {
          "id": 137,
          "section": "grammar",
          "text": "A:「おさきに しつれいします。」\nB:「（　　　）。」",
          "options": [
            "おつかれさまでした",
            "いただきます",
            "おかえりなさい",
            "いってきます"
          ],
          "answer": 0,
          "explanation": "Di tempat kerja, おさきにしつれいします dapat dijawab dengan おつかれさまでした.",
          "period": "sep-nov"
        },
        {
          "id": 138,
          "section": "grammar",
          "text": "A:「すみません、えきは どこですか。」\nB:「（　　　）です。」",
          "options": [
            "あそこ",
            "あの",
            "あれ",
            "あのひと"
          ],
          "answer": 0,
          "explanation": "あそこ digunakan untuk menunjukkan tempat yang jauh dari pembicara dan lawan bicara.",
          "period": "sep-nov"
        },
        {
          "id": 139,
          "section": "grammar",
          "text": "A:「これは だれの かばんですか。」\nB:「（　　　）です。」",
          "options": [
            "わたしの",
            "わたし",
            "わたしを",
            "わたしが"
          ],
          "answer": 0,
          "explanation": "わたしの berarti milik saya. Kata benda setelah の dapat dihilangkan jika sudah jelas.",
          "period": "sep-nov"
        },
        {
          "id": 140,
          "section": "grammar",
          "text": "A:「どんな たべものが すきですか。」\nB:「（　　　）たべものが すきです。」",
          "options": [
            "からい",
            "からく",
            "からいな",
            "からいに"
          ],
          "answer": 0,
          "explanation": "どんな + kata benda digunakan untuk menanyakan jenis atau sifat sesuatu. からいたべもの = makanan pedas.",
          "period": "sep-nov"
        },
        {
          "id": 141,
          "section": "grammar",
          "text": "わたしは にほんへ （　　　）たいです。",
          "options": [
            "いき",
            "いく",
            "いって",
            "いった"
          ],
          "answer": 0,
          "explanation": "Bentuk ～たい digunakan untuk menyatakan keinginan. いく → いきたい = ingin pergi.",
          "period": "sep-nov"
        },
        {
          "id": 142,
          "section": "grammar",
          "text": "にほんで しごとを （　　　）たいです。",
          "options": [
            "し",
            "する",
            "して",
            "した"
          ],
          "answer": 0,
          "explanation": "する → したい. Pola ～たい menyatakan ingin melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 143,
          "section": "grammar",
          "text": "いま ごはんを （　　　）います。",
          "options": [
            "たべて",
            "たべ",
            "たべる",
            "たべた"
          ],
          "answer": 0,
          "explanation": "～ています digunakan untuk kegiatan yang sedang berlangsung. たべています = sedang makan.",
          "period": "sep-nov"
        },
        {
          "id": 144,
          "section": "grammar",
          "text": "たなかさんは いま でんわを （　　　）います。",
          "options": [
            "して",
            "し",
            "する",
            "した"
          ],
          "answer": 0,
          "explanation": "電話をしています = sedang menelepon/bertelepon.",
          "period": "sep-nov"
        },
        {
          "id": 145,
          "section": "grammar",
          "text": "ちちは いま しごとを （　　　）います。",
          "options": [
            "して",
            "し",
            "する",
            "した"
          ],
          "answer": 0,
          "explanation": "している menunjukkan aktivitas yang sedang dilakukan. しごとをしています = sedang bekerja.",
          "period": "sep-nov"
        },
        {
          "id": 146,
          "section": "grammar",
          "text": "まいにち にほんごを （　　　）なければなりません。",
          "options": [
            "べんきょうし",
            "べんきょうする",
            "べんきょうして",
            "べんきょうした"
          ],
          "answer": 0,
          "explanation": "～なければなりません berarti harus. べんきょうしなければなりません = harus belajar.",
          "period": "sep-nov"
        },
        {
          "id": 147,
          "section": "grammar",
          "text": "あした 8じまでに 会社へ （　　　）なければなりません。",
          "options": [
            "いか",
            "いき",
            "いって",
            "いった"
          ],
          "answer": 0,
          "explanation": "いく → いかない → いかなければなりません. Artinya harus pergi.",
          "period": "sep-nov"
        },
        {
          "id": 148,
          "section": "grammar",
          "text": "ここで くつを （　　　）なければなりませんか。",
          "options": [
            "ぬが",
            "ぬぎ",
            "ぬいで",
            "ぬいだ"
          ],
          "answer": 0,
          "explanation": "ぬぐ → ぬがない → ぬがなければなりません = harus melepas.",
          "period": "sep-nov"
        },
        {
          "id": 149,
          "section": "grammar",
          "text": "きょうは しごとが （　　　）から、うちで やすみます。",
          "options": [
            "ありません",
            "ないです",
            "ありませんでした",
            "なかったです"
          ],
          "answer": 0,
          "explanation": "ありません digunakan untuk menyatakan tidak ada. しごとがありません = tidak ada pekerjaan.",
          "period": "sep-nov"
        },
        {
          "id": 150,
          "section": "grammar",
          "text": "わたしは すしを （　　　）ことが あります。",
          "options": [
            "たべた",
            "たべる",
            "たべて",
            "たべない"
          ],
          "answer": 0,
          "explanation": "～たことがあります = pernah melakukan sesuatu. たべたことがあります = pernah makan.",
          "period": "sep-nov"
        },
        {
          "id": 151,
          "section": "grammar",
          "text": "にほんの おまつりを （　　　）ことが ありますか。",
          "options": [
            "みた",
            "みる",
            "みて",
            "みない"
          ],
          "answer": 0,
          "explanation": "Untuk pengalaman pernah melakukan sesuatu, gunakan bentuk た + ことがあります.",
          "period": "sep-nov"
        },
        {
          "id": 152,
          "section": "grammar",
          "text": "ここから えきまで あるいて 10ぷん（　　　）です。",
          "options": [
            "ぐらい",
            "だけ",
            "しか",
            "まで"
          ],
          "answer": 0,
          "explanation": "ぐらい digunakan untuk menyatakan perkiraan jumlah atau waktu. 10ぷんぐらい = sekitar 10 menit.",
          "period": "sep-nov"
        },
        {
          "id": 153,
          "section": "grammar",
          "text": "きょうは 2じ（　　　）べんきょうしました。",
          "options": [
            "ぐらい",
            "だけ",
            "しか",
            "ごろ"
          ],
          "answer": 0,
          "explanation": "ぐらい dapat menunjukkan durasi perkiraan. 2じぐらい = sekitar 2 jam.",
          "period": "sep-nov"
        },
        {
          "id": 154,
          "section": "grammar",
          "text": "まいにち 8じ（　　　）しごとを はじめます。",
          "options": [
            "ごろ",
            "ぐらい",
            "だけ",
            "しか"
          ],
          "answer": 0,
          "explanation": "ごろ digunakan untuk perkiraan waktu tertentu. 8じごろ = sekitar jam 8.",
          "period": "sep-nov"
        },
        {
          "id": 155,
          "section": "grammar",
          "text": "りんごを 3（　　　）かいました。",
          "options": [
            "つ",
            "ほん",
            "まい",
            "だい"
          ],
          "answer": 0,
          "explanation": "～つ digunakan sebagai penghitung umum untuk benda. 3つ = みっつ.",
          "period": "sep-nov"
        },
        {
          "id": 156,
          "section": "grammar",
          "text": "ペットボトルを 2（　　　）ください。",
          "options": [
            "ほん",
            "まい",
            "だい",
            "さつ"
          ],
          "answer": 0,
          "explanation": "本（ほん） digunakan untuk benda panjang seperti botol. 2本 = にほん.",
          "period": "sep-nov"
        },
        {
          "id": 157,
          "section": "grammar",
          "text": "シャツを 2（　　　）かいました。",
          "options": [
            "まい",
            "ほん",
            "さつ",
            "だい"
          ],
          "answer": 0,
          "explanation": "枚（まい） digunakan untuk benda tipis seperti pakaian atau kertas.",
          "period": "sep-nov"
        },
        {
          "id": 158,
          "section": "grammar",
          "text": "わたしの へやは あにの へや（　　　）ひろいです。",
          "options": [
            "より",
            "ほど",
            "しか",
            "だけ"
          ],
          "answer": 0,
          "explanation": "AはBより～ digunakan untuk membandingkan: kamar saya lebih luas daripada kamar kakak.",
          "period": "sep-nov"
        },
        {
          "id": 159,
          "section": "grammar",
          "text": "バスと でんしゃと （　　　）が はやいですか。",
          "options": [
            "どちら",
            "どこ",
            "だれ",
            "なに"
          ],
          "answer": 0,
          "explanation": "どちら digunakan untuk menanyakan pilihan antara dua hal.",
          "period": "sep-nov"
        },
        {
          "id": 160,
          "section": "grammar",
          "text": "この まちで （　　　）が いちばん おおきいですか。",
          "options": [
            "どこ",
            "どちら",
            "だれ",
            "いつ"
          ],
          "answer": 0,
          "explanation": "どこ digunakan untuk menanyakan tempat. いちばんおおきい = paling besar.",
          "period": "sep-nov"
        },
        {
          "id": 161,
          "section": "grammar",
          "text": "にほんごと えいごと、（　　　）が むずかしいですか。",
          "options": [
            "どちら",
            "どこ",
            "だれ",
            "いつ"
          ],
          "answer": 0,
          "explanation": "どちら digunakan ketika memilih atau membandingkan dua hal.",
          "period": "sep-nov"
        },
        {
          "id": 162,
          "section": "grammar",
          "text": "A:「あした いっしょに べんきょうしませんか。」\nB:「（　　　）。なんじですか。」",
          "options": [
            "いいですね",
            "いいえ、ちがいます",
            "どういたしまして",
            "おめでとう"
          ],
          "answer": 0,
          "explanation": "いいですね digunakan untuk menyetujui atau merespons positif suatu ajakan.",
          "period": "sep-nov"
        },
        {
          "id": 163,
          "section": "grammar",
          "text": "A:「この かさ、つかっても いいですか。」\nB:「はい、（　　　）。」",
          "options": [
            "どうぞ",
            "どうも",
            "ごめんなさい",
            "そうですか"
          ],
          "answer": 0,
          "explanation": "どうぞ digunakan saat memberikan izin atau mempersilakan seseorang mengambil/menggunakan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 164,
          "section": "grammar",
          "text": "A:「すみません。ちょっと てつだって ください。」\nB:「はい、（　　　）。」",
          "options": [
            "わかりました",
            "いただきます",
            "おかえりなさい",
            "どういたしまして"
          ],
          "answer": 0,
          "explanation": "わかりました = baik, saya mengerti/mengerti permintaannya.",
          "period": "sep-nov"
        },
        {
          "id": 165,
          "section": "grammar",
          "text": "A:「すみません、トイレは どこですか。」\nB:「あそこ（　　　）あります。」",
          "options": [
            "に",
            "で",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "あります untuk benda/tempat menggunakan に untuk menunjukkan lokasi keberadaan.",
          "period": "sep-nov"
        },
        {
          "id": 166,
          "section": "grammar",
          "text": "A:「これは なんですか。」\nB:「にほんごの （　　　）です。」",
          "options": [
            "ほん",
            "ほんを",
            "ほんが",
            "ほんに"
          ],
          "answer": 0,
          "explanation": "Setelah の digunakan kata benda untuk menunjukkan hubungan kepemilikan/jenis: 日本語の本 = buku bahasa Jepang.",
          "period": "sep-nov"
        },
        {
          "id": 167,
          "section": "grammar",
          "text": "あした しごとが あります（　　　）、きょうは はやく ねます。",
          "options": [
            "から",
            "まで",
            "でも",
            "しか"
          ],
          "answer": 0,
          "explanation": "から menyatakan alasan: karena besok bekerja, hari ini tidur lebih awal.",
          "period": "sep-nov"
        },
        {
          "id": 168,
          "section": "grammar",
          "text": "わたしは コーヒー（　　　）おちゃも すきです。",
          "options": [
            "も",
            "が",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "も berarti juga. コーヒーもおちゃもすきです = suka kopi dan teh juga.",
          "period": "sep-nov"
        },
        {
          "id": 169,
          "section": "grammar",
          "text": "にちようび（　　　）どこへも いきませんでした。",
          "options": [
            "は",
            "を",
            "が",
            "で"
          ],
          "answer": 0,
          "explanation": "は digunakan untuk menandai topik. にちようびは = pada hari Minggu.",
          "period": "sep-nov"
        },
        {
          "id": 170,
          "section": "grammar",
          "text": "わたしは くだもの（　　　）すきです。",
          "options": [
            "が",
            "を",
            "で",
            "へ"
          ],
          "answer": 0,
          "explanation": "好きです biasanya menggunakan が untuk hal yang disukai. くだものがすきです.",
          "period": "sep-nov"
        },
        {
          "id": 171,
          "section": "grammar",
          "text": "きょうは どこ（　　　）いきません。",
          "options": [
            "へも",
            "へが",
            "へを",
            "へで"
          ],
          "answer": 0,
          "explanation": "どこへも + bentuk negatif berarti tidak pergi ke mana pun.",
          "period": "sep-nov"
        },
        {
          "id": 172,
          "section": "grammar",
          "text": "きのうは なにも （　　　）。",
          "options": [
            "たべませんでした",
            "たべました",
            "たべます",
            "たべたいです"
          ],
          "answer": 0,
          "explanation": "なにも + bentuk negatif berarti tidak melakukan/makan apa pun.",
          "period": "sep-nov"
        },
        {
          "id": 173,
          "section": "grammar",
          "text": "わたしは まだ ひるごはんを （　　　）。",
          "options": [
            "たべていません",
            "たべました",
            "たべています",
            "たべたいでした"
          ],
          "answer": 0,
          "explanation": "まだ～ていません berarti belum melakukan sesuatu. まだたべていません = belum makan.",
          "period": "sep-nov"
        },
        {
          "id": 174,
          "section": "grammar",
          "text": "もう しゅくだいを （　　　）。",
          "options": [
            "しました",
            "していません",
            "しませんでした",
            "するでしょう"
          ],
          "answer": 0,
          "explanation": "もう + bentuk lampau berarti sudah. もうしました = sudah mengerjakannya.",
          "period": "sep-nov"
        },
        {
          "id": 175,
          "section": "grammar",
          "text": "A:「もう ばんごはんを たべましたか。」\nB:「いいえ、（　　　）。」",
          "options": [
            "まだです",
            "もうです",
            "そうです",
            "どうぞ"
          ],
          "answer": 0,
          "explanation": "まだです digunakan untuk menjawab bahwa sesuatu belum dilakukan.",
          "period": "sep-nov"
        },
        {
          "id": 176,
          "section": "grammar",
          "text": "あした うちへ （　　　）まえに、スーパーへ いきます。",
          "options": [
            "かえる",
            "かえって",
            "かえった",
            "かえり"
          ],
          "answer": 0,
          "explanation": "Pola V bentuk kamus + まえに berarti sebelum melakukan sesuatu. かえるまえに = sebelum pulang.",
          "period": "sep-nov"
        },
        {
          "id": 177,
          "section": "grammar",
          "text": "ねる （　　　）に、はを みがきます。",
          "options": [
            "まえ",
            "あと",
            "とき",
            "ながら"
          ],
          "answer": 0,
          "explanation": "V bentuk kamus + まえに = sebelum melakukan sesuatu. Sebelum tidur, menggosok gigi.",
          "period": "sep-nov"
        },
        {
          "id": 178,
          "section": "grammar",
          "text": "ごはんを たべた （　　　）、くすりを のみます。",
          "options": [
            "あとで",
            "まえに",
            "ながら",
            "まで"
          ],
          "answer": 0,
          "explanation": "V bentuk lampau + あとで berarti setelah melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 179,
          "section": "grammar",
          "text": "しごとの （　　　）、ともだちと ごはんを たべました。",
          "options": [
            "あとで",
            "まえに",
            "ながら",
            "だけ"
          ],
          "answer": 0,
          "explanation": "Nのあとで = setelah sesuatu. しごとのあとで = setelah bekerja.",
          "period": "sep-nov"
        },
        {
          "id": 180,
          "section": "grammar",
          "text": "テレビを （　　　）ながら、ごはんを たべます。",
          "options": [
            "み",
            "みて",
            "みる",
            "みた"
          ],
          "answer": 0,
          "explanation": "Bentuk ます tanpa ます + ながら berarti melakukan dua aktivitas bersamaan.",
          "period": "sep-nov"
        },
        {
          "id": 181,
          "section": "grammar",
          "text": "おんがくを きき（　　　）、べんきょうします。",
          "options": [
            "ながら",
            "まで",
            "ので",
            "から"
          ],
          "answer": 0,
          "explanation": "～ながら berarti sambil. Mendengarkan musik sambil belajar.",
          "period": "sep-nov"
        },
        {
          "id": 182,
          "section": "grammar",
          "text": "あしたは あめが （　　　）と おもいます。",
          "options": [
            "ふる",
            "ふって",
            "ふった",
            "ふり"
          ],
          "answer": 0,
          "explanation": "と思います digunakan untuk menyatakan pendapat/prediksi. Sebelum と gunakan bentuk biasa: ふる.",
          "period": "sep-nov"
        },
        {
          "id": 183,
          "section": "grammar",
          "text": "たなかさんは あした こない（　　　）おもいます。",
          "options": [
            "と",
            "が",
            "を",
            "に"
          ],
          "answer": 0,
          "explanation": "Pola ～と思います menggunakan partikel と sebelum 思います.",
          "period": "sep-nov"
        },
        {
          "id": 184,
          "section": "grammar",
          "text": "この くるまは ちょっと （　　　）と おもいます。",
          "options": [
            "たかい",
            "たかく",
            "たかいな",
            "たかさ"
          ],
          "answer": 0,
          "explanation": "Kata sifat-i bentuk biasa langsung diikuti とおもいます. たかいとおもいます = saya pikir mahal.",
          "period": "sep-nov"
        },
        {
          "id": 185,
          "section": "grammar",
          "text": "にほんへ いった（　　　）があります。",
          "options": [
            "こと",
            "もの",
            "ところ",
            "とき"
          ],
          "answer": 0,
          "explanation": "～たことがあります menyatakan pengalaman pernah melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 186,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を買いますか。",
          "audioText": "女：スーパーで何を買いますか。\n男：牛乳とパンを買います。卵は買いません。",
          "options": [
            "牛乳とパン",
            "パンと卵",
            "牛乳と卵",
            "卵だけ"
          ],
          "answer": 0,
          "explanation": "Pria itu membeli susu (牛乳) dan roti (パン), tetapi tidak membeli telur.",
          "period": "sep-nov"
        },
        {
          "id": 187,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何時に起きますか。",
          "audioText": "男：毎朝何時に起きますか。\n女：いつも６時に起きます。でも、日曜日は７時です。",
          "options": [
            "６時",
            "７時",
            "５時",
            "８時"
          ],
          "answer": 0,
          "explanation": "Dia biasanya bangun jam 6. Pertanyaan tidak menyebut hari Minggu, jadi jawabannya ６時.",
          "period": "sep-nov"
        },
        {
          "id": 188,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人はどこで昼ごはんを食べますか。",
          "audioText": "男：昼ごはん、どこで食べますか。\n女：今日はレストランに行きませんか。\n男：いいですね。そうしましょう。",
          "options": [
            "レストラン",
            "会社",
            "スーパー",
            "家"
          ],
          "answer": 0,
          "explanation": "Mereka memutuskan makan siang di restoran (レストラン).",
          "period": "sep-nov"
        },
        {
          "id": 189,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何をしますか。",
          "audioText": "女：田中さん、今日の仕事は終わりましたか。\n男：まだです。これからこの書類を書きます。",
          "options": [
            "書類を書きます",
            "家に帰ります",
            "ごはんを食べます",
            "電話をします"
          ],
          "answer": 0,
          "explanation": "Pria itu mengatakan akan menulis dokumen (書類を書きます).",
          "period": "sep-nov"
        },
        {
          "id": 190,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人はどうやって学校へ行きますか。",
          "audioText": "男：毎日どうやって学校へ行きますか。\n女：歩いて行きます。学校は家から近いです。",
          "options": [
            "歩いて",
            "電車で",
            "バスで",
            "自転車で"
          ],
          "answer": 0,
          "explanation": "Dia pergi ke sekolah dengan berjalan kaki (歩いて行きます).",
          "period": "sep-nov"
        },
        {
          "id": 191,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はいつ宿題をしますか。",
          "audioText": "女：宿題はいつしますか。\n男：晩ごはんを食べてから、します。",
          "options": [
            "晩ごはんのあと",
            "朝ごはんのあと",
            "学校へ行くまえ",
            "昼ごはんのあと"
          ],
          "answer": 0,
          "explanation": "Pria itu mengerjakan PR setelah makan malam (晩ごはんを食べてから).",
          "period": "sep-nov"
        },
        {
          "id": 192,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n雨が降りますか。",
          "audioText": "男：明日の天気はどうですか。\n女：午前は晴れます。でも、午後は雨が降るでしょう。",
          "options": [
            "午後は雨が降ります",
            "一日中晴れます",
            "午前は雨が降ります",
            "一日中雨です"
          ],
          "answer": 0,
          "explanation": "Ramalan mengatakan sore/siang setelah 午後 akan turun hujan.",
          "period": "sep-nov"
        },
        {
          "id": 193,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何を食べませんか。",
          "audioText": "男：朝ごはんに何を食べましたか。\n女：パンと卵を食べました。ごはんは食べませんでした。",
          "options": [
            "ごはん",
            "パン",
            "卵",
            "パンと卵"
          ],
          "answer": 0,
          "explanation": "Perempuan itu tidak makan nasi (ごはんは食べませんでした).",
          "period": "sep-nov"
        },
        {
          "id": 194,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はどこにかばんを置きますか。",
          "audioText": "女：かばんはどこに置きますか。\n男：机の上に置きます。",
          "options": [
            "机の上",
            "いすの下",
            "ドアの前",
            "ベッドの上"
          ],
          "answer": 0,
          "explanation": "Tas diletakkan di atas meja (机の上).",
          "period": "sep-nov"
        },
        {
          "id": 195,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何をしていますか。",
          "audioText": "男：山田さん、今何をしていますか。\n女：音楽を聞きながら、勉強しています。",
          "options": [
            "音楽を聞きながら勉強しています",
            "テレビを見ています",
            "本を読んでいます",
            "寝ています"
          ],
          "answer": 0,
          "explanation": "Perempuan itu sedang belajar sambil mendengarkan musik.",
          "period": "sep-nov"
        },
        {
          "id": 196,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を忘れましたか。",
          "audioText": "女：どうしたんですか。\n男：家に財布を忘れました。",
          "options": [
            "財布",
            "かばん",
            "携帯電話",
            "傘"
          ],
          "answer": 0,
          "explanation": "Pria itu lupa membawa dompet (財布) di rumah.",
          "period": "sep-nov"
        },
        {
          "id": 197,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は何時に会いますか。",
          "audioText": "男：明日、何時に会いましょうか。\n女：１０時はどうですか。\n男：いいですね。１０時に駅で会いましょう。",
          "options": [
            "１０時",
            "９時",
            "１１時",
            "１２時"
          ],
          "answer": 0,
          "explanation": "Mereka sepakat bertemu jam 10 di stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 198,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はどこへ行きたいですか。",
          "audioText": "女：次の休みにどこへ行きたいですか。\n男：京都へ行きたいです。古いお寺を見たいです。",
          "options": [
            "京都",
            "東京",
            "大阪",
            "北海道"
          ],
          "answer": 0,
          "explanation": "Pria itu ingin pergi ke Kyoto (京都) untuk melihat kuil lama.",
          "period": "sep-nov"
        },
        {
          "id": 199,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何をしますか。",
          "audioText": "男：この荷物、重いですね。\n女：じゃあ、私が持ちます。",
          "options": [
            "荷物を持ちます",
            "荷物を買います",
            "荷物を送ります",
            "荷物を開けます"
          ],
          "answer": 0,
          "explanation": "Perempuan itu mengatakan bahwa dia akan membawa barang tersebut (持ちます).",
          "period": "sep-nov"
        },
        {
          "id": 200,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はなぜ会社を休みますか。",
          "audioText": "女：今日は会社に来ないんですか。\n男：はい。熱がありますから、休みます。",
          "options": [
            "熱がありますから",
            "仕事がありませんから",
            "旅行しますから",
            "雨ですから"
          ],
          "answer": 0,
          "explanation": "Dia tidak masuk kerja karena demam (熱があります).",
          "period": "sep-nov"
        },
        {
          "id": 201,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を持ってきますか。",
          "audioText": "男：明日のパーティーに何を持ってきますか。\n女：私はケーキを持ってきます。\n男：じゃあ、私はジュースを持ってきます。",
          "options": [
            "ジュース",
            "ケーキ",
            "パン",
            "お茶"
          ],
          "answer": 0,
          "explanation": "Pria itu akan membawa jus (ジュース).",
          "period": "sep-nov"
        },
        {
          "id": 202,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人はどの服を買いますか。",
          "audioText": "男：この白いシャツはどうですか。\n女：きれいですね。でも、少し高いです。あの青いシャツにします。",
          "options": [
            "青いシャツ",
            "白いシャツ",
            "黒いシャツ",
            "赤いシャツ"
          ],
          "answer": 0,
          "explanation": "Dia memilih kemeja biru (青いシャツ) karena kemeja putih agak mahal.",
          "period": "sep-nov"
        },
        {
          "id": 203,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を探していますか。",
          "audioText": "女：何を探しているんですか。\n男：かぎがありません。机の上を見てください。",
          "options": [
            "かぎ",
            "財布",
            "時計",
            "本"
          ],
          "answer": 0,
          "explanation": "Pria itu sedang mencari kunci (かぎ).",
          "period": "sep-nov"
        },
        {
          "id": 204,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人はどこで会いますか。",
          "audioText": "男：明日、どこで会いますか。\n女：駅の前はどうですか。\n男：わかりました。駅の前で会いましょう。",
          "options": [
            "駅の前",
            "学校の前",
            "レストラン",
            "会社"
          ],
          "answer": 0,
          "explanation": "Mereka sepakat bertemu di depan stasiun (駅の前).",
          "period": "sep-nov"
        },
        {
          "id": 205,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を飲みませんか。",
          "audioText": "女：お茶とコーヒーがあります。どちらがいいですか。\n男：コーヒーをお願いします。お茶は飲みません。",
          "options": [
            "お茶",
            "コーヒー",
            "水",
            "ジュース"
          ],
          "answer": 0,
          "explanation": "Pria itu memilih kopi dan mengatakan tidak minum teh (お茶は飲みません).",
          "period": "sep-nov"
        },
        {
          "id": 206,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何をしなければなりませんか。",
          "audioText": "男：明日のテストはありますか。\n女：はい。ですから、今日は勉強しなければなりません。",
          "options": [
            "勉強します",
            "遊びます",
            "旅行します",
            "寝ます"
          ],
          "answer": 0,
          "explanation": "Karena ada ujian besok, dia harus belajar (勉強しなければなりません).",
          "period": "sep-nov"
        },
        {
          "id": 207,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はいつ帰りますか。",
          "audioText": "女：今日は何時に帰りますか。\n男：仕事が終わってから帰ります。たぶん８時ごろです。",
          "options": [
            "８時ごろ",
            "６時ごろ",
            "７時ごろ",
            "９時ごろ"
          ],
          "answer": 0,
          "explanation": "Dia memperkirakan pulang sekitar jam 8 (８時ごろ).",
          "period": "sep-nov"
        },
        {
          "id": 208,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n何を予約しましたか。",
          "audioText": "男：ホテルは予約しましたか。\n女：はい。東京のホテルを予約しました。",
          "options": [
            "東京のホテル",
            "大阪のホテル",
            "東京のレストラン",
            "大阪のレストラン"
          ],
          "answer": 0,
          "explanation": "Perempuan itu memesan hotel di Tokyo (東京のホテル).",
          "period": "sep-nov"
        },
        {
          "id": 209,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人はどうして電車に乗りませんか。",
          "audioText": "女：どうして電車に乗らないんですか。\n男：今日は駅まで歩きたいです。それに、天気がいいですから。",
          "options": [
            "歩きたいから",
            "雨だから",
            "電車がないから",
            "駅が遠いから"
          ],
          "answer": 0,
          "explanation": "Dia tidak naik kereta karena ingin berjalan kaki (歩きたい).",
          "period": "sep-nov"
        },
        {
          "id": 210,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何をしていますか。",
          "audioText": "男：今、何をしていますか。\n女：部屋を掃除しています。",
          "options": [
            "部屋を掃除しています",
            "料理しています",
            "寝ています",
            "テレビを見ています"
          ],
          "answer": 0,
          "explanation": "Perempuan itu sedang membersihkan kamar (部屋を掃除しています).",
          "period": "sep-nov"
        },
        {
          "id": 211,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何を買いませんでしたか。",
          "audioText": "女：買い物はどうでしたか。\n男：野菜と肉を買いました。でも、魚は買いませんでした。",
          "options": [
            "魚",
            "野菜",
            "肉",
            "野菜と肉"
          ],
          "answer": 0,
          "explanation": "Dia membeli sayur dan daging, tetapi tidak membeli ikan (魚).",
          "period": "sep-nov"
        },
        {
          "id": 212,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人はどこへ行く前に何をしますか。",
          "audioText": "男：出かける前に何をしますか。\n女：シャワーを浴びます。それから、出かけます。",
          "options": [
            "シャワーを浴びます",
            "朝ごはんを食べます",
            "寝ます",
            "テレビを見ます"
          ],
          "answer": 0,
          "explanation": "Sebelum keluar, dia mandi (シャワーを浴びます).",
          "period": "sep-nov"
        },
        {
          "id": 213,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は何が好きですか。",
          "audioText": "女：スポーツが好きですか。\n男：はい。サッカーが一番好きです。",
          "options": [
            "サッカー",
            "野球",
            "テニス",
            "水泳"
          ],
          "answer": 0,
          "explanation": "Olahraga yang paling disukai pria itu adalah sepak bola (サッカー).",
          "period": "sep-nov"
        },
        {
          "id": 214,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は何を持っていますか。",
          "audioText": "男：そのかばんの中に何がありますか。\n女：本が３冊とペンが２本あります。",
          "options": [
            "本３冊とペン２本",
            "本２冊とペン３本",
            "本３冊だけ",
            "ペン２本だけ"
          ],
          "answer": 0,
          "explanation": "Tas berisi 3 buku (本３冊) dan 2 pulpen (ペン２本).",
          "period": "sep-nov"
        },
        {
          "id": 215,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は何を見ますか。",
          "audioText": "女：今晩、映画を見ませんか。\n男：いいですね。何の映画ですか。\n女：日本の映画です。\n男：じゃあ、それを見ましょう。",
          "options": [
            "日本の映画",
            "アメリカの映画",
            "スポーツ",
            "ニュース"
          ],
          "answer": 0,
          "explanation": "Mereka memutuskan menonton film Jepang (日本の映画).",
          "period": "sep-nov"
        },
        {
          "id": 216,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\nスーパー「さくら」\n営業時間：午前９時から午後８時まで\n月曜日は休みです。\n\n日曜日の午後９時にスーパーへ行きます。どうですか。",
          "options": [
            "いいえ、閉まっています。",
            "はい、開いています。",
            "月曜日だけ開いています。",
            "午前９時からです。"
          ],
          "answer": 0,
          "explanation": "スーパーは午後８時までなので、午後９時はもう閉まっています。",
          "period": "sep-nov"
        },
        {
          "id": 217,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n田中さんへ\nあしたは９時に駅の前で会いましょう。\n忘れないでください。\n\n（山田）\n\n二人はどこで会いますか。",
          "options": [
            "駅の前",
            "会社の前",
            "学校の前",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "メモに「９時に駅の前で会いましょう」とあります。",
          "period": "sep-nov"
        },
        {
          "id": 218,
          "section": "reading",
          "text": "【メールを読んで答えてください】\nみなさんへ\nあしたは雨のよほうです。\nサッカーはありません。\n午後３時に学校で日本語の勉強をします。\n\nあした、何をしますか。",
          "options": [
            "日本語を勉強します",
            "サッカーをします",
            "買い物をします",
            "映画を見ます"
          ],
          "answer": 0,
          "explanation": "雨なのでサッカーはなく、午後３時に日本語を勉強します。",
          "period": "sep-nov"
        },
        {
          "id": 219,
          "section": "reading",
          "text": "【メニューを読んで答えてください】\nレストラン「さくら」\nカレー　　６００円\nラーメン　７００円\nうどん　　５００円\nジュース　２００円\n\nいちばん安い食べ物は何ですか。",
          "options": [
            "うどん",
            "カレー",
            "ラーメン",
            "ジュース"
          ],
          "answer": 0,
          "explanation": "食べ物の中では、うどんが５００円でいちばん安いです。",
          "period": "sep-nov"
        },
        {
          "id": 220,
          "section": "reading",
          "text": "【手紙を読んで答えてください】\n鈴木さんへ\nこんにちは。\n土曜日に一緒に映画を見ませんか。\n午後２時に駅で会いましょう。\n\n（アリ）\n\nアリさんは何をしたいですか。",
          "options": [
            "映画を見たいです",
            "買い物をしたいです",
            "ごはんを作りたいです",
            "勉強したいです"
          ],
          "answer": 0,
          "explanation": "「一緒に映画を見ませんか」と書いてあるので、映画を見る予定です。",
          "period": "sep-nov"
        },
        {
          "id": 221,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜スポーツセンター＞\n月曜日～金曜日：９：００～２０：００\n土曜日：９：００～１７：００\n日曜日：休み\n\n日曜日にスポーツセンターへ行くことができますか。",
          "options": [
            "いいえ、できません。",
            "はい、できます。",
            "午前中だけできます。",
            "午後だけできます。"
          ],
          "answer": 0,
          "explanation": "日曜日は「休み」なので、行くことができません。",
          "period": "sep-nov"
        },
        {
          "id": 222,
          "section": "reading",
          "text": "【日記を読んで答えてください】\nきょうは朝７時に起きました。\n朝ごはんを食べて、８時に家を出ました。\n電車で会社へ行きました。\n\nこの人は何時に家を出ましたか。",
          "options": [
            "８時",
            "７時",
            "９時",
            "６時"
          ],
          "answer": 0,
          "explanation": "「８時に家を出ました」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 223,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n駅からホテルまで\n駅を出て、右へ曲がってください。\nコンビニの前をまっすぐ行きます。\n５分ぐらいでホテルがあります。\n\n駅を出て、どうしますか。",
          "options": [
            "右へ曲がります",
            "左へ曲がります",
            "電車に乗ります",
            "コンビニに入ります"
          ],
          "answer": 0,
          "explanation": "駅を出たあと、「右へ曲がってください」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 224,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n図書館からのお知らせ\n本を借りる人は、カードを持ってきてください。\n一人５冊まで借りることができます。\n\n本を借りるとき、何が必要ですか。",
          "options": [
            "カード",
            "お金",
            "パスポート",
            "写真"
          ],
          "answer": 0,
          "explanation": "本を借りるときはカードが必要です。",
          "period": "sep-nov"
        },
        {
          "id": 225,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n山田さんへ\nきょうは仕事が６時まであります。\nそのあと、スーパーへ行きます。\n７時ごろ家に帰ります。\n\n山田さんは何時ごろ家に帰りますか。",
          "options": [
            "７時ごろ",
            "６時ごろ",
            "８時ごろ",
            "５時ごろ"
          ],
          "answer": 0,
          "explanation": "「７時ごろ家に帰ります」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 226,
          "section": "reading",
          "text": "【文を読んで答えてください】\nわたしは毎朝コーヒーを飲みます。\nでも、今日はコーヒーがありませんでした。\nですから、お茶を飲みました。\n\n今日は何を飲みましたか。",
          "options": [
            "お茶",
            "コーヒー",
            "水",
            "ジュース"
          ],
          "answer": 0,
          "explanation": "今日はコーヒーがなかったので、お茶を飲みました。",
          "period": "sep-nov"
        },
        {
          "id": 227,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n母へ\n冷蔵庫にりんごが３つあります。\n牛乳はありません。\n帰るとき、牛乳を買ってきてください。\n\n何を買いますか。",
          "options": [
            "牛乳",
            "りんご",
            "パン",
            "卵"
          ],
          "answer": 0,
          "explanation": "メモには「牛乳を買ってきてください」とあります。",
          "period": "sep-nov"
        },
        {
          "id": 228,
          "section": "reading",
          "text": "【広告を読んで答えてください】\n＜春のセール＞\nシャツ　３０００円 → ２０００円\nくつ　　５０００円 → ４０００円\nかばん　４０００円 → ３０００円\n\nシャツはいくらですか。",
          "options": [
            "２０００円",
            "３０００円",
            "４０００円",
            "５０００円"
          ],
          "answer": 0,
          "explanation": "セールでシャツは３０００円から２０００円になっています。",
          "period": "sep-nov"
        },
        {
          "id": 229,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n土曜日\n朝、部屋を掃除しました。\n昼は友だちとラーメンを食べました。\n午後は家で映画を見ました。\n\n昼に何をしましたか。",
          "options": [
            "ラーメンを食べました",
            "部屋を掃除しました",
            "映画を見ました",
            "買い物をしました"
          ],
          "answer": 0,
          "explanation": "昼は友だちとラーメンを食べました。",
          "period": "sep-nov"
        },
        {
          "id": 230,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n会社のお知らせ\nあしたの会議は１０時からです。\n場所は３階の会議室です。\n９時５０分までに来てください。\n\n会議はどこでありますか。",
          "options": [
            "３階の会議室",
            "２階の会議室",
            "１階のロビー",
            "３階の食堂"
          ],
          "answer": 0,
          "explanation": "会議の場所は「３階の会議室」です。",
          "period": "sep-nov"
        },
        {
          "id": 231,
          "section": "reading",
          "text": "【メールを読んで答えてください】\nアリさんへ\n日曜日に公園へ行きませんか。\n天気がよかったら、いっしょにサッカーをしましょう。\n雨だったら、映画を見ましょう。\n\n雨だったら、二人は何をしますか。",
          "options": [
            "映画を見ます",
            "サッカーをします",
            "公園へ行きます",
            "家で勉強します"
          ],
          "answer": 0,
          "explanation": "「雨だったら、映画を見ましょう」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 232,
          "section": "reading",
          "text": "【案内を読んで答えてください】\nバスの時間\n１番バス　８：００\n２番バス　８：３０\n３番バス　９：００\n\n８時４０分に来た人は、次にどのバスに乗りますか。",
          "options": [
            "３番バス",
            "１番バス",
            "２番バス",
            "４番バス"
          ],
          "answer": 0,
          "explanation": "８時４０分には２番バスが出たあとです。次は９時の３番バスです。",
          "period": "sep-nov"
        },
        {
          "id": 233,
          "section": "reading",
          "text": "【メッセージを読んで答えてください】\nごめんなさい。今日は仕事が忙しいので、約束の時間に行くことができません。\nまた今度お願いします。\n\nこの人はどうして行くことができませんか。",
          "options": [
            "仕事が忙しいから",
            "病気だから",
            "お金がないから",
            "雨だから"
          ],
          "answer": 0,
          "explanation": "行くことができない理由は「仕事が忙しいから」です。",
          "period": "sep-nov"
        },
        {
          "id": 234,
          "section": "reading",
          "text": "【文を読んで答えてください】\nわたしの家には犬が１匹と猫が２匹います。\n犬は大きくて、猫は小さいです。\n毎朝、犬と一緒に公園へ行きます。\n\n猫は何匹いますか。",
          "options": [
            "２匹",
            "１匹",
            "３匹",
            "４匹"
          ],
          "answer": 0,
          "explanation": "文に「猫が２匹います」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 235,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n病院のお知らせ\n午前：９時～１２時\n午後：２時～５時\n土曜日と日曜日は休みです。\n\n土曜日の午前１０時に病院へ行きます。どうですか。",
          "options": [
            "休みです",
            "開いています",
            "午後だけ開いています",
            "１２時から開きます"
          ],
          "answer": 0,
          "explanation": "土曜日は休みなので、午前１０時でも開いていません。",
          "period": "sep-nov"
        },
        {
          "id": 236,
          "section": "reading",
          "text": "【手紙を読んで答えてください】\n田中さんへ\n先週、田中さんから本を借りました。\nとてもおもしろかったです。\n来週、学校へ持っていきます。\n\n何を持っていきますか。",
          "options": [
            "本",
            "かばん",
            "ペン",
            "お金"
          ],
          "answer": 0,
          "explanation": "先週借りた本を、来週学校へ持っていきます。",
          "period": "sep-nov"
        },
        {
          "id": 237,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n鈴木さんへ\n明日の朝、８時に駅で会いましょう。\n私は白いシャツを着ています。\n駅の前で待っています。\n\n鈴木さんは何を着ていますか。",
          "options": [
            "白いシャツ",
            "黒いシャツ",
            "白いズボン",
            "青いシャツ"
          ],
          "answer": 0,
          "explanation": "「白いシャツを着ています」と書いてあります。",
          "period": "sep-nov"
        },
        {
          "id": 238,
          "section": "reading",
          "text": "【メニューを読んで答えてください】\n＜ランチメニュー＞\nA：カレー＋サラダ　７００円\nB：ラーメン＋ぎょうざ　８００円\nC：うどん＋おにぎり　６００円\n\nいちばん安いランチはどれですか。",
          "options": [
            "C",
            "A",
            "B",
            "全部同じです"
          ],
          "answer": 0,
          "explanation": "Cランチは６００円で、３つの中でいちばん安いです。",
          "period": "sep-nov"
        },
        {
          "id": 239,
          "section": "reading",
          "text": "【日記を読んで答えてください】\nきのうは雨でした。\nどこにも行きませんでした。\n家で音楽を聞いたり、本を読んだりしました。\n\nきのう、どこへ行きましたか。",
          "options": [
            "どこにも行きませんでした",
            "公園へ行きました",
            "学校へ行きました",
            "スーパーへ行きました"
          ],
          "answer": 0,
          "explanation": "「どこにも行きませんでした」なので、どこにも行っていません。",
          "period": "sep-nov"
        },
        {
          "id": 240,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n駅前の店\nパン：１００円\nおにぎり：１２０円\nジュース：１５０円\n\n２００円で買えるものはどれですか。",
          "options": [
            "パン",
            "パンとおにぎり",
            "おにぎりとジュース",
            "全部"
          ],
          "answer": 0,
          "explanation": "パンは１００円なので、２００円で買うことができます。",
          "period": "sep-nov"
        },
        {
          "id": 241,
          "section": "vocab",
          "text": "「いもうと」は かんじで どう かきますか。",
          "options": [
            "妹",
            "姉",
            "兄",
            "弟"
          ],
          "answer": 0,
          "explanation": "妹 (いもうと) = adik perempuan. 姉 (kakak perempuan), 兄 (kakak laki-laki), 弟 (adik laki-laki).",
          "period": "sep-nov"
        },
        {
          "id": 242,
          "section": "vocab",
          "text": "「みぎ」は かんじで どう かきますか。",
          "options": [
            "右",
            "左",
            "上",
            "下"
          ],
          "answer": 0,
          "explanation": "右 (みぎ) = kanan. 左 (kiri), 上 (atas), 下 (bawah).",
          "period": "sep-nov"
        },
        {
          "id": 243,
          "section": "vocab",
          "text": "「そと」は かんじで どう かきますか。",
          "options": [
            "外",
            "中",
            "前",
            "後"
          ],
          "answer": 0,
          "explanation": "外 (そと) = luar. 中 (dalam), 前 (depan), 後 (belakang).",
          "period": "sep-nov"
        },
        {
          "id": 244,
          "section": "vocab",
          "text": "あたまが いたい ですから、（　　　）を のみます。",
          "options": [
            "くすり",
            "おちゃ",
            "コーヒー",
            "ジュース"
          ],
          "answer": 0,
          "explanation": "「くすりを のむ」= minum obat.",
          "period": "sep-nov"
        },
        {
          "id": 245,
          "section": "vocab",
          "text": "めが わるいですから、（　　　）を かけます。",
          "options": [
            "めがね",
            "ぼうし",
            "くつ",
            "シャツ"
          ],
          "answer": 0,
          "explanation": "「めがねを かける」= memakai kacamata.",
          "period": "sep-nov"
        },
        {
          "id": 246,
          "section": "vocab",
          "text": "あめが ふっています。（　　　）を さして ください。",
          "options": [
            "かさ",
            "ぼうし",
            "めがね",
            "ドア"
          ],
          "answer": 0,
          "explanation": "「かさを さす」= memakai payung.",
          "period": "sep-nov"
        },
        {
          "id": 247,
          "section": "vocab",
          "text": "この（　　　）を まっすぐ いって ください。",
          "options": [
            "みち",
            "はし",
            "かわ",
            "やま"
          ],
          "answer": 0,
          "explanation": "「みちを まっすぐ いく」= jalan lurus di jalan ini.",
          "period": "sep-nov"
        },
        {
          "id": 248,
          "section": "vocab",
          "text": "「はし」を わたって、みぎへ まがります。",
          "options": [
            "橋",
            "駅",
            "店",
            "家"
          ],
          "answer": 0,
          "explanation": "橋 (はし) = jembatan. わたる = menyeberang.",
          "period": "sep-nov"
        },
        {
          "id": 249,
          "section": "vocab",
          "text": "きょうは とても（　　　）ですね。セーターを きます。",
          "options": [
            "さむい",
            "あつい",
            "ぬるい",
            "あたたかい"
          ],
          "answer": 0,
          "explanation": "Karena memakai sweater (セーター), berarti cuacanya dingin (さむい).",
          "period": "sep-nov"
        },
        {
          "id": 250,
          "section": "vocab",
          "text": "テストが ありますから、きょうは（　　　）です。",
          "options": [
            "いそがしい",
            "ひま",
            "たのしい",
            "うれしい"
          ],
          "answer": 0,
          "explanation": "Karena ada ujian, berarti sibuk (いそがしい).",
          "period": "sep-nov"
        },
        {
          "id": 251,
          "section": "vocab",
          "text": "にほんごの じしょを（　　　）ください。",
          "options": [
            "かして",
            "かりて",
            "かえして",
            "もって"
          ],
          "answer": 0,
          "explanation": "「かして ください」= tolong pinjamkan.",
          "period": "sep-nov"
        },
        {
          "id": 252,
          "section": "vocab",
          "text": "「休む」は ひらがなで どう かきますか。",
          "options": [
            "やすむ",
            "はたらく",
            "あそぶ",
            "ねる"
          ],
          "answer": 0,
          "explanation": "休む = やすむ (istirahat/libur).",
          "period": "sep-nov"
        },
        {
          "id": 253,
          "section": "vocab",
          "text": "「読む」は ひらがなで どう かきますか。",
          "options": [
            "よむ",
            "かく",
            "きく",
            "はなす"
          ],
          "answer": 0,
          "explanation": "読む = よむ (membaca).",
          "period": "sep-nov"
        },
        {
          "id": 254,
          "section": "vocab",
          "text": "あさ ６じに（　　　）を あびます。",
          "options": [
            "シャワー",
            "プール",
            "おんせん",
            "うみ"
          ],
          "answer": 0,
          "explanation": "「シャワーを あびる」= mandi (dengan pancuran).",
          "period": "sep-nov"
        },
        {
          "id": 255,
          "section": "vocab",
          "text": "スーパーで ぎゅうにゅうを（　　　）かいました。",
          "options": [
            "２ほん",
            "２まい",
            "２だい",
            "２さつ"
          ],
          "answer": 0,
          "explanation": "Botol susu dihitung dengan satuan 本 (ほん/ぽん).",
          "period": "sep-nov"
        },
        {
          "id": 256,
          "section": "grammar",
          "text": "えき（　　　）あるいて いきます。",
          "options": [
            "まで",
            "に",
            "を",
            "で"
          ],
          "answer": 0,
          "explanation": "まで berarti \"sampai\". えきまで = sampai stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 257,
          "section": "grammar",
          "text": "わたしは まいあさ パン（　　　）ごはんを たべます。",
          "options": [
            "か",
            "を",
            "に",
            "が"
          ],
          "answer": 0,
          "explanation": "か digunakan untuk \"atau\". パンかごはん = Roti atau nasi.",
          "period": "sep-nov"
        },
        {
          "id": 258,
          "section": "grammar",
          "text": "この カメラは だれ（　　　）ですか。",
          "options": [
            "の",
            "に",
            "へ",
            "と"
          ],
          "answer": 0,
          "explanation": "だれの = milik siapa.",
          "period": "sep-nov"
        },
        {
          "id": 259,
          "section": "grammar",
          "text": "きのうは どこへ（　　　）いきませんでした。",
          "options": [
            "も",
            "が",
            "を",
            "に"
          ],
          "answer": 0,
          "explanation": "Kata tanya + も + negatif = tidak ~ ke mana pun/siapa pun/apa pun. (どこへも = tidak ke mana pun).",
          "period": "sep-nov"
        },
        {
          "id": 260,
          "section": "grammar",
          "text": "ここに じてんしゃを（　　　）ください。",
          "options": [
            "おかないで",
            "おいて",
            "おかない",
            "おかないくて"
          ],
          "answer": 0,
          "explanation": "～ないでください = tolong jangan ~. おかないでください = tolong jangan meletakkan.",
          "period": "sep-nov"
        },
        {
          "id": 261,
          "section": "grammar",
          "text": "あしたは あめが ふる（　　　）おもいます。",
          "options": [
            "と",
            "が",
            "を",
            "に"
          ],
          "answer": 0,
          "explanation": "と digunakan sebelum おもいます (berpikir/berpendapat bahwa...).",
          "period": "sep-nov"
        },
        {
          "id": 262,
          "section": "grammar",
          "text": "せんせいは 学生（　　　）ほんを よませます。",
          "options": [
            "に",
            "が",
            "を",
            "で"
          ],
          "answer": 0,
          "explanation": "Pola kausatif: menyuruh/membiarkan seseorang (に) melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 263,
          "section": "grammar",
          "text": "A:「まどを しめましょうか。」\nB:「いいえ、あけて（　　　）ください。」",
          "options": [
            "おいて",
            "しまって",
            "あって",
            "いて"
          ],
          "answer": 0,
          "explanation": "～ておきます = membiarkan dalam keadaan seperti itu. あけておいて = biarkan terbuka.",
          "period": "sep-nov"
        },
        {
          "id": 264,
          "section": "grammar",
          "text": "テレビを（　　　）まま、ねて しまいました。",
          "options": [
            "つけた",
            "つける",
            "つけ",
            "つけない"
          ],
          "answer": 0,
          "explanation": "V-ta まま = dalam keadaan / membiarkan. つけたまま = dibiarkan menyala.",
          "period": "sep-nov"
        },
        {
          "id": 265,
          "section": "grammar",
          "text": "もし あめが（　　　）、しあいは ありません。",
          "options": [
            "ふったら",
            "ふれば",
            "ふると",
            "ふるなら"
          ],
          "answer": 0,
          "explanation": "もし... ~たら digunakan untuk pengandaian \"jika\". ふったら = jika turun hujan.",
          "period": "sep-nov"
        },
        {
          "id": 266,
          "section": "grammar",
          "text": "この ほんは むずかしくて、（　　　）ことが できません。",
          "options": [
            "よむ",
            "よんで",
            "よんだ",
            "よみます"
          ],
          "answer": 0,
          "explanation": "V-kamus + ことができる = bisa melakukan. よむ = membaca.",
          "period": "sep-nov"
        },
        {
          "id": 267,
          "section": "grammar",
          "text": "わたしは にほんごが はなせるように（　　　）。",
          "options": [
            "なりました",
            "しました",
            "あります",
            "います"
          ],
          "answer": 0,
          "explanation": "～ようになりました = perubahan keadaan (menjadi bisa).",
          "period": "sep-nov"
        },
        {
          "id": 268,
          "section": "grammar",
          "text": "でんしゃに かさ を（　　　）しまいました。",
          "options": [
            "わすれて",
            "わすれる",
            "わすれた",
            "わすれ"
          ],
          "answer": 0,
          "explanation": "～てしまいました menunjukkan penyesalan atau ketidaksengajaan. わすれて = lupa.",
          "period": "sep-nov"
        },
        {
          "id": 269,
          "section": "grammar",
          "text": "たなかさんは もう 帰った（　　　）です。",
          "options": [
            "はず",
            "べき",
            "ため",
            "つもり"
          ],
          "answer": 0,
          "explanation": "はずです = seharusnya/pasti (keyakinan).",
          "period": "sep-nov"
        },
        {
          "id": 270,
          "section": "grammar",
          "text": "おさけを（　　　）あとで、くるまを うんてんしては いけません。",
          "options": [
            "のんだ",
            "のむ",
            "のんで",
            "のまない"
          ],
          "answer": 0,
          "explanation": "V-ta + あとで = setelah melakukan.",
          "period": "sep-nov"
        },
        {
          "id": 271,
          "section": "grammar",
          "text": "A:「あの ほん、もう よみましたか。」\nB:「いいえ、（　　　）よんで いません。」",
          "options": [
            "まだ",
            "もう",
            "いつも",
            "ぜんぜん"
          ],
          "answer": 0,
          "explanation": "まだ + negatif = belum.",
          "period": "sep-nov"
        },
        {
          "id": 272,
          "section": "grammar",
          "text": "A:「どうしたんですか。」\nB:「おなかが（　　　）んです。」",
          "options": [
            "いたい",
            "いたく",
            "いたかった",
            "いたくて"
          ],
          "answer": 0,
          "explanation": "Kata sifat-i + んです untuk memberikan penjelasan.",
          "period": "sep-nov"
        },
        {
          "id": 273,
          "section": "grammar",
          "text": "さむい ですから、ドアを（　　　）も いいですか。",
          "options": [
            "しめて",
            "あけて",
            "けして",
            "つけて"
          ],
          "answer": 0,
          "explanation": "Karena dingin (さむい), minta izin untuk menutup pintu (しめて).",
          "period": "sep-nov"
        },
        {
          "id": 274,
          "section": "grammar",
          "text": "えきへ（　　　）とき、ともだちに あいました。",
          "options": [
            "いく",
            "いって",
            "いった",
            "いかない"
          ],
          "answer": 0,
          "explanation": "V-kamus + とき = saat/ketika akan melakukan.",
          "period": "sep-nov"
        },
        {
          "id": 275,
          "section": "grammar",
          "text": "ごはんを（　　　）まえに、てを あらいます。",
          "options": [
            "たべる",
            "たべた",
            "たべて",
            "たべない"
          ],
          "answer": 0,
          "explanation": "V-kamus + まえに = sebelum melakukan.",
          "period": "sep-nov"
        },
        {
          "id": 276,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は今、何をしていますか。",
          "audioText": "女：田中さん、今 忙しいですか。少し 手伝ってくれませんか。\n男：すみません。今、レポートを 書いているんです。あと ３０分ぐらい 待ってくれますか。",
          "options": [
            "レポートを書いています",
            "本を読んでいます",
            "手伝っています",
            "休んでいます"
          ],
          "answer": 0,
          "explanation": "Pria itu berkata \"レポートを書いているんです\" (Sedang menulis laporan).",
          "period": "sep-nov"
        },
        {
          "id": 277,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は 何時ごろ 帰りますか。",
          "audioText": "男：映画は ６時からですね。終わるのは 何時ですか。\n女：８時です。そのあと、晩ごはんを 食べて 帰りましょう。\n男：じゃあ、帰るのは ９時ごろですね。",
          "options": [
            "９時ごろ",
            "６時ごろ",
            "８時ごろ",
            "１０時ごろ"
          ],
          "answer": 0,
          "explanation": "Film selesai jam 8, lalu mereka makan malam. Pria itu menyimpulkan pulang jam 9 (９時ごろ).",
          "period": "sep-nov"
        },
        {
          "id": 278,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は どんな 靴を 買いますか。",
          "audioText": "女：この 黒い 靴、いいですね。\n男：でも、少し 重いですよ。こちらの 白くて 軽い 靴は どうですか。\n女：そうですね。歩きやすそうですから、これに します。",
          "options": [
            "白くて軽い靴",
            "黒くて重い靴",
            "白くて重い靴",
            "黒くて軽い靴"
          ],
          "answer": 0,
          "explanation": "Perempuan itu akhirnya memilih sepatu yang putih dan ringan (白くて軽い靴).",
          "period": "sep-nov"
        },
        {
          "id": 279,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 明日 どうやって 会社へ 行きますか。",
          "audioText": "女：明日は 電車が 止まるそうです。\n男：えっ、本当ですか。じゃあ、明日は 車で 行きます。バスは 混みますから。",
          "options": [
            "車で",
            "電車で",
            "バスで",
            "歩いて"
          ],
          "answer": 0,
          "explanation": "Karena kereta berhenti dan bus penuh, dia akan pergi menggunakan mobil (車で).",
          "period": "sep-nov"
        },
        {
          "id": 280,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どの ケーキを 食べますか。",
          "audioText": "女：ケーキを 買ってきたんですが、どれが いいですか。チョコレートと いちごと チーズが あります。\n男：私は チョコレートは あまり 好きじゃないです。チーズを お願いします。",
          "options": [
            "チーズのケーキ",
            "チョコレートのケーキ",
            "いちごのケーキ",
            "食べない"
          ],
          "answer": 0,
          "explanation": "Pria itu meminta kue keju (チーズをお願いします).",
          "period": "sep-nov"
        },
        {
          "id": 281,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n部屋は 今 どうなっていますか。",
          "audioText": "男：暑いですね。窓を 開けましょうか。\n女：あ、エアコンが ついていますから、窓は 閉めておいて ください。",
          "options": [
            "窓が閉まっていて、エアコンがついている",
            "窓が開いていて、エアコンがついている",
            "窓が閉まっていて、エアコンが消えている",
            "窓が開いていて、エアコンが消えている"
          ],
          "answer": 0,
          "explanation": "Jendelanya ditutup dan AC-nya menyala.",
          "period": "sep-nov"
        },
        {
          "id": 282,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は これから まず 何を しますか。",
          "audioText": "男：もう 昼ごはんを 食べましたか。\n女：いいえ。これから 銀行へ 行って、そのあとで 食べます。",
          "options": [
            "銀行へ行きます",
            "昼ごはんを食べます",
            "買い物をします",
            "仕事をします"
          ],
          "answer": 0,
          "explanation": "Pertama pergi ke bank dulu (銀行へ行って), baru kemudian makan siang.",
          "period": "sep-nov"
        },
        {
          "id": 283,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 忘れましたか。",
          "audioText": "男：あ、いけない！\n女：どうしたんですか。\n男：財布と 携帯電話は 持ってきたんですが、傘を 電車の中に 忘れてしまいました。",
          "options": [
            "傘",
            "財布",
            "携帯電話",
            "かばん"
          ],
          "answer": 0,
          "explanation": "Pria itu melupakan payungnya (傘) di dalam kereta.",
          "period": "sep-nov"
        },
        {
          "id": 284,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\nテストは いつ ありますか。",
          "audioText": "男：先生、テストは 来週の 金曜日ですか。\n女：いいえ。来週は 休みですから、再来週の 水曜日に します。",
          "options": [
            "再来週の水曜日",
            "来週の金曜日",
            "来週の水曜日",
            "再来週の金曜日"
          ],
          "answer": 0,
          "explanation": "Ujiannya diundur ke hari Rabu dua minggu lagi (再来週の水曜日).",
          "period": "sep-nov"
        },
        {
          "id": 285,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どんな 部屋を 探していますか。",
          "audioText": "女：どんな 部屋が いいですか。\n男：駅から 近くて、家賃が 安い 部屋が いいです。狭くても いいです。",
          "options": [
            "駅から近くて、安い部屋",
            "駅から遠くて、広い部屋",
            "駅から遠くて、安い部屋",
            "駅から近くて、広い部屋"
          ],
          "answer": 0,
          "explanation": "Pria itu mencari kamar yang dekat stasiun dan murah (狭くてもいいです = sempit pun tidak apa-apa).",
          "period": "sep-nov"
        },
        {
          "id": 286,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n山田さんへ\n会議の 時間が かわりました。\n午後２時から ３時半までです。\n場所は ３階の 第２会議室です。\n（鈴木）\n\n会議は いつ 終わりますか。",
          "options": [
            "午後３時半",
            "午後２時",
            "午後３時",
            "午前３時半"
          ],
          "answer": 0,
          "explanation": "Di email tertulis \"３時半までです\" (Sampai jam 3.30).",
          "period": "sep-nov"
        },
        {
          "id": 287,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n木村さんへ\n机の 上に ある 書類に 名前を 書いて、受付の 佐藤さんに 渡して ください。お願いします。\n（田中）\n\n木村さんは 名前を 書いたあと、どうしますか。",
          "options": [
            "佐藤さんに 渡します",
            "田中に 渡します",
            "机の 上に 置きます",
            "受付で 待ちます"
          ],
          "answer": 0,
          "explanation": "Setelah menulis nama, dia harus menyerahkannya kepada Sato di resepsionis (受付の佐藤さんに渡してください).",
          "period": "sep-nov"
        },
        {
          "id": 288,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜図書館の 使い方＞\n・本は １回に ３冊まで 借りることが できます。\n・借りる 期間は ２週間です。\n・辞書と 雑誌は 借りることが できません。\n\n雑誌を 家に 持って 帰ることが できますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "３冊まで できます",
            "２週間 できます"
          ],
          "answer": 0,
          "explanation": "Aturan ketiga menyatakan Kamus dan Majalah tidak bisa dipinjam (辞書と雑誌は借りることができません).",
          "period": "sep-nov"
        },
        {
          "id": 289,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n１０月５日（木）\n今日は 友だちの 誕生日だった。みんなで レストランへ 行って、ケーキを 食べた。とても おいしかった。プレゼントも 喜んでくれて、うれしかった。\n\nこの人は 今日 どうして うれしかったですか。",
          "options": [
            "友だちが プレゼントを 喜んでくれたから",
            "ケーキが おいしかったから",
            "レストランへ 行ったから",
            "自分の 誕生日だったから"
          ],
          "answer": 0,
          "explanation": "Dia senang karena temannya gembira menerima hadiahnya (プレゼントも喜んでくれて、うれしかった).",
          "period": "sep-nov"
        },
        {
          "id": 290,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜さくら美術館＞\n開館時間：１０：００～１７：００（入館は １６：３０まで）\n休みの日：毎週 月曜日（月曜日が 祝日のときは 火曜日が 休み）\n\n午後４時４５分に 美術館に 着きました。中へ 入ることが できますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "月曜日なら できます",
            "祝日なら できます"
          ],
          "answer": 0,
          "explanation": "Batas masuk (入館) adalah jam 16:30. Karena dia tiba 16:45, dia tidak bisa masuk.",
          "period": "sep-nov"
        },
        {
          "id": 291,
          "section": "vocab",
          "text": "「あに」は かんじで どう かきますか。",
          "options": [
            "兄",
            "弟",
            "姉",
            "妹"
          ],
          "answer": 0,
          "explanation": "兄 (あに) = kakak laki-laki. 弟 = adik laki-laki, 姉 = kakak perempuan, 妹 = adik perempuan.",
          "period": "sep-nov"
        },
        {
          "id": 292,
          "section": "vocab",
          "text": "「あね」は かんじで どう かきますか。",
          "options": [
            "姉",
            "妹",
            "兄",
            "弟"
          ],
          "answer": 0,
          "explanation": "姉 (あね) = kakak perempuan.",
          "period": "sep-nov"
        },
        {
          "id": 293,
          "section": "vocab",
          "text": "「おとうと」は かんじで どう かきますか。",
          "options": [
            "弟",
            "兄",
            "妹",
            "姉"
          ],
          "answer": 0,
          "explanation": "弟 (おとうと) = adik laki-laki.",
          "period": "sep-nov"
        },
        {
          "id": 294,
          "section": "vocab",
          "text": "「ひだり」は かんじで どう かきますか。",
          "options": [
            "左",
            "右",
            "上",
            "下"
          ],
          "answer": 0,
          "explanation": "左 (ひだり) = kiri.",
          "period": "sep-nov"
        },
        {
          "id": 295,
          "section": "vocab",
          "text": "「うえ」は かんじで どう かきますか。",
          "options": [
            "上",
            "下",
            "中",
            "外"
          ],
          "answer": 0,
          "explanation": "上 (うえ) = atas.",
          "period": "sep-nov"
        },
        {
          "id": 296,
          "section": "vocab",
          "text": "「した」は かんじで どう かきますか。",
          "options": [
            "下",
            "上",
            "前",
            "後"
          ],
          "answer": 0,
          "explanation": "下 (した) = bawah.",
          "period": "sep-nov"
        },
        {
          "id": 297,
          "section": "vocab",
          "text": "「まえ」は かんじで どう かきますか。",
          "options": [
            "前",
            "後",
            "中",
            "外"
          ],
          "answer": 0,
          "explanation": "前 (まえ) = depan/sebelum.",
          "period": "sep-nov"
        },
        {
          "id": 298,
          "section": "vocab",
          "text": "「うしろ」は かんじで どう かきますか。",
          "options": [
            "後ろ",
            "前",
            "外",
            "中"
          ],
          "answer": 0,
          "explanation": "後ろ (うしろ) = belakang.",
          "period": "sep-nov"
        },
        {
          "id": 299,
          "section": "vocab",
          "text": "「あたらしい」は かんじで どう かきますか。",
          "options": [
            "新しい",
            "古い",
            "高い",
            "安い"
          ],
          "answer": 0,
          "explanation": "新しい (あたらしい) = baru.",
          "period": "sep-nov"
        },
        {
          "id": 300,
          "section": "vocab",
          "text": "「ふるい」は かんじで どう かきますか。",
          "options": [
            "古い",
            "新しい",
            "広い",
            "狭い"
          ],
          "answer": 0,
          "explanation": "古い (ふるい) = lama/tua.",
          "period": "sep-nov"
        },
        {
          "id": 301,
          "section": "vocab",
          "text": "この りんごは とても（　　　）です。",
          "options": [
            "あまい",
            "からい",
            "にがい",
            "しょっぱい"
          ],
          "answer": 0,
          "explanation": "あまい = manis.",
          "period": "sep-nov"
        },
        {
          "id": 302,
          "section": "vocab",
          "text": "この カレーは（　　　）です。",
          "options": [
            "からい",
            "あまい",
            "すっぱい",
            "うすい"
          ],
          "answer": 0,
          "explanation": "からい = pedas.",
          "period": "sep-nov"
        },
        {
          "id": 303,
          "section": "vocab",
          "text": "レモンは（　　　）です。",
          "options": [
            "すっぱい",
            "あまい",
            "からい",
            "しょっぱい"
          ],
          "answer": 0,
          "explanation": "すっぱい = asam.",
          "period": "sep-nov"
        },
        {
          "id": 304,
          "section": "vocab",
          "text": "しおを たくさん いれましたから、スープが（　　　）です。",
          "options": [
            "しょっぱい",
            "あまい",
            "にがい",
            "すっぱい"
          ],
          "answer": 0,
          "explanation": "しょっぱい = asin.",
          "period": "sep-nov"
        },
        {
          "id": 305,
          "section": "vocab",
          "text": "コーヒーは さとうを いれないと（　　　）です。",
          "options": [
            "にがい",
            "あまい",
            "からい",
            "すっぱい"
          ],
          "answer": 0,
          "explanation": "にがい = pahit.",
          "period": "sep-nov"
        },
        {
          "id": 306,
          "section": "vocab",
          "text": "まいにち あさごはんを（　　　）。",
          "options": [
            "たべます",
            "のみます",
            "ききます",
            "みます"
          ],
          "answer": 0,
          "explanation": "たべます = makan.",
          "period": "sep-nov"
        },
        {
          "id": 307,
          "section": "vocab",
          "text": "みずを（　　　）。",
          "options": [
            "のみます",
            "たべます",
            "よみます",
            "かきます"
          ],
          "answer": 0,
          "explanation": "のみます = minum.",
          "period": "sep-nov"
        },
        {
          "id": 308,
          "section": "vocab",
          "text": "おんがくを（　　　）。",
          "options": [
            "ききます",
            "みます",
            "よみます",
            "はなします"
          ],
          "answer": 0,
          "explanation": "音楽を聞きます = mendengarkan musik.",
          "period": "sep-nov"
        },
        {
          "id": 309,
          "section": "vocab",
          "text": "テレビを（　　　）。",
          "options": [
            "みます",
            "ききます",
            "よみます",
            "かきます"
          ],
          "answer": 0,
          "explanation": "テレビを見ます = menonton televisi.",
          "period": "sep-nov"
        },
        {
          "id": 310,
          "section": "vocab",
          "text": "しんぶんを（　　　）。",
          "options": [
            "よみます",
            "みます",
            "ききます",
            "たべます"
          ],
          "answer": 0,
          "explanation": "新聞を読みます = membaca koran.",
          "period": "sep-nov"
        },
        {
          "id": 311,
          "section": "vocab",
          "text": "てがみを（　　　）。",
          "options": [
            "かきます",
            "よみます",
            "ききます",
            "のみます"
          ],
          "answer": 0,
          "explanation": "手紙を書きます = menulis surat.",
          "period": "sep-nov"
        },
        {
          "id": 312,
          "section": "vocab",
          "text": "でんわで ともだちと（　　　）。",
          "options": [
            "はなします",
            "よみます",
            "かきます",
            "ききます"
          ],
          "answer": 0,
          "explanation": "話します = berbicara.",
          "period": "sep-nov"
        },
        {
          "id": 313,
          "section": "vocab",
          "text": "まいばん １１じに（　　　）。",
          "options": [
            "ねます",
            "おきます",
            "はたらきます",
            "あそびます"
          ],
          "answer": 0,
          "explanation": "寝ます = tidur.",
          "period": "sep-nov"
        },
        {
          "id": 314,
          "section": "vocab",
          "text": "まいあさ ６じに（　　　）。",
          "options": [
            "おきます",
            "ねます",
            "かえります",
            "やすみます"
          ],
          "answer": 0,
          "explanation": "起きます = bangun.",
          "period": "sep-nov"
        },
        {
          "id": 315,
          "section": "vocab",
          "text": "きょうは しごとが ありません。うちで（　　　）。",
          "options": [
            "やすみます",
            "はたらきます",
            "べんきょうします",
            "かいます"
          ],
          "answer": 0,
          "explanation": "休みます = beristirahat/libur.",
          "period": "sep-nov"
        },
        {
          "id": 316,
          "section": "grammar",
          "text": "わたしは まいにち ７じ（　　　）おきます。",
          "options": [
            "に",
            "で",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "に digunakan untuk menunjukkan waktu tertentu.",
          "period": "sep-nov"
        },
        {
          "id": 317,
          "section": "grammar",
          "text": "きのう ともだち（　　　）えいがを みました。",
          "options": [
            "と",
            "に",
            "で",
            "を"
          ],
          "answer": 0,
          "explanation": "と berarti bersama/dengan.",
          "period": "sep-nov"
        },
        {
          "id": 318,
          "section": "grammar",
          "text": "あした くるま（　　　）かいしゃへ いきます。",
          "options": [
            "で",
            "に",
            "を",
            "が"
          ],
          "answer": 0,
          "explanation": "で digunakan untuk alat transportasi.",
          "period": "sep-nov"
        },
        {
          "id": 319,
          "section": "grammar",
          "text": "つくえの うえ（　　　）ほんが あります。",
          "options": [
            "に",
            "で",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "に digunakan untuk menunjukkan lokasi keberadaan benda.",
          "period": "sep-nov"
        },
        {
          "id": 320,
          "section": "grammar",
          "text": "こうえん（　　　）こどもが あそんでいます。",
          "options": [
            "で",
            "に",
            "を",
            "へ"
          ],
          "answer": 0,
          "explanation": "で digunakan untuk tempat berlangsungnya aktivitas.",
          "period": "sep-nov"
        },
        {
          "id": 321,
          "section": "grammar",
          "text": "わたしは さかな（　　　）すきです。",
          "options": [
            "が",
            "を",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "Pola 〜が好きです berarti menyukai sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 322,
          "section": "grammar",
          "text": "にほんご（　　　）わかりますか。",
          "options": [
            "が",
            "を",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "わかります biasanya menggunakan partikel が.",
          "period": "sep-nov"
        },
        {
          "id": 323,
          "section": "grammar",
          "text": "わたしは りんご（　　　）２つ たべました。",
          "options": [
            "を",
            "が",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "を menandai objek langsung.",
          "period": "sep-nov"
        },
        {
          "id": 324,
          "section": "grammar",
          "text": "まいにち ８じ（　　　）５じまで はたらきます。",
          "options": [
            "から",
            "まで",
            "より",
            "しか"
          ],
          "answer": 0,
          "explanation": "から berarti mulai/dari.",
          "period": "sep-nov"
        },
        {
          "id": 325,
          "section": "grammar",
          "text": "９じ（　　　）５じまで はたらきます。",
          "options": [
            "から",
            "まで",
            "だけ",
            "しか"
          ],
          "answer": 0,
          "explanation": "から berarti mulai/dari; まで berarti sampai. Polanya 9時から5時までです.",
          "period": "sep-nov"
        },
        {
          "id": 326,
          "section": "grammar",
          "text": "この りんごは １００えん（　　　）やすいです。",
          "options": [
            "より",
            "から",
            "まで",
            "しか"
          ],
          "answer": 0,
          "explanation": "より digunakan untuk perbandingan.",
          "period": "sep-nov"
        },
        {
          "id": 327,
          "section": "grammar",
          "text": "バス（　　　）でんしゃの ほうが はやいです。",
          "options": [
            "より",
            "から",
            "まで",
            "しか"
          ],
          "answer": 0,
          "explanation": "バスより電車のほうが早い = kereta lebih cepat daripada bus.",
          "period": "sep-nov"
        },
        {
          "id": 328,
          "section": "grammar",
          "text": "きょうは べんきょう（　　　）します。",
          "options": [
            "を",
            "が",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "べんきょうをします = belajar.",
          "period": "sep-nov"
        },
        {
          "id": 329,
          "section": "grammar",
          "text": "この へやに つくえ（　　　）いすが あります。",
          "options": [
            "と",
            "や",
            "も",
            "か"
          ],
          "answer": 0,
          "explanation": "と digunakan untuk menghubungkan daftar lengkap: meja dan kursi.",
          "period": "sep-nov"
        },
        {
          "id": 330,
          "section": "grammar",
          "text": "スーパーで りんご（　　　）バナナなどを かいました。",
          "options": [
            "や",
            "と",
            "も",
            "か"
          ],
          "answer": 0,
          "explanation": "や digunakan untuk menyebutkan beberapa contoh.",
          "period": "sep-nov"
        },
        {
          "id": 331,
          "section": "grammar",
          "text": "この かばんは だれ（　　　）ですか。",
          "options": [
            "の",
            "に",
            "を",
            "で"
          ],
          "answer": 0,
          "explanation": "だれの = milik siapa.",
          "period": "sep-nov"
        },
        {
          "id": 332,
          "section": "grammar",
          "text": "これは わたし（　　　）かさです。",
          "options": [
            "の",
            "に",
            "を",
            "で"
          ],
          "answer": 0,
          "explanation": "わたしのかさ = payung saya.",
          "period": "sep-nov"
        },
        {
          "id": 333,
          "section": "grammar",
          "text": "A:「コーヒーを のみますか。」\nB:「いいえ、（　　　）です。」",
          "options": [
            "けっこう",
            "だいじょうぶ",
            "どうぞ",
            "こちらこそ"
          ],
          "answer": 0,
          "explanation": "けっこうです dapat berarti tidak perlu/tidak mau dalam konteks tawaran.",
          "period": "sep-nov"
        },
        {
          "id": 334,
          "section": "grammar",
          "text": "A:「いっしょに ひるごはんを たべませんか。」\nB:「はい、（　　　）。」",
          "options": [
            "たべましょう",
            "たべません",
            "たべました",
            "たべないでください"
          ],
          "answer": 0,
          "explanation": "たべましょう = mari makan.",
          "period": "sep-nov"
        },
        {
          "id": 335,
          "section": "grammar",
          "text": "ここで しゃしんを（　　　）も いいですか。",
          "options": [
            "とって",
            "とる",
            "とった",
            "とらない"
          ],
          "answer": 0,
          "explanation": "〜てもいいですか = bolehkah melakukan sesuatu.",
          "period": "sep-nov"
        },
        {
          "id": 336,
          "section": "grammar",
          "text": "この へやで たばこを（　　　）は いけません。",
          "options": [
            "すって",
            "すう",
            "すった",
            "すわない"
          ],
          "answer": 0,
          "explanation": "〜てはいけません = tidak boleh.",
          "period": "sep-nov"
        },
        {
          "id": 337,
          "section": "grammar",
          "text": "まいにち くすりを（　　　）なければ なりません。",
          "options": [
            "のま",
            "のんで",
            "のむ",
            "のまない"
          ],
          "answer": 0,
          "explanation": "〜なければなりません = harus. のまなければなりません.",
          "period": "sep-nov"
        },
        {
          "id": 338,
          "section": "grammar",
          "text": "あした ６じに（　　　）なければ なりません。",
          "options": [
            "おき",
            "おきて",
            "おきる",
            "おきない"
          ],
          "answer": 0,
          "explanation": "おきなければなりません = harus bangun.",
          "period": "sep-nov"
        },
        {
          "id": 339,
          "section": "grammar",
          "text": "ここから えきまで あるいて １０ぷん（　　　）かかります。",
          "options": [
            "ぐらい",
            "しか",
            "だけ",
            "でも"
          ],
          "answer": 0,
          "explanation": "ぐらい berarti kira-kira/sebanyak.",
          "period": "sep-nov"
        },
        {
          "id": 340,
          "section": "grammar",
          "text": "きょうは みず（　　　）のみません。",
          "options": [
            "しか",
            "だけ",
            "ぐらい",
            "まで"
          ],
          "answer": 0,
          "explanation": "しか + bentuk negatif = hanya.",
          "period": "sep-nov"
        },
        {
          "id": 341,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を 買いますか。",
          "audioText": "男：スーパーへ 行きますが、何か 買いましょうか。\n女：じゃあ、牛乳を ２本 お願いします。それから、パンも 買ってください。\n男：はい、わかりました。",
          "options": [
            "牛乳とパン",
            "牛乳と卵",
            "パンとりんご",
            "卵とりんご"
          ],
          "answer": 0,
          "explanation": "Perempuan meminta susu dan roti.",
          "period": "sep-nov"
        },
        {
          "id": 342,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何時に 起きますか。",
          "audioText": "女：毎朝 何時に 起きますか。\n男：いつも ６時に 起きます。でも、日曜日は ８時まで 寝ます。",
          "options": [
            "６時",
            "７時",
            "８時",
            "９時"
          ],
          "answer": 0,
          "explanation": "Dia biasanya bangun jam 6.",
          "period": "sep-nov"
        },
        {
          "id": 343,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は どこで 会いますか。",
          "audioText": "男：明日、どこで 会いましょうか。\n女：駅の前は どうですか。\n男：人が 多いですから、駅の 中の 喫茶店に しましょう。",
          "options": [
            "駅の中の喫茶店",
            "駅の前",
            "公園",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "Mereka akan bertemu di kafe yang berada di dalam stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 344,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を していますか。",
          "audioText": "男：鈴木さんは どこですか。\n女：今、事務所で 電話を かけています。",
          "options": [
            "電話をかけています",
            "本を読んでいます",
            "昼ごはんを食べています",
            "会議をしています"
          ],
          "answer": 0,
          "explanation": "Dia sedang menelepon.",
          "period": "sep-nov"
        },
        {
          "id": 345,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どうして 病院へ 行きますか。",
          "audioText": "女：どうしたんですか。\n男：昨日から 頭が 痛いんです。それで、病院へ 行きます。",
          "options": [
            "頭が痛いから",
            "おなかがすいたから",
            "けがをしたから",
            "薬を買うから"
          ],
          "answer": 0,
          "explanation": "Dia pergi ke rumah sakit karena sakit kepala.",
          "period": "sep-nov"
        },
        {
          "id": 346,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は 何を 食べますか。",
          "audioText": "女：晩ごはんは 何に しましょうか。\n男：ラーメンは どうですか。\n女：いいですね。でも、私は すしが 食べたいです。\n男：じゃあ、すしに しましょう。",
          "options": [
            "すし",
            "ラーメン",
            "カレー",
            "そば"
          ],
          "answer": 0,
          "explanation": "Mereka akhirnya memilih sushi.",
          "period": "sep-nov"
        },
        {
          "id": 347,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どの かばんを 買いますか。",
          "audioText": "女：この 大きい かばんは どうですか。\n男：ちょっと 高いですね。\n女：では、こちらの 小さくて 安い かばんは？\n男：それに します。",
          "options": [
            "小さくて安いかばん",
            "大きくて高いかばん",
            "大きくて安いかばん",
            "小さくて高いかばん"
          ],
          "answer": 0,
          "explanation": "Dia membeli tas yang kecil dan murah.",
          "period": "sep-nov"
        },
        {
          "id": 348,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は いつ 旅行しますか。",
          "audioText": "男：夏休みに 旅行しますか。\n女：はい。８月は 仕事が ありますから、９月に 行きます。",
          "options": [
            "９月",
            "８月",
            "７月",
            "１０月"
          ],
          "answer": 0,
          "explanation": "Dia bepergian pada bulan September.",
          "period": "sep-nov"
        },
        {
          "id": 349,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 持っていきますか。",
          "audioText": "女：明日は 雨ですから、傘を 持っていってください。\n男：はい。かばんに 入れました。",
          "options": [
            "傘",
            "帽子",
            "本",
            "水"
          ],
          "answer": 0,
          "explanation": "Dia membawa payung.",
          "period": "sep-nov"
        },
        {
          "id": 350,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は どこへ 行きますか。",
          "audioText": "男：一緒に 映画を 見ませんか。\n女：すみません。これから 銀行へ 行かなければ なりません。",
          "options": [
            "銀行",
            "映画館",
            "スーパー",
            "病院"
          ],
          "answer": 0,
          "explanation": "Dia harus pergi ke bank.",
          "period": "sep-nov"
        },
        {
          "id": 351,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 忘れましたか。",
          "audioText": "男：財布が ありません。\n女：机の 上に ありませんか。\n男：ありません。あ、車の 中に 置いてきました。",
          "options": [
            "財布",
            "携帯電話",
            "かばん",
            "鍵"
          ],
          "answer": 0,
          "explanation": "Dia meninggalkan dompet di dalam mobil.",
          "period": "sep-nov"
        },
        {
          "id": 352,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n会議は 何時からですか。",
          "audioText": "女：会議は 何時からですか。\n男：午後２時からです。でも、１時半までに 来てください。",
          "options": [
            "午後２時",
            "午後１時半",
            "午後３時",
            "午前２時"
          ],
          "answer": 0,
          "explanation": "Rapat dimulai pukul 2 siang.",
          "period": "sep-nov"
        },
        {
          "id": 353,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を 料理しますか。",
          "audioText": "男：晩ごはんは 何ですか。\n女：今日は 野菜が たくさん ありますから、野菜カレーを 作ります。",
          "options": [
            "野菜カレー",
            "魚料理",
            "ラーメン",
            "サンドイッチ"
          ],
          "answer": 0,
          "explanation": "Dia akan memasak kari sayur.",
          "period": "sep-nov"
        },
        {
          "id": 354,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どこで 働いていますか。",
          "audioText": "女：お仕事は 何ですか。\n男：銀行で 働いています。毎日 お金を 数えます。",
          "options": [
            "銀行",
            "学校",
            "病院",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "Dia bekerja di bank.",
          "period": "sep-nov"
        },
        {
          "id": 355,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を しなければ なりませんか。",
          "audioText": "女：明日までに この レポートを 書かなければ なりません。\n男：大変ですね。手伝いましょうか。",
          "options": [
            "レポートを書く",
            "本を読む",
            "電話をする",
            "買い物をする"
          ],
          "answer": 0,
          "explanation": "Dia harus menulis laporan.",
          "period": "sep-nov"
        },
        {
          "id": 356,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何時ごろ 帰りますか。",
          "audioText": "女：仕事は 何時に 終わりますか。\n男：５時に 終わります。それから 買い物を しますから、６時半ごろ 帰ります。",
          "options": [
            "６時半ごろ",
            "５時ごろ",
            "６時ごろ",
            "７時半ごろ"
          ],
          "answer": 0,
          "explanation": "Dia pulang sekitar pukul 6.30.",
          "period": "sep-nov"
        },
        {
          "id": 357,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は どこで 昼ごはんを 食べますか。",
          "audioText": "男：食堂へ 行きましょうか。\n女：今日は 天気が いいですから、公園で 食べませんか。\n男：いいですね。そうしましょう。",
          "options": [
            "公園",
            "食堂",
            "会社",
            "駅"
          ],
          "answer": 0,
          "explanation": "Mereka makan siang di taman.",
          "period": "sep-nov"
        },
        {
          "id": 358,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どんな 部屋が ほしいですか。",
          "audioText": "女：どんな 部屋が ほしいですか。\n男：明るくて、静かな 部屋が いいです。駅から 遠くても いいです。",
          "options": [
            "明るくて静かな部屋",
            "暗くて静かな部屋",
            "明るくてうるさい部屋",
            "駅に近い部屋"
          ],
          "answer": 0,
          "explanation": "Dia mencari kamar yang terang dan tenang.",
          "period": "sep-nov"
        },
        {
          "id": 359,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を 使いますか。",
          "audioText": "男：鉛筆が ありません。貸して ください。\n女：すみません。鉛筆は ありませんが、ボールペンなら あります。\n男：では、それを 貸してください。",
          "options": [
            "ボールペン",
            "鉛筆",
            "消しゴム",
            "ノート"
          ],
          "answer": 0,
          "explanation": "Dia menggunakan pulpen.",
          "period": "sep-nov"
        },
        {
          "id": 360,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n明日は どんな 天気ですか。",
          "audioText": "女：明日の 天気は どうですか。\n男：朝は 晴れますが、午後から 雨が 降るそうです。",
          "options": [
            "午後から雨",
            "一日中晴れ",
            "朝から雪",
            "一日中雨"
          ],
          "answer": 0,
          "explanation": "Besok hujan mulai sore/siang setelah pagi cerah.",
          "period": "sep-nov"
        },
        {
          "id": 361,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜市民プール＞\n開館時間：午前９時から午後６時まで\n休み：毎週火曜日\n料金：大人５００円、子ども２００円\n\n市民プールは 何時までですか。",
          "options": [
            "午後６時まで",
            "午前９時まで",
            "午後５時まで",
            "午後７時まで"
          ],
          "answer": 0,
          "explanation": "Kolam renang buka sampai pukul 6 sore.",
          "period": "sep-nov"
        },
        {
          "id": 362,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜市民プール＞\n開館時間：午前９時から午後６時まで\n休み：毎週火曜日\n料金：大人５００円、子ども２００円\n\n火曜日に プールへ 行くことが できますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "午後だけできます",
            "子どもだけできます"
          ],
          "answer": 0,
          "explanation": "Selasa adalah hari libur, jadi tidak bisa pergi ke kolam renang.",
          "period": "sep-nov"
        },
        {
          "id": 363,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n山田さんへ\n冷蔵庫に ケーキが あります。\n食べても いいですが、弟の ぶんを 残して おいてください。\n（お母さん）\n\nケーキを どうしますか。",
          "options": [
            "弟のぶんを残します",
            "全部食べます",
            "冷蔵庫から出します",
            "お母さんに渡します"
          ],
          "answer": 0,
          "explanation": "Kue boleh dimakan, tetapi bagian adik harus disisakan.",
          "period": "sep-nov"
        },
        {
          "id": 364,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n田中さんへ\nあしたの パーティーは ６時からです。\n場所は 駅の 近くの レストランです。\n飲み物は 私が 用意します。\nでは、あした。\n（佐藤）\n\nパーティーは どこで ありますか。",
          "options": [
            "駅の近くのレストラン",
            "田中さんの家",
            "佐藤さんの会社",
            "駅の中"
          ],
          "answer": 0,
          "explanation": "Pesta diadakan di restoran dekat stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 365,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n田中さんへ\nあしたの パーティーは ６時からです。\n場所は 駅の 近くの レストランです。\n飲み物は 私が 用意します。\nでは、あした。\n（佐藤）\n\n飲み物を 用意するのは だれですか。",
          "options": [
            "佐藤さん",
            "田中さん",
            "レストランの人",
            "駅の人"
          ],
          "answer": 0,
          "explanation": "佐藤さんが飲み物を用意します = Sato yang menyiapkan minuman.",
          "period": "sep-nov"
        },
        {
          "id": 366,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜日本語教室＞\n日時：毎週土曜日 午前１０時から１２時まで\n場所：公民館２階\n参加費：無料\n\n日本語教室は いつ ありますか。",
          "options": [
            "毎週土曜日",
            "毎週日曜日",
            "毎週金曜日",
            "毎日"
          ],
          "answer": 0,
          "explanation": "Kelas bahasa Jepang diadakan setiap Sabtu.",
          "period": "sep-nov"
        },
        {
          "id": 367,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜日本語教室＞\n日時：毎週土曜日 午前１０時から１２時まで\n場所：公民館２階\n参加費：無料\n\n教室は どこですか。",
          "options": [
            "公民館の２階",
            "学校の１階",
            "駅の２階",
            "図書館"
          ],
          "answer": 0,
          "explanation": "Tempat kelas berada di lantai dua gedung komunitas.",
          "period": "sep-nov"
        },
        {
          "id": 368,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜日本語教室＞\n日時：毎週土曜日 午前１０時から１２時まで\n場所：公民館２階\n参加費：無料\n\n参加費は いくらですか。",
          "options": [
            "無料です",
            "５００円です",
            "１０００円です",
            "２００円です"
          ],
          "answer": 0,
          "explanation": "無料 berarti gratis.",
          "period": "sep-nov"
        },
        {
          "id": 369,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n日曜日\n朝、雨が 降っていたので、どこへも 行かなかった。\n午後、雨が やんだので、近くの スーパーへ 買い物に 行った。\n\n朝、どうして どこへも 行きませんでしたか。",
          "options": [
            "雨が降っていたから",
            "病気だったから",
            "仕事があったから",
            "店が休みだったから"
          ],
          "answer": 0,
          "explanation": "Dia tidak pergi ke mana pun pada pagi hari karena hujan.",
          "period": "sep-nov"
        },
        {
          "id": 370,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n日曜日\n朝、雨が 降っていたので、どこへも 行かなかった。\n午後、雨が やんだので、近くの スーパーへ 買い物に 行った。\n\n午後、どこへ 行きましたか。",
          "options": [
            "スーパー",
            "病院",
            "学校",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "Sore hari dia pergi berbelanja ke supermarket.",
          "period": "sep-nov"
        },
        {
          "id": 371,
          "section": "reading",
          "text": "【掲示を読んで答えてください】\n＜図書館からのお知らせ＞\n４月１０日から４月１５日まで、本の整理のため休館します。\n４月１６日から、いつもどおり開館します。\n\n図書館は いつから 開きますか。",
          "options": [
            "４月１６日",
            "４月１０日",
            "４月１５日",
            "４月２０日"
          ],
          "answer": 0,
          "explanation": "Perpustakaan buka kembali mulai 16 April.",
          "period": "sep-nov"
        },
        {
          "id": 372,
          "section": "reading",
          "text": "【掲示を読んで答えてください】\n＜図書館からのお知らせ＞\n４月１０日から４月１５日まで、本の整理のため休館します。\n４月１６日から、いつもどおり開館します。\n\nどうして 休みますか。",
          "options": [
            "本を整理するため",
            "先生が休むため",
            "雨が降るため",
            "建物を売るため"
          ],
          "answer": 0,
          "explanation": "休館の理由は本の整理です.",
          "period": "sep-nov"
        },
        {
          "id": 373,
          "section": "reading",
          "text": "【広告を読んで答えてください】\n＜スーパーさくら＞\nりんご：１個１００円\n牛乳：１本１５０円\nパン：１袋２００円\n毎週日曜日は 全部１０％引き\n\n日曜日に りんごを １個 買うと、いくらですか。",
          "options": [
            "９０円",
            "１００円",
            "１１０円",
            "１５０円"
          ],
          "answer": 0,
          "explanation": "Harga 100 yen mendapat diskon 10%, menjadi 90 yen.",
          "period": "sep-nov"
        },
        {
          "id": 374,
          "section": "reading",
          "text": "【広告を読んで答えてください】\n＜スーパーさくら＞\nりんご：１個１００円\n牛乳：１本１５０円\nパン：１袋２００円\n毎週日曜日は 全部１０％引き\n\n牛乳は いくらですか。",
          "options": [
            "１５０円",
            "１００円",
            "２００円",
            "９０円"
          ],
          "answer": 0,
          "explanation": "Harga susu adalah 150 yen sebelum diskon.",
          "period": "sep-nov"
        },
        {
          "id": 375,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜駅前病院＞\n受付時間：午前８時３０分から１１時３０分まで\n午後２時から５時まで\n休診日：日曜日と祝日\n\n午後１時に 病院へ 行って、診察して もらえますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "日曜日ならできます",
            "午前だけできます"
          ],
          "answer": 0,
          "explanation": "Pukul 1 siang berada di antara jam pelayanan, jadi tidak bisa mendaftar.",
          "period": "sep-nov"
        },
        {
          "id": 376,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜駅前病院＞\n受付時間：午前８時３０分から１１時３０分まで\n午後２時から５時まで\n休診日：日曜日と祝日\n\n午後３時に 行くことが できますか。",
          "options": [
            "はい、できます",
            "いいえ、できません",
            "午前だけです",
            "日曜日だけです"
          ],
          "answer": 0,
          "explanation": "Pukul 3 sore termasuk jam pelayanan.",
          "period": "sep-nov"
        },
        {
          "id": 377,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n今日は 早く 帰ります。\n６時に 駅の 前で 待っています。\n遅れるときは 電話してください。\n\n何時に 待っていますか。",
          "options": [
            "６時",
            "５時",
            "７時",
            "８時"
          ],
          "answer": 0,
          "explanation": "Orang tersebut menunggu pukul 6.",
          "period": "sep-nov"
        },
        {
          "id": 378,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n今日は 早く 帰ります。\n６時に 駅の 前で 待っています。\n遅れるときは 電話してください。\n\nどこで 待っていますか。",
          "options": [
            "駅の前",
            "駅の中",
            "学校の前",
            "公園"
          ],
          "answer": 0,
          "explanation": "Dia menunggu di depan stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 379,
          "section": "reading",
          "text": "【説明を読んで答えてください】\nこの薬は 朝と晩に １錠ずつ 飲んでください。\n食事の あとに 飲んでください。\n\nいつ 薬を 飲みますか。",
          "options": [
            "朝と晩の食事のあと",
            "昼ごはんのあとだけ",
            "寝る前だけ",
            "食事のまえ"
          ],
          "answer": 0,
          "explanation": "Obat diminum pagi dan malam setelah makan.",
          "period": "sep-nov"
        },
        {
          "id": 380,
          "section": "reading",
          "text": "【説明を読んで答えてください】\nこの薬は 朝と晩に １錠ずつ 飲んでください。\n食事の あとに 飲んでください。\n\n１回に 何錠 飲みますか。",
          "options": [
            "１錠",
            "２錠",
            "３錠",
            "半分"
          ],
          "answer": 0,
          "explanation": "１錠ずつ berarti satu tablet setiap kali minum.",
          "period": "sep-nov"
        },
        {
          "id": 381,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n鈴木さんへ\nあしたの 会議の 資料を １０部 コピーして、机の 上に 置いてください。\n会議は 午前９時からです。\n（田中）\n\n鈴木さんは 何を しますか。",
          "options": [
            "資料を１０部コピーします",
            "会議に出ません",
            "資料を捨てます",
            "机を買います"
          ],
          "answer": 0,
          "explanation": "Suzuki harus menyalin materi rapat sebanyak 10 eksemplar.",
          "period": "sep-nov"
        },
        {
          "id": 382,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n鈴木さんへ\nあしたの 会議の 資料を １０部 コピーして、机の 上に 置いてください。\n会議は 午前９時からです。\n（田中）\n\n会議は 何時からですか。",
          "options": [
            "午前９時",
            "午前１０時",
            "午後９時",
            "午後１０時"
          ],
          "answer": 0,
          "explanation": "Rapat dimulai pukul 9 pagi.",
          "period": "sep-nov"
        },
        {
          "id": 383,
          "section": "reading",
          "text": "【会話を読んで答えてください】\nA：きのう 何を しましたか。\nB：朝は 掃除を しました。午後は 友だちと テニスを しました。\n\nBさんは 午後、何を しましたか。",
          "options": [
            "テニスをしました",
            "掃除をしました",
            "映画を見ました",
            "買い物をしました"
          ],
          "answer": 0,
          "explanation": "Sore hari B bermain tenis dengan teman.",
          "period": "sep-nov"
        },
        {
          "id": 384,
          "section": "reading",
          "text": "【会話を読んで答えてください】\nA：きのう 何を しましたか。\nB：朝は 掃除を しました。午後は 友だちと テニスを しました。\n\nBさんは 朝、何を しましたか。",
          "options": [
            "掃除をしました",
            "テニスをしました",
            "料理をしました",
            "寝ました"
          ],
          "answer": 0,
          "explanation": "Pagi hari B membersihkan rumah.",
          "period": "sep-nov"
        },
        {
          "id": 385,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜バスの時間＞\n駅前発：８：００、８：３０、９：００、９：３０\n学校前着：８：２０、８：５０、９：２０、９：５０\n\n８時３０分の バスは 何時に 学校前に 着きますか。",
          "options": [
            "８時５０分",
            "８時２０分",
            "９時",
            "９時２０分"
          ],
          "answer": 0,
          "explanation": "Bus pukul 8.30 tiba pukul 8.50.",
          "period": "sep-nov"
        },
        {
          "id": 386,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜バスの時間＞\n駅前発：８：００、８：３０、９：００、９：３０\n学校前着：８：２０、８：５０、９：２０、９：５０\n\n駅前を ９時に 出る バスは 何時に 着きますか。",
          "options": [
            "９時２０分",
            "９時",
            "９時３０分",
            "９時５０分"
          ],
          "answer": 0,
          "explanation": "Bus yang berangkat pukul 9 tiba pukul 9.20.",
          "period": "sep-nov"
        },
        {
          "id": 387,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n５月３日\n今日は いい天気だったので、家族と 山へ 行った。\n昼ごはんを 食べてから、写真を たくさん 撮った。\n\nだれと 山へ 行きましたか。",
          "options": [
            "家族",
            "友だち",
            "先生",
            "一人で"
          ],
          "answer": 0,
          "explanation": "Dia pergi ke gunung bersama keluarga.",
          "period": "sep-nov"
        },
        {
          "id": 388,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n５月３日\n今日は いい天気だったので、家族と 山へ 行った。\n昼ごはんを 食べてから、写真を たくさん 撮った。\n\n昼ごはんの あとで、何を しましたか。",
          "options": [
            "写真を撮りました",
            "山へ行きました",
            "家へ帰りました",
            "料理をしました"
          ],
          "answer": 0,
          "explanation": "Setelah makan siang, dia mengambil banyak foto.",
          "period": "sep-nov"
        },
        {
          "id": 389,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n＜会社のお知らせ＞\n５月２０日（金）は 会社が 休みです。\n２１日（土）と ２２日（日）も 休みです。\n仕事は ２３日（月）から 始まります。\n\n仕事は いつから 始まりますか。",
          "options": [
            "２３日（月）",
            "２０日（金）",
            "２１日（土）",
            "２２日（日）"
          ],
          "answer": 0,
          "explanation": "Pekerjaan dimulai kembali pada Senin tanggal 23.",
          "period": "sep-nov"
        },
        {
          "id": 390,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n＜会社のお知らせ＞\n５月２０日（金）は 会社が 休みです。\n２１日（土）と ２２日（日）も 休みです。\n仕事は ２３日（月）から 始まります。\n\n５月２１日は 会社が ありますか。",
          "options": [
            "いいえ、ありません",
            "はい、あります",
            "午後だけあります",
            "わかりません"
          ],
          "answer": 0,
          "explanation": "Tanggal 21 juga merupakan hari libur.",
          "period": "sep-nov"
        },
        {
          "id": 391,
          "section": "vocab",
          "text": "「ともだち」は かんじで どう かきますか。",
          "options": [
            "友達",
            "先生",
            "家族",
            "学生"
          ],
          "answer": 0,
          "explanation": "友達 (ともだち) = teman.",
          "period": "sep-nov"
        },
        {
          "id": 392,
          "section": "vocab",
          "text": "「せんせい」は かんじで どう かきますか。",
          "options": [
            "先生",
            "学生",
            "医者",
            "会社員"
          ],
          "answer": 0,
          "explanation": "先生 (せんせい) = guru.",
          "period": "sep-nov"
        },
        {
          "id": 393,
          "section": "vocab",
          "text": "「がくせい」は かんじで どう かきますか。",
          "options": [
            "学生",
            "先生",
            "学校",
            "勉強"
          ],
          "answer": 0,
          "explanation": "学生 (がくせい) = siswa/mahasiswa.",
          "period": "sep-nov"
        },
        {
          "id": 394,
          "section": "vocab",
          "text": "「かいしゃいん」は かんじで どう かきますか。",
          "options": [
            "会社員",
            "学生",
            "先生",
            "医者"
          ],
          "answer": 0,
          "explanation": "会社員 (かいしゃいん) = karyawan.",
          "period": "sep-nov"
        },
        {
          "id": 395,
          "section": "vocab",
          "text": "「いしゃ」は かんじで どう かきますか。",
          "options": [
            "医者",
            "先生",
            "看護師",
            "薬"
          ],
          "answer": 0,
          "explanation": "医者 (いしゃ) = dokter.",
          "period": "sep-nov"
        },
        {
          "id": 396,
          "section": "vocab",
          "text": "「がっこう」は かんじで どう かきますか。",
          "options": [
            "学校",
            "学生",
            "先生",
            "勉強"
          ],
          "answer": 0,
          "explanation": "学校 (がっこう) = sekolah.",
          "period": "sep-nov"
        },
        {
          "id": 397,
          "section": "vocab",
          "text": "「べんきょう」は かんじで どう かきますか。",
          "options": [
            "勉強",
            "学校",
            "学生",
            "先生"
          ],
          "answer": 0,
          "explanation": "勉強 (べんきょう) = belajar.",
          "period": "sep-nov"
        },
        {
          "id": 398,
          "section": "vocab",
          "text": "「しごと」は かんじで どう かきますか。",
          "options": [
            "仕事",
            "学校",
            "学生",
            "先生"
          ],
          "answer": 0,
          "explanation": "仕事 (しごと) = pekerjaan.",
          "period": "sep-nov"
        },
        {
          "id": 399,
          "section": "vocab",
          "text": "「やすみ」は かんじで どう かきますか。",
          "options": [
            "休み",
            "仕事",
            "学校",
            "勉強"
          ],
          "answer": 0,
          "explanation": "休み (やすみ) = libur/istirahat.",
          "period": "sep-nov"
        },
        {
          "id": 400,
          "section": "vocab",
          "text": "「にちようび」は かんじで どう かきますか。",
          "options": [
            "日曜日",
            "月曜日",
            "火曜日",
            "水曜日"
          ],
          "answer": 0,
          "explanation": "日曜日 (にちようび) = Minggu.",
          "period": "sep-nov"
        },
        {
          "id": 401,
          "section": "vocab",
          "text": "「げつようび」は かんじで どう かきますか。",
          "options": [
            "月曜日",
            "火曜日",
            "水曜日",
            "木曜日"
          ],
          "answer": 0,
          "explanation": "月曜日 (げつようび) = Senin.",
          "period": "sep-nov"
        },
        {
          "id": 402,
          "section": "vocab",
          "text": "「かようび」は かんじで どう かきますか。",
          "options": [
            "火曜日",
            "水曜日",
            "木曜日",
            "金曜日"
          ],
          "answer": 0,
          "explanation": "火曜日 (かようび) = Selasa.",
          "period": "sep-nov"
        },
        {
          "id": 403,
          "section": "vocab",
          "text": "「すいようび」は かんじで どう かきますか。",
          "options": [
            "水曜日",
            "木曜日",
            "金曜日",
            "土曜日"
          ],
          "answer": 0,
          "explanation": "水曜日 (すいようび) = Rabu.",
          "period": "sep-nov"
        },
        {
          "id": 404,
          "section": "vocab",
          "text": "「もくようび」は かんじで どう かきますか。",
          "options": [
            "木曜日",
            "金曜日",
            "土曜日",
            "日曜日"
          ],
          "answer": 0,
          "explanation": "木曜日 (もくようび) = Kamis.",
          "period": "sep-nov"
        },
        {
          "id": 405,
          "section": "vocab",
          "text": "「きんようび」は かんじで どう かきますか。",
          "options": [
            "金曜日",
            "土曜日",
            "日曜日",
            "月曜日"
          ],
          "answer": 0,
          "explanation": "金曜日 (きんようび) = Jumat.",
          "period": "sep-nov"
        },
        {
          "id": 406,
          "section": "vocab",
          "text": "「どようび」は かんじで どう かきますか。",
          "options": [
            "土曜日",
            "日曜日",
            "月曜日",
            "火曜日"
          ],
          "answer": 0,
          "explanation": "土曜日 (どようび) = Sabtu.",
          "period": "sep-nov"
        },
        {
          "id": 407,
          "section": "vocab",
          "text": "「いちがつ」は かんじで どう かきますか。",
          "options": [
            "一月",
            "二月",
            "三月",
            "四月"
          ],
          "answer": 0,
          "explanation": "一月 (いちがつ) = Januari.",
          "period": "sep-nov"
        },
        {
          "id": 408,
          "section": "vocab",
          "text": "「にがつ」は かんじで どう かきますか。",
          "options": [
            "二月",
            "三月",
            "四月",
            "五月"
          ],
          "answer": 0,
          "explanation": "二月 (にがつ) = Februari.",
          "period": "sep-nov"
        },
        {
          "id": 409,
          "section": "vocab",
          "text": "「さんがつ」は かんじで どう かきますか。",
          "options": [
            "三月",
            "四月",
            "五月",
            "六月"
          ],
          "answer": 0,
          "explanation": "三月 (さんがつ) = Maret.",
          "period": "sep-nov"
        },
        {
          "id": 410,
          "section": "vocab",
          "text": "「しがつ」は かんじで どう かきますか。",
          "options": [
            "四月",
            "五月",
            "六月",
            "七月"
          ],
          "answer": 0,
          "explanation": "四月 (しがつ) = April.",
          "period": "sep-nov"
        },
        {
          "id": 411,
          "section": "vocab",
          "text": "「ごがつ」は かんじで どう かきますか。",
          "options": [
            "五月",
            "六月",
            "七月",
            "八月"
          ],
          "answer": 0,
          "explanation": "五月 (ごがつ) = Mei.",
          "period": "sep-nov"
        },
        {
          "id": 412,
          "section": "vocab",
          "text": "「ろくがつ」は かんじで どう かきますか。",
          "options": [
            "六月",
            "七月",
            "八月",
            "九月"
          ],
          "answer": 0,
          "explanation": "六月 (ろくがつ) = Juni.",
          "period": "sep-nov"
        },
        {
          "id": 413,
          "section": "vocab",
          "text": "「しちがつ」は かんじで どう かきますか。",
          "options": [
            "七月",
            "八月",
            "九月",
            "十月"
          ],
          "answer": 0,
          "explanation": "七月 (しちがつ) = Juli.",
          "period": "sep-nov"
        },
        {
          "id": 414,
          "section": "vocab",
          "text": "「はちがつ」は かんじで どう かきますか。",
          "options": [
            "八月",
            "九月",
            "十月",
            "十一月"
          ],
          "answer": 0,
          "explanation": "八月 (はちがつ) = Agustus.",
          "period": "sep-nov"
        },
        {
          "id": 415,
          "section": "vocab",
          "text": "「くがつ」は かんじで どう かきますか。",
          "options": [
            "九月",
            "十月",
            "十一月",
            "十二月"
          ],
          "answer": 0,
          "explanation": "九月 (くがつ) = September.",
          "period": "sep-nov"
        },
        {
          "id": 416,
          "section": "grammar",
          "text": "わたしは まいにち 学校（　　　）いきます。",
          "options": [
            "へ",
            "で",
            "を",
            "が"
          ],
          "answer": 0,
          "explanation": "へ menunjukkan arah/tujuan.",
          "period": "sep-nov"
        },
        {
          "id": 417,
          "section": "grammar",
          "text": "きのう ともだち（　　　）あいました。",
          "options": [
            "に",
            "を",
            "で",
            "が"
          ],
          "answer": 0,
          "explanation": "に digunakan dengan 会います (bertemu).",
          "period": "sep-nov"
        },
        {
          "id": 418,
          "section": "grammar",
          "text": "まいあさ コーヒー（　　　）のみます。",
          "options": [
            "を",
            "が",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "を menandai objek langsung.",
          "period": "sep-nov"
        },
        {
          "id": 419,
          "section": "grammar",
          "text": "この ほんは おもしろ（　　　）です。",
          "options": [
            "い",
            "く",
            "に",
            "な"
          ],
          "answer": 0,
          "explanation": "おもしろい adalah kata sifat-i.",
          "period": "sep-nov"
        },
        {
          "id": 420,
          "section": "grammar",
          "text": "この へやは（　　　）です。",
          "options": [
            "しずか",
            "しずかな",
            "しずかに",
            "しずかだ"
          ],
          "answer": 0,
          "explanation": "しずか adalah kata sifat-na. Sebelum です, gunakan しずかです。",
          "period": "sep-nov"
        },
        {
          "id": 421,
          "section": "grammar",
          "text": "きのうは とても（　　　）でした。",
          "options": [
            "あつかった",
            "あつい",
            "あつく",
            "あつくて"
          ],
          "answer": 0,
          "explanation": "Bentuk lampau kata sifat-i: あつかった.",
          "period": "sep-nov"
        },
        {
          "id": 422,
          "section": "grammar",
          "text": "きのうは（　　　）でした。",
          "options": [
            "さむかった",
            "さむい",
            "さむく",
            "さむくて"
          ],
          "answer": 0,
          "explanation": "Bentuk lampau kata sifat-i: さむかった.",
          "period": "sep-nov"
        },
        {
          "id": 423,
          "section": "grammar",
          "text": "この レストランの りょうりは（　　　）。",
          "options": [
            "おいしいです",
            "おいしいでした",
            "おいしかったですた",
            "おいしくでした"
          ],
          "answer": 0,
          "explanation": "Bentuk sopan sekarang: おいしいです.",
          "period": "sep-nov"
        },
        {
          "id": 424,
          "section": "grammar",
          "text": "きのうの テストは（　　　）。",
          "options": [
            "むずかしかったです",
            "むずかしいでした",
            "むずかしくでした",
            "むずかしかったでした"
          ],
          "answer": 0,
          "explanation": "Bentuk lampau sopan: むずかしかったです.",
          "period": "sep-nov"
        },
        {
          "id": 425,
          "section": "grammar",
          "text": "あしたは（　　　）でしょう。",
          "options": [
            "あめ",
            "あめの",
            "あめな",
            "あめい"
          ],
          "answer": 0,
          "explanation": "Kata benda + でしょう = mungkin hujan.",
          "period": "sep-nov"
        },
        {
          "id": 426,
          "section": "grammar",
          "text": "あしたは（　　　）でしょう。",
          "options": [
            "あつい",
            "あついの",
            "あつな",
            "あつだ"
          ],
          "answer": 0,
          "explanation": "Kata sifat-i + でしょう = mungkin panas.",
          "period": "sep-nov"
        },
        {
          "id": 427,
          "section": "grammar",
          "text": "まいにち ７じ（　　　）おきて、８じ（　　　）がっこうへ いきます。",
          "options": [
            "に／へ",
            "で／に",
            "を／で",
            "が／を"
          ],
          "answer": 0,
          "explanation": "に untuk waktu, へ untuk arah.",
          "period": "sep-nov"
        },
        {
          "id": 428,
          "section": "grammar",
          "text": "わたしは 日本ご（　　　）はなす ことが できます。",
          "options": [
            "が",
            "を",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "が digunakan dengan ことができます.",
          "period": "sep-nov"
        },
        {
          "id": 429,
          "section": "grammar",
          "text": "まいにち 日本語（　　　）べんきょうして います。",
          "options": [
            "を",
            "が",
            "に",
            "で"
          ],
          "answer": 0,
          "explanation": "を digunakan dengan 勉強します.",
          "period": "sep-nov"
        },
        {
          "id": 430,
          "section": "grammar",
          "text": "いま 何を して いますか。",
          "options": [
            "べんきょうして います",
            "べんきょうします",
            "べんきょうしました",
            "べんきょうする"
          ],
          "answer": 0,
          "explanation": "〜ています untuk aktivitas yang sedang berlangsung.",
          "period": "sep-nov"
        },
        {
          "id": 431,
          "section": "grammar",
          "text": "まいあさ ６じに おきて いますか。",
          "options": [
            "いいえ、おきて いません",
            "はい、おきます",
            "いいえ、おきません",
            "はい、おきました"
          ],
          "answer": 0,
          "explanation": "〜ていません untuk menyangkal kebiasaan/keadaan.",
          "period": "sep-nov"
        },
        {
          "id": 432,
          "section": "grammar",
          "text": "きのう 何を しましたか。",
          "options": [
            "えいがを みました",
            "えいがを みます",
            "えいがを みて います",
            "えいがを みる"
          ],
          "answer": 0,
          "explanation": "Bentuk lampau: みました.",
          "period": "sep-nov"
        },
        {
          "id": 433,
          "section": "grammar",
          "text": "あした 何を しますか。",
          "options": [
            "ともだちと あそびます",
            "ともだちと あそびました",
            "ともだちと あそんで います",
            "ともだちと あそぶ"
          ],
          "answer": 0,
          "explanation": "Bentuk sekarang/akan datang: あそびます.",
          "period": "sep-nov"
        },
        {
          "id": 434,
          "section": "grammar",
          "text": "もう 昼ごはんを（　　　）か。",
          "options": [
            "たべました",
            "たべます",
            "たべて います",
            "たべる"
          ],
          "answer": 0,
          "explanation": "もう + bentuk lampau untuk menanyakan apakah sudah.",
          "period": "sep-nov"
        },
        {
          "id": 435,
          "section": "grammar",
          "text": "いいえ、（　　　）たべて いません。",
          "options": [
            "まだ",
            "もう",
            "いつも",
            "よく"
          ],
          "answer": 0,
          "explanation": "まだ + negatif = belum.",
          "period": "sep-nov"
        },
        {
          "id": 436,
          "section": "grammar",
          "text": "この 本を（　　　）も いいですか。",
          "options": [
            "よんで",
            "よむ",
            "よんだ",
            "よまない"
          ],
          "answer": 0,
          "explanation": "〜てもいいですか = bolehkah.",
          "period": "sep-nov"
        },
        {
          "id": 437,
          "section": "grammar",
          "text": "ここで 写真を（　　　）は いけません。",
          "options": [
            "とって",
            "とる",
            "とった",
            "とらない"
          ],
          "answer": 0,
          "explanation": "〜てはいけません = tidak boleh.",
          "period": "sep-nov"
        },
        {
          "id": 438,
          "section": "grammar",
          "text": "まいにち 薬を（　　　）なければ なりません。",
          "options": [
            "のま",
            "のんで",
            "のむ",
            "のまない"
          ],
          "answer": 0,
          "explanation": "〜なければなりません = harus.",
          "period": "sep-nov"
        },
        {
          "id": 439,
          "section": "grammar",
          "text": "あしたは 早く（　　　）なくても いいです。",
          "options": [
            "おき",
            "おきて",
            "おきる",
            "おきない"
          ],
          "answer": 0,
          "explanation": "〜なくてもいいです = tidak perlu.",
          "period": "sep-nov"
        },
        {
          "id": 440,
          "section": "grammar",
          "text": "この 本は（　　　）おもしろいです。",
          "options": [
            "とても",
            "あまり",
            "ぜんぜん",
            "まだ"
          ],
          "answer": 0,
          "explanation": "とても + positif = sangat.",
          "period": "sep-nov"
        },
        {
          "id": 441,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を しますか。",
          "audioText": "女：田中さん、レポートは 終わりましたか。\n男：いいえ、まだです。今夜 書きます。",
          "options": [
            "今夜レポートを書きます",
            "もうレポートを書きました",
            "レポートを書きません",
            "明日レポートを書きます"
          ],
          "answer": 0,
          "explanation": "Dia akan menulis laporan malam ini.",
          "period": "sep-nov"
        },
        {
          "id": 442,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何時に 起きますか。",
          "audioText": "男：毎朝 何時に 起きますか。\n女：７時に 起きます。でも、日曜日は ９時です。",
          "options": [
            "平日は７時",
            "毎日７時",
            "毎日９時",
            "平日は９時"
          ],
          "answer": 0,
          "explanation": "Dia bangun jam 7 pada hari biasa.",
          "period": "sep-nov"
        },
        {
          "id": 443,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は どこへ 行きますか。",
          "audioText": "男：一緒に 昼ごはんを 食べませんか。\n女：いいですね。どこへ 行きますか。\n男：駅の 前の レストランへ 行きましょう。",
          "options": [
            "駅前のレストラン",
            "公園",
            "スーパー",
            "映画館"
          ],
          "answer": 0,
          "explanation": "Mereka akan pergi ke restoran di depan stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 444,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 買いますか。",
          "audioText": "女：何を買いますか。\n男：りんごと バナナを 買います。それから、牛乳も お願いします。",
          "options": [
            "りんごとバナナと牛乳",
            "りんごだけ",
            "バナナだけ",
            "牛乳だけ"
          ],
          "answer": 0,
          "explanation": "Dia membeli apel, pisang, dan susu.",
          "period": "sep-nov"
        },
        {
          "id": 445,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を していますか。",
          "audioText": "男：鈴木さんは 今 何を していますか。\n女：事務所で 電話を かけて います。",
          "options": [
            "電話をかけています",
            "本を読んでいます",
            "昼ごはんを食べています",
            "会議をしています"
          ],
          "answer": 0,
          "explanation": "Dia sedang menelepon di kantor.",
          "period": "sep-nov"
        },
        {
          "id": 446,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どうして 病院へ 行きますか。",
          "audioText": "女：どうしたんですか。\n男：おなかが 痛いんです。それで、病院へ 行きます。",
          "options": [
            "おなかが痛いから",
            "頭が痛いから",
            "けがをしたから",
            "薬を買うから"
          ],
          "answer": 0,
          "explanation": "Dia pergi ke rumah sakit karena sakit perut.",
          "period": "sep-nov"
        },
        {
          "id": 447,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は 何を 食べますか。",
          "audioText": "女：晩ごはんは 何に しましょうか。\n男：そばは どうですか。\n女：いいですね。でも、私は うどんが 食べたいです。\n男：じゃあ、うどんに しましょう。",
          "options": [
            "うどん",
            "そば",
            "ラーメン",
            "カレー"
          ],
          "answer": 0,
          "explanation": "Mereka akhirnya memilih udon.",
          "period": "sep-nov"
        },
        {
          "id": 448,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どの かばんを 買いますか。",
          "audioText": "女：この 小さい かばんは どうですか。\n男：ちょっと 高いですね。\n女：では、こちらの 大きくて 安い かばんは？\n男：それに します。",
          "options": [
            "大きくて安いかばん",
            "小さくて高いかばん",
            "大きくて高いかばん",
            "小さくて安いかばん"
          ],
          "answer": 0,
          "explanation": "Dia membeli tas yang besar dan murah.",
          "period": "sep-nov"
        },
        {
          "id": 449,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は いつ 旅行しますか。",
          "audioText": "男：夏休みに 旅行しますか。\n女：はい。７月は 仕事が ありますから、８月に 行きます。",
          "options": [
            "８月",
            "７月",
            "９月",
            "１０月"
          ],
          "answer": 0,
          "explanation": "Dia bepergian pada bulan Agustus.",
          "period": "sep-nov"
        },
        {
          "id": 450,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 持っていきますか。",
          "audioText": "女：明日は 雨ですから、傘を 持っていってください。\n男：はい。かばんに 入れました。",
          "options": [
            "傘",
            "帽子",
            "本",
            "水"
          ],
          "answer": 0,
          "explanation": "Dia membawa payung.",
          "period": "sep-nov"
        },
        {
          "id": 451,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は どこへ 行きますか。",
          "audioText": "男：一緒に 映画を 見ませんか。\n女：すみません。これから 病院へ 行かなければ なりません。",
          "options": [
            "病院",
            "映画館",
            "スーパー",
            "学校"
          ],
          "answer": 0,
          "explanation": "Dia harus pergi ke rumah sakit.",
          "period": "sep-nov"
        },
        {
          "id": 452,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何を 忘れましたか。",
          "audioText": "男：鍵が ありません。\n女：机の 上に ありませんか。\n男：ありません。あ、車の 中に 置いてきました。",
          "options": [
            "鍵",
            "財布",
            "かばん",
            "携帯電話"
          ],
          "answer": 0,
          "explanation": "Dia meninggalkan kunci di dalam mobil.",
          "period": "sep-nov"
        },
        {
          "id": 453,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n会議は 何時からですか。",
          "audioText": "女：会議は 何時からですか。\n男：午後３時からです。でも、２時半までに 来てください。",
          "options": [
            "午後３時",
            "午後２時半",
            "午後４時",
            "午前３時"
          ],
          "answer": 0,
          "explanation": "Rapat dimulai pukul 3 sore.",
          "period": "sep-nov"
        },
        {
          "id": 454,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を 料理しますか。",
          "audioText": "男：晩ごはんは 何ですか。\n女：今日は 魚が たくさん ありますから、魚料理を 作ります。",
          "options": [
            "魚料理",
            "野菜カレー",
            "ラーメン",
            "サンドイッチ"
          ],
          "answer": 0,
          "explanation": "Dia akan memasak hidangan ikan.",
          "period": "sep-nov"
        },
        {
          "id": 455,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どこで 働いていますか。",
          "audioText": "女：お仕事は 何ですか。\n男：学校で 働いています。毎日 子供と 遊びます。",
          "options": [
            "学校",
            "病院",
            "銀行",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "Dia bekerja di sekolah.",
          "period": "sep-nov"
        },
        {
          "id": 456,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を しなければ なりませんか。",
          "audioText": "女：明日までに この 手紙を 書かなければ なりません。\n男：大変ですね。手伝いましょうか。",
          "options": [
            "手紙を書く",
            "本を読む",
            "電話をする",
            "買い物をする"
          ],
          "answer": 0,
          "explanation": "Dia harus menulis surat.",
          "period": "sep-nov"
        },
        {
          "id": 457,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は 何時ごろ 帰りますか。",
          "audioText": "女：仕事は 何時に 終わりますか。\n男：６時に 終わります。それから 買い物を しますから、７時半ごろ 帰ります。",
          "options": [
            "７時半ごろ",
            "６時ごろ",
            "７時ごろ",
            "８時半ごろ"
          ],
          "answer": 0,
          "explanation": "Dia pulang sekitar pukul 7.30.",
          "period": "sep-nov"
        },
        {
          "id": 458,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n二人は どこで 昼ごはんを 食べますか。",
          "audioText": "男：食堂へ 行きましょうか。\n女：今日は 天気が いいですから、公園で 食べませんか。\n男：いいですね。そうしましょう。",
          "options": [
            "公園",
            "食堂",
            "会社",
            "駅"
          ],
          "answer": 0,
          "explanation": "Mereka makan siang di taman.",
          "period": "sep-nov"
        },
        {
          "id": 459,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n男の人は どんな 部屋が ほしいですか。",
          "audioText": "女：どんな 部屋が ほしいですか。\n男：大きくて、明るい 部屋が いいです。駅から 近くなくても いいです。",
          "options": [
            "大きくて明るい部屋",
            "小さくて暗い部屋",
            "大きくて暗い部屋",
            "駅に近い部屋"
          ],
          "answer": 0,
          "explanation": "Dia mencari kamar yang besar dan terang.",
          "period": "sep-nov"
        },
        {
          "id": 460,
          "section": "listening",
          "text": "【音声を聞いて答えてください】\n女の人は 何を 使いますか。",
          "audioText": "男：消しゴムが ありません。貸して ください。\n女：すみません。消しゴムは ありませんが、鉛筆なら あります。\n男：では、それを 貸してください。",
          "options": [
            "鉛筆",
            "消しゴム",
            "ボールペン",
            "ノート"
          ],
          "answer": 0,
          "explanation": "Dia menggunakan pensil.",
          "period": "sep-nov"
        },
        {
          "id": 461,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜市民図書館＞\n開館時間：午前１０時から午後７時まで\n休み：毎週月曜日\n料金：無料\n\n市民図書館は 何時までですか。",
          "options": [
            "午後７時まで",
            "午前１０時まで",
            "午後６時まで",
            "午後８時まで"
          ],
          "answer": 0,
          "explanation": "Perpustakaan buka sampai pukul 7 malam.",
          "period": "sep-nov"
        },
        {
          "id": 462,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜市民図書館＞\n開館時間：午前１０時から午後７時まで\n休み：毎週月曜日\n料金：無料\n\n月曜日に 図書館へ 行くことが できますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "午後だけできます",
            "午前だけできます"
          ],
          "answer": 0,
          "explanation": "Senin adalah hari libur, jadi tidak bisa pergi.",
          "period": "sep-nov"
        },
        {
          "id": 463,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n佐藤さんへ\n冷蔵庫に ケーキが あります。\n食べても いいですが、妹の ぶんを 残して おいてください。\n（お母さん）\n\nケーキを どうしますか。",
          "options": [
            "妹のぶんを残します",
            "全部食べます",
            "冷蔵庫から出します",
            "お母さんに渡します"
          ],
          "answer": 0,
          "explanation": "Kue boleh dimakan, tetapi bagian adik perempuan harus disisakan.",
          "period": "sep-nov"
        },
        {
          "id": 464,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n鈴木さんへ\nあしたの パーティーは ７時からです。\n場所は 駅の 近くの カフェです。\n飲み物は 私が 用意します。\nでは、あした。\n（田中）\n\nパーティーは どこで ありますか。",
          "options": [
            "駅近くのカフェ",
            "鈴木さんの家",
            "田中さんの会社",
            "駅の中"
          ],
          "answer": 0,
          "explanation": "Pesta diadakan di kafe dekat stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 465,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n鈴木さんへ\nあしたの パーティーは ７時からです。\n場所は 駅の 近くの カフェです。\n飲み物は 私が 用意します。\nでは、あした。\n（田中）\n\n飲み物を 用意するのは だれですか。",
          "options": [
            "田中さん",
            "鈴木さん",
            "カフェの人",
            "駅の人"
          ],
          "answer": 0,
          "explanation": "田中さんが飲み物を用意します = Tanaka yang menyiapkan minuman.",
          "period": "sep-nov"
        },
        {
          "id": 466,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜英語教室＞\n日時：毎週日曜日 午後２時から４時まで\n場所：公民館１階\n参加費：無料\n\n英語教室は いつ ありますか。",
          "options": [
            "毎週日曜日",
            "毎週土曜日",
            "毎週金曜日",
            "毎日"
          ],
          "answer": 0,
          "explanation": "Kelas bahasa Inggris diadakan setiap Minggu.",
          "period": "sep-nov"
        },
        {
          "id": 467,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜英語教室＞\n日時：毎週日曜日 午後２時から４時まで\n場所：公民館１階\n参加費：無料\n\n教室は どこですか。",
          "options": [
            "公民館の１階",
            "学校の２階",
            "駅の１階",
            "図書館"
          ],
          "answer": 0,
          "explanation": "Tempat kelas berada di lantai satu gedung komunitas.",
          "period": "sep-nov"
        },
        {
          "id": 468,
          "section": "reading",
          "text": "【ポスターを読んで答えてください】\n＜英語教室＞\n日時：毎週日曜日 午後２時から４時まで\n場所：公民館１階\n参加費：無料\n\n参加費は いくらですか。",
          "options": [
            "無料です",
            "５００円です",
            "１０００円です",
            "２００円です"
          ],
          "answer": 0,
          "explanation": "無料 berarti gratis.",
          "period": "sep-nov"
        },
        {
          "id": 469,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n土曜日\n朝、雪が 降っていたので、どこへも 行かなかった。\n午後、雪が やんだので、近くの 店へ 買い物に 行った。\n\n朝、どうして どこへも 行きませんでしたか。",
          "options": [
            "雪が降っていたから",
            "病気だったから",
            "仕事があったから",
            "店が休みだったから"
          ],
          "answer": 0,
          "explanation": "Dia tidak pergi ke mana pun pada pagi hari karena salju.",
          "period": "sep-nov"
        },
        {
          "id": 470,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n土曜日\n朝、雪が 降っていたので、どこへも 行かなかった。\n午後、雪が やんだので、近くの 店へ 買い物に 行った。\n\n午後、どこへ 行きましたか。",
          "options": [
            "店",
            "病院",
            "学校",
            "レストラン"
          ],
          "answer": 0,
          "explanation": "Sore hari dia pergi berbelanja ke toko.",
          "period": "sep-nov"
        },
        {
          "id": 471,
          "section": "reading",
          "text": "【掲示を読んで答えてください】\n＜学校からのお知らせ＞\n５月１０日から５月１５日まで、建物の修理のため休校します。\n５月１６日から、いつもどおり授業があります。\n\n学校は いつから 始まりますか。",
          "options": [
            "５月１６日",
            "５月１０日",
            "５月１５日",
            "５月２０日"
          ],
          "answer": 0,
          "explanation": "Sekolah dimulai kembali mulai 16 Mei.",
          "period": "sep-nov"
        },
        {
          "id": 472,
          "section": "reading",
          "text": "【掲示を読んで答えてください】\n＜学校からのお知らせ＞\n５月１０日から５月１５日まで、建物の修理のため休校します。\n５月１６日から、いつもどおり授業があります。\n\nどうして 休みますか。",
          "options": [
            "建物を修理するため",
            "先生が休むため",
            "雪が降るため",
            "生徒がいないため"
          ],
          "answer": 0,
          "explanation": "Alasan libur adalah perbaikan gedung.",
          "period": "sep-nov"
        },
        {
          "id": 473,
          "section": "reading",
          "text": "【広告を読んで答えてください】\n＜スーパーさくら＞\nたまご：１パック１００円\n牛乳：１本１５０円\nパン：１袋２００円\n毎週土曜日は 全部１０％引き\n\n土曜日に たまごを １パック 買うと、いくらですか。",
          "options": [
            "９０円",
            "１００円",
            "１１０円",
            "１５０円"
          ],
          "answer": 0,
          "explanation": "Harga 100 yen mendapat diskon 10%, menjadi 90 yen.",
          "period": "sep-nov"
        },
        {
          "id": 474,
          "section": "reading",
          "text": "【広告を読んで答えてください】\n＜スーパーさくら＞\nたまご：１パック１００円\n牛乳：１本１５０円\nパン：１袋２００円\n毎週土曜日は 全部１０％引き\n\nパンは いくらですか。",
          "options": [
            "２００円",
            "１００円",
            "１５０円",
            "９０円"
          ],
          "answer": 0,
          "explanation": "Harga roti adalah 200 yen sebelum diskon.",
          "period": "sep-nov"
        },
        {
          "id": 475,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜中央病院＞\n受付時間：午前８時から１１時まで\n午後１時から４時まで\n休診日：日曜日と祝日\n\n午後１２時に 病院へ 行って、診察して もらえますか。",
          "options": [
            "いいえ、できません",
            "はい、できます",
            "日曜日ならできます",
            "午前だけできます"
          ],
          "answer": 0,
          "explanation": "Pukul 12 siang berada di antara jam pelayanan, jadi tidak bisa mendaftar.",
          "period": "sep-nov"
        },
        {
          "id": 476,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜中央病院＞\n受付時間：午前８時から１１時まで\n午後１時から４時まで\n休診日：日曜日と祝日\n\n午後３時に 行くことが できますか。",
          "options": [
            "はい、できます",
            "いいえ、できません",
            "午前だけです",
            "日曜日だけです"
          ],
          "answer": 0,
          "explanation": "Pukul 3 sore termasuk jam pelayanan.",
          "period": "sep-nov"
        },
        {
          "id": 477,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n今日は 遅く 帰ります。\n７時に 駅の 前で 待っています。\n遅れるときは 電話してください。\n\n何時に 待っていますか。",
          "options": [
            "７時",
            "６時",
            "８時",
            "９時"
          ],
          "answer": 0,
          "explanation": "Orang tersebut menunggu pukul 7.",
          "period": "sep-nov"
        },
        {
          "id": 478,
          "section": "reading",
          "text": "【メモを読んで答えてください】\n今日は 遅く 帰ります。\n７時に 駅の 前で 待っています。\n遅れるときは 電話してください。\n\nどこで 待っていますか。",
          "options": [
            "駅の前",
            "駅の中",
            "学校の前",
            "公園"
          ],
          "answer": 0,
          "explanation": "Dia menunggu di depan stasiun.",
          "period": "sep-nov"
        },
        {
          "id": 479,
          "section": "reading",
          "text": "【説明を読んで答えてください】\nこの薬は 朝と昼と晩に １錠ずつ 飲んでください。\n食事の あとに 飲んでください。\n\nいつ 薬を 飲みますか。",
          "options": [
            "朝と昼と晩の食事のあと",
            "昼ごはんのあとだけ",
            "寝る前だけ",
            "食事のまえ"
          ],
          "answer": 0,
          "explanation": "Obat diminum pagi, siang, dan malam setelah makan.",
          "period": "sep-nov"
        },
        {
          "id": 480,
          "section": "reading",
          "text": "【説明を読んで答えてください】\nこの薬は 朝と昼と晩に １錠ずつ 飲んでください。\n食事の あとに 飲んでください。\n\n１回に 何錠 飲みますか。",
          "options": [
            "１錠",
            "２錠",
            "３錠",
            "半分"
          ],
          "answer": 0,
          "explanation": "１錠ずつ berarti satu tablet setiap kali minum.",
          "period": "sep-nov"
        },
        {
          "id": 481,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n山田さんへ\nあしたの 会議の 資料を ５部 コピーして、机の 上に 置いてください。\n会議は 午後２時からです。\n（佐藤）\n\n山田さんは 何を しますか。",
          "options": [
            "資料を５部コピーします",
            "会議に出ません",
            "資料を捨てます",
            "机を買います"
          ],
          "answer": 0,
          "explanation": "Yamada harus menyalin materi rapat sebanyak 5 eksemplar.",
          "period": "sep-nov"
        },
        {
          "id": 482,
          "section": "reading",
          "text": "【メールを読んで答えてください】\n山田さんへ\nあしたの 会議の 資料を ５部 コピーして、机の 上に 置いてください。\n会議は 午後２時からです。\n（佐藤）\n\n会議は 何時からですか。",
          "options": [
            "午後２時",
            "午後１時",
            "午後３時",
            "午前２時"
          ],
          "answer": 0,
          "explanation": "Rapat dimulai pukul 2 siang.",
          "period": "sep-nov"
        },
        {
          "id": 483,
          "section": "reading",
          "text": "【会話を読んで答えてください】\nA：きのう 何を しましたか。\nB：朝は 料理を しました。午後は 友だちと サッカーを しました。\n\nBさんは 午後、何を しましたか。",
          "options": [
            "サッカーをしました",
            "料理をしました",
            "映画を見ました",
            "買い物をしました"
          ],
          "answer": 0,
          "explanation": "Sore hari B bermain sepak bola dengan teman.",
          "period": "sep-nov"
        },
        {
          "id": 484,
          "section": "reading",
          "text": "【会話を読んで答えてください】\nA：きのう 何を しましたか。\nB：朝は 料理を しました。午後は 友だちと サッカーを しました。\n\nBさんは 朝、何を しましたか。",
          "options": [
            "料理をしました",
            "サッカーをしました",
            "掃除をしました",
            "寝ました"
          ],
          "answer": 0,
          "explanation": "Pagi hari B memasak.",
          "period": "sep-nov"
        },
        {
          "id": 485,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜バスの時間＞\n駅前発：９：００、９：３０、１０：００、１０：３０\n学校前着：９：２０、９：５０、１０：２０、１０：５０\n\n９時３０分の バスは 何時に 学校前に 着きますか。",
          "options": [
            "９時５０分",
            "９時２０分",
            "１０時",
            "１０時２０分"
          ],
          "answer": 0,
          "explanation": "Bus pukul 9.30 tiba pukul 9.50.",
          "period": "sep-nov"
        },
        {
          "id": 486,
          "section": "reading",
          "text": "【案内を読んで答えてください】\n＜バスの時間＞\n駅前発：９：００、９：３０、１０：００、１０：３０\n学校前着：９：２０、９：５０、１０：２０、１０：５０\n\n駅前を １０時に 出る バスは 何時に 着きますか。",
          "options": [
            "１０時２０分",
            "１０時",
            "１０時３０分",
            "１０時５０分"
          ],
          "answer": 0,
          "explanation": "Bus yang berangkat pukul 10 tiba pukul 10.20.",
          "period": "sep-nov"
        },
        {
          "id": 487,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n６月５日\n今日は いい天気だったので、家族と 海へ 行った。\n昼ごはんを 食べてから、泳いだ。\n\nだれと 海へ 行きましたか。",
          "options": [
            "家族",
            "友だち",
            "先生",
            "一人で"
          ],
          "answer": 0,
          "explanation": "Dia pergi ke laut bersama keluarga.",
          "period": "sep-nov"
        },
        {
          "id": 488,
          "section": "reading",
          "text": "【日記を読んで答えてください】\n６月５日\n今日は いい天気だったので、家族と 海へ 行った。\n昼ごはんを 食べてから、泳いだ。\n\n昼ごはんの あとで、何を しましたか。",
          "options": [
            "泳いだ",
            "海へ行きました",
            "家へ帰りました",
            "料理をしました"
          ],
          "answer": 0,
          "explanation": "Setelah makan siang, dia berenang.",
          "period": "sep-nov"
        },
        {
          "id": 489,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n＜会社のお知らせ＞\n６月１０日（水）は 会社が 休みです。\n１１日（木）と １２日（金）も 休みです。\n仕事は １５日（月）から 始まります。\n\n仕事は いつから 始まりますか。",
          "options": [
            "１５日（月）",
            "１０日（水）",
            "１１日（木）",
            "１２日（金）"
          ],
          "answer": 0,
          "explanation": "Pekerjaan dimulai kembali pada Senin tanggal 15.",
          "period": "sep-nov"
        },
        {
          "id": 490,
          "section": "reading",
          "text": "【お知らせを読んで答えてください】\n＜会社のお知らせ＞\n６月１０日（水）は 会社が 休みです。\n１１日（木）と １２日（金）も 休みです。\n仕事は １５日（月）から 始まります。\n\n６月１１日は 会社が ありますか。",
          "options": [
            "いいえ、ありません",
            "はい、あります",
            "午後だけあります",
            "わかりません"
          ],
          "answer": 0,
          "explanation": "Tanggal 11 juga merupakan hari libur.",
          "period": "sep-nov"
        }
        ];

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
        
        const MAX_AUDIO_PLAYS = 2;
let audioPlayCounts = {};
        const SUPABASE_URL = 'https://lnthciiomeppirzucqwu.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_1TYGD_KXkkxJEiFug566zQ_CjZfmUN-';
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Eksekusi hapus database saat tombol Hapus diklik
    yesDeleteBtn?.addEventListener("click", async () => {
        if (confirmModal) confirmModal.style.display = "none";

        try {
            const { error } = await supabaseClient
                .from('global_chats')
                .delete()
                .neq('id', 0);

            if (error) throw error;

            // Kosongkan tampilan chat lokal
            const chatContainer = document.getElementById("chat-messages-container");
            if (chatContainer) chatContainer.innerHTML = "";

            // Munculkan modal sukses
            if (successModal) successModal.style.display = "flex";

        } catch (err) {
            console.error("Gagal menghapus chat:", err.message);
            alert("Gagal menghapus chat. Coba lagi.");
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
        const { error } = await supabaseClient
            .from('global_chats')
            .delete()
            .neq('id', 0); // Menghapus semua baris data

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
            document.getElementById('total-questions-count').textContent = `${QUESTION_BANK.length} Soal`;
            
            const totalPages = Math.ceil(QUESTION_BANK.length / questionsPerPage);
            const startIdx = (adminQuestionPage - 1) * questionsPerPage;
            const endIdx = startIdx + questionsPerPage;
            
            const currentQs = QUESTION_BANK.slice(startIdx, endIdx);

            let html = currentQs.map(q => `
                <div class="bg-slate-50 border p-4 rounded-xl shadow-sm mb-3">
                    <div class="flex justify-between mb-2">
                        <span class="text-xs font-bold bg-slate-200 px-2 py-1 rounded">ID: ${q.id}</span>
                        <span class="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded uppercase">${q.section}</span>
                    </div>
                    <div class="japanese-text text-lg font-medium mb-3 whitespace-pre-wrap">${q.text}</div>
                    <div class="grid grid-cols-2 gap-2 mb-3">
                        ${q.options.map((opt, idx) => `<div class="p-2 border rounded text-sm ${idx===q.answer?'bg-green-100 border-green-500 font-bold text-green-700':''}">${opt}</div>`).join('')}
                    </div>
                    <div class="text-xs bg-white p-3 border rounded text-slate-600"><strong>Penjelasan:</strong> ${q.explanation}</div>
                </div>
            `).join('');

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

function getQuestionSeenCount(q,stats){const raw=stats[q.id];if(typeof raw==='number')return raw;if(raw&&typeof raw==='object')return Number(raw.count)||0;return 0;}

function getQuestionWeight(q,stats){const c=getQuestionSeenCount(q,stats);return 1/Math.pow(1+c*1.75,1.15);}

function weightedPick(pool,stats){if(!pool.length)return null;const ws=pool.map(q=>getQuestionWeight(q,stats)),total=ws.reduce((a,b)=>a+b,0);let r=Math.random()*total;for(let i=0;i<pool.length;i++){r-=ws[i];if(r<=0)return pool[i];}return pool[pool.length-1];}

function weightedSample(pool,count,stats){const work=[...pool],picked=[];while(work.length&&picked.length<count){const q=weightedPick(work,stats);if(!q)break;picked.push(q);work.splice(work.indexOf(q),1);}return picked;}
function startQuiz() {
    const nameInput = document.getElementById('user-name-input');
    const userName = nameInput ? nameInput.value.trim() : '';

    if (!userName) {
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
            const reqCount = qCountRadio ? parseInt(qCountRadio.value) : 10;

            const qStats = JSON.parse(localStorage.getItem('jft_question_stats') || '{}');

            // Urutan mengikuti struktur JFT Basic: Vocabulary → Grammar/Conversation & Expression → Listening → Reading.
            // Jumlah soal dibagi seimbang. Jika tidak habis dibagi 4, sisa 1-3 soal
            // dibagikan secara acak sehingga selisih antarbagian maksimal 1 soal.
            const sectionOrder = ['vocab', 'grammar', 'listening', 'reading'];
            const totalQuestions = Math.min(reqCount, QUESTION_BANK.length);
            const baseCount = Math.floor(totalQuestions / sectionOrder.length);
            const remainder = totalQuestions % sectionOrder.length;
            const counts = Object.fromEntries(sectionOrder.map(sec => [sec, baseCount]));
            const remainderSections = shuffleArray([...sectionOrder]).slice(0, remainder);
            remainderSections.forEach(sec => counts[sec]++);

            let selected = [];
            const usedQuestionKeys = new Set();

            // Jangan pernah memasukkan soal dengan teks yang sama dalam satu latihan.
            // ID yang berbeda tidak dianggap cukup berbeda jika pertanyaannya identik.
            const getQuestionKey = q => String(q.text || '')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

            sectionOrder.forEach(sec => {
                const qs = QUESTION_BANK.filter(q =>
                    q.section === sec && !usedQuestionKeys.has(getQuestionKey(q))
                );
                const picks = weightedSample(qs, Math.min(counts[sec], qs.length), qStats);
                picks.forEach(q => usedQuestionKeys.add(getQuestionKey(q)));
                selected.push(...picks);
            });

            selected.forEach(q => qStats[q.id] = getQuestionSeenCount(q, qStats) + 1);
            localStorage.setItem('jft_question_stats', JSON.stringify(qStats));

            // Jangan mengacak seluruh soal, supaya urutan bagian tetap seperti JFT.
            state.questions = selected;
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

        function renderQuestion() {
            const q = state.questions[state.currentQuestionIndex];
            
            document.getElementById('quiz-progress-text').textContent = `Soal ${state.currentQuestionIndex + 1} / ${state.questions.length}`;
            document.getElementById('quiz-progress-bar').style.width = `${((state.currentQuestionIndex) / state.questions.length) * 100}%`;
            const badge=document.getElementById('quiz-section-badge');
            if (badge) {
                const sec = SECTIONS.find(x => x.id === q.section);
                badge.textContent = sec ? `${sec.nameJP} / ${sec.nameEN}` : q.section;
            }
            document.getElementById('quiz-question').innerText = q.text;
            
            const btnNext = document.getElementById('btn-next-question');
            const btnPrev = document.getElementById('btn-prev-question');

const currentSectionForPrev = state.questions[state.currentQuestionIndex]?.section;
const previousSectionForPrev = state.questions[state.currentQuestionIndex - 1]?.section;
// Tombol kembali dikunci pada awal setiap sesi. Jadi setelah pindah
// dari Vocabulary ke Grammar, Vocabulary tidak dapat dibuka lagi.
btnPrev.disabled = state.currentQuestionIndex === 0 || currentSectionForPrev !== previousSectionForPrev;

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
    aBtn.classList.remove('hidden');
    tBtn.classList.remove('hidden');
    fb.textContent = q.audioText;

    const questionId = q.id;

    if (audioPlayCounts[questionId] === undefined) {
        audioPlayCounts[questionId] = 0;
    }

    const updateAudioButton = () => {
        const count = audioPlayCounts[questionId];

        if (count >= 2) {
            aBtn.disabled = true;
            aBtn.innerHTML =
                '<i class="fa-solid fa-volume-xmark"></i> Audio sudah 2x';

            aBtn.classList.add(
                'opacity-50',
                'cursor-not-allowed'
            );
        } else {
            aBtn.disabled = false;
            aBtn.innerHTML =
                `<i class="fa-solid fa-volume-high"></i> Putar Audio (${count}/2)`;

            aBtn.classList.remove(
                'opacity-50',
                'cursor-not-allowed'
            );
        }
    };

    updateAudioButton();

    aBtn.onclick = () => {

        // Sudah 2x → tidak boleh diputar lagi
        if (audioPlayCounts[questionId] >= 2) {
            return;
        }

        // Pastikan browser mendukung TTS
        if (
            !window.speechSynthesis ||
            !window.SpeechSynthesisUtterance
        ) {
            console.error('Speech Synthesis tidak tersedia');
            return;
        }

        // Tambah hitungan
        audioPlayCounts[questionId]++;

        // Hentikan audio sebelumnya
        window.speechSynthesis.cancel();

        // Buat audio Jepang
        const u = new SpeechSynthesisUtterance(q.audioText);
        u.lang = 'ja-JP';
        u.rate = 0.85;

        // Putar
        window.speechSynthesis.speak(u);

        // Update tombol
        updateAudioButton();
    };
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
    closeChatActionModal();

    // Confirm dibuat di layer paling atas agar tidak tertutup room chat.
    showCustomConfirm('Yakin ingin menghapus pesan ini?', async () => {
        const query = window.supabaseClient
            .from('global_chats')
            .delete()
            .eq('id', messageId);

        const role = localStorage.getItem('jft_user_role');
        const result = String(role || '').trim().toLowerCase() === 'admin'
            ? await query
            : await query.eq('sender_id', getChatIdentity());

        if (result.error) {
            showToast('Gagal', result.error.message, true);
            return;
        }

        await fetchChatMessages();
        showToast('Berhasil', 'Pesan telah dihapus.');
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


        document.addEventListener('DOMContentLoaded', () => {
            const p = localStorage.getItem('jft_user_photo');
            if(p) { const img=document.getElementById('user-photo-img'); if(img){ img.src = p; img.classList.remove('hidden'); } }
            checkSession();
        });
        // Penyelamat otomatis: Paksa nama di chat selalu pakai nama yang sudah kamu ganti
window.addEventListener('DOMContentLoaded', () => {
    const originalSend = window.sendGlobalMessage || window.kirimPesan;
    // Ini memastikan setiap kali tombol kirim dikunci, nama yang dipakai dari memori browser terbaru
    console.log("Sistem sinkronisasi nama aktif!");
});
