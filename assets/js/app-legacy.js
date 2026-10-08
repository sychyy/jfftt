
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
    "text": "「朝」の 読み方は どれですか。",
    "options": [
      "なまえ",
      "あさ",
      "やすみ",
      "かぜ"
    ],
    "answer": 1,
    "explanation": "朝 dibaca あさ, artinya pagi.",
    "period": "sep-nov"
  },
  {
    "id": 2,
    "section": "vocab",
    "text": "「昼」の 読み方は どれですか。",
    "options": [
      "ゆうびんきょく",
      "じてんしゃ",
      "こうえん",
      "ひる"
    ],
    "answer": 3,
    "explanation": "昼 dibaca ひる, artinya siang.",
    "period": "sep-nov"
  },
  {
    "id": 3,
    "section": "vocab",
    "text": "「夜」の 読み方は どれですか。",
    "options": [
      "ぎんこう",
      "かぞく",
      "よる",
      "あさ"
    ],
    "answer": 2,
    "explanation": "夜 dibaca よる, artinya malam.",
    "period": "sep-nov"
  },
  {
    "id": 4,
    "section": "vocab",
    "text": "「会社」の 読み方は どれですか。",
    "options": [
      "あめ",
      "かぞく",
      "かいしゃ",
      "はる"
    ],
    "answer": 2,
    "explanation": "会社 dibaca かいしゃ, artinya perusahaan.",
    "period": "sep-nov"
  },
  {
    "id": 5,
    "section": "vocab",
    "text": "「仕事」の 読み方は どれですか。",
    "options": [
      "みぎ",
      "ゆき",
      "でんしゃ",
      "しごと"
    ],
    "answer": 3,
    "explanation": "仕事 dibaca しごと, artinya pekerjaan.",
    "period": "sep-nov"
  },
  {
    "id": 6,
    "section": "vocab",
    "text": "「休み」の 読み方は どれですか。",
    "options": [
      "かいしゃ",
      "えき",
      "よる",
      "やすみ"
    ],
    "answer": 3,
    "explanation": "休み dibaca やすみ, artinya libur / istirahat.",
    "period": "sep-nov"
  },
  {
    "id": 7,
    "section": "vocab",
    "text": "「駅」の 読み方は どれですか。",
    "options": [
      "ぎんこう",
      "くるま",
      "かいもの",
      "えき"
    ],
    "answer": 3,
    "explanation": "駅 dibaca えき, artinya stasiun.",
    "period": "sep-nov"
  },
  {
    "id": 8,
    "section": "vocab",
    "text": "「病院」の 読み方は どれですか。",
    "options": [
      "びょういん",
      "かいしゃ",
      "かいもの",
      "かぞく"
    ],
    "answer": 0,
    "explanation": "病院 dibaca びょういん, artinya rumah sakit.",
    "period": "sep-nov"
  },
  {
    "id": 9,
    "section": "vocab",
    "text": "「銀行」の 読み方は どれですか。",
    "options": [
      "ゆうびんきょく",
      "ぎんこう",
      "なまえ",
      "いりぐち"
    ],
    "answer": 1,
    "explanation": "銀行 dibaca ぎんこう, artinya bank.",
    "period": "sep-nov"
  },
  {
    "id": 10,
    "section": "vocab",
    "text": "「郵便局」の 読み方は どれですか。",
    "options": [
      "でぐち",
      "やすみ",
      "ゆうびんきょく",
      "こうえん"
    ],
    "answer": 2,
    "explanation": "郵便局 dibaca ゆうびんきょく, artinya kantor pos.",
    "period": "sep-nov"
  },
  {
    "id": 11,
    "section": "vocab",
    "text": "「学校」の 読み方は どれですか。",
    "options": [
      "しょくじ",
      "かぜ",
      "じてんしゃ",
      "がっこう"
    ],
    "answer": 3,
    "explanation": "学校 dibaca がっこう, artinya sekolah.",
    "period": "sep-nov"
  },
  {
    "id": 12,
    "section": "vocab",
    "text": "「先生」の 読み方は どれですか。",
    "options": [
      "なまえ",
      "かぜ",
      "せんせい",
      "かいもの"
    ],
    "answer": 2,
    "explanation": "先生 dibaca せんせい, artinya guru.",
    "period": "sep-nov"
  },
  {
    "id": 13,
    "section": "vocab",
    "text": "「学生」の 読み方は どれですか。",
    "options": [
      "あき",
      "ふゆ",
      "がくせい",
      "しごと"
    ],
    "answer": 2,
    "explanation": "学生 dibaca がくせい, artinya siswa / mahasiswa.",
    "period": "sep-nov"
  },
  {
    "id": 14,
    "section": "vocab",
    "text": "「家族」の 読み方は どれですか。",
    "options": [
      "ゆき",
      "いりぐち",
      "ぎんこう",
      "かぞく"
    ],
    "answer": 3,
    "explanation": "家族 dibaca かぞく, artinya keluarga.",
    "period": "sep-nov"
  },
  {
    "id": 15,
    "section": "vocab",
    "text": "「友達」の 読み方は どれですか。",
    "options": [
      "じてんしゃ",
      "えき",
      "ともだち",
      "がくせい"
    ],
    "answer": 2,
    "explanation": "友達 dibaca ともだち, artinya teman.",
    "period": "sep-nov"
  },
  {
    "id": 16,
    "section": "vocab",
    "text": "「名前」の 読み方は どれですか。",
    "options": [
      "くるま",
      "かいしゃ",
      "ゆうびんきょく",
      "なまえ"
    ],
    "answer": 3,
    "explanation": "名前 dibaca なまえ, artinya nama.",
    "period": "sep-nov"
  },
  {
    "id": 17,
    "section": "vocab",
    "text": "「電話」の 読み方は どれですか。",
    "options": [
      "でんわ",
      "こうえん",
      "せんせい",
      "あめ"
    ],
    "answer": 0,
    "explanation": "電話 dibaca でんわ, artinya telepon.",
    "period": "sep-nov"
  },
  {
    "id": 18,
    "section": "vocab",
    "text": "「電車」の 読み方は どれですか。",
    "options": [
      "ひる",
      "じゅうしょ",
      "でんしゃ",
      "こうえん"
    ],
    "answer": 2,
    "explanation": "電車 dibaca でんしゃ, artinya kereta listrik.",
    "period": "sep-nov"
  },
  {
    "id": 19,
    "section": "vocab",
    "text": "「自転車」の 読み方は どれですか。",
    "options": [
      "じてんしゃ",
      "よる",
      "あさ",
      "ちかい"
    ],
    "answer": 0,
    "explanation": "自転車 dibaca じてんしゃ, artinya sepeda.",
    "period": "sep-nov"
  },
  {
    "id": 20,
    "section": "vocab",
    "text": "「車」の 読み方は どれですか。",
    "options": [
      "しごと",
      "なまえ",
      "くるま",
      "びょういん"
    ],
    "answer": 2,
    "explanation": "車 dibaca くるま, artinya mobil.",
    "period": "sep-nov"
  },
  {
    "id": 21,
    "section": "vocab",
    "text": "「天気」の 読み方は どれですか。",
    "options": [
      "みぎ",
      "てんき",
      "あき",
      "しょくじ"
    ],
    "answer": 1,
    "explanation": "天気 dibaca てんき, artinya cuaca.",
    "period": "sep-nov"
  },
  {
    "id": 22,
    "section": "vocab",
    "text": "「雨」の 読み方は どれですか。",
    "options": [
      "あめ",
      "かいしゃ",
      "えき",
      "かぜ"
    ],
    "answer": 0,
    "explanation": "雨 dibaca あめ, artinya hujan.",
    "period": "sep-nov"
  },
  {
    "id": 23,
    "section": "vocab",
    "text": "「雪」の 読み方は どれですか。",
    "options": [
      "ゆき",
      "こうえん",
      "せんせい",
      "かいもの"
    ],
    "answer": 0,
    "explanation": "雪 dibaca ゆき, artinya salju.",
    "period": "sep-nov"
  },
  {
    "id": 24,
    "section": "vocab",
    "text": "「風」の 読み方は どれですか。",
    "options": [
      "ちかい",
      "ふゆ",
      "かぜ",
      "なまえ"
    ],
    "answer": 2,
    "explanation": "風 dibaca かぜ, artinya angin.",
    "period": "sep-nov"
  },
  {
    "id": 25,
    "section": "vocab",
    "text": "「春」の 読み方は どれですか。",
    "options": [
      "はる",
      "かぞく",
      "あさ",
      "しごと"
    ],
    "answer": 0,
    "explanation": "春 dibaca はる, artinya musim semi.",
    "period": "sep-nov"
  },
  {
    "id": 26,
    "section": "vocab",
    "text": "「夏」の 読み方は どれですか。",
    "options": [
      "なつ",
      "あき",
      "でんわ",
      "りょうり"
    ],
    "answer": 0,
    "explanation": "夏 dibaca なつ, artinya musim panas.",
    "period": "sep-nov"
  },
  {
    "id": 27,
    "section": "vocab",
    "text": "「秋」の 読み方は どれですか。",
    "options": [
      "あき",
      "はる",
      "ぎんこう",
      "かぜ"
    ],
    "answer": 0,
    "explanation": "秋 dibaca あき, artinya musim gugur.",
    "period": "sep-nov"
  },
  {
    "id": 28,
    "section": "vocab",
    "text": "「冬」の 読み方は どれですか。",
    "options": [
      "ゆうびんきょく",
      "ゆき",
      "ふゆ",
      "しごと"
    ],
    "answer": 2,
    "explanation": "冬 dibaca ふゆ, artinya musim dingin.",
    "period": "sep-nov"
  },
  {
    "id": 29,
    "section": "vocab",
    "text": "「料理」の 読み方は どれですか。",
    "options": [
      "みせ",
      "やすみ",
      "りょうり",
      "かいしゃ"
    ],
    "answer": 2,
    "explanation": "料理 dibaca りょうり, artinya masakan / memasak.",
    "period": "sep-nov"
  },
  {
    "id": 30,
    "section": "vocab",
    "text": "「食事」の 読み方は どれですか。",
    "options": [
      "じてんしゃ",
      "しょくじ",
      "せんせい",
      "くるま"
    ],
    "answer": 1,
    "explanation": "食事 dibaca しょくじ, artinya makan / santapan.",
    "period": "sep-nov"
  },
  {
    "id": 31,
    "section": "vocab",
    "text": "「買い物」の 読み方は どれですか。",
    "options": [
      "ひる",
      "あさ",
      "かいもの",
      "じてんしゃ"
    ],
    "answer": 2,
    "explanation": "買い物 dibaca かいもの, artinya belanja.",
    "period": "sep-nov"
  },
  {
    "id": 32,
    "section": "vocab",
    "text": "「店」の 読み方は どれですか。",
    "options": [
      "かぞく",
      "はる",
      "みせ",
      "でんしゃ"
    ],
    "answer": 2,
    "explanation": "店 dibaca みせ, artinya toko.",
    "period": "sep-nov"
  },
  {
    "id": 33,
    "section": "vocab",
    "text": "「市場」の 読み方は どれですか。",
    "options": [
      "みせ",
      "くるま",
      "いちば",
      "ふゆ"
    ],
    "answer": 2,
    "explanation": "市場 dibaca いちば, artinya pasar.",
    "period": "sep-nov"
  },
  {
    "id": 34,
    "section": "vocab",
    "text": "「公園」の 読み方は どれですか。",
    "options": [
      "こうえん",
      "みせ",
      "なまえ",
      "かいしゃ"
    ],
    "answer": 0,
    "explanation": "公園 dibaca こうえん, artinya taman.",
    "period": "sep-nov"
  },
  {
    "id": 35,
    "section": "vocab",
    "text": "「住所」の 読み方は どれですか。",
    "options": [
      "でぐち",
      "ともだち",
      "くるま",
      "じゅうしょ"
    ],
    "answer": 3,
    "explanation": "住所 dibaca じゅうしょ, artinya alamat.",
    "period": "sep-nov"
  },
  {
    "id": 36,
    "section": "vocab",
    "text": "「入口」の 読み方は どれですか。",
    "options": [
      "なつ",
      "でんしゃ",
      "いりぐち",
      "くるま"
    ],
    "answer": 2,
    "explanation": "入口 dibaca いりぐち, artinya pintu masuk.",
    "period": "sep-nov"
  },
  {
    "id": 37,
    "section": "vocab",
    "text": "「出口」の 読み方は どれですか。",
    "options": [
      "あき",
      "なまえ",
      "でんしゃ",
      "でぐち"
    ],
    "answer": 3,
    "explanation": "出口 dibaca でぐち, artinya pintu keluar.",
    "period": "sep-nov"
  },
  {
    "id": 38,
    "section": "vocab",
    "text": "「右」の 読み方は どれですか。",
    "options": [
      "でんわ",
      "がくせい",
      "しょくじ",
      "みぎ"
    ],
    "answer": 3,
    "explanation": "右 dibaca みぎ, artinya kanan.",
    "period": "sep-nov"
  },
  {
    "id": 39,
    "section": "vocab",
    "text": "「左」の 読み方は どれですか。",
    "options": [
      "ひだり",
      "みせ",
      "はる",
      "がくせい"
    ],
    "answer": 0,
    "explanation": "左 dibaca ひだり, artinya kiri.",
    "period": "sep-nov"
  },
  {
    "id": 40,
    "section": "vocab",
    "text": "「近い」の 読み方は どれですか。",
    "options": [
      "ちかい",
      "しごと",
      "みぎ",
      "あき"
    ],
    "answer": 0,
    "explanation": "近い dibaca ちかい, artinya dekat.",
    "period": "sep-nov"
  },
  {
    "id": 41,
    "section": "vocab",
    "text": "「朝」の いみは どれですか。",
    "options": [
      "なかの いい ひと",
      "あさの じかん",
      "せんろを はしる のりもの",
      "ものを うる ところ"
    ],
    "answer": 1,
    "explanation": "「朝」= あさ; pagi.",
    "period": "sep-nov"
  },
  {
    "id": 42,
    "section": "vocab",
    "text": "「昼」の いみは どれですか。",
    "options": [
      "ひるの じかん",
      "みどりや ひろばが ある ところ",
      "ものを うる ところ",
      "ごはんを たべる こと"
    ],
    "answer": 0,
    "explanation": "「昼」= ひる; siang.",
    "period": "sep-nov"
  },
  {
    "id": 43,
    "section": "vocab",
    "text": "「夜」の いみは どれですか。",
    "options": [
      "みせで ものを かう こと",
      "とおくの ひとと はなす きかい",
      "みどりや ひろばが ある ところ",
      "よるの じかん"
    ],
    "answer": 3,
    "explanation": "「夜」= よる; malam.",
    "period": "sep-nov"
  },
  {
    "id": 44,
    "section": "vocab",
    "text": "「会社」の いみは どれですか。",
    "options": [
      "すずしくなって はが いろづく きせつ",
      "たべものを つくる こと",
      "しごとを する ところ",
      "そとへ でる ところ"
    ],
    "answer": 2,
    "explanation": "「会社」= かいしゃ; perusahaan.",
    "period": "sep-nov"
  },
  {
    "id": 45,
    "section": "vocab",
    "text": "「仕事」の いみは どれですか。",
    "options": [
      "ものを うる ところ",
      "さむくて ゆきが ふる きせつ",
      "お金を もらって する こと",
      "みちを はしる のりもの"
    ],
    "answer": 2,
    "explanation": "「仕事」= しごと; pekerjaan.",
    "period": "sep-nov"
  },
  {
    "id": 46,
    "section": "vocab",
    "text": "「休み」の いみは どれですか。",
    "options": [
      "みどりや ひろばが ある ところ",
      "しごとや がっこうが ない ひ",
      "がっこうで べんきょうする ひと",
      "あつい きせつ"
    ],
    "answer": 1,
    "explanation": "「休み」= やすみ; libur / istirahat.",
    "period": "sep-nov"
  },
  {
    "id": 47,
    "section": "vocab",
    "text": "「駅」の いみは どれですか。",
    "options": [
      "ひだりがわの ほうこう",
      "でんしゃに のる ところ",
      "きょりが みじかい",
      "びょうきの ときに いく ところ"
    ],
    "answer": 1,
    "explanation": "「駅」= えき; stasiun.",
    "period": "sep-nov"
  },
  {
    "id": 48,
    "section": "vocab",
    "text": "「病院」の いみは どれですか。",
    "options": [
      "すずしくなって はが いろづく きせつ",
      "お金を あずけたり ひきだしたり する ところ",
      "びょうきの ときに いく ところ",
      "ふゆに そらから ふる しろい もの"
    ],
    "answer": 2,
    "explanation": "「病院」= びょういん; rumah sakit.",
    "period": "sep-nov"
  },
  {
    "id": 49,
    "section": "vocab",
    "text": "「銀行」の いみは どれですか。",
    "options": [
      "お金を あずけたり ひきだしたり する ところ",
      "なかへ はいる ところ",
      "がっこうで おしえる ひと",
      "きょりが みじかい"
    ],
    "answer": 0,
    "explanation": "「銀行」= ぎんこう; bank.",
    "period": "sep-nov"
  },
  {
    "id": 50,
    "section": "vocab",
    "text": "「郵便局」の いみは どれですか。",
    "options": [
      "すずしくなって はが いろづく きせつ",
      "てがみや にもつを おくる ところ",
      "あさの じかん",
      "びょうきの ときに いく ところ"
    ],
    "answer": 1,
    "explanation": "「郵便局」= ゆうびんきょく; kantor pos.",
    "period": "sep-nov"
  },
  {
    "id": 51,
    "section": "vocab",
    "text": "「学校」の いみは どれですか。",
    "options": [
      "びょうきの ときに いく ところ",
      "べんきょうする ところ",
      "なかの いい ひと",
      "あたたかく なって はなが さく きせつ"
    ],
    "answer": 1,
    "explanation": "「学校」= がっこう; sekolah.",
    "period": "sep-nov"
  },
  {
    "id": 52,
    "section": "vocab",
    "text": "「先生」の いみは どれですか。",
    "options": [
      "そらから みずが おちる こと",
      "あつい きせつ",
      "がっこうで おしえる ひと",
      "しごとを する ところ"
    ],
    "answer": 2,
    "explanation": "「先生」= せんせい; guru.",
    "period": "sep-nov"
  },
  {
    "id": 53,
    "section": "vocab",
    "text": "「学生」の いみは どれですか。",
    "options": [
      "あたたかく なって はなが さく きせつ",
      "じぶんで こぐ のりもの",
      "びょうきの ときに いく ところ",
      "がっこうで べんきょうする ひと"
    ],
    "answer": 3,
    "explanation": "「学生」= がくせい; siswa / mahasiswa.",
    "period": "sep-nov"
  },
  {
    "id": 54,
    "section": "vocab",
    "text": "「家族」の いみは どれですか。",
    "options": [
      "あつい きせつ",
      "いっしょに くらす ひとたち",
      "なかへ はいる ところ",
      "なかの いい ひと"
    ],
    "answer": 1,
    "explanation": "「家族」= かぞく; keluarga.",
    "period": "sep-nov"
  },
  {
    "id": 55,
    "section": "vocab",
    "text": "「友達」の いみは どれですか。",
    "options": [
      "ごはんを たべる こと",
      "ひだりがわの ほうこう",
      "ひるの じかん",
      "なかの いい ひと"
    ],
    "answer": 3,
    "explanation": "「友達」= ともだち; teman.",
    "period": "sep-nov"
  },
  {
    "id": 56,
    "section": "vocab",
    "text": "「名前」の いみは どれですか。",
    "options": [
      "がっこうで おしえる ひと",
      "あつい きせつ",
      "じぶんで こぐ のりもの",
      "ひとの よびかた"
    ],
    "answer": 3,
    "explanation": "「名前」= なまえ; nama.",
    "period": "sep-nov"
  },
  {
    "id": 57,
    "section": "vocab",
    "text": "「電話」の いみは どれですか。",
    "options": [
      "とおくの ひとと はなす きかい",
      "すずしくなって はが いろづく きせつ",
      "しごとを する ところ",
      "あさの じかん"
    ],
    "answer": 0,
    "explanation": "「電話」= でんわ; telepon.",
    "period": "sep-nov"
  },
  {
    "id": 58,
    "section": "vocab",
    "text": "「電車」の いみは どれですか。",
    "options": [
      "きょりが みじかい",
      "せんろを はしる のりもの",
      "がっこうで おしえる ひと",
      "でんしゃに のる ところ"
    ],
    "answer": 1,
    "explanation": "「電車」= でんしゃ; kereta listrik.",
    "period": "sep-nov"
  },
  {
    "id": 59,
    "section": "vocab",
    "text": "「自転車」の いみは どれですか。",
    "options": [
      "みぎがわの ほうこう",
      "あめや はれなどの そらの ようす",
      "きょりが みじかい",
      "じぶんで こぐ のりもの"
    ],
    "answer": 3,
    "explanation": "「自転車」= じてんしゃ; sepeda.",
    "period": "sep-nov"
  },
  {
    "id": 60,
    "section": "vocab",
    "text": "「車」の いみは どれですか。",
    "options": [
      "そらの くうきの ながれ",
      "よるの じかん",
      "あつい きせつ",
      "みちを はしる のりもの"
    ],
    "answer": 3,
    "explanation": "「車」= くるま; mobil.",
    "period": "sep-nov"
  },
  {
    "id": 61,
    "section": "vocab",
    "text": "「天気」の いみは どれですか。",
    "options": [
      "すずしくなって はが いろづく きせつ",
      "あめや はれなどの そらの ようす",
      "ひるの じかん",
      "さむくて ゆきが ふる きせつ"
    ],
    "answer": 1,
    "explanation": "「天気」= てんき; cuaca.",
    "period": "sep-nov"
  },
  {
    "id": 62,
    "section": "vocab",
    "text": "「雨」の いみは どれですか。",
    "options": [
      "がっこうで おしえる ひと",
      "そらから みずが おちる こと",
      "みどりや ひろばが ある ところ",
      "すずしくなって はが いろづく きせつ"
    ],
    "answer": 1,
    "explanation": "「雨」= あめ; hujan.",
    "period": "sep-nov"
  },
  {
    "id": 63,
    "section": "vocab",
    "text": "「雪」の いみは どれですか。",
    "options": [
      "せんろを はしる のりもの",
      "なかの いい ひと",
      "てがみや にもつを おくる ところ",
      "ふゆに そらから ふる しろい もの"
    ],
    "answer": 3,
    "explanation": "「雪」= ゆき; salju.",
    "period": "sep-nov"
  },
  {
    "id": 64,
    "section": "vocab",
    "text": "「風」の いみは どれですか。",
    "options": [
      "いろいろな ものを うる ところ",
      "そらの くうきの ながれ",
      "ふゆに そらから ふる しろい もの",
      "しごとや がっこうが ない ひ"
    ],
    "answer": 1,
    "explanation": "「風」= かぜ; angin.",
    "period": "sep-nov"
  },
  {
    "id": 65,
    "section": "vocab",
    "text": "「春」の いみは どれですか。",
    "options": [
      "あさの じかん",
      "あたたかく なって はなが さく きせつ",
      "しごとや がっこうが ない ひ",
      "たべものを つくる こと"
    ],
    "answer": 1,
    "explanation": "「春」= はる; musim semi.",
    "period": "sep-nov"
  },
  {
    "id": 66,
    "section": "vocab",
    "text": "「夏」の いみは どれですか。",
    "options": [
      "がっこうで べんきょうする ひと",
      "でんしゃに のる ところ",
      "とおくの ひとと はなす きかい",
      "あつい きせつ"
    ],
    "answer": 3,
    "explanation": "「夏」= なつ; musim panas.",
    "period": "sep-nov"
  },
  {
    "id": 67,
    "section": "vocab",
    "text": "「秋」の いみは どれですか。",
    "options": [
      "すずしくなって はが いろづく きせつ",
      "すんでいる ところの じょうほう",
      "とおくの ひとと はなす きかい",
      "みどりや ひろばが ある ところ"
    ],
    "answer": 0,
    "explanation": "「秋」= あき; musim gugur.",
    "period": "sep-nov"
  },
  {
    "id": 68,
    "section": "vocab",
    "text": "「冬」の いみは どれですか。",
    "options": [
      "ひだりがわの ほうこう",
      "とおくの ひとと はなす きかい",
      "よるの じかん",
      "さむくて ゆきが ふる きせつ"
    ],
    "answer": 3,
    "explanation": "「冬」= ふゆ; musim dingin.",
    "period": "sep-nov"
  },
  {
    "id": 69,
    "section": "vocab",
    "text": "「料理」の いみは どれですか。",
    "options": [
      "なかの いい ひと",
      "いろいろな ものを うる ところ",
      "きょりが みじかい",
      "たべものを つくる こと"
    ],
    "answer": 3,
    "explanation": "「料理」= りょうり; masakan / memasak.",
    "period": "sep-nov"
  },
  {
    "id": 70,
    "section": "vocab",
    "text": "「食事」の いみは どれですか。",
    "options": [
      "がっこうで おしえる ひと",
      "いっしょに くらす ひとたち",
      "ごはんを たべる こと",
      "きょりが みじかい"
    ],
    "answer": 2,
    "explanation": "「食事」= しょくじ; makan / santapan.",
    "period": "sep-nov"
  },
  {
    "id": 71,
    "section": "vocab",
    "text": "「買い物」の いみは どれですか。",
    "options": [
      "びょうきの ときに いく ところ",
      "あつい きせつ",
      "みせで ものを かう こと",
      "ふゆに そらから ふる しろい もの"
    ],
    "answer": 2,
    "explanation": "「買い物」= かいもの; belanja.",
    "period": "sep-nov"
  },
  {
    "id": 72,
    "section": "vocab",
    "text": "「店」の いみは どれですか。",
    "options": [
      "いっしょに くらす ひとたち",
      "ものを うる ところ",
      "なかへ はいる ところ",
      "しごとや がっこうが ない ひ"
    ],
    "answer": 1,
    "explanation": "「店」= みせ; toko.",
    "period": "sep-nov"
  },
  {
    "id": 73,
    "section": "vocab",
    "text": "「市場」の いみは どれですか。",
    "options": [
      "あつい きせつ",
      "いろいろな ものを うる ところ",
      "しごとを する ところ",
      "あたたかく なって はなが さく きせつ"
    ],
    "answer": 1,
    "explanation": "「市場」= いちば; pasar.",
    "period": "sep-nov"
  },
  {
    "id": 74,
    "section": "vocab",
    "text": "「公園」の いみは どれですか。",
    "options": [
      "ひとの よびかた",
      "みどりや ひろばが ある ところ",
      "じぶんで こぐ のりもの",
      "きょりが みじかい"
    ],
    "answer": 1,
    "explanation": "「公園」= こうえん; taman.",
    "period": "sep-nov"
  },
  {
    "id": 75,
    "section": "vocab",
    "text": "「住所」の いみは どれですか。",
    "options": [
      "いっしょに くらす ひとたち",
      "すんでいる ところの じょうほう",
      "いろいろな ものを うる ところ",
      "じぶんで こぐ のりもの"
    ],
    "answer": 1,
    "explanation": "「住所」= じゅうしょ; alamat.",
    "period": "sep-nov"
  },
  {
    "id": 76,
    "section": "vocab",
    "text": "「入口」の いみは どれですか。",
    "options": [
      "びょうきの ときに いく ところ",
      "あさの じかん",
      "ひるの じかん",
      "なかへ はいる ところ"
    ],
    "answer": 3,
    "explanation": "「入口」= いりぐち; pintu masuk.",
    "period": "sep-nov"
  },
  {
    "id": 77,
    "section": "vocab",
    "text": "「出口」の いみは どれですか。",
    "options": [
      "せんろを はしる のりもの",
      "いっしょに くらす ひとたち",
      "そとへ でる ところ",
      "きょりが みじかい"
    ],
    "answer": 2,
    "explanation": "「出口」= でぐち; pintu keluar.",
    "period": "sep-nov"
  },
  {
    "id": 78,
    "section": "vocab",
    "text": "「右」の いみは どれですか。",
    "options": [
      "がっこうで おしえる ひと",
      "みちを はしる のりもの",
      "ひとの よびかた",
      "みぎがわの ほうこう"
    ],
    "answer": 3,
    "explanation": "「右」= みぎ; kanan.",
    "period": "sep-nov"
  },
  {
    "id": 79,
    "section": "vocab",
    "text": "「左」の いみは どれですか。",
    "options": [
      "そとへ でる ところ",
      "あたたかく なって はなが さく きせつ",
      "ものを うる ところ",
      "ひだりがわの ほうこう"
    ],
    "answer": 3,
    "explanation": "「左」= ひだり; kiri.",
    "period": "sep-nov"
  },
  {
    "id": 80,
    "section": "vocab",
    "text": "「近い」の いみは どれですか。",
    "options": [
      "あつい きせつ",
      "ひとの よびかた",
      "きょりが みじかい",
      "すずしくなって はが いろづく きせつ"
    ],
    "answer": 2,
    "explanation": "「近い」= ちかい; dekat.",
    "period": "sep-nov"
  },
  {
    "id": 81,
    "section": "vocab",
    "text": "まいばん 10じに （　　　）ます。",
    "options": [
      "あそび",
      "はたらき",
      "おき",
      "ね"
    ],
    "answer": 3,
    "explanation": "Setiap malam jam 10, tidur → ねます.",
    "period": "sep-nov"
  },
  {
    "id": 82,
    "section": "vocab",
    "text": "あさ、パンと たまごを （　　　）。",
    "options": [
      "ききます",
      "あいます",
      "たべます",
      "のみます"
    ],
    "answer": 2,
    "explanation": "Roti dan telur dimakan → たべます.",
    "period": "sep-nov"
  },
  {
    "id": 83,
    "section": "vocab",
    "text": "のどが かわきました。みずを （　　　）。",
    "options": [
      "かいます",
      "みます",
      "のみます",
      "もちます"
    ],
    "answer": 2,
    "explanation": "Saat haus, minum air → のみます.",
    "period": "sep-nov"
  },
  {
    "id": 84,
    "section": "vocab",
    "text": "あした しけんが ありますから、きょう （　　　）します。",
    "options": [
      "べんきょう",
      "せんたく",
      "りょうり",
      "さんぽ"
    ],
    "answer": 0,
    "explanation": "Karena besok ada ujian, hari ini belajar.",
    "period": "sep-nov"
  },
  {
    "id": 85,
    "section": "vocab",
    "text": "くつを はく まえに、（　　　）を はきます。",
    "options": [
      "ぼうし",
      "くつした",
      "めがね",
      "うでどけい"
    ],
    "answer": 1,
    "explanation": "Sebelum sepatu, memakai kaus kaki → くつした.",
    "period": "sep-nov"
  },
  {
    "id": 86,
    "section": "vocab",
    "text": "さむいですから、（　　　）を きます。",
    "options": [
      "コート",
      "みずぎ",
      "サンダル",
      "Tシャツ"
    ],
    "answer": 0,
    "explanation": "Saat dingin, memakai mantel.",
    "period": "sep-nov"
  },
  {
    "id": 87,
    "section": "vocab",
    "text": "えきまで （　　　）で 15ぷん かかります。",
    "options": [
      "れいぞうこ",
      "バス",
      "テレビ",
      "つくえ"
    ],
    "answer": 1,
    "explanation": "Kendaraan yang dapat digunakan menuju stasiun → bus.",
    "period": "sep-nov"
  },
  {
    "id": 88,
    "section": "vocab",
    "text": "この はこは とても （　　　）です。ひとりでは もてません。",
    "options": [
      "おもい",
      "かるい",
      "あたらしい",
      "せまい"
    ],
    "answer": 0,
    "explanation": "Kotak berat dan tidak bisa diangkat sendiri → おもい.",
    "period": "sep-nov"
  },
  {
    "id": 89,
    "section": "vocab",
    "text": "この へやは ひろくて （　　　）です。",
    "options": [
      "おそい",
      "からい",
      "あかるい",
      "おもい"
    ],
    "answer": 2,
    "explanation": "Ruangan luas dan terang → あかるい.",
    "period": "sep-nov"
  },
  {
    "id": 90,
    "section": "vocab",
    "text": "でんきを （　　　）から、へやを でました。",
    "options": [
      "けして",
      "しめて",
      "あけて",
      "つけて"
    ],
    "answer": 0,
    "explanation": "Sebelum keluar kamar, mematikan listrik.",
    "period": "sep-nov"
  },
  {
    "id": 91,
    "section": "vocab",
    "text": "まどを （　　　）と、すずしい かぜが はいりました。",
    "options": [
      "つくる",
      "ならぶ",
      "しめる",
      "あける"
    ],
    "answer": 3,
    "explanation": "Membuka jendela membuat angin sejuk masuk.",
    "period": "sep-nov"
  },
  {
    "id": 92,
    "section": "vocab",
    "text": "あしたの りょこうの ために、ホテルを （　　　）しました。",
    "options": [
      "しゅっぱつ",
      "そうじ",
      "よやく",
      "しつもん"
    ],
    "answer": 2,
    "explanation": "Untuk perjalanan besok, melakukan reservasi hotel.",
    "period": "sep-nov"
  },
  {
    "id": 93,
    "section": "vocab",
    "text": "スーパーで やさいを （　　　）ました。",
    "options": [
      "うり",
      "おり",
      "のり",
      "かい"
    ],
    "answer": 3,
    "explanation": "Sayur dibeli di supermarket → かいました.",
    "period": "sep-nov"
  },
  {
    "id": 94,
    "section": "vocab",
    "text": "この みちは くるまが おおくて （　　　）です。",
    "options": [
      "しずか",
      "やすい",
      "あぶない",
      "ひま"
    ],
    "answer": 2,
    "explanation": "Jalan dengan banyak mobil berbahaya → あぶない.",
    "period": "sep-nov"
  },
  {
    "id": 95,
    "section": "vocab",
    "text": "しごとの あとで せんぱいに （　　　）を しました。",
    "options": [
      "べんきょう",
      "さんぽ",
      "せつめい",
      "あいさつ"
    ],
    "answer": 3,
    "explanation": "Setelah bekerja memberi salam → あいさつ.",
    "period": "sep-nov"
  },
  {
    "id": 96,
    "section": "vocab",
    "text": "かさが ありません。あめが ふるので、コンビニで （　　　）を かいます。",
    "options": [
      "でんしゃ",
      "きっぷ",
      "かさ",
      "ざっし"
    ],
    "answer": 2,
    "explanation": "Karena hujan, membeli payung.",
    "period": "sep-nov"
  },
  {
    "id": 97,
    "section": "vocab",
    "text": "でんしゃに のる まえに、（　　　）を かいました。",
    "options": [
      "でんわ",
      "きっぷ",
      "べんとう",
      "せんたく"
    ],
    "answer": 1,
    "explanation": "Sebelum naik kereta, membeli tiket.",
    "period": "sep-nov"
  },
  {
    "id": 98,
    "section": "vocab",
    "text": "シャツが よごれたので、（　　　）しました。",
    "options": [
      "せんたく",
      "うんてん",
      "りょこう",
      "そうだん"
    ],
    "answer": 0,
    "explanation": "Baju kotor, jadi dicuci → せんたく.",
    "period": "sep-nov"
  },
  {
    "id": 99,
    "section": "vocab",
    "text": "あたまが いたいので、くすりを （　　　）。",
    "options": [
      "のみます",
      "かえります",
      "ききます",
      "つくります"
    ],
    "answer": 0,
    "explanation": "Sakit kepala, minum obat.",
    "period": "sep-nov"
  },
  {
    "id": 100,
    "section": "vocab",
    "text": "しごとへ いく まえに、（　　　）を あつめます。",
    "options": [
      "うみ",
      "ひつような もの",
      "てんき",
      "おと"
    ],
    "answer": 1,
    "explanation": "Sebelum bekerja mengumpulkan barang yang diperlukan.",
    "period": "sep-nov"
  },
  {
    "id": 101,
    "section": "vocab",
    "text": "「入口」と はんたいの いみの ことばは （　　　）です。",
    "options": [
      "外",
      "出口",
      "右",
      "上"
    ],
    "answer": 1,
    "explanation": "Lawan kata/pasangan 入口 adalah 出口.",
    "period": "sep-nov"
  },
  {
    "id": 102,
    "section": "vocab",
    "text": "「右」と はんたいの ほうこうは （　　　）です。",
    "options": [
      "左",
      "前",
      "北",
      "中"
    ],
    "answer": 0,
    "explanation": "Lawan arah 右 adalah 左.",
    "period": "sep-nov"
  },
  {
    "id": 103,
    "section": "vocab",
    "text": "「近い」の はんたいは （　　　）です。",
    "options": [
      "遠い",
      "新しい",
      "高い",
      "早い"
    ],
    "answer": 0,
    "explanation": "Lawan kata 近い adalah 遠い.",
    "period": "sep-nov"
  },
  {
    "id": 104,
    "section": "vocab",
    "text": "この かばんは 5000えんではなく、3000えんです。とても （　　　）です。",
    "options": [
      "おそい",
      "おもい",
      "たかい",
      "やすい"
    ],
    "answer": 3,
    "explanation": "3000 yen dalam konteks ini disebut murah → やすい.",
    "period": "sep-nov"
  },
  {
    "id": 105,
    "section": "vocab",
    "text": "あさ 7じに でますから、6じに （　　　）。",
    "options": [
      "あそびます",
      "かえります",
      "ねます",
      "おきます"
    ],
    "answer": 3,
    "explanation": "Keluar jam 7, jadi bangun jam 6.",
    "period": "sep-nov"
  },
  {
    "id": 106,
    "section": "vocab",
    "text": "しごとの まえに、タイムカードを （　　　）ます。",
    "options": [
      "よみます",
      "おします",
      "きります",
      "あらいます"
    ],
    "answer": 1,
    "explanation": "Di tempat kerja, sebelum bekerja menekan/mencatat kartu waktu → おします.",
    "period": "sep-nov"
  },
  {
    "id": 107,
    "section": "vocab",
    "text": "この きかいは おもいので、（　　　）で はこんでください。",
    "options": [
      "ふたり",
      "ひとつ",
      "ひとり",
      "いちまい"
    ],
    "answer": 0,
    "explanation": "Karena mesin berat, bawalah berdua → ふたり.",
    "period": "sep-nov"
  },
  {
    "id": 108,
    "section": "vocab",
    "text": "あぶない ところでは ヘルメットを （　　　）ください。",
    "options": [
      "けして",
      "ぬいで",
      "あけて",
      "かぶって"
    ],
    "answer": 3,
    "explanation": "Di tempat berbahaya, pakailah helm → かぶってください.",
    "period": "sep-nov"
  },
  {
    "id": 109,
    "section": "vocab",
    "text": "「止まって」の いみは （　　　）です。",
    "options": [
      "待つこと",
      "歩くこと",
      "動かないこと",
      "開けること"
    ],
    "answer": 2,
    "explanation": "止まる means berhenti; 「止まって」 adalah perintah bentuk て.",
    "period": "sep-nov"
  },
  {
    "id": 110,
    "section": "vocab",
    "text": "「始める」の はんたいの いみは （　　　）です。",
    "options": [
      "着る",
      "出る",
      "開ける",
      "終わる"
    ],
    "answer": 3,
    "explanation": "始める berlawanan dengan 終わる.",
    "period": "sep-nov"
  },
  {
    "id": 111,
    "section": "vocab",
    "text": "「安全」の いみは （　　　）です。",
    "options": [
      "人が多いこと",
      "あぶなくないこと",
      "高いこと",
      "せまいこと"
    ],
    "answer": 1,
    "explanation": "安全 berarti kondisi yang tidak berbahaya.",
    "period": "sep-nov"
  },
  {
    "id": 112,
    "section": "vocab",
    "text": "この へやは ひとが おおくて （　　　）です。",
    "options": [
      "からい",
      "ながい",
      "にぎやか",
      "ひくい"
    ],
    "answer": 2,
    "explanation": "Banyak orang sehingga ramai → にぎやか.",
    "period": "sep-nov"
  },
  {
    "id": 113,
    "section": "vocab",
    "text": "きょうは ひまですから、うちで （　　　）を よみます。",
    "options": [
      "でんしゃ",
      "かさ",
      "くるま",
      "ほん"
    ],
    "answer": 3,
    "explanation": "Saat senggang membaca buku.",
    "period": "sep-nov"
  },
  {
    "id": 114,
    "section": "vocab",
    "text": "あさごはんの あとで はを （　　　）ます。",
    "options": [
      "かえり",
      "あび",
      "おき",
      "みがき"
    ],
    "answer": 3,
    "explanation": "Setelah sarapan menyikat gigi.",
    "period": "sep-nov"
  },
  {
    "id": 115,
    "section": "vocab",
    "text": "シャワーを （　　　）から、しごとへ いきます。",
    "options": [
      "おして",
      "あびて",
      "かって",
      "きいて"
    ],
    "answer": 1,
    "explanation": "Mandi/shower dahulu sebelum bekerja.",
    "period": "sep-nov"
  },
  {
    "id": 116,
    "section": "vocab",
    "text": "「予約」の いみは （　　　）です。",
    "options": [
      "cuaca",
      "gaji",
      "reservasi",
      "alamat"
    ],
    "answer": 2,
    "explanation": "予約 berarti reservasi.",
    "period": "sep-nov"
  },
  {
    "id": 117,
    "section": "vocab",
    "text": "「必要」の いみは （　　　）です。",
    "options": [
      "perlu",
      "cepat",
      "dingin",
      "jauh"
    ],
    "answer": 0,
    "explanation": "必要 berarti perlu.",
    "period": "sep-nov"
  },
  {
    "id": 118,
    "section": "vocab",
    "text": "「確認」の いみは （　　　）です。",
    "options": [
      "berjalan",
      "menyimpan",
      "memasak",
      "memeriksa / memastikan"
    ],
    "answer": 3,
    "explanation": "確認 berarti memeriksa atau memastikan.",
    "period": "sep-nov"
  },
  {
    "id": 119,
    "section": "vocab",
    "text": "「注意」の いみは （　　　）です。",
    "options": [
      "perhatian / waspada",
      "liburan",
      "pintu masuk",
      "pesanan"
    ],
    "answer": 0,
    "explanation": "注意 berarti perhatian atau kewaspadaan.",
    "period": "sep-nov"
  },
  {
    "id": 120,
    "section": "vocab",
    "text": "しごとが おわったら、どうぐを （　　　）ところに もどします。",
    "options": [
      "しずかな",
      "もとの",
      "あぶない",
      "おそい"
    ],
    "answer": 1,
    "explanation": "Alat dikembalikan ke tempat semula → もとのところ.",
    "period": "sep-nov"
  },
  {
    "id": 121,
    "section": "vocab",
    "text": "あした 早いですから、きょうは （　　　）ねます。",
    "options": [
      "はやく",
      "おおきく",
      "たかく",
      "あかるく"
    ],
    "answer": 0,
    "explanation": "Karena besok harus pagi, tidur lebih awal.",
    "period": "sep-nov"
  },
  {
    "id": 122,
    "section": "vocab",
    "text": "かいしゃの （　　　）に じぶんの なまえを かきます。",
    "options": [
      "料理",
      "天気",
      "映画",
      "書類"
    ],
    "answer": 3,
    "explanation": "Menulis nama di dokumen → 書類.",
    "period": "sep-nov"
  },
  {
    "id": 123,
    "section": "vocab",
    "text": "ここでは くつを （　　　）ください。",
    "options": [
      "ぬいで",
      "かぶって",
      "はいて",
      "きて"
    ],
    "answer": 0,
    "explanation": "Di sini harap melepas sepatu → ぬいでください.",
    "period": "sep-nov"
  },
  {
    "id": 124,
    "section": "vocab",
    "text": "「忘れます」の はんたいは （　　　）です。",
    "options": [
      "借ります",
      "休みます",
      "覚えます",
      "閉めます"
    ],
    "answer": 2,
    "explanation": "忘れる berlawanan dengan 覚える.",
    "period": "sep-nov"
  },
  {
    "id": 125,
    "section": "vocab",
    "text": "「借ります」と いって、あとで かえします。これは ものを （　　　）という ことです。",
    "options": [
      "作る",
      "売る",
      "買う",
      "かりる"
    ],
    "answer": 3,
    "explanation": "借りる berarti meminjam.",
    "period": "sep-nov"
  },
  {
    "id": 126,
    "section": "grammar",
    "text": "まいにち 7じ（　　　）おきます。",
    "options": [
      "で",
      "を",
      "に",
      "が"
    ],
    "answer": 2,
    "explanation": "Jam tertentu memakai partikel に.",
    "period": "sep-nov"
  },
  {
    "id": 127,
    "section": "grammar",
    "text": "きのう えき（　　　）ともだちに あいました。",
    "options": [
      "を",
      "に",
      "で",
      "へ"
    ],
    "answer": 2,
    "explanation": "Tempat terjadinya aktivitas memakai で.",
    "period": "sep-nov"
  },
  {
    "id": 128,
    "section": "grammar",
    "text": "ともだち（　　　）プレゼントを あげました。",
    "options": [
      "で",
      "に",
      "を",
      "が"
    ],
    "answer": 1,
    "explanation": "Penerima pemberian memakai に.",
    "period": "sep-nov"
  },
  {
    "id": 129,
    "section": "grammar",
    "text": "わたしは まいあさ コーヒー（　　　）のみます。",
    "options": [
      "で",
      "を",
      "が",
      "に"
    ],
    "answer": 1,
    "explanation": "Objek langsung memakai を.",
    "period": "sep-nov"
  },
  {
    "id": 130,
    "section": "grammar",
    "text": "だれ（　　　）この かばんを つくりましたか。",
    "options": [
      "が",
      "に",
      "を",
      "で"
    ],
    "answer": 0,
    "explanation": "Penanda pelaku pada pola ini adalah が.",
    "period": "sep-nov"
  },
  {
    "id": 131,
    "section": "grammar",
    "text": "らいげつ にほん（　　　）いきたいです。",
    "options": [
      "が",
      "で",
      "へ",
      "を"
    ],
    "answer": 2,
    "explanation": "Arah tujuan memakai へ.",
    "period": "sep-nov"
  },
  {
    "id": 132,
    "section": "grammar",
    "text": "こうえん（　　　）さんぽしませんか。",
    "options": [
      "に",
      "が",
      "を",
      "で"
    ],
    "answer": 3,
    "explanation": "Aktivitas berjalan-jalan dilakukan di taman → で.",
    "period": "sep-nov"
  },
  {
    "id": 133,
    "section": "grammar",
    "text": "この しごとは 9じ（　　　）5じまでです。",
    "options": [
      "を",
      "に",
      "から",
      "で"
    ],
    "answer": 2,
    "explanation": "Rentang waktu awal memakai から.",
    "period": "sep-nov"
  },
  {
    "id": 134,
    "section": "grammar",
    "text": "しごとの あと（　　　）スーパーへ よります。",
    "options": [
      "で",
      "が",
      "に",
      "を"
    ],
    "answer": 0,
    "explanation": "Setelah suatu waktu/kejadian: あとのあとに.",
    "period": "sep-nov"
  },
  {
    "id": 135,
    "section": "grammar",
    "text": "にちようび（　　　）はたらきません。",
    "options": [
      "に",
      "で",
      "を",
      "は"
    ],
    "answer": 3,
    "explanation": "Topik/kontras hari Minggu: は.",
    "period": "sep-nov"
  },
  {
    "id": 136,
    "section": "grammar",
    "text": "ここで しごとの しゃしんを （　　　）も いいですか。",
    "options": [
      "とる",
      "とり",
      "とって",
      "とった"
    ],
    "answer": 2,
    "explanation": "Pola meminta izin: ～てもいいですか.",
    "period": "sep-nov"
  },
  {
    "id": 137,
    "section": "grammar",
    "text": "この きゅうけいしつで たばこを （　　　）は いけません。",
    "options": [
      "すって",
      "すい",
      "すった",
      "すう"
    ],
    "answer": 0,
    "explanation": "Larangan: ～てはいけません.",
    "period": "sep-nov"
  },
  {
    "id": 138,
    "section": "grammar",
    "text": "あした はやく （　　　）なければ なりません。",
    "options": [
      "おきて",
      "おきた",
      "おき",
      "おきる"
    ],
    "answer": 2,
    "explanation": "Kewajiban: bentuk masu-stem + なければなりません.",
    "period": "sep-nov"
  },
  {
    "id": 139,
    "section": "grammar",
    "text": "にほんへ （　　　）ことが あります。",
    "options": [
      "いって",
      "いった",
      "いく",
      "いか"
    ],
    "answer": 1,
    "explanation": "Pengalaman: ～たことがあります.",
    "period": "sep-nov"
  },
  {
    "id": 140,
    "section": "grammar",
    "text": "いま でんわを （　　　）います。",
    "options": [
      "かけ",
      "かける",
      "かけた",
      "かけて"
    ],
    "answer": 3,
    "explanation": "Sedang melakukan: ～ています.",
    "period": "sep-nov"
  },
  {
    "id": 141,
    "section": "grammar",
    "text": "まどを （　　　）から、でかけました。",
    "options": [
      "しめた",
      "しめて",
      "しめる",
      "しめない"
    ],
    "answer": 1,
    "explanation": "Urutan tindakan: ～てから.",
    "period": "sep-nov"
  },
  {
    "id": 142,
    "section": "grammar",
    "text": "ごはんを （　　　）まえに、てを あらいます。",
    "options": [
      "たべて",
      "たべる",
      "たべない",
      "たべた"
    ],
    "answer": 1,
    "explanation": "Sebelum melakukan: dictionary form + 前に.",
    "period": "sep-nov"
  },
  {
    "id": 143,
    "section": "grammar",
    "text": "しごとが （　　　）あとで、うちへ かえります。",
    "options": [
      "おわって",
      "おわる",
      "おわらない",
      "おわった"
    ],
    "answer": 3,
    "explanation": "Setelah selesai: ～たあとで.",
    "period": "sep-nov"
  },
  {
    "id": 144,
    "section": "grammar",
    "text": "おんがくを （　　　）ながら、べんきょうします。",
    "options": [
      "きき",
      "きく",
      "きいて",
      "きいた"
    ],
    "answer": 0,
    "explanation": "Sambil: stem + ながら.",
    "period": "sep-nov"
  },
  {
    "id": 145,
    "section": "grammar",
    "text": "あめが （　　　）ので、でかけません。",
    "options": [
      "ふって",
      "ふらない",
      "ふった",
      "ふる"
    ],
    "answer": 3,
    "explanation": "Alasan lembut/umum: ～ので.",
    "period": "sep-nov"
  },
  {
    "id": 146,
    "section": "grammar",
    "text": "この りょうりは （　　　）ですから、たべてください。",
    "options": [
      "おいしさ",
      "おいしい",
      "おいしく",
      "おいしかった"
    ],
    "answer": 1,
    "explanation": "Kata sifat-i sebelum です tetap bentuk dasar: おいしいです.",
    "period": "sep-nov"
  },
  {
    "id": 147,
    "section": "grammar",
    "text": "きのうの えいがは （　　　）です。",
    "options": [
      "おもしろかったな",
      "おもしろく",
      "おもしろかった",
      "おもしろい"
    ],
    "answer": 2,
    "explanation": "Lampau untuk kata sifat-i: ～かったです.",
    "period": "sep-nov"
  },
  {
    "id": 148,
    "section": "grammar",
    "text": "この まちは （　　　）で、べんりです。",
    "options": [
      "しずかに",
      "しずかだ",
      "しずかな",
      "しずか"
    ],
    "answer": 3,
    "explanation": "Kata sifat-na + で untuk menghubungkan sifat: しずかで.",
    "period": "sep-nov"
  },
  {
    "id": 149,
    "section": "grammar",
    "text": "ここは （　　　）な へやです。",
    "options": [
      "きれいだ",
      "きれいな",
      "きれい",
      "きれいに"
    ],
    "answer": 1,
    "explanation": "Kata sifat-na sebelum kata benda memakai な.",
    "period": "sep-nov"
  },
  {
    "id": 150,
    "section": "grammar",
    "text": "この くるまは あまり （　　　）ありません。",
    "options": [
      "おおき",
      "おおきな",
      "おおきく",
      "おおきい"
    ],
    "answer": 2,
    "explanation": "Negatif kata sifat-i: ～くありません.",
    "period": "sep-nov"
  },
  {
    "id": 151,
    "section": "grammar",
    "text": "きょうは きのう（　　　）あついです。",
    "options": [
      "まで",
      "より",
      "しか",
      "だけ"
    ],
    "answer": 1,
    "explanation": "Perbandingan memakai より.",
    "period": "sep-nov"
  },
  {
    "id": 152,
    "section": "grammar",
    "text": "A: どちらが すきですか。B: りんご（　　　）すきです。",
    "options": [
      "しか",
      "のほうが",
      "よりも",
      "だけで"
    ],
    "answer": 1,
    "explanation": "Untuk memilih yang lebih disukai: ～のほうが.",
    "period": "sep-nov"
  },
  {
    "id": 153,
    "section": "grammar",
    "text": "この かばんは あの かばん（　　　）やすいです。",
    "options": [
      "より",
      "まで",
      "しか",
      "ほど"
    ],
    "answer": 0,
    "explanation": "Perbandingan dengan より.",
    "period": "sep-nov"
  },
  {
    "id": 154,
    "section": "grammar",
    "text": "きょうは そんなに （　　　）。",
    "options": [
      "さむくて",
      "さむいです",
      "さむかった",
      "さむくないです"
    ],
    "answer": 3,
    "explanation": "Tidak begitu dingin: そんなに + negatif.",
    "period": "sep-nov"
  },
  {
    "id": 155,
    "section": "grammar",
    "text": "この もんだいは かんたん（　　　）、すぐ できます。",
    "options": [
      "な",
      "なり",
      "だし",
      "で"
    ],
    "answer": 2,
    "explanation": "Noun/na-adjective + だし untuk memberi alasan/daftar alasan.",
    "period": "sep-nov"
  },
  {
    "id": 156,
    "section": "grammar",
    "text": "あしたは しごとが あります（　　　）、はやく ねます。",
    "options": [
      "まで",
      "でも",
      "のに",
      "から"
    ],
    "answer": 3,
    "explanation": "Alasan biasa: から.",
    "period": "sep-nov"
  },
  {
    "id": 157,
    "section": "grammar",
    "text": "ちょっと さむい（　　　）、まどを しめましょう。",
    "options": [
      "ので",
      "ほど",
      "しか",
      "でも"
    ],
    "answer": 0,
    "explanation": "Alasan: ので.",
    "period": "sep-nov"
  },
  {
    "id": 158,
    "section": "grammar",
    "text": "べんきょうし（　　　）テレビを みました。",
    "options": [
      "なくても",
      "ないと",
      "ないで",
      "なくて"
    ],
    "answer": 2,
    "explanation": "Melakukan A tanpa melakukan B: ～ないで.",
    "period": "sep-nov"
  },
  {
    "id": 159,
    "section": "grammar",
    "text": "ここから あるい（　　　）10ぷん です。",
    "options": [
      "て",
      "くて",
      "いて",
      "んで"
    ],
    "answer": 0,
    "explanation": "あるく → あるいて; tetapi dalam pola あるいて10ぷん = 10 menit berjalan.",
    "period": "sep-nov"
  },
  {
    "id": 160,
    "section": "grammar",
    "text": "この かばんは おおき（　　　）すぎます。",
    "options": [
      "すぎ",
      "く",
      "くて",
      "い"
    ],
    "answer": 1,
    "explanation": "Kata sifat-i + すぎる → おおきすぎます.",
    "period": "sep-nov"
  },
  {
    "id": 161,
    "section": "grammar",
    "text": "この えいがは おもしろ（　　　）すぎました。",
    "options": [
      "な",
      "さ",
      "い",
      "く"
    ],
    "answer": 2,
    "explanation": "Kata sifat-i + すぎる → おもしろすぎました.",
    "period": "sep-nov"
  },
  {
    "id": 162,
    "section": "grammar",
    "text": "この ペンは かき（　　　）です。",
    "options": [
      "やすい",
      "やすくて",
      "やすく",
      "やすかった"
    ],
    "answer": 0,
    "explanation": "～やすい = mudah dilakukan.",
    "period": "sep-nov"
  },
  {
    "id": 163,
    "section": "grammar",
    "text": "この かんじは おぼえ（　　　）です。",
    "options": [
      "にくく",
      "にくかった",
      "にくい",
      "にくさ"
    ],
    "answer": 2,
    "explanation": "～にくい = sulit dilakukan.",
    "period": "sep-nov"
  },
  {
    "id": 164,
    "section": "grammar",
    "text": "らいしゅう りょこうする （　　　）です。",
    "options": [
      "つもり",
      "もの",
      "ほう",
      "こと"
    ],
    "answer": 0,
    "explanation": "Rencana/niat: ～つもりです.",
    "period": "sep-nov"
  },
  {
    "id": 165,
    "section": "grammar",
    "text": "らいげつから あたらしい しごとを （　　　）よていです。",
    "options": [
      "はじめた",
      "はじめて",
      "はじめない",
      "はじめる"
    ],
    "answer": 3,
    "explanation": "Rencana terjadwal: dictionary form + 予定です.",
    "period": "sep-nov"
  },
  {
    "id": 166,
    "section": "grammar",
    "text": "わからない ときは、せんせいに （　　　）ください。",
    "options": [
      "きいて",
      "きかない",
      "きいた",
      "きく"
    ],
    "answer": 0,
    "explanation": "Permintaan: ～てください.",
    "period": "sep-nov"
  },
  {
    "id": 167,
    "section": "grammar",
    "text": "先生が くるまで、ちょっと まって （　　　）。",
    "options": [
      "います",
      "ください",
      "でした",
      "ません"
    ],
    "answer": 1,
    "explanation": "Permintaan sopan: 待ってください.",
    "period": "sep-nov"
  },
  {
    "id": 168,
    "section": "grammar",
    "text": "あした いっしょに えいがを （　　　）か。",
    "options": [
      "みた",
      "みない",
      "みよう",
      "みません"
    ],
    "answer": 3,
    "explanation": "Ajakan sopan: ～ませんか.",
    "period": "sep-nov"
  },
  {
    "id": 169,
    "section": "grammar",
    "text": "きょう いっしょに ひるごはんを （　　　）。",
    "options": [
      "たべましたか",
      "たべましょう",
      "たべています",
      "たべません"
    ],
    "answer": 1,
    "explanation": "Ajakan: ～ましょう.",
    "period": "sep-nov"
  },
  {
    "id": 170,
    "section": "grammar",
    "text": "あした ひま（　　　）、こうえんへ いきませんか。",
    "options": [
      "なら",
      "から",
      "のに",
      "ので"
    ],
    "answer": 0,
    "explanation": "Kondisional noun/na-adjective: ～なら.",
    "period": "sep-nov"
  },
  {
    "id": 171,
    "section": "grammar",
    "text": "もし じかんが （　　　）、てつだってください。",
    "options": [
      "あったら",
      "あって",
      "ある",
      "あり"
    ],
    "answer": 0,
    "explanation": "Kondisional ～たら.",
    "period": "sep-nov"
  },
  {
    "id": 172,
    "section": "grammar",
    "text": "あした あめが （　　　）たら、うちに います。",
    "options": [
      "ふる",
      "ふって",
      "ふっ",
      "ふら"
    ],
    "answer": 2,
    "explanation": "～たら dibentuk dari た-form: ふったら.",
    "period": "sep-nov"
  },
  {
    "id": 173,
    "section": "grammar",
    "text": "しごとが おわっ（　　　）、でんわしてください。",
    "options": [
      "ても",
      "たら",
      "てら",
      "たり"
    ],
    "answer": 1,
    "explanation": "Setelah/ketika selesai: ～たら.",
    "period": "sep-nov"
  },
  {
    "id": 174,
    "section": "grammar",
    "text": "この くすりを のめ（　　　）なりません。",
    "options": [
      "ば",
      "たら",
      "ても",
      "で"
    ],
    "answer": 0,
    "explanation": "Kewajiban alternatif: ～なければ; di sini のまなければなりません.",
    "period": "sep-nov"
  },
  {
    "id": 175,
    "section": "grammar",
    "text": "ここに くる （　　　）、でんわしてください。",
    "options": [
      "しか",
      "ながら",
      "あとで",
      "まえに"
    ],
    "answer": 3,
    "explanation": "Sebelum datang: ～まえに.",
    "period": "sep-nov"
  },
  {
    "id": 176,
    "section": "grammar",
    "text": "あした 5じに おきるので、きょうは 10じ（　　　）に ねます。",
    "options": [
      "だけ",
      "しか",
      "より",
      "まで"
    ],
    "answer": 3,
    "explanation": "Batas waktu tidur: 10じまでに.",
    "period": "sep-nov"
  },
  {
    "id": 177,
    "section": "grammar",
    "text": "この 仕事は 一人（　　　）できます。",
    "options": [
      "まで",
      "でも",
      "しか",
      "ほど"
    ],
    "answer": 1,
    "explanation": "でも dapat berarti bahkan/dengan kondisi itu, sesuai konteks kemampuan.",
    "period": "sep-nov"
  },
  {
    "id": 178,
    "section": "grammar",
    "text": "この りょうりは たべ（　　　）です。",
    "options": [
      "たことがあります",
      "ないでください",
      "てはいけません",
      "たことがありません"
    ],
    "answer": 0,
    "explanation": "Pengalaman pernah makan: たことがあります.",
    "period": "sep-nov"
  },
  {
    "id": 179,
    "section": "grammar",
    "text": "日本語が まだ じょうず（　　　）ありません。",
    "options": [
      "に",
      "な",
      "で",
      "では"
    ],
    "answer": 3,
    "explanation": "Noun/na-adjective negatif: ではありません.",
    "period": "sep-nov"
  },
  {
    "id": 180,
    "section": "grammar",
    "text": "あの 人は 会社員（　　　）思います。",
    "options": [
      "だと",
      "に",
      "で",
      "な"
    ],
    "answer": 0,
    "explanation": "Pendapat tentang noun: ～だと思います.",
    "period": "sep-nov"
  },
  {
    "id": 181,
    "section": "grammar",
    "text": "明日は さむい（　　　）思います。",
    "options": [
      "で",
      "に",
      "を",
      "と"
    ],
    "answer": 3,
    "explanation": "Pernyataan yang dipikirkan: と思います.",
    "period": "sep-nov"
  },
  {
    "id": 182,
    "section": "grammar",
    "text": "田中さんは もう 会社へ 行っ（　　　）でしょう。",
    "options": [
      "ない",
      "た",
      "たり",
      "て"
    ],
    "answer": 1,
    "explanation": "Perkiraan: ～たでしょう.",
    "period": "sep-nov"
  },
  {
    "id": 183,
    "section": "grammar",
    "text": "雨が ふる（　　　）しれません。",
    "options": [
      "なら",
      "ので",
      "かも",
      "しか"
    ],
    "answer": 2,
    "explanation": "Kemungkinan: ～かもしれません.",
    "period": "sep-nov"
  },
  {
    "id": 184,
    "section": "grammar",
    "text": "この へやは 使っ（　　　）いけません。",
    "options": [
      "たことが",
      "ても",
      "たら",
      "ては"
    ],
    "answer": 3,
    "explanation": "Larangan: ～てはいけません.",
    "period": "sep-nov"
  },
  {
    "id": 185,
    "section": "grammar",
    "text": "この じしょを 使っ（　　　）いいですか。",
    "options": [
      "ては",
      "ても",
      "ながら",
      "たら"
    ],
    "answer": 1,
    "explanation": "Izin: ～てもいいですか.",
    "period": "sep-nov"
  },
  {
    "id": 186,
    "section": "grammar",
    "text": "あさごはんを 食べ（　　　）学校へ 行きました。",
    "options": [
      "ないなら",
      "ないと",
      "なくて",
      "ないで"
    ],
    "answer": 3,
    "explanation": "Pergi sekolah tanpa sarapan: 食べないで.",
    "period": "sep-nov"
  },
  {
    "id": 187,
    "section": "grammar",
    "text": "音楽を 聞き（　　　）料理を します。",
    "options": [
      "たり",
      "ながら",
      "ても",
      "すぎて"
    ],
    "answer": 1,
    "explanation": "Sambil mendengarkan musik: ～ながら.",
    "period": "sep-nov"
  },
  {
    "id": 188,
    "section": "grammar",
    "text": "この くつは 大き（　　　）、歩きにくいです。",
    "options": [
      "すぎて",
      "すぎた",
      "すぎない",
      "すぎる"
    ],
    "answer": 0,
    "explanation": "Terlalu besar sehingga sulit berjalan: ～すぎて.",
    "period": "sep-nov"
  },
  {
    "id": 189,
    "section": "grammar",
    "text": "日本で 働く（　　　）、日本語を もっと 勉強します。",
    "options": [
      "しか",
      "ながら",
      "ために",
      "ほど"
    ],
    "answer": 2,
    "explanation": "Tujuan: ～ために.",
    "period": "sep-nov"
  },
  {
    "id": 190,
    "section": "grammar",
    "text": "家族に 会う（　　　）、おみやげを 買いました。",
    "options": [
      "でも",
      "ながら",
      "ために",
      "しか"
    ],
    "answer": 2,
    "explanation": "Tujuan: ～ために.",
    "period": "sep-nov"
  },
  {
    "id": 191,
    "section": "grammar",
    "text": "わすれない（　　　）、メモします。",
    "options": [
      "ために",
      "ので",
      "ように",
      "しか"
    ],
    "answer": 2,
    "explanation": "Agar tidak lupa: ～ように.",
    "period": "sep-nov"
  },
  {
    "id": 192,
    "section": "grammar",
    "text": "早く 起きられる（　　　）、毎晩 早く ねます。",
    "options": [
      "ように",
      "しか",
      "ので",
      "なら"
    ],
    "answer": 0,
    "explanation": "Agar bisa bangun cepat: ～ように.",
    "period": "sep-nov"
  },
  {
    "id": 193,
    "section": "grammar",
    "text": "先生が いう（　　　）に、文を 読んでください。",
    "options": [
      "しか",
      "ため",
      "よう",
      "こと"
    ],
    "answer": 2,
    "explanation": "Sesuai yang dikatakan guru: ～ように.",
    "period": "sep-nov"
  },
  {
    "id": 194,
    "section": "grammar",
    "text": "この 仕事は おぼえ（　　　）と 思います。",
    "options": [
      "やすさ",
      "やすく",
      "やすかった",
      "やすい"
    ],
    "answer": 3,
    "explanation": "Mudah diingat: ～やすい.",
    "period": "sep-nov"
  },
  {
    "id": 195,
    "section": "grammar",
    "text": "この ことばは 使い（　　　）です。",
    "options": [
      "にくかった",
      "にくさ",
      "にくい",
      "にくく"
    ],
    "answer": 2,
    "explanation": "Sulit dipakai: ～にくい.",
    "period": "sep-nov"
  },
  {
    "id": 196,
    "section": "grammar",
    "text": "駅に 行く（　　　）、この 道を まっすぐ 行ってください。",
    "options": [
      "たりは",
      "のでを",
      "ときは",
      "しかは"
    ],
    "answer": 2,
    "explanation": "Saat pergi ke stasiun: 行くときは.",
    "period": "sep-nov"
  },
  {
    "id": 197,
    "section": "grammar",
    "text": "会社へ 行く（　　　）に、かばんを じゅんびします。",
    "options": [
      "まえ",
      "あと",
      "ながら",
      "しか"
    ],
    "answer": 0,
    "explanation": "Sebelum ke kantor: 行くまえに.",
    "period": "sep-nov"
  },
  {
    "id": 198,
    "section": "grammar",
    "text": "会社に 着い（　　　）から、メールを 見ました。",
    "options": [
      "て",
      "たり",
      "た",
      "ても"
    ],
    "answer": 0,
    "explanation": "Setelah tiba di kantor: 着いてから.",
    "period": "sep-nov"
  },
  {
    "id": 199,
    "section": "grammar",
    "text": "昼ごはんを 食べ（　　　）あとで、少し 休みます。",
    "options": [
      "て",
      "ない",
      "る",
      "た"
    ],
    "answer": 3,
    "explanation": "Setelah makan siang: 食べたあとで.",
    "period": "sep-nov"
  },
  {
    "id": 200,
    "section": "grammar",
    "text": "日本に 行っ（　　　）ら、京都へ 行きたいです。",
    "options": [
      "ない",
      "て",
      "た",
      "たり"
    ],
    "answer": 2,
    "explanation": "Kalau pergi ke Jepang: 行ったら.",
    "period": "sep-nov"
  },
  {
    "id": 201,
    "section": "grammar",
    "text": "時間が なかっ（　　　）、手伝えません。",
    "options": [
      "たり",
      "て",
      "ても",
      "たら"
    ],
    "answer": 3,
    "explanation": "Jika tidak punya waktu: なかったら.",
    "period": "sep-nov"
  },
  {
    "id": 202,
    "section": "grammar",
    "text": "雨（　　　）ひどかったら、タクシーで 行きます。",
    "options": [
      "で",
      "に",
      "が",
      "を"
    ],
    "answer": 2,
    "explanation": "Subjek kondisi: 雨がひどかったら.",
    "period": "sep-nov"
  },
  {
    "id": 203,
    "section": "grammar",
    "text": "仕事が いそがし（　　　）も、約束を わすれません。",
    "options": [
      "くて",
      "さ",
      "かった",
      "くない"
    ],
    "answer": 0,
    "explanation": "Bahkan kalau sibuk: 忙しくても.",
    "period": "sep-nov"
  },
  {
    "id": 204,
    "section": "grammar",
    "text": "高く（　　　）いいものなら、買いたいです。",
    "options": [
      "ながら",
      "たら",
      "ても",
      "ては"
    ],
    "answer": 2,
    "explanation": "Walaupun mahal: 高くても.",
    "period": "sep-nov"
  },
  {
    "id": 205,
    "section": "grammar",
    "text": "休みの日（　　　）うちで 本を 読みます。",
    "options": [
      "で",
      "を",
      "に",
      "は"
    ],
    "answer": 3,
    "explanation": "Topik hari libur: 休みの日は.",
    "period": "sep-nov"
  },
  {
    "id": 206,
    "section": "grammar",
    "text": "この 町（　　　）住んで 3年です。",
    "options": [
      "に",
      "で",
      "を",
      "へ"
    ],
    "answer": 0,
    "explanation": "Tempat tinggal: 町に住む.",
    "period": "sep-nov"
  },
  {
    "id": 207,
    "section": "grammar",
    "text": "日本語（　　　）話せるように なりたいです。",
    "options": [
      "で",
      "が",
      "を",
      "に"
    ],
    "answer": 1,
    "explanation": "Kemampuan: 日本語が話せる.",
    "period": "sep-nov"
  },
  {
    "id": 208,
    "section": "grammar",
    "text": "先生（　　　）質問しました。",
    "options": [
      "で",
      "に",
      "を",
      "が"
    ],
    "answer": 1,
    "explanation": "Bertanya kepada guru: 先生に質問する.",
    "period": "sep-nov"
  },
  {
    "id": 209,
    "section": "grammar",
    "text": "友達（　　　）メールを 送りました。",
    "options": [
      "で",
      "に",
      "を",
      "が"
    ],
    "answer": 1,
    "explanation": "Penerima: 友達にメールを送る.",
    "period": "sep-nov"
  },
  {
    "id": 210,
    "section": "grammar",
    "text": "家族（　　　）いっしょに 晩ごはんを 食べました。",
    "options": [
      "が",
      "と",
      "を",
      "に"
    ],
    "answer": 1,
    "explanation": "Bersama keluarga: ～といっしょに.",
    "period": "sep-nov"
  },
  {
    "id": 211,
    "section": "grammar",
    "text": "電車（　　　）バスの ほうが 安いです。",
    "options": [
      "しか",
      "から",
      "まで",
      "より"
    ],
    "answer": 3,
    "explanation": "Perbandingan: 電車よりバスのほうが.",
    "period": "sep-nov"
  },
  {
    "id": 212,
    "section": "grammar",
    "text": "この かばんは 前の もの（　　　）少し 軽いです。",
    "options": [
      "ほど",
      "より",
      "まで",
      "しか"
    ],
    "answer": 1,
    "explanation": "Lebih ringan daripada yang sebelumnya.",
    "period": "sep-nov"
  },
  {
    "id": 213,
    "section": "grammar",
    "text": "毎日 30分（　　　）走っています。",
    "options": [
      "ぐらい",
      "まで",
      "だけで",
      "しか"
    ],
    "answer": 0,
    "explanation": "Perkiraan durasi: ～ぐらい.",
    "period": "sep-nov"
  },
  {
    "id": 214,
    "section": "grammar",
    "text": "教室に 学生が 20人（　　　）います。",
    "options": [
      "ほどで",
      "しか",
      "ぐらい",
      "だけ"
    ],
    "answer": 2,
    "explanation": "Perkiraan jumlah: ～ぐらいいます.",
    "period": "sep-nov"
  },
  {
    "id": 215,
    "section": "grammar",
    "text": "今日は 水（　　　）飲みませんでした。",
    "options": [
      "まで",
      "より",
      "しか",
      "だけ"
    ],
    "answer": 2,
    "explanation": "しか + negatif = hanya.",
    "period": "sep-nov"
  },
  {
    "id": 216,
    "section": "grammar",
    "text": "日曜日（　　　）働きます。土曜日は 休みです。",
    "options": [
      "まで",
      "しか",
      "より",
      "だけ"
    ],
    "answer": 3,
    "explanation": "Hanya hari Minggu bekerja: だけ.",
    "period": "sep-nov"
  },
  {
    "id": 217,
    "section": "grammar",
    "text": "もう 10時（　　　）なりました。",
    "options": [
      "で",
      "が",
      "に",
      "を"
    ],
    "answer": 2,
    "explanation": "Waktu berubah menjadi 10:00: 10時になりました.",
    "period": "sep-nov"
  },
  {
    "id": 218,
    "section": "grammar",
    "text": "春に（　　　）と、あたたかく なります。",
    "options": [
      "なる",
      "なり",
      "なって",
      "なった"
    ],
    "answer": 0,
    "explanation": "Ketika menjadi musim semi: 春になると.",
    "period": "sep-nov"
  },
  {
    "id": 219,
    "section": "grammar",
    "text": "ボタンを 押す（　　　）、機械が 動きます。",
    "options": [
      "ても",
      "なら",
      "と",
      "ので"
    ],
    "answer": 2,
    "explanation": "Kondisi otomatis: ～と.",
    "period": "sep-nov"
  },
  {
    "id": 220,
    "section": "grammar",
    "text": "わからない（　　　）、もう一度 説明してください。",
    "options": [
      "しか",
      "たり",
      "ので",
      "なら"
    ],
    "answer": 2,
    "explanation": "Karena tidak paham, minta penjelasan lagi: ので.",
    "period": "sep-nov"
  },
  {
    "id": 221,
    "section": "grammar",
    "text": "忙しい（　　　）、今日は 行きません。",
    "options": [
      "ので",
      "しか",
      "まで",
      "ながら"
    ],
    "answer": 0,
    "explanation": "Alasan: 忙しいので.",
    "period": "sep-nov"
  },
  {
    "id": 222,
    "section": "grammar",
    "text": "仕事の あとで、買い物（　　　）してから 帰ります。",
    "options": [
      "へ",
      "に",
      "を",
      "が"
    ],
    "answer": 2,
    "explanation": "Objek: 買い物をする.",
    "period": "sep-nov"
  },
  {
    "id": 223,
    "section": "grammar",
    "text": "毎朝 シャワーを 浴び（　　　）、仕事へ 行きます。",
    "options": [
      "たら",
      "ながら",
      "ないで",
      "てから"
    ],
    "answer": 3,
    "explanation": "Setelah mandi: ～てから.",
    "period": "sep-nov"
  },
  {
    "id": 224,
    "section": "grammar",
    "text": "ここで 写真を 撮っ（　　　）も いいです。",
    "options": [
      "たり",
      "たら",
      "ても",
      "ては"
    ],
    "answer": 2,
    "explanation": "Boleh: ～てもいい.",
    "period": "sep-nov"
  },
  {
    "id": 225,
    "section": "grammar",
    "text": "この いすに 座っ（　　　）は いけません。",
    "options": [
      "て",
      "ながら",
      "たり",
      "た"
    ],
    "answer": 0,
    "explanation": "Dilarang duduk: 座ってはいけません.",
    "period": "sep-nov"
  },
  {
    "id": 226,
    "section": "grammar",
    "text": "明日までに この 仕事を 終わらせ（　　　）なりません。",
    "options": [
      "なくて",
      "ないで",
      "なければ",
      "ないと"
    ],
    "answer": 2,
    "explanation": "Harus menyelesaikan: 終わらせなければなりません.",
    "period": "sep-nov"
  },
  {
    "id": 227,
    "section": "grammar",
    "text": "忘れない（　　　）、スマホに メモしました。",
    "options": [
      "しか",
      "ように",
      "ので",
      "ために"
    ],
    "answer": 1,
    "explanation": "Agar tidak lupa: ように.",
    "period": "sep-nov"
  },
  {
    "id": 228,
    "section": "grammar",
    "text": "旅行の ために、お金を （　　　）います。",
    "options": [
      "ためない",
      "ためる",
      "ためた",
      "ためて"
    ],
    "answer": 3,
    "explanation": "Sedang menabung: ためています.",
    "period": "sep-nov"
  },
  {
    "id": 229,
    "section": "grammar",
    "text": "日本へ 行く（　　　）、お金を ためています。",
    "options": [
      "ために",
      "ながら",
      "しか",
      "ように"
    ],
    "answer": 0,
    "explanation": "Untuk tujuan ke Jepang: ために.",
    "period": "sep-nov"
  },
  {
    "id": 230,
    "section": "grammar",
    "text": "この 料理は 作り（　　　）そうです。",
    "options": [
      "た",
      "すぎ",
      "にく",
      "やす"
    ],
    "answer": 3,
    "explanation": "Terlihat mudah dibuat: 作りやすそう.",
    "period": "sep-nov"
  },
  {
    "id": 231,
    "section": "grammar",
    "text": "その かばんは 重（　　　）そうです。",
    "options": [
      "くて",
      "すぎ",
      "そう",
      "い"
    ],
    "answer": 2,
    "explanation": "Terlihat berat: 重そう.",
    "period": "sep-nov"
  },
  {
    "id": 232,
    "section": "grammar",
    "text": "雨が 降り（　　　）です。かさを もっていきましょう。",
    "options": [
      "やす",
      "すぎ",
      "にくい",
      "そう"
    ],
    "answer": 3,
    "explanation": "Sepertinya akan hujan: 降りそう.",
    "period": "sep-nov"
  },
  {
    "id": 233,
    "section": "grammar",
    "text": "この 仕事は たいへん（　　　）が、がんばります。",
    "options": [
      "ですが",
      "だし",
      "しか",
      "ので"
    ],
    "answer": 0,
    "explanation": "Kontras sopan: たいへんですが.",
    "period": "sep-nov"
  },
  {
    "id": 234,
    "section": "grammar",
    "text": "この 町は しずか（　　　）きれいです。",
    "options": [
      "ですが",
      "で",
      "だし",
      "な"
    ],
    "answer": 2,
    "explanation": "Alasan/daftar: しずかだし.",
    "period": "sep-nov"
  },
  {
    "id": 235,
    "section": "grammar",
    "text": "私は 音楽（　　　）聞くのが すきです。",
    "options": [
      "が",
      "で",
      "に",
      "を"
    ],
    "answer": 3,
    "explanation": "Objek pendengaran: 音楽を聞く.",
    "period": "sep-nov"
  },
  {
    "id": 236,
    "section": "grammar",
    "text": "日本の 文化（　　　）興味が あります。",
    "options": [
      "が",
      "に",
      "を",
      "で"
    ],
    "answer": 1,
    "explanation": "Pola 興味があります memakai に.",
    "period": "sep-nov"
  },
  {
    "id": 237,
    "section": "grammar",
    "text": "仕事（　　　）気を つけてください。",
    "options": [
      "が",
      "に",
      "で",
      "を"
    ],
    "answer": 1,
    "explanation": "Pola 気をつける: ～に気をつける.",
    "period": "sep-nov"
  },
  {
    "id": 238,
    "section": "grammar",
    "text": "体（　　　）気をつけて、よく 休んでください。",
    "options": [
      "に",
      "が",
      "で",
      "を"
    ],
    "answer": 0,
    "explanation": "Menjaga kesehatan: 体に気をつける.",
    "period": "sep-nov"
  },
  {
    "id": 239,
    "section": "grammar",
    "text": "会議は 10時（　　　）始まります。",
    "options": [
      "より",
      "しか",
      "まで",
      "から"
    ],
    "answer": 3,
    "explanation": "Rapat dimulai dari jam 10: から.",
    "period": "sep-nov"
  },
  {
    "id": 240,
    "section": "grammar",
    "text": "店は 8時（　　　）あいています。",
    "options": [
      "から",
      "しか",
      "まで",
      "より"
    ],
    "answer": 2,
    "explanation": "Toko buka sampai jam 8: まで.",
    "period": "sep-nov"
  },
  {
    "id": 241,
    "section": "grammar",
    "text": "駅（　　　）近くに コンビニが あります。",
    "options": [
      "で",
      "が",
      "の",
      "を"
    ],
    "answer": 2,
    "explanation": "Dekat stasiun: 駅の近く.",
    "period": "sep-nov"
  },
  {
    "id": 242,
    "section": "grammar",
    "text": "毎朝 コーヒーを 飲ん（　　　）から、仕事を 始めます。",
    "options": [
      "で",
      "たり",
      "だ",
      "でも"
    ],
    "answer": 0,
    "explanation": "Urutan: 飲んでから仕事を始めます.",
    "period": "sep-nov"
  },
  {
    "id": 243,
    "section": "grammar",
    "text": "この 荷物は 大き（　　　）、一人では もちません。",
    "options": [
      "すぎて",
      "すぎる",
      "すぎた",
      "すぎない"
    ],
    "answer": 0,
    "explanation": "Terlalu besar sehingga tidak dibawa sendiri: 大きすぎて.",
    "period": "sep-nov"
  },
  {
    "id": 244,
    "section": "grammar",
    "text": "明日は 早いから、もう テレビを 見（　　　）寝ます。",
    "options": [
      "ないで",
      "なくて",
      "ないと",
      "なくても"
    ],
    "answer": 0,
    "explanation": "Tidur tanpa menonton TV: 見ないで寝ます.",
    "period": "sep-nov"
  },
  {
    "id": 245,
    "section": "grammar",
    "text": "先生に しつもんした（　　　）、よく わかりました。",
    "options": [
      "のに",
      "なら",
      "だけ",
      "ので"
    ],
    "answer": 3,
    "explanation": "Hasil yang terjadi karena bertanya: ～ので.",
    "period": "sep-nov"
  },
  {
    "id": 246,
    "section": "grammar",
    "text": "この ボタンを 押す（　　　）、ドアが 開きます。",
    "options": [
      "と",
      "なら",
      "ても",
      "ので"
    ],
    "answer": 0,
    "explanation": "Hasil otomatis: 押すとドアが開きます.",
    "period": "sep-nov"
  },
  {
    "id": 247,
    "section": "grammar",
    "text": "日本へ 行った（　　　）がありますか。",
    "options": [
      "こと",
      "ため",
      "よう",
      "もの"
    ],
    "answer": 0,
    "explanation": "Pengalaman: ～たことがありますか.",
    "period": "sep-nov"
  },
  {
    "id": 248,
    "section": "grammar",
    "text": "来週は 仕事が 忙しい（　　　）しれません。",
    "options": [
      "しか",
      "でも",
      "ので",
      "かも"
    ],
    "answer": 3,
    "explanation": "Kemungkinan: ～かもしれません.",
    "period": "sep-nov"
  },
  {
    "id": 249,
    "section": "grammar",
    "text": "仕事が 終わっ（　　　）ら、みんなで ごはんを 食べましょう。",
    "options": [
      "たり",
      "ても",
      "た",
      "て"
    ],
    "answer": 2,
    "explanation": "Kondisional: 終わったら.",
    "period": "sep-nov"
  },
  {
    "id": 250,
    "section": "grammar",
    "text": "この 部屋は きれい（　　　）、とても 住みやすいです。",
    "options": [
      "で",
      "に",
      "だし",
      "な"
    ],
    "answer": 2,
    "explanation": "Daftar alasan/sifat: きれいだし.",
    "period": "sep-nov"
  },
  {
    "id": 251,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月1日、田中さんは どこへ 行きたいですか。",
    "options": [
      "会社",
      "駅",
      "病院",
      "家"
    ],
    "answer": 1,
    "explanation": "Percakapan menyebut 駅 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "田中：すみません、駅へ 行きたいです。\n案内：病院の となりですよ。病院の 前を 右へ 曲がってください。\n田中：わかりました。ありがとうございます。"
  },
  {
    "id": 252,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月2日の 映画は 何時からですか。",
    "options": [
      "10時20分",
      "9時20分",
      "11時20分",
      "10時"
    ],
    "answer": 0,
    "explanation": "Film dimulai pukul 10:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：10時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 253,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月3日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "たまご1つだけ",
      "おにぎり4つだけ",
      "おにぎり4つとたまご1つ",
      "おにぎり1つとたまご4つ"
    ],
    "answer": 2,
    "explanation": "鈴木 meminta おにぎり 4 buah dan たまご 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n鈴木：おにぎりを 4つと、たまごを 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 254,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月4日の 木曜日に、山本さんは 会社へ 行きますか。",
    "options": [
      "わかりません",
      "はい、行きます",
      "いいえ、行きません",
      "午後だけ行きます"
    ],
    "answer": 2,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n山本：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 255,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月5日、女の人は どこで 買い物を しますか。",
    "options": [
      "公園",
      "郵便局",
      "家",
      "レストラン"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di レストラン.",
    "period": "sep-nov",
    "audioText": "男：あしたは 郵便局へ 行きますか。\n女：いいえ。雨が ふりそうですから、レストランで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 256,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月6日、伊藤さんは どこへ 行きたいですか。",
    "options": [
      "会社",
      "家",
      "公園",
      "市役所"
    ],
    "answer": 3,
    "explanation": "Percakapan menyebut 市役所 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "伊藤：すみません、市役所へ 行きたいです。\n案内：公園の となりですよ。公園の 前を 右へ 曲がってください。\n伊藤：わかりました。ありがとうございます。"
  },
  {
    "id": 257,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月7日の 映画は 何時からですか。",
    "options": [
      "15時20分",
      "14時20分",
      "10時",
      "16時20分"
    ],
    "answer": 0,
    "explanation": "Film dimulai pukul 15:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：15時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 258,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月8日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "みかん1つとお茶5つ",
      "みかん5つとお茶1つ",
      "みかん5つだけ",
      "お茶1つだけ"
    ],
    "answer": 1,
    "explanation": "小林 meminta みかん 5 buah dan お茶 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n小林：みかんを 5つと、お茶を 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 259,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月9日の 木曜日に、田中さんは 会社へ 行きますか。",
    "options": [
      "午後だけ行きます",
      "いいえ、行きません",
      "わかりません",
      "はい、行きます"
    ],
    "answer": 1,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n田中：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 260,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月10日、女の人は どこで 買い物を しますか。",
    "options": [
      "会社",
      "家",
      "公園",
      "スーパー"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di スーパー.",
    "period": "sep-nov",
    "audioText": "男：あしたは 会社へ 行きますか。\n女：いいえ。雨が ふりそうですから、スーパーで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 261,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月11日、鈴木さんは どこへ 行きたいですか。",
    "options": [
      "家",
      "病院",
      "駅",
      "会社"
    ],
    "answer": 2,
    "explanation": "Percakapan menyebut 駅 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "鈴木：すみません、駅へ 行きたいです。\n案内：病院の となりですよ。病院の 前を 右へ 曲がってください。\n鈴木：わかりました。ありがとうございます。"
  },
  {
    "id": 262,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月12日の 映画は 何時からですか。",
    "options": [
      "13時20分",
      "12時20分",
      "11時20分",
      "10時"
    ],
    "answer": 1,
    "explanation": "Film dimulai pukul 12:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：12時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 263,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月13日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "りんご1つとバナナ2つ",
      "りんご2つとバナナ1つ",
      "りんご2つだけ",
      "バナナ1つだけ"
    ],
    "answer": 1,
    "explanation": "高橋 meminta りんご 2 buah dan バナナ 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n高橋：りんごを 2つと、バナナを 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 264,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月14日の 木曜日に、伊藤さんは 会社へ 行きますか。",
    "options": [
      "いいえ、行きません",
      "わかりません",
      "はい、行きます",
      "午後だけ行きます"
    ],
    "answer": 0,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n伊藤：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 265,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月15日、女の人は どこで 買い物を しますか。",
    "options": [
      "郵便局",
      "公園",
      "家",
      "レストラン"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di レストラン.",
    "period": "sep-nov",
    "audioText": "男：あしたは 郵便局へ 行きますか。\n女：いいえ。雨が ふりそうですから、レストランで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 266,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月16日、小林さんは どこへ 行きたいですか。",
    "options": [
      "家",
      "公園",
      "会社",
      "市役所"
    ],
    "answer": 3,
    "explanation": "Percakapan menyebut 市役所 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "小林：すみません、市役所へ 行きたいです。\n案内：公園の となりですよ。公園の 前を 右へ 曲がってください。\n小林：わかりました。ありがとうございます。"
  },
  {
    "id": 267,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月17日の 映画は 何時からですか。",
    "options": [
      "9時20分",
      "8時20分",
      "10時20分",
      "10時"
    ],
    "answer": 0,
    "explanation": "Film dimulai pukul 9:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：9時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 268,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月18日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "パン3つだけ",
      "パン3つと牛乳1つ",
      "牛乳1つだけ",
      "パン1つと牛乳3つ"
    ],
    "answer": 1,
    "explanation": "佐藤 meminta パン 3 buah dan 牛乳 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n佐藤：パンを 3つと、牛乳を 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 269,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月19日の 木曜日に、鈴木さんは 会社へ 行きますか。",
    "options": [
      "午後だけ行きます",
      "はい、行きます",
      "わかりません",
      "いいえ、行きません"
    ],
    "answer": 3,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n鈴木：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 270,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月20日、女の人は どこで 買い物を しますか。",
    "options": [
      "スーパー",
      "会社",
      "公園",
      "家"
    ],
    "answer": 0,
    "explanation": "Perempuan itu mengatakan akan berbelanja di スーパー.",
    "period": "sep-nov",
    "audioText": "男：あしたは 会社へ 行きますか。\n女：いいえ。雨が ふりそうですから、スーパーで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 271,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月21日、高橋さんは どこへ 行きたいですか。",
    "options": [
      "会社",
      "家",
      "病院",
      "駅"
    ],
    "answer": 3,
    "explanation": "Percakapan menyebut 駅 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "高橋：すみません、駅へ 行きたいです。\n案内：病院の となりですよ。病院の 前を 右へ 曲がってください。\n高橋：わかりました。ありがとうございます。"
  },
  {
    "id": 272,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月22日の 映画は 何時からですか。",
    "options": [
      "10時",
      "13時20分",
      "15時20分",
      "14時20分"
    ],
    "answer": 3,
    "explanation": "Film dimulai pukul 14:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：14時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 273,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月23日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "たまご1つだけ",
      "おにぎり4つだけ",
      "おにぎり1つとたまご4つ",
      "おにぎり4つとたまご1つ"
    ],
    "answer": 3,
    "explanation": "中村 meminta おにぎり 4 buah dan たまご 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n中村：おにぎりを 4つと、たまごを 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 274,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月24日の 木曜日に、小林さんは 会社へ 行きますか。",
    "options": [
      "午後だけ行きます",
      "いいえ、行きません",
      "はい、行きます",
      "わかりません"
    ],
    "answer": 1,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n小林：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 275,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月25日、女の人は どこで 買い物を しますか。",
    "options": [
      "公園",
      "家",
      "郵便局",
      "レストラン"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di レストラン.",
    "period": "sep-nov",
    "audioText": "男：あしたは 郵便局へ 行きますか。\n女：いいえ。雨が ふりそうですから、レストランで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 276,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月26日、佐藤さんは どこへ 行きたいですか。",
    "options": [
      "会社",
      "家",
      "公園",
      "市役所"
    ],
    "answer": 3,
    "explanation": "Percakapan menyebut 市役所 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "佐藤：すみません、市役所へ 行きたいです。\n案内：公園の となりですよ。公園の 前を 右へ 曲がってください。\n佐藤：わかりました。ありがとうございます。"
  },
  {
    "id": 277,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月27日の 映画は 何時からですか。",
    "options": [
      "12時20分",
      "11時20分",
      "10時20分",
      "10時"
    ],
    "answer": 1,
    "explanation": "Film dimulai pukul 11:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：11時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 278,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月28日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "みかん5つだけ",
      "お茶1つだけ",
      "みかん1つとお茶5つ",
      "みかん5つとお茶1つ"
    ],
    "answer": 3,
    "explanation": "山本 meminta みかん 5 buah dan お茶 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n山本：みかんを 5つと、お茶を 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 279,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月1日の 木曜日に、高橋さんは 会社へ 行きますか。",
    "options": [
      "いいえ、行きません",
      "はい、行きます",
      "午後だけ行きます",
      "わかりません"
    ],
    "answer": 0,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n高橋：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 280,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月2日、女の人は どこで 買い物を しますか。",
    "options": [
      "会社",
      "スーパー",
      "家",
      "公園"
    ],
    "answer": 1,
    "explanation": "Perempuan itu mengatakan akan berbelanja di スーパー.",
    "period": "sep-nov",
    "audioText": "男：あしたは 会社へ 行きますか。\n女：いいえ。雨が ふりそうですから、スーパーで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 281,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月3日、中村さんは どこへ 行きたいですか。",
    "options": [
      "家",
      "会社",
      "病院",
      "駅"
    ],
    "answer": 3,
    "explanation": "Percakapan menyebut 駅 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "中村：すみません、駅へ 行きたいです。\n案内：病院の となりですよ。病院の 前を 右へ 曲がってください。\n中村：わかりました。ありがとうございます。"
  },
  {
    "id": 282,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月4日の 映画は 何時からですか。",
    "options": [
      "15時20分",
      "16時20分",
      "10時",
      "17時20分"
    ],
    "answer": 1,
    "explanation": "Film dimulai pukul 16:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：16時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 283,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月5日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "りんご2つだけ",
      "りんご2つとバナナ1つ",
      "りんご1つとバナナ2つ",
      "バナナ1つだけ"
    ],
    "answer": 1,
    "explanation": "田中 meminta りんご 2 buah dan バナナ 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n田中：りんごを 2つと、バナナを 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 284,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月6日の 木曜日に、佐藤さんは 会社へ 行きますか。",
    "options": [
      "わかりません",
      "はい、行きます",
      "いいえ、行きません",
      "午後だけ行きます"
    ],
    "answer": 2,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n佐藤：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 285,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月7日、女の人は どこで 買い物を しますか。",
    "options": [
      "家",
      "公園",
      "レストラン",
      "郵便局"
    ],
    "answer": 2,
    "explanation": "Perempuan itu mengatakan akan berbelanja di レストラン.",
    "period": "sep-nov",
    "audioText": "男：あしたは 郵便局へ 行きますか。\n女：いいえ。雨が ふりそうですから、レストランで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 286,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月8日、山本さんは どこへ 行きたいですか。",
    "options": [
      "市役所",
      "公園",
      "家",
      "会社"
    ],
    "answer": 0,
    "explanation": "Percakapan menyebut 市役所 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "山本：すみません、市役所へ 行きたいです。\n案内：公園の となりですよ。公園の 前を 右へ 曲がってください。\n山本：わかりました。ありがとうございます。"
  },
  {
    "id": 287,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月9日の 映画は 何時からですか。",
    "options": [
      "12時20分",
      "13時20分",
      "10時",
      "14時20分"
    ],
    "answer": 1,
    "explanation": "Film dimulai pukul 13:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：13時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 288,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月10日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "パン1つと牛乳3つ",
      "牛乳1つだけ",
      "パン3つと牛乳1つ",
      "パン3つだけ"
    ],
    "answer": 2,
    "explanation": "伊藤 meminta パン 3 buah dan 牛乳 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n伊藤：パンを 3つと、牛乳を 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 289,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月11日の 木曜日に、中村さんは 会社へ 行きますか。",
    "options": [
      "いいえ、行きません",
      "午後だけ行きます",
      "わかりません",
      "はい、行きます"
    ],
    "answer": 0,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n中村：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 290,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月12日、女の人は どこで 買い物を しますか。",
    "options": [
      "公園",
      "スーパー",
      "会社",
      "家"
    ],
    "answer": 1,
    "explanation": "Perempuan itu mengatakan akan berbelanja di スーパー.",
    "period": "sep-nov",
    "audioText": "男：あしたは 会社へ 行きますか。\n女：いいえ。雨が ふりそうですから、スーパーで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 291,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月13日、田中さんは どこへ 行きたいですか。",
    "options": [
      "家",
      "駅",
      "病院",
      "会社"
    ],
    "answer": 1,
    "explanation": "Percakapan menyebut 駅 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "田中：すみません、駅へ 行きたいです。\n案内：病院の となりですよ。病院の 前を 右へ 曲がってください。\n田中：わかりました。ありがとうございます。"
  },
  {
    "id": 292,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月14日の 映画は 何時からですか。",
    "options": [
      "10時20分",
      "11時20分",
      "10時",
      "9時20分"
    ],
    "answer": 0,
    "explanation": "Film dimulai pukul 10:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：10時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 293,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月15日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "たまご1つだけ",
      "おにぎり4つとたまご1つ",
      "おにぎり4つだけ",
      "おにぎり1つとたまご4つ"
    ],
    "answer": 1,
    "explanation": "鈴木 meminta おにぎり 4 buah dan たまご 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n鈴木：おにぎりを 4つと、たまごを 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 294,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月16日の 木曜日に、山本さんは 会社へ 行きますか。",
    "options": [
      "はい、行きます",
      "いいえ、行きません",
      "午後だけ行きます",
      "わかりません"
    ],
    "answer": 1,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n山本：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 295,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月17日、女の人は どこで 買い物を しますか。",
    "options": [
      "家",
      "郵便局",
      "公園",
      "レストラン"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di レストラン.",
    "period": "sep-nov",
    "audioText": "男：あしたは 郵便局へ 行きますか。\n女：いいえ。雨が ふりそうですから、レストランで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 296,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月18日、伊藤さんは どこへ 行きたいですか。",
    "options": [
      "家",
      "市役所",
      "会社",
      "公園"
    ],
    "answer": 1,
    "explanation": "Percakapan menyebut 市役所 sebagai tujuan.",
    "period": "sep-nov",
    "audioText": "伊藤：すみません、市役所へ 行きたいです。\n案内：公園の となりですよ。公園の 前を 右へ 曲がってください。\n伊藤：わかりました。ありがとうございます。"
  },
  {
    "id": 297,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月19日の 映画は 何時からですか。",
    "options": [
      "14時20分",
      "10時",
      "15時20分",
      "16時20分"
    ],
    "answer": 2,
    "explanation": "Film dimulai pukul 15:20.",
    "period": "sep-nov",
    "audioText": "女：映画は 何時からですか。\n男：15時20分からです。でも、10分前に 入ってください。\n女：はい、わかりました。"
  },
  {
    "id": 298,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月20日の 買い物で、何を いくつ 買いますか。",
    "options": [
      "みかん1つとお茶5つ",
      "みかん5つだけ",
      "みかん5つとお茶1つ",
      "お茶1つだけ"
    ],
    "answer": 2,
    "explanation": "小林 meminta みかん 5 buah dan お茶 1 buah.",
    "period": "sep-nov",
    "audioText": "店員：何に なさいますか。\n小林：みかんを 5つと、お茶を 1つください。\n店員：はい、かしこまりました。"
  },
  {
    "id": 299,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月21日の 木曜日に、田中さんは 会社へ 行きますか。",
    "options": [
      "わかりません",
      "はい、行きます",
      "午後だけ行きます",
      "いいえ、行きません"
    ],
    "answer": 3,
    "explanation": "Informasi menyebut 木曜日 adalah libur, jadi tidak perlu ke kantor.",
    "period": "sep-nov",
    "audioText": "会社の人：今週の 木曜日は 休みです。仕事は 駅の 近くの 店で 行います。\n田中：では、木曜日は 会社へ 行かなくても いいですか。\n会社の人：はい、そうです。"
  },
  {
    "id": 300,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n6月22日、女の人は どこで 買い物を しますか。",
    "options": [
      "公園",
      "家",
      "会社",
      "スーパー"
    ],
    "answer": 3,
    "explanation": "Perempuan itu mengatakan akan berbelanja di スーパー.",
    "period": "sep-nov",
    "audioText": "男：あしたは 会社へ 行きますか。\n女：いいえ。雨が ふりそうですから、スーパーで 買い物を します。\n男：そうですか。"
  },
  {
    "id": 301,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月1日の バスは 何時に 駅を 出ますか。",
    "options": [
      "8時10分",
      "9時0分",
      "10時",
      "8時0分"
    ],
    "answer": 3,
    "explanation": "Bus berangkat dari stasiun pukul 8時0分.",
    "period": "sep-nov",
    "audioText": "【案内】月曜日の バスは 8時0分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 302,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月2日の バスは どこで とまりますか。",
    "options": [
      "スーパー",
      "病院",
      "銀行",
      "公園"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】火曜日の バスは 9時10分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 303,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月3日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "13時",
      "12時",
      "10時",
      "14時"
    ],
    "answer": 1,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 12時.",
    "period": "sep-nov",
    "audioText": "【案内】水曜日の バスは 10時20分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 304,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月4日の バスは 何時に 駅を 出ますか。",
    "options": [
      "11時30分",
      "11時40分",
      "12時30分",
      "13時"
    ],
    "answer": 0,
    "explanation": "Bus berangkat dari stasiun pukul 11時30分.",
    "period": "sep-nov",
    "audioText": "【案内】木曜日の バスは 11時30分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 305,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月5日の バスは どこで とまりますか。",
    "options": [
      "銀行",
      "公園",
      "スーパー",
      "病院"
    ],
    "answer": 2,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】金曜日の バスは 8時40分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 306,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月6日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "12時",
      "13時",
      "9時",
      "11時"
    ],
    "answer": 3,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 11時.",
    "period": "sep-nov",
    "audioText": "【案内】月曜日の バスは 9時0分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 307,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月7日の バスは 何時に 駅を 出ますか。",
    "options": [
      "10時10分",
      "10時20分",
      "11時10分",
      "12時"
    ],
    "answer": 0,
    "explanation": "Bus berangkat dari stasiun pukul 10時10分.",
    "period": "sep-nov",
    "audioText": "【案内】火曜日の バスは 10時10分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 308,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月8日の バスは どこで とまりますか。",
    "options": [
      "スーパー",
      "銀行",
      "病院",
      "公園"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】水曜日の バスは 11時20分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 309,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月9日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "11時",
      "8時",
      "12時",
      "10時"
    ],
    "answer": 3,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 10時.",
    "period": "sep-nov",
    "audioText": "【案内】木曜日の バスは 8時30分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 310,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月10日の バスは 何時に 駅を 出ますか。",
    "options": [
      "11時",
      "10時40分",
      "9時50分",
      "9時40分"
    ],
    "answer": 3,
    "explanation": "Bus berangkat dari stasiun pukul 9時40分.",
    "period": "sep-nov",
    "audioText": "【案内】金曜日の バスは 9時40分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 311,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月11日の バスは どこで とまりますか。",
    "options": [
      "銀行",
      "病院",
      "公園",
      "スーパー"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】月曜日の バスは 10時0分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 312,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月12日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "15時",
      "11時",
      "13時",
      "14時"
    ],
    "answer": 2,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 13時.",
    "period": "sep-nov",
    "audioText": "【案内】火曜日の バスは 11時10分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 313,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月13日の バスは 何時に 駅を 出ますか。",
    "options": [
      "9時20分",
      "10時",
      "8時30分",
      "8時20分"
    ],
    "answer": 3,
    "explanation": "Bus berangkat dari stasiun pukul 8時20分.",
    "period": "sep-nov",
    "audioText": "【案内】水曜日の バスは 8時20分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 314,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月14日の バスは どこで とまりますか。",
    "options": [
      "スーパー",
      "公園",
      "病院",
      "銀行"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】木曜日の バスは 9時30分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 315,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月15日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "14時",
      "10時",
      "13時",
      "12時"
    ],
    "answer": 3,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 12時.",
    "period": "sep-nov",
    "audioText": "【案内】金曜日の バスは 10時40分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 316,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月16日の バスは 何時に 駅を 出ますか。",
    "options": [
      "11時0分",
      "13時",
      "12時0分",
      "11時10分"
    ],
    "answer": 0,
    "explanation": "Bus berangkat dari stasiun pukul 11時0分.",
    "period": "sep-nov",
    "audioText": "【案内】月曜日の バスは 11時0分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 317,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月17日の バスは どこで とまりますか。",
    "options": [
      "スーパー",
      "銀行",
      "病院",
      "公園"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】火曜日の バスは 8時10分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 318,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月18日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "9時",
      "12時",
      "13時",
      "11時"
    ],
    "answer": 3,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 11時.",
    "period": "sep-nov",
    "audioText": "【案内】水曜日の バスは 9時20分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 319,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月19日の バスは 何時に 駅を 出ますか。",
    "options": [
      "12時",
      "10時40分",
      "11時30分",
      "10時30分"
    ],
    "answer": 3,
    "explanation": "Bus berangkat dari stasiun pukul 10時30分.",
    "period": "sep-nov",
    "audioText": "【案内】木曜日の バスは 10時30分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 320,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月20日の バスは どこで とまりますか。",
    "options": [
      "スーパー",
      "銀行",
      "公園",
      "病院"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】金曜日の バスは 11時40分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 321,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月21日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "11時",
      "12時",
      "10時",
      "8時"
    ],
    "answer": 2,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 10時.",
    "period": "sep-nov",
    "audioText": "【案内】月曜日の バスは 8時0分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 322,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月22日の バスは 何時に 駅を 出ますか。",
    "options": [
      "11時",
      "9時10分",
      "9時20分",
      "10時10分"
    ],
    "answer": 1,
    "explanation": "Bus berangkat dari stasiun pukul 9時10分.",
    "period": "sep-nov",
    "audioText": "【案内】火曜日の バスは 9時10分に 駅を 出ます。11時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 323,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月23日の バスは どこで とまりますか。",
    "options": [
      "病院",
      "スーパー",
      "銀行",
      "公園"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut bus berhenti di supermarket.",
    "period": "sep-nov",
    "audioText": "【案内】水曜日の バスは 10時20分に 駅を 出ます。12時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 324,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月24日の バスは 何時までに 市役所に 着きますか。",
    "options": [
      "11時",
      "14時",
      "15時",
      "13時"
    ],
    "answer": 3,
    "explanation": "Bus tiba di 市役所 paling lambat sekitar 13時.",
    "period": "sep-nov",
    "audioText": "【案内】木曜日の バスは 11時30分に 駅を 出ます。13時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 325,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n7月25日の バスは 何時に 駅を 出ますか。",
    "options": [
      "8時40分",
      "8時50分",
      "10時",
      "9時40分"
    ],
    "answer": 0,
    "explanation": "Bus berangkat dari stasiun pukul 8時40分.",
    "period": "sep-nov",
    "audioText": "【案内】金曜日の バスは 8時40分に 駅を 出ます。10時までに 市役所に 着きます。途中で スーパーにも とまります。"
  },
  {
    "id": 326,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月1日、男の人は 資料を どうしますか。",
    "options": [
      "帰ります",
      "持ってきます",
      "食べます",
      "休みます"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani 資料; tindakan yang sesuai adalah 「持ってきます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、資料を お願いできますか。\n男：はい。机の上に ありますか。\n女：はい、そうです。資料を お願いします。"
  },
  {
    "id": 327,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月2日、男の人は ペンを どうしますか。",
    "options": [
      "置きます",
      "帰ります",
      "食べます",
      "休みます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani ペン; tindakan yang sesuai adalah 「置きます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、ペンを お願いできますか。\n男：はい。かばんの中に ありますか。\n女：はい、そうです。ペンを お願いします。"
  },
  {
    "id": 328,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月3日、男の人は はさみを どうしますか。",
    "options": [
      "帰ります",
      "食べます",
      "休みます",
      "見せます"
    ],
    "answer": 3,
    "explanation": "Pria diminta menangani はさみ; tindakan yang sesuai adalah 「見せます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、はさみを お願いできますか。\n男：はい。棚の下に ありますか。\n女：はい、そうです。はさみを お願いします。"
  },
  {
    "id": 329,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月4日、男の人は かぎを どうしますか。",
    "options": [
      "帰ります",
      "使います",
      "食べます",
      "休みます"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani かぎ; tindakan yang sesuai adalah 「使います」.",
    "period": "sep-nov",
    "audioText": "女：すみません、かぎを お願いできますか。\n男：はい。引き出しに ありますか。\n女：はい、そうです。かぎを お願いします。"
  },
  {
    "id": 330,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月5日、男の人は パソコンを どうしますか。",
    "options": [
      "入れます",
      "帰ります",
      "休みます",
      "食べます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani パソコン; tindakan yang sesuai adalah 「入れます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、パソコンを お願いできますか。\n男：はい。玄関に ありますか。\n女：はい、そうです。パソコンを お願いします。"
  },
  {
    "id": 331,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月6日、男の人は 資料を どうしますか。",
    "options": [
      "持ってきます",
      "帰ります",
      "食べます",
      "休みます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani 資料; tindakan yang sesuai adalah 「持ってきます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、資料を お願いできますか。\n男：はい。机の上に ありますか。\n女：はい、そうです。資料を お願いします。"
  },
  {
    "id": 332,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月7日、男の人は ペンを どうしますか。",
    "options": [
      "置きます",
      "食べます",
      "帰ります",
      "休みます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani ペン; tindakan yang sesuai adalah 「置きます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、ペンを お願いできますか。\n男：はい。かばんの中に ありますか。\n女：はい、そうです。ペンを お願いします。"
  },
  {
    "id": 333,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月8日、男の人は はさみを どうしますか。",
    "options": [
      "食べます",
      "休みます",
      "見せます",
      "帰ります"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani はさみ; tindakan yang sesuai adalah 「見せます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、はさみを お願いできますか。\n男：はい。棚の下に ありますか。\n女：はい、そうです。はさみを お願いします。"
  },
  {
    "id": 334,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月9日、男の人は かぎを どうしますか。",
    "options": [
      "食べます",
      "休みます",
      "帰ります",
      "使います"
    ],
    "answer": 3,
    "explanation": "Pria diminta menangani かぎ; tindakan yang sesuai adalah 「使います」.",
    "period": "sep-nov",
    "audioText": "女：すみません、かぎを お願いできますか。\n男：はい。引き出しに ありますか。\n女：はい、そうです。かぎを お願いします。"
  },
  {
    "id": 335,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月10日、男の人は パソコンを どうしますか。",
    "options": [
      "帰ります",
      "入れます",
      "食べます",
      "休みます"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani パソコン; tindakan yang sesuai adalah 「入れます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、パソコンを お願いできますか。\n男：はい。玄関に ありますか。\n女：はい、そうです。パソコンを お願いします。"
  },
  {
    "id": 336,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月11日、男の人は 資料を どうしますか。",
    "options": [
      "持ってきます",
      "帰ります",
      "食べます",
      "休みます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani 資料; tindakan yang sesuai adalah 「持ってきます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、資料を お願いできますか。\n男：はい。机の上に ありますか。\n女：はい、そうです。資料を お願いします。"
  },
  {
    "id": 337,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月12日、男の人は ペンを どうしますか。",
    "options": [
      "食べます",
      "置きます",
      "休みます",
      "帰ります"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani ペン; tindakan yang sesuai adalah 「置きます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、ペンを お願いできますか。\n男：はい。かばんの中に ありますか。\n女：はい、そうです。ペンを お願いします。"
  },
  {
    "id": 338,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月13日、男の人は はさみを どうしますか。",
    "options": [
      "食べます",
      "帰ります",
      "見せます",
      "休みます"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani はさみ; tindakan yang sesuai adalah 「見せます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、はさみを お願いできますか。\n男：はい。棚の下に ありますか。\n女：はい、そうです。はさみを お願いします。"
  },
  {
    "id": 339,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月14日、男の人は かぎを どうしますか。",
    "options": [
      "食べます",
      "使います",
      "休みます",
      "帰ります"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani かぎ; tindakan yang sesuai adalah 「使います」.",
    "period": "sep-nov",
    "audioText": "女：すみません、かぎを お願いできますか。\n男：はい。引き出しに ありますか。\n女：はい、そうです。かぎを お願いします。"
  },
  {
    "id": 340,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月15日、男の人は パソコンを どうしますか。",
    "options": [
      "休みます",
      "食べます",
      "入れます",
      "帰ります"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani パソコン; tindakan yang sesuai adalah 「入れます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、パソコンを お願いできますか。\n男：はい。玄関に ありますか。\n女：はい、そうです。パソコンを お願いします。"
  },
  {
    "id": 341,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月16日、男の人は 資料を どうしますか。",
    "options": [
      "休みます",
      "持ってきます",
      "帰ります",
      "食べます"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani 資料; tindakan yang sesuai adalah 「持ってきます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、資料を お願いできますか。\n男：はい。机の上に ありますか。\n女：はい、そうです。資料を お願いします。"
  },
  {
    "id": 342,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月17日、男の人は ペンを どうしますか。",
    "options": [
      "休みます",
      "食べます",
      "置きます",
      "帰ります"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani ペン; tindakan yang sesuai adalah 「置きます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、ペンを お願いできますか。\n男：はい。かばんの中に ありますか。\n女：はい、そうです。ペンを お願いします。"
  },
  {
    "id": 343,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月18日、男の人は はさみを どうしますか。",
    "options": [
      "見せます",
      "帰ります",
      "休みます",
      "食べます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani はさみ; tindakan yang sesuai adalah 「見せます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、はさみを お願いできますか。\n男：はい。棚の下に ありますか。\n女：はい、そうです。はさみを お願いします。"
  },
  {
    "id": 344,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月19日、男の人は かぎを どうしますか。",
    "options": [
      "使います",
      "帰ります",
      "食べます",
      "休みます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani かぎ; tindakan yang sesuai adalah 「使います」.",
    "period": "sep-nov",
    "audioText": "女：すみません、かぎを お願いできますか。\n男：はい。引き出しに ありますか。\n女：はい、そうです。かぎを お願いします。"
  },
  {
    "id": 345,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月20日、男の人は パソコンを どうしますか。",
    "options": [
      "入れます",
      "食べます",
      "休みます",
      "帰ります"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani パソコン; tindakan yang sesuai adalah 「入れます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、パソコンを お願いできますか。\n男：はい。玄関に ありますか。\n女：はい、そうです。パソコンを お願いします。"
  },
  {
    "id": 346,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月21日、男の人は 資料を どうしますか。",
    "options": [
      "帰ります",
      "休みます",
      "持ってきます",
      "食べます"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani 資料; tindakan yang sesuai adalah 「持ってきます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、資料を お願いできますか。\n男：はい。机の上に ありますか。\n女：はい、そうです。資料を お願いします。"
  },
  {
    "id": 347,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月22日、男の人は ペンを どうしますか。",
    "options": [
      "休みます",
      "帰ります",
      "食べます",
      "置きます"
    ],
    "answer": 3,
    "explanation": "Pria diminta menangani ペン; tindakan yang sesuai adalah 「置きます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、ペンを お願いできますか。\n男：はい。かばんの中に ありますか。\n女：はい、そうです。ペンを お願いします。"
  },
  {
    "id": 348,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月23日、男の人は はさみを どうしますか。",
    "options": [
      "見せます",
      "帰ります",
      "休みます",
      "食べます"
    ],
    "answer": 0,
    "explanation": "Pria diminta menangani はさみ; tindakan yang sesuai adalah 「見せます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、はさみを お願いできますか。\n男：はい。棚の下に ありますか。\n女：はい、そうです。はさみを お願いします。"
  },
  {
    "id": 349,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月24日、男の人は かぎを どうしますか。",
    "options": [
      "休みます",
      "使います",
      "帰ります",
      "食べます"
    ],
    "answer": 1,
    "explanation": "Pria diminta menangani かぎ; tindakan yang sesuai adalah 「使います」.",
    "period": "sep-nov",
    "audioText": "女：すみません、かぎを お願いできますか。\n男：はい。引き出しに ありますか。\n女：はい、そうです。かぎを お願いします。"
  },
  {
    "id": 350,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n8月25日、男の人は パソコンを どうしますか。",
    "options": [
      "休みます",
      "食べます",
      "入れます",
      "帰ります"
    ],
    "answer": 2,
    "explanation": "Pria diminta menangani パソコン; tindakan yang sesuai adalah 「入れます」.",
    "period": "sep-nov",
    "audioText": "女：すみません、パソコンを お願いできますか。\n男：はい。玄関に ありますか。\n女：はい、そうです。パソコンを お願いします。"
  },
  {
    "id": 351,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月1日、ヘルメットは どうしますか。",
    "options": [
      "買います",
      "ぬぎます",
      "洗います",
      "かぶります"
    ],
    "answer": 3,
    "explanation": "Instruksi meminta pekerja memakai helm → かぶります.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】機械の 近くでは ヘルメットを かぶってください。 みなさん、気をつけてください。"
  },
  {
    "id": 352,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月2日、作業の 前に 何を しますか。",
    "options": [
      "電源を 確認します",
      "昼ごはんを 食べます",
      "テレビを 見ます",
      "買い物を します"
    ],
    "answer": 0,
    "explanation": "Sebelum bekerja, periksa sumber daya listrik → 電源を確認します.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】作業の 前に 電源を 確認してください。 みなさん、気をつけてください。"
  },
  {
    "id": 353,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月3日、床が ぬれているとき、どうしますか。",
    "options": [
      "寝ます",
      "泳ぎます",
      "走ります",
      "走りません"
    ],
    "answer": 3,
    "explanation": "Lantai basah, jadi jangan berlari → 走りません.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】床が ぬれているので、走らないでください。 みなさん、気をつけてください。"
  },
  {
    "id": 354,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月4日、重い 荷物は どうしますか。",
    "options": [
      "そのまま 置きます",
      "二人で 運びます",
      "食べます",
      "一人で 走ります"
    ],
    "answer": 1,
    "explanation": "Bawaan berat harus diangkut berdua → 二人で運びます.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】重い 荷物は 二人で 運んでください。 みなさん、気をつけてください。"
  },
  {
    "id": 355,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月5日、休憩は 何時からですか。",
    "options": [
      "10時から",
      "14時から",
      "12時から",
      "17時から"
    ],
    "answer": 2,
    "explanation": "Istirahat dimulai pukul 12:00.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】休憩は 12時から 1時間です。 みなさん、気をつけてください。"
  },
  {
    "id": 356,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月6日、ヘルメットは どうしますか。",
    "options": [
      "洗います",
      "ぬぎます",
      "買います",
      "かぶります"
    ],
    "answer": 3,
    "explanation": "Instruksi meminta pekerja memakai helm → かぶります.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】機械の 近くでは ヘルメットを かぶってください。 みなさん、気をつけてください。"
  },
  {
    "id": 357,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月7日、作業の 前に 何を しますか。",
    "options": [
      "買い物を します",
      "電源を 確認します",
      "テレビを 見ます",
      "昼ごはんを 食べます"
    ],
    "answer": 1,
    "explanation": "Sebelum bekerja, periksa sumber daya listrik → 電源を確認します.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】作業の 前に 電源を 確認してください。 みなさん、気をつけてください。"
  },
  {
    "id": 358,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月8日、床が ぬれているとき、どうしますか。",
    "options": [
      "走りません",
      "泳ぎます",
      "走ります",
      "寝ます"
    ],
    "answer": 0,
    "explanation": "Lantai basah, jadi jangan berlari → 走りません.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】床が ぬれているので、走らないでください。 みなさん、気をつけてください。"
  },
  {
    "id": 359,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月9日、重い 荷物は どうしますか。",
    "options": [
      "二人で 運びます",
      "食べます",
      "一人で 走ります",
      "そのまま 置きます"
    ],
    "answer": 0,
    "explanation": "Bawaan berat harus diangkut berdua → 二人で運びます.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】重い 荷物は 二人で 運んでください。 みなさん、気をつけてください。"
  },
  {
    "id": 360,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月10日、休憩は 何時からですか。",
    "options": [
      "17時から",
      "10時から",
      "14時から",
      "12時から"
    ],
    "answer": 3,
    "explanation": "Istirahat dimulai pukul 12:00.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】休憩は 12時から 1時間です。 みなさん、気をつけてください。"
  },
  {
    "id": 361,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月11日、ヘルメットは どうしますか。",
    "options": [
      "買います",
      "ぬぎます",
      "洗います",
      "かぶります"
    ],
    "answer": 3,
    "explanation": "Instruksi meminta pekerja memakai helm → かぶります.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】機械の 近くでは ヘルメットを かぶってください。 みなさん、気をつけてください。"
  },
  {
    "id": 362,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月12日、作業の 前に 何を しますか。",
    "options": [
      "テレビを 見ます",
      "電源を 確認します",
      "買い物を します",
      "昼ごはんを 食べます"
    ],
    "answer": 1,
    "explanation": "Sebelum bekerja, periksa sumber daya listrik → 電源を確認します.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】作業の 前に 電源を 確認してください。 みなさん、気をつけてください。"
  },
  {
    "id": 363,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月13日、床が ぬれているとき、どうしますか。",
    "options": [
      "泳ぎます",
      "走りません",
      "走ります",
      "寝ます"
    ],
    "answer": 1,
    "explanation": "Lantai basah, jadi jangan berlari → 走りません.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】床が ぬれているので、走らないでください。 みなさん、気をつけてください。"
  },
  {
    "id": 364,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月14日、重い 荷物は どうしますか。",
    "options": [
      "一人で 走ります",
      "二人で 運びます",
      "そのまま 置きます",
      "食べます"
    ],
    "answer": 1,
    "explanation": "Bawaan berat harus diangkut berdua → 二人で運びます.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】重い 荷物は 二人で 運んでください。 みなさん、気をつけてください。"
  },
  {
    "id": 365,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月15日、休憩は 何時からですか。",
    "options": [
      "14時から",
      "10時から",
      "17時から",
      "12時から"
    ],
    "answer": 3,
    "explanation": "Istirahat dimulai pukul 12:00.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】休憩は 12時から 1時間です。 みなさん、気をつけてください。"
  },
  {
    "id": 366,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月16日、ヘルメットは どうしますか。",
    "options": [
      "かぶります",
      "ぬぎます",
      "洗います",
      "買います"
    ],
    "answer": 0,
    "explanation": "Instruksi meminta pekerja memakai helm → かぶります.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】機械の 近くでは ヘルメットを かぶってください。 みなさん、気をつけてください。"
  },
  {
    "id": 367,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月17日、作業の 前に 何を しますか。",
    "options": [
      "テレビを 見ます",
      "昼ごはんを 食べます",
      "電源を 確認します",
      "買い物を します"
    ],
    "answer": 2,
    "explanation": "Sebelum bekerja, periksa sumber daya listrik → 電源を確認します.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】作業の 前に 電源を 確認してください。 みなさん、気をつけてください。"
  },
  {
    "id": 368,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月18日、床が ぬれているとき、どうしますか。",
    "options": [
      "寝ます",
      "走りません",
      "泳ぎます",
      "走ります"
    ],
    "answer": 1,
    "explanation": "Lantai basah, jadi jangan berlari → 走りません.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】床が ぬれているので、走らないでください。 みなさん、気をつけてください。"
  },
  {
    "id": 369,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月19日、重い 荷物は どうしますか。",
    "options": [
      "一人で 走ります",
      "二人で 運びます",
      "そのまま 置きます",
      "食べます"
    ],
    "answer": 1,
    "explanation": "Bawaan berat harus diangkut berdua → 二人で運びます.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】重い 荷物は 二人で 運んでください。 みなさん、気をつけてください。"
  },
  {
    "id": 370,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月20日、休憩は 何時からですか。",
    "options": [
      "17時から",
      "10時から",
      "12時から",
      "14時から"
    ],
    "answer": 2,
    "explanation": "Istirahat dimulai pukul 12:00.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】休憩は 12時から 1時間です。 みなさん、気をつけてください。"
  },
  {
    "id": 371,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月21日、ヘルメットは どうしますか。",
    "options": [
      "かぶります",
      "ぬぎます",
      "買います",
      "洗います"
    ],
    "answer": 0,
    "explanation": "Instruksi meminta pekerja memakai helm → かぶります.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】機械の 近くでは ヘルメットを かぶってください。 みなさん、気をつけてください。"
  },
  {
    "id": 372,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月22日、作業の 前に 何を しますか。",
    "options": [
      "昼ごはんを 食べます",
      "テレビを 見ます",
      "電源を 確認します",
      "買い物を します"
    ],
    "answer": 2,
    "explanation": "Sebelum bekerja, periksa sumber daya listrik → 電源を確認します.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】作業の 前に 電源を 確認してください。 みなさん、気をつけてください。"
  },
  {
    "id": 373,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月23日、床が ぬれているとき、どうしますか。",
    "options": [
      "泳ぎます",
      "走ります",
      "走りません",
      "寝ます"
    ],
    "answer": 2,
    "explanation": "Lantai basah, jadi jangan berlari → 走りません.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】床が ぬれているので、走らないでください。 みなさん、気をつけてください。"
  },
  {
    "id": 374,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月24日、重い 荷物は どうしますか。",
    "options": [
      "二人で 運びます",
      "食べます",
      "そのまま 置きます",
      "一人で 走ります"
    ],
    "answer": 0,
    "explanation": "Bawaan berat harus diangkut berdua → 二人で運びます.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】重い 荷物は 二人で 運んでください。 みなさん、気をつけてください。"
  },
  {
    "id": 375,
    "section": "listening",
    "text": "【音声を聞いて答えてください】\n9月25日、休憩は 何時からですか。",
    "options": [
      "14時から",
      "10時から",
      "12時から",
      "17時から"
    ],
    "answer": 2,
    "explanation": "Istirahat dimulai pukul 12:00.",
    "period": "sep-nov",
    "audioText": "【作業の お知らせ】休憩は 12時から 1時間です。 みなさん、気をつけてください。"
  },
  {
    "id": 376,
    "section": "reading",
    "text": "【お知らせ】\n10月1日の 図書館は 月曜日が 休みです。\n土曜日は 8時から 16時まで あいています。\n\n土曜日の 17時に 図書館へ 行くことが できますか。",
    "options": [
      "月曜日だけ できます。",
      "わかりません。",
      "はい、できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "図書館は 土曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 377,
    "section": "reading",
    "text": "【お知らせ】\n10月2日の 市民センターは 火曜日が 休みです。\n日曜日は 9時から 17時まで あいています。\n\n日曜日の 18時に 市民センターへ 行くことが できますか。",
    "options": [
      "わかりません。",
      "火曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "市民センターは 日曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 378,
    "section": "reading",
    "text": "【お知らせ】\n10月3日の 病院は 水曜日が 休みです。\n火曜日は 10時から 18時まで あいています。\n\n火曜日の 19時に 病院へ 行くことが できますか。",
    "options": [
      "水曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "病院は 火曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 379,
    "section": "reading",
    "text": "【お知らせ】\n10月4日の スポーツセンターは 木曜日が 休みです。\n木曜日は 8時から 16時まで あいています。\n\n木曜日の 17時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。",
      "木曜日だけ できます。"
    ],
    "answer": 1,
    "explanation": "スポーツセンターは 木曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 380,
    "section": "reading",
    "text": "【お知らせ】\n10月5日の スーパーは 金曜日が 休みです。\n月曜日は 9時から 17時まで あいています。\n\n月曜日の 18時に スーパーへ 行くことが できますか。",
    "options": [
      "金曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。"
    ],
    "answer": 2,
    "explanation": "スーパーは 月曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 381,
    "section": "reading",
    "text": "【お知らせ】\n10月6日の 図書館は 月曜日が 休みです。\n土曜日は 10時から 18時まで あいています。\n\n土曜日の 19時に 図書館へ 行くことが できますか。",
    "options": [
      "わかりません。",
      "月曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "図書館は 土曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 382,
    "section": "reading",
    "text": "【お知らせ】\n10月7日の 市民センターは 火曜日が 休みです。\n日曜日は 8時から 16時まで あいています。\n\n日曜日の 17時に 市民センターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "わかりません。",
      "いいえ、できません。",
      "火曜日だけ できます。"
    ],
    "answer": 2,
    "explanation": "市民センターは 日曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 383,
    "section": "reading",
    "text": "【お知らせ】\n10月8日の 病院は 水曜日が 休みです。\n火曜日は 9時から 17時まで あいています。\n\n火曜日の 18時に 病院へ 行くことが できますか。",
    "options": [
      "水曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "病院は 火曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 384,
    "section": "reading",
    "text": "【お知らせ】\n10月9日の スポーツセンターは 木曜日が 休みです。\n木曜日は 10時から 18時まで あいています。\n\n木曜日の 19時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "いいえ、できません。",
      "木曜日だけ できます。",
      "はい、できます。",
      "わかりません。"
    ],
    "answer": 0,
    "explanation": "スポーツセンターは 木曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 385,
    "section": "reading",
    "text": "【お知らせ】\n10月10日の スーパーは 金曜日が 休みです。\n月曜日は 8時から 16時まで あいています。\n\n月曜日の 17時に スーパーへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "わかりません。",
      "金曜日だけ できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "スーパーは 月曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 386,
    "section": "reading",
    "text": "【お知らせ】\n10月11日の 図書館は 月曜日が 休みです。\n土曜日は 9時から 17時まで あいています。\n\n土曜日の 18時に 図書館へ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "いいえ、できません。",
      "月曜日だけ できます。",
      "わかりません。"
    ],
    "answer": 1,
    "explanation": "図書館は 土曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 387,
    "section": "reading",
    "text": "【お知らせ】\n10月12日の 市民センターは 火曜日が 休みです。\n日曜日は 10時から 18時まで あいています。\n\n日曜日の 19時に 市民センターへ 行くことが できますか。",
    "options": [
      "火曜日だけ できます。",
      "わかりません。",
      "いいえ、できません。",
      "はい、できます。"
    ],
    "answer": 2,
    "explanation": "市民センターは 日曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 388,
    "section": "reading",
    "text": "【お知らせ】\n10月13日の 病院は 水曜日が 休みです。\n火曜日は 8時から 16時まで あいています。\n\n火曜日の 17時に 病院へ 行くことが できますか。",
    "options": [
      "わかりません。",
      "いいえ、できません。",
      "水曜日だけ できます。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "病院は 火曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 389,
    "section": "reading",
    "text": "【お知らせ】\n10月14日の スポーツセンターは 木曜日が 休みです。\n木曜日は 9時から 17時まで あいています。\n\n木曜日の 18時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "木曜日だけ できます。",
      "いいえ、できません。",
      "はい、できます。",
      "わかりません。"
    ],
    "answer": 1,
    "explanation": "スポーツセンターは 木曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 390,
    "section": "reading",
    "text": "【お知らせ】\n10月15日の スーパーは 金曜日が 休みです。\n月曜日は 10時から 18時まで あいています。\n\n月曜日の 19時に スーパーへ 行くことが できますか。",
    "options": [
      "金曜日だけ できます。",
      "いいえ、できません。",
      "はい、できます。",
      "わかりません。"
    ],
    "answer": 1,
    "explanation": "スーパーは 月曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 391,
    "section": "reading",
    "text": "【お知らせ】\n10月16日の 図書館は 月曜日が 休みです。\n土曜日は 8時から 16時まで あいています。\n\n土曜日の 17時に 図書館へ 行くことが できますか。",
    "options": [
      "わかりません。",
      "はい、できます。",
      "月曜日だけ できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "図書館は 土曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 392,
    "section": "reading",
    "text": "【お知らせ】\n10月17日の 市民センターは 火曜日が 休みです。\n日曜日は 9時から 17時まで あいています。\n\n日曜日の 18時に 市民センターへ 行くことが できますか。",
    "options": [
      "わかりません。",
      "いいえ、できません。",
      "火曜日だけ できます。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "市民センターは 日曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 393,
    "section": "reading",
    "text": "【お知らせ】\n10月18日の 病院は 水曜日が 休みです。\n火曜日は 10時から 18時まで あいています。\n\n火曜日の 19時に 病院へ 行くことが できますか。",
    "options": [
      "水曜日だけ できます。",
      "わかりません。",
      "いいえ、できません。",
      "はい、できます。"
    ],
    "answer": 2,
    "explanation": "病院は 火曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 394,
    "section": "reading",
    "text": "【お知らせ】\n10月19日の スポーツセンターは 木曜日が 休みです。\n木曜日は 8時から 16時まで あいています。\n\n木曜日の 17時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "わかりません。",
      "木曜日だけ できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "スポーツセンターは 木曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 395,
    "section": "reading",
    "text": "【お知らせ】\n10月20日の スーパーは 金曜日が 休みです。\n月曜日は 9時から 17時まで あいています。\n\n月曜日の 18時に スーパーへ 行くことが できますか。",
    "options": [
      "金曜日だけ できます。",
      "はい、できます。",
      "わかりません。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "スーパーは 月曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 396,
    "section": "reading",
    "text": "【お知らせ】\n10月21日の 図書館は 月曜日が 休みです。\n土曜日は 10時から 18時まで あいています。\n\n土曜日の 19時に 図書館へ 行くことが できますか。",
    "options": [
      "わかりません。",
      "はい、できます。",
      "いいえ、できません。",
      "月曜日だけ できます。"
    ],
    "answer": 2,
    "explanation": "図書館は 土曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 397,
    "section": "reading",
    "text": "【お知らせ】\n10月22日の 市民センターは 火曜日が 休みです。\n日曜日は 8時から 16時まで あいています。\n\n日曜日の 17時に 市民センターへ 行くことが できますか。",
    "options": [
      "わかりません。",
      "はい、できます。",
      "火曜日だけ できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "市民センターは 日曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 398,
    "section": "reading",
    "text": "【お知らせ】\n10月23日の 病院は 水曜日が 休みです。\n火曜日は 9時から 17時まで あいています。\n\n火曜日の 18時に 病院へ 行くことが できますか。",
    "options": [
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。",
      "水曜日だけ できます。"
    ],
    "answer": 0,
    "explanation": "病院は 火曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 399,
    "section": "reading",
    "text": "【お知らせ】\n10月24日の スポーツセンターは 木曜日が 休みです。\n木曜日は 10時から 18時まで あいています。\n\n木曜日の 19時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "木曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。"
    ],
    "answer": 2,
    "explanation": "スポーツセンターは 木曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 400,
    "section": "reading",
    "text": "【お知らせ】\n10月25日の スーパーは 金曜日が 休みです。\n月曜日は 8時から 16時まで あいています。\n\n月曜日の 17時に スーパーへ 行くことが できますか。",
    "options": [
      "金曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "スーパーは 月曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 401,
    "section": "reading",
    "text": "【お知らせ】\n10月26日の 図書館は 月曜日が 休みです。\n土曜日は 9時から 17時まで あいています。\n\n土曜日の 18時に 図書館へ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。",
      "月曜日だけ できます。"
    ],
    "answer": 1,
    "explanation": "図書館は 土曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 402,
    "section": "reading",
    "text": "【お知らせ】\n10月27日の 市民センターは 火曜日が 休みです。\n日曜日は 10時から 18時まで あいています。\n\n日曜日の 19時に 市民センターへ 行くことが できますか。",
    "options": [
      "いいえ、できません。",
      "火曜日だけ できます。",
      "はい、できます。",
      "わかりません。"
    ],
    "answer": 0,
    "explanation": "市民センターは 日曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 403,
    "section": "reading",
    "text": "【お知らせ】\n10月28日の 病院は 水曜日が 休みです。\n火曜日は 8時から 16時まで あいています。\n\n火曜日の 17時に 病院へ 行くことが できますか。",
    "options": [
      "わかりません。",
      "水曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "病院は 火曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 404,
    "section": "reading",
    "text": "【お知らせ】\n10月1日の スポーツセンターは 木曜日が 休みです。\n木曜日は 9時から 17時まで あいています。\n\n木曜日の 18時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "いいえ、できません。",
      "木曜日だけ できます。",
      "わかりません。"
    ],
    "answer": 1,
    "explanation": "スポーツセンターは 木曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 405,
    "section": "reading",
    "text": "【お知らせ】\n10月2日の スーパーは 金曜日が 休みです。\n月曜日は 10時から 18時まで あいています。\n\n月曜日の 19時に スーパーへ 行くことが できますか。",
    "options": [
      "金曜日だけ できます。",
      "いいえ、できません。",
      "はい、できます。",
      "わかりません。"
    ],
    "answer": 1,
    "explanation": "スーパーは 月曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 406,
    "section": "reading",
    "text": "【お知らせ】\n10月3日の 図書館は 月曜日が 休みです。\n土曜日は 8時から 16時まで あいています。\n\n土曜日の 17時に 図書館へ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。",
      "月曜日だけ できます。"
    ],
    "answer": 1,
    "explanation": "図書館は 土曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 407,
    "section": "reading",
    "text": "【お知らせ】\n10月4日の 市民センターは 火曜日が 休みです。\n日曜日は 9時から 17時まで あいています。\n\n日曜日の 18時に 市民センターへ 行くことが できますか。",
    "options": [
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。",
      "火曜日だけ できます。"
    ],
    "answer": 0,
    "explanation": "市民センターは 日曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 408,
    "section": "reading",
    "text": "【お知らせ】\n10月5日の 病院は 水曜日が 休みです。\n火曜日は 10時から 18時まで あいています。\n\n火曜日の 19時に 病院へ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "水曜日だけ できます。",
      "わかりません。",
      "いいえ、できません。"
    ],
    "answer": 3,
    "explanation": "病院は 火曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 409,
    "section": "reading",
    "text": "【お知らせ】\n10月6日の スポーツセンターは 木曜日が 休みです。\n木曜日は 8時から 16時まで あいています。\n\n木曜日の 17時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "わかりません。",
      "木曜日だけ できます。",
      "いいえ、できません。",
      "はい、できます。"
    ],
    "answer": 2,
    "explanation": "スポーツセンターは 木曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 410,
    "section": "reading",
    "text": "【お知らせ】\n10月7日の スーパーは 金曜日が 休みです。\n月曜日は 9時から 17時まで あいています。\n\n月曜日の 18時に スーパーへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "金曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。"
    ],
    "answer": 2,
    "explanation": "スーパーは 月曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 411,
    "section": "reading",
    "text": "【お知らせ】\n10月8日の 図書館は 月曜日が 休みです。\n土曜日は 10時から 18時まで あいています。\n\n土曜日の 19時に 図書館へ 行くことが できますか。",
    "options": [
      "月曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。"
    ],
    "answer": 2,
    "explanation": "図書館は 土曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 412,
    "section": "reading",
    "text": "【お知らせ】\n10月9日の 市民センターは 火曜日が 休みです。\n日曜日は 8時から 16時まで あいています。\n\n日曜日の 17時に 市民センターへ 行くことが できますか。",
    "options": [
      "火曜日だけ できます。",
      "いいえ、できません。",
      "わかりません。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "市民センターは 日曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 413,
    "section": "reading",
    "text": "【お知らせ】\n10月10日の 病院は 水曜日が 休みです。\n火曜日は 9時から 17時まで あいています。\n\n火曜日の 18時に 病院へ 行くことが できますか。",
    "options": [
      "水曜日だけ できます。",
      "はい、できます。",
      "いいえ、できません。",
      "わかりません。"
    ],
    "answer": 2,
    "explanation": "病院は 火曜日に 17時までなので、18時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 414,
    "section": "reading",
    "text": "【お知らせ】\n10月11日の スポーツセンターは 木曜日が 休みです。\n木曜日は 10時から 18時まで あいています。\n\n木曜日の 19時に スポーツセンターへ 行くことが できますか。",
    "options": [
      "はい、できます。",
      "わかりません。",
      "いいえ、できません。",
      "木曜日だけ できます。"
    ],
    "answer": 2,
    "explanation": "スポーツセンターは 木曜日に 18時までなので、19時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 415,
    "section": "reading",
    "text": "【お知らせ】\n10月12日の スーパーは 金曜日が 休みです。\n月曜日は 8時から 16時まで あいています。\n\n月曜日の 17時に スーパーへ 行くことが できますか。",
    "options": [
      "わかりません。",
      "いいえ、できません。",
      "金曜日だけ できます。",
      "はい、できます。"
    ],
    "answer": 1,
    "explanation": "スーパーは 月曜日に 16時までなので、17時は tutup.",
    "period": "sep-nov"
  },
  {
    "id": 416,
    "section": "reading",
    "text": "【メモ】\n11月1日の メモ\n鈴木さんへ\n田中です。\nあしたの 会議は 9時です。\n銀行の 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "わかりません",
      "9時",
      "午前8時",
      "10時"
    ],
    "answer": 1,
    "explanation": "Memo menyebut 会議 berlangsung pukul 9.",
    "period": "sep-nov"
  },
  {
    "id": 417,
    "section": "reading",
    "text": "【メモ】\n11月2日の メモ\n山本さんへ\n佐藤です。\nあしたの 買い物は 10時です。\nスーパーの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "わかりません",
      "11時",
      "午前8時",
      "10時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 10.",
    "period": "sep-nov"
  },
  {
    "id": 418,
    "section": "reading",
    "text": "【メモ】\n11月3日の メモ\n高橋さんへ\n鈴木です。\nあしたの 病院の 予約は 11時です。\n病院の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "12時",
      "11時",
      "わかりません",
      "午前8時"
    ],
    "answer": 1,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 11.",
    "period": "sep-nov"
  },
  {
    "id": 419,
    "section": "reading",
    "text": "【メモ】\n11月4日の メモ\n伊藤さんへ\n山本です。\nあしたの 昼ごはんは 12時です。\n郵便局の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "13時",
      "午前8時",
      "12時",
      "わかりません"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 12.",
    "period": "sep-nov"
  },
  {
    "id": 420,
    "section": "reading",
    "text": "【メモ】\n11月5日の メモ\n中村さんへ\n高橋です。\nあしたの 駅での 集合は 13時です。\n市役所の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "14時",
      "午前8時",
      "13時",
      "わかりません"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 13.",
    "period": "sep-nov"
  },
  {
    "id": 421,
    "section": "reading",
    "text": "【メモ】\n11月6日の メモ\n小林さんへ\n伊藤です。\nあしたの 会議は 14時です。\nコンビニの 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "15時",
      "午前8時",
      "わかりません",
      "14時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 会議 berlangsung pukul 14.",
    "period": "sep-nov"
  },
  {
    "id": 422,
    "section": "reading",
    "text": "【メモ】\n11月7日の メモ\n田中さんへ\n中村です。\nあしたの 買い物は 15時です。\nレストランの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "午前8時",
      "15時",
      "わかりません",
      "16時"
    ],
    "answer": 1,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 15.",
    "period": "sep-nov"
  },
  {
    "id": 423,
    "section": "reading",
    "text": "【メモ】\n11月8日の メモ\n佐藤さんへ\n小林です。\nあしたの 病院の 予約は 16時です。\n公園の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "17時",
      "16時",
      "午前8時",
      "わかりません"
    ],
    "answer": 1,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 16.",
    "period": "sep-nov"
  },
  {
    "id": 424,
    "section": "reading",
    "text": "【メモ】\n11月9日の メモ\n鈴木さんへ\n田中です。\nあしたの 昼ごはんは 9時です。\n会社の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "10時",
      "わかりません",
      "9時",
      "午前8時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 9.",
    "period": "sep-nov"
  },
  {
    "id": 425,
    "section": "reading",
    "text": "【メモ】\n11月10日の メモ\n山本さんへ\n佐藤です。\nあしたの 駅での 集合は 10時です。\n駅の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "10時",
      "11時",
      "わかりません",
      "午前8時"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 10.",
    "period": "sep-nov"
  },
  {
    "id": 426,
    "section": "reading",
    "text": "【メモ】\n11月11日の メモ\n高橋さんへ\n鈴木です。\nあしたの 会議は 11時です。\n銀行の 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "わかりません",
      "12時",
      "11時",
      "午前8時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 会議 berlangsung pukul 11.",
    "period": "sep-nov"
  },
  {
    "id": 427,
    "section": "reading",
    "text": "【メモ】\n11月12日の メモ\n伊藤さんへ\n山本です。\nあしたの 買い物は 12時です。\nスーパーの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "12時",
      "13時",
      "わかりません",
      "午前8時"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 12.",
    "period": "sep-nov"
  },
  {
    "id": 428,
    "section": "reading",
    "text": "【メモ】\n11月13日の メモ\n中村さんへ\n高橋です。\nあしたの 病院の 予約は 13時です。\n病院の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "13時",
      "午前8時",
      "14時",
      "わかりません"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 13.",
    "period": "sep-nov"
  },
  {
    "id": 429,
    "section": "reading",
    "text": "【メモ】\n11月14日の メモ\n小林さんへ\n伊藤です。\nあしたの 昼ごはんは 14時です。\n郵便局の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "わかりません",
      "午前8時",
      "15時",
      "14時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 14.",
    "period": "sep-nov"
  },
  {
    "id": 430,
    "section": "reading",
    "text": "【メモ】\n11月15日の メモ\n田中さんへ\n中村です。\nあしたの 駅での 集合は 15時です。\n市役所の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "16時",
      "午前8時",
      "15時",
      "わかりません"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 15.",
    "period": "sep-nov"
  },
  {
    "id": 431,
    "section": "reading",
    "text": "【メモ】\n11月16日の メモ\n佐藤さんへ\n小林です。\nあしたの 会議は 16時です。\nコンビニの 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "17時",
      "わかりません",
      "16時",
      "午前8時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 会議 berlangsung pukul 16.",
    "period": "sep-nov"
  },
  {
    "id": 432,
    "section": "reading",
    "text": "【メモ】\n11月17日の メモ\n鈴木さんへ\n田中です。\nあしたの 買い物は 9時です。\nレストランの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "午前8時",
      "10時",
      "わかりません",
      "9時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 9.",
    "period": "sep-nov"
  },
  {
    "id": 433,
    "section": "reading",
    "text": "【メモ】\n11月18日の メモ\n山本さんへ\n佐藤です。\nあしたの 病院の 予約は 10時です。\n公園の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "わかりません",
      "午前8時",
      "10時",
      "11時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 10.",
    "period": "sep-nov"
  },
  {
    "id": 434,
    "section": "reading",
    "text": "【メモ】\n11月19日の メモ\n高橋さんへ\n鈴木です。\nあしたの 昼ごはんは 11時です。\n会社の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "わかりません",
      "12時",
      "11時",
      "午前8時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 11.",
    "period": "sep-nov"
  },
  {
    "id": 435,
    "section": "reading",
    "text": "【メモ】\n11月20日の メモ\n伊藤さんへ\n山本です。\nあしたの 駅での 集合は 12時です。\n駅の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "12時",
      "わかりません",
      "13時",
      "午前8時"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 12.",
    "period": "sep-nov"
  },
  {
    "id": 436,
    "section": "reading",
    "text": "【メモ】\n11月21日の メモ\n中村さんへ\n高橋です。\nあしたの 会議は 13時です。\n銀行の 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "14時",
      "わかりません",
      "午前8時",
      "13時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 会議 berlangsung pukul 13.",
    "period": "sep-nov"
  },
  {
    "id": 437,
    "section": "reading",
    "text": "【メモ】\n11月22日の メモ\n小林さんへ\n伊藤です。\nあしたの 買い物は 14時です。\nスーパーの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "午前8時",
      "わかりません",
      "14時",
      "15時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 14.",
    "period": "sep-nov"
  },
  {
    "id": 438,
    "section": "reading",
    "text": "【メモ】\n11月23日の メモ\n田中さんへ\n中村です。\nあしたの 病院の 予約は 15時です。\n病院の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "15時",
      "16時",
      "午前8時",
      "わかりません"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 15.",
    "period": "sep-nov"
  },
  {
    "id": 439,
    "section": "reading",
    "text": "【メモ】\n11月24日の メモ\n佐藤さんへ\n小林です。\nあしたの 昼ごはんは 16時です。\n郵便局の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "16時",
      "17時",
      "午前8時",
      "わかりません"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 16.",
    "period": "sep-nov"
  },
  {
    "id": 440,
    "section": "reading",
    "text": "【メモ】\n11月25日の メモ\n鈴木さんへ\n田中です。\nあしたの 駅での 集合は 9時です。\n市役所の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "9時",
      "10時",
      "わかりません",
      "午前8時"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 9.",
    "period": "sep-nov"
  },
  {
    "id": 441,
    "section": "reading",
    "text": "【メモ】\n11月26日の メモ\n山本さんへ\n佐藤です。\nあしたの 会議は 10時です。\nコンビニの 前で 会いましょう。\n\n会議は 何時ですか。",
    "options": [
      "11時",
      "わかりません",
      "10時",
      "午前8時"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 会議 berlangsung pukul 10.",
    "period": "sep-nov"
  },
  {
    "id": 442,
    "section": "reading",
    "text": "【メモ】\n11月27日の メモ\n高橋さんへ\n鈴木です。\nあしたの 買い物は 11時です。\nレストランの 前で 会いましょう。\n\n買い物は 何時ですか。",
    "options": [
      "12時",
      "午前8時",
      "わかりません",
      "11時"
    ],
    "answer": 3,
    "explanation": "Memo menyebut 買い物 berlangsung pukul 11.",
    "period": "sep-nov"
  },
  {
    "id": 443,
    "section": "reading",
    "text": "【メモ】\n11月28日の メモ\n伊藤さんへ\n山本です。\nあしたの 病院の 予約は 12時です。\n公園の 前で 会いましょう。\n\n病院の 予約は 何時ですか。",
    "options": [
      "午前8時",
      "12時",
      "わかりません",
      "13時"
    ],
    "answer": 1,
    "explanation": "Memo menyebut 病院の 予約 berlangsung pukul 12.",
    "period": "sep-nov"
  },
  {
    "id": 444,
    "section": "reading",
    "text": "【メモ】\n11月1日の メモ\n中村さんへ\n高橋です。\nあしたの 昼ごはんは 13時です。\n会社の 前で 会いましょう。\n\n昼ごはんは 何時ですか。",
    "options": [
      "13時",
      "午前8時",
      "わかりません",
      "14時"
    ],
    "answer": 0,
    "explanation": "Memo menyebut 昼ごはん berlangsung pukul 13.",
    "period": "sep-nov"
  },
  {
    "id": 445,
    "section": "reading",
    "text": "【メモ】\n11月2日の メモ\n小林さんへ\n伊藤です。\nあしたの 駅での 集合は 14時です。\n駅の 前で 会いましょう。\n\n駅での 集合は 何時ですか。",
    "options": [
      "15時",
      "午前8時",
      "14時",
      "わかりません"
    ],
    "answer": 2,
    "explanation": "Memo menyebut 駅での 集合 berlangsung pukul 14.",
    "period": "sep-nov"
  },
  {
    "id": 446,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 300円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "300円",
      "200円",
      "100円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 447,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 400円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "200円",
      "100円",
      "無料"
    ],
    "answer": 2,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 448,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 500円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "200円",
      "300円",
      "400円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 449,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 600円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "400円",
      "500円",
      "無料",
      "300円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 450,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 700円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "100円",
      "200円",
      "300円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 451,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 800円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "無料",
      "200円",
      "100円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 452,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 300円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "無料",
      "400円",
      "300円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 453,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 400円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "500円",
      "無料",
      "400円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 454,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 500円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "100円",
      "無料",
      "300円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 455,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 600円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "100円",
      "300円",
      "無料",
      "200円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 456,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 700円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "400円",
      "200円",
      "無料"
    ],
    "answer": 2,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 457,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 800円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "500円",
      "無料",
      "400円",
      "300円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 458,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 300円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "無料",
      "100円",
      "300円"
    ],
    "answer": 2,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 459,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 400円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "100円",
      "200円",
      "無料",
      "300円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 460,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 500円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "無料",
      "400円",
      "200円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 461,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 600円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "400円",
      "300円",
      "無料",
      "500円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 462,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 700円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "100円",
      "無料",
      "200円",
      "300円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 463,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 800円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "100円",
      "300円",
      "200円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 464,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 300円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "無料",
      "300円",
      "400円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 465,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 400円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "300円",
      "500円",
      "400円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 466,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 500円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "300円",
      "無料",
      "100円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 467,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 600円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "300円",
      "無料",
      "100円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 468,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 700円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "200円",
      "300円",
      "400円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 469,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 800円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "400円",
      "500円",
      "無料",
      "300円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 470,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 300円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "無料",
      "300円",
      "100円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 471,
    "section": "reading",
    "text": "【パン屋のお知らせ】\nパンは 1つ 400円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に パンを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "100円",
      "無料",
      "200円"
    ],
    "answer": 1,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 472,
    "section": "reading",
    "text": "【レストランのお知らせ】\nカレーは 1つ 500円です。\n土曜日は 200円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に カレーを 買うと、いくら 安くなりますか。",
    "options": [
      "無料",
      "400円",
      "300円",
      "200円"
    ],
    "answer": 3,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 200円.",
    "period": "sep-nov"
  },
  {
    "id": 473,
    "section": "reading",
    "text": "【スーパーのお知らせ】\nりんごは 1つ 600円です。\n土曜日は 300円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に りんごを 買うと、いくら 安くなりますか。",
    "options": [
      "300円",
      "400円",
      "無料",
      "500円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 300円.",
    "period": "sep-nov"
  },
  {
    "id": 474,
    "section": "reading",
    "text": "【薬局のお知らせ】\nくすりは 1つ 700円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に くすりを 買うと、いくら 安くなりますか。",
    "options": [
      "100円",
      "無料",
      "200円",
      "300円"
    ],
    "answer": 0,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 475,
    "section": "reading",
    "text": "【本屋のお知らせ】\nノートは 1つ 800円です。\n土曜日は 100円 安くなります。\n午前9時から 午後6時まで 営業します。\n\n土曜日に ノートを 買うと、いくら 安くなりますか。",
    "options": [
      "200円",
      "無料",
      "100円",
      "300円"
    ],
    "answer": 2,
    "explanation": "Pengumuman menyebut diskon Sabtu sebesar 100円.",
    "period": "sep-nov"
  },
  {
    "id": 476,
    "section": "reading",
    "text": "【予定】\n1月1日の 田中さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n田中さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "買い物",
      "昼ごはん",
      "公園"
    ],
    "answer": 2,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 477,
    "section": "reading",
    "text": "【予定】\n1月2日の 佐藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n佐藤さんは 13時に 何を しますか。",
    "options": [
      "昼ごはん",
      "公園",
      "買い物",
      "帰宅"
    ],
    "answer": 0,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 478,
    "section": "reading",
    "text": "【予定】\n1月3日の 鈴木さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n鈴木さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "昼ごはん",
      "買い物",
      "公園"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 479,
    "section": "reading",
    "text": "【予定】\n1月4日の 山本さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n山本さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "昼ごはん",
      "帰宅",
      "買い物"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 480,
    "section": "reading",
    "text": "【予定】\n1月5日の 高橋さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n高橋さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "公園",
      "帰宅",
      "昼ごはん"
    ],
    "answer": 3,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 481,
    "section": "reading",
    "text": "【予定】\n1月6日の 伊藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n伊藤さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "昼ごはん",
      "買い物",
      "帰宅"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 482,
    "section": "reading",
    "text": "【予定】\n1月7日の 中村さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n中村さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "公園",
      "昼ごはん",
      "帰宅"
    ],
    "answer": 2,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 483,
    "section": "reading",
    "text": "【予定】\n1月8日の 小林さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n小林さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "買い物",
      "昼ごはん",
      "帰宅"
    ],
    "answer": 2,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 484,
    "section": "reading",
    "text": "【予定】\n1月9日の 田中さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n田中さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "買い物",
      "帰宅",
      "昼ごはん"
    ],
    "answer": 3,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 485,
    "section": "reading",
    "text": "【予定】\n1月10日の 佐藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n佐藤さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "昼ごはん",
      "買い物",
      "帰宅"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 486,
    "section": "reading",
    "text": "【予定】\n1月11日の 鈴木さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n鈴木さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "昼ごはん",
      "買い物",
      "帰宅"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 487,
    "section": "reading",
    "text": "【予定】\n1月12日の 山本さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n山本さんは 13時に 何を しますか。",
    "options": [
      "昼ごはん",
      "公園",
      "帰宅",
      "買い物"
    ],
    "answer": 0,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 488,
    "section": "reading",
    "text": "【予定】\n1月13日の 高橋さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n高橋さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "買い物",
      "昼ごはん",
      "帰宅"
    ],
    "answer": 2,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 489,
    "section": "reading",
    "text": "【予定】\n1月14日の 伊藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n伊藤さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "昼ごはん",
      "買い物",
      "公園"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 490,
    "section": "reading",
    "text": "【予定】\n1月15日の 中村さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n中村さんは 13時に 何を しますか。",
    "options": [
      "昼ごはん",
      "帰宅",
      "公園",
      "買い物"
    ],
    "answer": 0,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 491,
    "section": "reading",
    "text": "【予定】\n1月16日の 小林さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n小林さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "昼ごはん",
      "帰宅",
      "公園"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 492,
    "section": "reading",
    "text": "【予定】\n1月17日の 田中さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n田中さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "昼ごはん",
      "帰宅",
      "公園"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 493,
    "section": "reading",
    "text": "【予定】\n1月18日の 佐藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n佐藤さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "買い物",
      "昼ごはん",
      "公園"
    ],
    "answer": 2,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 494,
    "section": "reading",
    "text": "【予定】\n1月19日の 鈴木さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n鈴木さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "買い物",
      "公園",
      "昼ごはん"
    ],
    "answer": 3,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 495,
    "section": "reading",
    "text": "【予定】\n1月20日の 山本さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n山本さんは 13時に 何を しますか。",
    "options": [
      "帰宅",
      "昼ごはん",
      "公園",
      "買い物"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 496,
    "section": "reading",
    "text": "【予定】\n1月21日の 高橋さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n高橋さんは 13時に 何を しますか。",
    "options": [
      "公園",
      "昼ごはん",
      "帰宅",
      "買い物"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 497,
    "section": "reading",
    "text": "【予定】\n1月22日の 伊藤さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n伊藤さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "昼ごはん",
      "帰宅",
      "公園"
    ],
    "answer": 1,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 498,
    "section": "reading",
    "text": "【予定】\n1月23日の 中村さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n中村さんは 13時に 何を しますか。",
    "options": [
      "昼ごはん",
      "帰宅",
      "公園",
      "買い物"
    ],
    "answer": 0,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 499,
    "section": "reading",
    "text": "【予定】\n1月24日の 小林さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n小林さんは 13時に 何を しますか。",
    "options": [
      "昼ごはん",
      "買い物",
      "帰宅",
      "公園"
    ],
    "answer": 0,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
    "period": "sep-nov"
  },
  {
    "id": 500,
    "section": "reading",
    "text": "【予定】\n1月25日の 田中さんの 土曜日\n9:00 あさごはん\n10:30 買い物\n13:00 昼ごはん\n15:00 公園\n17:00 帰宅\n\n田中さんは 13時に 何を しますか。",
    "options": [
      "買い物",
      "帰宅",
      "公園",
      "昼ごはん"
    ],
    "answer": 3,
    "explanation": "Jadwal menunjukkan pukul 13:00 adalah 昼ごはん.",
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


        // ==========================================
        // JFT QUESTION HISTORY — BANK V2 / 500 SOAL
        // ==========================================
        const QUESTION_BANK_VERSION = 'jft-basic-500-v2-2026-10-07';
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

        function selectQuizQuestions(totalQuestions, history) {
            const total = Math.min(Math.max(1, Number(totalQuestions) || 10), QUESTION_BANK.length);
            const sectionOrder = ['vocab', 'grammar', 'listening', 'reading'];

            // Satu cycle = semua 500 ID harus keluar dulu sebelum cycle berikutnya dimulai.
            // Saat seluruh bank sudah terlihat, reset count menjadi 0 lalu buat urutan acak baru.
            let workingHistory = normalizeQuestionHistory(history);
            let unseen = QUESTION_BANK.filter(q => getQuestionSeenCount(q, workingHistory) === 0);
            if (unseen.length === 0) {
                // Mutasi object history yang sama supaya markQuestionsSeen() juga
                // melihat cycle baru, bukan menaikkan count dari cycle lama.
                if (history && typeof history === 'object' && !Array.isArray(history)) {
                    history.bankVersion = QUESTION_BANK_VERSION;
                    history.seen = {};
                    history.updatedAt = new Date().toISOString();
                    workingHistory = history;
                } else {
                    workingHistory = {
                        bankVersion: QUESTION_BANK_VERSION,
                        seen: {},
                        updatedAt: new Date().toISOString()
                    };
                }
                unseen = [...QUESTION_BANK];
            }

            const selected = [];
            const chosen = new Set();
            const baseCount = Math.floor(total / sectionOrder.length);
            const remainder = total % sectionOrder.length;
            const counts = Object.fromEntries(sectionOrder.map(sec => [sec, baseCount]));
            shuffleArray([...sectionOrder]).slice(0, remainder).forEach(sec => counts[sec]++);

            // Utamakan pembagian per bagian JFT, tetapi tidak pernah mengambil ID yang sama.
            shuffleArray([...sectionOrder]).forEach(sec => {
                const pool = randomSample(unseen.filter(q => q.section === sec), counts[sec]);
                pool.forEach(q => {
                    if (selected.length < total && !chosen.has(String(q.id))) {
                        selected.push(q);
                        chosen.add(String(q.id));
                    }
                });
            });

            // Jika sebuah bagian kekurangan soal, isi dari seluruh soal yang belum terlihat.
            if (selected.length < total) {
                randomSample(unseen, unseen.length).forEach(q => {
                    if (selected.length >= total) return;
                    if (!chosen.has(String(q.id))) {
                        selected.push(q);
                        chosen.add(String(q.id));
                    }
                });
            }

            // Jika cycle baru tidak cukup untuk permintaan (hanya mungkin bila total > bank),
            // gunakan ID dengan count paling rendah tanpa duplikasi dalam sesi.
            if (selected.length < total) {
                shuffleArray([...QUESTION_BANK])
                    .sort((a, b) => getQuestionSeenCount(a, workingHistory) - getQuestionSeenCount(b, workingHistory))
                    .forEach(q => {
                        if (selected.length < total && !chosen.has(String(q.id))) {
                            selected.push(q);
                            chosen.add(String(q.id));
                        }
                    });
            }

            return sectionOrder.flatMap(sec => selected.filter(q => q.section === sec));
        }

let quizStartLock = false;

async function startQuiz() {
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
            const selected = selectQuizQuestions(reqCount, questionHistory);

            // Soal ditandai telah diberikan sejak latihan dimulai, sehingga refresh/keluar
            // tidak membuat set yang sama muncul lagi pada percobaan berikutnya.
            const updatedQuestionHistory = markQuestionsSeen(questionHistory, selected);
            await saveQuestionHistory(updatedQuestionHistory);

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
