import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function makeContainer() {
    document.body.innerHTML = '<div id="app"><div id="screen-container"></div></div>';
    return document.getElementById('screen-container');
}

function mockAnim() {
    globalThis.Anim = {
        showToast: vi.fn(),
        staggerChildren: vi.fn(),
        ripple: vi.fn(),
        flyOut: vi.fn(),
        haptic: vi.fn(),
        transitionTo: fn => fn(),
        initPullToRefresh: vi.fn(),
    };
    window.Anim = globalThis.Anim;
}

function click(el) {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

async function flush(ms = 0) {
    if (ms > 0) await vi.advanceTimersByTimeAsync(ms);
    await Promise.resolve();
}

describe('Curriculum validation', () => {
    it('validates every textbook, unit, and exercise in the curriculum', () => {
        const result = LangyCurriculumValidator.validate(LangyCurriculum);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.stats.textbooks).toBe(9);
        expect(result.stats.units).toBe(108);
        expect(result.stats.exercises).toBe(956);
    });
});

describe('DEV LOGIN', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        makeContainer();
        ScreenState.clear();
        mockAnim();
    });

    it('logs in through the development shortcut and routes to home', async () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});
        vi.spyOn(LangyDB, 'register').mockResolvedValue({ email: 'test@example.com' });
        vi.spyOn(LangyDB, 'login').mockResolvedValue({ email: 'test@example.com' });
        LangyDB.startAutoSave = vi.fn();

        renderAuth(container);
        click(container.querySelector('#auth-dev-login'));
        for (let i = 0; i < 6; i++) await flush();

        expect(LangyDB.login).toHaveBeenCalledWith('test@example.com', '123456');
        expect(navSpy).toHaveBeenCalledWith('home');
    });
});

describe('Exercise widgets', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.restoreAllMocks();
        makeContainer();
        const speechSynthesisMock = {
            cancel: vi.fn(),
            speak: vi.fn(utterance => {
                if (utterance?.onend) setTimeout(utterance.onend, 0);
            }),
        };
        globalThis.speechSynthesis = speechSynthesisMock;
        window.speechSynthesis = speechSynthesisMock;
        globalThis.SpeechSynthesisUtterance = function SpeechSynthesisUtterance(text) {
            this.text = text;
        };
        window.SpeechSynthesisUtterance = globalThis.SpeechSynthesisUtterance;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders fill-bubble with a blank and accepts a correct answer', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'fill-bubble', {
            sentence: 'I ___ ready.',
            options: ['am', 'is'],
            correct: 0,
        }, done);
        click(container.querySelector('.bubble-btn[data-idx="0"]'));
        await flush(1300);

        expect(done).toHaveBeenCalledWith(true);
        expect(container.querySelector('.widget__blank--correct')).toBeTruthy();
    });

    it('renders fill-bubble without a blank as safe multiple choice and handles wrong answers', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'fill-bubble', {
            sentence: 'Which is a vowel?',
            options: ['B', 'A', 'D'],
            correct: 1,
        }, done);
        click(container.querySelector('.bubble-btn[data-idx="0"]'));
        await flush(1300);

        expect(done).toHaveBeenCalledWith(false);
        expect(container.querySelector('.widget__blank')).toBeNull();
        expect(container.querySelector('.bubble-btn--correct')?.textContent).toContain('A');
    });

    it('renders match-pairs and completes matching', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'match-pairs', {
            pairs: [
                { left: 'I', right: 'am' },
                { left: 'He', right: 'is' },
            ],
        }, done);

        for (const pair of [['I', 'am'], ['He', 'is']]) {
            click([...container.querySelectorAll('#match-left .match-card')].find(b => b.textContent === pair[0]));
            click([...container.querySelectorAll('#match-right .match-card')].find(b => b.textContent === pair[1]));
        }
        await flush(1300);

        expect(done).toHaveBeenCalledWith(true);
    });

    it('renders word-shuffle and checks the selected order', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'word-shuffle', {
            words: ['I', 'am', 'ready'],
            correct: ['I', 'am', 'ready'],
        }, done);

        for (const word of ['I', 'am', 'ready']) {
            const chip = [...container.querySelectorAll('#ws-bank .word-chip')].find(b => b.dataset.word === word);
            click(chip);
        }
        click(container.querySelector('.widget__check'));
        await flush(1300);

        expect(done).toHaveBeenCalledWith(true);
    });

    it('renders type-translation and checks answers', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'type-translation', {
            sourceText: 'Я готов.',
            answer: 'I am ready',
        }, done);
        container.querySelector('#tt-input').value = 'I am ready';
        click(container.querySelector('#tt-check'));
        await flush(1300);

        expect(done).toHaveBeenCalledWith(true);
    });

    it('renders listen-type even when audio is unavailable and checks typed text', async () => {
        delete globalThis.speechSynthesis;
        delete window.speechSynthesis;
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'listen-type', {
            text: 'Hello',
            hint: 'Greeting',
        }, done);
        container.querySelector('#lt-input').value = 'Hello';
        click(container.querySelector('#lt-check'));
        await flush(1300);

        expect(done).toHaveBeenCalledWith(true);
    });

    it('renders speak-aloud and lets unsupported speech recognition skip safely', async () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'speak-aloud', {
            phrase: 'Hello',
        }, done);
        click(container.querySelector('#sa-skip'));

        expect(done).toHaveBeenCalledWith('skipped');
    });

    it('renders read-answer and image-choice', async () => {
        const container = document.getElementById('screen-container');
        const readDone = vi.fn();

        LangyWidgets.render(container, 'read-answer', {
            passage: 'Tom is a doctor.',
            question: 'What is Tom?',
            options: ['Teacher', 'Doctor'],
            correct: 1,
        }, readDone);
        click(container.querySelector('.bubble-btn[data-idx="1"]'));
        await flush(1300);
        expect(readDone).toHaveBeenCalledWith(true);

        container.innerHTML = '';
        const imageDone = vi.fn();
        LangyWidgets.render(container, 'image-choice', {
            word: 'Apple',
            options: [{ emoji: 'A', label: 'Apple' }, { emoji: 'B', label: 'Book' }],
            correct: 0,
        }, imageDone);
        click(container.querySelector('.image-choice-card[data-idx="0"]'));
        await flush(1300);
        expect(imageDone).toHaveBeenCalledWith(true);
    });

    it('shows a safe exercise error state for damaged data and allows continuing', () => {
        const done = vi.fn();
        const container = document.getElementById('screen-container');

        LangyWidgets.render(container, 'match-pairs', { pairs: null }, done);
        expect(container.textContent).toContain('Exercise unavailable');
        click(container.querySelector('#widget-continue'));
        expect(done).toHaveBeenCalledWith(false);
    });
});

