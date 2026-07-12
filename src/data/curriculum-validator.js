/* ============================================
   LANGY - CURRICULUM VALIDATOR
   Validates textbook/unit/exercise data before lessons render.
   ============================================ */

const LangyCurriculumValidator = {
    allowedTypes: [
        'fill-bubble',
        'match-pairs',
        'speak-aloud',
        'listen-type',
        'word-shuffle',
        'type-translation',
        'read-answer',
        'image-choice',
    ],

    validate(curriculum = typeof LangyCurriculum !== 'undefined' ? LangyCurriculum : null) {
        const errors = [];
        const warnings = [];
        const stats = {
            textbooks: 0,
            units: 0,
            exercises: 0,
            byType: {},
        };

        const addError = (path, message) => errors.push({ path, message });
        const addWarning = (path, message) => warnings.push({ path, message });

        if (!curriculum || !Array.isArray(curriculum.textbooks)) {
            addError('LangyCurriculum.textbooks', 'Expected an array of textbooks.');
            return { valid: false, errors, warnings, stats };
        }

        const textbookIds = new Set();
        stats.textbooks = curriculum.textbooks.length;

        curriculum.textbooks.forEach((textbook, textbookIndex) => {
            const textbookPath = `textbooks[${textbookIndex}]${textbook?.id ? `(${textbook.id})` : ''}`;
            if (!this._isNonEmptyString(textbook?.id)) addError(`${textbookPath}.id`, 'Textbook id is required.');
            if (textbook?.id && textbookIds.has(textbook.id)) addError(`${textbookPath}.id`, `Duplicate textbook id "${textbook.id}".`);
            if (textbook?.id) textbookIds.add(textbook.id);
            if (!this._isNonEmptyString(textbook?.title)) addError(`${textbookPath}.title`, 'Textbook title is required.');
            if (!Array.isArray(textbook?.units) || textbook.units.length === 0) {
                addError(`${textbookPath}.units`, 'Textbook must contain at least one unit.');
                return;
            }

            const unitIds = new Set();
            stats.units += textbook.units.length;

            textbook.units.forEach((unit, unitIndex) => {
                const unitPath = `${textbookPath}.units[${unitIndex}]${unit?.id ? `(unit:${unit.id})` : ''}`;
                if (!Number.isInteger(unit?.id)) addError(`${unitPath}.id`, 'Unit id must be an integer.');
                if (Number.isInteger(unit?.id) && unitIds.has(unit.id)) addError(`${unitPath}.id`, `Duplicate unit id "${unit.id}" in textbook.`);
                if (Number.isInteger(unit?.id)) unitIds.add(unit.id);
                if (!this._isNonEmptyString(unit?.title)) addError(`${unitPath}.title`, 'Unit title is required.');
                if (!Array.isArray(unit?.exercises) || unit.exercises.length === 0) {
                    addWarning(`${unitPath}.exercises`, 'Unit has no exercises.');
                    return;
                }

                stats.exercises += unit.exercises.length;
                unit.exercises.forEach((exercise, exerciseIndex) => {
                    const exercisePath = `${unitPath}.exercises[${exerciseIndex}]`;
                    const result = this.validateExercise(exercise, exercisePath);
                    result.errors.forEach(e => addError(e.path, e.message));
                    result.warnings.forEach(w => addWarning(w.path, w.message));
                    const type = exercise?.type || 'missing';
                    stats.byType[type] = (stats.byType[type] || 0) + 1;
                });
            });
        });

        return { valid: errors.length === 0, errors, warnings, stats };
    },

    validateExercise(exercise, path = 'exercise') {
        const errors = [];
        const warnings = [];
        const addError = (suffix, message) => errors.push({ path: suffix ? `${path}.${suffix}` : path, message });
        const addWarning = (suffix, message) => warnings.push({ path: suffix ? `${path}.${suffix}` : path, message });

        if (!exercise || typeof exercise !== 'object') {
            addError('', 'Exercise must be an object.');
            return { valid: false, errors, warnings };
        }

        if (!this.allowedTypes.includes(exercise.type)) {
            addError('type', `Unsupported exercise type "${exercise.type}".`);
            return { valid: false, errors, warnings };
        }

        if (!exercise.data || typeof exercise.data !== 'object' || Array.isArray(exercise.data)) {
            addError('data', 'Exercise data object is required.');
            return { valid: false, errors, warnings };
        }

        const data = exercise.data;
        switch (exercise.type) {
            case 'fill-bubble':
                this._validateFillBubble(data, addError, addWarning);
                break;
            case 'match-pairs':
                this._validateMatchPairs(data, addError);
                break;
            case 'speak-aloud':
                this._requireString(data, 'phrase', addError);
                break;
            case 'listen-type':
                this._requireString(data, 'text', addError);
                if (data.hint !== undefined && typeof data.hint !== 'string') addError('data.hint', 'Hint must be a string when provided.');
                break;
            case 'word-shuffle':
                this._validateWordShuffle(data, addError);
                break;
            case 'type-translation':
                this._validateTypeTranslation(data, addError);
                break;
            case 'read-answer':
                this._validateReadAnswer(data, addError);
                break;
            case 'image-choice':
                this._validateImageChoice(data, addError);
                break;
        }

        return { valid: errors.length === 0, errors, warnings };
    },

    _validateFillBubble(data, addError, _addWarning) {
        const prompt = data.sentence ?? data.prompt ?? data.question;
        if (!this._isNonEmptyString(prompt)) addError('data.sentence', 'Fill-bubble requires a non-empty sentence, prompt, or question.');
        this._validateOptionsAndCorrect(data, addError, 'data');
    },

    _validateMatchPairs(data, addError) {
        if (!Array.isArray(data.pairs) || data.pairs.length < 2) {
            addError('data.pairs', 'Match-pairs requires at least two pairs.');
            return;
        }

        const left = new Set();
        const right = new Set();
        data.pairs.forEach((pair, index) => {
            if (!this._isNonEmptyString(pair?.left)) addError(`data.pairs[${index}].left`, 'Pair left value is required.');
            if (!this._isNonEmptyString(pair?.right)) addError(`data.pairs[${index}].right`, 'Pair right value is required.');
            if (pair?.left && left.has(pair.left)) addError(`data.pairs[${index}].left`, `Duplicate left value "${pair.left}".`);
            if (pair?.right && right.has(pair.right)) addError(`data.pairs[${index}].right`, `Duplicate right value "${pair.right}".`);
            if (pair?.left) left.add(pair.left);
            if (pair?.right) right.add(pair.right);
        });
    },

    _validateWordShuffle(data, addError) {
        if (!Array.isArray(data.words) || data.words.length === 0) addError('data.words', 'Words must be a non-empty array.');
        if (!Array.isArray(data.correct) || data.correct.length === 0) addError('data.correct', 'Correct answer must be a non-empty word array.');
        if (!Array.isArray(data.words) || !Array.isArray(data.correct)) return;
        data.words.forEach((word, index) => {
            if (!this._isNonEmptyString(word)) addError(`data.words[${index}]`, 'Word must be a non-empty string.');
        });
        data.correct.forEach((word, index) => {
            if (!this._isNonEmptyString(word)) addError(`data.correct[${index}]`, 'Correct word must be a non-empty string.');
        });
        if (data.words.length !== data.correct.length) {
            addError('data.words', `Words length (${data.words.length}) must match correct length (${data.correct.length}).`);
            return;
        }
        if (this._wordSignature(data.words) !== this._wordSignature(data.correct)) {
            addError('data.correct', 'Correct answer must contain the same words, including duplicate counts, as data.words.');
        }
    },

    _validateTypeTranslation(data, addError) {
        this._requireString(data, 'sourceText', addError);
        if (Array.isArray(data.answer)) {
            if (data.answer.length === 0) addError('data.answer', 'Answer array must not be empty.');
            data.answer.forEach((answer, index) => {
                if (!this._isNonEmptyString(answer)) addError(`data.answer[${index}]`, 'Answer must be a non-empty string.');
            });
        } else if (!this._isNonEmptyString(data.answer)) {
            addError('data.answer', 'Answer must be a non-empty string or non-empty string array.');
        }
        ['fromLang', 'toLang'].forEach(key => {
            if (data[key] !== undefined && !this._isNonEmptyString(data[key])) addError(`data.${key}`, `${key} must be a non-empty string when provided.`);
        });
    },

    _validateReadAnswer(data, addError) {
        this._requireString(data, 'passage', addError);
        this._requireString(data, 'question', addError);
        this._validateOptionsAndCorrect(data, addError, 'data');
    },

    _validateImageChoice(data, addError) {
        this._requireString(data, 'word', addError);
        if (!Array.isArray(data.options) || data.options.length < 2) {
            addError('data.options', 'Image-choice requires at least two image options.');
            return;
        }
        data.options.forEach((option, index) => {
            if (!this._isNonEmptyString(option?.emoji)) addError(`data.options[${index}].emoji`, 'Emoji is required.');
            if (!this._isNonEmptyString(option?.label)) addError(`data.options[${index}].label`, 'Label is required.');
        });
        this._validateCorrectIndex(data.correct, data.options.length, addError, 'data.correct');
    },

    _validateOptionsAndCorrect(data, addError, pathPrefix) {
        if (!Array.isArray(data.options) || data.options.length < 2) {
            addError(`${pathPrefix}.options`, 'Options must contain at least two values.');
            return;
        }
        data.options.forEach((option, index) => {
            if (!this._isNonEmptyString(option)) addError(`${pathPrefix}.options[${index}]`, 'Option must be a non-empty string.');
        });
        this._validateCorrectIndex(data.correct, data.options.length, addError, `${pathPrefix}.correct`);
    },

    _validateCorrectIndex(correct, length, addError, path) {
        if (!Number.isInteger(correct)) {
            addError(path, 'Correct answer must be an integer index.');
        } else if (correct < 0 || correct >= length) {
            addError(path, `Correct index ${correct} is outside options range 0-${length - 1}.`);
        }
    },

    _requireString(data, key, addError) {
        if (!this._isNonEmptyString(data[key])) addError(`data.${key}`, `${key} must be a non-empty string.`);
    },

    _isNonEmptyString(value) {
        return typeof value === 'string' && value.trim().length > 0;
    },

    _wordSignature(words) {
        const counts = {};
        words.forEach(word => {
            const key = String(word).trim().toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.keys(counts)
            .sort()
            .map(key => `${key}:${counts[key]}`)
            .join('|');
    },
};

if (typeof module !== 'undefined') module.exports = { LangyCurriculumValidator };
