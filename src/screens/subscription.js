/* ============================================
   SCREEN: SUBSCRIPTION / CHECKOUT
   Course selection is pre-payment. After payment, courseLanguage is locked.
   ============================================ */

const LANGY_COURSE_PRODUCTS = {
    en: {
        title: 'Langy English',
        name: 'English',
        label: 'Structured English course',
        desc: 'Full English path from Pre-A1 to C2.',
        flag: '&#127468;&#127463;',
    },
    es: {
        title: 'Langy Spanish',
        name: 'Spanish',
        label: 'Conversation Spanish course',
        desc: 'Full Spanish path from Pre-A1 to C2.',
        flag: '&#127466;&#127480;',
    },
    ar: {
        title: 'Langy Arabic',
        name: 'Modern Standard Arabic',
        label: 'Script-first Arabic course',
        desc: 'Full Modern Standard Arabic path from Pre-A1 to C2.',
        flag: '&#127480;&#127462;',
    },
};

const LANGY_CHECKOUT_PLANS = {
    coach_monthly: {
        id: 'coach_monthly',
        plan: 'coach',
        billingPeriod: 'monthly',
        name: 'Monthly',
        price: '$12',
        period: 'per month',
        total: '$12.00',
        trialDays: 7,
        badge: 'Most flexible',
    },
    coach_yearly: {
        id: 'coach_yearly',
        plan: 'coach',
        billingPeriod: 'yearly',
        name: 'Yearly',
        price: '$96',
        period: 'per year',
        total: '$96.00',
        trialDays: 7,
        badge: 'Best value',
    },
};

let checkoutPaymentInFlight = false;

function getCheckoutCourseCode() {
    if (typeof LangyApp === 'undefined') return LangyState.pendingCourseLanguage || LangyState.targetLanguage || null;
    return LangyApp.getPendingCourseLanguage?.() || LangyApp.getCourseLanguage?.();
}

function getCheckoutPlan() {
    const planId = ScreenState.get('checkoutPlan', 'coach_monthly');
    return LANGY_CHECKOUT_PLANS[planId] || LANGY_CHECKOUT_PLANS.coach_monthly;
}

