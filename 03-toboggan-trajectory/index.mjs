import { readFile } from 'fs/promises';

const getCoordinate = (map, { x, y }) => map[y][x % map[0].length]

const threeRightOneDown = ({ x, y }) => ({ x: x + 3, y: y + 1 });

const parseMap = (file) => file.split('\n').map((line) => line.split(''));

export const treesHit = async (inputPath) => {
    const map = parseMap(await readFile(inputPath, 'utf8'));

    let current = { x: 0, y: 0 }
    let count = 0
    while (current.y < map.length) {
        const cell = getCoordinate(map, current);
        if (cell === '#') {
            count++;
        }

        current = threeRightOneDown(current);
    }

    return count;
}

export const main = async (inputPath = './input.txt') => {
    console.log(`Hit trees: ${await treesHit(inputPath)}`);
}

main();
