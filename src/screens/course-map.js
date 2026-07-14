/* ============================================
   SCREEN: COURSE MAP
   Guided curriculum path for the purchased course.
   ============================================ */

function getCourseMapLanguageCode() {
    if (typeof LangyApp !== 'undefined' && LangyApp.getCourseLanguage?.()) return LangyApp.getCourseLanguage();
    if (typeof LangyTarget !== 'undefined' && LangyTarget.getCode) return LangyTarget.getCode();
    return LangyState.targetLanguage || 'en';
}

function getCourseMapLanguageDisplay(code) {
    const fallback = {
        en: { flag: '&#127468;&#127463;', name: 'English', accent: '#5B4DFF' },
        es: { flag: '&#127466;&#127480;', name: 'Espanol', accent: '#E11D48' },
        ar: { flag: '&#127480;&#127462;', name: '&#1575;&#1604;&#1593;&#1585;&#1576;&#1610;&#1577;', accent: '#0F766E' },
    };
    const cfg = typeof LangyTarget !== 'undefined' ? LangyTarget.LANGUAGES?.[code] : null;
    return {
        ...(fallback[code] || fallback.en),
        flag: fallback[code]?.flag || cfg?.flag || fallback.en.flag,
        name: fallback[code]?.name || cfg?.nativeName || code,
        accent: cfg?.trackColor || fallback[code]?.accent || fallback.en.accent,
    };
}

function getCourseMapTextbooks() {
    if (typeof LangyCurriculum === 'undefined') return [];
    const code = getCourseMapLanguageCode();
    if (typeof LangyCurriculum.getTextbooksForLanguage === 'function') {
        return LangyCurriculum.getTextbooksForLanguage(code);
    }
    return (LangyCurriculum.textbooks || []).filter(textbook => (textbook.language || 'en') === code);
}

function getCourseMapActiveTextbook() {
    if (typeof LangyCurriculum === 'undefined') return null;
    const active = LangyCurriculum.getActive?.();
    if (active) return active;
    const textbooks = getCourseMapTextbooks();
    return textbooks[0] || null;
}

function getLessonEngineExerciseCount(textbook, unit) {
    const staticCount = Array.isArray(unit?.exercises) ? unit.exercises.length : 0;
    const configuredCount = Math.max(1, LangyConfig.EXERCISES_PER_LESSON || staticCount || 1);
    const language = textbook?.language || 'en';

    if (typeof ExerciseGenerator !== 'undefined' && textbook?.cefr && language === 'en') {
        return Math.max(configuredCount, Math.min(3, staticCount));
    }

    return staticCount || configuredCount;
}

function getLessonEngineMinutes(textbook, unit) {
    return Math.max(5, Math.round(getLessonEngineExerciseCount(textbook, unit) * 1.8));
}

if (typeof window !== 'undefined') {
    window.getLessonEngineExerciseCount = getLessonEngineExerciseCount;
    window.getLessonEngineMinutes = getLessonEngineMinutes;
}

function getCourseMapUnitState(textbook, unit) {
    const activeTextbook = getCourseMapActiveTextbook();
    const activeTextbookId = activeTextbook?.id || (typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.activeTextbookId : null);
    const mastery = LangyState.progress?.mastery || {};
    const currentUnitId = LangyState.progress?.currentUnitId || 1;
    const key = `${textbook.id}:${unit.id}`;
    const record = mastery[key];
    const textbooks = getCourseMapTextbooks();
    const activeIndex = textbooks.findIndex(item => item.id === activeTextbookId);
    const textbookIndex = textbooks.findIndex(item => item.id === textbook.id);
    const isActiveTextbook = textbook.id === activeTextbookId;

    if (record?.passed) return 'completed';
    if (record && record.passed === false) return 'review';
    if (isActiveTextbook && unit.id === currentUnitId) return 'current';
    if (isActiveTextbook && unit.id < currentUnitId) return 'completed';
    if (activeIndex >= 0 && textbookIndex >= 0 && textbookIndex < activeIndex) return 'mastered';
    if (isActiveTextbook && unit.id === currentUnitId + 1) return 'available';
    return 'locked';
}

