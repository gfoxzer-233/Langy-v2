/* ============================================
   SCREEN: HOME (Core Hub)
   ============================================ */

// Build dynamic week calendar from activeDays
function buildWeekDays() {
    const today = new Date();
    const dayNames_i18n = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    };
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const dayNames = dayNames_i18n[lang] || dayNames_i18n.en;
    const activeDays = LangyState.streakData.activeDays || [];
    const todayISO = today.toISOString().split('T')[0];

    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    let html = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const dayName = dayNames[d.getDay()];
        const isDone = activeDays.includes(iso);
        const isToday = iso === todayISO;
        const isSunday = d.getDay() === 0;

        let stateClass = '';
        if (isDone) stateClass = 'streak-day--done';
        else if (isToday) stateClass = 'streak-day--active';

        const dot = isSunday && !isDone ? LangyIcons.gift : '';

        html += `<div class="streak-day ${stateClass}"><div class="streak-day__dot">${dot}</div><span>${dayName}</span></div>`;
    }
    return html;
}

function buildWeekProgress() {
    const today = new Date();
    const activeDays = LangyState.streakData.activeDays || [];

    // Get Monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    let completed = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        if (activeDays.includes(iso)) completed++;
    }
    return Math.round((completed / 7) * 100);
}

function getActiveLessonMeta() {
    if (typeof LangyCurriculum === 'undefined') return null;
    const textbook = LangyCurriculum.getActive();
    if (!textbook || !Array.isArray(textbook.units) || textbook.units.length === 0) return null;

    const currentUnitId = LangyState.progress?.currentUnitId;
    const unit = textbook.units.find(u => u.id === currentUnitId) || textbook.units[0];
    const staticCount = Array.isArray(unit.exercises) ? unit.exercises.length : 0;
    const configuredCount = Math.max(1, LangyConfig.EXERCISES_PER_LESSON || staticCount || 1);
    const exerciseCount = textbook.cefr ? Math.max(configuredCount, Math.min(3, staticCount)) : staticCount;
    const minutes = Math.max(5, Math.round(exerciseCount * 1.8));

    return {
        textbook,
        unit,
        exerciseCount,
        minutes,
        goal: unit.objective || (Array.isArray(textbook.canDo) ? (textbook.canDo[unit.id - 1] || textbook.canDo[0]) : ''),
        title: `${i18n('home.unit_prefix')} ${unit.id}: ${unit.title}`,
        subtitle: `${unit.desc || unit.grammar?.join(', ') || i18n('learn.next_lesson')} · ${exerciseCount} ${i18n('learn.exercises')} · ~${minutes} ${i18n('learn.minutes')}`,
    };
}

function formatHomeText(key, values = {}) {
    let text = i18n(key);
    Object.entries(values).forEach(([name, value]) => {
        text = text.replaceAll(`{${name}}`, value);
    });
    return text;
}

function getHomeMascotName() {
    const names = ['Zendaya', 'Travis', 'Matthew', 'Omar', 'Elyanna', 'Adel Imam'];
    return names[LangyState.mascot.selected || 0] || 'Langy';
}

function getLessonDraft(meta) {
    const draft = LangyState.progress?.lessonDraft;
    if (!draft || !meta?.textbook || !meta?.unit) return null;
    if (draft.textbookId !== meta.textbook.id || draft.unitId !== meta.unit.id) return null;
    if (draft.status === 'completed') return null;
    return draft;
}

function getLevelProgress(textbook) {
    if (!textbook?.units?.length) return { passed: 0, total: 0, pct: 0 };
    const mastery = LangyState.progress?.mastery || {};
    const passed = textbook.units.filter(unit => mastery[`${textbook.id}:${unit.id}`]?.passed).length;
    return {
        passed,
        total: textbook.units.length,
        pct: Math.round((passed / textbook.units.length) * 100),
    };
}

function renderHomeLessonCard(meta) {
    if (!meta) return '';
    const draft = getLessonDraft(meta);
    const buttonLabel = draft ? i18n('home.lesson_continue') : i18n('home.lesson_start');
    const currentStep = Number.isInteger(draft?.currentExerciseIdx) && draft?.totalExercises
        ? `<span>${formatHomeText('home.lesson_resume_state', {
            current: Math.min(draft.currentExerciseIdx + 1, draft.totalExercises),
            total: draft.totalExercises,
        })}</span>`
        : '';
    const lessonGoal = meta.goal || meta.unit.desc || i18n('home.lesson_goal_fallback');

    return `
        <section class="home-learning-card home-learning-card--lesson" id="home-lesson-card" aria-labelledby="home-lesson-title">
            <div class="home-learning-card__header">
                <span class="home-learning-card__eyebrow">${i18n('home.lesson_label')}</span>
                ${currentStep ? `<span class="home-learning-card__state">${currentStep}</span>` : ''}
            </div>
            <h2 class="home-learning-card__title" id="home-lesson-title">${escapeHTML(meta.title)}</h2>
            <p class="home-learning-card__goal">${escapeHTML(lessonGoal)}</p>
            <div class="home-learning-card__meta">
                <span>${LangyIcons.target} ${meta.exerciseCount} ${i18n('learn.exercises')}</span>
                <span>${LangyIcons.clock} ${formatHomeText('home.lesson_about_minutes', { minutes: meta.minutes })}</span>
            </div>
            <button type="button" id="nav-learning" class="btn btn--primary btn--xl btn--full home-learning-card__button">
                ${LangyIcons.bookOpen} ${buttonLabel}
            </button>
        </section>
    `;
}

