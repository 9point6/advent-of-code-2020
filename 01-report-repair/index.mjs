import { readFile } from 'fs/promises';

const BREAK = Symbol('break');

const sumSet = (set) => set.reduce((sum, val) => sum + val, 0);
const timesSet = (set) => set.reduce((prod, val) => prod * val, 1);
const doesSetMatch = (sum, sumToFind) => sum === sumToFind;
const isMatchPossible = (sum, sumToFind) => sum <= sumToFind;
const breakReducer = (fn) => (acc, val) => acc || (acc === BREAK ? BREAK : fn(val));

const doMatch = (results, sumToFind) => {
    const sum = sumSet(results);
    return doesSetMatch(sum, sumToFind)
        ? results
        : isMatchPossible(sum, sumToFind)
            ? false
            : BREAK;
}

const findSumFromLists = (lists, sumToFind, results = []) => {
    if (!lists.length) {
        return doMatch(results, sumToFind);
    }

    const result = lists[0].reduce(
        breakReducer((val) =>
            findSumFromLists(
                lists.slice(1) || [],
                sumToFind,
                [...results, val]
            )
        ),
        false
    );

    return result === BREAK ? false : result;
};

export const findSum = (inputList, numberOfItems, sumToFind = 2020) => {
    const sortedList = inputList.sort((a, b) => a >= b ? 1 : -1);
    const slicedList = sortedList.slice(0, sortedList.find((val) => val >= (sumToFind - sortedList[0])));
    const reversedList = [...slicedList].reverse();

    const lists = [
        reversedList,
        ...(
            Array.from({ length: numberOfItems - 1 })
                .map(() => [ ...slicedList ])
        )
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
