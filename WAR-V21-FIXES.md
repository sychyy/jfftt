# War v21 — Second-Match Joiner Redirect Fix

## Root cause

The previous War used `sessionStorage.jft_war_quiz_redirect = "1"` as a one-time redirect guard. When a member finished War 1 and returned to `war.html`, that marker could remain in their browser. During War 2, the room correctly changed to `running`, but the stale marker made `war.html` skip the redirect to `war-quiz.html`. The host did not have the problem because the host explicitly cleared the marker when starting the next War.

## Fixed

### 1. Redirect guard is now per-round
- Added `jft_war_quiz_round`, using the room `started_at` timestamp as the round identifier.
- `war.html` redirects when the current round identifier differs from the stored identifier.
- A stale redirect marker from War 1 can no longer block War 2.

### 2. Clear redirect state when returning to the waiting room
- `enterRoom()` clears both redirect markers when the room is `waiting`.
- `onRoomChange()` also clears them whenever the room returns to `waiting`.
- Returning from War Result therefore starts the next round with a clean redirect state.

### 3. War Quiz distinguishes old and current `finished` status
- `war-quiz.html` no longer treats every `status='finished'` as completion of the current round.
- It compares `completed_at` with the current room `started_at`.
- A `finished` row whose completion time belongs to the previous round is allowed into the new `war-quiz.html`.
- A player genuinely finished in the current round is still redirected to `war-result.html`.

## Features preserved
- Host/Join room flow
- War 1 and subsequent War rounds
- Progress monitoring
- Score/rank system
- Realtime updates
- Reactions
- Result and total War Point system
- Existing Supabase schema
