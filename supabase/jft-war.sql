-- JFT-Basic WAR mode
-- Run this once in Supabase SQL Editor.
-- Reactions intentionally use Realtime Broadcast, NOT a database table, so they disappear
-- from the database automatically and do not accumulate.

create table if not exists public.jft_war_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_token text not null,
  host_name text not null,
  question_count integer not null check (question_count in (10,20,30,50)),
  question_ids jsonb not null default '[]'::jsonb,
  status text not null default 'waiting' check (status in ('waiting','running','finished','closed')),
  started_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '2 hours')
);

create table if not exists public.jft_war_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.jft_war_rooms(id) on delete cascade,
  player_token text not null,
  player_name text not null,
  role text not null default 'member' check (role in ('host','member')),
  status text not null default 'waiting' check (status in ('waiting','running','finished','kicked','left')),
  current_question integer not null default 0,
  current_section text,
  elapsed_seconds integer not null default 0,
  correct integer not null default 0,
  score integer not null default 0,
  completed_at timestamptz,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(room_id, player_token)
);

create index if not exists jft_war_rooms_code_idx on public.jft_war_rooms(code);
create index if not exists jft_war_players_room_idx on public.jft_war_players(room_id);
create index if not exists jft_war_rooms_expires_idx on public.jft_war_rooms(expires_at);

-- The project currently uses its own login layer rather than Supabase Auth,
-- so these policies intentionally allow the browser client to operate the room.
-- The application still uses random room/player/host tokens to identify sessions.
alter table public.jft_war_rooms enable row level security;
alter table public.jft_war_players enable row level security;

drop policy if exists "jft war rooms anon access" on public.jft_war_rooms;
create policy "jft war rooms anon access"
on public.jft_war_rooms for all
to anon, authenticated
using (true) with check (true);

drop policy if exists "jft war players anon access" on public.jft_war_players;
create policy "jft war players anon access"
on public.jft_war_players for all
to anon, authenticated
using (true) with check (true);

-- Realtime is used for synchronized start, roster/progress updates and kicks.
do $$
begin
  alter publication supabase_realtime add table public.jft_war_rooms;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.jft_war_players;
exception when duplicate_object then null;
end $$;

-- Optional cleanup. If pg_cron is enabled in your Supabase project, uncomment:
-- select cron.schedule(
--   'jft-war-cleanup',
--   '*/10 * * * *',
--   $$delete from public.jft_war_rooms where expires_at < now();$$
-- );
