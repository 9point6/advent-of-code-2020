import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const INITIAL_DIRECTION = 'E';
const COMMAND_MAP = { N: 'NS', E: 'EW', S: 'NS', W: 'EW', L: 'LR', R: 'LR' };
const CLOCKWISE_ROTATION = ['N', 'E', 'S', 'W'];

const parseDirection = (direction) => ({
    command: direction.slice(0, 1),
    param: Number(direction.slice(1))
});

const parseDirections = (file) => file.split('\n').filter((line) => line).map(parseDirection);

const computeManhattan = (directions) => {
    const { NS, EW } = directions
        .map(({ command, param }) => ({
            command: COMMAND_MAP[command] || command,
            param: ['S', 'E', 'L'].includes(command) ? -param : param
        }))
        .reduce(({ NS, EW, facing }, { command, param }) => ({
            NS: NS + (command === 'NS' || (command === 'F' && facing === 'N')
                ? param
                : (command === 'F' && facing === 'S') ? -param : 0),
            EW: EW + (command === 'EW' || (command === 'F' && facing === 'W')
                ? param
                : (command === 'F' && facing === 'E') ? -param : 0),
            facing: command === 'LR'
                ? CLOCKWISE_ROTATION[
                    (CLOCKWISE_ROTATION.length + CLOCKWISE_ROTATION.indexOf(facing) + (param / 90))
                        % CLOCKWISE_ROTATION.length]
                : facing
        }), {
            NS: 0,
            EW: 0,
            facing: INITIAL_DIRECTION
        });

    return Math.abs(NS) + Math.abs(EW);
}

export const main = async (inputPath = './input.txt') => {
    const directions = parseDirections(await readFile(inputPath, 'utf8'));
    const manhattanDistance = computeManhattan(directions);
    console.log('manhattan distance:', manhattanDistance);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
