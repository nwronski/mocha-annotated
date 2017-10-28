module.exports = {
  extends: [
    '@commitlint/config-angular',
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
        'json-stream',
      ],
    ],
    'scope-empty': [
      2,
      'never',
    ],
  },
};
