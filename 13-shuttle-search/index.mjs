import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseBusIds = (file) => {
    const [timestamp, ids] = file.split('\n');
    return {
        timestamp: Number(timestamp),
        buses: ids.split(',').map((id) => id === 'x' ? false : Number(id))
    }
}

const findEarliest = ({ timestamp, buses }) => buses
    .filter((id) => id)
    .map((id) => [id, id - (timestamp % id)])
    .sort((a, b) => a[1] - b[1])
    .shift();

export const main = async (inputPath = './input.txt') => {
    const buses = parseBusIds(await readFile(inputPath, 'utf8'));
    const [id, wait] = findEarliest(buses)
    console.log('Earliest ID * wait (part 1):', id * wait);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
