/* ============================================
   SCREEN: AUTH (Login / Signup)
   ============================================ */

function renderAuth(container) {
    const isLogin = ScreenState.get('authMode', 'login') !== 'signup';
    const isDevHost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '';

    container.innerHTML = `
        <div class="screen auth">
            <div class="auth__mascot">
                <div class="mascot-placeholder mascot-placeholder--sm" style="border-radius:50%;">
                </div>
            </div>

            <div class="auth__logo">
                <img src="assets/logo.png" alt="Langy" style="width: 80px; height: auto; margin: 0 auto 8px; display: block;">
                <h1>${i18n('app.name')}</h1>
                <p>${i18n('auth.subtitle')}</p>
            </div>

            <div class="tabs" id="auth-tabs">
                <button class="tabs__tab ${isLogin ? 'tabs__tab--active' : ''}" data-tab="login">${i18n('auth.login')}</button>
                <button class="tabs__tab ${!isLogin ? 'tabs__tab--active' : ''}" data-tab="signup">${i18n('auth.register')}</button>
            </div>

            <form class="auth__form" id="auth-form">
                ${
                    !isLogin
                        ? `
                <div class="input-group">
                    <label for="auth-name">${i18n('auth.name')}</label>
                    <input class="input" type="text" id="auth-name" placeholder="${i18n('auth.name')}" autocomplete="name">
                </div>`
                        : ''
                }

                <div class="input-group">
                    <label for="auth-email">${i18n('auth.email')}</label>
                    <input class="input" type="email" id="auth-email" placeholder="you@example.com" autocomplete="email">
                </div>

                <div class="input-group">
                    <label for="auth-password">${i18n('auth.password')}</label>
                    <input class="input" type="password" id="auth-password" placeholder="••••••••" autocomplete="${isLogin ? 'current-password' : 'new-password'}">
                </div>

                <button type="submit" class="btn btn--primary btn--lg btn--full" id="auth-submit">
                    ${isLogin ? i18n('auth.login') : i18n('auth.register')}
                </button>
                <div class="auth__error" id="auth-error"></div>
            </form>

            <div class="divider--text">${{ en: 'or continue with', ru: 'или войти через', es: 'o continuar con' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en']}</div>

            <div class="auth__social">
                <button type="button" class="btn" id="auth-google">
                    <span>G</span> Google
                </button>
                <button type="button" class="btn" id="auth-apple">
                    <span>${LangyIcons.apple || LangyIcons.globe}</span> Apple
                </button>
            </div>
            
            ${
                isDevHost
                    ? `
            <div style="margin-top:var(--sp-4);">
                <button type="button" class="btn btn--outline" id="auth-dev-login" style="width:100%; border-color:var(--primary); color:var(--primary);">
                    ${LangyIcons.zap} DEV FAST LOGIN (Skip Tests)
                </button>
            </div>
            `
                    : ''
            }

            <p class="auth__footer">
                ${
                    isLogin
                        ? i18n('auth.no_account') + ' <button type="button" class="auth__link" id="auth-switch">' + i18n('auth.register') + '</button>'
                        : i18n('auth.have_account') + ' <button type="button" class="auth__link" id="auth-switch">' + i18n('auth.login') + '</button>'
                }
            </p>
        </div>
    `;

    // Tab switching
    container.querySelectorAll('.tabs__tab').forEach(tab => {
        tab.addEventListener('click', () => {
            ScreenState.set('authMode', tab.dataset.tab === 'signup' ? 'signup' : 'login');
            renderAuth(container);
        });
    });

    // Switch link
    const switchLink = container.querySelector('#auth-switch');
    if (switchLink) {
        switchLink.addEventListener('click', e => {
            e.preventDefault();
            ScreenState.set('authMode', isLogin ? 'signup' : 'login');
            renderAuth(container);
        });
    }

    // Form submit — real auth
    container.querySelector('#auth-form').addEventListener('submit', async e => {
        e.preventDefault();
        const errorEl = container.querySelector('#auth-error');
        const submitBtn = container.querySelector('#auth-submit');

        const email = container.querySelector('#auth-email')?.value.trim();
        const password = container.querySelector('#auth-password')?.value;
        const name = !isLogin ? container.querySelector('#auth-name')?.value.trim() : '';

        // Validation
        if (!email || !password) {
            errorEl.textContent = 'Please fill in all fields';
            errorEl.style.display = 'block';
            return;
        }
        if (!isLogin && !name) {
            errorEl.textContent = 'Please enter your name';
            errorEl.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            errorEl.textContent = 'Password must be at least 6 characters';
            errorEl.style.display = 'block';
            return;
        }

        errorEl.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = isLogin ? 'Logging in...' : 'Creating account...';

        try {
            if (isLogin) {
                await LangyDB.login(email, password);
                if (typeof toggleDarkMode === 'function') toggleDarkMode(LangyState.settings.darkMode);
                LangyDB.startAutoSave();
                Anim.showToast(`Welcome back! ${LangyIcons.check}`);
                setTimeout(routeAfterLanguageGate, 500);
            } else {
                await LangyDB.register(name, email, password);
                requireFreshCourseLanguageChoice();
                LangyDB.startAutoSave();
                Anim.showToast(`Account created! ${LangyIcons.check}`);
                setTimeout(() => Router.navigate('onboarding'), 500);
            }
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = isLogin ? 'Log In' : 'Create Account';
        }
    });

    // Social buttons (local mode — not available)
    container.querySelector('#auth-google')?.addEventListener('click', () => {
        Anim.showToast(`Google Sign-In — coming soon with cloud sync! ${LangyIcons.cloud}`);
    });
    container.querySelector('#auth-apple')?.addEventListener('click', () => {
        Anim.showToast(`Apple Sign-In — coming soon with cloud sync! ${LangyIcons.cloud}`);
    });

    // DEV FAST LOGIN
    container.querySelector('#auth-dev-login')?.addEventListener('click', async () => {
        try {
            await LangyDB.register('Test User', 'test@example.com', '123456');
        } catch (e) {
            /* ignore if exists */
        }

        await LangyDB.login('test@example.com', '123456');
        requireFreshCourseLanguageChoice();
        LangyState.user.hasCompletedPlacement = false;
        LangyState.user.level = 'B2 Upper-Intermediate';
        LangyState.mascot.selected = 3; // Omar by default for testing
        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
        LangyDB.startAutoSave();
        Anim.showToast(`Logged in as Test User ${LangyIcons.zap}`);
        Router.navigate('onboarding');
    });

    // Stagger animation
    setTimeout(
        () => Anim.staggerChildren(container, '.input-group, .btn, .divider--text, .auth__social, .auth__footer'),
        100
    );
}

