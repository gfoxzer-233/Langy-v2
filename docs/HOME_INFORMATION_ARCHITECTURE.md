# Home Information Architecture

Дата: 2026-07-13

## Новый порядок

Файл: `src/screens/home.js`

После компактного mascot/streak блока Home показывает:

1. `home-lesson-card` - главный CTA урока.
2. `home-talk-card` - вторичная карточка разговора.
3. `home-course-card` - компактная English Structured карточка.
4. Continuity/review блоки и остальная экосистема.

## Lesson card

Данные берутся из активного curriculum:

- textbook через `LangyCurriculum.getActive()`;
- unit через `LangyState.progress.currentUnitId`;
- objective через `unit.objective`;
- exercise count из lesson builder config;
- duration как расчёт от числа упражнений;
- draft state из `LangyState.progress.lessonDraft`.

Если есть draft текущего урока, CTA меняется на `Continue lesson` / `Продолжить урок`.

## Talk card

Опции:

- free talk;
- lesson topic;
- recent mistakes;
- 3-5 min scenario;
- resume.

Недоступные действия disabled, но видны пользователю.

## Course card

Показывает:

- language name;
- `Structured`;
- track description;
- features;
- current CEFR;
- real level progress;
- current unit;
- link to course map.

## Удалено

Старый навязчивый блок `Ready to practice!` / `Lesson done - time to speak` не рендерится.
