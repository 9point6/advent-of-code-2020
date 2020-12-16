import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseNumbers = (file) => file.split(',').map(Number);

const playGame = (initialNumbers, until) => {
    const lastSeen = initialNumbers
        .reduce((acc, num, i) => ({ ...acc, [num]: [i] }), {});

    const numbers = [...initialNumbers];
    while (numbers.length < until) {
        const i = numbers.length;
        const last = numbers[i - 1];

        if (lastSeen[last].length > 1) {
            const newNum = lastSeen[last][0] - lastSeen[last][1];
            numbers.push(newNum);
            lastSeen[newNum] = [i, ...(lastSeen[newNum] ? [lastSeen[newNum][0]] : [])];
        } else {
            numbers.push(0);
            lastSeen[0] = [i, lastSeen[0][0]];
        }
    }

    return numbers;
}

export const main = async (inputPath = './input.txt') => {
    const numbers = parseNumbers(await readFile(inputPath, 'utf8'));
    const gameResult = playGame(numbers, 2020);
    console.log('2020th number (part 1):', gameResult[gameResult.length - 1]);
    const gameResult2 = playGame(numbers, 30000000);
    console.log('30000000th number (part 2):', gameResult2[gameResult2.length - 1]);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
