-- JFT-Basic Practice — Supabase setup for Global Chat media
-- Run this in Supabase SQL Editor after backing up your existing schema.
-- The current app uses a custom login table ("Jft-Basic"), not Supabase Auth.
-- Therefore Storage policies below intentionally use public access for compatibility;
-- do NOT put a Supabase service-role key in the browser.

alter table public.global_chats add column if not exists message_type text not null default 'text';
alter table public.global_chats add column if not exists file_url text;
alter table public.global_chats add column if not exists file_path text;
alter table public.global_chats add column if not exists file_name text;
alter table public.global_chats add column if not exists mime_type text;
alter table public.global_chats add column if not exists file_size bigint;
alter table public.global_chats add column if not exists duration_seconds numeric;

create index if not exists global_chats_message_type_idx on public.global_chats(message_type);

-- Storage bucket: 25 MB per file, common chat media/file types.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media',
  'chat-media',
  true,
  26214400,
  null
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = null;

-- The existing custom-auth application has no auth.jwt() identity to enforce in Storage.
-- Restrict object paths to the chat/ prefix, but allow public read/upload for compatibility.
drop policy if exists "JFT chat media public read" on storage.objects;
create policy "JFT chat media public read"
on storage.objects for select to public
using (bucket_id = 'chat-media' and (storage.foldername(name))[1] = 'chat');

drop policy if exists "JFT chat media public upload" on storage.objects;
create policy "JFT chat media public upload"
on storage.objects for insert to public
with check (bucket_id = 'chat-media' and (storage.foldername(name))[1] = 'chat');

drop policy if exists "JFT chat media public delete" on storage.objects;
create policy "JFT chat media public delete"
on storage.objects for delete to public
using (bucket_id = 'chat-media' and (storage.foldername(name))[1] = 'chat');
