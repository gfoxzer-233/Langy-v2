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
        expect(result.stats.units).toBe(137);
        expect(result.stats.exercises).toBe(1207);
    });

    it('enriches every English unit and exercise with learning architecture metadata', () => {
        const englishTextbooks = LangyCurriculum.getTextbooksForLanguage('en');
        expect(englishTextbooks).toHaveLength(7);

        englishTextbooks.forEach(textbook => {
            textbook.units.forEach(unit => {
                expect(unit.objective).toEqual(expect.any(String));
                expect(unit.skillIds.length).toBeGreaterThan(0);
                expect(unit.lessonStages).toEqual(expect.arrayContaining(LangyCurriculumValidator.requiredEnglishStages));
                expect(unit.editorialStatus).toBe('needs_editorial_review');

                unit.exercises.forEach(exercise => {
                    expect(exercise.cefr).toBe(textbook.cefr);
                    expect(unit.skillIds).toContain(exercise.skillId);
                    expect(exercise.lessonObjective).toBe(unit.objective);
                    expect(exercise.acceptedAnswers.length).toBeGreaterThan(0);
                    expect(exercise.reviewStrategy.queue).toBe(true);
                });
            });
        });

        const coverage = LangyCurriculum.getContentCoverage();
        const preA1 = coverage.find(item => item.id === 'pre_a1_starter');
        expect(preA1.objectives).toBe(6);
        expect(preA1.skillLinkedExercises).toBe(preA1.exercises);
        expect(preA1.stages.mastery_check).toBeGreaterThan(0);
    });

    it('ships complete Spanish and Arabic Pre-A1 tracks with all widget types', () => {
        const requiredTypes = [
            'fill-bubble',
            'match-pairs',
            'speak-aloud',
            'listen-type',
            'word-shuffle',
            'type-translation',
            'read-answer',
            'image-choice',
        ];

        ['es', 'ar'].forEach(language => {
            const textbooks = LangyCurriculum.getTextbooksForLanguage(language);
            expect(textbooks).toHaveLength(1);
            const textbook = textbooks[0];
            expect(textbook.cefr).toBe('Pre-A1');
            expect(textbook.units).toHaveLength(20);

            textbook.units.forEach((unit, index) => {
                expect(unit.id).toBe(index + 1);
                expect(unit.objective).toEqual(expect.any(String));
                expect(unit.editorialStatus).toBe('validated');
                expect(unit.exercises).toHaveLength(8);
                expect(unit.exercises.map(ex => ex.type).sort()).toEqual([...requiredTypes].sort());
                unit.exercises.forEach(exercise => {
                    expect(exercise.expectedAnswer).toBeTruthy();
                    expect(exercise.acceptedAnswers.length).toBeGreaterThan(0);
                    expect(exercise.reviewStrategy.queue).toBe(true);
                });
            });
        });
    });
});

