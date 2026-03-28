/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          strict: true,
          esModuleInterop: true,
          moduleResolution: 'node',
        },
      },
    ],
  },
  moduleNameMapper: {
    '^expo-constants$': '<rootDir>/__mocks__/expo-constants.ts',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
