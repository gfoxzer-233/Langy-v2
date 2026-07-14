/* ============================================
   SCREEN: LESSON OVERVIEW
   Single lesson contract before entering the engine.
   ============================================ */

function getLessonOverviewSelection() {
    const params = typeof Router !== 'undefined' ? Router.getParams() : {};
    const textbookId = params.textbookId || ScreenState.get('lessonOverviewTextbookId', LangyCurriculum?.activeTextbookId);
    const unitId = Number.parseInt(params.unitId || ScreenState.get('lessonOverviewUnitId', LangyState.progress?.currentUnitId || 1), 10);
    const textbook =
        (LangyCurriculum.textbooks || []).find(item => item.id === textbookId) ||
        LangyCurriculum.getActive?.() ||
        (LangyCurriculum.textbooks || [])[0];
    const unit = textbook?.units?.find(item => item.id === unitId) || textbook?.units?.[0] || null;
    return { textbook, unit };
}

function getLessonOverviewSkillMeta(unit) {
    const exercises = unit?.exercises || [];
    const types = new Set(exercises.map(exercise => exercise.type || exercise.widgetType));
    return {
        vocabulary: unit?.vocab || unit?.vocabulary || [],
        grammar: unit?.grammar || [],
        listening: types.has('listen-type') || types.has('listen-choice') || types.has('listen-answer'),
        speaking: types.has('speak-aloud') || types.has('dialogue'),
        reading: types.has('read-answer'),
        writing: types.has('type-translation') || types.has('word-shuffle') || types.has('listen-type'),
    };
}

function getLessonOverviewPrerequisite(textbook, unit) {
    if (!textbook?.units?.length || !unit) return 'Active course';
    const index = textbook.units.findIndex(item => item.id === unit.id);
    if (index <= 0) return 'Course activated';
    const prev = textbook.units[index - 1];
    return prev ? `${prev.id}. ${prev.title}` : 'Previous lesson';
}

function isLessonOverviewLocked(textbook, unit) {
    if (!textbook || !unit) return true;
    if (typeof window.getCourseMapUnitState === 'function') {
        return window.getCourseMapUnitState(textbook, unit) === 'locked';
    }
    const activeTextbook = LangyCurriculum.getActive?.();
    const mastery = LangyState.progress?.mastery || {};
    const currentUnitId = LangyState.progress?.currentUnitId || 1;
    const key = `${textbook.id}:${unit.id}`;
    if (mastery[key]?.passed) return false;
    return textbook.id !== activeTextbook?.id || unit.id > currentUnitId;
}

