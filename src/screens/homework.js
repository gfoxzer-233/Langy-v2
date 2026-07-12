/* ============================================
   SCREEN: HOMEWORK v4 — Structured Daily Practice
   Includes: lesson review, writing assignments,
   handwriting photo analysis via Gemini Vision,
   coach-driven weak-spot practice,
   weak-spot-to-homework continuity
   ============================================ */

function renderHomework(container) {
    const { homework, progress } = LangyState;
    const activeTab = ScreenState.get('homeworkTab', 'current');
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';

    // Auto-generate homework if empty and lessons have been done
    if (homework.current.length === 0 && progress.lessonHistory.length > 0) {
        autoGenerateHomework();
    }

    // Coach insights from weak areas
    const weakSpots = (LangyState.coachData?.mistakePatterns || []).slice(0, 3);
    const hasWeakSpots = weakSpots.length > 0;
    const tabLabels = {
        practice: { en: `Practice (${homework.current.length})`, ru: `Задания (${homework.current.length})`, es: `Práctica (${homework.current.length})` },
        writing: { en: 'Writing', ru: 'Письмо', es: 'Escritura' },
        handwriting: { en: 'Handwriting', ru: 'Почерк', es: 'Caligrafía' },
        done: { en: 'Done', ru: 'Готово', es: 'Hecho' },
    };

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="homework-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${i18n('hw.title')}</div>
                <div style="width:36px;"></div>
            </div>

            <!-- Daily Practice Header -->
            <div style="padding: var(--sp-3) var(--sp-6) var(--sp-2); text-align:center;">
                <p class="text-secondary text-sm">
                    ${{ en: 'Strengthen your skills with focused practice', ru: 'Укрепляйте навыки целенаправленной практикой', es: 'Fortalece tus habilidades con práctica enfocada' }[lang]}
                </p>
            </div>

            <div style="padding: 0 var(--sp-6) var(--sp-4);">
                <div class="tabs" id="homework-tabs">
                    <button class="tabs__tab ${activeTab === 'current' ? 'tabs__tab--active' : ''}" data-tab="current">${tabLabels.practice[lang]}</button>
                    <button class="tabs__tab ${activeTab === 'writing' ? 'tabs__tab--active' : ''}" data-tab="writing">${tabLabels.writing[lang]}</button>
                    <button class="tabs__tab ${activeTab === 'handwriting' ? 'tabs__tab--active' : ''}" data-tab="handwriting">${tabLabels.handwriting[lang]}</button>
                    <button class="tabs__tab ${activeTab === 'completed' ? 'tabs__tab--active' : ''}" data-tab="completed">${tabLabels.done[lang]}</button>
                </div>
            </div>

            <div class="homework__list" id="homework-list">
                ${
                    activeTab === 'current'
                        ? renderCurrentHomework(homework.current, hasWeakSpots, weakSpots, lang)
                        : activeTab === 'writing'
                          ? renderWritingTab()
                          : activeTab === 'handwriting'
                            ? renderHandwritingTab()
                            : renderCompletedHomework(progress.lessonHistory, lang)
                }
            </div>
        </div>
    `;

    // Tab switching
    container.querySelectorAll('.tabs__tab').forEach(tab => {
        tab.addEventListener('click', () => {
            ScreenState.set('homeworkTab', tab.dataset.tab);
            renderHomework(container);
        });
    });

    container.querySelector('#homework-back')?.addEventListener('click', () => Router.navigate('home'));

    // Click on homework card
    container.querySelectorAll('.homework-card[data-status]').forEach(card => {
        card.addEventListener('click', () => {
            const status = card.dataset.status;
            const unitId = card.dataset.unitId;
            const id = card.dataset.id;

            if (status === 'pending') {
                Anim.showToast(`${{ en: 'Starting Homework with DeepTutor...', ru: 'Запуск домашки с DeepTutor...', es: 'Iniciando tarea con DeepTutor...' }[lang]} ${LangyIcons.book}`);
                setTimeout(
                    () => Router.navigate('learning', { mode: 'homework', active: true, unitId: parseInt(unitId) }),
                    600
                );
            } else if (status === 'error' || status === 'done') {
                showHomeworkErrors(id);
            }
        });
    });

    // ── Writing Tab Events ──
    if (activeTab === 'writing') {
        setupWritingTab(container);
    }

    // ── Handwriting Tab Events ──
    if (activeTab === 'handwriting') {
        setupHandwritingTab(container);
    }

    setTimeout(() => Anim.staggerChildren(container, '.homework-card'), 80);
}

// ─── Auto-generate homework from completed lessons + weak spots ───
function autoGenerateHomework() {
    const activeTb = typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.getActive() : null;
    if (!activeTb) return;

    const completedUnitIds = new Set(LangyState.progress.lessonHistory.map(l => l.unitId));
    const existingHwUnitIds = new Set(LangyState.homework.current.map(h => h.unitId));
    const existingHwTags = new Set(LangyState.homework.current.filter(h => h.weakSpotTag).map(h => h.weakSpotTag));

    // 1) Lesson-score-based homework (existing logic)
    activeTb.units.forEach(unit => {
        if (completedUnitIds.has(unit.id) && !existingHwUnitIds.has(unit.id)) {
            const lessonResult = LangyState.progress.lessonHistory.find(l => l.unitId === unit.id);
            if (lessonResult && lessonResult.score < 90) {
                LangyState.homework.current.push({
                    id: Date.now() + unit.id,
                    unitId: unit.id,
                    title: `${unit.title} — Review`,
                    desc: unit.homework?.prompt || `Review ${unit.grammar?.join(', ') || 'this lesson'}.`,
                    icon: LangyIcons.fileText,
                    createdAt: new Date().toISOString(),
                    source: 'low_score',
                    reason: { en: `Score was ${lessonResult.score}% — practice to improve`, ru: `Результат ${lessonResult.score}% — повтори для улучшения`, es: `Puntuación ${lessonResult.score}% — practica para mejorar` },
                });
            }
        }
    });

    // 2) Weak-spot-driven homework from CoachIntel
    if (typeof CoachIntel !== 'undefined') {
        const patterns = CoachIntel.topPatterns(3);
        patterns.forEach(p => {
            if (p.status === 'recurring' || p.status === 'needs_work') {
                if (existingHwTags.has(p.tag)) return; // already have one for this
                // Find a unit whose grammar matches this weak spot
                const matchUnit = activeTb.units.find(u =>
                    completedUnitIds.has(u.id) &&
                    (u.grammar || []).some(g => g.toLowerCase().includes(p.tag.replace(/_/g, ' ')))
                );
                LangyState.homework.current.push({
                    id: Date.now() + Math.floor(Math.random() * 10000),
                    unitId: matchUnit?.id || 0,
                    title: `${p.label} — Weak Spot Practice`,
                    desc: p.example ? `You wrote: "${p.example}" — let's fix this pattern.` : `Practice ${p.label} to strengthen this area.`,
                    icon: LangyIcons.target,
                    createdAt: new Date().toISOString(),
                    source: 'weak_spot',
                    weakSpotTag: p.tag,
                    weakSpotStatus: p.status,
                    weakSpotCount: p.count,
                    reason: { en: `Appeared ${p.count}× in recent sessions`, ru: `Встречалось ${p.count}× в недавних сессиях`, es: `Apareció ${p.count}× en sesiones recientes` },
                });
            }
        });
    }

    // 3) Vocabulary review homework from VocabTracker
    if (typeof VocabTracker !== 'undefined') {
        const existingVocabHw = LangyState.homework.current.find(h => h.source === 'vocab_review');
        if (!existingVocabHw) {
            const vocabHw = VocabTracker.generateVocabHomework();
            if (vocabHw) {
                LangyState.homework.current.push(vocabHw);
            }
        }
    }

    if (typeof LangyDB !== 'undefined') LangyDB.saveProgress();
}

