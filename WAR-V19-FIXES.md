# War v19 — Section Flow + New Match Fixes

- After every player in the active room finishes, the room automatically returns to `waiting` so the host can start a new War immediately.
- The same room can be reused for another War. Starting a new War resets player progress for the new match only when the host presses `Mulai War`.
- War question order now follows the normal quiz section flow: Vocabulary first, then Grammar, Listening, and Reading.
- Question counts are distributed across the four sections and questions are randomized within each section, while every player in the room receives the exact same question IDs/order.
- At each section boundary, War Quiz now shows a custom confirmation modal asking whether to continue to the next section, matching the normal quiz behavior.
- `Kembali` remains available only within the current section, matching the current `quiz.html` behavior.
- Listening audio and transcript controls remain available in War Quiz.
- Answer selection state/animation remains the same option markup used by `quiz.html`.
- Progress tracking keeps the furthest question reached so monitoring does not move backward when a player uses `Kembali`.
- No SQL changes are required for these v19 changes.
