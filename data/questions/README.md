# Bank soal berdasarkan kategori

Tambahkan soal ke file JSON sesuai field `section`:
- `vocab.json` — `vocab`
- `grammar.json` — `grammar`
- `listening.json` — `listening` (pertahankan `audioText` jika digunakan)
- `reading.json` — `reading` (pertahankan `visual.title`, `visual.body`, dan `visual.rows` jika ada)

Setiap file harus berupa array JSON. Tiap soal wajib memiliki `id` unik di seluruh kategori, `section`, `text`, `options` (string), `answer` berupa indeks mulai dari 0, dan `explanation`. Soal dengan `visual.type` `passage` atau `message` harus menyimpan cerita lengkap pada `visual.body`.
