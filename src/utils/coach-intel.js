/* ============================================
   COACH INTELLIGENCE — visible coaching memory
   Analyzes coachData.mistakePatterns + sessionLog
   and generates user-facing coaching surfaces.
   Coach-only. Language-agnostic.
   ============================================ */

const CoachIntel = (() => {
    'use strict';

    const COACH_PLANS = ['coach', 'pro', 'premium'];

    function isCoach() {
        return COACH_PLANS.includes(LangyState?.subscription?.plan);
    }

    function _getPatterns() {
        return (LangyState?.coachData?.mistakePatterns || []).filter(p => p.count > 0);
    }

    function _getSessionLog() {
        return LangyState?.coachData?.sessionLog || [];
    }

    // ─── Pattern Status ───
    function patternStatus(p) {
        if (!p) return 'new';
        if (p.count === 1) return 'new';

        const log = _getSessionLog();
        const recent3 = log.slice(-3);
        const older3 = log.slice(-6, -3);
        const recentHits = recent3.filter(s => s.tags.includes(p.tag)).length;
        const olderHits = older3.filter(s => s.tags.includes(p.tag)).length;

        if (olderHits > 0 && recentHits === 0) return 'improving';
        if (recentHits >= 2) return 'recurring';
        if (p.count >= 3) return 'needs_work';
        return 'new';
    }

    // ─── Top Patterns ───
    function topPatterns(max = 3) {
        return _getPatterns()
            .slice(0, max)
            .map(p => ({
                tag: p.tag,
                label: _humanizeTag(p.tag),
                count: p.count,
                prevCount: p.prevCount || 0,
                example: p.example || '',
                status: patternStatus(p),
                firstSeen: p.firstSeen || p.lastSeen,
                lastSeen: p.lastSeen,
            }));
    }

    // ─── Recommended Focus ───
    function recommendedFocus(lang = 'en') {
        const patterns = _getPatterns();
        if (patterns.length === 0) return null;

        const withStatus = patterns.map(p => ({ ...p, status: patternStatus(p) }));
        const focus =
            withStatus.find(p => p.status === 'recurring') ||
            withStatus.find(p => p.status === 'needs_work') ||
            withStatus[0];

        const label = _humanizeTag(focus.tag);
        const templates = {
            en: {
                recurring: `Focus on ${label} — this keeps coming back.`,
                needs_work: `Practice ${label} — it's appeared ${focus.count} times.`,
                new: `Watch out for ${label} in your next session.`,
                improving: `Good progress on ${label}! Keep reinforcing it.`,
            },
            ru: {
                recurring: `Сфокусируйся на ${label} — это повторяется.`,
                needs_work: `Попрактикуй ${label} — ${focus.count} раз(а).`,
                new: `Обрати внимание на ${label} в следующей сессии.`,
                improving: `${label} улучшается! Продолжай закреплять.`,
            },
            es: {
                recurring: `Enfócate en ${label} — sigue apareciendo.`,
                needs_work: `Practica ${label} — ha aparecido ${focus.count} veces.`,
                new: `Presta atención a ${label} en tu próxima sesión.`,
                improving: `¡Buen progreso con ${label}! Sigue reforzándolo.`,
            },
        };

        return {
            tag: focus.tag,
            label,
            status: focus.status,
            text: (templates[lang] || templates.en)[focus.status],
        };
    }

    // ─── Session-to-session continuity ───
    function sessionContinuity(currentCorrections, lang = 'en') {
        const patterns = _getPatterns();
        if (patterns.length === 0 || !currentCorrections?.length) return null;

        const currentTags = currentCorrections
            .map(c => (c.tag || c.why || 'general').toLowerCase().replace(/\s+/g, '_'));

        for (const tag of currentTags) {
            const existing = patterns.find(p => p.tag === tag && p.count > 1);
            if (existing) {
                const label = _humanizeTag(tag);
                return {
                    en: `${label} appeared again — you've had this ${existing.count} times now. Coach is tracking it.`,
                    ru: `${label} снова — это уже ${existing.count} раз. Coach отслеживает.`,
                    es: `${label} otra vez — ya van ${existing.count} veces. Coach lo sigue.`,
                }[lang] || null;
            }
        }

        const top = patterns[0];
        if (top && top.count >= 3 && !currentTags.includes(top.tag)) {
            const label = _humanizeTag(top.tag);
            return {
                en: `No ${label} issues this time — nice improvement!`,
                ru: `На этот раз без ${label} — прогресс!`,
                es: `Sin problemas de ${label} esta vez — ¡buen progreso!`,
            }[lang] || null;
        }

        return null;
    }

    // ─── Launch Focused Practice ───
    function launchFocusPractice(focusTag) {
        if (!focusTag) return;
        const label = _humanizeTag(focusTag);
        ScreenState.set('coachFocus', label);
        ScreenState.set('coachFocusTag', focusTag);
        ScreenState.set('talkView', 'call');
        ScreenState.set('talkScenario', 'free');
        Router.navigate('talk');
    }

    // ═══════════════════════════════════════
    // FOCUS OUTCOME EVALUATION
    // ═══════════════════════════════════════

    // Evaluate how the user did on their chosen focus area
    // Returns: { verdict: 'improved'|'still_working'|'good_practice', label, message, nextAction, nextActionLabel }
    function evaluateFocusOutcome(focusTag, corrections, lang = 'en') {
        if (!focusTag) return null;
        const normalizedFocus = focusTag.toLowerCase().replace(/\s+/g, '_');
        const label = _humanizeTag(normalizedFocus);

        // Check if focus-related corrections appeared in this session
        const focusCorrections = (corrections || []).filter(c => {
            const tag = (c.tag || c.why || '').toLowerCase().replace(/\s+/g, '_');
            return tag === normalizedFocus || tag.includes(normalizedFocus) || normalizedFocus.includes(tag);
        });

        // Look at historical pattern for context
        const historicalPattern = _getPatterns().find(p => p.tag === normalizedFocus);
        const prevCount = historicalPattern?.prevCount || 0;
        const totalCount = historicalPattern?.count || 0;

        let verdict, message, nextAction, nextActionLabel;

        if (focusCorrections.length === 0) {
            // Focus didn't appear in corrections — improvement signal
            verdict = 'improved';
            message = {
                en: `No ${label} issues detected this time. That's real progress.`,
                ru: `${label} — на этот раз без ошибок. Это реальный прогресс.`,
                es: `Sin errores de ${label} esta vez. Eso es progreso real.`,
            }[lang];
            nextAction = 'move_on';
            nextActionLabel = {
                en: 'Continue practicing',
                ru: 'Продолжить практику',
                es: 'Continuar practicando',
            }[lang];
        } else if (focusCorrections.length === 1 && totalCount > 3) {
            // Only 1 correction on a previously frequent issue — getting better
            verdict = 'improving';
            message = {
                en: `${label} appeared once — less than before. You're getting more consistent.`,
                ru: `${label} — одна ошибка, меньше чем раньше. Становится стабильнее.`,
                es: `${label} apareció una vez — menos que antes. Estás mejorando.`,
            }[lang];
            nextAction = 'practice_again';
            nextActionLabel = {
                en: 'Reinforce this focus',
                ru: 'Закрепить этот фокус',
                es: 'Reforzar este enfoque',
            }[lang];
        } else {
            // Focus still appeared — needs more work
            verdict = 'still_working';
            message = {
                en: `${label} came up ${focusCorrections.length} time${focusCorrections.length > 1 ? 's' : ''}. Keep practicing — awareness is the first step.`,
                ru: `${label} — ${focusCorrections.length} раз(а). Продолжай — осознанность это первый шаг.`,
                es: `${label} apareció ${focusCorrections.length} vez/veces. Sigue practicando — la conciencia es el primer paso.`,
            }[lang];
            nextAction = 'practice_again';
            nextActionLabel = {
                en: 'Practice this again',
                ru: 'Повторить практику',
                es: 'Practicar de nuevo',
            }[lang];
        }

        return { verdict, label, message, nextAction, nextActionLabel, focusTag: normalizedFocus };
    }

    // Render Focus Recap card for talk summary
    function renderFocusRecap(focusTag, corrections, lang = 'en') {
        if (!isCoach()) return '';
        const outcome = evaluateFocusOutcome(focusTag, corrections, lang);
        if (!outcome) return '';

        const verdictConfig = {
            improved: { dot: '#10B981' },
            improving: { dot: '#F59E0B' },
            still_working: { dot: 'var(--coach, #7C6CF6)' },
        };
        const vc = verdictConfig[outcome.verdict] || verdictConfig.still_working;

        const verdictLabels = {
            improved: { en: 'Improved', ru: 'Улучшилось', es: 'Mejorado' },
            improving: { en: 'Getting better', ru: 'Улучшается', es: 'Mejorando' },
            still_working: { en: 'Needs more practice', ru: 'Нужно ещё поработать', es: 'Necesita más práctica' },
        };

        return `
        <div style="padding:var(--sp-5); margin-bottom:var(--sp-3); border-radius:var(--radius-lg);
            background:var(--coach-bg, rgba(124,108,246,0.05)); border:1px solid var(--coach-border, rgba(124,108,246,0.12));
            animation:fadeInUp 0.5s var(--ease-out) 0.35s both;">

            <div style="display:flex; align-items:center; gap:8px; margin-bottom:var(--sp-4);">
                <span style="color:var(--coach, #7C6CF6); font-size:16px;">${LangyIcons.target}</span>
                <span style="font-weight:var(--fw-bold); font-size:var(--fs-xs); color:var(--coach, #7C6CF6); text-transform:uppercase; letter-spacing:0.5px;">
                    ${{ en: 'Focused Practice Result', ru: 'Результат фокусной практики', es: 'Resultado de práctica enfocada' }[lang]}
                </span>
            </div>

            <div style="display:flex; align-items:center; gap:var(--sp-3); padding:var(--sp-3) var(--sp-4);
                background:var(--surface); border-radius:var(--radius-sm); margin-bottom:var(--sp-4);
                border:1px solid var(--border-light);">
                <div style="flex:1;">
                    <div style="font-size:var(--fs-xs); color:var(--text-tertiary); letter-spacing:0.3px; margin-bottom:3px;">
                        ${{ en: 'Focus area', ru: 'Фокус', es: 'Área de enfoque' }[lang]}
                    </div>
                    <div style="font-weight:var(--fw-bold); font-size:var(--fs-md); color:var(--text);">
                        ${outcome.label}
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="width:8px; height:8px; border-radius:50%; background:${vc.dot};"></span>
                    <span style="font-size:var(--fs-sm); font-weight:var(--fw-semibold); color:${vc.dot};">
                        ${verdictLabels[outcome.verdict][lang]}
                    </span>
                </div>
            </div>

            <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0 0 var(--sp-4); line-height:1.6;">
                ${outcome.message}
            </p>

            <button class="btn btn--full btn--sm" id="coach-focus-next"
                style="background:var(--coach, #7C6CF6); color:white; border:none; display:flex; align-items:center; justify-content:center; gap:6px;"
                data-action="${outcome.nextAction}" data-focus="${outcome.focusTag}">
                ${outcome.nextAction === 'practice_again' ? LangyIcons.refreshCw : LangyIcons.mic}
                ${outcome.nextActionLabel}
            </button>
        </div>`;
    }

    // ─── Coach Notes card for profile ───
    function renderCoachNotes(lang = 'en') {
        if (!isCoach()) return '';
        const patterns = topPatterns(3);
        const focus = recommendedFocus(lang);
        const sessionCount = (LangyState.talkHistory || []).length;

        if (patterns.length === 0 && sessionCount < 2) {
            return `
            <div class="profile__section">
                <div class="profile__section-title" style="color:var(--coach, #7C6CF6);">${LangyIcons.brain} Coach Notes</div>
                <div style="padding:var(--sp-5); text-align:center; background:var(--coach-bg, rgba(124,108,246,0.05)); border-radius:var(--radius-lg); border:1px solid var(--coach-border, rgba(124,108,246,0.12));">
                    <p style="color:var(--text-tertiary); font-size:var(--fs-sm); margin:0; line-height:1.6;">
                        ${{ en: 'Complete a few practice sessions and your Coach will start tracking patterns here.', ru: 'Проведи несколько сессий, и Coach начнёт отслеживать закономерности.', es: 'Completa unas sesiones y tu Coach empezará a rastrear patrones aquí.' }[lang]}
                    </p>
                </div>
            </div>`;
        }

        if (patterns.length === 0) return '';

        const statusColor = { recurring: '#F59E0B', needs_work: '#EF4444', improving: '#10B981', new: 'var(--text-tertiary)' };
        const statusLabel = {
            recurring: { en: 'Recurring', ru: 'Повторяется', es: 'Recurrente' },
            needs_work: { en: 'Needs work', ru: 'Нужна практика', es: 'Necesita práctica' },
            improving: { en: 'Improving', ru: 'Улучшается', es: 'Mejorando' },
            new: { en: 'New', ru: 'Новое', es: 'Nuevo' },
        };

        const practiceCTA = focus && focus.status !== 'improving' ? `
                <div style="padding:var(--sp-3) var(--sp-4); border-top:1px solid var(--coach-border, rgba(124,108,246,0.12));">
                    <button class="btn btn--full btn--sm" id="coach-practice-profile"
                        style="display:flex; align-items:center; justify-content:center; gap:6px; background:var(--coach, #7C6CF6); color:white; border:none;">
                        ${LangyIcons.mic} ${{ en: 'Practice this now', ru: 'Практиковать сейчас', es: 'Practicar ahora' }[lang]}
                    </button>
                </div>` : '';

        return `
        <div class="profile__section">
            <div class="profile__section-title" style="color:var(--coach, #7C6CF6);">${LangyIcons.brain} Coach Notes</div>
            <div style="padding:0; overflow:hidden; background:var(--coach-bg, rgba(124,108,246,0.05)); border-radius:var(--radius-lg); border:1px solid var(--coach-border, rgba(124,108,246,0.12));">
                ${patterns.map((p, i) => `
                <div style="padding:var(--sp-3) var(--sp-4); ${i < patterns.length - 1 ? 'border-bottom:1px solid var(--coach-border, rgba(124,108,246,0.12));' : ''}
                    display:flex; align-items:center; gap:var(--sp-3);">
                    <span style="width:8px; height:8px; border-radius:50%; background:${statusColor[p.status]}; flex-shrink:0;"></span>
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:var(--fw-semibold); font-size:var(--fs-sm); color:var(--text); margin-bottom:1px;">
                            ${p.label}
                        </div>
                        ${p.example ? `<div style="font-size:var(--fs-xs); color:var(--text-tertiary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            "${p.example}"
                        </div>` : ''}
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="font-size:var(--fs-xs); font-weight:var(--fw-semibold); color:${statusColor[p.status]};">
                            ${statusLabel[p.status][lang] || statusLabel[p.status].en}
                        </div>
                        <div style="font-size:10px; color:var(--text-tertiary);">×${p.count}</div>
                    </div>
                </div>
                `).join('')}

                ${focus ? `
                <div style="padding:var(--sp-3) var(--sp-4); background:rgba(124,108,246,0.03);
                    border-top:1px solid var(--coach-border, rgba(124,108,246,0.12));">
                    <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                        <span style="color:var(--coach, #7C6CF6); font-size:12px;">${LangyIcons.target}</span>
                        <span style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:var(--coach, #7C6CF6); text-transform:uppercase; letter-spacing:0.4px;">
                            ${{ en: 'Recommended focus', ru: 'Рекомендация', es: 'Enfoque recomendado' }[lang]}
                        </span>
                    </div>
                    <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.5;">
                        ${focus.text}
                    </p>
                </div>
                ` : ''}
                ${practiceCTA}
            </div>
        </div>`;
    }

    // ─── Coach Memory card for talk summary ───
    function renderSummaryMemory(currentCorrections, lang = 'en') {
        if (!isCoach()) return '';
        const patterns = topPatterns(2);
        const continuity = sessionContinuity(currentCorrections, lang);
        const focus = recommendedFocus(lang);

        if (!continuity && patterns.length === 0) return '';

        // ── Welcome banner: one-time unlock moment ──
        const _welcomeSeen = LangyState.coachData?.welcomeSeen;
        const _sessionCount = (LangyState.talkHistory || []).length;
        const _showWelcome = !_welcomeSeen && _sessionCount >= 1;
        if (_showWelcome && LangyState.coachData) {
            LangyState.coachData.welcomeSeen = true;
            if (typeof LangyState.save === 'function') LangyState.save();
        }

        let html = `
        <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-lg);
            background:var(--coach-bg, rgba(124,108,246,0.05)); border:1px solid var(--coach-border, rgba(124,108,246,0.12));
            animation:fadeInUp 0.5s var(--ease-out) 0.45s both;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:var(--sp-3);">
                <span style="color:var(--coach, #7C6CF6); font-size:16px;">${LangyIcons.brain}</span>
                <span style="font-weight:var(--fw-bold); font-size:var(--fs-xs); color:var(--coach, #7C6CF6); text-transform:uppercase; letter-spacing:0.4px;">
                    ${{ en: 'Coach Memory', ru: 'Память Coach', es: 'Memoria del Coach' }[lang]}
                </span>
            </div>
            ${_showWelcome ? `
            <div style="padding:var(--sp-2) var(--sp-3); margin-bottom:var(--sp-3);
                background:rgba(124,108,246,0.08); border-radius:var(--radius-sm);
                border-left:3px solid #7C6CF6;">
                <div style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:#7C6CF6; margin-bottom:2px;">
                    ${{ en: 'Your Coach has been watching since session 1.', ru: 'Coach следил с первой сессии.', es: 'Tu Coach lleva observando desde la sesión 1.' }[lang]}
                </div>
                <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">
                    ${{ en: "Here's what it found.", ru: 'Вот что удалось найти.', es: 'Aquí está lo que encontró.' }[lang]}
                </div>
            </div>` : ''}`;

        if (continuity) {
            html += `
            <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0 0 var(--sp-3); line-height:1.6; padding-bottom:var(--sp-3); border-bottom:1px solid var(--coach-border, rgba(124,108,246,0.12));">
                ${continuity}
            </p>`;
        }

        if (patterns.length > 0) {
            const statusDot = { recurring: '#F59E0B', needs_work: '#EF4444', improving: '#10B981', new: 'var(--text-tertiary)' };
            html += `<div style="margin-bottom:${focus ? 'var(--sp-3)' : '0'};">`;
            for (let _pi = 0; _pi < patterns.length; _pi++) {
                const p = patterns[_pi];
                const _noErr = p.count === p.prevCount;
                const _worse = p.count >= p.prevCount + 2;
                const _trend = _noErr
                    ? `<span style="font-size:10px;color:#10B981;font-weight:600;white-space:nowrap;">&#8600; ${{ en: 'not this session', ru: '\u043d\u0435 \u0441\u0435\u0439\u0447\u0430\u0441', es: 'no esta vez' }[lang]}</span>`
                    : _worse ? `<span style="font-size:10px;color:#EF4444;font-weight:600;">&#8593;</span>` : '';
                const _sep = _pi < patterns.length - 1 ? 'border-bottom:1px solid rgba(124,108,246,0.08);' : '';
                html += `
                <div style="padding:6px 0;${_sep}">
                    <div style="display:flex;align-items:center;gap:8px;font-size:var(--fs-sm);">
                        <span style="width:6px;height:6px;border-radius:50%;background:${statusDot[p.status]};flex-shrink:0;"></span>
                        <span style="color:var(--text-secondary);flex:1;">${p.label}</span>
                        ${_trend}
                        <span style="font-size:var(--fs-xs);color:var(--text-tertiary);">&times;${p.count}</span>
                    </div>
                    ${p.example ? `<div style="font-size:var(--fs-xs);color:var(--text-tertiary);padding-left:14px;padding-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-style:italic;">
                        ${{ en: 'You said', ru: '\u0422\u044b \u0441\u043a\u0430\u0437\u0430\u043b', es: 'Dijiste' }[lang]}: &#8220;${p.example.length > 60 ? p.example.slice(0, 60) + '\u2026' : p.example}&#8221;
                    </div>` : ''}
                </div>`;
            }
            html += `</div>`;
        }

        if (focus && focus.status !== 'improving') {
            html += `
            <div style="padding:var(--sp-3); background:rgba(124,108,246,0.04); border-radius:var(--radius-sm); margin-bottom:var(--sp-3);">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                    <span style="color:var(--coach, #7C6CF6); font-size:12px;">${LangyIcons.target}</span>
                    <span style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:var(--coach, #7C6CF6); text-transform:uppercase; letter-spacing:0.3px;">
                        ${{ en: 'Next focus', ru: 'Следующий фокус', es: 'Próximo enfoque' }[lang]}
                    </span>
                </div>
                <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.5;">
                    ${focus.text}
                </p>
            </div>
            <button class="btn btn--full btn--sm" id="coach-practice-summary"
                style="display:flex; align-items:center; justify-content:center; gap:6px; background:var(--coach, #7C6CF6); color:white; border:none;">
                ${LangyIcons.mic} ${{ en: 'Practice this now', ru: 'Практиковать сейчас', es: 'Practicar ahora' }[lang]}
            </button>`;
        } else if (focus) {
            html += `
            <div style="padding:var(--sp-3); background:rgba(124,108,246,0.04); border-radius:var(--radius-sm);">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                    <span style="color:var(--coach, #7C6CF6); font-size:12px;">${LangyIcons.target}</span>
                    <span style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:var(--coach, #7C6CF6); text-transform:uppercase; letter-spacing:0.3px;">
                        ${{ en: 'Next focus', ru: 'Следующий фокус', es: 'Próximo enfoque' }[lang]}
                    </span>
                </div>
                <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.5;">
                    ${focus.text}
                </p>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    // ─── Utils ───
    function _humanizeTag(tag) {
        return tag
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    return {
        isCoach,
        topPatterns,
        recommendedFocus,
        sessionContinuity,
        patternStatus,
        renderCoachNotes,
        renderSummaryMemory,
        launchFocusPractice,
        evaluateFocusOutcome,
        renderFocusRecap,
    };
})();
