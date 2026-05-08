/* ============================================
   VOCAB MASTERY — Spec-compliant mastery engine
   MVP vocab spec v1: 4 states, compact tracking
   ============================================ */

const VocabMastery = (() => {
    'use strict';

    // ── Access helper: get or init mastery store ──
    function _store() {
        if (!LangyState.vocabMastery) LangyState.vocabMastery = {};
        return LangyState.vocabMastery;
    }

    // ── Get mastery entry for a word (or null if new) ──
    function get(wordId) {
        return _store()[wordId] || null;
    }

    // ── Get mastery state string ──
    function getState(wordId) {
        const entry = get(wordId);
        return entry ? entry.m : 'new';
    }

    // ── Mark word as SEEN (displayed in lesson or suggestion) ──
    function markSeen(wordId) {
        const store = _store();
        if (store[wordId]) return; // already beyond 'new'
        store[wordId] = { m: 'seen', c: 0, i: 0, s: 0, t: Date.now() };
        _save();
    }

    // ── Mark word as used in a session (correct or incorrect) ──
    // sessionId: any unique per-session string (prevents double-counting)
    function recordUse(wordId, correct, sessionId) {
        const store = _store();
        if (!store[wordId]) {
            store[wordId] = { m: 'seen', c: 0, i: 0, s: 0, t: Date.now() };
        }
        const entry = store[wordId];
        entry.t = Date.now();

        if (correct) entry.c++;
        else entry.i++;

        // Track distinct sessions
        if (!entry._sessions) entry._sessions = [];
        if (sessionId && !entry._sessions.includes(sessionId)) {
            entry._sessions.push(sessionId);
            entry.s = entry._sessions.length;
            // Cap stored session list at 10
            if (entry._sessions.length > 10) entry._sessions = entry._sessions.slice(-10);
        }

        // ── State transitions ──
        // seen → practiced: any use
        if (entry.m === 'seen') {
            entry.m = 'practiced';
        }

        // practiced → known: 3+ correct across 2+ sessions
        if (entry.m === 'practiced' && entry.c >= 3 && entry.s >= 2) {
            entry.m = 'known';
        }

        // known → practiced (demotion): 2+ incorrect recently
        if (entry.m === 'known' && entry.i >= 2) {
            entry.m = 'practiced';
            entry.i = 0; // reset to prevent immediate re-demotion
        }

        _save();
    }

    // ── Batch mark seen (for lesson vocab intro) ──
    function markSeenBatch(wordIds) {
        wordIds.forEach(id => markSeen(id));
    }

    // ── Get summary stats for a language ──
    function getSummary(langPrefix) {
        const store = _store();
        let seen = 0, practiced = 0, known = 0;

        for (const [id, entry] of Object.entries(store)) {
            if (langPrefix && !id.startsWith(langPrefix + '_')) continue;
            switch (entry.m) {
                case 'seen': seen++; break;
                case 'practiced': practiced++; break;
                case 'known': known++; break;
            }
        }

        return { seen, practiced, known, total: seen + practiced + known };
    }

    // ── Get vocab bank size for profile denominator ──
    function getBankSize(langPrefix, cefr) {
        // Resolve correct bank per language
        let bank = null;
        if (langPrefix === 'ar' && typeof LangyARVocabBank !== 'undefined') bank = LangyARVocabBank;
        else if (langPrefix === 'es' && typeof LangyESVocabBank !== 'undefined') bank = LangyESVocabBank;
        else if (typeof LangyVocabBank !== 'undefined') bank = LangyVocabBank;
        if (!bank) return 0;
        if (cefr && bank[cefr] && bank[cefr].getAllWords) {
            return bank[cefr].getAllWords().length;
        }
        return typeof bank.getTotalCount === 'function' ? bank.getTotalCount() : 0;
    }

    // ── Profile card data ──
    function getProfileCard(langPrefix, cefr) {
        const summary = getSummary(langPrefix);
        const bankSize = getBankSize(langPrefix, cefr);
        const pct = bankSize > 0 ? Math.round((summary.total / bankSize) * 100) : 0;

        return {
            known: summary.known,
            practicing: summary.practiced,
            seen: summary.seen,
            total: summary.total,
            bankSize,
            pct,
        };
    }

    // ── Mastery label/color/icon ──
    function label(state) {
        const labels = { new: 'New', seen: 'Seen', practiced: 'Practicing', known: 'Solid' };
        return labels[state] || 'New';
    }

    function color(state) {
        const colors = {
            new: 'var(--text-tertiary, #6b7280)',
            seen: '#9ca3af',
            practiced: '#3b82f6',
            known: '#f59e0b',
        };
        return colors[state] || colors.new;
    }

    function icon(state) {
        const icons = { new: '', seen: '👁', practiced: '🔄', known: '✅' };
        return icons[state] || '';
    }

    // ── Save ──
    function _save() {
        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
    }

    return {
        get,
        getState,
        markSeen,
        markSeenBatch,
        recordUse,
        getSummary,
        getBankSize,
        getProfileCard,
        label,
        color,
        icon,
    };
})();