function formatCheckoutDate(iso) {
    if (!iso) return 'Not scheduled';
    const locale = { ru: 'ru-RU', es: 'es-ES', en: 'en-US' }[typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en'] || 'en-US';
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCheckoutRenewalIso(startDate, billingPeriod = 'monthly', trialDays = 7) {
    const date = new Date(startDate || Date.now());

    if (Number.isFinite(trialDays) && trialDays > 0) {
        date.setDate(date.getDate() + trialDays);
    } else if (billingPeriod === 'yearly') {
        date.setFullYear(date.getFullYear() + 1);
    } else {
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString();
}

function getPreviewRenewalDate(plan) {
    return formatCheckoutDate(getCheckoutRenewalIso(new Date().toISOString(), plan.billingPeriod, plan.trialDays));
}

function renderLockedSubscription(container, course, plan) {
    const sub = LangyState.subscription || {};
    container.innerHTML = `
        <div class="screen subscription" style="padding-bottom:var(--sp-8);">
            <div class="subscription__header">
                <div style="font-size:44px; margin-bottom:var(--sp-2);">${course.flag}</div>
                <h2>${course.title}</h2>
                <p style="max-width:320px;margin:var(--sp-2) auto 0;color:var(--text-secondary);line-height:1.5;">
                    This course is active on your account and cannot be changed from the app.
                </p>
            </div>
            <div class="plan-card plan-card--recommended" style="margin:0 var(--sp-5);">
                <div class="plan-card__badge">ACTIVE COURSE</div>
                <div class="plan-card__header">
                    <div>
                        <div class="plan-card__name">${course.title}</div>
                        <div style="font-size:var(--fs-sm);color:var(--text-secondary);">${course.label}</div>
                    </div>
                    <div class="plan-card__price">
                        <div class="amount">${plan?.price || '$0'}</div>
                        <div class="period">${sub.status || 'active'}</div>
                    </div>
                </div>
                <div class="plan-card__features">
                    <div class="plan-card__feature">${LangyIcons.check} Plan: ${sub.plan || 'coach'}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Billing: ${sub.billingPeriod || 'beta'}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Next renewal: ${formatCheckoutDate(sub.renewsAt)}</div>
                </div>
                <button type="button" class="btn btn--primary btn--full" id="checkout-home" style="margin-top:var(--sp-4);">
                    ${LangyIcons.home} Continue learning
                </button>
            </div>
        </div>
    `;
    container.querySelector('#checkout-home')?.addEventListener('click', () => Router.navigate('home'));
}

function renderCheckoutPlan(container, courseCode, course, selectedPlan) {
    container.innerHTML = `
        <div class="screen subscription" style="padding-bottom:var(--sp-8);">
            <div class="subscription__header" style="padding-bottom:var(--sp-3);">
                <div style="font-size:44px; margin-bottom:var(--sp-2);">${course.flag}</div>
                <h2>${course.title}</h2>
                <p style="max-width:320px;margin:var(--sp-2) auto 0;color:var(--text-secondary);line-height:1.5;">
                    ${course.desc}
                </p>
            </div>

            <div class="plan-card" data-course-product="${courseCode}" style="margin:0 var(--sp-5) var(--sp-4);">
                <div class="plan-card__header">
                    <div>
                        <div class="plan-card__name">${course.title}</div>
                        <div style="font-size:var(--fs-sm);color:var(--text-secondary);">${course.label}</div>
                    </div>
                    <div class="plan-card__price">
                        <div class="amount">Pre-A1-C2</div>
                        <div class="period">one course</div>
                    </div>
                </div>
                <button type="button" class="btn btn--ghost btn--full" id="checkout-change-course" style="margin-top:var(--sp-3);">
                    ${LangyIcons.back} Change course before payment
                </button>
            </div>

            <div class="plan-cards" style="gap:var(--sp-3);">
                ${Object.values(LANGY_CHECKOUT_PLANS).map(plan => `
                    <button type="button" class="plan-card ${selectedPlan.id === plan.id ? 'plan-card--recommended' : ''}" data-checkout-plan="${plan.id}" style="text-align:left;">
                        ${selectedPlan.id === plan.id ? `<div class="plan-card__badge">${plan.badge}</div>` : ''}
                        <div class="plan-card__header">
                            <div>
                                <div class="plan-card__name">${plan.name}</div>
                                <div style="font-size:var(--fs-sm);color:var(--text-secondary);">7-day trial included</div>
                            </div>
                            <div class="plan-card__price">
                                <div class="amount">${plan.price}</div>
                                <div class="period">${plan.period}</div>
                            </div>
                        </div>
                        <div class="plan-card__features">
                            <div class="plan-card__feature">${LangyIcons.check} Full ${course.name} curriculum entitlement</div>
                            <div class="plan-card__feature">${LangyIcons.check} Lessons, review, homework and Talk with Omar</div>
                            <div class="plan-card__feature">${LangyIcons.check} Trial ends: ${getPreviewRenewalDate(plan)}</div>
                        </div>
                    </button>
                `).join('')}
            </div>

            <div style="padding:0 var(--sp-5);">
                <button type="button" class="btn btn--primary btn--xl btn--full" id="checkout-continue">
                    Continue to order ${LangyIcons.arrowRight}
                </button>
            </div>
        </div>
    `;
}

function renderCheckoutConfirm(container, courseCode, course, selectedPlan) {
    const renewalDate = getPreviewRenewalDate(selectedPlan);
    const payDisabled = checkoutPaymentInFlight ? 'disabled data-loading="true"' : '';
    container.innerHTML = `
        <div class="screen subscription" style="padding-bottom:var(--sp-8);">
            <div class="subscription__header" style="padding-bottom:var(--sp-3);">
                <div style="font-size:44px; margin-bottom:var(--sp-2);">${course.flag}</div>
                <h2>Confirm order</h2>
                <p style="max-width:320px;margin:var(--sp-2) auto 0;color:var(--text-secondary);line-height:1.5;">
                    Review exactly what will be activated on this account.
                </p>
            </div>

            <div class="plan-card plan-card--recommended" style="margin:0 var(--sp-5) var(--sp-4);">
                <div class="plan-card__badge">ORDER SUMMARY</div>
                <div class="plan-card__header">
                    <div>
                        <div class="plan-card__name">${course.title}</div>
                        <div style="font-size:var(--fs-sm);color:var(--text-secondary);">${course.label}</div>
                    </div>
                    <div class="plan-card__price">
                        <div class="amount">${selectedPlan.total}</div>
                        <div class="period">${selectedPlan.billingPeriod}</div>
                    </div>
                </div>
                <div class="plan-card__features">
                    <div class="plan-card__feature">${LangyIcons.check} Product: ${course.title}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Plan: Langy Coach ${selectedPlan.name}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Billing period: ${selectedPlan.billingPeriod}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Total today after trial: ${selectedPlan.total}</div>
                    <div class="plan-card__feature">${LangyIcons.check} Trial: ${selectedPlan.trialDays} days, cancel anytime before renewal</div>
                    <div class="plan-card__feature">${LangyIcons.check} Next renewal date: ${renewalDate}</div>
                </div>
            </div>

            <div style="padding:0 var(--sp-5); display:flex; flex-direction:column; gap:var(--sp-2);">
                <button type="button" class="btn btn--primary btn--xl btn--full" id="checkout-pay" ${payDisabled}>
                    Complete sandbox payment ${LangyIcons.check}
                </button>
                <button type="button" class="btn btn--secondary btn--full" id="checkout-back-plan">
                    ${LangyIcons.back} Back to plan
                </button>
                <button type="button" class="btn btn--ghost btn--full" id="checkout-change-course">
                    Change course before payment
                </button>
            </div>
        </div>
    `;
}

function bindCheckoutEvents(container, courseCode) {
    container.querySelectorAll('[data-checkout-plan]').forEach(card => {
        card.addEventListener('click', () => {
            ScreenState.set('checkoutPlan', card.dataset.checkoutPlan);
            ScreenState.set('checkoutStep', 'plan');
            renderSubscription(container);
        });
    });

    container.querySelector('#checkout-change-course')?.addEventListener('click', () => {
        if (typeof LangyApp !== 'undefined') LangyApp.clearPendingCourseLanguage();
        ScreenState.set('onboardingStep', 2);
        ScreenState.remove('targetLangChoice');
        Router.navigate('onboarding');
    });

    container.querySelector('#checkout-continue')?.addEventListener('click', () => {
        ScreenState.set('checkoutStep', 'confirm');
        renderSubscription(container);
    });

    container.querySelector('#checkout-back-plan')?.addEventListener('click', () => {
        ScreenState.set('checkoutStep', 'plan');
        renderSubscription(container);
    });

    container.querySelector('#checkout-pay')?.addEventListener('click', async e => {
        if (checkoutPaymentInFlight) return;
        checkoutPaymentInFlight = true;
        const payButton = e.currentTarget;
        payButton.disabled = true;
        payButton.dataset.loading = 'true';

        const plan = getCheckoutPlan();
        try {
            const ok =
                typeof LangyApp !== 'undefined'
                    ? LangyApp.activateCourseEntitlement(courseCode, {
                          plan: plan.plan,
                          billingPeriod: plan.billingPeriod,
                          status: 'trialing',
                          trialDays: plan.trialDays,
                      })
                    : false;

            if (!ok) {
                Anim.showToast('Payment could not activate this course. Please try again.');
                payButton.disabled = false;
                delete payButton.dataset.loading;
                checkoutPaymentInFlight = false;
                return;
            }

            LangyState.user.hasCompletedOnboarding = false;
            ScreenState.set('targetLangChoice', courseCode);
            ScreenState.set('onboardingStep', 3);
            ScreenState.remove('checkoutStep');
            ScreenState.remove('checkoutPlan');
            if (typeof LangyDB !== 'undefined') await LangyDB.saveProgress().catch(() => {});
            Anim.showToast(`${LANGY_COURSE_PRODUCTS[courseCode].title} activated`);
            checkoutPaymentInFlight = false;
            Router.navigate('onboarding');
        } catch {
            checkoutPaymentInFlight = false;
            payButton.disabled = false;
            delete payButton.dataset.loading;
            Anim.showToast('Sandbox payment is unavailable. Please try again.');
        }
    });
}

function renderSubscription(container) {
    const courseCode = getCheckoutCourseCode();
    const selectedPlan = getCheckoutPlan();

    if (!courseCode || !LANGY_COURSE_PRODUCTS[courseCode]) {
        ScreenState.set('onboardingStep', 2);
        Router.navigate('onboarding');
        return;
    }

    const course = LANGY_COURSE_PRODUCTS[courseCode];
    const isLocked = typeof LangyApp !== 'undefined' && LangyApp.hasLockedCourseLanguage?.();
    if (isLocked) {
        renderLockedSubscription(container, course, selectedPlan);
        return;
    }

    const step = ScreenState.get('checkoutStep', 'plan');
    if (step === 'confirm') {
        renderCheckoutConfirm(container, courseCode, course, selectedPlan);
    } else {
        renderCheckoutPlan(container, courseCode, course, selectedPlan);
    }
    bindCheckoutEvents(container, courseCode);

    setTimeout(() => Anim.staggerChildren(container, '.plan-card'), 100);
}

Router.register('subscription', renderSubscription);
