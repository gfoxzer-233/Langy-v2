# Langy Language Sprint Report

Дата: 2026-07-13

## Что реализовано

- Обязательный выбор изучаемого языка после DEV LOGIN/регистрации: auth -> onboarding language -> goal -> level -> mascot -> Home.
- Рабочее переключение English / Spanish / Arabic на Home и в Profile/Settings.
- Раздельный прогресс по языкам: active textbook, current unit, XP, mastery, lesson history, mistakes/review queue сохраняются в `LangyState.languageProgress`.
- Home теперь строит lesson card/course card из активного curriculum, а не из старых hardcoded значений.
- Добавлены отдельные темы и background assets для Spanish и Arabic.
- Добавлены полноценные Spanish и Arabic Pre-A1 tracks.
- AI network/proxy failures больше не попадают в browser console как `error`; вызывающий UI получает честное состояние "AI temporarily unavailable".
- Summary path card теперь учитывает только что пройденный урок сразу, до возврата на Home.
- Course Map CTA проверен; `undefined Activity` исправлен.

## Контент и счётчики

- Production-файлов этого спринта: 16 (`state`, `target-language`, `router`, `main`, `auth`, `onboarding`, `home`, `learning`, `profile`, `progress`, `ai`, `curriculum`, `curriculum-validator`, `styles`, 2 background assets).
- Spanish lessons: 20.
- Spanish exercises: 160.
- Arabic lessons: 20.
- Arabic exercises: 160.
- Общий curriculum после валидации: 9 textbooks, 137 units, 1207 exercises.
- Типы упражнений в curriculum: fill-bubble 504, match-pairs 114, speak-aloud 139, listen-type 99, word-shuffle 128, type-translation 143, read-answer 40, image-choice 40.

## Проверки

- `npm test -- --run`: passed, 3 files, 71 tests.
- `npm run validate`: passed. Curriculum validation passed; lint 0 errors, 56 warnings.
- `npm run build`: passed. Vite оставляет предупреждения про classic scripts без `type="module"`.
- Browser manual: fresh DEV LOGIN -> language selection; Spanish onboarding -> Home -> lesson -> results -> Home -> reload; Arabic switch -> RTL Home -> lesson -> results -> Home -> reload; Profile switcher Arabic -> Spanish; Course Map CTA.
- Browser console на проверенных действиях: fresh `error` logs = 0.

## Скриншоты

- `docs/screenshots/language-sprint-language-selection.png`
- `docs/screenshots/language-sprint-home-es.png`
- `docs/screenshots/language-sprint-spanish-lesson.png`
- `docs/screenshots/language-sprint-spanish-results.png`
- `docs/screenshots/language-sprint-home-ar.png`
- `docs/screenshots/language-sprint-arabic-lesson-rtl.png`
- `docs/screenshots/language-sprint-arabic-results.png`
- `docs/screenshots/language-sprint-switcher.png`
- `docs/screenshots/language-sprint-home-en.png`

## Осталось

- В проекте остаются 56 lint warnings из старых и новых зон; они не блокируют build, но требуют отдельной чистки.
- Vite build предупреждает, что classic scripts из `index.html` не бандлятся без `type="module"`.
- Arabic summary визуально работает и не падает, но mixed English/Arabic RTL typography всё ещё требует отдельной полировки.
- Course Map открывается и берёт active curriculum; его визуальная архитектура пока не доведена до коммерческого уровня.
