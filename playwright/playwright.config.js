import { defineConfig } from '@playwright/test';
import * as constants from './helpers/constants';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: constants.BASE_URL,
    fullyParallel: true,
    actionTimeout: 2 * 1000, // Set default action timeout to 2 seconds
    navigationTimeout: 5 * 1000, // Set default navigation timeout to 5 seconds
  },
});
