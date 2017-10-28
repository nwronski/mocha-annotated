# mocha-annotated
Mocha but with tasks and feedback built into it!

## Install

```
npm install nwronski/mocha-annotated
```

## Use

```
mocha --reporter mocha-annotated/spec --require mocha-annotated/ui --ui mocha-annotated 'src/**/^.spec.js'
```

## Profit

Use `it.annotated(title, taskNumber, feedback, fn)` in place of `it(title, fn)` to associate a task number and 
some descriptive feedback (preferably in markdown) with each test case.

Use `strip_heredoc` to format multi-line string templates by stripping leading whitespace, preserving newlines, and 
preserving indentation level. You do not need to import `strip_heredoc`, it is a part of the mocha-annotated UI.

For bonus fun, try using `it.annotated.only()`, `xit.annotated()`, and/or `it.annotated.skip()` just like you 
would with the normal `it()` blocks in your testing code!

```javascript
import { expect } from 'chai';

describe('refactoring_to_let', () => {
  it.annotated(
    // Test title
    'put a boop in the beep',
    // [Optional]: Test task number (1-based index)
    1,
    // The feedback to display when this specific test fails
    strip_heredoc`
      Whoops, we forgot to put a boop in our beep when \`fiddlesticks\` is _truthy_.
            
      \`\`\`typescript
      if (fiddlesticks) {
        beep.add('boop');
      }
      \`\`\`
    `,
    // The test function containing the expectations/assertions
    () => {
      expect(beep.add).to.be.calledWith('boop');
    },
  );
});
```
