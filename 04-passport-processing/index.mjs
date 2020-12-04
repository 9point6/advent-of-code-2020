import { readFile } from 'fs/promises';

const REQUIRED_FIELDS = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
    // 'cid',
]

const parsePassport = (passportString) => passportString
    .replace(/\n/g, ' ')
    .split(' ')
    .filter((pair) => pair.indexOf(':') !== -1)
    .map((pair) => pair.split(':'))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

const parsePassports = (file) => file.split('\n\n').map(parsePassport);

const validatePassports = (passports) => passports
    .map((passport) => ({
        ...passport,
        valid: REQUIRED_FIELDS.reduce((acc, field) => acc && !!passport[field], true)
    }));

const countValid = (validatedPassports) => validatedPassports
    .reduce((acc, { valid }) => acc + Number(valid), 0)

export const main = async (inputPath = './input.txt') => {
    const passports = parsePassports(await readFile(inputPath, 'utf8'));
    const validatedPassports = validatePassports(passports);

    console.log('Valid Passports:', countValid(validatedPassports));
}

main();
