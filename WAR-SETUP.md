# JFT-Basic War Room — Setup

## 1. Supabase
Buka Supabase SQL Editor lalu jalankan:

`supabase/jft-war.sql`

SQL tersebut membuat:
- `jft_war_rooms`
- `jft_war_players`
- Realtime untuk room/player
- cleanup TTL room melalui `expires_at` (opsional pg_cron untuk cleanup otomatis)

Emoji **tidak disimpan ke database**. Emoji dikirim lewat Supabase Realtime Broadcast dan UI menghapusnya setelah 10 detik.

## 2. File
`war.html` adalah halaman War Room. `home.html` sudah diberi tombol **WAR ROOM**.

## 3. Sistem skor
- 10 / 20 / 30 / 50 soal
- JFT Score = `benar / total × 250`
- Rank: D <100, C 100–149, B 150–199, A 200–249, S = 250
- War Point = skor akhir pertandingan
- Tidak memakai kecepatan sebagai tie-breaker.
- Minimum waktu: 10 soal 5 menit, 20 soal 10 menit, 30 soal 30 menit, 50 soal 60 menit.

## 4. Sistem soal latihan biasa
Bank terdiri dari 500 ID unik:
- 125 vocab
- 125 grammar
- 125 listening
- 125 reading

Satu ID tidak akan dipilih lagi sampai satu cycle bank selesai. Setelah semua ID habis, cycle di-reset dan urutan diacak lagi.

v15 juga mencegah double-click pada tombol Mulai Latihan agar dua sesi tidak membaca history yang sama secara bersamaan.

## 5. Catatan keamanan
Versi ini mengikuti arsitektur login custom dari proyek sebelumnya dan menggunakan Supabase browser client. Validasi jawaban War dilakukan di browser, sehingga cocok untuk latihan/kompetisi santai. Jika War nantinya dipakai sebagai kompetisi resmi, scoring sebaiknya dipindahkan ke server/Edge Function agar jawaban tidak dapat diperiksa dari source browser.
