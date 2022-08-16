module.exports = {
  collectCoverage: false,
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
