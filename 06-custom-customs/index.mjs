import { readFile } from 'fs/promises';
import { parse } from 'path';
import esMain from '../00-helpers/es-main.mjs';

const parseQuestions = (questions) => questions.split('');
const countGroupQuestions = ({ people, questions }, current) => ({
    people: people + 1,
    questions: current.reduce((questions, key) => ({
        ...questions,
        [key]: (questions[key] || 0) + 1
    }), questions) 
})
const countQuestions = (parsedGroup) => Object.entries(parsedGroup.questions)
    .reduce((parsedGroup, [question, count]) => ({
        ...parsedGroup,
        anyCount: (parsedGroup.anyCount || 0) + 1,
        allCount: (parsedGroup.allCount || 0) + (count === parsedGroup.people ? 1 : 0)
    }), parsedGroup);
const parseGroup = (group) => countQuestions(group.split('\n')
    .map(parseQuestions)
    .reduce(
        countGroupQuestions, 
        { people: 0, questions: {} }
    ));
const parseQuestionGroups = (file) => file.split('\n\n').map(parseGroup);
const sumQuestionCounts = (questionCounts) => questionCounts.reduce((acc, { anyCount }) => acc + anyCount, 0);
const sumAllQuestionCounts = (questionCounts) => questionCounts.reduce((acc, { allCount }) => acc + allCount, 0);

export const main = async (inputPath = './input.txt') => {
    const questionCounts = parseQuestionGroups(await readFile(inputPath, 'utf8'));
    console.log('Sum of any questions (part 1):', sumQuestionCounts(questionCounts));
    console.log('Sum of all questions (part 2):', sumAllQuestionCounts(questionCounts));
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
