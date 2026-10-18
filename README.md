JFT-Basic v10

Perbaikan: toast selalu di atas modal pengumuman dan audio pengumuman mendapat border/visual card yang lebih kuat.

# JFT-Basic Practice — v6

Pembaruan v6 berfokus pada Pusat Pengumuman di Home dan rich media.

## Pusat Pengumuman
- Pengumuman berada di **Home**, bukan di dalam Global Chat.
- Dibuka lewat kartu **Pengumuman**.
- Daftar pengumuman tampil sebagai list; isi baru terbuka setelah item dipilih.
- Setiap item menampilkan hari, tanggal, bulan, tahun, dan jam sebelum dibuka.
- Admin dapat membuat pengumuman dengan **judul**, isi, serta satu lampiran foto/video/lagu.
- Pengumuman aktif selama 24 jam dan dapat dihapus manual oleh admin.
- Pengumuman yang dibuka akan ditandai sudah dibaca; indikator unread hilang.
- Media tampil di atas isi pengumuman. Audio menggunakan player tema JFT, bukan kontrol source bawaan.
- Media yang sudah kedaluwarsa atau dihapus akan dibersihkan dari Storage saat admin membuka pusat pengumuman.

## Rich link
- `https://jft.shuraa.web.id` memiliki kartu khusus JFT-Basic.
- Link TikTok, termasuk `vt.tiktok.com`, memiliki kartu khusus TikTok dengan tombol buka dan salin.

## Database
Jalankan kembali `supabase/chat-media.sql` di Supabase SQL Editor agar kolom pengumuman/media terbaru tersedia.


### Mode video pengumuman
Video pengumuman sekarang punya dua mode: `Video` (bisa pause/seeking) dan `GIF` (autoplay, muted, loop terus tanpa kontrol pause). Tambahkan kolom `media_mode` ke tabel `chat_announcements` melalui SQL terbaru.


## v9 update
- Removed the visible GIF loop overlay from announcement media.
- Upgraded announcement audio to a custom interactive player with seek, +/-10s and speed controls.
- Added desktop-only refinements at 900px+ while preserving the existing mobile layout.


## v11 — Bank Soal & Anti-Pengulangan
- Bank soal utama diganti total menjadi **500 soal baru** (ID 1–500).
- Pembagian bank: **125 Vocabulary, 125 Grammar, 125 Listening, 125 Reading**.
- Teks soal baru tidak sama dengan 490 soal lama yang diganti.
- Pemilihan soal memprioritaskan **100% soal yang belum pernah diberikan** kepada akun tersebut.
- Riwayat versi bank disimpan dengan versi `jft-basic-500-v2-2026-10-07`, sehingga riwayat bank lama tidak mengganggu bank baru.
- Riwayat disinkronkan ke Supabase melalui kolom `question_history`; bila kolom belum tersedia, aplikasi otomatis memakai `localStorage` sebagai fallback.

### Aktivasi anti-pengulangan lintas perangkat
Jalankan `supabase/question-history.sql` sekali di Supabase SQL Editor. Alternatifnya, perubahan yang sama juga sudah dicantumkan di akhir `supabase/chat-media.sql`.


## v14 — Fix Mulai Latihan
- Memperbaiki tombol "Mulai Latihan" yang sebelumnya dapat menampilkan pesan gagal setelah sesi selesai.
- Tombol sekarang memakai ID khusus dan memanggil `window.startQuiz()` secara eksplisit.
- State quiz dan bank soal diekspos melalui bridge `window.JFT_STATE`, `window.JFT_QUESTION_BANK`, dan `window.JFTQuiz` agar tidak bentrok dengan fungsi lama.
- Koneksi/permintaan Supabase tidak lagi menjadi syarat untuk memulai latihan; localStorage dipakai sebagai fallback.
- Sinkronisasi riwayat online diberi batas waktu agar kegagalan jaringan/database tidak mengunci tombol.
- Progres sesi lama selalu dibersihkan sebelum membuat sesi latihan baru.


