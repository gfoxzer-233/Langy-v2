/* ============================================
   LANGY — AI SYSTEM (OpenRouter Direct API)
   AI teacher — target language aware via LangyTarget
   ============================================ */

const LangyAI = {
    // API key is now stored securely on Cloudflare Worker (never in client code)
    API_URL: 'https://langy-ai-proxy.soccermax2017.workers.dev',
    MODEL: 'google/gemini-2.0-flash-001',
    REQUEST_TIMEOUT_MS: 15000,

    getUnavailableMessage() {
        return 'AI temporarily unavailable';
    },

    _normalizeError(err) {
        if (err?.name === 'AbortError') return new Error(this.getUnavailableMessage());
        if (err?.message === this.getUnavailableMessage()) return err;
        return new Error(this.getUnavailableMessage());
    },

    async fetchWithTimeout(url, options = {}, timeoutMs = this.REQUEST_TIMEOUT_MS) {
        const controller = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
        const requestOptions = controller ? { ...options, signal: controller.signal } : options;
        try {
            return await fetch(url, requestOptions);
        } catch (err) {
            if (controller && /AbortSignal|signal/i.test(err?.message || '')) {
                return fetch(url, options);
            }
            throw err;
        } finally {
            if (timer) clearTimeout(timer);
        }
    },

    // ─── SYSTEM PROMPT: Серьёзный учитель английского ───
    getSystemPrompt() {
        const ctx = this.getCurriculumContext();
        const progress = this.getProgressContext();
        const weakAreas = this.getWeakAreas();

        const uiLang = typeof LangyI18n !== 'undefined' ? LangyI18n.currentLang : 'en';
        const targetLang = typeof LangyTarget !== 'undefined' ? LangyTarget.displayName(uiLang) : 'English';
        const teacherRole = typeof LangyTarget !== 'undefined' ? LangyTarget.aiTeacherRole : 'English language teacher';
        const langInstructions = {
            en: `Explain concepts in English. For beginners, use simple English.`,
            ru: `IMPORTANT: The student speaks Russian. Give ALL explanations, instructions, and feedback in Russian. Teach ${targetLang} vocabulary and grammar, but explain everything in Russian.`,
            es: `IMPORTANT: The student speaks Spanish. Give ALL explanations, instructions, and feedback in Spanish. Teach ${targetLang} vocabulary and grammar, but explain everything in Spanish.`,
        };

        // English-specific curriculum grounding
        const engCtx = this.getEnglishTutoringContext();

        return `You are "Langy Teacher" — a professional, experienced and strict ${teacherRole}.

PERSONALITY & TEACHING STYLE:
- You are a qualified CEFR-certified ${teacherRole} with 15+ years of experience
- Your teaching style: strict but encouraging. You DO NOT tolerate lazy answers. You demand effort.
- You correct EVERY grammar, spelling, and vocabulary mistake immediately
- You give clear, structured explanations with examples
- You adapt your language complexity to the student's level

LANGUAGE INSTRUCTION:
${langInstructions[uiLang] || langInstructions.en}
- For absolute beginners (Pre-A1/A1): use the student's native language heavily to explain basic concepts
- For A2-B1: mix native language explanations with the target language
- For B2+: primarily the target language, native language only for complex grammar rules

CORE RULES:
1. ALWAYS follow the current textbook and curriculum. Never deviate.
2. Each lesson should cover the grammar and vocabulary of the current unit
3. Generate interactive exercises: fill-in-the-blank, translations, multiple choice, word ordering
4. Be concise in explanations — students learn by DOING, not by reading walls of text
5. Track mistakes and return to them. If a student makes an error on a topic, revisit it later.
6. After explaining theory, immediately test the student with 3-5 quick exercises
7. Do NOT use emojis in your responses. The app has its own icon system.
8. Structure your responses clearly with headers and bullet points
9. NEVER reveal answers before the student tries. Give hints, not answers.
10. When grading work, be honest. A bad essay is a bad essay — say so, but constructively.
11. When explaining grammar or vocabulary, frame it in terms of the current CEFR level can-do outcomes.
12. Reference what the student learned in previous units to reinforce continuity.

RESPONSE FORMAT:
- Keep responses under 300 words unless explaining complex grammar
- Use markdown formatting (bold, headers, lists)
- For exercises, use clear numbering and formatting
- Always end with a question or task for the student

${ctx ? `\nCURRENT CURRICULUM CONTEXT:\n${ctx}` : ''}
${typeof LangyTarget !== 'undefined' && LangyTarget.getAcademicContext ? `\nACADEMIC BACKBONE:\n${LangyTarget.getAcademicContext()}` : ''}
${engCtx ? `\n${engCtx}` : ''}
${progress ? `\nSTUDENT PROGRESS:\n${progress}` : ''}
${weakAreas.length ? `\nSTUDENT WEAK AREAS (focus extra attention here): ${weakAreas.join(', ')}` : ''}`;
    },

    // ─── ENGLISH-SPECIFIC TUTORING CONTEXT ───
    getEnglishTutoringContext() {
        const targetCode = typeof LangyTarget !== 'undefined' ? LangyTarget.getCode() : 'en';
        if (targetCode !== 'en') return ''; // Only applies to English track

        if (typeof LangyCurriculum === 'undefined') return '';
        const tb = LangyCurriculum.getActive();
        if (!tb) return '';

        const cefr = tb.cefr || 'B1';
        let ctx = `ENGLISH CURRICULUM ALIGNMENT (CEFR ${cefr}):`;

        // Level-appropriate complexity guidance
        const complexityMap = {
            'Pre-A1': 'Use only the simplest possible English. Single words and very short phrases. Always translate key words.',
            'A1': 'Use simple present tense and basic vocabulary (< 500 words). Short sentences only. Translate grammar terms.',
            'A2': 'Use present and past tenses. Introduce simple connectors (and, but, because). Vocabulary up to ~1000 words.',
            'B1': 'Use a range of tenses including future and conditionals. Expect paragraph-level writing. Vocabulary ~2000 words.',
            'B2': 'Use complex sentences, passive voice, reported speech. Expect essay-level writing. Academic vocabulary expected.',
            'C1': 'Use sophisticated grammar and nuanced vocabulary. Expect critical analysis and formal register.',
            'C2': 'Near-native complexity. Focus on stylistic precision, idiomatic fluency, and academic/professional register.',
        };
        ctx += `\nComplexity Guidance: ${complexityMap[cefr] || complexityMap['B1']}`;

        // Current can-do outcome the student is working toward
        if (tb.canDo && tb.canDo.length) {
            // Pick the most relevant can-do based on unit progress
            const progressPct = typeof LangyState !== 'undefined'
                ? Math.round(((LangyState.progress?.currentUnitId || 1) / Math.max(1, tb.units?.length || 1)) * 100)
                : 0;
            const canDoIdx = Math.min(Math.floor(progressPct / 100 * tb.canDo.length), tb.canDo.length - 1);
            ctx += `\nCurrent Can-Do Target: "${tb.canDo[canDoIdx]}"`;
            ctx += `\nFrame your feedback around whether the student is approaching this outcome.`;
        }

        // Current unit grammar and vocab for focused tutoring
        const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
        if (unitId && tb.units) {
            const unit = tb.units.find(u => u.id === unitId);
            if (unit) {
                if (unit.grammar && unit.grammar.length) {
                    ctx += `\nGrammar in Focus: ${unit.grammar.join(', ')} \u2014 prioritize corrections and explanations around these topics.`;
                }
                if (unit.vocab && unit.vocab.length) {
                    ctx += `\nActive Vocabulary: ${unit.vocab.slice(0, 15).join(', ')} \u2014 use these words in examples where natural.`;
                }
            }
        }

        return ctx;
    },

    // ─── CURRICULUM CONTEXT ───
    getCurriculumContext() {
        if (typeof LangyCurriculum === 'undefined') return '';
        return LangyCurriculum.getAIContext();
    },

    // ─── PROGRESS CONTEXT ───
    getProgressContext() {
        if (typeof LangyState === 'undefined') return '';
        const p = LangyState.progress;
        const u = LangyState.user;
        let ctx = `Student: ${u.name}\n`;
        ctx += `Level: ${u.level}\n`;
        ctx += `Overall Progress: ${p.overall}%\n`;
        ctx += `Current Unit: ${p.currentUnit}\n`;
        ctx += `Lessons Completed: ${p.topicsCompleted}\n`;
        ctx += `Skills: Grammar ${p.skills.grammar}%, Vocabulary ${p.skills.vocabulary}%, `;
        ctx += `Listening ${p.skills.listening}%, Speaking ${p.skills.speaking}%, `;
        ctx += `Writing ${p.skills.writing}%, Reading ${p.skills.reading}%\n`;
        if (p.lessonHistory.length > 0) {
            const recent = p.lessonHistory.slice(-3);
            ctx += `Recent lessons: ${recent.map(l => `${l.title} (${l.score}%)`).join(', ')}\n`;
        }
        return ctx;
    },

    // ─── WEAK AREAS ───
    getWeakAreas() {
        if (typeof LangyState !== 'undefined' && LangyState.aiMemory?.weakAreas?.length) {
            return LangyState.aiMemory.weakAreas;
        }
        // Analyze from skills
        if (typeof LangyState !== 'undefined') {
            const skills = LangyState.progress.skills;
            const weak = [];
            Object.entries(skills).forEach(([skill, val]) => {
                if (val < 40) weak.push(skill);
            });
            return weak;
        }
        return [];
    },

    // ─── MISTAKES TRACKING ───
    mistakes: [],

    recordMistake(question, userAnswer, correctAnswer, rule) {
        const entry = { question, userAnswer, correctAnswer, rule: rule || '', timestamp: Date.now() };
        this.mistakes.push(entry);
        if (typeof LangyState !== 'undefined' && LangyState.aiMemory) {
            LangyState.aiMemory.mistakes.push(entry);
            // Update weak areas based on mistake patterns
            if (this.mistakes.length % 5 === 0) {
                this._analyzeWeakAreas();
            }
        }
    },

    _analyzeWeakAreas() {
        const recent = this.mistakes.slice(-20);
        const areas = {};

        recent.forEach(m => {
            // Priority 1: use the grammar rule field (precise tracking)
            if (m.rule) {
                const ruleKey = m.rule.toLowerCase();
                areas[ruleKey] = (areas[ruleKey] || 0) + 1;
                return;
            }

            // Priority 2: fallback heuristic from question text
            const q = (m.question || '').toLowerCase();
            if (q.includes('tense') || q.includes('verb') || q.includes('was') || q.includes('were')) {
                areas['verb tenses'] = (areas['verb tenses'] || 0) + 1;
            }
            if (q.includes('preposition') || q.includes('in') || q.includes('on') || q.includes('at')) {
                areas['prepositions'] = (areas['prepositions'] || 0) + 1;
            }
            if (q.includes('article') || q.includes('a/an') || q.includes('the')) {
                areas['articles'] = (areas['articles'] || 0) + 1;
            }
        });
        LangyState.aiMemory.weakAreas = Object.entries(areas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([area]) => area);
    },

    // ─── MAIN API CALL ───
    async chat(message, systemOverride = null, onChunk = null) {
        const messages = [];

        // System prompt
        messages.push({
            role: 'system',
            content: systemOverride || this.getSystemPrompt(),
        });

        // Conversation history (last 10 messages for context window)
        if (typeof LangyState !== 'undefined' && LangyState.aiMemory.conversationContext.length > 0) {
            const history = LangyState.aiMemory.conversationContext.slice(-10);
            history.forEach(msg => {
                messages.push({
                    role: msg.role === 'ai' ? 'assistant' : 'user',
                    content: msg.content,
                });
            });
        }

        // Current message
        messages.push({ role: 'user', content: message });

        try {
            const response = await this.fetchWithTimeout(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    messages: messages,
                    max_tokens: 1500,
                    temperature: 0.7,
                    stream: !!onChunk,
                }),
            });

            if (!response.ok) {
                const err = await response.text();
                console.error('OpenRouter API Error:', err);
                throw new Error(this.getUnavailableMessage());
            }

            if (onChunk) {
                // Streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

                    for (const line of lines) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            const delta = parsed.choices?.[0]?.delta?.content || '';
                            fullContent += delta;
                            onChunk(delta, fullContent);
                        } catch (e) {
                            /* skip malformed chunks */
                        }
                    }
                }

                return fullContent;
            } else {
                // Non-streaming
                const data = await response.json();
                return data.choices?.[0]?.message?.content || 'No response from AI.';
            }
        } catch (err) {
            console.error('AI Chat Error:', err);
            throw this._normalizeError(err);
        }
    },

    // ─── LEGACY COMPATIBILITY ───
    async askDeepTutor(message, onChunk, onComplete, systemOverride) {
        try {
            const result = await this.chat(message, systemOverride, (delta, full) => {
                if (onChunk) onChunk(delta, full);
            });
            if (onComplete) onComplete(result);
            return result;
        } catch (err) {
            throw err;
        }
    },

    async chatWithRetry(message, options = {}) {
        const retries = Number.isInteger(options.retries) ? options.retries : 1;
        let lastError = null;
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await this.chat(message, options.systemOverride || null, options.onChunk || null);
            } catch (err) {
                lastError = err;
                if (typeof options.onRetry === 'function' && attempt < retries) {
                    options.onRetry(attempt + 1, err);
                }
            }
        }
        throw lastError || new Error('AI temporarily unavailable');
    },

    async safeChat(message, options = {}) {
        try {
            return await this.chatWithRetry(message, options);
        } catch (err) {
            const fallback =
                options.fallbackMessage ||
                'Извините, сейчас есть проблемы с AI-сервисом. Попробуйте ещё раз через минуту.';
            return fallback;
        }
    },

    // ─── GRADE HOMEWORK ───
    async gradeHomework(taskPrompt, userSubmission) {
        const examinerRole = typeof LangyTarget !== 'undefined' ? LangyTarget.aiExaminerRole : 'English examiner';

        // Build curriculum-aware grading context
        let cefrLevel = 'B1';
        let canDoStr = '';
        let unitFocus = '';
        if (typeof LangyCurriculum !== 'undefined') {
            const tb = LangyCurriculum.getActive();
            if (tb) {
                cefrLevel = tb.cefr || 'B1';
                if (tb.canDo && tb.canDo.length) {
                    canDoStr = `\nCEFR ${cefrLevel} Can-Do Expectations:\n${tb.canDo.slice(0, 4).map(s => '- ' + s).join('\n')}`;
                }
            }
            const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
            if (unitId && tb && tb.units) {
                const unit = tb.units.find(u => u.id === unitId);
                if (unit) {
                    unitFocus = `\nCurrent Unit Focus: "${unit.title}" — grammar: ${unit.grammar?.join(', ') || 'general'}`;
                }
            }
        }

        const gradingPrompt = `You are a strict, CEFR-certified ${examinerRole} at the ${cefrLevel} level. Grade this homework.

TASK: "${taskPrompt}"
STUDENT SUBMISSION: "${userSubmission}"
STUDENT LEVEL: CEFR ${cefrLevel}${canDoStr}${unitFocus}

Evaluate based on CEFR ${cefrLevel} expectations:
- Grammar accuracy (appropriate for this CEFR level)
- Vocabulary range (expected at this level)
- Coherence and task completion
- Whether the student demonstrates the can-do outcomes listed above

You MUST respond in this EXACT format (nothing else):
Score: [0-100]
Grade: [A/B/C/D/F]
Feedback: [Your detailed feedback. Point out specific errors with corrections. Reference the CEFR level expectations. Be constructive but strict.]`;

        const response = await this.chat(gradingPrompt, gradingPrompt);

        const scoreMatch = response.match(/Score:\s*(\d+)/i);
        const gradeMatch = response.match(/Grade:\s*([A-F])/i);
        const feedbackPart = response.split(/Feedback:/i)[1] || response;
        const score = scoreMatch ? parseInt(scoreMatch[1]) : NaN;
        const grade = gradeMatch ? gradeMatch[1] : null;

        if (!Number.isInteger(score) || score < 0 || score > 100 || !grade) {
            throw new Error(this.getUnavailableMessage());
        }

        return {
            score,
            feedback: feedbackPart.trim(),
            grade,
        };
    },

    // ─── GENERATE EXERCISE FROM AI ───
    async generateExercise(type, topic, level) {
        // Build curriculum-aware exercise context
        let vocabHint = '';
        let grammarHint = '';
        if (typeof LangyCurriculum !== 'undefined') {
            const tb = LangyCurriculum.getActive();
            const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
            if (tb && unitId) {
                const unit = tb.units?.find(u => u.id === unitId);
                if (unit) {
                    if (unit.vocab && unit.vocab.length) vocabHint = `\nUse vocabulary from this list where possible: ${unit.vocab.join(', ')}`;
                    if (unit.grammar && unit.grammar.length) grammarHint = `\nGrammar context for this unit: ${unit.grammar.join(', ')}`;
                }
            }
        }

        const prompt = `Generate a single ${type} exercise about "${topic}" for CEFR level ${level}.${grammarHint}${vocabHint}
The exercise should be appropriate for a ${level} learner — not too easy, not too hard.
Format as JSON:
{
    "prompt": "the question/instruction",
    "options": ["option1", "option2", "option3", "option4"],
    "correct": 0,
    "explanation": "why this is correct (reference the grammar rule)"
}`;

        try {
            const result = await this.chat(prompt);
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.warn('AI exercise generation failed:', e);
        }
        return null;
    },

    // ─── CURRICULUM INTEGRATION ───
    completeExercise(exercise, userScore) {
        const historyEntry = {
            id: Date.now(),
            unitId: LangyState.progress.currentUnitId,
            lessonIdx: LangyState.progress.currentLessonIdx,
            exerciseId: exercise.id,
            title: exercise.prompt,
            score: userScore,
            status: userScore >= 70 ? 'done' : 'error',
            errors: Math.floor((100 - userScore) / 10),
            date: new Date().toISOString().split('T')[0],
        };

        LangyState.progress.lessonHistory.push(historyEntry);

        const total = LangyCurriculum.getAllExercises().length || 1;
        LangyState.progress.topicsCompleted = LangyState.progress.lessonHistory.length;
        LangyState.progress.overall = Math.round((LangyState.progress.topicsCompleted / total) * 100);

        // Advance curriculum
        const tb = LangyCurriculum.getActive();
        const unit = tb.units.find(u => u.id === LangyState.progress.currentUnitId);

        if (unit && LangyState.progress.currentLessonIdx < unit.exercises.length - 1) {
            LangyState.progress.currentLessonIdx++;
        } else if (unit) {
            const nextUnit = tb.units.find(u => u.id === LangyState.progress.currentUnitId + 1);
            if (nextUnit) {
                LangyState.progress.currentUnitId++;
                LangyState.progress.currentLessonIdx = 0;
                LangyState.progress.currentUnit = `Unit ${nextUnit.id}: ${nextUnit.title}`;
            }
        }

        // Homework if low score
        if (userScore < 80 && unit) {
            LangyState.homework.current.push({
                id: Date.now() + 1,
                unitId: unit.id,
                type: exercise.type,
                title: 'Review: ' + unit.title,
                desc: 'Practice: ' + exercise.prompt,
                status: 'pending',
                icon: LangyIcons.pencil,
            });
        }

        // Update skills
        const skillType =
            exercise.type === 'speak-aloud'
                ? 'speaking'
                : exercise.type === 'listen-type'
                  ? 'listening'
                  : exercise.type === 'read-answer'
                    ? 'reading'
                    : exercise.type === 'type-translation'
                      ? 'writing'
                      : 'grammar';
        LangyState.progress.skills[skillType] = Math.min(100, (LangyState.progress.skills[skillType] || 0) + 3);

        // Currency
        LangyState.currencies.dangy += 10;
        LangyState.user.xp += 25;

        if (typeof LangyDB !== 'undefined') LangyDB.saveProgress();
    },

    // ─── THINK DELAY ───
    async think(minMs = 400, maxMs = 1200) {
        const delay = Math.random() * (maxMs - minMs) + minMs;
        return new Promise(resolve => setTimeout(resolve, delay));
    },

    // Mock responses for offline fallback
    responses: {
        greeting: ["Welcome back! Let's continue where we left off.", "Ready for today's lesson? Let's make progress!"],
        correct: ['Excellent!', 'Perfect!', 'Well done!'],
        incorrect: ['Not quite. The answer is: "{answer}". Let\'s review this.', 'Close! It should be: "{answer}".'],
    },

    getResponse(type, data = {}) {
        const pool = this.responses[type];
        if (!pool) return "Let's keep learning!";
        let response = pool[Math.floor(Math.random() * pool.length)];
        Object.keys(data).forEach(key => {
            response = response.replace(`{${key}}`, data[key]);
        });
        return response;
    },

    // ─── CURRICULUM-AWARE CORRECTION PROMPT ───
    /**
     * Build a structured correction prompt for the AI tutor.
     * Used when a student gets an exercise wrong during English lessons.
     * @param {Object} opts - { sentence, correctAnswer, rule, cefrLevel, unitTitle }
     * @returns {string}
     */
    buildCorrectionPrompt(opts = {}) {
        const { sentence, correctAnswer, rule, cefrLevel, unitTitle } = opts;
        let prompt = `The student made an error.`;
        if (sentence) prompt += ` Exercise: "${sentence}".`;
        if (correctAnswer) prompt += ` Correct answer: "${correctAnswer}".`;
        if (rule) prompt += ` Grammar rule: ${rule}.`;
        if (cefrLevel) prompt += ` Student level: CEFR ${cefrLevel}.`;
        if (unitTitle) prompt += ` Current unit: "${unitTitle}".`;
        prompt += `\n\nProvide a focused correction:`;
        prompt += `\n1. State the correct answer clearly.`;
        prompt += `\n2. Explain the grammar rule in 1-2 sentences, appropriate for ${cefrLevel || 'this'} level.`;
        prompt += `\n3. Give one similar example to reinforce the pattern.`;
        prompt += `\nKeep it under 80 words. Do not give a full lesson.`;
        return prompt;
    },

    // ─── CURRICULUM-AWARE REVIEW PROMPT ───
    /**
     * Build a structured lesson review prompt for the AI tutor.
     * Used after lesson completion to provide meaningful feedback.
     * @param {Object} opts - { unitTitle, score, cefrLevel, grammarTopics, canDo, weakRules, correctCount, totalCount }
     * @returns {string}
     */
    buildReviewPrompt(opts = {}) {
        const { unitTitle, score, cefrLevel, grammarTopics, canDo, weakRules, correctCount, totalCount } = opts;
        let prompt = `Lesson review for "${unitTitle || 'current lesson'}".`;
        prompt += ` Score: ${score || 0}% (${correctCount || 0}/${totalCount || 0}).`;
        if (cefrLevel) prompt += ` Level: CEFR ${cefrLevel}.`;
        if (grammarTopics?.length) prompt += ` Grammar covered: ${grammarTopics.join(', ')}.`;
        if (canDo) prompt += ` Can-do target: "${canDo}".`;
        if (weakRules?.length) prompt += ` Weak areas this session: ${weakRules.join(', ')}.`;

        prompt += `\n\nProvide a structured review:`;
        prompt += `\n1. **Result**: One sentence about the overall performance.`;
        prompt += `\n2. **Strengths**: What the student did well (based on score and grammar covered).`;
        if (weakRules?.length) {
            prompt += `\n3. **Focus needed**: Specific grammar rules to review, with one example per rule.`;
        }
        if (canDo) {
            prompt += `\n4. **Progress toward can-do**: How close is the student to achieving "${canDo}"?`;
        }
        prompt += `\n5. **Next step**: One concrete recommendation for what to practice next.`;
        prompt += `\nKeep it under 200 words. Be specific, not generic.`;
        return prompt;
    },
};