function renderHomeTalkCard(meta, recommendedScenario) {
    const mascotName = getHomeMascotName();
    const hasMistakes = (LangyState.coachData?.mistakePatterns || []).length > 0;
    const hasTalkDraft = !!ScreenState.get('talkView') && ScreenState.get('talkView') !== 'summary';
    const options = [
        { mode: 'free', label: i18n('home.talk_free'), icon: LangyIcons.messageCircle },
        { mode: 'lesson', label: i18n('home.talk_lesson'), icon: LangyIcons.bookOpen },
        { mode: 'mistakes', label: i18n('home.talk_mistakes'), icon: LangyIcons.target, disabled: !hasMistakes },
        { mode: 'scenario', label: i18n('home.talk_scenario'), icon: LangyIcons.map },
        { mode: 'resume', label: i18n('home.talk_resume'), icon: LangyIcons.play, disabled: !hasTalkDraft },
    ];

    return `
        <section class="home-learning-card home-learning-card--talk" id="home-talk-card" aria-labelledby="home-talk-title">
            <div class="home-learning-card__header">
                <span class="home-learning-card__eyebrow">${formatHomeText('home.talk_with', { mascot: mascotName })}</span>
                <span class="home-learning-card__state">${i18n('home.secondary_cta')}</span>
            </div>
            <h3 class="home-learning-card__title home-learning-card__title--sm" id="home-talk-title">${escapeHTML(meta?.unit?.title || i18n('home.talk_default_topic'))}</h3>
            <p class="home-learning-card__goal">${i18n('home.talk_subtitle')}</p>
            <div class="home-talk-options" data-recommended-scenario="${recommendedScenario || 'coffee'}">
                ${options.map(option => `
                    <button type="button" class="home-talk-option ${option.disabled ? 'home-talk-option--disabled' : ''}" data-talk-mode="${option.mode}" ${option.disabled ? 'disabled' : ''}>
                        ${option.icon} <span>${option.label}</span>
                    </button>
                `).join('')}
            </div>
        </section>
    `;
}

function renderHomeCourseCard(meta) {
    const tc = typeof LangyTarget !== 'undefined' ? LangyTarget.current : null;
    if (!tc || !tc.featured) return '';

    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const textbook = meta?.textbook || (typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.getActive() : null);
    const levelProgress = getLevelProgress(textbook);
    const trackColor = tc.trackColor || '#10B981';
    const langName = typeof LangyTarget !== 'undefined' && LangyTarget.displayName ? LangyTarget.displayName(lang) : tc.nativeName;
    const features = [
        i18n('home.course_feature_cefr'),
        i18n('home.course_feature_grammar'),
        i18n('home.course_feature_vocab'),
        i18n('home.course_feature_tutor'),
    ];

    return `
        <section class="home-course-card" id="home-course-card" style="--track-color:${trackColor};" aria-labelledby="home-course-title">
            <div class="home-course-card__top">
                <span class="home-course-card__flag">${tc.flag}</span>
                <div>
                    <div class="home-course-card__title-row">
                        <h3 id="home-course-title">${escapeHTML(langName)}</h3>
                        <span>${i18n('home.course_structured')}</span>
                    </div>
                    <p>${i18n('home.course_track_desc')}</p>
                </div>
            </div>
            <div class="home-course-card__features">
                ${features.map(feature => `<span>${feature}</span>`).join('')}
            </div>
            <div class="home-course-card__progress">
                <div>
                    <span>${i18n('home.level_progress')}</span>
                    <strong>${textbook?.cefr || 'Pre-A1'} ${levelProgress.pct}%</strong>
                </div>
                <div class="home-course-card__bar"><span style="width:${levelProgress.pct}%;"></span></div>
                <div class="home-course-card__unit">
                    ${i18n('home.current_unit')}: ${escapeHTML(meta?.title || i18n('learn.next_lesson'))}
                </div>
            </div>
            <button type="button" class="home-course-card__map" id="home-course-map">
                ${LangyIcons.map} ${i18n('home.view_course_map')}
            </button>
        </section>
    `;
}

