/* ============================================
   LANGY — STATE MANAGEMENT
   ============================================ */

const LangyState = {
    // App UI locale. This is separate from the paid course language.
    interfaceLocale: 'en',

    // Purchased course language. Before checkout this stays null.
    courseLanguage: null,
    pendingCourseLanguage: null,

    // Target language being studied (read by LangyTarget).
    // Null means the learner has not made an explicit study-language choice yet.
    targetLanguage: null,

    // User
    user: {
        name: 'Alex',
        email: 'alex@example.com',
        level: 'B1 Intermediate',
        xp: 2450,
        streak: 14,
        joinDate: '2025-12-01',
        avatar: null,
        hasCompletedPlacement: true,
        hasCompletedOnboarding: false,
        targetLanguageConfirmed: false,
        firstSessionCompleted: false,
        firstSpeakingScenarioStarted: false,
        firstSpeakingScenarioId: null,
        firstLessonCompleted: false,
        confidenceLevel: null,
        interests: [],
    },

    // Currencies
    currencies: {
        langy: 350, // premium
        dangy: 1280, // earned
    },

    // Mascot
    mascot: {
        selected: null, // 0, 1, or 2
        equipped: {
            hat: null,
            shirt: null,
            pants: null,
            shoes: null,
            accessory: null,
        },
    },

    // Subscription — 2-tier: free (null/'free') | coach ('coach', legacy: 'pro','premium')
    subscription: {
        plan: null, // null|'free' = free tier, 'coach' = paid coaching, 'pro'|'premium' = legacy→coach
        billingPeriod: null,
        status: 'none',
        courseLanguage: null,
        startedAt: null,
        renewsAt: null,
        entitlements: [],
    },

    // Coach data — cross-session coaching intelligence
    coachData: {
        mistakePatterns: [], // [{ tag, count, firstSeen, lastSeen, example, prevCount }]
        sessionLog: [],      // [{ date, tags: ['tense','articles'], sessionIndex }] — last 20 sessions
    },

    // Streak data
    streakData: {
        _migrated: true, // Flag: false/missing = old user, needs reset
        days: 0,
        totalSessions: 0,
        totalMinutes: 0,
        wordsLearned: 0,
        accuracy: 0,
        todayCompleted: false, // Has user done a session today?
        activeDays: [], // Array of ISO date strings for streak calendar
        longestStreak: 0, // Best streak ever
        // Streak Freeze: protects streak when you miss a day
        streakFreezes: 0, // Number of freeze shields owned
        freezeUsedDates: [], // ISO dates when a freeze was auto-used
        freezePrice: LangyConfig.STREAK_FREEZE_PRICE,
        maxFreezes: LangyConfig.STREAK_MAX_FREEZES,
        timeBreakdown: {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
            speaking: 0,
            writing: 0,
        },
        lastSession: {
            date: null, // ISO date string (e.g. "2026-04-16") or null
            wordsLearned: 0,
            accuracy: 0,
            duration: 0,
        },
        // Per-day stats for calendar view
        // Key = ISO date string, Value = { sessions, minutes, words, accuracy, categories }
        dailyStats: {},
    },

    // Homework
    homework: {
        current: [],
        completed: [],
    },

    // Tests
    tests: {
        listening: [],
        speaking: [],
        reading: [],
        grammar: [],
    },

    // Results / Progress
    progress: {
        overall: 0,
        skills: {
            vocabulary: 0,
            grammar: 0,
            listening: 0,
            speaking: 0,
            writing: 0,
            reading: 0,
        },
        topicsCompleted: 0,
        totalTopics: 50,
        currentUnitId: 1,
        currentLessonIdx: 0,
        skipsRemaining: 2, // Max 2 per unit
        currentUnit: 'Unit 1: Getting Started',
        lessonHistory: [],
        recentTopics: [],
        reviewQueue: [],

        // Mastery Loop: per-unit results
        // Key = "textbookId:unitId", e.g. "b1_pre_int:3"
        // Value = { score, passed, attempts, failedIndices, lastAttempt }
        mastery: {},

        // CEFR Badges: earned level certificates
        // Key = CEFR code, e.g. "A1"
        // Value = { earned: bool, date: string|null, badge: string }
        cefrBadges: {
            A1: { earned: false, date: null, badge: LangyIcons.star },
            A2: { earned: false, date: null, badge: LangyIcons.star },
            B1: { earned: false, date: null, badge: LangyIcons.award },
            B2: { earned: false, date: null, badge: LangyIcons.trophy },
            C1: { earned: false, date: null, badge: LangyIcons.crown },
            C2: { earned: false, date: null, badge: LangyIcons.medal },
        },
    },

    // Per-language study progress. LangyState.progress always points at the
    // active language's progress object after a confirmed target-language choice.
    languageProgress: {},
    archivedLanguageProgress: {},

    // Daily Challenge
    dailyChallenge: {
        reward: 50, // Dangy
        timeLeft: 14400, // seconds
        tasks: [
            {
                id: 1,
                title: 'Speak for 3 minutes',
                desc: 'Practice speaking on any topic',
                done: true,
                icon: LangyIcons.mic,
            },
            {
                id: 2,
                title: 'No mistakes challenge',
                desc: 'Complete 10 questions without errors',
                done: false,
                icon: LangyIcons.target,
            },
            {
                id: 3,
                title: 'Listen & repeat',
                desc: 'Listen to 5 sentences and repeat',
                done: false,
                icon: LangyIcons.headphones,
            },
            { id: 4, title: 'Learn 5 new words', desc: 'Vocabulary expansion', done: false, icon: LangyIcons.bookOpen },
        ],
    },

    // Shop
    shop: {
        items: [
            {
                id: 10,
                name: 'Streak Freeze',
                emoji: LangyIcons.shield,
                price: 200,
                currency: 'dangy',
                category: 'consumable',
                desc: 'Protects your streak for 1 missed day',
            },
            { id: 1, name: 'Cool Shades', emoji: LangyIcons.sun, price: 50, currency: 'dangy', category: 'accessory' },
            { id: 2, name: 'Top Hat', emoji: LangyIcons.graduationCap, price: 80, currency: 'dangy', category: 'hat' },
            {
                id: 3,
                name: 'Crown',
                emoji: LangyIcons.crown,
                price: 200,
                currency: 'langy',
                category: 'hat',
                premium: true,
            },
            { id: 4, name: 'Star Badge', emoji: LangyIcons.star, price: 30, currency: 'dangy', category: 'accessory' },
            {
                id: 5,
                name: 'Rocket',
                emoji: LangyIcons.rocket,
                price: 150,
                currency: 'langy',
                category: 'sticker',
                premium: true,
            },
            {
                id: 6,
                name: 'Fire Skin',
                emoji: LangyIcons.flame,
                price: 300,
                currency: 'langy',
                category: 'skin',
                premium: true,
            },
            { id: 7, name: 'Bow Tie', emoji: LangyIcons.gift, price: 40, currency: 'dangy', category: 'accessory' },
            { id: 8, name: 'Party Hat', emoji: LangyIcons.sparkles, price: 60, currency: 'dangy', category: 'hat' },
        ],
        owned: [1, 4, 8],
    },

    // Inventory
    inventory: {
        items: [
            { id: 1, name: 'Cool Shades', emoji: LangyIcons.sun, slot: 'accessory', equipped: false },
            { id: 4, name: 'Star Badge', emoji: LangyIcons.star, slot: 'accessory', equipped: true },
            { id: 8, name: 'Party Hat', emoji: LangyIcons.sparkles, slot: 'hat', equipped: false },
        ],
    },

    // Duels
    duels: {
        stats: { wins: 0, losses: 0, ties: 0 },
        modes: [
            {
                id: 'quick',
                name: 'Quick Match',
                desc: 'Fast 5-question duel',
                icon: LangyIcons.zap,
                bg: 'var(--reward-gold-bg)',
            },
            {
                id: 'ranked',
                name: 'Ranked Battle',
                desc: 'Compete for league points',
                icon: LangyIcons.trophy,
                bg: 'var(--primary-bg)',
            },
            {
                id: 'practice',
                name: 'Practice Duel',
                desc: 'No pressure, just practice',
                icon: LangyIcons.target,
                bg: 'var(--accent-bg)',
            },
        ],
        questions: [
            {
                q: 'Choose the correct form:',
                text: '"She ___ to the store yesterday."',
                options: ['goed', 'went', 'go', 'gone'],
                correct: 1,
            },
            {
                q: 'Fill in the blank:',
                text: '"I have been ___ English for 2 years."',
                options: ['learn', 'learned', 'learning', 'learns'],
                correct: 2,
            },
            {
                q: 'Which is correct?',
                text: '"If I ___ rich, I would travel."',
                options: ['am', 'was', 'were', 'be'],
                correct: 2,
            },
            {
                q: 'Choose the synonym:',
                text: '"Happy" means the same as...',
                options: ['Sad', 'Joyful', 'Angry', 'Tired'],
                correct: 1,
            },
            {
                q: 'Correct spelling:',
                text: 'Which word is spelled correctly?',
                options: ['Recieve', 'Receive', 'Receve', 'Receeve'],
                correct: 1,
            },
        ],
    },

    // Events (dynamic — see events.js)
    events: [],
    eventsClaimed: {},
    eventProgress: {},

    // Settings
    settings: {
        darkMode: false,
        notifications: true,
        sound: true,
        haptics: true,
        dailyReminder: '09:00',
        interfaceLang: 'en',
        languageLevel: 'B1',
    },

    // AI Memory — mistakes, weak areas, textbook context
    aiMemory: {
        mistakes: [],
        weakAreas: [],
        currentTextbookId: null,
        lastTopic: 'Getting Started',
        behavioralNote: 'Highly motivated learner',
        conversationContext: [], // { role: 'ai'|'user', content: string, timestamp: number, type: 'text'|'task' }
    },

    // Vocabulary Mastery — per-word compact tracking (MVP vocab spec v1)
    // Only words the learner has encountered get entries here.
    // Keys = vocab id (e.g. "en_food_003"), Values = compact mastery object.
    // States: new (no entry) → seen → practiced → known
    // Transitions: seen→practiced (used in session), practiced→known (3 correct, 2+ sessions)
    // Demotion: known→practiced (2 incorrect recently)
    vocabMastery: {
        // Example:
        // "en_food_003": { m:"practiced", c:2, i:0, s:1, t:1714862400000 }
        // m = mastery state, c = times correct, i = times incorrect,
        // s = distinct sessions, t = last seen timestamp (ms)
    },
};

