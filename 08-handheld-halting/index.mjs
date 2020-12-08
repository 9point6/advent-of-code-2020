import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const SWAPSIES = { nop: 'jmp', jmp: 'nop' };

const parseBootloader = (file) => file.split('\n')
    .map((line) => line.split(' '))
    .map(([instruction, param]) => [instruction, Number(param)]);

const applyInstruction = ([instruction, param], { halt, accumulator, pointer, visited }) => ({
    halt: !!visited[pointer],
    accumulator: accumulator + (instruction === 'acc' ? param : 0),
    pointer: pointer + (instruction === 'jmp' ? param : 1),
    visited: { ...visited, [pointer]: true }
});

const executeBootloader = (instructions, state = {
    pointer: 0,
    accumulator: 0,
    remaining: instructions.length,
    visited: {},
    halt: false
}) => !state.halt && state.pointer < instructions.length
    ? executeBootloader(
        instructions,
        applyInstruction(instructions[state.pointer], state)
    ) : state;

const isBootloaderFixed = ({ halt, accumulator }) => halt ? false : accumulator; 

const fixCorruptedBootloader = (instructions) =>
    instructions.reduce((state, [instruction, param], i) => 
        state || !SWAPSIES[instruction]
            ? state
            : isBootloaderFixed(executeBootloader([
            ...instructions.slice(0, i),
            [SWAPSIES[instruction], param],
            ...instructions.slice(i + 1)
        ])), false);

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
