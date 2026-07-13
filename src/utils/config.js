/* ============================================
   LANGY — APP CONFIGURATION & CONSTANTS
   Single source of truth for all magic numbers,
   thresholds, and configurable values.
   ============================================ */

/**
 * @namespace LangyConfig
 * @description Centralized configuration constants for the Langy app.
 * All magic numbers and thresholds should be defined here.
 */
const LangyConfig = Object.freeze({
    // ── APP META ──
    APP_NAME: 'Langy AI',
    APP_VERSION: '2.4.0',
    CACHE_VERSION: 12,

    // ── XP & LEVELING ──
    XP_PER_LEVEL: 500,
    XP_LESSON_BASE: 25,
    XP_PERFECT_BONUS: 15,
    XP_STREAK_MULTIPLIER: 1.5,

    // ── STREAKS ──
    STREAK_FREEZE_PRICE: 200, // Dangy cost per freeze
    STREAK_MAX_FREEZES: 3, // Max freezes a user can hold
    STREAK_AUTO_DISMISS_MS: 6000, // Auto-dismiss streak overlay

    // ── CURRENCIES ──
    CURRENCY: {
        PREMIUM: 'langy',
        EARNED: 'dangy',
    },

    // ── LESSON & EXERCISE ──
    EXERCISES_PER_LESSON: 8,
    MAX_SKIPS_PER_UNIT: 2,
    PASS_THRESHOLD: 70, // % score to pass a unit
    MASTERY_THRESHOLD: 90, // % score for mastery badge

    // ── TIMERS ──
    AUTO_SAVE_INTERVAL_MS: 30000, // Auto-save every 30s
    TOAST_DURATION_MS: 3000, // Toast notification display time
    OVERLAY_AUTO_DISMISS_MS: 8000, // Level-up overlay auto-dismiss
    DEBOUNCE_DELAY_MS: 300, // Input debounce

    // ── DUEL ──
    DUEL_QUESTION_TIME_MS: 15000, // 15s per duel question
    DUEL_WIN_REWARD: 50, // Dangy for winning
    DUEL_LOSS_REWARD: 10, // Dangy consolation

    // ── DAILY CHALLENGE ──
    DAILY_REWARD_DANGY: 50,
    DAILY_TIME_LIMIT_S: 14400, // 4 hours

    // ── SHOP ──
    SHOP_CATEGORIES: ['hat', 'accessory', 'skin', 'sticker', 'consumable'],

    // ── CEFR LEVELS ──
    CEFR_LEVELS: ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    CEFR_GRADED: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],

    // ── SUPPORTED LANGUAGES ──
    INTERFACE_LANGS: ['en', 'ru', 'es'],
    DEFAULT_LANG: 'en',

    // ── ANIMATION ──
    STAGGER_DELAY_MS: 80,
    TRANSITION_DURATION_MS: 300,
    HAPTIC_PATTERNS: {
        light: 10,
        medium: 25,
        heavy: 50,
        success: [10, 50, 10],
        error: [50, 30, 50],
    },

    // ── ROUTES ──
    /** Routes that show the bottom navigation bar */
    NAV_ROUTES: [
        'home',
        'results',
        'profile',
        'shop',
        'textbooks',
        'duels',
        'events',
        'homework',
        'calendar',
        'tests',
        'daily',
        'donation',
        'streak',
        'subscription',
        'inventory',
    ],
    /** Routes that hide the bottom nav (fullscreen flows) */
    FULLSCREEN_ROUTES: ['auth', 'onboarding', 'interests', 'mascot-select', 'placement-test', 'learning'],

    // ── API ──
    AI_MAX_CONTEXT_MESSAGES: 20,
    AI_TEMPERATURE: 0.7,
    AI_MAX_TOKENS: 1024,

    // ── ACCESSIBILITY ──
    MIN_TOUCH_TARGET_PX: 44, // WCAG minimum touch target
    FOCUS_VISIBLE_OUTLINE: '2px solid var(--primary)',
});

// Freeze nested objects
Object.freeze(LangyConfig.CURRENCY);
Object.freeze(LangyConfig.HAPTIC_PATTERNS);