## Reading / Dokkai update
- Reading question text no longer includes generated labels such as `読解問題 638`.
- Reading includes 160 passage-based comprehension items with varied everyday situations.
- Visual-based Reading items remain available; passage cards are rendered from the JSON `visual` object (`type: "passage"`, `title`, `body`).
- The question bank contains 1,000 unique IDs and unique question-text strings; visual and passage content are stored in `data/questions/` and rendered by the shared module `assets/js/core/question-bank.js`.

## Pembaruan fitur (15 Oktober 2026)
- Pemilihan soal menyaring duplikasi berdasarkan isi soal, opsi, audio, dan materi visual; ID tetap tidak berulang dalam satu sesi. Bank berisi 1.000 item: 179 Vocabulary, 145 Grammar, 338 Listening, dan 338 Reading. Jumlah per kategori memang tidak sama; pemilih soal berusaha membagi kategori secara seimbang pada setiap sesi.
- Home memiliki toggle Listening ON (audio/TTS tanpa transkrip) / OFF (transkrip teks tanpa tombol audio); mode tersimpan di perangkat dan diterapkan saat latihan dimulai.
- Audio saat mengerjakan dibatasi dua kali putar per soal; layar review hasil memiliki pemutaran ulang terpisah. Dialog A/B dipisah menjadi giliran suara dan mencoba memilih voice Jepang berbeda berdasarkan nama/label gender yang tersedia di perangkat/browser.
- Halaman hasil mengelompokkan jawaban salah per Vocabulary, Listening, Grammar, dan Reading. Kesalahan listening menampilkan transkrip dan tombol untuk memutar ulang audionya.
- Dukungan furigana tersedia untuk teks yang ditulis dengan format `{漢字|かんじ}`; rendering ruby akan menampilkan bacaan di atas kanji. Kanji pada soal kosakata juga mendapat tampilan visual yang lebih menonjol.
- Tidak ada perubahan skema, SQL, RLS, atau konfigurasi Supabase.

Catatan TTS: pemilihan suara memakai Web Speech API dan voice Jepang yang dipasang/ditawarkan browser atau sistem operasi. Ketersediaan suara laki-laki/perempuan dan label gender bergantung pada perangkat; ini bukan bundel engine open-source yang dijamin sama di semua perangkat.


## Listening TTS (male/female voices)

The quiz now routes dialogue through `window.JFTSpeakDialogue`. Browser-native Japanese voices are selected by voice-name hints when available, but browser/Android voice inventories vary and do not expose a reliable gender field. For deterministic separate voices, configure a separately hosted VOICEVOX Engine and set `window.JFT_VOICEVOX_ENDPOINT` to its HTTPS base URL before `assets/js/core/resume-router.js` loads. Default speaker IDs are female `2` (Shikoku Metan) and male `13` (Aoyama Ryusei); override with `window.JFT_VOICEVOX_FEMALE_ID` and `window.JFT_VOICEVOX_MALE_ID` if your engine's speaker list differs. The VOICEVOX engine is an HTTP server and is not hosted by static Vercel pages themselves. Ensure the remote engine permits browser CORS requests and use a trusted deployment.

Listening playback during an attempt is limited to two plays per question (including when navigating away and back). The result/review screen uses a separate replay path and has no play limit. War question selection now filters duplicate content and tracks used question IDs locally per account/device, starting a new cycle only when the available unique bank is exhausted.


## Bank soal dan struktur folder (revisi)

- `data/questions/vocab.json`: soal Vocabulary.
- `data/questions/grammar.json`: soal Grammar.
- `data/questions/listening.json`: soal Listening, termasuk `audioText`.
- `data/questions/reading.json`: soal Reading dan materi `visual` seperti `title`, `body`, serta `rows`.
- `assets/js/core/question-bank.js`: loader, validasi, pemilihan seimbang, dan renderer bersama.
- `assets/js/quiz/app-legacy.js`: logika latihan biasa.
- `assets/js/war/war-quiz.js`: logika War; monitoring pemain, reaction, dan skor tetap khusus War.
- `assets/js/chat/`, `assets/js/audio/`, `assets/js/ui/`: modul berdasarkan fungsi.

