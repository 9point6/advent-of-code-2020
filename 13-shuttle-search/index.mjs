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

const recurseMultiples = (timestamp, multiple, id, minutes) =>
    (timestamp + minutes) % id === 0
        ? { timestamp, multiple: multiple * id }
        : recurseMultiples(timestamp + multiple, multiple, id, minutes);

const findGoldenTicket = ({ timestamp, buses }) => buses
    .map((id, i) => id && [id, i])
    .filter((id) => id)
    .reduce(({ timestamp, multiple }, [id, minutes]) => (
        !multiple
            ? { timestamp, multiple: id }
            : recurseMultiples(timestamp, multiple, id, minutes)
        ), { timestamp: 0, multiple: 0 })
        .timestamp;

export const main = async (inputPath = './input.txt') => {
    const buses = parseBusIds(await readFile(inputPath, 'utf8'));
    const [id, wait] = findEarliest(buses);
    console.log('Earliest ID * wait (part 1):', id * wait);

    const goldenTicket = findGoldenTicket(buses);
    console.log('Golden Ticket (part 2):', goldenTicket);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
