export default {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        target: 'ES2018',
      },
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/'],
};
