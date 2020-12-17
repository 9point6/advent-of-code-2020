import { readFile } from 'fs/promises';
import esMain from '../00-helpers/es-main.mjs';

const parseRanges = (rangeLines) => rangeLines
    .map((line) => {
        const [name, rangesString] = line.split(': ');
        const ranges = rangesString.split(' or ').map((range) => range.split('-').map(Number));
        return { name, ranges };
    })

const parseTicket = (ticketLine) => ticketLine.split(',').map(Number);
const parseMyTicket = (myTicketLines) => parseTicket(myTicketLines[myTicketLines.length - 1]);
const parseNearbyTickets = (nearbyLines) => nearbyLines.slice(1).map(parseTicket);

const parseTickets = (file) => {
    const [ranges, myTicket, nearbyTickets] = file.split('\n\n')
        .map((item) => item.split('\n'));

    return {
        ranges: parseRanges(ranges),
        myTicket: parseMyTicket(myTicket),
        nearbyTickets: parseNearbyTickets(nearbyTickets)
    };
}

const inRange = (val, [min, max]) => min <= val && val <= max
const inSomeRanges = (val, ranges) => ranges.some((range) => inRange(val, range));
const validateTickets = ({ ranges, nearbyTickets }) => {
    const flatRanges = ranges.flatMap(({ ranges }) => ranges);
    const valid = nearbyTickets.filter((ticket) => ticket.every((val) => inSomeRanges(val, flatRanges)))
    const invalid = nearbyTickets.filter((ticket) => ticket.some((val) => !inSomeRanges(val, flatRanges)))

    return {
        valid,
        invalidValues: invalid.flatMap((ticket) => ticket
            .filter((val) => !inSomeRanges(val, flatRanges)))
    };
}

const calculateErrorRate = (invalidValues) => invalidValues.reduce((a, b) => a + b, 0)

export const main = async (inputPath = './input.txt') => {
    const tickets = parseTickets(await readFile(inputPath, 'utf8'));
    const validatedTickets = validateTickets(tickets);
    const errorRate = calculateErrorRate(validatedTickets.invalidValues)
    console.log('Ticket Error rate (part 1):', errorRate);
}

if (esMain(import.meta)) {
    main(process.env.INPUT_PATH || './input.txt');
}
