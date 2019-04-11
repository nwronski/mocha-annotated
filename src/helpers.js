/**
 * Replaces any circular references inside `obj` with '[object Object]'
 *
 * @private
 * @param {Object} obj
 * @return {Object}
 */
function cleanCycles(obj) {
  const cache = [];
  const str = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Instead of going in a circle, we'll set it to null
          return null;
        }
        cache.push(value);
      }

      return value;
    },
  );
  return JSON.parse(str);
}

exports.cleanCycles = cleanCycles;

/**
 * Transform an Error object into a JSON object.
 *
 * @private
 * @param {Error} err
 * @return {Object}
 */
function errorJSON(err) {
  const res = {};
  Object.getOwnPropertyNames(err)
  .forEach((key) => {
    res[key] = err[key];
  }, err);
  return res;
}

exports.errorJSON = errorJSON;

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {AnnotatedTest|Test} test
 * @return {Object}
 */
function clean(test) {
  const result = {
    title: test.title,
    task: test.task,
    feedback: test.feedback,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry(),
  };
  if (test.err != null) {
    result.err = cleanCycles(test.err instanceof Error ? errorJSON(test.err) : test.err);
    if (test.annotated && result.feedback == null) {
      result.feedback = result.err.message;
    }
  }
  return result;
}

exports.clean = clean;
