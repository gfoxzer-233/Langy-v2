/* ============================================
   SCREEN: PROFILE & SETTINGS
   ============================================ */

function buildCefrBadges() {
    const badges = LangyState.progress.cefrBadges || {};
    const levels = [
        { code: 'A1', name: 'Beginner', color: '#10B981' },
        { code: 'A2', name: 'Elementary', color: '#34D399' },
        { code: 'B1', name: 'Intermediate', color: '#3B82F6' },
        { code: 'B2', name: 'Upper-Int.', color: '#8B5CF6' },
        { code: 'C1', name: 'Advanced', color: '#F59E0B' },
        { code: 'C2', name: 'Proficiency', color: '#EF4444' },
    ];

    const currentLevel = LangyState.settings.languageLevel || 'A1';

    return levels
        .map(lv => {
            const badge = badges[lv.code];
            const isEarned = badge && badge.earned;
            const isActive = lv.code === currentLevel && !isEarned;
            const stateClass = isEarned ? 'cefr-badge--earned' : isActive ? 'cefr-badge--active' : 'cefr-badge--locked';

            // Calculate progress for active level
            let progressPct = 0;
            if (isActive && typeof LangyCurriculum !== 'undefined') {
                const tb = LangyCurriculum.getByLevel(lv.code);
                if (tb) {
                    const mastery = LangyState.progress.mastery;
                    const passed = tb.units.filter(u => {
                        const key = tb.id + ':' + u.id;
                        return mastery[key] && mastery[key].passed;
                    }).length;
                    progressPct = Math.round((passed / tb.units.length) * 100);
                }
            }

            return `
            <div class="cefr-badge ${stateClass}" style="--badge-color: ${lv.color}; ${isEarned ? 'cursor:pointer;' : ''}" data-code="${lv.code}" data-earned="${isEarned}" data-name="${lv.name}" data-color="${lv.color}" data-date="${(badge && badge.date) || ''}">
                <div class="cefr-badge__level">${lv.code}</div>
                <div class="cefr-badge__icon">${isEarned ? LangyIcons.medal : isActive ? LangyIcons.unlock : LangyIcons.lock}</div>
                <div class="cefr-badge__name">${lv.name}</div>
                ${isEarned ? `<div class="cefr-badge__date">${badge.date || ''}</div>` : ''}
                ${isActive ? `<div class="cefr-badge__progress">${progressPct}%</div>` : ''}
            </div>
        `;
        })
        .join('');
}

function buildAchievements() {
    const { streakData, dailyChallenge } = LangyState;
    const days = streakData?.days || 0;
    const words = streakData?.wordsLearned || 0;
    const perfectDate = dailyChallenge?._perfectLessonDate;

    const achievements = [
        {
            id: 'early_bird',
            title: 'Early Bird',
            desc: 'Study before 8 AM',
            icon: LangyIcons.sunrise,
            unlocked: true,
        },
        {
            id: 'unstoppable',
            title: 'Unstoppable',
            desc: '7 Day Streak',
            icon: LangyIcons.flame,
            unlocked: days >= 7,
        },
        {
            id: 'vocab_master',
            title: 'Vocab Master',
            desc: '50 Words',
            icon: LangyIcons.brain,
            unlocked: words >= 50,
        },
        {
            id: 'perfectionist',
            title: 'Perfectionist',
            desc: '100% Lesson',
            icon: LangyIcons.target,
            unlocked: perfectDate !== null && perfectDate !== undefined,
        },
    ];

    return achievements
        .map(
            ach => `
        <div class="achievement-card ${!ach.unlocked ? 'achievement-card--locked' : ''}">
            <div class="achievement-card__icon">${ach.icon}</div>
            <div class="achievement-card__title">${ach.title}</div>
            <div class="achievement-card__desc">${ach.desc}</div>
        </div>
    `
        )
        .join('');
}