function renderLessonOverview(container) {
    if (typeof LangyCurriculum === 'undefined') {
        container.innerHTML = '<div class="screen"><div class="empty-state"><div class="empty-state__title">Curriculum unavailable</div></div></div>';
        return;
    }

    const { textbook, unit } = getLessonOverviewSelection();
    if (!textbook || !unit) {
        container.innerHTML = `
            <div class="screen lesson-overview-screen">
                <div class="empty-state">
                    <div class="empty-state__icon">${LangyIcons.alertTriangle}</div>
                    <div class="empty-state__title">Lesson not found</div>
                    <div class="empty-state__text">Open the course map and choose another lesson.</div>
                    <button type="button" class="btn btn--primary" id="lesson-overview-map">${LangyIcons.map} Course map</button>
                </div>
            </div>
        `;
        container.querySelector('#lesson-overview-map')?.addEventListener('click', () => Router.navigate('course-map'));
        return;
    }

    const skills = getLessonOverviewSkillMeta(unit);
    const exerciseCount =
        typeof window.getLessonEngineExerciseCount === 'function'
            ? window.getLessonEngineExerciseCount(textbook, unit)
            : Array.isArray(unit.exercises)
              ? unit.exercises.length
              : 0;
    const minutes =
        typeof window.getLessonEngineMinutes === 'function'
            ? window.getLessonEngineMinutes(textbook, unit)
            : Math.max(5, Math.round(exerciseCount * 1.8));
    const locked = isLessonOverviewLocked(textbook, unit);
    const state = typeof window.getCourseMapUnitState === 'function' ? window.getCourseMapUnitState(textbook, unit) : (locked ? 'locked' : 'current');
    const rewardXp = exerciseCount * 25 + 50;
    const target = typeof LangyTarget !== 'undefined' ? LangyTarget.current : null;
    const fallbackCode = typeof window.getCourseMapLanguageCode === 'function' ? window.getCourseMapLanguageCode() : LangyState.targetLanguage;
    const dir = target?.direction || (fallbackCode === 'ar' ? 'rtl' : 'ltr');

    container.innerHTML = `
        <div class="screen lesson-overview-screen" dir="${dir}">
            <header class="lesson-overview-hero">
                <button type="button" class="nav-header__back" id="lesson-overview-back" aria-label="Back">${LangyIcons.back}</button>
                <div class="lesson-overview-hero__mascot" aria-hidden="true">
                    <img src="assets/mascots/omar.png" alt="">
                </div>
                <div class="lesson-overview-hero__copy">
                    <span class="badge badge--primary">${escapeHTML(textbook.cefr || 'Pre-A1')} · ${state}</span>
                    <h1>${escapeHTML(unit.title)}</h1>
                    <p>${escapeHTML(unit.objective || unit.desc || 'Build one clear language skill and practise it immediately.')}</p>
                </div>
            </header>

            <section class="lesson-overview-grid" aria-label="Lesson details">
                <article class="lesson-overview-card">
                    <span>${LangyIcons.target}</span>
                    <div>
                        <strong>Goal</strong>
                        <p>${escapeHTML(unit.objective || unit.desc || 'Finish this lesson with usable practice.')}</p>
                    </div>
                </article>
                <article class="lesson-overview-card">
                    <span>${LangyIcons.bookOpen}</span>
                    <div>
                        <strong>Vocabulary</strong>
                        <p>${skills.vocabulary.length ? escapeHTML(skills.vocabulary.slice(0, 6).join(', ')) : 'Context vocabulary from this unit'}</p>
                    </div>
                </article>
                <article class="lesson-overview-card">
                    <span>${LangyIcons.brain}</span>
                    <div>
                        <strong>Grammar</strong>
                        <p>${skills.grammar.length ? escapeHTML(skills.grammar.slice(0, 5).join(', ')) : 'Pattern practice'}</p>
                    </div>
                </article>
                <article class="lesson-overview-card">
                    <span>${LangyIcons.headphones}</span>
                    <div>
                        <strong>Listening</strong>
                        <p>${skills.listening ? 'Included with text fallback' : 'Not required in this lesson'}</p>
                    </div>
                </article>
                <article class="lesson-overview-card">
                    <span>${LangyIcons.mic}</span>
                    <div>
                        <strong>Speaking</strong>
                        <p>${skills.speaking ? 'Pronunciation or spoken response' : 'Optional with Omar after the lesson'}</p>
                    </div>
                </article>
                <article class="lesson-overview-card">
                    <span>${LangyIcons.clock}</span>
                    <div>
                        <strong>Estimated time</strong>
                        <p>${minutes} minutes · ${exerciseCount} tasks</p>
                    </div>
                </article>
            </section>

            <section class="lesson-overview-contract">
                <div>
                    <span>Prerequisite</span>
                    <strong>${escapeHTML(getLessonOverviewPrerequisite(textbook, unit))}</strong>
                </div>
                <div>
                    <span>Reward</span>
                    <strong>+${rewardXp} XP</strong>
                </div>
            </section>

            ${
                locked
                    ? `
            <div class="lesson-overview-locked" role="status">
                ${LangyIcons.lock}
                <div>
                    <strong>Lesson locked</strong>
                    <p>Complete the current lesson first. Your paid course stays locked to this curriculum.</p>
                </div>
            </div>
            <button type="button" class="btn btn--primary btn--xl btn--full" id="lesson-overview-map-cta">
                ${LangyIcons.map} Back to course map
            </button>`
                    : `
            <button type="button" class="btn btn--primary btn--xl btn--full" id="lesson-overview-start">
                ${LangyIcons.play} ${state === 'completed' || state === 'mastered' ? 'Review lesson' : 'Start lesson'}
            </button>`
            }
        </div>
    `;

    container.querySelector('#lesson-overview-back')?.addEventListener('click', () => Router.navigate('course-map'));
    container.querySelector('#lesson-overview-map-cta')?.addEventListener('click', () => Router.navigate('course-map'));
    container.querySelector('#lesson-overview-start')?.addEventListener('click', () => {
        if (typeof ScreenState.persist === 'function') {
            ScreenState.persist('lessonOverviewTextbookId');
            ScreenState.persist('lessonOverviewUnitId');
        }
        ScreenState.set('lessonOverviewTextbookId', textbook.id);
        ScreenState.set('lessonOverviewUnitId', unit.id);
        Router.navigate('learning', { textbookId: textbook.id, unitId: unit.id });
    });
}

Router.register('lesson-overview', renderLessonOverview);
