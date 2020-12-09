import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseCipher = (file) => file.split('\n').map(Number);

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
            valid: containsSum(cipher.slice(i - 25, i), value)
        };
    })

const findInvalid = (validatedCipher) => validatedCipher
    .find((value) => !value.preamble && !value.valid);

export const main = async (inputPath = './input.txt') => {
    const parsedCipher = parseCipher(await readFile(inputPath, 'utf8'));
    const validatedCipher = validateCipher(parsedCipher);
    console.log('Invalid Value:', findInvalid(validatedCipher).value);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