function renderProfileStudyLanguageSwitcher() {
    const current = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
    const languages = [
        { code: 'en', flag: '🇬🇧', label: 'English' },
        { code: 'es', flag: '🇪🇸', label: 'Español' },
        { code: 'ar', flag: '🇸🇦', label: 'العربية', dir: 'rtl' },
    ];

    return `
        <div class="profile-study-language" role="group" aria-label="Study language">
            ${languages.map(item => `
                <button type="button"
                        class="profile-study-language__btn ${current === item.code ? 'profile-study-language__btn--active' : ''}"
                        data-profile-language="${item.code}"
                        dir="${item.dir || 'ltr'}"
                        aria-pressed="${current === item.code}">
                    <span>${item.flag}</span>
                    <span>${item.label}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function renderProfile(container) {
    const { user, settings, streakData, currencies } = LangyState;

    container.innerHTML = `
        <div class="screen screen--no-pad profile">
            <!-- Header -->
            <div class="profile__header">
                <div class="nav-header__back" id="profile-back" style="position:absolute; top:var(--sp-4); left:var(--sp-4); background:rgba(255,255,255,0.15); border:none; color:white;">${LangyIcons.back}</div>

                <div class="profile__avatar-large" id="prof-avatar" title="Tap to change">${user.avatar}</div>
                <div class="profile__name">${user.name}</div>
                <div class="profile__level" style="margin-bottom:var(--sp-1);">${user.level}</div>
                
                <!-- XP Progress Bar -->
                <div class="profile__xp-container">
                    <div class="profile__xp-fill" style="width: ${((user.xp % 500) / 500) * 100}%;"></div>
                </div>
                <div style="font-size:10px; opacity:0.8; margin-bottom:var(--sp-2);">Level ${Math.floor(user.xp / 500) + 1} · ${user.xp % 500} / 500 XP</div>

                <div class="profile__stats-row">
                    <div class="profile__stat">
                        <div class="profile__stat-value">${streakData.days}</div>
                        <div class="profile__stat-label">Streak</div>
                    </div>
                    <div class="profile__stat">
                        <div class="profile__stat-value">${streakData.wordsLearned}</div>
                        <div class="profile__stat-label">Words</div>
                    </div>
                    <div class="profile__stat">
                        <div class="profile__stat-value">${Math.round(streakData.totalMinutes / 60)}h</div>
                        <div class="profile__stat-label">Study Time</div>
                    </div>
                    <div class="profile__stat">
                        <div class="profile__stat-value">${streakData.accuracy}%</div>
                        <div class="profile__stat-label">Accuracy</div>
                    </div>
                </div>
            </div>

            <!-- Coach Banner -->
            ${(() => {
                const _isCoach = ['coach', 'pro', 'premium'].includes(LangyState.subscription?.plan);
                if (_isCoach) return '';
                const _sc = (LangyState.talkHistory || []).length;
                const _mistakes = LangyState.coachData?.mistakePatterns?.length || 0;
                const _lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
                const _isEnglish = typeof LangyTarget !== 'undefined' && LangyTarget.getCode() === 'en';
                const _tb = typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.getActive() : null;
                // Outcome-driven subtitle based on user context + English curriculum
                let _sub;
                if (_isEnglish && _tb?.cefr && _sc >= 3) {
                    const _unitGrammar = _tb.units?.find(u => u.id === (LangyState.progress?.currentUnitId || 1))?.grammar?.join(', ') || '';
                    _sub = { en: `${_tb.cefr} learner, ${_sc} sessions. Coach would track your ${_unitGrammar || 'grammar'} across every activity and build targeted review.`, ru: `${_tb.cefr}, ${_sc} сессий. Coach отслеживал бы ${_unitGrammar || 'грамматику'} во всех активностях.`, es: `${_tb.cefr}, ${_sc} sesiones. Coach rastrearía ${_unitGrammar || 'gramática'} en todas tus actividades.` }[_lang];
                } else if (_isEnglish && _tb?.cefr) {
                    _sub = { en: `Working on ${_tb.cefr}. Coach connects your grammar, vocabulary, and conversation into one path.`, ru: `Уровень ${_tb.cefr}. Coach связывает грамматику, словарь и разговоры в единый путь.`, es: `Nivel ${_tb.cefr}. Coach conecta tu gramática, vocabulario y conversación en un solo camino.` }[_lang];
                } else if (_sc >= 5 && _mistakes > 0) {
                    _sub = { en: `${_sc} sessions done. Coach would track your ${_mistakes} recurring patterns and build practice around them.`, ru: `${_sc} сессий. Coach отслеживал бы ${_mistakes} повторяющихся паттернов и строил практику.`, es: `${_sc} sesiones hechas. Coach rastrearía tus ${_mistakes} patrones recurrentes.` }[_lang];
                } else if (_sc >= 3) {
                    _sub = { en: `${_sc} conversations and counting. Coach would make each one smarter than the last.`, ru: `${_sc} разговоров. Coach сделал бы каждый следующий умнее предыдущего.`, es: `${_sc} conversaciones. Coach haría cada una más inteligente que la anterior.` }[_lang];
                } else {
                    _sub = { en: 'Deeper feedback, pattern tracking, faster results.', ru: 'Глубокий фидбэк, отслеживание паттернов, быстрый результат.', es: 'Feedback profundo, seguimiento de patrones, resultados más rápidos.' }[_lang];
                }
                return `
            <div class="profile__premium-banner" id="prof-premium-banner">
                <div>
                    <h3 style="margin:0; font-size:var(--fs-lg);">Langy Coach ${LangyIcons.brain}</h3>
                    <p style="margin:0; font-size:var(--fs-xs); opacity:0.9;">${_sub}</p>
                </div>
                <button class="btn" style="background:white; color:#b45309; padding:4px 12px; font-weight:var(--fw-bold); border-radius:var(--radius-full);">${{ en: 'Learn more', ru: 'Подробнее', es: 'Más info' }[_lang]}</button>
            </div>`;
            })()}

            ${(() => {
                const _lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
                return typeof CoachIntel !== 'undefined' ? CoachIntel.renderCoachNotes(_lang) : '';
            })()}

            <!-- Settings Sections -->
            <div class="profile__sections">

                <!-- My Progress -->
                <div class="profile__section">
                    <div class="profile__option" id="prof-progress" style="cursor:pointer;">
                        <div class="profile__option-icon" style="background:rgba(16,185,129,0.1); color:#10B981;">${LangyIcons.barChart}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${{ en: 'My Progress', ru: 'Мой прогресс', es: 'Mi progreso' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                            <div class="profile__option-desc">${{ en: 'Skills, activity & growth', ru: 'Навыки, активность и рост', es: 'Habilidades, actividad y crecimiento' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                </div>

                <!-- Vocabulary Mastery -->
                ${(() => {
                    if (typeof VocabMastery === 'undefined') return '';
                    const langCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
                    const cefr = settings.languageLevel || 'A1';
                    const card = VocabMastery.getProfileCard(langCode, cefr);
                    if (card.total === 0 && card.bankSize === 0) return '';
                    const barPct = Math.min(card.pct, 100);
                    return `
                <div class="profile__section">
                    <div class="profile__section-title">${LangyIcons.bookOpen} ${{ en: 'Vocabulary', ru: 'Словарь', es: 'Vocabulario' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                    <div style="background:var(--bg-card); border-radius:var(--radius-xl); padding:var(--sp-4); box-shadow:var(--shadow-sm);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:var(--sp-3);">
                            <div style="text-align:center; flex:1;">
                                <div style="font-size:var(--fs-xl); font-weight:var(--fw-black); color:#f59e0b;">${card.known}</div>
                                <div style="font-size:10px; color:var(--text-tertiary);">✅ ${{ en: 'Solid', ru: 'Уверенно', es: 'Sólido' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                            </div>
                            <div style="text-align:center; flex:1;">
                                <div style="font-size:var(--fs-xl); font-weight:var(--fw-black); color:#3b82f6;">${card.practicing}</div>
                                <div style="font-size:10px; color:var(--text-tertiary);">🔄 ${{ en: 'Practicing', ru: 'Практика', es: 'Practicando' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                            </div>
                            <div style="text-align:center; flex:1;">
                                <div style="font-size:var(--fs-xl); font-weight:var(--fw-black); color:#9ca3af;">${card.seen}</div>
                                <div style="font-size:10px; color:var(--text-tertiary);">👁 ${{ en: 'Seen', ru: 'Видел', es: 'Visto' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>
                            </div>
                        </div>
                        <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:var(--sp-1);">${card.total} / ${card.bankSize}</div>
                        <div style="height:6px; background:var(--bg-alt); border-radius:3px; overflow:hidden;">
                            <div style="height:100%; width:${barPct}%; background:linear-gradient(90deg,#10B981,#34D399); border-radius:3px; transition:width 0.4s;"></div>
                        </div>
                        <div style="font-size:10px; color:var(--text-tertiary); margin-top:var(--sp-1); text-align:right;">${barPct}%</div>
                    </div>
                </div>`;
                })()}

                <!-- Mini Achievements -->
                <div class="profile__section">
                    <div class="profile__section-title">${LangyIcons.sparkles} ${i18n('profile.achievements')}</div>
                    <div class="achievements-row">
                        ${buildAchievements()}
                    </div>
                </div>

                <!-- CEFR Certificates -->
                <div class="profile__section">
                    <div class="profile__section-title">${LangyIcons.trophy} ${i18n('profile.certificates')}</div>
                    <div class="cefr-badges">
                        ${buildCefrBadges()}
                    </div>
                </div>
                <!-- Account -->
                <div class="profile__section">
                    <div class="profile__section-title">${i18n('profile.account')}</div>
                    <div class="profile__option" id="prof-edit">
                        <div class="profile__option-icon" style="background:var(--primary-bg); color:var(--primary);">${LangyIcons.user}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.edit')}</div>
                            <div class="profile__option-desc">${i18n('profile.edit_desc')}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                    <div class="profile__option" id="prof-level">
                        <div class="profile__option-icon" style="background:var(--accent-bg); color:var(--accent-dark);">${LangyIcons.barChart}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.language_level')}</div>
                            <div class="profile__option-desc">${settings.languageLevel}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="profile__section">
                    <div class="profile__section-title">${i18n('profile.preferences')}</div>

                    <div class="profile__option" id="prof-theme">
                        <div class="profile__option-icon" style="background:rgba(99,102,241,0.1); color:#6366F1;">${settings.darkMode ? LangyIcons.moon : LangyIcons.sun}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${settings.darkMode ? i18n('profile.dark_mode') : i18n('profile.light_mode')}</div>
                            <div class="profile__option-desc">${i18n('profile.current_theme')}</div>
                        </div>
                        <div class="toggle ${settings.darkMode ? 'toggle--active' : ''}" id="toggle-dark"></div>
                    </div>

                    <div class="profile__option" id="prof-notif">
                        <div class="profile__option-icon" style="background:rgba(239,68,68,0.1); color:#EF4444;">${LangyIcons.bell}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.notifications')}</div>
                            <div class="profile__option-desc">${i18n('profile.reminder')}</div>
                        </div>
                        <div class="toggle ${settings.notifications ? 'toggle--active' : ''}" id="toggle-notif"></div>
                    </div>

                    <div class="profile__option" id="prof-sound">
                        <div class="profile__option-icon" style="background:rgba(245,158,11,0.1); color:#F59E0B;">${LangyIcons.volume}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.sound')}</div>
                            <div class="profile__option-desc">${i18n('profile.sounds_desc')}</div>
                        </div>
                        <div class="toggle ${settings.sound ? 'toggle--active' : ''}" id="toggle-sound"></div>
                    </div>

                    <div class="profile__option" id="prof-haptics">
                        <div class="profile__option-icon" style="background:rgba(74,222,128,0.1); color:#22C55E;">${LangyIcons.vibrate}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.haptics')}</div>
                            <div class="profile__option-desc">${i18n('profile.haptics_desc')}</div>
                        </div>
                        <div class="toggle ${settings.haptics ? 'toggle--active' : ''}" id="toggle-haptics"></div>
                    </div>

                    <div class="profile__option" id="prof-lang">
                        <div class="profile__option-icon" style="background:rgba(6,182,212,0.1); color:#06B6D4;">${LangyIcons.globe}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.language')}</div>
                            <div class="profile__option-desc">${(typeof LangyI18n !== 'undefined' ? LangyI18n.languages.find(l => l.code === LangyI18n.currentLang)?.name : 'English') || 'English'}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                    ${renderProfileStudyLanguageSwitcher()}
                </div>

                <!-- Learning -->
                <div class="profile__section">
                    <div class="profile__section-title">${i18n('profile.learning')}</div>
                    <div class="profile__option" id="prof-goals">
                        <div class="profile__option-icon" style="background:var(--primary-bg); color:var(--primary);">${LangyIcons.target}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.daily_goal')}</div>
                            <div class="profile__option-desc">${i18n('profile.daily_goal_desc')}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                    <div class="profile__option" id="prof-reminder">
                        <div class="profile__option-icon" style="background:rgba(59,130,246,0.1); color:#3B82F6;">${LangyIcons.clock}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.reminder')}</div>
                            <div class="profile__option-desc">${settings.dailyReminder}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                </div>

                <!-- Support -->
                <div class="profile__section">
                    <div class="profile__section-title">${i18n('profile.support')}</div>
                    <div class="profile__option" id="prof-help">
                        <div class="profile__option-icon" style="background:rgba(59,130,246,0.1); color:#3B82F6;">${LangyIcons.helpCircle}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">Help & FAQ</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                    <div class="profile__option" id="prof-feedback">
                        <div class="profile__option-icon" style="background:rgba(74,222,128,0.1); color:#22C55E;">${LangyIcons.messageCircle}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.feedback')}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                    <div class="profile__option" id="prof-about">
                        <div class="profile__option-icon" style="background:rgba(156,163,175,0.1); color:#6B7280;">${LangyIcons.info}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">About Langy</div>
                            <div class="profile__option-desc">Version 2.2.0</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                </div>

                <!-- Community -->
                <div class="profile__section">
                    <div class="profile__section-title">${i18n('profile.community')}</div>
                    <div class="profile__option" id="prof-invite">
                        <div class="profile__option-icon" style="background:rgba(236,72,153,0.1); color:#EC4899;">${LangyIcons.gift}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${i18n('profile.invite')}</div>
                            <div class="profile__option-desc">${i18n('profile.invite_desc')}</div>
                        </div>
                        <div class="profile__option-arrow">${LangyIcons.arrow}</div>
                    </div>
                </div>

                <!-- Danger Zone -->
                <div class="profile__section">
                    <div class="profile__option" id="prof-logout">
                        <div class="profile__option-icon" style="background:var(--danger-bg); color:var(--danger);">${LangyIcons.logout}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label" style="color:var(--danger);">${i18n('profile.logout')}</div>
                        </div>
                    </div>
                </div>

                <div style="height: var(--sp-8);"></div>
            </div>
        </div>
    `;

    // Back
    container.querySelector('#profile-back')?.addEventListener('click', () => Router.navigate('home'));
    container.querySelector('#prof-progress')?.addEventListener('click', () => Router.navigate('progress'));

    container.querySelectorAll('[data-profile-language]').forEach(button => {
        button.addEventListener('click', () => {
            const code = button.dataset.profileLanguage;
            if (!code || typeof LangyTarget === 'undefined' || !LangyTarget.isSupported(code)) return;
            if (code === LangyTarget.getCode()) return;
            const ok = LangyTarget.set(code);
            if (!ok) return;
            if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
            Anim.showToast(`${button.textContent.trim()} course loaded`);
            renderProfile(container);
        });
    });

    // Toggles
    function setupToggle(id, key) {
        container.querySelector(`#${id}`)?.addEventListener('click', () => {
            settings[key] = !settings[key];
            if (key === 'darkMode') {
                toggleDarkMode(settings.darkMode);
                Anim.showToast(`Theme changed to ${settings.darkMode ? 'Dark' : 'White'} Mode`);
            } else {
                const labels = { notifications: 'Notifications', sound: 'Sound Effects', haptics: 'Haptic Feedback' };
                Anim.showToast(`${labels[key] || key} ${settings[key] ? 'enabled' : 'disabled'}`);
            }
            if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
            renderProfile(container);
        });
    }

    setupToggle('prof-theme', 'darkMode');
    setupToggle('prof-notif', 'notifications');
    setupToggle('prof-sound', 'sound');
    setupToggle('prof-haptics', 'haptics');

    // Navigation / Modals
    container.querySelector('#prof-premium-banner')?.addEventListener('click', () => {
        if (typeof showSubscription === 'function') {
            showSubscription();
        } else {
            Anim.showToast('Premium Plans coming soon!');
        }
    });

    // Coach: wire 'Practice this now' from Coach Notes
    container.querySelector('#coach-practice-profile')?.addEventListener('click', () => {
        if (typeof CoachIntel !== 'undefined') {
            const _lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
            const focus = CoachIntel.recommendedFocus(_lang);
            if (focus) CoachIntel.launchFocusPractice(focus.tag);
        }
    });

    // Avatar interaction → open avatar picker
    const avatarEl = container.querySelector('#prof-avatar');
    if (avatarEl) {
        avatarEl.addEventListener('click', () => {
            showAvatarPicker();
        });
    }

    container.querySelector('#prof-logout')?.addEventListener('click', async () => {
        if (typeof LangyDB !== 'undefined') {
            try {
                await LangyDB.logout();
            } catch (e) {}
        }
        Anim.showToast(`Logged out. See you soon! ${LangyIcons.messageCircle}`);
        setTimeout(() => Router.navigate('auth'), 800);
    });

    container.querySelector('#prof-invite')?.addEventListener('click', () => {
        const inviteLink = `https://langy.app/invite/${LangyState?.user?.name?.toLowerCase().replace(/\s+/g, '') || 'friend'}-${Math.floor(1000 + Math.random() * 9000)}`;
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                Anim.showToast(`Invite link copied: ${inviteLink} ${LangyIcons.clipboard}`);
            })
            .catch(() => {
                Anim.showToast(`Invite link: ${inviteLink}`);
            });
    });

    container.querySelector('#prof-level')?.addEventListener('click', () => showLevelPicker());
    container.querySelector('#prof-edit')?.addEventListener('click', () => showEditProfile());
    container.querySelector('#prof-reminder')?.addEventListener('click', () => showReminderPicker());

    container.querySelector('#prof-goals')?.addEventListener('click', () => showGoalsPicker());
    container.querySelector('#prof-lang')?.addEventListener('click', () => showLanguagePicker(container));
    container.querySelector('#prof-help')?.addEventListener('click', () => showHelp());
    container.querySelector('#prof-feedback')?.addEventListener('click', () => showFeedback());
    container.querySelector('#prof-about')?.addEventListener('click', () => showAbout());

    // ── CEFR Badge Click → Certificate ──
    container.querySelectorAll('.cefr-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const earned = badge.dataset.earned === 'true';
            const code = badge.dataset.code;
            const name = badge.dataset.name;
            const color = badge.dataset.color;
            const date = badge.dataset.date;
            if (earned) {
                showCertificate(code, name, color, date);
            } else {
                Anim.showToast(`${LangyIcons.lock} Complete ${code} to unlock this certificate!`);
            }
        });
    });

    setTimeout(() => Anim.staggerChildren(container, '.profile__option'), 40);
}

function toggleDarkMode(isDark) {
    const root = document.documentElement;
    localStorage.setItem('langy_theme', isDark ? 'dark' : 'light');
    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

function showLevelPicker() {
    const levels = [
        'A1 Beginner',
        'A2 Elementary',
        'B1 Intermediate',
        'B2 Upper-Intermediate',
        'C1 Advanced',
        'C2 Proficient',
    ];
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Select Your Level</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
                ${levels
                    .map(
                        level => `
                    <div class="profile__option" data-level="${level}" style="background:${LangyState.settings.languageLevel === level.split(' ')[0] ? 'var(--primary-bg)' : 'transparent'}; border-radius:var(--radius-lg); cursor:pointer;">
                        <div class="lang-option" data-level="${level.split(' ')[0]}">
                    <span>${level}</span>
                    ${LangyState.settings.languageLevel === level.split(' ')[0] ? `<span style="color:var(--primary); display:flex; align-items:center; gap:4px;">${LangyIcons.check}</span>` : ''}
                </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.querySelectorAll('[data-level]').forEach(el => {
        el.addEventListener('click', () => {
            const cefrCode = el.dataset.level.split(' ')[0]; // e.g. "B2"
            LangyState.settings.languageLevel = cefrCode;

            // Switch the active textbook to match
            if (typeof LangyCurriculum !== 'undefined') {
                LangyCurriculum.selectTextbookByLevel(cefrCode);
            }

            // Persist
            if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});

            overlay.remove();
            Anim.showToast(`Level set to ${el.dataset.level}`);
            renderProfile(document.getElementById('screen-container'));
        });
    });
}

function showAvatarPicker() {
    const avatars = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'K',
        'L',
        'M',
        'N',
        'P',
        'R',
        'S',
        'T',
        'V',
        'W',
        'X',
        'Z',
        '1',
        '7',
        '42',
        'AI',
        'EN',
        'OK',
        'GO',
        'YO',
        'LG',
        'QA',
    ];
    const colors = [
        { bg: 'linear-gradient(135deg, #10B981, #059669)', label: 'Emerald' },
        { bg: 'linear-gradient(135deg, #6366F1, #4F46E5)', label: 'Indigo' },
        { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', label: 'Pink' },
        { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', label: 'Amber' },
        { bg: 'linear-gradient(135deg, #3B82F6, #2563EB)', label: 'Blue' },
        { bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', label: 'Violet' },
        { bg: 'linear-gradient(135deg, #EF4444, #DC2626)', label: 'Red' },
        { bg: 'linear-gradient(135deg, #14B8A6, #0D9488)', label: 'Teal' },
    ];

    const currentAvatar = LangyState.user.avatar || '🦊';
    let selectedEmoji = currentAvatar;

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6); max-height: 85vh; overflow-y: auto;">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Choose Avatar</h3>

            <!-- Preview -->
            <div style="display:flex; justify-content:center; margin-bottom:var(--sp-4);">
                <div id="avatar-preview" style="width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:40px; background:var(--primary); box-shadow: 0 6px 20px rgba(16,185,129,0.3); transition: all 0.3s;">${currentAvatar}</div>
            </div>

            <!-- Emoji Grid -->
            <p style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:var(--sp-2);">SELECT EMOJI</p>
            <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:var(--sp-2); margin-bottom:var(--sp-4);">
                ${avatars
                    .map(
                        e => `
                    <div class="avatar-emoji-pick" data-emoji="${e}" style="
                        width:44px; height:44px; border-radius:var(--radius-lg);
                        display:flex; align-items:center; justify-content:center;
                        font-size:24px; cursor:pointer; transition: all 0.2s;
                        background:${e === currentAvatar ? 'var(--primary-bg)' : 'var(--bg-card)'};
                        border: 2px solid ${e === currentAvatar ? 'var(--primary)' : 'transparent'};
                    ">${e}</div>
                `
                    )
                    .join('')}
            </div>

            <!-- Or use initial letter -->
            <p style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:var(--sp-2);">OR USE YOUR INITIAL</p>
            <div style="display:flex; gap:var(--sp-2); flex-wrap:wrap; margin-bottom:var(--sp-4);">
                ${colors
                    .map(
                        c => `
                    <div class="avatar-letter-pick" data-letter="${(LangyState.user.name || 'U')[0].toUpperCase()}" data-bg="${c.bg}" style="
                        width:44px; height:44px; border-radius:50%;
                        display:flex; align-items:center; justify-content:center;
                        font-size:18px; font-weight:900; cursor:pointer; transition: all 0.2s;
                        background:${c.bg}; color:white;
                        border: 2px solid transparent;
                    ">${(LangyState.user.name || 'U')[0].toUpperCase()}</div>
                `
                    )
                    .join('')}
            </div>

            <button class="btn btn--primary btn--full" id="save-avatar">Save Avatar</button>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    // Emoji selection
    overlay.querySelectorAll('.avatar-emoji-pick').forEach(el => {
        el.addEventListener('click', () => {
            selectedEmoji = el.dataset.emoji;
            overlay.querySelector('#avatar-preview').textContent = selectedEmoji;
            overlay.querySelector('#avatar-preview').style.fontSize = '40px';
            overlay.querySelectorAll('.avatar-emoji-pick').forEach(e => {
                e.style.background = 'var(--bg-card)';
                e.style.borderColor = 'transparent';
            });
            el.style.background = 'var(--primary-bg)';
            el.style.borderColor = 'var(--primary)';
            // Reset letter selections
            overlay.querySelectorAll('.avatar-letter-pick').forEach(e => (e.style.borderColor = 'transparent'));
        });
    });

    // Letter selection
    overlay.querySelectorAll('.avatar-letter-pick').forEach(el => {
        el.addEventListener('click', () => {
            selectedEmoji = el.dataset.letter;
            const preview = overlay.querySelector('#avatar-preview');
            preview.textContent = selectedEmoji;
            preview.style.background = el.dataset.bg;
            preview.style.fontSize = '32px';
            overlay.querySelectorAll('.avatar-letter-pick').forEach(e => (e.style.borderColor = 'transparent'));
            el.style.borderColor = 'white';
            // Reset emoji selections
            overlay.querySelectorAll('.avatar-emoji-pick').forEach(e => {
                e.style.background = 'var(--bg-card)';
                e.style.borderColor = 'transparent';
            });
        });
    });

    overlay.querySelector('#save-avatar')?.addEventListener('click', () => {
        LangyState.user.avatar = selectedEmoji;
        overlay.remove();
        Anim.showToast('Avatar updated!');
        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
        const container = document.getElementById('screen-container');
        if (container) renderProfile(container);
    });
}

function showEditProfile() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Edit Profile</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-4);">
                <!-- Avatar quick-change -->
                <div style="display:flex; align-items:center; gap:var(--sp-4);">
                    <div id="edit-avatar-btn" style="width:56px; height:56px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; flex-shrink:0; box-shadow:0 4px 12px rgba(16,185,129,0.2);">${LangyState.user.avatar}</div>
                    <div>
                        <div style="font-weight:var(--fw-bold);">Profile Photo</div>
                        <div style="font-size:var(--fs-xs); color:var(--primary); cursor:pointer;" id="change-avatar-link">Change avatar ${LangyIcons.arrow}</div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Nickname</label>
                    <input type="text" id="edit-name" class="input" value="${LangyState.user.name}">
                </div>
                <div class="input-group">
                    <label>Email Address</label>
                    <input type="email" id="edit-email" class="input" value="${LangyState.user.email}">
                </div>
                <button class="btn btn--primary btn--full" id="save-profile" style="margin-top:var(--sp-2);">Save Changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    // Open avatar picker from edit profile
    const avatarTriggers = [overlay.querySelector('#edit-avatar-btn'), overlay.querySelector('#change-avatar-link')];
    avatarTriggers.forEach(el => {
        el?.addEventListener('click', () => {
            overlay.remove();
            showAvatarPicker();
        });
    });

    overlay.querySelector('#save-profile').addEventListener('click', async () => {
        const newName = overlay.querySelector('#edit-name').value;
        const newEmail = overlay.querySelector('#edit-email').value;
        if (newName) LangyState.user.name = newName;
        if (newEmail) LangyState.user.email = newEmail;
        overlay.remove();
        Anim.showToast('Profile updated!');
        if (typeof LangyDB !== 'undefined') {
            LangyDB.saveProgress().catch(() => {});
            // Also update the users store so changes persist across logins
            LangyDB.updateUserRecord({ name: newName, email: newEmail }).catch(() => {});
        }
        if (typeof renderProfile === 'function') {
            const container = document.getElementById('screen-container');
            if (container) renderProfile(container);
        }
    });
}

function showReminderPicker() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Set Daily Reminder</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-4);">
                <p style="color:var(--text-secondary); font-size:var(--fs-sm);">When should we remind you to practice?</p>
                <div class="input-group">
                    <input type="time" id="edit-time" class="input" value="${LangyState.settings.dailyReminder}">
                </div>
                <button class="btn btn--primary btn--full" id="save-reminder" style="margin-top:var(--sp-2);">Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.querySelector('#save-reminder').addEventListener('click', () => {
        const newTime = overlay.querySelector('#edit-time').value;
        if (newTime) LangyState.settings.dailyReminder = newTime;
        overlay.remove();
        Anim.showToast('Reminder set for ' + newTime);
        if (typeof renderProfile === 'function') {
            const container = document.getElementById('screen-container');
            if (container) renderProfile(container);
        }
    });
}

function showGoalsPicker() {
    const goals = [
        { label: 'Relaxed', time: '5 min/day', icon: LangyIcons.info },
        { label: 'Normal', time: '15 min/day', icon: LangyIcons.user },
        { label: 'Serious', time: '30 min/day', icon: LangyIcons.zap },
        { label: 'Intense', time: '60 min/day', icon: LangyIcons.fire },
    ];
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Select Daily Goal</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-2);">
                ${goals
                    .map(
                        g => `
                    <div class="profile__option" style="cursor:pointer;" onclick="Anim.showToast('Goal changed to ${g.label}'); this.closest('.overlay').remove();">
                        <div class="profile__option-icon" style="background:var(--bg-alt);">${g.icon}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${g.label}</div>
                            <div class="profile__option-desc">${g.time}</div>
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
}

function showHelp() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Help & FAQ</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-3); overflow-y:auto; max-height: 50vh;">
                <div class="card" style="padding:var(--sp-4);">
                    <strong style="color:var(--text); font-size:var(--fs-md);">How to earn Dangy?</strong>
                    <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-top:var(--sp-1);">You earn Dangy (D) by completing daily lessons, keeping your streak alive, and winning duels.</p>
                </div>
                <div class="card" style="padding:var(--sp-4);">
                    <strong style="color:var(--text); font-size:var(--fs-md);">How does the Streak work?</strong>
                    <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-top:var(--sp-1);">A streak requires you to meet your active daily learning goal. Missing a day resets the count.</p>
                </div>
                <div class="card" style="padding:var(--sp-4);">
                    <strong style="color:var(--text); font-size:var(--fs-md);">What is Langy Coach?</strong>
                    <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-top:var(--sp-1);">Coach members get AI that remembers mistakes across sessions, detects recurring patterns, and creates targeted practice to improve faster.</p>
                </div>
                <button class="btn btn--secondary" onclick="this.closest('.overlay').remove();">Got it</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
}

function showFeedback() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">Send Feedback</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-4);">
                <p style="color:var(--text-secondary); font-size:var(--fs-sm);">Tell us what you love or what we can improve!</p>
                <textarea class="input" rows="4" placeholder="Your experience..."></textarea>
                <button class="btn btn--primary" onclick="Anim.showToast('Thank you for improving Langy!'); this.closest('.overlay').remove();">Submit Feedback</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
}

function showAbout() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            
            <!-- Logo & Version -->
            <div style="text-align:center; margin-bottom:var(--sp-4);">
                <div style="width:80px; height:80px; border-radius:24px; background:linear-gradient(135deg, var(--primary), var(--primary-dark)); display:flex; align-items:center; justify-content:center; margin:0 auto var(--sp-3); box-shadow: 0 8px 24px rgba(16,185,129,0.3);">
                    <span style="color:white; font-size:36px; font-weight:var(--fw-black);">L</span>
                </div>
                <h2 style="color:var(--primary);">Langy AI</h2>
                <div style="display:flex; align-items:center; justify-content:center; gap:var(--sp-2); margin-top:var(--sp-1);">
                    <span class="badge badge--primary">v2.2.0</span>
                    <span class="badge badge--accent">Stable</span>
                </div>
                <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-top:var(--sp-2); padding:0 var(--sp-4);">
                    AI-powered gameified English learning app. Immersive, fun, and unstoppable.
                </p>
            </div>

            <!-- Changelog -->
            <div style="margin-bottom:var(--sp-4);">
                <h4 style="margin-bottom:var(--sp-2); display:flex; align-items:center; gap:8px;">${LangyIcons.sparkles} What's New</h4>
                <div style="display:flex; flex-direction:column; gap:var(--sp-2); max-height:200px; overflow-y:auto;">
                    <div class="card card--flat" style="padding:var(--sp-3);">
                        <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:var(--primary);">v2.2.0 — Feature Sprint</div>
                        <ul style="font-size:var(--fs-xs); color:var(--text-secondary); margin-top:var(--sp-1); padding-left:var(--sp-4); line-height:1.6;">
                            <li>Streak Freeze — protect your streak in Shop</li>
                            <li>Animated fire icon — burns when active</li>
                            <li>Sound effects — correct/wrong/level up</li>
                            <li>Weekly Leaderboard in Duels</li>
                            <li>Weekly Activity chart in Results</li>
                            <li>Review Weak Units mode</li>
                            <li>CEFR Certificate sharing</li>
                        </ul>
                    </div>
                    <div class="card card--flat" style="padding:var(--sp-3);">
                        <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm);">v2.1.0 — Bug Fixes</div>
                        <ul style="font-size:var(--fs-xs); color:var(--text-secondary); margin-top:var(--sp-1); padding-left:var(--sp-4); line-height:1.6;">
                            <li>Colorized all icons — no more black</li>
                            <li>Avatar picker system</li>
                            <li>Events progress tracking</li>
                            <li>Fixed placement sync bug</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Links -->
            <div style="display:flex; gap:var(--sp-2); margin-bottom:var(--sp-4);">
                <button class="btn btn--secondary btn--full" onclick="window.open('https://github.com/mrDemeretti/Langy-v2','_blank');" style="font-size:var(--fs-sm);">
                    ${LangyIcons.github} GitHub
                </button>
                <button class="btn btn--secondary btn--full" onclick="window.open('https://t.me/langyai','_blank');" style="font-size:var(--fs-sm);">
                    ${LangyIcons.messageCircle} Telegram
                </button>
            </div>

            <!-- Credits -->
            <div style="text-align:center; font-size:var(--fs-xs); color:var(--text-tertiary); margin-bottom:var(--sp-3);">
                Made with ${LangyIcons.heart} by DeepTutor Team<br>
                © 2026 Langy AI. All rights reserved.
            </div>

            <button class="btn btn--ghost btn--full" onclick="this.closest('.overlay').remove();">Close</button>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });
}