// Compact streak dots for inline row
function buildWeekDots() {
    const today = new Date();
    const activeDays = LangyState.streakData.activeDays || [];
    const todayISO = today.toISOString().split('T')[0];
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    let html = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const isDone = activeDays.includes(iso);
        const isToday = iso === todayISO;

        let bg = 'var(--border-light)';
        if (isDone) bg = 'var(--primary)';
        else if (isToday) bg = 'var(--danger)';

        html += `<span style="width:8px; height:8px; border-radius:50%; background:${bg};${isToday && !isDone ? ' box-shadow:0 0 0 2px rgba(239,68,68,0.2);' : ''}"></span>`;
    }
    return html;
}

// ─── Session Continuity Card ───
function buildContinuityCard() {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const { progress, streakData } = LangyState;
    const history = progress.lessonHistory || [];
    const skills = progress.skills || {};
    const talkCount = (LangyState.talkHistory || []).length;

    // Need at least some activity to show continuity
    if (history.length === 0 && talkCount === 0) return '';

    // Last session info
    const last = history[history.length - 1];
    const lastDate = last?.date || '';
    const lastScore = last?.score || 0;
    const lastTitle = last?.title || last?.unitId || '';

    // Skill analysis: find weakest and strongest
    const dims = [
        { key: 'speaking', label: { en: 'Speaking', ru: 'Говорение', es: 'Hablar' }, icon: '🎙', route: 'talk' },
        { key: 'listening', label: { en: 'Listening', ru: 'Аудирование', es: 'Escucha' }, icon: '🎧', route: 'listening' },
        { key: 'writing', label: { en: 'Writing', ru: 'Письмо', es: 'Escritura' }, icon: '✍️', route: 'homework' },
        { key: 'grammar', label: { en: 'Grammar', ru: 'Грамматика', es: 'Gramática' }, icon: '📖', route: 'grammar' },
        { key: 'vocabulary', label: { en: 'Vocabulary', ru: 'Словарь', es: 'Vocabulario' }, icon: '🧠', route: 'learning' },
    ];
    const sorted = [...dims].sort((a, b) => (skills[a.key] || 0) - (skills[b.key] || 0));
    const weakest = sorted[0];
    const weakVal = skills[weakest.key] || 0;

    // Check for improving skills (any skill > 10 and higher than average)
    const avg = dims.reduce((s, d) => s + (skills[d.key] || 0), 0) / dims.length;
    const improving = dims.filter(d => (skills[d.key] || 0) > avg && (skills[d.key] || 0) > 5);

    // Coach weak spots (available for all, not just coach subscribers)
    const weakSpots = (LangyState.coachData?.mistakePatterns || []).slice(0, 2);

    // Build the card
    let html = `<div class="card" style="margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-4); border:1px solid var(--border); background:var(--bg-card);">`;

    // Header
    html += `<div style="display:flex; align-items:center; gap:8px; margin-bottom:var(--sp-3);">
        <span style="color:var(--primary); font-size:16px;">${LangyIcons.clock}</span>
        <span style="font-weight:var(--fw-bold); font-size:var(--fs-sm);">${{ en: 'Welcome back', ru: 'С возвращением', es: 'Bienvenido de nuevo' }[lang]}</span>
    </div>`;

    // Last session recap
    if (last) {
        const scoreColor = lastScore >= 80 ? 'var(--accent-dark)' : lastScore >= 50 ? '#F59E0B' : 'var(--danger)';
        html += `<div style="display:flex; align-items:center; gap:var(--sp-3); padding:var(--sp-2) 0; margin-bottom:var(--sp-2); border-bottom:1px solid rgba(0,0,0,0.05);">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary);">${{ en: 'Last session', ru: 'Последняя сессия', es: 'Última sesión' }[lang]}</div>
            <div style="flex:1; font-size:var(--fs-xs); font-weight:var(--fw-semibold); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(lastTitle)}</div>
            <div style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:${scoreColor};">${lastScore}%</div>
        </div>`;
    }

    // Weak spots from mistake patterns
    if (weakSpots.length > 0) {
        const spotLabels = weakSpots.map(p => {
            const label = p.tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return `<span style="display:inline-flex; align-items:center; gap:3px; font-size:var(--fs-xs); padding:2px 8px; background:rgba(239,68,68,0.08); border-radius:var(--radius-full); color:var(--danger);">✗ ${label}</span>`;
        }).join(' ');
        html += `<div style="margin-bottom:var(--sp-2);">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:4px;">${{ en: 'Watch out for', ru: 'Обрати внимание', es: 'Ten cuidado con' }[lang]}</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">${spotLabels}</div>
        </div>`;
    }

    // Improving skills
    if (improving.length > 0) {
        const impLabels = improving.slice(0, 2).map(d =>
            `<span style="display:inline-flex; align-items:center; gap:3px; font-size:var(--fs-xs); padding:2px 8px; background:rgba(16,185,129,0.08); border-radius:var(--radius-full); color:var(--accent-dark);">✓ ${d.label[lang]}</span>`
        ).join(' ');
        html += `<div style="margin-bottom:var(--sp-2);">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:4px;">${{ en: 'Getting stronger', ru: 'Улучшается', es: 'Mejorando' }[lang]}</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px;">${impLabels}</div>
        </div>`;
    }

    // Vocabulary snapshot
    if (typeof VocabTracker !== 'undefined') {
        const vs = VocabTracker.getGlobalStats();
        if (vs.totalLearned > 0 || vs.dueToday > 0) {
            const vocabItems = [];
            if (vs.totalLearned > 0) vocabItems.push(`<span style="display:inline-flex; align-items:center; gap:3px; font-size:var(--fs-xs); padding:2px 8px; background:rgba(245,158,11,0.08); border-radius:var(--radius-full); color:#F59E0B;">${LangyIcons.brain} ${vs.totalLearned} ${{ en: 'words', ru: 'слов', es: 'palabras' }[lang]}</span>`);
            if (vs.dueToday > 0) vocabItems.push(`<span style="display:inline-flex; align-items:center; gap:3px; font-size:var(--fs-xs); padding:2px 8px; background:rgba(239,68,68,0.08); border-radius:var(--radius-full); color:var(--danger);">${vs.dueToday} ${{ en: 'to review', ru: 'к повтору', es: 'para repasar' }[lang]}</span>`);
            html += `<div style="margin-bottom:var(--sp-2);">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:4px;">${{ en: 'Vocabulary', ru: 'Словарь', es: 'Vocabulario' }[lang]}</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">${vocabItems.join(' ')}</div>
            </div>`;
        }
    }

    // Recommended next action — cross-mode intelligence
    if (typeof NextAction !== 'undefined') {
        html += NextAction.renderCard(lang, { excludeModes: ['homework'] });
    } else {
        html += `<button type="button" class="cont-recommend" data-route="${weakest.route}" style="width:100%; border:0; color:inherit; font:inherit; text-align:left; display:flex; align-items:center; gap:var(--sp-2); padding:var(--sp-2) var(--sp-3); margin-top:var(--sp-2); background:rgba(59,130,246,0.04); border-radius:var(--radius-sm); cursor:pointer;">
        <span style="font-size:16px;">${weakest.icon}</span>
        <div style="flex:1;">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--primary);">${LangyIcons.arrowRight} ${{ en: 'Suggested next', ru: 'Рекомендуем', es: 'Recomendado' }[lang]}</div>
            <div style="font-size:var(--fs-xs); font-weight:var(--fw-semibold);">${{ en: `Practice ${weakest.label.en}`, ru: `Практикуйте ${weakest.label.ru}`, es: `Practica ${weakest.label.es}` }[lang]} (${weakVal}%)</div>
        </div>
        <span style="color:var(--text-tertiary); font-size:12px;">${LangyIcons.arrowRight}</span>
    </button>`;
    }

    html += `</div>`;
    return html;
}

