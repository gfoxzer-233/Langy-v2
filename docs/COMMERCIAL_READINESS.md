# Commercial Readiness

Дата: 2026-07-13

## Ready enough to demo

- DEV LOGIN path works from tests.
- First lesson critical path is covered by integration tests.
- Curriculum validates 956 exercises.
- Home now prioritizes lesson over speaking.
- English curriculum has machine-readable objectives, skill IDs, prerequisites, stages, assessment and review metadata.
- AI failure in core lesson path has fallback behavior from Phase 1.

## Not yet ready to sell as final

- English content still needs editorial approval per unit.
- `read-answer` and `image-choice` are not represented in static curriculum coverage.
- Mastery check metadata exists, but UI still presents mostly one aggregate score.
- Review queue metadata exists, but due scheduling does not yet drive the first review block of each lesson.
- Long-form B2-C2 speaking/writing assessment is not deep enough for a paid flagship product.
- Legacy script architecture still produces Vite warnings and should be migrated to modules later.

## Commercial priority

The next product step should not be more screens. It should be a deeper lesson engine:

1. Separate guided practice score from mastery score.
2. Make review queue select due items at lesson start.
3. Add repair variants after wrong answers.
4. Add static `read-answer` and `image-choice` coverage.
5. Create manual editorial workflow for moving units from `needs_editorial_review` to `approved`.
