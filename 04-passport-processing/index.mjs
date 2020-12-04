import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const VALID_EYE_COLOURS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const REQUIRED_FIELDS = {
    byr: (val) => !!val && val.length === 4 && 1920 <= val && val <= 2002,
    iyr: (val) => !!val && val.length === 4 && 2010 <= val && val <= 2020,
    eyr: (val) => !!val && val.length === 4 && 2020 <= val && val <= 2030,
    hgt: (val = '') => {
        const suffix = val.substr(-2, 2);
        const value = parseInt(val, 10);
        return (suffix === 'cm' && (150 <= value && value <= 193))
            || (suffix === 'in' && (59 <= value && value <= 76))
    },
    hcl: (val) => /^#[a-f0-9]{6}$/.test(val),
    ecl: (val) => VALID_EYE_COLOURS.includes(val),
    pid: (val) => /^[0-9]{9}$/.test(val)
}

const parsePassport = (passportString) => passportString
    .replace(/\n/g, ' ')
    .split(' ')
    .filter((pair) => pair.indexOf(':') !== -1)
    .map((pair) => pair.split(':'))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {})

const validatePassportHasFields = (passport) => Object.entries(REQUIRED_FIELDS)
    .reduce((acc, [field, validator]) => acc && !!passport[field], true);

const validatePassport = (passport) => Object.entries(REQUIRED_FIELDS)
    .reduce((acc, [field, validator]) => acc && validator(passport[field]), true);

const countValid = (validatedPassports) => validatedPassports
    .reduce((acc, { valid }) => acc + Number(valid), 0);

const countHasFields = (validatedPassports) => validatedPassports
    .reduce((acc, { hasFields }) => acc + Number(hasFields), 0);

export const parsePassports = (file) => file.split('\n\n').map(parsePassport);

export const validatePassports = (passports) => passports
    .map((passport) => ({
        ...passport,
        hasFields: validatePassportHasFields(passport),
        valid: validatePassport(passport)
    }));

export const main = async (inputPath = './input.txt') => {
    const passports = parsePassports(await readFile(inputPath, 'utf8'));
    const validatedPassports = validatePassports(passports);

    console.log('Valid Passports (part 1):', countHasFields(validatedPassports));
    console.log('Valid Passports {part 2}:', countValid(validatedPassports));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
