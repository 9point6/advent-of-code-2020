import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const bagNameSanitiser = (bagName) => bagName.replace(/ bags?$/, '');
const parseBaggingRule = (rules, [bag, containsString]) =>
    (!containsString || containsString === 'no other bags.')
        ? rules
        : {
            ...rules,
            [bagNameSanitiser(bag)]: Object.fromEntries(
                containsString
                    .slice(0, -1)
                    .split(', ')
                    .map((bagString) => bagString.split(' '))
                    .map(([quantity, ...bagName]) =>
                        [bagNameSanitiser(bagName.join(' ')), Number(quantity)])
            )
        };

const parseBaggingRules = (file) => file.split('\n')
    .map((rule) => rule.split(' contain '))
    .reduce(parseBaggingRule, {});

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

const findBagContents = (rules, container) =>
    !rules[container]
        ? {}
        : Object.entries(rules[container])
            .reduce(
                (acc, [contents, count]) =>
                    Object.entries(findBagContents(rules, contents))
                        .reduce((acc, [key, insideCount]) => ({
                            ...acc,
                            [key]: (acc[key] || 0) + (insideCount * count)
                        }), acc),
                { ...rules[container] }
            );

const sumContents = (bagContents) => Object.values(bagContents)
    .reduce((acc, next) => acc + next, 0);

export const main = async (inputPath = './input.txt') => {
    const rules = parseBaggingRules(await readFile(inputPath, 'utf8'));
    const reverseMap = buildReverseRuleMap(rules);
    const shinyGoldContainers = findBagContents(reverseMap, 'shiny gold');
    const shinyGoldContents = findBagContents(rules, 'shiny gold');
    console.log('Shiny Gold bag can be contained by:', Object.values(shinyGoldContainers).length);
    console.log('Shiny Gold bag contains:', sumContents(shinyGoldContents));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
