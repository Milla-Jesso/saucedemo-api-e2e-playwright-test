import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import * as dotenv from 'dotenv';

dotenv.config();
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. saucedemo is a lightweight public
   * demo with no heavy backend calls, so this stays tight rather than the
   * 30-minute ceiling I'd use on a slow enterprise app. */
  timeout: 30000,
  expect: {

    timeout: 10000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  maxFailures: 0,
  retries: process.env["CI"] ? 1 : 0,
  workers: process.env["CI"] ? 1 : undefined,
  reporter: process.env["CI"] ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: process.env["E2E_SAUCEDEMO_BASE_URL"],
    testIdAttribute: 'data-test',

    /* Maximum time each action such as `click()` can take. */
    actionTimeout: 10000,

    screenshot: "only-on-failure",
    trace: process.env["CI"] ? "on-first-retry" : "retain-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "ipad-webkit",
      testMatch: "tests/e2e/**/*.spec.ts",
      use: {
        ...devices["iPad Pro 11"],
        viewport: { width: 834, height: 1188 },
      },
    },
    {
      name: "api",
      testMatch: "tests/api/**/*.spec.ts",
      use: {
        baseURL: process.env["E2E_JSONPLACEHOLDER_BASE_URL"]
      },
    },
  ],
  outputDir: 'playwright-report/',
};

export default config;