module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:storybook/recommended',
    //'next/core-web-vitals',
    // 'plugin:react/jsx-runtime',
    // 'plugin:react/recommended',
    'prettier',
  ],
  // settings: {
  //   react: {
  //     version: 'detect', // Specify the React version here
  //   },
  // },
  plugins: [
    // ...other plugins
    'import', // Make sure 'import' is listed as a plugin
  ],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/*/*'],
      },
    ],
    'import/no-cycle': 'error',
    'linebreak-style': ['error', 'unix'],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      files: ['*.test.{ts,tsx}', 'src/testing/**/*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
};
