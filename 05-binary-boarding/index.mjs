import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const directionToBinary = (direction) => ({ F: 0, B: 1, L: 0, R: 1 }[direction]);
const parseBoardingPass = (pass) => parseInt(pass.split('').map(directionToBinary).join(''), 2);
const parseBoardingPasses = (file) => file.split('\n').map(parseBoardingPass).sort((a, b) => a - b);
const findHighestId = (passes) => passes[passes.length - 1];
const findMissingSeatId = (passes) => passes.find((pass, i) => i > 0 && pass - passes[i - 1] > 1) - 1;

export const main = async (inputPath = './input.txt') => {
    const boardingPasses = parseBoardingPasses(await readFile(inputPath, 'utf8'));
    console.log('Highest ID:', findHighestId(boardingPasses));
    console.log('Your seat ID:', findMissingSeatId(boardingPasses));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
