const { createDefaultPreset } = require('ts-jest');
const tsJestPreset = createDefaultPreset({
  tsconfig: 'tsconfig.test.json',
});

module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestPreset.transform,
  },
  testMatch: ['**/tests/**/*.test.ts', '**/*.spec.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!@faker-js/faker)',
  ],
};
