module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '.(css|less|scss)$': 'identity-obj-proxy',
    '../assets/no_data.png': '<rootDir>/tests/mocks/fileMock.js',
  },
  setupFilesAfterEnv: ['./tests/setupTest.ts'],
  testMatch: ['**/tests/**/*.test.tsx'],
};
