import { readFile } from 'fs/promises';

const BREAK = Symbol('break');

const sumSet = (set) => set.reduce((sum, val) => sum + val, 0);
const timesSet = (set) => set.reduce((prod, val) => prod * val, 1);
const doesSetMatch = (sum, sumToFind) => sum === sumToFind;
const isMatchImpossible = (sum, sumToFind) => sum > sumToFind;
const resolveBreak = (result) => result !== BREAK && result;

const doMatch = (sum, results, sumToFind) => doesSetMatch(sum, sumToFind)
    ? results
    : isMatchImpossible(sum, sumToFind) && BREAK;

const findSumFromLists = ([head, ...tail] = [], sumToFind, results = []) =>
    !head
        ? doMatch(sumSet(results), results, sumToFind)
        : resolveBreak(head.reduce(
            (acc, val) => acc || findSumFromLists(tail, sumToFind, [...results, val]),
            false
        ));

export const findSum = (inputList, numberOfItems, sumToFind = 2020) => {
    const sortedList = inputList.sort((a, b) => a >= b ? 1 : -1);
    const slicedList = sortedList.slice(0, sortedList.find((val) => val >= (sumToFind - sortedList[0])));
    const reversedList = [...slicedList].reverse();

    const lists = [
        reversedList,
        ...Array.from({ length: numberOfItems - 1 })
            .map(() => [ ...slicedList ])
    ];

    return findSumFromLists(lists, sumToFind);
};

export const findSumMultiple = async (numberOfItems, inputPath) => {
    const input = await readFile(inputPath, 'utf8');
    const list = input.split('\n').map(Number);
    return timesSet(findSum(list, numberOfItems));
}

export const main = async (inputPath = './input.txt') => {
    console.log(`Part One: ${await findSumMultiple(2, inputPath)}`);
    console.log(`Part Two: ${await findSumMultiple(3, inputPath)}`);
}

main();
