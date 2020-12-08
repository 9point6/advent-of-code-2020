import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const applyInstruction = (instruction, param, state) => {
    const newState = { ...state };
    switch (instruction) {
        case 'acc':
            newState.accumulator += Number(param);
        case 'nop':
            newState.pointer += 1;
            break;
        case 'jmp':
            newState.pointer += Number(param);
    }

    return newState;
}

const parseBootloader = (file) => {
    const instructions = file.split('\n');
    const visited = {};
    let state = {
        pointer: 0,
        accumulator: 0
    };

    while (true) {
        visited[state.pointer] = true;
        const [instruction, param] = instructions[state.pointer].split(' ');
        state = applyInstruction(instruction, param, state)

        if (visited[state.pointer]) {
            return state.accumulator;
        }
    }
}

export const main = async (inputPath = './input.txt') => {
    const bootloaderResult = parseBootloader(await readFile(inputPath, 'utf8'));
    console.log('Bootloader Result (part 1):', bootloaderResult);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
