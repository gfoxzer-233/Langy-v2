/* ============================================
   SCREEN: LANGY TALK — Voice Conversation v2
   Real-time voice chat with mascot tutors
   ============================================ */

function renderTalk(container) {
    // ─── First Talk Session: show warm intro before jumping into call ───
    if (ScreenState.get('firstTalkSession')) {
        renderFirstTalkIntro(container);
    } else if (ScreenState.get('talkView') === 'call') {
        renderTalkCall(container);
    } else if (ScreenState.get('talkView') === 'summary') {
        renderTalkSummary(container);
    } else {
        renderTalkSelect(container);
    }
}

// ═══════════════════════════════════════
// FIRST SESSION: Warm intro before first call
// ═══════════════════════════════════════
function renderFirstTalkIntro(container) {
    const mascotId = ScreenState.get('talkMascot') ?? LangyState.mascot?.selected ?? 0;
    const scenarioId = ScreenState.get('talkScenario', 'coffee');
    const scenario = TalkEngine.scenarios.find(s => s.id === scenarioId) || TalkEngine.scenarios[0];
    const persona = TalkEngine.personas[mascotId] || TalkEngine.personas[0];
    const imgs = { 0: 'zendaya', 1: 'travis', 2: 'matthew', 3: 'omar', 4: 'elyanna', 5: 'adel_imam' };
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const confidence = LangyState.user.confidenceLevel || 'intermediate';

    const tipText = {
        zero: {
            en: "Don't worry about mistakes — just try! I'll help you along the way.",
            ru: 'Не волнуйся из-за ошибок — просто попробуй! Я помогу по ходу.',
            es: 'No te preocupes por los errores — ¡solo intenta! Te ayudaré.',
        },
        basic: {
            en: "Use simple phrases. I'll guide the conversation and help when you get stuck.",
            ru: 'Используй простые фразы. Я буду вести разговор и помогу, если застрянешь.',
            es: 'Usa frases simples. Yo guiaré la conversación y te ayudaré.',
        },
        intermediate: {
            en: "Just talk naturally. I'll gently correct any mistakes as we go.",
            ru: 'Просто говори естественно. Я мягко исправлю ошибки по ходу.',
            es: 'Solo habla con naturalidad. Corregiré suavemente tus errores.',
        },
        advanced: {
            en: "Let's have a real conversation. I'll challenge you with idioms and nuance.",
            ru: 'Давай поговорим по-настоящему. Буду использовать идиомы и нюансы.',
            es: 'Tengamos una conversación real. Te retaré con modismos y matices.',
        },
    };

    const tip = (tipText[confidence] || tipText.intermediate)[lang];

    container.innerHTML = `
        <div class="screen" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:var(--sp-6); text-align:center; animation:fadeInUp 0.5s ease-out;">
            
            <div style="width:100px; height:100px; border-radius:50%; overflow:hidden; margin-bottom:var(--sp-4);
                        box-shadow:0 8px 32px rgba(0,0,0,0.15); border:3px solid var(--primary);">
                <img src="assets/mascots/${imgs[mascotId]}.png" alt="${persona.name}"
                     style="width:100%; height:100%; object-fit:contain;"
                     onerror="this.onerror=null; this.src=this.src.replace('.png','.svg');">
            </div>

            <h2 style="margin-bottom:var(--sp-2);">${{
                en: `${persona.name} is ready`,
                ru: `${persona.name} готов${mascotId === 0 ? 'а' : ''}`,
                es: `${persona.name} está list${mascotId === 0 ? 'a' : 'o'}`,
            }[lang]}</h2>

            <p style="color:var(--text-secondary); margin-bottom:var(--sp-2); max-width:300px;">
                ${isArabicTrack
                    ? { en: 'Your first Arabic listening session:', ru: '\u0422\u0432\u043e\u044f \u043f\u0435\u0440\u0432\u0430\u044f \u0430\u0440\u0430\u0431\u0441\u043a\u0430\u044f \u0441\u0435\u0441\u0441\u0438\u044f:', es: 'Tu primera sesi\u00f3n de escucha en \u00e1rabe:' }[lang]
                    : { en: 'Your first conversation:', ru: '\u0422\u0432\u043e\u0439 \u043f\u0435\u0440\u0432\u044b\u0439 \u0440\u0430\u0437\u0433\u043e\u0432\u043e\u0440:', es: 'Tu primera conversaci\u00f3n:' }[lang]}
                <strong style="color:var(--primary);">${scenario.title}</strong>
            </p>

            <div class="card" style="padding:var(--sp-4); margin:var(--sp-4) 0; text-align:left; max-width:340px; width:100%;">
                <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                    <span style="color:var(--primary); font-size:20px; flex-shrink:0;">${LangyIcons.info}</span>
                    <p style="font-size:var(--fs-sm); color:var(--text-secondary); line-height:1.5; margin:0;">
                        ${tip}
                    </p>
                </div>
            </div>

            <div style="display:flex; gap:var(--sp-2); font-size:var(--fs-xs); color:var(--text-tertiary); margin-bottom:var(--sp-6);">
                <span>${LangyIcons.mic} ${{ en: 'Tap mic to talk', ru: 'Нажми на микрофон', es: 'Toca el micrófono' }[lang]}</span>
                <span>·</span>
                <span>${LangyIcons.headphones} ${{ en: 'Listen & respond', ru: 'Слушай и отвечай', es: 'Escucha y responde' }[lang]}</span>
            </div>

            <button class="btn btn--primary btn--xl btn--full" id="first-talk-start"
                    style="max-width:340px; font-size:var(--fs-lg); display:flex; align-items:center; justify-content:center; gap:var(--sp-2);">
                ${LangyIcons.mic} ${isArabicTrack
                    ? { en: "Let's listen & practice!", ru: 'Слушаем и практикуем!', es: '¡Escuchemos y practiquemos!' }[lang]
                    : { en: "Let's talk!", ru: 'Поговорим!', es: '¡Hablemos!' }[lang]}
            </button>

            <button class="btn btn--ghost" id="first-talk-skip"
                    style="margin-top:var(--sp-3); font-size:var(--fs-sm);">
                ${{ en: 'Skip to home', ru: 'Перейти на главную', es: 'Ir al inicio' }[lang]}
            </button>
        </div>
    `;

    container.querySelector('#first-talk-start')?.addEventListener('click', () => {
        ScreenState.remove('firstTalkSession');
        ScreenState.set('talkView', 'call');
        renderTalk(container);
    });

    container.querySelector('#first-talk-skip')?.addEventListener('click', () => {
        ScreenState.remove('firstTalkSession');
        ScreenState.remove('talkView');
        Router.navigate('home');
    });
}

