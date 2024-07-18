import { test } from 'tape'
import { remark } from 'remark'
import linter from './index.js'

const linEol = '\n';
const winEol = '\r\n';

const validMixed =
`The first line is correct.${linEol}` +
`The second line is correct as well.${winEol}` +
`.${linEol}`

const validLinux = validMixed.replace(winEol, linEol);
const validWindows = validMixed.replace(linEol, winEol);

[
    ["Linux", validLinux],
    ["Windows", validWindows],
    ["mixed", validMixed],
].forEach(([desc, sampleText]) =>
    test(
        `With ${desc} line endings`,
        (t) => {

            const output = remark().use(linter).processSync(sampleText);

            t.deepEqual(output.messages, []);
            t.end();
        }
    )
);


const invalidMixed =
`The first line is bearing trailing whitespaces.\t${linEol}` +
`The second line as well. ${linEol}` +
`The third line is correct.${winEol}` +
`\v${linEol}`

const invalidLinux = invalidMixed.replace(winEol, linEol);
const invalidWindows = invalidMixed.replace(linEol, winEol);

[
    ["Linux", invalidLinux],
    ["Windows", invalidWindows],
    ["mixed", invalidMixed],
].forEach(([desc, sampleText]) =>
    test(
        `With ${desc} line endings`,
        (t) => {

            const output = remark().use(linter).processSync(sampleText);

            t.equal(output.messages.length, 3);

            const places = output.messages.map(message => { return {
                start: { line: message.place.start.line, column: message.place.start.column },
                end: { line: message.place.end.line, column: message.place.end.column },
            }});
            t.deepEqual(places[0], { start : {line: 1, column: 48}, end: {line: 1, column: 49 }});
            t.deepEqual(places[1], { start : {line: 2, column: 25}, end: {line: 2, column: 26 }});
            t.deepEqual(places[2], { start : {line: 4, column: 1}, end: {line: 4, column: 2 }});
            t.end();
        }
    )
);
