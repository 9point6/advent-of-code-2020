import { readFile } from 'fs/promises';

const decodePolicy = (policyString) => {
    const [range, char] = policyString.split(' ');
    const [min, max] = range.split('-');
    return { char, min, max };
};

const decodeLine = (line) => {
    const [policyString, password] = line.split(': ');
    return {
        policy: decodePolicy(policyString),
        password
    }
};

const testPolicy = ({ password, policy }) => {
    if (!password) {
        return false;
    }

    const count = password.split('')
        .reduce((acc, char) => acc + (char === policy.char ? 1 : 0), 0);

    return policy.max >= count && count >= policy.min;
};

export const validPasswords = async (inputPath) => {
    const input = await readFile(inputPath, 'utf8');
    const list = input.split('\n').map(decodeLine);
    return list.map(testPolicy)
        .reduce((acc, item) => acc + (!!item ? 1 : 0), 0);
}

export const main = async (inputPath = './input.txt') => {
    console.log(`Valid Passwords: ${await validPasswords(inputPath)}`);
}

main();
