import { Page, Locator, expect } from '@playwright/test';

/**
 * PromoModal encapsulates the promotional coffee offer dialog
 * that is triggered on every 3rd item added to the cart (3, 6, 9, etc.).
 */
export class PromoModal {
    readonly page: Page;
    readonly promoContainer: Locator;
    readonly promoHeader: Locator;
    readonly acceptButton: Locator;
    readonly skipButton: Locator;
    readonly discountedCup: Locator;

    constructor(page: Page) {
        this.page = page;
        this.promoContainer = page.locator('div.promo');
        this.promoHeader = page.locator('div.promo > span');
        this.acceptButton = page.getByRole('button', { name: 'Yes, of course!' });
        this.skipButton = page.getByRole('button', { name: "Nah, I'll skip." });
        this.discountedCup = page.locator('[aria-label^="(Discounted)"]');
    }

    /**
     * Checks if the promo popup is currently visible.
     */
    async isVisible(): Promise<boolean> {
        return await this.promoContainer.isVisible();
    }

    /**
     * Asserts that the promo offer banner is displayed.
     */
    async expectVisible() {
        await expect(this.promoContainer).toBeVisible();
        await expect(this.acceptButton).toBeVisible();
        await expect(this.skipButton).toBeVisible();
    }

    /**
     * Asserts that the promo offer banner has closed/disappeared.
     */
    async expectHidden() {
        await expect(this.promoContainer).toBeHidden();
    }

    /**
     * Accepts the promotional discounted coffee.
     */
    async accept() {
        await this.expectVisible();
        await this.acceptButton.click();
        await this.expectHidden();
    }

    /**
     * Skips / dismisses the promotional discounted coffee.
     */
    async skip() {
        await this.expectVisible();
        await this.skipButton.click();
        await this.expectHidden();
    }

    /**
     * Resilient conditional handler:
     * Handles the promo pop-up if present without causing flakiness or timeout delays.
     */
    async handleIfPresent(decision: 'accept' | 'skip' = 'accept') {
        if (await this.promoContainer.isVisible()) {
            if (decision === 'accept') {
                await this.accept();
            } else {
                await this.skip();
            }
        }
    }
}

