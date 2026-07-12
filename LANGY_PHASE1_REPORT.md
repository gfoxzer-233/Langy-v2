# LANGY PHASE 1 REPORT

Дата: 2026-07-13  
Ветка: `codex/langy-phase1-stabilization`

## Краткий итог

Этап 1 выполнен как стабилизация учебного ядра: первый урок проходит в браузере от DEV LOGIN до summary, XP начисляется, прогресс сохраняется после reload, следующий урок разблокируется. Curriculum валидируется автоматически, повреждённые упражнения исправлены, `fill-bubble` больше не падает на заданиях без `___`, а одиночная ошибка упражнения/TTS/STT/AI не должна ломать урок целиком.

## Что изменено

- Добавлен валидатор curriculum: `src/data/curriculum-validator.js`, CLI-скрипт `scripts/validate-curriculum.mjs`, команда `npm run validate:curriculum`, общий `npm run validate`.
- `src/utils/widgets.js`: `fill-bubble` разделён на gap-fill и обычный multiple choice; добавлен безопасный fallback для повреждённых упражнений; TTS/STT обёрнуты в обработку ошибок.
- `src/data/exercise-generator.js`: варианты ответа перемешиваются один раз, `correct` теперь соответствует реально показанному варианту.
- `src/data/curriculum.js`: удалён мёртвый дублирующий блок в начале файла; исправлены повреждённые `match-pairs` и `word-shuffle` упражнения без удаления учебного смысла.
- `src/utils/ai.js`, `src/screens/homework.js`, `src/screens/listening.js`, `src/utils/talk-engine.js`: добавлены timeout/network/CORS/server-error fallback; homework больше не ставит случайные оценки при недоступном AI.
- `src/screens/learning.js`: lesson flow использует фактическое количество упражнений и устойчивее переживает ошибки.
- `src/screens/home.js`, `src/utils/tutor.js`: текущий юнит, описание, цель, число заданий и длительность берутся из активного curriculum.
- `tests/setup.js`, `tests/lesson-core.test.js`: добавлены интеграционные проверки критического пути lesson engine и стабильный mock `localStorage.removeItem`.

## Изменённые файлы

- `.eslintrc.json`
- `index.html`
- `package.json`
- `scripts/validate-curriculum.mjs`
- `src/data/curriculum.js`
- `src/data/curriculum-validator.js`
- `src/data/exercise-generator.js`
- `src/screens/home.js`
- `src/screens/homework.js`
- `src/screens/learning.js`
- `src/screens/listening.js`
- `src/utils/ai.js`
- `src/utils/talk-engine.js`
- `src/utils/tutor.js`
- `src/utils/widgets.js`
- `tests/setup.js`
- `tests/lesson-core.test.js`
- `LANGY_PHASE1_REPORT.md`

## Исправленные первопричины

- `fill-bubble` всегда ожидал `.fill-blank`, хотя часть данных была обычным выбором ответа без пропуска.
- `exercise-generator.js` перемешивал варианты и затем вычислял/использовал `correct` несогласованно.
- Curriculum не имел автоматической схемной проверки, поэтому дубликаты пар и неполные `word-shuffle` ответы проходили незамеченными.
- Урок доверял каждому widget/AI/TTS/STT вызову и не имел локального safe state.
- Home частично показывал устаревшие данные вместо активного unit.
- Test setup не гарантировал полноценный `localStorage.removeItem`.

## Результаты проверок

- `npm run validate:curriculum` — PASS. 9 textbooks, 108 units, 956 exercises.
- `npm test -- --run` — PASS. 3 files, 59 tests.
- `npm run validate` — PASS. Curriculum validation + ESLint + tests. ESLint: 53 warnings, 0 errors.
- `npm run build` — PASS. Vite build successful.

Примечание: build всё ещё печатает предупреждения Vite о non-module `<script>` в `index.html`. Это архитектурное предупреждение существующей script-based сборки, не ошибка Phase 1.

## Ручное прохождение в браузере

Проверено на локальном Vite-сервере `http://127.0.0.1:5175/`:

1. Первый запуск открыл `#auth`.
2. DEV FAST LOGIN успешно перевёл на `#home`.
3. Home показал активный урок 1: `The English Alphabet`, 8 заданий, около 14 минут.
4. Первый урок стартовал, teaching slides прошли до practice.
5. Пройдены упражнения: `match-pairs`, `fill-bubble` без `___`, `speak-aloud` через fallback skip, `listen-type`, `type-translation`, повторный `match-pairs`.
6. Summary показал результат `71%`, `5/7`, `+175 XP`.
7. После `На главную` home показал урок 2: `Hello & Goodbye`, прогресс `17%`.
8. После reload прогресс сохранился, урок 2 остался активным.
9. После последней проверки на текущем порту не было console error по `127.0.0.1:5175`.

## Что осталось нерешённым

- DEV FAST LOGIN по-прежнему намеренно пропускает onboarding как dev shortcut; обычная регистрация ведёт в onboarding.
- Social login Google/Apple остаётся заглушкой.
- В проекте остаются 53 ESLint warnings из старых участков.
- Vite не бандлит legacy non-module scripts; нужен отдельный этап миграции на modules/build pipeline.
- AI всё ещё зависит от внешней доступности API; при недоступности теперь есть честный fallback, но полноценный серверный proxy/secret storage не реализован.

## План следующего этапа

1. Вынести AI в серверный proxy и убрать любые клиентские предпосылки для секретов.
2. Сделать полноценные Playwright/E2E тесты auth/onboarding/lesson/home persistence.
3. Перевести curriculum в типизированный JSON/TS источник с CI-валидацией.
4. Разделить lesson engine на state machine + renderer, чтобы меньше логики жило в DOM callbacks.
5. Начать методическую переработку A1-C2: цели урока, spaced repetition, grammar progression, аудирование и pronunciation scoring.
