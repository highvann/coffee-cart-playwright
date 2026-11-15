import { Page, Locator, expect } from '@playwright/test';

/**
 * QuickAddDialog encapsulates the browser dialog that opens when right-clicking
 * a coffee cup icon on the Menu page.
 */
export class QuickAddDialog {
    readonly page: Page;
    readonly dialog: Locator;
    readonly messageText: Locator;
    readonly yesButton: Locator;
    readonly noButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.locator('dialog[data-cy="add-to-cart-modal"]');
        this.messageText = this.dialog.locator('p');
        this.yesButton = this.dialog.getByRole('button', { name: 'Yes' });
        this.noButton = this.dialog.getByRole('button', { name: 'No' });
    }

    /**
     * Asserts that the quick-add confirmation dialog is open.
     */
    async expectVisible(drinkName?: string) {
        await expect(this.dialog).toBeVisible();
        if (drinkName) {
            await expect(this.messageText).toContainText(`Add ${drinkName} to the cart?`);
        }
    }

    /**
     * Asserts that the quick-add dialog is closed/hidden.
     */
    async expectHidden() {
        await expect(this.dialog).toBeHidden();
    }

    /**
     * Confirms the addition of the drink to the cart.
     */
    async confirm() {
        await expect(this.yesButton).toBeVisible();
        await this.yesButton.click();
        await this.expectHidden();
    }

    /**
     * Cancels the dialog without adding the drink to the cart.
     */
    async cancel() {
        await expect(this.noButton).toBeVisible();
        await this.noButton.click();
        await this.expectHidden();
    }
}