function renderHome(container) {
    const { currencies, streakData, user } = LangyState;
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    if (typeof user.firstSessionCompleted !== 'boolean') {
        user.firstSessionCompleted = (LangyState.talkHistory || []).length > 0;
    }
    if (typeof user.firstSpeakingScenarioStarted !== 'boolean') {
        user.firstSpeakingScenarioStarted = user.firstSessionCompleted;
    }
    if (!user.firstSpeakingScenarioId) {
        user.firstSpeakingScenarioId = 'coffee';
    }
    // Backfill firstLessonCompleted for existing users
    if (typeof user.firstLessonCompleted !== 'boolean') {
        user.firstLessonCompleted = (LangyState.progress.lessonHistory || []).length > 0;
    }

    const talkSessions = (LangyState.talkHistory || []).length;
    const isFirstJourney = !user.hasCompletedOnboarding && !user.firstSessionCompleted;
    const isBeforeFirstSession = !user.firstSessionCompleted;
    const isEarlyJourney = isFirstJourney || isBeforeFirstSession || talkSessions < 3;
    const firstScenario = user.firstSpeakingScenarioId || 'coffee';
    const nextScenarioByGoal = {
        speak: 'coffee',
        work: 'interview',
        travel: 'airport',
        fun: 'coffee',
        exam: 'free',
    };
    const recommendedScenario = isBeforeFirstSession
        ? firstScenario
        : nextScenarioByGoal[user.goal] || 'coffee';
    const activeLessonMeta = getActiveLessonMeta();
    const pendingHomeworkCount = LangyState.homework?.current?.length || 0;
    const homeworkBadge = pendingHomeworkCount > 0
        ? `<span class="action-card__badge" aria-label="${pendingHomeworkCount} pending homework">${pendingHomeworkCount}</span>`
        : '';

    container.innerHTML = `
        <div class="screen screen--no-pad home">
            <!-- Top Bar -->
            <div class="home__topbar">
                <div class="home__coins">
                    <button type="button" class="coin" id="coin-langy" aria-label="Buy Langy coins">
                        <div class="coin__icon coin__icon--gold" style="color:white; font-size:12px;">${LangyIcons.coins}</div>
                        <span id="langy-count">${currencies.langy}</span>
                        <span style="color:var(--primary); font-weight:var(--fw-bold); margin-left:var(--sp-1);">+</span>
                    </button>
                    <button type="button" class="coin" id="coin-dangy" aria-label="Buy Dangy crystals">
                        <div class="coin__icon coin__icon--silver" style="color:white; font-size:12px;">${LangyIcons.diamond}</div>
                        <span id="dangy-count">${currencies.dangy}</span>
                        <span style="color:var(--primary); font-weight:var(--fw-bold); margin-left:var(--sp-1);">+</span>
                    </button>
                </div>
                <button type="button" class="header-stat" id="home-profile" title="Profile" aria-label="Open profile" style="width:40px;height:40px;border:0;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;font-weight:var(--fw-black);font-size:var(--fs-lg);">
                ${(user.name || 'U')[0].toUpperCase()}
            </button>
            </div>

            <!-- Hero Stage -->
            <div class="home__stage">
                <!-- Mascot Stage (3D-ready container) -->
                <div class="home__mascot-stage" id="home-mascot" style="--mascot-color: ${['#7C6CF6','#4ADE80','#F59E0B','#06B6D4'][LangyState.mascot.selected || 0]};">
                    <img 
                        id="mascot-img"
                        src="assets/mascots/${(typeof TalkEngine !== 'undefined' ? TalkEngine.getMascotImage(LangyState.mascot.selected || 0) : ['zendaya','travis','matthew','omar','elyanna','adel_imam'][LangyState.mascot.selected || 0])}.png" 
                        alt="Langy Mascot" 
                        class="home__mascot-img"
                    >
                    <!-- Speech Bubble -->
                    <div class="mascot-bubble" id="mascot-bubble" style="display:none;">
                        <span id="mascot-bubble-text"></span>
                    </div>
                    <!-- Tap zone -->
                    <button type="button" style="position:absolute; inset:0; z-index:10; cursor:pointer; border:0; background:transparent;" title="Tap to Talk!" aria-label="Talk with mascot" id="mascot-tap-zone"></button>
                </div>
                <!-- Mascot identity -->
                <div class="home__mascot-name">
                    ${['Zendaya','Travis','Matthew','Omar','Elyanna','Adel Imam'][LangyState.mascot.selected || 0]}
                    <span class="home__mascot-trait">${[
                        { en: 'Cheerful', ru: 'Весёлая', es: 'Alegre' },
                        { en: 'Creative', ru: 'Креативный', es: 'Creativo' },
                        { en: 'Structured', ru: 'Системный', es: 'Estructurado' },
                        { en: 'Supportive', ru: 'Чуткий', es: 'Comprensivo' },
                        { en: 'Magnetic', ru: 'Обаятельная', es: 'Magnética' },
                        { en: 'Theatrical', ru: 'Театральный', es: 'Teatral' },
                    ][LangyState.mascot.selected || 0][lang]}</span>
                </div>

                <!-- Streak Row (minimal) -->
                <div class="home__streak-row" id="home-streak">
                    <span class="fire-animated ${streakData.days > 0 ? 'fire-animated--active' : 'fire-animated--inactive'}" style="font-size:18px;">${LangyIcons.flame}</span>
                    <span style="font-weight:var(--fw-black); font-size:var(--fs-md);">${streakData.days > 0 ? streakData.days : '0'}</span>
                    <div class="home__streak-dots">
                        ${buildWeekDots()}
                    </div>
                    <span style="color:var(--text-tertiary); font-size:var(--fs-xs); margin-left:auto;">${LangyIcons.arrow}</span>
                </div>
            </div>

            <div class="home-priority-stack" id="home-priority-stack">
                ${renderHomeLessonCard(activeLessonMeta)}
                ${renderHomeTalkCard(activeLessonMeta, recommendedScenario)}
                ${renderHomeCourseCard(activeLessonMeta)}
                ${user.hasCompletedPlacement ? buildContinuityCard() : ''}
            </div>
            <!-- Ecosystem Grid -->
            <div class="home__ecosystem">
                <!-- Learn Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.bookOpen} ${{ en: 'Learn', ru: 'Учиться', es: 'Aprender' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions">
                        <button type="button" class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-homework" aria-disabled="${!user.hasCompletedPlacement}" aria-label="${i18n('home.homework')}">
                            <div class="action-card__icon action-card__icon--purple">${LangyIcons.book}</div>
                            <div class="action-card__title">${i18n('home.homework')} ${homeworkBadge} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </button>
                        <button type="button" class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-tests" aria-disabled="${!user.hasCompletedPlacement}" aria-label="${i18n('home.tests')}">
                            <div class="action-card__icon action-card__icon--green">${LangyIcons.fileText}</div>
                            <div class="action-card__title">${i18n('home.tests')} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </button>
                        <button type="button" class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-results" aria-disabled="${!user.hasCompletedPlacement}" aria-label="Results">
                            <div class="action-card__icon action-card__icon--blue">${LangyIcons.barChart}</div>
                            <div class="action-card__title">${{ en: 'Results', ru: 'Результаты', es: 'Resultados' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </button>
                    </div>
                </div>

                <!-- Activities Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.zap} ${{ en: 'Activities', ru: 'Активности', es: 'Actividades' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions">
                        <button type="button" class="action-card" id="nav-duels" aria-label="Duels">
                            <div class="action-card__icon action-card__icon--red">${LangyIcons.swords}</div>
                            <div class="action-card__title">${{ en: 'Duels', ru: 'Дуэли', es: 'Duelos' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </button>
                        <button type="button" class="action-card" id="nav-events" aria-label="Events">
                            <div class="action-card__icon action-card__icon--violet">${LangyIcons.sparkles}</div>
                            <div class="action-card__title">${{ en: 'Events', ru: 'События', es: 'Eventos' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </button>
                        <button type="button" class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-daily" aria-disabled="${!user.hasCompletedPlacement}" aria-label="${i18n('home.daily')}">
                            <div class="action-card__icon action-card__icon--gold">${LangyIcons.target}</div>
                            <div class="action-card__title">${i18n('home.daily')} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </button>
                    </div>
                </div>

                <!-- Rewards Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.trophy} ${{ en: 'Rewards', ru: 'Награды', es: 'Recompensas' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions home__actions--two">
                        <button type="button" class="action-card" id="nav-inventory" aria-label="Inventory">
                            <div class="action-card__icon action-card__icon--gold">${LangyIcons.briefcase}</div>
                            <div class="action-card__title">${{ en: 'Inventory', ru: 'Инвентарь', es: 'Inventario' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </button>
                        <button type="button" class="action-card" id="nav-shop" aria-label="Shop">
                            <div class="action-card__icon action-card__icon--blue">${LangyIcons.shoppingBag}</div>
                            <div class="action-card__title">${{ en: 'Shop', ru: 'Магазин', es: 'Tienda' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Navigation handlers
    const navMap = {
        'nav-homework': 'homework',
        'nav-tests': 'tests',
        'nav-results': 'results',
        'nav-daily': 'daily',
        'nav-duels': 'duels',
        'nav-events': 'events',
        'nav-inventory': 'inventory',
        'nav-shop': 'shop',
        'home-profile': 'profile',
        'home-course-map': 'progress',
    };

    const launchTalkFromHome = mode => {
        const talkOptions = container.querySelector('.home-talk-options');
        const scenarioFromCard = talkOptions?.dataset.recommendedScenario || recommendedScenario || 'coffee';
        const scenarioByMode = {
            free: 'free',
            lesson: scenarioFromCard,
            mistakes: scenarioFromCard,
            scenario: scenarioFromCard,
            resume: ScreenState.get('talkScenario', scenarioFromCard),
        };

        ScreenState.set('talkScenario', scenarioByMode[mode] || scenarioFromCard);
        ScreenState.set('talkMascot', LangyState.mascot.selected || 0);
        ScreenState.set('guidedSpeaking', mode !== 'free');
        ScreenState.set('talkView', mode === 'resume' && ScreenState.get('talkView') ? ScreenState.get('talkView') : 'call');

        if (mode === 'mistakes') {
            const topPattern = LangyState.coachData?.mistakePatterns?.[0];
            if (topPattern) {
                ScreenState.set('coachFocus', topPattern.label || topPattern.tag);
                ScreenState.set('coachFocusTag', topPattern.tag);
            }
        } else {
            ScreenState.remove('coachFocus');
            ScreenState.remove('coachFocusTag');
        }

        Router.navigate('talk');
    };

    // Main CTA button: lesson is always the primary Home action.
    container.querySelector('#nav-learning')?.addEventListener('click', e => {
        Anim.ripple(e);
        if (!user.hasCompletedPlacement) {
            Router.navigate('placement-test');
            return;
        }
        const actionCards = container.querySelectorAll('.action-card');
        Anim.flyOut([...actionCards]);
        setTimeout(() => Router.navigate('learning'), 500);
    });

    container.querySelectorAll('.home-talk-option').forEach(button => {
        button.addEventListener('click', e => {
            Anim.ripple(e);
            launchTalkFromHome(button.dataset.talkMode);
        });
    });
    Object.entries(navMap).forEach(([id, route]) => {
        const el = container.querySelector(`#${id}`);
        if (el) {
            el.addEventListener('click', e => {
                if (!user.hasCompletedPlacement && ['homework', 'tests', 'results', 'daily'].includes(route)) {
                    Anim.showToast({ en: 'Please complete your Placement Test first!', ru: 'Сначала пройди тест на уровень!', es: '¡Completa primero tu prueba de nivel!' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']);
                    setTimeout(() => Router.navigate('placement-test'), 1000);
                    return;
                }
                Anim.ripple(e);
                Router.navigate(route);
            });
        }
    });

    // Continuity card recommendation — NextAction or fallback
    if (typeof NextAction !== 'undefined') {
        NextAction.bindEvents(container);
    }
    container.querySelector('.cont-recommend')?.addEventListener('click', () => {
        const route = container.querySelector('.cont-recommend')?.dataset.route;
        if (route) Router.navigate(route);
    });

    // Daily Speaking card → launch talk
    container.querySelector('#daily-speak-card')?.addEventListener('click', () => {
        if (typeof DailySpeaking !== 'undefined' && !DailySpeaking.isDoneToday()) {
            DailySpeaking.launchDaily();
        }
    });

    // Streak tap → overlay
    container.querySelector('#home-streak')?.addEventListener('click', () => {
        Router.navigate('streak');
    });

    // Buy currencies from main screen
    container.querySelector('#coin-langy')?.addEventListener('click', () => {
        Router.navigate('donation', { plan: 'langy_pack' });
    });
    container.querySelector('#coin-dangy')?.addEventListener('click', () => {
        Router.navigate('donation', { plan: 'dangy_pack' });
    });

    // Mascot tap → bounce reaction + speech bubble, then learning
    let mascotTapCount = 0;

    // Signature phrases come FIRST, then generic
    const mascotId = LangyState.mascot.selected || 0;
    const signaturePhrases = {
        3: ['Yellaaaaaaaaaa!', "Yella habibi, let's go!", 'Listen to my story...'],
        1: ["It's lit!", 'Straight up!', 'La Flame says LEARN!'],
        2: ['Alright, alright, alright.', "Just keep livin'.", "Let's get learnin'."],
        0: ['You look amazing today!', "Let's serve some English!", 'Slay this lesson!'],
    };
    const genericPhrases = [
        'Wanna chat?',
        'Tap again to talk!',
        "Let's have a conversation!",
        'Practice speaking with me!',
    ];
    // First tap = always signature, then mix
    let usedSignature = false;

    container.querySelector('#mascot-tap-zone')?.addEventListener('click', () => {
        mascotTapCount++;
        const img = container.querySelector('#mascot-img');
        const bubble = container.querySelector('#mascot-bubble');
        const bubbleText = container.querySelector('#mascot-bubble-text');

        let phrase;
        const sigs = signaturePhrases[mascotId] || [];
        if (!usedSignature && sigs.length > 0) {
            phrase = sigs[0]; // Always show THE signature phrase first
            usedSignature = true;
        } else {
            const allPhrases = [...sigs, ...genericPhrases];
            phrase = allPhrases[Math.floor(Math.random() * allPhrases.length)];
        }

        // Bounce animation
        if (img) {
            img.style.animation = 'none';
            img.offsetHeight; // trigger reflow
            img.style.animation = 'mascotBounce 0.6s ease';
            setTimeout(() => {
                img.style.animation = 'mascotIdle 4s ease-in-out infinite';
            }, 600);
        }

        // Show speech bubble
        if (bubble && bubbleText) {
            bubbleText.textContent = phrase;
            bubble.style.display = 'block';
            bubble.style.animation = 'none';
            bubble.offsetHeight;
            bubble.style.animation = 'bubblePop 0.4s ease-out';

            // Auto-hide after 2s
            clearTimeout(ScreenState.get('bubbleTimeout'));
            ScreenState.set(
                'bubbleTimeout',
                setTimeout(() => {
                    bubble.style.animation = 'bubbleFade 0.3s ease-in forwards';
                    setTimeout(() => {
                        bubble.style.display = 'none';
                    }, 300);
                }, 2000)
            );
        }

        // On second tap → go to Langy Talk
        if (mascotTapCount >= 2) {
            mascotTapCount = 0;
            ScreenState.set('talkMascot', mascotId); // Pre-select current mascot
            ScreenState.remove('talkView'); // Start at selection screen
            const actionCards = container.querySelectorAll('.action-card');
            Anim.flyOut([...actionCards]);
            setTimeout(() => Router.navigate('talk'), 500);
        }
    });

    // Animate entry
    if (!isEarlyJourney) {
        setTimeout(() => {
            Anim.staggerChildren(container, '.action-card', 80);
        }, 100);
    }

    // Pull-to-refresh
    const homeScreen = container.querySelector('.home');
    if (homeScreen && typeof Anim !== 'undefined') {
        Anim.initPullToRefresh(homeScreen, () => {
            return new Promise(resolve => {
                renderHome(container);
                resolve();
            });
        });
    }

    // ─── First-Time Onboarding Tooltips ───
    if (!isEarlyJourney && !localStorage.getItem('langy_onboarding_done')) {
        setTimeout(() => showOnboardingTooltips(container), 800);
    }
}

