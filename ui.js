const Mocha = require('mocha');
const Common = require('mocha/lib/interfaces/common');
const { inherits } = require('mocha/lib/utils');

/* eslint-disable no-param-reassign, no-multi-assign */

function AnnotatedTest(title, task, feedback, fn) {
  if (typeof task !== 'number') {
    // new AnnotatedTest(title, feedback, fn)
    task = 1;
    fn = feedback;
    feedback = task;
  }
  Mocha.Test.call(this, title, fn);
  this.pending = !fn;
  this.type = 'test';
  this.task = task;
  this.feedback = feedback;
}

/**
 * Inherit from `Test.prototype`.
 */
inherits(AnnotatedTest, Mocha.Test);

AnnotatedTest.prototype.clone = function clone() {
  const test = new AnnotatedTest(this.title, this.task, this.feedback, this.fn);
  test.timeout(this.timeout());
  test.slow(this.slow());
  test.enableTimeouts(this.enableTimeouts());
  test.retries(this.retries());
  test.currentRetry(this.currentRetry());
  test.globals(this.globals());
  test.parent = this.parent;
  test.file = this.file;
  test.ctx = this.ctx;
  return test;
};

Mocha.AnnotatedTest = AnnotatedTest;

/**
 * Annotated BDD-style interface:
 * @example How to use
 *  describe('Array', function() {
 *    describe('#indexOf()', function() {
 *      // With a task number
 *      it.annotated(
 *        'should return -1 when not present',
 *        1,
 *        strip_heredoc`
 *          Whoops, it looks like we forgot to return -1 from our when the
 *          item is not found in the array.
 *        `,
 *        () => {
 *          expect(arr.indexOf(11)).to.equal(-1);
 *        },
 *      );
 *
 *      // Without a task number
 *      it.annotated(
 *        'should return item index when present',
 *        strip_heredoc`
 *          Uh oh, when the item is in the array, we should return the item's index.
 *        `,
 *        () => {
 *          expect(arr.indexOf(1)).to.equal(0);
 *        },
 *      );
 *    });
 *  });
 *
 * @param {Suite} suite Root suite.
 */
Mocha.interfaces['mocha-annotated'] = function campusBDD(suite) {
  const suites = [ suite ];

  suite.on('pre-require', (context, file, mocha) => {
    const common = Common(suites, context, mocha);

    context.before = common.before;
    context.after = common.after;
    context.beforeEach = common.beforeEach;
    context.afterEach = common.afterEach;
    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */
    context.describe = context.context = (title, fn) => common.suite.create({
      title,
      file,
      fn,
    });

    /**
     * Pending describe.
     */
    context.xdescribe = context.xcontext = context.describe.skip = (title, fn) => common.suite.skip({
      title,
      file,
      fn,
    });

    /**
     * Exclusive suite.
     */
    context.describe.only = (title, fn) => common.suite.only({
      title,
      file,
      fn,
    });

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */
    context.it = context.specify = (title, fn) => {
      const current = suites[0];
      if (current.isPending()) {
        fn = null;
      }
      const test = new Mocha.Test(title, fn);
      test.file = file;
      current.addTest(test);
      return test;
    };

    context.it.annotated = (title, task, feedback, fn) => {
      const current = suites[0];
      if (current.isPending()) {
        fn = null;
      }
      const test = new Mocha.AnnotatedTest(title, task, feedback, fn);
      test.file = file;
      current.addTest(test);
      return test;
    };


    /**
     * Exclusive test-case.
     */
    context.it.only = (title, fn) => common.test.only(mocha, context.it(title, fn));

    context.it.annotated.only = (title, task, feedback, fn) => {
      const test = context.it.annotated(title, task, feedback, fn);
      return common.test.only(mocha, test);
    };

    /**
     * Pending test case.
     */
    context.xit = context.xit.annotated = context.xspecify = context.it.skip = context.it.annotated.skip = (title) => {
      context.it(title);
    };

    /**
     * Number of attempts to retry.
     */
    context.it.retries = context.it.annotated.retries = (n) => {
      context.retries(n);
    };

    /**
     * Strip the leading whitespace, preserve newlines, and preserve indentation level
     */
    context.strip_heredoc = (str, ...substitutions) => {
      let result = str
      .reduce(
        (prev, cur, i) => prev + cur + (substitutions[i] !== undefined ? substitutions[i] : ''),
        '',
      );
      const indents = result
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const x = line.match(/^([ \t]+)/);
        return x !== null ? x[1].length : 0;
      });
      const indent = Math.min(...indents);
      if (indent !== 0) {
        result = result.replace(new RegExp(String.raw`^[ \t]{1,${indent}}`, 'mg'), '');
      }
      return result.trim();
    };
  });
};

module.exports = Mocha.interfaces.campus;

/* eslint-enable no-param-reassign, no-multi-assign */