function showCertificate(code, name, color, date) {
    const userName = LangyState.user?.name || 'Learner';
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            
            <!-- Certificate Card -->
            <div id="cert-card" style="background:linear-gradient(135deg, ${color}08, ${color}15); border:2px solid ${color}30; border-radius:var(--radius-xl); padding:var(--sp-6); text-align:center; margin-bottom:var(--sp-4); position:relative; overflow:hidden;">
                <!-- Decorative corners -->
                <div style="position:absolute; top:8px; left:8px; width:24px; height:24px; border-top:3px solid ${color}; border-left:3px solid ${color}; border-radius:4px 0 0 0; opacity:0.5;"></div>
                <div style="position:absolute; top:8px; right:8px; width:24px; height:24px; border-top:3px solid ${color}; border-right:3px solid ${color}; border-radius:0 4px 0 0; opacity:0.5;"></div>
                <div style="position:absolute; bottom:8px; left:8px; width:24px; height:24px; border-bottom:3px solid ${color}; border-left:3px solid ${color}; border-radius:0 0 0 4px; opacity:0.5;"></div>
                <div style="position:absolute; bottom:8px; right:8px; width:24px; height:24px; border-bottom:3px solid ${color}; border-right:3px solid ${color}; border-radius:0 0 4px 0; opacity:0.5;"></div>
                
                <div style="font-size:var(--fs-xs); text-transform:uppercase; letter-spacing:2px; color:${color}; font-weight:var(--fw-bold); margin-bottom:var(--sp-2);">Certificate of Achievement</div>
                
                <div style="width:64px; height:64px; border-radius:50%; background:${color}; display:flex; align-items:center; justify-content:center; margin:0 auto var(--sp-3); box-shadow:0 4px 16px ${color}40;">
                    <span style="color:white; font-size:24px; font-weight:var(--fw-black);">${code}</span>
                </div>
                
                <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-bottom:var(--sp-1);">This certifies that</div>
                <div style="font-size:var(--fs-xl); font-weight:var(--fw-black); color:var(--text); margin-bottom:var(--sp-2);">${userName}</div>
                <div style="font-size:var(--fs-sm); color:var(--text-secondary); margin-bottom:var(--sp-3);">has successfully completed</div>
                <div style="font-size:var(--fs-lg); font-weight:var(--fw-bold); color:${color};">${code} — ${name}</div>
                <div style="font-size:var(--fs-xs); color:var(--text-tertiary); margin-top:var(--sp-3);">
                    ${date ? 'Earned: ' + date : 'Langy AI English Course'}<br>
                    Issued by Langy AI
                </div>
            </div>

            <!-- Actions -->
            <div style="display:flex; gap:var(--sp-2);">
                <button class="btn btn--secondary btn--full" id="cert-copy" style="font-size:var(--fs-sm);">
                    ${LangyIcons.clipboard} Copy Text
                </button>
                <button class="btn btn--primary btn--full" id="cert-share" style="font-size:var(--fs-sm);">
                    ${LangyIcons.share2} Share
                </button>
            </div>
            <button class="btn btn--ghost btn--full" style="margin-top:var(--sp-2);" onclick="this.closest('.overlay').remove();">Close</button>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    // Copy certificate text
    overlay.querySelector('#cert-copy')?.addEventListener('click', () => {
        const text = `Certificate of Achievement\n\n${userName} has completed ${code} — ${name}\n\nIssued by Langy AI\n${date ? 'Date: ' + date : ''}\n\n#LangyAI #LanguageLearning #CEFR`;
        navigator.clipboard
            .writeText(text)
            .then(() => {
                Anim.showToast(`${LangyIcons.check} Certificate copied to clipboard!`);
            })
            .catch(() => {
                Anim.showToast(`${LangyIcons.clipboard} Copy: ${text.substring(0, 50)}...`);
            });
    });

    // Share (Web Share API or fallback)
    overlay.querySelector('#cert-share')?.addEventListener('click', () => {
        const shareData = {
            title: `${code} Certificate — Langy AI`,
            text: `I just earned my ${code} (${name}) certificate on Langy AI!`,
            url: 'https://mrdemeretti.github.io/Langy-v2',
        };
        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard
                .writeText(`${shareData.text}\n${shareData.url}`)
                .then(() => {
                    Anim.showToast(`${LangyIcons.check} Share text copied!`);
                })
                .catch(() => {});
        }
    });
}