/**
 * Get a value from LangyState using dot-notation path.
 * @param {string} path - Dot-separated path (e.g. 'user.name', 'progress.skills.grammar')
 * @returns {*} The value at the path, or undefined if not found
 */
function getState(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], LangyState);
}

/**
 * Set a value in LangyState using dot-notation path.
 * @param {string} path - Dot-separated path (e.g. 'user.streak')
 * @param {*} value - Value to set
 * @throws {TypeError} If intermediate path doesn't exist
 */
function setState(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, key) => {
        if (obj == null || typeof obj !== 'object') {
            throw new TypeError(`setState: invalid path segment '${key}' in '${path}'`);
        }
        return obj[key];
    }, LangyState);
    if (target == null) {
        LangyLogger.warn('setState', `Path '${path}' resolved to null/undefined`);
        return;
    }
    target[last] = value;
}

/**
 * Record a completed lesson/exercise session.
 * Updates streak, XP, daily stats, and event progress.
 *
 * @param {Object} options
 * @param {number} [options.duration=0] - Duration in minutes
 * @param {number} [options.wordsLearned=0] - Words learned
 * @param {number} [options.accuracy=0] - Score 0-100
 * @param {string} [options.category='grammar'] - Skill category
 */
function recordSession({ duration = 0, wordsLearned = 0, accuracy = 0, category = 'grammar' } = {}) {
    try {
        const now = new Date();
        const today =
            now.getFullYear() +
            '-' +
            String(now.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(now.getDate()).padStart(2, '0');
        const sd = LangyState.streakData;

        // ── FIX: Reset todayCompleted if the date changed (app left open overnight) ──
        if (sd.lastSession.date && sd.lastSession.date !== today && sd.todayCompleted) {
            sd.todayCompleted = false;
        }

        // Update session stats
        sd.totalSessions++;
        sd.totalMinutes += duration;
        sd.wordsLearned += wordsLearned;
        sd.accuracy =
            sd.totalSessions > 0
                ? Math.round((sd.accuracy * (sd.totalSessions - 1) + accuracy) / sd.totalSessions)
                : accuracy;

        // Update time breakdown
        if (sd.timeBreakdown[category] !== undefined) {
            sd.timeBreakdown[category] += duration;
        }

        // Update last session
        sd.lastSession = { date: today, wordsLearned, accuracy, duration };
        sd.lastVisitDate = today; // Keep visit date in sync

        // Update daily stats for calendar
        if (!sd.dailyStats) sd.dailyStats = {};
        if (!sd.dailyStats[today]) {
            sd.dailyStats[today] = { sessions: 0, minutes: 0, words: 0, accuracy: 0, categories: {} };
        }
        const ds = sd.dailyStats[today];
        ds.sessions++;
        ds.minutes += duration;
        ds.words += wordsLearned;
        ds.accuracy =
            ds.sessions > 0 ? Math.round((ds.accuracy * (ds.sessions - 1) + accuracy) / ds.sessions) : accuracy;
        if (!ds.categories[category]) ds.categories[category] = 0;
        ds.categories[category] += duration;

        // Daily Challenge: Track Perfect Lesson
        if (accuracy === 100) {
            if (!LangyState.dailyChallenge) LangyState.dailyChallenge = {};
            LangyState.dailyChallenge._perfectLessonDate = today;
        }

        // ── EVENT PROGRESS: update active event tracking ──
        updateEventProgress({ duration, wordsLearned, accuracy, category });

        // Streak logic: increment only once per day
        if (!sd.todayCompleted) {
            sd.todayCompleted = true;

            // Add today to activeDays
            if (!sd.activeDays) sd.activeDays = [];
            if (!sd.activeDays.includes(today)) {
                sd.activeDays.push(today);
            }

            // Increment streak
            sd.days++;
            LangyState.user.streak = sd.days;

            // Update longest streak
            if (!sd.longestStreak) sd.longestStreak = 0;
            if (sd.days > sd.longestStreak) {
                sd.longestStreak = sd.days;
            }

            // ─── STREAK REWARDS ───
            const streakRewards = getStreakReward(sd.days);
            if (streakRewards) {
                LangyState.currencies.dangy += streakRewards.dangy;
                LangyState.currencies.langy += streakRewards.langy;

                let rewardMsg = `${LangyIcons.flame} ${sd.days} Day Streak!`;
                if (streakRewards.dangy > 0) rewardMsg += ` +${streakRewards.dangy} Dangy`;
                if (streakRewards.langy > 0) rewardMsg += ` +${streakRewards.langy} Langy`;
                if (streakRewards.badge) rewardMsg += ` ${streakRewards.badge}`;

                setTimeout(() => {
                    if (typeof Anim !== 'undefined') Anim.showToast(rewardMsg);
                }, 800);
            }
        }

        // Save
        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
    } catch (e) {
        if (typeof LangyLogger !== 'undefined') {
            LangyLogger.error('recordSession', 'Failed to record session', e);
        } else {
            console.error('[Langy] recordSession failed:', e);
        }
    }
}

/**
 * Get reward for a given streak day count.
 * @param {number} days - Current streak day count
 * @returns {{dangy: number, langy: number, badge: string|null}} Reward object
 */
function getStreakReward(days) {
    // Daily rewards
    const dailyDangy = Math.min(10 + Math.floor(days / 7) * 5, 50); // 10-50 dangy/day, scaling

    // Milestone rewards (Langy = premium, only at milestones)
    const milestones = {
        3: { dangy: 25, langy: 0, badge: LangyIcons.star + ' Nice Start!' },
        7: { dangy: 50, langy: 5, badge: LangyIcons.star + ' Weekly Warrior!' },
        14: { dangy: 100, langy: 10, badge: LangyIcons.award + ' Two Week Champion!' },
        30: { dangy: 200, langy: 25, badge: LangyIcons.trophy + ' Monthly Master!' },
        60: { dangy: 400, langy: 50, badge: LangyIcons.diamond + ' Diamond Streak!' },
        90: { dangy: 600, langy: 100, badge: LangyIcons.crown + ' Royal Learner!' },
        180: { dangy: 1000, langy: 200, badge: LangyIcons.flame + ' Half-Year Hero!' },
        365: { dangy: 2000, langy: 500, badge: LangyIcons.medal + ' Annual Legend!' },
    };

    if (milestones[days]) {
        return milestones[days];
    }

    return { dangy: dailyDangy, langy: 0, badge: null };
}

// Deep copy of initial state for resets
const DEFAULT_STATE = JSON.parse(JSON.stringify(LangyState));
const LANGY_TARGET_CODES = ['en', 'es', 'ar'];
const LANGY_ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'beta', 'legacy', 'free'];

