import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage serves as the foundation for all Page Objects in the application.
 * It encapsulates shared layout locators (header navigation, snackbars, checkout button)
 * and resilient assertion helpers that junior engineers can leverage across tests.
 */
export abstract class BasePage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly menuLink: Locator;
    readonly checkoutButton: Locator;
    readonly snackbar: Locator;

    constructor(page: Page) {
        this.page = page;
        // Navigation & Global Header Elements
        this.cartLink = page.locator('a[aria-label="Cart page"]');
        this.menuLink = page.locator('a[aria-label="Menu page"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.snackbar = page.locator('div.snackbar');
    }

    /**
     * Navigates to a relative or absolute URL using configured baseURL.
     */
    async goto(path: string = '/') {
        await this.page.goto(path);
    }

    /**
     * Extracts current cart item count from header text "cart (X)".
     */
    async getCartCount(): Promise<number> {
        const text = await this.cartLink.innerText();
        const match = text.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    /**
     * Asserts that the header cart count equals the expected amount.
     * Uses Playwright auto-waiting assertions for maximum flakiness resistance.
     */
    async expectCartCount(expectedCount: number) {
        await expect(this.cartLink).toHaveText(`cart (${expectedCount})`);
    }

    /**
     * Asserts the total text displayed on the checkout button.
     */
    async expectTotal(expectedPriceFormatted: string) {
        await expect(this.checkoutButton).toHaveText(`Total: ${expectedPriceFormatted}`);
    }

    /**
     * Clicks the cart link in the header to navigate to the Cart page.
     */
    async openCart() {
        await this.cartLink.click();
        await this.page.waitForURL('**/cart');
    }

    /**
     * Clicks the menu link in the header to navigate to the Menu catalog.
     */
    async openMenu() {
        await this.menuLink.click();
        await this.page.waitForURL('**/');
    }

    /**
     * Verifies that the success snackbar notification appears with expected text.
     */
    async expectSuccessMessage(message: string) {
        await expect(this.snackbar).toBeVisible();
        await expect(this.snackbar).toHaveClass(/success/);
        await expect(this.snackbar).toContainText(message);
    }
}
