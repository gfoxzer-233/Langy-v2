/* ============================================
   LANGY — DEEPTUTOR GLOBAL WIDGET
   ============================================ */

const DeepTutor = {
    overlay: null,
    badge: null,
    messages: null,
    isOpen: false,

    init() {
        // Create the Widget (Peeking Badge)
        this.badge = document.createElement('div');
        this.badge.className = 'tutor-widget';
        this.badge.id = 'tutor-widget';

        const chosenIdx = LangyState.mascot.selected || 0;
        const mascotImg = typeof TalkEngine !== 'undefined' ? TalkEngine.getMascotImage(chosenIdx)
            : ['zendaya', 'travis', 'matthew', 'omar', 'elyanna', 'adel_imam'][chosenIdx] || 'zendaya';

        this.badge.innerHTML = `
            <div class="tutor-widget__badge">
                <img src="assets/mascots/${mascotImg}.png" alt="Mascot">
            </div>
        `;

        this.badge.onclick = () => this.open();
        document.body.appendChild(this.badge);

        // Hidden by default until show() is called by the router
        // CSS already sets display:none, no need for inline style

        // Create the Overlay (Chat Window)
        this.overlay = document.createElement('div');
        this.overlay.className = 'tutor-overlay';
        // Build curriculum-aware header and placeholder
        const cefrBadge = this._getCefrBadge();
        const inputPlaceholder = this._getInputPlaceholder();

        this.overlay.innerHTML = `
            <div class="tutor-chat-window">
                <header class="tutor-chat__header">
                    <strong>DeepTutor</strong>
                    ${cefrBadge}
                    <span class="tutor-chat__close" id="tutor-close">✕</span>
                </header>
                <div class="tutor-chat__messages" id="tutor-messages"></div>
                <div class="tutor-chat__input">
                    <input type="text" class="input" id="tutor-input" placeholder="${inputPlaceholder}" autocomplete="off">
                    <button class="btn btn--primary btn--icon" id="tutor-send">↑</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        this.messages = this.overlay.querySelector('#tutor-messages');

        // Handlers
        this.overlay.querySelector('#tutor-close').onclick = () => this.close();
        this.overlay.querySelector('#tutor-send').onclick = () => this.handleSend();
        this.overlay.querySelector('#tutor-input').onkeypress = e => {
            if (e.key === 'Enter') this.handleSend();
        };

        // Load History
        this.loadHistory();
    },

    open() {
        this.isOpen = true;
        this.overlay.classList.add('is-active');
        this.badge.style.opacity = '0';
        this.overlay.querySelector('#tutor-input').focus();
    },

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('is-active');
        this.badge.style.opacity = '1';
    },

    loadHistory() {
        const history = LangyState.aiMemory.conversationContext;
        if (history.length === 0) {
            this.addMessage(this._getGreeting(), 'ai');
            // Show curriculum-aware quick-prompt suggestions for English
            this._showQuickPrompts();
        } else {
            history.forEach(m => this.addMessage(m.content, m.role, false));
        }
    },

    addMessage(text, role, save = true) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble chat-bubble--${role === 'ai' ? 'ai' : 'user'}`;
        bubble.textContent = text;
        this.messages.appendChild(bubble);
        this.messages.scrollTop = this.messages.scrollHeight;

        if (save) {
            LangyState.aiMemory.conversationContext.push({
                role,
                content: text,
                timestamp: Date.now(),
            });
        }
    },

    async handleSend(directText, silent = false) {
        const input = this.overlay.querySelector('#tutor-input');
        const val = directText || (input ? input.value.trim() : '');
        if (!val) return;

        if (input && !directText) input.value = '';
        if (!silent) this.addMessage(val, 'user');

        // Prepare AI response bubble (empty for streaming)
        const aiBubble = this.createMessageBubble('', 'ai');
        this.messages.appendChild(aiBubble);
        this.setEmotion('thinking');

        try {
            await LangyAI.askDeepTutor(
                val,
                (chunk, full) => {
                    // Update the bubble in real-time
                    aiBubble.textContent = full;
                    this.messages.scrollTop = this.messages.scrollHeight;
                },
                finalResponse => {
                    // Save to persistent memory once complete
                    LangyState.aiMemory.conversationContext.push({
                        role: 'ai',
                        content: finalResponse,
                        timestamp: Date.now(),
                    });
                    this.setEmotion('neutral');
                }
            );
        } catch (err) {
            aiBubble.textContent =
                "Sorry, I'm having trouble connecting. Please check your internet connection and try again.";
            this.setEmotion('neutral');
        }
    },

    show() {
        if (!this.badge) this.init();
        this.badge.style.display = ''; // Remove any inline display override
        this.badge.classList.add('is-visible');
    },

    hide() {
        if (this.badge) {
            this.badge.classList.remove('is-visible');
            this.close();
        }
    },

    resetChat() {
        this.messages.innerHTML = '';
        LangyAI.chatSessionId = null; // Forces DeepTutor to start a fresh backend session
        this.loadHistory();
    },

    createMessageBubble(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble chat-bubble--${role === 'ai' ? 'ai' : 'user'}`;
        bubble.textContent = text;
        return bubble;
    },

    setEmotion(emotion) {
        if (!this.badge) return;
        const img = this.badge.querySelector('img');
        const emotions = ['happy', 'thinking', 'encouraging', 'surprised', 'neutral'];

        emotions.forEach(e => this.badge.classList.remove(`mascot--${e}`));
        if (emotion !== 'neutral') {
            this.badge.classList.add(`mascot--${emotion}`);
        }
    },

    // ─── Curriculum-aware helpers ───

    /** Build a curriculum-grounded greeting for the tutor */
    _getGreeting() {
        const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
        const targetCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';

        // English: curriculum-rich greeting
        if (targetCode === 'en' && typeof LangyCurriculum !== 'undefined') {
            const tb = LangyCurriculum.getActive();
            if (tb) {
                const cefr = tb.cefr || '';
                const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
                const unit = unitId && tb.units ? tb.units.find(u => u.id === unitId) : null;
                const unitName = unit ? unit.title : '';
                const canDoIndex = unit?.id ? unit.id - 1 : 0;
                const canDo = unit?.objective || (tb.canDo && tb.canDo.length ? (tb.canDo[canDoIndex] || tb.canDo[0]) : '');

                if (lang === 'ru') {
                    let g = `Привет! Я твой AI-репетитор по английскому.`;
                    if (cefr) g += ` Ты на уровне CEFR ${cefr}.`;
                    if (unitName) g += ` Сейчас мы работаем над: «${unitName}».`;
                    if (canDo) g += ` Цель: ${canDo}.`;
                    g += ` Спрашивай что угодно — грамматику, лексику, или попроси объяснить задание.`;
                    return g;
                }
                if (lang === 'es') {
                    let g = `¡Hola! Soy tu tutor AI de inglés.`;
                    if (cefr) g += ` Estás en el nivel CEFR ${cefr}.`;
                    if (unitName) g += ` Ahora trabajamos en: "${unitName}".`;
                    if (canDo) g += ` Objetivo: ${canDo}.`;
                    g += ` Pregunta lo que quieras — gramática, vocabulario, o pide que explique un ejercicio.`;
                    return g;
                }
                // English UI
                let g = `Hi! I'm your English tutor.`;
                if (cefr) g += ` You're at CEFR ${cefr}.`;
                if (unitName) g += ` We're working on: "${unitName}".`;
                if (canDo) g += ` Goal: ${canDo}.`;
                g += ` Ask me about grammar, vocabulary, or any exercise you need help with.`;
                return g;
            }
        }

        // Non-English or no curriculum: simple greeting
        const greetings = {
            en: "Hi! I'm your language tutor. Ask me anything about your current lesson.",
            ru: 'Привет! Я твой языковой репетитор. Спрашивай что угодно по текущему уроку.',
            es: '¡Hola! Soy tu tutor de idiomas. Pregúntame lo que quieras sobre tu lección actual.',
        };
        return greetings[lang] || greetings.en;
    },

    /** CEFR badge for the chat header */
    _getCefrBadge() {
        const targetCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
        if (targetCode === 'en' && typeof LangyCurriculum !== 'undefined') {
            const tb = LangyCurriculum.getActive();
            if (tb && tb.cefr) {
                return `<span style="font-size:10px; font-weight:700; background:var(--primary); color:#fff; padding:1px 6px; border-radius:4px; margin-left:auto; margin-right:8px;">${tb.cefr}</span>`;
            }
        }
        return '<span style="margin-left:auto;"></span>';
    },

    /** Context-aware input placeholder */
    _getInputPlaceholder() {
        const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
        const targetCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
        if (targetCode === 'en') {
            return {
                en: 'Ask about grammar, vocabulary, or exercises...',
                ru: 'Спроси о грамматике, лексике или заданиях...',
                es: 'Pregunta sobre gramática, vocabulario o ejercicios...',
            }[lang] || 'Ask about grammar, vocabulary, or exercises...';
        }
        return {
            en: 'Ask your tutor anything...',
            ru: 'Спроси репетитора...',
            es: 'Pregunta a tu tutor...',
        }[lang] || 'Ask your tutor anything...';
    },

    /** Show quick-prompt suggestion chips after the greeting */
    _showQuickPrompts() {
        if (!this.messages) return;

        const targetCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
        const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
        const suggestions = [];

        if (targetCode === 'en' && typeof LangyCurriculum !== 'undefined') {
            const tb = LangyCurriculum.getActive();
            if (tb) {
                const cefr = tb.cefr || '';
                const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
                const unit = unitId && tb.units ? tb.units.find(u => u.id === unitId) : null;
                const grammarTopic = unit?.grammar?.[0] || '';
                const canDo = tb.canDo && tb.canDo.length ? tb.canDo[0] : '';
                const weakAreas = typeof LangyAI !== 'undefined' ? LangyAI.getWeakAreas() : [];

                // Grammar explanation for current unit
                if (grammarTopic) {
                    const label = lang === 'ru' ? `Объясни: ${grammarTopic}` : lang === 'es' ? `Explica: ${grammarTopic}` : `Explain: ${grammarTopic}`;
                    suggestions.push({ label, prompt: `Explain the grammar rule "${grammarTopic}" for CEFR ${cefr} level. Give 2-3 examples.` });
                }

                // Can-do outcome question
                if (canDo) {
                    const label = lang === 'ru' ? `Что значит: «${canDo.substring(0, 30)}...»?` : `What does "${canDo.substring(0, 30)}..." mean for me?`;
                    suggestions.push({ label, prompt: `I'm working toward this can-do outcome: "${canDo}". What specific skills do I need to practice at CEFR ${cefr}?` });
                }

                // Weak areas review
                if (weakAreas.length > 0) {
                    const label = lang === 'ru' ? 'Мои слабые места' : lang === 'es' ? 'Mis áreas débiles' : 'Review my weak areas';
                    suggestions.push({ label, prompt: `My weak areas are: ${weakAreas.join(', ')}. Give me a focused review with 1 example exercise for each.` });
                }

                // Level-appropriate general prompt
                const practiceLabel = lang === 'ru' ? `Упражнение на ${cefr}` : lang === 'es' ? `Ejercicio ${cefr}` : `Quick ${cefr} practice`;
                suggestions.push({ label: practiceLabel, prompt: `Give me a quick grammar exercise appropriate for CEFR ${cefr}. Include the exercise, then wait for my answer before giving feedback.` });
            }
        } else {
            // Non-English: generic suggestions
            const s = {
                en: [{ label: 'Explain today\'s topic', prompt: 'Explain the current grammar topic with examples.' }, { label: 'Give me an exercise', prompt: 'Give me a practice exercise for the current lesson.' }],
                ru: [{ label: 'Объясни тему', prompt: 'Объясни текущую тему грамматики с примерами.' }, { label: 'Дай упражнение', prompt: 'Дай мне упражнение по текущему уроку.' }],
                es: [{ label: 'Explica el tema', prompt: 'Explica el tema de gramática actual con ejemplos.' }, { label: 'Dame un ejercicio', prompt: 'Dame un ejercicio de práctica para la lección actual.' }],
            };
            (s[lang] || s.en).forEach(item => suggestions.push(item));
        }

        if (suggestions.length === 0) return;

        // Render suggestion chips
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'tutor-quick-prompts';
        chipsContainer.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; padding:8px 12px;';
        suggestions.forEach(s => {
            const chip = document.createElement('button');
            chip.style.cssText = 'font-size:12px; padding:4px 10px; border-radius:12px; border:1px solid var(--border); background:var(--card-bg); color:var(--text-secondary); cursor:pointer; white-space:nowrap; transition:all 0.2s;';
            chip.textContent = s.label;
            chip.onclick = () => {
                chipsContainer.remove(); // Remove chips after use
                this.handleSend(s.prompt, false);
            };
            chipsContainer.appendChild(chip);
        });
        this.messages.appendChild(chipsContainer);
        this.messages.scrollTop = this.messages.scrollHeight;
    },
};