describe('First lesson critical path', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.restoreAllMocks();
        makeContainer();
        resetState();
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.user.firstLessonCompleted = false;
        LangyState.user.confidenceLevel = 'basic';
        LangyState.progress.currentUnitId = 1;
        LangyState.progress.lessonHistory = [];
        LangyState.progress.mastery = {};
        LangyState.user.xp = 0;
        LangyDB.saveProgress = vi.fn().mockResolvedValue();
        mockAnim();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('starts on home without stale unit text and completes lesson one through summary', async () => {
        const container = document.getElementById('screen-container');
        const unit = LangyCurriculum.getActive().units[0];
        const originalSlides = unit.teachSlides;
        unit.teachSlides = [];
        const originalRender = LangyWidgets.render;
        vi.spyOn(LangyWidgets, 'render').mockImplementation((target, type, data, onComplete) => {
            target.innerHTML = `<div data-testid="stub-widget">${type}</div>`;
            onComplete(true);
        });

        renderHome(container);
        expect(container.textContent).toContain('The English Alphabet');
        expect(container.textContent).not.toContain('Getting Started');

        renderLearning(container);
        click(container.querySelector('#start-lesson'));

        for (let i = 0; i < LangyConfig.EXERCISES_PER_LESSON + 1; i++) {
            await flush(1500);
        }

        expect(container.querySelector('.lesson-summary')).toBeTruthy();
        expect(LangyState.user.xp).toBeGreaterThan(0);
        expect(LangyState.progress.lessonHistory).toHaveLength(1);
        expect(LangyState.progress.mastery['pre_a1_starter:1'].passed).toBe(true);
        expect(LangyState.progress.currentUnitId).toBe(2);
        expect(LangyDB.saveProgress).toHaveBeenCalled();

        const snapshot = getStateSnapshot();
        resetState();
        loadFromSnapshot(snapshot);
        expect(LangyState.progress.currentUnitId).toBe(2);
        expect(LangyState.progress.lessonHistory).toHaveLength(1);

        unit.teachSlides = originalSlides;
        LangyWidgets.render = originalRender;
    });

    it('keeps lessons usable when AI is unavailable', async () => {
        vi.spyOn(LangyAI, 'chat').mockRejectedValue(new Error('offline'));
        const fallback = await LangyAI.safeChat('hello', {
            retries: 0,
            fallbackMessage: 'AI offline fallback',
        });
        expect(fallback).toBe('AI offline fallback');
    });
});
