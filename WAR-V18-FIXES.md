# War v18 — UI / Toast Fixes

- War Quiz option markup now uses the exact `option-label` / `option-input` classes used by `quiz.html`, restoring the selected-answer animation and teal selected state.
- Selecting an answer no longer locks all options; the selected option can still be changed before pressing Next, matching the normal quiz flow.
- Correct/wrong colors are not revealed on selection; grading remains for the result.
- `correct` count is recalculated from all current answers when an answer changes.
- Standard browser `alert()` notifications in War pages were replaced with the existing styled toast presentation.
- Closed-room joins show a styled `Room sudah ditutup.` toast.
- If a running War room is closed, War Quiz shows the same styled toast before redirecting.
- Kick / missing-session / missing-question-bank notifications use styled toasts too.
- Reaction popup remains 2 seconds; reaction cooldown remains 5 seconds.
- `quiz.html` itself was not changed.
