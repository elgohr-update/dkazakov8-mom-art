// eslint-disable-next-line strict
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: ['./_eslint/rules.js', 'prettier'],
  plugins: ['react', 'prettier', 'import', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: true,
        tabWidth: 2,
        proseWrap: 'never',
        printWidth: 100,
        arrowParens: 'avoid',
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        jsxBracketSameLine: false,
      },
    ],
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      // Allows decorators before 'export' keyword
      legacyDecorators: true,
      modules: true,
    },
  },
  globals: {
    Component: true,
    IS_CLIENT: true,
    SENTRY_URL: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
