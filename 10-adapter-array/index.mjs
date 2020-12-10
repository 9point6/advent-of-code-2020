import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const addBuiltInAdapter = (adapters) => [...adapters, (adapters[adapters.length - 1] + 3)];
const parseAdapters = (file) => addBuiltInAdapter(
    file.split('\n').map(Number).sort((a, b) => a - b)
);

const computeDifferences = (adapters) => adapters
    .map((joltage, i) => [joltage, joltage - (adapters[i - 1] || 0)])

const countDifferences = (adapters) => computeDifferences(adapters)
    .reduce((counts, [joltage, difference], i) => ({
        ...counts,
        [difference]: (counts[difference] || 0) + 1
    }), {});

const getRequiredAdapters = (adapters) => computeDifferences(adapters)
    .filter(([joltage, difference]) => difference === 3)
    .map(([joltage, difference]) => joltage);

const arraysMatch = (a, b) =>
    a.length == b.length && a.every((value, i) => value === b[i]);

const isValidCombination = (start, end) => (set) => Object
    .values(countDifferences([start, ...set, end]))
    .reduce((a, b) => a && b <= 3, true);

const computeCombinations = (set, start, end) => Object.values(set
    .map((item, i) => [...(i > 0 ? set.slice(0, i - 1) : []), ...set.slice(i)])
    .flatMap((subset, i) => [subset, ...(i === 0 ? [] : computeCombinations(subset))])
    .filter(isValidCombination(start, end))
    .reduce((acc, value) => ({ ...acc, [value.toString()]: value }), {}))

const countCombinations = (adapters) => computeDifferences(getRequiredAdapters(adapters))
    .map(([joltage, difference]) => {
        const start = joltage - difference;
        const preceding = adapters.filter((a) => start < a && a < joltage);
        return [joltage, difference, computeCombinations(preceding, start, joltage)];
    })
    .reduce((acc, [, , combinations]) => acc * (combinations.length || 1), 1);

const multiplyDifferences = (differences) => Object.values(differences)
    .reduce((a, b) => a * b, 1);

export const main = async (inputPath = './input.txt') => {
    const adapters = parseAdapters(await readFile(inputPath, 'utf8'));
    const differences = countDifferences(adapters);
    const multipliedDifferences = multiplyDifferences(differences);
    console.log('Multiplied Differences (part 1):', multipliedDifferences);

    const combinations = countCombinations(adapters);
    console.log('Combinations (part 2):', combinations)
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
