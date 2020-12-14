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

const absoluteShipDirection = (pair, facing, command, param) => 
    (command === pair || (command === 'F' && facing === pair[0])
        ? param : (command === 'F' && facing === pair[1]) ? -param : 0);

const computeFacing = (command, facing, param) => command !== 'LR'
    ? facing
    : CLOCKWISE_ROTATION[(
        CLOCKWISE_ROTATION.length 
            + CLOCKWISE_ROTATION.indexOf(facing) 
            + (param / 90)
    ) % CLOCKWISE_ROTATION.length];

const computeManhattan = (directions) => {
    const { NS, WE } = directions
        .map(simplifyCommand)
        .reduce(({ NS, WE, facing }, { command, param }) => ({
            NS: NS + absoluteShipDirection('NS', facing, command, param),
            WE: WE + absoluteShipDirection('WE', facing, command, param),
            facing: computeFacing(command, facing, param)
        }), {
            NS: 0,
            WE: 0,
            facing: INITIAL_DIRECTION
        });

    return Math.abs(NS) + Math.abs(WE);
};

const computeManhattanWaypoint = async (directions) => {
    const { ship: { NS, WE } } = directions
        .map(simplifyCommand)
        .reduce(({ waypoint, ship }, { command, param }) => {
            if (command == 'LR') {
                let rotations = Math.abs(param) / 90;
                let newWaypoint = waypoint;
                while (rotations--) {
                    newWaypoint = {
                        NS: (param < 0 ? -1 : 1) * newWaypoint.WE,
                        WE: (param < 0 ? 1 : -1) * newWaypoint.NS
                    };
                }

                return { ship, waypoint: newWaypoint };
            }

            return {
                waypoint: {
                    NS: waypoint.NS + (command === 'NS' ? param : 0),
                    WE: waypoint.WE + (command === 'WE' ? param : 0),
                },
                ship: {
                    NS: ship.NS + (command === 'F' ? waypoint.NS * param : 0),
                    WE: ship.WE + (command === 'F' ? waypoint.WE * param : 0)
                }
            };
        }, {
            waypoint: { NS: 1, WE: -10 },
            ship: { NS: 0,  WE: 0 }
        });

    return Math.abs(NS) + Math.abs(WE);
};

export const main = async (inputPath = './input.txt') => {
    const directions = parseDirections(await readFile(inputPath, 'utf8'));
    const manhattanDistance = computeManhattan(directions);
    console.log('Manhattan Distance (Part 1):', manhattanDistance);
    const manhattanWaypoint = await computeManhattanWaypoint(directions);
    console.log('Waypoint Manhattan Distance (Part 2):', manhattanWaypoint);
};

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
