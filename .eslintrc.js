module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
  },
  // Disable all ESLint warnings during build
  ignorePatterns: ['build/', 'node_modules/'],
};

