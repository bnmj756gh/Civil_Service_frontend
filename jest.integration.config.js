module.exports = {
  roots: ['<rootDir>/src/test/integration'],
  testRegex: '(/src/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testTimeout: 30000, // Longer timeout for integration tests
  setupFilesAfterEnv: ['<rootDir>/src/test/integration/setup.ts'],
};