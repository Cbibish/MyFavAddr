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
  testPathIgnorePatterns: ['/node_modules/', '/client/e2e/'],
  transformIgnorePatterns: ['node_modules/(?!@faker-js/faker)'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
};