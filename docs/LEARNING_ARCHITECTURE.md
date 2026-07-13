# Langy Learning Architecture

Дата: 2026-07-13

## Текущее ядро

Основной lesson engine находится в `src/screens/learning.js`.

Путь урока:

1. `intro` - цель, мета урока, число упражнений.
2. `teach` - короткие слайды из `unit.teachSlides`.
3. `theory` - legacy fallback, если нет `teachSlides`.
4. `practice` - виджеты из `src/utils/widgets.js`.
5. `summary` - результат, XP, mastery, прогресс, следующий юнит.
6. `quick-review` - повторение слабых тем после checkpoint.

## Нормализованная структура урока

`src/data/curriculum.js` теперь автоматически обогащает каждый английский юнит:

- `objective`
- `skillIds`
- `prerequisiteUnitIds`
- `lessonStages`
- `editorialStatus`
- `reviewStrategy`
- `assessment`

Обязательные `lessonStages`:

- `objective`
- `quick_review`
- `context`
- `explanation`
- `guided_practice`
- `productive_practice`
- `adaptive_repair`
- `mastery_check`
- `result`

Каждое английское упражнение получает:

- `id`
- `cefr`
- `lessonObjective`
- `skillId`
- `skillIds`
- `stage`
- `difficulty`
- `expectedAnswer`
- `acceptedAnswers`
- `explanation`
- `mistakeCategory`
- `reviewStrategy`
- `vocabularyItem`
- `grammarRule`

## Проверка

Валидация находится в `src/data/curriculum-validator.js`.

Команда:

```bash
npm run validate:curriculum
```

Валидация проверяет базовую схему всех типов упражнений и расширенную учебную схему для английского курса.

## Ограничение

Нормализатор гарантирует машинно проверяемую структуру, но не заменяет редакторскую работу. Все английские юниты сейчас имеют `editorialStatus: needs_editorial_review`.
