# Import bank soal JFT — tahap persiapan

## Status
- Source code web asli dipertahankan, termasuk 4 bank soal lama.
- PDF SIMULASI JFT BASIC 1–4 disimpan di `source_pdfs/`.
- Tiap halaman PDF dirender menjadi gambar di `assets/imported/basicN/page-NN.jpg` agar tampilan asli dan gambar soal tidak hilang.
- Gambar yang tertanam di PDF diekstrak ke `assets/imported/basicN/`.
- Teks halaman hasil ekstraksi ada di `assets/imported/basicN/pages.json`.
- Ringkasan jumlah halaman dan gambar ada di `IMPORT-INVENTORY.json`.

## Penting
Ini adalah paket staging/backup, belum mengganti `data/questions/*.json`. Jangan hapus bank soal lama sampai soal per nomor, kunci, gambar, dan audio selesai dipetakan serta diuji di UI.

## Pembagian kategori awal
- Soal 1–20 pada bagian “Script and Vocabulary” dipetakan awal ke Vocabulary.
- Soal 21–30 pada bagian tersebut perlu dipetakan ke Grammar berdasarkan bentuk soal.
- “Conversation and Expression” dipetakan ke Grammar/Expression.
- Bagian Listening dipetakan ke Listening. Audio belum disertakan dalam PDF; file audio pengguna akan dicocokkan berdasarkan nomor soal.
- PDF yang diterima belum menunjukkan bagian Reading yang berdiri sendiri. Jika ada PDF Reading, kirim terpisah.

## Langkah selanjutnya
1. Memetakan soal dan kunci jawaban per nomor dari PDF.
2. Memasangkan gambar dengan nomor soal (bukan hanya halaman PDF).
3. Menautkan audio choukai berdasarkan judul/nomor yang pengguna berikan.
4. Menguji semua kategori, lalu baru mengganti bank soal lama.
