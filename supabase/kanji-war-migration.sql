-- Jalankan sekali di Supabase SQL Editor setelah memperbarui website.
-- Menambahkan mode Kanji ke War dan memastikan jumlah soal 40 diterima juga.
alter table public.jft_war_rooms
  add column if not exists quiz_mode text not null default 'jft',
  add column if not exists kanji_level text not null default 'all',
  add column if not exists kanji_answer_mode text not null default 'meaning';

alter table public.jft_war_rooms drop constraint if exists jft_war_rooms_question_count_check;
alter table public.jft_war_rooms drop constraint if exists jft_war_rooms_quiz_mode_check;
alter table public.jft_war_rooms drop constraint if exists jft_war_rooms_kanji_level_check;
alter table public.jft_war_rooms drop constraint if exists jft_war_rooms_kanji_answer_mode_check;

alter table public.jft_war_rooms
  add constraint jft_war_rooms_question_count_check check (question_count in (10,20,30,40,50)),
  add constraint jft_war_rooms_quiz_mode_check check (quiz_mode in ('jft','kanji')),
  add constraint jft_war_rooms_kanji_level_check check (kanji_level in ('n5','n4','all')),
  add constraint jft_war_rooms_kanji_answer_mode_check check (kanji_answer_mode in ('meaning','romaji'));
