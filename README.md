# JFT-Basic Practice — Modular Vercel Project

This package refactors the previous single `index.html` project into separate pages and shared assets.

## Pages

- `index.html` — login
- `home.html` — main menu
- `quiz.html` — active quiz
- `result.html` — result/certificate
- `history.html` — history
- `admin.html` — admin control panel

## Shared assets

- `assets/css/app.css` — the existing application styling moved out of the HTML files.
- `assets/js/app-legacy.js` — the original application logic, preserved to minimize feature loss.
- `assets/js/resume-router.js` — page routing, session handling, quiz resume, stored result rendering, and home resume card.
- `assets/js/chat-media.js` — image/video/document/audio/voice-note upload and rendering.
- `assets/js/tailwind-config.js` — existing Tailwind configuration.

## Quiz resume

The active quiz is saved under a per-account + per-device localStorage key. Answers, current question, selected questions, start time, and audio-play counts are persisted. Reloading `quiz.html` restores the same attempt instead of sending the user back to the home page.

The home page also shows a Resume card when an unfinished attempt exists.

## Global Chat media

The chat UI now supports:

- images
- video
- semua tipe file, termasuk HTML/CSS/JS/JSON/ZIP dan format lain yang dipilih browser
- normal audio/music files
- voice notes recorded through `MediaRecorder`
- upload progress
- image/video/audio inline playback
- existing tag/reply/edit/delete/room-lock/realtime behavior, termasuk penghapusan file Storage saat pesan media dihapus

Files are stored in Supabase Storage, while `global_chats` stores only message/file metadata.

Run `supabase/chat-media.sql` in Supabase SQL Editor before using media uploads. Jika memakai versi sebelumnya, jalankan SQL ini lagi agar bucket `chat-media` menerima semua MIME type dan policy DELETE ikut dibuat.

### Important security note

The existing project authenticates users by querying the `Jft-Basic` table directly. It does not establish a Supabase Auth session. Because of that, Storage RLS cannot securely identify the application user with `auth.uid()` in this version. The included bucket is therefore public-read/public-upload with a `chat/` path restriction so the feature works with the current architecture. A later Supabase Auth migration would allow user-scoped Storage policies.

## Vercel deployment

No build command is required. Upload the project root as a static Vercel project. `index.html` remains the root entry point. The other pages are normal static HTML files.

For an overwrite deployment, replace the old single-file project with this complete folder rather than deploying an incomplete intermediate state.

## Current Supabase config

The Supabase URL and publishable key from the supplied project were preserved in `assets/js/app-legacy.js` so the current database features keep using the same project.
