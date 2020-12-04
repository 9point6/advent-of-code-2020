import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const SLOPES = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 }
];

const getCoordinate = (map, { x, y }) => map[y][x % map[0].length]
const threeRightOneDown = ({ x, y }) => ({ x: x + 3, y: y + 1 });
const changeCoordinates = ({ x, y }, change) => ({ x: x + change.x, y: y + change.y });
const parseMap = (file) => file.split('\n').map((line) => line.split(''));

export const treesHit = (map, slope) => {
    let current = { x: 0, y: 0 }
    let count = 0
    while (current.y < map.length) {
        const cell = getCoordinate(map, current);
        if (cell === '#') {
            count++;
        }

        current = changeCoordinates(current, slope);
    }

    return count;
}

export const main = async (inputPath = './input.txt') => {
    const map = parseMap(await readFile(inputPath, 'utf8'));
    const product = SLOPES
        .map((slope) => {
            const result = treesHit(map, slope);
            console.log(`Hit trees (+${slope.x}, +${slope.y}): ${result}`);
            return result
        })
        .reduce((acc, val) => acc * val, 1);

    console.log('Product:', product);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
