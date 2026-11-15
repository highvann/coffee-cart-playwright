import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Coffee Cart test framework.
 * Supports cross-browser execution, automated retries in CI, and trace capturing.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ],
    use: {
        baseURL: 'https://coffee-cart.app',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'off',
        actionTimeout: 10000,
        navigationTimeout: 15000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
