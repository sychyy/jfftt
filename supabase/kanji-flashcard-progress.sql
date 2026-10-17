-- Progres flashcard Kanji: status hafal, jumlah lupa, dan waktu update.
-- Jalankan sekali di Supabase SQL Editor.
create table if not exists public.kanji_flashcard_progress (
  device_id text not null,
  kanji text not null,
  status text not null default 'unknown' check (status in ('known','unknown')),
  forget_count integer not null default 0 check (forget_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (device_id, kanji)
);
alter table public.kanji_flashcard_progress enable row level security;
drop policy if exists "Kanji progress read for app" on public.kanji_flashcard_progress;
drop policy if exists "Kanji progress insert for app" on public.kanji_flashcard_progress;
drop policy if exists "Kanji progress update for app" on public.kanji_flashcard_progress;
create policy "Kanji progress read for app" on public.kanji_flashcard_progress for select to anon, authenticated using (true);
create policy "Kanji progress insert for app" on public.kanji_flashcard_progress for insert to anon, authenticated with check (true);
create policy "Kanji progress update for app" on public.kanji_flashcard_progress for update to anon, authenticated using (true) with check (true);

-- Izinkan perangkat menghapus progres miliknya saat fitur Reset progres kanji digunakan.
drop policy if exists "Kanji progress delete for app" on public.kanji_flashcard_progress;
create policy "Kanji progress delete for app" on public.kanji_flashcard_progress for delete to anon, authenticated using (true);
