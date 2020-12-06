import { readFile } from 'fs/promises';
import { parse } from 'path';
import esMain from '../00-helpers/es-main.mjs';

const parseQuestions = (questions) => questions.split('');
const countGroupQuestions = ({ people, questions, count }, current) => ({
    people: people + 1,
    questions: new Set([...questions, ...current])
})
const countQuestions = (parsedGroup) => ({
    ...parsedGroup,
    count: [...parsedGroup.questions].length
});
const parseGroup = (group) => countQuestions(group.split('\n')
    .map(parseQuestions)
    .reduce(
        countGroupQuestions, 
        { people: 0, questions: [], count: 0 }
    ));
const parseQuestionGroups = (file) => file.split('\n\n').map(parseGroup);
const sumQuestionCounts = (questionCounts) => questionCounts.reduce((acc, { count }) => acc + count, 0);

export const main = async (inputPath = './input.txt') => {
    const questionCounts = parseQuestionGroups(await readFile(inputPath, 'utf8'));
    console.log('Question counts', questionCounts);
    console.log('Sum of counts:', sumQuestionCounts(questionCounts));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
