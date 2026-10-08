# War v20 — Progress Indicator + Second-Match Fix

## Fixed

### 1. Monitoring progress tidak bergerak
- `war-quiz.html` sekarang memperbarui `maxReached` setiap kali soal dirender.
- Nilai `current_question` yang dikirim ke Supabase memakai progres tertinggi yang sudah dicapai.
- Saat pemain maju dari soal 1 → 2 → 3, monitor lawan sekarang ikut menampilkan `Soal 2/10`, `Soal 3/10`, dan seterusnya.
- Saat memakai `Kembali`, progres monitor tidak mundur karena tetap memakai `maxReached`.

### 2. War kedua tidak masuk ke `war-quiz.html`
- `war.html` sekarang menyinkronkan data `player` lokal dengan row pemain terbaru setiap `refreshPlayers()`.
- Saat room berubah menjadi `running`, `onRoomChange()` mengambil status pemain terbaru langsung dari Supabase sebelum memutuskan redirect.
- Ini mencegah race condition ketika status room berubah menjadi `running` lebih cepat daripada event reset status pemain.
- `startWar()` juga menyinkronkan ulang status host setelah `resetPlayersForNewWar()` sebelum room diubah menjadi `running`.
- Dengan demikian, pemain yang sebelumnya `finished` dapat kembali masuk ke `war-quiz.html` ketika host memulai War berikutnya.

## Fitur yang tidak diubah
- Sistem room Host/Join.
- Jumlah soal 10/20/30/50.
- Pemilihan dan urutan section.
- Randomisasi opsi.
- Sistem skor 0–250 dan rank D/C/B/A/S.
- Realtime monitoring.
- Reaction/emoji.
- Hasil War dan total War Point.
- Database/Supabase schema.

## File yang diubah
- `war-quiz.html`
- `war.html`

## Database
- Tidak ada perubahan SQL/schema.
