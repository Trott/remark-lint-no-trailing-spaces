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
`The third line is corrrect.${winEol}` +
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
            output.messages.forEach(m => {
                t.equal(typeof m.line, 'number');
                t.notEqual(m.line,3);
            })
            t.end();
        }
    )
);
