import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseSeatingLine = (line) => line.split('');
const parseSeatingMap = (file) => file.split('\n')
    .filter((line) => line.length)
    .map(parseSeatingLine);

const getAdjacentOccupied = (seatingMap, x, y, edgeCell = '.') =>
    [
        (seatingMap[y - 1] || [])[x - 1] || edgeCell,
        (seatingMap[y - 1] || [])[x] || edgeCell,
        (seatingMap[y - 1] || [])[x + 1] || edgeCell,
        (seatingMap[y] || [])[x - 1] || edgeCell,
        (seatingMap[y] || [])[x + 1] || edgeCell,
        (seatingMap[y + 1] || [])[x - 1] || edgeCell,
        (seatingMap[y + 1] || [])[x] || edgeCell,
        (seatingMap[y + 1] || [])[x + 1] || edgeCell
    ].filter((cell) => cell === '#')
    .length;

const adjacentEmpty = (seatingMap, x, y) => getAdjacentOccupied(seatingMap, x, y) === 0;
const tooCrowded = (seatingMap, x, y) => getAdjacentOccupied(seatingMap, x, y) >= 4;

const step = (seatingMap) => seatingMap
    .map((line, y) => line
        .map((cell, x) => {
            if (cell === 'L' && adjacentEmpty(seatingMap, x, y)) {
                return '#';
            }

            if (cell === '#' && tooCrowded(seatingMap, x, y)) {
                return 'L';
            }

            return cell;
        })
    );

const arraysMatch = (a, b) => a.every((value, i) => value === b[i]);
const hasMapChanged = (before, after) => !before
    .reduce((acc, beforeLine, i) => acc && beforeLine.every((cell, j) => cell === after[i][j]), true);

const visualiseSeating = (seatingMap) => seatingMap.map((row) => row.join('')).join('\n')

const runAutomation = (seatingMap) => {
    const next = step(seatingMap);
    return hasMapChanged(seatingMap, next)
        ? runAutomation(next)
        : seatingMap;

    // let count = 0;
    // let prev = seatingMap
    // let next = step(prev);
    // console.log(visualiseSeating(prev) + '\n');
    // while (hasMapChanged(prev, next)) {
    //     console.log(visualiseSeating(next) + '\n');
    //     prev = next;
    //     next = step(prev);
    //     count++;
    // }

    // return [next, count]
}

const countSeats = (seatingMap) => seatingMap
    .reduce((acc, row) => acc + row.reduce((acc, cell) => acc + Number(cell === '#'), 0), 0)

export const main = async (inputPath = './input.txt') => {
    const seatingMap = parseSeatingMap(await readFile(inputPath, 'utf8'));
    const result = runAutomation(seatingMap);
    console.log(`Final map:\n${visualiseSeating(result)}`);
    console.log('Seats:', countSeats(result));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
