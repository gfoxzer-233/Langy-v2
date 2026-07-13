import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');

const SOURCE_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.html', '.css', '.md']);
const SCAN_DIRS = ['src', 'styles', 'docs'];
const IGNORED_SCAN_DIRS = new Set(['src/scripts']);
const REPORT_FILES = [
    'LANGY_AUDIT.md',
    'LANGY_PHASE1_REPORT.md',
    'LANGY_PHASE2_REPORT.md',
    'LANGY_PHASE3_REPORT.md',
];

function toPosix(path) {
    return path.split('\\').join('/');
}

function read(relativePath) {
    return readFileSync(resolve(root, relativePath), 'utf8');
}

function runScript(context, relativePath) {
    vm.runInContext(read(relativePath), context, { filename: relativePath });
}

function loadCurriculumAndValidation() {
    const context = {
        console,
        module: { exports: {} },
    };
    vm.createContext(context);

    runScript(context, 'src/data/curriculum.js');
    const curriculum = context.LangyCurriculum || context.module.exports.LangyCurriculum;

    context.module = { exports: {} };
    runScript(context, 'src/data/curriculum-validator.js');
    const validator = context.LangyCurriculumValidator || context.module.exports.LangyCurriculumValidator;
    const validation = validator.validate(curriculum);

    return { curriculum, validation };
}

function countCurriculum(curriculum, validation) {
    const counts = {
        textbooks: 0,
        units: 0,
        exercises: 0,
        languages: {},
        levels: {},
        exerciseTypes: {},
        editorialStatuses: {
            textbooks: {},
            units: {},
        },
        validation: {
            valid: validation.valid,
            errors: validation.errors.length,
            warnings: validation.warnings.length,
            stats: validation.stats,
        },
    };

    const incrementStatus = (bucket, status) => {
        bucket[status] = (bucket[status] || 0) + 1;
    };

    for (const textbook of curriculum?.textbooks || []) {
        counts.textbooks += 1;
        const lang = textbook.language || 'unknown';
        const level = textbook.level || 'unknown';

        counts.languages[lang] ||= { textbooks: 0, units: 0, exercises: 0, levels: {} };
        counts.languages[lang].textbooks += 1;
        counts.languages[lang].levels[level] ||= { textbooks: 0, units: 0, exercises: 0 };
        counts.languages[lang].levels[level].textbooks += 1;

        counts.levels[level] ||= { textbooks: 0, units: 0, exercises: 0, languages: {} };
        counts.levels[level].textbooks += 1;
        counts.levels[level].languages[lang] ||= { textbooks: 0, units: 0, exercises: 0 };
        counts.levels[level].languages[lang].textbooks += 1;

        const textbookStatus = textbook.editorialStatus || 'missing';
        incrementStatus(counts.editorialStatuses.textbooks, textbookStatus);

        for (const unit of textbook.units || []) {
            counts.units += 1;
            incrementStatus(counts.editorialStatuses.units, unit.editorialStatus || 'missing');
            counts.languages[lang].units += 1;
            counts.languages[lang].levels[level].units += 1;
            counts.levels[level].units += 1;
            counts.levels[level].languages[lang].units += 1;

            for (const exercise of unit.exercises || []) {
                counts.exercises += 1;
                counts.languages[lang].exercises += 1;
                counts.languages[lang].levels[level].exercises += 1;
                counts.levels[level].exercises += 1;
                counts.levels[level].languages[lang].exercises += 1;
                const type = exercise.type || 'missing';
                counts.exerciseTypes[type] = (counts.exerciseTypes[type] || 0) + 1;
            }
        }
    }

    return counts;
}

function listFiles(startPath, files = []) {
    if (!existsSync(startPath)) return files;
    const entries = readdirSync(startPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(startPath, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', '.git', 'dist', 'venv'].includes(entry.name)) continue;
            if (IGNORED_SCAN_DIRS.has(toPosix(relative(root, fullPath)))) continue;
            listFiles(fullPath, files);
            continue;
        }
        if (!SOURCE_EXTENSIONS.has(extname(entry.name))) continue;
        files.push(fullPath);
    }
    return files;
}

