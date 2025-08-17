module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: { browser: true, es2021: true, node: true },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'no-console': 'error'
  }
};
