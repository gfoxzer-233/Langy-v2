/* ============================================
   LANGY — FULL CURRICULUM DATA v3
   CEFR-aligned original curriculum: Pre-A1 → C2
   ~95 units across 7 levels · ~600+ exercises
   Types: 📗 Grammar · 🗣️ Situational · 🎤 Pronunciation · 🔄 Review
   Each level includes: CEFR can-do statements, learning objectives,
   structured units with teachSlides, exercises, and homework
   ============================================ */

const LangyCurriculum = {
    activeTextbookId: null,
    targetLanguage: 'en',

    textbooks: [

    // ═══════════════════════════════════════════
    // PRE-A1 — STARTER (6 units for absolute beginners)
    // ═══════════════════════════════════════════
    {
        id: 'pre_a1_starter',
        language: 'en',
        title: 'Pre-A1 — Starter',
        level: 'Pre-A1',
        cefr: 'Pre-A1',
        methodology: 'Foundational literacy for absolute beginners. Alphabet recognition, basic sight words, numbers 1-10, colors. Heavy visual and native-language scaffolding.',
        canDo: [
            'Can recognise the 26 letters of the English alphabet',
            'Can say and respond to basic greetings (hello, goodbye, please, thank you)',
            'Can count from 1 to 10',
            'Can name basic colors',
            'Can identify common everyday objects by name',
            'Can form very simple sentences with "I am..." and "You are..."',
        ],
        objectives: [
            'Alphabet recognition and letter-sound correspondence',
            'Survival greetings and politeness formulas',
            'Number literacy (1-10)',
            'Basic color and object vocabulary (~50 words)',
            'First exposure to verb BE (am/is/are)',
        ],
        units: [
            {
                id: 1, title: 'The English Alphabet', desc: 'Learn the 26 letters, their sounds, and how to spell your name.',
                unitType: 'grammar', grammar: ['alphabet A-Z'], vocab: ['letters', 'basic sounds'],
                teachSlides: [
                    { type: 'explain', mascotText: "Welcome! Let's start from the very beginning — the English alphabet. It has 26 letters. Don't worry, we'll go slow!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "English has 5 vowels (A, E, I, O, U) and 21 consonants:", mascotEmotion: 'happy',
                      left: { label: 'Vowels', items: ['A /eɪ/', 'E /iː/', 'I /aɪ/', 'O /oʊ/', 'U /juː/'] },
                      right: { label: 'Consonants', items: ['B, C, D, F, G...', 'H, J, K, L, M...', 'N, P, Q, R, S...', 'T, V, W, X, Y, Z'] }
                    },
                    { type: 'tip', mascotText: "To spell your name, say each letter: A-L-E-X. Practice spelling your own name!", mascotEmotion: 'happy', tipText: "A-L-E-X · M-A-R-I-A · Practice letter by letter!" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'How many letters in English?', sentence: 'The English alphabet has ___ letters.', options: ['24', '26', '33'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Which is a vowel?', sentence: 'Which is a vowel?', options: ['B', 'A', 'D'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match letter to sound', pairs: [{ left: 'A', right: '/eɪ/' }, { left: 'E', right: '/iː/' }, { left: 'I', right: '/aɪ/' }, { left: 'O', right: '/oʊ/' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Say the alphabet:', phrase: 'A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Hello', hint: 'A simple greeting' } }
                ]
            },
            {
                id: 2, title: 'Hello & Goodbye', desc: 'Basic greetings. Hi, hello, goodbye, please, thank you, sorry.',
                unitType: 'situational', grammar: [], vocab: ['hello', 'hi', 'goodbye', 'bye', 'please', 'thank you', 'sorry', 'yes', 'no'],
                teachSlides: [
                    { type: 'explain', mascotText: "The first words you need! Hello = Hi. Goodbye = Bye. These are the most important words in any language!", mascotEmotion: 'happy' },
                    { type: 'vocab-intro', mascotText: "Learn these 10 magic words:", mascotEmotion: 'happy',
                      words: [{ en: 'Hello / Hi', ru: 'Привет' }, { en: 'Goodbye / Bye', ru: 'Пока' }, { en: 'Please', ru: 'Пожалуйста' }, { en: 'Thank you / Thanks', ru: 'Спасибо' }, { en: 'Sorry', ru: 'Извините' }, { en: 'Yes', ru: 'Да' }, { en: 'No', ru: 'Нет' }] },
                    { type: 'tip', mascotText: "'Thank you' is formal. 'Thanks' is casual. Both are polite!", mascotEmotion: 'happy', tipText: "Thank you = formal · Thanks = casual · Both = polite!" }
                ],
                exercises: [
                    { type: 'match-pairs', data: { instruction: 'Match English to translation', pairs: [{ left: 'Hello', right: 'Привет' }, { left: 'Goodbye', right: 'Пока' }, { left: 'Please', right: 'Пожалуйста' }, { left: 'Thank you', right: 'Спасибо' }] } },
                    { type: 'fill-bubble', data: { instruction: 'Someone gives you a gift. You say:', sentence: 'You say: ___', options: ['Sorry', 'Thank you', 'Goodbye'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'You leave. You say:', sentence: 'You say: ___', options: ['Hello', 'Please', 'Goodbye'], correct: 2 } },
                    { type: 'speak-aloud', data: { instruction: 'Practice greetings:', phrase: 'Hello! How are you? I am fine, thank you. Goodbye!' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Thank you', hint: 'Two words' } }
                ]
            },
            {
                id: 3, title: 'Numbers 1-10', desc: 'Count from 1 to 10. Your age. Phone basics.',
                unitType: 'grammar', grammar: ['numbers 1-10'], vocab: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
                teachSlides: [
                    { type: 'explain', mascotText: "Numbers! You need them every day. Let's count: 1, 2, 3... up to 10!", mascotEmotion: 'happy' },
                    { type: 'vocab-intro', mascotText: "The first 10 numbers:", mascotEmotion: 'happy',
                      words: [{ en: '1 — one', ru: 'один' }, { en: '2 — two', ru: 'два' }, { en: '3 — three', ru: 'три' }, { en: '4 — four', ru: 'четыре' }, { en: '5 — five', ru: 'пять' }, { en: '6 — six', ru: 'шесть' }, { en: '7 — seven', ru: 'семь' }, { en: '8 — eight', ru: 'восемь' }, { en: '9 — nine', ru: 'девять' }, { en: '10 — ten', ru: 'десять' }] },
                    { type: 'tip', mascotText: "To say your age: 'I am + number.' Example: I am five. I am ten.", mascotEmotion: 'happy', tipText: "I am 5 = I am five · I am 10 = I am ten" }
                ],
                exercises: [
                    { type: 'match-pairs', data: { instruction: 'Match number to word', pairs: [{ left: '1', right: 'one' }, { left: '3', right: 'three' }, { left: '5', right: 'five' }, { left: '7', right: 'seven' }] } },
                    { type: 'fill-bubble', data: { instruction: 'What comes after 4?', sentence: '4, ___', options: ['three', 'five', 'six'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '2 + 3 = ?', sentence: 'Two + three = ___', options: ['four', 'five', 'six'], correct: 1 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type the number word', text: 'seven', hint: 'A number between 6 and 8' } },
                    { type: 'speak-aloud', data: { instruction: 'Count aloud:', phrase: 'One, two, three, four, five, six, seven, eight, nine, ten!' } }
                ]
            },
            {
                id: 4, title: 'Colors', desc: 'Red, blue, green... Learn basic colors and say what color things are.',
                unitType: 'grammar', grammar: ['It is + color'], vocab: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'pink'],
                teachSlides: [
                    { type: 'explain', mascotText: "Colors make the world beautiful! In English, the color comes BEFORE the thing: a RED car, a BLUE sky.", mascotEmotion: 'happy' },
                    { type: 'vocab-intro', mascotText: "Basic colors:", mascotEmotion: 'happy',
                      words: [{ en: 'red', ru: 'красный' }, { en: 'blue', ru: 'синий' }, { en: 'green', ru: 'зелёный' }, { en: 'yellow', ru: 'жёлтый' }, { en: 'black', ru: 'чёрный' }, { en: 'white', ru: 'белый' }, { en: 'orange', ru: 'оранжевый' }, { en: 'pink', ru: 'розовый' }] },
                    { type: 'tip', mascotText: "Color + thing: a red car, a blue pen, a green tree. Simple!", mascotEmotion: 'happy', tipText: "red car · blue sky · green tree · yellow sun" }
                ],
                exercises: [
                    { type: 'match-pairs', data: { instruction: 'Match colors', pairs: [{ left: 'red', right: 'красный' }, { left: 'blue', right: 'синий' }, { left: 'green', right: 'зелёный' }, { left: 'yellow', right: 'жёлтый' }] } },
                    { type: 'fill-bubble', data: { instruction: 'The sky is ___', sentence: 'The sky is ___', options: ['red', 'blue', 'green'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'The sun is ___', sentence: 'The sun is ___', options: ['blue', 'black', 'yellow'], correct: 2 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'red', hint: 'A color' } },
                    { type: 'speak-aloud', data: { instruction: 'Say the colors:', phrase: 'Red, blue, green, yellow, black, white, orange, pink' } }
                ]
            },
            {
                id: 5, title: 'My First Words', desc: 'Cat, dog, house, book, water, food — the most basic nouns.',
                unitType: 'grammar', grammar: ['basic nouns'], vocab: ['cat', 'dog', 'house', 'book', 'water', 'food', 'car', 'phone', 'man', 'woman'],
                teachSlides: [
                    { type: 'explain', mascotText: "Let's learn the most common English words! These are things you see every day.", mascotEmotion: 'happy' },
                    { type: 'vocab-intro', mascotText: "Your first 10 nouns:", mascotEmotion: 'happy',
                      words: [{ en: 'cat', ru: 'кот' }, { en: 'dog', ru: 'собака' }, { en: 'house', ru: 'дом' }, { en: 'book', ru: 'книга' }, { en: 'water', ru: 'вода' }, { en: 'food', ru: 'еда' }, { en: 'car', ru: 'машина' }, { en: 'phone', ru: 'телефон' }, { en: 'man', ru: 'мужчина' }, { en: 'woman', ru: 'женщина' }] },
                    { type: 'tip', mascotText: "Point at things around you and say the English word. This is the fastest way to learn!", mascotEmotion: 'happy', tipText: "Look → Say → Remember! cat, dog, book, phone..." }
                ],
                exercises: [
                    { type: 'match-pairs', data: { instruction: 'Match word to translation', pairs: [{ left: 'cat', right: 'кот' }, { left: 'dog', right: 'собака' }, { left: 'house', right: 'дом' }, { left: 'book', right: 'книга' }] } },
                    { type: 'match-pairs', data: { instruction: 'Match more words', pairs: [{ left: 'water', right: 'вода' }, { left: 'food', right: 'еда' }, { left: 'car', right: 'машина' }, { left: 'phone', right: 'телефон' }] } },
                    { type: 'fill-bubble', data: { instruction: 'A ___ says "meow"', sentence: 'A ___ says meow', options: ['dog', 'cat', 'car'], correct: 1 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'book', hint: 'You read this' } },
                    { type: 'speak-aloud', data: { instruction: 'Say these words:', phrase: 'Cat, dog, house, book, water, food, car, phone' } }
                ]
            },
            {
                id: 6, title: 'I am... You are...', desc: 'Your very first sentences. I am happy. You are good. It is big.',
                unitType: 'grammar', grammar: ['I am / You are / It is + adjective'], vocab: ['happy', 'good', 'big', 'small', 'hot', 'cold', 'new', 'old'],
                teachSlides: [
                    { type: 'explain', mascotText: "Now let's make real sentences! The formula: I AM + word. You ARE + word. It IS + word. That's it!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Your first sentences:", mascotEmotion: 'happy',
                      items: [
                        { base: 'I + happy', past: 'I am happy.', highlight: 'am' },
                        { base: 'You + good', past: 'You are good.', highlight: 'are' },
                        { base: 'It + big', past: 'It is big.', highlight: 'is' },
                        { base: 'The cat + small', past: 'The cat is small.', highlight: 'is' }
                      ]
                    },
                    { type: 'vocab-intro', mascotText: "Simple adjectives:", mascotEmotion: 'happy',
                      words: [{ en: 'happy', ru: 'счастливый' }, { en: 'good', ru: 'хороший' }, { en: 'big', ru: 'большой' }, { en: 'small', ru: 'маленький' }, { en: 'hot', ru: 'горячий' }, { en: 'cold', ru: 'холодный' }] },
                    { type: 'tip', mascotText: "Congratulations! After this lesson you move to A1! You already know letters, numbers, colors, words, and sentences!", mascotEmotion: 'happy', tipText: "You're ready for A1! 🎉" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'I ___ happy.', options: ['am', 'is', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'You ___ good.', options: ['am', 'is', 'are'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'It ___ big.', options: ['am', 'is', 'are'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['am', 'I', 'happy'], correct: ['I', 'am', 'happy'] } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'big', right: 'большой' }, { left: 'small', right: 'маленький' }, { left: 'hot', right: 'горячий' }, { left: 'cold', right: 'холодный' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Say your first sentences!', phrase: 'I am happy. You are good. The cat is small. The dog is big.' } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // A1 — BEGINNER (18 units)
    // ═══════════════════════════════════════════
    {
        id: 'a1_beginner',
        language: 'en',
        title: 'A1 — Beginner',
        level: 'A1',
        cefr: 'A1',
        methodology: 'CEFR A1 Breakthrough. Core grammar (BE, Present Simple, Past Simple, can), survival situations (café, hotel, directions), foundational pronunciation. ~800 target vocabulary.',
        canDo: [
            'Can understand and use familiar everyday expressions and very basic phrases',
            'Can introduce themselves and others and ask/answer questions about personal details',
            'Can interact in a simple way provided the other person talks slowly and clearly',
            'Can order food and drinks in a café',
            'Can ask for and give simple directions',
            'Can describe daily routines using Present Simple',
            'Can talk about past events using basic Past Simple',
            'Can express ability with can/can\'t',
        ],
        objectives: [
            'Verb BE in all forms (positive, negative, questions)',
            'Present Simple for habits and routines (I/you/we/they + he/she/it)',
            'Past Simple (regular + irregular verbs)',
            'Present Continuous for actions happening now',
            'Can/can\'t for ability and permission',
            'Articles a/an, plurals, possessives, demonstratives',
            'There is/are + prepositions of place',
            'Key pronunciation: /θ/, /ð/, /w/, /v/, minimal pairs',
            'Situational English: café, hotel, introductions, directions',
        ],
        units: [
            // ── Unit 1: Verb BE ──
            {
                id: 1,
                title: 'Verb BE: all forms',
                desc: 'am / is / are — positive, negative, questions. Greetings, numbers 0-20, countries.',
                unitType: 'grammar',
                grammar: ['verb be: am/is/are', 'positive and negative', 'yes/no questions'],
                vocab: ['greetings', 'numbers 0-20', 'countries', 'nationalities'],
                homework: { prompt: 'Write 5 sentences about yourself and your friends using am, is, are.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Welcome to your first English lesson! The most important verb is 'to be'. It has 3 forms: AM, IS, ARE. Let's learn them!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'compare',
                        mascotText: "Each subject has its own form of BE. Look at this table — it's the most important thing in A1!",
                        mascotEmotion: 'happy',
                        left: { label: 'Subject', items: ['I', 'You / We / They', 'He / She / It'] },
                        right: { label: 'Verb BE', items: ['am', 'are', 'is'] }
                    },
                    {
                        type: 'examples',
                        mascotText: "Now let's see BE in action with real sentences:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'I + student', past: "I am a student", highlight: 'am' },
                            { base: 'You + from', past: "You are from Brazil", highlight: 'are' },
                            { base: 'He + teacher', past: "He is a teacher", highlight: 'is' },
                            { base: 'They + happy', past: "They are happy", highlight: 'are' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "Quick check! 'She ___ a doctor.' Which is correct?",
                        mascotEmotion: 'thinking',
                        options: ['am', 'is', 'are'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "People almost always use short forms in speech: I'm, you're, he's, she's, it's, we're, they're. Learn them!",
                        mascotEmotion: 'happy',
                        tipText: "I'm = I am · You're = You are · He's = He is · She's = She is · We're = We are · They're = They are"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Choose the correct form', sentence: 'I ___ from London.', options: ['am', 'is', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Choose the correct form', sentence: 'They ___ students.', options: ['am', 'is', 'are'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Choose the correct form', sentence: 'He ___ a teacher.', options: ['am', 'is', 'are'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Put the words in order', words: ['is', 'she', 'from', 'Japan'], correct: ['she', 'is', 'from', 'Japan'] } },
                    { type: 'word-shuffle', data: { instruction: 'Put the words in order', words: ['are', 'we', 'happy'], correct: ['we', 'are', 'happy'] } },
                        { type: 'match-pairs', data: { instruction: 'Match subject with verb BE', pairs: [{ left: 'I', right: 'am' }, { left: 'He', right: 'is' }, { left: 'You', right: 'are (you)' }, { left: 'They', right: 'are (they)' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate to English', sourceText: 'Я студент.', fromLang: 'RU', toLang: 'EN', answer: 'I am a student' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Hello, my name is Alex.', hint: 'Start with a capital letter.' } },
                    { type: 'fill-bubble', data: { instruction: 'Negative form: She ___ a doctor.', sentence: 'She ___ a doctor. (negative)', options: ["isn't", "aren't", "am not"], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Say this aloud:', phrase: "Hi! I'm Alex. I'm from Russia. Nice to meet you!" } }
                ]
            },

            // ── Unit 2: Questions with BE ──
            {
                id: 2,
                title: 'Questions: Wh- and How',
                desc: 'What, Where, How old + be. Phone numbers, numbers to 100.',
                unitType: 'grammar',
                grammar: ['Wh- questions with be', 'How old/How are you'],
                vocab: ['phone numbers', 'numbers 11-100', 'personal information'],
                homework: { prompt: 'Write 5 questions using What, Where, How.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Now you know AM, IS, ARE. Let's learn to ASK questions! We use question words: WHAT, WHERE, HOW, WHO.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "In questions, the verb BE comes BEFORE the subject. Look:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'What + name', past: "What is your name?", highlight: 'is' },
                            { base: 'Where + from', past: "Where are you from?", highlight: 'are' },
                            { base: 'How old', past: "How old is she?", highlight: 'is' },
                            { base: 'Who + he', past: "Who is he?", highlight: 'is' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Let's learn numbers 10-100. You'll need them for phone numbers and age!",
                        mascotEmotion: 'happy',
                        words: [
                            { en: '10 — ten', ru: '10' },
                            { en: '20 — twenty', ru: '20' },
                            { en: '30 — thirty', ru: '30' },
                            { en: '50 — fifty', ru: '50' },
                            { en: '100 — one hundred', ru: '100' },
                            { en: '0 — zero / oh', ru: '0' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'___ is your phone number?' — Which question word?",
                        mascotEmotion: 'thinking',
                        options: ['Where', 'What', 'Who'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Yes/No questions are simple: just swap the order! 'You are happy' → 'Are you happy?' Easy!",
                        mascotEmotion: 'happy',
                        tipText: "Statement: You are 25. → Question: Are you 25? Just swap subject and verb!"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Choose the question word', sentence: '___ is your name?', options: ['What', 'Where', 'How'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Choose the question word', sentence: '___ are you from?', options: ['What', 'Where', 'Who'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a question', words: ['old', 'how', 'you', 'are'], correct: ['how', 'old', 'are', 'you'] } },
                    { type: 'word-shuffle', data: { instruction: 'Make a question', words: ['is', 'where', 'she', 'from'], correct: ['where', 'is', 'she', 'from'] } },
                    { type: 'fill-bubble', data: { instruction: 'Answer: How old are you?', sentence: 'I ___ 25 years old.', options: ['am', 'is', 'are'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Match questions with answers', pairs: [{ left: 'What is your name?', right: 'Alex' }, { left: 'Where are you from?', right: 'Brazil' }, { left: 'How old are you?', right: '25' }, { left: 'How are you?', right: 'Fine, thanks' }] } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'What is your phone number?', hint: 'Question mark at the end.' } },
                    { type: 'type-translation', data: { instruction: 'Translate to English', sourceText: 'Откуда ты?', fromLang: 'RU', toLang: 'EN', answer: 'Where are you from?' } },
                    { type: 'speak-aloud', data: { instruction: 'Ask these questions aloud:', phrase: "What's your name? Where are you from? How old are you?" } },
                    { type: 'fill-bubble', data: { instruction: '"___ is he?" — "He is my brother."', sentence: '___ is he?', options: ['What', 'Where', 'Who'], correct: 2 } }
                ]
            },

            // ── Unit 3: At a café ──
            {
                id: 3,
                title: '🗣️ At a café: first order',
                desc: 'Order food and drinks. Polite phrases. Prices.',
                unitType: 'situational',
                grammar: ['Can I have...?', 'How much is...?'],
                vocab: ['coffee', 'tea', 'water', 'sandwich', 'cake', 'please', 'thank you', 'prices'],
                homework: { prompt: 'Write a dialogue: ordering coffee and cake at a café.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Time for a real situation! Imagine you're at a café in London. Let's learn how to order food and drinks!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "Here are the key phrases you need at a café:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'Order', past: "Can I have a coffee, please?", highlight: 'Can I have' },
                            { base: 'Price', past: "How much is it?", highlight: 'How much' },
                            { base: 'Thanks', past: "Thank you! / Thanks!", highlight: 'Thank you' },
                            { base: 'Size', past: "A large coffee, please.", highlight: 'large' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Let's learn café vocabulary!",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'coffee', ru: 'кофе' },
                            { en: 'tea', ru: 'чай' },
                            { en: 'water', ru: 'вода' },
                            { en: 'sandwich', ru: 'сэндвич' },
                            { en: 'cake', ru: 'торт/пирожное' },
                            { en: 'the bill', ru: 'счёт' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "You want to order a tea. What do you say?",
                        mascotEmotion: 'thinking',
                        options: ['I want tea.', 'Give me tea.', 'Can I have a tea, please?'],
                        correct: 2
                    },
                    {
                        type: 'tip',
                        mascotText: "'Can I have...' is the magic phrase for ordering ANYTHING in English. It works in cafés, restaurants, shops — everywhere!",
                        mascotEmotion: 'happy',
                        tipText: "Can I have a coffee? · Can I have the bill? · Can I have a table for two?"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Complete the order', sentence: 'Can I ___ a coffee, please?', options: ['have', 'get', 'want'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Make an order', words: ['have', 'can', 'I', 'a', 'tea', 'please'], correct: ['can', 'I', 'have', 'a', 'tea', 'please'] } },
                    { type: 'fill-bubble', data: { instruction: 'Ask for the price', sentence: 'How ___ is it?', options: ['many', 'much', 'old'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match English with translation', pairs: [{ left: 'coffee', right: 'кофе' }, { left: 'the bill', right: 'счёт' }, { left: 'cake', right: 'торт' }, { left: 'water', right: 'вода' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate to English', sourceText: 'Можно чай, пожалуйста?', fromLang: 'RU', toLang: 'EN', answer: 'Can I have a tea, please?' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Can I have a large coffee, please?', hint: 'Polite request' } },
                    { type: 'fill-bubble', data: { instruction: 'Waiter says: "Anything else?" You say:', sentence: 'You answer...', options: ['No, thank you.', 'No want.', 'Is finished.'], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Role-play: Order at a café', phrase: "Hi! Can I have a coffee and a sandwich, please? How much is it? Thank you!" } }
                ]
            },

            // ── Unit 4: Nouns, a/an, this/that ──
            {
                id: 4,
                title: 'Nouns: singular, plural, a/an',
                desc: 'Singular/plural nouns. Articles a/an. this/that/these/those.',
                unitType: 'grammar',
                grammar: ['plural -s/-es', 'a / an', 'this/that/these/those'],
                vocab: ['everyday objects', 'classroom items', 'souvenirs'],
                homework: { prompt: 'Write 10 sentences using a/an and plurals.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Let's learn about NOUNS — words for things! In English, one thing needs 'a' or 'an' before it. More than one? Add '-s'!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "Use 'a' before consonant sounds, 'an' before vowel sounds (a, e, i, o, u):",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'book', past: "a book → books", highlight: 'a' },
                            { base: 'apple', past: "an apple → apples", highlight: 'an' },
                            { base: 'university', past: "a university", highlight: 'a (sound: /juː/)' },
                            { base: 'hour', past: "an hour", highlight: "an (silent h)" }
                        ]
                    },
                    {
                        type: 'compare',
                        mascotText: "This/that = singular (one). These/those = plural (many). This/these = near. That/those = far.",
                        mascotEmotion: 'happy',
                        left: { label: 'Near ☝️', items: ['this book', 'these books'] },
                        right: { label: 'Far 👉', items: ['that book', 'those books'] }
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'___ is ___ umbrella.' — Choose correctly!",
                        mascotEmotion: 'thinking',
                        options: ['It is a umbrella', 'It is an umbrella', 'It is the umbrella'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Irregular plurals exist! man→men, woman→women, child→children, person→people. Memorize these 4!",
                        mascotEmotion: 'happy',
                        tipText: "man→men · woman→women · child→children · person→people · tooth→teeth · foot→feet"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'a or an?', sentence: 'It is ___ apple.', options: ['a', 'an', 'the'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'a or an?', sentence: 'She is ___ doctor.', options: ['a', 'an', '-'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Choose the plural', sentence: 'one child → two ___', options: ['childs', 'children', 'childes'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Near or far?', sentence: '___ books here are mine. (near)', options: ['This', 'These', 'Those'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match singular → plural', pairs: [{ left: 'man', right: 'men' }, { left: 'woman', right: 'women' }, { left: 'tooth', right: 'teeth' }, { left: 'child', right: 'children' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['are', 'those', 'my', 'books'], correct: ['those', 'are', 'my', 'books'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Это яблоко.', fromLang: 'RU', toLang: 'EN', answer: 'This is an apple' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'These are my keys.', hint: 'Plural' } },
                    { type: 'fill-bubble', data: { instruction: 'a or an?', sentence: '___ hour ago', options: ['a', 'an'], correct: 1 } },
                    { type: 'speak-aloud', data: { instruction: 'Say aloud:', phrase: "This is a book. That is an apple. These are my keys. Those are your bags." } }
                ]
            },

            // ── Unit 5: Possessives + Adjectives ──
            {
                id: 5,
                title: 'My, your, his: possessives + adjectives',
                desc: "Possessive adjectives (my/your/his/her). Possessive 's. Basic adjectives.",
                unitType: 'grammar',
                grammar: ['possessive adjectives', "possessive 's", 'adjective + noun'],
                vocab: ['family members', 'colors', 'common adjectives'],
                homework: { prompt: 'Describe your family: names, ages, and one adjective for each person.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Whose is it? In English, we use possessive words: MY, YOUR, HIS, HER, OUR, THEIR. Let's learn them all!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'compare',
                        mascotText: "Each subject pronoun has a possessive form:",
                        mascotEmotion: 'happy',
                        left: { label: 'Pronoun', items: ['I', 'You', 'He', 'She', 'We', 'They'] },
                        right: { label: 'Possessive', items: ['my', 'your', 'his', 'her', 'our', 'their'] }
                    },
                    {
                        type: 'examples',
                        mascotText: "We also use 's to show possession. John's car = the car of John:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'John + car', past: "John's car", highlight: "'s" },
                            { base: 'My sister + name', past: "My sister's name is Anna", highlight: "'s" },
                            { base: 'The dog + toy', past: "The dog's toy", highlight: "'s" }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Family vocabulary! You'll need this to talk about the people you love:",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'mother / mom', ru: 'мать / мама' },
                            { en: 'father / dad', ru: 'отец / папа' },
                            { en: 'brother', ru: 'брат' },
                            { en: 'sister', ru: 'сестра' },
                            { en: 'husband', ru: 'муж' },
                            { en: 'wife', ru: 'жена' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'___ name is Maria.' — She is a girl. Which word?",
                        mascotEmotion: 'thinking',
                        options: ['His', 'Her', 'Your'],
                        correct: 1
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Choose the possessive', sentence: 'I love ___ family.', options: ['my', 'me', 'I'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'He is a boy. ___ name is Tom.', sentence: '___ name is Tom.', options: ['Her', 'His', 'He'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: "Possessive 's", sentence: "This is ___.", options: ["Anna book", "Anna's book", "Annas book"], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match pronoun → possessive', pairs: [{ left: 'I', right: 'my' }, { left: 'she', right: 'her' }, { left: 'we', right: 'our' }, { left: 'they', right: 'their' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['is', 'her', 'name', 'Maria'], correct: ['her', 'name', 'is', 'Maria'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Это машина Джона.', fromLang: 'RU', toLang: 'EN', answer: "This is John's car" } },
                    { type: 'fill-bubble', data: { instruction: 'Adjective: the car is ___', sentence: 'It is a ___ car.', options: ['red big', 'big red', 'red a big'], correct: 1 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "My brother's name is Tom.", hint: "Don't forget the apostrophe" } },
                    { type: 'speak-aloud', data: { instruction: 'Tell about your family:', phrase: "My name is... My mother's name is... My father is..." } }
                ]
            },

            // ── Unit 6: Checkpoint 1 ──
            {
                id: 6,
                title: '🔄 Checkpoint 1: Units 1-5',
                desc: 'Review all grammar and vocabulary from units 1-5.',
                unitType: 'review',
                grammar: ['verb be', 'questions', 'a/an', 'possessives'],
                vocab: ['all A1 vocabulary so far'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'verb BE', sentence: 'She ___ from Italy.', options: ['am', 'is', 'are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question word', sentence: '___ old are you?', options: ['What', 'How', 'Where'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Article', sentence: 'It is ___ orange.', options: ['a', 'an'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Possessive', sentence: '___ is your name?', options: ['What', 'Who', 'How'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Plural', sentence: 'one woman → two ___', options: ['womans', 'women', 'womens'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a question', words: ['is', 'what', 'name', 'your'], correct: ['what', 'is', 'your', 'name'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Откуда она?', fromLang: 'RU', toLang: 'EN', answer: 'Where is she from?' } },
                    { type: 'match-pairs', data: { instruction: 'Final review match', pairs: [{ left: 'I', right: 'am' }, { left: 'She', right: 'is' }, { left: 'They', right: 'are' }, { left: 'my', right: 'I' }] } },
                    { type: 'fill-bubble', data: { instruction: 'Order at café', sentence: 'Can I ___ a coffee?', options: ['have', 'has', 'having'], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Introduce yourself fully:', phrase: "My name is Alex. I'm 25. I'm from Moscow. I'm a student." } }
                ]
            },

            // ── Unit 7: Present Simple +/- ──
            {
                id: 7,
                title: 'Present Simple: I / you / we / they',
                desc: 'Present Simple positive, negative, questions. Daily habits.',
                unitType: 'grammar',
                grammar: ['Present Simple +/-/?', "don't / do you...?"],
                vocab: ['food and drink', 'daily habits', 'common verbs'],
                homework: { prompt: 'Write about your typical day: what you eat, drink, do.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "BE describes what you ARE. Now let's learn what you DO! Present Simple = habits, routines, facts. I eat, I drink, I live.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "Positive: just use the verb. Negative: add DON'T. Question: start with DO.",
                        mascotEmotion: 'happy',
                        items: [
                            { base: '+', past: "I eat breakfast every day.", highlight: 'eat' },
                            { base: '−', past: "I don't drink coffee.", highlight: "don't" },
                            { base: '?', past: "Do you speak English?", highlight: 'Do' },
                            { base: 'Answer', past: "Yes, I do. / No, I don't.", highlight: 'do' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Key daily verbs — you'll use these every single day:",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'eat', ru: 'есть' },
                            { en: 'drink', ru: 'пить' },
                            { en: 'live', ru: 'жить' },
                            { en: 'work', ru: 'работать' },
                            { en: 'speak', ru: 'говорить' },
                            { en: 'like', ru: 'нравиться' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'I ___ like coffee.' — How do we say the negative?",
                        mascotEmotion: 'thinking',
                        options: ["not like", "don't like", "doesn't like"],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Present Simple is NOT for right now! 'I eat' = I eat regularly. For right now, we'll learn Present Continuous later!",
                        mascotEmotion: 'happy',
                        tipText: "I eat breakfast = everyday habit. I'm eating breakfast = right now (Present Continuous — later!)"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Positive', sentence: 'I ___ in Moscow.', options: ['live', 'lives', 'living'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "I ___ like fish.", options: ["don't", "doesn't", "not"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ you speak English?', options: ['Do', 'Does', 'Are'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['breakfast', 'I', 'eat', 'every', 'day'], correct: ['I', 'eat', 'breakfast', 'every', 'day'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я не пью кофе.', fromLang: 'RU', toLang: 'EN', answer: "I don't drink coffee" } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'eat', right: 'есть' }, { left: 'drink', right: 'пить' }, { left: 'live', right: 'жить' }, { left: 'work', right: 'работать' }] } },
                    { type: 'fill-bubble', data: { instruction: 'Answer the question: Do you like pizza?', sentence: 'Yes, I ___.', options: ['like', 'do', 'am'], correct: 1 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I don't eat meat. I'm vegetarian.", hint: "Contraction: don't" } },
                    { type: 'word-shuffle', data: { instruction: 'Make a question', words: ['like', 'do', 'you', 'pizza'], correct: ['do', 'you', 'like', 'pizza'] } },
                    { type: 'speak-aloud', data: { instruction: 'Talk about your habits:', phrase: "I eat breakfast at 8. I drink tea. I don't drink coffee. I work from home." } }
                ]
            },

            // ── Unit 8: Present Simple he/she/it ──
            {
                id: 8,
                title: 'Present Simple: he / she / it + frequency',
                desc: '3rd person -s. Adverbs of frequency. Daily routines.',
                unitType: 'grammar',
                grammar: ['3rd person -s/-es', "doesn't / does he...?", 'adverbs of frequency'],
                vocab: ['jobs', 'daily routine', 'always/usually/sometimes/never'],
                homework: { prompt: 'Write about a friend: what they do every day.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Important rule! When the subject is HE, SHE, or IT — add -S to the verb! I eat → He eatS. I live → She liveS.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "For negative and questions with he/she/it, we use DOES (not DO). And the verb goes BACK to normal!",
                        mascotEmotion: 'happy',
                        items: [
                            { base: '+', past: "She works in a bank.", highlight: 'works' },
                            { base: '−', past: "He doesn't like fish.", highlight: "doesn't" },
                            { base: '?', past: "Does she speak French?", highlight: 'Does' },
                            { base: '-es', past: "He watches TV.", highlight: 'watches' }
                        ]
                    },
                    {
                        type: 'compare',
                        mascotText: "How OFTEN? Put these words before the main verb:",
                        mascotEmotion: 'happy',
                        left: { label: 'Frequency', items: ['always', 'usually', 'sometimes', 'never'] },
                        right: { label: 'Meaning', items: ['100%', '~80%', '~50%', '0%'] }
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'She ___ to work by bus.' — Which is correct?",
                        mascotEmotion: 'thinking',
                        options: ['go', 'goes', 'going'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Spelling: most verbs add -s (works, eats). Verbs ending in -ch, -sh, -ss, -x, -o add -ES (watches, goes). Consonant+y → -IES (study → studies).",
                        mascotEmotion: 'happy',
                        tipText: "work→works · watch→watches · go→goes · study→studies · have→has (irregular!)"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '3rd person', sentence: 'She ___ in a hospital.', options: ['work', 'works', 'working'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "He ___ like mornings.", options: ["don't", "doesn't", "not"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ she speak French?', options: ['Do', 'Does', 'Is'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Spelling', sentence: 'He ___ TV every evening.', options: ['watchs', 'watches', 'watch'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Frequency', sentence: 'I ___ eat breakfast. (100%)', options: ['always', 'sometimes', 'never'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['usually', 'she', 'at', 'gets up', '7'], correct: ['she', 'usually', 'gets up', 'at', '7'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он работает в банке.', fromLang: 'RU', toLang: 'EN', answer: 'He works in a bank' } },
                    { type: 'match-pairs', data: { instruction: 'Match verb forms', pairs: [{ left: 'go', right: 'goes' }, { left: 'watch', right: 'watches' }, { left: 'study', right: 'studies' }, { left: 'have', right: 'has' }] } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She always gets up early.", hint: 'Frequency word position' } },
                    { type: 'speak-aloud', data: { instruction: 'Describe someone:', phrase: "My friend works in a bank. She usually gets up at 7. She always drinks coffee." } }
                ]
            },

            // ── Unit 9: 🗣️ Talking about yourself ──
            {
                id: 9,
                title: '🗣️ About me: introduction speech',
                desc: 'Combine BE + Present Simple in a connected self-introduction.',
                unitType: 'situational',
                grammar: ['be + Present Simple combined'],
                vocab: ['hobbies', 'free time', 'work', 'introduction phrases'],
                homework: { prompt: 'Record yourself: 1-minute introduction in English.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Now you know BE and Present Simple. Let's combine them to tell people about yourself — like a real introduction!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "A good introduction has 4 parts: name, origin, job/study, hobby:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: '1. Name', past: "Hi! My name is Alex.", highlight: 'BE' },
                            { base: '2. Origin', past: "I'm from Moscow, Russia.", highlight: 'BE' },
                            { base: '3. Job', past: "I work as a designer.", highlight: 'PS' },
                            { base: '4. Hobby', past: "I like music and travel.", highlight: 'PS' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Hobby vocabulary — what do you do in your free time?",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'read books', ru: 'читать книги' },
                            { en: 'play sports', ru: 'заниматься спортом' },
                            { en: 'listen to music', ru: 'слушать музыку' },
                            { en: 'travel', ru: 'путешествовать' },
                            { en: 'cook', ru: 'готовить' },
                            { en: 'watch films', ru: 'смотреть фильмы' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "Which sentence uses Present Simple (not BE)?",
                        mascotEmotion: 'thinking',
                        options: ["I am 25 years old.", "I like cooking.", "She is from Italy."],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "When talking about hobbies, use: 'I like + -ing' (I like cooking) or 'I like + noun' (I like music). Both are correct!",
                        mascotEmotion: 'happy',
                        tipText: "I like reading · I like to read · I enjoy cooking · I love music — all correct!"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'BE or Present Simple?', sentence: 'I ___ from Brazil.', options: ['am', 'live', 'come'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'BE or Present Simple?', sentence: 'I ___ as a teacher.', options: ['am', 'work', 'be'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Build an introduction', words: ['name', 'my', 'is', 'and', 'Alex', 'I', 'from', 'am', 'Russia'], correct: ['my', 'name', 'is', 'Alex', 'and', 'I', 'am', 'from', 'Russia'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мне нравится готовить.', fromLang: 'RU', toLang: 'EN', answer: 'I like cooking' } },
                    { type: 'match-pairs', data: { instruction: 'Match hobbies', pairs: [{ left: 'read', right: 'читать' }, { left: 'cook', right: 'готовить' }, { left: 'travel', right: 'путешествовать' }, { left: 'play sports', right: 'спорт' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Full introduction — say aloud!', phrase: "Hi! My name is Alex. I'm 25 years old. I'm from Moscow. I work as a designer. I like music, travel, and cooking." } }
                ]
            },

            // ── Unit 10: 🎤 Pronunciation ──
            {
                id: 10,
                title: '🎤 Pronunciation: key English sounds',
                desc: 'Sounds that are tricky: /θ/, /ð/, /w/, /v/, /h/. Minimal pairs.',
                unitType: 'pronunciation',
                grammar: [],
                vocab: ['minimal pairs: think-sink, three-free, wine-vine'],
                homework: { prompt: 'Practice saying: think, this, that, the, three, weather, with, worth.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Let's work on sounds! English has some sounds that don't exist in many languages. The famous TH sound, /w/ vs /v/, and the silent /h/!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'compare',
                        mascotText: "TH has TWO sounds: /θ/ (voiceless — like in 'think') and /ð/ (voiced — like in 'this'):",
                        mascotEmotion: 'thinking',
                        left: { label: '/θ/ voiceless', items: ['think', 'three', 'thanks', 'birthday'] },
                        right: { label: '/ð/ voiced', items: ['this', 'that', 'the', 'weather'] }
                    },
                    {
                        type: 'examples',
                        mascotText: "/w/ and /v/ are DIFFERENT sounds. Listen carefully:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: '/w/', past: "wine, west, want, woman", highlight: 'w' },
                            { base: '/v/', past: "vine, vest, van, very", highlight: 'v' },
                            { base: '/h/', past: "hello, have, house, happy", highlight: 'h' },
                            { base: 'silent h', past: "hour, honest, heir", highlight: '(no sound)' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "Which word has a /θ/ sound (like in 'think')?",
                        mascotEmotion: 'thinking',
                        options: ['the', 'three', 'this'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "For TH: put your tongue between your teeth and blow air. It feels weird, but that's the correct position! Practice in front of a mirror.",
                        mascotEmotion: 'happy',
                        tipText: "👅 Tongue between teeth: think, three, thank you. Practice daily for 2 minutes!"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '/θ/ or /ð/?', sentence: '"Think" has the sound:', options: ['/θ/ voiceless', '/ð/ voiced'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '/θ/ or /ð/?', sentence: '"This" has the sound:', options: ['/θ/ voiceless', '/ð/ voiced'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Which has a silent H?', sentence: 'Silent H:', options: ['hello', 'hour', 'happy'], correct: 1 } },
                    { type: 'speak-aloud', data: { instruction: 'Practice TH sounds:', phrase: "Think. Three. Thanks. This. That. The. Weather." } },
                    { type: 'speak-aloud', data: { instruction: 'Practice W vs V:', phrase: "Wine — Vine. West — Vest. Want — Van. Wow — Vow." } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I think the weather is nice.", hint: 'Two different TH sounds!' } }
                ]
            },

            // ── Unit 11: Can / Can't + Imperatives ──
            {
                id: 11,
                title: "Can / Can't + imperatives",
                desc: 'Abilities, permissions. Imperative mood. Object pronouns.',
                unitType: 'grammar',
                grammar: ['can/can\'t', 'imperatives', 'object pronouns: me/him/her/us/them'],
                vocab: ['abilities', 'requests', 'films', 'directions'],
                homework: { prompt: 'Write 5 things you can do and 5 you can\'t.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "CAN = ability (I can swim) or permission (Can I go?). CAN'T = cannot. Super useful verb! And it NEVER changes — no -s, no -ing!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "CAN is special: same form for everyone, and the next verb stays in base form:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'Ability', past: "I can swim.", highlight: 'can' },
                            { base: 'Negative', past: "She can't drive.", highlight: "can't" },
                            { base: 'Question', past: "Can you help me?", highlight: 'Can' },
                            { base: 'Permission', past: "Can I sit here?", highlight: 'Can I' }
                        ]
                    },
                    {
                        type: 'compare',
                        mascotText: "Imperatives = commands/instructions. No subject needed! Just the verb:",
                        mascotEmotion: 'happy',
                        left: { label: 'Do ✅', items: ['Open the door.', 'Listen!', 'Come here.'] },
                        right: { label: "Don't ❌", items: ["Don't touch!", "Don't worry.", "Don't be late."] }
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'She ___ speak 3 languages.' — Can or can't?",
                        mascotEmotion: 'thinking',
                        options: ['cans', 'can', 'is can'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Object pronouns: I→me, you→you, he→him, she→her, we→us, they→them. 'Call ME', 'Give HIM the book', 'Tell THEM'.",
                        mascotEmotion: 'happy',
                        tipText: "I→me · you→you · he→him · she→her · it→it · we→us · they→them"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Ability', sentence: 'I ___ play the guitar.', options: ['can', 'cans', 'am can'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "He ___ cook at all.", options: ["can't", "don't can", "not can"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Object pronoun', sentence: 'Call ___ tomorrow. (I)', options: ['I', 'me', 'my'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['speak', 'can', 'you', 'English'], correct: ['can', 'you', 'speak', 'English'] } },
                    { type: 'fill-bubble', data: { instruction: 'Imperative', sentence: '___ late! (negative)', options: ["Don't be", 'Not be', "No be"], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Pronoun → Object', pairs: [{ left: 'I', right: 'me' }, { left: 'he', right: 'him' }, { left: 'she', right: 'her' }, { left: 'they', right: 'them' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я умею плавать.', fromLang: 'RU', toLang: 'EN', answer: 'I can swim' } },
                    { type: 'speak-aloud', data: { instruction: 'Say aloud:', phrase: "I can swim, but I can't drive. Can you help me, please?" } }
                ]
            },

            // ── Unit 12: Like + -ing ──
            {
                id: 12,
                title: 'Like / Love / Hate + -ing',
                desc: 'Express preferences. Gerund after like/love/hate/enjoy.',
                unitType: 'grammar',
                grammar: ['like/love/hate/enjoy + -ing'],
                vocab: ['hobbies', 'free time activities', 'sports'],
                homework: { prompt: 'Write about 3 things you like, love, and hate doing.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "What do you LIKE doing? After like, love, hate, enjoy — we add a verb with -ING! I like swimming. She loves reading.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "The formula is: LIKE/LOVE/HATE + verb-ING:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'like', past: "I like cooking.", highlight: 'cooking' },
                            { base: 'love', past: "She loves dancing.", highlight: 'dancing' },
                            { base: 'hate', past: "He hates waking up early.", highlight: 'waking' },
                            { base: 'enjoy', past: "We enjoy travelling.", highlight: 'travelling' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'I enjoy ___' — which form?",
                        mascotEmotion: 'thinking',
                        options: ['swim', 'swimming', 'to swim'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "like + -ing = 'I like cooking' (general). like + to-infinitive = 'I like to cook on weekends' (specific). Both OK, but -ing is more common!",
                        mascotEmotion: 'happy',
                        tipText: "like cooking = general preference · like to cook = specific choice. Both are grammatically correct!"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'I like ___.', options: ['swim', 'swimming', 'swims'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'She enjoys ___ books.', options: ['read', 'reading', 'reads'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Complete', sentence: 'They hate ___ up early.', options: ['wake', 'waking', 'wakes'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['cooking', 'I', 'love', 'Italian', 'food'], correct: ['I', 'love', 'cooking', 'Italian', 'food'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я люблю путешествовать.', fromLang: 'RU', toLang: 'EN', answer: 'I love travelling' } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'like', right: 'нравится' }, { left: 'love', right: 'обожать' }, { left: 'hate', right: 'ненавидеть' }, { left: 'enjoy', right: 'наслаждаться' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Tell about your preferences:', phrase: "I like reading books. I love cooking. I hate waking up early. I enjoy travelling." } }
                ]
            },

            // ── Unit 13: Checkpoint 2 ──
            {
                id: 13,
                title: '🔄 Checkpoint 2: Units 7-12',
                desc: 'Review Present Simple, can, like + -ing, pronunciation.',
                unitType: 'review',
                grammar: ['Present Simple', 'can/can\'t', 'like + -ing'],
                vocab: ['daily routine', 'hobbies', 'abilities'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Present Simple', sentence: 'She ___ in a hospital.', options: ['work', 'works', 'working'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative PS', sentence: "He ___ like fish.", options: ["don't", "doesn't", "not"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Can', sentence: '___ you swim?', options: ['Do', 'Can', 'Are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Like + -ing', sentence: 'I enjoy ___.', options: ['cook', 'cooking', 'cooks'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Frequency', sentence: 'She ___ wakes up late. (0%)', options: ['always', 'sometimes', 'never'], correct: 2 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['love', 'I', 'travelling', 'but', "can't", 'I', 'drive'], correct: ['I', 'love', 'travelling', 'but', 'I', "can't", 'drive'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Она не говорит по-французски.', fromLang: 'RU', toLang: 'EN', answer: "She doesn't speak French" } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ты умеешь готовить?', fromLang: 'RU', toLang: 'EN', answer: 'Can you cook?' } },
                    { type: 'speak-aloud', data: { instruction: 'Full monologue:', phrase: "I work as a designer. I usually get up at 8. I can speak two languages. I love cooking and travelling." } }
                ]
            },

            // ── Unit 14: Present Continuous ──
            {
                id: 14,
                title: 'Present Continuous: now!',
                desc: 'Actions happening right now. Present Continuous vs Simple.',
                unitType: 'grammar',
                grammar: ['Present Continuous: am/is/are + -ing', 'vs Present Simple'],
                vocab: ['clothes', 'actions', 'travelling'],
                homework: { prompt: 'Write what 5 people around you are doing RIGHT NOW.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Present Simple = habits (I eat breakfast every day). Present Continuous = RIGHT NOW (I'm eating breakfast now). Big difference!",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "Formula: AM/IS/ARE + verb-ING. Easy!",
                        mascotEmotion: 'happy',
                        items: [
                            { base: '+', past: "I am eating lunch now.", highlight: 'am eating' },
                            { base: '−', past: "She isn't working today.", highlight: "isn't working" },
                            { base: '?', past: "Are you listening?", highlight: 'Are...listening' },
                            { base: 'vs PS', past: "I work (habit) vs I'm working (now)", highlight: 'difference' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "Right now, it's 8 PM. 'She ___ TV.' — Which tense?",
                        mascotEmotion: 'thinking',
                        options: ['watches', 'is watching', 'watch'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Signal words! NOW, RIGHT NOW, AT THE MOMENT = Present Continuous. EVERY DAY, USUALLY, ALWAYS = Present Simple.",
                        mascotEmotion: 'happy',
                        tipText: "now/right now/at the moment → Continuous · every day/usually/always → Simple"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Now', sentence: 'I ___ reading a book now.', options: ['am', 'do', 'is'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Now', sentence: 'She ___ sleeping.', options: ['is', 'does', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PS or PC?', sentence: 'I ___ coffee every morning. (habit)', options: ['drink', 'am drinking', 'drinks'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PS or PC?', sentence: 'Look! It ___! (now)', options: ['rains', 'is raining', 'rain'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['is', 'she', 'cooking', 'dinner', 'now'], correct: ['she', 'is', 'cooking', 'dinner', 'now'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Что ты делаешь сейчас?', fromLang: 'RU', toLang: 'EN', answer: 'What are you doing now?' } },
                    { type: 'fill-bubble', data: { instruction: 'Negative PC', sentence: "They ___ working today.", options: ["aren't", "don't", "doesn't"], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Describe what is happening:', phrase: "I'm sitting at home. I'm studying English. It's raining outside." } }
                ]
            },

            // ── Unit 15: There is / There are ──
            {
                id: 15,
                title: 'There is / There are + prepositions',
                desc: 'Describe places. Prepositions of place. some/any.',
                unitType: 'grammar',
                grammar: ['there is/are', 'some/any', 'prepositions: in/on/under/next to'],
                vocab: ['furniture', 'rooms', 'hotel vocabulary'],
                homework: { prompt: 'Describe your room: what is in it and where things are.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "To describe WHAT EXISTS in a place, use: THERE IS (singular) / THERE ARE (plural). There is a table. There are two chairs.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "With some/any: SOME in positive, ANY in negatives and questions:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'Singular', past: "There is a lamp on the desk.", highlight: 'There is' },
                            { base: 'Plural', past: "There are some books.", highlight: 'There are' },
                            { base: 'Negative', past: "There aren't any windows.", highlight: "any" },
                            { base: 'Question', past: "Is there a TV?", highlight: 'Is there' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Prepositions of place — WHERE is something?",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'in', ru: 'в' },
                            { en: 'on', ru: 'на' },
                            { en: 'under', ru: 'под' },
                            { en: 'next to', ru: 'рядом с' },
                            { en: 'between', ru: 'между' },
                            { en: 'behind', ru: 'за/позади' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'There ___ three cats in the garden.'",
                        mascotEmotion: 'thinking',
                        options: ['is', 'are', 'be'],
                        correct: 1
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'is or are?', sentence: 'There ___ a book on the table.', options: ['is', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'is or are?', sentence: 'There ___ five people in the room.', options: ['is', 'are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'some or any?', sentence: 'There aren\'t ___ shops here.', options: ['some', 'any'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Preposition', sentence: 'The cat is ___ the table.', options: ['on', 'in', 'at'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['is', 'a', 'there', 'park', 'near', 'here'], correct: ['there', 'is', 'a', 'park', 'near', 'here'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'На столе есть книга.', fromLang: 'RU', toLang: 'EN', answer: 'There is a book on the table' } },
                    { type: 'speak-aloud', data: { instruction: 'Describe your room:', phrase: "There is a bed and a desk. There are two windows. There is a lamp on the desk." } }
                ]
            },

            // ── Unit 16: 🗣️ At a hotel ──
            {
                id: 16,
                title: "🗣️ At a hotel / asking directions",
                desc: 'Check into a hotel. Ask and give directions.',
                unitType: 'situational',
                grammar: ['Is there...?', 'Turn left/right, go straight'],
                vocab: ['hotel rooms', 'directions', 'places in a city'],
                homework: { prompt: 'Write a dialogue: checking into a hotel and asking for directions to a restaurant.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "You're travelling! Let's learn how to check into a hotel and find your way around the city.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "At the hotel reception:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'Check in', past: "I have a reservation. My name is...", highlight: 'reservation' },
                            { base: 'Ask', past: "Is there a restaurant nearby?", highlight: 'Is there' },
                            { base: 'WiFi', past: "What's the WiFi password?", highlight: 'WiFi' },
                            { base: 'Help', past: "Can you help me, please?", highlight: 'Can you' }
                        ]
                    },
                    {
                        type: 'vocab-intro',
                        mascotText: "Direction vocabulary:",
                        mascotEmotion: 'happy',
                        words: [
                            { en: 'turn left', ru: 'поверните налево' },
                            { en: 'turn right', ru: 'поверните направо' },
                            { en: 'go straight', ru: 'идите прямо' },
                            { en: 'next to', ru: 'рядом с' },
                            { en: 'opposite', ru: 'напротив' },
                            { en: 'on the corner', ru: 'на углу' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "You want to find a pharmacy. What do you ask?",
                        mascotEmotion: 'thinking',
                        options: ['Where is pharmacy?', 'Is there a pharmacy near here?', 'I want pharmacy.'],
                        correct: 1
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'At the hotel', sentence: 'I have a ___ for tonight.', options: ['reservation', 'reserve', 'book'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Directions', sentence: '___ left at the traffic lights.', options: ['Turn', 'Go', 'Walk'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Ask for directions', words: ['there', 'is', 'a', 'near', 'here', 'supermarket'], correct: ['is', 'there', 'a', 'supermarket', 'near', 'here'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Есть ли ресторан рядом?', fromLang: 'RU', toLang: 'EN', answer: 'Is there a restaurant nearby?' } },
                    { type: 'match-pairs', data: { instruction: 'Match directions', pairs: [{ left: 'turn left', right: 'налево' }, { left: 'go straight', right: 'прямо' }, { left: 'opposite', right: 'напротив' }, { left: 'on the corner', right: 'на углу' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Hotel check-in:', phrase: "Hello! I have a reservation. My name is Alex. Is there a restaurant nearby? Can you tell me the WiFi password?" } }
                ]
            },

            // ── Unit 17: Past Simple: was/were + regular ──
            {
                id: 17,
                title: 'Past Simple: was/were + regular verbs',
                desc: 'Talk about the past. was/were. Regular verbs: -ed.',
                unitType: 'grammar',
                grammar: ['was/were', 'regular verbs -ed', 'past time expressions'],
                vocab: ['yesterday', 'last week', 'ago', 'regular verbs'],
                homework: { prompt: 'Write about what you did yesterday.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Now let's talk about the PAST! First: 'was' and 'were' — the past of BE. I was, you were, he/she/it was, we/they were.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'compare',
                        mascotText: "BE in present vs past:",
                        mascotEmotion: 'happy',
                        left: { label: 'Present', items: ['I am', 'You are', 'He/She is', 'They are'] },
                        right: { label: 'Past', items: ['I was', 'You were', 'He/She was', 'They were'] }
                    },
                    {
                        type: 'examples',
                        mascotText: "Regular verbs: just add -ED! Simple!",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'work', past: "I worked yesterday.", highlight: '-ed' },
                            { base: 'play', past: "She played tennis.", highlight: '-ed' },
                            { base: 'live', past: "We lived in London.", highlight: '-d' },
                            { base: 'study', past: "He studied English.", highlight: '-ied' }
                        ]
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'I ___ at home yesterday.'",
                        mascotEmotion: 'thinking',
                        options: ['am', 'was', 'were'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "Three pronunciations of -ED! /t/ after voiceless (worked, walked). /d/ after voiced (played, lived). /ɪd/ after t/d (wanted, needed).",
                        mascotEmotion: 'happy',
                        tipText: "worked /t/ · played /d/ · wanted /ɪd/ — Listen for the difference!"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'was or were?', sentence: 'I ___ tired yesterday.', options: ['was', 'were'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'was or were?', sentence: 'They ___ at school.', options: ['was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Regular past', sentence: 'She ___ tennis yesterday.', options: ['play', 'played', 'plays'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "I ___ at work yesterday.", options: ["wasn't", "weren't", "didn't"], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Past sentence', words: ['worked', 'I', 'yesterday', 'home', 'from'], correct: ['I', 'worked', 'from', 'home', 'yesterday'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Вчера я был дома.', fromLang: 'RU', toLang: 'EN', answer: 'Yesterday I was at home' } },
                    { type: 'match-pairs', data: { instruction: 'Present → Past', pairs: [{ left: 'work', right: 'worked' }, { left: 'play', right: 'played' }, { left: 'study', right: 'studied' }, { left: 'live', right: 'lived' }] } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'I worked from home last week.', hint: 'Past tense' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell about yesterday:', phrase: "Yesterday I was at home. I worked from 9 to 6. I cooked dinner. I watched TV." } }
                ]
            },

            // ── Unit 18: Past Simple: irregular + questions ──
            {
                id: 18,
                title: 'Past Simple: irregular verbs + questions',
                desc: 'Common irregular verbs. Did you...? Telling stories.',
                unitType: 'grammar',
                grammar: ['irregular verbs', 'did/didn\'t', 'Past Simple questions'],
                vocab: ['go/went', 'eat/ate', 'see/saw', 'buy/bought', 'come/came', 'make/made'],
                homework: { prompt: 'Write a story about your last weekend using at least 8 irregular verbs.' },
                teachSlides: [
                    {
                        type: 'explain',
                        mascotText: "Bad news: many common verbs are IRREGULAR — they don't follow the -ed rule. Good news: there are only about 50 important ones! go→went, eat→ate, see→saw.",
                        mascotEmotion: 'happy'
                    },
                    {
                        type: 'examples',
                        mascotText: "Top irregular verbs you MUST know:",
                        mascotEmotion: 'happy',
                        items: [
                            { base: 'go', past: "I went to the cinema.", highlight: 'went' },
                            { base: 'eat', past: "We ate pizza.", highlight: 'ate' },
                            { base: 'see', past: "She saw a movie.", highlight: 'saw' },
                            { base: 'buy', past: "He bought a car.", highlight: 'bought' }
                        ]
                    },
                    {
                        type: 'compare',
                        mascotText: "For questions and negatives, use DID. The main verb goes BACK to base form!",
                        mascotEmotion: 'happy',
                        left: { label: 'Statement', items: ['I went.', 'She ate.', 'He saw.'] },
                        right: { label: 'Question', items: ['Did you go?', 'Did she eat?', 'Did he see?'] }
                    },
                    {
                        type: 'quiz-check',
                        mascotText: "'Did you ___ the movie?' — Which form after DID?",
                        mascotEmotion: 'thinking',
                        options: ['saw', 'see', 'seen'],
                        correct: 1
                    },
                    {
                        type: 'tip',
                        mascotText: "After DID / DIDN'T the verb is always BASE form! Did you GO (not went). I didn't EAT (not ate). DID already shows it's past!",
                        mascotEmotion: 'happy',
                        tipText: "❌ Did you went? → ✅ Did you go? · ❌ I didn't ate → ✅ I didn't eat"
                    }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Irregular', sentence: 'I ___ to school yesterday.', options: ['go', 'went', 'goed'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Irregular', sentence: 'She ___ a new dress.', options: ['buyed', 'bought', 'buy'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ you go to the party?', options: ['Do', 'Did', 'Were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'After DID', sentence: "Did she ___ the film?", options: ['saw', 'see', 'seen'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "I ___ go to work yesterday.", options: ["didn't", "don't", "wasn't"], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Present → Past', pairs: [{ left: 'go', right: 'went' }, { left: 'eat', right: 'ate' }, { left: 'see', right: 'saw' }, { left: 'buy', right: 'bought' }, { left: 'come', right: 'came' }, { left: 'make', right: 'made' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Make a question', words: ['did', 'you', 'eat', 'what', 'yesterday'], correct: ['what', 'did', 'you', 'eat', 'yesterday'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я пошёл в кино вчера.', fromLang: 'RU', toLang: 'EN', answer: 'I went to the cinema yesterday' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ты видел этот фильм?', fromLang: 'RU', toLang: 'EN', answer: 'Did you see this movie?' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell about last weekend:', phrase: "Last weekend I went to a restaurant. I ate sushi. I saw my friends. We had a great time!" } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // A2 — ELEMENTARY (16 units) — FULL
    // ═══════════════════════════════════════════
    {
        id: 'a2_elementary',
        language: 'en',
        title: 'A2 — Elementary',
        level: 'A2',
        cefr: 'A2',
        methodology: 'CEFR A2 Waystage. Consolidation of A1 grammar, comparatives/superlatives, future tenses (going to, will), Present Perfect introduction. Functional English for shopping, health, travel. ~1600 cumulative vocabulary.',
        canDo: [
            'Can understand sentences and frequently used expressions related to areas of most immediate relevance',
            'Can communicate in simple and routine tasks requiring direct exchange of information',
            'Can describe in simple terms aspects of background, immediate environment, and matters of immediate need',
            'Can compare things using comparatives and superlatives',
            'Can talk about future plans and intentions',
            'Can describe past experiences using Present Perfect',
            'Can give and understand simple advice (should/shouldn\'t)',
            'Can make polite requests (would like)',
        ],
        objectives: [
            'Full review and consolidation of BE + Present Simple',
            'Possessives and object pronouns',
            'Past Simple: full mastery (regular, irregular, questions, negatives)',
            'Comparatives and superlatives (-er/more, the -est/most)',
            'Countable/uncountable nouns + much/many/some/any',
            'Future: be going to + will vs be going to',
            'Present Perfect: introduction (experience, ever/never)',
            'Should/shouldn\'t for advice',
            'Would like for polite requests',
            'Word stress and natural speech rhythm',
            'Situational: shopping, doctor, restaurant',
        ],
        units: [
            // ── A2 Unit 1 ──
            {
                id: 1, title: 'BE + Present Simple: review', desc: 'Full review of be and Present Simple.', unitType: 'grammar',
                grammar: ['be review', 'Present Simple review'], vocab: ['personal information', 'daily routine'],
                homework: { prompt: 'Write a paragraph about your daily routine using Present Simple.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Welcome to A2! Let's review everything you learned in A1. Verb BE and Present Simple — the foundation of English!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Remember the difference: BE describes WHAT you are. Present Simple describes WHAT you DO:", mascotEmotion: 'happy', left: { label: 'BE (state)', items: ['I am happy', 'She is a doctor', 'They are tired'] }, right: { label: 'Present Simple (action)', items: ['I work every day', 'She speaks English', 'They live in London'] } },
                    { type: 'examples', mascotText: "Common mistakes to avoid:", mascotEmotion: 'thinking', items: [{ base: '❌ Wrong', past: "I am work every day", highlight: 'am work' }, { base: '✅ Right', past: "I work every day", highlight: 'work' }, { base: '❌ Wrong', past: "She work in a bank", highlight: 'work' }, { base: '✅ Right', past: "She works in a bank", highlight: 'works' }] },
                    { type: 'quiz-check', mascotText: "'My brother ___ in a hospital.' Which is correct?", mascotEmotion: 'thinking', options: ['work', 'works', 'is work'], correct: 1 },
                    { type: 'tip', mascotText: "Quick rule: HE/SHE/IT = add -S! He workS, she liveS, it costS. Never forget the -S!", mascotEmotion: 'happy', tipText: "I work · You work · He workS · She workS · We work · They work" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'BE or PS?', sentence: 'She ___ a teacher.', options: ['am', 'is', 'works'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'BE or PS?', sentence: 'I ___ coffee every morning.', options: ['am', 'drink', 'drinks'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '3rd person', sentence: 'He ___ English and Spanish.', options: ['speak', 'speaks', 'speaking'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "She ___ like fish.", options: ["don't", "doesn't", "isn't"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ they students?', options: ['Do', 'Does', 'Are'], correct: 2 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['every', 'she', 'gets up', 'at', '7', 'day'], correct: ['she', 'gets up', 'at', '7', 'every', 'day'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мой брат работает в больнице.', fromLang: 'RU', toLang: 'EN', answer: 'My brother works in a hospital' } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'I am', right: "I'm" }, { left: 'She does not', right: "She doesn't" }, { left: 'They are', right: "They're" }, { left: 'He is', right: "He's" }] } },
                    { type: 'speak-aloud', data: { instruction: 'Describe your routine:', phrase: "I get up at 7. I have breakfast. I go to work. I come home at 6." } }
                ]
            },
            // ── A2 Unit 2 ──
            {
                id: 2, title: 'Possessives + object pronouns', desc: 'my/your/his + me/him/her. Possessive pronouns mine/yours.', unitType: 'grammar',
                grammar: ['possessives', 'object pronouns', 'possessive pronouns'], vocab: ['family', 'relationships'],
                homework: { prompt: 'Write about your family using possessives and object pronouns.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Let's master possessives! There are THREE types: possessive adjectives (my), object pronouns (me), and possessive pronouns (mine).", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "All three types side by side:", mascotEmotion: 'happy', left: { label: 'Adjective + Object', items: ['my / me', 'your / you', 'his / him', 'her / her', 'our / us', 'their / them'] }, right: { label: 'Possessive pronoun', items: ['mine', 'yours', 'his', 'hers', 'ours', 'theirs'] } },
                    { type: 'examples', mascotText: "See how they work in sentences:", mascotEmotion: 'happy', items: [{ base: 'Adjective', past: "This is my book.", highlight: 'my' }, { base: 'Object', past: "Give it to me.", highlight: 'me' }, { base: 'Pronoun', past: "This book is mine.", highlight: 'mine' }, { base: 'Compare', past: "Your car is red. Mine is blue.", highlight: 'Mine' }] },
                    { type: 'quiz-check', mascotText: "'Is this your bag?' — 'Yes, it's ___.'", mascotEmotion: 'thinking', options: ['my', 'me', 'mine'], correct: 2 },
                    { type: 'tip', mascotText: "Whose vs Who's! Whose = possession (Whose bag is this?). Who's = Who is (Who's coming?). Don't confuse them!", mascotEmotion: 'happy', tipText: "Whose car is this? = Чья это машина? · Who's that? = Кто это?" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Possessive adj', sentence: 'This is ___ car. (I)', options: ['my', 'me', 'mine'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Object pronoun', sentence: 'Call ___ later. (we)', options: ['we', 'us', 'our'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Possessive pronoun', sentence: "This isn't your bag. It's ___. (she)", options: ['her', 'hers', 'she'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Object pronoun', sentence: 'I told ___ the truth. (they)', options: ['they', 'their', 'them'], correct: 2 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['give', 'me', 'your', 'phone', 'number'], correct: ['give', 'me', 'your', 'phone', 'number'] } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'my', right: 'mine' }, { left: 'your', right: 'yours' }, { left: 'her', right: 'hers' }, { left: 'their', right: 'theirs' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Позвони мне завтра.', fromLang: 'RU', toLang: 'EN', answer: 'Call me tomorrow' } },
                    { type: 'fill-bubble', data: { instruction: "Whose or Who's?", sentence: '___ bag is this?', options: ['Whose', "Who's"], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Practice:', phrase: "This is my house. That car is mine. Give me the keys. Tell them I said hello." } }
                ]
            },
            // ── A2 Unit 3 ──
            {
                id: 3, title: 'Past Simple: full review', desc: 'Regular + irregular + negatives + questions.', unitType: 'grammar',
                grammar: ['Past Simple all forms'], vocab: ['holidays', 'transport', 'past events'],
                homework: { prompt: 'Write about your last holiday using Past Simple.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Let's review Past Simple — the tense for finished actions. Regular verbs add -ed. Irregular verbs change completely. Let's master both!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "The full picture of Past Simple:", mascotEmotion: 'happy', left: { label: 'Form', items: ['+ Positive', '− Negative', '? Question', 'Short answer'] }, right: { label: 'Example', items: ['I went to Paris.', "I didn't go to Paris.", 'Did you go to Paris?', 'Yes, I did. / No, I didn\'t.'] } },
                    { type: 'vocab-intro', mascotText: "Holiday vocabulary you'll use a lot:", mascotEmotion: 'happy', words: [{ en: 'flight', ru: 'рейс/перелёт' }, { en: 'hotel', ru: 'отель' }, { en: 'beach', ru: 'пляж' }, { en: 'sightseeing', ru: 'осмотр достопримечательностей' }, { en: 'souvenir', ru: 'сувенир' }, { en: 'luggage', ru: 'багаж' }] },
                    { type: 'quiz-check', mascotText: "'We ___ a great time on holiday.'", mascotEmotion: 'thinking', options: ['have', 'had', 'having'], correct: 1 },
                    { type: 'tip', mascotText: "Time expressions for Past Simple: yesterday, last week/month/year, ago (2 days ago), in 2020. These are your signal words!", mascotEmotion: 'happy', tipText: "yesterday · last week · 3 days ago · in 2020 · when I was young" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Regular', sentence: 'We ___ in a nice hotel.', options: ['stay', 'stayed', 'staying'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Irregular', sentence: 'She ___ a lot of photos.', options: ['take', 'took', 'taked'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "I ___ enjoy the food.", options: ["didn't", "don't", "wasn't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ you visit the museum?', options: ['Do', 'Did', 'Were'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a sentence', words: ['went', 'we', 'to', 'the', 'last', 'beach', 'summer'], correct: ['we', 'went', 'to', 'the', 'beach', 'last', 'summer'] } },
                    { type: 'match-pairs', data: { instruction: 'Present → Past', pairs: [{ left: 'take', right: 'took' }, { left: 'fly', right: 'flew' }, { left: 'swim', right: 'swam' }, { left: 'drive', right: 'drove' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мы летели 5 часов.', fromLang: 'RU', toLang: 'EN', answer: 'We flew for 5 hours' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Last summer we went to Spain. We stayed at a nice hotel near the beach.", hint: 'Past tense' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell about a holiday:', phrase: "Last year I went to Turkey. I flew from Moscow. I stayed at a hotel. I swam in the sea every day." } }
                ]
            },
            // ── A2 Unit 4 ──
            {
                id: 4, title: '🗣️ Shopping for clothes', desc: 'At a shop: sizes, colors, prices.', unitType: 'situational',
                grammar: ['How much', "I'd like", 'Can I try...?'], vocab: ['clothes', 'sizes', 'colors', 'shopping'],
                homework: { prompt: 'Write a shopping dialogue between a customer and shop assistant.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Let's go shopping! Whether it's London, Barcelona or Dubai — you need these phrases to buy clothes, shoes, and accessories.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Key shopping phrases:", mascotEmotion: 'happy', items: [{ base: 'Ask', past: "Can I try this on?", highlight: 'try on' }, { base: 'Size', past: "Do you have this in a medium?", highlight: 'medium' }, { base: 'Price', past: "How much does it cost?", highlight: 'How much' }, { base: 'Pay', past: "Can I pay by card?", highlight: 'pay by card' }] },
                    { type: 'vocab-intro', mascotText: "Clothing vocabulary:", mascotEmotion: 'happy', words: [{ en: 'shirt / T-shirt', ru: 'рубашка / футболка' }, { en: 'trousers / jeans', ru: 'брюки / джинсы' }, { en: 'dress', ru: 'платье' }, { en: 'shoes / trainers', ru: 'туфли / кроссовки' }, { en: 'size (S, M, L, XL)', ru: 'размер' }, { en: 'fitting room', ru: 'примерочная' }] },
                    { type: 'quiz-check', mascotText: "You want to try on a shirt. What do you say?", mascotEmotion: 'thinking', options: ['I want try this.', 'Can I try this on?', 'Give me try this.'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Shopping', sentence: 'How ___ does this shirt cost?', options: ['many', 'much', 'price'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Polite request', sentence: "I'___ like to try this on.", options: ['d', 'm', 've'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Size', sentence: "Do you have this in a ___?", options: ['small', 'short', 'little'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Make a request', words: ['try', 'can', 'I', 'this', 'on'], correct: ['can', 'I', 'try', 'this', 'on'] } },
                    { type: 'match-pairs', data: { instruction: 'Match', pairs: [{ left: 'shirt', right: 'рубашка' }, { left: 'dress', right: 'платье' }, { left: 'shoes', right: 'туфли' }, { left: 'jeans', right: 'джинсы' }] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Сколько стоит это платье?', fromLang: 'RU', toLang: 'EN', answer: 'How much does this dress cost?' } },
                    { type: 'speak-aloud', data: { instruction: 'Shopping dialogue:', phrase: "Excuse me, can I try this on? Do you have it in a large? How much is it? Can I pay by card?" } }
                ]
            },
            // ── A2 Unit 5 ──
            {
                id: 5, title: '🔄 Checkpoint 1', desc: 'Review units 1-4.', unitType: 'review',
                grammar: ['be', 'PS', 'possessives', 'shopping'], vocab: ['all A2 so far'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'PS', sentence: 'She ___ to school yesterday.', options: ['go', 'went', 'goes'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Object', sentence: 'Tell ___ the answer. (he)', options: ['he', 'his', 'him'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Possessive', sentence: "This book is ___. (I)", options: ['my', 'me', 'mine'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Shopping', sentence: 'Can I ___ this on?', options: ['try', 'wear', 'put'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '3rd person', sentence: 'He ___ to work by bus.', options: ['go', 'goes', 'going'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['didn\'t', 'I', 'the', 'like', 'food'], correct: ['I', "didn't", 'like', 'the', 'food'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мы не ходили в музей.', fromLang: 'RU', toLang: 'EN', answer: "We didn't go to the museum" } },
                    { type: 'speak-aloud', data: { instruction: 'Full review monologue:', phrase: "Yesterday I went shopping. I bought a new shirt. It cost 50 dollars. I paid by card." } }
                ]
            },
            // ── A2 Unit 6 ──
            {
                id: 6, title: 'Comparatives & superlatives', desc: '-er/more, the -est/most. Irregular: good-better-best.', unitType: 'grammar',
                grammar: ['comparative -er/more', 'superlative -est/most', 'irregular comparisons'], vocab: ['describing people', 'personality', 'weather', 'geography'],
                homework: { prompt: 'Compare 3 cities you know using comparatives and superlatives.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Time to compare things! BIGGER, SMALLER, MORE BEAUTIFUL, THE BEST! English has two systems depending on word length.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Short words (1-2 syllables): add -er/-est. Long words (3+): use more/most:", mascotEmotion: 'happy', left: { label: 'Short (-er/-est)', items: ['big → bigger → biggest', 'tall → taller → tallest', 'cheap → cheaper → cheapest'] }, right: { label: 'Long (more/most)', items: ['beautiful → more beautiful', 'expensive → more expensive', 'interesting → most interesting'] } },
                    { type: 'examples', mascotText: "Don't forget the irregular ones!", mascotEmotion: 'thinking', items: [{ base: 'good', past: "good → better → the best", highlight: 'irregular' }, { base: 'bad', past: "bad → worse → the worst", highlight: 'irregular' }, { base: 'far', past: "far → further → the furthest", highlight: 'irregular' }] },
                    { type: 'quiz-check', mascotText: "'Tokyo is ___ than London.'", mascotEmotion: 'thinking', options: ['more big', 'bigger', 'biggest'], correct: 1 },
                    { type: 'tip', mascotText: "Use THAN after comparatives: She is taller THAN me. Moscow is colder THAN Rome. BUT: He is THE tallest (no 'than' with superlatives).", mascotEmotion: 'happy', tipText: "comparative + THAN: bigger than · superlative + THE: the biggest" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Comparative', sentence: 'London is ___ than Paris.', options: ['big', 'bigger', 'biggest'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Superlative', sentence: 'Everest is ___ mountain in the world.', options: ['the highest', 'the higher', 'higher'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Irregular', sentence: 'This is ___ restaurant in the city.', options: ['the goodest', 'the better', 'the best'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Long word', sentence: 'English is ___ than Chinese.', options: ['more easy', 'easier', 'easiest'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Irregular', sentence: 'His results are ___ than mine.', options: ['badder', 'worse', 'worst'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['the', 'is', 'Russia', 'biggest', 'country', 'in', 'world', 'the'], correct: ['Russia', 'is', 'the', 'biggest', 'country', 'in', 'the', 'world'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он выше меня.', fromLang: 'RU', toLang: 'EN', answer: 'He is taller than me' } },
                    { type: 'match-pairs', data: { instruction: 'Match irregular', pairs: [{ left: 'good', right: 'better' }, { left: 'bad', right: 'worse' }, { left: 'far', right: 'further' }, { left: 'much', right: 'more' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Compare cities:', phrase: "Moscow is bigger than Paris. Tokyo is more expensive than Moscow. London is the most famous city in Europe." } }
                ]
            },
            // ── A2 Unit 7 ──
            {
                id: 7, title: 'Countable/Uncountable + much/many', desc: 'How much/how many. some/any. a lot of.', unitType: 'grammar',
                grammar: ['countable/uncountable', 'much/many/some/any/a lot of'], vocab: ['food', 'quantities', 'cooking'],
                homework: { prompt: 'Write a recipe using much/many/some/a lot of.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Some things you can count (apples: 1, 2, 3). Some you can't (water, sugar, money). This changes which words we use!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Countable vs Uncountable — different words:", mascotEmotion: 'happy', left: { label: 'Countable (1,2,3...)', items: ['How many apples?', 'a few apples', 'many apples', 'not many'] }, right: { label: 'Uncountable (no plural)', items: ['How much water?', 'a little water', 'much water', 'not much'] } },
                    { type: 'examples', mascotText: "SOME = positive. ANY = negative & questions. A LOT OF = both:", mascotEmotion: 'happy', items: [{ base: '+', past: "There is some milk.", highlight: 'some' }, { base: '−', past: "There isn't any sugar.", highlight: 'any' }, { base: '?', past: "Is there any bread?", highlight: 'any' }, { base: 'A lot', past: "I drink a lot of water.", highlight: 'a lot of' }] },
                    { type: 'quiz-check', mascotText: "'How ___ money do you have?'", mascotEmotion: 'thinking', options: ['many', 'much', 'lot'], correct: 1 },
                    { type: 'tip', mascotText: "Tricky uncountable nouns: information (NOT informations), advice (NOT advices), news (NOT a news), money (NOT moneys)!", mascotEmotion: 'happy', tipText: "❌ informations → ✅ information · ❌ advices → ✅ advice · ❌ a news → ✅ some news" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'much or many?', sentence: 'How ___ sugar do you need?', options: ['many', 'much'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'much or many?', sentence: 'How ___ eggs do we need?', options: ['many', 'much'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'some or any?', sentence: "There isn't ___ milk left.", options: ['some', 'any', 'much'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Uncountable', sentence: 'Can I have ___ water?', options: ['a', 'some', 'many'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Uncountable', sentence: 'She gave me good ___.', options: ['advice', 'advices', 'an advice'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['much', 'how', 'does', 'it', 'cost'], correct: ['how', 'much', 'does', 'it', 'cost'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'У нас много яблок.', fromLang: 'RU', toLang: 'EN', answer: 'We have a lot of apples' } },
{ type: 'match-pairs', data: { instruction: 'Countable or Uncountable?', pairs: [{ left: 'apple', right: 'countable (one apple)' }, { left: 'water', right: 'uncountable (water)' }, { left: 'money', right: 'uncountable (money)' }, { left: 'egg', right: 'countable (one egg)' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Talk about food:', phrase: "I need some eggs, a lot of flour, and a little sugar. I don't have any butter." } }
                ]
            },
            // ── A2 Unit 8 ──
            {
                id: 8, title: '🎤 Word stress & rhythm', desc: 'Stress patterns. Schwa /ə/. Natural speech rhythm.', unitType: 'pronunciation',
                grammar: [], vocab: ['word stress patterns'],
                teachSlides: [
                    { type: 'explain', mascotText: "English rhythm is based on STRESS. Some syllables are STRONG, others are weak. This is what makes English sound natural!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "The capital letters show the STRESSED syllable:", mascotEmotion: 'happy', items: [{ base: '2 syllables', past: "TEAcher, HOtel, beGIN", highlight: 'stress' }, { base: '3 syllables', past: "BEAUtiful, toBACco, JApanese", highlight: 'stress' }, { base: 'Noun vs Verb', past: "REcord (noun) vs reCORD (verb)", highlight: 'different!' }] },
                    { type: 'tip', mascotText: "The schwa /ə/ is the most common sound in English! It's the weak 'uh' in: About, Banana, Doctor, Button. Listen for it everywhere!", mascotEmotion: 'happy', tipText: "About = /əˈbaʊt/ · Banana = /bəˈnɑːnə/ · Doctor = /ˈdɒktə/" }
                ],
                exercises: [
                    { type: 'speak-aloud', data: { instruction: 'Practice stress:', phrase: "PHOtograph, phoTOGrapher, photoGRAphic. BEAUtiful, imPORtant, INteresting." } },
                    { type: 'speak-aloud', data: { instruction: 'Noun vs Verb stress:', phrase: "I want to reCORD a REcord. I want to preSENT a PREsent." } },
                    { type: 'fill-bubble', data: { instruction: 'Where is the stress?', sentence: 'BEAUTIFUL — stress on:', options: ['1st syllable', '2nd syllable', '3rd syllable'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Where is the stress?', sentence: 'IMPORTANT — stress on:', options: ['1st syllable', '2nd syllable', '3rd syllable'], correct: 1 } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "It's a beautiful, important photograph.", hint: 'Stress!' } }
                ]
            },
            // ── A2 Unit 9 ──
            {
                id: 9, title: 'Be going to: plans', desc: 'Future plans and intentions. Travel plans.', unitType: 'grammar',
                grammar: ['be going to (+/−/?)'], vocab: ['travel', 'airport', 'future plans'],
                homework: { prompt: 'Write about your plans for next weekend using "be going to".' },
                teachSlides: [
                    { type: 'explain', mascotText: "How do you talk about FUTURE PLANS? Use BE GOING TO! I'm going to travel. She's going to study. We're going to move.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Formula: subject + am/is/are + going to + verb:", mascotEmotion: 'happy', items: [{ base: '+', past: "I'm going to visit Japan next year.", highlight: "going to" }, { base: '−', past: "She isn't going to come to the party.", highlight: "isn't going to" }, { base: '?', past: "Are you going to study tonight?", highlight: "Are...going to" }, { base: 'Plan', past: "We're going to buy a new car.", highlight: "going to" }] },
                    { type: 'vocab-intro', mascotText: "Travel & airport vocabulary:", mascotEmotion: 'happy', words: [{ en: 'boarding pass', ru: 'посадочный талон' }, { en: 'gate', ru: 'выход' }, { en: 'take off / land', ru: 'взлететь / приземлиться' }, { en: 'check in', ru: 'зарегистрироваться' }, { en: 'delay', ru: 'задержка' }, { en: 'passport control', ru: 'паспортный контроль' }] },
                    { type: 'quiz-check', mascotText: "'We ___ going to fly to London.'", mascotEmotion: 'thinking', options: ['am', 'is', 'are'], correct: 2 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Going to', sentence: "I ___ going to travel to Japan.", options: ['am', 'is', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Going to', sentence: "She ___ going to study medicine.", options: ['am', 'is', 'are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "They ___ going to come.", options: ["aren't", "isn't", "don't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: "___ you going to visit us?", options: ['Do', 'Are', 'Will'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['going', "I'm", 'to', 'learn', 'Spanish'], correct: ["I'm", 'going', 'to', 'learn', 'Spanish'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мы собираемся поехать в Турцию.', fromLang: 'RU', toLang: 'EN', answer: "We are going to go to Turkey" } },
                    { type: 'match-pairs', data: { instruction: 'Airport vocab', pairs: [{ left: 'boarding pass', right: 'посадочный' }, { left: 'gate', right: 'выход' }, { left: 'delay', right: 'задержка' }, { left: 'take off', right: 'взлёт' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Plans:', phrase: "Next summer I'm going to visit Spain. I'm going to stay for two weeks. I'm not going to work." } }
                ]
            },
            // ── A2 Unit 10 ──
            {
                id: 10, title: 'Will vs Be going to', desc: 'Predictions vs plans. Spontaneous decisions.', unitType: 'grammar',
                grammar: ['will vs going to', "will for predictions/spontaneous"], vocab: ['weather', 'future events'],
                homework: { prompt: 'Write 5 predictions with will and 5 plans with going to.' },
                teachSlides: [
                    { type: 'explain', mascotText: "WILL and GOING TO both talk about future, but they're different! GOING TO = planned. WILL = predictions or instant decisions.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "See the difference:", mascotEmotion: 'happy', left: { label: 'Going to (plans)', items: ["I'm going to visit my mom.", "She's going to study law.", "We're going to move."] }, right: { label: 'Will (predictions / instant)', items: ["I think it will rain.", "I'll help you! (instant)", "She'll be a great doctor."] } },
                    { type: 'quiz-check', mascotText: "Your friend drops their bags. You say:", mascotEmotion: 'thinking', options: ["I'm going to help you.", "I'll help you!", "I help you."], correct: 1 },
                    { type: 'tip', mascotText: "WILL contracts: I'll, you'll, he'll, she'll, we'll, they'll. Negative: won't (= will not). Super common in speech!", mascotEmotion: 'happy', tipText: "I will → I'll · will not → won't · She will → She'll" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Prediction', sentence: "I think it ___ rain tomorrow.", options: ['will', 'is going to', 'does'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Plan', sentence: "We ___ visit Paris next month. (planned)", options: ['will', 'are going to', "won't"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Instant decision', sentence: "The phone is ringing. I ___ answer it!", options: ['am going to', "'ll", 'going to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "He ___ come to the party.", options: ["isn't going to", "won't not", "don't will"], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Prediction', words: ['think', 'I', 'she', 'will', 'pass', 'the', 'exam'], correct: ['I', 'think', 'she', 'will', 'pass', 'the', 'exam'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я думаю, завтра будет солнечно.', fromLang: 'RU', toLang: 'EN', answer: 'I think it will be sunny tomorrow' } },
                    { type: 'fill-bubble', data: { instruction: 'Contraction', sentence: "I will not → I ___", options: ["won't", "willn't", "don't will"], correct: 0 } },
                    { type: 'speak-aloud', data: { instruction: 'Mix plans and predictions:', phrase: "I'm going to study tonight. I think the test will be easy. I'll probably get a good grade." } }
                ]
            },
            // ── A2 Unit 11 ──
            {
                id: 11, title: '🔄 Checkpoint 2', desc: 'Review units 6-10.', unitType: 'review',
                grammar: ['comparatives', 'much/many', 'going to', 'will'], vocab: ['A2 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Comparative', sentence: 'She is ___ than me.', options: ['tall', 'taller', 'tallest'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Superlative', sentence: "It's ___ film I've ever seen.", options: ['the best', 'the better', 'the good'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'much/many', sentence: 'How ___ people are in the room?', options: ['much', 'many', 'lot'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Going to', sentence: 'I ___ going to buy a new phone.', options: ['am', 'is', 'will'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Will', sentence: "Don't worry, I ___ help you.", options: ["'ll", "'m going to", 'going'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Uncountable', sentence: 'Can I have ___ information?', options: ['a', 'some', 'many'], correct: 1 } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Москва больше, чем Лондон.', fromLang: 'RU', toLang: 'EN', answer: 'Moscow is bigger than London' } },
                    { type: 'speak-aloud', data: { instruction: 'Review:', phrase: "I'm going to travel next summer. I think Japan will be amazing. It's the most interesting country." } }
                ]
            },
            // ── A2 Unit 12 ──
            {
                id: 12, title: 'Present Perfect: experience', desc: 'Have you ever...? + ever/never/been.', unitType: 'grammar',
                grammar: ['Present Perfect', 'ever/never', 'been vs gone'], vocab: ['life experiences', 'travel', 'achievements'],
                homework: { prompt: 'Write 10 "Have you ever...?" questions and answer them.' },
                teachSlides: [
                    { type: 'explain', mascotText: "The most important new tense! PRESENT PERFECT = life experience. Have you EVER been to Japan? I have NEVER eaten sushi.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Formula: have/has + past participle (V3):", mascotEmotion: 'happy', items: [{ base: '+', past: "I have been to Paris.", highlight: "have been" }, { base: '−', past: "She has never tried sushi.", highlight: "has never" }, { base: '?', past: "Have you ever flown first class?", highlight: "Have...ever" }, { base: 'Answer', past: "Yes, I have. / No, I haven't.", highlight: "have/haven't" }] },
                    { type: 'compare', mascotText: "BEEN vs GONE — important difference:", mascotEmotion: 'thinking', left: { label: 'been (went & came back)', items: ["She's been to Tokyo.", '= She visited and returned.'] }, right: { label: 'gone (still there)', items: ["She's gone to Tokyo.", '= She is in Tokyo now.'] } },
                    { type: 'quiz-check', mascotText: "'Have you ever ___ to New York?'", mascotEmotion: 'thinking', options: ['go', 'went', 'been'], correct: 2 },
                    { type: 'tip', mascotText: "Present Perfect = NO specific time! ✅ I've been to Paris. ❌ I've been to Paris last year. (Use Past Simple for specific time: I went to Paris last year.)", mascotEmotion: 'happy', tipText: "✅ I've been to Paris (ever). ❌ I've been to Paris in 2020 → I went to Paris in 2020." }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: 'Have you ever ___ to Japan?', options: ['go', 'went', 'been'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: 'She ___ never eaten sushi.', options: ['have', 'has', 'is'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'ever/never', sentence: "I've ___ seen a whale.", options: ['ever', 'never', 'always'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'been vs gone', sentence: "Where's Tom? He's ___ to the shop.", options: ['been', 'gone', 'go'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Answer', sentence: "Have you seen this film? Yes, I ___.", options: ['have', 'did', 'was'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Question', words: ['ever', 'you', 'have', 'climbed', 'a', 'mountain'], correct: ['have', 'you', 'ever', 'climbed', 'a', 'mountain'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ты когда-нибудь был в Лондоне?', fromLang: 'RU', toLang: 'EN', answer: 'Have you ever been to London?' } },
                    { type: 'match-pairs', data: { instruction: 'V1 → V3', pairs: [{ left: 'go', right: 'gone' }, { left: 'see', right: 'seen' }, { left: 'eat', right: 'eaten' }, { left: 'fly', right: 'flown' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Ask about experiences:', phrase: "Have you ever been to Japan? I've never tried sushi. I've visited 10 countries." } }
                ]
            },
            // ── A2 Unit 13 ──
            {
                id: 13, title: "Should / Shouldn't: advice", desc: 'Giving advice and recommendations.', unitType: 'grammar',
                grammar: ["should/shouldn't"], vocab: ['health', 'body parts', 'advice', 'lifestyle'],
                homework: { prompt: 'Write advice for someone who wants to learn English faster.' },
                teachSlides: [
                    { type: 'explain', mascotText: "SHOULD = advice, recommendation. 'You should exercise more.' SHOULDN'T = advice not to do something. 'You shouldn't eat so much sugar.'", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Should is a modal verb — no -s, no do/does:", mascotEmotion: 'happy', items: [{ base: '+', past: "You should drink more water.", highlight: 'should' }, { base: '−', past: "You shouldn't smoke.", highlight: "shouldn't" }, { base: '?', past: "Should I see a doctor?", highlight: 'Should' }, { base: 'Answer', past: "Yes, you should.", highlight: 'should' }] },
                    { type: 'vocab-intro', mascotText: "Health problems and body parts:", mascotEmotion: 'happy', words: [{ en: 'headache', ru: 'головная боль' }, { en: 'stomachache', ru: 'боль в животе' }, { en: 'sore throat', ru: 'боль в горле' }, { en: 'temperature / fever', ru: 'температура' }, { en: 'cough', ru: 'кашель' }, { en: 'feel sick', ru: 'тошнить' }] },
                    { type: 'quiz-check', mascotText: "Your friend has a headache. What do you say?", mascotEmotion: 'thinking', options: ['You must go home!', 'You should take a painkiller.', 'You can headache.'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Advice', sentence: 'You ___ see a doctor.', options: ['should', 'must', 'can'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "You ___ eat too much fast food.", options: ['should', "shouldn't", "don't should"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: '___ I take medicine?', options: ['Do', 'Should', 'Am'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Health', sentence: "I've got a sore ___.", options: ['head', 'throat', 'stomach'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Give advice', words: ['should', 'you', 'more', 'sleep'], correct: ['you', 'should', 'sleep', 'more'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Тебе следует пить больше воды.', fromLang: 'RU', toLang: 'EN', answer: 'You should drink more water' } },
                    { type: 'match-pairs', data: { instruction: 'Health vocab', pairs: [{ left: 'headache', right: 'голова' }, { left: 'cough', right: 'кашель' }, { left: 'fever', right: 'температура' }, { left: 'sore throat', right: 'горло' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Give health advice:', phrase: "You should exercise every day. You shouldn't eat too much sugar. You should sleep 8 hours." } }
                ]
            },
            // ── A2 Unit 14 ──
            {
                id: 14, title: "🗣️ At the doctor's", desc: 'Describe symptoms. Get advice.', unitType: 'situational',
                grammar: ["I've got...", "You should..."], vocab: ['symptoms', 'medicine', 'body parts'],
                homework: { prompt: "Write a dialogue at the doctor's." },
                teachSlides: [
                    { type: 'explain', mascotText: "Nobody likes being ill, but you NEED to explain your symptoms to a doctor. Let's learn the key phrases!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "At the doctor's:", mascotEmotion: 'happy', items: [{ base: 'Symptom', past: "I've got a headache.", highlight: "I've got" }, { base: 'Duration', past: "I've had it for 3 days.", highlight: 'for 3 days' }, { base: 'Pain', past: "It hurts here.", highlight: 'hurts' }, { base: 'Doctor', past: "You should take this medicine.", highlight: 'should' }] },
                    { type: 'quiz-check', mascotText: "You feel sick. How do you start the conversation with a doctor?", mascotEmotion: 'thinking', options: ["I am ill my stomach.", "I don't feel well. I've got a stomachache.", "My stomach is broken."], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Doctor', sentence: "I've ___ a headache since yesterday.", options: ['got', 'get', 'getting'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Duration', sentence: "I've had this cough ___ a week.", options: ['since', 'for', 'during'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Advice', sentence: 'You should ___ this medicine twice a day.', options: ['take', 'took', 'taking'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'At the doctor', words: ['feel', "don't", 'I', 'well'], correct: ['I', "don't", 'feel', 'well'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'У меня болит голова.', fromLang: 'RU', toLang: 'EN', answer: "I've got a headache" } },
                    { type: 'speak-aloud', data: { instruction: "At the doctor's:", phrase: "Doctor, I don't feel well. I've got a temperature and a sore throat. I've had it for two days." } }
                ]
            },
            // ── A2 Unit 15 ──
            {
                id: 15, title: 'Would like: polite requests', desc: "I'd like... / Would you like...? At a restaurant.", unitType: 'grammar',
                grammar: ['would like + noun/infinitive'], vocab: ['restaurant', 'menu', 'polite phrases'],
                homework: { prompt: 'Write a restaurant dialogue using would like.' },
                teachSlides: [
                    { type: 'explain', mascotText: "'I want' is direct. 'I'd like' is polite. In English, being polite matters A LOT. Use WOULD LIKE at restaurants, in shops, everywhere!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Direct vs Polite:", mascotEmotion: 'happy', left: { label: 'Direct (OK with friends)', items: ['I want a coffee.', 'Do you want tea?', 'I want to go.'] }, right: { label: "Polite (use at work, shops)", items: ["I'd like a coffee, please.", 'Would you like some tea?', "I'd like to go."] } },
                    { type: 'quiz-check', mascotText: "At a restaurant, the waiter asks:", mascotEmotion: 'thinking', options: ['You want what?', 'What would you like to order?', 'What you like?'], correct: 1 },
                    { type: 'tip', mascotText: "I'd = I would. Contraction! I'd like a table for two. She'd like the fish. We'd like to see the menu.", mascotEmotion: 'happy', tipText: "I'd like = I would like · Would you like = polite 'Do you want'" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Polite', sentence: "I ___ like a coffee, please.", options: ['will', 'would', 'could'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Offer', sentence: '___ you like some cake?', options: ['Do', 'Would', 'Are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Infinitive', sentence: "I'd like ___ a table for two.", options: ['book', 'to book', 'booking'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Restaurant', words: ['like', "I'd", 'the', 'fish', 'please'], correct: ["I'd", 'like', 'the', 'fish', 'please'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я бы хотел столик на двоих.', fromLang: 'RU', toLang: 'EN', answer: "I'd like a table for two" } },
                    { type: 'fill-bubble', data: { instruction: 'Response', sentence: "Would you like dessert? — No, ___.", options: ['I don\'t like', 'thank you', 'I wouldn\'t'], correct: 1 } },
                    { type: 'speak-aloud', data: { instruction: 'Order at a restaurant:', phrase: "I'd like a table for two, please. I'd like the steak with chips. Would you like anything to drink?" } }
                ]
            },
            // ── A2 Unit 16 ──
            {
                id: 16, title: '🔄 Final Checkpoint A2', desc: 'Full A2 review.', unitType: 'review',
                grammar: ['all A2 grammar'], vocab: ['all A2 vocab'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: 'Have you ever ___ sushi?', options: ['eat', 'ate', 'eaten'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Comparative', sentence: 'This hotel is ___ than that one.', options: ['more cheap', 'cheaper', 'cheapest'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Going to', sentence: "She ___ going to study abroad.", options: ['am', 'is', 'are'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Will', sentence: "I think it ___ be sunny tomorrow.", options: ['will', 'is going to', 'does'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Should', sentence: "You ___ eat more vegetables.", options: ['should', 'must', 'will'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Would like', sentence: "I ___ like a glass of water.", options: ['will', 'would', 'should'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'much/many', sentence: "How ___ countries have you visited?", options: ['much', 'many'], correct: 1 } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я никогда не был в Японии.', fromLang: 'RU', toLang: 'EN', answer: 'I have never been to Japan' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он лучший учитель в школе.', fromLang: 'RU', toLang: 'EN', answer: 'He is the best teacher in the school' } },
                    { type: 'speak-aloud', data: { instruction: 'A2 graduation speech:', phrase: "I've learned a lot of English! I can compare things, talk about my plans, give advice, and order food politely." } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // B1 — PRE-INTERMEDIATE (16 units) — FULL
    // ═══════════════════════════════════════════
    {
        id: 'b1_preintermediate',
        language: 'en',
        title: 'B1 — Pre-Intermediate',
        level: 'B1',
        cefr: 'B1',
        methodology: 'CEFR B1 Threshold. Present Perfect mastery (yet/already/just, for/since, PP vs PS). First and Second Conditionals. Passive voice. Reported speech. Modals of obligation. ~2800 cumulative vocabulary.',
        canDo: [
            'Can understand the main points of clear standard input on familiar matters',
            'Can deal with most situations likely to arise whilst travelling',
            'Can produce simple connected text on topics which are familiar or of personal interest',
            'Can describe experiences, events, dreams, hopes, and ambitions',
            'Can briefly give reasons and explanations for opinions and plans',
            'Can use conditionals to discuss real and hypothetical situations',
            'Can use passive voice to describe processes and events',
            'Can report what others have said',
            'Can express obligation and prohibition (must/have to)',
        ],
        objectives: [
            'Present Perfect: yet/already/just, for/since',
            'Present Perfect vs Past Simple: when to use which',
            'Infinitive vs gerund after different verbs',
            'Past Continuous + Past Simple for storytelling',
            'First Conditional (real possibilities)',
            'Second Conditional (unreal/hypothetical)',
            'Passive voice: present and past',
            'Past Perfect for sequence of past events',
            'Reported speech with backshift',
            'Modals: must/have to/don\'t have to/mustn\'t',
            'Situational: job interviews, retelling news',
        ],
        units: [
            // ── B1 Unit 1 ──
            {
                id: 1, title: 'Present Perfect: yet / already / just', desc: 'Recent events and completion.', unitType: 'grammar',
                grammar: ['PP + yet/already/just'], vocab: ['housework', 'make vs do'],
                homework: { prompt: "Write about what you've done today using yet/already/just." },
                teachSlides: [
                    { type: 'explain', mascotText: "You know Present Perfect for experience (ever/never). Now let's use it for RECENT actions with three magic words: JUST, ALREADY, YET!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "JUST = a moment ago. ALREADY = sooner than expected. YET = not yet (negative/question):", mascotEmotion: 'happy', items: [{ base: 'just', past: "I've just finished dinner. (seconds ago)", highlight: 'just' }, { base: 'already', past: "She's already done her homework! (wow, fast!)", highlight: 'already' }, { base: 'yet −', past: "I haven't cleaned yet. (but I will)", highlight: 'yet' }, { base: 'yet ?', past: "Have you eaten yet?", highlight: 'yet' }] },
                    { type: 'compare', mascotText: "Where do they go in the sentence?", mascotEmotion: 'happy', left: { label: 'Position', items: ['JUST', 'ALREADY', 'YET'] }, right: { label: 'Where?', items: ['after have/has', 'after have/has', 'at the END'] } },
                    { type: 'quiz-check', mascotText: "'Have you finished your homework ___?'", mascotEmotion: 'thinking', options: ['just', 'already', 'yet'], correct: 2 },
                    { type: 'tip', mascotText: "Make vs Do! MAKE = create something (make a cake, make a mistake). DO = activity (do homework, do the dishes, do exercise).", mascotEmotion: 'happy', tipText: "MAKE: cake, coffee, bed, mistake, noise · DO: homework, dishes, laundry, exercise, nothing" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Just', sentence: "I've ___ arrived. (a moment ago)", options: ['yet', 'just', 'already'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Already', sentence: "She's ___ eaten lunch. (fast!)", options: ['yet', 'just', 'already'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Yet', sentence: "He hasn't called ___.", options: ['yet', 'just', 'already'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Yet', sentence: "Have you finished ___?", options: ['already', 'yet', 'just'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Make or Do?', sentence: 'I need to ___ the dishes.', options: ['make', 'do'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Make or Do?', sentence: "Don't ___ a mistake!", options: ['make', 'do'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Sentence', words: ['already', "I've", 'the', 'finished', 'report'], correct: ["I've", 'already', 'finished', 'the', 'report'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я ещё не убрал комнату.', fromLang: 'RU', toLang: 'EN', answer: "I haven't cleaned the room yet" } },
                    { type: 'speak-aloud', data: { instruction: 'Describe your day:', phrase: "I've just woken up. I've already had breakfast. I haven't done my homework yet." } }
                ]
            },
            // ── B1 Unit 2 ──
            {
                id: 2, title: 'Present Perfect vs Past Simple', desc: 'When to use which — the crucial choice.', unitType: 'grammar',
                grammar: ['PP vs PS'], vocab: ['verbs + prepositions', 'time expressions'],
                homework: { prompt: 'Write 10 sentences: 5 with PP and 5 with PS. Explain why you chose each.' },
                teachSlides: [
                    { type: 'explain', mascotText: "This is THE most confusing thing in English! PP vs PS. The rule is simple: SPECIFIC TIME = Past Simple. NO TIME / still relevant = Present Perfect.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "See the difference:", mascotEmotion: 'happy', left: { label: 'Present Perfect', items: ["I've been to Paris.", "She's lost her keys.", "I've lived here for 5 years."] }, right: { label: 'Past Simple', items: ['I went to Paris in 2020.', 'She lost her keys yesterday.', 'I lived in London for 3 years. (not anymore)'] } },
                    { type: 'examples', mascotText: "Key: Present Perfect connects past to NOW. Past Simple = finished, done:", mascotEmotion: 'thinking', items: [{ base: 'PP', past: "I've lost my phone. (still lost!)", highlight: 'still relevant' }, { base: 'PS', past: "I lost my phone yesterday. (found it)", highlight: 'finished' }, { base: 'PP', past: "She's worked here since 2015. (still works)", highlight: 'continues' }, { base: 'PS', past: "She worked there for 5 years. (then left)", highlight: 'finished' }] },
                    { type: 'quiz-check', mascotText: "'I ___ to Berlin last summer.'", mascotEmotion: 'thinking', options: ['have been', 'went', 'have gone'], correct: 1 },
                    { type: 'tip', mascotText: "Signal words: PP = ever, never, just, already, yet, for, since, today. PS = yesterday, last week, ago, in 2020, when I was young.", mascotEmotion: 'happy', tipText: "PP: ever/never/just/already/yet/for/since · PS: yesterday/last/ago/in 2020" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'PP or PS?', sentence: 'I ___ to London in 2020.', options: ['have been', 'went', 'have gone'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP or PS?', sentence: 'I ___ to London three times.', options: ['have been', 'went', 'was'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PP or PS?', sentence: 'She ___ here since 2018.', options: ['has worked', 'worked', 'works'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PP or PS?', sentence: 'We ___ married in 2015.', options: ['have got', 'got', "have gotten"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP or PS?', sentence: "I ___ my keys. Can you help me find them?", options: ["'ve lost", 'lost', 'lose'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'PP sentence', words: ['lived', "I've", 'here', 'for', 'ten', 'years'], correct: ["I've", 'lived', 'here', 'for', 'ten', 'years'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Она работает здесь с 2018 года.', fromLang: 'RU', toLang: 'EN', answer: 'She has worked here since 2018' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я был в Лондоне в прошлом году.', fromLang: 'RU', toLang: 'EN', answer: 'I went to London last year' } },
                    { type: 'speak-aloud', data: { instruction: 'Mix PP and PS:', phrase: "I've visited 15 countries. Last year I went to Japan. I've never been to Australia." } }
                ]
            },
            // ── B1 Unit 3 ──
            {
                id: 3, title: 'Present Perfect + for / since', desc: 'How long have you...? Duration.', unitType: 'grammar',
                grammar: ['PP + for/since', 'How long...?'], vocab: ['relationships', 'biography', 'duration'],
                homework: { prompt: 'Write about yourself using for/since: job, home, hobbies, relationships.' },
                teachSlides: [
                    { type: 'explain', mascotText: "FOR = period of time (for 5 years, for 2 hours). SINCE = starting point (since 2020, since Monday). Use with Present Perfect for things that CONTINUE!", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "FOR vs SINCE:", mascotEmotion: 'happy', left: { label: 'FOR + period', items: ['for 3 years', 'for 2 weeks', 'for a long time', 'for ages'] }, right: { label: 'SINCE + point', items: ['since 2020', 'since Monday', 'since I was a child', 'since last summer'] } },
                    { type: 'quiz-check', mascotText: "'I've known her ___ 10 years.'", mascotEmotion: 'thinking', options: ['for', 'since', 'during'], correct: 0 },
                    { type: 'tip', mascotText: "How long...? = 'Как долго?' How long have you lived here? I've lived here for 5 years / since 2019.", mascotEmotion: 'happy', tipText: "How long + PP = asking about duration. Answer with FOR or SINCE." }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'for or since?', sentence: "I've lived here ___ 2015.", options: ['for', 'since'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'for or since?', sentence: "She's been a teacher ___ 20 years.", options: ['for', 'since'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'for or since?', sentence: "We've known each other ___ university.", options: ['for', 'since'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Question', sentence: "How ___ have you worked here?", options: ['much', 'long', 'many'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: "They ___ married for 25 years.", options: ['have been', 'are', 'were'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Question', words: ['how', 'have', 'long', 'you', 'lived', 'here'], correct: ['how', 'long', 'have', 'you', 'lived', 'here'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я изучаю английский 3 года.', fromLang: 'RU', toLang: 'EN', answer: "I've studied English for 3 years" } },
                    { type: 'speak-aloud', data: { instruction: 'Talk about duration:', phrase: "I've lived in Moscow since I was born. I've studied English for 3 years. I've known my best friend since school." } }
                ]
            },
            // ── B1 Unit 4 ──
            {
                id: 4, title: '🗣️ Job interview: about yourself', desc: 'PP + PS in a job interview context.', unitType: 'situational',
                grammar: ['PP + PS combined'], vocab: ['work experience', 'skills', 'education'],
                homework: { prompt: 'Prepare answers for: Tell me about yourself, What are your strengths?' },
                teachSlides: [
                    { type: 'explain', mascotText: "Job interviews combine PP and PS perfectly! PP = your current situation and experience. PS = specific past events.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Standard interview answers:", mascotEmotion: 'happy', items: [
                        { base: 'Experience', past: "I've worked in marketing for 5 years.", highlight: 'PP' },
                        { base: 'Past role', past: "I worked at Google from 2018 to 2020.", highlight: 'PS' },
                        { base: 'Skills', past: "I've managed teams of up to 20 people.", highlight: 'PP' },
                        { base: 'Education', past: "I graduated from university in 2017.", highlight: 'PS' }
                    ] },
                    { type: 'compare', mascotText: "Use PP for ongoing relevance, PS for finished events:", mascotEmotion: 'happy',
                        left: { label: 'Present Perfect (still relevant)', items: ["I've worked in IT for 6 years.", "I've led several successful projects.", "I've always been interested in design."] },
                        right: { label: 'Past Simple (specific past)', items: ["I worked at IBM from 2019 to 2022.", "I completed a management course last year.", "I started my career as an intern."] }
                    },
                    { type: 'quiz-check', mascotText: "Interviewer: 'How long have you been in this field?' Best answer:", mascotEmotion: 'thinking', options: ["I work for 5 years.", "I've been in this field for 5 years.", "I was in this field 5 years."], correct: 1 },
                    { type: 'tip', mascotText: "Interview tip: Start with your current situation (PP), then add key past achievements (PS), then future goals (will/going to). This is the STAR method!", mascotEmotion: 'happy', tipText: "Structure: Current role (PP) → Past achievements (PS) → Future goals (will)" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Interview', sentence: "I've ___ in marketing for 5 years.", options: ['work', 'worked', 'working'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past role', sentence: 'I ___ at Google from 2018 to 2020.', options: ["'ve worked", 'worked', 'work'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: "I ___ managed teams of up to 20 people.", options: ["'ve", 'had', 'was'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PS', sentence: 'I ___ from university in 2017.', options: ["'ve graduated", 'graduated', 'graduate'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match the tense to the signal', pairs: [{ left: 'for 5 years', right: 'Present Perfect (duration)' }, { left: 'in 2020', right: 'Past Simple (finished time)' }, { left: 'since 2019', right: 'Present Perfect (since)' }, { left: 'last year', right: 'Past Simple (last year)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Interview answer', words: ['managed', "I've", 'teams', 'of', 'up', 'to', '20', 'people'], correct: ["I've", 'managed', 'teams', 'of', 'up', 'to', '20', 'people'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я работаю в этой компании с 2019 года.', fromLang: 'RU', toLang: 'EN', answer: "I've worked at this company since 2019" } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я закончил университет в 2018 году.', fromLang: 'RU', toLang: 'EN', answer: 'I graduated from university in 2018' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I've been working in this industry for over ten years.", hint: 'Use contractions' } },
                    { type: 'speak-aloud', data: { instruction: 'Practice interview:', phrase: "I've worked in IT for 6 years. I graduated from university in 2018. I've managed several projects successfully." } }
                ]
            },
            // ── B1 Unit 5 ──
            {
                id: 5, title: '🔄 Checkpoint 1', desc: 'Review Present Perfect: yet/already/just, for/since, PP vs PS.', unitType: 'review',
                grammar: ['PP all forms'], vocab: ['B1 review 1-4'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'yet/already/just', sentence: "I've ___ finished. (seconds ago)", options: ['yet', 'just', 'already'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP vs PS', sentence: "She ___ to Italy twice.", options: ['went', 'has been', 'was'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'for/since', sentence: "He's lived here ___ 10 years.", options: ['for', 'since'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: "They ___ yet.", options: ["haven't arrived", "didn't arrive", "aren't arriving"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PP vs PS', sentence: "I ___ my car last week.", options: ["'ve sold", 'sold', 'sell'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'for/since', sentence: "We've been friends ___ childhood.", options: ['for', 'since'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match signal word to tense', pairs: [{ left: 'yesterday', right: 'Past Simple (yesterday)' }, { left: 'ever', right: 'Present Perfect (ever)' }, { left: 'in 2020', right: 'Past Simple (in 2020)' }, { left: 'already', right: 'Present Perfect (already)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'PP sentence', words: ['you', 'have', 'finished', 'yet', 'your', 'homework'], correct: ['have', 'you', 'finished', 'your', 'homework', 'yet'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ты уже поел?', fromLang: 'RU', toLang: 'EN', answer: 'Have you eaten yet?' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Она только что пришла домой.', fromLang: 'RU', toLang: 'EN', answer: "She's just come home" } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I've already finished my homework.", hint: 'Contraction: I have = I\'ve' } },
                    { type: 'speak-aloud', data: { instruction: 'Full PP review:', phrase: "I've just finished work. I've already cooked dinner. I haven't watched TV yet. I've lived here since 2020." } }
                ]
            },
            // ── B1 Unit 6 ──
            { id: 6, title: 'Infinitive vs Gerund', desc: 'to + verb vs verb + -ing after different verbs.', unitType: 'grammar', grammar: ['infinitive vs gerund'], vocab: ['want/enjoy/decide/avoid/promise/suggest'], homework: { prompt: 'Write 10 sentences using verbs that take infinitive and gerund.' }, teachSlides: [{ type: 'explain', mascotText: "Some verbs need TO + verb (I want TO go). Others need verb-ING (I enjoy going). Some take both! Let's learn the rules.", mascotEmotion: 'happy' }, { type: 'compare', mascotText: "Which verbs take which form:", mascotEmotion: 'happy', left: { label: '+ TO (infinitive)', items: ['want to', 'decide to', 'hope to', 'promise to', 'need to', 'learn to'] }, right: { label: '+ -ING (gerund)', items: ['enjoy -ing', 'avoid -ing', 'suggest -ing', 'mind -ing', 'finish -ing', "can't stand -ing"] } }, { type: 'examples', mascotText: "Some verbs take BOTH — but meaning changes!", mascotEmotion: 'thinking', items: [{ base: 'stop + -ing', past: "I stopped smoking. (quit the habit)", highlight: 'quit' }, { base: 'stop + to', past: "I stopped to smoke. (paused to have a cigarette)", highlight: 'paused' }, { base: 'remember + -ing', past: "I remember locking the door. (memory of past)", highlight: 'memory' }, { base: 'remember + to', past: "Remember to lock the door. (don't forget!)", highlight: "don't forget" }] }, { type: 'quiz-check', mascotText: "'I enjoy ___' — which form?", mascotEmotion: 'thinking', options: ['to swim', 'swimming', 'swim'], correct: 1 }], exercises: [{ type: 'fill-bubble', data: { instruction: 'Infinitive', sentence: 'I want ___ English.', options: ['learn', 'to learn', 'learning'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Gerund', sentence: 'I enjoy ___ books.', options: ['to read', 'reading', 'read'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Gerund', sentence: 'She avoids ___ fast food.', options: ['to eat', 'eating', 'eat'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Infinitive', sentence: 'He decided ___ a new car.', options: ['buying', 'to buy', 'buy'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Both', sentence: 'I stopped ___ . (quit the habit)', options: ['to smoke', 'smoking'], correct: 1 } }, { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я решил изучать французский.', fromLang: 'RU', toLang: 'EN', answer: 'I decided to study French' } }, { type: 'match-pairs', data: { instruction: 'Verb + form', pairs: [{ left: 'want', right: 'to + verb (want)' }, { left: 'enjoy', right: 'verb-ing (enjoy)' }, { left: 'decide', right: 'to + verb (decide)' }, { left: 'avoid', right: 'verb-ing (avoid)' }] } }, { type: 'speak-aloud', data: { instruction: 'Practice:', phrase: "I want to learn English. I enjoy reading books. I've decided to travel more. I avoid eating junk food." } }] },
            // ── B1 Unit 7 ──
            // ── B1 Unit 7 ──
            {
                id: 7, title: 'Past Continuous + Past Simple', desc: 'was doing... when... happened.', unitType: 'grammar',
                grammar: ['Past Continuous', 'when/while'], vocab: ['storytelling', 'feelings', 'weather'],
                homework: { prompt: 'Write a story about something unexpected that happened to you.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Past Continuous = background action. Past Simple = sudden event. They work together to tell stories! 'I WAS WALKING when it STARTED to rain.'", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "WHEN + Past Simple (short action). WHILE + Past Continuous (long action):", mascotEmotion: 'happy', items: [
                        { base: 'Story', past: "I was sleeping when the phone rang.", highlight: 'was sleeping / rang' },
                        { base: 'When', past: "When I arrived, it was raining.", highlight: 'arrived / was raining' },
                        { base: 'While', past: "While she was cooking, he was reading.", highlight: 'both continuous' },
                        { base: 'Two actions', past: "I saw her while I was jogging in the park.", highlight: 'saw / was jogging' }
                    ] },
                    { type: 'compare', mascotText: "WHEN vs WHILE — which tense follows?", mascotEmotion: 'thinking',
                        left: { label: 'WHEN + Past Simple', items: ['When the phone rang...', 'When I arrived...', 'When the accident happened...'] },
                        right: { label: 'WHILE + Past Continuous', items: ['While I was sleeping...', 'While she was driving...', 'While they were playing...'] }
                    },
                    { type: 'quiz-check', mascotText: "'While I ___ TV, someone knocked on the door.'", mascotEmotion: 'thinking', options: ['watched', 'was watching', 'watch'], correct: 1 },
                    { type: 'tip', mascotText: "You can use TWO Past Continuous actions happening at the same time: 'While I was studying, my roommate was playing guitar.' Both are background — no interruption!", mascotEmotion: 'happy', tipText: "Both background: While A was ...-ing, B was ...-ing" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Past Cont.', sentence: 'I ___ sleeping when the phone rang.', options: ['am', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PC + PS', sentence: 'While she ___ cooking, the fire alarm went off.', options: ['is', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PC + PS', sentence: 'When I arrived, they ___ dinner.', options: ['had', 'were having', 'have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'When/While', sentence: '___ he was driving, he got a phone call.', options: ['When', 'While', 'During'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match the connector', pairs: [{ left: 'WHEN', right: '+ Past Simple' }, { left: 'WHILE', right: '+ Past Continuous' }, { left: 'background action', right: 'Past Continuous' }, { left: 'sudden event', right: 'Past Simple' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Story', words: ['was', 'I', 'walking', 'when', 'it', 'started', 'to', 'rain'], correct: ['I', 'was', 'walking', 'when', 'it', 'started', 'to', 'rain'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я читал книгу, когда свет погас.', fromLang: 'RU', toLang: 'EN', answer: 'I was reading a book when the light went off' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "While they were playing football, it started to rain.", hint: 'Two clauses connected with a comma' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell a story:', phrase: "I was walking home when I saw an accident. While the police were talking to the driver, I called an ambulance." } }
                ]
            },
            // ── B1 Unit 8 ──
            { id: 8, title: 'First Conditional: if... will...', desc: 'Real future possibilities.', unitType: 'grammar', grammar: ['First Conditional: if + PS → will'], vocab: ['possibilities', 'plans', 'warnings'], homework: { prompt: 'Write 8 First Conditional sentences about your life.' }, teachSlides: [{ type: 'explain', mascotText: "First Conditional = real possibilities. If it RAINS (real), I WILL stay home. The structure: IF + Present Simple, ... WILL + verb.", mascotEmotion: 'happy' }, { type: 'examples', mascotText: "IF-clause = Present Simple. Main clause = WILL:", mascotEmotion: 'happy', items: [{ base: 'Plan', past: "If I pass the exam, I'll celebrate.", highlight: "If...will" }, { base: 'Warning', past: "If you don't hurry, you'll be late.", highlight: "If don't...will" }, { base: 'Promise', past: "If you help me, I'll buy you dinner.", highlight: "If...will" }, { base: 'Swap OK', past: "I'll help you if you ask me.", highlight: "will...if" }] }, { type: 'quiz-check', mascotText: "'If she ___ hard, she'll pass the exam.'", mascotEmotion: 'thinking', options: ['will study', 'studies', 'study'], correct: 1 }, { type: 'tip', mascotText: "NO WILL in the IF-clause! ❌ If it will rain... ✅ If it rains... The IF part always uses Present Simple!", mascotEmotion: 'happy', tipText: "❌ If it will rain → ✅ If it rains · ❌ If I will go → ✅ If I go" }], exercises: [{ type: 'fill-bubble', data: { instruction: '1st Cond', sentence: "If it rains, I ___ stay home.", options: ['will', 'would', 'am'], correct: 0 } }, { type: 'fill-bubble', data: { instruction: 'IF clause', sentence: "If she ___ hard, she'll pass.", options: ['will study', 'studies', 'study'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "If you ___ hurry, you'll be late.", options: ["won't", "don't", "didn't"], correct: 1 } }, { type: 'word-shuffle', data: { instruction: '1st Conditional', words: ["I'll", 'you', 'if', 'help', 'you', 'ask', 'me'], correct: ["I'll", 'help', 'you', 'if', 'you', 'ask', 'me'] } }, { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если будет солнечно, мы пойдём на пляж.', fromLang: 'RU', toLang: 'EN', answer: "If it's sunny, we'll go to the beach" } }, { type: 'speak-aloud', data: { instruction: 'Practice:', phrase: "If I find a good job, I'll move to London. If I have time, I'll learn a new language." } }] },
            // ── B1 Unit 9 ──
            { id: 9, title: 'Second Conditional: dreams', desc: 'Unreal/imaginary situations.', unitType: 'grammar', grammar: ['Second Conditional: if + past → would'], vocab: ['dreams', 'hypotheticals', 'imagination'], homework: { prompt: 'Write about 5 things you would do if you were a millionaire.' }, teachSlides: [{ type: 'explain', mascotText: "Second Conditional = UNREAL situations. If I WON the lottery (I probably won't), I WOULD travel the world. Structure: IF + Past Simple, ... WOULD + verb.", mascotEmotion: 'happy' }, { type: 'compare', mascotText: "First vs Second Conditional:", mascotEmotion: 'happy', left: { label: '1st: REAL possibility', items: ['If it rains, I\'ll stay home.', '(it might rain)', 'If + Present → will'] }, right: { label: '2nd: UNREAL / dream', items: ["If I were rich, I'd travel.", "(I'm not rich)", 'If + Past → would'] } }, { type: 'quiz-check', mascotText: "'If I ___ a million dollars, I'd buy a house.'", mascotEmotion: 'thinking', options: ['have', 'had', 'will have'], correct: 1 }, { type: 'tip', mascotText: "With BE in the IF-clause, use WERE for all persons (formal). I were, you were, he were, she were. 'If I WERE you, I'd...' — classic advice phrase!", mascotEmotion: 'happy', tipText: "If I were rich... · If she were here... · If I were you, I'd study harder." }], exercises: [{ type: 'fill-bubble', data: { instruction: '2nd Cond', sentence: "If I had a million, I ___ travel.", options: ['will', 'would', 'can'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'IF clause', sentence: "If I ___ you, I'd apologize.", options: ['am', 'was', 'were'], correct: 2 } }, { type: 'fill-bubble', data: { instruction: '2nd Cond', sentence: 'If she ___ harder, she would pass.', options: ['studies', 'studied', 'will study'], correct: 1 } }, { type: 'word-shuffle', data: { instruction: 'Dream', words: ['would', 'I', 'travel', 'if', 'I', 'rich', 'were'], correct: ['I', 'would', 'travel', 'if', 'I', 'were', 'rich'] } }, { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я был президентом, я бы всё изменил.', fromLang: 'RU', toLang: 'EN', answer: "If I were president, I would change everything" } }, { type: 'speak-aloud', data: { instruction: 'Dream big:', phrase: "If I won the lottery, I'd buy a house on the beach. If I could fly, I'd travel everywhere." } }] },
            // ── B1 Unit 10 ──
            {
                id: 10, title: '🔄 Checkpoint 2', desc: 'Review Conditionals, PC+PS, infinitive/gerund.', unitType: 'review',
                grammar: ['1st & 2nd Conditionals', 'Past Continuous', 'inf/ger'], vocab: ['B1 review 6-9'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '1st Cond', sentence: "If it ___, we'll stay home.", options: ['will rain', 'rains', 'rained'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '2nd Cond', sentence: 'If she ___ here, she would help us.', options: ['is', 'was', 'were'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'PC', sentence: 'While I ___ dinner, the doorbell rang.', options: ['cook', 'was cooking', 'cooked'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Inf/Ger', sentence: 'I enjoy ___ to music.', options: ['listen', 'to listen', 'listening'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Inf/Ger', sentence: 'She decided ___ a new job.', options: ['find', 'to find', 'finding'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '1st vs 2nd', sentence: "If I ___ the exam, I'll celebrate. (real possibility)", options: ['pass', 'passed', 'would pass'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '2nd Cond', sentence: "If I ___ you, I'd apologize.", options: ['am', 'were', 'will be'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match conditional to meaning', pairs: [{ left: '1st Conditional', right: 'Real possibility' }, { left: '2nd Conditional', right: 'Unreal/dream' }, { left: 'If + Present', right: '→ will' }, { left: 'If + Past', right: '→ would' }] } },
                    { type: 'word-shuffle', data: { instruction: '2nd Conditional', words: ['would', 'I', 'travel', 'if', 'I', 'were', 'rich'], correct: ['I', 'would', 'travel', 'if', 'I', 'were', 'rich'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я мог летать, я бы полетел в Японию.', fromLang: 'RU', toLang: 'EN', answer: "If I could fly, I would fly to Japan" } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "If I had more free time, I would learn to play the piano.", hint: 'Second conditional: If + past, would + verb' } },
                    { type: 'speak-aloud', data: { instruction: 'Mix everything:', phrase: "I was working when my friend called. If I have time tomorrow, I'll visit her. If I were free today, I'd go right now." } }
                ]
            },
            // ── B1 Unit 11 ──
            {
                id: 11, title: 'Passive Voice: present & past', desc: 'is made / was built. Focus on the action.', unitType: 'grammar',
                grammar: ['Passive: present and past'], vocab: ['news', 'production', 'facts', 'history'],
                homework: { prompt: 'Write 8 passive sentences about your country.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Active: Someone DOES something. Passive: Something IS DONE. We use passive when WHO did it doesn't matter or is unknown.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Active vs Passive:", mascotEmotion: 'happy',
                        left: { label: 'Active (who?)', items: ['Toyota makes cars.', 'They built this bridge in 1990.', 'Someone stole my phone.'] },
                        right: { label: 'Passive (what happened?)', items: ['Cars are made by Toyota.', 'This bridge was built in 1990.', 'My phone was stolen.'] }
                    },
                    { type: 'examples', mascotText: "Formula: BE + V3 (past participle):", mascotEmotion: 'happy', items: [
                        { base: 'Present', past: "English is spoken worldwide.", highlight: 'is spoken' },
                        { base: 'Past', past: "The Eiffel Tower was built in 1889.", highlight: 'was built' },
                        { base: 'Negative', past: "The email wasn't sent.", highlight: "wasn't sent" },
                        { base: 'Question', past: "Was the window broken?", highlight: 'Was...broken' }
                    ] },
                    { type: 'quiz-check', mascotText: "'The Pyramids ___ built thousands of years ago.'", mascotEmotion: 'thinking', options: ['are', 'were', 'was'], correct: 1 },
                    { type: 'tip', mascotText: "When to use passive? 1) The agent is unknown: 'My bike was stolen.' 2) The agent is obvious: 'He was arrested.' (by police) 3) In formal/scientific texts: 'The experiment was conducted.'", mascotEmotion: 'happy', tipText: "Passive = focus on WHAT happened, not WHO did it" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Passive', sentence: 'English ___ spoken worldwide.', options: ['is', 'was', 'are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Past passive', sentence: 'This house ___ built in 1950.', options: ['is', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Passive', sentence: 'The cake ___ made by my grandmother.', options: ['is', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'V3', sentence: 'The window was ___.', options: ['break', 'broke', 'broken'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Present passive', sentence: 'Coffee ___ grown in Brazil.', options: ['is', 'was', 'are'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Active → Passive', pairs: [{ left: 'They make cars.', right: 'Cars are made.' }, { left: 'She wrote the book.', right: 'The book was written.' }, { left: 'They cancelled the flight.', right: 'The flight was cancelled.' }, { left: 'He painted the wall.', right: 'The wall was painted.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Passive', words: ['was', 'the', 'letter', 'written', 'by', 'hand'], correct: ['the', 'letter', 'was', 'written', 'by', 'hand'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Эта книга была написана в 1960 году.', fromLang: 'RU', toLang: 'EN', answer: 'This book was written in 1960' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "The Eiffel Tower was built in eighteen eighty-nine.", hint: 'Use digits for the year' } },
                    { type: 'speak-aloud', data: { instruction: 'Facts:', phrase: "English is spoken in many countries. The Eiffel Tower was built in 1889. Cars are made in many factories." } }
                ]
            },
            // ── B1 Unit 12 ──
            {
                id: 12, title: 'Past Perfect: before that', desc: 'had + V3 for earlier past events.', unitType: 'grammar',
                grammar: ['Past Perfect: had + V3'], vocab: ['books', 'films', 'stories', 'sequence'],
                homework: { prompt: 'Write a story using Past Perfect to show what happened first.' },
                teachSlides: [
                    { type: 'explain', mascotText: "Past Perfect = the PAST of the PAST. It shows what happened FIRST. 'When I arrived, she HAD already LEFT.' (she left first, I arrived second)", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Past Perfect (earlier) + Past Simple (later):", mascotEmotion: 'happy', items: [
                        { base: 'Sequence', past: "When I arrived, they had left.", highlight: 'had left (first)' },
                        { base: 'Experience', past: "I had never seen snow before I visited Russia.", highlight: 'had never seen' },
                        { base: 'Because', past: "She was tired because she hadn't slept.", highlight: "hadn't slept" },
                        { base: 'Before', past: "He had studied French before he moved to Paris.", highlight: 'had studied' }
                    ] },
                    { type: 'compare', mascotText: "Present Perfect vs Past Perfect — don't confuse them!", mascotEmotion: 'thinking',
                        left: { label: 'Present Perfect (past → now)', items: ["I've lost my keys. (still lost)", "She's lived here for 5 years. (still here)", 'have/has + V3'] },
                        right: { label: 'Past Perfect (past → earlier past)', items: ['I had lost my keys. (before another past event)', 'She had lived there for 5 years. (before she moved)', 'had + V3'] }
                    },
                    { type: 'quiz-check', mascotText: "'When we got to the cinema, the film ___ already ___.'", mascotEmotion: 'thinking', options: ['has / started', 'had / started', 'was / starting'], correct: 1 },
                    { type: 'tip', mascotText: "You only NEED Past Perfect when the sequence is unclear. 'I ate and then I left.' (clear order = PS+PS is fine). But: 'When I arrived, she had left.' (need PP to show she left FIRST).", mascotEmotion: 'happy', tipText: "Use Past Perfect when the order of events might be confusing without it." }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Past Perfect', sentence: 'When I arrived, they ___ left.', options: ['have', 'had', 'has'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: 'She was hungry because she ___ eaten all day.', options: ["hadn't", "hasn't", "didn't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PP', sentence: "I ___ never been abroad before that trip.", options: ['have', 'had', 'was'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'PP vs PS', sentence: 'By the time the taxi came, we ___ already ___.', options: ['have / left', 'had / left', 'were / leaving'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'What happened first?', pairs: [{ left: 'She had cooked dinner', right: '1st earlier (dinner)' }, { left: 'when he arrived.', right: '2nd later (arrival)' }, { left: 'I had studied French', right: '1st earlier (French)' }, { left: 'before I moved to Paris.', right: '2nd later (Paris)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Sequence', words: ['had', 'I', 'already', 'eaten', 'when', 'she', 'called'], correct: ['I', 'had', 'already', 'eaten', 'when', 'she', 'called'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Когда я пришёл, фильм уже начался.', fromLang: 'RU', toLang: 'EN', answer: 'When I arrived, the film had already started' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Она никогда не видела море до той поездки.', fromLang: 'RU', toLang: 'EN', answer: 'She had never seen the sea before that trip' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "By the time we arrived, the concert had already started.", hint: 'Past Perfect: had + V3' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell a story:', phrase: "When I got to the airport, my flight had already left. I had forgotten to check the time." } }
                ]
            },
            // ── B1 Unit 13 ──
            { id: 13, title: 'Reported Speech', desc: 'He said... She told me... Backshift.', unitType: 'grammar', grammar: ['Reported Speech: statements'], vocab: ['say vs tell', 'retelling'], homework: { prompt: 'Report 5 things people told you today.' }, teachSlides: [{ type: 'explain', mascotText: "Reported Speech = retelling what someone said. 'She SAID she WAS tired.' Notice: the tenses shift back! Present → Past, Past → Past Perfect.", mascotEmotion: 'happy' }, { type: 'compare', mascotText: "Tense shift (backshift):", mascotEmotion: 'happy', left: { label: 'Direct', items: ['"I am tired."', '"I like pizza."', '"I went home."', '"I will help."'] }, right: { label: 'Reported', items: ['She said she was tired.', 'He said he liked pizza.', 'She said she had gone home.', 'He said he would help.'] } }, { type: 'examples', mascotText: "SAY vs TELL:", mascotEmotion: 'thinking', items: [{ base: 'say', past: "She said (that) she was happy.", highlight: 'said' }, { base: 'tell', past: "She told me (that) she was happy.", highlight: 'told me' }, { base: 'say ≠ person', past: "❌ She said me...", highlight: 'WRONG' }, { base: 'tell = person', past: "✅ She told me...", highlight: 'RIGHT' }] }, { type: 'quiz-check', mascotText: "He said: 'I am busy.' → He said he ___ busy.", mascotEmotion: 'thinking', options: ['is', 'was', 'were'], correct: 1 }], exercises: [{ type: 'fill-bubble', data: { instruction: 'Reported', sentence: 'She said she ___ tired.', options: ['is', 'was', 'were'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'say vs tell', sentence: 'He ___ me he would come.', options: ['said', 'told', 'spoke'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Backshift', sentence: '"I will help." → He said he ___ help.', options: ['will', 'would', 'can'], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Backshift', sentence: '"I have been to Paris." → She said she ___ been to Paris.', options: ['has', 'had', 'have'], correct: 1 } }, { type: 'type-translation', data: { instruction: 'Translate to reported', sourceText: 'Она сказала, что она устала.', fromLang: 'RU', toLang: 'EN', answer: 'She said she was tired' } }, { type: 'speak-aloud', data: { instruction: 'Report:', phrase: "My friend told me he was moving to London. She said she had found a new job." } }] },
            // ── B1 Unit 14 ──
            { id: 14, title: '🗣️ Retelling news & gossip', desc: 'Reported Speech in real conversations.', unitType: 'situational', grammar: ['Reported Speech in context'], vocab: ['news phrases', 'gossip', 'social'], homework: { prompt: 'Watch/read the news and report 5 stories using reported speech.' }, teachSlides: [{ type: 'explain', mascotText: "Let's use reported speech like real people! Telling friends news, gossip, messages from others — this is where reported speech lives.", mascotEmotion: 'happy' }, { type: 'examples', mascotText: "Real-life reported speech:", mascotEmotion: 'happy', items: [{ base: 'News', past: "The president said the economy was improving.", highlight: 'said' }, { base: 'Gossip', past: "She told me he had broken up with his girlfriend.", highlight: 'told me' }, { base: 'Message', past: "Your mom called. She said she would be late.", highlight: 'said' }] }, { type: 'quiz-check', mascotText: "Your boss emails: 'The meeting is cancelled.' You tell a colleague:", mascotEmotion: 'thinking', options: ["The boss said the meeting was cancelled.", "The boss said the meeting is cancel.", "The boss told the meeting was cancelled."], correct: 0 }], exercises: [{ type: 'fill-bubble', data: { instruction: 'Report', sentence: 'He told me he ___ the movie.', options: ['liked', 'likes', 'like'], correct: 0 } }, { type: 'fill-bubble', data: { instruction: 'News', sentence: 'The police said they ___ the suspect.', options: ['caught', 'had caught', 'catch'], correct: 1 } }, { type: 'type-translation', data: { instruction: 'Report', sourceText: 'Мама сказала, что будет поздно.', fromLang: 'RU', toLang: 'EN', answer: 'Mom said she would be late' } }, { type: 'word-shuffle', data: { instruction: 'Report', words: ['said', 'she', 'she', 'was', 'moving', 'to', 'London'], correct: ['she', 'said', 'she', 'was', 'moving', 'to', 'London'] } }, { type: 'speak-aloud', data: { instruction: 'Report news:', phrase: "The news said it would rain tomorrow. My friend told me she had got a new job. The doctor said I should rest more." } }] },
            // ── B1 Unit 15 ──
            { id: 15, title: "Modals: must / have to / don't have to", desc: 'Obligation, necessity, no obligation.', unitType: 'grammar', grammar: ['must/have to/don\'t have to/mustn\'t'], vocab: ['rules', 'laws', 'work', 'school'], homework: { prompt: 'Write the rules of your school/workplace using must and have to.' }, teachSlides: [{ type: 'explain', mascotText: "MUST and HAVE TO both mean obligation, but they're slightly different. MUSTN'T = prohibited. DON'T HAVE TO = not necessary (choice).", mascotEmotion: 'happy' }, { type: 'compare', mascotText: "The critical difference:", mascotEmotion: 'happy', left: { label: "MUSTN'T (forbidden!)", items: ["You mustn't smoke here.", "You mustn't cheat.", '= It is PROHIBITED'] }, right: { label: "DON'T HAVE TO (it's OK)", items: ["You don't have to wear a tie.", "You don't have to come early.", '= It is NOT NECESSARY'] } }, { type: 'quiz-check', mascotText: "'You ___ wear a seatbelt. It's the law.'", mascotEmotion: 'thinking', options: ['must', "don't have to", "mustn't"], correct: 0 }, { type: 'tip', mascotText: "Must = personal/internal obligation. Have to = external rule. But in practice, they're almost interchangeable!", mascotEmotion: 'happy', tipText: "I must study = I feel I should · I have to study = someone/something requires me to" }], exercises: [{ type: 'fill-bubble', data: { instruction: 'Obligation', sentence: 'You ___ wear a uniform at school.', options: ['must', 'mustn\'t', "don't have to"], correct: 0 } }, { type: 'fill-bubble', data: { instruction: 'Forbidden', sentence: "You ___ use your phone during the test.", options: ['must', "mustn't", "don't have to"], correct: 1 } }, { type: 'fill-bubble', data: { instruction: 'Not necessary', sentence: "You ___ come if you're busy. It's optional.", options: ['must', "mustn't", "don't have to"], correct: 2 } }, { type: 'fill-bubble', data: { instruction: 'have to', sentence: 'She ___ to get up early for work.', options: ['must', 'has', 'have'], correct: 1 } }, { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Тебе не нужно приходить завтра.', fromLang: 'RU', toLang: 'EN', answer: "You don't have to come tomorrow" } }, { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Здесь нельзя курить.', fromLang: 'RU', toLang: 'EN', answer: "You mustn't smoke here" } }, { type: 'speak-aloud', data: { instruction: 'Rules:', phrase: "You must wear a seatbelt. You mustn't use your phone while driving. You don't have to tip, but it's nice." } }] },
            // ── B1 Unit 16 ──
            {
                id: 16, title: '🔄 Final Checkpoint B1', desc: 'Full B1 review — all grammar and skills.', unitType: 'review',
                grammar: ['all B1 grammar'], vocab: ['all B1 vocab'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'PP + for/since', sentence: "I've lived here ___ 2018.", options: ['for', 'since', 'from'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '1st Cond', sentence: "If she ___, she'll pass.", options: ['studies', 'will study', 'studied'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '2nd Cond', sentence: 'If I were rich, I ___ buy a yacht.', options: ['will', 'would', 'can'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Passive', sentence: 'The book ___ written in 1984.', options: ['is', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past Perfect', sentence: 'When I arrived, the train ___ left.', options: ['has', 'had', 'was'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Reported', sentence: 'He said he ___ busy.', options: ['is', 'was', 'were'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Modals', sentence: "You ___ park here. It's illegal.", options: ['must', "mustn't", "don't have to"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Inf/Ger', sentence: 'He promised ___ on time.', options: ['to be', 'being', 'be'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'PC + PS', sentence: 'While she ___ dinner, the doorbell rang.', options: ['cooked', 'was cooking', 'cooks'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match grammar to example', pairs: [{ left: 'Present Perfect', right: "I've lived here for 5 years." }, { left: '1st Conditional', right: "If it rains, I'll stay home." }, { left: '2nd Conditional', right: "If I were you, I'd study." }, { left: 'Passive Voice', right: 'The letter was sent.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Reported speech', words: ['said', 'she', 'she', 'was', 'tired'], correct: ['she', 'said', 'she', 'was', 'tired'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я знал раньше, я бы помог.', fromLang: 'RU', toLang: 'EN', answer: "If I had known, I would have helped" } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Эта картина была нарисована в 19 веке.', fromLang: 'RU', toLang: 'EN', answer: 'This painting was painted in the 19th century' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She told me she had already finished the project.", hint: 'Reported speech with Past Perfect' } },
                    { type: 'speak-aloud', data: { instruction: 'B1 graduation:', phrase: "I've studied English for a long time. If I keep practicing, I'll be fluent soon. My teacher said I was making great progress!" } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // B2 — UPPER-INTERMEDIATE (14 units)
    // ═══════════════════════════════════════════
    {
        id: 'b2_upper',
        language: 'en',
        title: 'B2 — Upper-Intermediate',
        level: 'B2',
        cefr: 'B2',
        methodology: 'CEFR B2 Vantage. Advanced question types, narrative tenses, mixed conditionals, wish/regret, advanced gerund/infinitive, used to vs get used to. Formal register and business communication. ~4200 cumulative vocabulary.',
        canDo: [
            'Can understand the main ideas of complex text on both concrete and abstract topics',
            'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible',
            'Can produce clear, detailed text on a wide range of subjects',
            'Can explain a viewpoint on a topical issue giving advantages and disadvantages',
            'Can use indirect and tag questions for politeness and emphasis',
            'Can use all conditional forms including mixed conditionals',
            'Can express wishes and regrets about the present and past',
            'Can write formal emails and business communications',
        ],
        objectives: [
            'Indirect, tag, and subject questions',
            'Narrative tenses for storytelling',
            'Future forms: full overview and precision',
            'Second, Third, and Mixed Conditionals',
            'Wish + Past / Past Perfect for regrets',
            'Gerund vs infinitive: advanced meaning changes',
            'Used to vs be/get used to',
            'Advanced reported speech with reporting verbs',
            'Articles (a/the/zero): mastering exceptions',
            'Formal vs informal register',
            'Situational: formal communications, debates, presentations',
        ],
        units: [
            // ── B2 Unit 1 ──
            {
                id: 1, title: 'All question types', desc: 'Indirect, tag, and subject questions.', unitType: 'grammar',
                grammar: ['indirect questions', 'tag questions', 'subject questions'], vocab: ['inquiries', 'workplaces', 'politeness'],
                homework: { prompt: "Write 5 polite indirect questions for a job interview." },
                teachSlides: [
                    { type: 'explain', mascotText: "Welcome to B2! We're starting with advanced questions. Indirect questions are much more polite: 'Could you tell me...' instead of a direct demand.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Notice the word order. Indirect questions DON'T use 'do/does/did'!", mascotEmotion: 'thinking', left: { label: 'Direct', items: ["Where is the station?", "When does it open?", "What did she say?"] }, right: { label: 'Indirect', items: ["Do you know where the station is?", "Could you tell me when it opens?", "I wonder what she said."] } },
                    { type: 'explain', mascotText: "Tag questions are mini-questions at the end. They check if something is true. Positive sentence -> Negative tag. Negative sentence -> Positive tag.", mascotEmotion: 'happy' },
                    { type: 'explain', mascotText: "Subject questions don't need 'do/does/did' because the question word IS the subject! 'Who broke the window?' NOT 'Who did break the window?'", mascotEmotion: 'thinking' },
                    { type: 'quiz-check', mascotText: "'You like coffee, ___ you?'", mascotEmotion: 'thinking', options: ["don't", 'do', "aren't"], correct: 0 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Indirect', sentence: 'Do you know where ___?', options: ['the bank is', 'is the bank'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Indirect', sentence: 'Could you tell me how ___?', options: ['this works', 'does this work'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag', sentence: "You've finished the report, ___ you?", options: ["haven't", "didn't", "don't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag', sentence: "They will arrive soon, ___ they?", options: ["won't", "aren't", "don't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag', sentence: "She doesn't like sushi, ___ she?", options: ['does', "doesn't", 'is'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Subject Q', sentence: '___ invented the telephone?', options: ['Who did', 'Who'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Indirect', sentence: 'I was wondering ___ you could help me.', options: ['if', 'do'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Direct → Indirect', pairs: [{ left: 'Where is she?', right: 'Do you know where she is?' }, { left: 'What time is it?', right: 'Could you tell me what time it is?' }, { left: 'Does he work here?', right: 'Do you know if he works here?' }, { left: 'Who called?', right: 'Do you know who called?' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Indirect', words: ['me', 'could', 'how', 'tell', 'works', 'you', 'this'], correct: ['could', 'you', 'tell', 'me', 'how', 'this', 'works'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ты не знаешь, где она живёт?', fromLang: 'RU', toLang: 'EN', answer: 'Do you know where she lives' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Could you tell me where the nearest pharmacy is?", hint: 'Indirect question — no do/does' } },
                    { type: 'speak-aloud', data: { instruction: 'Polite inquiry:', phrase: "Excuse me, could you tell me where the nearest station is? You work here, don't you?" } }
                ]
            },
            // ── B2 Unit 2 ──
            {
                id: 2, title: 'Narrative Tenses', desc: 'Telling stories like a native.', unitType: 'grammar',
                grammar: ['past simple', 'past continuous', 'past perfect'], vocab: ['anecdotes', 'travel', 'sequencing'],
                homework: { prompt: "Write a short story about a past trip using all three narrative tenses." },
                teachSlides: [
                    { type: 'explain', mascotText: "To tell a great story, mix three past tenses: Past Simple (action), Past Continuous (background), Past Perfect (what happened earlier).", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Watch them work together in one sentence:", mascotEmotion: 'thinking', items: [{ base: 'Background', past: "The sun was shining.", highlight: 'Past Continuous' }, { base: 'Earlier event', past: "We had packed our bags.", highlight: 'Past Perfect' }, { base: 'Main action', past: "So we went to the beach.", highlight: 'Past Simple' }] },
                    { type: 'compare', mascotText: "Each tense plays a different role in stories:", mascotEmotion: 'happy', left: { label: 'Tense', items: ['Past Simple', 'Past Continuous', 'Past Perfect'] }, right: { label: 'Story Role', items: ['Main events (what happened)', 'Background scene (atmosphere)', 'Earlier events (context)'] } },
                    { type: 'tip', mascotText: "Native speakers START stories with Past Continuous for atmosphere: 'I was sitting in a café when...' — this pulls the listener into the scene.", mascotEmotion: 'happy', tipText: "Story opener: Past Continuous (scene) → Past Simple (action) → Past Perfect (backstory)" },
                    { type: 'quiz-check', mascotText: "'When we arrived, the movie ___.' (it started before we got there)", mascotEmotion: 'thinking', options: ['started', 'had started', 'was starting'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: 'While I ___ home, I found a wallet.', options: ['was walking', 'walked', 'had walked'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: 'When we got to the station, the train ___ left.', options: ['has', 'had', 'was'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: 'I couldn\'t pay because I ___ my wallet at home.', options: ['left', 'had left', 'was leaving'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Background', sentence: 'It ___ heavily, so we decided to stay inside.', options: ['rained', 'was raining', 'had rained'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Sequence', sentence: 'She ___ dinner before the guests arrived.', options: ['cooked', 'had cooked', 'was cooking'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Tense → Story Role', pairs: [{ left: 'Past Simple', right: 'Main events' }, { left: 'Past Continuous', right: 'Background/atmosphere' }, { left: 'Past Perfect', right: 'Earlier events' }, { left: 'It was raining when...', right: 'Scene + interruption' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Story', words: ['had', 'started', 'arrived', 'the', 'already', 'we', 'when', 'game'], correct: ['when', 'we', 'arrived', 'the', 'game', 'had', 'already', 'started'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Шел дождь, когда я проснулся.', fromLang: 'RU', toLang: 'EN', answer: 'It was raining when I woke up' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I was having dinner when someone knocked on the door.", hint: 'Past Continuous + Past Simple' } },
                    { type: 'speak-aloud', data: { instruction: 'Tell a story:', phrase: "I was sleeping peacefully when the phone rang. Someone had dialed the wrong number. I was furious." } }
                ]
            },
            // ── B2 Unit 3 ──
            {
                id: 3, title: 'Future forms overview', desc: 'Precision in predicting the future.', unitType: 'grammar',
                grammar: ['will', 'going to', 'future continuous', 'future perfect'], vocab: ['predictions', 'deadlines', 'career planning'],
                homework: { prompt: "Where will you be and what will you have achieved by 2030?" },
                teachSlides: [
                    { type: 'explain', mascotText: "Native speakers use many futures! 'Will' for sudden decisions/predictions. 'Going to' for evidence-based plans. Now let's add Future Continuous and Future Perfect.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "All four future forms:", mascotEmotion: 'thinking', left: { label: 'Form', items: ['will + verb', 'going to + verb', 'will be + -ing', 'will have + V3'] }, right: { label: 'Use', items: ['Prediction / spontaneous decision', 'Planned intention / evidence', 'Action in progress at future time', 'Action completed before future deadline'] } },
                    { type: 'examples', mascotText: "Future Continuous vs Future Perfect in real life:", mascotEmotion: 'happy', items: [{ base: 'In progress', past: "At 9 PM, I'll be watching the match.", highlight: 'will be + -ing' }, { base: 'Completed', past: "By 9 PM, I'll have finished dinner.", highlight: 'will have + V3' }, { base: 'Polite', past: "Will you be attending the meeting?", highlight: 'Polite future question' }] },
                    { type: 'tip', mascotText: "Future Continuous is also used for POLITE questions in formal settings: 'Will you be joining us?' is softer than 'Are you coming?'", mascotEmotion: 'happy', tipText: "Polite: Will you be...? vs Direct: Are you going to...?" },
                    { type: 'quiz-check', mascotText: "'By 5 PM, I ___ my work.'", mascotEmotion: 'thinking', options: ['will finish', 'will have finished', 'will be finishing'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Prediction', sentence: "I think it ___ rain tomorrow.", options: ['will', 'is going to'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Evidence', sentence: "Look at those clouds! It ___ rain.", options: ['will', 'is going to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Cont', sentence: "This time tomorrow, I ___ on the beach.", options: ['will sit', 'will be sitting', 'will have sat'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Perf', sentence: "By Friday, I ___ written the report.", options: ['will', 'will have', 'will be'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Polite', sentence: '___ you be attending the conference next week?', options: ['Will', 'Do', 'Are'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Perf', sentence: 'By the time she arrives, we ___ already eaten.', options: ['will have', 'will be', 'are going to'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Future Form → Use', pairs: [{ left: 'will + verb', right: 'Prediction/decision' }, { left: 'going to', right: 'Plans/evidence' }, { left: 'will be + -ing', right: 'In progress at future time' }, { left: 'will have + V3', right: 'Completed before deadline' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Deadline', words: ['by', 'have', 'graduated', 'I', 'will', 'next', 'year'], correct: ['by', 'next', 'year', 'I', 'will', 'have', 'graduated'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'К завтрашнему дню я закончу эту книгу.', fromLang: 'RU', toLang: 'EN', answer: 'By tomorrow I will have finished this book' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "This time next month, I will be living in a new city.", hint: 'Future Continuous: will be + -ing' } },
                    { type: 'speak-aloud', data: { instruction: 'Future goals:', phrase: "By next month, I will have completed this project. This time next week, I'll be celebrating my promotion." } }
                ]
            },
            // ── B2 Unit 4 ──
            {
                id: 4, title: '🗣️ Formal communications', desc: 'Business emails and register.', unitType: 'situational',
                grammar: ['formal structures', 'passive voice'], vocab: ['moreover', 'furthermore', 'enquire'],
                homework: { prompt: "Write a formal email applying for a job." },
                teachSlides: [
                    { type: 'explain', mascotText: "In business, you must shift your 'register' (tone) to formal. It shows professionalism and respect.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Informal vs Formal:", mascotEmotion: 'thinking', left: { label: 'Informal (Friends)', items: ["I want to ask...", "Can you fix this?", "Also,...", "Best,"] }, right: { label: 'Formal (Business)', items: ["I am writing to enquire...", "Could this be resolved?", "Furthermore,...", "Best regards,"] } },
                    { type: 'quiz-check', mascotText: "Formal ending to an email starting with 'Dear Sir/Madam':", mascotEmotion: 'thinking', options: ['Yours sincerely', 'Yours faithfully', 'Best wishes'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Formal Vocab', sentence: "I am writing to ___ about the job opening.", options: ['ask', 'enquire'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Formal Request', sentence: "I would be ___ if you could send the details.", options: ['happy', 'grateful'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Linkers', sentence: "The service was excellent. ___, the price was reasonable.", options: ['Furthermore', 'Plus'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Closing', sentence: "I look forward to ___ from you.", options: ['hear', 'hearing'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Register', sentence: "I am writing to ___ my dissatisfaction with the service.", options: ['say about', 'express'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Informal → Formal', pairs: [{ left: 'I want to know...', right: 'I am writing to enquire...' }, { left: 'Can you help?', right: 'I would appreciate your assistance.' }, { left: 'Thanks', right: 'I am most grateful.' }, { left: 'Also,...', right: 'Furthermore,...' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Apology', words: ['the', 'for', 'apologize', 'inconvenience', 'we', 'caused'], correct: ['we', 'apologize', 'for', 'the', 'inconvenience', 'caused'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Пожалуйста, свяжитесь со мной для дальнейшей информации.', fromLang: 'RU', toLang: 'EN', answer: 'Please contact me for further information' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I would be grateful if you could forward the documents at your earliest convenience.", hint: 'Formal request structure' } },
                    { type: 'speak-aloud', data: { instruction: 'Professional:', phrase: "Dear Sir or Madam, I am writing to enquire about the position advertised. I look forward to hearing from you." } }
                ]
            },
            // ── B2 Unit 5 ──
            {
                id: 5, title: '🔄 Checkpoint 1', desc: 'Review B2 Units 1-4.', unitType: 'review',
                grammar: ['questions', 'narrative tenses', 'futures', 'formal'], vocab: ['B2 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Indirect', sentence: "Do you know where ___?", options: ['is he', 'he is'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag', sentence: "You're ready, ___ you?", options: ["aren't", "don't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag', sentence: "He can swim, ___ he?", options: ["can't", "doesn't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: "When I arrived, the meeting ___ finished.", options: ['has', 'had'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: "While they ___ dinner, the lights went out.", options: ['had', 'were having'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Perf', sentence: "By 2040, people ___ landed on Mars.", options: ['will', 'will have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Cont', sentence: "This time tomorrow, we ___ across the Atlantic.", options: ['will fly', 'will be flying'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Formal', sentence: "I am writing to express my ___ with the service.", options: ['sadness', 'dissatisfaction'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Grammar → Example', pairs: [{ left: 'Indirect question', right: 'Do you know where he is?' }, { left: 'Tag question', right: "She's French, isn't she?" }, { left: 'Future Perfect', right: "By June, I'll have graduated." }, { left: 'Formal register', right: 'I would be grateful if...' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Indirect Q', words: ['tell', 'you', 'me', 'time', 'could', 'it', 'what', 'is'], correct: ['could', 'you', 'tell', 'me', 'what', 'time', 'it', 'is'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'К пятнице я закончу этот отчет.', fromLang: 'RU', toLang: 'EN', answer: 'By Friday I will have finished this report' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I was wondering if you could tell me where the conference room is.", hint: 'Indirect question with I was wondering' } },
                    { type: 'speak-aloud', data: { instruction: 'B2 Review:', phrase: "Could you tell me when the meeting starts? By then, I will have prepared all the documents." } }
                ]
            },
            // ── B2 Unit 6 ──
            {
                id: 6, title: 'Conditionals: 2nd, 3rd & Mixed', desc: 'Advanced hypotheticals.', unitType: 'grammar',
                grammar: ['3rd conditional', 'mixed conditionals'], vocab: ['regrets', 'consequences'],
                homework: { prompt: "Write 3 things that would be different now if you hadn't learned English." },
                teachSlides: [
                    { type: 'explain', mascotText: "Second conditional = UNREAL Present. Third conditional = UNREAL Past (regrets). To form the 3rd: If + Past Perfect, ... would have + V3.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Third conditional examples:", mascotEmotion: 'thinking', items: [{ base: 'Regret', past: "If I had studied, I would have passed.", highlight: 'had studied / would have passed' }, { base: 'Relief', past: "If we hadn't run, we would have missed the train.", highlight: "hadn't run / would have missed" }] },
                    { type: 'explain', mascotText: "MIXED conditionals combine the tenses! If + Past Perfect, ... would + verb (no 'have'). 'If I had taken that job, I would be rich now.' Past condition → present result.", mascotEmotion: 'thinking' },
                    { type: 'compare', mascotText: "3rd vs Mixed:", mascotEmotion: 'happy', left: { label: '3rd (past result)', items: ["If I had left earlier, I would have caught the train."] }, right: { label: 'Mixed (present result)', items: ["If I had left earlier, I wouldn't be so late now."] } },
                    { type: 'quiz-check', mascotText: "'If I ___ her address, I would have sent an invitation.'", mascotEmotion: 'thinking', options: ['knew', 'had known'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "If I ___ the alarm, I would have woken up.", options: ['heard', 'had heard'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "She ___ passed the test if she had studied.", options: ['would', 'would have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Mixed', sentence: "If I ___ (not/lose) my keys yesterday, I wouldn't be locked out now.", options: ["didn't lose", "hadn't lost"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "We ___ the game if we had practised more.", options: ['would win', 'would have won'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Mixed', sentence: "If she had accepted the offer, she ___ in Paris now.", options: ['would have lived', 'would be living'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Condition → Result', pairs: [{ left: 'If I had studied (3rd)', right: 'I would have passed' }, { left: 'If I had studied (mixed)', right: 'I would know the answer now' }, { left: 'If I were rich (2nd)', right: 'I would buy a yacht' }, { left: "If it hadn't rained", right: 'We would have had a picnic' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Regret', words: ['would', 'I', 'helped', 'have', 'I', 'if', 'known', 'had'], correct: ['I', 'would', 'have', 'helped', 'if', 'I', 'had', 'known'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я знал, я бы не пришел.', fromLang: 'RU', toLang: 'EN', answer: 'If I had known, I would not have come' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "If we had booked earlier, we wouldn't be staying in this terrible hotel now.", hint: 'Mixed conditional: past condition → present result' } },
                    { type: 'speak-aloud', data: { instruction: 'Regrets:', phrase: "If I had left earlier, I wouldn't have missed the flight. If I had studied abroad, I would speak French fluently now." } }
                ]
            },
            // ── B2 Unit 7 ──
            {
                id: 7, title: 'Wish + Past / Past Perfect', desc: 'Expressing desires and regrets.', unitType: 'grammar',
                grammar: ['wish + past', 'wish + past perfect'], vocab: ['wishes', 'disappointments'],
                homework: { prompt: "Write 5 sentences starting with 'I wish...'" },
                teachSlides: [
                    { type: 'explain', mascotText: "'I wish' works exactly like Conditionals! 'I wish I had a car' (I don't have one now). 'I wish I had studied' (I didn't study in the past).", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Notice the tense shift:", mascotEmotion: 'thinking', left: { label: 'Current Reality', items: ["I am not tall.", "I didn't save money.", "My neighbour plays loud music."] }, right: { label: 'The Wish', items: ["I wish I WERE tall.", "I wish I HAD SAVED money.", "I wish he WOULD stop."] } },
                    { type: 'tip', mascotText: "Three wish patterns: (1) wish + Past Simple = unreal present, (2) wish + Past Perfect = past regret, (3) wish + would = annoying habits or complaints.", mascotEmotion: 'happy', tipText: "wish + Past = now | wish + Past Perfect = then | wish + would = complaint" },
                    { type: 'quiz-check', mascotText: "It's raining now. 'I wish it ___ raining.'", mascotEmotion: 'thinking', options: ['stops', 'stopped', 'would stop'], correct: 2 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Present wish', sentence: "I don't have time. I wish I ___ more time.", options: ['have', 'had', 'had had'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past regret', sentence: "I failed the test. I wish I ___ harder.", options: ['studied', 'had studied'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Annoyance', sentence: "He's always late. I wish he ___ on time.", options: ['was', 'would be'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Present wish', sentence: "It's freezing. I wish I ___ a warmer coat.", options: ['have', 'had'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past regret', sentence: "She missed the party. She wishes she ___ about it.", options: ['knew', 'had known'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Wish type → Example', pairs: [{ left: 'wish + Past Simple', right: 'I wish I were taller.' }, { left: 'wish + Past Perfect', right: 'I wish I had studied.' }, { left: 'wish + would', right: 'I wish it would stop raining.' }, { left: 'If only + Past', right: 'If only I could fly!' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Regret', words: ['wish', 'had', 'earlier', 'I', 'left', 'I'], correct: ['I', 'wish', 'I', 'had', 'left', 'earlier'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я бы хотел быть богатым.', fromLang: 'RU', toLang: 'EN', answer: 'I wish I were rich' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I wish I hadn't said that. It was a terrible mistake.", hint: 'wish + Past Perfect for past regret' } },
                    { type: 'speak-aloud', data: { instruction: 'Express regrets:', phrase: "I wish I hadn't eaten so much cake. Now my stomach hurts. I wish I were more careful." } }
                ]
            },
            // ── B2 Unit 8 ──
            {
                id: 8, title: 'Gerund vs Infinitive: Advanced', desc: 'When the meaning changes.', unitType: 'grammar',
                grammar: ['stop', 'remember', 'try', 'regret'], vocab: ['memories', 'attempts'],
                homework: { prompt: "Use 'remember doing' and 'remember to do' in sentences about your day." },
                teachSlides: [
                    { type: 'explain', mascotText: "Some verbs take both gerund (-ing) and infinitive (to do), but the MEANING changes completely! Verbs like stop, remember, and try.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Stop taking vs stop to take:", mascotEmotion: 'thinking', items: [{ base: 'Stop + ING', past: "He stopped smoking. (He quit the habit)", highlight: 'quit habit' }, { base: 'Stop + TO', past: "He stopped to smoke. (paused walking to have a cigarette)", highlight: 'paused to do' }] },
                    { type: 'examples', mascotText: "Remember doing vs to do:", mascotEmotion: 'thinking', items: [{ base: 'Remember + ING', past: "I remember closing the door. (Memory of the past)", highlight: 'past memory' }, { base: 'Remember + TO', past: "Please remember to close the door. (Don't forget!)", highlight: "don't forget" }] },
                    { type: 'quiz-check', mascotText: "I'll never forget ___ my wife for the first time.", mascotEmotion: 'thinking', options: ['to meet', 'meeting'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Stop', sentence: "Please stop ___ noise. I'm working.", options: ['making', 'to make'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Stop', sentence: "We drove for hours, so we stopped ___ a coffee.", options: ['having', 'to have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Remember', sentence: "Did you remember ___ the milk?", options: ['buying', 'to buy'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Try', sentence: "I tried ___ the window, but it was stuck completely.", options: ['opening', 'to open'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Forget', sentence: "I'll never forget ___ the Northern Lights for the first time.", options: ['to see', 'seeing'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Regret', sentence: "I regret ___ you that the position has been filled.", options: ['to inform', 'informing'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Verb + ING vs TO', pairs: [{ left: 'stop + ING', right: 'quit the action' }, { left: 'stop + TO', right: 'pause to do something' }, { left: 'remember + ING', right: 'memory of past' }, { left: 'remember + TO', right: "don't forget to do" }] } },
                    { type: 'word-shuffle', data: { instruction: 'Memory', words: ['visiting', 'remember', 'I', 'Paris'], correct: ['I', 'remember', 'visiting', 'Paris'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я перестал курить в прошлом году.', fromLang: 'RU', toLang: 'EN', answer: 'I stopped smoking last year' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Remember to lock the door before you leave tonight.", hint: "remember + TO = don't forget" } },
                    { type: 'speak-aloud', data: { instruction: 'Advice:', phrase: "Please remember to lock the door. I remember leaving it open once, and someone broke in." } }
                ]
            },
            // ── B2 Unit 9 ──
            {
                id: 9, title: 'Used to vs Be/Get used to', desc: 'Habits vs adaptation.', unitType: 'grammar',
                grammar: ['used to', 'be used to', 'get used to'], vocab: ['lifestyle changes', 'habits'],
                homework: { prompt: "Write about a big change in your life using get used to." },
                teachSlides: [
                    { type: 'explain', mascotText: "These look similar but are totally different! 'Used to' = past habit. 'Be used to' = I am accustomed to it. 'Get used to' = the process of adapting.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "The formulas:", mascotEmotion: 'thinking', left: { label: 'Used to + Verb', items: ["I used to live in London. (but not anymore)", "She didn't use to eat meat."] }, right: { label: 'Be/Get used to + Noun/ING', items: ["I am used to waking up early.", "I am getting used to the cold weather."] } },
                    { type: 'quiz-check', mascotText: "I've lived here for years, so I ___ the noise.", mascotEmotion: 'thinking', options: ['used to', 'am used to'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Past habit', sentence: "I ___ play tennis when I was younger.", options: ['used to', 'am used to', 'get used to'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Accustomed', sentence: "He is a chef. He ___ cooking for 100 people.", options: ['used to', 'is used to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Process', sentence: "The new software is hard, but I will ___ it.", options: ['use to', 'get used to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: "I ___ like spicy food, but now I love it.", options: ["didn't use to", "am not used to"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Accustomed', sentence: "After 3 years in Japan, I ___ eating with chopsticks.", options: ['used to', 'am used to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Process', sentence: "It took me months to ___ working night shifts.", options: ['use to', 'get used to'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Form → Meaning', pairs: [{ left: 'used to + verb', right: 'Past habit (not anymore)' }, { left: 'be used to + -ing', right: 'Accustomed to (comfortable)' }, { left: 'get used to + -ing', right: 'Process of adapting' }, { left: "didn't use to", right: 'Past negative habit' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Habit', words: ['to', 'I', 'early', 'getting', 'am', 'used', 'waking', 'up'], correct: ['I', 'am', 'getting', 'used', 'to', 'waking', 'up', 'early'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я привык к этому климату.', fromLang: 'RU', toLang: 'EN', answer: 'I am used to this climate' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I didn't use to enjoy cooking, but now I'm completely used to making dinner every evening.", hint: 'used to (past) vs be used to (now)' } },
                    { type: 'speak-aloud', data: { instruction: 'Adaptation:', phrase: "I used to hate coffee, but now I'm entirely used to drinking it every morning. It took me a while to get used to the bitter taste." } }
                ]
            },
            // ── B2 Unit 10 ──
            {
                id: 10, title: '🔄 Checkpoint 2', desc: 'Review B2 Units 6-9.', unitType: 'review',
                grammar: ['3rd conditional', 'wish', 'gerunds', 'used to'], vocab: ['B2 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "If she had called, I ___ answered.", options: ['would', 'would have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "If I ___ the alarm, I wouldn't have been late.", options: ['heard', 'had heard'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Wish', sentence: "I have no money. I wish I ___ rich.", options: ['am', 'were', 'had been'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past regret', sentence: "I failed the test. I wish I ___ harder.", options: ['studied', 'had studied'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Stop', sentence: "He stopped ___ (quit) because it was bad for him.", options: ['smoking', 'to smoke'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Remember', sentence: "Remember ___ the lights when you leave.", options: ['turning off', 'to turn off'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Used to', sentence: "I can't sleep. I ___ the traffic noise.", options: ["didn't use to", "am not used to"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Past habit', sentence: "She ___ play tennis when she was younger.", options: ['used to', 'is used to'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Grammar → Meaning', pairs: [{ left: '3rd Conditional', right: 'Unreal past (regret)' }, { left: 'I wish + Past', right: 'Unreal present desire' }, { left: 'I wish + Past Perfect', right: 'Regret about past' }, { left: 'Used to + verb', right: 'Past habit (no longer)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Regret', words: ['known', 'had', 'helped', 'I', 'would', 'if', 'have', 'I'], correct: ['if', 'I', 'had', 'known', 'I', 'would', 'have', 'helped'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я знал, я бы помог.', fromLang: 'RU', toLang: 'EN', answer: 'If I had known, I would have helped' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I wish I had studied harder when I was at university.", hint: 'Wish + Past Perfect for past regrets' } },
                    { type: 'speak-aloud', data: { instruction: 'Express regret:', phrase: "If I had left earlier, I wouldn't have missed the flight. I wish I had checked the time." } }
                ]
            },
            // ── B2 Unit 11 ──
            {
                id: 11, title: 'Reported Speech: Advanced', desc: 'Commands, questions, and reporting verbs.', unitType: 'grammar',
                grammar: ['reported questions', 'reporting verbs'], vocab: ['deny', 'promise', 'warn'],
                homework: { prompt: "Report 3 questions and 2 warnings someone gave you recently." },
                teachSlides: [
                    { type: 'explain', mascotText: "Reporting questions is tricky! The word order changes back to normal (Subject + Verb), and we drop 'do/does/did'.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Reporting Questions:", mascotEmotion: 'thinking', items: [{ base: 'Direct', past: "'Where do you live?'", highlight: 'Question order' }, { base: 'Reported', past: "She asked me where I lived.", highlight: 'Normal order + backshift' }, { base: 'Yes/No Q', past: "'Are you hungry?' -> He asked IF I was hungry.", highlight: 'Use IF or WHETHER' }] },
                    { type: 'explain', mascotText: "Native speakers prefer 'reporting verbs' over 'said that'. E.g., 'He promised to come', 'She refused to help', 'They warned me not to go'.", mascotEmotion: 'happy' },
                    { type: 'quiz-check', mascotText: "He said: 'Don't touch that!'. -> He ___ me not to touch that.", mascotEmotion: 'thinking', options: ['said', 'warned'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Reported Q', sentence: "She asked me where I ___.", options: ['live', 'lived', 'do live'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Reported Yes/No', sentence: "He asked ___ I wanted coffee.", options: ['that', 'if'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Reporting Verb', sentence: "He ___ that he had stolen the money.", options: ['said', 'denied'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Command', sentence: "The police warned us ___ go there.", options: ["don't", 'not to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Reporting Verb', sentence: "She ___ to help me with the project.", options: ['offered', 'said'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Reporting Verb', sentence: "The doctor ___ me to rest for a week.", options: ['said', 'advised'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Reporting Verb → Pattern', pairs: [{ left: 'promise', right: 'He promised to come.' }, { left: 'refuse', right: 'She refused to help.' }, { left: 'warn', right: 'They warned us not to go.' }, { left: 'deny', right: 'He denied stealing it.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Report', words: ['she', 'me', 'time', 'was', 'what', 'it', 'asked'], correct: ['she', 'asked', 'me', 'what', 'time', 'it', 'was'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он спросил меня, говорю ли я по-английски.', fromLang: 'RU', toLang: 'EN', answer: 'He asked me if I spoke English' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She asked me whether I would be free on Saturday.", hint: 'Reported Yes/No question with whether' } },
                    { type: 'speak-aloud', data: { instruction: 'Reporting verbs:', phrase: "She promised to call me, but she refused to tell me where she was going. He denied being involved." } }
                ]
            },
            // ── B2 Unit 12 ──
            {
                id: 12, title: 'Articles: A / The / Zero', desc: 'Mastering the ultimate exceptions.', unitType: 'grammar',
                grammar: ['definite article', 'indefinite article', 'zero article'], vocab: ['geography', 'institutions'],
                homework: { prompt: "Write about a geographical area using rivers, lakes, and countries." },
                teachSlides: [
                    { type: 'explain', mascotText: "Articles cause 90% of mistakes! A = one of many. The = specific one. Zero (no article) = things in general or abstract ideas.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Geography rules (the hardest part!):", mascotEmotion: 'thinking', left: { label: 'Use THE', items: ["Rivers: The Nile", "Mountain ranges: The Alps", "Group of islands: The Bahamas", "Countries with Republic/State: The USA"] }, right: { label: 'NO ARTICLE', items: ["Lakes: Lake Victoria", "Single mountains: Mount Everest", "Single islands: Bali", "Most countries: France"] } },
                    { type: 'quiz-check', mascotText: "We sailed across ___ Atlantic Ocean.", mascotEmotion: 'thinking', options: ['a', 'the', '-'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Geography', sentence: "I have always wanted to climb ___ Mount Everest.", options: ['the', '-'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Geography', sentence: "London is on ___ River Thames.", options: ['the', '-'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'General', sentence: "___ love is the most important thing.", options: ['The', '-'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Specific', sentence: "___ love I have for her is endless.", options: ['The', '-'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Geography', sentence: "She visited ___ Philippines last summer.", options: ['the', '-'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Institution', sentence: "He was sent to ___ prison for fraud.", options: ['the', '-'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'THE or no article?', pairs: [{ left: 'The Nile', right: 'Rivers use THE' }, { left: 'Mount Everest', right: 'Single mountains: no article' }, { left: 'The Alps', right: 'Mountain ranges use THE' }, { left: 'Lake Victoria', right: 'Lakes: no article' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Articles', words: ['moon', 'shining', 'brightly', 'was', 'the'], correct: ['the', 'moon', 'was', 'shining', 'brightly'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Япония - прекрасная страна.', fromLang: 'RU', toLang: 'EN', answer: 'Japan is a beautiful country' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "The United Kingdom is located in the north of Europe.", hint: 'THE with countries that have Kingdom/States/Republic' } },
                    { type: 'speak-aloud', data: { instruction: 'Geography:', phrase: "We traveled from the United States to France, crossed the Alps, and visited Lake Como. The scenery was breathtaking." } }
                ]
            },
            // ── B2 Unit 13 ──
            {
                id: 13, title: 'Relative Clauses', desc: 'Who, which, that, where, whose.', unitType: 'grammar',
                grammar: ['defining relative clauses', 'non-defining relative clauses'], vocab: ['descriptions', 'innovations'],
                homework: { prompt: "Describe your favorite movie using at least 5 relative clauses." },
                teachSlides: [
                    { type: 'explain', mascotText: "Relative clauses connect ideas. Defining clauses give ESSENTIAL info. Non-defining give EXTRA info (and use commas).", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Notice the difference:", mascotEmotion: 'thinking', items: [{ base: 'Essential', past: "The man who lives next door is friendly.", highlight: 'no commas' }, { base: 'Extra info', past: "My brother, who lives in Paris, is friendly.", highlight: 'commas!' }, { base: 'Whose', past: "The woman whose car was stolen is upset.", highlight: 'whose = possession' }] },
                    { type: 'quiz-check', mascotText: "'This is the house ___ I grew up.'", mascotEmotion: 'thinking', options: ['which', 'where', 'that'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'People', sentence: "The student ___ got top marks is from Spain.", options: ['which', 'who', 'where'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Things', sentence: "The car, ___ was completely destroyed, was a Ferrari.", options: ['that', 'which'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Possession', sentence: "I met a man ___ brother works with you.", options: ['who', 'whose', 'which'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Place', sentence: "London is the city ___ I was born.", options: ['which', 'where'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Non-defining', sentence: "My manager, ___ is always busy, finally replied.", options: ['that', 'who'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Omission', sentence: "The book ___ you recommended was excellent.", options: ['which', 'that', 'both are correct'], correct: 2 } },
                    { type: 'match-pairs', data: { instruction: 'Pronoun → Use', pairs: [{ left: 'who', right: 'People' }, { left: 'which', right: 'Things (+ non-defining)' }, { left: 'whose', right: 'Possession' }, { left: 'where', right: 'Places' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Relative', words: ['man', 'the', 'keys', 'who', 'found', 'my', 'is', 'here'], correct: ['the', 'man', 'who', 'found', 'my', 'keys', 'is', 'here'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Это книга, которую я вчера купил.', fromLang: 'RU', toLang: 'EN', answer: 'This is the book that I bought yesterday' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "My sister, who lives in Berlin, is coming to visit next month.", hint: 'Non-defining clause with commas' } },
                    { type: 'speak-aloud', data: { instruction: 'Describe:', phrase: "My colleague, whose office is next to mine, is the person who approved the project which saved us thousands." } }
                ]
            },
            // ── B2 Unit 14 ──
            {
                id: 14, title: '🗣️ Advanced Interview', desc: 'Putting B2 grammar into professional speech.', unitType: 'situational',
                grammar: ['all B2 grammar in usage'], vocab: ['accomplishments', 'leadership', 'STAR method'],
                homework: { prompt: "Answer: 'Tell me about a time you overcame a major challenge.' using the STAR method." },
                teachSlides: [
                    { type: 'explain', mascotText: "You are now at a B2 level. Your interview answers should use complex sentences, relative clauses, and perfect tenses to show your nuance.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Elevating your answers:", mascotEmotion: 'thinking', items: [{ base: 'Basic (B1)', past: "I solved the problem.", highlight: 'Simple' }, { base: 'Advanced (B2)', past: "I managed to overcome the challenge, which ultimately saved the company time.", highlight: 'Relative clause + vocabulary' }] },
                    { type: 'compare', mascotText: "Professional vocabulary upgrades:", mascotEmotion: 'happy', left: { label: 'Basic', items: ['I was the boss.', 'I fixed the problem.', 'The project was hard.', 'I made the team better.'] }, right: { label: 'B2 Professional', items: ['I managed / led the team.', 'I resolved the issue.', 'The project was challenging.', 'I enhanced team performance.'] } },
                    { type: 'tip', mascotText: "The STAR method: Situation (context) → Task (your role) → Action (what you did) → Result (the outcome). Use Past Simple for events, Past Perfect for context, relative clauses for detail.", mascotEmotion: 'happy', tipText: "STAR: Situation → Task → Action → Result" },
                    { type: 'quiz-check', mascotText: "Which is more professional?", mascotEmotion: 'thinking', options: ["I didn't know what to do.", "Initially, the solution wasn't obvious, but I figured it out."], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Formal Vocab', sentence: "I ___ a team of 10 people.", options: ['bossed', 'managed'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Softening', sentence: "The project was ___, but we succeeded.", options: ['quite challenging', 'very bad'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Professional', sentence: "I ___ a solution that reduced costs by 20%.", options: ['made', 'implemented'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Relative', sentence: "The client, ___ had been dissatisfied, praised our work.", options: ['who', 'which'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "If I ___ taken that opportunity, I wouldn't be where I am today.", options: ["hadn't", "didn't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Formal', sentence: "I would describe my leadership style as ___.", options: ['collaborative', 'bossy'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Basic → Professional', pairs: [{ left: 'I worked with people', right: 'I collaborated with stakeholders' }, { left: 'I fixed the problem', right: 'I resolved the issue' }, { left: 'The project was hard', right: 'The project was challenging' }, { left: 'I got better results', right: 'I improved outcomes' }] } },
                    { type: 'word-shuffle', data: { instruction: 'STAR answer', words: ['the', 'which', 'challenge', 'overcome', 'to', 'I', 'managed', 'saved', 'us', 'time'], correct: ['I', 'managed', 'to', 'overcome', 'the', 'challenge', 'which', 'saved', 'us', 'time'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Моя главная сильная сторона - это способность быстро адаптироваться.', fromLang: 'RU', toLang: 'EN', answer: 'My main strength is the ability to adapt quickly' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I successfully led a cross-functional team that delivered the project ahead of schedule.", hint: 'Professional vocabulary + relative clause' } },
                    { type: 'speak-aloud', data: { instruction: 'Interview answer:', phrase: "If I hadn't taken that risk, I wouldn't have learned so much. It was an experience which truly shaped my career. I managed a team of twelve people." } }
                ]
            },
            // ── B2 Unit 15 ──
            {
                id: 15, title: '🔄 Final Checkpoint B2', desc: 'Full B2 review — all grammar and skills.', unitType: 'review',
                grammar: ['all B2 grammar'], vocab: ['all B2 vocab'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Indirect Q', sentence: "Could you tell me what time ___?", options: ['does the shop close', 'the shop closes'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Tag Q', sentence: "They haven't arrived yet, ___ they?", options: ['have', "haven't"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Narrative', sentence: "I ___ for an hour when she finally called.", options: ['waited', 'had been waiting', 'was waiting'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Perf', sentence: "By this time next year, I ___ my degree.", options: ['will finish', 'will have finished'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '3rd Cond', sentence: "If she ___ harder, she would have passed.", options: ['studied', 'had studied'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Mixed Cond', sentence: "If I ___ to bed earlier last night, I wouldn't be so tired now.", options: ['went', 'had gone'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Wish', sentence: "I wish I ___ speak Chinese. (I can't)", options: ['can', 'could'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Gerund/Inf', sentence: "I'll never forget ___ the Northern Lights.", options: ['to see', 'seeing'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Used to', sentence: "After a year abroad, she ___ living alone.", options: ['used to', 'got used to'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Reported', sentence: "He ___ me not to tell anyone.", options: ['said', 'warned'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Articles', sentence: "___ Nile is the longest river in Africa.", options: ['The', '-'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Relative', sentence: "The manager, ___ office is upstairs, wants to see you.", options: ['who', 'whose'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'B2 Grammar Review', pairs: [{ left: '3rd Conditional', right: "If I had known, I'd have helped." }, { left: 'Wish + Past', right: 'I wish I had more time.' }, { left: 'Future Perfect', right: "By June I'll have graduated." }, { left: 'Reporting verb', right: 'She promised to come.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Mixed Conditional', words: ['gone', 'had', 'I', "wouldn't", 'tired', 'if', 'to', 'bed', 'earlier', 'be', 'I', 'so'], correct: ['if', 'I', 'had', 'gone', 'to', 'bed', 'earlier', 'I', "wouldn't", 'be', 'so', 'tired'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я не опоздал, я бы не пропустил рейс.', fromLang: 'RU', toLang: 'EN', answer: "If I hadn't been late, I wouldn't have missed the flight" } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Хотелось бы мне знать об этом раньше.', fromLang: 'RU', toLang: 'EN', answer: 'I wish I had known about this earlier' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She asked me whether I would be attending the conference next week.", hint: 'Reported question with whether' } },
                    { type: 'speak-aloud', data: { instruction: 'B2 graduation speech:', phrase: "I can discuss complex topics, express wishes and regrets, and communicate professionally. If I hadn't started this course, I wouldn't have reached this level." } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // C1 — ADVANCED (13 units)
    // ═══════════════════════════════════════════
    {
        id: 'c1_advanced',
        language: 'en',
        title: 'C1 — Advanced',
        level: 'C1',
        cefr: 'C1',
        methodology: 'CEFR C1 Effective Operational Proficiency. Discourse markers, modal verbs for speculation, cleft sentences for emphasis, advanced passives, mixed conditionals in context, relative clauses, academic vocabulary. ~5600 cumulative vocabulary.',
        canDo: [
            'Can understand a wide range of demanding, longer texts and recognise implicit meaning',
            'Can express ideas fluently and spontaneously without much obvious searching for expressions',
            'Can use language flexibly and effectively for social, academic, and professional purposes',
            'Can produce clear, well-structured, detailed text on complex subjects',
            'Can use discourse markers to organise extended speech and writing',
            'Can speculate about the past and present using advanced modals',
            'Can use emphasis structures (cleft sentences, inversion) for impact',
            'Can handle nuanced academic and professional register',
        ],
        objectives: [
            'Discourse markers: however, moreover, nevertheless, whereas, etc.',
            'Modal verbs for speculation (must have, might have, can\'t have)',
            'Cleft sentences for emphasis (It was... that/who...)',
            'Advanced passive structures (have something done, reporting passives)',
            'Relative clauses: defining vs non-defining, reduced forms',
            'Word formation: prefixes, suffixes, nominalisation',
            'Collocation patterns and academic vocabulary',
            'Situational: academic writing, professional negotiations',
        ],
        units: [
            // ── C1 Unit 1 ──
            {
                id: 1, title: 'Discourse Markers', desc: 'however, moreover, nevertheless, whereas.', unitType: 'grammar',
                grammar: ['discourse markers', 'linkers'], vocab: ['argumentation', 'debate', 'essays'],
                homework: { prompt: "Write a short paragraph evaluating remote work using 3 advanced discourse markers." },
                teachSlides: [
                    { type: 'explain', mascotText: "Welcome to C1! Here we focus on FLOW and ELEGANCE. Discourse markers upgrade your basic 'and/but/so' into academic, professional logic.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Upgrade your vocabulary:", mascotEmotion: 'thinking', left: { label: 'Basic', items: ["But...", "And...", "So..."] }, right: { label: 'C1 Advanced', items: ["However / Nevertheless", "Moreover / Furthermore", "Therefore / Consequently"] } },
                    { type: 'examples', mascotText: "Punctuation matters! E.g. 'It was raining; NEVERTHELESS, we went out.' (semicolon + comma).", mascotEmotion: 'happy', items: [{ base: 'Whereas', past: "He loves dogs, whereas I prefer cats.", highlight: 'comparison' }] },
                    { type: 'quiz-check', mascotText: "'The product is expensive. ___, it is poorly made.'", mascotEmotion: 'thinking', options: ['However', 'Furthermore', 'Therefore'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Addition', sentence: 'The team worked hard; ___, they finished early.', options: ['furthermore', 'nevertheless'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Contrast', sentence: 'It was a risky investment. ___, it paid off.', options: ['Moreover', 'However'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Result', sentence: 'Demand fell sharply; ___, prices dropped.', options: ['consequently', 'whereas'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Comparison', sentence: 'He prefers tea, ___ she drinks coffee.', options: ['whereas', 'moreover'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Contrast', sentence: 'The report was thorough. ___, it failed to address the core issue.', options: ['Furthermore', 'Nevertheless'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Basic → C1', pairs: [{ left: 'But...', right: 'However / Nevertheless' }, { left: 'And also...', right: 'Moreover / Furthermore' }, { left: 'So...', right: 'Therefore / Consequently' }, { left: 'On the other hand...', right: 'Whereas / In contrast' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Linkers', words: ['expensive', 'furthermore', 'it', 'poorly', 'is', 'designed', 'was', 'it'], correct: ['it', 'was', 'expensive', 'furthermore', 'it', 'is', 'poorly', 'designed'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он усердно работал; тем не менее, он провалился.', fromLang: 'RU', toLang: 'EN', answer: 'He worked hard; nevertheless, he failed' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "The initial results were promising; however, further research is required.", hint: 'Contrast marker with semicolon' } },
                    { type: 'speak-aloud', data: { instruction: 'Formal speech:', phrase: "The initial tests were successful; therefore, we have decided to proceed. Moreover, the budget allows for further expansion." } }
                ]
            },
            // ── C1 Unit 2 ──
            {
                id: 2, title: 'Causative Forms', desc: 'have/get something done.', unitType: 'grammar',
                grammar: ['causative have', 'causative get'], vocab: ['services', 'repairs', 'delegation'],
                homework: { prompt: "Write about three services you pay others to do for you." },
                teachSlides: [
                    { type: 'explain', mascotText: "When you don't do something yourself, but you pay or ask someone else to do it, use the Causative!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Structure: HAVE/GET + Object + Past Participle (V3)", mascotEmotion: 'thinking', items: [{ base: 'DIY', past: "I cut my hair.", highlight: '(I used scissors on myself)' }, { base: 'Causative', past: "I had my hair cut.", highlight: '(A barber did it)' }] },
                    { type: 'compare', mascotText: "Have vs Get causative:", mascotEmotion: 'happy', left: { label: 'HAVE (formal/neutral)', items: ['I had my car serviced.', 'She had the report proofread.'] }, right: { label: 'GET (informal/dynamic)', items: ['I got my car fixed.', 'She got her nails done.'] } },
                    { type: 'tip', mascotText: "The causative can also express negative experiences: 'He had his wallet stolen' = someone stole it from him (not a service!).", mascotEmotion: 'thinking', tipText: "Negative causative: had + object + V3 = something bad happened to someone" },
                    { type: 'quiz-check', mascotText: "My watch is broken. I need to ___.", mascotEmotion: 'thinking', options: ['repair it', 'have it repaired'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: 'I need to have my car ___.', options: ['repair', 'repaired', 'repairing'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: 'She ___ her house painted last week.', options: ['had', 'have', 'was'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Get vs Have', sentence: 'We are getting a new security system ___.', options: ['install', 'installed'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative', sentence: 'He ___ his phone stolen on the train.', options: ['had', 'got', 'both are correct'], correct: 2 } },
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: 'You should get your eyes ___ regularly.', options: ['test', 'tested', 'testing'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'DIY vs Causative', pairs: [{ left: 'I cut my hair.', right: 'I did it myself' }, { left: 'I had my hair cut.', right: 'A barber did it' }, { left: 'He repaired the car.', right: 'He fixed it himself' }, { left: 'He had the car repaired.', right: 'A mechanic fixed it' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Causative', words: ['had', 'stolen', 'he', 'wallet', 'his'], correct: ['he', 'had', 'his', 'wallet', 'stolen'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я подстригся вчера. (В парикмахерской)', fromLang: 'RU', toLang: 'EN', answer: 'I had my hair cut yesterday' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She needs to get her passport renewed before the trip.", hint: 'Get-causative: get + object + V3' } },
                    { type: 'speak-aloud', data: { instruction: 'Services:', phrase: "I need to get my computer fixed and have my jacket dry-cleaned before the conference." } }
                ]
            },
            // ── C1 Unit 3 ──
            {
                id: 3, title: 'Modals of Deduction', desc: 'Speculation about the past.', unitType: 'grammar',
                grammar: ['must have', 'might have', 'cant have'], vocab: ['investigation', 'mysteries', 'assumptions'],
                homework: { prompt: "Imagine a coworker is an hour late. Write 3 speculations about what happened." },
                teachSlides: [
                    { type: 'explain', mascotText: "When playing detective about the PAST, we use Modals + HAVE + V3. It shows how sure you are about an event that already happened.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Degrees of certainty (PAST):", mascotEmotion: 'thinking', left: { label: '99% Sure (Yes/No)', items: ["He MUST have forgotten.", "He CAN'T have stolen it."] }, right: { label: '50% Sure (Maybe)', items: ["They MIGHT have got lost.", "She COULD have missed the bus."] } },
                    { type: 'quiz-check', mascotText: "Her coat is still here. She ___ left yet.", mascotEmotion: 'thinking', options: ["mustn't have", "can't have", "might have"], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: '99% True', sentence: 'He got top scores. He ___ studied hard.', options: ['must have', 'can\'t have'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '99% False', sentence: 'He ___ gone to Japan; I saw him in London today!', options: ['must have', 'can\'t have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '50% Maybe', sentence: 'I can\'t find my keys. I ___ left them in the car.', options: ['must have', 'might have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: '99% True', sentence: 'The roads are wet. It ___ rained overnight.', options: ['must have', 'might have'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: '99% False', sentence: 'She ___ written this. Her English isn\'t this good.', options: ['must have', 'can\'t have'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Certainty → Modal', pairs: [{ left: '99% sure it happened', right: 'must have + V3' }, { left: '99% sure it didn\'t happen', right: 'can\'t have + V3' }, { left: '50% possible', right: 'might have + V3' }, { left: '50% possible (formal)', right: 'could have + V3' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Deduction', words: ['forgotten', 'have', 'must', 'she', 'meeting', 'the'], correct: ['she', 'must', 'have', 'forgotten', 'the', 'meeting'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Должно быть, он забыл о встрече.', fromLang: 'RU', toLang: 'EN', answer: 'He must have forgotten about the meeting' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "She can't have left already. Her coat is still on the chair.", hint: 'can\'t have + V3 = 99% sure it didn\'t happen' } },
                    { type: 'speak-aloud', data: { instruction: 'Speculate:', phrase: "They can't have finished the project already. They must have worked through the night! Someone might have helped them." } }
                ]
            },
            // ── C1 Unit 4 ──
            {
                id: 4, title: 'Advanced Modals', desc: 'Needn\'t have vs Didn\'t need to.', unitType: 'grammar',
                grammar: ['needn\'t have', 'didn\'t need to', 'was supposed to'], vocab: ['unnecessary actions', 'expectations'],
                homework: { prompt: "Write about a time you did something completely unnecessary by mistake." },
                teachSlides: [
                    { type: 'explain', mascotText: "Let's learn a C1 trick! Both 'needn't have' and 'didn't need to' express that an action was unnecessary in the past. But there's a catch...", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "The critical difference:", mascotEmotion: 'thinking', items: [{ base: 'Needn\'t have', past: "I needn't have cooked. (I cooked, but it was a waste of time because they ordered pizza.)", highlight: 'Did it + unnecessary' }, { base: 'Didn\'t need to', past: "I didn't need to cook. (I knew they ordered pizza, so I didn't cook.)", highlight: 'Didn\'t do it' }] },
                    { type: 'quiz-check', mascotText: "I brought an umbrella, but it didn't rain. I ___ an umbrella.", mascotEmotion: 'thinking', options: ["didn't need to bring", "needn't have brought"], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Needn\'t have', sentence: 'We ___ rushed. The train was delayed by an hour! (We ran for no reason).', options: ['didn\'t need to run', 'needn\'t have run'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Didn\'t need to', sentence: 'I ___ to the supermarket because my wife already went. So I stayed home.', options: ['didn\'t need to go', 'needn\'t have gone'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Expectation', sentence: 'You ___ be here at 8 AM! Why are you late?', options: ['were supposed to', 'had to'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Needn\'t have', sentence: 'I ___ bought all this food — nobody came to the party!', options: ['didn\'t need to', 'needn\'t have'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Didn\'t need to', sentence: 'The exam was cancelled, so we ___ revise.', options: ['didn\'t need to', 'needn\'t have'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Meaning → Form', pairs: [{ left: 'Did it + unnecessary', right: 'needn\'t have + V3' }, { left: 'Knew + didn\'t do', right: 'didn\'t need to + verb' }, { left: 'Unmet expectation', right: 'was/were supposed to' }, { left: 'Obligation (past)', right: 'had to' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Unnecessary', words: ['have', 'bought', 'needn\'t', 'wine', 'we', 'more'], correct: ['we', 'needn\'t', 'have', 'bought', 'more', 'wine'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'А я мог бы и не торопиться! (оказалось не нужным)', fromLang: 'RU', toLang: 'EN', answer: 'I needn\'t have hurried' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "You needn't have brought an umbrella. It didn't rain at all.", hint: "needn't have + V3 = did it but it was unnecessary" } },
                    { type: 'speak-aloud', data: { instruction: 'Expectations:', phrase: "I was supposed to call my manager, but I needn't have worried because she called me first." } }
                ]
            },
            // ── C1 Unit 5 ──
            {
                id: 5, title: '🔄 Checkpoint 1', desc: 'Review C1 Units 1-4.', unitType: 'review',
                grammar: ['linkers', 'causative', 'past deduction', 'needn\'t have'], vocab: ['C1 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Linkers', sentence: "The project failed; ___, we learned a lot.", options: ['moreover', 'nevertheless'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Linkers', sentence: "Sales increased by 20%. ___, customer satisfaction improved.", options: ['Furthermore', 'However'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: "I'm having my house ___ next week.", options: ['paint', 'painted'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: "She got her laptop ___ at the repair shop.", options: ['fix', 'fixed'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Deduction', sentence: "He ___ have read the email; he completely ignored my instructions.", options: ["must", "can't"], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Deduction', sentence: "The lights are on. Someone ___ have come home.", options: ['must', 'might'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Needn\'t', sentence: "You ___ brought a gift, but thank you so much!", options: ['needn\'t have', 'didn\'t need to'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Supposed to', sentence: "He ___ arrive at nine, but he came at noon.", options: ['was supposed to', 'had to'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'C1 Grammar → Example', pairs: [{ left: 'Discourse marker', right: 'Nevertheless, it succeeded.' }, { left: 'Causative', right: 'I had it repaired.' }, { left: 'Past deduction', right: 'She must have left.' }, { left: 'Needn\'t have', right: 'I needn\'t have rushed.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Linker', words: ['successful', 'project', 'the', 'was', 'consequently', 'expanded', 'we'], correct: ['the', 'project', 'was', 'successful', 'consequently', 'we', 'expanded'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Они, должно быть, заблудились.', fromLang: 'RU', toLang: 'EN', answer: 'They must have got lost' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I had my suit dry-cleaned; nevertheless, the stain was still visible.", hint: 'Causative + discourse marker' } },
                    { type: 'speak-aloud', data: { instruction: 'C1 Review:', phrase: "She must have forgotten the meeting. I had the report printed; however, it needn't have been so urgent." } }
                ]
            },
            // ── C1 Unit 6 ──
            {
                id: 6, title: 'Emphasis: Cleft Sentences & Inversion', desc: 'Adding dramatic flair to speech.', unitType: 'grammar',
                grammar: ['cleft sentences', 'negative inversion'], vocab: ['drama', 'persuasion', 'emphasis'],
                homework: { prompt: "Write 3 sentences using negative inversion (e.g. Rarely have I...)" },
                teachSlides: [
                    { type: 'explain', mascotText: "To sound truly advanced, change the word order to create EMPHASIS. This is called a Cleft Sentence or Inversion.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Cleft Sentences (It was X who... / What I want is...)", mascotEmotion: 'thinking', items: [{ base: 'Normal', past: "John broke the window.", highlight: 'Boring' }, { base: 'Cleft (It)', past: "It was John who broke the window.", highlight: 'Focus on John' }, { base: 'Cleft (What)', past: "What I need is a vacation.", highlight: 'Focus on vacation' }] },
                    { type: 'examples', mascotText: "Negative Inversion (Sounds very formal & dramatic)", mascotEmotion: 'thinking', items: [{ base: 'Normal', past: "I have never seen such beauty.", highlight: 'Standard' }, { base: 'Inversion', past: "Never have I seen such beauty.", highlight: 'Verb comes BEFORE subject!' }] },
                    { type: 'quiz-check', mascotText: "'___ had I arrived when the phone rang.'", mascotEmotion: 'thinking', options: ['Hardly', 'Barely', 'Both are correct'], correct: 2 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Cleft (It)', sentence: "___ was the weather that ruined the trip.", options: ['It', 'What', 'There'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Cleft (What)', sentence: "___ really annoys me is the noise.", options: ['It', 'What', 'That'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Rarely ___ such incredible talent.", options: ['have I seen', 'I have seen'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Not only ___ late, but he forgot his laptop.", options: ['was he', 'he was'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Under no circumstances ___ you enter this room.", options: ['should', 'you should'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Cleft (What)', sentence: "___ I find most alarming is the lack of funding.", options: ['What', 'It', 'The thing'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Normal → Emphatic', pairs: [{ left: 'I have never seen this.', right: 'Never have I seen this.' }, { left: 'She only then understood.', right: 'Only then did she understand.' }, { left: 'John broke it.', right: 'It was John who broke it.' }, { left: 'I need rest.', right: 'What I need is rest.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Inversion', words: ['I', 'did', 'little', 'know', 'truth', 'the'], correct: ['little', 'did', 'I', 'know', 'the', 'truth'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Никогда еще я не был так счастлив.', fromLang: 'RU', toLang: 'EN', answer: 'Never have I been so happy' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Not only did he arrive late, but he also forgot the presentation.", hint: 'Not only + inversion + but also' } },
                    { type: 'speak-aloud', data: { instruction: 'Emphasis:', phrase: "It was his attitude that bothered me most. Rarely do you see such arrogance. Under no circumstances should this be tolerated." } }
                ]
            },
            // ── C1 Unit 7 ──
            {
                id: 7, title: 'Hedging & Distancing', desc: 'Avoiding direct statements professionally.', unitType: 'grammar',
                grammar: ['hedging verbs', 'passive of reporting verbs'], vocab: ['diplomacy', 'journalism', 'academia'],
                homework: { prompt: "Rewrite 3 blunt statements into soft, hedged statements." },
                teachSlides: [
                    { type: 'explain', mascotText: "In C1/C2 (and scientific papers), we avoid saying 'This is 100% true'. We use 'Hedging' to soften claims and 'Distancing' to report what others say.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Hedging (softening):", mascotEmotion: 'thinking', items: [{ base: 'Blunt', past: "This strategy will fail.", highlight: 'Too confident' }, { base: 'Hedged', past: "This strategy tends to fail / is likely to fail.", highlight: 'Professional' }] },
                    { type: 'examples', mascotText: "Distancing (It is said that...):", mascotEmotion: 'thinking', items: [{ base: 'Active', past: "People consider him a genius.", highlight: 'Informal' }, { base: 'Passive', past: "He is considered to be a genius. / It is considered that he is...", highlight: 'Academic' }] },
                    { type: 'quiz-check', mascotText: "'___ is argued that the earth is getting warmer.'", mascotEmotion: 'thinking', options: ['It', 'There', 'This'], correct: 0 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "The new policy ___ to cause friction among staff.", options: ['appears', 'is absolutely'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Distancing', sentence: "___ is believed that the suspect fled the country.", options: ['He', 'It'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Distancing', sentence: "He is reported ___ the country.", options: ['to have fled', 'that he fled'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "This ___ be the best solution available.", options: ['arguably might', '100% will'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "The data ___ to indicate a positive trend.", options: ['seems', 'definitely'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Distancing', sentence: "He is thought ___ a genius.", options: ['to be', 'being'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Direct → Hedged', pairs: [{ left: 'This will fail.', right: 'This is likely to fail.' }, { left: 'He is a genius.', right: 'He is considered to be a genius.' }, { left: 'The economy will recover.', right: 'It is expected that the economy will recover.' }, { left: 'She stole it.', right: 'She is alleged to have stolen it.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Passive Reporting', words: ['is', 'that', 'economy', 'expected', 'the', 'will', 'recover', 'it'], correct: ['it', 'is', 'expected', 'that', 'the', 'economy', 'will', 'recover'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Считается, что он гений.', fromLang: 'RU', toLang: 'EN', answer: 'He is considered to be a genius' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "It is widely believed that climate change poses a significant threat to biodiversity.", hint: 'Passive reporting: It is + past participle + that...' } },
                    { type: 'speak-aloud', data: { instruction: 'Diplomacy:', phrase: "It is widely believed that these measures, arguably, tend to improve productivity. The evidence appears to support this view." } }
                ]
            },
            // ── C1 Unit 8 ──
            {
                id: 8, title: 'Noun Clauses & Ellipsis', desc: 'Condensing speech natively.', unitType: 'grammar',
                grammar: ['noun clauses', 'ellipsis'], vocab: ['debate', 'agreements'],
                homework: { prompt: "Write a short dialogue replacing repetitive phrases with 'so', 'not', or do-support." },
                teachSlides: [
                    { type: 'explain', mascotText: "Native speakers are lazy (in a good way!). They omit words that are understood from context. This is called Ellipsis.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Ellipsis with 'So' and 'Not':", mascotEmotion: 'thinking', items: [{ base: 'Positive', past: "Will he win? -> I think so. / I hope so.", highlight: '(NOT: I think yes)' }, { base: 'Negative', past: "Will he win? -> I hope not. / I suppose not.", highlight: '(NOT: I hope no)' }] },
                    { type: 'examples', mascotText: "Noun Clauses (Phrases acting like a noun):", mascotEmotion: 'thinking', items: [{ base: 'Example', past: "WHAT HE DID is unforgivable.", highlight: '"What he did" = Subject' }] },
                    { type: 'quiz-check', mascotText: "'Do you think it will rain?' — '___.'", mascotEmotion: 'thinking', options: ['I think yes', 'I think so'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Ellipsis', sentence: "Are they coming? — I hope ___.", options: ['so', 'yes', 'that'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Negative Ellipsis', sentence: "Is the flight cancelled? — I hope ___.", options: ['not', 'no'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Noun Clause', sentence: "___ he said made me very angry.", options: ['What', 'That'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Ellipsis verb', sentence: "She said she would help, but she ___.", options: ["didn't", "didn't help"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Ellipsis', sentence: "Will it be difficult? — I'm afraid ___.", options: ['so', 'yes'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Noun Clause', sentence: "___ surprised me was his honesty.", options: ['What', 'It'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Full → Ellipsis', pairs: [{ left: 'I think it will rain.', right: 'I think so.' }, { left: 'I hope it won\'t rain.', right: 'I hope not.' }, { left: 'She wanted to stay but she didn\'t stay.', right: 'She wanted to but she didn\'t.' }, { left: 'I believe it is true.', right: 'I believe so.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Noun clause', words: ['said', 'true', 'he', 'is', 'what', 'not'], correct: ['what', 'he', 'said', 'is', 'not', 'true'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я надеюсь, что да.', fromLang: 'RU', toLang: 'EN', answer: 'I hope so' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Do you think the project will succeed? I certainly hope so.", hint: 'Ellipsis with so replacing a full clause' } },
                    { type: 'speak-aloud', data: { instruction: 'Flowing speech:', phrase: "What you need to understand is that I wanted to finish early, but I couldn't. Will we meet the deadline? I'm afraid not." } }
                ]
            },
            // ── C1 Unit 9 ──
            {
                id: 9, title: '🗣️ Public Speaking', desc: 'Presentations using C1 structures.', unitType: 'situational',
                grammar: ['C1 synthesis'], vocab: ['presentations', 'structuring', 'audiences'],
                homework: { prompt: "Write the opening paragraph of a formal presentation on artificial intelligence." },
                teachSlides: [
                    { type: 'explain', mascotText: "Time to combine everything! A C1 presentation uses discourse markers for flow, hedging to sound smart, and cleft sentences for power.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "The ultimate C1 presentation intro:", mascotEmotion: 'thinking', items: [{ base: 'Hedging', past: "It is widely argued that technology is advancing rapidly.", highlight: 'Professional start' }, { base: 'Cleft (Emphasis)', past: "However, what concerns me is the loss of human connection.", highlight: 'Strong point' }, { base: 'Marker', past: "Consequently, we must adapt.", highlight: 'Logical conclusion' }] },
                    { type: 'quiz-check', mascotText: "Which sounds more like a TED talk?", mascotEmotion: 'thinking', options: ["Technology is good but scary.", "While technology offers benefits, it undeniably poses risks."], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Intro Phrase', sentence: "Today, I would like to ___ the issue of climate change.", options: ['talk', 'address'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Emphasis', sentence: "___ is clear is that we need a new strategy.", options: ['What', 'It'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Signposting', sentence: "___ sum up, the evidence strongly supports our proposal.", options: ['To', 'For'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "The data ___ suggest that remote work improves productivity.", options: ['appears to', 'definitely'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Transition', sentence: "Having ___ the advantages, let us now consider the drawbacks.", options: ['discussed', 'talking'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Emphasis', sentence: "It is ___ this reason that we must act now.", options: ['for', 'by'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Presentation Phrase → Purpose', pairs: [{ left: 'I would like to address...', right: 'Introduction' }, { left: 'Having discussed X, let us...', right: 'Transition' }, { left: 'What I find most alarming is...', right: 'Emphasis' }, { left: 'To sum up,...', right: 'Conclusion' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Conclusion', words: ['the', 'to', 'sum', 'up', 'evidence', 'our', 'supports', 'proposal'], correct: ['to', 'sum', 'up', 'the', 'evidence', 'supports', 'our', 'proposal'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'То, что нам нужно - это устойчивое развитие.', fromLang: 'RU', toLang: 'EN', answer: 'What we need is sustainable development' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "It is for precisely this reason that we must reconsider our approach to energy policy.", hint: 'Cleft emphasis: It is for... that...' } },
                    { type: 'speak-aloud', data: { instruction: 'Present:', phrase: "Furthermore, it is essential to recognize that what we decide today will impact future generations. To sum up, the evidence clearly supports our proposal." } }
                ]
            },
            // ── C1 Unit 10 ──
            {
                id: 10, title: '🔄 Checkpoint 2', desc: 'Review C1 Units 6-9.', unitType: 'review',
                grammar: ['inversion', 'cleft', 'hedging', 'ellipsis'], vocab: ['C1 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Only later ___ understand the true meaning.", options: ['she did', 'did she'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Seldom ___ such dedication in a junior employee.", options: ['do we see', 'we see'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Cleft', sentence: "___ was the CEO who made the decision.", options: ['He', 'It'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Cleft', sentence: "___ I find most troubling is the lack of transparency.", options: ['What', 'It'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Passive Reporting', sentence: "The building is estimated ___ over a million dollars.", options: ['to cost', 'that it costs'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "The results ___ to confirm the hypothesis.", options: ['appear', 'definitely'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Ellipsis', sentence: "Will they finish on time? — I suspect ___.", options: ['not', 'no'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Noun Clause', sentence: "___ matters most is the quality of the work.", options: ['What', 'It'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'C1 Grammar → Example', pairs: [{ left: 'Inversion', right: 'Rarely have I seen...' }, { left: 'Cleft sentence', right: 'It was the CEO who...' }, { left: 'Hedging', right: 'The data appears to...' }, { left: 'Ellipsis', right: 'I hope so.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Inversion', words: ['circumstances', 'no', 'under', 'leave', 'should', 'you'], correct: ['under', 'no', 'circumstances', 'should', 'you', 'leave'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Редко мы встречаем таких людей.', fromLang: 'RU', toLang: 'EN', answer: 'Rarely do we meet such people' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "What I find most concerning is the apparent lack of oversight in this process.", hint: 'What-cleft for emphasis' } },
                    { type: 'speak-aloud', data: { instruction: 'C1 Review:', phrase: "Not only did the company fail to meet its targets, but it is also believed that the CEO misled investors. I hope not." } }
                ]
            },
            // ── C1 Unit 11 ──
            {
                id: 11, title: 'Mixed Conditionals', desc: 'Past affecting present, present affecting past.', unitType: 'grammar',
                grammar: ['mixed conditionals'], vocab: ['hypothetical outcomes', 'life paths'],
                homework: { prompt: "Write 2 sentences about how a past action changes your present." },
                teachSlides: [
                    { type: 'explain', mascotText: "Real life isn't always perfectly 2nd or 3rd conditional. Sometimes a PAST action affects your PRESENT situation. To express this, we MIX the halves!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Mixed Type 1: Past Action -> Present Result", mascotEmotion: 'thinking', items: [{ base: 'Combo', past: "If I HAD STUDIED medicine (past), I WOULD BE a doctor now (present).", highlight: 'Past Perf -> Would + V1' }] },
                    { type: 'examples', mascotText: "Mixed Type 2: Present Fact -> Past Result", mascotEmotion: 'thinking', items: [{ base: 'Combo', past: "If I WERE taller (present fact), I WOULD HAVE PLAYED basketball in college (past).", highlight: 'Past Simple -> Would have + V3' }] },
                    { type: 'quiz-check', mascotText: "If I had taken the job in Spain, I ___ fluent in Spanish today.", mascotEmotion: 'thinking', options: ['would be', 'would have been'], correct: 0 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Past -> Present', sentence: "If she had slept earlier, she ___ so tired today.", options: ["wouldn't be", "wouldn't have been"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Present -> Past', sentence: "If I wasn't afraid of flying, I ___ with you last week.", options: ['would go', 'would have gone'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Mixed', sentence: "If we had brought a map, we ___ lost right now.", options: ["wouldn't be", "wouldn't have been"], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Past -> Present', sentence: "If he had saved money, he ___ afford the trip now.", options: ['would', 'would have'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Present -> Past', sentence: "If she were more confident, she ___ applied for the promotion.", options: ['would', 'would have'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Condition -> Result', pairs: [{ left: 'If I had studied (past)', right: 'I would know it now (present)' }, { left: 'If I were taller (present)', right: 'I would have played basketball (past)' }, { left: 'If he had saved money (past)', right: 'He would be rich now (present)' }, { left: 'If she liked travel (present)', right: 'She would have gone last week (past)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Mixed', words: ['I', 'rich', 'be', 'bought', 'bitcoin', 'had', 'would', 'I', 'now', 'if'], correct: ['if', 'I', 'had', 'bought', 'bitcoin', 'I', 'would', 'be', 'rich', 'now'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Если бы я выучил английский раньше, я бы сейчас имел лучшую работу.', fromLang: 'RU', toLang: 'EN', answer: 'If I had learned English earlier, I would have a better job now' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "If I had taken that job in Berlin, I would probably be fluent in German by now.", hint: 'Past action -> Present result: had + V3 -> would + V1' } },
                    { type: 'speak-aloud', data: { instruction: 'Reflect:', phrase: "If I hadn't moved to this city, I wouldn't have met my best friend. If I were braver, I would have accepted the offer." } }
                ]
            },
            // ── C1 Unit 12 ──
            {
                id: 12, title: 'Advanced Passives', desc: 'Get-passive, continuous passives.', unitType: 'grammar',
                grammar: ['get passive', 'continuous passive', 'perfect passive'], vocab: ['accidents', 'processes', 'blame'],
                homework: { prompt: "Describe a manufacturing process using at least 3 passive tenses." },
                teachSlides: [
                    { type: 'explain', mascotText: "You know basic passive (is made). Now let's do continuous (is being made) and the informal GET-passive, which emphasizes the action or accident.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "The 'Get' Passive (informal/accidents):", mascotEmotion: 'thinking', items: [{ base: 'Be-passive', past: "He was promoted.", highlight: 'Neutral' }, { base: 'Get-passive', past: "He got promoted!", highlight: 'Action/Achievement' }, { base: 'Get-passive', past: "The window got broken.", highlight: 'Accident' }] },
                    { type: 'examples', mascotText: "Tense combinations in Passive:", mascotEmotion: 'thinking', items: [{ base: 'Present Cont.', past: "The road is being repaired.", highlight: 'is being + V3' }, { base: 'Present Perf.', past: "The problem has been solved.", highlight: 'has been + V3' }] },
                    { type: 'quiz-check', mascotText: "My bike ___ stolen yesterday! (Informal/dynamic)", mascotEmotion: 'thinking', options: ['was', 'got'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Get-passive', sentence: "He ___ fired for being late every day.", options: ['got', 'was being'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Continuous', sentence: "Please wait. Your application is currently ___ processed.", options: ['been', 'being'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Perfect', sentence: "All the tickets have already ___ sold out.", options: ['been', 'being'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Get-passive', sentence: "Three employees ___ promoted last month.", options: ['got', 'were being'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Continuous Perfect', sentence: "The bridge has ___ repaired for two months now.", options: ['been being', 'being'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Passive Form → Example', pairs: [{ left: 'Simple passive', right: 'The window was broken.' }, { left: 'Get-passive', right: 'He got promoted.' }, { left: 'Continuous passive', right: 'The road is being repaired.' }, { left: 'Perfect passive', right: 'The problem has been solved.' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Continuous Passive', words: ['interrogated', 'suspect', 'the', 'is', 'being', 'currently'], correct: ['the', 'suspect', 'is', 'currently', 'being', 'interrogated'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мой телефон разбился. (get-passive)', fromLang: 'RU', toLang: 'EN', answer: 'My phone got smashed' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "The new policy is currently being reviewed by the committee.", hint: 'Present continuous passive: is being + V3' } },
                    { type: 'speak-aloud', data: { instruction: 'Mix Passives:', phrase: "The building is being renovated, but the work hasn't been finished yet. Several workers got injured during the process." } }
                ]
            },
            // ── C1 Unit 13 ──
            {
                id: 13, title: '🗣️ The Debate', desc: 'Arguing for and against complex academic topics.', unitType: 'situational',
                grammar: ['C1 synthesis'], vocab: ['ethics', 'AI', 'society', 'controversy'],
                homework: { prompt: "Write an argument FOR and AGAINST universal basic income." },
                teachSlides: [
                    { type: 'explain', mascotText: "You've reached the end of C1! The absolute peak of language learning is DEBATE. Arguing complex ideas with nuance and structure.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Debate structures:", mascotEmotion: 'thinking', items: [{ base: 'Conceding', past: "While I admit that AI has risks, its benefits are unparalleled.", highlight: 'While I admit...' }, { base: 'Countering', past: "That may be true, but it fails to account for...", highlight: 'Polite destruction' }, { base: 'Concluding', past: "Ultimately, the evidence suggests that...", highlight: 'Final blow' }] },
                    { type: 'quiz-check', mascotText: "Which phrase is best for politely disagreeing?", mascotEmotion: 'thinking', options: ['You are wrong.', 'I see your point, however...'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Concession', sentence: "___ I understand your concerns, I must disagree.", options: ['While', 'Because'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Counter', sentence: "That's a valid point; ___, we must look at the bigger picture.", options: ['furthermore', 'nevertheless'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Concession', sentence: "___ it may be true that costs will rise, the benefits outweigh them.", options: ['Although', 'Because'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Strengthening', sentence: "The evidence ___ supports the hypothesis.", options: ['overwhelmingly', 'kind of'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Polite Disagree', sentence: "I see your point; ___, I would argue that...", options: ['however', 'and'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Concluding', sentence: "___, the evidence clearly suggests that regulation is necessary.", options: ['Ultimately', 'Firstly'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Debate Move → Phrase', pairs: [{ left: 'Conceding', right: 'While I admit that...' }, { left: 'Countering', right: 'That may be true, but...' }, { left: 'Strengthening', right: 'The evidence overwhelmingly...' }, { left: 'Concluding', right: 'Ultimately, we must...' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Counter', words: ['be', 'fails', 'that', 'true', 'may', 'to', 'it', 'account', 'for'], correct: ['that', 'may', 'be', 'true', 'it', 'fails', 'to', 'account', 'for'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я категорически не согласен с этим утверждением.', fromLang: 'RU', toLang: 'EN', answer: 'I strongly disagree with this statement' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "While I acknowledge the potential drawbacks, the long-term benefits of this policy are undeniable.", hint: 'Concession + counter: While I acknowledge..., the benefits...' } },
                    { type: 'speak-aloud', data: { instruction: 'Debate:', phrase: "While it is undeniably true that costs will rise, we must consider the long-term environmental benefits. Ultimately, the evidence suggests that action is imperative." } }
                ]
            },
            // ── C1 Unit 14 ──
            {
                id: 14, title: '🎯 Final Checkpoint C1', desc: 'Comprehensive review of all C1 grammar.', unitType: 'review',
                grammar: ['all C1 grammar'], vocab: ['C1 mastery'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Discourse Marker', sentence: "The project was expensive; ___, it was completed on time.", options: ['nevertheless', 'moreover'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Causative', sentence: "She is having a dress ___ for the ceremony.", options: ['make', 'made'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Deduction', sentence: "The door is open. Someone ___ broken in.", options: ['must have', 'can\'t have'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Needn\'t have', sentence: "We ___ taken a taxi. The bus would have been faster.", options: ['needn\'t have', 'didn\'t need to'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Not until the final moment ___ the gravity of the situation.", options: ['did she realise', 'she realised'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Cleft', sentence: "___ I find most inspiring is his resilience.", options: ['What', 'It'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "The data ___ to indicate a causal relationship.", options: ['appears', 'proves'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Ellipsis', sentence: "Will it work? — I believe ___.", options: ['so', 'yes'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Mixed Conditional', sentence: "If he had accepted the offer, he ___ in Tokyo right now.", options: ['would be living', 'would have lived'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Advanced Passive', sentence: "The report is ___ reviewed by the board.", options: ['being', 'been'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'C1 Mastery', pairs: [{ left: 'Discourse markers', right: 'However, moreover, consequently' }, { left: 'Inversion', right: 'Never have I seen...' }, { left: 'Hedging', right: 'It appears to suggest...' }, { left: 'Mixed conditional', right: 'If I had known, I would be...' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Inversion + Cleft', words: ['what', 'is', 'seldom', 'do', 'we', 'see', 'remarkable', 'is'], correct: ['seldom', 'do', 'we', 'see', 'what', 'is', 'remarkable', 'is'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Считается, что он уехал из страны.', fromLang: 'RU', toLang: 'EN', answer: 'He is believed to have left the country' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Not only did they fail to meet the deadline, but it is also believed that the data was falsified.", hint: 'Inversion + passive reporting' } },
                    { type: 'speak-aloud', data: { instruction: 'C1 Mastery:', phrase: "What I find most remarkable is how rarely we acknowledge the progress that has been made. Nevertheless, the evidence appears to support the initial hypothesis." } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // C2 — PROFICIENCY (12 units)
    // ═══════════════════════════════════════════
    {
        id: 'c2_proficiency',
        language: 'en',
        title: 'C2 — Proficiency',
        level: 'C2',
        cefr: 'C2',
        methodology: 'CEFR C2 Mastery. Near-native fluency across all registers. Rhetoric, pragmatics, register shifting, academic writing, advanced idioms and figurative language. Full tense synthesis and native-level nuance. ~6200+ cumulative vocabulary.',
        canDo: [
            'Can understand with ease virtually everything heard or read',
            'Can summarise information from different spoken and written sources, reconstructing arguments in a coherent presentation',
            'Can express themselves spontaneously, very fluently, and precisely',
            'Can differentiate finer shades of meaning even in the most complex situations',
            'Can write complex reports, articles, or essays with an effective logical structure',
            'Can shift register seamlessly between formal, informal, and academic contexts',
            'Can use rhetoric and persuasion effectively in speech and writing',
            'Can understand and use idioms, figurative language, and cultural references naturally',
        ],
        objectives: [
            'Full tense synthesis: seamless weaving of all tenses',
            'Pragmatics: implicature, indirectness, hedging',
            'Register shifting: formal ↔ informal ↔ academic',
            'Advanced idioms, collocations, and figurative language',
            'Academic and professional writing at native level',
            'Rhetoric and persuasion techniques',
            'Error analysis and self-correction strategies',
            'Cultural fluency and cross-cultural communication',
        ],
        units: [
            // ── C2 Unit 1 ──
            {
                id: 1, title: 'Mastering the Tense Matrix', desc: 'Seamlessly weaving all tenses natively.', unitType: 'grammar',
                grammar: ['tense synthesis'], vocab: ['nuance', 'implications', 'storytelling'],
                homework: { prompt: "Write a high-level narrative moving from Past Perfect to Future Continuous." },
                teachSlides: [
                    { type: 'explain', mascotText: "Welcome to C2! You know all the rules. Now, it's about the ART of English. Native speakers effortlessly glide between tenses to create microscopic differences in meaning.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Look at the profound difference tense makes:", mascotEmotion: 'thinking', left: { label: 'Past Perf Cont', items: ["I had been working there for years before I realized the truth."] }, right: { label: 'Present Perf Cont', items: ["I have been working here for years, and I still don't know the truth."] } },
                    { type: 'examples', mascotText: "The 'Matrix' sequence: Past -> Present -> Future", mascotEmotion: 'happy', items: [{ base: 'Sequence', past: "By the time he arrives (Present), I will have been waiting (Future Perf Cont) for hours because he had missed (Past Perf) the first train.", highlight: 'Mastery' }] },
                    { type: 'quiz-check', mascotText: "'I ___ to London next week, so I ___ a hotel yet.'", mascotEmotion: 'thinking', options: ['am flying / haven\'t booked', 'fly / didn\'t book'], correct: 0 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Synthesis', sentence: "He ___ for hours before he realized he ___ the wrong way.", options: ['had been driving / had gone', 'was driving / went'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Future Perf', sentence: "By the end of this decade, humanity ___ AI deeply into society.", options: ['will integrate', 'will have integrated'], correct: 1 } },
                    { type: 'word-shuffle', data: { instruction: 'Matrix', words: ['waiting', 'I', 'arrived', 'hours', 'been', 'she', 'for', 'when', 'had'], correct: ['I', 'had', 'been', 'waiting', 'for', 'hours', 'when', 'she', 'arrived'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'К тому времени, как он поймет, будет уже слишком поздно.', fromLang: 'RU', toLang: 'EN', answer: 'By the time he realizes, it will be too late' } },
                    { type: 'speak-aloud', data: { instruction: 'Narrative:', phrase: "I had been hoping to speak with you before you leave tomorrow, as I won't be returning until next week." } }
                ]
            },
            // ── C2 Unit 2 ──
            {
                id: 2, title: 'Complex Verb Patterns', desc: 'Complementation and obscure verbs.', unitType: 'grammar',
                grammar: ['verb complementation', 'multiple gerunds/infinitives'], vocab: ['cognitive verbs', 'perception verbs'],
                homework: { prompt: "Write sentences using 'dread', 'resent', and 'can't bear'." },
                teachSlides: [
                    { type: 'explain', mascotText: "C2 features complex chains of verbs where the rules of Gerunds and Infinitives stack up in advanced ways.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Stacking verbs:", mascotEmotion: 'thinking', items: [{ base: 'Chain', past: "I resent him trying to force me to agree.", highlight: 'resent + object + ing + inf' }, { base: 'Perception', past: "I watched the building collapse. (Whole action) vs I watched the building collapsing. (Action in progress)", highlight: 'V1 vs ING meaning shift' }] },
                    { type: 'quiz-check', mascotText: "I dread ___ told what to do.", mascotEmotion: 'thinking', options: ['to be', 'being'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Resent', sentence: "I resent ___ treated like a child.", options: ['to be', 'being'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Perception (Part)', sentence: "As I walked past, I heard them ___ loudly.", options: ['argue', 'arguing'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Perception (Whole)', sentence: "I saw the thief ___ the bag and run.", options: ['snatch', 'snatching'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Dread', sentence: "She dreads ___ asked to speak in public.", options: ['to be', 'being'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Can\'t bear', sentence: "He can't bear ___ criticized unfairly.", options: ['to be', 'being'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match verb to pattern', pairs: [{ left: 'resent', right: 'verb + -ing (resent)' }, { left: 'manage', right: 'verb + to + inf' }, { left: 'see (whole)', right: 'verb + bare inf' }, { left: 'hear (in progress)', right: 'verb + -ing (hear)' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Complementation', words: ['to', 'manage', 'persuade', 'how', 'did', 'you', 'her', 'to', 'stay'], correct: ['how', 'did', 'you', 'manage', 'to', 'persuade', 'her', 'to', 'stay'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Он не выносит, когда его прерывают.', fromLang: 'RU', toLang: 'EN', answer: 'He cant bear being interrupted' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I resented him trying to persuade me to abandon the project entirely.", hint: 'resent + object + -ing + to + infinitive' } },
                    { type: 'speak-aloud', data: { instruction: 'Complex chains:', phrase: "I resented him trying to persuade me to abandon the project." } }
                ]
            },
            // ── C2 Unit 3 ──
            {
                id: 3, title: 'Subjunctive & Advanced Inversion', desc: 'The pinnacle of formality.', unitType: 'grammar',
                grammar: ['the subjunctive mood', 'fronting and inversion'], vocab: ['legal', 'demands', 'formal rhetoric'],
                homework: { prompt: "Write 3 formal demands using the subjunctive (e.g. It is crucial that he...)" },
                teachSlides: [
                    { type: 'explain', mascotText: "The Subjunctive is a ghost in English! It appears in formal demands, legal text, and strong advice, dropping the 's' for third person.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "The Subjunctive formula:", mascotEmotion: 'thinking', items: [{ base: 'Normal', past: "He leaves early.", highlight: 'Indicative' }, { base: 'Subjunctive', past: "I demand that he LEAVE early.", highlight: 'No "s" !' }, { base: 'Verb BE', past: "It is essential that she BE informed.", highlight: 'Use bare "be"' }] },
                    { type: 'examples', mascotText: "Extreme Inversion for Rhetoric:", mascotEmotion: 'thinking', items: [{ base: 'Fronting', past: "On the hill stood a giant castle.", highlight: 'Location prep fronted' }] },
                    { type: 'quiz-check', mascotText: "It is imperative that John ___ present at the meeting.", mascotEmotion: 'thinking', options: ['is', 'be'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Subjunctive', sentence: "The board insists that she ___ her resignation immediately.", options: ['tenders', 'tender'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Subjunctive BE', sentence: "It is vital that the documents ___ signed today.", options: ['are', 'be'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Under no circumstances ___ allowed to enter.", options: ['are visitors', 'visitors are'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Subjunctive', words: ['be', 'vital', 'that', 'it', 'notified', 'they', 'is'], correct: ['it', 'is', 'vital', 'that', 'they', 'be', 'notified'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Крайне важно, чтобы он был там.', fromLang: 'RU', toLang: 'EN', answer: 'It is crucial that he be there' } },
                    { type: 'speak-aloud', data: { instruction: 'Formal demand:', phrase: "I demand that the charges be dropped and that my client be released immediately." } }
                ]
            },
            // ── C2 Unit 4 ──
            {
                id: 4, title: 'Concessive Clauses & Contrast', desc: 'Notwithstanding, albeit, even so.', unitType: 'grammar',
                grammar: ['advanced concession', 'despite vs although'], vocab: ['debate', 'academic paradoxes'],
                homework: { prompt: "Use 'albeit' and 'notwithstanding' in two sentences about a complex subject." },
                teachSlides: [
                    { type: 'explain', mascotText: "C2 English thrives on nuance and contrast. Let's upgrade 'but' and 'although' to the ultimate academic level.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "Elite Concessive vocabulary:", mascotEmotion: 'thinking', left: { label: 'B2/C1 forms', items: ["Although it was raining...", "Despite the rain..."] }, right: { label: 'C2 forms', items: ["Rain notwithstanding...", "It was a great, ALBEIT rainy, day.", "Be that as it may,..."] } },
                    { type: 'quiz-check', mascotText: "The task was successfully completed, ___ belatedly.", mascotEmotion: 'thinking', options: ['although', 'albeit'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Albeit', sentence: "He accepted the offer, ___ reluctantly.", options: ['even though', 'albeit'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Notwithstanding', sentence: "___ the lack of evidence, he was convicted.", options: ['Notwithstanding', 'Although'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Contrast phrase', sentence: "He is a genius. ___, his methods are highly unorthodox.", options: ['Be that as it may', 'Whereas'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Concession', words: ['albeit', 'solution', 'was', 'expensive', 'an', 'it', 'effective'], correct: ['it', 'was', 'an', 'effective', 'albeit', 'expensive', 'solution'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Каким бы умным он ни был, он совершает ошибки.', fromLang: 'RU', toLang: 'EN', answer: 'Smart as he may be, he makes mistakes' } },
                    { type: 'speak-aloud', data: { instruction: 'Academic contrast:', phrase: "The findings were significant, albeit subject to certain methodological limitations." } }
                ]
            },
            // ── C2 Unit 5 ──
            {
                id: 5, title: '🔄 Checkpoint 1', desc: 'Review C2 Units 1-4: tense matrix, verb patterns, subjunctive, concessives.', unitType: 'review',
                grammar: ['matrix', 'complementation', 'subjunctive', 'concessives'], vocab: ['C2 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Subjunctive', sentence: "It is imperative that she ___ present at the hearing.", options: ['is', 'be'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Albeit', sentence: "It was a fair, ___ difficult, compromise.", options: ['albeit', 'however'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Perception', sentence: "I heard the bomb ___ (the complete event).", options: ['explode', 'exploding'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Inversion', sentence: "Not until yesterday ___ the full truth.", options: ['I realized', 'did I realize'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Tense matrix', sentence: "By the time they ___, we ___ for over an hour.", options: ['arrived / had been waiting', 'arrive / waited'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Concessive', sentence: "___ the considerable risks, they pressed ahead.", options: ['Notwithstanding', 'Although'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Complementation', sentence: "She resented ___ overlooked for the promotion.", options: ['to be', 'being'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match C2 grammar', pairs: [{ left: 'Subjunctive', right: 'It is vital that he BE there' }, { left: 'Inversion', right: 'Never have I seen such chaos' }, { left: 'Albeit', right: 'A costly, albeit effective, solution' }, { left: 'Past Perf Continuous', right: 'Had been working for years' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Inversion', words: ['no', 'did', 'circumstances', 'under', 'he', 'reveal', 'the', 'truth'], correct: ['under', 'no', 'circumstances', 'did', 'he', 'reveal', 'the', 'truth'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Я настаиваю, чтобы он извинился.', fromLang: 'RU', toLang: 'EN', answer: 'I insist that he apologize' } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Ни при каких обстоятельствах вы не должны разглашать эту информацию.', fromLang: 'RU', toLang: 'EN', answer: 'Under no circumstances should you disclose this information' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "It is essential that all delegates be present at the opening session.", hint: 'Subjunctive: bare infinitive after "that"' } },
                    { type: 'speak-aloud', data: { instruction: 'C2 review:', phrase: "Notwithstanding the objections, and albeit reluctantly, the board insisted that the proposal be adopted immediately." } }
                ]
            },
            // ── C2 Unit 6 ──
            {
                id: 6, title: 'Nominalization', desc: 'Turning verbs into nouns for academic density.', unitType: 'grammar',
                grammar: ['nominalization', 'academic density'], vocab: ['journalism', 'reports', 'policy'],
                homework: { prompt: "Convert 3 action-packed sentences into dense, noun-heavy academic sentences." },
                teachSlides: [
                    { type: 'explain', mascotText: "In C2 writing (like science or law), we hate verbs! We turn verbs into Nouns. This makes the text dense, objective, and unemotional. This is Nominalization.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Action vs Nominalization:", mascotEmotion: 'thinking', items: [{ base: 'Verbs (B2)', past: "They investigated the crime, which slowed down the project.", highlight: 'investigated / slowed' }, { base: 'Nouns (C2)', past: "The investigation OF the crime resulted in the deceleration OF the project.", highlight: 'Nouns rule!' }] },
                    { type: 'quiz-check', mascotText: "'We implemented the policy quickly.' -> 'The rapid ___ of the policy...'", mascotEmotion: 'thinking', options: ['implementing', 'implementation'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Nominalize', sentence: "We must analyze the data. -> The ___ of the data is crucial.", options: ['analyzing', 'analysis'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Nominalize', sentence: "They failed to communicate. -> Their ___ of communication caused issues.", options: ['lack', 'failing'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Nominalize', sentence: "The government responded adequately. -> The government's ___ was adequate.", options: ['response', 'responding'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Dense academic', words: ['led', 'the', 'system', 'failure', 'of', 'to', 'collapse', 'the'], correct: ['the', 'failure', 'of', 'the', 'system', 'led', 'to', 'collapse'] } }, // "The failure of the system led to collapse", adjusted slightly to make sense.
                    // Corrected version:
                    { type: 'word-shuffle', data: { instruction: 'Dense academic', words: ['led', 'the', 'system', 'failure', 'of', 'the', 'to', 'catastrophe'], correct: ['the', 'failure', 'of', 'the', 'system', 'led', 'to', 'catastrophe'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Реализация этого плана займет месяцы.', fromLang: 'RU', toLang: 'EN', answer: 'The implementation of this plan will take months' } },
                    { type: 'speak-aloud', data: { instruction: 'Academic read:', phrase: "The rapid degradation of the ecosystem is a direct result of industrial expansion." } }
                ]
            },
            // ── C2 Unit 7 ──
            {
                id: 7, title: 'Participle Clauses', desc: 'Having done this, doing that...', unitType: 'grammar',
                grammar: ['present participles', 'past participles', 'perfect participles'], vocab: ['literature', 'biography'],
                homework: { prompt: "Write a short paragraph about a historical figure using 3 participle clauses." },
                teachSlides: [
                    { type: 'explain', mascotText: "Want to write like a famous author? Pack more information into a sentence without using 'because', 'when', or 'who' by using Participles!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Three types of Participle Clauses:", mascotEmotion: 'thinking', items: [{ base: 'Present (-ing)', past: "Walking down the street, I saw a friend.", highlight: '(While I was walking)' }, { base: 'Past (V3)', past: "Built in 1990, the house is very sturdy.", highlight: '(Because it was built in 1990)' }, { base: 'Perfect (Having V3)', past: "Having finished my homework, I went to bed.", highlight: '(After I had finished)' }] },
                    { type: 'quiz-check', mascotText: "___ all his money, he had to walk home.", mascotEmotion: 'thinking', options: ['Lost', 'Having lost'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Perfect Participle', sentence: "___ the book, I can enthusiastically recommend it.", options: ['Having read', 'Reading'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Past Participle', sentence: "___ by critics everywhere, the movie was a box office bomb.", options: ['Panned', 'Panning'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Present Participle', sentence: "___ at the phone, he didn't see the car coming.", options: ['Looking', 'Looked'], correct: 0 } },
                    { type: 'word-shuffle', data: { instruction: 'Participle', words: ['having', 'experience', 'failed', 'gained', 'he', 'valuable', 'once'], correct: ['having', 'failed', 'once', 'he', 'gained', 'valuable', 'experience'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Будучи уставшим, он рано лег спать.', fromLang: 'RU', toLang: 'EN', answer: 'Being tired, he went to bed early' } },
                    { type: 'speak-aloud', data: { instruction: 'Literature:', phrase: "Exhausted from the journey, and having spent all his money, he finally arrived at the gates." } }
                ]
            },
            // ── C2 Unit 8 ──
            {
                id: 8, title: 'Pragmatics & Sarcasm', desc: 'Understanding what is NOT said.', unitType: 'grammar',
                grammar: ['idiom reduction', 'irony', 'pragmatic inference'], vocab: ['humor', 'wit', 'social cues'],
                homework: { prompt: "Describe a situation where someone says 'Oh, brilliant' but means the opposite." },
                teachSlides: [
                    { type: 'explain', mascotText: "Language isn't just grammar. In C2, you must understand Pragmatics—the implied meaning. British sarcasm is the ultimate test of this!", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Literal vs Pragmatic meaning:", mascotEmotion: 'thinking', items: [{ base: 'Phrase', past: "'With the greatest respect...'", highlight: 'Translation: I completely disagree and think you are wrong.' }, { base: 'Phrase', past: "'Very interesting point.'", highlight: 'Translation: That is nonsense, let us move on.' }, { base: 'Situation', past: "Pouring rain. Native says: 'Lovely weather for a walk!'", highlight: 'Sarcasm / Irony' }] },
                    { type: 'quiz-check', mascotText: "If a Brit says 'I'm a bit annoyed', they probably mean...", mascotEmotion: 'thinking', options: ['They are slightly irritated.', 'They are absolutely furious.'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Pragmatics', sentence: "When he said 'I've got a slight problem', it turned out the server had entirely crashed. 'Slight' here is:", options: ['understatement', 'exaggeration'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Sarcasm', sentence: "You spilled coffee all over my laptop. 'Oh, ___. Just what I needed.'", options: ['brilliant', 'terrible'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Implicature', sentence: "'I wouldn't say it was a complete failure.' This means:", options: ['It was mostly a failure', 'It was a great success'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'British understatement', sentence: "'It's not exactly ideal' means:", options: ['It is acceptable', 'It is terrible'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'What they say vs what they mean', pairs: [{ left: 'With the greatest respect', right: 'I think you are wrong' }, { left: 'Very interesting', right: 'I disagree completely' }, { left: 'I hear what you say', right: 'I will ignore this' }, { left: 'Not bad at all', right: 'Quite good actually' }] } },
                    { type: 'type-translation', data: { instruction: 'Pragmatic Translation (meaning)', sourceText: 'При всем должном уважении... (но я не согласен)', fromLang: 'RU', toLang: 'EN', answer: 'With all due respect' } },
                    { type: 'type-translation', data: { instruction: 'Sarcastic tone', sourceText: 'О, замечательно! Именно то, чего мне не хватало. (сарказм)', fromLang: 'RU', toLang: 'EN', answer: 'Oh, wonderful! Just what I needed' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "I wouldn't say it was entirely without its challenges.", hint: 'British understatement — means it was very difficult' } },
                    { type: 'speak-aloud', data: { instruction: 'Deliver sarcasm:', phrase: "Oh, fantastic! A flat tire in the middle of a thunderstorm. Could this day get any better?" } }
                ]
            },
            // ── C2 Unit 9 ──
            {
                id: 9, title: '🗣️ The Negotiation', desc: 'High-stakes C2 communication.', unitType: 'situational',
                grammar: ['conditionals', 'passives', 'modals'], vocab: ['leverage', 'concessions', 'compromise'],
                homework: { prompt: "Write a high-level email negotiating a salary increase." },
                teachSlides: [
                    { type: 'explain', mascotText: "Negotiation requires the ultimate mix of diplomacy (hedging), strategy (conditionals), and power (emphasis). Let's close the deal safely but strongly.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Strategic phrasing:", mascotEmotion: 'thinking', items: [{ base: 'Conditionals', past: "Supposing we agreed to your terms, would you be willing to expedite delivery?", highlight: 'Hypothetical leverage' }, { base: 'Softening', past: "We might struggle to accommodate that timeline.", highlight: 'Polite refusal' }] },
                    { type: 'quiz-check', mascotText: "Which is the best negotiation tactic?", mascotEmotion: 'thinking', options: ["Give me a discount or I will leave.", "If we were to increase our order volume, what flexibility might there be on price?"], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Hypothetical', sentence: "___ we were to greenlight this, what guarantee do we have?", options: ['Supposing', 'Unless'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Soft Refusal', sentence: "That's going to be ___ difficult from our end.", options: ['highly', 'somewhat'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Hedging', sentence: "We ___ be in a position to reconsider, given certain conditions.", options: ['might', 'will'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Counter-offer', sentence: "___ that we can meet halfway, would you be willing to proceed?", options: ['Provided', 'Unless'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Negotiation register', pairs: [{ left: 'Give me a discount', right: 'Direct / aggressive' }, { left: 'What flexibility is there on price?', right: 'Strategic / diplomatic' }, { left: 'That won\'t work', right: 'Direct / blunt' }, { left: 'We might struggle to accommodate that', right: 'Hedged / polite' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Diplomatic refusal', words: ['position', 'we', 'not', 'a', 'are', 'in', 'to', 'accept', 'those', 'terms'], correct: ['we', 'are', 'not', 'in', 'a', 'position', 'to', 'accept', 'those', 'terms'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'При условии, что мы подпишем сегодня, вы дадите скидку?', fromLang: 'RU', toLang: 'EN', answer: 'Provided that we sign today, will you give a discount?' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Were we to increase the order volume, what kind of flexibility might there be on pricing?", hint: 'Formal inversion: Were we to = If we were to' } },
                    { type: 'speak-aloud', data: { instruction: 'Negotiate:', phrase: "While your proposal is certainly intriguing, we would need to review the budget constraints before making any firm commitments." } }
                ]
            },
            // ── C2 Unit 10 ──
            {
                id: 10, title: '🔄 Checkpoint 2', desc: 'Review C2 Units 6-9.', unitType: 'review',
                grammar: ['nominalization', 'participles', 'pragmatics'], vocab: ['C2 review'],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Nominalization', sentence: "The ___ of the new software was a disaster.", options: ['deploying', 'deployment'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Participle', sentence: "___ by the media, the politician resigned.", options: ['Hounding', 'Hounded'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Participle Perfect', sentence: "___ the first exam, he felt confident about the second.", options: ['Having passed', 'Passed'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Pragmatics (Understatement)', sentence: "Winning the lottery was not an entirely ___ experience.", options: ['awful', 'unpleasant'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Nominalization', sentence: "The government's ___ to act quickly was widely criticized.", options: ['failing', 'failure'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Negotiation hedge', sentence: "We ___ be open to renegotiating, depending on the terms.", options: ['might', 'will'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Match verb to noun form', pairs: [{ left: 'investigate', right: 'investigation' }, { left: 'implement', right: 'implementation' }, { left: 'respond', right: 'response' }, { left: 'degrade', right: 'degradation' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Participle clause', words: ['having', 'exhausted', 'all', 'options', 'they', 'reluctantly', 'agreed'], correct: ['having', 'exhausted', 'all', 'options', 'they', 'reluctantly', 'agreed'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Прочитав отчет, я был шокирован.', fromLang: 'RU', toLang: 'EN', answer: 'Having read the report, I was shocked' } },
                    { type: 'type-translation', data: { instruction: 'Nominalize', sourceText: 'Правительство не отреагировало вовремя. → Неспособность правительства...', fromLang: 'RU', toLang: 'EN', answer: "The government's failure to respond in a timely manner" } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "Overwhelmed by the sheer volume of evidence, the committee adjourned the hearing.", hint: 'Past participle clause at the start' } },
                    { type: 'speak-aloud', data: { instruction: 'Academic register:', phrase: "Having reviewed all available evidence, and notwithstanding certain procedural irregularities, the committee concluded that the deployment was premature." } }
                ]
            },
            // ── C2 Unit 11 ──
            {
                id: 11, title: 'Fixed Phrases & Binomials', desc: 'By and large, wear and tear.', unitType: 'grammar',
                grammar: ['collocations', 'binomials'], vocab: ['idioms', 'native expressions'],
                homework: { prompt: "Write 5 sentences using binomial expressions like 'safe and sound'." },
                teachSlides: [
                    { type: 'explain', mascotText: "Native speakers use 'chunking'. They don't invent sentences word-by-word; they use fixed chunks! Binomials are pairs of words grouped by 'and' or 'or'.", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Common Binomials (The order CANNOT change!):", mascotEmotion: 'thinking', items: [{ base: 'Wear and tear', past: "The sofa has some wear and tear.", highlight: '(NOT: tear and wear)' }, { base: 'By and large', past: "By and large, it was a success.", highlight: '(Mostly)' }, { base: 'Sick and tired', past: "I'm sick and tired of this rain.", highlight: '(Very annoyed)' }] },
                    { type: 'quiz-check', mascotText: "They arrived home safe and ___.", mascotEmotion: 'thinking', options: ['secure', 'sound'], correct: 1 }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Binomial', sentence: "I just need some peace and ___.", options: ['quiet', 'silence'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Binomial', sentence: "He's the life and ___ of the party.", options: ['heart', 'soul'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Phrases', sentence: "It's a matter of life and ___.", options: ['death', 'dying'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Binomial', sentence: "I've been up and ___ since six this morning.", options: ['about', 'around'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Complete the binomial', pairs: [{ left: 'safe and', right: 'sound' }, { left: 'wear and', right: 'tear' }, { left: 'by and', right: 'large' }, { left: 'sick and', right: 'tired' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Binomials', words: ['large', 'and', 'project', 'the', 'by', 'successful', 'was'], correct: ['by', 'and', 'large', 'the', 'project', 'was', 'successful'] } },
                    { type: 'type-translation', data: { instruction: 'Translate', sourceText: 'Мы добрались в целости и сохранности.', fromLang: 'RU', toLang: 'EN', answer: 'We arrived safe and sound' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "By and large, the project was a success despite some wear and tear.", hint: 'Two binomials in one sentence' } },
                    { type: 'speak-aloud', data: { instruction: 'Chunking:', phrase: "By and large, despite the wear and tear, we arrived safe and sound." } }
                ]
            },
            // ── C2 Unit 12 ──
            {
                id: 12, title: '🗣️ The Maestro: Academic vs Slang', desc: 'Flawless register shifting across boundaries.', unitType: 'situational',
                grammar: ['ultimate register shift'], vocab: ['slang', 'academese', 'code-switching'],
                homework: { prompt: "Take a formal C2 paragraph and rewrite it entirely in street slang." },
                teachSlides: [
                    { type: 'explain', mascotText: "The final mark of true C2 Proficiency isn't just knowing big words—it's knowing exactly when NOT to use them. It's the ability to shift from Academic to Street Slang seamlessly.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "The Ultimate Shift:", mascotEmotion: 'thinking', left: { label: 'Academic Tone', items: ["It is imperative that we ascertain the veracity of these claims prior to adjudication."] }, right: { label: 'Casual / Slang Tone', items: ["We gotta figure out if this stuff is legit before deciding."] } },
                    { type: 'explain', mascotText: "Congratulations. You have completed the Long Golden Path. You are now a Langy AI English Master!! 🎉", mascotEmotion: 'celebrate' }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Formalize', sentence: "Find out if it's true. -> ___ the veracity of the claim.", options: ['Ascertain', 'Check'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Casualize', sentence: "I am exhausted. -> I am absolutely ___.", options: ['fatigued', 'shattered'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'C2 Vocabulary', sentence: "His behavior is completely ___ (impossible to excuse).", options: ['inexcusable', 'bad'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Formalize', sentence: "They got rid of the problem. -> They ___ the issue.", options: ['eliminated', 'removed'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Casualize', sentence: "The proposal was rejected. -> They ___ it down.", options: ['turned', 'shut'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Match register', pairs: [{ left: 'ascertain', right: 'find out' }, { left: 'commence', right: 'start / kick off' }, { left: 'elucidate', right: 'explain / break down' }, { left: 'proliferation', right: 'spread' }] } },
                    { type: 'word-shuffle', data: { instruction: 'Formal register', words: ['the', 'proliferation', 'of', 'this', 'technology', 'is', 'inevitable'], correct: ['the', 'proliferation', 'of', 'this', 'technology', 'is', 'inevitable'] } },
                    { type: 'type-translation', data: { instruction: 'Final Boss', sourceText: 'Я считаю, что распространение этой технологии неизбежно.', fromLang: 'RU', toLang: 'EN', answer: 'I believe the proliferation of this technology is inevitable' } },
                    { type: 'type-translation', data: { instruction: 'Casualize', sourceText: 'Необходимо установить достоверность этих утверждений. (просто)', fromLang: 'RU', toLang: 'EN', answer: 'We need to figure out if these claims are true' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: "It is imperative that we ascertain the veracity of these claims prior to adjudication.", hint: 'Full academic register' } },
                    { type: 'speak-aloud', data: { instruction: 'Graduation Speech:', phrase: "Having traversed the complexities of the English language, I am profoundly grateful for the journey. Thank you, Langy." } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // SPANISH — A1 Starter (Seed curriculum)
    // Based on PCIC / Aula Internacional progression
    // ═══════════════════════════════════════════
    {
        id: 'es_a1_beginner',
        language: 'es',
        title: 'A1 — Principiante',
        level: 'A1',
        cefr: 'A1',
        methodology: 'Introduction to Spanish. Greetings, ser/estar, present tense, basic conversation. Communicative + cultural approach.',
        units: [
            {
                id: 1, title: 'El alfabeto y saludos', desc: 'The Spanish alphabet, pronunciation rules, and basic greetings.',
                unitType: 'grammar', grammar: ['Spanish alphabet', 'pronunciation rules', 'basic greetings'],
                vocab: ['hola', 'adiós', 'por favor', 'gracias', 'buenos días', 'buenas tardes', 'buenas noches'],
                teachSlides: [
                    { type: 'explain', mascotText: "¡Bienvenido! Welcome to Spanish! The Spanish alphabet has 27 letters — one more than English: the letter Ñ. Spanish pronunciation is very regular — what you see is what you say!", mascotEmotion: 'happy' },
                    { type: 'vocab-intro', mascotText: "Essential greetings:", mascotEmotion: 'happy',
                      words: [{ en: 'Hola', ru: 'Привет' }, { en: 'Buenos días', ru: 'Доброе утро' }, { en: 'Buenas tardes', ru: 'Добрый день' }, { en: 'Buenas noches', ru: 'Добрый вечер' }, { en: 'Adiós', ru: 'До свидания' }, { en: 'Gracias', ru: 'Спасибо' }, { en: 'Por favor', ru: 'Пожалуйста' }] },
                    { type: 'tip', mascotText: "In Spanish, vowels always sound the same: A=/a/, E=/e/, I=/i/, O=/o/, U=/u/. No surprises!", mascotEmotion: 'happy', tipText: "A=ah · E=eh · I=ee · O=oh · U=oo — always!" }
                ],
                exercises: [
                    { type: 'match-pairs', data: { instruction: 'Match Spanish to translation', pairs: [{ left: 'Hola', right: 'Hello' }, { left: 'Adiós', right: 'Goodbye' }, { left: 'Gracias', right: 'Thank you' }, { left: 'Por favor', right: 'Please' }] } },
                    { type: 'fill-bubble', data: { instruction: 'Morning greeting:', sentence: 'Buenos ___', options: ['días', 'tardes', 'noches'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Evening greeting:', sentence: 'Buenas ___', options: ['días', 'tardes', 'noches'], correct: 2 } },
                    { type: 'speak-aloud', data: { instruction: 'Say these greetings:', phrase: '¡Hola! Buenos días. ¿Cómo estás? Gracias. Adiós.' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Hola', hint: 'A simple greeting' } }
                ]
            },
            {
                id: 2, title: 'Ser y Estar: to be', desc: 'The two Spanish verbs for "to be". When to use ser vs estar.',
                unitType: 'grammar', grammar: ['ser (identity, origin)', 'estar (state, location)'],
                vocab: ['soy', 'eres', 'es', 'estoy', 'estás', 'está', 'nacionalidades'],
                teachSlides: [
                    { type: 'explain', mascotText: "Spanish has TWO verbs for 'to be': SER and ESTAR. This is the #1 thing English speakers struggle with. SER = permanent identity. ESTAR = temporary state or location.", mascotEmotion: 'happy' },
                    { type: 'compare', mascotText: "SER vs ESTAR:", mascotEmotion: 'thinking',
                      left: { label: 'SER (identity)', items: ['Yo soy Anna', 'Él es doctor', 'Ella es española', 'Nosotros somos amigos'] },
                      right: { label: 'ESTAR (state/place)', items: ['Yo estoy bien', 'Él está en casa', 'Ella está cansada', 'Nosotros estamos aquí'] }
                    },
                    { type: 'tip', mascotText: "Memory trick: SER = 'Doctor PLACE' — Description, Origin, Characteristics, Time, Occupation, Relationship, PLace... wait, no! Place = ESTAR! ESTAR = Location, Emotion, Condition, Action.", mascotEmotion: 'happy', tipText: "SER = who you ARE · ESTAR = how you FEEL / where you ARE" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Identity = ser', sentence: 'Yo ___ estudiante.', options: ['soy', 'estoy', 'es'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Location = estar', sentence: 'Ella ___ en Madrid.', options: ['es', 'está', 'son'], correct: 1 } },
                    { type: 'fill-bubble', data: { instruction: 'Origin = ser', sentence: 'Nosotros ___ de México.', options: ['somos', 'estamos', 'son'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Emotion = estar', sentence: 'Yo ___ contento.', options: ['soy', 'estoy', 'es'], correct: 1 } },
                    { type: 'match-pairs', data: { instruction: 'Match pronoun to ser form', pairs: [{ left: 'yo', right: 'soy' }, { left: 'tú', right: 'eres' }, { left: 'él/ella', right: 'es' }, { left: 'nosotros', right: 'somos' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Introduce yourself:', phrase: 'Hola. Yo soy Alex. Soy de Rusia. Estoy muy bien, gracias.' } }
                ]
            },
            {
                id: 3, title: '🗣️ En el café', desc: 'Ordering food and drinks in Spanish. Polite phrases.',
                unitType: 'situational', grammar: ['quiero / quisiera', '¿Cuánto cuesta?'],
                vocab: ['café', 'agua', 'cerveza', 'bocadillo', 'la cuenta', 'quiero', 'quisiera'],
                teachSlides: [
                    { type: 'explain', mascotText: "¡Vamos al café! Let's learn to order in Spanish. The key phrases: 'Quiero...' (I want) or more politely 'Quisiera...' (I would like).", mascotEmotion: 'happy' },
                    { type: 'examples', mascotText: "Key ordering phrases:", mascotEmotion: 'happy',
                      items: [
                        { base: 'Order', past: 'Quisiera un café, por favor.', highlight: 'Quisiera' },
                        { base: 'Price', past: '¿Cuánto cuesta?', highlight: 'Cuánto' },
                        { base: 'Bill', past: 'La cuenta, por favor.', highlight: 'La cuenta' },
                        { base: 'Thanks', past: '¡Muchas gracias!', highlight: 'Muchas' }
                      ] },
                    { type: 'tip', mascotText: "'Quisiera' is more polite than 'Quiero'. Like 'I would like' vs 'I want'. Use 'quisiera' in restaurants!", mascotEmotion: 'happy', tipText: "Quiero = I want · Quisiera = I would like (polite)" }
                ],
                exercises: [
                    { type: 'fill-bubble', data: { instruction: 'Complete the order', sentence: '___ un café, por favor.', options: ['Quisiera', 'Estoy', 'Soy'], correct: 0 } },
                    { type: 'fill-bubble', data: { instruction: 'Ask for the price', sentence: '¿___ cuesta?', options: ['Cuánto', 'Cómo', 'Dónde'], correct: 0 } },
                    { type: 'match-pairs', data: { instruction: 'Match Spanish to English', pairs: [{ left: 'café', right: 'coffee' }, { left: 'agua', right: 'water' }, { left: 'la cuenta', right: 'the bill' }, { left: 'cerveza', right: 'beer' }] } },
                    { type: 'speak-aloud', data: { instruction: 'Order at a café:', phrase: '¡Hola! Quisiera un café y un bocadillo, por favor. ¿Cuánto cuesta? Gracias.' } },
                    { type: 'listen-type', data: { instruction: 'Listen and type', text: 'Quisiera un café', hint: 'Polite request' } }
                ]
            }
        ]
    },

    // ═══════════════════════════════════════════
    // ARABIC — A1 Starter (Seed curriculum)
    // Based on Al-Kitaab / MSA progression
    // ═══════════════════════════════════════════
    {
        id: 'ar_a1_beginner',
        language: 'ar',
        title: 'A1 — مبتدئ',
        level: 'A1',
        cefr: 'A1',
        methodology: 'Script-first introduction to Arabic. Letters in 4 progressive groups, vowel marks, first reading, then greetings and self-introduction. MSA (Modern Standard Arabic) with spoken dialect awareness.',
        canDo: [
            'Can recognise and name all 28 Arabic letters in isolated form',
            'Can distinguish dot patterns that differentiate similar letters (\u0628/\u062a/\u062b, \u062f/\u0630, \u0631/\u0632, \u0633/\u0634)',
            'Can identify emphatic and pharyngeal sounds unique to Arabic (\u0635, \u0636, \u0637, \u0638, \u0639, \u063a)',
            'Can read short vowel marks (fat\u1e25a, \u1e0damma, kasra) and special marks (suk\u016bn, shadda)',
            'Can sound out and read simple Arabic words letter by letter',
            'Can use basic greetings and polite phrases (\u0645\u0631\u062d\u0628\u0627, \u0634\u0643\u0631\u0627\u064b, \u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064a\u0643\u0645)',
            'Can introduce themselves with \u0623\u0646\u0627 and \u0627\u0633\u0645\u064a',
            'Can count from 1 to 10 in Arabic and recognise Eastern Arabic numerals (\u0661\u0662\u0663)',
        ],
        objectives: [
            'Letter recognition: all 28 letters in isolated form with correct naming',
            'Dot-pattern awareness: distinguish similar-shape letters by dot count and position',
            'Emphatic and pharyngeal sounds: \u1e63\u0101d, \u1e0d\u0101d, \u1e6d\u0101, \u1e93\u0101, \u02bfayn, ghayn',
            'Vowel system: fat\u1e25a (a), \u1e0damma (u), kasra (i), suk\u016bn, shadda',
            'First reading: decode simple vowelled words (e.g. \u0643\u064e\u062a\u064e\u0628\u064e, \u0628\u064e\u064a\u062a)',
            'Essential phrases: greetings, thank you, yes/no, goodbye',
            'Self-introduction: \u0623\u0646\u0627 (I), \u0627\u0633\u0645\u064a (my name)',
            'Numbers 1\u201310 and Eastern Arabic digit recognition',
        ],
        units: [
    // ── Unit 1: Letters Group 1 ──
    {
        id: 1, title: 'الحروف ١ — Letters: ا ب ت ث ج ح', desc: 'Your first 6 Arabic letters — shapes, sounds, and recognition.',
        unitType: 'grammar', grammar: ['Arabic script basics', 'letter recognition', 'isolated forms'],
        vocab: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح'],
        teachSlides: [
            { type: 'explain', mascotText: "مرحباً! Welcome to Arabic! We'll learn the alphabet in groups of 6–7 letters. Arabic has 28 letters — each has up to 4 forms. Today: your first 6.", mascotEmotion: 'happy' },
            { type: 'compare', mascotText: "Arabic is written right-to-left. Let's meet your first letters:", mascotEmotion: 'thinking',
              left: { label: 'Letter → Name', items: ['ا = alif (a)', 'ب = bā (b)', 'ت = tā (t)'] },
              right: { label: 'Letter → Name', items: ['ث = thā (th)', 'ج = jīm (j)', 'ح = ḥā (ḥ)'] }
            },
            { type: 'tip', mascotText: "Notice: ب ت ث look similar — same shape, different dots! 1 dot below = ب, 2 dots above = ت, 3 dots above = ث. Dots are the key!", mascotEmotion: 'happy', tipText: "ب = 1 dot below · ت = 2 dots above · ث = 3 dots above" }
        ],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match letter to sound', pairs: [{ left: 'ا', right: 'alif' }, { left: 'ب', right: 'bā' }, { left: 'ت', right: 'tā' }, { left: 'ث', right: 'thā' }] } },
            { type: 'fill-bubble', data: { instruction: 'Which letter is "jīm"?', sentence: 'jīm = ___', options: ['ح', 'ج', 'ث'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'How many dots does ث have?', sentence: 'ث has ___ dots', options: ['1', '2', '3'], correct: 2 } },
            { type: 'fill-bubble', data: { instruction: 'Arabic is written:', sentence: 'Arabic is written ___', options: ['left-to-right', 'right-to-left', 'top-to-bottom'], correct: 1 } },
            { type: 'match-pairs', data: { instruction: 'Match by dots', pairs: [{ left: '1 dot below', right: 'ب' }, { left: '2 dots above', right: 'ت' }, { left: '3 dots above', right: 'ث' }, { left: 'no dots', right: 'ا' }] } },
            { type: 'speak-aloud', data: { instruction: 'Say each letter name:', phrase: 'Alif, bā, tā, thā, jīm, ḥā' } }
        ]
    },
    // ── Unit 2: Letters Group 2 ──
    {
        id: 2, title: 'الحروف ٢ — Letters: خ د ذ ر ز س ش', desc: 'Letters 7–13: new shapes and the sun/moon letter concept.',
        unitType: 'grammar', grammar: ['letter forms group 2', 'dot patterns', 'letter shapes'],
        vocab: ['خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش'],
        teachSlides: [
            { type: 'explain', mascotText: "Great progress! Today: 7 more letters. Notice how د and ذ are the same shape — the dot above makes ذ. Same pattern as ر and ز!", mascotEmotion: 'happy' },
            { type: 'compare', mascotText: "Dot twins — same shape, different sounds:", mascotEmotion: 'thinking',
              left: { label: 'No dot', items: ['د = dāl (d)', 'ر = rā (r)', 'س = sīn (s)'] },
              right: { label: 'With dot(s)', items: ['ذ = dhāl (dh)', 'ز = zāy (z)', 'ش = shīn (sh)'] }
            },
            { type: 'tip', mascotText: "خ is like ح from Group 1, but with a dot above. Pattern: ح = no dot, خ = dot above.", mascotEmotion: 'happy', tipText: "ح (ḥā) → خ (khā): same shape + dot" }
        ],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match letter to sound', pairs: [{ left: 'خ', right: 'khā' }, { left: 'د', right: 'dāl' }, { left: 'ر', right: 'rā' }, { left: 'س', right: 'sīn' }] } },
            { type: 'fill-bubble', data: { instruction: 'Which letter is "shīn"?', sentence: 'shīn = ___', options: ['س', 'ش', 'ث'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'ذ is like د but with:', sentence: 'ذ = د + ___', options: ['a dot above', 'a dot below', 'two dots'], correct: 0 } },
            { type: 'match-pairs', data: { instruction: 'Dot twins — match the pair', pairs: [{ left: 'د (no dot)', right: 'ذ (dot)' }, { left: 'ر (no dot)', right: 'ز (dot)' }, { left: 'س (no dots)', right: 'ش (dots)' }, { left: 'ح (no dot)', right: 'خ (dot)' }] } },
            { type: 'fill-bubble', data: { instruction: 'How many letters learned so far?', sentence: 'Group 1 + Group 2 = ___', options: ['10', '13', '15'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Say each letter name:', phrase: 'Khā, dāl, dhāl, rā, zāy, sīn, shīn' } }
        ]
    },
    // ── Unit 3: Letters Group 3 ──
    {
        id: 3, title: 'الحروف ٣ — Letters: ص ض ط ظ ع غ', desc: 'The "deep" Arabic sounds — emphatic and pharyngeal letters.',
        unitType: 'grammar', grammar: ['emphatic consonants', 'pharyngeal sounds', 'ع and غ'],
        vocab: ['ص', 'ض', 'ط', 'ظ', 'ع', 'غ'],
        teachSlides: [
            { type: 'explain', mascotText: "These 6 letters are uniquely Arabic — sounds that don't exist in English! ص ض ط ظ are 'emphatic' (heavier, deeper). ع غ come from the throat.", mascotEmotion: 'happy' },
            { type: 'compare', mascotText: "Emphatic pairs — same shape, dot makes the difference:", mascotEmotion: 'thinking',
              left: { label: 'No dot', items: ['ص = ṣād (emphatic s)', 'ط = ṭā (emphatic t)'] },
              right: { label: 'With dot', items: ['ض = ḍād (emphatic d)', 'ظ = ẓā (emphatic z)'] }
            },
            { type: 'tip', mascotText: "ع (ʿayn) is the most iconic Arabic sound — a deep throat squeeze. غ (ghayn) is like gargling. These take practice, but you'll get them!", mascotEmotion: 'happy', tipText: "ع = deep throat · غ = gargling · Don't rush — listen and repeat" }
        ],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match letter to sound', pairs: [{ left: 'ص', right: 'ṣād' }, { left: 'ض', right: 'ḍād' }, { left: 'ط', right: 'ṭā' }, { left: 'ع', right: 'ʿayn' }] } },
            { type: 'fill-bubble', data: { instruction: 'Which letter sounds like a deep "s"?', sentence: 'Emphatic s = ___', options: ['س', 'ص', 'ش'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'ع is produced from the:', sentence: 'ع comes from the ___', options: ['lips', 'throat', 'nose'], correct: 1 } },
            { type: 'match-pairs', data: { instruction: 'Emphatic pairs', pairs: [{ left: 'ص (no dot)', right: 'ض (dot)' }, { left: 'ط (no dot)', right: 'ظ (dot)' }, { left: 'ع (no dot)', right: 'غ (dot)' }] } },
            { type: 'fill-bubble', data: { instruction: 'Letters learned: Groups 1+2+3 =', sentence: 'Total letters so far: ___', options: ['16', '19', '21'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Try these sounds:', phrase: 'Ṣād, ḍād, ṭā, ẓā, ʿayn, ghayn' } }
        ]
    },
    // ── Unit 4: Letters Group 4 ──
    {
        id: 4, title: 'الحروف ٤ — Letters: ف ق ك ل م ن ه و ي', desc: 'Complete the alphabet! The final 9 letters and how letters connect.',
        unitType: 'grammar', grammar: ['remaining letters', 'letter connection basics', 'full alphabet'],
        vocab: ['ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
        teachSlides: [
            { type: 'explain', mascotText: "You're almost there! These last 9 letters complete the Arabic alphabet — 28 letters total! After this, you'll know every letter.", mascotEmotion: 'happy' },
            { type: 'compare', mascotText: "Key letters in this group:", mascotEmotion: 'thinking',
              left: { label: 'Familiar sounds', items: ['ف = fā (f)', 'ك = kāf (k)', 'ل = lām (l)', 'م = mīm (m)', 'ن = nūn (n)'] },
              right: { label: 'New shapes', items: ['ق = qāf (q — deep k)', 'ه = hā (h)', 'و = wāw (w/ū)', 'ي = yā (y/ī)'] }
            },
            { type: 'tip', mascotText: "و (wāw) and ي (yā) are special — they can be consonants (w, y) OR long vowels (ū, ī). You'll learn more about this in the vowels unit!", mascotEmotion: 'happy', tipText: "و = w or ū · ي = y or ī · Double duty!" }
        ],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match letter to sound', pairs: [{ left: 'ف', right: 'fā' }, { left: 'ق', right: 'qāf' }, { left: 'ل', right: 'lām' }, { left: 'ن', right: 'nūn' }] } },
            { type: 'fill-bubble', data: { instruction: 'How many letters in Arabic?', sentence: 'Arabic has ___ letters.', options: ['26', '28', '30'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'Which letter makes a deep "k" sound?', sentence: 'Deep k = ___', options: ['ك', 'ق', 'غ'], correct: 1 } },
            { type: 'match-pairs', data: { instruction: 'Match the remaining letters', pairs: [{ left: 'ك', right: 'kāf' }, { left: 'م', right: 'mīm' }, { left: 'ه', right: 'hā' }, { left: 'ي', right: 'yā' }] } },
            { type: 'fill-bubble', data: { instruction: 'و and ي can also be:', sentence: 'و and ي can be consonants or ___', options: ['emphatic sounds', 'long vowels', 'dots'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Complete the alphabet:', phrase: 'Fā, qāf, kāf, lām, mīm, nūn, hā, wāw, yā' } }
        ]
    },
    // ── Unit 5: Vowels & First Reading ──
    {
        id: 5, title: 'الحركات — Vowels & Reading', desc: 'Short vowels, sukūn, shadda — and reading your first Arabic words!',
        unitType: 'grammar', grammar: ['short vowels (fatḥa, ḍamma, kasra)', 'sukūn', 'shadda', 'first word reading'],
        vocab: ['فَتحة', 'ضَمّة', 'كَسرة', 'سُكون', 'شَدّة', 'كَتَبَ', 'بَيت', 'بِنت'],
        teachSlides: [
            { type: 'explain', mascotText: "Now you know the letters — let's add vowels! Arabic vowels are marks above or below letters. They tell you how to pronounce each letter.", mascotEmotion: 'happy' },
            { type: 'compare', mascotText: "The 3 short vowels:", mascotEmotion: 'thinking',
              left: { label: 'Vowel marks', items: ['فَ = fa (fatḥa: line above)', 'فُ = fu (ḍamma: curl above)', 'فِ = fi (kasra: line below)'] },
              right: { label: 'Special marks', items: ['فْ = f— (sukūn: no vowel)', 'فّ = ff (shadda: doubled)'] }
            },
            { type: 'tip', mascotText: "Let's read your first word! كَتَبَ = ka-ta-ba (he wrote). Break it down: كَ=ka + تَ=ta + بَ=ba. You just read Arabic!", mascotEmotion: 'happy', tipText: "كَتَبَ = ka·ta·ba = he wrote 🎉" }
        ],
        exercises: [
            { type: 'fill-bubble', data: { instruction: 'What does fatḥa sound like?', sentence: 'بَ = ___', options: ['ba', 'bu', 'bi'], correct: 0 } },
            { type: 'fill-bubble', data: { instruction: 'What does ḍamma sound like?', sentence: 'بُ = ___', options: ['ba', 'bu', 'bi'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'What does kasra sound like?', sentence: 'بِ = ___', options: ['ba', 'bu', 'bi'], correct: 2 } },
            { type: 'match-pairs', data: { instruction: 'Match vowel to name', pairs: [{ left: 'َ  (line above)', right: 'fatḥa' }, { left: 'ُ  (curl above)', right: 'ḍamma' }, { left: 'ِ  (line below)', right: 'kasra' }, { left: 'ْ  (circle above)', right: 'sukūn' }] } },
            { type: 'fill-bubble', data: { instruction: 'Read this word: كَتَبَ', sentence: 'كَتَبَ = ___', options: ['kataba', 'kutiba', 'kitāb'], correct: 0 } },
            { type: 'fill-bubble', data: { instruction: 'Shadda means the letter is:', sentence: 'شَدّة means ___', options: ['silent', 'doubled', 'long'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Read these words aloud:', phrase: 'Ka-ta-ba. Bay-t. Bin-t.' } }
        ]
    },
    // ── Unit 6: Script Checkpoint ──
    {
        id: 6, title: '🔄 Script Checkpoint', desc: 'Review all 28 letters, vowels, and read simple words.',
        unitType: 'review', grammar: ['full alphabet review', 'vowel marks', 'basic reading'],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match Group 1 letters', pairs: [{ left: 'ا', right: 'alif' }, { left: 'ب', right: 'bā' }, { left: 'ج', right: 'jīm' }, { left: 'ح', right: 'ḥā' }] } },
            { type: 'match-pairs', data: { instruction: 'Match Group 2 letters', pairs: [{ left: 'خ', right: 'khā' }, { left: 'د', right: 'dāl' }, { left: 'س', right: 'sīn' }, { left: 'ش', right: 'shīn' }] } },
            { type: 'fill-bubble', data: { instruction: 'Emphatic s:', sentence: 'Emphatic s = ___', options: ['س', 'ص', 'ش'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'Throat sound:', sentence: 'ع is from the ___', options: ['lips', 'throat', 'teeth'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'How many Arabic letters?', sentence: 'Arabic has ___ letters.', options: ['26', '28', '30'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: 'Vowel mark below:', sentence: 'بِ uses ___', options: ['fatḥa', 'ḍamma', 'kasra'], correct: 2 } },
            { type: 'match-pairs', data: { instruction: 'Match vowels', pairs: [{ left: 'َ  above', right: 'fatḥa (a)' }, { left: 'ُ  above', right: 'ḍamma (u)' }, { left: 'ِ  below', right: 'kasra (i)' }, { left: 'ْ  above', right: 'sukūn (—)' }] } },
            { type: 'fill-bubble', data: { instruction: 'Read: كَتَبَ', sentence: 'كَتَبَ = ___', options: ['kataba', 'kabata', 'takaba'], correct: 0 } },
            { type: 'fill-bubble', data: { instruction: 'Dot twins: ر +dot =', sentence: 'ر + dot = ___', options: ['ذ', 'ز', 'د'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Full alphabet groups:', phrase: 'Alif bā tā thā jīm ḥā — khā dāl dhāl rā zāy sīn shīn — ṣād ḍād ṭā ẓā ʿayn ghayn — fā qāf kāf lām mīm nūn hā wāw yā' } }
        ]
    },
    // ── Unit 7: First Words & Greetings ──
    {
        id: 7, title: 'الكلمات الأولى — First Words & Greetings', desc: 'Read and use essential Arabic greetings and phrases.',
        unitType: 'situational', grammar: ['reading real words', 'greeting patterns'],
        vocab: ['مرحبا', 'السلام عليكم', 'شكراً', 'من فضلك', 'نعم', 'لا', 'مع السلامة'],
        teachSlides: [
            { type: 'explain', mascotText: "Now you can read letters and vowels — let's read real words! The most important Arabic greeting: السلام عليكم (as-salāmu ʿalaykum) — 'Peace be upon you'. Reply: وعليكم السلام.", mascotEmotion: 'happy' },
            { type: 'vocab-intro', mascotText: "Essential Arabic greetings:", mascotEmotion: 'happy',
              words: [{ en: 'مرحبا (marḥaba)', ru: 'Привет' }, { en: 'السلام عليكم', ru: 'Мир вам' }, { en: 'شكراً (shukran)', ru: 'Спасибо' }, { en: 'من فضلك (min faḍlak)', ru: 'Пожалуйста' }, { en: 'نعم (naʿam)', ru: 'Да' }, { en: 'لا (lā)', ru: 'Нет' }, { en: 'مع السلامة (maʿ as-salāma)', ru: 'До свидания' }] },
            { type: 'tip', mascotText: "شكراً (shukran) means 'thank you' — works everywhere in the Arab world. Try to spot the letters you learned: ش + ك + ر + ا + ً", mascotEmotion: 'happy', tipText: "شكراً = shukran = Thank you · عفواً = You're welcome" }
        ],
        exercises: [
            { type: 'match-pairs', data: { instruction: 'Match Arabic to meaning', pairs: [{ left: 'مرحبا', right: 'Hello' }, { left: 'شكراً', right: 'Thank you' }, { left: 'نعم', right: 'Yes' }, { left: 'لا', right: 'No' }] } },
            { type: 'fill-bubble', data: { instruction: 'Reply to السلام عليكم:', sentence: 'The reply is:', options: ['شكراً', 'وعليكم السلام', 'مرحبا'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: '"Thank you" in Arabic:', sentence: 'Thank you = ___', options: ['مرحبا', 'شكراً', 'من فضلك'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: '"Goodbye" in Arabic:', sentence: 'Goodbye = ___', options: ['مع السلامة', 'السلام عليكم', 'نعم'], correct: 0 } },
            { type: 'speak-aloud', data: { instruction: 'Say these greetings:', phrase: 'As-salāmu ʿalaykum. Marḥaba. Shukran. Maʿ as-salāma.' } },
            { type: 'listen-type', data: { instruction: 'Listen and type in transliteration', text: 'shukran', hint: 'Thank you' } }
        ]
    },
    // ── Unit 8: Self-Introduction & Numbers ──
    {
        id: 8, title: 'أنا... — Self-Introduction & Numbers', desc: 'Introduce yourself and count 1–10 in Arabic.',
        unitType: 'situational', grammar: ['أنا (anā) = I', 'اسمي (ismī) = my name', 'Arabic numerals 1-10'],
        vocab: ['أنا', 'اسمي', 'أنتَ', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'],
        teachSlides: [
            { type: 'explain', mascotText: "Let's put your reading skills to use! أنا (anā) = I. اسمي (ismī) = my name. You can now introduce yourself: أنا [name]. اسمي [name].", mascotEmotion: 'happy' },
            { type: 'vocab-intro', mascotText: "Numbers 1-10:", mascotEmotion: 'happy',
              words: [{ en: '١ واحد (wāḥid)', ru: 'один' }, { en: '٢ اثنان (ithnān)', ru: 'два' }, { en: '٣ ثلاثة (thalātha)', ru: 'три' }, { en: '٤ أربعة (arbaʿa)', ru: 'четыре' }, { en: '٥ خمسة (khamsa)', ru: 'пять' }, { en: '٦ ستة (sitta)', ru: 'шесть' }, { en: '٧ سبعة (sabʿa)', ru: 'семь' }, { en: '٨ ثمانية (thamāniya)', ru: 'восемь' }, { en: '٩ تسعة (tisʿa)', ru: 'девять' }, { en: '١٠ عشرة (ʿashara)', ru: 'десять' }] },
            { type: 'tip', mascotText: "Arabic numbers in text go left-to-right (١٢٣), even though Arabic text goes right-to-left! Also: Eastern Arabic digits (١٢٣) are used alongside Western digits (123).", mascotEmotion: 'happy', tipText: "Text: right→left · Numbers: left→right" }
        ],
        exercises: [
            { type: 'fill-bubble', data: { instruction: '"I" in Arabic:', sentence: '"I" = ___', options: ['هو', 'أنا', 'أنتَ'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: '"My name" in Arabic:', sentence: '"My name" = ___', options: ['أنا', 'اسمي', 'هو'], correct: 1 } },
            { type: 'match-pairs', data: { instruction: 'Match number to Arabic', pairs: [{ left: '1', right: 'واحد' }, { left: '3', right: 'ثلاثة' }, { left: '5', right: 'خمسة' }, { left: '7', right: 'سبعة' }] } },
            { type: 'fill-bubble', data: { instruction: 'What comes after ٤?', sentence: '٤, ___', options: ['ثلاثة', 'خمسة', 'ستة'], correct: 1 } },
            { type: 'fill-bubble', data: { instruction: '٢ + ٣ = ?', sentence: 'اثنان + ثلاثة = ___', options: ['أربعة', 'خمسة', 'ستة'], correct: 1 } },
            { type: 'speak-aloud', data: { instruction: 'Introduce yourself and count:', phrase: 'Anā [your name]. Wāḥid, ithnān, thalātha, arbaʿa, khamsa, sitta, sabʿa, thamāniya, tisʿa, ʿashara!' } }
        ]
    }

        ]
    }

    ],

    // ─── HELPER METHODS ───
    getActive() {
        const tb = this.textbooks.find(tb => tb.id === this.activeTextbookId);
        if (tb) return tb;
        // Fallback: first textbook for current target language
        const lang = this.targetLanguage || 'en';
        return this.textbooks.find(tb => (tb.language || 'en') === lang) || this.textbooks[0];
    },

    getByLevel(cefrLevel) {
        const lang = this.targetLanguage || 'en';
        // First try to find a textbook for the current target language at this level
        const langMatch = this.textbooks.find(tb => (tb.language || 'en') === lang && tb.cefr === cefrLevel);
        if (langMatch) return langMatch;
        // Fallback: first textbook for this language (any level)
        const anyLang = this.textbooks.find(tb => (tb.language || 'en') === lang);
        if (anyLang) return anyLang;
        // Last resort: any textbook at this level
        return this.textbooks.find(tb => tb.cefr === cefrLevel);
    },

    selectTextbookByLevel(cefrLevel) {
        const tb = this.getByLevel(cefrLevel);
        if (tb) {
            this.activeTextbookId = tb.id;
            if (typeof LangyState !== 'undefined') {
                LangyState.progress.currentUnitId = 1;
                LangyState.aiMemory.currentTextbookId = tb.id;
                // Fix: set correct currentUnit name from actual textbook
                const firstUnit = tb.units[0];
                if (firstUnit) {
                    LangyState.progress.currentUnit = 'Unit ' + firstUnit.id + ': ' + firstUnit.title;
                }
            }
            return tb;
        }
        this.activeTextbookId = this.textbooks[0].id;
        if (typeof LangyState !== 'undefined') {
            LangyState.progress.currentUnitId = 1;
            LangyState.aiMemory.currentTextbookId = this.textbooks[0].id;
            const firstUnit = this.textbooks[0].units[0];
            if (firstUnit) {
                LangyState.progress.currentUnit = 'Unit ' + firstUnit.id + ': ' + firstUnit.title;
            }
        }
        return this.textbooks[0];
    },

    restoreFromState() {
        if (typeof LangyState !== 'undefined' && LangyState.aiMemory.currentTextbookId) {
            this.activeTextbookId = LangyState.aiMemory.currentTextbookId;
        }
    },

    getLevelList() {
        return this.textbooks.map(tb => ({
            id: tb.id,
            level: tb.cefr,
            title: tb.title,
            unitCount: tb.units.length
        }));
    },

    getTotalUnits() {
        return this.textbooks.reduce((sum, tb) => sum + tb.units.length, 0);
    },

    // Returns the units that a checkpoint covers (between previous checkpoint and this one)
    getCheckpointCoverage(checkpointUnitId) {
        const tb = this.getActive();
        if (!tb) return [];

        const checkpointIdx = tb.units.findIndex(u => u.id === checkpointUnitId);
        if (checkpointIdx < 0) return [];

        // Find previous checkpoint or start of level
        let startIdx = 0;
        for (let i = checkpointIdx - 1; i >= 0; i--) {
            if (tb.units[i].unitType === 'review') {
                startIdx = i + 1;
                break;
            }
        }

        // Return units between previous checkpoint and current (non-review only)
        return tb.units.slice(startIdx, checkpointIdx).filter(u => u.unitType !== 'review');
    },

    // Check if all units in a textbook are mastered (for CEFR badge)
    isLevelComplete(textbookId) {
        if (typeof LangyState === 'undefined') return false;
        const tb = this.textbooks.find(t => t.id === textbookId);
        if (!tb) return false;

        const mastery = LangyState.progress.mastery;
        return tb.units.every(u => {
            const key = textbookId + ':' + u.id;
            return mastery[key] && mastery[key].passed;
        });
    },

    // CEFR order for comparisons
    _cefrOrder: ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'],

    // Get status for each CEFR level relative to the user's placement level
    getLevelStatus(userCefrLevel) {
        const order = this._cefrOrder;
        const userIdx = order.indexOf(userCefrLevel);
        if (userIdx < 0) return [];

        return this.textbooks.map(tb => {
            const tbIdx = order.indexOf(tb.cefr);
            const mastery = typeof LangyState !== 'undefined' ? LangyState.progress.mastery : {};
            const currentTbId = typeof LangyState !== 'undefined' ? (LangyState.aiMemory?.currentTextbookId ?? null) : null;
            const currentUnitId = typeof LangyState !== 'undefined' ? LangyState.progress.currentUnitId : 1;

            // Count completed units
            let completedUnits = 0;
            tb.units.forEach(u => {
                const key = tb.id + ':' + u.id;
                if (mastery[key] && mastery[key].passed) completedUnits++;
            });

            let status = 'locked';
            if (tb.id === currentTbId) {
                status = completedUnits === tb.units.length ? 'completed' : 'active';
            } else if (tbIdx < userIdx) {
                status = completedUnits > 0 && completedUnits === tb.units.length ? 'completed' : 'mastered';
            } else if (tbIdx === userIdx) {
                status = completedUnits === tb.units.length ? 'completed' : 'active';
            } else {
                status = 'locked';
            }

            return {
                id: tb.id,
                cefr: tb.cefr,
                title: tb.title,
                status: status,
                unitCount: tb.units.length,
                completedUnits: completedUnits,
                progress: tb.units.length > 0 ? Math.round((completedUnits / tb.units.length) * 100) : 0
            };
        });
    },

    // Get per-unit status map for a specific textbook
    getUnitStatusMap(textbookId) {
        const tb = this.textbooks.find(t => t.id === textbookId);
        if (!tb) return [];

        const mastery = typeof LangyState !== 'undefined' ? LangyState.progress.mastery : {};
        const currentTbId = typeof LangyState !== 'undefined' ? (LangyState.aiMemory?.currentTextbookId ?? null) : null;
        const currentUnitId = typeof LangyState !== 'undefined' ? LangyState.progress.currentUnitId : 1;
        const isActiveTb = tb.id === currentTbId;
        const userCefr = typeof LangyState !== 'undefined' ? (LangyState.user.level || '').substring(0, 2) : '';
        const order = this._cefrOrder;
        const tbIdx = order.indexOf(tb.cefr);
        const userIdx = order.indexOf(userCefr);
        const isBelowUser = tbIdx < userIdx;

        return tb.units.map(u => {
            const key = textbookId + ':' + u.id;
            const m = mastery[key];

            let status = 'locked';
            if (m && m.passed) {
                status = 'completed';
            } else if (isActiveTb && u.id === currentUnitId) {
                status = 'current';
            } else if (isActiveTb && u.id < currentUnitId) {
                status = 'completed';
            } else if (isBelowUser) {
                status = 'mastered'; // below placement level — auto mastered
            } else {
                status = 'locked';
            }

            return {
                id: u.id,
                title: u.title,
                unitType: u.unitType,
                status: status,
                score: m ? m.score : null,
                desc: u.desc
            };
        });
    },

    // ─── MULTI-LANGUAGE METHODS ───

    /** Get all textbooks for a specific language */
    getTextbooksForLanguage(langCode) {
        const code = langCode || this.targetLanguage || 'en';
        return this.textbooks.filter(tb => (tb.language || 'en') === code);
    },

    /** Get textbook by CEFR level for the current or specified language */
    getByLevelForLanguage(cefrLevel, langCode) {
        const code = langCode || this.targetLanguage || 'en';
        return this.textbooks.find(tb => (tb.language || 'en') === code && tb.cefr === cefrLevel);
    },

    /** Get level list for the current target language */
    getLevelListForLanguage(langCode) {
        const tbs = this.getTextbooksForLanguage(langCode);
        return tbs.map(tb => ({
            id: tb.id,
            level: tb.cefr,
            title: tb.title,
            unitCount: tb.units.length
        }));
    },

    /** Get total units for the current target language */
    getTotalUnitsForLanguage(langCode) {
        return this.getTextbooksForLanguage(langCode).reduce((sum, tb) => sum + tb.units.length, 0);
    },

    /** Summary of curriculum coverage per language (for diagnostics / UI) */
    getLanguageStats() {
        const stats = {};
        const langs = [...new Set(this.textbooks.map(tb => tb.language || 'en'))];
        for (const lang of langs) {
            const tbs = this.getTextbooksForLanguage(lang);
            const levels = tbs.map(tb => tb.cefr);
            const totalUnits = tbs.reduce((s, tb) => s + tb.units.length, 0);
            const totalExercises = tbs.reduce((s, tb) =>
                s + tb.units.reduce((us, u) => us + (u.exercises ? u.exercises.length : 0), 0), 0);
            stats[lang] = { levels, textbookCount: tbs.length, totalUnits, totalExercises };
        }
        return stats;
    },

    /** Build AI-consumable context about the current curriculum position */
    getAIContext() {
        const tb = this.getActive();
        if (!tb) return '';
        const lang = typeof LangyTarget !== 'undefined' ? LangyTarget.current : null;
        const bbStr = lang && lang.academicBackbone
            ? `\nAcademic Framework: ${lang.academicBackbone.framework}\nReference: ${lang.academicBackbone.reference}\nMethodology: ${lang.academicBackbone.methodology}`
            : '';
        const canDoStr = tb.canDo && tb.canDo.length
            ? `\nCEFR Can-Do Statements for this level:\n${tb.canDo.map(s => '- ' + s).join('\n')}`
            : '';
        const objStr = tb.objectives && tb.objectives.length
            ? `\nLearning Objectives for this level:\n${tb.objectives.map(s => '- ' + s).join('\n')}`
            : '';

        // Current unit context — what the student is actually working on right now
        let unitCtx = '';
        const currentUnitId = typeof LangyState !== 'undefined' ? LangyState.progress?.currentUnitId : null;
        if (currentUnitId && tb.units) {
            const unit = tb.units.find(u => u.id === currentUnitId);
            if (unit) {
                unitCtx += `\nCURRENT UNIT: Unit ${unit.id} — "${unit.title}"`;
                unitCtx += `\nUnit Description: ${unit.desc || ''}`;
                unitCtx += `\nUnit Type: ${unit.unitType || 'grammar'}`;
                if (unit.grammar && unit.grammar.length) {
                    unitCtx += `\nGrammar Focus: ${unit.grammar.join(', ')}`;
                }
                if (unit.vocab && unit.vocab.length) {
                    unitCtx += `\nTarget Vocabulary: ${unit.vocab.join(', ')}`;
                }
                // Progression context
                const unitIdx = tb.units.findIndex(u => u.id === currentUnitId);
                if (unitIdx > 0) {
                    const prev = tb.units[unitIdx - 1];
                    unitCtx += `\nPrevious Unit: "${prev.title}" (${prev.grammar?.join(', ') || 'general'})`;
                }
                if (unitIdx < tb.units.length - 1) {
                    const next = tb.units[unitIdx + 1];
                    unitCtx += `\nNext Unit: "${next.title}" — student is progressing toward this`;
                }
                // Exercise progress within unit
                const lessonIdx = typeof LangyState !== 'undefined' ? LangyState.progress?.currentLessonIdx : 0;
                const totalEx = unit.exercises ? unit.exercises.length : 0;
                if (totalEx > 0) {
                    unitCtx += `\nExercise Progress: ${lessonIdx || 0}/${totalEx} completed in this unit`;
                }
            }
        }

        // Methodology note per language
        let methodNote = '';
        if ((tb.language || 'en') === 'en') {
            methodNote = `\nENGLISH TUTORING DIRECTIVES:
- Align all explanations and corrections with CEFR ${tb.cefr} expectations
- Reference the can-do outcomes above when framing what the student should achieve
- Ensure grammar explanations match the current unit focus, not arbitrary topics
- When correcting, relate errors back to the learning objectives for this level
- Progressively scaffold: build on what was covered in previous units`;
        } else if ((tb.language) === 'ar') {
            methodNote = `\nARABIC TUTORING DIRECTIVES:
- This is a script-first track: prioritise letter recognition, reading readiness, and phonetic accuracy before grammar
- In early units (1-6), focus on the Arabic script: letter shapes, dot patterns, emphatic vs non-emphatic, vowel marks
- Always provide transliteration alongside Arabic script for beginner learners
- When correcting, reference the specific letter group or vowel mark being practiced
- Distinguish between MSA (Modern Standard Arabic) and dialect when relevant, but teach MSA first
- Encourage right-to-left reading practice and letter-connection awareness
- After the Script Checkpoint (Unit 6), shift focus toward communication: greetings, self-introduction, numbers
- Celebrate script milestones — reading the first word is a major achievement for Arabic learners
- Reference the can-do outcomes and learning objectives when framing progress`;
        }

        return `Current textbook: ${tb.title} (${tb.cefr})
Language: ${tb.language || 'en'}
Methodology: ${tb.methodology || ''}${bbStr}${canDoStr}${objStr}${unitCtx}${methodNote}`;
    },

    /** Get can-do statements for a specific textbook */
    getCanDoStatements(textbookId) {
        const tb = textbookId
            ? this.textbooks.find(t => t.id === textbookId)
            : this.getActive();
        return tb && tb.canDo ? tb.canDo : [];
    },

    /** Get learning objectives for a specific textbook */
    getLearningObjectives(textbookId) {
        const tb = textbookId
            ? this.textbooks.find(t => t.id === textbookId)
            : this.getActive();
        return tb && tb.objectives ? tb.objectives : [];
    }
};

if (typeof module !== 'undefined') module.exports = { LangyCurriculum };
