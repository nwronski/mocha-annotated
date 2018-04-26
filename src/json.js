const Base = require('mocha/lib/reporters/base');
const { clean } = require('./helpers');

/**
 * Initialize a new `JSON` reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function AnnotatedJSONReporter(runner) {
  Base.call(this, runner);

  this.tests = [];
  this.pending = [];
  this.failures = [];
  this.passes = [];

  runner.on('test end', (test) => {
    this.tests.push(test);
  });

  runner.on('pass', (test) => {
    this.passes.push(test);
  });

  runner.on('fail', (test, err) => {
    // eslint-disable-next-line no-param-reassign
    test.err = test.err !== undefined ? test.err : err;

    this.failures.push(test);
  });

  runner.on('pending', (test) => {
    this.pending.push(test);
  });

  runner.on('end', () => {
    const obj = {
      stats: this.stats,
      tests: this.tests.map(clean),
      pending: this.pending.map(clean),
      failures: this.failures.map(clean),
      passes: this.passes.map(clean),
    };

    // eslint-disable-next-line no-param-reassign
    runner.testResults = obj;

    process.stdout.write(JSON.stringify(obj, null, 2));
  });
}

/**
 * Expose `AnnotatedJSONReporter`.
 */
module.exports = AnnotatedJSONReporter;
