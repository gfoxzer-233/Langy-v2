# Content Coverage

Дата: 2026-07-13

Источник: `LangyCurriculum.getContentCoverage()`.

## Validation

- Textbooks: 9
- Units: 108
- Exercises: 956
- Valid: yes

## English coverage

| Textbook | CEFR | Units | Exercises | Objectives | Skill-linked exercises |
|---|---:|---:|---:|---:|---:|
| `pre_a1_starter` | Pre-A1 | 6 | 31 | 6 | 31 |
| `a1_beginner` | A1 | 18 | 153 | 18 | 153 |
| `a2_elementary` | A2 | 16 | 129 | 16 | 129 |
| `b1_preintermediate` | B1 | 16 | 142 | 16 | 142 |
| `b2_upper` | B2 | 15 | 173 | 15 | 173 |
| `c1_advanced` | C1 | 14 | 156 | 14 | 156 |
| `c2_proficiency` | C2 | 12 | 103 | 12 | 103 |

English total: 97 units, 887 exercises.

## Exercise type coverage

Global curriculum:

- `fill-bubble`: 502
- `match-pairs`: 91
- `speak-aloud`: 110
- `listen-type`: 62
- `word-shuffle`: 88
- `type-translation`: 103

Current gap:

- `read-answer` and `image-choice` exist in widgets/generator/validator, but are not present in static curriculum counts.
- Dynamic generation can produce them; static course authoring should add level-appropriate reading and visual vocabulary tasks.

## Editorial status

All English units currently use `needs_editorial_review`. This is intentional: the course is structurally validated but not yet human-approved.
