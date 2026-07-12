import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';

const root = resolve(import.meta.dirname, '..');

function runScript(context, relativePath) {
    const code = readFileSync(resolve(root, relativePath), 'utf8');
    vm.runInContext(code, context, { filename: relativePath });
}

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

const result = validator.validate(curriculum);

console.log('Curriculum validation');
console.log(`Textbooks: ${result.stats.textbooks}`);
console.log(`Units: ${result.stats.units}`);
console.log(`Exercises: ${result.stats.exercises}`);
console.log(`Types: ${JSON.stringify(result.stats.byType)}`);

if (result.warnings.length) {
    console.log(`Warnings: ${result.warnings.length}`);
    result.warnings.slice(0, 20).forEach(w => console.log(`WARN ${w.path}: ${w.message}`));
    if (result.warnings.length > 20) console.log(`...and ${result.warnings.length - 20} more warnings`);
}

if (!result.valid) {
    console.error(`Errors: ${result.errors.length}`);
    result.errors.forEach(e => console.error(`ERROR ${e.path}: ${e.message}`));
    process.exit(1);
}

console.log('Curriculum validation passed.');
