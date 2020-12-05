import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseBoardingPass = (pass) => {
    const binaryId = pass.split('')
        .map((char) => ({ F: 0, B: 1, L: 0, R: 1 }[char]))
        .join('');

    return {
        pass,
        id: parseInt(binaryId, 2),
        row: parseInt(binaryId.slice(0,7), 2),
        col: parseInt(binaryId.slice(7), 2)
    };
}

const parseBoardingPasses = (file) => file.split('\n').map(parseBoardingPass).sort((a, b) => a.id - b.id);
const findHighestIdPass = (passes) => passes.reduce((acc, item) => acc.id >= item.id ? acc : item, { id: 0 });
const findMissingSeatId = (passes) => passes.find((pass, i) => i > 0 && pass.id - passes[i - 1].id > 1).id - 1;

export const main = async (inputPath = './input.txt') => {
    const boardingPasses = parseBoardingPasses(await readFile(inputPath, 'utf8'));
    console.log('Highest ID Boarding Pass:', findHighestIdPass(boardingPasses));
    console.log('Your seat ID:', findMissingSeatId(boardingPasses));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