function renderCurrentHomework(items, hasWeakSpots, weakSpots, lang) {
    lang = lang || (typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en');

    // Coach focus card — shows WHY these tasks exist
    let focusSection = '';
    if (typeof CoachIntel !== 'undefined' && CoachIntel.isCoach()) {
        const focus = CoachIntel.recommendedFocus(lang);
        if (focus) {
            const statusDot = { recurring: '#F59E0B', needs_work: '#EF4444', improving: '#10B981', new: 'var(--text-tertiary)' };
            focusSection = `
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                <div class="card" style="padding:var(--sp-3) var(--sp-4); border-left:3px solid var(--coach, #7C6CF6); background:var(--coach-bg, rgba(124,108,246,0.04));">
                    <div style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:var(--coach, #7C6CF6); margin-bottom:var(--sp-1); display:flex; align-items:center; gap:6px;">
                        ${LangyIcons.target} ${{ en: 'Coach Focus', ru: 'Фокус Coach', es: 'Enfoque del Coach' }[lang]}
                    </div>
                    <div style="font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.5;">
                        ${focus.text}
                    </div>
                </div>
            </div>
            `;
        }
    }

    // Weak spots section from coach data (fallback for non-coach)
    let weakSection = '';
    if (!focusSection && hasWeakSpots && weakSpots.length > 0) {
        weakSection = `
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                <div class="card" style="padding:var(--sp-3) var(--sp-4); border-left:3px solid var(--warning); background:rgba(245,158,11,0.04);">
                    <div style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:var(--warning); margin-bottom:var(--sp-1); display:flex; align-items:center; gap:6px;">
                        ${LangyIcons.alertTriangle} ${{ en: 'Areas to Review', ru: 'Области для повторения', es: 'Áreas para repasar' }[lang]}
                    </div>
                    <div style="font-size:var(--fs-xs); color:var(--text-secondary); line-height:1.5;">
                        ${weakSpots.map(w => `<span style="display:inline-block; background:var(--bg-alt); padding:2px 8px; border-radius:var(--radius-sm); margin:2px 4px 2px 0; font-size:10px;">${w.tag} (${w.count}×)</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    if (!items.length) {
        return `${focusSection}${weakSection}<div class="empty-state">
            <div class="empty-state__icon">${LangyIcons.sparkles}</div>
            <div class="empty-state__title">${{ en: 'All caught up!', ru: 'Всё сделано!', es: '¡Todo al día!' }[lang]}</div>
            <div class="empty-state__text">${{ en: 'Try a writing exercise or complete more lessons to get new assignments.', ru: 'Попробуйте письменное упражнение или пройдите больше уроков.', es: 'Prueba un ejercicio de escritura o completa más lecciones.' }[lang]}</div>
            <button class="btn btn--primary btn--sm" onclick="ScreenState.set('homeworkTab','writing'); renderHomework(this.closest('.homework__list').parentElement);" style="margin-top:var(--sp-3);">
                ${LangyIcons.pencil} ${{ en: 'Try Writing', ru: 'Попробовать письмо', es: 'Probar escritura' }[lang]}
            </button>
        </div>`;
    }

    // Determine source badge for each item (why it was assigned)
    const getSourceBadge = (item) => {
        if (item.source === 'weak_spot') {
            const statusColor = item.weakSpotStatus === 'recurring' ? '#F59E0B' : '#EF4444';
            const statusLabel = item.weakSpotStatus === 'recurring'
                ? { en: 'Recurring', ru: 'Повторяется', es: 'Recurrente' }[lang]
                : { en: 'Weak spot', ru: 'Слабое место', es: 'Punto débil' }[lang];
            return `<span style="display:inline-flex; align-items:center; gap:3px; font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${statusColor}; margin-top:2px;">
                <span style="width:5px; height:5px; border-radius:50%; background:${statusColor};"></span>
                ${statusLabel} · ${item.weakSpotCount || ''}×
            </span>`;
        }
        if (item.source === 'vocab_review') {
            return `<span style="display:inline-flex; align-items:center; gap:3px; font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:#F59E0B; margin-top:2px;">
                <span style="width:5px; height:5px; border-radius:50%; background:#F59E0B;"></span>
                ${{ en: 'Vocab Review', ru: 'Повтор слов', es: 'Repaso vocab' }[lang]}
            </span>`;
        }
        if (item.source === 'low_score') {
            return `<span style="display:inline-flex; align-items:center; gap:3px; font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--warning); margin-top:2px;">
                ${LangyIcons.alertTriangle} ${{ en: 'Needs review', ru: 'Нужен повтор', es: 'Necesita repaso' }[lang]}
            </span>`;
        }
        // Fallback: generic skill tag
        const grammar = item.desc?.toLowerCase();
        let tag = { en: 'Review', ru: 'Повторение', es: 'Repaso' }[lang];
        if (grammar?.includes('grammar') || grammar?.includes('tense') || grammar?.includes('грамматик')) tag = { en: 'Grammar', ru: 'Грамматика', es: 'Gramática' }[lang];
        return `<span style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--primary); margin-top:2px; display:flex; align-items:center; gap:4px;">${LangyIcons.target} ${tag}</span>`;
    };

    // Grammar rules badge — shows specific rules when tracked
    const getGrammarBadge = (item) => {
        if (!item.weakRules || !item.weakRules.length) return '';
        const rulesText = item.weakRules.slice(0, 3).join(', ');
        return `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">${item.weakRules.slice(0, 3).map(r => `<span style="font-size:9px; padding:2px 6px; border-radius:8px; background:rgba(239,68,68,0.08); color:var(--danger); white-space:nowrap;">${r}</span>`).join('')}</div>`;
    };

    // Reason line — explains WHY this homework exists
    const getReasonLine = (item) => {
        if (item.reason) {
            const text = item.reason[lang] || item.reason.en || '';
            if (text) return `<div style="font-size:10px; color:var(--text-tertiary); margin-top:2px; font-style:italic;">${text}</div>`;
        }
        return '';
    };

    // Sort: weak-spot items first, then vocab review, then score-based
    const sorted = [...items].sort((a, b) => {
        const priority = { weak_spot: 0, vocab_review: 1, low_score: 2 };
        return (priority[a.source] ?? 3) - (priority[b.source] ?? 3);
    });

    return focusSection + weakSection + sorted
        .map(
            item => `
        <div class="homework-card" data-id="${item.id}" data-status="pending" data-unit-id="${item.unitId}">
            <div class="homework-card__icon" style="background: ${item.source === 'weak_spot' ? 'rgba(245,158,11,0.08)' : 'var(--primary-bg)'};">${item.icon || LangyIcons.fileText}</div>
            <div class="homework-card__info">
                <div class="homework-card__title">${item.title}</div>
                <div class="homework-card__meta">${item.desc || { en: 'Review the previous lesson.', ru: 'Повторите предыдущий урок.', es: 'Repasa la lección anterior.' }[lang]}</div>
                ${getSourceBadge(item)}
                ${getReasonLine(item)}
                ${getGrammarBadge(item)}
            </div>
            <div class="homework-card__status homework-card__status--pending">${{ en: 'Start', ru: 'Начать', es: 'Iniciar' }[lang]} ${LangyIcons.arrowRight}</div>
        </div>
    `
        )
        .join('');
}

function renderCompletedHomework(items, lang) {
    lang = lang || (typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en');
    if (!items.length) {
        return `<div class="empty-state">
            <div class="empty-state__icon">${LangyIcons.inbox}</div>
            <div class="empty-state__title">${{ en: 'No completed tasks yet', ru: 'Нет выполненных заданий', es: 'Aún no hay tareas completadas' }[lang]}</div>
            <div class="empty-state__text">${{ en: 'Complete lessons and homework to see results here', ru: 'Выполняйте уроки и задания, чтобы видеть результаты', es: 'Completa lecciones y tareas para ver resultados aquí' }[lang]}</div>
        </div>`;
    }
    return items
        .slice()
        .reverse()
        .map(
            item => `
        <div class="homework-card" data-id="${item.id}" data-status="${item.status}" data-unit-id="${item.unitId}">
            <div class="homework-card__icon" style="background: ${item.status === 'error' ? 'var(--danger-bg)' : 'var(--accent-bg)'};">${item.icon || LangyIcons.fileText}</div>
            <div class="homework-card__info">
                <div class="homework-card__title">${item.title}</div>
                <div class="homework-card__meta">${{ en: 'Score', ru: 'Балл', es: 'Puntuación' }[lang]}: ${item.score}% · ${item.date || ''} ${item.errors > 0 ? `· ${item.errors} ${{ en: 'errors', ru: 'ошибок', es: 'errores' }[lang]}` : ''}</div>
            </div>
            <div class="homework-card__status homework-card__status--${item.status}">
                ${item.status === 'error' ? `<span style="display:flex;align-items:center;gap:4px;">${{ en: 'Review', ru: 'Повторить', es: 'Repasar' }[lang]} ${LangyIcons.alertTriangle}</span>` : `<span style="display:flex;align-items:center;gap:4px;">${{ en: 'Done', ru: 'Готово', es: 'Hecho' }[lang]} ${LangyIcons.check}</span>`}
            </div>
        </div>
    `
        )
        .join('');
}

// ═══════════════════════════════════════
// WRITING TAB — AI-checked essays, curriculum-aware
// ═══════════════════════════════════════
function renderWritingTab() {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const level = LangyState?.user?.level || 'B1 Intermediate';
    const isEnglish = typeof LangyTarget !== 'undefined' && LangyTarget.getCode() === 'en';

    // Build curriculum context
    let grammarPrompt = null;
    let vocabPrompt = null;
    let currentUnit = null;
    let cefrLevel = 'B1';
    let unitVocabWords = [];

    if (isEnglish && typeof LangyCurriculum !== 'undefined') {
        const tb = LangyCurriculum.getActive();
        const unitId = LangyState?.progress?.currentUnitId || 1;
        if (tb) {
            cefrLevel = tb.cefr || 'B1';
            currentUnit = tb.units?.find(u => u.id === unitId);
            if (currentUnit?.grammar?.length) {
                grammarPrompt = {
                    id: 'grammar-practice',
                    title: { en: `Grammar Writing: ${currentUnit.grammar[0]}`, ru: `Грамматика: ${currentUnit.grammar[0]}`, es: `Gramática: ${currentUnit.grammar[0]}` }[lang],
                    desc: { en: `Write 5-8 sentences using ${currentUnit.grammar.join(' and ')}. Try to include examples of each rule.`, ru: `Напишите 5-8 предложений, используя ${currentUnit.grammar.join(' и ')}.`, es: `Escribe 5-8 oraciones usando ${currentUnit.grammar.join(' y ')}.` }[lang],
                    icon: LangyIcons.target,
                    source: 'grammar',
                };
            }
            // Build vocab-aware prompt
            if (typeof LangyVocabBank !== 'undefined') {
                unitVocabWords = LangyVocabBank.getForUnit(cefrLevel, unitId);
                if (unitVocabWords.length >= 3) {
                    const sampleWords = unitVocabWords.slice(0, 6).map(w => w.en).join(', ');
                    vocabPrompt = {
                        id: 'vocab-practice',
                        title: { en: `Vocabulary Writing: Unit ${unitId}`, ru: `Словарь: Юнит ${unitId}`, es: `Vocabulario: Unidad ${unitId}` }[lang],
                        desc: { en: `Write a short paragraph using these words: ${sampleWords}. Try to use at least 4.`, ru: `Напишите абзац, используя эти слова: ${sampleWords}. Используйте минимум 4.`, es: `Escribe un párrafo usando estas palabras: ${sampleWords}. Intenta usar al menos 4.` }[lang],
                        icon: LangyIcons.brain,
                        source: 'vocab',
                    };
                }
            }
        }
    }

    // CEFR-leveled prompt descriptions
    const levelDescs = {
        A1: { en: 'Write simple sentences about familiar topics.', ru: 'Пишите простые предложения о знакомых темах.', es: 'Escribe oraciones simples sobre temas familiares.' },
        A2: { en: 'Write short texts about everyday situations.', ru: 'Пишите короткие тексты о повседневных ситуациях.', es: 'Escribe textos cortos sobre situaciones cotidianas.' },
        B1: { en: 'Write connected paragraphs on familiar topics.', ru: 'Пишите связные абзацы на знакомые темы.', es: 'Escribe párrafos conectados sobre temas familiares.' },
        B2: { en: 'Write clear, detailed texts on complex topics.', ru: 'Пишите подробные тексты на сложные темы.', es: 'Escribe textos claros y detallados sobre temas complejos.' },
        C1: { en: 'Write well-structured essays with nuanced arguments.', ru: 'Пишите хорошо структурированные эссе с нюансами.', es: 'Escribe ensayos bien estructurados con argumentos matizados.' },
        C2: { en: 'Write sophisticated texts in any style and register.', ru: 'Пишите сложные тексты в любом стиле.', es: 'Escribe textos sofisticados en cualquier estilo y registro.' },
    };
    const levelDesc = levelDescs[cefrLevel]?.[lang] || levelDescs.B1[lang];

    const prompts = [
        ...(grammarPrompt ? [grammarPrompt] : []),
        ...(vocabPrompt ? [vocabPrompt] : []),
        { id: 'email', title: { en: 'Write an Email', ru: 'Написать письмо', es: 'Escribir un email' }[lang], desc: { en: 'Write a formal email to your boss asking for a day off.', ru: 'Напишите формальное письмо начальнику с просьбой о выходном.', es: 'Escribe un email formal a tu jefe pidiendo un día libre.' }[lang], icon: LangyIcons.send },
        { id: 'story', title: { en: 'Short Story', ru: 'Рассказ', es: 'Cuento corto' }[lang], desc: { en: 'Write a short story about an unexpected adventure.', ru: 'Напишите короткий рассказ о неожиданном приключении.', es: 'Escribe un cuento corto sobre una aventura inesperada.' }[lang], icon: LangyIcons.bookOpen },
        { id: 'opinion', title: { en: 'Opinion Essay', ru: 'Эссе-мнение', es: 'Ensayo de opinión' }[lang], desc: { en: 'Do you think AI will replace teachers? Write your opinion.', ru: 'Считаете ли вы, что ИИ заменит учителей? Напишите мнение.', es: '¿Crees que la IA reemplazará a los profesores? Escribe tu opinión.' }[lang], icon: LangyIcons.brain },
        { id: 'describe', title: { en: 'Describe a Place', ru: 'Опишите место', es: 'Describe un lugar' }[lang], desc: { en: 'Describe your favorite place. Why is it special?', ru: 'Опишите ваше любимое место. Почему оно особенное?', es: 'Describe tu lugar favorito. ¿Por qué es especial?' }[lang], icon: LangyIcons.globe },
        { id: 'letter', title: { en: 'Letter to a Friend', ru: 'Письмо другу', es: 'Carta a un amigo' }[lang], desc: { en: "Write a letter to a friend you haven't seen in years.", ru: 'Напишите письмо другу, которого давно не видели.', es: 'Escribe una carta a un amigo que no has visto en años.' }[lang], icon: LangyIcons.heart },
        { id: 'free', title: { en: 'Free Writing', ru: 'Свободное письмо', es: 'Escritura libre' }[lang], desc: { en: 'Write about anything you want!', ru: 'Пишите о чём угодно!', es: '¡Escribe sobre lo que quieras!' }[lang], icon: LangyIcons.pencil },
    ];

    return `
        <div style="padding: var(--sp-4) var(--sp-5);">

            <!-- Curriculum context header -->
            ${currentUnit ? `
            <div class="card card--flat" style="padding:var(--sp-3); margin-bottom:var(--sp-4); border-left:3px solid #3B82F6;">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:#3B82F6; margin-bottom:4px;">${cefrLevel} · ${{ en: 'Writing Focus', ru: 'Фокус письма', es: 'Enfoque de escritura' }[lang]}</div>
                <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:6px;">${levelDesc}</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    ${currentUnit.grammar?.length ? `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(139,92,246,0.08); color:#8B5CF6;">${LangyIcons.fileText} ${currentUnit.grammar.slice(0,2).join(', ')}</span>` : ''}
                    ${unitVocabWords.length > 0 ? `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(245,158,11,0.08); color:#F59E0B;">${LangyIcons.brain} ${unitVocabWords.length} ${{ en: 'words', ru: 'слов', es: 'palabras' }[lang]}</span>` : ''}
                    <span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(59,130,246,0.08); color:#3B82F6;">${LangyIcons.book} ${currentUnit.title}</span>
                </div>
            </div>` : ''}

            <!-- Writing prompt selection -->
            <div id="writing-prompts" ${ScreenState.get('writingActive') ? 'style="display:none;"' : ''}>
                <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:8px;">
                    <span style="color:var(--primary);">${LangyIcons.pencil}</span> ${{ en: 'Choose a Writing Prompt', ru: 'Выберите задание', es: 'Elige un tema' }[lang]}
                </h4>

                <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
                    ${prompts
                        .map(
                            p => `
                        <div class="homework-card writing-prompt" data-prompt-id="${p.id}" data-prompt-desc="${escapeHTML(p.desc)}" data-prompt-source="${p.source || ''}">
                            <div class="homework-card__icon" style="background:${p.source === 'grammar' ? 'rgba(139,92,246,0.08)' : p.source === 'vocab' ? 'rgba(245,158,11,0.08)' : 'var(--primary-bg)'}; color:${p.source === 'grammar' ? '#8B5CF6' : p.source === 'vocab' ? '#F59E0B' : 'var(--primary)'};">${p.icon}</div>
                            <div class="homework-card__info">
                                <div class="homework-card__title">${p.title}${p.source ? ` <span style="font-size:9px; padding:1px 6px; border-radius:var(--radius-full); background:rgba(59,130,246,0.08); color:#3B82F6;">${{ en: 'Unit', ru: 'Юнит', es: 'Unidad' }[lang]}</span>` : ''}</div>
                                <div class="homework-card__meta">${p.desc}</div>
                            </div>
                            <div style="color:var(--text-tertiary);">${LangyIcons.arrowRight}</div>
                        </div>
                    `
                        )
                        .join('')}
                </div>
            </div>

            <!-- Active writing area -->
            <div id="writing-area" ${ScreenState.get('writingActive') ? '' : 'style="display:none;"'}>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--sp-3);">
                    <h4 style="display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--primary);">${LangyIcons.pencil}</span>
                        <span id="writing-prompt-title">${ScreenState.get('writingPromptTitle', { en: 'Free Writing', ru: 'Свободное письмо', es: 'Escritura libre' }[lang])}</span>
                    </h4>
                    <button class="btn btn--ghost btn--sm" id="writing-back" style="color:var(--text-tertiary);">${LangyIcons.x}</button>
                </div>
                <p id="writing-prompt-desc" style="font-size:var(--fs-sm); color:var(--text-secondary); margin-bottom:var(--sp-3); padding:var(--sp-3); background:var(--bg-alt); border-radius:var(--radius-lg);">
                    ${ScreenState.get('writingPromptDesc', { en: 'Write about anything you want!', ru: 'Пишите о чём угодно!', es: '¡Escribe sobre lo que quieras!' }[lang])}
                </p>
                ${unitVocabWords.length > 0 && (ScreenState.get('writingPromptSource') === 'vocab' || ScreenState.get('writingPromptSource') === 'grammar') ? `
                <div style="margin-bottom:var(--sp-3); padding:var(--sp-2) var(--sp-3); background:rgba(245,158,11,0.04); border-radius:var(--radius-md); border:1px solid rgba(245,158,11,0.1);">
                    <div style="font-size:9px; text-transform:uppercase; color:#F59E0B; margin-bottom:4px;">${LangyIcons.brain} ${{ en: 'Vocabulary to use', ru: 'Словарь', es: 'Vocabulario a usar' }[lang]}</div>
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">
                        ${unitVocabWords.slice(0, 8).map(w => `<span style="font-size:10px; padding:2px 6px; border-radius:var(--radius-full); background:rgba(245,158,11,0.08); color:#F59E0B;">${w.en}</span>`).join('')}
                    </div>
                </div>` : ''}
                <textarea class="hw-writing" id="writing-textarea" placeholder="${{ en: 'Start writing here...', ru: 'Начните писать здесь...', es: 'Empieza a escribir aquí...' }[lang]}">${ScreenState.get('writingText', '')}</textarea>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-top:var(--sp-2);">
                    <span id="writing-word-count" style="font-size:var(--fs-xs); color:var(--text-tertiary);">0 ${{ en: 'words', ru: 'слов', es: 'palabras' }[lang]}</span>
                    <button class="btn btn--primary btn--sm" id="writing-submit" style="display:flex; align-items:center; gap:6px;">
                        ${LangyIcons.send} ${{ en: 'Submit for Review', ru: 'Отправить на проверку', es: 'Enviar para revisión' }[lang]}
                    </button>
                </div>

                <!-- AI Feedback area (shown after submit) -->
                <div id="writing-feedback"></div>
            </div>
        </div>
    `;
}

function setupWritingTab(container) {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    // Prompt selection
    container.querySelectorAll('.writing-prompt').forEach(card => {
        card.addEventListener('click', () => {
            ScreenState.set('writingActive', true);
            ScreenState.set(
                'writingPromptTitle',
                card.querySelector('.homework-card__title')?.textContent || { en: 'Writing', ru: 'Письмо', es: 'Escritura' }[lang]
            );
            ScreenState.set('writingPromptDesc', card.dataset.promptDesc);
            ScreenState.set('writingPromptSource', card.dataset.promptSource || '');
            ScreenState.set('writingText', '');
            renderHomework(container);
        });
    });

    // Back from writing
    container.querySelector('#writing-back')?.addEventListener('click', () => {
        ScreenState.set('writingActive', false);
        ScreenState.set('writingPromptSource', '');
        renderHomework(container);
    });

    // Word counter
    const textarea = container.querySelector('#writing-textarea');
    const wordCount = container.querySelector('#writing-word-count');
    textarea?.addEventListener('input', () => {
        ScreenState.set('writingText', textarea.value);
        const words = textarea.value
            .trim()
            .split(/\s+/)
            .filter(w => w.length > 0).length;
        const wLabel = { en: 'word', ru: 'слов', es: 'palabra' }[lang];
        if (wordCount) wordCount.textContent = `${words} ${wLabel}${lang === 'en' && words !== 1 ? 's' : ''}`;
    });

    // Submit for review
    container.querySelector('#writing-submit')?.addEventListener('click', async () => {
        const text = textarea?.value?.trim();
        if (!text || text.length < 10) {
            Anim.showToast('Write at least a few sentences first!');
            return;
        }

        const feedbackEl = container.querySelector('#writing-feedback');
        if (!feedbackEl) return;

        feedbackEl.innerHTML = `
            <div class="hw-feedback__loading">
                <span></span><span></span><span></span>
                <span style="animation:none; width:auto; height:auto; background:none; margin-left:var(--sp-2);">Analyzing your writing...</span>
            </div>
        `;

        try {
            const level = LangyState?.user?.level || 'B1';
            // Build curriculum context for writing feedback
            let cefrLevel = 'B1';
            let canDoHint = '';
            let unitHint = '';
            if (typeof LangyCurriculum !== 'undefined') {
                const tb = LangyCurriculum.getActive();
                if (tb) {
                    cefrLevel = tb.cefr || 'B1';
                    if (tb.canDo && tb.canDo.length) {
                        const writingCanDo = tb.canDo.filter(s => /writ|compos|essay|describ|summar|email|letter|report/i.test(s));
                        const relevantCanDo = writingCanDo.length > 0 ? writingCanDo : tb.canDo.slice(0, 2);
                        canDoHint = `\nCEFR ${cefrLevel} Writing Expectations:\n${relevantCanDo.map(s => '- ' + s).join('\n')}`;
                    }
                }
                const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
                if (unitId && tb && tb.units) {
                    const unit = tb.units.find(u => u.id === unitId);
                    if (unit) {
                        unitHint = `\nCurrent Unit: "${unit.title}" — grammar focus: ${unit.grammar?.join(', ') || 'general'}`;
                    }
                }
            }

            const prompt = `You are a CEFR-certified English writing teacher at the ${cefrLevel} level. Analyze this student's writing.
Student level: ${level} (CEFR ${cefrLevel})${canDoHint}${unitHint}
Prompt: ${ScreenState.get('writingPromptDesc', 'Free writing')}

Student's text:
"${text}"

Give detailed feedback in this format (plain text, no markdown):
SCORE: [A/B/C/D grade]
LEVEL: [estimated CEFR writing level, e.g. B1-B2]

STRENGTHS:
- [what they did well, reference CEFR expectations]

ERRORS:
- [each grammar/spelling error with correction, note if it relates to current unit grammar]

IMPROVED VERSION:
[rewrite their text with corrections, keeping their style]

TIPS:
- [2-3 specific actionable tips aligned with their CEFR level progression]

Be encouraging but honest. Keep feedback concise.`;

            const response = await LangyAI.fetchWithTimeout(LangyAI.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: LangyAI.MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 600,
                    temperature: 0.6,
                }),
            });

            if (!response.ok) throw new Error('AI unavailable');
            const data = await response.json();
            const feedback = data.choices?.[0]?.message?.content || 'Could not analyze. Try again.';

            feedbackEl.innerHTML = `
                <div class="hw-feedback" style="margin-top:var(--sp-4);">
                    <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--primary);">${LangyIcons.brain}</span> ${{ en: 'AI Feedback', ru: 'ИИ-отзыв', es: 'Retroalimentación IA' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}
                    </h4>
                    <div style="font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.8; white-space:pre-line;">${escapeHTML(feedback)}</div>
                </div>
            `;

            // Award XP and record session for writing
            if (typeof LangyState !== 'undefined') {
                const words = text.split(/\s+/).length;
                const xp = Math.min(80, Math.floor(words / 5) * 5);
                // Performance-based skill gain: longer, more substantive writing = more progress
                const skillGain = words >= 100 ? 7 : words >= 50 ? 5 : words >= 20 ? 3 : 2;
                LangyState.user.xp += xp;
                LangyState.progress.skills.writing = Math.min(100, (LangyState.progress.skills.writing || 0) + skillGain);
                if (typeof recordSession === 'function') {
                    recordSession({ duration: Math.max(1, Math.round(words / 30)), wordsLearned: Math.floor(words / 10), accuracy: 85, category: 'writing' });
                }

                // Record vocab words used in writing through VocabTracker
                if (typeof VocabTracker !== 'undefined' && typeof LangyVocabBank !== 'undefined' && typeof LangyCurriculum !== 'undefined') {
                    const tb = LangyCurriculum.getActive();
                    const unitId = LangyState.progress?.currentUnitId || 1;
                    if (tb?.cefr) {
                        const unitWords = LangyVocabBank.getForUnit(tb.cefr, unitId);
                        const textLower = text.toLowerCase();
                        unitWords.forEach(w => {
                            if (w.en && textLower.includes(w.en.toLowerCase())) {
                                VocabTracker.recordWord(w.en, w.ru || '', { correct: true, level: tb.cefr, category: 'writing' });
                            }
                        });
                    }
                }

                if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
                const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
                Anim.showToast(`+${xp} XP ${{ en: 'for writing', ru: 'за письмо', es: 'por escritura' }[lang]} · +${skillGain}% ${{ en: 'skill', ru: 'навык', es: 'habilidad' }[lang]}`);
            }
        } catch (err) {
            feedbackEl.innerHTML = `
                <div class="hw-feedback" style="border-color:var(--danger);">
                    <p style="color:var(--danger);">${{ en: 'Could not analyze your writing. Please check your connection and try again.', ru: 'Не удалось проанализировать текст. Проверьте подключение.', es: 'No se pudo analizar tu escritura. Verifica tu conexión.' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</p>
                </div>
            `;
        }
    });
}