// ═══════════════════════════════════════
// SCREEN 1: Mascot & Scenario Selection
// ═══════════════════════════════════════
function renderTalkSelect(container) {
    const mascotId = LangyState.mascot?.selected || 0;
    const targetLang = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
    const langMascotIds = TalkEngine.getMascotIdsForLanguage(targetLang);
    const mascots = langMascotIds.map(id => [String(id), TalkEngine.personas[id]]);
    const scenarios = TalkEngine.scenarios;

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="talk-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${i18n('talk.title')}</div>
                <div style="width:36px;"></div>
            </div>

            <div style="overflow-y:auto; flex:1;">

                <!-- Session Stage -->
                <div class="talk-stage">
                    <!-- Selected Mascot Hero -->
                    <div class="talk-stage__mascot">
                        ${(() => {
                            const selId = ScreenState.get('talkMascot') ?? mascotId;
                            const imgs = { 0: 'zendaya', 1: 'travis', 2: 'matthew', 3: 'omar', 4: 'elyanna', 5: 'adel_imam' };
                            const m = TalkEngine.personas[selId];
                            return `
                                <img src="assets/mascots/${imgs[selId]}.png" alt="${m.name}"
                                     style="width:100%; height:100%; object-fit:contain; animation: mascotIdle 4s ease-in-out infinite;"
                                     onerror="this.onerror=null; this.src=this.src.replace('.png','.svg');">
                            `;
                        })()}
                    </div>
                    <div style="text-align:center; margin-top:var(--sp-2);">
                        <h2 style="font-size:var(--fs-xl); margin-bottom:2px;">${i18n('talk.hero_title')}</h2>
                        <p style="color:var(--text-tertiary); font-size:var(--fs-sm);">${i18n('talk.hero_desc')}</p>
                    </div>
                </div>

                <div style="padding: 0 var(--sp-5);">

                    <!-- Partner Strip -->
                    <div class="talk-partner-strip">
                        ${mascots
                            .map(([id, m]) => {
                                const colors = { 0: '#7C6CF6', 1: '#4ADE80', 2: '#F59E0B', 3: '#06B6D4', 4: '#C084FC', 5: '#F97316' };
                                const imgs = { 0: 'zendaya', 1: 'travis', 2: 'matthew', 3: 'omar', 4: 'elyanna', 5: 'adel_imam' };
                                const isSelected = parseInt(id) === (ScreenState.get('talkMascot') ?? mascotId);
                                return `
                                <div class="talk-partner ${isSelected ? 'talk-partner--active' : ''}" 
                                     data-id="${id}" style="--mascot-color: ${colors[id]};">
                                    <div class="talk-partner__avatar">
                                        <img src="assets/mascots/${imgs[id]}.png" alt="${m.name}" 
                                             onerror="this.onerror=null; this.src=this.src.replace('.png','.svg');">
                                    </div>
                                    <span class="talk-partner__name">${m.name}</span>
                                </div>
                            `;
                            })
                            .join('')}
                    </div>

                    <!-- Scenario Selection -->
                    <h4 style="margin:var(--sp-4) 0 var(--sp-2); font-size:var(--fs-xs); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:0.5px; font-weight:var(--fw-bold);">
                        ${LangyIcons.map} ${i18n('talk.choose_scenario')}
                    </h4>
                    <div class="talk-scenarios" id="talk-scenarios">
                        ${scenarios
                            .map((s, i) => {
                                const isSelected = ScreenState.get('talkScenario', 'free') === s.id;
                                return `
                                <div class="talk-scenario ${isSelected ? 'talk-scenario--active' : ''}" data-id="${s.id}">
                                    <span class="talk-scenario__icon" style="color:${s.color};">${LangyIcons[s.icon] || LangyIcons.messageCircle}</span>
                                    <div class="talk-scenario__info">
                                        <div class="talk-scenario__title">${s.title}</div>
                                        <div class="talk-scenario__desc">${s.desc}</div>
                                    </div>
                                    ${isSelected ? `<span style="color:var(--primary);">${LangyIcons.check}</span>` : ''}
                                </div>
                            `;
                            })
                            .join('')}
                    </div>

                    <!-- Start Button -->
                    <div style="margin-top:var(--sp-5); padding-bottom:var(--sp-6);">
                        <button class="btn btn--primary btn--xl btn--full" id="talk-start" 
                                style="font-size:var(--fs-lg); display:flex; align-items:center; justify-content:center; gap:var(--sp-2);">
                            ${LangyIcons.mic} ${i18n('talk.start')}
                        </button>
                        <p style="text-align:center; font-size:var(--fs-xs); color:var(--text-tertiary); margin-top:var(--sp-2);">
                            ${i18n('talk.mic_hint')} · Works in Chrome/Edge/Safari
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // ── Event Handlers ──
    container.querySelector('#talk-back')?.addEventListener('click', () => {
        ScreenState.remove('talkView');
        Router.navigate('home');
    });

    container.querySelectorAll('.talk-partner').forEach(el => {
        el.addEventListener('click', () => {
            ScreenState.set('talkMascot', parseInt(el.dataset.id));
            if (typeof AudioUtils !== 'undefined') AudioUtils.playPop();
            renderTalkSelect(container);
        });
    });

    container.querySelectorAll('.talk-scenario').forEach(el => {
        el.addEventListener('click', () => {
            ScreenState.set('talkScenario', el.dataset.id);
            if (typeof AudioUtils !== 'undefined') AudioUtils.playPop();
            renderTalkSelect(container);
        });
    });

    container.querySelector('#talk-start')?.addEventListener('click', () => {
        ScreenState.set('talkView', 'call');
        renderTalk(container);
    });

    setTimeout(() => Anim.staggerChildren(container, '.talk-partner'), 50);
    setTimeout(() => Anim.staggerChildren(container, '.talk-scenario'), 100);
}

