import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const DIRECTIONS = [
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
]

const parseSeatingLine = (line) => line.split('');
const parseSeatingMap = (file) => file.split('\n')
    .filter((line) => line.length)
    .map(parseSeatingLine);

const immediatelyAdjacentStrategy = (seatingMap, x, y) =>
    ({ dx, dy }) => (seatingMap[y + dy] || [])[x + dx];

const lineOfSightStrategy = (seatingMap, x, y) =>
    ({ dx, dy }) => {
        const next = immediatelyAdjacentStrategy(seatingMap, x, y)({ dx, dy });
        if (next !== '.') {
            return next;
        }

        if (x < 0 || y < 0
            || x >= seatingMap[0].length
            || y >= seatingMap.length
        ) {
            return '.';
        }

        return lineOfSightStrategy(seatingMap, x + dx, y + dy)({ dx, dy });
    };

const getAdjacentOccupied = (strategy, seatingMap, x, y) => DIRECTIONS
    .map(strategy(seatingMap, x, y))
    .filter((cell) => cell === '#')
    .length;

const adjacentEmpty = (strategy, seatingMap, x, y) =>
    getAdjacentOccupied(strategy, seatingMap, x, y) === 0;

const tooCrowded = (strategy, crowdSize, seatingMap, x, y) =>
    getAdjacentOccupied(strategy, seatingMap, x, y) >= crowdSize;

const step = (strategy, crowdSize, seatingMap) => seatingMap
    .map((line, y) => line
        .map((cell, x) => {
            if (cell === 'L' && adjacentEmpty(strategy, seatingMap, x, y)) {
                return '#';
            }

            if (cell === '#' && tooCrowded(strategy, crowdSize, seatingMap, x, y)) {
                return 'L';
            }

            return cell;
        })
    );

const arraysMatch = (a, b) => a.every((value, i) => value === b[i]);
const hasMapChanged = (before, after) => !before
    .reduce((acc, beforeLine, i) => acc && beforeLine.every((cell, j) => cell === after[i][j]), true);

const visualiseSeating = (seatingMap) => seatingMap.map((row) => row.join('')).join('\n')

const runAutomation = (strategy, crowdSize, seatingMap) => {
    const next = step(strategy, crowdSize, seatingMap);
    return hasMapChanged(seatingMap, next)
        ? runAutomation(strategy, crowdSize, next)
        : seatingMap;
}

const countSeats = (seatingMap) => seatingMap
    .reduce((acc, row) => acc + row.reduce((acc, cell) => acc + Number(cell === '#'), 0), 0)

export const main = async (inputPath = './input.txt') => {
    const seatingMap = parseSeatingMap(await readFile(inputPath, 'utf8'));
    const part1Result = runAutomation(immediatelyAdjacentStrategy, 4, seatingMap);
    console.log('Seats (Part 1):', countSeats(part1Result));
    const part2Result = runAutomation(lineOfSightStrategy, 5, seatingMap);
    console.log('Seats (Part 2):', countSeats(part2Result));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
