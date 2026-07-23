import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const config: PlaywrightTestConfig = {
  testDir: './tests',

  timeout: 30000,

  expect: {
    timeout: 10000,
  },

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  maxFailures: 0,

  retries: process.env.CI ? 1 : 0,

  // Let Playwright determine optimal workers.
  // Override from CLI if needed:
  // npx playwright test --workers=10
  workers: Number(process.env.PLAYWRIGHT_WORKERS || 5),
  reporter: process.env.CI
    ? [
      ['github'],
      ['blob'],
    ]
    : [
      ['html', { open: 'on-failure' }],
    ],

  use: {
    baseURL: process.env.E2E_SAUCEDEMO_BASE_URL,
    testIdAttribute: 'data-test',
    actionTimeout: 10000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'ipad-webkit',
      testMatch: 'tests/e2e/**/*.spec.ts',
      use: {
        ...devices['iPad Pro 11'],
        viewport: {
          width: 834,
          height: 1188,
        },
      },
    },

    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        baseURL: process.env.E2E_JSONPLACEHOLDER_BASE_URL,
      },
    },
  ],

  outputDir: 'test-results',
};

export default config;