// ═══════════════════════════════════════
// SCREEN 2: Live Call UI
// ═══════════════════════════════════════
function renderTalkCall(container) {
    const mascotId = ScreenState.get('talkMascot') ?? LangyState.mascot?.selected ?? 0;
    const scenarioId = ScreenState.get('talkScenario', 'free');
    if (!LangyState.user.firstSpeakingScenarioStarted) {
        LangyState.user.firstSpeakingScenarioStarted = true;
        if (!LangyState.user.firstSpeakingScenarioId) {
            LangyState.user.firstSpeakingScenarioId = scenarioId;
        }
    }
    const session = TalkEngine.startSession(mascotId, scenarioId);
    const persona = session.persona;
    const scenario = session.scenario;
    const colors = { 0: '#7C6CF6', 1: '#4ADE80', 2: '#F59E0B', 3: '#06B6D4', 4: '#C084FC', 5: '#F97316' };
    const imgs = { 0: 'zendaya', 1: 'travis', 2: 'matthew', 3: 'omar', 4: 'elyanna', 5: 'adel_imam' };
    const color = colors[mascotId] || '#10B981';
    const minTurns = TalkEngine.REWARD_MIN_TURNS;

    container.innerHTML = `
        <div class="screen screen--no-pad talk-call" style="background:var(--bg); display:flex; flex-direction:column;">
            
            <!-- Top Bar -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--sp-4) var(--sp-5);">
                <div style="font-size:var(--fs-xs); color:var(--text-tertiary);">
                    <span id="talk-timer">0:00</span> · <span style="color:${scenario.color || 'var(--text-secondary)'};">${LangyIcons[scenario.icon] || ''}</span> ${scenario.title}
                </div>
                <button class="btn btn--ghost btn--sm" id="talk-end-top" style="color:var(--danger);">End</button>
            </div>

            ${(() => {
                const _cf = ScreenState.get('coachFocus', null);
                if (!_cf) return '';
                const _lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
                return `
            <div style="display:flex; align-items:center; gap:8px; padding:6px var(--sp-5);
                background:linear-gradient(135deg, rgba(124,108,246,0.08), rgba(124,108,246,0.03));
                border-bottom:1px solid rgba(124,108,246,0.1);">
                <span style="color:#7C6CF6; font-size:14px;">${LangyIcons.target}</span>
                <span style="font-size:var(--fs-xs); color:#7C6CF6; font-weight:var(--fw-semibold);">
                    ${{ en: 'Coach focus:', ru: 'Фокус Coach:', es: 'Enfoque Coach:' }[_lang]} ${_cf}
                </span>
            </div>`;
            })()}

            <!-- Progress Bar -->
            <div class="talk-progress" id="talk-progress" style="padding:0 var(--sp-5); margin-bottom:var(--sp-2);">
                <div style="display:flex; align-items:center; gap:var(--sp-2); font-size:var(--fs-xs); color:var(--text-tertiary);">
                    <div style="display:flex; gap:6px;" id="progress-dots">
                        ${[0, 1, 2].map(i => `<div class="talk-progress__dot" id="prog-dot-${i}"></div>`).join('')}
                    </div>
                    <span id="progress-text">0/${minTurns} exchanges to earn rewards</span>
                </div>
            </div>

            <!-- Mascot Area -->
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:var(--sp-4);">
                
                <!-- Avatar with pulse ring -->
                <div class="talk-call__avatar-ring" id="mascot-ring" style="--ring-color: ${color};">
                    <div class="talk-call__avatar" id="mascot-avatar" style="background:${color}15;">
                        <img src="assets/mascots/${imgs[mascotId]}.png" alt="${persona.name}" 
                             style="width:100%; height:100%; object-fit:cover; border-radius:50%;"
                             onerror="this.onerror=null; this.src=this.src.replace('.png','.svg');">
                    </div>
                </div>

                <div style="margin-top:var(--sp-3); text-align:center;">
                    <h2 style="color:${color};">${persona.name}</h2>
                    <div id="talk-status" class="talk-call__status">Connecting...</div>
                </div>

                <!-- Typing indicator (hidden by default) -->
                <div id="talk-typing" class="talk-typing" style="display:none;">
                    <span></span><span></span><span></span>
                </div>

                <!-- Subtitles Area -->
                <div class="talk-call__subtitles" id="talk-subtitles">
                    <div id="mascot-subtitle" class="talk-call__subtitle talk-call__subtitle--mascot" style="display:none;">
                    </div>
                    <div id="user-subtitle" class="talk-call__subtitle talk-call__subtitle--user" style="display:none;">
                    </div>
                </div>

                <!-- Correction hint -->
                <div id="talk-correction" class="talk-call__correction" style="display:none;">
                </div>

                <!-- Auto-hint (shown after 30s silence) -->
                <div id="talk-hint" class="talk-hint" style="display:none;">
                    <div style="font-size:var(--fs-xs); color:var(--text-tertiary); margin-bottom:var(--sp-2);">Not sure what to say? Try:</div>
                    <div id="hint-text" style="font-weight:var(--fw-semibold); font-size:var(--fs-sm); margin-bottom:var(--sp-2);"></div>
                    <button class="btn btn--secondary btn--sm" id="hint-use">Use this phrase</button>
                </div>
            </div>

            <!-- Controls -->
            <div class="talk-call__controls">
                <button class="talk-call__btn talk-call__btn--mute" id="talk-mute" title="Toggle subtitles">
                    <span style="font-size:20px; color:var(--text-tertiary);">${LangyIcons.fileText}</span>
                    <span style="font-size:10px;">Subs</span>
                </button>
                <button class="talk-call__btn talk-call__btn--mic" id="talk-mic" style="--btn-color: ${color};">
                    <span style="font-size:28px;" id="mic-icon">${LangyIcons.mic}</span>
                </button>
                <button class="talk-call__btn talk-call__btn--end" id="talk-end">
                    <span style="font-size:20px; color:var(--danger);">${LangyIcons.x}</span>
                    <span style="font-size:10px;">End</span>
                </button>
            </div>
        </div>
    `;

    // ── State Machine ──
    let state = 'init';
    let showSubs = true;
    let timerInterval = null;
    let seconds = 0;
    let hintTimeout = null;
    let turnCount = 0;

    const statusEl = container.querySelector('#talk-status');
    const mascotSub = container.querySelector('#mascot-subtitle');
    const userSub = container.querySelector('#user-subtitle');
    const correctionEl = container.querySelector('#talk-correction');
    const micBtn = container.querySelector('#talk-mic');
    const ringEl = container.querySelector('#mascot-ring');
    const avatarEl = container.querySelector('#mascot-avatar');
    const typingEl = container.querySelector('#talk-typing');
    const hintEl = container.querySelector('#talk-hint');
    const hintTextEl = container.querySelector('#hint-text');

    function setStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }
    // Escape user text to prevent XSS when using innerHTML
    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
    function setMascotSub(text) {
        if (mascotSub) {
            mascotSub.textContent = text;
            mascotSub.style.display = showSubs && text ? 'block' : 'none';
        }
    }
    function setUserSub(html) {
        if (userSub) {
            userSub.innerHTML = html;
            userSub.style.display = html ? 'block' : 'none';
        }
    }

    // Progress bar update
    function updateProgress() {
        for (let i = 0; i < 3; i++) {
            const dot = container.querySelector(`#prog-dot-${i}`);
            if (dot) {
                dot.classList.toggle('talk-progress__dot--filled', i < turnCount);
                dot.classList.toggle('talk-progress__dot--done', turnCount >= minTurns);
            }
        }
        const textEl = container.querySelector('#progress-text');
        if (textEl) {
            if (turnCount >= minTurns) {
                textEl.innerHTML = `<span style="color:var(--primary);">${LangyIcons.check} Rewards unlocked!</span>`;
            } else {
                textEl.textContent = `${turnCount}/${minTurns} exchanges to earn rewards`;
            }
        }
    }

    // Timer
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        const timerEl = container.querySelector('#talk-timer');
        if (timerEl) timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);

    // Auto-hint timer
    function startHintTimer() {
        clearTimeout(hintTimeout);
        hideHint();
        hintTimeout = setTimeout(() => {
            if (state === 'waiting') {
                const hint = TalkEngine.getRandomHint(scenarioId);
                if (hintTextEl) hintTextEl.textContent = `"${hint}"`;
                if (hintEl) hintEl.style.display = 'block';
            }
        }, 30000); // 30 seconds
    }

    function hideHint() {
        if (hintEl) hintEl.style.display = 'none';
    }

    // Mascot speaks
    function mascotSpeak(text) {
        state = 'mascot_speaking';
        setStatus(`${persona.name} is speaking...`);
        setMascotSub(text);
        setUserSub('');
        hideHint();
        ringEl?.classList.add('talk-call__avatar-ring--active');
        avatarEl?.classList.add('talk-call__avatar--bounce');
        micBtn?.classList.remove('talk-call__btn--mic-active');
        if (typingEl) typingEl.style.display = 'none';

        TalkEngine.addToHistory('mascot', text);

        TalkEngine.speak(text, persona, null, () => {
            ringEl?.classList.remove('talk-call__avatar-ring--active');
            avatarEl?.classList.remove('talk-call__avatar--bounce');
            state = 'waiting';
            setStatus('Your turn \u2014 tap mic to speak');
            micBtn?.classList.add('talk-call__btn--mic-pulse');
            startHintTimer();
        });
    }

    // User speaks → AI responds
    async function processUserSpeech(text) {
        if (!text || text.trim().length === 0) {
            setStatus("I didn't catch that. Try again!");
            state = 'waiting';
            startHintTimer();
            return;
        }

        turnCount++;
        updateProgress();
        setUserSub(`"${escapeHtml(text)}"`);
        state = 'thinking';
        setStatus(`${persona.name} is thinking...`);
        hideHint();
        ringEl?.classList.add('talk-call__avatar-ring--thinking');
        if (typingEl) typingEl.style.display = 'flex';

        try {
            const response = await TalkEngine.getAIResponse(text, mascotId, scenarioId);
            TalkEngine.addToHistory('user', text);
            ringEl?.classList.remove('talk-call__avatar-ring--thinking');

            detectCorrections(text, response);
            mascotSpeak(response);
        } catch (err) {
            ringEl?.classList.remove('talk-call__avatar-ring--thinking');
            if (typingEl) typingEl.style.display = 'none';
            mascotSpeak('Sorry, I had a little hiccup. What were you saying?');
        }
    }

    function detectCorrections(userText, aiResponse) {
        const hasGrammarHint =
            aiResponse.toLowerCase().includes('actually') ||
            aiResponse.toLowerCase().includes('you mean') ||
            aiResponse.toLowerCase().includes('more natural');

        if (hasGrammarHint && correctionEl) {
            correctionEl.style.display = 'block';
            correctionEl.innerHTML = `<span style="color:#F59E0B;">${LangyIcons.zap}</span> <span style="color:var(--text-secondary); font-size:var(--fs-xs);">Tip: Listen to how ${persona.name} rephrases your words</span>`;
            setTimeout(() => {
                if (correctionEl) correctionEl.style.display = 'none';
            }, 5000);
        }
    }

    // ── Mic Button ──
    micBtn?.addEventListener('click', () => {
        if (state === 'mascot_speaking') {
            TalkEngine.stopSpeaking();
            ringEl?.classList.remove('talk-call__avatar-ring--active');
            avatarEl?.classList.remove('talk-call__avatar--bounce');
        }

        if (state === 'listening') {
            TalkEngine.stopListening();
            micBtn.classList.remove('talk-call__btn--mic-active');
            return;
        }

        state = 'listening';
        setStatus('Listening...');
        micBtn.classList.add('talk-call__btn--mic-active');
        micBtn.classList.remove('talk-call__btn--mic-pulse');
        setUserSub('');
        setMascotSub('');
        hideHint();
        clearTimeout(hintTimeout);

        const sttSupported = TalkEngine.startListening(
            null,
            (finalText, confidence) => {
                micBtn.classList.remove('talk-call__btn--mic-active');
                if (finalText) {
                    processUserSpeech(finalText);
                } else {
                    state = 'waiting';
                    setStatus('Your turn \u2014 tap mic to speak');
                    startHintTimer();
                }
            },
            interim => {
                setUserSub(`${LangyIcons.mic} ${escapeHtml(interim)}...`);
            }
        );

        if (!sttSupported) {
            showManualInput();
        }
    });

    // Hint "Use this phrase" button
    container.querySelector('#hint-use')?.addEventListener('click', () => {
        const phrase = hintTextEl?.textContent?.replace(/"/g, '') || '';
        if (phrase) {
            hideHint();
            processUserSpeech(phrase);
        }
    });

    // Manual text input fallback
    function showManualInput() {
        micBtn.classList.remove('talk-call__btn--mic-active');
        const input = prompt(`Type your response to ${persona.name}:`);
        if (input) {
            processUserSpeech(input);
        } else {
            state = 'waiting';
            setStatus('Your turn \u2014 tap mic to speak');
            startHintTimer();
        }
    }

    // ── Subs Toggle ──
    container.querySelector('#talk-mute')?.addEventListener('click', () => {
        showSubs = !showSubs;
        Anim.showToast(showSubs ? 'Subtitles ON' : 'Subtitles OFF');
        if (!showSubs) mascotSub.style.display = 'none';
    });

    // ── End Call with Confirm ──
    function endCall() {
        if (turnCount < minTurns) {
            showEndConfirm();
        } else {
            doEndCall();
        }
    }

    function showEndConfirm() {
        const overlay = document.createElement('div');
        overlay.className = 'talk-confirm__overlay';
        overlay.innerHTML = `
            <div class="talk-confirm">
                <div style="font-size:24px; color:var(--primary); margin-bottom:var(--sp-3);">${LangyIcons.alertCircle}</div>
                <h3>End conversation?</h3>
                <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin:var(--sp-2) 0 var(--sp-4);">
                    You need ${minTurns}+ exchanges to earn XP and Dangy. You've made ${turnCount} so far.
                </p>
                <div style="display:flex; gap:var(--sp-2); width:100%;">
                    <button class="btn btn--primary btn--full" id="confirm-keep">Keep Talking</button>
                    <button class="btn btn--ghost btn--full" id="confirm-end" style="color:var(--danger);">End Call</button>
                </div>
            </div>
        `;
        container.appendChild(overlay);

        overlay.querySelector('#confirm-keep')?.addEventListener('click', () => overlay.remove());
        overlay.querySelector('#confirm-end')?.addEventListener('click', () => {
            overlay.remove();
            doEndCall();
        });
    }

    function doEndCall() {
        clearInterval(timerInterval);
        clearTimeout(hintTimeout);

        // Get AI feedback before ending (if qualified)
        const feedbackPromise = turnCount >= minTurns ? TalkEngine.getAIFeedback() : Promise.resolve(null);

        feedbackPromise
            .then(feedback => {
                ScreenState.set('talkAIFeedback', feedback);
                TalkEngine.stopSpeaking();
                TalkEngine.stopListening();
                ScreenState.set('talkSummary', TalkEngine.endSession());
                ScreenState.set('talkView', 'summary');
                renderTalk(container);
            })
            .catch(() => {
                ScreenState.set('talkAIFeedback', null);
                TalkEngine.stopSpeaking();
                TalkEngine.stopListening();
                ScreenState.set('talkSummary', TalkEngine.endSession());
                ScreenState.set('talkView', 'summary');
                renderTalk(container);
            });
    }

    container.querySelector('#talk-end')?.addEventListener('click', endCall);
    container.querySelector('#talk-end-top')?.addEventListener('click', endCall);

    // ── Start the conversation ──
    setTimeout(() => {
        setStatus('Connected!');
        if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
        setTimeout(() => mascotSpeak(scenario.opener), 500);
    }, 800);

    updateProgress();
}

