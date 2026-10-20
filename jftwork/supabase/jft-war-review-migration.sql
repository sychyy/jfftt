-- Run this migration in Supabase SQL Editor before deploying this version.
-- Stores each player's answer review so the room can reveal all reviews only after everyone finishes.
alter table public.jft_war_players
  add column if not exists review_data jsonb;

-- Existing broad room/player policies already allow room participants to read player rows.
-- Review UI intentionally withholds review_data until all active players have status=finished.
