import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const decodePolicy = (policyString) => {
    const [range, char] = policyString.split(' ');
    const [min, max] = range.split('-').map(Number);
    return { char, min, max };
};

const decodeLine = (line) => {
    const [policyString, password] = line.split(': ');
    return {
        policy: decodePolicy(policyString),
        password
    }
};

const isBetween = (min, max, val) => max >= val && val >= min

export const testPolicy1 = ({ password, policy }) =>
    password && isBetween(
        policy.min,
        policy.max,
        password.split('')
            .reduce((acc, char) => acc + (char === policy.char ? 1 : 0), 0),
    );

export const testPolicy2 = ({ password, policy: { min, max, char } }) =>
    password
        && (password.charAt(min - 1) === char)
            !== (password.charAt(max - 1) === char);

export const validPasswords = async (inputPath, policyFunc) =>
    (await readFile(inputPath, 'utf8'))
        .split('\n')
        .map(decodeLine)
        .map(policyFunc)
        .reduce((acc, item) => acc + (!!item ? 1 : 0), 0);


export const main = async (inputPath = './input.txt') => {
    console.log(`Valid Passwords (policy 1): ${await validPasswords(inputPath, testPolicy1)}`);
    console.log(`Valid Passwords (policy 2): ${await validPasswords(inputPath, testPolicy2)}`);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
