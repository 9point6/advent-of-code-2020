import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const FLIP_MASK = 0b111111111111111111111111111111111111n;

const buildMasks = (mask) => mask.split('')
    .reduce(({ zeroes, ones }, digit) => ({
        zeroes: (zeroes << 1n) + (digit === '0' ? 1n : 0n),
        ones: (ones << 1n) + (digit === '1' ? 1n : 0n)
    }), { zeroes: 0n, ones: 0n })

const parseLine = (line) => {
    const [command, ...params] = line.replace(/[^a-z0-9]/ig, ',').split(',').filter((a) => a);
    return command === 'mask'
        ? ['mask', buildMasks(params[0])]
        : ['mem', ...params.map(BigInt)];
};

const parseProgram = (file) => file.split('\n').filter((a) => a).map(parseLine);
const applyMask = (val, { zeroes, ones }) => ~((~val & ~ones ^ FLIP_MASK) & ~zeroes ^ FLIP_MASK)

const runProgram = (program) => program
    .reduce(({ currentMask, memory }, [command, ...params]) => (
        command === 'mask'
            ? { memory, currentMask: params[0] }
            : { currentMask, memory: {
                ...memory,
                [params[0]]: applyMask(params[1], currentMask)
            }}
    ), { memory: {}, currentMask: { zeroes: 0n, ones: 0n } });

const sumMemory = (memory) => Object.values(memory).reduce((a, b) => a + b, 0n);

export const main = async (inputPath = './input.txt') => {
    const program = parseProgram(await readFile(inputPath, 'utf8'));
    console.log('program', program);
    const { memory, currentMask } = runProgram(program);
    console.log('mask', currentMask.zeroes.toString(2), currentMask.ones.toString(2))
    const memorySum = sumMemory(memory);
    console.log('memory', memory);
    console.log('sum of memory (part 1):', memorySum);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
