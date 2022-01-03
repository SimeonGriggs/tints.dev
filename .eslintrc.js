module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
  settings: {
    react: {version: '16.9.0'},
  },
  extends: [
    'sanity',
    'sanity/react',
    'sanity/import',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-extraneous-dependencies': 'off', // because of parts
    'import/no-unresolved': ['error', {ignore: ['.*:.*']}], // because of parts
    'prettier/prettier': [
      'error',
      {
        semi: false,
        printWidth: 100,
        bracketSpacing: false,
        singleQuote: true,
      },
    ],
    'sort-imports': 'off', // prefer import/order
    'react/jsx-no-bind': [
      1,
      {
        ignoreDOMComponents: true,
      },
    ],
    'react/forbid-prop-types': [0],
  },
  plugins: ['prettier', 'react'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-no-bind': 'off',

        // No more prop-types
        'react/prop-types': 'off',
        'react/require-default-props': 'off',

        // Struggles with ~ paths
        'import/no-unresolved': 'off',
        'import/extensions': 'off',

        // Rule from Studio
        'no-process-env': 'off',
      },
    },
  ],
}
