import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const addBuiltInAdapter = (adapters) => [...adapters, (adapters[adapters.length - 1] + 3)];
const parseAdapters = (file) => addBuiltInAdapter(
    file.split('\n').map(Number).sort((a, b) => a - b)
);

const countDifferences = (adapters) => adapters
    .map((joltage, i) => joltage - (adapters[i - 1] || 0))
    .reduce((counts, difference, i) => (console.log(counts, difference), {
        ...counts,
        [difference]: (counts[difference] || 0) + 1
    }), {});

const multiplyDifferences = (differences) => Object.values(differences)
    .reduce((a, b) => a * b, 1);

export const main = async (inputPath = './input.txt') => {
    const adapters = parseAdapters(await readFile(inputPath, 'utf8'));
    const differences = countDifferences(adapters);
    const multipliedDifferences = multiplyDifferences(differences);
    console.log('Multipled Differences (part 1):', multipliedDifferences);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
