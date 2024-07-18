'use strict';

import { lintRule } from 'unified-lint-rule'

const rule = lintRule('remark-lint:no-trailing-spaces', noTrailingSpaces)
export default rule

/**
 * Lines that are just space characters are not present in
 * the AST, which is why we loop through lines manually.
 */

function noTrailingSpaces(ast, file) {
  const lines = file.toString().split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const lineIndex = i + 1;
    if (/\s$/.test(currentLine)) {
      file.message('Remove trailing whitespace', {
        start: { line: lineIndex, column: currentLine.length + 1 },
        end: { line: lineIndex }
      });
    }
  }
}
