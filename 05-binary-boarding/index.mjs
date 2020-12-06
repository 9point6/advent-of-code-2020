import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const directionToBinary = (direction) => ({ F: 0, B: 1, L: 0, R: 1 }[direction]);
const parseBoardingPass = (pass) => parseInt(pass.split('').map(directionToBinary).join(''), 2);
const parseBoardingPasses = (file) => file.split('\n').map(parseBoardingPass).sort((a, b) => a - b);
const findHighestId = (ids) => ids[ids.length - 1];
const findMissingSeatId = (ids) => ids.find((id, i) => i > 0 && id - ids[i - 1] > 1) - 1;

export const main = async (inputPath = './input.txt') => {
    const boardingPassIds = parseBoardingPasses(await readFile(inputPath, 'utf8'));
    console.log('Highest ID:', findHighestId(boardingPassIds));
    console.log('Your seat ID:', findMissingSeatId(boardingPassIds));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
