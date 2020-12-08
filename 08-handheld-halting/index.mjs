import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseBootloader = (file) => file.split('\n')
    .map((line) => line.split(' '))
    .map(([instruction, param]) => [instruction, Number(param)]);

const applyInstruction = (instruction, param, { halt, accumulator, pointer }) => ({
    halt,
    accumulator: accumulator + (instruction === 'acc' ? param : 0),
    pointer: pointer + (instruction === 'jmp' ? param : 1)
});

const executeBootloader = (instructions) => {
    const visited = {};
    let state = {
        pointer: 0,
        accumulator: 0,
        halt: false
    };

    while (true) {
        state.halt = !!visited[state.pointer];
        if (state.halt || state.pointer >= instructions.length) {
            break;
        }

        visited[state.pointer] = true;
        const [instruction, param] = instructions[state.pointer];
        state = applyInstruction(instruction, param, state);
    }

    return state;
}

const fixCorruptedBootloader = (instructions) => {
    const SWAPSIES = { nop: 'jmp', jmp: 'nop' };

    return instructions.reduce((state, [instruction, param], i) => {
        if (state || !SWAPSIES[instruction]) {
            return state;
        }

        const { halt, accumulator } = executeBootloader([
            ...instructions.slice(0, i),
            [SWAPSIES[instruction], param],
            ...instructions.slice(i + 1)
        ]);

        return halt ? false : accumulator;
    }, false)
}

export const main = async (inputPath = './input.txt') => {
    const instructions = parseBootloader(await readFile(inputPath, 'utf8'));
    const bootloaderResult = executeBootloader(instructions);
    console.log('Bootloader Result (part 1):', bootloaderResult.accumulator);

    const fixedBootloaderResult = fixCorruptedBootloader(instructions);
    console.log('Fixed Bootloader Result (part 2):', fixedBootloaderResult);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
