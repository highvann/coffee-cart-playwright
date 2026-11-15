import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutModal } from './components/CheckoutModal';

/**
 * CartPage models the dedicated shopping cart review view (/cart).
 * Provides operations to adjust item quantities, remove items, and proceed to checkout.
 */
export class CartPage extends BasePage {
    readonly emptyCartMessage: Locator;
    readonly checkoutModal: CheckoutModal;

    constructor(page: Page) {
        super(page);
        this.emptyCartMessage = page.getByText('No coffee, go add some.');
        this.checkoutModal = new CheckoutModal(page);
    }

    /**
     * Resolves the list row corresponding to a specific drink in the cart table.
     */
    getItemRow(drinkName: string): Locator {
        return this.page.locator('li.list-item', {
            has: this.page.getByText(drinkName, { exact: true }),
        });
    }

    /**
     * Clicks the (+) button to increase quantity for a specific drink.
     */
    async increaseItemQuantity(drinkName: string) {
        const button = this.page.getByRole('button', { name: `Add one ${drinkName}` });
        await button.click();
    }

    /**
     * Clicks the (-) button to decrease quantity for a specific drink.
     */
    async decreaseItemQuantity(drinkName: string) {
        const button = this.page.getByRole('button', { name: `Remove one ${drinkName}` });
        await button.click();
    }

    /**
     * Clicks the (x) delete button to remove all units of a drink from the cart.
     */
    async removeItem(drinkName: string) {
        const deleteButton = this.page.getByRole('button', { name: `Remove all ${drinkName}` });
        await deleteButton.click();
    }

    /**
     * Asserts that the empty cart state message is displayed.
     */
    async expectEmptyCart() {
        await expect(this.emptyCartMessage).toBeVisible();
    }

    /**
     * Opens the Checkout payment modal from the Cart page.
     */
    async openCheckoutModal() {
        await this.checkoutButton.click();
        await this.checkoutModal.expectVisible();
    }
}