// ═══════════════════════════════════════
// HANDWRITING TAB — Task-Driven Photo Review
// ═══════════════════════════════════════
const HW_WRITING_TASKS = {
    A1: [
        { en: 'Write 3 sentences about yourself: your name, age, and where you live.', ru: 'Напишите 3 предложения о себе: имя, возраст и где живёте.', es: 'Escribe 3 frases sobre ti: nombre, edad y dónde vives.' },
        { en: 'Write 5 things you can see in your room right now.', ru: 'Напишите 5 вещей, которые видите в комнате.', es: 'Escribe 5 cosas que ves en tu habitación.' },
    ],
    A2: [
        { en: 'Describe what you did yesterday in 4-5 sentences.', ru: 'Опишите, что вы делали вчера, в 4-5 предложениях.', es: 'Describe lo que hiciste ayer en 4-5 frases.' },
        { en: 'Write a short message to a friend inviting them to dinner.', ru: 'Напишите короткое приглашение другу на ужин.', es: 'Escribe un mensaje corto invitando a un amigo a cenar.' },
    ],
    B1: [
        { en: 'Write a paragraph about your favorite hobby and why you enjoy it.', ru: 'Напишите абзац о своём любимом хобби и почему оно вам нравится.', es: 'Escribe un párrafo sobre tu pasatiempo favorito y por qué lo disfrutas.' },
        { en: 'Describe a memorable trip you have taken. Use past tenses.', ru: 'Опишите запоминающуюся поездку. Используйте прошедшее время.', es: 'Describe un viaje memorable. Usa tiempos pasados.' },
    ],
    B2: [
        { en: 'Write your opinion on whether social media helps or hurts communication. Give reasons.', ru: 'Напишите мнение о том, помогают ли соцсети общению. Приведите аргументы.', es: 'Escribe tu opinión sobre si las redes sociales ayudan o perjudican la comunicación.' },
        { en: 'Write a formal email requesting information about a language course.', ru: 'Напишите формальное письмо с запросом информации о языковом курсе.', es: 'Escribe un correo formal pidiendo información sobre un curso de idiomas.' },
    ],
    C1: [
        { en: 'Write a short essay discussing the advantages and disadvantages of remote work.', ru: 'Напишите короткое эссе о преимуществах и недостатках удалённой работы.', es: 'Escribe un ensayo corto sobre las ventajas y desventajas del trabajo remoto.' },
    ],
};

