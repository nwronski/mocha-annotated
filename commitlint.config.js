module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        // Global scopes
        '*',
        'release',

        // Feature scopes
        'ui',
        'spec',
        'json',
        'json-stream',
      ],
    ],
    'scope-empty': [
      2,
      'never',
    ],
  },
};