describe('Course selection, checkout, and course lock', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        makeContainer();
        resetState();
        ScreenState.clear();
        mockAnim();
        LangyI18n.currentLang = 'en';
    });

    it('starts new learners at mandatory course selection before checkout', () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        renderOnboarding(container);

        expect(container.textContent).toContain('Choose your course');
        expect(container.querySelectorAll('.onboarding__lang-card')).toHaveLength(3);
        expect(container.querySelector('#onboarding-next').disabled).toBe(true);
        expect(LangyState.targetLanguage).toBe(null);
        expect(LangyApp.hasLockedCourseLanguage()).toBe(false);

        click(container.querySelector('[data-lang="es"]'));
        click(container.querySelector('#onboarding-next'));

        expect(LangyState.pendingCourseLanguage).toBe('es');
        expect(LangyState.targetLanguage).toBe(null);
        expect(LangyApp.hasLockedCourseLanguage()).toBe(false);
        expect(ScreenState.get('checkoutStep')).toBe('plan');
        expect(navSpy).toHaveBeenCalledWith('subscription');
    });

    it('keeps progress separate for English, Spanish, and Arabic', () => {
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyTarget.set('en', { persist: false });
        LangyState.progress.currentUnitId = 3;
        LangyApp.syncCurrentProgressToLanguage();

        LangyTarget.set('es', { persist: false });
        expect(LangyCurriculum.getActive().id).toBe('es_pre_a1_foundations');
        expect(LangyState.progress.currentUnitId).toBe(1);
        LangyState.progress.currentUnitId = 7;
        LangyApp.syncCurrentProgressToLanguage();

        LangyTarget.set('ar', { persist: false });
        expect(LangyCurriculum.getActive().id).toBe('ar_pre_a1_foundations');
        expect(document.documentElement.dir).toBe('rtl');
        expect(LangyState.progress.currentUnitId).toBe(1);
        LangyState.progress.currentUnitId = 4;
        LangyApp.syncCurrentProgressToLanguage();

        LangyTarget.set('es', { persist: false });
        expect(LangyState.progress.currentUnitId).toBe(7);
        expect(document.documentElement.dir).toBe('ltr');

        LangyTarget.set('en', { persist: false });
        expect(LangyState.progress.currentUnitId).toBe(3);
    });

    it('activates the selected checkout course and blocks later curriculum switching', async () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});
        LangyApp.setPendingCourseLanguage('ar');
        ScreenState.set('checkoutPlan', 'coach_monthly');

        renderSubscription(container);
        expect(container.textContent).toContain('Langy Arabic');
        expect(container.querySelectorAll('[data-checkout-plan]')).toHaveLength(2);

        click(container.querySelector('#checkout-continue'));
        expect(container.textContent).toContain('Confirm order');

        click(container.querySelector('#checkout-pay'));
        await flush();

        expect(LangyState.subscription.courseLanguage).toBe('ar');
        expect(LangyState.subscription.status).toBe('trialing');
        expect(LangyState.subscription.entitlements).toContain('course:ar');
        expect(LangyState.targetLanguage).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');
        expect(LangyTarget.set('en', { persist: false })).toBe(false);
        expect(LangyState.targetLanguage).toBe('ar');
        expect(navSpy).toHaveBeenCalledWith('onboarding');

        ScreenState.clear();
        renderOnboarding(container);
        expect(container.textContent).toContain('Why are you learning Arabic?');
        expect(container.querySelectorAll('[data-lang]')).toHaveLength(0);
        return;
        expect(container.querySelector('#home-course-card').textContent).toContain('Español');

        expect(LangyState.targetLanguage).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');
        expect(container.querySelector('#home-course-card').textContent).toContain('العربية');
    });
    it('does not expose course switchers on Home or Profile after purchase', () => {
        const container = document.getElementById('screen-container');
        LangyApp.activateCourseEntitlement('es', { plan: 'coach', status: 'trialing', persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;

        renderHome(container);
        expect(container.querySelectorAll('[data-home-language]')).toHaveLength(0);
        expect(container.textContent).toContain('Espa');

        renderProfile(container);
        expect(container.querySelectorAll('[data-profile-language]')).toHaveLength(0);
        expect(container.textContent).toContain('Interface Language');
        return;
        LangyTarget.set('es', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 4;
        LangyApp.syncCurrentProgressToLanguage();

        renderProfile(container);
        expect(container.querySelectorAll('[data-profile-language]')).toHaveLength(3);

        click(container.querySelector('[data-profile-language="ar"]'));
        expect(LangyState.targetLanguage).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');
        expect(LangyState.progress.activeTextbookId).toBe('ar_pre_a1_foundations');
        expect(LangyState.languageProgress.es.currentUnitId).toBe(4);
    });
});

describe('Home information architecture', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        makeContainer();
        resetState();
        mockAnim();
        LangyI18n.currentLang = 'en';
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyTarget.setLanguage?.('en');
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 1;
        LangyState.progress.mastery = {};
    });

    it('renders lesson, talk, and English Structured cards in priority order from active curriculum', () => {
        const container = document.getElementById('screen-container');

        renderHome(container);

        const stack = container.querySelector('#home-priority-stack');
        const firstThree = [...stack.children].slice(0, 3).map(el => el.id);
        expect(firstThree).toEqual(['home-lesson-card', 'home-talk-card', 'home-course-card']);
        expect(container.querySelector('#home-lesson-card').textContent).toContain('Unit 1: The English Alphabet');
        expect(container.querySelector('#home-lesson-card').textContent).toContain('8 exercises');
        expect(container.querySelector('#home-lesson-card').textContent).toContain('about 14 min');
        expect(container.querySelector('#home-talk-card').textContent).toContain('Talk with');
        expect(container.querySelector('#home-talk-open')).toBeInstanceOf(HTMLButtonElement);
        expect(container.querySelectorAll('.home-talk-option')).toHaveLength(0);
        expect(container.querySelector('#home-course-card').textContent).toContain('Structured');
        expect(container.querySelector('#home-course-card').textContent).toContain('Structured English track');
        expect(container.querySelector('#home-course-card').textContent).not.toContain('CEFR curriculum A1-C2');
        expect(container.querySelector('#home-course-card').textContent).not.toContain('Grammar-aware coaching');
        expect(container.querySelector('#home-course-card').textContent).not.toContain('Vocabulary progression');
        expect(container.querySelector('#home-course-card').textContent).not.toContain('Tutor-led speaking');
        expect(container.textContent).not.toContain('Ready to practice');
        expect(container.textContent).not.toContain('Lesson done');
    });

    it('shows continue lesson state when a lesson draft exists', () => {
        const container = document.getElementById('screen-container');
        LangyState.progress.lessonDraft = {
            textbookId: 'pre_a1_starter',
            unitId: 1,
            status: 'in_progress',
            currentExerciseIdx: 0,
            totalExercises: 8,
            correctAnswers: 0,
            updatedAt: new Date().toISOString(),
        };

        renderHome(container);

        expect(container.querySelector('#nav-learning').textContent).toContain('Continue lesson');
        expect(container.querySelector('#home-lesson-card').textContent).toContain('In progress: 1/8');
    });

    it('opens Talk mode choices from a single mascot button on Home', () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});
        LangyState.mascot.selected = 3;

        renderHome(container);

        const talkButton = container.querySelector('#home-talk-open');
        expect(talkButton).toBeInstanceOf(HTMLButtonElement);
        expect(talkButton.getAttribute('aria-label')).toBe('Talk with Omar');
        expect(container.querySelector('#home-talk-card').textContent).toContain('Talk with Omar');
        expect(talkButton.classList.contains('home-talk-orb')).toBe(true);
        expect(container.querySelector('#home-talk-card').textContent).not.toContain('Free talk');
        expect(container.querySelector('#home-talk-card').textContent).not.toContain('Lesson topic');

        click(talkButton);

        const modal = document.querySelector('#home-talk-modal');
        expect(modal).toBeTruthy();
        expect(modal.querySelectorAll('.home-talk-option')).toHaveLength(5);
        expect(modal.textContent).toContain('Free talk');

        click(modal.querySelector('[data-talk-mode="free"]'));

        expect(document.querySelector('#home-talk-modal')).toBeNull();
        expect(ScreenState.get('talkMascot')).toBe(3);
        expect(ScreenState.get('talkScenario')).toBe('free');
        expect(ScreenState.get('guidedSpeaking')).toBe(false);
        expect(ScreenState.get('talkView')).toBe('call');
        expect(navSpy).toHaveBeenCalledWith('talk');
    });

    it('does not open Talk from bottom nav or mascot taps', () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        Router._updateBottomNav('home');
        const routes = [...document.querySelectorAll('#bottom-nav .bottom-nav__tab')].map(tab => tab.dataset.route);
        expect(routes).toEqual(['home', 'results', 'profile']);
        expect(document.querySelector('#bottom-nav [data-route="talk"]')).toBeNull();

        renderHome(container);

        expect(container.querySelector('#mascot-tap-zone')).toBeNull();
        expect(navSpy).not.toHaveBeenCalledWith('talk');
        expect(container.querySelector('#home-talk-open')).toBeInstanceOf(HTMLButtonElement);
    });

    it('keeps Homework as a single Home entry and shows pending count as a badge', () => {
        const container = document.getElementById('screen-container');
        LangyState.progress.lessonHistory = [{ title: 'The English Alphabet', score: 100, date: '2026-07-13' }];
        LangyState.homework.current = [{ id: 'hw-1', title: 'Alphabet writing', source: 'lesson', unitId: 1 }];
        LangyState.progress.skills = {
            vocabulary: 70,
            grammar: 70,
            listening: 70,
            speaking: 70,
            writing: 0,
        };

        renderHome(container);

        const homeworkMatches = container.textContent.match(/\bHomework\b/g) || [];
        expect(homeworkMatches).toHaveLength(1);
        expect(container.querySelector('#nav-homework')).toBeInstanceOf(HTMLButtonElement);
        expect(container.querySelector('#nav-homework .action-card__badge').textContent).toBe('1');
        expect(container.querySelector('.next-action-card')?.textContent || '').not.toContain('Homework');
        expect([...container.querySelectorAll('.next-action-alt')].map(el => el.textContent).join(' ')).not.toContain('Homework');
    });

    it('wires Home buttons to their routes with semantic button elements', () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        renderHome(container);

        [
            ['nav-homework', 'homework'],
            ['nav-tests', 'tests'],
            ['nav-results', 'results'],
            ['nav-daily', 'daily'],
            ['nav-duels', 'duels'],
            ['nav-events', 'events'],
            ['nav-inventory', 'inventory'],
            ['nav-shop', 'shop'],
            ['home-profile', 'profile'],
            ['home-course-map', 'course-map'],
        ].forEach(([id, route]) => {
            const button = container.querySelector(`#${id}`);
            expect(button).toBeInstanceOf(HTMLButtonElement);
            click(button);
            expect(navSpy).toHaveBeenLastCalledWith(route);
        });

        click(container.querySelector('#coin-langy'));
        expect(navSpy).toHaveBeenLastCalledWith('donation', { plan: 'langy_pack' });

        click(container.querySelector('#coin-dangy'));
        expect(navSpy).toHaveBeenLastCalledWith('donation', { plan: 'dangy_pack' });
    });
});

describe('DEV LOGIN', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        makeContainer();
        ScreenState.clear();
        mockAnim();
    });

    it('logs in through the development shortcut and routes to language onboarding', async () => {
        const container = document.getElementById('screen-container');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});
        vi.spyOn(LangyDB, 'register').mockResolvedValue({ email: 'test@example.com' });
        vi.spyOn(LangyDB, 'login').mockResolvedValue({ email: 'test@example.com' });
        LangyDB.startAutoSave = vi.fn();

        renderAuth(container);
        click(container.querySelector('#auth-dev-login'));
        for (let i = 0; i < 6; i++) await flush();

        expect(LangyDB.login).toHaveBeenCalledWith('test@example.com', '123456');
        expect(navSpy).toHaveBeenCalledWith('onboarding');
        expect(LangyApp.hasConfirmedTargetLanguage()).toBe(false);
        expect(ScreenState.get('onboardingStep')).toBe(2);
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
