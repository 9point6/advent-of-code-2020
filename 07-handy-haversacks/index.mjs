import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const bagNameSanitiser = (bagName) => bagName.replace(/ bags?$/, '');
const parseBaggingRule = (rules, rule) => {
    const [bag, containsString] = rule.split(' contain ');
    if (!containsString) {
        return rules;
    }

    return {
        ...rules,
        [bagNameSanitiser(bag)]: Object.fromEntries(
            containsString
                .slice(0, -1)
                .split(', ')
                .map((bagString) => {
                    const [quantity, ...bagName] = bagString.split(' ');
                    return [bagNameSanitiser(bagName.join(' ')), Number(quantity)];
                })
        )
    };
};
const parseBaggingRules = (file) => file.split('\n').reduce(parseBaggingRule, {});
const buildReverseRuleMap = (rules) => Object.entries(rules)
    .reduce((reverseRules, [bag, contains]) => Object.entries(contains)
        .reduce((acc, [containBag, count]) => ({
            ...acc,
            [containBag]: {
                ...(acc[containBag] || {}),
                [bag]: count
            }
        }), reverseRules),
    {});

// const findBagContainers = (reverseMap, bagToContain) => reverseMap[bagToContain];

const findBagContainers = (reverseMap, bagToContain) =>
    !reverseMap[bagToContain]
        ? {}
        : Object.keys(reverseMap[bagToContain])
            .reduce(
                (acc, container) => ({
                    ...acc,
                    ...findBagContainers(reverseMap, container)
                }),
                { ...reverseMap[bagToContain] }
            );


export const main = async (inputPath = './input.txt') => {
    const rules = parseBaggingRules(await readFile(inputPath, 'utf8'));
    const reverseMap = buildReverseRuleMap(rules);
    const shinyGoldContainers = findBagContainers(reverseMap, 'shiny gold');
    console.log('Shiny Gold bag can be contained by:', Object.keys(shinyGoldContainers).length);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
