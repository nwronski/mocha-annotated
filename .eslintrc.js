module.exports = {
  extends: 'nwronski-rules',
  env: {
    mocha: true,
    node: true,
    protractor: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
  },
};
