/* ============================================
   VOCAB SPEAKING BRIDGE
   Wires vocab bank → speaking session:
   - Vocab-driven hints (replaces static hints)
   - markSeen on suggestion display
   - recordUse on session end (word detection)
   ============================================ */

const VocabSpeaking = (() => {
    'use strict';

    // ── Scenario → vocab categories mapping ──
    const SCENARIO_CATEGORIES = {
        coffee:     ['food', 'greetings', 'common'],
        restaurant: ['food', 'greetings', 'common'],
        airport:    ['places', 'common', 'greetings'],
        shopping:   ['shopping', 'clothes', 'objects', 'common'],
        doctor:     ['health_basic', 'body', 'common'],
        roommate:   ['daily_routines', 'objects', 'adjectives', 'common'],
        interview:  ['jobs', 'common', 'abstract'],
        free:       ['greetings', 'common', 'adjectives', 'food'],
    };

    // ── Get vocab-driven hints for a scenario ──
    // Returns up to `count` phrases from the vocab bank matching the scenario
    function getVocabHints(scenarioId, count = 5) {
        if (typeof LangyVocabBank === 'undefined') return [];

        const categories = SCENARIO_CATEGORIES[scenarioId] || SCENARIO_CATEGORIES.free;
        const cefr = LangyState?.settings?.languageLevel || 'A1';
        const level = LangyVocabBank[cefr];
        if (!level) return [];

        // Collect words from matching categories that have phrases
        const candidates = [];
        for (const cat of categories) {
            const words = level[cat];
            if (Array.isArray(words)) {
                for (const w of words) {
                    if (w.phrase) candidates.push(w);
                }
            }
        }

        if (candidates.length === 0) return [];

        // Prefer words the learner hasn't mastered yet
        const prioritized = candidates.sort((a, b) => {
            if (typeof VocabMastery === 'undefined') return 0;
            const mA = VocabMastery.getState(a.id);
            const mB = VocabMastery.getState(b.id);
            const order = { new: 0, seen: 1, practiced: 2, known: 3 };
            return (order[mA] || 0) - (order[mB] || 0);
        });

        // Pick `count` from prioritized, with some randomness in top candidates
        const pool = prioritized.slice(0, Math.min(20, prioritized.length));
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    // ── Get a single hint phrase (for the 30s silence hint) ──
    function getRandomHint(scenarioId) {
        const hints = getVocabHints(scenarioId, 8);
        if (hints.length === 0) return null;
        const pick = hints[Math.floor(Math.random() * hints.length)];

        // Mark as seen (invisible to user)
        if (typeof VocabMastery !== 'undefined' && pick.id) {
            VocabMastery.markSeen(pick.id);
        }

        return {
            text: pick.phrase,
            word: pick.target || pick.en,
            id: pick.id,
            native: pick.phraseNative,
        };
    }

    // ── Session ID generator ──
    function _sessionId() {
        return 'talk_' + Date.now();
    }

    // ── Track vocab in user's speech after a turn ──
    // Called with the user's text. Finds any vocab words they used.
    // Returns array of matched word ids.
    function detectWordsInSpeech(userText, scenarioId) {
        if (typeof LangyVocabBank === 'undefined') return [];
        if (!userText || userText.length < 2) return [];

        const cefr = LangyState?.settings?.languageLevel || 'A1';
        const level = LangyVocabBank[cefr];
        if (!level) return [];

        const textLower = userText.toLowerCase();
        const matched = [];

        // Check all categories for this level
        const allWords = level.getAllWords ? level.getAllWords() : [];
        for (const w of allWords) {
            const target = (w.target || w.en || '').toLowerCase();
            if (target.length >= 2 && textLower.includes(target)) {
                matched.push(w);
            }
        }

        return matched;
    }

    // ── Process end-of-session vocab tracking ──
    // Called when the speaking session ends. Scans all user messages
    // and records vocab usage in VocabMastery.
    function processSessionEnd(userMessages, scenarioId) {
        if (typeof VocabMastery === 'undefined') return { wordsUsed: 0, wordsSeen: 0 };
        if (!userMessages || userMessages.length === 0) return { wordsUsed: 0, wordsSeen: 0 };

        const sid = _sessionId();
        const allMatched = new Set();

        for (const msg of userMessages) {
            const words = detectWordsInSpeech(msg, scenarioId);
            for (const w of words) {
                if (w.id && !allMatched.has(w.id)) {
                    allMatched.add(w.id);
                    VocabMastery.recordUse(w.id, true, sid);
                }
            }
        }

        return { wordsUsed: allMatched.size, wordsSeen: 0 };
    }

    // ── Inject vocab context into AI system prompt ──
    // Returns a short string with 3-5 suggested vocab words for the AI to weave in
    function getAIVocabContext(scenarioId) {
        const hints = getVocabHints(scenarioId, 5);
        if (hints.length === 0) return '';

        const wordList = hints.map(w =>
            `${w.target || w.en} (${w.native || w.ru})`
        ).join(', ');

        return `\nVOCABULARY SUPPORT — These words match the learner's level and this scenario. Naturally weave 1-2 into the conversation when appropriate: ${wordList}. Do NOT list them or drill them — use them naturally in context.`;
    }

    return {
        SCENARIO_CATEGORIES,
        getVocabHints,
        getRandomHint,
        detectWordsInSpeech,
        processSessionEnd,
        getAIVocabContext,
    };
})();