// ═══════════════════════════════════════
// SCREEN 3: Post-Call Summary
// ═══════════════════════════════════════
function renderTalkSummary(container) {
    const summary = ScreenState.get('talkSummary', {});
    const feedback = ScreenState.get('talkAIFeedback', null);
    const qualified = summary.qualifiedForRewards;
    if (qualified && !LangyState.user.firstSessionCompleted) {
        LangyState.user.firstSessionCompleted = true;
        if (typeof LangyDB !== 'undefined' && LangyDB.currentUser) {
            LangyDB.saveProgress().catch(() => {});
        }
    }
    const mins = Math.floor((summary.duration || 0) / 60);
    const secs = (summary.duration || 0) % 60;
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const isFirstSession = !LangyState.talkHistory || LangyState.talkHistory.length <= 1;
    const sessionCount = (LangyState.talkHistory || []).length || 1;
    const mascotId = summary.mascotId ?? LangyState.mascot?.selected ?? 0;
    const mascotName = summary.mascot || ['Zendaya', 'Travis', 'Matthew', 'Omar', 'Elyanna', 'Adel Imam'][mascotId] || 'Your coach';
    const imgs = { 0: 'zendaya', 1: 'travis', 2: 'matthew', 3: 'omar', 4: 'elyanna', 5: 'adel_imam' };
    const mascotColors = { 0: '#7C6CF6', 1: '#4ADE80', 2: '#F59E0B', 3: '#06B6D4', 4: '#C084FC', 5: '#F97316' };
    const mascotColor = mascotColors[mascotId] || 'var(--primary)';

    // Structured vs plain feedback
    const isStructured = feedback && feedback._structured;
    const praise = isStructured ? feedback.praise : null;
    const corrections = isStructured ? (feedback.corrections || []) : [];
    const tip = isStructured ? feedback.tip : null;
    const plainFeedback = !isStructured && typeof feedback === 'string' ? feedback : null;

    // Pronunciation
    const pronLabels = { excellent: 'Excellent', good: 'Good', fair: 'Fair', needs_work: 'Needs Work' };
    const pronColors = { excellent: 'var(--primary)', good: '#4ADE80', fair: '#F59E0B', needs_work: '#EF4444' };
    const pronLevel = summary.pronunciationLevel || null;
    const coachingFocus = ScreenState.get('coachLoopFocus', null);
    const isCoachingRetrySession = !!ScreenState.get('coachLoopActive', false) && !!coachingFocus;

    function detectWeakSpot() {
        // ── Spec §7: No weak spot if corrections empty, AI failed, or session unqualified ──
        if (!corrections.length) return null;
        const c0 = corrections[0];
        if (!c0 || !c0.better || c0.better.trim().length === 0) return null;
        if (!qualified) return null;

        const source = (c0.why || '').toLowerCase();
        const said = (c0.said || '').toLowerCase();
        const better = c0.better;

        // ── Priority 1: Coach AI tag (premium) — use directly if set ──
        if (c0.tag && typeof c0.tag === 'string') {
            const tagLabels = {
                articles:          { en: 'articles (a / an / the)', ru: 'артикли (a / an / the)', es: 'artículos (a / an / the)' },
                verb_tense:        { en: 'verb tense', ru: 'согласование времен', es: 'tiempos verbales' },
                tense:             { en: 'verb tense', ru: 'согласование времен', es: 'tiempos verbales' },
                prepositions:      { en: 'prepositions', ru: 'предлоги', es: 'preposiciones' },
                preposition:       { en: 'prepositions', ru: 'предлоги', es: 'preposiciones' },
                word_order:        { en: 'word order', ru: 'порядок слов', es: 'orden de palabras' },
                agreement:         { en: 'agreement', ru: 'согласование', es: 'concordancia' },
                vocabulary:        { en: 'vocabulary', ru: 'словарный запас', es: 'vocabulario' },
                pronunciation:     { en: 'pronunciation', ru: 'произношение', es: 'pronunciación' },
                sentence_clarity:  { en: 'sentence clarity', ru: 'структура фразы', es: 'claridad de la frase' },
            };
            const normalized = c0.tag.toLowerCase().replace(/\s+/g, '_');
            const labels = tagLabels[normalized] || tagLabels.sentence_clarity;
            return { tag: normalized, label: labels[lang], prompt: better };
        }

        // ── Priority 2: Keyword detection on corrections[0] ──
        if (source.includes('article') || /\b(a|an|the)\b/.test(said)) {
            return {
                tag: 'articles',
                label: { en: 'articles (a / an / the)', ru: 'артикли (a / an / the)', es: 'artículos (a / an / the)' }[lang],
                prompt: better,
            };
        }
        if (source.includes('tense') || source.includes('past') || source.includes('present')) {
            return {
                tag: 'verb_tense',
                label: { en: 'verb tense', ru: 'согласование времен', es: 'tiempos verbales' }[lang],
                prompt: better,
            };
        }
        if (source.includes('preposition')) {
            return {
                tag: 'prepositions',
                label: { en: 'prepositions', ru: 'предлоги', es: 'preposiciones' }[lang],
                prompt: better,
            };
        }
        if (source.includes('word order') || source.includes('order')) {
            return {
                tag: 'word_order',
                label: { en: 'word order', ru: 'порядок слов', es: 'orden de palabras' }[lang],
                prompt: better,
            };
        }
        if (source.includes('agreement') || source.includes('agree')) {
            return {
                tag: 'agreement',
                label: { en: 'agreement', ru: 'согласование', es: 'concordancia' }[lang],
                prompt: better,
            };
        }

        // ── Priority 3: Fallback ──
        return {
            tag: 'sentence_clarity',
            label: { en: 'sentence clarity', ru: 'структура фразы', es: 'claridad de la frase' }[lang],
            prompt: better,
        };
    }

    const detectedWeakSpot = detectWeakSpot();
    const activeWeakSpot = coachingFocus || detectedWeakSpot;
    const focusRelatedCorrections = activeWeakSpot
        ? corrections.filter(c => {
              const text = `${c?.why || ''} ${c?.said || ''} ${c?.better || ''}`.toLowerCase();
              return text.includes(activeWeakSpot.tag.split('_')[0]);
          })
        : [];
    const retryOutcome = isCoachingRetrySession
        ? focusRelatedCorrections.length === 0
            ? {
                  title: { en: 'Nice improvement!', ru: 'Отличный прогресс!', es: '¡Buen progreso!' }[lang],
                  text: {
                      en: `You improved ${activeWeakSpot?.label}. Keep this pattern in your next conversation.`,
                      ru: `Ты улучшил(а) ${activeWeakSpot?.label}. Сохрани этот паттерн в следующем разговоре.`,
                      es: `Mejoraste ${activeWeakSpot?.label}. Mantén este patrón en tu próxima conversación.`,
                  }[lang],
                  icon: LangyIcons.check,
                  color: 'var(--primary)',
              }
            : {
                  title: { en: 'Good retry. One more short practice.', ru: 'Хорошая попытка. Ещё немного практики.', es: 'Buen intento. Una práctica más.' }[lang],
                  text: {
                      en: `Focus again on ${activeWeakSpot?.label} in one short sentence.`,
                      ru: `Сфокусируйся ещё раз на ${activeWeakSpot?.label} в одной короткой фразе.`,
                      es: `Concéntrate otra vez en ${activeWeakSpot?.label} en una frase corta.`,
                  }[lang],
                  icon: LangyIcons.target,
                  color: '#F59E0B',
              }
        : null;

    // Coaching next-step (personalized, not generic)
    const goal = LangyState.user?.goal || 'speak';
    const nextScenario = (() => {
        const scenarioSuggestions = {
            speak: { en: 'Coffee Shop', ru: 'Кофейня', es: 'Cafetería' },
            work: { en: 'Job Interview', ru: 'Собеседование', es: 'Entrevista' },
            travel: { en: 'At the Airport', ru: 'В аэропорту', es: 'En el aeropuerto' },
            exam: { en: 'Free Talk', ru: 'Свободный разговор', es: 'Charla libre' },
        };
        const current = summary.scenario || '';
        const suggestions = Object.values(scenarioSuggestions);
        const different = suggestions.find(s => s.en !== current) || suggestions[0];
        return different[lang];
    })();

    const nextStep = (() => {
        if (!qualified) {
            return {
                en: `Try talking a bit longer next time — ${mascotName} needs 3+ exchanges to give proper feedback.`,
                ru: `Попробуй поговорить дольше — ${mascotName} нужно 3+ реплики для полноценного фидбэка.`,
                es: `Intenta hablar un poco más — ${mascotName} necesita 3+ intercambios para dar feedback.`,
            }[lang];
        }
        if (isFirstSession) {
            return {
                en: `Come back tomorrow and try "${nextScenario}" — ${mascotName} will remember your progress.`,
                ru: `Возвращайся завтра и попробуй «${nextScenario}» — ${mascotName} запомнит твой прогресс.`,
                es: `Vuelve mañana y prueba "${nextScenario}" — ${mascotName} recordará tu progreso.`,
            }[lang];
        }
        if (corrections.length === 0) {
            return {
                en: `You nailed it! Try "${nextScenario}" next — ${mascotName} thinks you're ready for a challenge.`,
                ru: `Безупречно! Попробуй «${nextScenario}» — ${mascotName} считает, что ты готов к вызову.`,
                es: `¡Perfecto! Prueba "${nextScenario}" — ${mascotName} cree que estás listo para más.`,
            }[lang];
        }
        return {
            en: `Practice the corrections above, then try again — ${mascotName} will check your progress.`,
            ru: `Запомни исправления выше и попробуй ещё — ${mascotName} проверит твой прогресс.`,
            es: `Practica las correcciones y vuelve a intentar — ${mascotName} revisará tu progreso.`,
        }[lang];
    })();

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div style="padding: var(--sp-5) var(--sp-5) var(--sp-4); overflow-y:auto; flex:1;">

                <!-- Coach Header -->
                <div style="text-align:center; margin-bottom:var(--sp-5); animation:fadeInUp 0.5s var(--ease-out);">
                    <div style="position:relative; display:inline-block; margin-bottom:var(--sp-3);">
                        <div style="width:72px; height:72px; border-radius:50%; overflow:hidden; margin:0 auto;
                                    border:3px solid ${mascotColor}; box-shadow:0 4px 20px ${mascotColor}33;">
                            <img src="assets/mascots/${imgs[mascotId]}.png" alt="${mascotName}"
                                 style="width:100%; height:100%; object-fit:contain;"
                                 onerror="this.onerror=null; this.src=this.src.replace('.png','.svg');">
                        </div>
                        <div style="position:absolute; bottom:-4px; right:-4px; width:24px; height:24px;
                                    border-radius:50%; background:var(--primary); color:white;
                                    display:flex; align-items:center; justify-content:center; font-size:14px;
                                    box-shadow:var(--shadow-sm);">
                            ${qualified ? LangyIcons.check : LangyIcons.messageCircle}
                        </div>
                    </div>
                    <div style="font-size:var(--fs-xs); color:${mascotColor}; font-weight:var(--fw-bold); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:var(--sp-1);">
                        ${{ en: `Session #${sessionCount}`, ru: `Сессия #${sessionCount}`, es: `Sesión #${sessionCount}` }[lang]}
                    </div>
                    <h2 style="font-size:var(--fs-xl); margin-bottom:var(--sp-1);">${{
                        en: `${mascotName}'s notes`,
                        ru: `Заметки от ${mascotName}`,
                        es: `Notas de ${mascotName}`,
                    }[lang]}</h2>
                    <p style="color:var(--text-tertiary); font-size:var(--fs-sm);">
                        ${mins}:${secs.toString().padStart(2, '0')} · ${summary.turns || 0} ${{ en: 'exchanges', ru: 'реплик', es: 'intercambios' }[lang]}
                    </p>
                    ${typeof MascotPersona !== 'undefined' ? `<p style="font-style:italic; color:var(--text-secondary); font-size:var(--fs-sm); margin-top:var(--sp-1);">"${qualified ? MascotPersona.tone('lessonComplete', mascotId) : MascotPersona.tone('encouragement', mascotId)}"</p>` : ''}
                </div>

                ${praise ? `
                <!-- What you did well -->
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:linear-gradient(135deg, ${mascotColor}08, ${mascotColor}04);
                    border:1px solid ${mascotColor}20; animation:fadeInUp 0.5s var(--ease-out) 0.1s both;">
                    <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                        <div style="width:32px; height:32px; border-radius:50%; background:${mascotColor}15;
                                    display:flex; align-items:center; justify-content:center; flex-shrink:0;
                                    color:${mascotColor}; font-size:16px;">
                            ${LangyIcons.sparkles}
                        </div>
                        <div>
                            <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:${mascotColor}; margin-bottom:4px;">
                                ${{ en: 'What you did well', ru: 'Что получилось', es: 'Lo que hiciste bien' }[lang]}
                            </div>
                            <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.6;">
                                ${escapeHTML(praise)}
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${(() => {
                    // Spec §7c: Show focus block when weak spot exists, UNLESS retry improved
                    const retryImproved = isCoachingRetrySession && focusRelatedCorrections.length === 0;
                    return activeWeakSpot && !retryImproved ? `
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:rgba(124,108,246,0.05); border:1px solid rgba(124,108,246,0.2);
                    animation:fadeInUp 0.5s var(--ease-out) 0.15s both;">
                    <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                        <div style="width:32px; height:32px; border-radius:50%; background:rgba(124,108,246,0.12);
                                    display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#7C6CF6;">
                            ${LangyIcons.target}
                        </div>
                        <div style="flex:1;">
                            <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:#7C6CF6; margin-bottom:6px;">
                                ${{ en: 'Coach focus for now', ru: 'Фокус коуча на сейчас', es: 'Enfoque del coach ahora' }[lang]}
                            </div>
                            <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0 0 var(--sp-2);">
                                ${{
                                    en: `Let's improve: ${activeWeakSpot.label}.`,
                                    ru: `Давай улучшим: ${activeWeakSpot.label}.`,
                                    es: `Vamos a mejorar: ${activeWeakSpot.label}.`,
                                }[lang]}
                            </p>
                            <p style="font-size:var(--fs-xs); color:var(--text-tertiary); margin:0 0 var(--sp-3);">
                                ${{
                                    en: `Retry line: "${escapeHTML(activeWeakSpot.prompt)}"`,
                                    ru: `Фраза для повтора: "${escapeHTML(activeWeakSpot.prompt)}"`,
                                    es: `Frase para reintento: "${escapeHTML(activeWeakSpot.prompt)}"`,
                                }[lang]}
                            </p>
                            <button class="btn btn--sm btn--primary" id="coach-retry-now">
                                ${LangyIcons.refreshCw} ${{ en: 'Retry this now', ru: 'Повторить сейчас', es: 'Reintentar ahora' }[lang]}
                            </button>
                        </div>
                    </div>
                </div>
                ` : '';
                })()}

                ${retryOutcome ? `
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:${retryOutcome.color}10; border:1px solid ${retryOutcome.color}30;">
                    <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                        <div style="width:32px; height:32px; border-radius:50%; background:${retryOutcome.color}20;
                                    display:flex; align-items:center; justify-content:center; flex-shrink:0; color:${retryOutcome.color};">
                            ${retryOutcome.icon}
                        </div>
                        <div>
                            <div style="font-weight:var(--fw-bold); color:${retryOutcome.color}; margin-bottom:4px;">${retryOutcome.title}</div>
                            <p style="margin:0; font-size:var(--fs-sm); color:var(--text-secondary);">${retryOutcome.text}</p>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${corrections.length > 0 ? `
                <!-- Corrections -->
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:var(--bg-card); border:1px solid var(--border);
                    animation:fadeInUp 0.5s var(--ease-out) 0.2s both;">
                    <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); margin-bottom:var(--sp-3); display:flex; align-items:center; gap:8px;">
                        <div style="width:32px; height:32px; border-radius:50%; background:rgba(245,158,11,0.1);
                                    display:flex; align-items:center; justify-content:center; flex-shrink:0;
                                    color:#F59E0B; font-size:16px;">
                            ${LangyIcons.pencil}
                        </div>
                        ${{ en: 'Key corrections', ru: 'Исправления', es: 'Correcciones clave' }[lang]}
                    </div>
                    ${corrections.map(c => `
                        <div style="padding:var(--sp-3); margin-bottom:var(--sp-2); border-radius:var(--radius-sm);
                                    background:var(--bg-alt);">
                            <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:6px;">
                                <span style="color:var(--danger); font-size:var(--fs-sm); text-decoration:line-through; opacity:0.7;">${escapeHTML(c.said || '')}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:var(--sp-2); margin-bottom:4px;">
                                <span style="color:var(--primary); font-size:13px;">→</span>
                                <span style="color:var(--primary); font-size:var(--fs-sm); font-weight:var(--fw-bold);">${escapeHTML(c.better || '')}</span>
                            </div>
                            ${c.why ? `<div style="font-size:var(--fs-xs); color:var(--text-tertiary); font-style:italic; padding-left:22px;">${escapeHTML(c.why)}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                ${tip ? `
                <!-- Coach tip -->
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:rgba(124,108,246,0.04); border:1px solid rgba(124,108,246,0.15);
                    animation:fadeInUp 0.5s var(--ease-out) 0.3s both;">
                    <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                        <div style="width:32px; height:32px; border-radius:50%; background:rgba(124,108,246,0.1);
                                    display:flex; align-items:center; justify-content:center; flex-shrink:0;
                                    color:#7C6CF6; font-size:16px;">
                            ${LangyIcons.brain}
                        </div>
                        <div>
                            <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:#7C6CF6; margin-bottom:4px;">
                                ${{ en: `${mascotName}'s tip`, ru: `Совет от ${mascotName}`, es: `Consejo de ${mascotName}` }[lang]}
                            </div>
                            <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.6;">
                                ${escapeHTML(tip)}
                            </p>
                        </div>
                    </div>
                </div>
                ` : ''}

                ${plainFeedback ? `
                <div style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    border-left:3px solid #7C6CF6; background:rgba(124,108,246,0.04);">
                    <div style="display:flex; align-items:flex-start; gap:var(--sp-3);">
                        <span style="color:#7C6CF6; font-size:20px; flex-shrink:0;">${LangyIcons.brain}</span>
                        <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; line-height:1.6;">
                            ${escapeHTML(plainFeedback)}
                        </p>
                    </div>
                </div>
                ` : ''}

                ${pronLevel ? `
                <div style="display:flex; align-items:center; gap:var(--sp-3); padding:var(--sp-3) var(--sp-4);
                    background:var(--bg-card); border-radius:var(--radius-md); margin-bottom:var(--sp-3);
                    border:1px solid var(--border); animation:fadeInUp 0.5s var(--ease-out) 0.35s both;">
                    <span style="color:${pronColors[pronLevel]}; font-size:18px;">${LangyIcons.mic}</span>
                    <span style="font-size:var(--fs-sm); color:var(--text-secondary);">
                        ${{ en: 'Pronunciation', ru: 'Произношение', es: 'Pronunciación' }[lang]}
                    </span>
                    <span style="margin-left:auto; font-weight:var(--fw-bold); color:${pronColors[pronLevel]};">
                        ${Math.round((summary.avgPronunciation || 0) * 100)}% · ${pronLabels[pronLevel]}
                    </span>
                </div>
                ` : ''}

                ${!isFirstSession && qualified && (summary.xpEarned || summary.dangyEarned) ? `
                <div style="display:flex; align-items:center; gap:var(--sp-3); padding:var(--sp-3) var(--sp-4);
                    background:var(--bg-card); border-radius:var(--radius-md); margin-bottom:var(--sp-3);
                    border:1px solid var(--border);">
                    <span style="color:var(--reward-gold); font-size:18px;">${LangyIcons.zap}</span>
                    <span style="font-size:var(--fs-sm); color:var(--text-secondary);">
                        ${{ en: 'Earned', ru: 'Получено', es: 'Ganado' }[lang]}
                    </span>
                    <span style="margin-left:auto; font-size:var(--fs-sm); color:var(--text-secondary);">
                        <strong style="color:var(--reward-gold);">+${summary.xpEarned || 0}</strong> XP
                        ${summary.dangyEarned ? ` · <strong style="color:var(--info);">+${summary.dangyEarned}</strong> Dangy` : ''}
                    </span>
                </div>
                ` : ''}

                ${summary.vocabWordsUsed > 0 ? `
                <div style="display:flex; align-items:center; gap:var(--sp-3); padding:var(--sp-3) var(--sp-4);
                    background:var(--bg-card); border-radius:var(--radius-md); margin-bottom:var(--sp-3);
                    border:1px solid var(--border);">
                    <span style="color:#3b82f6; font-size:18px;">${LangyIcons.bookOpen}</span>
                    <span style="font-size:var(--fs-sm); color:var(--text-secondary);">
                        ${{ en: 'Vocab used', ru: 'Словарь', es: 'Vocabulario' }[lang]}
                    </span>
                    <span style="margin-left:auto; font-size:var(--fs-sm); font-weight:var(--fw-bold); color:#3b82f6;">
                        ${summary.vocabWordsUsed} ${{ en: 'words', ru: 'слов', es: 'palabras' }[lang]}
                    </span>
                </div>
                ` : ''}

                ${(() => {
                    const _focusTag = ScreenState.get('coachFocusTag', null);
                    const _isCoach = ['coach', 'pro', 'premium'].includes(LangyState.subscription?.plan);

                    // ── Focused practice session: show focus recap instead of generic next-step ──
                    if (_focusTag && _isCoach && typeof CoachIntel !== 'undefined') {
                        return CoachIntel.renderFocusRecap(_focusTag, corrections, lang);
                    }

                    // ── Regular session: generic next step ──
                    return `
                <div style="text-align:center; padding:var(--sp-4) var(--sp-3); margin:var(--sp-2) 0 var(--sp-4);
                    background:linear-gradient(135deg, var(--primary-bg), rgba(16,185,129,0.03));
                    border-radius:var(--radius-md); border:1px dashed var(--primary);
                    animation:fadeInUp 0.5s var(--ease-out) 0.4s both;">
                    <div style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:var(--primary); margin-bottom:var(--sp-2); display:flex; align-items:center; justify-content:center; gap:6px;">
                        ${LangyIcons.target} ${{ en: 'Your next step', ru: 'Твой следующий шаг', es: 'Tu siguiente paso' }[lang]}
                    </div>
                    <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0; max-width:300px; margin-left:auto; margin-right:auto; line-height:1.5;">
                        ${nextStep}
                    </p>
                </div>`;
                })()}

                ${(() => {
                    const _focusTag = ScreenState.get('coachFocusTag', null);
                    const _isCoach = ['coach', 'pro', 'premium'].includes(LangyState.subscription?.plan);

                    // If focused practice, recap already shown above — skip Coach Memory
                    if (_focusTag && _isCoach) return '';

                    // Coach: rich memory card via CoachIntel
                    if (_isCoach && typeof CoachIntel !== 'undefined') {
                        return CoachIntel.renderSummaryMemory(corrections, lang);
                    }
                    // Free: soft coach prompt on session 2+ only — English-specific curriculum framing
                    if (!_isCoach && !isFirstSession && sessionCount >= 2 && qualified) {
                        const _isEn = typeof LangyTarget !== 'undefined' && LangyTarget.getCode() === 'en';
                        const _tb = typeof LangyCurriculum !== 'undefined' ? LangyCurriculum.getActive() : null;
                        const firstWhy = corrections.length > 0 && corrections[0].why ? corrections[0].why : null;
                        let _promptText;
                        if (_isEn && _tb?.cefr && firstWhy) {
                            // English + correction → tie to curriculum objective
                            const _unitId = LangyState.progress?.currentUnitId || 1;
                            const _unit = _tb.units?.find(u => u.id === _unitId);
                            const _grammarHint = _unit?.grammar?.[0] || firstWhy;
                            _promptText = {
                                en: `You're working on ${_tb.cefr} (${_grammarHint}). Coach would track this correction across sessions and build drills until it sticks — so you actually master it.`,
                                ru: `Ты работаешь над ${_tb.cefr} (${_grammarHint}). Coach отслеживал бы это исправление между сессиями и строил практику до полного освоения.`,
                                es: `Estás trabajando en ${_tb.cefr} (${_grammarHint}). Coach rastrearía esta corrección entre sesiones y crearía práctica hasta dominarla.`,
                            }[lang];
                        } else if (_isEn && _tb?.cefr) {
                            // English but no correction → tie to can-do goals
                            const _nextGoal = _tb.canDo?.[0] || '';
                            _promptText = {
                                en: `${sessionCount} sessions toward ${_tb.cefr}.${_nextGoal ? ` Goal: "${_nextGoal.length > 50 ? _nextGoal.slice(0,47) + '...' : _nextGoal}".` : ''} Coach would connect every session to this goal.`,
                                ru: `${sessionCount} сессий к ${_tb.cefr}. Coach связал бы каждую сессию с целями уровня.`,
                                es: `${sessionCount} sesiones hacia ${_tb.cefr}. Coach conectaría cada sesión con tus objetivos.`,
                            }[lang];
                        } else if (firstWhy) {
                            _promptText = {
                                en: `You made corrections in ${firstWhy} today. With Coach, your AI would track this across sessions and build targeted practice.`,
                                ru: `Сегодня были исправления: ${firstWhy}. С Coach твой ИИ будет отслеживать это между сессиями.`,
                                es: `Hoy hubo correcciones en ${firstWhy}. Con Coach, tu IA rastreará esto entre sesiones.`,
                            }[lang];
                        } else {
                            _promptText = {
                                en: `You've completed ${sessionCount} sessions. With Coach, your AI would remember all of them and help you improve faster.`,
                                ru: `Ты завершил ${sessionCount} сессий. С Coach твой ИИ запомнит их все и поможет прогрессировать быстрее.`,
                                es: `Has completado ${sessionCount} sesiones. Con Coach, tu IA recordaría todas y te ayudaría a mejorar más rápido.`,
                            }[lang];
                        }
                        return `
                <div id="coach-upsell" style="padding:var(--sp-4); margin-bottom:var(--sp-3); border-radius:var(--radius-md);
                    background:var(--bg-card); border-left:3px solid var(--primary);
                    animation:fadeInUp 0.5s var(--ease-out) 0.45s both; cursor:pointer;"
                    onclick="Router.navigate('subscription')">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:var(--sp-2);">
                        <span style="color:var(--primary); font-size:16px;">${LangyIcons.brain}</span>
                        <span style="font-weight:var(--fw-bold); font-size:var(--fs-sm); color:var(--primary);">
                            ${{ en: 'Session insight', ru: 'Наблюдение', es: 'Observación' }[lang]}
                        </span>
                    </div>
                    <p style="font-size:var(--fs-sm); color:var(--text-secondary); margin:0 0 var(--sp-2); line-height:1.5;">
                        ${_promptText}
                    </p>
                    <span style="font-size:var(--fs-xs); color:var(--primary); font-weight:var(--fw-bold);">
                        ${{ en: 'Learn more →', ru: 'Подробнее →', es: 'Más info →' }[lang]}
                    </span>
                </div>`;
                    }
                    return '';
                })()}

                <!-- Actions -->
                <div style="display:flex; gap:var(--sp-2); margin-bottom:var(--sp-3);">
                    <button class="btn btn--primary btn--full" id="talk-again">
                        ${LangyIcons.refreshCw} ${isFirstSession
                            ? { en: 'Try another topic', ru: 'Другая тема', es: 'Otro tema' }[lang]
                            : { en: 'Talk Again', ru: 'Ещё раз', es: 'Hablar de nuevo' }[lang]}
                    </button>
                </div>
                <button class="btn btn--ghost btn--full" id="talk-done">
                    ${{ en: 'Done for now', ru: 'На этом всё', es: 'Listo por ahora' }[lang]}
                </button>
            </div>
        </div>
    `;

    if (qualified && typeof AudioUtils !== 'undefined') AudioUtils.playVictory();

    container.querySelector('#talk-again')?.addEventListener('click', () => {
        ScreenState.remove('coachFocus');
        ScreenState.remove('coachFocusTag');
        ScreenState.remove('coachLoopActive');
        ScreenState.remove('coachLoopFocus');
        if (isFirstSession) {
            ScreenState.set('talkView', 'select');
        } else {
            ScreenState.set('talkView', 'call');
        }
        renderTalk(container);
    });

    container.querySelector('#talk-done')?.addEventListener('click', () => {
        ScreenState.remove('talkView');
        ScreenState.remove('coachFocus');
        ScreenState.remove('coachFocusTag');
        ScreenState.remove('coachLoopActive');
        ScreenState.remove('coachLoopFocus');
        Router.navigate('home');
    });

    container.querySelector('#coach-retry-now')?.addEventListener('click', () => {
        if (!activeWeakSpot) return;
        ScreenState.set('coachLoopFocus', activeWeakSpot);
        ScreenState.set('coachLoopActive', true);
        ScreenState.set('coachFocus', activeWeakSpot.label);
        ScreenState.set('coachFocusTag', activeWeakSpot.tag);
        ScreenState.set('talkView', 'call');
        renderTalk(container);
    });

    // Coach: wire 'Practice this now' button from summary memory card
    container.querySelector('#coach-practice-summary')?.addEventListener('click', () => {
        if (typeof CoachIntel !== 'undefined') {
            const focus = CoachIntel.recommendedFocus(lang);
            if (focus) CoachIntel.launchFocusPractice(focus.tag);
        }
    });

    // Coach: wire focus recap next-action button
    container.querySelector('#coach-focus-next')?.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const focusTag = btn.dataset.focus;

        if (action === 'practice_again' && focusTag && typeof CoachIntel !== 'undefined') {
            // Relaunch focused practice on same tag
            CoachIntel.launchFocusPractice(focusTag);
        } else {
            // Move on: clear focus, go to regular talk
            ScreenState.remove('coachFocus');
            ScreenState.remove('coachFocusTag');
            ScreenState.set('talkView', 'call');
            renderTalk(container);
        }
    });
}

Router.register('talk', renderTalk);
