-- JFT-Basic Practice — persistent question history for BANK V2 (500 questions)
-- Run once in Supabase SQL Editor. The app falls back to localStorage if this migration has not been run.

alter table public."Jft-Basic"
  add column if not exists question_history jsonb not null
  default jsonb_build_object('bankVersion', '', 'seen', jsonb_build_object());

create index if not exists "Jft-Basic-question-history-version"
on public."Jft-Basic" ((question_history ->> 'bankVersion'));
