import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const INITIAL_DIRECTION = 'E';
const COMMAND_MAP = { N: 'NS', E: 'WE', S: 'NS', W: 'WE', L: 'LR', R: 'LR' };
const CLOCKWISE_ROTATION = ['N', 'E', 'S', 'W'];

const parseDirection = (direction) => ({
    command: direction.slice(0, 1),
    param: Number(direction.slice(1))
});

const parseDirections = (file) => file.split('\n').filter((line) => line).map(parseDirection);
const simplifyCommand = ({ command, param }) => ({
    command: COMMAND_MAP[command] || command,
    param: ['S', 'E', 'L'].includes(command) ? -param : param
});

const absoluteDirection = (pair, facing, command, param) => 
    (command === pair || (command === 'F' && facing === pair[0])
        ? param : (command === 'F' && facing === pair[1]) ? -param : 0);

const computeManhattan = (directions) => {
    const { NS, WE } = directions
        .map(simplifyCommand)
        .reduce(({ NS, WE, facing }, { command, param }) => ({
            NS: NS + absoluteDirection('NS', facing, command, param),
            WE: WE + absoluteDirection('WE', facing, command, param),
            facing: command === 'LR'
                ? CLOCKWISE_ROTATION[
                    (
                        CLOCKWISE_ROTATION.length 
                        + CLOCKWISE_ROTATION.indexOf(facing) 
                        + (param / 90)
                    ) % CLOCKWISE_ROTATION.length
                ]
                : facing
        }), {
            NS: 0,
            WE: 0,
            facing: INITIAL_DIRECTION
        });

    return Math.abs(NS) + Math.abs(WE);
};

export const main = async (inputPath = './input.txt') => {
    const directions = parseDirections(await readFile(inputPath, 'utf8'));
    const manhattanDistance = computeManhattan(directions);
    console.log('manhattan distance:', manhattanDistance);
};

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
