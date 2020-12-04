import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import esMain from './00-helpers/es-main.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
            console.log(`\n*** ${friendlyName(dir)}:`);
            const solution = await import(`./${dir}/index.mjs`);
            return solution.main(join(__dirname, `./${dir}/input.txt`))
        });

if (esMain(import.meta)) {
    main();
}
