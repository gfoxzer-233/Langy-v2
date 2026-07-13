# English CEFR Blueprint

Дата: 2026-07-13

## Линия курса

Английский курс в `src/data/curriculum.js` представлен как 7 уровней:

| Textbook | CEFR | Units | Exercises | Status |
|---|---:|---:|---:|---|
| `pre_a1_starter` | Pre-A1 | 6 | 31 | structured, needs editorial review |
| `a1_beginner` | A1 | 18 | 153 | structured, needs editorial review |
| `a2_elementary` | A2 | 16 | 129 | structured, needs editorial review |
| `b1_preintermediate` | B1 | 16 | 142 | structured, needs editorial review |
| `b2_upper` | B2 | 15 | 173 | structured, needs editorial review |
| `c1_advanced` | C1 | 14 | 156 | structured, needs editorial review |
| `c2_proficiency` | C2 | 12 | 103 | structured, needs editorial review |

Итого English: 97 units, 887 exercises.

## Последовательность

Каждый английский юнит получает `prerequisiteUnitIds`. Сейчас это автоматическая последовательная зависимость от предыдущих 1-2 юнитов внутри уровня. Для коммерческой версии нужно заменить часть этих связей ручной skill graph зависимостью: например, `present simple questions` должен зависеть от `present simple positive/negative`, а не просто от ближайшего номера юнита.

## Уровни

Pre-A1:
алфавит, звуки, первые слова, hello/goodbye, числа, цвета, базовые предметы, первые предложения с `I am / You are`.

A1:
`to be`, Present Simple, базовые вопросы, семья, дом, город, еда, транспорт, `can`, articles, there is/are, первые past forms.

A2:
повседневные ситуации, путешествия, планы, сравнения, советы, Past Continuous, Present Perfect introduction, future forms, conditionals introduction.

B1:
самостоятельная коммуникация, истории, аргументация, Present Perfect, narrative tenses, conditionals, passive, reported speech, phrasal verbs.

B2:
дискуссии, профессиональные ситуации, advanced questions, narrative control, formal register, negotiation, collocations, nuance.

C1:
академический и профессиональный стиль, discourse markers, hedging, inversion, cleft sentences, cohesion, register switching.

C2:
semantic precision, pragmatics, advanced style editing, negotiation, rhetoric, idiom/register control.

## Следующий content milestone

Нужно вручную пройти каждый юнит и заменить auto-generated objective/explanation там, где формулировка слишком общая. После ручной проверки менять `editorialStatus` с `needs_editorial_review` на `validated` или `approved`.
