/**
 * Test Setup — loads browser globals for unit testing.
 * The app uses `const X = ...` at top level, which in the browser
 * becomes a global. In Node/vitest, we replicate this with vm.runInThisContext.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import vm from 'vm';

const root = resolve(import.meta.dirname, '..');

const storageData = new Map();
const storageMock = {
    get length() {
        return storageData.size;
    },
    key(index) {
        return Array.from(storageData.keys())[index] ?? null;
    },
    getItem(key) {
        const k = String(key);
        return storageData.has(k) ? storageData.get(k) : null;
    },
    setItem(key, value) {
        storageData.set(String(key), String(value));
    },
    removeItem(key) {
        storageData.delete(String(key));
    },
    clear() {
        storageData.clear();
    },
};

Object.defineProperty(globalThis, 'localStorage', {
    value: storageMock,
    configurable: true,
});
Object.defineProperty(window, 'localStorage', {
    value: storageMock,
    configurable: true,
});

function loadScript(relativePath) {
    const code = readFileSync(resolve(root, relativePath), 'utf-8');
    vm.runInThisContext(code, { filename: relativePath });
}

// Load files in dependency order (mimicking index.html script order)
loadScript('src/utils/config.js');
loadScript('src/utils/core.js');
loadScript('src/utils/metrics.js');
loadScript('src/utils/icons.js');
loadScript('src/utils/i18n.js');
loadScript('src/utils/state.js');
loadScript('src/utils/target-language.js');
loadScript('src/data/curriculum.js');
loadScript('src/data/curriculum-validator.js');
loadScript('src/data/vocab-banks.js');
loadScript('src/data/vocab-banks-ar.js');
loadScript('src/data/vocab-banks-es.js');
loadScript('src/data/grammar-banks.js');
loadScript('src/data/exercise-generator.js');
loadScript('src/utils/widgets.js');
loadScript('src/utils/db.js');
loadScript('src/utils/ai.js');
loadScript('src/utils/router.js');
loadScript('src/screens/auth.js');
loadScript('src/screens/onboarding.js');
loadScript('src/screens/subscription.js');
loadScript('src/screens/home.js');
loadScript('src/screens/course-map.js');
loadScript('src/screens/lesson-overview.js');
loadScript('src/screens/learning.js');
loadScript('src/screens/review.js');
loadScript('src/screens/profile.js');