function showSubscription() {
    const _lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const _sc = (LangyState.talkHistory || []).length;

    // Transformation framing: without Coach → with Coach
    const transformations = {
        en: [
            { without: 'Feedback resets every session', with: 'AI remembers your patterns across sessions', icon: 'brain', color: '#3B82F6' },
            { without: 'Same generic corrections each time', with: 'Targeted practice built from your real mistakes', icon: 'target', color: '#7C6CF6' },
            { without: 'You guess what to work on next', with: 'Coach shows exactly what needs attention', icon: 'trendingUp', color: '#10B981' },
            { without: 'Each session starts from zero', with: 'Every session builds on the last one', icon: 'refresh', color: '#F59E0B' },
        ],
        ru: [
            { without: 'Фидбэк сбрасывается каждую сессию', with: 'ИИ помнит паттерны между сессиями', icon: 'brain', color: '#3B82F6' },
            { without: 'Одинаковые исправления каждый раз', with: 'Практика из твоих реальных ошибок', icon: 'target', color: '#7C6CF6' },
            { without: 'Сам гадаешь, что учить дальше', with: 'Coach показывает, что требует внимания', icon: 'trendingUp', color: '#10B981' },
            { without: 'Каждая сессия начинается с нуля', with: 'Каждая сессия продолжает предыдущую', icon: 'refresh', color: '#F59E0B' },
        ],
        es: [
            { without: 'El feedback se reinicia cada sesión', with: 'La IA recuerda tus patrones entre sesiones', icon: 'brain', color: '#3B82F6' },
            { without: 'Las mismas correcciones genéricas', with: 'Práctica enfocada en tus errores reales', icon: 'target', color: '#7C6CF6' },
            { without: 'Adivinas qué practicar después', with: 'Coach muestra exactamente qué necesitas', icon: 'trendingUp', color: '#10B981' },
            { without: 'Cada sesión empieza de cero', with: 'Cada sesión se construye sobre la anterior', icon: 'refresh', color: '#F59E0B' },
        ],
    }[_lang];

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6); text-align:center; max-height:85vh; overflow-y:auto;">
            <div class="overlay__handle"></div>
            <div style="font-size: 50px; margin-bottom:var(--sp-2);">${LangyIcons.brain}</div>
            <h2 style="margin-bottom:var(--sp-1);">Langy Coach</h2>
            <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-bottom:var(--sp-4); line-height:1.5; max-width:280px; margin-left:auto; margin-right:auto;">
                ${{ en: 'The difference between practicing and actually improving.', ru: 'Разница между «практиковать» и «реально прогрессировать».', es: 'La diferencia entre practicar y realmente mejorar.' }[_lang]}
            </p>

            ${_sc >= 3 ? `
            <div style="background:rgba(59,130,246,0.06); border-radius:var(--radius-md); padding:var(--sp-3); margin-bottom:var(--sp-4); border-left:3px solid var(--primary);">
                <div style="font-size:var(--fs-xs); color:var(--text-secondary); line-height:1.5; font-style:italic;">
                    ${{ en: `You've had ${_sc} conversations. With Coach, every one of them would have made the next one smarter.`, ru: `У тебя ${_sc} разговоров. С Coach каждый из них сделал бы следующий умнее.`, es: `Has tenido ${_sc} conversaciones. Con Coach, cada una habría mejorado la siguiente.` }[_lang]}
                </div>
            </div>
            ` : ''}

            <!-- Transformation: without → with -->
            <div style="text-align:left; margin-bottom:var(--sp-4);">
                ${transformations.map(t => `
                <div style="display:flex; gap:10px; padding:var(--sp-2) 0; align-items:flex-start;">
                    <div style="width:28px; height:28px; border-radius:var(--radius-md); background:${t.color}11; color:${t.color}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:13px; margin-top:2px;">
                        ${LangyIcons[t.icon] || LangyIcons.check}
                    </div>
                    <div style="flex:1;">
                        <div style="font-size:var(--fs-xs); color:var(--text-tertiary); text-decoration:line-through; margin-bottom:2px;">${t.without}</div>
                        <div style="font-size:var(--fs-sm); color:var(--text); font-weight:var(--fw-medium);">${t.with}</div>
                    </div>
                </div>
                `).join('')}
            </div>

            <button class="btn btn--primary btn--full" id="activate-premium-btn">
                ${{ en: 'Activate Coach — free in beta', ru: 'Активировать Coach — бесплатно в бета', es: 'Activar Coach — gratis en beta' }[_lang]}
            </button>
            <p style="font-size:var(--fs-xs); color:var(--text-tertiary); margin-top:var(--sp-2);">${{ en: 'Coach is free for all beta testers. Pricing starts after launch.', ru: 'Coach бесплатен для бета-тестеров. Подписка — после запуска.', es: 'Coach es gratis para beta testers. Los precios empiezan tras el lanzamiento.' }[_lang]}</p>
        </div>
    `;
    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => (overlay.querySelector('.overlay__sheet').style.transform = 'translateY(0)'), 10);

    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            overlay.querySelector('.overlay__sheet').style.transform = 'translateY(100%)';
            setTimeout(() => overlay.remove(), 300);
        }
    });

    overlay.querySelector('#activate-premium-btn').addEventListener('click', () => {
        LangyState.subscription.plan = 'coach';
        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
        Anim.showToast(`${{ en: 'Coach activated! Free during beta.', ru: 'Coach активирован! Бесплатно в бета.', es: '¡Coach activado! Gratis durante la beta.' }[_lang]} ${LangyIcons.sparkles}`);

        // Remove the banner from the profile screen
        const banner = document.getElementById('prof-premium-banner');
        if (banner) {
            banner.style.transition = 'all 0.3s ease';
            banner.style.opacity = '0';
            banner.style.transform = 'scale(0.9)';
            setTimeout(() => banner.remove(), 300);
        }

        overlay.querySelector('.overlay__sheet').style.transform = 'translateY(100%)';
        setTimeout(() => overlay.remove(), 300);
    });
}

