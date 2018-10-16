# mocha-annotated
Mocha but with tasks and feedback built into it!

## Install

```
npm install mocha-annotated
```

## Use

```
mocha --reporter mocha-annotated/spec --ui mocha-annotated/ui 'src/**/*.spec.js'
```

_Note: Use the `--bail` flag so that you see at most one feedback message per test run._

### UI

The Mocha ui is `mocha-annotated/ui` and you can add it to your `mocha` options using:

```
--ui mocha-annotated/ui
```

### Reporters

**Annotated spec reporter**

```
--reporter mocha-annotated/spec
```

**Annotated json reporter**

```
--reporter mocha-annotated/json
```

**Annotated json-stream reporter**

```
--reporter mocha-annotated/json-stream
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

describe('Beep#add', () => {
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
      expect(beep.things).to.include('boop');
    },
  );
});
```

At the end of your test output, you will see the feedback for any failing test(s):

**Using the `mocha-annotated/spec` reporter**

```shell
  1) Task 1: put a boop in the beep
      Whoops, we forgot to put a boop in our beep when `fiddlesticks` is _truthy_.
            
      ```typescript
      if (fiddlesticks) {
        beep.add('boop');
      }
      ```
```

**Using the `mocha-annotated/json` reporter**

```json
{
  "stats": {},
  "failures": [
    {
      "title": "put a boop in the beep",
      "fullTitle": "Beep#add put a boop in the beep",
      "duration": 1,
      "currentRetry": 0,
      "err": {
        "message": "expected [] to include 'boop'",
        "stack":"AssertionError: expected [] to include 'boop'\n"
      }
    }
  ],
  "tests": [
    {
      "title": "put a boop in the beep",
      "fullTitle": "Beep#add put a boop in the beep",
      "duration": 1,
      "currentRetry": 0,
      "err": {
        "message": "expected [] to include 'boop'",
        "stack":"AssertionError: expected [] to include 'boop'\n"
      }
    }
  ],
  "passes": []
}
```

**Using the `mocha-annotated/json-stream` reporter**

```json
[  
   "fail",
   {  
      "title": "put a boop in the beep",
      "task": 1,
      "feedback": "Whoops, we forgot to put a boop in our beep when `fiddlesticks` is _truthy_.\n\n```typescript\nif (fiddlesticks) {\n\tbeep.add('boop');\n}\n```",
      "fullTitle": "Beep#add put a boop in the beep",
      "duration": 1,
      "currentRetry": 0,
      "err": {
        "message": "expected [] to include 'boop'",
        "stack":"AssertionError: expected [] to include 'boop'\n"
      }
   }
]
```
