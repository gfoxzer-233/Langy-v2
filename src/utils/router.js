/* ============================================
   LANGY — ROUTER (Hash-based SPA)
   + ScreenState: centralized screen-level state
   ============================================ */

// ─── SCREEN STATE ───
// ScreenState is now defined in core.js (loaded before this file).
// It provides: get(), set(), has(), remove(), onCleanup(), clear(), debug()
// Old code using ScreenState.persist() should use window-level storage instead.

// Add backward-compat methods if needed
if (typeof ScreenState !== 'undefined' && !ScreenState._persistent) {
    ScreenState._persistent = new Set();
    ScreenState.persist = function (key) {
        this._persistent.add(key);
    };
    const originalClear = ScreenState.clear.bind(ScreenState);
    ScreenState._clearTransient = function () {
        // Only clear non-persistent keys
        const keysToDelete = Object.keys(this._data).filter(k => !this._persistent.has(k));
        keysToDelete.forEach(k => delete this._data[k]);
        // Still run cleanup callbacks
        this._cleanupCallbacks.forEach(fn => {
            try {
                fn();
            } catch (e) {}
        });
        this._cleanupCallbacks = [];
    };
    ScreenState.clearAll = function () {
        this._persistent.clear();
        originalClear();
    };
}

/**
 * @namespace Router
 * @description Hash-based SPA router with screen cleanup and ScreenState integration.
 */