function renderHandwritingTab() {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const userLevel = (LangyState?.user?.level || 'B1').substring(0, 2);
    const tasks = HW_WRITING_TASKS[userLevel] || HW_WRITING_TASKS.B1;
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    // Store current task so analysis can reference it
    if (typeof ScreenState !== 'undefined') ScreenState.set('hwTask', task.en);

    return `
        <div style="padding: var(--sp-4) var(--sp-5);">
            <h4 style="margin-bottom:var(--sp-2); display:flex; align-items:center; gap:8px;">
                <span style="color:#F59E0B;">${LangyIcons.pencil}</span> ${{ en: 'Handwriting Review', ru: 'Проверка почерка', es: 'Revisión de escritura' }[lang]}
            </h4>
            <p style="font-size:var(--fs-xs); color:var(--text-tertiary); margin-bottom:var(--sp-3);">
                ${{ en: 'Complete the writing task by hand, then upload a photo for AI tutor review.', ru: 'Выполните задание от руки, затем загрузите фото для проверки ИИ-репетитором.', es: 'Completa la tarea a mano y sube una foto para revisión del tutor IA.' }[lang]}
            </p>

            <!-- Writing Task Card -->
            <div class="card" style="padding:var(--sp-4); border-left:3px solid var(--primary); background:rgba(59,130,246,0.03); margin-bottom:var(--sp-4);">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:var(--primary); margin-bottom:var(--sp-1); display:flex; align-items:center; gap:4px;">
                    ${LangyIcons.fileText} ${{ en: 'Your Task', ru: 'Ваше задание', es: 'Tu tarea' }[lang]} · ${userLevel}
                </div>
                <div style="font-size:var(--fs-sm); color:var(--text-primary); line-height:1.6;">${task[lang]}</div>
            </div>

            <!-- Upload Area -->
            <div class="hw-upload" id="hw-upload-zone">
                <input type="file" id="hw-file-input" accept="image/*" capture="environment" style="display:none;">
                <div id="hw-upload-content">
                    <div style="font-size:32px; color:var(--primary); margin-bottom:var(--sp-2);">${LangyIcons.upload}</div>
                    <div style="font-weight:var(--fw-semibold); margin-bottom:var(--sp-1);">${{ en: 'Upload your handwritten answer', ru: 'Загрузите фото ответа', es: 'Sube tu respuesta escrita' }[lang]}</div>
                    <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${{ en: 'Tap to take or choose a photo', ru: 'Нажмите, чтобы сделать или выбрать фото', es: 'Toca para tomar o elegir una foto' }[lang]}</div>
                </div>
            </div>

            <div id="hw-preview-area" style="display:none; margin-top:var(--sp-4); text-align:center;">
                <img id="hw-preview-img" class="hw-upload__preview" alt="Your handwriting">
                <div style="margin-top:var(--sp-3); display:flex; gap:var(--sp-2);">
                    <button class="btn btn--primary btn--full" id="hw-analyze" style="display:flex; align-items:center; justify-content:center; gap:8px;">
                        ${LangyIcons.brain} ${{ en: 'Get Review', ru: 'Получить проверку', es: 'Obtener revisión' }[lang]}
                    </button>
                    <button class="btn btn--ghost" id="hw-retake">${LangyIcons.refreshCw}</button>
                </div>
            </div>

            <div id="hw-feedback-area"></div>

            <div class="card" style="padding:var(--sp-4); margin-top:var(--sp-5); border:1px solid rgba(16,185,129,0.15); background:rgba(16,185,129,0.03);">
                <h4 style="margin-bottom:var(--sp-2); display:flex; align-items:center; gap:8px;">
                    <span style="color:var(--primary);">${LangyIcons.zap}</span> ${{ en: 'Tips', ru: 'Советы', es: 'Consejos' }[lang]}
                </h4>
                <ul style="font-size:var(--fs-xs); color:var(--text-secondary); line-height:1.8; padding-left:var(--sp-4); margin:0;">
                    <li>${{ en: 'Write on white/lined paper with good lighting', ru: 'Пишите на белой/линованной бумаге при хорошем свете', es: 'Escribe en papel blanco/rayado con buena luz' }[lang]}</li>
                    <li>${{ en: 'Use a dark pen for better contrast', ru: 'Используйте тёмную ручку для контраста', es: 'Usa un bolígrafo oscuro para mejor contraste' }[lang]}</li>
                    <li>${{ en: 'Keep the photo straight and focused', ru: 'Фото должно быть ровным и чётким', es: 'Mantén la foto recta y enfocada' }[lang]}</li>
                    <li>${{ en: 'Write at least 2-3 sentences', ru: 'Напишите минимум 2-3 предложения', es: 'Escribe al menos 2-3 oraciones' }[lang]}</li>
                </ul>
            </div>
        </div>
    `;
}

