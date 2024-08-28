module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '.(css|less|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['./tests/setupTest.ts'],
  testMatch: ['**/tests/**/*.test.tsx'],
};
