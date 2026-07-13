# Langy Production Worklog

## 2026-07-13 12:29 +03:00 - Stage 0 Inventory

### Repository state

- Active root: `C:\Users\chura\AppData\Local\Temp\langy-audit-20260713-013504\Langy`
- Branch: `codex/langy-phase3-commercial-core`
- HEAD before this block: `2a16ef0`
- Pre-existing dirty files preserved and not edited in this block:
  - `src/screens/daily.js`
  - `src/screens/donation.js`
  - `src/screens/profile.js`
  - `src/screens/results.js`
  - `src/screens/subscription.js`
  - `src/screens/talk.js`
  - `src/utils/animations.js`
  - `src/utils/state.js`
  - `src/data/vocab-banks.js.bak`
  - `tests/qa-matrix.js`

### Completed tasks

- Checked git status and recorded the dirty working tree.
- Added a reproducible Stage 0 inventory command: `npm run inventory:production`.
- Confirmed Phase 1 and Phase 3 reports exist in the active root.
- Confirmed Phase 2 report is missing from the active root.
- Captured current curriculum counts from the active `src/data/curriculum.js`.
- Ran the curriculum validator through the same VM loading path used by `scripts/validate-curriculum.mjs`.
- Found the active legacy curriculum/data shape.
- Ran a conservative static UI button and placeholder scan.
- Created this worklog.
- Created `langy-production-state.json` for future continuation.

### Changed files in this block

- `package.json`
- `scripts/production-inventory.mjs`
- `LANGY_PRODUCTION_WORKLOG.md`
- `langy-production-state.json`

### Curriculum counts

- Textbooks: 9
- Units: 108
- Exercises: 956
- Languages:
  - English: 7 textbooks, 97 units, 887 exercises
  - Spanish: 1 textbook, 3 units, 16 exercises
  - Arabic: 1 textbook, 8 units, 53 exercises
- English levels:
  - Pre-A1: 6 units, 31 exercises
  - A1: 18 units, 153 exercises
  - A2: 16 units, 129 exercises
  - B1: 16 units, 142 exercises
  - B2: 15 units, 173 exercises
  - C1: 14 units, 156 exercises
  - C2: 12 units, 103 exercises
- Exercise types:
  - `fill-bubble`: 502
  - `match-pairs`: 91
  - `speak-aloud`: 110
  - `listen-type`: 62
  - `word-shuffle`: 88
  - `type-translation`: 103
- Unit editorial status:
  - `needs_editorial_review`: 97
  - `missing`: 11

### Validation and build

- `npm run inventory:production`: pass
- `npm run validate`: pass
  - Curriculum validation: pass, 0 errors, 0 warnings
  - ESLint: 0 errors, 53 warnings
  - Vitest: 3 files passed, 66 tests passed
  - Test stderr includes expected negative-path logs from existing resilience tests.
- `npm run build`: pass
  - Vite warns that many `index.html` scripts are non-module scripts and cannot be bundled.

### Legacy curriculum findings

- Active curriculum is still monolithic: `src/data/curriculum.js` (404238 bytes).
- Active vocabulary bank is still monolithic: `src/data/vocab-banks.js` (767955 bytes).
- Additional language vocab files exist: `src/data/vocab-banks-ar.js`, `src/data/vocab-banks-es.js`.
- Untracked backup exists: `src/data/vocab-banks.js.bak`.
- No `src/content` course-pack root exists yet.
- Legacy/generated scripts still exist:
  - `src/scripts/clean_all_emojis.cjs`
  - `src/scripts/clean_final.cjs`
  - `src/scripts/replace_emojis.cjs`
  - `scripts/expand-ar-es.cjs`
  - `scripts/expand-ar-es-2.cjs`
  - `scripts/expand-ar-es-3.cjs`
  - `scripts/gen-ar-es-banks.cjs`
  - `scripts/gen-phrases-a1.cjs`
  - `scripts/migrate-vocab.cjs`

### Button and placeholder audit

- Static scan inspected 175 rendered `<button>` snippets.
- Open context-dependent button candidates:
  - `src/utils/coach-intel.js:268` - `coach-focus-next`
  - `src/utils/coach-intel.js:308` - `coach-practice-profile`
  - `src/utils/coach-intel.js:445` - `coach-practice-summary`
- These coach buttons are currently handled from screen files (`src/screens/profile.js`, `src/screens/talk.js`) rather than from the utility that renders them. This is not proven dead, but it is fragile and must be normalized in a later UI action pass.
- Static no-stable-action candidates that need manual review:
  - `src/screens/grammar.js:91` level selector button; likely handled by delegated `[data-level]` listener.
  - `src/screens/home.js:839` onboarding tooltip button; handled by `.onboarding-tooltip__btn`.
  - `src/screens/learning.js:897` summary finish button; parser false positive from dynamic class string, handled by `#summary-finish`.
  - `src/screens/profile.js:170` premium banner nested button; parent banner click handles it.
  - `src/screens/subscription.js:275` and `src/screens/subscription.js:299` plan CTA buttons; parent `.plan-card` click handles them.
- Production-risk placeholder/fake markers include:
  - `src/screens/auth.js:162` and `src/screens/auth.js:165` social login buttons still show "coming soon".
  - `src/screens/profile.js:421` premium plans still have "coming soon" fallback.
  - `src/screens/inventory.js:25` still uses GLB model placeholder text.
  - `src/utils/ai.js:534` still has mock/offline response fallback text.
  - `src/main.js:56` and `src/main.js:59` mention fake hardcoded streak data migration.

### Blockers and risks

- The active app root does not contain `LANGY_AUDIT.md`; Phase 1 and Phase 3 reports are present, Phase 2 report is not.
- Current production build passes but does not bundle the legacy global-script app architecture.
- Curriculum content is valid structurally but still editorially immature: 97 English units are marked `needs_editorial_review`, and 11 non-English units have missing unit editorial status.
- The curriculum and vocab banks are too large and monolithic for the requested commercial architecture.
- Existing unrelated dirty files must be treated as user work until inspected in their own task.

### Exact next task

Stage 1 should introduce a versioned course/content architecture next to the legacy curriculum without deleting current content: define course-pack metadata, language/level/unit IDs, loader contracts, migration rules, and validation gates, then wire the existing monolithic curriculum through that adapter so the app behavior stays stable before any mass content expansion.
