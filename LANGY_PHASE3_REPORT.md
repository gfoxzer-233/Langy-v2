# LANGY PHASE 3 REPORT

Дата проверки: 2026-07-13
Ветка: `codex/langy-phase3-commercial-core`

## Что изменено

- Home перестроен в коммерческую учебную иерархию: главный CTA теперь урок, затем разговор с маскотом, затем структура курса. Старый forced speaking/banner-flow убран из первого экрана.
- Home больше не показывает захардкоженные данные урока: название юнита, описание, количество упражнений, длительность и прогресс берутся из активного curriculum.
- Talk на Home стал secondary action с режимами: free talk, lesson topic, mistakes, scenario, resume.
- Course card показывает CEFR-track, текущий уровень, текущий юнит и прогресс по реально активному textbook.
- Onboarding для complete beginner теперь назначает `Pre-A1`, а финальный шаг ведёт на Home, не сразу в learning/talk.
- Стартовый роут после завершённого первого урока больше не принудительно открывает Talk при перезагрузке. После lesson completion пользователь остаётся в Home со следующим уроком.
- Lesson draft сохраняется во время прохождения и очищается после summary.
- English curriculum получил нормализованные поля: unit objective, skill ids, prerequisites, lesson stages, assessment, review strategy, per-exercise CEFR/objective/skill/stage/difficulty/expected answer/explanation/mistake category/review strategy.
- Curriculum validator расширен: проверяет английскую учебную архитектуру, prerequisite order, required stages, editorial status, assessment, exercise metadata и форматы всех widget types.
- Добавлены тесты Home IA, lesson draft resume state, English curriculum metadata coverage.
- Добавлены документы по learning architecture, CEFR blueprint, content style, assessment, mastery/review, Home IA, coverage, readiness.
- Home адаптирован под app-shell: на 320/360/390/430/768/1280 px видны lesson/talk/course signals без horizontal overflow.

## Изменённые файлы

- `src/screens/home.js`
- `src/screens/onboarding.js`
- `src/screens/learning.js`
- `src/main.js`
- `src/utils/i18n.js`
- `src/data/curriculum.js`
- `src/data/curriculum-validator.js`
- `styles/screens.css`
- `tests/lesson-core.test.js`
- `docs/LEARNING_ARCHITECTURE.md`
- `docs/ENGLISH_CEFR_BLUEPRINT.md`
- `docs/CONTENT_STYLE_GUIDE.md`
- `docs/ASSESSMENT_SYSTEM.md`
- `docs/MASTERY_AND_REVIEW.md`
- `docs/HOME_INFORMATION_ARCHITECTURE.md`
- `docs/CONTENT_COVERAGE.md`
- `docs/COMMERCIAL_READINESS.md`
- `docs/screenshots/phase3-home-unit2-390.png`

## Первопричины исправленных проблем

- Home конкурировал сам с собой: lesson CTA, speaking prompt, course info и old banners были смешаны. Теперь первый экран имеет порядок: lesson -> talk -> course.
- Первый beginner-flow раньше мог уводить пользователя в A1 или Talk слишком рано. Теперь complete beginner получает Pre-A1 и начинает с Home.
- После первого урока `main.js` считал пользователя `speaking-first`, если он ещё не проходил talk session, и на reload открывал `#talk`. Добавлен guard `hasCompletedAnyLesson`.
- Curriculum имел упражнения, но не имел достаточных контрактов для коммерческой учебной системы. Добавлена нормализация и строгая валидация учебной metadata.
- Mobile Home на 320-430 px прятал course card ниже первого экрана из-за высокой talk-сетки. Talk options переведены в компактный горизонтальный ряд.

## Проверки

- `node --check` для изменённых JS-файлов: passed.
- `npm run validate:curriculum`: passed.
  - Textbooks: 9
  - Units: 108
  - Exercises: 956
  - Types: `fill-bubble` 502, `match-pairs` 91, `speak-aloud` 110, `listen-type` 62, `word-shuffle` 88, `type-translation` 103.
- `npm test -- --run`: passed.
  - 3 files, 62 tests.
  - stderr содержит ожидаемые тестовые проверки fallback/error paths.
- `npm run build`: passed.
  - Остались существующие Vite warnings про non-module script tags в `index.html`.
- `npm run validate`: passed.
  - 0 errors, 53 lint warnings.

## Ручное прохождение в браузере

Окно приложения: `http://127.0.0.1:5175/#home`

Проверенный путь:

1. Home показал `Unit 1: The English Alphabet`, 8 exercises, about 14 min.
2. Нажат `Start lesson`.
3. Пройден intro и teach slides.
4. Пройдены упражнения через UI: `word-shuffle`, `fill-bubble`, `match-pairs`, `type-translation`, `listen-type`.
5. Summary показал `100%`, `8/8`, `+250 XP`.
6. Нажат `Back to Home`.
7. Home показал `Unit 2: Hello & Goodbye`, `Pre-A1 17%`.
8. После reload приложение осталось на Home, прогресс сохранился, следующий урок разблокирован.
9. Console errors для текущего `5175`: 0.

Responsive Home:

- Проверены 320, 360, 390, 430, 768, 1280 px.
- Порядок карточек: `home-lesson-card`, `home-talk-card`, `home-course-card`.
- Горизонтального overflow нет.
- Верх course card виден на первом viewport во всех проверенных ширинах.

Скриншот: `docs/screenshots/phase3-home-unit2-390.png`.

## Что осталось нерешённым

- English curriculum теперь структурно валиден, но многие уроки имеют `editorialStatus: needs_editorial_review`: нужен настоящий методический проход по содержанию A1-C2.
- В статическом curriculum пока нет реального покрытия `read-answer` и `image-choice`, хотя виджеты, генератор и валидатор эти типы поддерживают.
- `npm run build` проходит, но архитектура `index.html` остаётся script-tag based; Vite не бандлит эти scripts без `type="module"`.
- `npm run validate` проходит, но в проекте остаётся 53 lint warnings.
- AI/talk/homework остаются fallback-safe, но для коммерческого продукта нужен серверный AI proxy, лимиты, retry policy, telemetry и отсутствие client-side secret exposure.

## Следующий этап

1. Снять `needs_editorial_review` с Pre-A1 после методической редакции каждого урока.
2. Добавить реальные `read-answer` и `image-choice` в Pre-A1/A1, чтобы все поддержанные widget types были представлены в curriculum.
3. Вынести AI calls на backend/proxy и добавить продуктовые states: unavailable, retry, rate limited, degraded mode.
4. Добавить mastery dashboard: skills, mistakes, due review, vocab mastery.
5. Начать production content pipeline: authoring format, reviewer checklist, import/export, coverage report by CEFR skill.