function isValidTargetLanguageCode(code) {
    return LANGY_TARGET_CODES.includes(code);
}

function cloneStateValue(value) {
    return JSON.parse(JSON.stringify(value));
}

function buildCourseEntitlements(code, plan = 'coach') {
    const entitlements = [`course:${code}`, `curriculum:${code}`, 'lesson-engine', 'review', 'talk'];
    if (['coach', 'pro', 'premium'].includes(plan)) entitlements.push('coach');
    return entitlements;
}

function normalizeSubscriptionState() {
    if (!LangyState.subscription || typeof LangyState.subscription !== 'object' || Array.isArray(LangyState.subscription)) {
        LangyState.subscription = cloneStateValue(DEFAULT_STATE.subscription);
    }

    const sub = LangyState.subscription;
    if (sub.plan === 'pro' || sub.plan === 'premium') sub.plan = 'coach';
    if (!('billingPeriod' in sub)) sub.billingPeriod = null;
    if (!('status' in sub)) sub.status = sub.courseLanguage ? 'active' : 'none';
    if (!('courseLanguage' in sub)) sub.courseLanguage = null;
    if (!('startedAt' in sub)) sub.startedAt = null;
    if (!('renewsAt' in sub)) sub.renewsAt = null;
    if (!Array.isArray(sub.entitlements)) sub.entitlements = [];

    if (isValidTargetLanguageCode(sub.courseLanguage)) {
        LangyState.courseLanguage = sub.courseLanguage;
        if (!sub.entitlements.includes(`course:${sub.courseLanguage}`)) {
            sub.entitlements = buildCourseEntitlements(sub.courseLanguage, sub.plan);
        }
        if (!sub.status || sub.status === 'none') sub.status = 'active';
    } else {
        sub.courseLanguage = null;
        LangyState.courseLanguage = isValidTargetLanguageCode(LangyState.courseLanguage) ? LangyState.courseLanguage : null;
    }

    if (!isValidTargetLanguageCode(LangyState.pendingCourseLanguage)) {
        LangyState.pendingCourseLanguage = null;
    }
}

