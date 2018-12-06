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
  if (test.err != null) {
    result.err = errorJSON(test.err);
    if (result.feedback == null) {
      result.feedback = result.err.message;
    }
  }
  return result;
}

exports.clean = clean;
