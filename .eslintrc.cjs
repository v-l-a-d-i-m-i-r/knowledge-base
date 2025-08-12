module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'import',
    'unused-imports',
    '@typescript-eslint',
    'jest',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier', // should be last
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto'
      },
      {
        'usePrettierrc': true
      },
    ],
    // 'operator-linebreak': ['error', 'none'],
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 120 }],
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'no-continue': 0,
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Built-in imports (come from NodeJS native) go first
          'external', // <- External imports
          'internal', // <- Absolute imports
          ['sibling', 'parent'], // <- Relative imports, the sibling and parent types they can be mingled together
          'index', // <- index imports
          'unknown', // <- unknown
        ],
        'newlines-between': 'always',
        alphabetize: {
          /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
          order: 'asc',
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      {
        enforce: [
          { blankLine: 'never', prev: 'field', next: 'field' },
          { blankLine: 'always', prev: '*', next: 'method' },
        ],
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable'],
        format: null,
        filter: {
          regex: '^(__dirname|__filename)$',
          match: true,
        },
        leadingUnderscore: 'allow',
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        'allow': [
          '__dirname',
          '__filename',
        ],
      }
    ],
    'prefer-destructuring': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ObjectPattern:not(:has(RestElement))',
        message: 'Object destructuring is not allowed. Use direct property access instead (e.g., obj.prop instead of const { prop } = obj). Rest patterns are allowed (e.g., const { ...rest } = obj)',
      },
      {
        selector: 'ArrayPattern:not(:has(RestElement))',
        message: 'Array destructuring is not allowed. Use direct array access instead (e.g., arr[0] instead of const [first] = arr). Rest patterns are allowed (e.g., const [...rest] = arr)',
      },
    ],
  },
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
}