function setupHandwritingTab(container) {
    const fileInput = container.querySelector('#hw-file-input');
    const uploadZone = container.querySelector('#hw-upload-zone');
    const previewArea = container.querySelector('#hw-preview-area');
    const previewImg = container.querySelector('#hw-preview-img');
    const feedbackArea = container.querySelector('#hw-feedback-area');
    let imageBase64 = null;

    // Click to upload
    uploadZone?.addEventListener('click', () => fileInput?.click());

    // Drag and drop
    uploadZone?.addEventListener('dragover', e => {
        e.preventDefault();
        uploadZone.classList.add('hw-upload--dragover');
    });
    uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('hw-upload--dragover'));
    uploadZone?.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('hw-upload--dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) handleImageFile(file);
    });

    // File selected
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) handleImageFile(file);
    });

    function handleImageFile(file) {
        if (!file.type.startsWith('image/')) {
            Anim.showToast('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            imageBase64 = e.target.result;
            if (previewImg) previewImg.src = imageBase64;
            if (uploadZone) uploadZone.style.display = 'none';
            if (previewArea) previewArea.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Retake
    container.querySelector('#hw-retake')?.addEventListener('click', () => {
        imageBase64 = null;
        if (uploadZone) uploadZone.style.display = '';
        if (previewArea) previewArea.style.display = 'none';
        if (feedbackArea) feedbackArea.innerHTML = '';
        if (fileInput) fileInput.value = '';
    });

    // Analyze
    container.querySelector('#hw-analyze')?.addEventListener('click', async () => {
        if (!imageBase64) return;
        const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
        const taskText = ScreenState.get('hwTask') || 'Free writing';

        if (feedbackArea) {
            feedbackArea.innerHTML = `
                <div class="hw-feedback__loading" style="margin-top:var(--sp-4);">
                    <span></span><span></span><span></span>
                    <span style="animation:none; width:auto; height:auto; background:none; margin-left:var(--sp-2);">${{ en: 'Your tutor is reviewing...', ru: 'Репетитор проверяет...', es: 'Tu tutor está revisando...' }[lang]}</span>
                </div>
            `;
        }

        try {
            const level = LangyState?.user?.level || 'B1';
            const base64Data = imageBase64.split(',')[1];
            const mimeType = imageBase64.match(/data:(.*?);/)?.[1] || 'image/jpeg';

            // Build curriculum context
            let cefrLevel = 'B1';
            let unitHint = '';
            if (typeof LangyCurriculum !== 'undefined') {
                const tb = LangyCurriculum.getActive();
                if (tb) cefrLevel = tb.cefr || 'B1';
                const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
                if (unitId && tb && tb.units) {
                    const unit = tb.units.find(u => u.id === unitId);
                    if (unit) unitHint = `\nUnit grammar focus: ${unit.grammar?.join(', ') || 'general'}`;
                }
            }

            const prompt = `You are a CEFR-certified English tutor at the ${cefrLevel} level reviewing a student's handwritten work.
Student level: ${level} (CEFR ${cefrLevel})${unitHint}
Writing task: "${taskText}"

Analyze the photo of their handwritten answer. Return ONLY valid JSON (no markdown, no backticks):
{
  "transcription": "what you can read from the handwriting",
  "score": 75,
  "strengths": ["strength 1", "strength 2"],
  "issues": [{"problem": "description", "correction": "how to fix it"}],
  "corrected": "the text rewritten correctly",
  "legibility": 7,
  "nextStep": "one concrete thing to practice next",
  "summary": "2-sentence overall assessment"
}

Score 0-100 based on task completion, grammar, spelling, and handwriting clarity.
Be encouraging but specific. If you cannot read parts, mention that in issues.`;

            const response = await LangyAI.fetchWithTimeout(LangyAI.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: LangyAI.MODEL,
                    messages: [{ role: 'user', content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } },
                    ] }],
                    max_tokens: 800,
                    temperature: 0.4,
                }),
            });

            if (!response.ok) throw new Error('AI unavailable');
            const data = await response.json();
            const raw = data.choices?.[0]?.message?.content || '';

            // Try JSON parse, fallback to raw text
            let review;
            try {
                const jsonStr = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
                review = JSON.parse(jsonStr);
            } catch { review = null; }

            if (review && feedbackArea) {
                const scoreColor = review.score >= 80 ? 'var(--accent-dark)' : review.score >= 50 ? '#F59E0B' : 'var(--danger)';
                feedbackArea.innerHTML = `
                    <div style="margin-top:var(--sp-5); display:flex; flex-direction:column; gap:var(--sp-3);">
                        <h4 style="display:flex; align-items:center; gap:8px;">
                            <span style="color:#F59E0B;">${LangyIcons.brain}</span>
                            ${{ en: 'Tutor Review', ru: 'Проверка репетитора', es: 'Revisión del tutor' }[lang]}
                        </h4>

                        <!-- Score + Summary -->
                        <div class="card" style="padding:var(--sp-4); text-align:center; border-top:3px solid ${scoreColor};">
                            <div style="font-size:36px; font-weight:var(--fw-bold); color:${scoreColor};">${review.score}/100</div>
                            <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-top:var(--sp-1);">${escapeHTML(review.summary || '')}</div>
                            ${review.legibility ? `<div class="badge" style="margin-top:var(--sp-2);">${LangyIcons.eye || '👁'} ${{ en: 'Legibility', ru: 'Читаемость', es: 'Legibilidad' }[lang]}: ${review.legibility}/10</div>` : ''}
                        </div>

                        <!-- Transcription -->
                        ${review.transcription ? `
                        <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid var(--primary);">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:var(--primary); margin-bottom:var(--sp-1);">${{ en: 'What we read', ru: 'Что мы прочитали', es: 'Lo que leímos' }[lang]}</div>
                            <div style="font-size:var(--fs-sm); font-style:italic; color:var(--text-secondary);">${escapeHTML(review.transcription)}</div>
                        </div>` : ''}

                        <!-- Strengths -->
                        ${review.strengths?.length ? `
                        <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid var(--accent-dark);">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:var(--accent-dark); margin-bottom:var(--sp-2);">${LangyIcons.check} ${{ en: 'Strengths', ru: 'Сильные стороны', es: 'Puntos fuertes' }[lang]}</div>
                            ${review.strengths.map(s => `<div style="font-size:var(--fs-sm); color:var(--text-secondary); padding:2px 0;">✓ ${escapeHTML(s)}</div>`).join('')}
                        </div>` : ''}

                        <!-- Issues -->
                        ${review.issues?.length ? `
                        <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid var(--danger);">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:var(--danger); margin-bottom:var(--sp-2);">${LangyIcons.alertTriangle} ${{ en: 'Issues Found', ru: 'Найденные ошибки', es: 'Problemas encontrados' }[lang]}</div>
                            ${review.issues.map(i => `
                                <div style="font-size:var(--fs-sm); color:var(--text-secondary); padding:4px 0; border-bottom:1px solid rgba(0,0,0,0.05);">
                                    <div style="color:var(--danger);">✗ ${escapeHTML(i.problem)}</div>
                                    <div style="color:var(--accent-dark); margin-top:2px;">→ ${escapeHTML(i.correction)}</div>
                                </div>
                            `).join('')}
                        </div>` : ''}

                        <!-- Corrected -->
                        ${review.corrected ? `
                        <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid #3B82F6;">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:#3B82F6; margin-bottom:var(--sp-1);">${{ en: 'Corrected Version', ru: 'Исправленная версия', es: 'Versión corregida' }[lang]}</div>
                            <div style="font-size:var(--fs-sm); color:var(--text-primary); line-height:1.6;">${escapeHTML(review.corrected)}</div>
                        </div>` : ''}

                        <!-- Next Step -->
                        ${review.nextStep ? `
                        <div class="card" style="padding:var(--sp-3); border:1px solid rgba(59,130,246,0.15); background:rgba(59,130,246,0.03);">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:1px; color:var(--primary); margin-bottom:var(--sp-1);">${LangyIcons.arrowRight} ${{ en: 'Next Step', ru: 'Следующий шаг', es: 'Siguiente paso' }[lang]}</div>
                            <div style="font-size:var(--fs-sm); color:var(--text-secondary);">${escapeHTML(review.nextStep)}</div>
                        </div>` : ''}
                    </div>
                `;
            } else if (feedbackArea) {
                // Fallback: render raw text
                feedbackArea.innerHTML = `
                    <div class="hw-feedback" style="margin-top:var(--sp-4);">
                        <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:8px;">
                            <span style="color:#F59E0B;">${LangyIcons.brain}</span> ${{ en: 'Tutor Review', ru: 'Проверка', es: 'Revisión' }[lang]}
                        </h4>
                        <div style="font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.8; white-space:pre-line;">${escapeHTML(raw)}</div>
                    </div>
                `;
            }

            // Award XP and record session
            if (typeof LangyState !== 'undefined') {
                LangyState.user.xp += 30;
                LangyState.progress.skills.writing = Math.min(100, (LangyState.progress.skills.writing || 0) + 3);
                if (typeof recordSession === 'function') {
                    recordSession({ duration: 2, wordsLearned: 0, accuracy: review?.score || 80, category: 'writing' });
                }
                if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
                Anim.showToast(`+30 XP ${{ en: 'for handwriting review', ru: 'за проверку почерка', es: 'por revisión de escritura' }[lang]}!`);
            }
        } catch (err) {
            console.error('Handwriting analysis error:', err);
            if (feedbackArea) {
                feedbackArea.innerHTML = `
                    <div class="hw-feedback" style="border-color:var(--danger);">
                        <p style="color:var(--danger); font-size:var(--fs-sm);">
                            ${{ en: 'Could not analyze your handwriting. Please check your connection and try again.', ru: 'Не удалось проанализировать. Проверьте подключение и попробуйте снова.', es: 'No se pudo analizar. Comprueba tu conexión e inténtalo de nuevo.' }[lang]}
                        </p>
                    </div>
                `;
            }
        }
    });
}

