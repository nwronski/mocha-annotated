/**
 * Transform `error` into a JSON object.
 *
 * @api private
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
  if (typeof test.err !== 'undefined') {
    result.err = errorJSON(test.err);
  }
  return result;
}

exports.clean = clean;
