/* ============================================
   SCREEN: ONBOARDING — New Learner First Experience
   Flow: App Language → Learning Language → Goal → Teacher → Level → Ready
   Lesson-first for beginners, speaking-first for intermediates.
   ============================================ */

function renderOnboarding(container) {
    const needsTargetLanguage =
        typeof LangyApp !== 'undefined' && typeof LangyApp.hasLockedCourseLanguage === 'function'
            ? !LangyApp.hasLockedCourseLanguage()
            : !LangyState.targetLanguage;
    const rawStep = ScreenState.get('onboardingStep', needsTargetLanguage ? 2 : 3);
    const TOTAL_STEPS = 6;
    const VISIBLE_STEPS = 5; // App-language step is pre-flow, not counted
    const step = Math.min(Math.max(rawStep, 1), TOTAL_STEPS);
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const getSelectedTargetCode = () => {
        if (typeof LangyApp !== 'undefined') {
            return (
                LangyApp.getCourseLanguage?.() ||
                ScreenState.get('targetLangChoice', LangyApp.getPendingCourseLanguage?.() || LangyState.targetLanguage || null)
            );
        }
        return ScreenState.get('targetLangChoice', LangyState.targetLanguage || null);
    };

    if (rawStep !== step) ScreenState.set('onboardingStep', step);
    if (step > 2) {
        const hasCourseEntitlement =
            typeof LangyApp !== 'undefined' && typeof LangyApp.hasLockedCourseLanguage === 'function'
                ? LangyApp.hasLockedCourseLanguage()
                : !!LangyState.targetLanguage;
        if (!hasCourseEntitlement) {
            ScreenState.set('onboardingStep', 2);
            renderOnboarding(container);
            return;
        }
        const selectedTarget = getSelectedTargetCode();
        const isSupported = typeof LangyTarget !== 'undefined' && LangyTarget.isSupported(selectedTarget);
        if (!isSupported) {
            ScreenState.set('onboardingStep', 2);
            renderOnboarding(container);
            return;
        }
        if (!ScreenState.has('targetLangChoice')) ScreenState.set('targetLangChoice', selectedTarget);
    }

    // ─── Shared pill-step renderer ───
    function renderPillStep(config) {
        const selected = ScreenState.get(config.stateKey, null);

        container.innerHTML = `
            <div class="screen onboarding">
                <div class="onboarding__header">
                    <div class="onboarding__step-badge">${config.stepLabel}</div>
                    <h2 class="onboarding__title" style="font-size: var(--fs-2xl);">${config.title}</h2>
                    <p class="onboarding__desc">${config.subtitle}</p>
                </div>

                <div class="onboarding__pills" id="pill-grid" style="display:flex; flex-direction:column; gap:var(--sp-3); padding:0 var(--sp-2);">
                    ${config.options
                        .map(
                            opt => `
                        <button class="onboarding__pill ${selected === opt.id ? 'onboarding__pill--selected' : ''}"
                                data-id="${opt.id}"
                                style="
                                    display:flex; align-items:center; gap:var(--sp-3);
                                    padding:var(--sp-4); border-radius:var(--radius-lg);
                                    border:2px solid ${selected === opt.id ? 'var(--primary)' : 'var(--border)'};
                                    background:${selected === opt.id ? 'var(--primary-bg)' : 'var(--bg-card)'};
                                    cursor:pointer; text-align:left; width:100%;
                                    transition: all 0.2s ease;
                                    font-family:inherit; font-size:var(--fs-base);
                                    color:var(--text-primary);
                                ">
                            <span style="font-size:24px; flex-shrink:0; width:32px; text-align:center;">${opt.icon}</span>
                            <div style="flex:1;">
                                <div style="font-weight:var(--fw-bold);">${opt.label}</div>
                                ${opt.desc ? `<div style="font-size:var(--fs-sm); color:var(--text-secondary); margin-top:2px;">${opt.desc}</div>` : ''}
                            </div>
                            ${selected === opt.id ? `<span style="margin-left:auto; color:var(--primary); flex-shrink:0;">${LangyIcons.check}</span>` : ''}
                        </button>
                    `
                        )
                        .join('')}
                </div>

                <div class="onboarding__bottom">
                    <button class="btn btn--primary btn--lg btn--full onboarding__btn ${!selected ? 'btn--disabled' : ''}"
                            id="onboarding-next" ${!selected ? 'disabled' : ''}>
                        ${config.nextLabel || ({ en: 'Continue', ru: 'Продолжить', es: 'Continuar' }[lang] + ' ' + LangyIcons.arrowRight)}
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.onboarding__pill').forEach(pill => {
            pill.addEventListener('click', () => {
                ScreenState.set(config.stateKey, pill.dataset.id);
                renderOnboarding(container);
            });
        });

        container.querySelector('#onboarding-next').addEventListener('click', () => {
            if (config.onNext) config.onNext(selected);
            ScreenState.set('onboardingStep', config.nextStep);
            renderOnboarding(container);
        });

        setTimeout(() => Anim.staggerChildren(container, '.onboarding__pill'), 50);
    }

    // ═══════════════════════════════════════════
    // STEP 1: APP LANGUAGE
    // No step badge — this is the entry gate, not part of the learning flow
    // ═══════════════════════════════════════════
    if (step === 1) {
        const selectedAppLang = ScreenState.get('appLangChoice', null);

        const appLangOptions = [
            { id: 'en', flag: '🇬🇧', label: 'English' },
            { id: 'ru', flag: '🇷🇺', label: 'Русский' },
            { id: 'es', flag: '🇪🇸', label: 'Español' },
        ];

        container.innerHTML = `
            <div class="screen onboarding">
                <div class="onboarding__header" style="padding-top:var(--sp-8); text-align:center;">
                    <img src="assets/logo.png" alt="Langy"
                         style="width:64px; height:auto; margin:0 auto var(--sp-5); display:block;"
                         onerror="this.style.display='none'">
                    <h2 class="onboarding__title" style="font-size: var(--fs-2xl);">
                        Choose your language
                    </h2>
                    <p class="onboarding__desc" style="color:var(--text-secondary);">
                        Выберите язык · Elige tu idioma
                    </p>
                </div>

                <div class="onboarding__pills" style="display:flex; flex-direction:column; gap:var(--sp-3); padding:var(--sp-4) var(--sp-2) 0;">
                    ${appLangOptions.map(opt => `
                        <button class="onboarding__pill ${selectedAppLang === opt.id ? 'onboarding__pill--selected' : ''}"
                                data-lang="${opt.id}"
                                style="
                                    display:flex; align-items:center; gap:var(--sp-4);
                                    padding:var(--sp-4) var(--sp-5); border-radius:var(--radius-lg);
                                    border:2px solid ${selectedAppLang === opt.id ? 'var(--primary)' : 'var(--border)'};
                                    background:${selectedAppLang === opt.id ? 'var(--primary-bg)' : 'var(--bg-card)'};
                                    cursor:pointer; text-align:left; width:100%;
                                    transition: all 0.2s ease;
                                    font-family:inherit; font-size:var(--fs-lg);
                                    color:var(--text-primary);
                                ">
                            <span style="font-size:32px; flex-shrink:0;">${opt.flag}</span>
                            <span style="font-weight:var(--fw-bold);">${opt.label}</span>
                            ${selectedAppLang === opt.id ? `<span style="margin-left:auto; color:var(--primary);">${LangyIcons.check}</span>` : ''}
                        </button>
                    `).join('')}
                </div>

                <div class="onboarding__bottom">
                    <button class="btn btn--primary btn--lg btn--full onboarding__btn ${!selectedAppLang ? 'btn--disabled' : ''}"
                            id="onboarding-next" ${!selectedAppLang ? 'disabled' : ''}>
                        ${{ en: 'Continue', ru: 'Продолжить', es: 'Continuar' }[selectedAppLang || 'en']} ${LangyIcons.arrowRight}
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.onboarding__pill').forEach(pill => {
            pill.addEventListener('click', () => {
                ScreenState.set('appLangChoice', pill.dataset.lang);
                renderOnboarding(container);
            });
        });

        container.querySelector('#onboarding-next').addEventListener('click', () => {
            const chosen = ScreenState.get('appLangChoice', 'en');
            if (typeof LangyI18n !== 'undefined') {
                LangyI18n.setLang(chosen);
            }
            ScreenState.set('onboardingStep', 2);
            renderOnboarding(container);
        });

        setTimeout(() => Anim.staggerChildren(container, '.onboarding__pill'), 50);
        return;
    }

    // ═══════════════════════════════════════════
    // STEP 2: LEARNING LANGUAGE
    // Clean cards: flag + localized name + warm subtitle. No jargon.
    // ═══════════════════════════════════════════
    if (step === 2) {
        if (typeof LangyApp !== 'undefined' && LangyApp.hasLockedCourseLanguage?.()) {
            ScreenState.set('targetLangChoice', LangyApp.getCourseLanguage());
            ScreenState.set('onboardingStep', 3);
            renderOnboarding(container);
            return;
        }

        const selectedLang = ScreenState.get(
            'targetLangChoice',
            typeof LangyApp !== 'undefined' ? LangyApp.getPendingCourseLanguage?.() : null
        );
        const languages = typeof LangyTarget !== 'undefined' ? LangyTarget.LANGUAGES : {};

        const langNames = {
            en: { en: 'English', es: 'Spanish', ar: 'Arabic' },
            ru: { en: 'Английский', es: 'Испанский', ar: 'Арабский' },
            es: { en: 'Inglés', es: 'Español', ar: 'Árabe' },
        };

        // Warm, beginner-friendly subtitles — no CEFR, no technical jargon
        const langSubtitles = {
            en: { en: 'Structured lessons with AI tutoring', es: 'Conversation-first with cultural context', ar: 'Learn the script, then speak with confidence' },
            ru: { en: 'Структурированные уроки с ИИ-репетитором', es: 'Разговорный с культурным контекстом', ar: 'Сначала письмо, потом уверенная речь' },
            es: { en: 'Lecciones estructuradas con tutoría IA', es: 'Conversación con contexto cultural', ar: 'Aprende la escritura, luego habla con confianza' },
        };

        const languageOrder = ['en', 'es', 'ar'];
        const cardCopy = {
            en: {
                flag: '🇬🇧',
                title: 'English',
                label: 'Structured',
                desc: 'Structured English from beginner to advanced.',
                path: 'Pre-A1–C2',
                dir: 'ltr',
            },
            es: {
                flag: '🇪🇸',
                title: 'Español',
                label: 'Conversation',
                desc: 'Spanish for greetings, travel, culture, and daily life.',
                path: 'Pre-A1–C2',
                dir: 'ltr',
            },
            ar: {
                flag: '🇸🇦',
                title: 'العربية',
                label: 'Script-first',
                desc: 'Modern Standard Arabic with letters, sounds, and first conversations.',
                path: 'Pre-A1–C2',
                dir: 'rtl',
            },
        };

        const courseDetails = {
            en: {
                skills: ['Speaking', 'Grammar', 'Vocabulary', 'Listening'],
                structure: '7 levels · guided units · review checkpoints',
                price: 'Langy Coach from $12/mo',
                theme: 'London studio track',
            },
            es: {
                skills: ['Conversation', 'Culture', 'Travel', 'Listening'],
                structure: 'Pre-A1 foundations · real-life scenes · reviews',
                price: 'Langy Coach from $12/mo',
                theme: 'Warm city track',
            },
            ar: {
                skills: ['Script', 'Reading', 'Sounds', 'Speaking'],
                structure: 'Alphabet first · guided reading · checkpoints',
                price: 'Langy Coach from $12/mo',
                theme: 'RTL-ready Arabic track',
            },
        };

        const langCards = languageOrder.filter(code => languages[code]).map(code => {
            const cfg = languages[code];
            const isSelected = selectedLang === code;
            const primaryName = cardCopy[code]?.title || cfg.nativeName || code;
            const nativeName = cfg.nativeName || '';
            const showSecondary = false;
            const subtitle = cardCopy[code]?.desc || '';
            const copy = cardCopy[code] || {
                flag: cfg.flag,
                title: primaryName,
                label: '',
                desc: subtitle,
                path: 'Pre-A1–C2',
                dir: cfg.direction || 'ltr',
            };

            const details = courseDetails[code] || {};

            return `
                <button type="button"
                        class="onboarding__lang-card ${isSelected ? 'onboarding__lang-card--selected' : ''}"
                        data-lang="${code}"
                        aria-pressed="${isSelected}"
                        dir="${copy.dir}"
                        style="
                            display:flex; align-items:center; gap:var(--sp-4);
                            padding:var(--sp-5) var(--sp-4); border-radius:var(--radius-xl, 20px);
                            border:2.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'};
                            background:${isSelected ? 'var(--primary-bg)' : 'var(--bg-card)'};
                            cursor:pointer; text-align:left; width:100%;
                            transition: all 0.25s ease;
                            font-family:inherit; font-size:var(--fs-base);
                            color:var(--text-primary);
                            ${isSelected ? 'box-shadow: 0 0 0 3px rgba(var(--primary-rgb, 99,102,241), 0.15);' : ''}
                        ">
                    <span style="
                        font-size:40px; flex-shrink:0; width:52px; height:52px;
                        display:flex; align-items:center; justify-content:center;
                        background:var(--bg-secondary, rgba(0,0,0,0.04)); border-radius:14px;
                    ">${copy.flag || cfg.flag}</span>
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:var(--fw-bold); font-size:var(--fs-lg);">
                            ${primaryName}
                            <span style="font-weight:700; color:var(--primary); font-size:var(--fs-sm);"> · ${copy.label}</span>
                            ${showSecondary ? `<span style="font-weight:400; color:var(--text-secondary); font-size:var(--fs-sm);"> · ${nativeName}</span>` : ''}
                        </div>
                        <div style="font-size:var(--fs-sm); color:var(--text-secondary); margin-top:3px;">
                            ${subtitle}
                        </div>
                        <div style="font-size:var(--fs-xs); color:var(--text-muted); margin-top:6px; font-weight:700;">
                            ${copy.path}
                        </div>
                        <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px;">
                            ${(details.skills || []).map(skill => `<span class="badge" style="font-size:9px; padding:2px 7px;">${skill}</span>`).join('')}
                        </div>
                        <div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-top:8px; line-height:1.35;">
                            ${details.structure || ''}
                        </div>
                        <div style="font-size:var(--fs-xs); color:var(--primary); margin-top:6px; font-weight:var(--fw-bold);">
                            ${details.price || ''}
                        </div>
                    </div>
                    ${isSelected ? `<span style="color:var(--primary); flex-shrink:0;">${LangyIcons.check}</span>` : ''}
                </button>
            `;
        });

        container.innerHTML = `
            <div class="screen onboarding">
                <div class="onboarding__header" style="padding-bottom:var(--sp-2);">
                    <div class="onboarding__step-badge">${{ en: 'Step', ru: 'Шаг', es: 'Paso' }[lang]} 1 / ${VISIBLE_STEPS}</div>
                    <h2 class="onboarding__title" style="font-size: var(--fs-2xl);">
                        ${{ en: 'Choose your course', ru: 'Выбери курс', es: 'Elige tu curso' }[lang]}
                    </h2>
                    <p class="onboarding__desc" style="max-width:340px; margin:var(--sp-1) auto 0;">
                        ${{ en: 'Pick one full Pre-A1-C2 course. You can change it before checkout.', ru: 'Выбери один полный курс Pre-A1-C2. До оплаты его можно изменить.', es: 'Elige un curso completo Pre-A1-C2. Puedes cambiarlo antes del pago.' }[lang]}
                    </p>
                </div>

                <div class="onboarding__pills" style="display:flex; flex-direction:column; gap:var(--sp-3); padding:0 var(--sp-2);">
                    ${langCards.join('')}
                </div>

                <div class="onboarding__bottom">
                    <button class="btn btn--primary btn--lg btn--full onboarding__btn ${!selectedLang ? 'btn--disabled' : ''}"
                            id="onboarding-next" ${!selectedLang ? 'disabled' : ''}>
                        ${{ en: 'Continue', ru: 'Продолжить', es: 'Continuar' }[lang]} ${LangyIcons.arrowRight}
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('.onboarding__lang-card').forEach(card => {
            card.addEventListener('click', () => {
                ScreenState.set('targetLangChoice', card.dataset.lang);
                renderOnboarding(container);
            });
        });

        container.querySelector('#onboarding-next').addEventListener('click', () => {
            const code = ScreenState.get('targetLangChoice', null);
            if (!code || typeof LangyTarget === 'undefined' || !LangyTarget.isSupported(code)) {
                Anim.showToast('Choose a language to continue');
                return;
            }
            if (typeof LangyApp !== 'undefined') {
                LangyApp.setPendingCourseLanguage(code);
            } else {
                LangyState.pendingCourseLanguage = code;
            }
            ScreenState.set('checkoutPlan', 'coach_monthly');
            ScreenState.set('checkoutStep', 'plan');
            Router.navigate('subscription');
        });

        setTimeout(() => Anim.staggerChildren(container, '.onboarding__lang-card'), 50);
        return;
    }

    // ═══════════════════════════════════════════
    // STEP 3: YOUR GOAL
    // Language-specific, beginner-friendly motivations.
    // ═══════════════════════════════════════════
    if (step === 3) {
        const targetCode = getSelectedTargetCode();
        const targetCfg = typeof LangyTarget !== 'undefined' ? (LangyTarget.LANGUAGES[targetCode] || {}) : {};

        const langNames = {
            en: { en: 'English', es: 'Spanish', ar: 'Arabic' },
            ru: { en: 'английский', es: 'испанский', ar: 'арабский' },
            es: { en: 'inglés', es: 'español', ar: 'árabe' },
        };
        const targetName = (langNames[lang] || langNames.en)[targetCode] || targetCfg.nativeName || 'this language';

        const goalsByLang = {
            ar: [
                { id: 'alphabet', icon: '✍️',
                    label: { en: 'Learn the Arabic script', ru: 'Выучить арабское письмо', es: 'Aprender la escritura árabe' }[lang],
                    desc: { en: 'Start with letters and your first words', ru: 'Начать с букв и первых слов', es: 'Empezar con letras y tus primeras palabras' }[lang] },
                { id: 'heritage', icon: '🏠',
                    label: { en: 'Reconnect with my roots', ru: 'Восстановить связь с корнями', es: 'Reconectar con mis raíces' }[lang],
                    desc: { en: 'Understand family conversations and culture', ru: 'Понимать семейные разговоры и культуру', es: 'Entender conversaciones familiares y cultura' }[lang] },
                { id: 'speak', icon: '💬',
                    label: { en: 'Speak Arabic in real life', ru: 'Говорить по-арабски в жизни', es: 'Hablar árabe en la vida real' }[lang],
                    desc: { en: 'Greetings, introductions, daily phrases', ru: 'Приветствия, представления, фразы', es: 'Saludos, presentaciones, frases diarias' }[lang] },
                { id: 'religion', icon: '🕌',
                    label: { en: 'Read Quran & understand prayers', ru: 'Читать Коран и понимать молитвы', es: 'Leer el Corán y entender oraciones' }[lang],
                    desc: { en: 'Reading skill for religious texts', ru: 'Навык чтения религиозных текстов', es: 'Lectura para textos religiosos' }[lang] },
            ],
            es: [
                { id: 'travel', icon: '✈️',
                    label: { en: 'Travel & explore', ru: 'Путешествия', es: 'Viajar y explorar' }[lang],
                    desc: { en: 'Order food, ask directions, meet locals', ru: 'Заказать еду, спросить дорогу', es: 'Pedir comida, preguntar direcciones' }[lang] },
                { id: 'speak', icon: '💬',
                    label: { en: 'Have real conversations', ru: 'Вести реальные разговоры', es: 'Tener conversaciones reales' }[lang],
                    desc: { en: 'Confidence in everyday situations', ru: 'Уверенность в повседневных ситуациях', es: 'Confianza en situaciones cotidianas' }[lang] },
                { id: 'work', icon: '💼',
                    label: { en: 'Work & career', ru: 'Работа и карьера', es: 'Trabajo y carrera' }[lang],
                    desc: { en: 'Professional Spanish for the workplace', ru: 'Профессиональный испанский для работы', es: 'Español profesional para el trabajo' }[lang] },
                { id: 'fun', icon: '🎯',
                    label: { en: 'Just for myself', ru: 'Просто для себя', es: 'Solo para mí' }[lang],
                    desc: { en: 'Learning at my own pace, no pressure', ru: 'Учусь в своём темпе, без давления', es: 'Aprendiendo a mi ritmo, sin presión' }[lang] },
            ],
            en: [
                { id: 'work', icon: '💼',
                    label: { en: 'Work & career', ru: 'Работа и карьера', es: 'Trabajo y carrera' }[lang],
                    desc: { en: 'Meetings, emails, professional confidence', ru: 'Встречи, письма, уверенность', es: 'Reuniones, emails, confianza profesional' }[lang] },
                { id: 'speak', icon: '💬',
                    label: { en: 'Have real conversations', ru: 'Вести реальные разговоры', es: 'Tener conversaciones reales' }[lang],
                    desc: { en: 'Think and speak naturally', ru: 'Думать и говорить свободно', es: 'Pensar y hablar de forma natural' }[lang] },
                { id: 'travel', icon: '✈️',
                    label: { en: 'Travel & living abroad', ru: 'Путешествия и жизнь за рубежом', es: 'Viajar y vivir en el extranjero' }[lang],
                    desc: { en: 'Navigate airports, hotels, social life', ru: 'Аэропорты, отели, общение', es: 'Aeropuertos, hoteles, vida social' }[lang] },
                { id: 'fun', icon: '🎯',
                    label: { en: 'Just for myself', ru: 'Просто для себя', es: 'Solo para mí' }[lang],
                    desc: { en: 'Learning at my own pace', ru: 'Учусь в своём темпе', es: 'Aprendiendo a mi ritmo' }[lang] },
            ],
        };

        renderPillStep({
            stepLabel: `${{ en: 'Step', ru: 'Шаг', es: 'Paso' }[lang]} 2 / ${VISIBLE_STEPS}`,
            stateKey: 'intentGoal',
            title: { en: `Why are you learning ${targetName}?`, ru: `Зачем тебе ${targetName}?`, es: `¿Por qué aprendes ${targetName}?` }[lang],
            subtitle: { en: "This helps us focus your learning path", ru: 'Это поможет нам настроить твой путь', es: 'Esto nos ayuda a enfocar tu camino' }[lang],
            nextStep: 5,
            options: goalsByLang[targetCode] || goalsByLang.en,
            onNext(val) {
                const goalToInterests = {
                    alphabet: ['script', 'reading'], heritage: ['culture', 'family'],
                    religion: ['religion', 'reading'], speak: ['social', 'movies'],
                    work: ['business', 'tech'], travel: ['travel', 'food'],
                    fun: ['social', 'culture'], exam: ['exams', 'books'],
                };
                LangyState.user.interests = goalToInterests[val] || ['social'];
                LangyState.user.goal = val;
            },
        });
        return;
    }

    // ═══════════════════════════════════════════
    // STEP 4: YOUR TEACHER
    // Inline mascot selection — compact, warm, personal.
    // ═══════════════════════════════════════════
    if (step === 4) {
        const targetCode = getSelectedTargetCode();
        const selectedTeacher = ScreenState.get('teacherChoice', null);

        // Get language-appropriate mascots
        let mascotIds = typeof TalkEngine !== 'undefined'
            ? TalkEngine.getMascotIdsForLanguage(targetCode)
            : (targetCode === 'ar' ? [3, 4, 5] : [0, 1, 2]);
        if (!mascotIds.includes(3)) mascotIds = [...mascotIds, 3];

        const allMascots = {
            0: { id: 0, name: 'Zendaya', icon: '💜',
                style: { en: 'Cheerful & Encouraging', ru: 'Весёлая и поддерживающая', es: 'Alegre y motivadora' }[lang],
                desc: { en: 'Celebrates every win. Makes learning feel easy.', ru: 'Празднует каждый успех. Учиться легко.', es: 'Celebra cada logro. Aprender es fácil.' }[lang],
                color: '#7C6CF6' },
            1: { id: 1, name: 'Travis', icon: '💚',
                style: { en: 'Creative & Playful', ru: 'Креативный и весёлый', es: 'Creativo y divertido' }[lang],
                desc: { en: 'Teaches through games, humor, and surprises.', ru: 'Учит через игры, юмор и сюрпризы.', es: 'Enseña con juegos, humor y sorpresas.' }[lang],
                color: '#4ADE80' },
            2: { id: 2, name: 'Matthew', icon: '💛',
                style: { en: 'Smart & Structured', ru: 'Умный и системный', es: 'Inteligente y estructurado' }[lang],
                desc: { en: 'Calm, precise, loves meaningful conversation.', ru: 'Спокойный, точный, любит глубокие беседы.', es: 'Calmado, preciso, ama la conversación profunda.' }[lang],
                color: '#F59E0B' },
            3: { id: 3, name: 'Omar', icon: '💙',
                style: { en: 'Energetic & Welcoming', ru: 'Энергичный и гостеприимный', es: 'Energético y acogedor' }[lang],
                desc: { en: 'Charismatic guide. Learning feels like a warm chat.', ru: 'Харизматичный гид. Обучение как тёплая беседа.', es: 'Guía carismático. Aprender es como una charla cálida.' }[lang],
                color: '#06B6D4' },
            4: { id: 4, name: 'Elyanna', icon: '💜',
                style: { en: 'Modern & Magnetic', ru: 'Современная и обаятельная', es: 'Moderna y magnética' }[lang],
                desc: { en: 'Makes Arabic feel contemporary and beautiful.', ru: 'Арабский — современный и красивый.', es: 'Hace que el árabe se sienta contemporáneo.' }[lang],
                color: '#C084FC' },
            5: { id: 5, name: 'Adel Imam', icon: '🧡',
                style: { en: 'Warm & Theatrical', ru: 'Тёплый и театральный', es: 'Cálido y teatral' }[lang],
                desc: { en: 'Teaches with humor, wisdom, and heart.', ru: 'Учит с юмором, мудростью и душой.', es: 'Enseña con humor, sabiduría y corazón.' }[lang],
                color: '#F97316' },
        };

        const teacherOptions = mascotIds
            .filter(id => allMascots[id])
            .map(id => {
                const m = allMascots[id];
                return { id: String(m.id), icon: m.icon, label: `${m.name} — ${m.style}`, desc: m.desc };
            });

        renderPillStep({
            stepLabel: `${{ en: 'Step', ru: 'Шаг', es: 'Paso' }[lang]} 4 / ${VISIBLE_STEPS}`,
            stateKey: 'teacherChoice',
            title: { en: 'Meet your tutor', ru: 'Познакомься с репетитором', es: 'Conoce a tu tutor' }[lang],
            subtitle: { en: 'Each tutor has their own personality and teaching style', ru: 'У каждого — свой характер и стиль обучения', es: 'Cada tutor tiene su personalidad y estilo' }[lang],
            nextStep: 6,
            options: teacherOptions,
            onNext(val) {
                const mascotId = parseInt(val) || 0;
                LangyState.mascot.selected = mascotId;
            },
        });
        return;
    }

    // ═══════════════════════════════════════════
    // STEP 5: YOUR LEVEL
    // Beginner-friendly self-assessment. No test, no intimidation.
    // ═══════════════════════════════════════════
    if (step === 5) {
        const targetCode = getSelectedTargetCode();
        const targetCfg = typeof LangyTarget !== 'undefined' ? (LangyTarget.LANGUAGES[targetCode] || {}) : {};

        const langNames = {
            en: { en: 'English', es: 'Spanish', ar: 'Arabic' },
            ru: { en: 'английского', es: 'испанского', ar: 'арабского' },
            es: { en: 'inglés', es: 'español', ar: 'árabe' },
        };
        const targetName = (langNames[lang] || langNames.en)[targetCode] || targetCfg.nativeName || 'this language';

        renderPillStep({
            stepLabel: `${{ en: 'Step', ru: 'Шаг', es: 'Paso' }[lang]} 3 / ${VISIBLE_STEPS}`,
            stateKey: 'intentConfidence',
            title: { en: `How much ${targetName} do you know?`, ru: `Сколько ${targetName} ты знаешь?`, es: `¿Cuánto ${targetName} sabes?` }[lang],
            subtitle: { en: 'No test — just pick what feels right', ru: 'Без теста — просто выбери, что подходит', es: 'Sin prueba — elige lo que sientas' }[lang],
            nextStep: 4,
            options: [
                { id: 'zero', icon: '🌱',
                    label: { en: 'Complete beginner', ru: 'Полный новичок', es: 'Principiante total' }[lang],
                    desc: {
                        ar: { en: "I've never seen the Arabic script", ru: 'Никогда не видел арабское письмо', es: 'Nunca he visto la escritura árabe' },
                        es: { en: 'Maybe just hola and gracias', ru: 'Может только hola и gracias', es: 'Quizás solo hola y gracias' },
                        en: { en: 'Starting from scratch', ru: 'Начинаю с нуля', es: 'Empezando desde cero' },
                    }[targetCode]?.[lang] || '' },
                { id: 'basic', icon: '📖',
                    label: { en: 'Know a few words', ru: 'Знаю несколько слов', es: 'Sé algunas palabras' }[lang],
                    desc: {
                        ar: { en: 'I recognise some letters', ru: 'Узнаю некоторые буквы', es: 'Reconozco algunas letras' },
                        es: { en: 'Can introduce myself and order food', ru: 'Могу представиться и заказать еду', es: 'Puedo presentarme y pedir comida' },
                        en: { en: 'Simple phrases and basic grammar', ru: 'Простые фразы и базовая грамматика', es: 'Frases simples y gramática básica' },
                    }[targetCode]?.[lang] || '' },
                { id: 'intermediate', icon: '💬',
                    label: { en: 'Can hold a simple conversation', ru: 'Могу вести простой разговор', es: 'Puedo mantener una conversación simple' }[lang],
                    desc: {
                        ar: { en: 'I can read and chat in Arabic', ru: 'Могу читать и общаться по-арабски', es: 'Puedo leer y charlar en árabe' },
                        es: { en: 'I can chat but struggle with tenses', ru: 'Общаюсь, но путаюсь во временах', es: 'Puedo charlar pero me lío con los tiempos' },
                        en: { en: 'Conversational but not confident', ru: 'Могу говорить, но не уверен', es: 'Conversacional pero no seguro' },
                    }[targetCode]?.[lang] || '' },
                { id: 'advanced', icon: '🏆',
                    label: { en: 'Already comfortable speaking', ru: 'Уже свободно говорю', es: 'Ya hablo con soltura' }[lang],
                    desc: {
                        ar: { en: 'Want to refine and polish', ru: 'Хочу улучшить и отполировать', es: 'Quiero refinar y pulir' },
                        es: { en: 'Aiming for near-native fluency', ru: 'Стремлюсь к уровню носителя', es: 'Apunto a fluidez casi nativa' },
                        en: { en: 'Want professional-level polish', ru: 'Хочу профессиональный уровень', es: 'Quiero nivel profesional' },
                    }[targetCode]?.[lang] || '' },
            ],
            onNext(val) {
                const confidenceToLevel = { zero: 'Pre-A1', basic: 'A1', intermediate: 'B1', advanced: 'B2' };
                const cefr = confidenceToLevel[val] || 'B1';
                const levelNames = { 'Pre-A1': 'Starter', A1: 'Beginner', B1: 'Intermediate', B2: 'Upper Intermediate' };
                LangyState.user.level = `${cefr} ${levelNames[cefr]}`;
                LangyState.user.hasCompletedPlacement = true;
                LangyState.settings.languageLevel = cefr;
                LangyState.user.confidenceLevel = val;
                if (typeof LangyCurriculum !== 'undefined') {
                    LangyCurriculum.selectTextbookByLevel(cefr);
                }
            },
        });
        return;
    }

    // ═══════════════════════════════════════════
    // STEP 6: READY — personalized final CTA
    // Shows tutor name. Beginners → lesson. Intermediate → speaking.
    // ═══════════════════════════════════════════
    if (step === 6) {
        const targetCode = getSelectedTargetCode();
        const targetCfg = typeof LangyTarget !== 'undefined' ? (LangyTarget.LANGUAGES[targetCode] || {}) : {};
        const userConfidence = ScreenState.get('intentConfidence', 'intermediate');
        const isBeginner = userConfidence === 'zero' || userConfidence === 'basic';
        const targetFlag = targetCfg.flag || '🇬🇧';

        // Get tutor name for personalization
        const mascotId = LangyState.mascot?.selected ?? 0;
        const tutorNames = { 0: 'Zendaya', 1: 'Travis', 2: 'Matthew', 3: 'Omar', 4: 'Elyanna', 5: 'Adel Imam' };
        const tutorName = tutorNames[mascotId] || 'your tutor';

        const heroTitle = isBeginner
            ? { en: "You're all set!", ru: 'Всё готово!', es: '¡Todo listo!' }[lang]
            : { en: 'Your path is ready!', ru: 'Твой путь готов!', es: '¡Tu camino está listo!' }[lang];

        const heroSubtitle = isBeginner
            ? { en: `${tutorName} will start you with a short lesson to build your confidence, then you'll practice speaking together.`,
                ru: `${tutorName} начнёт с короткого урока, чтобы ты почувствовал уверенность, а потом вы поговорите вместе.`,
                es: `${tutorName} empezará con una lección corta para que ganes confianza, y luego practicarás hablando.` }[lang]
            : { en: `${tutorName} will guide you through a real conversation from the very first session.`,
                ru: `${tutorName} проведёт тебя через реальный разговор с первой же сессии.`,
                es: `${tutorName} te guiará en una conversación real desde la primera sesión.` }[lang];

        const ctaText = { en: 'Open my learning home', ru: 'Открыть главную', es: 'Abrir mi inicio' }[lang];
        const ctaIcon = LangyIcons.home;

        container.innerHTML = `
            <div class="screen onboarding">
                <div class="onboarding__slide" style="animation: fadeInUp 0.5s ease-out; text-align:center; padding-top:var(--sp-8);">
                    <div class="onboarding__step-badge" style="margin:0 auto var(--sp-4); width:max-content;">${{ en: 'Step', ru: 'Шаг', es: 'Paso' }[lang]} 5 / ${VISIBLE_STEPS}</div>

                    <div style="font-size:56px; margin-bottom:var(--sp-4);">${targetFlag}</div>

                    <h2 class="onboarding__title" style="font-size:var(--fs-2xl);">${heroTitle}</h2>

                    <p class="onboarding__desc" style="max-width:340px; margin:var(--sp-3) auto 0; line-height:1.6;">${heroSubtitle}</p>
                </div>

                <div class="onboarding__bottom">
                    <button class="btn btn--primary btn--lg btn--full onboarding__btn" id="onboarding-finish">
                        ${ctaText} ${ctaIcon}
                    </button>
                </div>
            </div>
        `;

        container.querySelector('#onboarding-finish').addEventListener('click', () => {
            const userGoal = ScreenState.get('intentGoal', 'speak');
            const chosenMascot = LangyState.mascot.selected ?? 0;
            const targetCode = getSelectedTargetCode();

            if (!targetCode || typeof LangyTarget === 'undefined' || !LangyTarget.isSupported(targetCode)) {
                ScreenState.set('onboardingStep', 2);
                renderOnboarding(container);
                return;
            }

            LangyTarget.set(targetCode, { persist: false });

            ScreenState.clear();

            LangyState.user.hasCompletedOnboarding = true;
            LangyState.user.targetLanguageConfirmed = true;
            LangyState.mascot.selected = chosenMascot;

            if (typeof LangyDB !== 'undefined') {
                LangyDB.saveProgress().catch(() => {});
            }

            Anim.showToast({ en: 'Your course is ready!', ru: 'Твой курс готов!', es: '¡Tu curso está listo!' }[lang]);

            const scenarioMap = {
                speak: 'coffee', work: 'interview', travel: 'airport',
                fun: 'coffee', exam: 'free', alphabet: 'roommate',
                heritage: 'coffee', religion: 'free',
            };

            ScreenState.set('talkMascot', chosenMascot);
            ScreenState.set('talkScenario', scenarioMap[userGoal] || 'coffee');
            ScreenState.set('guidedSpeaking', true);
            ScreenState.remove('talkView');
            ScreenState.remove('firstTalkSession');

            setTimeout(() => Router.navigate('home'), 600);
        });

        return;
    }
}

Router.register('onboarding', renderOnboarding);
