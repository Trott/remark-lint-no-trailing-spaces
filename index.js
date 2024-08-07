'use strict';

import { lintRule } from 'unified-lint-rule'
import { location } from 'vfile-location'

const rule = lintRule('remark-lint:no-trailing-spaces', noTrailingSpaces)
export default rule

/**
 * Lines that are just space characters are not present in
 * the AST, which is why we loop through lines manually.
 */

function noTrailingSpaces(ast, file) {
  const myLocation = location(file);
  const lines = file.toString().split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const lineIndex = i + 1;
    const match = /\s+$/.exec(currentLine);
    if (match) {
      const startOffset = myLocation.toOffset({ line: lineIndex, column: match.index+1 });
      const endOffset = myLocation.toOffset({ line: lineIndex, column: currentLine.length+1 });
      file.message('Remove trailing whitespace', {
        start: myLocation.toPoint(startOffset),
        end: myLocation.toPoint(endOffset),
      });
    }
  }
}
