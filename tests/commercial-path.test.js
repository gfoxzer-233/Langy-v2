import { beforeEach, describe, expect, it, vi } from 'vitest';

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

async function flush() {
    await Promise.resolve();
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
}

describe('Commercial critical path screens', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        makeContainer();
        resetState();
        ScreenState.clearAll?.();
        mockAnim();
        LangyDB.saveProgress = vi.fn().mockResolvedValue();
        LangyDB.currentUser = { email: 'learner@example.com' };
    });

    it('requires a course selection before checkout and renders product details', () => {
        const container = document.getElementById('screen-container');
        ScreenState.set('onboardingStep', 2);

        renderOnboarding(container);

        expect(container.querySelector('#onboarding-next').disabled).toBe(true);
        expect(container.textContent).toContain('Langy Coach from $12/mo');
        expect(container.textContent).toContain('review checkpoints');

        click(container.querySelector('[data-lang="es"]'));

        expect(ScreenState.get('targetLangChoice')).toBe('es');
        expect(container.querySelector('#onboarding-next').disabled).toBe(false);
        expect(container.querySelector('[data-lang="es"]').getAttribute('aria-pressed')).toBe('true');
    });

    it('does not inherit a previous course entitlement into a fresh account snapshot', () => {
        const container = document.getElementById('screen-container');

        LangyApp.activateCourseEntitlement('en', { persist: false });
        LangyState.progress.currentUnitId = 3;
        LangyApp.syncCurrentProgressToLanguage();

        const freshAccount = getDefaultState();
        freshAccount.user.email = 'fresh@example.com';
        freshAccount.user.hasCompletedOnboarding = false;
        freshAccount.user.targetLanguageConfirmed = false;

        loadFromSnapshot(freshAccount);
        ScreenState.set('onboardingStep', 2);
        renderOnboarding(container);

        expect(LangyApp.hasLockedCourseLanguage()).toBe(false);
        expect(container.textContent).toContain('Choose your course');
        expect(container.textContent).not.toContain('Why are you learning English?');
    });

    it('protects sandbox checkout from double submit and locks the purchased course', async () => {
        const container = document.getElementById('screen-container');
        LangyApp.setPendingCourseLanguage('es');
        ScreenState.set('checkoutPlan', 'coach_monthly');
        ScreenState.set('checkoutStep', 'confirm');
        LangyDB.saveProgress = vi.fn().mockResolvedValue();
        const activateSpy = vi.spyOn(LangyApp, 'activateCourseEntitlement');
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        renderSubscription(container);
        const pay = container.querySelector('#checkout-pay');
        click(pay);
        click(pay);

        expect(activateSpy).toHaveBeenCalledTimes(1);
        expect(pay.disabled).toBe(true);
        expect(pay.dataset.loading).toBe('true');

        await flush();

        expect(LangyApp.getCourseLanguage()).toBe('es');
        expect(LangyState.subscription.entitlements).toContain('course:es');
        expect(navSpy).toHaveBeenCalledWith('onboarding');
    });

    it('opens course map nodes into a real lesson overview and starts that lesson', () => {
        const container = document.getElementById('screen-container');
        LangyState.settings.languageLevel = 'Pre-A1';
        LangyApp.activateCourseEntitlement('en', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 1;
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        renderCourseMap(container);
        expect(container.querySelectorAll('.course-map-node').length).toBeGreaterThan(0);
        expect(container.textContent).toContain('8 tasks');
        click(container.querySelector('.course-map-node--current'));

        expect(ScreenState.get('lessonOverviewTextbookId')).toBe('pre_a1_starter');
        expect(ScreenState.get('lessonOverviewUnitId')).toBe(1);
        expect(navSpy).toHaveBeenLastCalledWith('lesson-overview', {
            textbookId: 'pre_a1_starter',
            unitId: 1,
        });

        navSpy.mockClear();
        renderLessonOverview(container);
        expect(container.textContent).toContain('The English Alphabet');
        expect(container.textContent).toContain('Vocabulary');
        expect(container.textContent).toContain('Grammar');
        expect(container.textContent).toContain('Estimated time');
        expect(container.textContent).toContain('8 tasks');

        click(container.querySelector('#lesson-overview-start'));
        expect(navSpy).toHaveBeenLastCalledWith('learning', {
            textbookId: 'pre_a1_starter',
            unitId: 1,
        });
    });

    it('renders locked lesson overview safely and keeps review usable when the queue is empty', () => {
        const container = document.getElementById('screen-container');
        LangyState.settings.languageLevel = 'Pre-A1';
        LangyApp.activateCourseEntitlement('en', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 1;
        ScreenState.set('lessonOverviewTextbookId', 'pre_a1_starter');
        ScreenState.set('lessonOverviewUnitId', 3);
        const navSpy = vi.spyOn(Router, 'navigate').mockImplementation(() => {});

        renderLessonOverview(container);
        expect(container.textContent).toContain('Lesson locked');
        expect(container.querySelector('#lesson-overview-start')).toBeNull();
        click(container.querySelector('#lesson-overview-map-cta'));
        expect(navSpy).toHaveBeenCalledWith('course-map');

        navSpy.mockClear();
        renderReview(container);
        expect(container.textContent).toContain('Review queue is healthy');
        click(container.querySelector('#review-start'));
        expect(navSpy).toHaveBeenCalledWith('learning', { mode: 'review', unitId: 1 });
    });
});
