import { readFile } from 'fs/promises';

const findSumPairs = (list, sumToFind = 2020) => {
    const sortedList = list.sort((a, b) => a >= b ? 1 : -1);
    const slicedList = sortedList.slice(0, sortedList.find((val) => val >= (sumToFind - sortedList[0])));
    const reversedList = [...slicedList].reverse();

    for (let i = 0; i < reversedList.length; i++) {
        for (let j = 0; j < slicedList.length; j++) {
            const val = reversedList[i] + slicedList[j];
            if (val === sumToFind) {
                return [reversedList[i], slicedList[j]];
            }

            if (val > sumToFind) {
                break;
            }
        }
    }
}

const findSumTriples = (list, sumToFind = 2020) => {
    const sortedList = list.sort((a, b) => a >= b ? 1 : -1);
    const slicedList = sortedList.slice(0, sortedList.find((val) => val >= (sumToFind - sortedList[0])));
    const reversedList = [...slicedList].reverse();

    for (let i = 0; i < reversedList.length; i++) {
        for (let j = 0; j < slicedList.length; j++) {
            for (let k = 0; k < slicedList.length; k++) {
                const val = reversedList[i] + slicedList[j] + slicedList[k];
                if (val === sumToFind) {
                    return [reversedList[i], slicedList[j], slicedList[k]];
                }

                if (val > sumToFind) {
                    break;
                }
            }
        }
    }
}

const partOne = async ({
    inputPath = './input.txt'
} = {}) => {
    const input = await readFile(inputPath, 'utf8');
    const list = input.split('\n').map(Number);

    const output = findSumPairs(list);
    console.log(output[0] * output[1]);
};

const partTwo = async ({
    inputPath = './input.txt'
} = {}) => {
    const input = await readFile(inputPath, 'utf8');
    const list = input.split('\n').map(Number);

    const output = findSumTriples(list);
    console.log(output[0] * output[1] * output[2]);
};

const main = async () => {
    console.log('Part One:');
    await partOne();

    console.log('Part Two:');
    await partTwo();
}

main();
