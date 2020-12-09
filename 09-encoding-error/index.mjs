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
    .map((value, i) => {
        if (i < preambleLength) {
            return { value, preamble: true };
        }

        return {
            value,
            valid: containsSum(cipher.slice(i - preambleLength, i), value)
        };
    })

const findContiguousSum = (set, sum) => set
    .reduce((acc, value) => {
        if (acc.found) {
            return acc;
        }

        const newSet = [...acc.set, value];
        const currentSum = sumSet(newSet);
        if (currentSum === sum) {
            return { set: newSet, found: true }
        }

        if (currentSum > sum) {

            const shortSet = newSet.slice(1);
            const shortSum = sumSet(shortSet);

            return newSet.reduce((acc, item, i) => {
                if (acc.found) {
                    return acc;
                }

                const shortSet = acc.set.slice(1);
                const shortSum = sumSet(shortSet);
                if (shortSum < sum) {
                    return acc;
                }

                return {
                    set: shortSet,
                    found: shortSum === sum
                };
            }, { set: newSet });
        }

        return { set: newSet };
    }, { set: [] });

const findInvalid = (validatedCipher) => validatedCipher
    .find((value) => !value.preamble && !value.valid);

const findWeakness = (contiguousSum) => {
    const sortedList = contiguousSum.set.sort((a, b) => a - b);
    return sortedList[0] + sortedList[sortedList.length - 1];
}

export const main = async (inputPath = './input.txt') => {
    const parsedCipher = parseCipher(await readFile(inputPath, 'utf8'));
    const validatedCipher = validateCipher(parsedCipher);
    const invalidValue = findInvalid(validatedCipher).value;
    console.log('Invalid Value:', invalidValue);
    const contiguousSum = findContiguousSum(parsedCipher, invalidValue);
    console.log('Contiguous Sum:', contiguousSum);
    console.log('Encryption Weakness:', findWeakness(contiguousSum));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