// ─── Homework Error Review (unchanged) ───
function showHomeworkErrors(itemId) {
    const item = LangyState.progress.lessonHistory.find(h => h.id == itemId);
    if (!item) return;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom: var(--sp-4);">${item.title}</h3>
            <div style="display:flex; gap:var(--sp-4); margin-bottom:var(--sp-4);">
                <div class="stat">
                    <div class="stat__value" style="color: ${item.score >= 80 ? 'var(--accent-dark)' : 'var(--danger)'};">${item.score}%</div>
                    <div class="stat__label">Score</div>
                </div>
                <div class="stat">
                    <div class="stat__value">${item.grade || '-'}</div>
                    <div class="stat__label">Grade</div>
                </div>
                <div class="stat">
                    <div class="stat__value">${item.errors || 0}</div>
                    <div class="stat__label">Errors</div>
                </div>
            </div>

            <h4 style="margin-bottom: var(--sp-3);">Feedback</h4>
            <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
                <div class="card card--flat" style="padding:var(--sp-3); border-left:4px solid var(--primary);">
                    <div style="font-size:var(--fs-sm); line-height:1.5;">${escapeHTML(item.feedback || 'Good work on this unit! Keep practicing to improve your score.')}</div>
                </div>
            </div>

            <button class="btn btn--primary btn--full" style="margin-top:var(--sp-5);" id="error-close">Got it!</button>
            ${item.score < 70 ? `<button class="btn btn--ghost btn--full" style="margin-top:var(--sp-2); display:flex; align-items:center; justify-content:center; gap:8px;" id="error-retry">${LangyIcons.refresh} Retry This Lesson</button>` : ''}
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
    overlay.querySelector('#error-close')?.addEventListener('click', () => overlay.remove());
    overlay.querySelector('#error-retry')?.addEventListener('click', () => {
        overlay.remove();
        Router.navigate('learning', { mode: 'homework', unitId: item.unitId });
    });
}

Router.register('homework', renderHomework);
