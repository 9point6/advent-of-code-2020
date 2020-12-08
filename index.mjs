import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import esMain from './00-helpers/es-main.mjs';

const LOG_PREFIX = '\x1b[36m*** ';
const LOG_SUFFIX = '\x1b[0m';

const __dirname = dirname(fileURLToPath(import.meta.url));

const prepLog = (message, appendSuffix = true) => `${LOG_PREFIX}${message}${appendSuffix ? LOG_SUFFIX : ''}`;

const timeLog = async (timeLogString, func) => {
    const label = prepLog(`  ${timeLogString}`, false);
    console.time(label);
    const ret = await func();
    console.timeEnd(label);
    console.log(LOG_SUFFIX);
    return ret;
}

const friendlyName = (dir) => dir.split('-')
    .map((item, i) => i === 0
        ? `${Number(item)}.`
        : `${item.slice(0, 1).toUpperCase()}${item.slice(1)}`)
    .join(' ')

export const main = async () =>
    (await readdir(__dirname))
        .filter((dir) => /^[0-9]{2}-/.test(dir))
        .reduce(async (last, dir) => {
            await last;
            console.log(prepLog(`${friendlyName(dir)}:`));
            const solution = await timeLog('imported in', 
                async () => import(`./${dir}/index.mjs`));
            await timeLog('executed in', 
                async () => solution.main(join(__dirname, `./${dir}/input.txt`)));

        });

if (esMain(import.meta)) {
    main();
}
