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
