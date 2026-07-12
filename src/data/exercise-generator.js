/* ============================================
   LANGY — DYNAMIC EXERCISE GENERATOR
   Generates unlimited exercises from vocab & grammar banks
   Each call produces a fresh, random exercise
   ============================================ */

const ExerciseGenerator = {

    // ─── UTILITIES ───
    _shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    },

    _pick(arr, n = 1) {
        const shuffled = this._shuffle(arr);
        return n === 1 ? shuffled[0] : shuffled.slice(0, n);
    },

    _pickExcluding(arr, exclude, n = 1) {
        const filtered = arr.filter(item =>
            typeof item === 'string' ? item !== exclude :
            (item.en || item) !== (exclude.en || exclude)
        );
        return this._pick(filtered, n);
    },

    // Determine the level to use: current level + can include lower levels for review
    _getLevelWithReview(level) {
        const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const idx = levels.indexOf(level);
        // 20% chance to review from a previous level
        if (idx > 0 && Math.random() < 0.2) {
            return levels[Math.floor(Math.random() * idx)];
        }
        return level;
    },

    // ═══════════════════════════════════════════
    // EXERCISE GENERATORS (8 types)
    // ═══════════════════════════════════════════

    // 1. FILL-BUBBLE — Grammar fill-in-the-gap
    generateFillBubble(level) {
        const effectiveLevel = this._getLevelWithReview(level);
        const bank = LangyGrammarBank[effectiveLevel];
        if (!bank) return this._fallbackFillBubble(level);

        // Get all pattern arrays (excluding methods, sentences, translations)
        const patternArrays = Object.keys(bank).filter(k =>
            Array.isArray(bank[k]) && k !== 'sentences' && k !== 'translations'
        );

        if (patternArrays.length === 0) return this._fallbackFillBubble(level);

        const category = this._pick(patternArrays);
        const patterns = bank[category];

        if (!patterns || patterns.length === 0) return this._fallbackFillBubble(level);

        const pattern = this._pick(patterns);

        // Generate shuffled options
        const shuffledOptions = this._shuffle(pattern.options);
        const newCorrectIdx = shuffledOptions.indexOf(pattern.answer);

        return {
            type: 'fill-bubble',
            data: {
                instruction: pattern.instruction || `Choose the correct form (${pattern.rule || 'grammar'})`,
                sentence: pattern.template,
                options: shuffledOptions,
                correct: newCorrectIdx,
                rule: pattern.rule
            }
        };
    },

    _fallbackFillBubble(level) {
        return {
            type: 'fill-bubble',
            data: {
                instruction: 'Choose the correct form',
                sentence: 'She ___ a student.',
                options: ['am', 'is', 'are'],
                correct: 1
            }
        };
    },

    // 2. MATCH-PAIRS — Vocabulary matching
    generateMatchPairs(level, unitId) {
        const effectiveLevel = this._getLevelWithReview(level);

        // Unit-scoped vocab if available, otherwise full level
        let words;
        if (unitId && typeof LangyVocabBank !== 'undefined' && LangyVocabBank.getForUnit) {
            words = LangyVocabBank.getForUnit(effectiveLevel, unitId);
        }
        if (!words || words.length < 4) {
            const vocabLevel = LangyVocabBank[effectiveLevel];
            if (!vocabLevel) return this._fallbackMatchPairs();
            words = vocabLevel.getAllWords();
        }
        if (words.length < 4) return this._fallbackMatchPairs();

        const selected = this._pick(words, Math.min(5, words.length));

        // Decide match type randomly
        const types = ['en-ru', 'synonym', 'opposite', 'verb-past'];
        let matchType = 'en-ru';

        // Check if we can do verb matching
        const verbs = selected.filter(w => w.past);
        if (verbs.length >= 4 && Math.random() < 0.3) {
            matchType = 'verb-past';
        }

        // Check for opposites
        const withOpposites = selected.filter(w => w.opp);
        if (withOpposites.length >= 4 && Math.random() < 0.3) {
            matchType = 'opposite';
        }

        let pairs;

        if (matchType === 'verb-past' && verbs.length >= 4) {
            const chosen = this._pick(verbs, 4);
            pairs = chosen.map(v => ({
                left: v.en,
                right: v.past
            }));
        } else if (matchType === 'opposite' && withOpposites.length >= 4) {
            const chosen = this._pick(withOpposites, 4);
            pairs = chosen.map(w => ({
                left: w.en,
                right: w.opp
            }));
        } else {
            // Default: EN → RU translation
            const chosen = this._pick(selected, Math.min(4, selected.length));
            pairs = chosen.map(w => ({
                left: w.en,
                right: w.ru
            }));
        }

        const instructions = {
            'en-ru': 'Match the words with their translations',
            'verb-past': 'Match the verb to its past form',
            'opposite': 'Match the word to its opposite'
        };

        return {
            type: 'match-pairs',
            data: {
                instruction: instructions[matchType] || 'Match the pairs',
                pairs: this._shuffle(pairs)
            }
        };
    },

    _fallbackMatchPairs() {
        return {
            type: 'match-pairs',
            data: {
                instruction: 'Match the words',
                pairs: [
                    { left: 'Hello', right: 'Привет' },
                    { left: 'Goodbye', right: 'До свидания' },
                    { left: 'Thank you', right: 'Спасибо' },
                    { left: 'Yes', right: 'Да' }
                ]
            }
        };
    },

    // 3. WORD-SHUFFLE — Put words in correct order
    generateWordShuffle(level) {
        const effectiveLevel = this._getLevelWithReview(level);
        const bank = LangyGrammarBank[effectiveLevel];

        if (bank?.sentences?.length > 0) {
            const sentence = this._pick(bank.sentences);
            let shuffled = this._shuffle(sentence.words);

            // Make sure the shuffled order is different from correct
            let attempts = 0;
            while (shuffled.join(' ') === sentence.correct.join(' ') && attempts < 10) {
                shuffled = this._shuffle(shuffled);
                attempts++;
            }

            return {
                type: 'word-shuffle',
                data: {
                    instruction: 'Put the words in the correct order',
                    words: shuffled,
                    correct: sentence.correct
                }
            };
        }

        // Fallback: generate from vocab
        return this._fallbackWordShuffle();
    },

    _fallbackWordShuffle() {
        const sentences = [
            { words: ['I', 'like', 'to', 'read', 'books'], correct: ['I', 'like', 'to', 'read', 'books'] },
            { words: ['she', 'is', 'a', 'good', 'student'], correct: ['she', 'is', 'a', 'good', 'student'] },
        ];
        const s = this._pick(sentences);
        return {
            type: 'word-shuffle',
            data: {
                instruction: 'Put the words in the correct order',
                words: this._shuffle(s.words),
                correct: s.correct
            }
        };
    },

    // 4. TYPE-TRANSLATION — Translate RU → EN
    generateTypeTranslation(level) {
        const effectiveLevel = this._getLevelWithReview(level);
        const bank = LangyGrammarBank[effectiveLevel];

        if (bank?.translations?.length > 0) {
            const pair = this._pick(bank.translations);
            return {
                type: 'type-translation',
                data: {
                    instruction: 'Translate to English',
                    sourceText: pair.ru,
                    fromLang: 'RU',
                    toLang: 'EN',
                    answer: pair.en
                }
            };
        }

        // Fallback: generate from vocab
        const vocabLevel = LangyVocabBank[effectiveLevel];
        if (vocabLevel) {
            const word = this._pick(vocabLevel.getAllWords());
            if (word) {
                return {
                    type: 'type-translation',
                    data: {
                        instruction: 'Translate to English',
                        sourceText: word.ru,
                        fromLang: 'RU',
                        toLang: 'EN',
                        answer: word.en
                    }
                };
            }
        }

        return {
            type: 'type-translation',
            data: {
                instruction: 'Translate to English',
                sourceText: 'Привет',
                fromLang: 'RU',
                toLang: 'EN',
                answer: 'Hello'
            }
        };
    },

    // 5. IMAGE-CHOICE — Pick the correct word/emoji
    generateImageChoice(level) {
        const effectiveLevel = this._getLevelWithReview(level);

        // Emoji mappings for common categories
        const emojiMap = {
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'strawberry': '🍓',
            'coffee': '☕', 'tea': '🍵', 'water': '💧', 'milk': '🥛',
            'bread': '🍞', 'pizza': '🍕', 'cake': '🎂', 'ice cream': '🍦',
            'egg': '🥚', 'cheese': '🧀', 'chocolate': '🍫', 'fish': '🐟',
            'chicken': '🍗', 'rice': '🍚', 'soup': '🍜', 'salad': '🥗',
            'car': '🚗', 'bus': '🚌', 'umbrella': '☂️', 'phone': '📱',
            'book': '📖', 'pen': '🖊️', 'key': '🔑', 'clock': '🕐',
            'camera': '📷', 'bag': '👜', 'glasses': '👓', 'shirt': '👔',
            'hat': '🎩', 'shoes': '👟', 'dress': '👗', 'jacket': '🧥',
            'cat': '🐱', 'dog': '🐕', 'sun': '☀️', 'rain': '🌧️',
            'snow': '❄️', 'star': '⭐', 'heart': '❤️', 'house': '🏠',
            'tree': '🌳', 'flower': '🌸', 'mountain': '⛰️', 'beach': '🏖️',
            'guitar': '🎸', 'football': '⚽', 'swimming': '🏊', 'dancing': '💃',
            'cooking': '🍳', 'reading': '📖', 'sleeping': '😴', 'running': '🏃',
            'happy': '😊', 'sad': '😢', 'angry': '😡', 'tired': '😴',
            'doctor': '👨‍⚕️', 'teacher': '👩‍🏫', 'pilot': '👨‍✈️', 'chef': '👨‍🍳',
            'school': '🏫', 'hospital': '🏥', 'restaurant': '🍽️', 'airport': '✈️',
            'park': '🌳', 'cinema': '🎬', 'library': '📚', 'hotel': '🏨',
        };

        // Get words that have emoji representations
        const vocabLevel = LangyVocabBank[effectiveLevel] || LangyVocabBank.A1;
        const allWords = vocabLevel.getAllWords();
        const withEmoji = allWords.filter(w => emojiMap[w.en.toLowerCase()]);

        if (withEmoji.length < 4) {
            // Use basic fallback
            const options = [
                { emoji: '🍎', label: 'Apple' },
                { emoji: '🍌', label: 'Banana' },
                { emoji: '🍊', label: 'Orange' },
                { emoji: '🍇', label: 'Grape' }
            ];
            return {
                type: 'image-choice',
                data: { instruction: 'Choose the correct picture', word: 'Apple', options, correct: 0 }
            };
        }

        const correctWord = this._pick(withEmoji);
        const distractors = this._pickExcluding(withEmoji, correctWord, 3);

        const options = [correctWord, ...distractors].map(w => ({
            emoji: emojiMap[w.en.toLowerCase()] || '❓',
            label: w.en
        }));

        const shuffledOptions = this._shuffle(options);
        const correctIdx = shuffledOptions.findIndex(o => o.label === correctWord.en);

        return {
            type: 'image-choice',
            data: {
                instruction: 'Choose the correct picture',
                word: correctWord.en,
                options: shuffledOptions,
                correct: correctIdx
            }
        };
    },

    // 6. LISTEN-TYPE — Dictation exercise
    generateListenType(level) {
        const effectiveLevel = this._getLevelWithReview(level);

        // For listen exercises, use simple sentences or vocab words
        const bank = LangyGrammarBank[effectiveLevel];
        const vocabLevel = LangyVocabBank[effectiveLevel];

        // Option 1: Sentence dictation
        if (bank?.translations?.length > 0 && Math.random() < 0.6) {
            const translation = this._pick(bank.translations);
            return {
                type: 'listen-type',
                data: {
                    instruction: 'Listen and type what you hear',
                    text: translation.en,
                    hint: `${translation.ru}`
                }
            };
        }

        // Option 2: Single word dictation
        if (vocabLevel) {
            const word = this._pick(vocabLevel.getAllWords());
            if (word) {
                return {
                    type: 'listen-type',
                    data: {
                        instruction: 'Listen and type the word',
                        text: word.en,
                        hint: `Translation: ${word.ru}`
                    }
                };
            }
        }

        return {
            type: 'listen-type',
            data: {
                instruction: 'Listen and type what you hear',
                text: 'Hello, how are you?',
                hint: 'A common greeting'
            }
        };
    },

    // 7. SPEAK-ALOUD — Pronunciation practice
    generateSpeakAloud(level) {
        const effectiveLevel = this._getLevelWithReview(level);
        const bank = LangyGrammarBank[effectiveLevel];

        // Use translation bank as phrase sources
        if (bank?.translations?.length > 0) {
            const translation = this._pick(bank.translations);
            return {
                type: 'speak-aloud',
                data: {
                    instruction: 'Say this phrase aloud:',
                    phrase: translation.en
                }
            };
        }

        // Use vocabulary for word-level practice
        const vocabLevel = LangyVocabBank[effectiveLevel];
        if (vocabLevel) {
            const words = this._pick(vocabLevel.getAllWords(), 3);
            const phrase = words.map(w => w.en).join(', ');
            return {
                type: 'speak-aloud',
                data: {
                    instruction: 'Say these words aloud:',
                    phrase: phrase
                }
            };
        }

        return {
            type: 'speak-aloud',
            data: {
                instruction: 'Say this phrase aloud:',
                phrase: 'The quick brown fox jumps over the lazy dog'
            }
        };
    },

    // 8. READ-ANSWER — Reading comprehension
    generateReadAnswer(level) {
        // Reading passages by level
        const passages = {
            A1: [
                { passage: 'My name is Tom. I am 25 years old. I live in London. I work in a hospital. I am a doctor. I like my job because I help people every day.', question: 'What is Tom\'s job?', options: ['Teacher', 'Doctor', 'Driver', 'Student'], correct: 1 },
                { passage: 'Maria is from Spain. She lives in Madrid. She has two children, a boy and a girl. Her son is 6 years old and her daughter is 3. They go to school every day.', question: 'How many children does Maria have?', options: ['One', 'Two', 'Three', 'Four'], correct: 1 },
                { passage: 'It is Sunday. The weather is sunny. The family is in the park. The children are playing football. The parents are sitting on a bench. They are happy.', question: 'What day is it?', options: ['Monday', 'Saturday', 'Sunday', 'Friday'], correct: 2 },
                { passage: 'I have breakfast at 8 o\'clock. I usually eat bread and cheese. I drink tea. After breakfast, I go to school. School starts at 9 o\'clock.', question: 'What does the person drink for breakfast?', options: ['Coffee', 'Tea', 'Juice', 'Milk'], correct: 1 },
                { passage: 'This is my room. There is a bed, a desk, and a chair. There are two windows. The walls are blue. I like my room. It is small but comfortable.', question: 'What colour are the walls?', options: ['White', 'Green', 'Blue', 'Yellow'], correct: 2 },
            ],
            A2: [
                { passage: 'Last summer, Tom went to Italy with his family. They stayed in a small hotel near the beach. They visited Rome and ate pizza and pasta. Tom\'s favourite day was when they went to the Colosseum.', question: 'Where did Tom go last summer?', options: ['France', 'Spain', 'Italy', 'Greece'], correct: 2 },
                { passage: 'Emily wants to buy a new laptop. She went to the shop and looked at different models. The cheapest one was $400 and the most expensive was $1200. She decided to buy the one for $700 because it was the best value.', question: 'How much did Emily pay?', options: ['$400', '$700', '$1000', '$1200'], correct: 1 },
                { passage: 'John has been learning Spanish for two years. He takes classes twice a week and practices with a language app every day. He can now have basic conversations and understand simple texts.', question: 'How often does John take classes?', options: ['Every day', 'Once a week', 'Twice a week', 'Three times a week'], correct: 2 },
            ],
            B1: [
                { passage: 'The number of people working from home has increased significantly since 2020. Many companies have discovered that employees can be just as productive working remotely. However, some studies suggest that remote workers may feel isolated and struggle with work-life balance.', question: 'What problem do some remote workers face?', options: ['Low salary', 'Isolation and work-life balance', 'Too many meetings', 'Not enough technology'], correct: 1 },
                { passage: 'Scientists have found that learning a second language can delay the onset of dementia by up to five years. The research, conducted at the University of Edinburgh, studied over 800 people. The findings suggest that bilingualism strengthens the brain and improves cognitive function.', question: 'What benefit of bilingualism does the study mention?', options: ['Better hearing', 'Higher salary', 'Delayed dementia', 'Improved eyesight'], correct: 2 },
            ],
            B2: [
                { passage: 'The phenomenon of "code-switching" refers to the practice of alternating between two or more languages or varieties of language in conversation. Research suggests that code-switching is not a sign of confusion but of linguistic competence. Bilinguals who code-switch tend to have a deeper understanding of both languages.', question: 'According to the text, what does code-switching indicate?', options: ['Confusion', 'Linguistic competence', 'Poor education', 'Nervousness'], correct: 1 },
                { passage: 'Artificial intelligence is transforming the way we learn languages. Modern AI tutors can analyse a learner\'s mistakes, identify patterns, and provide personalised exercises. Unlike traditional textbooks, AI adapts in real-time to each student\'s needs. However, critics argue that AI cannot replace the nuanced understanding of human teachers.', question: 'What advantage does AI have over textbooks, according to the text?', options: ['AI is cheaper', 'AI adapts in real-time', 'AI speaks more languages', 'AI has more exercises'], correct: 1 },
            ],
            C1: [
                { passage: 'Noam Chomsky\'s theory of Universal Grammar posits that the ability to acquire language is innate. According to this view, children are born with an inherent understanding of basic grammatical structure that underlies all human languages. This "language acquisition device" enables children to rapidly acquire the complex rules of their native language despite relatively limited input.', question: 'What enables children to acquire language rapidly, according to Chomsky?', options: ['Extensive teaching', 'An innate language acquisition device', 'Memorization', 'Imitation'], correct: 1 },
            ],
            C2: [
                { passage: 'The ramifications of the proposed legislation extend far beyond the immediate fiscal implications, encompassing a fundamental recalibration of the relationship between the state and the individual citizen. One might argue, not without justification, that such sweeping reforms necessitate a more robust democratic mandate than has hitherto been secured.', question: 'What register is this text written in?', options: ['Casual conversation', 'Academic/legal formal', 'Journalistic', 'Literary fiction'], correct: 1 },
            ]
        };

        const levelPassages = passages[level] || passages.A1;
        const selected = this._pick(levelPassages);

        return {
            type: 'read-answer',
            data: {
                instruction: 'Read and answer the question',
                passage: selected.passage,
                question: selected.question,
                options: selected.options,
                correct: selected.correct
            }
        };
    },


    // ═══════════════════════════════════════════
    // MAIN API — Generate exercises
    // ═══════════════════════════════════════════

    /**
     * Generate a single random exercise for a given CEFR level
     * @param {string} level - CEFR level (A1, A2, B1, B2, C1, C2)
     * @param {string} [type] - Optional specific type
     * @param {number} [unitId] - Optional unit ID for unit-scoped vocabulary
     * @returns {Object} Exercise object with type and data
     */
    generate(level = 'A1', type = null, unitId = null) {
        const types = [
            'fill-bubble',
            'match-pairs',
            'word-shuffle',
            'type-translation',
            'image-choice',
            'listen-type',
            'speak-aloud',
            'read-answer'
        ];

        const chosenType = type || this._pick(types);

        switch (chosenType) {
            case 'fill-bubble': return this.generateFillBubble(level);
            case 'match-pairs': return this.generateMatchPairs(level, unitId);
            case 'word-shuffle': return this.generateWordShuffle(level);
            case 'type-translation': return this.generateTypeTranslation(level);
            case 'image-choice': return this.generateImageChoice(level);
            case 'listen-type': return this.generateListenType(level);
            case 'speak-aloud': return this.generateSpeakAloud(level);
            case 'read-answer': return this.generateReadAnswer(level);
            default: return this.generateFillBubble(level);
        }
    },

    /**
     * Generate exercises aligned with the current curriculum unit.
     * Prioritizes grammar categories that match the unit's grammar focus,
     * and uses unit-scoped vocabulary where possible.
     * Falls back to standard generation if no curriculum is available.
     * @param {number} count - Number of exercises
     * @param {Object} [options] - Options: { types: string[] }
     * @returns {Array} Array of exercise objects
     */
    generateForCurrentUnit(count = 5, options = {}) {
        // Get curriculum context
        const level = (typeof LangyState !== 'undefined' ? LangyState.user?.level : null) || 'B1';
        const unitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;

        if (!unitId || typeof LangyCurriculum === 'undefined') {
            return this.generateBatch(level, count, options);
        }

        const tb = LangyCurriculum.getActive();
        if (!tb || !tb.units) return this.generateBatch(level, count, options);

        const unit = tb.units.find(u => u.id === unitId);
        if (!unit) return this.generateBatch(level, count, options);

        const exercises = [];
        const unitGrammarCategories = this._getUnitGrammarCategories(level, unit.grammar || []);

        // 60% unit-focused grammar exercises, 40% mixed
        const focusedCount = Math.ceil(count * 0.6);
        const bank = LangyGrammarBank[level];

        if (bank && unitGrammarCategories.length > 0) {
            for (let i = 0; i < focusedCount; i++) {
                const cat = unitGrammarCategories[i % unitGrammarCategories.length];
                const patterns = bank[cat];
                if (patterns && patterns.length > 0) {
                    const pattern = this._pick(patterns);
                    const shuffledOptions = this._shuffle(pattern.options);
                    exercises.push({
                        type: 'fill-bubble',
                        data: {
                            instruction: pattern.instruction || `Grammar: ${pattern.rule || cat.replace(/_/g, ' ')}`,
                            sentence: pattern.template,
                            options: shuffledOptions,
                            correct: shuffledOptions.indexOf(pattern.answer),
                            rule: pattern.rule
                        }
                    });
                }
            }
        }

        // Fill remaining with unit-scoped mixed types (pass unitId for vocab scoping)
        const mixedTypes = ['match-pairs', 'type-translation', 'word-shuffle', 'listen-type'];
        while (exercises.length < count) {
            const t = mixedTypes[exercises.length % mixedTypes.length];
            exercises.push(this.generate(level, t, unitId));
        }

        return this._shuffle(exercises);
    },

    /**
     * Map unit grammar labels to grammar bank category keys.
     * e.g. 'present simple' -> ['present_simple'], 'verb be' -> ['verb_be']
     * @param {string} level
     * @param {string[]} grammarLabels
     * @returns {string[]} matching category keys in the grammar bank
     */
    _getUnitGrammarCategories(level, grammarLabels) {
        const bank = LangyGrammarBank[level];
        if (!bank || !grammarLabels.length) return [];

        const bankCategories = Object.keys(bank).filter(k =>
            Array.isArray(bank[k]) && k !== 'sentences' && k !== 'translations'
        );

        const matched = [];
        grammarLabels.forEach(label => {
            const normalized = label.toLowerCase().replace(/[\s/-]/g, '_').replace(/['']/g, '');
            bankCategories.forEach(cat => {
                // Match by: exact, contains, or label-in-rule
                if (cat === normalized || cat.includes(normalized) || normalized.includes(cat)) {
                    if (!matched.includes(cat)) matched.push(cat);
                } else {
                    // Check if any pattern's rule matches the label
                    const patterns = bank[cat];
                    if (patterns.length > 0 && patterns[0].rule &&
                        patterns[0].rule.toLowerCase().includes(label.toLowerCase())) {
                        if (!matched.includes(cat)) matched.push(cat);
                    }
                }
            });
        });

        return matched;
    },

    /**
     * Generate a batch of exercises
     * @param {string} level - CEFR level
     * @param {number} count - Number of exercises to generate
     * @param {Object} [options] - Options: { types: string[], noRepeatTypes: boolean, unitId: number }
     * @returns {Array} Array of exercise objects
     */
    generateBatch(level = 'A1', count = 5, options = {}) {
        const exercises = [];
        const types = options.types || [
            'fill-bubble', 'match-pairs', 'word-shuffle',
            'type-translation', 'image-choice', 'listen-type',
            'speak-aloud', 'read-answer'
        ];
        const unitId = options.unitId || null;

        // If noRepeatTypes, cycle through types
        if (options.noRepeatTypes && count <= types.length) {
            const shuffledTypes = this._shuffle(types).slice(0, count);
            shuffledTypes.forEach(t => exercises.push(this.generate(level, t, unitId)));
        } else {
            for (let i = 0; i < count; i++) {
                const type = types[i % types.length];
                exercises.push(this.generate(level, type, unitId));
            }
        }

        return exercises;
    },

    /**
     * Generate exercises focused on a specific grammar rule or topic
     * @param {string} level - CEFR level
     * @param {string} topic - Grammar rule or vocab category
     * @param {number} count - Number of exercises
     * @returns {Array}
     */
    generateForTopic(level, topic, count = 5) {
        const exercises = [];

        // First, try grammar exercises for this topic
        const bank = LangyGrammarBank[level];
        if (bank?.[topic]) {
            const patterns = bank[topic];
            const selectedPatterns = this._shuffle(patterns).slice(0, Math.min(3, patterns.length));
            selectedPatterns.forEach(p => {
                const options = this._shuffle(p.options);
                exercises.push({
                    type: 'fill-bubble',
                    data: {
                        instruction: `Grammar: ${p.rule || topic}`,
                        sentence: p.template,
                        options,
                        correct: options.indexOf(p.answer),
                        rule: p.rule
                    }
                });
            });
        }

        // Fill remaining with mixed types
        while (exercises.length < count) {
            exercises.push(this.generate(level));
        }

        return exercises;
    },

    /**
     * Generate exercises targeting user's weak areas
     * Uses LangyState.aiMemory.mistakes to determine weak points
     * @param {string} level
     * @param {number} count
     * @returns {Array}
     */
    generateAdaptive(level, count = 5) {
        const exercises = [];
        const mistakes = (typeof LangyState !== 'undefined')
            ? LangyState.aiMemory?.mistakes || []
            : [];

        // Identify weak grammar rules from mistakes
        const weakRules = {};
        mistakes.forEach(m => {
            if (m.rule) {
                weakRules[m.rule] = (weakRules[m.rule] || 0) + 1;
            }
        });

        // Sort by most mistakes
        const sortedWeak = Object.entries(weakRules)
            .sort((a, b) => b[1] - a[1])
            .map(([rule]) => rule);

        // Generate exercises targeting weak areas first (60%)
        const weakCount = Math.ceil(count * 0.6);
        const bank = LangyGrammarBank[level];

        if (sortedWeak.length > 0 && bank) {
            for (let i = 0; i < weakCount && i < sortedWeak.length; i++) {
                // Find patterns matching this weak rule
                const allPatterns = bank.getAllPatterns ? bank.getAllPatterns() : [];
                const matching = allPatterns.filter(p => p.rule === sortedWeak[i]);

                if (matching.length > 0) {
                    const p = this._pick(matching);
                    const opts = this._shuffle(p.options);
                    exercises.push({
                        type: 'fill-bubble',
                        data: {
                            instruction: `Review: ${p.rule}`,
                            sentence: p.template,
                            options: opts,
                            correct: opts.indexOf(p.answer)
                        }
                    });
                }
            }
        }

        // Fill remaining with random exercises
        while (exercises.length < count) {
            exercises.push(this.generate(level));
        }

        return exercises;
    },

    /**
     * Quick stat: how many unique exercises can be generated per level
     */
    getEstimatedCapacity(level) {
        const grammarPatterns = LangyGrammarBank[level]?.getAllPatterns?.()?.length || 0;
        const translations = LangyGrammarBank[level]?.translations?.length || 0;
        const vocabWords = LangyVocabBank[level]?.getAllWords?.()?.length || 0;
        const sentences = LangyGrammarBank[level]?.sentences?.length || 0;

        // fill-bubble: grammarPatterns variations
        // match-pairs: C(vocabWords, 4) combinations
        // word-shuffle: sentences count
        // type-translation: translations + vocabWords
        // image-choice: vocab with emoji
        // listen-type: translations + vocab
        // speak-aloud: translations + vocab phrases
        // read-answer: reading passages

        const matchCombinations = vocabWords > 4 ? Math.floor(vocabWords * (vocabWords - 1) * (vocabWords - 2) * (vocabWords - 3) / 24) : 1;

        return {
            level,
            grammarPatterns,
            vocabWords,
            translations,
            sentences,
            estimatedTotal: grammarPatterns + matchCombinations + sentences + translations * 3 + vocabWords,
            note: 'Match-pairs alone can generate ' + matchCombinations.toLocaleString() + ' unique combinations'
        };
    }
};

if (typeof module !== 'undefined') module.exports = { ExerciseGenerator };