// ─── ONBOARDING TOOLTIP TOUR ───
function showOnboardingTooltips(container) {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const tips = {
        en: [
            { sel: '.home__streak', text: 'This is your streak! Visit daily to keep it going.', pos: 'bottom' },
            { sel: '.action-card', text: 'Tap here to start your first lesson!', pos: 'top' },
            { sel: '#bottom-nav', text: 'Swipe or tap to navigate between screens.', pos: 'top' },
        ],
        ru: [
            { sel: '.home__streak', text: 'Это твой стрик! Заходи каждый день, чтобы не потерять.', pos: 'bottom' },
            { sel: '.action-card', text: 'Нажми сюда, чтобы начать первый урок!', pos: 'top' },
            { sel: '#bottom-nav', text: 'Свайпай или нажимай для навигации.', pos: 'top' },
        ],
        es: [
            { sel: '.home__streak', text: '¡Esta es tu racha! Entra cada día para mantenerla.', pos: 'bottom' },
            { sel: '.action-card', text: '¡Toca aquí para empezar tu primera lección!', pos: 'top' },
            { sel: '#bottom-nav', text: 'Desliza o toca para navegar entre pantallas.', pos: 'top' },
        ],
    };

    const localTips = tips[lang] || tips.en;
    const currentTip = 0;

    function showTip(idx) {
        // Remove previous
        document.querySelectorAll('.onboarding-tooltip, .onboarding-overlay').forEach(e => e.remove());

        if (idx >= localTips.length) {
            localStorage.setItem('langy_onboarding_done', '1');
            return;
        }

        const tip = localTips[idx];
        const target = document.querySelector(tip.sel);
        if (!target) {
            showTip(idx + 1);
            return;
        }

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        document.body.appendChild(overlay);

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = `onboarding-tooltip onboarding-tooltip--${tip.pos}`;

        const stepLabel =
            lang === 'ru'
                ? `${idx + 1} из ${localTips.length}`
                : lang === 'es'
                  ? `${idx + 1} de ${localTips.length}`
                  : `${idx + 1} of ${localTips.length}`;
        const nextLabel =
            idx < localTips.length - 1
                ? lang === 'ru'
                    ? 'Далее'
                    : lang === 'es'
                      ? 'Siguiente'
                      : 'Next'
                : lang === 'ru'
                  ? 'Готово!'
                  : lang === 'es'
                    ? '¡Listo!'
                    : 'Done!';

        tooltip.innerHTML = `
            <div class="onboarding-tooltip__text">${tip.text}</div>
            <div class="onboarding-tooltip__footer">
                <span class="onboarding-tooltip__step">${stepLabel}</span>
                <button class="onboarding-tooltip__btn">${nextLabel}</button>
            </div>
        `;
        document.body.appendChild(tooltip);

        // Position tooltip near target
        const rect = target.getBoundingClientRect();
        if (tip.pos === 'bottom') {
            tooltip.style.top = `${rect.bottom + 12}px`;
        } else {
            tooltip.style.bottom = `${window.innerHeight - rect.top + 12}px`;
        }
        tooltip.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - 300))}px`;

        // Highlight target
        target.style.position = 'relative';
        target.style.zIndex = '10001';

        // Next button
        tooltip.querySelector('.onboarding-tooltip__btn').addEventListener('click', () => {
            target.style.zIndex = '';
            Anim.haptic('light');
            showTip(idx + 1);
        });

        // Clicking overlay skips all
        overlay.addEventListener('click', () => {
            target.style.zIndex = '';
            document.querySelectorAll('.onboarding-tooltip, .onboarding-overlay').forEach(e => e.remove());
            localStorage.setItem('langy_onboarding_done', '1');
        });
    }

    showTip(0);
}

Router.register('home', renderHome);
