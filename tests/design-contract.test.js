import { describe, expect, it, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

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

describe('Commercial visual design contracts', () => {
    it('uses the Langy indigo/lavender commercial palette in app shell files', () => {
        const variables = read('styles/variables.css');
        const index = read('index.html');
        const manifest = JSON.parse(read('manifest.json'));

        expect(variables).toContain('--primary: #5B4DFF');
        expect(variables).toContain('--bg: #FBF8F3');
        expect(variables).toContain('--surface-alt: #F7F2FF');
        expect(variables).toContain('--success: #13B981');
        expect(variables).toContain('--danger: #F25F5C');
        expect(variables).toContain('--accent: #F7B733');
        expect(variables).not.toContain('--primary:      #10B981');
        expect(index).toContain('content="#5B4DFF"');
        expect(manifest.theme_color).toBe('#5B4DFF');
        expect(manifest.background_color).toBe('#FBF8F3');
    });

    it('defines production button, choice, voice, navigation, and reduced-motion primitives', () => {
        const components = read('styles/components.css');
        const screens = read('styles/screens.css');

        expect(components).toContain('.choice-card');
        expect(components).toContain('.circular-voice-button');
        expect(components).toContain('aspect-ratio: 1 / 1');
        expect(components).toContain('border-radius: 50%');
        expect(components).toContain('.navigation-item');
        expect(screens).toContain('.talk-call__btn--mic');
        expect(screens).toContain('@media (prefers-reduced-motion: reduce)');
        expect(screens).toContain('.home-talk-orb');
    });

    it('keeps Home focused: one primary CTA, one Talk entry, no course switcher, no bottom Talk tab', () => {
        const container = makeContainer();
        vi.restoreAllMocks();
        resetState();
        mockAnim();
        LangyI18n.currentLang = 'en';
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyTarget.set('en', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 1;

        renderHome(container);
        Router._updateBottomNav('home');

        expect(container.querySelectorAll('#home-priority-stack .btn--primary')).toHaveLength(1);
        expect(container.querySelector('#home-talk-open')).toBeInstanceOf(HTMLButtonElement);
        expect(container.querySelector('#home-talk-open').classList.contains('home-talk-orb')).toBe(true);
        expect(container.querySelectorAll('[data-home-language], .home-language-switcher')).toHaveLength(0);
        expect([...document.querySelectorAll('#bottom-nav [data-route]')].map(el => el.dataset.route)).toEqual([
            'home',
            'results',
            'profile',
        ]);
    });

    it('keeps Talk recommendations out of Home continuity actions', () => {
        const container = makeContainer();
        vi.restoreAllMocks();
        resetState();
        mockAnim();
        LangyI18n.currentLang = 'en';
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyTarget.set('en', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.progress.currentUnitId = 2;
        LangyState.progress.lessonHistory = [
            { status: 'done', title: 'Intro sounds', score: 86, date: '2026-07-14T10:00:00.000Z' },
        ];

        renderHome(container);

        expect(container.querySelectorAll('#home-talk-open')).toHaveLength(1);
        expect([...container.querySelectorAll('.next-action-card, .next-action-alt')]
            .filter(el => el.dataset.route === 'talk')).toHaveLength(0);
    });

    it('preserves Home Talk launch state through router navigation and hides bottom nav on Talk', () => {
        const container = makeContainer();
        vi.restoreAllMocks();
        resetState();
        mockAnim();
        LangyI18n.currentLang = 'en';
        LangyCurriculum.activeTextbookId = 'pre_a1_starter';
        LangyApp.activateCourseEntitlement('en', { persist: false });
        LangyState.user.hasCompletedOnboarding = true;
        LangyState.user.hasCompletedPlacement = true;
        LangyState.mascot.selected = 3;
        LangyDB.db = {};
        LangyDB.currentUser = { email: 'test@example.com' };
        LangyDB.saveProgress = vi.fn().mockResolvedValue();
        window.scrollTo = vi.fn();
        Router.routes = {};
        Router.currentRoute = 'home';
        Router._cleanupFns = {};
        Router.register('talk', target => {
            target.innerHTML = `<div id="talk-state">${ScreenState.get('talkView', 'missing')}</div>`;
        });

        renderHome(container);
        Router._updateBottomNav('home');
        click(container.querySelector('#home-talk-open'));
        click(document.querySelector('[data-talk-mode="free"]'));
        Router.handleRoute();
        Router._updateBottomNav('talk');

        expect(ScreenState.get('talkView')).toBe('call');
        expect(ScreenState.get('talkScenario')).toBe('free');
        expect(ScreenState.get('talkMascot')).toBe(3);
        expect(document.querySelector('#talk-state').textContent).toBe('call');
        expect(document.querySelector('#bottom-nav').style.display).toBe('none');
    });

    it('does not ship placeholder anchors or empty inline onclick handlers in production source', () => {
        const source = [
            ...['src', 'index.html'].flatMap(path => {
                if (path === 'index.html') return [['index.html', read('index.html')]];
                return [
                    ['src/screens/auth.js', read('src/screens/auth.js')],
                    ['src/screens/home.js', read('src/screens/home.js')],
                    ['src/screens/learning.js', read('src/screens/learning.js')],
                    ['src/utils/router.js', read('src/utils/router.js')],
                ];
            }),
        ];

        source.forEach(([file, text]) => {
            expect(text, `${file} must not contain href="#"`).not.toContain('href="#"');
            expect(text, `${file} must not contain empty onclick`).not.toMatch(/onclick=(["'])\s*\1/);
        });
    });
});
