export default {
  languageOptions: {
    globals: {
      Set: 'readonly',
      console: 'readonly',
      process: 'readonly',
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
  },
};
