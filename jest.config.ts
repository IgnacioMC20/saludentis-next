import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  collectCoverageFrom: [
    'src/components/*.tsx',
    'src/components/*/*.tsx',
    '!**/node_modules/**',
    '!**/src/test-utils/**',
    '!**/src/index.tsx'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/components/Odontogram/'
  ],
  coverageThreshold: {
    'global': {
      'statements': 70,
      'branches': 70,
      'functions': 50,
      'lines': 50
    }
  }
}

export default createJestConfig(config)