function repoFiles() {
    const files = [];
    for (const dir of SCAN_DIRS) listFiles(resolve(root, dir), files);
    for (const file of ['index.html', 'package.json']) {
        const fullPath = resolve(root, file);
        if (existsSync(fullPath)) files.push(fullPath);
    }
    return files;
}

function lineFor(content, index) {
    return content.slice(0, index).split(/\r?\n/).length;
}

function parseAttrs(source) {
    const attrs = {};
    const attrRegex = /([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let match;
    while ((match = attrRegex.exec(source))) {
        attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? true;
    }
    return attrs;
}

function compactText(value) {
    return String(value || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\$\{[^}]+\}/g, '${...}')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasIdClickBinding(fileContent, id, attrs = {}) {
    const safeId = escapeRegExp(id);
    const direct = new RegExp(
        `(getElementById\\(\\s*['"]${safeId}['"]\\s*\\)|querySelector\\(\\s*['"]#${safeId}['"]\\s*\\)|#${safeId}['"]\\))[^\\n;]{0,220}(onclick|addEventListener\\(\\s*['"]click)`,
        's'
    );
    const assigned = new RegExp(
        `(onclick|addEventListener\\(\\s*['"]click)[\\s\\S]{0,260}(getElementById\\(\\s*['"]${safeId}['"]\\s*\\)|querySelector\\(\\s*['"]#${safeId}['"]\\s*\\))`,
        's'
    );
    if (direct.test(fileContent) || assigned.test(fileContent)) return true;

    if (attrs.type === 'submit' && /addEventListener\(\s*['"]submit['"]/.test(fileContent)) return true;

    const routeMapBinding = new RegExp(`['"]${safeId}['"]\\s*:`).test(fileContent)
        && /Object\.entries\([^)]+\)[\s\S]{0,900}addEventListener\(\s*['"]click['"]/.test(fileContent);
    if (routeMapBinding) return true;

    const querySelector = `(getElementById\\(\\s*['"]${safeId}['"]\\s*\\)|querySelector\\(\\s*['"]#${safeId}['"]\\s*\\))`;
    const variableRegex = new RegExp(`(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*[^;\\n]*${querySelector}`, 'g');
    let match;
    while ((match = variableRegex.exec(fileContent))) {
        const variableName = escapeRegExp(match[1]);
        const variableClick = new RegExp(
            `\\b${variableName}\\b\\s*(?:\\?\\.|\\.)\\s*(?:onclick\\s*=|addEventListener\\(\\s*['"]click['"])`,
            's'
        );
        if (variableClick.test(fileContent)) return true;
    }

    return false;
}

function hasClassClickBinding(fileContent, className) {
    const safeClass = escapeRegExp(className);
    const selector = new RegExp(
        `(querySelectorAll?\\(\\s*['"][^'"]*\\.${safeClass}[^'"]*['"]\\s*\\)|\\.closest\\(\\s*['"]\\.${safeClass}['"]\\s*\\))[\\s\\S]{0,500}(onclick|addEventListener\\(\\s*['"]click)`,
        's'
    );
    return selector.test(fileContent);
}

function scanButtons(files) {
    const buttons = [];
    const idBindingCandidates = [];
    const noStableActionCandidates = [];
    const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;

    for (const fullPath of files) {
        const content = readFileSync(fullPath, 'utf8');
        const rel = toPosix(relative(root, fullPath));
        let match;

        while ((match = buttonRegex.exec(content))) {
            const attrs = parseAttrs(match[1]);
            const classList = String(attrs.class || '')
                .split(/\s+/)
                .filter(Boolean)
                .filter(className => !className.includes('${'));
            const id = typeof attrs.id === 'string' && !attrs.id.includes('${') ? attrs.id : null;
            const hasInlineHandler = typeof attrs.onclick === 'string';
            const hasDataRoute = Boolean(attrs['data-route']);
            const hasDisabled = Object.prototype.hasOwnProperty.call(attrs, 'disabled');
            const classHandled = classList.some(className => hasClassClickBinding(content, className));
            const idHandled = id ? hasIdClickBinding(content, id, attrs) : false;
            const handled = hasInlineHandler || hasDataRoute || hasDisabled || classHandled || idHandled;

            const item = {
                file: rel,
                line: lineFor(content, match.index),
                id,
                classes: classList.slice(0, 8),
                text: compactText(match[2]),
                hasInlineHandler,
                hasDataRoute,
                hasDisabled,
                handledByStaticScan: handled,
            };
            buttons.push(item);

            if (id && !handled) idBindingCandidates.push(item);
            if (!id && !hasInlineHandler && !hasDataRoute && !hasDisabled && !classHandled) {
                noStableActionCandidates.push(item);
            }
        }
    }

    return {
        totalButtons: buttons.length,
        candidateButtonIdsWithoutClickBinding: idBindingCandidates,
        candidateButtonsWithoutStableAction: noStableActionCandidates,
        notes: [
            'Static scan is conservative: generated handlers and delegated listeners can create false positives.',
            'Treat candidate lists as Stage 0 triage input before removing or rewriting UI.',
        ],
    };
}

function scanMarkers(files) {
    const markerRegex = /\b(TODO|FIXME|coming soon|not implemented|placeholder|mock|fake|demo only)\b/gi;
    const markers = [];

    for (const fullPath of files) {
        const content = readFileSync(fullPath, 'utf8');
        const rel = toPosix(relative(root, fullPath));
        let match;
        while ((match = markerRegex.exec(content))) {
            markers.push({
                file: rel,
                line: lineFor(content, match.index),
                marker: match[1],
                context: compactText(content.slice(Math.max(0, match.index - 80), match.index + 160)),
            });
        }
    }

    return markers;
}

function fileInfo(relativePath) {
    const fullPath = resolve(root, relativePath);
    if (!existsSync(fullPath)) return { path: toPosix(relativePath), exists: false };
    const stats = statSync(fullPath);
    return {
        path: toPosix(relativePath),
        exists: true,
        bytes: stats.size,
    };
}

function legacyCurriculumInventory() {
    return {
        currentContentRootExists: existsSync(resolve(root, 'src/content')),
        monoliths: [
            fileInfo('src/data/curriculum.js'),
            fileInfo('src/data/vocab-banks.js'),
            fileInfo('src/data/vocab-banks-ar.js'),
            fileInfo('src/data/vocab-banks-es.js'),
            fileInfo('src/data/vocab-banks.js.bak'),
        ],
        generatorScripts: [
            'src/scripts/clean_all_emojis.cjs',
            'src/scripts/clean_final.cjs',
            'src/scripts/replace_emojis.cjs',
            'scripts/expand-ar-es.cjs',
            'scripts/expand-ar-es-2.cjs',
            'scripts/expand-ar-es-3.cjs',
            'scripts/gen-ar-es-banks.cjs',
            'scripts/gen-phrases-a1.cjs',
            'scripts/migrate-vocab.cjs',
        ].map(fileInfo),
        conclusion:
            'Active curriculum still lives in src/data/curriculum.js; no chunked src/content course pack exists yet.',
    };
}

function reportInventory() {
    return REPORT_FILES.map(fileInfo);
}

function command(commandText) {
    try {
        return execSync(commandText, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    } catch (error) {
        return String(error.stdout || error.stderr || error.message).trim();
    }
}

function main() {
    const files = repoFiles();
    const { curriculum, validation } = loadCurriculumAndValidation();
    const curriculumCounts = countCurriculum(curriculum, validation);
    const deadButtonAudit = scanButtons(files);
    const fakeActionMarkers = scanMarkers(files);

    const output = {
        generatedAt: new Date().toISOString(),
        repository: {
            root,
            branch: command('git branch --show-current'),
            head: command('git rev-parse --short HEAD'),
            statusShort: command('git status --short').split(/\r?\n/).filter(Boolean),
        },
        reports: reportInventory(),
        phaseStatus: {
            phase1Report: existsSync(resolve(root, 'LANGY_PHASE1_REPORT.md')) ? 'present' : 'missing',
            phase2Report: existsSync(resolve(root, 'LANGY_PHASE2_REPORT.md')) ? 'present' : 'missing',
            phase3Report: existsSync(resolve(root, 'LANGY_PHASE3_REPORT.md')) ? 'present' : 'missing',
        },
        curriculumCounts,
        legacyCurriculum: legacyCurriculumInventory(),
        deadButtonAudit,
        fakeActionMarkers,
    };

    console.log(JSON.stringify(output, null, 2));
}

main();
