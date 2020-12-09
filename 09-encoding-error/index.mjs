import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseCipher = (file) => file.split('\n').map(Number);
const sumSet = (set) => set.reduce((acc, val) => acc + val, 0);
const containsSum = (set, sum) =>
    set.reduce(
        (acc, value) => acc || set.reduce(
            (acc2, val2) => acc2 || (value + val2) === sum,
            false
        ),
        false
    );

const validateCipher = (cipher, preambleLength = 25) => cipher
    .map((value, i) => ({
        value,
        valid: (i < preambleLength)
            || containsSum(cipher.slice(i - preambleLength, i), value)
    }))

const buildSumResult = (set, newSum, sum) => ({
    set,
    found: newSum === sum,
    skip: newSum < sum
})

const removeFromFront = ([_first, ...set], sum) => buildSumResult(set, sumSet(set), sum);
const testRemovals = (set, sum) => set.reduce(
    (acc) => (acc.found || acc.skip) ? acc : removeFromFront(acc.set, sum),
    { set }
);

const findContiguousSum = (set, sum) => set
    .reduce((acc, value) => {
        if (acc.found) {
            return acc;
        }

        const newSet = [...acc.set, value];
        const currentSum = sumSet(newSet);
        return (currentSum > sum)
            ? testRemovals(newSet, sum)
            : buildSumResult(newSet, currentSum, sum);
    }, { set: [] });

const findInvalid = (validatedCipher) => validatedCipher.find((value) => !value.valid);
const findWeakness = ({ set }) => Math.min.apply(null, set) + Math.max.apply(null, set);

export const main = async (inputPath = './input.txt') => {
    const parsedCipher = parseCipher(await readFile(inputPath, 'utf8'));
    const validatedCipher = validateCipher(parsedCipher);
    const invalidValue = findInvalid(validatedCipher).value;
    console.log('Invalid Value:', invalidValue);
    const contiguousSum = findContiguousSum(parsedCipher, invalidValue);
    console.log('Encryption Weakness:', findWeakness(contiguousSum));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
