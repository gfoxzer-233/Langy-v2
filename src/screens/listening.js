/* ============================================
   SCREEN: LISTENING — Structured Comprehension Practice
   Curriculum-aware listening hub with TTS exercises:
   dictation, phrase catching, intent recognition.
   Connected to current unit, vocabulary, and grammar.
   ============================================ */

function getListeningExercises(level) {
    const bank = typeof LangyGrammarBank !== 'undefined' ? LangyGrammarBank : {};
    const lvl = bank[level];
    const translations = lvl?.translations || [];
    const sentences = lvl?.sentences || [];

    // Enrich translations with curriculum context
    const unitId = LangyState?.progress?.currentUnitId || 1;
    let tb = null;
    if (typeof LangyCurriculum !== 'undefined') tb = LangyCurriculum.getActive();
    const currentUnit = tb?.units?.find(u => u.id === unitId);

    // Build unit-specific listening items from vocab bank
    let unitVocabItems = [];
    if (typeof LangyVocabBank !== 'undefined' && tb?.cefr) {
        const vocabWords = LangyVocabBank.getForUnit(tb.cefr, unitId);
        unitVocabItems = vocabWords.filter(w => w.en && w.ru).map(w => ({
            en: w.en, ru: w.ru, source: 'vocab', unitId,
            grammarRule: currentUnit?.grammar?.[0] || '',
        }));
    }

    // Build unit-context sentences from grammar patterns
    let unitGrammarItems = [];
    if (lvl && currentUnit?.grammar) {
        const allPatterns = lvl.getAllPatterns?.() || [];
        const unitRules = (currentUnit.grammar || []).map(g => g.toLowerCase());
        unitGrammarItems = allPatterns
            .filter(p => p.rule && unitRules.some(r => p.rule.toLowerCase().includes(r.split(' ')[0])))
            .slice(0, 8)
            .map(p => ({
                en: p.template?.replace('___', p.answer) || '',
                ru: '', source: 'grammar', unitId,
                grammarRule: p.rule || '',
            }))
            .filter(p => p.en && p.en.length > 5);
    }

    // Tag level translations with source
    const taggedTranslations = translations.map(t => ({ ...t, source: 'level', grammarRule: '' }));

    // Prioritize: unit vocab first, then unit grammar, then level translations
    const combined = [...unitVocabItems, ...unitGrammarItems, ...taggedTranslations];
    // Deduplicate by en
    const seen = new Set();
    const deduped = combined.filter(t => { const k = t.en?.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

    return { translations: deduped, sentences, currentUnit, level: tb?.cefr || level };
}

// Listening drill types
const LISTEN_MODES = {
    dictation: {
        id: 'dictation',
        name: { en: 'Dictation', ru: 'Диктант', es: 'Dictado' },
        desc: { en: 'Listen and type exactly what you hear', ru: 'Слушайте и печатайте услышанное', es: 'Escucha y escribe lo que oyes' },
        icon: '🎧',
        skill: { en: 'Spelling & Accuracy', ru: 'Правописание', es: 'Ortografía' },
        color: '#10B981',
    },
    phraseCatch: {
        id: 'phraseCatch',
        name: { en: 'Phrase Catch', ru: 'Уловить фразу', es: 'Captar la frase' },
        desc: { en: 'Listen and choose the phrase you heard', ru: 'Слушайте и выберите услышанную фразу', es: 'Escucha y elige la frase que oíste' },
        icon: '🎯',
        skill: { en: 'Phrase Recognition', ru: 'Распознавание фраз', es: 'Reconocimiento' },
        color: '#3B82F6',
    },
    intentQuiz: {
        id: 'intentQuiz',
        name: { en: 'Meaning Check', ru: 'Проверка смысла', es: 'Comprensión' },
        desc: { en: 'Listen and answer a comprehension question', ru: 'Слушайте и ответьте на вопрос по смыслу', es: 'Escucha y responde una pregunta' },
        icon: '🧠',
        skill: { en: 'Comprehension', ru: 'Понимание', es: 'Comprensión' },
        color: '#8B5CF6',
    },
};

function renderListening(container) {
    const lang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
    const activeMode = ScreenState.get('listenMode', null);
    if (activeMode) { renderListeningDrill(container, activeMode, lang); return; }

    const userLevel = (LangyState.user?.level || 'B1').substring(0, 2);
    const { translations, currentUnit, level } = getListeningExercises(userLevel);
    const sessionsDone = LangyState.progress?.skills?.listening || 0;

    // Curriculum context
    const unitTitle = currentUnit?.title || '';
    const unitGrammar = currentUnit?.grammar?.slice(0, 2).join(', ') || '';
    const vocabCount = typeof LangyVocabBank !== 'undefined' && typeof LangyCurriculum !== 'undefined'
        ? (LangyCurriculum.getActive()?.cefr ? LangyVocabBank.getForUnit(LangyCurriculum.getActive().cefr, LangyState?.progress?.currentUnitId || 1).length : 0) : 0;

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="listen-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${{ en: 'Listening', ru: 'Аудирование', es: 'Escucha' }[lang]}</div>
                <div style="width:36px;"></div>
            </div>

            <div style="padding: var(--sp-3) var(--sp-6) var(--sp-2); text-align:center;">
                <p class="text-secondary text-sm">${{ en: 'Train your ear to understand real English', ru: 'Тренируйте понимание на слух', es: 'Entrena tu oído para entender inglés real' }[lang]}</p>
                <div style="display:flex; justify-content:center; gap:var(--sp-2); margin-top:var(--sp-2); flex-wrap:wrap;">
                    <div class="badge badge--primary">${level} · ${sessionsDone}% ${{ en: 'skill', ru: 'навык', es: 'habilidad' }[lang]}</div>
                    ${unitTitle ? `<div class="badge" style="background:rgba(59,130,246,0.08); color:#3B82F6;">${LangyIcons.book} ${{ en: 'Unit', ru: 'Юнит', es: 'Unidad' }[lang]}: ${escapeHTML(unitTitle)}</div>` : ''}
                </div>
            </div>

            <!-- Curriculum context card -->
            ${unitTitle ? `
            <div style="padding: 0 var(--sp-5) var(--sp-3);">
                <div class="card card--flat" style="padding:var(--sp-3); border-left:3px solid #3B82F6;">
                    <div style="font-size:10px; text-transform:uppercase; letter-spacing:0.5px; color:#3B82F6; margin-bottom:4px;">${{ en: 'Current Focus', ru: 'Текущий фокус', es: 'Enfoque actual' }[lang]}</div>
                    <div style="display:flex; flex-wrap:wrap; gap:4px;">
                        ${unitGrammar ? `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(139,92,246,0.08); color:#8B5CF6;">${LangyIcons.fileText} ${unitGrammar}</span>` : ''}
                        ${vocabCount > 0 ? `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(245,158,11,0.08); color:#F59E0B;">${LangyIcons.brain} ${vocabCount} ${{ en: 'words', ru: 'слов', es: 'palabras' }[lang]}</span>` : ''}
                        <span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(16,185,129,0.08); color:#10B981;">${LangyIcons.headphones} ${translations.length} ${{ en: 'sentences', ru: 'предложений', es: 'oraciones' }[lang]}</span>
                    </div>
                </div>
            </div>` : ''}

            <!-- Drill modes -->
            <div style="padding: var(--sp-4) var(--sp-5) var(--sp-6); display:flex; flex-direction:column; gap:var(--sp-3);">
                ${Object.values(LISTEN_MODES).map(mode => `
                    <div class="homework-card listen-mode-card" data-mode="${mode.id}" style="cursor:pointer;">
                        <div class="homework-card__icon" style="background:${mode.color}11; font-size:22px;">${mode.icon}</div>
                        <div class="homework-card__info">
                            <div class="homework-card__title">${mode.name[lang]}</div>
                            <div class="homework-card__meta">${mode.desc[lang]}</div>
                            <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:${mode.color}; margin-top:2px;">${LangyIcons.target} ${mode.skill[lang]}</div>
                        </div>
                        <div style="color:var(--text-tertiary);">${LangyIcons.arrowRight}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Why listening matters -->
            <div style="padding: 0 var(--sp-5) var(--sp-6);">
                <div class="card" style="padding:var(--sp-4); border-left:3px solid #10B981; background:rgba(16,185,129,0.03);">
                    <div style="font-size:var(--fs-xs); font-weight:var(--fw-bold); color:#10B981; margin-bottom:var(--sp-1); display:flex; align-items:center; gap:6px;">
                        ${LangyIcons.zap} ${{ en: 'Why listening matters', ru: 'Почему важно слушать', es: 'Por qué escuchar importa' }[lang]}
                    </div>
                    <div style="font-size:var(--fs-xs); color:var(--text-secondary); line-height:1.6;">
                        ${{ en: 'Listening is the foundation of real conversation. Training your ear helps you understand native speakers, catch natural phrasing, and respond confidently.', ru: 'Аудирование — основа реального общения. Тренировка слуха помогает понимать носителей языка и отвечать уверенно.', es: 'Escuchar es la base de la conversación real. Entrenar tu oído te ayuda a entender hablantes nativos y responder con confianza.' }[lang]}
                    </div>
                </div>
            </div>

            <!-- Practice connections -->
            <div style="padding: 0 var(--sp-5) var(--sp-8);">
                <h4 style="margin-bottom:var(--sp-2); font-size:var(--fs-sm); display:flex; align-items:center; gap:6px;">
                    ${LangyIcons.arrowRight} ${{ en: 'Also practice listening in', ru: 'Также тренируйте слух в', es: 'También practica escucha en' }[lang]}
                </h4>
                <div style="display:flex; gap:var(--sp-2); flex-wrap:wrap;">
                    <div class="badge listen-conn" data-route="talk" style="cursor:pointer;">${LangyIcons.mic} ${{ en: 'Conversations', ru: 'Разговоры', es: 'Conversaciones' }[lang]}</div>
                    <div class="badge listen-conn" data-route="learning" style="cursor:pointer;">${LangyIcons.book} ${{ en: 'Lessons', ru: 'Уроки', es: 'Lecciones' }[lang]}</div>
                    <div class="badge listen-conn" data-route="duels" style="cursor:pointer;">${LangyIcons.trophy} ${{ en: 'Duels', ru: 'Дуэли', es: 'Duelos' }[lang]}</div>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#listen-back')?.addEventListener('click', () => Router.navigate('results'));
    container.querySelectorAll('.listen-mode-card').forEach(c => {
        c.addEventListener('click', () => { ScreenState.set('listenMode', c.dataset.mode); renderListening(container); });
    });
    container.querySelectorAll('.listen-conn').forEach(c => {
        c.addEventListener('click', () => Router.navigate(c.dataset.route));
    });
    setTimeout(() => Anim.staggerChildren(container, '.listen-mode-card'), 80);
}

function renderListeningDrill(container, modeId, lang) {
    const mode = LISTEN_MODES[modeId] || LISTEN_MODES.dictation;
    const userLevel = (LangyState.user?.level || 'B1').substring(0, 2);
    const { translations } = getListeningExercises(userLevel);

    if (!translations.length) {
        container.innerHTML = `<div class="screen screen--center"><p>${{ en: 'No exercises available for your level yet.', ru: 'Нет упражнений для вашего уровня.', es: 'No hay ejercicios para tu nivel.' }[lang]}</p></div>`;
        return;
    }

    // Pick random items for session
    const sessionSize = 5;
    const shuffled = [...translations].sort(() => Math.random() - 0.5).slice(0, sessionSize);
    const state = ScreenState.get('listenDrillState') || { idx: 0, correct: 0, total: sessionSize, items: shuffled, answered: false, startTime: Date.now() };
    if (!ScreenState.get('listenDrillState')) ScreenState.set('listenDrillState', state);

    const item = state.items[state.idx];
    if (!item || state.idx >= state.total) { renderListeningResults(container, state, lang); return; }

    const sentence = item.en;

    if (modeId === 'dictation') {
        renderDictation(container, sentence, item, state, mode, lang);
    } else if (modeId === 'phraseCatch') {
        renderPhraseCatch(container, sentence, item, state, mode, lang, translations);
    } else {
        renderIntentQuiz(container, sentence, item, state, mode, lang);
    }
}

function speakText(text, rate) {
    try {
        if (typeof LangyVoice !== 'undefined') {
            if (rate && rate < 0.8) {
                LangyVoice.saySlow(text);
            } else {
                LangyVoice.sayTeacher(text);
            }
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = typeof LangyTarget !== 'undefined' ? LangyTarget.ttsLang : 'en-US';
            u.rate = rate || 1;
            window.speechSynthesis.speak(u);
        }
    } catch (err) {
        console.warn('Listening TTS unavailable:', err);
    }
}

function renderDictation(container, sentence, item, state, mode, lang) {
    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="drill-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${mode.name[lang]}</div>
                <div class="badge badge--primary">${state.idx + 1}/${state.total}</div>
            </div>
            <div style="padding: var(--sp-6) var(--sp-5); display:flex; flex-direction:column; align-items:center; gap:var(--sp-4);">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:${mode.color};">${LangyIcons.target} ${mode.skill[lang]}</div>
                ${item.grammarRule ? `<div style="font-size:9px; color:#8B5CF6; background:rgba(139,92,246,0.06); padding:2px 8px; border-radius:var(--radius-full);">${LangyIcons.fileText} ${item.grammarRule}</div>` : ''}
                <div style="display:flex; gap:var(--sp-3); align-items:center;">
                    <button class="btn btn--primary" id="d-play" style="width:56px; height:56px; border-radius:50%; font-size:24px; display:flex; align-items:center; justify-content:center;">🔊</button>
                    <button class="btn btn--ghost btn--sm" id="d-slow">🐢 Slow</button>
                </div>
                ${item.hint ? `<div style="font-size:var(--fs-xs); color:var(--text-tertiary);">💡 ${item.hint || ''}</div>` : ''}
                <div class="widget__input-row" style="width:100%; max-width:340px;">
                    <input type="text" class="input widget__text-input" id="d-input" placeholder="${{ en: 'Type what you hear...', ru: 'Напишите, что слышите...', es: 'Escribe lo que oyes...' }[lang]}" autocomplete="off" style="width:100%;">
                </div>
                <button class="btn btn--primary btn--full" id="d-check" style="max-width:340px;">${{ en: 'Check', ru: 'Проверить', es: 'Comprobar' }[lang]}</button>
                <div id="d-feedback" style="min-height:40px; text-align:center; width:100%; max-width:340px;"></div>
            </div>
        </div>
    `;
    container.querySelector('#drill-back')?.addEventListener('click', () => { ScreenState.remove('listenDrillState'); ScreenState.set('listenMode', null); renderListening(container); });
    container.querySelector('#d-play')?.addEventListener('click', () => speakText(sentence, 1));
    container.querySelector('#d-slow')?.addEventListener('click', () => speakText(sentence, 0.6));
    setTimeout(() => speakText(sentence, 1), 400);

    container.querySelector('#d-check')?.addEventListener('click', () => {
        if (state.answered) { state.idx++; state.answered = false; ScreenState.set('listenDrillState', state); renderListeningDrill(container, 'dictation', lang); return; }
        const input = container.querySelector('#d-input')?.value?.trim() || '';
        const clean = s => s.toLowerCase().replace(/[.,!?'"]/g, '').trim();
        const isCorrect = clean(input) === clean(sentence) || levenshtein(clean(input), clean(sentence)) <= 2;
        if (isCorrect) state.correct++;
        state.answered = true;
        ScreenState.set('listenDrillState', state);
        const fb = container.querySelector('#d-feedback');
        const btn = container.querySelector('#d-check');
        if (btn) btn.textContent = { en: 'Next', ru: 'Далее', es: 'Siguiente' }[lang];
        if (fb) fb.innerHTML = isCorrect
            ? `<div style="color:var(--accent-dark);">${LangyIcons.check} ${{ en: 'Correct!', ru: 'Правильно!', es: '¡Correcto!' }[lang]}</div>`
            : `<div style="color:var(--danger);">${LangyIcons.x} <strong>${sentence}</strong></div>`;
        // Speak correct answer slowly after wrong answer
        if (!isCorrect && typeof LangyVoice !== 'undefined') LangyVoice.speakCorrection(sentence, 500);
    });
}

function renderPhraseCatch(container, sentence, item, state, mode, lang, allTranslations) {
    // Build 3 wrong options + 1 correct
    const others = allTranslations.filter(t => t.en !== sentence).sort(() => Math.random() - 0.5).slice(0, 3).map(t => t.en);
    const options = [sentence, ...others].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="drill-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${mode.name[lang]}</div>
                <div class="badge badge--primary">${state.idx + 1}/${state.total}</div>
            </div>
            <div style="padding: var(--sp-6) var(--sp-5); display:flex; flex-direction:column; align-items:center; gap:var(--sp-4);">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:${mode.color};">${LangyIcons.target} ${mode.skill[lang]}</div>
                <button class="btn btn--primary" id="p-play" style="width:56px; height:56px; border-radius:50%; font-size:24px;">🔊</button>
                <p class="text-secondary text-sm">${{ en: 'Which phrase did you hear?', ru: 'Какую фразу вы услышали?', es: '¿Qué frase escuchaste?' }[lang]}</p>
                <div style="display:flex; flex-direction:column; gap:var(--sp-2); width:100%; max-width:340px;" id="p-options">
                    ${options.map(o => `<button class="btn btn--ghost btn--full phrase-opt" data-val="${escapeHTML(o)}" data-correct="${o === sentence ? '1' : '0'}">${escapeHTML(o)}</button>`).join('')}
                </div>
                <div id="p-feedback" style="min-height:30px;"></div>
            </div>
        </div>
    `;
    container.querySelector('#drill-back')?.addEventListener('click', () => { ScreenState.remove('listenDrillState'); ScreenState.set('listenMode', null); renderListening(container); });
    container.querySelector('#p-play')?.addEventListener('click', () => speakText(sentence, 1));
    setTimeout(() => speakText(sentence, 1), 400);

    container.querySelectorAll('.phrase-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.answered) return;
            state.answered = true;
            const isCorrect = btn.dataset.correct === '1';
            if (isCorrect) state.correct++;
            btn.style.background = isCorrect ? 'var(--accent-bg)' : 'var(--danger-bg)';
            btn.style.borderColor = isCorrect ? 'var(--accent-dark)' : 'var(--danger)';
            if (!isCorrect) { const c = container.querySelector('.phrase-opt[data-correct="1"]'); if (c) { c.style.background = 'var(--accent-bg)'; c.style.borderColor = 'var(--accent-dark)'; } }
            container.querySelectorAll('.phrase-opt').forEach(b => b.disabled = true);
            ScreenState.set('listenDrillState', state);
            setTimeout(() => { state.idx++; state.answered = false; ScreenState.set('listenDrillState', state); renderListeningDrill(container, 'phraseCatch', lang); }, 1500);
        });
    });
}