function getLockedCourseLanguage() {
    normalizeSubscriptionState();
    const sub = LangyState.subscription;
    if (
        isValidTargetLanguageCode(sub.courseLanguage) &&
        LANGY_ACTIVE_SUBSCRIPTION_STATUSES.includes(sub.status || 'none') &&
        sub.entitlements.includes(`course:${sub.courseLanguage}`)
    ) {
        return sub.courseLanguage;
    }
    return null;
}

function hasLockedCourseLanguage() {
    return !!getLockedCourseLanguage();
}

function getCourseLanguage() {
    return getLockedCourseLanguage() || (isValidTargetLanguageCode(LangyState.courseLanguage) ? LangyState.courseLanguage : null);
}

function getPendingCourseLanguage() {
    const screenPending =
        typeof ScreenState !== 'undefined' && typeof ScreenState.get === 'function'
            ? ScreenState.get('pendingCourseLanguage', null)
            : null;
    return isValidTargetLanguageCode(screenPending)
        ? screenPending
        : isValidTargetLanguageCode(LangyState.pendingCourseLanguage)
          ? LangyState.pendingCourseLanguage
          : null;
}

function setPendingCourseLanguage(code) {
    if (!isValidTargetLanguageCode(code)) return false;
    const locked = getLockedCourseLanguage();
    if (locked && locked !== code) {
        console.warn(`[LangyState] Course language is locked to ${locked}`);
        return false;
    }
    LangyState.pendingCourseLanguage = code;
    if (typeof ScreenState !== 'undefined' && typeof ScreenState.set === 'function') {
        ScreenState.set('pendingCourseLanguage', code);
        ScreenState.set('targetLangChoice', code);
    }
    return true;
}

function clearPendingCourseLanguage() {
    LangyState.pendingCourseLanguage = null;
    if (typeof ScreenState !== 'undefined') {
        ScreenState.remove?.('pendingCourseLanguage');
        ScreenState.remove?.('checkoutPlan');
        ScreenState.remove?.('checkoutStep');
    }
}

function canActivateTargetLanguage(code, options = {}) {
    if (!isValidTargetLanguageCode(code)) return false;
    if (options.force === true || options.entitlement === true) return true;
    const locked = getLockedCourseLanguage();
    return !locked || locked === code;
}

