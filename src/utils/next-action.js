/* ============================================
   NEXT ACTION — Cross-mode recommendation engine
   Lightweight tutor-like guidance that connects
   weak spots, homework, skills, and mode recency
   into one coherent next-step suggestion.
   ============================================ */

const NextAction = (() => {
    'use strict';

    // ─── Signal collectors ───

    function _getSkills() {
        return LangyState?.progress?.skills || {};
    }

    function _getPendingHomework() {
        return LangyState?.homework?.current || [];
    }

    function _getWeakSpots() {
        if (typeof CoachIntel !== 'undefined') return CoachIntel.topPatterns(3);
        return (LangyState?.coachData?.mistakePatterns || []).slice(0, 3).map(p => ({
            tag: p.tag,
            label: p.tag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            count: p.count,
            status: p.count >= 3 ? 'needs_work' : 'new',
        }));
    }

    function _getRecentSessions() {
        return LangyState?.coachData?.sessionLog || [];
    }

    function _getTalkCount() {
        return (LangyState?.talkHistory || []).length;
    }

    function _getLessonHistory() {
        return LangyState?.progress?.lessonHistory || [];
    }

    // ─── Mode definitions ───
    const MODES = [
        { id: 'talk',       key: 'speaking',   icon: '🎙', route: 'talk',     label: { en: 'Speaking practice', ru: 'Разговорная практика', es: 'Práctica de hablar' } },
        { id: 'homework',   key: 'writing',    icon: '📝', route: 'homework', label: { en: 'Homework', ru: 'Домашка', es: 'Tarea' } },
        { id: 'grammar',    key: 'grammar',    icon: '📖', route: 'learning', label: { en: 'Grammar lesson', ru: 'Урок грамматики', es: 'Lección de gramática' } },
        { id: 'listening',  key: 'listening',  icon: '🎧', route: 'talk',     label: { en: 'Listening practice', ru: 'Аудирование', es: 'Práctica de escucha' } },
        { id: 'vocabulary', key: 'vocabulary', icon: '🧠', route: 'learning', label: { en: 'Vocabulary review', ru: 'Повторение слов', es: 'Repaso de vocabulario' } },
    ];

    // ─── Core recommendation logic ───

    const grammarMode = MODES.find(mode => mode.id === 'grammar');
    if (grammarMode) grammarMode.route = 'grammar';
    const listeningMode = MODES.find(mode => mode.id === 'listening');
    if (listeningMode) listeningMode.route = 'listening';

    function recommend(lang = 'en', options = {}) {
        const skills = _getSkills();
        const weakSpots = _getWeakSpots();
        const pendingHw = _getPendingHomework();
        const talkCount = _getTalkCount();
        const lessons = _getLessonHistory();
        const sessions = _getRecentSessions();
        const excludedModes = new Set(options.excludeModes || []);

        const candidates = [];

        // Signal 1: Recurring weak spots �' suggest speaking practice to fix them
        const recurringSpot = weakSpots.find(w => w.status === 'recurring' || w.status === 'needs_work');
        if (recurringSpot) {
            candidates.push({
                priority: 10,
                mode: MODES[0], // talk
                reason: {
                    en: `"${recurringSpot.label}" keeps appearing (${recurringSpot.count}×) — practice speaking to reinforce it`,
                    ru: `"${recurringSpot.label}" повторяется (${recurringSpot.count}×) — попрактикуй в разговоре`,
                    es: `"${recurringSpot.label}" sigue apareciendo (${recurringSpot.count}×) — practica hablando`,
                },
                signal: 'weak_spot',
                meta: { tag: recurringSpot.tag, count: recurringSpot.count },
            });
        }

        // Signal 2: Pending homework �' suggest homework
        if (pendingHw.length > 0) {
            const weakHw = pendingHw.find(h => h.source === 'weak_spot');
            const label = weakHw ? weakHw.title : pendingHw[0].title;
            candidates.push({
                priority: weakHw ? 9 : 7,
                mode: MODES[1], // homework
                reason: {
                    en: `${pendingHw.length} homework task${pendingHw.length > 1 ? 's' : ''} waiting — "${label}"`,
                    ru: `${pendingHw.length} задани${pendingHw.length > 1 ? 'я' : 'е'} ждёт — "${label}"`,
                    es: `${pendingHw.length} tarea${pendingHw.length > 1 ? 's' : ''} pendiente${pendingHw.length > 1 ? 's' : ''} — "${label}"`,
                },
                signal: 'pending_homework',
            });
        }

        // Signal 3: Weakest skill dimension �' suggest that mode
        const skillEntries = MODES.map(m => ({ mode: m, val: skills[m.key] || 0 }));
        const weakestSkill = skillEntries.sort((a, b) => a.val - b.val)[0];
        if (weakestSkill && weakestSkill.val < 50) {
            candidates.push({
                priority: 6,
                mode: weakestSkill.mode,
                reason: {
                    en: `${weakestSkill.mode.label.en} is your weakest area (${weakestSkill.val}%) — a session would help`,
                    ru: `${weakestSkill.mode.label.ru} — слабая зона (${weakestSkill.val}%) — сессия поможет`,
                    es: `${weakestSkill.mode.label.es} es tu área más débil (${weakestSkill.val}%) — una sesión ayudaría`,
                },
                signal: 'weakest_skill',
            });
        }

        // Signal 4: Haven't spoken recently �' suggest talk
        if (talkCount === 0) {
            candidates.push({
                priority: 8,
                mode: MODES[0],
                reason: {
                    en: "You haven't tried speaking yet — your first session will make a big difference",
                    ru: 'Ты ещё не пробовал говорить — первая сессия даст большой прогресс',
                    es: 'Aún no has probado hablar — tu primera sesión marcará una gran diferencia',
                },
                signal: 'never_spoken',
            });
        } else if (talkCount > 0 && sessions.length > 0) {
            const lastSession = sessions[sessions.length - 1];
            const daysSince = _daysSince(lastSession.date);
            if (daysSince >= 2) {
                candidates.push({
                    priority: 7,
                    mode: MODES[0],
                    reason: {
                        en: `${daysSince} days since your last speaking session — stay in practice`,
                        ru: `${daysSince} дней без разговорной практики — не теряй навык`,
                        es: `${daysSince} días sin hablar — mantén la práctica`,
                    },
                    signal: 'stale_speaking',
                });
            }
        }

        // Signal 5: Low score on recent lesson �' suggest review
        if (lessons.length > 0) {
            const last = lessons[lessons.length - 1];
            if (last.score && last.score < 70) {
                candidates.push({
                    priority: 8,
                    mode: MODES[2], // grammar
                    reason: {
                        en: `Last lesson scored ${last.score}% — review would strengthen it`,
                        ru: `Последний урок ${last.score}% — повтор закрепит материал`,
                        es: `Última lección ${last.score}% — repasar lo reforzaría`,
                    },
                    signal: 'low_recent_score',
                });
            }
        }

        // Signal 6: No lessons at all �' suggest starting curriculum
        if (lessons.length === 0 && talkCount > 0) {
            candidates.push({
                priority: 5,
                mode: MODES[2],
                reason: {
                    en: "You\'ve been speaking — now try a grammar lesson to structure what you know",
                    ru: 'Ты уже говоришь — попробуй урок грамматики для структуры',
                    es: 'Ya has hablado — prueba una lección de gramática para estructurar',
                },
                signal: 'no_lessons_yet',
            });
        }

        // Signal 7: Vocab review due → suggest vocabulary review
        if (typeof VocabTracker !== 'undefined') {
            const dueCount = VocabTracker.getDueCount();
            if (dueCount >= 3) {
                candidates.push({
                    priority: dueCount >= 8 ? 9 : 7,
                    mode: MODES[4], // vocabulary
                    reason: {
                        en: `${dueCount} vocabulary words need review — keep them in memory`,
                        ru: `${dueCount} слов ждут повторения — не забывай их`,
                        es: `${dueCount} palabras necesitan repaso — mantenlas en memoria`,
                    },
                    signal: 'vocab_review_due',
                    meta: { dueCount },
                });
            }
        }

        const visibleCandidates = candidates.filter(candidate => !excludedModes.has(candidate.mode.id));

        // Sort by priority (highest first)
        visibleCandidates.sort((a, b) => b.priority - a.priority);

        // Return top recommendation, or null
        if (visibleCandidates.length === 0) return null;

        const top = visibleCandidates[0];
        return {
            route: top.mode.route,
            icon: top.mode.icon,
            label: top.mode.label,
            reason: top.reason,
            signal: top.signal,
            meta: top.meta || null,
            priority: top.priority,
            // Also expose runner-up for richer UI
            alternatives: visibleCandidates.slice(1, 3).map(c => ({
                route: c.mode.route,
                icon: c.mode.icon,
                label: c.mode.label,
                reason: c.reason,
                signal: c.signal,
            })),
        };
    }

    // ─── Render: compact CTA card ───
    function renderCard(lang = 'en', options = {}) {
        const rec = recommend(lang, options);
        if (!rec) return '';

        const reasonText = rec.reason[lang] || rec.reason.en;
        const labelText = rec.label[lang] || rec.label.en;

        const signalColors = {
            weak_spot: '#F59E0B',
            pending_homework: '#8B5CF6',
            weakest_skill: '#3B82F6',
            never_spoken: '#EF4444',
            stale_speaking: '#EF4444',
            low_recent_score: '#F59E0B',
            no_lessons_yet: '#3B82F6',
            vocab_review_due: '#F59E0B',
        };
        const accentColor = signalColors[rec.signal] || 'var(--primary)';

        let html = `
        <button type="button" class="next-action-card" data-route="${rec.route}" ${rec.meta?.tag ? `data-focus-tag="${rec.meta.tag}"` : ''}
            style="padding:var(--sp-3) var(--sp-4); border:0; border-left:3px solid ${accentColor};
            background:${accentColor}08; border-radius:var(--radius-sm); cursor:pointer;
            display:flex; align-items:center; gap:var(--sp-3); margin-top:var(--sp-2); width:100%; text-align:left; color:inherit; font:inherit;">
            <span style="font-size:20px; flex-shrink:0;">${rec.icon}</span>
            <div style="flex:1; min-width:0;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${accentColor}; display:flex; align-items:center; gap:4px; margin-bottom:2px;">
                    ${LangyIcons.arrowRight} ${{ en: 'Suggested next', ru: 'Рекомендуем', es: 'Recomendado' }[lang]}
                </div>
                <div style="font-size:var(--fs-sm); font-weight:var(--fw-semibold); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${labelText}</div>
                <div style="font-size:10px; color:var(--text-tertiary); margin-top:1px; line-height:1.4;">${reasonText}</div>
            </div>
            <span style="color:var(--text-tertiary); font-size:12px; flex-shrink:0;">${LangyIcons.arrowRight}</span>
        </button>`;

        // Alternative suggestions (compact)
        if (rec.alternatives.length > 0) {
            html += `<div style="display:flex; gap:var(--sp-2); margin-top:var(--sp-2);">`;
            rec.alternatives.forEach(alt => {
                const altLabel = alt.label[lang] || alt.label.en;
                const altColor = signalColors[alt.signal] || 'var(--text-tertiary)';
                html += `
                <button type="button" class="next-action-alt" data-route="${alt.route}"
                    style="flex:1; padding:var(--sp-2); background:var(--bg-alt); border:0; border-radius:var(--radius-sm);
                    cursor:pointer; text-align:center; font-size:10px; color:inherit; font:inherit;">
                    <div style="font-size:14px; margin-bottom:2px;">${alt.icon}</div>
                    <div style="color:${altColor}; font-weight:var(--fw-semibold);">${altLabel}</div>
                </button>`;
            });
            html += `</div>`;
        }

        return html;
    }

    // ─── Bind click events ───
    function bindEvents(container) {
        container.querySelector('.next-action-card')?.addEventListener('click', () => {
            const route = container.querySelector('.next-action-card')?.dataset.route;
            const focusTag = container.querySelector('.next-action-card')?.dataset.focusTag;
            if (focusTag && typeof CoachIntel !== 'undefined') {
                CoachIntel.launchFocusPractice(focusTag);
            } else if (route) {
                Router.navigate(route);
            }
        });
        container.querySelectorAll('.next-action-alt').forEach(el => {
            el.addEventListener('click', () => {
                const route = el.dataset.route;
                if (route) Router.navigate(route);
            });
        });
    }

    // ─── Helpers ───
    function _daysSince(dateStr) {
        if (!dateStr) return 999;
        const d = new Date(dateStr);
        const now = new Date();
        return Math.floor((now - d) / (1000 * 60 * 60 * 24));
    }

    return { recommend, renderCard, bindEvents };
})();