function getCourseMapCompletion(textbooks) {
    const units = textbooks.flatMap(textbook => textbook.units || []);
    const total = units.length;
    let completed = 0;
    textbooks.forEach(textbook => {
        (textbook.units || []).forEach(unit => {
            const state = getCourseMapUnitState(textbook, unit);
            if (state === 'completed' || state === 'mastered') completed++;
        });
    });
    return {
        completed,
        total,
        pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
}

function getCourseMapNodeIcon(state, unitType) {
    if (state === 'completed' || state === 'mastered') return LangyIcons.checkCircle;
    if (state === 'current') return LangyIcons.play;
    if (state === 'review' || unitType === 'review') return LangyIcons.refresh;
    if (state === 'available') return LangyIcons.unlock;
    return LangyIcons.lock;
}

function getCourseMapNodeLabel(state) {
    return {
        completed: 'Completed',
        mastered: 'Mastered',
        current: 'Current',
        review: 'Review',
        available: 'Next',
        locked: 'Locked',
    }[state] || 'Lesson';
}

function renderCourseMap(container) {
    const textbooks = getCourseMapTextbooks();
    const activeTextbook = getCourseMapActiveTextbook();
    const code = getCourseMapLanguageCode();
    const language = getCourseMapLanguageDisplay(code);

    if (!activeTextbook || textbooks.length === 0) {
        container.innerHTML = `
            <div class="screen course-map-screen">
                <div class="empty-state">
                    <div class="empty-state__icon">${LangyIcons.map}</div>
                    <div class="empty-state__title">Course map unavailable</div>
                    <div class="empty-state__text">Activate a course before opening the guided path.</div>
                    <button type="button" class="btn btn--primary" id="course-map-back">${LangyIcons.home} Home</button>
                </div>
            </div>
        `;
        container.querySelector('#course-map-back')?.addEventListener('click', () => Router.navigate('home'));
        return;
    }

    const completion = getCourseMapCompletion(textbooks);
    const currentUnit = activeTextbook.units?.find(unit => unit.id === LangyState.progress?.currentUnitId) || activeTextbook.units?.[0];
    const dir = code === 'ar' ? 'rtl' : 'ltr';

    container.innerHTML = `
        <div class="screen course-map-screen" dir="${dir}" style="--course-accent:${language.accent};">
            <header class="course-map-hero">
                <div class="course-map-hero__top">
                    <button type="button" class="nav-header__back" id="course-map-home" aria-label="Back">${LangyIcons.back}</button>
                    <span class="badge badge--primary">${language.flag} ${language.name}</span>
                </div>
                <div class="course-map-hero__content">
                    <div>
                        <p class="course-map-hero__eyebrow">Langy guided path</p>
                        <h1>Course Map</h1>
                        <p>${activeTextbook.cefr || 'Pre-A1'} · ${escapeHTML(currentUnit?.title || 'Next lesson')}</p>
                    </div>
                    <div class="course-map-mascot" aria-hidden="true">
                        <img src="assets/mascots/omar.png" alt="">
                    </div>
                </div>
                <div class="course-map-progress">
                    <div>
                        <span>${completion.completed}/${completion.total} lessons</span>
                        <strong>${completion.pct}%</strong>
                    </div>
                    <div class="course-map-progress__bar"><span style="width:${completion.pct}%;"></span></div>
                </div>
            </header>

            <main class="course-map-path" aria-label="Course levels">
                ${textbooks.map((textbook, levelIndex) => {
                    const units = textbook.units || [];
                    const completedInLevel = units.filter(unit => {
                        const state = getCourseMapUnitState(textbook, unit);
                        return state === 'completed' || state === 'mastered';
                    }).length;
                    const levelState = textbook.id === activeTextbook.id
                        ? 'active'
                        : completedInLevel === units.length && units.length > 0
                          ? 'completed'
                          : 'locked';
                    return `
                    <section class="course-map-level course-map-level--${levelState}" data-level="${escapeHTML(textbook.cefr || '')}">
                        <div class="course-map-level__header">
                            <div>
                                <span class="course-map-level__kicker">Level ${levelIndex + 1}</span>
                                <h2>${escapeHTML(textbook.cefr || 'Level')} · ${escapeHTML(textbook.title || 'Course level')}</h2>
                                <p>${escapeHTML(textbook.subtitle || textbook.methodology || '')}</p>
                            </div>
                            <span class="course-map-level__count">${completedInLevel}/${units.length}</span>
                        </div>
                        <div class="course-map-nodes">
                            ${units.map((unit, unitIndex) => {
                                const state = getCourseMapUnitState(textbook, unit);
                                const isCheckpoint = unit.unitType === 'review';
                                const exerciseCount = getLessonEngineExerciseCount(textbook, unit);
                                return `
                                <button type="button"
                                        class="course-map-node course-map-node--${state} ${isCheckpoint ? 'course-map-node--checkpoint' : ''}"
                                        data-textbook-id="${escapeHTML(textbook.id)}"
                                        data-unit-id="${unit.id}"
                                        aria-label="Open ${escapeHTML(unit.title)}"
                                        style="--node-offset:${unitIndex % 2 === 0 ? '0px' : '18px'};">
                                    <span class="course-map-node__icon">${getCourseMapNodeIcon(state, unit.unitType)}</span>
                                    <span class="course-map-node__body">
                                        <span class="course-map-node__status">${getCourseMapNodeLabel(state)}</span>
                                        <strong>${unit.id}. ${escapeHTML(unit.title)}</strong>
                                        <small>${escapeHTML(unit.desc || '')}</small>
                                        <em>${exerciseCount} tasks · ${isCheckpoint ? 'checkpoint' : 'lesson'}</em>
                                    </span>
                                </button>
                                `;
                            }).join('')}
                        </div>
                    </section>
                    `;
                }).join('')}
            </main>

            <div class="course-map-legend" aria-label="Legend">
                <span>${LangyIcons.play} Current</span>
                <span>${LangyIcons.checkCircle} Completed</span>
                <span>${LangyIcons.refresh} Review</span>
                <span>${LangyIcons.lock} Locked</span>
            </div>
        </div>
    `;

    container.querySelector('#course-map-home')?.addEventListener('click', () => Router.navigate('home'));
    container.querySelectorAll('.course-map-node').forEach(node => {
        node.addEventListener('click', () => {
            const textbookId = node.dataset.textbookId;
            const unitId = Number.parseInt(node.dataset.unitId, 10);
            if (typeof ScreenState.persist === 'function') {
                ScreenState.persist('lessonOverviewTextbookId');
                ScreenState.persist('lessonOverviewUnitId');
            }
            ScreenState.set('lessonOverviewTextbookId', textbookId);
            ScreenState.set('lessonOverviewUnitId', unitId);
            Router.navigate('lesson-overview', { textbookId, unitId });
        });
    });

    setTimeout(() => Anim.staggerChildren(container, '.course-map-node', 30), 80);
}

Router.register('course-map', renderCourseMap);
