# Mastery And Review

Дата: 2026-07-13

## Что уже есть

Файлы:

- `src/screens/learning.js`
- `src/utils/vocab-tracker.js`
- `src/utils/vocab-mastery.js`
- `src/data/curriculum.js`

После урока сохраняются:

- score;
- pass/fail;
- failed exercise indices;
- попытки;
- vocabulary seen/learned;
- homework review item.

## Review metadata

Каждый английский юнит получает:

```js
reviewStrategy: {
  source: "spaced_repetition",
  dueAfterDays: [1, 3, 7, 14],
  repair: "variant_practice_after_error"
}
```

Каждое английское упражнение получает:

```js
reviewStrategy: {
  queue: true,
  dueAfterDays: [1, 3, 7],
  repairType: "near_transfer_variant"
}
```

Для `mastery_check` due schedule короче: `[1, 2, 5, 10]`.

## Следующий шаг

Нужно вынести review queue в отдельный модуль с явными состояниями:

- `new`
- `learning`
- `review_due`
- `mastered`
- `lapsed`

Сейчас review strategy валидируется, но scheduling ещё не управляет подбором первых 1-3 заданий урока.