function renderIntentQuiz(container, sentence, item, state, mode, lang) {
    // Use AI to generate a comprehension question, or fallback to translation check
    const ruText = item.ru || item.es || sentence;
    const question = { en: 'What does this sentence mean?', ru: 'Что означает это предложение?', es: '¿Qué significa esta frase?' }[lang];
    // Options: correct translation + 2 distractors from other items
    const allItems = state.items.filter(t => t.en !== sentence);
    const distractors = allItems.sort(() => Math.random() - 0.5).slice(0, 2).map(t => t.ru || t.es || t.en);
    const options = [ruText, ...distractors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
        <div class="screen screen--no-pad">
            <div class="nav-header">
                <div class="nav-header__back" id="drill-back">${LangyIcons.back}</div>
                <div class="nav-header__title">${mode.name[lang]}</div>
                <div class="badge badge--primary">${state.idx + 1}/${state.total}</div>
            </div>
            <div style="padding: var(--sp-6) var(--sp-5); display:flex; flex-direction:column; align-items:center; gap:var(--sp-4);">
                <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:${mode.color};">${LangyIcons.target} ${mode.skill[lang]}</div>
                <button class="btn btn--primary" id="i-play" style="width:56px; height:56px; border-radius:50%; font-size:24px;">🔊</button>
                <p class="text-secondary text-sm">${question}</p>
                <div style="display:flex; flex-direction:column; gap:var(--sp-2); width:100%; max-width:340px;" id="i-options">
                    ${options.map(o => `<button class="btn btn--ghost btn--full intent-opt" data-correct="${o === ruText ? '1' : '0'}">${escapeHTML(o)}</button>`).join('')}
                </div>
                <div id="i-feedback" style="min-height:30px;"></div>
            </div>
        </div>
    `;
    container.querySelector('#drill-back')?.addEventListener('click', () => { ScreenState.remove('listenDrillState'); ScreenState.set('listenMode', null); renderListening(container); });
    container.querySelector('#i-play')?.addEventListener('click', () => speakText(sentence, 1));
    setTimeout(() => speakText(sentence, 1), 400);

    container.querySelectorAll('.intent-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.answered) return;
            state.answered = true;
            const isCorrect = btn.dataset.correct === '1';
            if (isCorrect) state.correct++;
            btn.style.background = isCorrect ? 'var(--accent-bg)' : 'var(--danger-bg)';
            btn.style.borderColor = isCorrect ? 'var(--accent-dark)' : 'var(--danger)';
            if (!isCorrect) { const c = container.querySelector('.intent-opt[data-correct="1"]'); if (c) { c.style.background = 'var(--accent-bg)'; c.style.borderColor = 'var(--accent-dark)'; } }
            container.querySelectorAll('.intent-opt').forEach(b => b.disabled = true);
            ScreenState.set('listenDrillState', state);
            setTimeout(() => { state.idx++; state.answered = false; ScreenState.set('listenDrillState', state); renderListeningDrill(container, 'intentQuiz', lang); }, 1500);
        });
    });
}

function renderListeningResults(container, state, lang) {
    const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
    const durationMin = Math.max(1, Math.round((Date.now() - (state.startTime || Date.now())) / 60000));

    // Performance-based skill increment (not flat)
    const skillGain = accuracy >= 90 ? 5 : accuracy >= 70 ? 3 : accuracy >= 50 ? 2 : 1;

    // Record session
    if (typeof recordSession === 'function') {
        recordSession({ duration: durationMin, wordsLearned: 0, accuracy, category: 'listening' });
    }
    LangyState.progress.skills.listening = Math.min(100, (LangyState.progress.skills.listening || 0) + skillGain);

    // Record vocab encountered in this session via VocabTracker
    if (typeof VocabTracker !== 'undefined') {
        (state.items || []).forEach((item, i) => {
            if (item.source === 'vocab' && item.en && item.ru) {
                VocabTracker.recordWord(item.en, item.ru, { correct: i < state.correct, level: item.level || '', category: 'listening' });
            }
        });
    }

    if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});

    const personaMsg = typeof MascotPersona !== 'undefined' ? MascotPersona.tone(accuracy >= 80 ? 'lessonComplete' : 'encouragement') : null;

    // Collect grammar rules practiced
    const grammarRules = [...new Set((state.items || []).map(i => i.grammarRule).filter(Boolean))].slice(0, 3);
    // Collect vocab words heard
    const vocabWords = (state.items || []).filter(i => i.source === 'vocab').map(i => i.en).slice(0, 6);

    container.innerHTML = `
        <div class="screen screen--center" style="gap:var(--sp-4); text-align:center; padding:var(--sp-6);">
            <div style="font-size:64px;">${accuracy >= 80 ? '🎉' : accuracy >= 50 ? '👂' : '💪'}</div>
            <h2>${{ en: 'Session Complete', ru: 'Сессия завершена', es: 'Sesión completada' }[lang]}</h2>
            ${personaMsg ? `<p style="font-style:italic; color:var(--text-secondary); font-size:var(--fs-sm);">"${personaMsg}"</p>` : ''}
            <div style="display:flex; gap:var(--sp-6);">
                <div class="stat"><div class="stat__value" style="color:var(--accent-dark);">${state.correct}/${state.total}</div><div class="stat__label">${{ en: 'Correct', ru: 'Верно', es: 'Correcto' }[lang]}</div></div>
                <div class="stat"><div class="stat__value">${accuracy}%</div><div class="stat__label">${{ en: 'Accuracy', ru: 'Точность', es: 'Precisión' }[lang]}</div></div>
            </div>
            <div class="badge badge--primary">${LangyIcons.headphones} ${{ en: 'Listening skill', ru: 'Навык аудирования', es: 'Habilidad de escucha' }[lang]} +${skillGain}%</div>

            ${grammarRules.length > 0 ? `
            <div style="width:100%; max-width:300px; text-align:left;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:#8B5CF6; margin-bottom:4px;">${LangyIcons.fileText} ${{ en: 'Grammar practiced', ru: 'Грамматика', es: 'Gramática practicada' }[lang]}</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    ${grammarRules.map(r => `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(139,92,246,0.08); color:#8B5CF6;">${r}</span>`).join('')}
                </div>
            </div>` : ''}

            ${vocabWords.length > 0 ? `
            <div style="width:100%; max-width:300px; text-align:left;">
                <div style="font-size:9px; text-transform:uppercase; letter-spacing:0.5px; color:#F59E0B; margin-bottom:4px;">${LangyIcons.brain} ${{ en: 'Vocabulary heard', ru: 'Словарь', es: 'Vocabulario escuchado' }[lang]}</div>
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    ${vocabWords.map(w => `<span style="font-size:10px; padding:2px 8px; border-radius:var(--radius-full); background:rgba(245,158,11,0.08); color:#F59E0B;">${w}</span>`).join('')}
                </div>
            </div>` : ''}

            <div style="display:flex; gap:var(--sp-3); width:100%; max-width:300px;">
                <button class="btn btn--ghost btn--full" id="lr-home">${{ en: 'Home', ru: 'Домой', es: 'Inicio' }[lang]}</button>
                <button class="btn btn--primary btn--full" id="lr-again">${{ en: 'Practice Again', ru: 'Ещё раз', es: 'Otra vez' }[lang]}</button>
            </div>
        </div>
    `;

    container.querySelector('#lr-home')?.addEventListener('click', () => { ScreenState.remove('listenDrillState'); ScreenState.set('listenMode', null); Router.navigate('home'); });
    container.querySelector('#lr-again')?.addEventListener('click', () => { ScreenState.remove('listenDrillState'); renderListening(container); });
}

// Simple levenshtein for fuzzy matching
function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const d = Array.from({ length: m + 1 }, (_, i) => [i]);
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] !== b[j-1] ? 1 : 0));
    }
    return d[m][n];
}

Router.register('listening', renderListening);
