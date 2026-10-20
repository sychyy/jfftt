# Paket perbaikan bank soal JFT Basic

Paket ini mengganti bank soal lama dengan materi dari empat PDF Simulasi JFT Basic yang diberikan. Sebelum penggantian, bank lama disimpan di folder `backup-old-question-bank/`.

- `data/questions/vocab.json`: 20 soal Script and Vocabulary dari setiap PDF.
- `data/questions/grammar.json`: 10 soal Grammar dari setiap PDF dan soal Conversation and Expression yang tersedia.
- `data/questions/listening.json`: 5 soal choukai dari setiap PDF.
- `data/questions/reading.json`: kosong karena PDF sumber tidak memiliki bagian Reading Comprehension terpisah; soal reading lama tidak dipertahankan agar tidak bercampur dengan bank baru.
- `assets/imported/question-crops/`: potongan gambar halaman asli untuk ditampilkan bersama soal.

**Catatan penting:** PDF sumber tidak menyertakan audio choukai. Jalur file audio disiapkan di field `audioSrc` (mis. `assets/audio/choukai/basic1-q1.mp3`), tetapi audio tersebut belum tersedia di paket. Untuk soal yang pilihan jawabannya berupa gambar dan tidak terbaca sebagai teks, potongan halaman asli tetap disertakan.
