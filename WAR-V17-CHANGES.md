# WAR v17 — bug fixes

- `war.html` is now room/lobby only. Reaction UI has been removed from the room.
- A player whose War status is `finished` stays in `war.html` after returning from `war-result.html`, even while other players are still playing.
- `war.html` no longer redirects a finished player back to `war-quiz.html`.
- New rooms clear the old quiz-redirect flag so a new War starts normally.
- `war-quiz.html` uses one shared Realtime broadcast channel per room, so opponents can actually receive reactions.
- Reaction popups disappear after 2 seconds; sender cooldown remains 5 seconds.
- Answer options now show a clear selected/click animation and selected state, following the visual behavior of `quiz.html` more closely.
- `war-quiz.html` blocks re-entry for players already marked `finished`.
- War completion still goes directly to `war-result.html` without waiting for the target time.
