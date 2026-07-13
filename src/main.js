/* ============================================
   LANGY — MAIN ENTRY POINT
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
    if (typeof LangyMetrics !== 'undefined') {
        LangyMetrics.init();
    }

    // Initialize i18n
    if (typeof LangyI18n !== 'undefined') {
        LangyI18n.loadSavedLang();
    }

    // Apply saved theme preference
    if (typeof localStorage !== 'undefined') {
        const savedTheme = localStorage.getItem('langy_theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            if (typeof LangyState !== 'undefined') LangyState.settings.darkMode = isDark;
            if (typeof toggleDarkMode === 'function') toggleDarkMode(isDark);
        }
    }

    // Global UI Interaction Sound + Haptic Listener
    document.body.addEventListener('click', (e) => {
        // Find if the click hit an interactive element
        const isInteractive = e.target.closest('.btn, .circle-btn, .profile__option, .action-card, .card--interactive, .home__streak, .coin, .nav-header__back, .bottom-nav__tab');
        if (isInteractive) {
            if (typeof AudioUtils !== 'undefined') AudioUtils.playPop();
            if (typeof Anim !== 'undefined') Anim.haptic('light');
        }
    });

    // Initialize database & restore session
    let startRoute = null;

    if (typeof LangyDB !== 'undefined') {
        try {
            await LangyDB.init();
            const user = await LangyDB.getCurrentUser();
            if (user) {
                LangyDB.currentUser = user;
                await LangyDB.loadProgress(user.email);
                
                // Re-apply theme from loaded state
                if (typeof toggleDarkMode === 'function') {
                    toggleDarkMode(LangyState.settings.darkMode);
                }
                // Re-apply language from loaded state
                if (typeof LangyI18n !== 'undefined' && LangyState.settings.interfaceLang) {
                    LangyI18n.currentLang = LangyState.settings.interfaceLang;
                }
                
                // ─── STREAK MIGRATION ───
                // Detect old users with fake hardcoded data
                const sd = LangyState.streakData;
                if (!sd._migrated) {
                    // Old user — reset fake streak data
                    sd._migrated = true;
                    sd.days = 0;
                    sd.totalSessions = 0;
                    sd.totalMinutes = 0;
                    sd.wordsLearned = 0;
                    sd.accuracy = 0;
                    sd.todayCompleted = false;
                    sd.activeDays = [];
                    sd.longestStreak = 0;
                    sd.streakFreezes = 0;
                    sd.freezeUsedDates = [];
                    sd.freezePrice = 200;
                    sd.maxFreezes = 3;
                    sd.timeBreakdown = { vocabulary: 0, grammar: 0, listening: 0, speaking: 0, writing: 0 };
                    sd.lastSession = { date: null, wordsLearned: 0, accuracy: 0, duration: 0 };
                    LangyState.user.streak = 0;
                    console.log('[Langy] Migrated old user — streak reset to 0');
                }

                // ─── DAILY STREAK CHECK ───
                // FIX: Use LOCAL date, not UTC — prevents timezone bugs
                const now = new Date();
                const today = now.getFullYear() + '-' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(now.getDate()).padStart(2, '0');
                
                // FIX: Use lastVisitDate (tracks app opens) instead of lastSession.date (only tracks lesson completions)
                // This prevents streak loss when user opens app but doesn't finish a lesson
                const lastDate = sd.lastVisitDate || sd.lastSession.date;
                
                if (lastDate && lastDate !== today) {
                    // Calculate diff using local dates to avoid UTC timezone issues
                    const lastParts = lastDate.split('-').map(Number);
                    const todayParts = today.split('-').map(Number);
                    const last = new Date(lastParts[0], lastParts[1] - 1, lastParts[2]);
                    const curr = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);
                    const diffMs = curr.getTime() - last.getTime();
                    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 1) {
                        // Consecutive day → streak continues
                    } else if (diffDays > 1) {
                        // Missed day(s) — try to use Streak Freeze
                        const missedDays = diffDays - 1;
                        const availableFreezes = sd.streakFreezes || 0;
                        
                        if (availableFreezes >= missedDays) {
                            // Freezes fully cover the gap!
                            sd.streakFreezes -= missedDays;
                            if (!sd.freezeUsedDates) sd.freezeUsedDates = [];
                            for (let i = 1; i <= missedDays; i++) {
                                const freezeDate = new Date(last);
                                freezeDate.setDate(freezeDate.getDate() + i);
                                const fd = freezeDate.getFullYear() + '-' + String(freezeDate.getMonth()+1).padStart(2,'0') + '-' + String(freezeDate.getDate()).padStart(2,'0');
                                sd.freezeUsedDates.push(fd);
                            }
                            setTimeout(() => showStreakOverlay('freeze', missedDays, sd.streakFreezes), 1500);
                        } else if (availableFreezes > 0) {
                            // PARTIAL protection
                            const protectedDays = availableFreezes;
                            sd.streakFreezes = 0;
                            if (!sd.freezeUsedDates) sd.freezeUsedDates = [];
                            for (let i = 1; i <= protectedDays; i++) {
                                const freezeDate = new Date(last);
                                freezeDate.setDate(freezeDate.getDate() + i);
                                const fd = freezeDate.getFullYear() + '-' + String(freezeDate.getMonth()+1).padStart(2,'0') + '-' + String(freezeDate.getDate()).padStart(2,'0');
                                sd.freezeUsedDates.push(fd);
                            }
                            const lostDays = missedDays - protectedDays;
                            sd.days = Math.max(0, sd.days - lostDays);
                            LangyState.user.streak = sd.days;
                            setTimeout(() => showStreakOverlay('partial', lostDays, 0), 1500);
                        } else {
                            // No freezes — streak lost
                            const lostDays = sd.days;
                            sd.days = 0;
                            LangyState.user.streak = 0;
                            if (lostDays > 0) {
                                setTimeout(() => showStreakOverlay('lost', lostDays), 1500);
                            }
                        }
                    }
                }
                
                // FIX: Always update lastVisitDate on app open — this is separate from lesson completion
                sd.lastVisitDate = today;
                
                // Mark today as not yet completed (lesson-wise)
                if (!sd.lastSession.date || sd.lastSession.date !== today) {
                    sd.todayCompleted = false;
                    LangyState.dailyChallenge.tasks.forEach(t => t.done = false);
                }

                LangyDB.startAutoSave();

                // Restore active textbook from saved state
                if (typeof LangyCurriculum !== 'undefined') {
                    LangyCurriculum.restoreFromState();
                }

                if (typeof LangyState.user.firstSessionCompleted !== 'boolean') {
                    LangyState.user.firstSessionCompleted = (LangyState.talkHistory || []).length > 0;
                }
                if (typeof LangyState.user.firstSpeakingScenarioStarted !== 'boolean') {
                    LangyState.user.firstSpeakingScenarioStarted = LangyState.user.firstSessionCompleted;
                }
                if (!LangyState.user.firstSpeakingScenarioId) {
                    LangyState.user.firstSpeakingScenarioId = 'coffee';
                }

                // Backfill firstLessonCompleted for existing users
                if (typeof LangyState.user.firstLessonCompleted !== 'boolean') {
                    LangyState.user.firstLessonCompleted = (LangyState.progress.lessonHistory || []).length > 0;
                }

                const isFirstJourney =
                    LangyState.user?.hasCompletedOnboarding && LangyState.user?.firstSessionCompleted === false;
                const userConfidence = LangyState.user?.confidenceLevel;
                const hasCompletedAnyLesson =
                    LangyState.user?.firstLessonCompleted === true ||
                    (LangyState.progress.lessonHistory || []).length > 0;
                const isTrueBeginner = (userConfidence === 'zero' || userConfidence === 'basic') &&
                    (LangyState.progress.lessonHistory || []).length === 0;

                if (isFirstJourney && !isTrueBeginner && !hasCompletedAnyLesson) {
                    // Intermediate/advanced: resume speaking-first flow
                    const scenario = LangyState.user.firstSpeakingScenarioId || 'coffee';
                    ScreenState.set('talkMascot', LangyState.mascot.selected || 0);
                    ScreenState.set('talkScenario', scenario);
                    ScreenState.set('firstTalkSession', !LangyState.user.firstSpeakingScenarioStarted);
                    ScreenState.set('guidedSpeaking', true);
                    ScreenState.set('talkView', 'call');
                    startRoute = 'talk';
                } else {
                    // Beginners go to home (lesson-first CTA)
                    // Returning users also go to home
                    startRoute = 'home';
                }
            }
        } catch (e) {
            console.error('DB init error:', e);
        }
    }

    // Set initial route
    if (startRoute) {
        window.location.hash = startRoute;
    } else if (!window.location.hash) {
        window.location.hash = 'auth';
    }

    // Initialize router (all screens already registered)
    Router.init();

    // Initialize DeepTutor Global Widget
    if (typeof DeepTutor !== 'undefined') {
        DeepTutor.init();
    }

    // Save progress before page close
    window.addEventListener('beforeunload', () => {
        if (typeof LangyDB !== 'undefined' && LangyDB.currentUser) {
            LangyDB.saveProgress().catch(() => {});
        }
    });
});

// ─── STREAK OVERLAY ANIMATION ───
function showStreakOverlay(type, days, freezesLeft) {
    const overlay = document.createElement('div');
    overlay.id = 'streak-overlay';

    const isFreeze = type === 'freeze';
    const isPartial = type === 'partial';
    const bg = isFreeze
        ? 'linear-gradient(135deg, rgba(99,102,241,0.95), rgba(59,130,246,0.95))'
        : isPartial
        ? 'linear-gradient(135deg, rgba(245,158,11,0.95), rgba(217,119,6,0.95))'
        : 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.95))';
    const icon = isFreeze ? LangyIcons.shield : isPartial ? LangyIcons.shield : LangyIcons.flame;
    const title = isFreeze ? 'Streak Protected!' : isPartial ? 'Streak Partially Saved' : 'Streak Lost';
    const subtitle = isFreeze
        ? `Freeze shield saved your ${LangyState.streakData.days}-day streak!`
        : isPartial
        ? `Freezes saved some days, but your streak was reduced by ${days}.`
        : `Your ${days}-day streak was lost.`;
    const detail = isFreeze
        ? `${days} freeze${days > 1 ? 's' : ''} used · ${freezesLeft} remaining`
        : isPartial
        ? `Current streak: ${LangyState.streakData.days} days · Buy more freezes in the Shop!`
        : 'Start a new streak today — every day counts!';

    overlay.innerHTML = `
        <div style="
            position:fixed; inset:0; z-index:9999;
            background:${bg};
            display:flex; flex-direction:column;
            align-items:center; justify-content:center;
            animation: overlayFadeIn 0.4s ease;
            backdrop-filter: blur(8px);
            padding: 32px;
            text-align: center;
        ">
            <div style="
                font-size:80px; 
                animation: streakIconPulse 1s ease infinite alternate;
                filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));
            ">${icon}</div>
            
            <h2 style="
                color:#fff; font-size:28px; font-weight:900;
                margin:20px 0 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">${title}</h2>
            
            <p style="
                color:rgba(255,255,255,0.9); font-size:16px;
                margin:0 0 8px; max-width:300px;
            ">${subtitle}</p>
            
            <p style="
                color:rgba(255,255,255,0.7); font-size:13px;
                margin:0 0 32px;
            ">${detail}</p>

            <button onclick="this.closest('#streak-overlay').remove()" style="
                background:rgba(255,255,255,0.2); color:#fff;
                border:2px solid rgba(255,255,255,0.4);
                border-radius:50px; padding:12px 40px;
                font-size:16px; font-weight:700; cursor:pointer;
                backdrop-filter:blur(4px);
                transition: all 0.2s ease;
                font-family: inherit;
            ">${typeof i18n!=='undefined'?i18n('common.got_it'):'Got it'}</button>
        </div>
    `;

    // Add keyframes if not already present
    if (!document.querySelector('#streak-overlay-styles')) {
        const style = document.createElement('style');
        style.id = 'streak-overlay-styles';
        style.textContent = `
            @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes streakIconPulse {
                from { transform: scale(1); }
                to { transform: scale(1.15); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(overlay);

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }
    }, 6000);
}