function hasMeaningfulProgress(progress) {
    if (!progress || typeof progress !== 'object') return false;
    return (
        (Array.isArray(progress.lessonHistory) && progress.lessonHistory.length > 0) ||
        (progress.mastery && Object.keys(progress.mastery).length > 0) ||
        (progress.topicsCompleted || 0) > 0 ||
        (progress.overall || 0) > 0 ||
        (progress.currentUnitId || 1) > 1
    );
}

function archiveInactiveLanguageProgress(activeCode) {
    if (!isValidTargetLanguageCode(activeCode)) return;
    ensureLanguageProgressStore();
    if (!LangyState.archivedLanguageProgress || typeof LangyState.archivedLanguageProgress !== 'object') {
        LangyState.archivedLanguageProgress = {};
    }

    LANGY_TARGET_CODES.forEach(code => {
        if (code === activeCode) return;
        const progress = LangyState.languageProgress?.[code];
        if (hasMeaningfulProgress(progress)) {
            LangyState.archivedLanguageProgress[code] = cloneStateValue(progress);
        }
    });
}

function inferLegacyCourseLanguage() {
    normalizeSubscriptionState();
    if (isValidTargetLanguageCode(LangyState.subscription.courseLanguage)) return LangyState.subscription.courseLanguage;
    if (isValidTargetLanguageCode(LangyState.courseLanguage)) return LangyState.courseLanguage;
    if (LangyState.user?.targetLanguageConfirmed === true && isValidTargetLanguageCode(LangyState.targetLanguage)) {
        return LangyState.targetLanguage;
    }

    ensureLanguageProgressStore();
    const progressed = LANGY_TARGET_CODES.filter(code => hasMeaningfulProgress(LangyState.languageProgress?.[code]));
    if (progressed.length === 1) return progressed[0];
    if (progressed.length > 1) {
        return isValidTargetLanguageCode(LangyState.targetLanguage) ? LangyState.targetLanguage : progressed[0];
    }
    return null;
}