function showLanguagePicker(profileContainer) {
    if (typeof LangyI18n === 'undefined') return;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const currentLang = LangyI18n.currentLang;

    overlay.innerHTML = `
        <div class="overlay__sheet" style="padding-bottom:var(--sp-6);">
            <div class="overlay__handle"></div>
            <h3 style="margin-bottom:var(--sp-4);">${i18n('profile.language')}</h3>
            <div style="display:flex; flex-direction:column; gap:var(--sp-3);">
                ${LangyI18n.languages
                    .map(
                        lang => `
                    <div class="profile__option lang-option ${lang.code === currentLang ? 'profile__option--active' : ''}" data-lang="${lang.code}" style="cursor:pointer; ${lang.code === currentLang ? 'border: 2px solid var(--primary); background: var(--primary-bg);' : ''}">
                        <div class="profile__option-icon" style="font-size:24px; background:transparent;">${lang.flag}</div>
                        <div class="profile__option-text">
                            <div class="profile__option-label">${lang.name}</div>
                        </div>
                        ${lang.code === currentLang ? `<span style="color:var(--primary);">${LangyIcons.check}</span>` : ''}
                    </div>
                `
                    )
                    .join('')}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', () => {
            const lang = el.dataset.lang;
            LangyI18n.setLang(lang);
            overlay.remove();
            Anim.showToast(`Language: ${LangyI18n.languages.find(l => l.code === lang)?.name}`);
            // Re-render profile with new language
            if (profileContainer && typeof renderProfile === 'function') {
                renderProfile(profileContainer);
            }
        });
    });
}

Router.register('profile', renderProfile);
