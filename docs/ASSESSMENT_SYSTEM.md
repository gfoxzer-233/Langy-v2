# Assessment System

Дата: 2026-07-13

## Текущая реализация

Основная оценка урока считается в `src/screens/learning.js`:

- `correctAnswers`
- `totalExercises`
- `score`
- `grade`
- `xpEarned`
- `failedExerciseIndices`

Порог прохождения берётся из `LangyConfig.PASS_THRESHOLD` в `src/utils/config.js`.

## Mastery

После урока сохраняется запись:

```js
LangyState.progress.mastery["textbookId:unitId"] = {
  score,
  passed,
  attempts,
  failedIndices,
  lastAttempt
}
```

## Новая метадата

Каждый английский юнит получает:

- `assessment.passThreshold`
- `assessment.masteryCheckExerciseIndices`

Каждое упражнение получает `stage`, включая `mastery_check` для последних заданий.

## Ограничение

Сейчас UI показывает общий score. Следующий шаг - хранить отдельный результат mastery check и показывать его отдельно от guided practice.
