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
        title: `Unit ${unit.id}: ${unit.title}`,
        subtitle: `${unit.desc || unit.grammar?.join(', ') || i18n('learn.next_lesson')} · ${exerciseCount} ${i18n('learn.exercises')} · ~${minutes} ${i18n('learn.minutes')}`,
    };
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
        html += NextAction.renderCard(lang);
    } else {
        html += `<div class="cont-recommend" data-route="${weakest.route}" style="display:flex; align-items:center; gap:var(--sp-2); padding:var(--sp-2) var(--sp-3); margin-top:var(--sp-2); background:rgba(59,130,246,0.04); border-radius:var(--radius-sm); cursor:pointer;">
        <span style="font-size:16px;">${weakest.icon}</span>
        <div style="flex:1;">
            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--primary);">${LangyIcons.arrowRight} ${{ en: 'Suggested next', ru: 'Рекомендуем', es: 'Recomendado' }[lang]}</div>
            <div style="font-size:var(--fs-xs); font-weight:var(--fw-semibold);">${{ en: `Practice ${weakest.label.en}`, ru: `Практикуйте ${weakest.label.ru}`, es: `Practica ${weakest.label.es}` }[lang]} (${weakVal}%)</div>
        </div>
        <span style="color:var(--text-tertiary); font-size:12px;">${LangyIcons.arrowRight}</span>
    </div>`;
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
    const lessonsDone = (LangyState.progress.lessonHistory || []).length;
    const isFirstJourney = !user.hasCompletedOnboarding && !user.firstSessionCompleted;
    const isBeforeFirstSession = !user.firstSessionCompleted;
    const isEarlyJourney = isFirstJourney || isBeforeFirstSession || talkSessions < 3;
    // True beginner: zero/basic confidence AND hasn't done a lesson yet
    // Also treat unknown confidence (null) + no lessons as true beginner
    const isTrueBeginner = isEarlyJourney && lessonsDone === 0 && (user.confidenceLevel === 'zero' || user.confidenceLevel === 'basic' || !user.confidenceLevel);
    // Post-lesson beginner: did a lesson but hasn't spoken yet
    const isPostLessonBeginner = isEarlyJourney && lessonsDone > 0 && !user.firstSessionCompleted;
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

    container.innerHTML = `
        <div class="screen screen--no-pad home">
            <!-- Top Bar -->
            <div class="home__topbar">
                <div class="home__coins">
                    <div class="coin" id="coin-langy" style="cursor:pointer; transition:transform 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                        <div class="coin__icon coin__icon--gold" style="color:white; font-size:12px;">${LangyIcons.coins}</div>
                        <span id="langy-count">${currencies.langy}</span>
                        <span style="color:var(--primary); font-weight:var(--fw-bold); margin-left:var(--sp-1);">+</span>
                    </div>
                    <div class="coin" id="coin-dangy" style="cursor:pointer; transition:transform 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                        <div class="coin__icon coin__icon--silver" style="color:white; font-size:12px;">${LangyIcons.diamond}</div>
                        <span id="dangy-count">${currencies.dangy}</span>
                        <span style="color:var(--primary); font-weight:var(--fw-bold); margin-left:var(--sp-1);">+</span>
                    </div>
                </div>
                <div class="header-stat" id="home-profile" title="Profile" style="width:40px;height:40px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;cursor:pointer;font-weight:var(--fw-black);font-size:var(--fs-lg);">
                ${(user.name || 'U')[0].toUpperCase()}
            </div>
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
                    <div style="position:absolute; inset:0; z-index:10; cursor:pointer;" title="Tap to Talk!" id="mascot-tap-zone"></div>
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

            <!-- Language Path Badge -->
            ${(() => {
                const tc = typeof LangyTarget !== 'undefined' ? LangyTarget.current : null;
                if (!tc) return '';
                const isFeatured = tc.featured === true;
                const langName = typeof LangyTarget !== 'undefined' && LangyTarget.displayName ? LangyTarget.displayName(lang) : tc.nativeName;
                const tagline = tc.tagline ? (tc.tagline[lang] || tc.tagline.en) : '';
                const highlights = tc.highlights ? (tc.highlights[lang] || tc.highlights.en) : [];
                const fc = '#D97706';

                if (isFeatured) {
                    // Track-specific enrichment
                    const isEnglishTrack = tc.code === 'en';
                    const isArabicTrack = tc.code === 'ar';
                    const trackColor = tc.trackColor || fc;
                    let cefrBar = '';
                    let unitCtx = '';
                    let pathCtx = '';

                    // CEFR progress bar (English + Arabic)
                    if ((isEnglishTrack || isArabicTrack) && typeof LangyCurriculum !== 'undefined') {
                        const tb = LangyCurriculum.getActive();
                        if (tb) {
                            const mastery = LangyState.progress?.mastery || {};
                            const passed = tb.units.filter(u => { const k = tb.id + ':' + u.id; return mastery[k] && mastery[k].passed; }).length;
                            const pct = Math.round((passed / tb.units.length) * 100);
                            const unitId = LangyState.progress?.currentUnitId || 1;
                            const curUnit = tb.units.find(u => u.id === unitId);
                            cefrBar = `<div style="margin-top:6px;">
                                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                                    <span style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.3px;">${tb.cefr} ${{ en: 'progress', ru: 'прогресс', es: 'progreso' }[lang]}</span>
                                    <span style="font-size:9px; font-weight:var(--fw-bold); color:${trackColor};">${pct}%</span>
                                </div>
                                <div style="height:4px; background:rgba(128,128,128,0.1); border-radius:2px; overflow:hidden;">
                                    <div style="height:100%; width:${pct}%; background:${trackColor}; border-radius:2px; transition:width 0.5s;"></div>
                                </div>
                            </div>`;
                            if (curUnit) {
                                unitCtx = `<div style="font-size:9px; color:var(--text-tertiary); margin-top:4px;">
                                    ${LangyIcons.bookOpen} ${{ en: 'Unit', ru: 'Урок', es: 'Unidad' }[lang]} ${unitId}: ${curUnit.title}${curUnit.grammar?.length ? ` · ${curUnit.grammar[0]}` : ''}
                                </div>`;
                            }
                        }
                    }

                    // Arabic-specific: show learner path based on onboarding goal
                    if (isArabicTrack && tc.learnerPaths) {
                        const userGoal = LangyState.user?.goal || 'speak';
                        const path = tc.learnerPaths[userGoal];
                        if (path) {
                            pathCtx = `<div style="font-size:9px; color:${trackColor}; margin-top:4px; display:flex; align-items:center; gap:4px;">
                                <span>${path.icon}</span> ${path.label[lang] || path.label.en}
                            </div>`;
                        }
                    }

                    // Badge label: English=Structured, Arabic=Script-First (from trackIdentity), others=Featured
                    const badgeLabel = tc.trackIdentity
                        ? (tc.trackIdentity[lang] || tc.trackIdentity.en)
                        : isEnglishTrack
                            ? ({ en: 'Structured', ru: 'Структурный', es: 'Estructurado' }[lang])
                            : ({ en: 'Featured', ru: 'Топ', es: 'Destacado' }[lang]);

                    return `<div style="
                        margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-3) var(--sp-4);
                        background:${trackColor}06; border:1px solid ${trackColor}22;
                        border-radius:var(--radius-lg); display:flex; align-items:flex-start; gap:var(--sp-3);
                    ">
                        <span style="font-size:28px; flex-shrink:0;">${tc.flag}</span>
                        <div style="flex:1; min-width:0;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <span style="font-weight:var(--fw-bold); font-size:var(--fs-sm);">${langName}</span>
                                <span style="font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;
                                    background:${trackColor}; color:#fff; padding:1px 6px; border-radius:4px; line-height:14px;">
                                    ${badgeLabel}</span>
                            </div>
                            <div style="font-size:10px; color:${trackColor}; margin-top:2px; font-weight:var(--fw-semibold, 600);">${tagline}</div>
                            ${highlights.length > 0 ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                                ${highlights.map(h => `<span style="font-size:9px; padding:1px 6px; border-radius:var(--radius-full);
                                    background:${trackColor}08; color:${trackColor}; border:1px solid ${trackColor}15;">${h}</span>`).join('')}
                            </div>` : ''}
                            ${pathCtx}
                            ${cefrBar}
                            ${unitCtx}
                        </div>
                    </div>`;
                }
                return `<div style="
                    margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-2) var(--sp-4);
                    background:var(--bg-card); border:1px solid var(--border);
                    border-radius:var(--radius-lg); display:flex; align-items:center; gap:var(--sp-2);
                ">
                    <span style="font-size:20px;">${tc.flag}</span>
                    <span style="font-weight:var(--fw-semibold, 600); font-size:var(--fs-sm);">${langName}</span>
                </div>`;
            })()}

            <!-- Current Learning Goal -->
            ${(() => {
                if (typeof LangyCurriculum === 'undefined' || typeof LangyTarget === 'undefined') return '';
                const targetCode = LangyTarget.getCode();
                if (targetCode !== 'en' && targetCode !== 'ar') return '';
                const tb = LangyCurriculum.getActive();
                if (!tb || !tb.canDo || !tb.canDo.length) return '';
                const currentUnitId = activeLessonMeta?.unit?.id || 1;
                const completed = Math.max(0, currentUnitId - 1);
                const nextGoal = activeLessonMeta?.goal || tb.canDo[Math.min(completed, tb.canDo.length - 1)];
                if (!nextGoal) return '';
                const l = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
                const tc = LangyTarget.current;
                const goalColor = (targetCode === 'ar' && tc.trackColor) ? tc.trackColor : '#10B981';
                const goalIcon = targetCode === 'ar' ? (tc.learnerPaths?.[LangyState.user?.goal]?.icon || LangyIcons.target) : LangyIcons.target;
                return `<div style="margin:0 var(--sp-5) var(--sp-2); padding:var(--sp-2) var(--sp-3); background:${goalColor}08; border:1px solid ${goalColor}1A; border-radius:var(--radius-md); display:flex; align-items:center; gap:8px; cursor:pointer;" id="home-cando-goal">
                    <span style="color:${goalColor}; flex-shrink:0; font-size:14px;">${goalIcon}</span>
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${goalColor}; line-height:1;">${{ en: 'Next goal', ru: 'Следующая цель', es: 'Próxima meta' }[l]} · ${tb.cefr}</div>
                        <div style="font-size:10px; color:var(--text-secondary); line-height:1.4; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${nextGoal}</div>
                    </div>
                    <span style="font-size:9px; color:var(--text-tertiary);">${completed}/${tb.canDo.length}</span>
                </div>`;
            })()}

            <!-- Next Action Zone -->
            <div class="home__next-action">
                ${(() => {
                    if (isTrueBeginner) {
                        // True beginner: lesson milestone card
                        return `
                <div class="card" style="margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-3) var(--sp-4); border:1px solid var(--border); background:var(--bg-card);">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:var(--sp-3);">
                        <div>
                            <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">
                                ${{ en: 'Your learning path', ru: 'Твой путь обучения', es: 'Tu camino de aprendizaje' }[lang]}
                            </div>
                            <div style="font-weight:var(--fw-bold);">
                                ${{ en: 'Start with a lesson', ru: 'Начни с урока', es: 'Empieza con una lección' }[lang]}
                            </div>
                        </div>
                        <span style="font-size:20px;">📖</span>
                    </div>
                </div>`;
                    } else if (isPostLessonBeginner) {
                        // Post-lesson: speaking milestone
                        return `
                <div class="card" style="margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-3) var(--sp-4); border:1px solid var(--border); background:var(--bg-card);">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:var(--sp-3);">
                        <div>
                            <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">
                                ${{ en: 'Ready to practice!', ru: 'Готов к практике!', es: '¡Listo para practicar!' }[lang]}
                            </div>
                            <div style="font-weight:var(--fw-bold);">
                                ${{ en: 'Lesson done — time to speak', ru: 'Урок пройден — время говорить', es: 'Lección hecha — hora de hablar' }[lang]}
                            </div>
                        </div>
                        <span style="font-size:20px;">🎙</span>
                    </div>
                </div>`;
                    } else if (isEarlyJourney) {
                        // Intermediate/advanced early journey: speaking first (existing)
                        return `
                <div class="card" style="margin:0 var(--sp-5) var(--sp-3); padding:var(--sp-3) var(--sp-4); border:1px solid var(--border); background:var(--bg-card);">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:var(--sp-3);">
                        <div>
                            <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">
                                ${isBeforeFirstSession
                                    ? ({ en: 'First speaking session', ru: 'Первая разговорная сессия', es: 'Primera sesión de habla' }[lang])
                                    : ({ en: 'First-week momentum', ru: 'Фокус первой недели', es: 'Impulso de la primera semana' }[lang])}
                            </div>
                            <div style="font-weight:var(--fw-bold);">
                                ${isBeforeFirstSession
                                    ? ({ en: 'Step 1/3', ru: 'Шаг 1/3', es: 'Paso 1/3' }[lang])
                                    : ({ en: `Session ${Math.max(1, talkSessions + 1)} of 3`, ru: `Сессия ${Math.max(1, talkSessions + 1)} из 3`, es: `Sesión ${Math.max(1, talkSessions + 1)} de 3` }[lang])}
                            </div>
                        </div>
                        <span style="font-size:20px;">🎯</span>
                    </div>
                </div>`;
                    } else {
                        // Established user: daily speaking + continuity
                        return `
                ${typeof DailySpeaking !== 'undefined' && user.hasCompletedPlacement ? DailySpeaking.renderCard() : ''}`;
                    }
                })()}

                ${!isEarlyJourney && user.hasCompletedPlacement ? buildContinuityCard() : ''}

                <!-- Main CTA -->
                <div style="padding: 0 var(--sp-5) var(--sp-2);">
                    <button id="nav-learning" class="btn btn--primary btn--xl btn--full" style="font-size: var(--fs-lg); display: flex; align-items: center; justify-content: center; gap: var(--sp-2); flex-direction: column; padding: 14px 24px;">
                        ${(() => {
                            if (isTrueBeginner) {
                                // True beginner: lesson-first CTA
                                return `<div style="display:flex; align-items:center; gap:var(--sp-2);"><span style="font-size: 22px; display:flex;">${LangyIcons.bookOpen}</span> ${{ en: 'Start your first lesson', ru: 'Начать первый урок', es: 'Empezar tu primera lección' }[lang]}</div>
                                <div style="font-size:var(--fs-xs); opacity:0.8; font-weight:var(--fw-medium);">${activeLessonMeta ? activeLessonMeta.subtitle : ({ en: 'Learn key phrases before speaking', ru: 'Выучи ключевые фразы перед разговором', es: 'Aprende frases clave antes de hablar' }[lang])}</div>`;
                            } else if (isPostLessonBeginner) {
                                // Post-lesson: speaking CTA becomes primary
                                return `<div style="display:flex; align-items:center; gap:var(--sp-2);"><span style="font-size: 22px; display:flex;">${LangyIcons.mic}</span> ${{ en: 'Practice what you learned', ru: 'Практикуй то, что выучил', es: 'Practica lo que aprendiste' }[lang]}</div>
                                <div style="font-size:var(--fs-xs); opacity:0.8; font-weight:var(--fw-medium);">${{ en: 'Guided speaking session', ru: 'Разговорная сессия с поддержкой', es: 'Sesión de habla guiada' }[lang]}</div>`;
                            } else if (isEarlyJourney) {
                                // Intermediate/advanced: speaking-first
                                return `<div style="display:flex; align-items:center; gap:var(--sp-2);"><span style="font-size: 22px; display:flex;">${LangyIcons.mic}</span> ${
                                    isBeforeFirstSession
                                        ? ({ en: 'Start guided speaking', ru: 'Начать разговорную практику', es: 'Iniciar práctica de habla' }[lang])
                                        : ({ en: 'Next speaking session', ru: 'Следующая разговорная сессия', es: 'Siguiente sesión de habla' }[lang])
                                }</div>
                                <div style="font-size:var(--fs-xs); opacity:0.8; font-weight:var(--fw-medium);">${{ en: 'Short guided conversation', ru: 'Короткий разговор с поддержкой', es: 'Conversación guiada corta' }[lang]}</div>`;
                            } else if (!user.hasCompletedPlacement) {
                                return `${i18n('learn.title')} ${LangyIcons.fileText}`;
                            } else {
                                return `<div style="display:flex; align-items:center; gap:var(--sp-2);"><span style="font-size: 22px; display:flex;">${LangyIcons.rocket}</span> ${i18n('home.continue')}</div><div style="font-size:var(--fs-xs); opacity:0.8; font-weight:var(--fw-medium);">${activeLessonMeta ? activeLessonMeta.subtitle : i18n('learn.next_lesson')}</div>`;
                            }
                        })()}
                    </button>
                </div>

                ${isPostLessonBeginner ? `
                <!-- Secondary CTA: Continue lessons -->
                <div style="padding: 0 var(--sp-5) var(--sp-2);">
                    <button id="nav-continue-lesson" class="btn btn--secondary btn--lg btn--full" style="font-size: var(--fs-md); display: flex; align-items: center; justify-content: center; gap: var(--sp-2);">
                        ${LangyIcons.bookOpen} ${{ en: 'Continue lessons', ru: 'Продолжить уроки', es: 'Continuar lecciones' }[lang]}
                    </button>
                </div>` : ''}
            </div>

            <!-- Ecosystem Grid -->
            <div class="home__ecosystem">
                <!-- Learn Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.bookOpen} ${{ en: 'Learn', ru: 'Учиться', es: 'Aprender' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions">
                        <div class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-homework">
                            <div class="action-card__icon action-card__icon--purple">${LangyIcons.book}</div>
                            <div class="action-card__title">${i18n('home.homework')} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </div>
                        <div class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-tests">
                            <div class="action-card__icon action-card__icon--green">${LangyIcons.fileText}</div>
                            <div class="action-card__title">${i18n('home.tests')} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </div>
                        <div class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-results">
                            <div class="action-card__icon action-card__icon--blue">${LangyIcons.barChart}</div>
                            <div class="action-card__title">${{ en: 'Results', ru: 'Результаты', es: 'Resultados' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </div>
                    </div>
                </div>

                <!-- Activities Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.zap} ${{ en: 'Activities', ru: 'Активности', es: 'Actividades' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions">
                        <div class="action-card" id="nav-duels">
                            <div class="action-card__icon action-card__icon--red">${LangyIcons.swords}</div>
                            <div class="action-card__title">${{ en: 'Duels', ru: 'Дуэли', es: 'Duelos' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </div>
                        <div class="action-card" id="nav-events">
                            <div class="action-card__icon action-card__icon--violet">${LangyIcons.sparkles}</div>
                            <div class="action-card__title">${{ en: 'Events', ru: 'События', es: 'Eventos' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </div>
                        <div class="action-card ${!user.hasCompletedPlacement ? 'action-card--locked' : ''}" id="nav-daily">
                            <div class="action-card__icon action-card__icon--gold">${LangyIcons.target}</div>
                            <div class="action-card__title">${i18n('home.daily')} ${!user.hasCompletedPlacement ? LangyIcons.lock : ''}</div>
                        </div>
                    </div>
                </div>

                <!-- Rewards Section -->
                <div class="home__section">
                    <div class="home__section-label">${LangyIcons.trophy} ${{ en: 'Rewards', ru: 'Награды', es: 'Recompensas' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div class="home__actions home__actions--two">
                        <div class="action-card" id="nav-inventory">
                            <div class="action-card__icon action-card__icon--gold">${LangyIcons.briefcase}</div>
                            <div class="action-card__title">${{ en: 'Inventory', ru: 'Инвентарь', es: 'Inventario' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </div>
                        <div class="action-card" id="nav-shop">
                            <div class="action-card__icon action-card__icon--blue">${LangyIcons.shoppingBag}</div>
                            <div class="action-card__title">${{ en: 'Shop', ru: 'Магазин', es: 'Tienda' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </div>
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
        'home-cando-goal': 'progress',
    };

    // Main CTA button
    container.querySelector('#nav-learning')?.addEventListener('click', e => {
        Anim.ripple(e);
        if (isTrueBeginner) {
            // True beginner → go to lesson
            const actionCards = container.querySelectorAll('.action-card');
            Anim.flyOut([...actionCards]);
            setTimeout(() => Router.navigate('learning'), 500);
        } else if (isPostLessonBeginner || (isEarlyJourney && isBeforeFirstSession)) {
            // Post-lesson beginner or intermediate first-timer → go to talk
            ScreenState.set('talkScenario', recommendedScenario);
            ScreenState.set('talkMascot', LangyState.mascot.selected || 0);
            ScreenState.set('firstTalkSession', true);
            ScreenState.set('guidedSpeaking', true);
            Router.navigate('talk');
        } else if (isEarlyJourney) {
            // Early journey, not first session → talk
            ScreenState.set('talkScenario', recommendedScenario);
            ScreenState.set('talkMascot', LangyState.mascot.selected || 0);
            ScreenState.set('guidedSpeaking', true);
            ScreenState.set('talkView', 'call');
            Router.navigate('talk');
        } else if (!user.hasCompletedPlacement) {
            Router.navigate('placement-test');
        } else {
            const actionCards = container.querySelectorAll('.action-card');
            Anim.flyOut([...actionCards]);
            setTimeout(() => Router.navigate('learning'), 500);
        }
    });

    // Secondary CTA: continue lessons (shown for post-lesson beginners)
    container.querySelector('#nav-continue-lesson')?.addEventListener('click', e => {
        Anim.ripple(e);
        const actionCards = container.querySelectorAll('.action-card');
        Anim.flyOut([...actionCards]);
        setTimeout(() => Router.navigate('learning'), 500);
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
