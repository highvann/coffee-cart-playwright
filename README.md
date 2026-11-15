# Coffee Cart Playwright Automation Framework

A production-grade, extensible automated test framework built with **Playwright** and **TypeScript** for [coffee-cart.app](https://coffee-cart.app/). Architected with clean abstractions, modular Page Object Models (POM), custom fixtures, resilient locators, and zero arbitrary waits so that junior and senior engineers can safely maintain and contribute tests.

---

## Architecture Overview

```
coffee-cart-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml         # CI/CD pipeline definition with caching & reporting
├── data/
│   └── testData.ts                # Isolated test data (catalogs, customer profiles, messages)
├── fixtures/
│   └── baseFixtures.ts            # Custom test fixtures with pre-instantiated page objects
├── pages/
│   ├── BasePage.ts                # Shared base page (navigation, header, assertions)
│   ├── MenuPage.ts                # Storefront menu catalog page object
│   ├── CartPage.ts                # Dedicated /cart review page object
│   ├── components/                # Reusable dialog and modal components
│   │   ├── CheckoutModal.ts       # Payment details modal
│   │   ├── PromoModal.ts          # Promotional discount modal (every 3rd item)
│   │   └── QuickAddDialog.ts      # Right-click context confirmation dialog
│   └── index.ts                   # Clean barrel exports
├── tests/
│   ├── coffeeCart.spec.ts         # Core E2E order and cart management flows
│   └── bonusFeatures.spec.ts      # Automated tests for special/bonus features
├── playwright.config.ts           # Playwright test configuration
├── tsconfig.json                  # TypeScript compiler configuration
└── package.json                   # Dependencies and convenience scripts
```

---

## Key Framework Design Principles

### 1. Page Object Model (POM) & Component Composition
- Every page (`MenuPage`, `CartPage`) extends `BasePage` to inherit common layout elements (header cart counter, snackbars, navigation).
- Dialogs and modals (`CheckoutModal`, `PromoModal`, `QuickAddDialog`) are modeled as isolated component objects composed within page classes rather than monolithic mega-pages.
- Prevents code duplication and promotes single-responsibility design.

### 2. Dependency Injection via Custom Fixtures
- Tests never instantiate page objects manually or execute boilerplate setup steps (`new MenuPage(page)`).
- `fixtures/baseFixtures.ts` extends `@playwright/test` to supply pre-configured, auto-navigated page objects:
  ```typescript
  test('My test', async ({ menuPage, cartPage }) => {
      await menuPage.addDrink(DRINKS.espresso.name);
      await menuPage.openCart();
      await cartPage.expectTotal('$10.00');
  });
  ```
- Each test runs in an isolated browser context, eliminating state leakage.

### 3. Zero Arbitrary Sleeps & Resilient Locators
- **Strictly banned:** `page.waitForTimeout()` or `sleep()`.
- Locators prioritize accessible, resilient attributes:
  - User-facing labels: `page.getByLabel()`, `page.getByRole()`
  - Explicit test attributes: `page.locator('[data-test="checkout"]')`
  - Scoped card containers: `page.locator('li', { has: page.locator('[aria-label="Espresso"]') })`
- All assertions rely on Playwright's built-in web-first auto-waiting (`expect(locator).toBeVisible()`, `expect(locator).toHaveText()`).

### 4. Strict Test Data Isolation
- `data/testData.ts` encapsulates all mock customer profiles, drink pricing catalogs, expected translations, and system copy.
- Test specs reference strongly-typed data constants (`DRINKS.espresso.name`, `CUSTOMER_PROFILES.valid`), ensuring zero magic strings in test files.

---

## Test Suites

### 1. Core End-to-End (`tests/coffeeCart.spec.ts`)
- **TC-01:** Full flow: `Add Product -> Handle Promo Popup -> Checkout -> Submit Payment Details -> Verify Success`
- **TC-02:** Single Product Checkout without promo popup
- **TC-03:** Cart view operations (increasing quantity, decreasing quantity, removing items, empty cart assertion)
- **TC-04:** Direct checkout starting from Cart review page

### 2. Bonus Features (`tests/bonusFeatures.spec.ts`)
- **Bonus A:** Double-clicking coffee title translates English drink name into Chinese (`Espresso` -> `特浓咖啡`, `Cappuccino` -> `卡布奇诺`, `Mocha` -> `摩卡`).
- **Bonus B:** Right-clicking the coffee cup icon opens the `<dialog data-cy="add-to-cart-modal">` quick-add dialog, confirming or canceling addition to cart.
- **Bonus C:** Promo coffee pop-up triggers on every 3rd item in the cart (multiples of 3: items 3 and 6), supporting both "Yes, of course!" and "Nah, I'll skip.".

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
npx playwright install chromium
```

### Running Tests
```bash
# Run all tests on default browser (Chromium)
npm run test:chromium

# Run all configured browsers
npm test

# Run tests in headed browser mode
npm run test:headed

# Run tests in interactive UI mode
npm run test:ui

# View HTML test execution report
npm run test:report
```

---

## Continuous Integration (CI)

A GitHub Actions workflow is provided at `.github/workflows/playwright.yml`. It:
1. Runs on every pull request and push to `main` / `master`.
2. Leverages GitHub actions cache for Playwright browser binaries to optimize pipeline execution speed.
3. Automatically executes test suites across headless browsers.
4. Publishes interactive HTML test reports as build artifacts with 14-day retention.