function getRenewalDate(startDate, billingPeriod = 'monthly', trialDays = 7) {
    const date = new Date(startDate || Date.now());
    if (trialDays > 0) {
        date.setDate(date.getDate() + trialDays);
    } else if (billingPeriod === 'yearly') {
        date.setFullYear(date.getFullYear() + 1);
    } else {
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
}

function activateCourseEntitlement(code, options = {}) {
    if (!isValidTargetLanguageCode(code)) return false;
    const locked = getLockedCourseLanguage();
    if (locked && locked !== code && options.force !== true) {
        console.warn(`[LangyState] Cannot activate ${code}; course is locked to ${locked}`);
        return false;
    }

    normalizeSubscriptionState();
    const startedAt = options.startedAt || new Date().toISOString();
    const plan = options.plan || 'coach';
    const billingPeriod = options.billingPeriod || 'monthly';
    const status = options.status || 'trialing';
    const renewsAt = options.renewsAt || getRenewalDate(startedAt, billingPeriod, options.trialDays ?? 7);

    LangyState.courseLanguage = code;
    LangyState.pendingCourseLanguage = null;
    LangyState.subscription.courseLanguage = code;
    LangyState.subscription.plan = plan;
    LangyState.subscription.billingPeriod = billingPeriod;
    LangyState.subscription.status = status;
    LangyState.subscription.startedAt = startedAt;
    LangyState.subscription.renewsAt = renewsAt;
    LangyState.subscription.entitlements = buildCourseEntitlements(code, plan);

    if (!LangyState.user) LangyState.user = {};
    LangyState.user.targetLanguageConfirmed = true;
    archiveInactiveLanguageProgress(code);
    activateTargetLanguage(code, { force: true, saveCurrent: false, persist: false });
    clearPendingCourseLanguage();

    if (options.persist !== false && typeof LangyDB !== 'undefined') {
        LangyDB.saveProgress().catch(() => {});
    }
    return true;
}

function migrateCourseEntitlement(options = {}) {
    normalizeSubscriptionState();
    const locked = getLockedCourseLanguage();
    if (locked) {
        archiveInactiveLanguageProgress(locked);
        return locked;
    }

    const inferred = inferLegacyCourseLanguage();
    if (!inferred) return null;

    LangyState.courseLanguage = inferred;
    LangyState.subscription.courseLanguage = inferred;
    LangyState.subscription.plan = LangyState.subscription.plan || 'legacy';
    LangyState.subscription.billingPeriod = LangyState.subscription.billingPeriod || null;
    LangyState.subscription.status = LangyState.subscription.status === 'none' ? 'legacy' : LangyState.subscription.status;
    LangyState.subscription.startedAt = LangyState.subscription.startedAt || new Date().toISOString();
    LangyState.subscription.renewsAt = LangyState.subscription.renewsAt || null;
    LangyState.subscription.entitlements = buildCourseEntitlements(inferred, LangyState.subscription.plan);
    if (!LangyState.user) LangyState.user = {};
    LangyState.user.targetLanguageConfirmed = true;
    archiveInactiveLanguageProgress(inferred);

    if (options.activate !== false) {
        activateTargetLanguage(inferred, { force: true, saveCurrent: false, persist: false });
    }
    return inferred;
}

function hasConfirmedTargetLanguage() {
    return isValidTargetLanguageCode(LangyState.targetLanguage) && LangyState.user?.targetLanguageConfirmed === true;
}

function resolveTextbookForLanguage(code, preferredLevel) {
    if (!isValidTargetLanguageCode(code) || typeof LangyCurriculum === 'undefined') return null;
    const textbooks = Array.isArray(LangyCurriculum.textbooks) ? LangyCurriculum.textbooks : [];
    if (!textbooks.length) return null;

    const languageTextbooks = textbooks.filter(tb => (tb.language || 'en') === code);
    if (!languageTextbooks.length) return null;

    const level = preferredLevel || LangyState.settings?.languageLevel || 'Pre-A1';
    return (
        languageTextbooks.find(tb => tb.id === LangyCurriculum.activeTextbookId) ||
        languageTextbooks.find(tb => tb.id === LangyState.languageProgress?.[code]?.activeTextbookId) ||
        languageTextbooks.find(tb => tb.cefr === level) ||
        languageTextbooks.find(tb => tb.cefr === 'Pre-A1') ||
        languageTextbooks.find(tb => tb.cefr === 'A1') ||
        languageTextbooks[0]
    );
}

function createLanguageProgress(code) {
    const progress = cloneStateValue(DEFAULT_STATE.progress);
    const textbook = resolveTextbookForLanguage(code);
    const firstUnit = textbook?.units?.[0] || null;

    progress.language = code;
    progress.activeTextbookId = textbook?.id || null;
    progress.currentUnitId = firstUnit?.id || 1;
    progress.currentLessonIdx = 0;
    progress.currentUnit = firstUnit?.title || 'Unit 1';
    progress.totalTopics = textbook?.units?.length || progress.totalTopics;
    progress.topicsCompleted = 0;
    progress.overall = 0;
    progress.lessonHistory = [];
    progress.recentTopics = [];
    progress.reviewQueue = [];
    progress.mastery = {};

    return progress;
}

function mergeProgressShape(existingProgress, code) {
    const base = createLanguageProgress(code);

    function deepMerge(target, source) {
        if (!source || typeof source !== 'object') return target;
        for (const key of Object.keys(source)) {
            const value = source[key];
            if (value && typeof value === 'object' && !Array.isArray(value) && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                deepMerge(target[key], value);
            } else if (value !== undefined) {
                target[key] = value;
            }
        }
        return target;
    }

    deepMerge(base, existingProgress || {});
    base.language = code;
    if (!Array.isArray(base.lessonHistory)) base.lessonHistory = [];
    if (!Array.isArray(base.recentTopics)) base.recentTopics = [];
    if (!Array.isArray(base.reviewQueue)) base.reviewQueue = [];
    if (!base.mastery || typeof base.mastery !== 'object') base.mastery = {};

    const textbook = resolveTextbookForLanguage(code, LangyState.settings?.languageLevel);
    if (!base.activeTextbookId && textbook) base.activeTextbookId = textbook.id;
    if (textbook?.units?.length) {
        base.totalTopics = textbook.units.length;
        const currentUnit = textbook.units.find(unit => unit.id === base.currentUnitId) || textbook.units[0];
        base.currentUnitId = currentUnit.id;
        base.currentUnit = currentUnit.title;
    }

    return base;
}

function ensureLanguageProgressStore() {
    if (!LangyState.languageProgress || typeof LangyState.languageProgress !== 'object' || Array.isArray(LangyState.languageProgress)) {
        LangyState.languageProgress = {};
    }

    LANGY_TARGET_CODES.forEach(code => {
        if (LangyState.languageProgress[code]) {
            LangyState.languageProgress[code] = mergeProgressShape(LangyState.languageProgress[code], code);
        }
    });
}

function applyTargetLanguageDocumentState(code) {
    if (typeof document === 'undefined') return;

    const cfg = typeof LangyTarget !== 'undefined' ? LangyTarget.LANGUAGES?.[code] : null;
    const direction = cfg?.direction || 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.dataset.targetLanguage = code || 'none';

    if (document.body?.classList) {
        LANGY_TARGET_CODES.forEach(langCode => document.body.classList.remove(`langy-target--${langCode}`));
        if (isValidTargetLanguageCode(code)) document.body.classList.add(`langy-target--${code}`);
    }
}

function applyCurriculumLanguageState(code, progress) {
    if (!isValidTargetLanguageCode(code) || typeof LangyCurriculum === 'undefined') return;

    LangyCurriculum.targetLanguage = code;
    const textbook =
        (Array.isArray(LangyCurriculum.textbooks) && LangyCurriculum.textbooks.find(tb => tb.id === progress?.activeTextbookId && (tb.language || 'en') === code)) ||
        resolveTextbookForLanguage(code, LangyState.settings?.languageLevel);

    if (textbook) {
        LangyCurriculum.activeTextbookId = textbook.id;
        progress.activeTextbookId = textbook.id;
        const currentUnit = textbook.units?.find(unit => unit.id === progress.currentUnitId) || textbook.units?.[0] || null;
        if (currentUnit) {
            progress.currentUnitId = currentUnit.id;
            progress.currentUnit = currentUnit.title;
            progress.totalTopics = textbook.units.length;
        }
        if (LangyState.aiMemory) LangyState.aiMemory.currentTextbookId = textbook.id;
    }
}

function syncCurrentProgressToLanguage() {
    const code = LangyState.targetLanguage;
    if (!isValidTargetLanguageCode(code) || !LangyState.progress) return false;

    ensureLanguageProgressStore();
    LangyState.languageProgress[code] = mergeProgressShape(LangyState.progress, code);
    return true;
}

function getLanguageProgress(code) {
    if (!isValidTargetLanguageCode(code)) return null;
    ensureLanguageProgressStore();
    if (!LangyState.languageProgress[code]) {
        LangyState.languageProgress[code] = createLanguageProgress(code);
    }
    return LangyState.languageProgress[code];
}

function activateTargetLanguage(code, options = {}) {
    if (!isValidTargetLanguageCode(code)) {
        console.warn(`[LangyState] Unsupported target language: ${code}`);
        return false;
    }
    if (!canActivateTargetLanguage(code, options)) {
        const locked = getLockedCourseLanguage();
        console.warn(`[LangyState] Course language is locked to ${locked}; rejected ${code}`);
        return false;
    }

    const previous = LangyState.targetLanguage;
    if (options.saveCurrent !== false && isValidTargetLanguageCode(previous)) {
        syncCurrentProgressToLanguage();
    }

    ensureLanguageProgressStore();
    LangyState.targetLanguage = code;
    if (!LangyState.user) LangyState.user = {};
    LangyState.user.targetLanguageConfirmed = true;

    LangyState.languageProgress[code] = mergeProgressShape(LangyState.languageProgress[code] || createLanguageProgress(code), code);
    LangyState.progress = LangyState.languageProgress[code];

    applyCurriculumLanguageState(code, LangyState.progress);
    applyTargetLanguageDocumentState(code);

    if (options.persist !== false && typeof LangyDB !== 'undefined') {
        LangyDB.saveProgress().catch(() => {});
    }

    return true;
}

function restoreActiveLanguageState() {
    ensureLanguageProgressStore();
    normalizeSubscriptionState();
    const lockedCourse = migrateCourseEntitlement({ activate: false });
    if (isValidTargetLanguageCode(lockedCourse)) {
        activateTargetLanguage(lockedCourse, { force: true, saveCurrent: false, persist: false });
    } else if (hasConfirmedTargetLanguage()) {
        activateTargetLanguage(LangyState.targetLanguage, { force: true, saveCurrent: false, persist: false });
    } else {
        LangyState.targetLanguage = null;
        if (LangyState.user) LangyState.user.targetLanguageConfirmed = false;
        applyTargetLanguageDocumentState(null);
    }
}

// ─── LEVEL UP CHECK ───
// Call after any XP change to detect level boundaries
function checkLevelUp(oldXp, newXp) {
    const oldLevel = Math.floor(oldXp / LangyConfig.XP_PER_LEVEL) + 1;
    const newLevel = Math.floor(newXp / LangyConfig.XP_PER_LEVEL) + 1;

    if (newLevel > oldLevel) {
        // Level up!
        const dangyReward = newLevel * 25;
        const langyReward = newLevel >= 5 ? 10 : 0;
        LangyState.currencies.dangy += dangyReward;
        LangyState.currencies.langy += langyReward;

        setTimeout(() => {
            if (typeof Anim !== 'undefined') {
                // Show level-up celebration overlay
                showLevelUpOverlay(newLevel, dangyReward, langyReward);
            }
        }, 600);

        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
    }
}

// Level up celebration overlay
function showLevelUpOverlay(level, dangy, langy) {
    const overlay = document.createElement('div');
    overlay.id = 'levelup-overlay';
    overlay.innerHTML = `
        <div style="
            position:fixed; inset:0; z-index:9999;
            background:linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.95));
            display:flex; flex-direction:column;
            align-items:center; justify-content:center;
            animation: overlayFadeIn 0.4s ease;
            backdrop-filter: blur(8px);
            padding: 32px; text-align: center;
        ">
            <div style="font-size:80px; animation: streakIconPulse 1s ease infinite alternate; filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3));">${LangyIcons.rocket}</div>
            <h2 style="color:#fff; font-size:28px; font-weight:900; margin:20px 0 8px; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">Level ${level}!</h2>
            <p style="color:rgba(255,255,255,0.9); font-size:16px; margin:0 0 16px;">You've reached a new level!</p>
            <div style="display:flex; gap:16px; margin-bottom:24px;">
                <div style="background:rgba(255,255,255,0.15); border-radius:12px; padding:12px 20px; text-align:center;">
                    <div style="color:#F59E0B; font-size:20px; font-weight:900;">+${dangy}</div>
                    <div style="color:rgba(255,255,255,0.7); font-size:11px;">Dangy</div>
                </div>
                ${
                    langy > 0
                        ? `<div style="background:rgba(255,255,255,0.15); border-radius:12px; padding:12px 20px; text-align:center;">
                    <div style="color:#818CF8; font-size:20px; font-weight:900;">+${langy}</div>
                    <div style="color:rgba(255,255,255,0.7); font-size:11px;">Langy</div>
                </div>`
                        : ''
                }
            </div>
            <button onclick="this.closest('#levelup-overlay').remove()" style="
                background:rgba(255,255,255,0.2); color:#fff;
                border:2px solid rgba(255,255,255,0.4);
                border-radius:50px; padding:12px 40px;
                font-size:16px; font-weight:700; cursor:pointer;
                font-family: inherit;
            ">Awesome!</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        if (overlay.parentNode) overlay.remove();
    }, LangyConfig.OVERLAY_AUTO_DISMISS_MS);
}

// ─── EVENT PROGRESS ───
// Tracks real progress toward active events
function updateEventProgress({ duration = 0, wordsLearned = 0, accuracy = 0, category = 'grammar' } = {}) {
    if (!LangyState.eventProgress) LangyState.eventProgress = {};
    const today = new Date().toISOString().split('T')[0];
    const ep = LangyState.eventProgress;

    // Initialize daily counters
    if (!ep._date || ep._date !== today) {
        ep._date = today;
        ep._todayLessons = 0;
        ep._todayWords = 0;
        ep._todayMinutes = 0;
        ep._todayPerfect = 0;
        ep._todayGrammar = 0;
        ep._todaySpeaking = 0;
        ep._todayListening = 0;
    }

    ep._todayLessons++;
    ep._todayWords += wordsLearned;
    ep._todayMinutes += duration;
    if (accuracy === 100) ep._todayPerfect++;
    if (category === 'grammar') ep._todayGrammar++;
    if (category === 'speaking') ep._todaySpeaking++;
    if (category === 'listening') ep._todayListening++;

    // Cumulative
    ep.totalLessons = (ep.totalLessons || 0) + 1;
    ep.totalWords = (ep.totalWords || 0) + wordsLearned;
    ep.totalMinutes = (ep.totalMinutes || 0) + duration;
    ep.totalPerfect = (ep.totalPerfect || 0) + (accuracy === 100 ? 1 : 0);
    ep.totalGrammar = (ep.totalGrammar || 0) + (category === 'grammar' ? 1 : 0);
    ep.totalSpeaking = (ep.totalSpeaking || 0) + (category === 'speaking' ? 1 : 0);
    ep.totalListening = (ep.totalListening || 0) + (category === 'listening' ? 1 : 0);
}

function getDefaultState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function getStateSnapshot() {
    return JSON.parse(JSON.stringify(LangyState));
}

function loadFromSnapshot(data) {
    data = data || {};
    const snapshotCourseCode = isValidTargetLanguageCode(data.subscription?.courseLanguage)
        ? data.subscription.courseLanguage
        : isValidTargetLanguageCode(data.courseLanguage)
          ? data.courseLanguage
          : data.user?.targetLanguageConfirmed === true && isValidTargetLanguageCode(data.targetLanguage)
            ? data.targetLanguage
            : null;

    function deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (
                source[key] &&
                typeof source[key] === 'object' &&
                !Array.isArray(source[key]) &&
                target[key] &&
                typeof target[key] === 'object' &&
                !Array.isArray(target[key])
            ) {
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    deepMerge(LangyState, data);

    if (!snapshotCourseCode) {
        LangyState.targetLanguage = null;
        LangyState.courseLanguage = null;
        if (!LangyState.user) LangyState.user = {};
        LangyState.user.targetLanguageConfirmed = false;
    } else {
        LangyState.targetLanguage = snapshotCourseCode;
        LangyState.courseLanguage = snapshotCourseCode;
        LangyState.user.targetLanguageConfirmed = true;
        if (!LangyState.languageProgress) LangyState.languageProgress = {};
        if (!LangyState.languageProgress[snapshotCourseCode]) {
            LangyState.languageProgress[snapshotCourseCode] = mergeProgressShape(data.progress, snapshotCourseCode);
        }
    }

    LangyState.interfaceLocale = LangyState.settings?.interfaceLang || LangyState.interfaceLocale || 'en';
    normalizeSubscriptionState();
    migrateCourseEntitlement({ activate: false });

    // Always keep template content from code (prevents stale cached emojis)
    const fresh = getDefaultState();
    LangyState.shop.items = fresh.shop.items;
    LangyState.duels.modes = fresh.duels.modes;
    LangyState.duels.questions = fresh.duels.questions;
    // Sync inventory icons with current shop catalog
    if (LangyState.inventory && LangyState.inventory.items) {
        LangyState.inventory.items.forEach(inv => {
            const si = LangyState.shop.items.find(s => s.id === inv.id);
            if (si) inv.emoji = si.emoji;
        });
    }
    // Refresh CEFR badge icons (keep earned status)
    if (fresh.progress && fresh.progress.cefrBadges && LangyState.progress && LangyState.progress.cefrBadges) {
        for (const level of Object.keys(fresh.progress.cefrBadges)) {
            if (LangyState.progress.cefrBadges[level]) {
                LangyState.progress.cefrBadges[level].badge = fresh.progress.cefrBadges[level].badge;
            }
        }
    }

    restoreActiveLanguageState();
}

function resetState() {
    const defaults = getDefaultState();
    Object.keys(defaults).forEach(key => {
        LangyState[key] = defaults[key];
    });
    restoreActiveLanguageState();
}

// ─── NAMESPACE: LangyApp ───
// Organizes all loose global functions under a single, discoverable API.
// Old function names still work (backward compat) but new code should use LangyApp.xxx
const LangyApp = {
    // State management
    getState,
    setState,
    getDefaultState,
    getStateSnapshot,
    loadFromSnapshot,
    resetState,
    isValidTargetLanguageCode,
    hasConfirmedTargetLanguage,
    hasLockedCourseLanguage,
    getCourseLanguage,
    getLockedCourseLanguage,
    getPendingCourseLanguage,
    setPendingCourseLanguage,
    clearPendingCourseLanguage,
    activateCourseEntitlement,
    migrateCourseEntitlement,
    normalizeSubscriptionState,
    activateTargetLanguage,
    syncCurrentProgressToLanguage,
    getLanguageProgress,
    restoreActiveLanguageState,

    // Session & Streak
    recordSession,
    getStreakReward,

    // Leveling
    checkLevelUp,
    showLevelUpOverlay,

    // Events
    updateEventProgress,

    // Utility: get local date string (YYYY-MM-DD) — single source of truth
    getLocalDateString(date) {
        const d = date || new Date();
        return (
            d.getFullYear() +
            '-' +
            String(d.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(d.getDate()).padStart(2, '0')
        );
    },
};