Untuk menambah soal, tambahkan objek ke file JSON kategori yang sesuai. Kedua mode memuat soal melalui `JFTQuestionBank`; tidak perlu menggandakan soal di file JavaScript.


## Pembaruan mode Kanji dan perbaikan bank soal

- `kanji.html` adalah mode latihan kanji terpisah dari simulasi JFT, Hiragana, dan Katakana.
- `data/kanji-bank.json` memuat **1.858 entri kosakata berkanji unik** yang diekstrak dari PDF `KOSA KATA BAB 1-50.pdf`, beserta kana sumber dan arti bahasa Indonesia. Romaji dibuat dari kana saat latihan.
- Mode Kanji menyediakan jumlah 10, 20, 30, 40, 50, 60, 70, 80, 90, atau 100 soal; jawaban dapat dipilih berdasarkan arti atau romaji.
- Jumlah soal simulasi JFT di Home dan War dibatasi menjadi 10, 20, 30, 40, atau 50.
- Mode Kanji di Home berjalan sebagai latihan mandiri; pada War, host dapat memilih mode Kanji agar semua pemain satu room mengerjakan set soal yang sama. Pilihan jumlah soal War tetap 10, 20, 30, 40, atau 50.
- Tampilan Admin Bank Soal dibuat lebih defensif terhadap soal yang tidak memiliki `options`, teks, atau penjelasan.

Catatan: daftar PDF merupakan kosakata Bab 1–50, bukan daftar resmi JLPT yang memberi label level N5/N4 per kata. Karena itu, jumlah 1.858 merujuk pada entri kosakata berkanji dari PDF, bukan klaim bahwa setiap entri telah diverifikasi sebagai kanji resmi N5/N4 atau pasti muncul di JFT.


## Perbaikan mode Kanji dan War multiplayer
- Mode Kanji ada di samping tombol Hiragana dan Katakana di Home.
- Mode Kanji solo mendukung level N5 (Bab 1–25), N4 (Bab 26–50), gabungan N5+N4, jumlah 10–100, jawaban arti Indonesia atau romaji, dan koreksi soal salah setelah sesi selesai.
- War sekarang menyediakan mode JFT atau Kanji. Host memilih level kanji dan jenis jawaban; semua pemain mengerjakan set soal Kanji yang sama.
- **Penting untuk database Supabase yang sudah aktif:** jalankan `supabase/kanji-war-migration.sql` sekali di Supabase SQL Editor sebelum menggunakan War Kanji. File `supabase/jft-war.sql` juga sudah diperbarui untuk instalasi baru.
- Pembagian Bab 1–25 menjadi N5 dan Bab 26–50 menjadi N4 mengikuti permintaan sebagai pengelompokan latihan; ini bukan klaim pemetaan level JLPT resmi.
- Pilihan pengecoh diprioritaskan dari kosakata sejenis, bab berdekatan, serta panjang arti/bacaan yang mirip agar jawaban benar tidak terlalu mudah ditebak.


## Flashcard Kanji — progres database
- Jalankan `supabase/kanji-flashcard-progress.sql` sekali di Supabase SQL Editor.
- Progres menyimpan status `known`/`unknown`, jumlah lupa, dan waktu pembaruan per kosakata.
- Progres disinkronkan berdasarkan ID perangkat; jika database tidak tersedia, browser memakai cadangan lokal.
- `flashcards.html` memiliki daftar semua kosakata, pencarian, kategori, status hafalan, jumlah lupa, dan tombol menghafal/latihan ulang.
- Pada kuis Kanji, mode romaji menampilkan arti sebagai petunjuk; mode arti menampilkan hiragana. Hasil menampilkan jawaban yang dipilih dan koreksi.