const Router = {
    /** @type {Object<string, Function>} Registered route handlers */
    routes: {},
    /** @type {string|null} Currently active route name */
    currentRoute: null,
    /** @type {Object<string, Function>} Per-screen cleanup callbacks */
    _cleanupFns: {},
    /** @type {Object} Current route parameters */
    _routeParams: {},

    /**
     * Register a route handler.
     * @param {string} path - Route name (e.g. 'home', 'profile')
     * @param {Function} renderFn - Function that renders the screen into a container
     * @param {Function} [cleanupFn] - Optional cleanup function called on navigation away
     */
    register(path, renderFn, cleanupFn) {
        this.routes[path] = renderFn;
        if (cleanupFn) this._cleanupFns[path] = cleanupFn;
    },

    /**
     * Navigate to a route.
     * @param {string} path - Route name
     * @param {Object} [params={}] - Optional parameters accessible via Router.getParams()
     */
    navigate(path, params = {}) {
        this._routeParams = params;
        window.location.hash = path;
    },

    /**
     * Get parameters passed to the current route.
     * @returns {Object}
     */
    getParams() {
        return this._routeParams || {};
    },

    /**
     * Initialize the router — listen for hash changes and render initial route.
     */
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || 'auth';

        // Auth guard: redirect to auth if not logged in
        if (hash !== 'auth' && typeof LangyDB !== 'undefined' && LangyDB.db && !LangyDB.currentUser) {
            window.location.hash = 'auth';
            return;
        }

        // Course entitlement gate: logged-in learners must activate one paid course.
        if (
            hash !== 'auth' &&
            hash !== 'onboarding' &&
            hash !== 'subscription' &&
            typeof LangyDB !== 'undefined' &&
            LangyDB.currentUser &&
            typeof LangyApp !== 'undefined' &&
            !LangyApp.hasLockedCourseLanguage()
        ) {
            ScreenState.set('onboardingStep', 2);
            window.location.hash = 'onboarding';
            return;
        }

        if (
            hash === 'subscription' &&
            typeof LangyDB !== 'undefined' &&
            LangyDB.currentUser &&
            typeof LangyApp !== 'undefined' &&
            !LangyApp.hasLockedCourseLanguage() &&
            !LangyApp.getPendingCourseLanguage()
        ) {
            ScreenState.set('onboardingStep', 2);
            window.location.hash = 'onboarding';
            return;
        }

        if (
            hash !== 'auth' &&
            hash !== 'onboarding' &&
            hash !== 'subscription' &&
            typeof LangyDB !== 'undefined' &&
            LangyDB.currentUser &&
            typeof LangyApp !== 'undefined' &&
            LangyApp.hasLockedCourseLanguage() &&
            !LangyState.user?.hasCompletedOnboarding
        ) {
            ScreenState.set('targetLangChoice', LangyApp.getCourseLanguage());
            ScreenState.set('onboardingStep', 3);
            window.location.hash = 'onboarding';
            return;
        }

        // Run cleanup for previous screen
        if (this.currentRoute && this.currentRoute !== hash) {
            const cleanup = this._cleanupFns[this.currentRoute];
            if (typeof cleanup === 'function') {
                try {
                    cleanup();
                } catch (e) {
                    console.warn('Cleanup error:', e);
                }
            }
            // Clear transient screen state on navigation
            ScreenState._clearTransient();
        }

        // Auto-save progress on navigation
        if (this.currentRoute && hash !== this.currentRoute && typeof LangyDB !== 'undefined' && LangyDB.currentUser) {
            LangyDB.saveProgress().catch(e => console.warn('Nav save:', e));
        }

        const renderFn = this.routes[hash];
        if (renderFn) {
            this.currentRoute = hash;

            // Toggle DeepTutor Visibility based on route
            if (typeof DeepTutor !== 'undefined') {
                if (hash === 'learning') {
                    DeepTutor.show();
                } else {
                    DeepTutor.hide();
                }
            }

            Anim.transitionTo(() => {
                const container = document.getElementById('screen-container');
                container.innerHTML = '';
                try {
                    renderFn(container);
                } catch (e) {
                    console.error(`[Router] Screen '${hash}' crashed:`, e);
                    if (typeof LangyLogger !== 'undefined') {
                        LangyLogger.error('Router.handleRoute', `Screen '${hash}' crashed`, e);
                    }
                    container.innerHTML = `
                        <div style="padding:32px;text-align:center;color:var(--text-secondary);">
                            <div style="font-size:48px;margin-bottom:16px;">${typeof LangyIcons !== 'undefined' ? LangyIcons.alertTriangle : '!'}</div>
                            <h3>Something went wrong</h3>
                            <p style="font-size:14px;margin:8px 0 16px;">Screen "${escapeHTML(hash)}" failed to load.</p>
                            <button class="btn btn--primary" onclick="Router.navigate('home')">Go Home</button>
                        </div>
                    `;
                }
                window.scrollTo(0, 0);
            });

            // Update bottom nav
            this._updateBottomNav(hash);
        }
    },

    // ─── BOTTOM NAV BAR ───
    // Screens where bottom nav should be hidden
    _hideNavRoutes: new Set([
        'auth',
        'onboarding',
        'learning',
        'placement-test',
        'mascot-select',
        'interests',
        'subscription',
    ]),

    _navTabs: [
        { route: 'home', icon: 'home', labelKey: 'nav.home' },
        { route: 'results', icon: 'barChart', labelKey: 'nav.learn' },
        { route: 'profile', icon: 'user', labelKey: 'nav.profile' },
    ],

    _updateBottomNav(currentHash) {
        let nav = document.getElementById('bottom-nav');

        // Hide nav on certain screens
        if (this._hideNavRoutes.has(currentHash)) {
            if (nav) nav.style.display = 'none';
            document.getElementById('screen-container')?.classList.remove('has-bottom-nav');
            return;
        }

        // Create nav if it doesn't exist
        if (!nav) {
            nav = document.createElement('nav');
            nav.id = 'bottom-nav';
            nav.className = 'bottom-nav';
            document.getElementById('app').appendChild(nav);
        }

        nav.style.display = '';
        document.getElementById('screen-container')?.classList.add('has-bottom-nav');

        // Render tabs
        nav.innerHTML = this._navTabs
            .map(tab => {
                const isActive = currentHash === tab.route;
                const icon = typeof LangyIcons !== 'undefined' ? LangyIcons[tab.icon] : '';
                const label = typeof i18n !== 'undefined' ? i18n(tab.labelKey) : tab.route;
                return `
                <button class="bottom-nav__tab ${isActive ? 'bottom-nav__tab--active' : ''}" 
                        data-route="${tab.route}" aria-label="${label}">
                    <span class="bottom-nav__icon">${icon}</span>
                    <span class="bottom-nav__label">${label}</span>
                </button>
            `;
            })
            .join('');

        // Bind click handlers
        nav.querySelectorAll('.bottom-nav__tab').forEach(btn => {
            btn.addEventListener('click', () => {
                const route = btn.dataset.route;
                if (route !== currentHash) {
                    Router.navigate(route);
                }
            });
        });
    },

    back() {
        window.history.back();
    },
};
