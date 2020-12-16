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

const runV1Program = (program) => program
    .reduce(({ currentMask, memory }, [command, ...params]) => (
        command === 'mask'
            ? { memory, currentMask: params[0] }
            : { currentMask, memory: {
                ...memory,
                [params[0]]: applyMask(params[1], currentMask)
            }}
    ), { memory: {}, currentMask: { zeroes: 0n, ones: 0n } });

const applyMemoryMask = (val, { zeroes, ones }) => {
    const output = [];
    const state = { zeroes, ones, val };
    let i = 36;

    while (i) {
        if (state.zeroes & 1n) {
            output.push([state.val & 1n])
        } else if (state.ones & 1n) {
            output.push([1n])
        } else {
            output.push([0n, 1n])
        }

        state.zeroes >>= 1n;
        state.ones >>= 1n;
        state.val >>= 1n;
        i--;
    }

    return output.reverse().reduce((addresses, digits) => [
        ...digits.flatMap((digit) =>
            addresses.map((address) => (address << 1n) + digit)
        )
    ], [0n]);
};

const runV2Program = (program) => program
    .reduce(({ currentMask, memory }, [command, ...params]) => (
        command === 'mask'
            ? { memory, currentMask: params[0] }
            : { currentMask, memory: {
                ...applyMemoryMask(params[0], currentMask)
                    .reduce((mem, memAddress) => {
                        // return ({
                        //     ...mem,
                        //     [memAddress]: params[1]
                        // }); // Immutability is not very performant here :(
                        mem[memAddress] = params[1];
                        return mem;
                    }, memory)
            }}
    ), { memory: {}, currentMask: { zeroes: 0n, ones: 0n } });

const sumMemory = (memory) => Object.values(memory).reduce((a, b) => a + b, 0n);

export const main = async (inputPath = './input.txt') => {
    const program = parseProgram(await readFile(inputPath, 'utf8'));
    const { memory, currentMask } = runV1Program(program);
    const memorySum = sumMemory(memory);
    console.log('sum of memory (part 1):', memorySum);
    const { memory: memory2 } = runV2Program(program);
    const memorySum2 = sumMemory(memory2);
    console.log('sum of memory (part 2):', memorySum2);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
