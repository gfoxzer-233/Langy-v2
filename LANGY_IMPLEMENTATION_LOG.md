# Langy Implementation Log

## 2026-07-14 - Stage 1 course purchase lock

Status: WORK IN PROGRESS. Langy is not sale-ready yet.

Completed in this pass:

- Split `interfaceLocale` from paid `courseLanguage`.
- Added pending pre-payment course choice and locked post-payment course entitlement.
- Reworked registration/onboarding route so new users go to course selection before checkout.
- Replaced generic subscription screen with course-specific checkout for Langy English, Langy Spanish, and Langy Arabic.
- Added order confirmation with product, plan, billing period, total, trial, and renewal date.
- Added local entitlement activation after sandbox payment: `subscription.courseLanguage`, `plan`, `status`, `startedAt`, `renewsAt`, and `entitlements`.
- Added legacy migration so existing single-course progress can become the locked active course without deleting archived language progress.
- Removed paid-course switchers from Home and Profile.
- Kept Settings/Profile interface language as interface-only.
- Updated Home to render only the purchased curriculum course.
- Removed Talk from bottom navigation.
- Removed the duplicate mascot-overlay Talk button on Home.
- Kept one round Omar Talk button under the lesson card and verified the modal options.
- Fixed the post-payment onboarding regression caused by `Router.navigate()` clearing `ScreenState`; paid users now default to course onboarding instead of course selection.

Manual browser verification:

- App opened at `http://127.0.0.1:5175/#home`.
- Signup form submitted through UI.
- Course selection showed English, Spanish, Arabic cards.
- Continue appeared only after course selection.
- Course was changed from English to Spanish before payment.
- Checkout showed Spanish product and plan.
- Order confirmation opened.
- Sandbox payment activated Spanish entitlement.
- After payment and reload, onboarding opened Spanish course-goal step, not course selection.
- Onboarding completed with Omar.
- Home showed Spanish-only lesson/course data.
- Bottom nav contained `home`, `results`, `profile`; no `talk`.
- Home had no `#mascot-tap-zone`.
- Round Omar button opened modal with `free`, `lesson`, `mistakes`, `scenario`, `resume`.
- Round Omar button geometry on desktop: `104px x 104px`, `border-radius: 50%`, `aspect-ratio: 1 / 1`.
- Round Omar button geometry on mobile viewport: `92px x 92px`.
- Console had no errors/warnings during the verified flow.

Automated verification:

- `npm test -- --run`: passed, 3 files, 71 tests.
- `npm run validate`: passed; curriculum validator passed 9 textbooks, 137 units, 1207 exercises; ESLint has existing warnings only.
- `npm run build`: passed; Vite still warns about classic script tags in `index.html`.

Known remaining work:

- Do not create `LANGY_SALE_READY_REPORT.md` yet.
- Full English/Spanish/Arabic Pre-A1-C2 commercial content is not complete.
- There are not 544 core lessons per language.
- Server-side payment and entitlement enforcement is still not implemented.
- Exhaustive manual testing of three paid accounts is not complete.
- Full route/button audit and full lesson runner across every unit remain Stage 2 work.
