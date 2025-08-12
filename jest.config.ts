import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverageFrom: ['**/*.(t|j)s'],
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
