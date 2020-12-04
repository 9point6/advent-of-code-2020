import { readdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import esMain from './00-helpers/es-main.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const main = async () =>
    (await readdir(__dirname))
        .filter((dir) => /^[0-9]{2}-/.test(dir))
        .reduce(async (last, dir) => {
            await last;
            console.log(`\n*** ${dir}:`);
            const solution = await import(`./${dir}/index.mjs`);
            return solution.main(join(__dirname, `./${dir}/input.txt`))
        });

if (esMain(import.meta)) {
    main();
}
