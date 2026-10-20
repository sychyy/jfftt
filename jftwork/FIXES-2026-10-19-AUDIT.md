# Audit & Fixes — 2026-10-19

- Hyōgen / 表現の50問（ID 801–850）を `grammar.json` に統合。
- `section` はすべて `grammar` に統一し、独立した `hyogen.json` は削除。
- UI と WAR のカテゴリ表示を `Grammar & Expressions / 文法・表現` に統合。
- Vocabでインドネシア語が選択肢に入っていた25問を、日本語の選択肢・日本語の解説へ修正。
- ID一意性・JSON妥当性・重複キー・選択肢のラテン文字混入を検査。

## 件数
- Vocab: 84
- Grammar + Expressions: 151
- Listening: 102
- Reading: 67
- Total: 404

## 2026-10-19 — War question/review corrections
- Removed the generic fill-in instruction from non-grammar questions; the instruction now appears only when a grammar item actually contains a blank, or when a question defines its own instruction.
- Fixed grammar question ID 77: `窓を開けて（　）ください。` now uses `おいて` as the correct option, avoiding the malformed `くださいください` answer.
- Review cards now preserve the complete question and show all options, highlighting the correct option, plus the player's answer and the answer key.
- Added `supabase/jft-war-review-migration.sql` to add `review_data` for cross-player answer review. Apply this SQL in Supabase before deploying; team reviews stay hidden until every active player is finished.
- Validation: JSON parse, option uniqueness and answer-index checks pass for all 4 question banks (404 questions total); `node --check` passes for the modified War quiz and result scripts.
