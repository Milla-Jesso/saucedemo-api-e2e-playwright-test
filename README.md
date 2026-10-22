# SauceDemo API & E2E Test Suite

A TypeScript test automation suite built with [Playwright](https://playwright.dev/), covering both API-level and end-to-end UI testing for [SauceDemo](https://www.saucedemo.com/).

## Overview

This project combines two testing layers in a single suite:

- **API Tests** – validate backend/API behavior directly using a dedicated API client.
- **E2E Tests** – validate real user flows through the browser using the Page Object Model (POM) pattern.

## Tech Stack

- **Playwright** – browser automation and test runner
- **TypeScript** – type-safe test and page object code
- **GitHub Actions** – CI pipeline for automated test runs on push/PR

## Project Structure

```
saucedemo-api-e2e-suite/
├── .github/workflows/
│   └── playwright.yml        # CI pipeline configuration
├── tests/
│   ├── api/
│   │   ├── clients/
│   │   │   └── PostsApiClient.ts   # API client wrapper
│   │   └── Posts.api.spec.ts       # API test specs
│   ├── e2e/
│   │   ├── Checkout.spec.ts        # Checkout flow tests
│   │   └── LoginNegative.spec.ts   # Negative login test scenarios
│   ├── fixtures/
│   │   └── CommonFixtures.ts       # Shared Playwright fixtures
│   └── models/                     # Page Object Models
│       ├── CartPage.ts
│       ├── CheckoutPage.ts
│       ├── LoginPage.ts
│       └── ProductsPage.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── .env
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
npm install
npx playwright install
```

### Environment Variables

Create a `.env` file in the project root with any required configuration (base URLs, credentials, API keys, etc.).

## Running Tests

Run the full suite:

```bash
npx playwright test
```

Run only API tests:

```bash
npx playwright test tests/api
```

Run only E2E tests:

```bash
npx playwright test tests/e2e
```

Run in headed mode:

```bash
npx playwright test --headed
```

View the HTML report after a run:

```bash
npx playwright show-report
```

## Continuous Integration

Tests run automatically via GitHub Actions on push and pull request, using the workflow defined in `.github/workflows/playwright.yml`.

## Scaling CI Across Teams

If six teams each ran their own pipeline, these are the three standards I would enforce department-wide first:

1. **A shared, version-pinned reusable workflow.** Each team calls one central workflow that pins the runner image, Node version and Playwright version, instead of copying YAML, so pipelines don't drift apart and an upgrade happens once instead of six times.
2. **A tagged, required PR gate.** Every repo tags tests (`@smoke`, `@regression`), and a fast `@smoke` run is a required check on pull requests, while full regression runs nightly. This keeps feedback fast and gives the department one shared definition of "safe to merge".
3. **One reporting standard.** Every run merges its shards into a single HTML report, publishes it to a stable link, and records retries so flaky tests stay visible. When a release is blocked, anyone can open any team's results and read them the same way, without asking the team for access.

I would start with these three because they cover consistency, quality gating and visibility, and the other improvements depend on having them in place.

## Design Notes

- **Page Object Model (POM)**: UI interactions are encapsulated in page classes under `tests/models/`, keeping specs focused on test logic rather than selectors.
- **API Client Pattern**: API tests use a dedicated client class (`PostsApiClient.ts`) to isolate request logic from assertions.
- **Fixtures**: Shared setup/teardown logic lives in `tests/fixtures/CommonFixtures.ts` to reduce duplication across specs.

## License

This project is for personal learning and portfolio purposes.