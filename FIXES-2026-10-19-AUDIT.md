# Audit & Fixes — 2026-10-19

## Sumber materi soal
Soal baru disusun dengan cakupan materi Minna no Nihongo I & II (Bab 1–50) dan data Kanji yang sudah menjadi bagian project. Soal tidak disalin verbatim dari buku. PDF Minna yang dilampirkan berupa scan sehingga ekstraksi teks otomatis tidak tersedia; karena itu laporan ini tidak mengklaim kutipan langsung dari PDF.

## Data
- Sebelum: Vocab 50, Grammar 50, Listening 50, Reading 50.
- Vocab: hapus 16 soal tipe “makna yang mendekati”; tambah 50 soal baru; akhir 84.
- Grammar: tambah 51 soal baru; akhir 101.
- Listening: tambah 52 soal baru; akhir 102.
- Reading: hapus 40 varian duplikat berbasis bacaan yang sama; tambah 57 soal baru; akhir 67.
- Kanji bank: 1.858 entri; tidak diubah.
- Semua 354 ID soal lintas kategori sekarang unik.
- Tidak ada duplikat berdasarkan `section + pertanyaan + pilihan` setelah normalisasi.

## Perbaikan kode
- `question-bank.js`: identitas duplikat sekarang memakai pertanyaan + pilihan yang dinormalisasi, bukan ID saja.
- Quiz biasa: daftar soal tetap disimpan dalam sesi aktif; refresh memulihkan daftar dan posisi yang sama. Tombol kembali tidak lagi dibatasi pergantian kategori.
- WAR: daftar soal tetap berasal dari `question_ids` room sehingga browser peserta tidak melakukan randomisasi daftar secara independen. Start host diberi guard terhadap klik ganda dan update room memakai status `waiting` sebagai guard.
- WAR monitoring: live monitor tidak lagi mengambil/menampilkan `correct` dan `score`; selama ronde berjalan progres hanya berupa posisi, kategori, waktu, dan status.
- WAR: payload Kanji yang disimpan ke room tidak lagi menyertakan indeks `answer`.
- Reaksi emoji dan listener realtime yang sudah ada dipertahankan, bukan dibuat ulang.
- Note: pencarian database tetap memakai debounce 220 ms; pencarian catatan pribadi juga diberi debounce 220 ms. Penambahan item identik dicegah.
- Renshuu: mode Kotoba sekarang menampilkan kana sebagai pertanyaan dan opsi kana dari item lain; pengecoh diprioritaskan berdasarkan kemiripan jarak kana.
- Dokkai: semua 67 penjelasan sekarang menjelaskan bukti dari bacaan; penjelasan lama yang terlalu generik diganti hanya pada soal yang memang perlu diperjelas.

## Pengujian yang dilakukan
- JSON seluruh 5 kategori berhasil diparse; jumlah aktual: Vocab 84, Grammar 101, Hyōgen 50, Listening 102, Reading 67 (total 404).
- Fungsi pemilih latihan biasa diuji dengan harness Node terpisah: sesi khusus Hyōgen 50 soal memiliki 50 ID unik; sesi campuran menghormati riwayat soal Hyōgen; cycle Hyōgen berikutnya tetap menghasilkan soal unik.
- Semua soal memiliki tepat 4 opsi, opsi unik, dan indeks jawaban valid.
- Semua 404 ID global unik setelah kategori Hyōgen ditambahkan.
- Tidak ada ID duplikat atau content key duplikat (kategori + stem + opsi ternormalisasi) pada bank setelah perubahan.
- Tidak ada lagi pola pertanyaan Vocab “意味に近い/近い表現”.
- JavaScript `question-bank.js`, `app-legacy.js`, `war-quiz.js`, dan `resume-router.js` lolos syntax check Node.
- Inline JavaScript `war.html` dan `note.html` lolos syntax check.
- Pemeriksaan source memastikan monitor WAR tidak lagi merender jumlah benar/skor saat ronde aktif.

## Belum dapat dilakukan
- Pengujian multiplayer WAR end-to-end dengan beberapa perangkat tidak dapat dilakukan di lingkungan offline ini karena membutuhkan Supabase Realtime/database yang benar-benar aktif.
- Keamanan penuh terhadap peserta yang sengaja membuka file bank soal publik belum dapat dijamin oleh arsitektur static JSON saat ini. Perubahan ini menghilangkan kunci dari payload room Kanji dan menghilangkan skor/kebenaran dari live monitoring, tetapi JFT answer index masih ada di bank soal publik yang memang dipakai latihan biasa. Untuk kerahasiaan kunci yang benar-benar server-side, bank WAR perlu dipisahkan ke endpoint/RPC server yang hanya mengirim soal tanpa kunci dan memvalidasi jawaban di server.
- PDF Minna yang dilampirkan adalah scan dan tidak memiliki text layer yang dapat diekstrak secara andal; soal baru karena itu disusun berdasarkan cakupan Minna I/II yang sudah tercermin pada bank project, bukan diklaim sebagai transkripsi PDF.


## Addendum — Hyōgen / Ekspresi (19 Oktober 2026)
- Temuan: bank soal kanonis hanya mendaftarkan `vocab`, `grammar`, `listening`, dan `reading`. Label `会話と表現` sebelumnya ditempel pada `grammar`, sehingga tidak ada kumpulan soal Hyōgen terpisah.
- Perbaikan: menambahkan `data/questions/hyogen.json` (50 soal dengan ID 801–850), memasukkan `hyogen` ke loader dan `SECTION_ORDER`, membagi label Grammar/Hyōgen, memperbarui label latihan/monitoring WAR dan ringkasan hasil, serta menaikkan versi riwayat bank.
- Perubahan data: Vocab 84, Grammar 101, Hyōgen 50 (baru), Listening 102, Reading 67; total 404 soal.
- Catatan: pertanyaan ditulis baru berdasarkan ungkapan sehari-hari dan lingkup pelajaran 1–50 Minna no Nihongo I & II; PDF yang diunggah tidak diekstrak penuh menjadi teks, sehingga audit ini tidak mengklaim penyalinan/penjodohan halaman demi halaman dengan PDF.
- Pengujian: validasi JSON/ID/opsi/kunci/duplikasi dan syntax check lokal dilakukan setelah patch; browser end-to-end dan multiplayer Supabase Realtime belum dijalankan di lingkungan ini.
- UI: menambahkan pemilih kategori di Home (termasuk mode khusus Hyōgen); sesi kategori khusus hanya mengambil dari kategori terpilih dan tidak mengisi sisa jumlah dengan kategori lain. Jika soal unseen kurang dari jumlah yang diminta, aplikasi memberi notifikasi dan tidak mengulang dalam sesi.
- Pemilihan daftar soal pada JFT sebelumnya menyaring berdasarkan teks pertanyaan saja; itu membuang beberapa soal Listening yang memakai instruksi umum tetapi opsi berbeda. Pemilihan kini memakai `JFTQuestionBank.uniqueBank()` yang sudah ada, sehingga menggunakan identitas teks + pilihan yang dinormalisasi tanpa menambah sistem duplikat kedua.
