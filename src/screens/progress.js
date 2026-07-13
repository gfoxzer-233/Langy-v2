/* ============================================
   SCREEN: PROGRESS — Unified Language Growth Dashboard
   Shows all skill dimensions, recent activity,
   CEFR progress, and recommended next steps.
   ============================================ */

function renderProgress(container) {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const { progress, streakData, user } = LangyState;
    const skills = progress.skills || {};
    const userLevel = (user?.level || 'B1').substring(0, 2);
    const activityIcon = LangyIcons.activity || LangyIcons.barChart || '';

    // Skill dimensions with metadata
    const dimensions = [
        { key: 'speaking',   icon: LangyIcons.mic,        color: '#EF4444', label: { en: 'Speaking', ru: 'Говорение', es: 'Hablar' }, route: 'talk' },
        { key: 'listening',  icon: LangyIcons.headphones,  color: '#10B981', label: { en: 'Listening', ru: 'Аудирование', es: 'Escucha' }, route: 'listening' },
        { key: 'writing',    icon: LangyIcons.penTool,     color: '#3B82F6', label: { en: 'Writing', ru: 'Письмо', es: 'Escritura' }, route: 'homework' },
        { key: 'grammar',    icon: LangyIcons.book,        color: '#8B5CF6', label: { en: 'Grammar', ru: 'Грамматика', es: 'Gramática' }, route: 'grammar' },
        { key: 'vocabulary', icon: LangyIcons.brain,       color: '#F59E0B', label: { en: 'Vocabulary', ru: 'Словарный запас', es: 'Vocabulario' }, route: 'learning' },
        { key: 'reading',    icon: LangyIcons.fileText,    color: '#06B6D4', label: { en: 'Reading', ru: 'Чтение', es: 'Lectura' }, route: 'learning' },
    ];

    // Overall score = average of all skills
    const skillValues = dimensions.map(d => skills[d.key] || 0);
    const overall = skillValues.length ? Math.round(skillValues.reduce((a, b) => a + b, 0) / skillValues.length) : 0;

    // Find strongest and weakest
    const sorted = [...dimensions].sort((a, b) => (skills[b.key] || 0) - (skills[a.key] || 0));
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    // Recent activity from lesson history
    const recent = (progress.lessonHistory || []).slice(-5).reverse();

    // CEFR progress
    let cefrPct = 0;
    if (typeof LangyCurriculum !== 'undefined') {
        const tb = LangyCurriculum.getByLevel(userLevel);
        if (tb) {
            const mastery = progress.mastery || {};
            const passed = tb.units.filter(u => { const k = tb.id + ':' + u.id; return mastery[k] && mastery[k].passed; }).length;
            cefrPct = Math.round((passed / tb.units.length) * 100);
        }
    }

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="prog-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${{ en: 'My Progress', ru: 'Мой прогресс', es: 'Mi progreso' }[lang]}</div>
                <div style="width:36px;"></div>
            </div>

            <!-- Overall Score -->
            <div style="padding: var(--sp-4) var(--sp-5) var(--sp-2); text-align:center;">
                <div style="position:relative; width:100px; height:100px; margin:0 auto var(--sp-2);">
                    <svg viewBox="0 0 36 36" style="width:100px; height:100px; transform:rotate(-90deg);">
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(128,128,128,0.1)" stroke-width="3"/>
                        <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--primary)" stroke-width="3"
                            stroke-dasharray="${overall} ${100 - overall}" stroke-linecap="round"/>
                    </svg>
                    <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                        <div style="font-size:24px; font-weight:var(--fw-bold); color:var(--text);">${overall}%</div>
                        <div style="font-size:8px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary);">${{ en: 'Overall', ru: 'Всего', es: 'Total' }[lang]}</div>
                    </div>
                </div>
                <div class="badge badge--primary">${userLevel} · ${{ en: `${cefrPct}% complete`, ru: `${cefrPct}% пройдено`, es: `${cefrPct}% completado` }[lang]}</div>
            </div>

            <!-- Skill Bars -->
            <div style="padding: var(--sp-4) var(--sp-5);">
                <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:6px; font-size:var(--fs-sm);">
                    ${LangyIcons.barChart} ${{ en: 'Skill Breakdown', ru: 'Навыки по направлениям', es: 'Desglose de habilidades' }[lang]}
                </h4>
                <div style="display:flex; flex-direction:column; gap:var(--sp-3);">
                    ${dimensions.map(d => {
                        const val = skills[d.key] || 0;
                        return `
                        <div class="prog-skill" data-route="${d.route}" style="cursor:pointer;">
                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                                <div style="display:flex; align-items:center; gap:6px; font-size:var(--fs-xs);">
                                    <span style="color:${d.color};">${d.icon}</span>
                                    <span style="font-weight:var(--fw-semibold);">${d.label[lang]}</span>
                                </div>
                                <span style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:${d.color};">${val}%</span>
                            </div>
                            <div style="height:6px; background:rgba(128,128,128,0.1); border-radius:3px; overflow:hidden;">
                                <div style="height:100%; width:${val}%; background:${d.color}; border-radius:3px; transition:width 0.6s ease;"></div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <!-- Insights -->
            <div style="padding: 0 var(--sp-5) var(--sp-4); display:flex; gap:var(--sp-3);">
                <div class="card card--flat" style="flex:1; padding:var(--sp-3); border-left:3px solid ${strongest.color};">
                    <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${strongest.color}; margin-bottom:2px;">${LangyIcons.check} ${{ en: 'Strongest', ru: 'Лучший', es: 'Más fuerte' }[lang]}</div>
                    <div style="font-size:var(--fs-sm); font-weight:var(--fw-semibold);">${strongest.label[lang]}</div>
                    <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${skills[strongest.key] || 0}%</div>
                </div>
                <div class="card card--flat" style="flex:1; padding:var(--sp-3); border-left:3px solid ${weakest.color};">
                    <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${weakest.color}; margin-bottom:2px;">${LangyIcons.target} ${{ en: 'Focus Area', ru: 'Зона роста', es: 'Área de enfoque' }[lang]}</div>
                    <div style="font-size:var(--fs-sm); font-weight:var(--fw-semibold);">${weakest.label[lang]}</div>
                    <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">${skills[weakest.key] || 0}%</div>
                </div>
            </div>

            <!-- Recommended Next -->
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                ${typeof NextAction !== 'undefined' ? (() => {
                    const rec = NextAction.recommend(lang);
                    if (!rec) return '';
                    const reasonText = rec.reason[lang] || rec.reason.en;
                    const labelText = rec.label[lang] || rec.label.en;
                    const signalColors = { weak_spot: '#F59E0B', pending_homework: '#8B5CF6', weakest_skill: '#3B82F6', never_spoken: '#EF4444', stale_speaking: '#EF4444', low_recent_score: '#F59E0B', no_lessons_yet: '#3B82F6', vocab_review_due: '#F59E0B' };
                    const ac = signalColors[rec.signal] || 'var(--primary)';
                    return `<div class="card" style="padding:var(--sp-4); border:1px solid ${ac}22; background:${ac}08; cursor:pointer;" id="prog-recommend" data-route="${rec.route}" ${rec.meta?.tag ? 'data-focus-tag="' + rec.meta.tag + '"' : ''}>
                    <div style="display:flex; align-items:center; gap:var(--sp-3);">
                        <div style="width:40px; height:40px; border-radius:50%; background:${ac}11; display:flex; align-items:center; justify-content:center; font-size:18px;">${rec.icon}</div>
                        <div style="flex:1;">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${ac}; margin-bottom:2px;">${LangyIcons.zap} ${{ en: 'Recommended', ru: 'Рекомендация', es: 'Recomendado' }[lang]}</div>
                            <div style="font-size:var(--fs-sm); font-weight:var(--fw-semibold);">${labelText}</div>
                            <div style="font-size:10px; color:var(--text-tertiary); margin-top:2px; line-height:1.4;">${reasonText}</div>
                        </div>
                        <div style="color:var(--text-tertiary);">${LangyIcons.arrowRight}</div>
                    </div>
                </div>`;
                })() : `<div class="card" style="padding:var(--sp-4); border:1px solid rgba(59,130,246,0.15); background:rgba(59,130,246,0.03); cursor:pointer;" id="prog-recommend">
                    <div style="display:flex; align-items:center; gap:var(--sp-3);">
                        <div style="width:40px; height:40px; border-radius:50%; background:${weakest.color}11; display:flex; align-items:center; justify-content:center; color:${weakest.color}; font-size:18px;">${weakest.icon}</div>
                        <div style="flex:1;">
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:var(--primary); margin-bottom:2px;">${LangyIcons.zap} ${{ en: 'Recommended', ru: 'Рекомендация', es: 'Recomendado' }[lang]}</div>
                            <div style="font-size:var(--fs-sm); font-weight:var(--fw-semibold);">${{ en: 'Practice ' + weakest.label.en + ' to balance your skills', ru: 'Практикуйте ' + weakest.label.ru + ' для баланса навыков', es: 'Practica ' + weakest.label.es + ' para equilibrar tus habilidades' }[lang]}</div>
                        </div>
                        <div style="color:var(--text-tertiary);">${LangyIcons.arrowRight}</div>
                    </div>
                </div>`}
            </div>

            <!-- Activity Stats -->
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:6px; font-size:var(--fs-sm);">
                    ${activityIcon} ${{ en: 'Activity', ru: 'Активность', es: 'Actividad' }[lang]}
                </h4>
                <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--sp-2);">
                    <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                        <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:var(--primary);">${streakData.days}</div>
                        <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Streak', ru: 'Дни', es: 'Racha' }[lang]}</div>
                    </div>
                    <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                        <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:#F59E0B;">${streakData.wordsLearned}</div>
                        <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Words', ru: 'Слова', es: 'Palabras' }[lang]}</div>
                    </div>
                    <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                        <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:#3B82F6;">${Math.round(streakData.totalMinutes / 60)}h</div>
                        <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Study', ru: 'Учёба', es: 'Estudio' }[lang]}</div>
                    </div>
                    <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                        <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:#10B981;">${streakData.accuracy}%</div>
                        <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Accuracy', ru: 'Точность', es: 'Precisión' }[lang]}</div>
                    </div>
                </div>
            </div>

            <!-- Learning Objectives & Can-Do Statements -->
            ${(() => {
                if (typeof LangyCurriculum === 'undefined') return '';
                const tb = LangyCurriculum.getActive();
                if (!tb) return '';
                const canDo = tb.canDo || [];
                const objectives = tb.objectives || [];
                if (!canDo.length && !objectives.length) return '';

                // Estimate can-do completion from skill averages
                const avgSkill = overall;
                const canDoCompleted = Math.max(0, Math.round(canDo.length * (avgSkill / 100)));

                // Current unit for objective relevance
                const unitId = LangyState.progress?.currentUnitId || 1;
                const currentUnit = tb.units?.find(u => u.id === unitId);
                const unitGrammar = currentUnit?.grammar || [];

                // Mark objectives as relevant if they relate to current unit grammar
                const tagObjective = (obj) => {
                    const objLower = obj.toLowerCase();
                    return unitGrammar.some(g => objLower.includes(g.split(' ')[0].toLowerCase()));
                };

                return `
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:6px; font-size:var(--fs-sm);">
                    ${LangyIcons.target} ${{ en: 'Learning Objectives', ru: 'Учебные цели', es: 'Objetivos de aprendizaje' }[lang]}
                    <span class="badge" style="font-size:9px; margin-left:auto;">${tb.cefr}</span>
                </h4>

                <!-- Can-Do Outcomes -->
                ${canDo.length ? `
                <div class="card card--flat" style="padding:var(--sp-3); margin-bottom:var(--sp-3); border-left:3px solid #10B981;">
                    <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:#10B981; margin-bottom:var(--sp-2); display:flex; align-items:center; gap:4px;">
                        ${LangyIcons.check} ${{ en: 'I Can...', ru: 'Я могу...', es: 'Puedo...' }[lang]}
                        <span style="margin-left:auto; font-weight:var(--fw-bold);">${canDoCompleted}/${canDo.length}</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${canDo.map((s, i) => {
                            const done = i < canDoCompleted;
                            return `<div style="display:flex; align-items:flex-start; gap:8px; font-size:var(--fs-xs); line-height:1.5; ${done ? 'opacity:0.7;' : ''}">
                                <span style="flex-shrink:0; color:${done ? '#10B981' : 'var(--text-tertiary)'}; font-size:14px; line-height:1;">${done ? LangyIcons.check : '○'}</span>
                                <span style="${done ? 'text-decoration:line-through; color:var(--text-tertiary);' : 'color:var(--text-secondary);'}">${s}</span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>` : ''}

                <!-- Learning Objectives -->
                ${objectives.length ? `
                <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid #8B5CF6;">
                    <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:#8B5CF6; margin-bottom:var(--sp-2); display:flex; align-items:center; gap:4px;">
                        ${LangyIcons.bookOpen} ${{ en: 'Level Objectives', ru: 'Цели уровня', es: 'Objetivos del nivel' }[lang]}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        ${objectives.map(obj => {
                            const isCurrentFocus = tagObjective(obj);
                            return `<div style="display:flex; align-items:flex-start; gap:8px; font-size:var(--fs-xs); line-height:1.5;">
                                <span style="flex-shrink:0; color:${isCurrentFocus ? '#8B5CF6' : 'var(--text-tertiary)'}; font-size:14px; line-height:1;">${isCurrentFocus ? LangyIcons.target : '·'}</span>
                                <span style="color:var(--text-secondary); ${isCurrentFocus ? 'font-weight:var(--fw-semibold); color:#8B5CF6;' : ''}">${obj}${isCurrentFocus ? ` <span style="font-size:9px; padding:1px 5px; border-radius:var(--radius-full); background:rgba(139,92,246,0.08); color:#8B5CF6;">${{ en: 'current', ru: 'сейчас', es: 'actual' }[lang]}</span>` : ''}</span>
                            </div>`;
                        }).join('')}
                    </div>
                </div>` : ''}
            </div>`;
            })()}

            <!-- Recent Lessons -->
            ${recent.length ? `
            <div style="padding: 0 var(--sp-5) var(--sp-4);">
                <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:6px; font-size:var(--fs-sm);">
                    ${LangyIcons.clock} ${{ en: 'Recent Activity', ru: 'Последняя активность', es: 'Actividad reciente' }[lang]}
                </h4>
                <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
                    ${recent.map(r => {
                        const sc = r.score || 0;
                        const scColor = sc >= 80 ? 'var(--accent-dark)' : sc >= 50 ? '#F59E0B' : 'var(--danger)';
                        return `
                        <div class="card card--flat" style="padding:var(--sp-3); display:flex; align-items:center; gap:var(--sp-3);">
                            <div style="font-size:var(--fs-sm); font-weight:var(--fw-bold); color:${scColor}; min-width:36px;">${sc}%</div>
                            <div style="flex:1; min-width:0;">
                                <div style="font-size:var(--fs-xs); font-weight:var(--fw-semibold); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(r.title || r.unitId || 'Lesson')}</div>
                                <div style="font-size:9px; color:var(--text-tertiary);">${r.date || ''}</div>
                            </div>
                            ${r.grade ? `<div class="badge" style="font-size:9px;">${r.grade}</div>` : ''}
                        </div>`;
                    }).join('')}
                </div>
            </div>` : ''}

            <!-- Vocabulary Progress Section -->
            ${typeof VocabTracker !== 'undefined' ? (() => {
                const globalStats = VocabTracker.getGlobalStats();
                const recentWords = VocabTracker.getRecentWords(6);
                const weakWords = VocabTracker.getWeakestWords(4);
                const dueCount = globalStats.dueToday;

                // Get current level vocab stats
                let levelStats = null;
                if (typeof LangyCurriculum !== 'undefined') {
                    const tb = LangyCurriculum.getActive();
                    if (tb?.cefr) levelStats = VocabTracker.getLevelStats(tb.cefr);
                }

                // Get unit-by-unit breakdown for current level
                let unitBreakdown = '';
                if (typeof LangyCurriculum !== 'undefined' && typeof LangyVocabBank !== 'undefined') {
                    const tb = LangyCurriculum.getActive();
                    if (tb?.cefr && tb.units) {
                        const unitRows = tb.units.slice(0, LangyState.progress.currentUnitId).map(u => {
                            const us = VocabTracker.getUnitStats(tb.cefr, u.id);
                            if (us.total === 0) return '';
                            const pctBar = us.pct;
                            return `<div style="display:flex; align-items:center; gap:var(--sp-2); padding:4px 0;">
                                <div style="font-size:10px; color:var(--text-tertiary); min-width:36px;">U${u.id}</div>
                                <div style="flex:1; height:5px; background:rgba(128,128,128,0.1); border-radius:3px; overflow:hidden;">
                                    <div style="height:100%; width:${pctBar}%; background:${pctBar >= 80 ? '#10B981' : pctBar >= 40 ? '#F59E0B' : 'var(--text-tertiary)'}; border-radius:3px; transition:width 0.4s;"></div>
                                </div>
                                <div style="font-size:9px; color:var(--text-tertiary); min-width:32px; text-align:right;">${us.learned}/${us.total}</div>
                            </div>`;
                        }).filter(Boolean).join('');
                        if (unitRows) {
                            unitBreakdown = `<div style="margin-top:var(--sp-3);">${unitRows}</div>`;
                        }
                    }
                }

                return `
                <div style="padding: 0 var(--sp-5) var(--sp-4);">
                    <h4 style="margin-bottom:var(--sp-3); display:flex; align-items:center; gap:6px; font-size:var(--fs-sm);">
                        ${LangyIcons.brain} ${{ en: 'Vocabulary', ru: 'Словарный запас', es: 'Vocabulario' }[lang]}
                    </h4>

                    <!-- Global Vocab Stats -->
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:var(--sp-2); margin-bottom:var(--sp-3);">
                        <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                            <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:#F59E0B;">${globalStats.totalLearned}</div>
                            <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Learned', ru: 'Изучено', es: 'Aprendidas' }[lang]}</div>
                        </div>
                        <div class="card card--flat" style="padding:var(--sp-3); text-align:center;">
                            <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:#10B981;">${globalStats.totalMastered}</div>
                            <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'Mastered', ru: 'Освоено', es: 'Dominadas' }[lang]}</div>
                        </div>
                        <div class="card card--flat" style="padding:var(--sp-3); text-align:center; ${dueCount > 0 ? 'border:1px solid rgba(239,68,68,0.2);' : ''}">
                            <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:${dueCount > 0 ? 'var(--danger)' : 'var(--text-tertiary)'};">${dueCount}</div>
                            <div style="font-size:9px; color:var(--text-tertiary); text-transform:uppercase;">${{ en: 'To Review', ru: 'К повтору', es: 'Para repasar' }[lang]}</div>
                        </div>
                    </div>

                    ${levelStats ? `
                    <!-- Level Progress Bar -->
                    <div class="card card--flat" style="padding:var(--sp-3);">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--sp-1);">
                            <span style="font-size:var(--fs-xs); font-weight:var(--fw-semibold);">${userLevel} ${{ en: 'Level Vocabulary', ru: 'Словарь уровня', es: 'Vocabulario del nivel' }[lang]}</span>
                            <span style="font-size:10px; color:var(--text-tertiary);">${levelStats.learned}/${levelStats.total}</span>
                        </div>
                        <div style="height:6px; background:rgba(128,128,128,0.1); border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${levelStats.pct}%; background:linear-gradient(90deg, #F59E0B, #10B981); border-radius:3px; transition:width 0.6s;"></div>
                        </div>
                        <div style="font-size:9px; color:var(--text-tertiary); margin-top:4px;">${levelStats.pct}% ${{ en: 'of level vocabulary learned', ru: 'словаря уровня изучено', es: 'del vocabulario del nivel aprendido' }[lang]}</div>
                        ${unitBreakdown}
                    </div>
                    ` : ''}

                    ${recentWords.length > 0 ? `
                    <!-- Recent Words -->
                    <div style="margin-top:var(--sp-3);">
                        <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:var(--sp-2);">${{ en: 'Recently Studied', ru: 'Недавно изучено', es: 'Recientemente estudiado' }[lang]}</div>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${recentWords.map(w => `<span style="font-size:10px; padding:3px 8px; border-radius:var(--radius-full); background:${VocabTracker.masteryColor(w.mastery)}12; color:${VocabTracker.masteryColor(w.mastery)}; border:1px solid ${VocabTracker.masteryColor(w.mastery)}20;" title="${w.ru || ''}: ${VocabTracker.masteryLabel(w.mastery, lang)}">${VocabTracker.masteryIcon(w.mastery)} ${w.en}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${weakWords.length > 0 ? `
                    <!-- Weak Words -->
                    <div style="margin-top:var(--sp-3);">
                        <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:var(--danger); margin-bottom:var(--sp-2); display:flex; align-items:center; gap:4px;">${LangyIcons.alertTriangle} ${{ en: 'Needs Practice', ru: 'Нужна практика', es: 'Necesita práctica' }[lang]}</div>
                        <div style="display:flex; flex-wrap:wrap; gap:4px;">
                            ${weakWords.map(w => {
                                const acc = w.attempts > 0 ? Math.round((w.correct / w.attempts) * 100) : 0;
                                return `<span style="font-size:10px; padding:3px 8px; border-radius:var(--radius-full); background:rgba(239,68,68,0.08); color:var(--danger); border:1px solid rgba(239,68,68,0.15);" title="${w.ru || ''} — ${acc}% accuracy">${w.en} (${acc}%)</span>`;
                            }).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>`;
            })() : ''}
        </div>
    `;

    // Event listeners
    container.querySelector('#prog-back')?.addEventListener('click', () => Router.navigate('home'));
    container.querySelectorAll('.prog-skill').forEach(el => {
        el.addEventListener('click', () => Router.navigate(el.dataset.route));
    });
    container.querySelector('#prog-recommend')?.addEventListener('click', () => {
        const el = container.querySelector('#prog-recommend');
        const focusTag = el?.dataset.focusTag;
        const route = el?.dataset.route || weakest.route;
        if (focusTag && typeof CoachIntel !== 'undefined') {
            CoachIntel.launchFocusPractice(focusTag);
        } else {
            Router.navigate(route);
        }
    });

    setTimeout(() => Anim.staggerChildren(container, '.prog-skill'), 80);
}

Router.register('progress', renderProgress);
