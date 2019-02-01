const Base = require('mocha/lib/reporters/base');
const { clean } = require('./helpers');

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
    // eslint-disable-next-line no-param-reassign
    test.err = test.err !== undefined ? test.err : err;

    const result = clean(test);
    console.log(JSON.stringify([ 'fail', result ]));
  });

  runner.once('end', () => {
    process.stdout.write(JSON.stringify([ 'end', this.stats ]));
  });
}

/**
 * Expose `AnnotatedList`.
 */
module.exports = AnnotatedList;