function routeAfterLanguageGate() {
    if (typeof LangyApp !== 'undefined' && !LangyApp.hasLockedCourseLanguage()) {
        ScreenState.set('onboardingStep', 2);
        ScreenState.remove?.('targetLangChoice');
        Router.navigate('onboarding');
        return;
    }

    if (!LangyState.user?.hasCompletedOnboarding) {
        const courseLanguage = typeof LangyApp !== 'undefined' ? LangyApp.getCourseLanguage() : LangyState.targetLanguage;
        if (courseLanguage) ScreenState.set('targetLangChoice', courseLanguage);
        ScreenState.set('onboardingStep', courseLanguage ? 3 : 2);
        Router.navigate('onboarding');
        return;
    }

    Router.navigate('home');
}

function requireFreshCourseLanguageChoice() {
    if (typeof LangyApp !== 'undefined') LangyApp.clearPendingCourseLanguage();
    LangyState.courseLanguage = null;
    LangyState.pendingCourseLanguage = null;
    LangyState.targetLanguage = null;
    if (LangyState.subscription) {
        LangyState.subscription.courseLanguage = null;
        LangyState.subscription.plan = null;
        LangyState.subscription.billingPeriod = null;
        LangyState.subscription.status = 'none';
        LangyState.subscription.startedAt = null;
        LangyState.subscription.renewsAt = null;
        LangyState.subscription.entitlements = [];
    }
    if (LangyState.user) {
        LangyState.user.targetLanguageConfirmed = false;
        LangyState.user.hasCompletedOnboarding = false;
    }
    if (typeof LangyApp !== 'undefined') LangyApp.restoreActiveLanguageState();
    ScreenState.set('onboardingStep', 2);
    ScreenState.remove?.('targetLangChoice');
}

Router.register('auth', renderAuth);
