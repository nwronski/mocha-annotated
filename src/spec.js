const Base = require('mocha/lib/reporters/base');
const { inherits } = require('mocha/lib/utils');
const ms = require('mocha/lib/ms');

const { color } = Base;

/**
 * Initialize a new `AnnotatedSpec` test reporter.
 *
 * @api public
 * @param {Runner} runner
 */
function AnnotatedSpec(runner) {
  Base.call(this, runner);

  this.indents = 0;
  this.n = 0;

  runner.on('start', () => {
    console.log();
  });

  runner.on('suite', (suite) => {
    this.indents += 1;
    console.log(color('suite', '%s%s'), this.indent(), suite.title);
  });

  runner.on('suite end', () => {
    this.indents -= 1;
    if (this.indents === 1) {
      console.log();
    }
  });

  runner.on('pending', (test) => {
    const fmt = this.indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', (test) => {
    let fmt;
    if (test.speed === 'fast') {
      fmt = this.indent() +
        color('checkmark', `  ${Base.symbols.ok}`) +
        color('pass', ' %s');
      console.log(fmt, test.title);
    } else {
      fmt = this.indent() +
        color('checkmark', `  ${Base.symbols.ok}`) +
        color('pass', ' %s') +
        color(test.speed, ' (%dms)');
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', (test) => {
    this.n += 1;
    console.log(
      this.indent() + color('fail', '  %d) %s'),
      this.n,
      test.title,
    );
  });

  runner.once('end', () => {
    let fmt;

    // passes
    fmt = color('bright pass', ' ') +
      color('green', ' %d passing') +
      color('light', ' (%s)');

    console.log(
      fmt,
      this.stats.passes || 0,
      ms(this.stats.duration),
    );

    // pending
    if (this.stats.pending) {
      fmt = color('pending', ' ') +
        color('pending', ' %d pending');

      console.log(fmt, this.stats.pending);
    }

    // failures
    if (this.stats.failures) {
      fmt = color('fail', '  %d failing');

      console.log(fmt, this.stats.failures);

      Base.list(this.failures);

      console.log();

      // extended info
      this.failures
      .filter((failure) => failure.feedback !== undefined)
      .forEach((failure, i) => {
        const failureFmt = color('bright fail', '  %d) Task %d: %s');
        console.log(failureFmt, i + 1, failure.task, failure.title);
        console.log(failure.feedback.replace(/^/gm, '    '));
        console.log();
      });

      console.log();
    }


    console.log();
  });
}

AnnotatedSpec.prototype.indent = function indent() { return [].fill('  ', 0, this.indents); };

/**
 * Inherit from `Spec.prototype`.
 */
inherits(AnnotatedSpec, Base);

/**
 * Expose `AnnotatedSpec`.
 */

module.exports = AnnotatedSpec;
