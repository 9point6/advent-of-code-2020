import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import esMain from './00-helpers/es-main.mjs';

const LOG_PREFIX = '\x1b[36m*** ';
const LOG_SUFFIX = '\x1b[0m';

const __dirname = dirname(fileURLToPath(import.meta.url));

const prepLog = (message, appendSuffix = true) => `${LOG_PREFIX}${message}${appendSuffix ? LOG_SUFFIX : ''}`;

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
            console.time(prepLog('  imported in', false));
            const solution = await import(`./${dir}/index.mjs`);
            console.timeEnd(prepLog('  imported in', false));
            console.log(LOG_SUFFIX);
            console.time(prepLog('  executed in', false));
            await solution.main(join(__dirname, `./${dir}/input.txt`));
            console.log('');
            console.timeEnd(prepLog('  executed in', false));
            console.log(LOG_SUFFIX);

        });

if (esMain(import.meta)) {
    main();
}
