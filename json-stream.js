const Base = require('mocha/lib/reporters/base');

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {AnnotatedTest|Test} test
 * @return {Object}
 */
function clean(test) {
  return {
    title: test.title,
    task: test.task,
    feedback: test.feedback,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
  };
}

/**
 * Initialize a new `AnnotatedList` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function AnnotatedList(runner) {
  Base.call(this, runner);

  this.total = runner.total;

  runner.on('start', () => {
    console.log(JSON.stringify([ 'start', { total: this.total } ]));
  });

  runner.on('pass', (test) => {
    console.log(JSON.stringify([ 'pass', clean(test) ]));
  });

  runner.on('fail', (test, err) => {
    const result = {
      ...clean(test),
      err: err.message,
      stack: err.stack !== undefined ? err.stack : null,
    };
    console.log(JSON.stringify([ 'fail', result ]));
  });

  runner.on('end', () => {
    process.stdout.write(JSON.stringify([ 'end', this.stats ]));
  });
}

/**
 * Expose `AnnotatedList`.
 */
module.exports = AnnotatedList;
