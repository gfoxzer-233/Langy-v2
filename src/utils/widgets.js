/* ============================================
   LANGY — INTERACTIVE WIDGETS MODULE
   Shared between Placement Test & Learning
   ============================================ */

const LangyWidgets = {
    // ─── WORD SHUFFLE: Составить предложение из перемешанных слов ───
    renderWordShuffle(container, data, onComplete) {
        const words = data.words.slice();
        const correctOrder = data.correct; // array of words in correct order
        let selected = [];

        const el = document.createElement('div');
        el.className = 'widget widget--word-shuffle animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.arrange_words')}</div>
            <div class="widget__prompt">${data.prompt || ''}</div>
            <div class="widget__answer-zone" id="ws-answer"></div>
            <div class="widget__word-bank" id="ws-bank"></div>
        `;
        container.appendChild(el);

        const answerZone = el.querySelector('#ws-answer');
        const bankZone = el.querySelector('#ws-bank');

        function render() {
            // Shuffle words for bank (only unselected)
            const available = words.filter(w => !selected.includes(w));
            bankZone.innerHTML = available
                .map(
                    (w, i) => `
                <button class="word-chip" data-word="${w}" data-idx="${i}">${w}</button>
            `
                )
                .join('');

            answerZone.innerHTML = selected.length
                ? selected
                      .map(
                          (w, i) => `
                <button class="word-chip word-chip--selected" data-word="${w}" data-idx="${i}">${w}</button>
            `
                      )
                      .join('')
                : `<span class="widget__placeholder">${i18n('widget.tap_words')}</span>`;

            // Bank click → add to answer
            bankZone.querySelectorAll('.word-chip').forEach(chip => {
                chip.onclick = () => {
                    selected.push(chip.dataset.word);
                    render();
                };
            });

            // Answer click → remove from answer
            answerZone.querySelectorAll('.word-chip--selected').forEach(chip => {
                chip.onclick = () => {
                    selected = selected.filter((_, i) => i !== parseInt(chip.dataset.idx));
                    render();
                };
            });
        }

        // Shuffle words randomly
        words.sort(() => Math.random() - 0.5);
        render();

        // Check button
        const checkBtn = document.createElement('button');
        checkBtn.className = 'btn btn--primary btn--full widget__check';
        checkBtn.textContent = i18n('widget.check');
        checkBtn.onclick = () => {
            const isCorrect = JSON.stringify(selected) === JSON.stringify(correctOrder);
            this._showFeedback(el, isCorrect, correctOrder.join(' '), null);
            setTimeout(() => onComplete(isCorrect), 1200);
        };
        el.appendChild(checkBtn);
    },

    // ─── FILL BUBBLE: Заполнить пропуск выбором из bubble-кнопок ───
    renderFillBubble(container, data, onComplete) {
        const sentence = typeof data.sentence === 'string'
            ? data.sentence
            : data.prompt || data.question || 'Choose the correct answer';
        const options = Array.isArray(data.options) ? data.options : [];
        const hasBlank = sentence.includes('___');
        const sentenceHtml = hasBlank
            ? this._escapeHTML(sentence).replace(/___/g, '<span class="widget__blank">___</span>')
            : this._escapeHTML(sentence);

        const el = document.createElement('div');
        el.className = 'widget widget--fill-bubble animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.choose_answer')}</div>
            <div class="widget__sentence">${sentenceHtml}</div>
            <div class="widget__bubbles">
                ${options
                    .map(
                        (opt, i) => `
                    <button class="bubble-btn" data-idx="${i}">${this._escapeHTML(opt)}</button>
                `
                    )
                    .join('')}
            </div>
        `;
        container.appendChild(el);

        el.querySelectorAll('.bubble-btn').forEach(btn => {
            btn.onclick = () => {
                el.querySelectorAll('.bubble-btn').forEach(b => {
                    b.classList.remove('is-selected');
                    b.disabled = true;
                });
                btn.classList.add('is-selected');
                const isCorrect = parseInt(btn.dataset.idx) === data.correct;

                // Show answer in blank
                const blank = el.querySelector('.widget__blank');
                if (blank) blank.textContent = options[parseInt(btn.dataset.idx)];

                if (isCorrect) {
                    btn.classList.add('bubble-btn--correct');
                    if (blank) blank.classList.add('widget__blank--correct');
                } else {
                    btn.classList.add('bubble-btn--wrong');
                    if (blank) blank.classList.add('widget__blank--wrong');
                    // Show correct
                    const correctBtn = el.querySelectorAll('.bubble-btn')[data.correct];
                    if (correctBtn) correctBtn.classList.add('bubble-btn--correct');
                }

                this._showFeedback(el, isCorrect, options[data.correct], data.rule);
                setTimeout(() => onComplete(isCorrect), 1200);
            };
        });
    },

    // ─── MATCH PAIRS: Соединить слова с переводами ───
    renderMatchPairs(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--match-pairs animate-in';

        const pairs = data.pairs; // [{left: 'hello', right: 'привет'}, ...]
        const leftItems = pairs.map(p => p.left);
        const rightItems = pairs.map(p => p.right).sort(() => Math.random() - 0.5);
        let selectedLeft = null;
        const matched = new Set();
        let errors = 0;

        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.match_pairs')}</div>
            <div class="match-grid">
                <div class="match-col" id="match-left"></div>
                <div class="match-col" id="match-right"></div>
            </div>
        `;
        container.appendChild(el);

        function render() {
            const leftCol = el.querySelector('#match-left');
            const rightCol = el.querySelector('#match-right');

            leftCol.innerHTML = leftItems
                .map(
                    (w, i) => `
                <button class="match-card ${matched.has(i) ? 'match-card--done' : ''} ${selectedLeft === i ? 'match-card--active' : ''}" 
                        data-idx="${i}" ${matched.has(i) ? 'disabled' : ''}>${w}</button>
            `
                )
                .join('');

            rightCol.innerHTML = rightItems
                .map((w, i) => {
                    const originalIdx = pairs.findIndex(p => p.right === w);
                    return `<button class="match-card ${matched.has(originalIdx) ? 'match-card--done' : ''}" 
                              data-idx="${originalIdx}" ${matched.has(originalIdx) ? 'disabled' : ''}>${w}</button>`;
                })
                .join('');

            // Left click
            leftCol.querySelectorAll('.match-card:not([disabled])').forEach(card => {
                card.onclick = () => {
                    selectedLeft = parseInt(card.dataset.idx);
                    render();
                };
            });

            // Right click
            rightCol.querySelectorAll('.match-card:not([disabled])').forEach(card => {
                card.onclick = () => {
                    if (selectedLeft === null) return;
                    const rightIdx = parseInt(card.dataset.idx);
                    if (selectedLeft === rightIdx) {
                        matched.add(selectedLeft);
                        card.classList.add('match-card--correct');
                    } else {
                        errors++;
                        card.classList.add('match-card--wrong');
                        setTimeout(() => card.classList.remove('match-card--wrong'), 600);
                    }
                    selectedLeft = null;
                    render();

                    if (matched.size === pairs.length) {
                        const isCorrect = errors <= 1;
                        LangyWidgets._showFeedback(el, isCorrect, `${errors} ${i18n('widget.errors')}`);
                        setTimeout(() => onComplete(isCorrect), 1200);
                    }
                };
            });
        }
        render();
    },

    // ─── LISTEN & TYPE: Послушать и напечатать ───
    renderListenType(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--listen-type animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.listen_type')}</div>
            <div class="listen-controls">
                <button class="listen-btn" id="lt-play">
                    <span class="listen-btn__icon">🔊</span>
                    <span>${i18n('widget.listen')}</span>
                </button>
                <div class="listen-speed">
                    <button class="speed-btn is-active" data-speed="1">1x</button>
                    <button class="speed-btn" data-speed="0.7">Slow</button>
                </div>
            </div>
            <div class="widget__input-row">
                <input type="text" class="input widget__text-input" id="lt-input" placeholder="${i18n('widget.type_heard')}" autocomplete="off">
                <button class="btn btn--primary btn--icon" id="lt-check">→</button>
            </div>
            <div class="widget__hint" id="lt-hint" style="display:none;">
                <span class="widget__hint-icon">💡</span>
                <span id="lt-hint-text"></span>
            </div>
        `;
        container.appendChild(el);

        // TTS playback
        const playBtn = el.querySelector('#lt-play');
        let utterance = null;

        function speak(rate = 1) {
            try {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    utterance = new SpeechSynthesisUtterance(data.text);
                    utterance.lang = typeof LangyTarget !== 'undefined' ? LangyTarget.ttsLang : 'en-US';
                    utterance.rate = rate;
                    window.speechSynthesis.speak(utterance);
                    playBtn.classList.add('listen-btn--playing');
                    utterance.onend = () => playBtn.classList.remove('listen-btn--playing');
                    utterance.onerror = () => playBtn.classList.remove('listen-btn--playing');
                } else {
                    const hintEl = el.querySelector('#lt-hint');
                    if (hintEl) {
                        hintEl.style.display = 'flex';
                        el.querySelector('#lt-hint-text').textContent = 'Audio is unavailable in this browser. Type the phrase if you know it, or use the hint.';
                    }
                }
            } catch (err) {
                console.warn('Listen TTS failed:', err);
                playBtn.classList.remove('listen-btn--playing');
            }
        }

        playBtn.onclick = () => speak(1);
        el.querySelectorAll('.speed-btn').forEach(btn => {
            btn.onclick = () => {
                el.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                speak(parseFloat(btn.dataset.speed));
            };
        });

        // Auto-play on render
        setTimeout(() => speak(1), 500);

        const input = el.querySelector('#lt-input');
        const checkBtn = el.querySelector('#lt-check');

        const check = () => {
            const userAnswer = input.value
                .trim()
                .toLowerCase()
                .replace(/[.,!?]/g, '');
            const expected = data.text.toLowerCase().replace(/[.,!?]/g, '');
            const isCorrect = userAnswer === expected || this._levenshtein(userAnswer, expected) <= 2;
            this._showFeedback(el, isCorrect, data.text);
            setTimeout(() => onComplete(isCorrect), 1200);
        };

        checkBtn.onclick = check;
        input.onkeypress = e => {
            if (e.key === 'Enter') check();
        };
        input.focus();

        // Show hint after 10 seconds
        if (data.hint) {
            setTimeout(() => {
                const hintEl = el.querySelector('#lt-hint');
                if (hintEl) {
                    hintEl.style.display = 'flex';
                    el.querySelector('#lt-hint-text').textContent = data.hint;
                }
            }, 10000);
        }
    },

    // ─── TYPE TRANSLATION: Перевести предложение ───
    renderTypeTranslation(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--type-translation animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.translate')}</div>
            <div class="widget__source-text">${data.sourceText}</div>
            <div class="widget__lang-indicator">${data.fromLang || 'RU'} → ${data.toLang || 'EN'}</div>
            <div class="widget__input-row">
                <input type="text" class="input widget__text-input" id="tt-input" placeholder="${i18n('widget.your_translation')}" autocomplete="off">
                <button class="btn btn--primary btn--icon" id="tt-check">→</button>
            </div>
        `;
        container.appendChild(el);

        const input = el.querySelector('#tt-input');
        const checkBtn = el.querySelector('#tt-check');

        const check = () => {
            const userAnswer = input.value
                .trim()
                .toLowerCase()
                .replace(/[.,!?'"]/g, '');
            // Accept multiple correct answers
            const acceptedAnswers = Array.isArray(data.answer) ? data.answer : [data.answer];
            const isCorrect = acceptedAnswers.some(ans => {
                const expected = ans.toLowerCase().replace(/[.,!?'"]/g, '');
                return userAnswer === expected || this._levenshtein(userAnswer, expected) <= 3;
            });
            this._showFeedback(el, isCorrect, acceptedAnswers[0]);
            setTimeout(() => onComplete(isCorrect), 1200);
        };

        checkBtn.onclick = check;
        input.onkeypress = e => {
            if (e.key === 'Enter') check();
        };
        input.focus();
    },

    // ─── SPEAK ALOUD: Произнести вслух ───
    renderSpeakAloud(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--speak-aloud animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.say_aloud')}</div>
            <div class="widget__target-phrase">"${data.phrase}"</div>
            <div class="speak-controls">
                <button class="speak-listen-btn" id="sa-listen" title="${i18n('widget.listen')}">${LangyIcons.play}</button>
                <button class="speak-record-btn" id="sa-record">
                    <span class="speak-record-btn__inner">${LangyIcons.mic || LangyIcons.play}</span>
                </button>
                <button class="speak-skip-btn" id="sa-skip" title="${i18n('learn.skip')}">${LangyIcons.arrow}</button>
            </div>
            <div class="speak-status" id="sa-status">${i18n('widget.tap_mic')}</div>
            <div class="speak-transcript" id="sa-transcript"></div>
        `;
        container.appendChild(el);

        const listenBtn = el.querySelector('#sa-listen');
        const recordBtn = el.querySelector('#sa-record');
        const skipBtn = el.querySelector('#sa-skip');
        const status = el.querySelector('#sa-status');
        const transcript = el.querySelector('#sa-transcript');

        // Listen to correct pronunciation
        listenBtn.onclick = () => {
            try {
                if (!('speechSynthesis' in window)) {
                    status.textContent = 'Audio is unavailable in this browser.';
                    return;
                }
                const utt = new SpeechSynthesisUtterance(data.phrase);
                utt.lang = typeof LangyTarget !== 'undefined' ? LangyTarget.ttsLang : 'en-US';
                utt.rate = 0.85;
                window.speechSynthesis.speak(utt);
            } catch (err) {
                console.warn('Speak-aloud TTS failed:', err);
                status.textContent = 'Audio is temporarily unavailable. You can still record or skip.';
            }
        };

        // Speech recognition
        let recognition = null;
        recordBtn.onclick = () => {
            if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                status.textContent = i18n('widget.speech_not_supported');
                setTimeout(() => onComplete('skipped'), 1500); // Pass without penalty
                return;
            }

            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRec();
            recognition.continuous = false;
            recognition.lang = typeof LangyTarget !== 'undefined' ? LangyTarget.sttLang : 'en-US';

            recognition.onstart = () => {
                recordBtn.classList.add('speak-record-btn--active');
                status.textContent = i18n('widget.speaking');
            };

            recognition.onresult = event => {
                const spoken = event.results[0][0].transcript;
                transcript.textContent = `"${spoken}"`;
                const similarity = this._similarity(spoken.toLowerCase(), data.phrase.toLowerCase());
                const isCorrect = similarity > 0.6;
                const accStr = Math.round(similarity * 100) + '%';

                let fbText = data.phrase;
                if (!isCorrect) {
                    const tips = ['Try speaking slightly slower.', 'Focus on word endings.', 'Listen again carefully.'];
                    const tip = tips[Math.floor(Math.random() * tips.length)];
                    fbText += ` <br><small>Accuracy: ${accStr}</small><br><small style="color:var(--warning)">Tip: ${tip}</small>`;
                } else {
                    fbText += ` <br><small>Accuracy: ${accStr} — Great job!</small>`;
                }

                this._showFeedback(el, isCorrect, fbText);
                setTimeout(() => onComplete(isCorrect), 2500);
            };

            recognition.onerror = () => {
                status.textContent = i18n('widget.recognition_failed');
                recordBtn.classList.remove('speak-record-btn--active');
            };

            recognition.onend = () => {
                recordBtn.classList.remove('speak-record-btn--active');
            };

            try {
                recognition.start();
            } catch (err) {
                console.warn('Speech recognition start failed:', err);
                status.textContent = i18n('widget.recognition_failed');
                recordBtn.classList.remove('speak-record-btn--active');
            }
        };

        // Skip button (for browsers without speech rec or user choice)
        skipBtn.onclick = () => {
            onComplete('skipped'); // Mark as skipped
        };
    },

    // ─── READ AND ANSWER: Прочитать текст и ответить ───
    renderReadAndAnswer(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--read-answer animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.read_answer')}</div>
            <div class="widget__reading-passage">${data.passage}</div>
            <div class="widget__question">${data.question}</div>
            <div class="widget__bubbles">
                ${data.options
                    .map(
                        (opt, i) => `
                    <button class="bubble-btn bubble-btn--wide" data-idx="${i}">${opt}</button>
                `
                    )
                    .join('')}
            </div>
        `;
        container.appendChild(el);

        el.querySelectorAll('.bubble-btn').forEach(btn => {
            btn.onclick = () => {
                el.querySelectorAll('.bubble-btn').forEach(b => {
                    b.classList.remove('is-selected');
                    b.disabled = true;
                });
                btn.classList.add('is-selected');
                const isCorrect = parseInt(btn.dataset.idx) === data.correct;
                if (isCorrect) btn.classList.add('bubble-btn--correct');
                else {
                    btn.classList.add('bubble-btn--wrong');
                    el.querySelectorAll('.bubble-btn')[data.correct].classList.add('bubble-btn--correct');
                }
                this._showFeedback(el, isCorrect, data.options[data.correct]);
                setTimeout(() => onComplete(isCorrect), 1200);
            };
        });
    },

    // ─── IMAGE CHOICE: Выбрать изображение ───
    renderImageChoice(container, data, onComplete) {
        const el = document.createElement('div');
        el.className = 'widget widget--image-choice animate-in';
        el.innerHTML = `
            <div class="widget__label">${data.instruction || i18n('widget.choose_image')}</div>
            <div class="widget__prompt" style="font-size:24px; text-align:center;">"${data.word}"</div>
            <div class="image-choice-grid">
                ${data.options
                    .map(
                        (opt, i) => `
                    <button class="image-choice-card" data-idx="${i}">
                        <div class="image-choice-card__emoji">${opt.emoji}</div>
                        <div class="image-choice-card__label">${opt.label}</div>
                    </button>
                `
                    )
                    .join('')}
            </div>
        `;
        container.appendChild(el);

        el.querySelectorAll('.image-choice-card').forEach(card => {
            card.onclick = () => {
                el.querySelectorAll('.image-choice-card').forEach(c => (c.disabled = true));
                const isCorrect = parseInt(card.dataset.idx) === data.correct;
                if (isCorrect) card.classList.add('image-choice-card--correct');
                else {
                    card.classList.add('image-choice-card--wrong');
                    el.querySelectorAll('.image-choice-card')[data.correct].classList.add('image-choice-card--correct');
                }
                this._showFeedback(el, isCorrect, data.options[data.correct].label);
                setTimeout(() => onComplete(isCorrect), 1200);
            };
        });
    },

    // ─── FEEDBACK ─────────────────────────────────────
    _showFeedback(widgetEl, isCorrect, correctAnswer, ruleHint) {
        const existing = widgetEl.querySelector('.widget__feedback');
        if (existing) existing.remove();

        const fb = document.createElement('div');
        fb.className = `widget__feedback widget__feedback--${isCorrect ? 'correct' : 'wrong'} animate-in`;
        const personaCorrect = typeof MascotPersona !== 'undefined' ? MascotPersona.tone('correct') : i18n('widget.correct');
        const personaIncorrect = typeof MascotPersona !== 'undefined' ? MascotPersona.tone('incorrect') : '';

        if (isCorrect) {
            fb.innerHTML = `<span class="widget__feedback-icon">${LangyIcons.checkCircle}</span> <span>${personaCorrect}</span>`;
        } else {
            // Build curriculum-aware correction for English
            let ruleExplanation = '';
            if (ruleHint) {
                ruleExplanation = `<div style="font-size:var(--fs-xs); color:var(--text-secondary); margin-top:4px;">Rule: <strong>${ruleHint}</strong></div>`;
            }

            fb.innerHTML = `<span class="widget__feedback-icon">${LangyIcons.x}</span> <span>${personaIncorrect ? personaIncorrect + ' ' : ''}${i18n('widget.answer_was')}: <strong>${correctAnswer}</strong>${ruleExplanation}</span>`;
        }

        widgetEl.appendChild(fb);

        if (!isCorrect && widgetEl.animate) {
            widgetEl.animate(
                [
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(4px)' },
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(0)' },
                ],
                { duration: 300 }
            );
        }

        // Sound feedback
        if (typeof AudioUtils !== 'undefined') {
            if (isCorrect) {
                AudioUtils.playCorrect();
            } else {
                AudioUtils.playWrong();
            }
        }
    },

    // ─── UTILITY: Levenshtein distance ───
    _levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
                else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
        return matrix[b.length][a.length];
    },

    // ─── UTILITY: Similarity ───
    _similarity(s1, s2) {
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        if (longer.length === 0) return 1.0;
        return (longer.length - this._levenshtein(longer, shorter)) / longer.length;
    },

    // ─── RENDER BY TYPE ─────────────────────────────
    _escapeHTML(value) {
        if (typeof escapeHTML === 'function') return escapeHTML(String(value ?? ''));
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    _renderExerciseError(container, type, data, onComplete, err) {
        console.error('Exercise render failed:', type, err);
        container.innerHTML = `
            <div class="widget widget--error animate-in" style="padding:var(--sp-4); border:1px solid var(--danger); border-radius:var(--radius-lg); background:var(--danger-bg);">
                <div class="widget__label" style="color:var(--danger); display:flex; align-items:center; gap:var(--sp-2);">
                    ${typeof LangyIcons !== 'undefined' ? LangyIcons.alertTriangle : '!'} Exercise unavailable
                </div>
                <div class="text-secondary text-sm" style="margin:var(--sp-2) 0 var(--sp-3);">
                    This exercise could not be loaded. Your lesson is safe; try again or continue.
                </div>
                <div style="display:flex; gap:var(--sp-2); flex-wrap:wrap;">
                    <button class="btn btn--secondary" id="widget-retry">Try again</button>
                    <button class="btn btn--primary" id="widget-continue">Continue</button>
                </div>
            </div>
        `;
        container.querySelector('#widget-retry')?.addEventListener('click', () => {
            container.innerHTML = '';
            this.render(container, type, data, onComplete);
        });
        container.querySelector('#widget-continue')?.addEventListener('click', () => onComplete(false));
    },

    render(container, type, data, onComplete) {
        const renderers = {
            'word-shuffle': this.renderWordShuffle,
            'fill-bubble': this.renderFillBubble,
            'match-pairs': this.renderMatchPairs,
            'listen-type': this.renderListenType,
            'type-translation': this.renderTypeTranslation,
            'speak-aloud': this.renderSpeakAloud,
            'read-answer': this.renderReadAndAnswer,
            'image-choice': this.renderImageChoice,
        };

        const renderer = renderers[type];
        const safeComplete = result => {
            try {
                onComplete(result);
            } catch (err) {
                console.error('Exercise completion failed:', err);
            }
        };

        try {
            if (renderer) {
                renderer.call(this, container, data || {}, safeComplete);
            } else {
                this._renderExerciseError(container, type, data || {}, safeComplete, new Error(`Unknown widget type: ${type}`));
            }
        } catch (err) {
            this._renderExerciseError(container, type, data || {}, safeComplete, err);
        }
    },
};
