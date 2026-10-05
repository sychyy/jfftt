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
