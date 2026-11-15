import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutModal } from './components/CheckoutModal';
import { PromoModal } from './components/PromoModal';
import { QuickAddDialog } from './components/QuickAddDialog';
import { CustomerProfile } from '../data/testData';

/**
 * MenuPage models the storefront menu catalog view (https://coffee-cart.app/).
 * Extends BasePage and composes modular components for checkout, promos, and dialogs.
 */
export class MenuPage extends BasePage {
    readonly checkoutModal: CheckoutModal;
    readonly promoModal: PromoModal;
    readonly quickAddDialog: QuickAddDialog;

    constructor(page: Page) {
        super(page);
        this.checkoutModal = new CheckoutModal(page);
        this.promoModal = new PromoModal(page);
        this.quickAddDialog = new QuickAddDialog(page);
    }

    /**
     * Resolves the container <li> card for a specific drink by its unique aria-label.
     * Prevents strict mode locator collisions across similar drink names.
     */
    getDrinkCard(drinkName: string): Locator {
        return this.page.locator('li', {
            has: this.page.locator(`[aria-label="${drinkName}"]`),
        });
    }

    /**
     * Resolves the visual cup/icon for a given drink.
     */
    getDrinkCup(drinkName: string): Locator {
        return this.page.locator(`[aria-label="${drinkName}"]`);
    }

    /**
     * Resolves the heading (h4) for a given drink safely scoped inside its drink card.
     */
    getDrinkHeading(drinkName: string): Locator {
        return this.getDrinkCard(drinkName).locator('h4');
    }

    /**
     * Adds a drink by clicking on its visual coffee cup.
     */
    async addDrink(drinkName: string) {
        const cup = this.getDrinkCup(drinkName);
        await cup.click();
    }

    /**
     * Bonus Feature A: Double-clicks the coffee title to trigger Chinese translation.
     */
    async doubleClickDrinkTitle(drinkName: string) {
        const heading = this.getDrinkHeading(drinkName);
        await heading.dblclick();
    }

    /**
     * Asserts that a drink title contains expected text (e.g. English or Chinese translation).
     */
    async expectDrinkTitle(drinkName: string, expectedText: string) {
        const heading = this.getDrinkHeading(drinkName);
        await expect(heading).toContainText(expectedText);
    }

    /**
     * Bonus Feature B: Right-clicks the coffee cup icon to open the quick-add dialog.
     */
    async rightClickDrinkCup(drinkName: string) {
        const cup = this.getDrinkCup(drinkName);
        await cup.click({ button: 'right' });
        await this.quickAddDialog.expectVisible(drinkName);
    }

    /**
     * Opens the Checkout modal via the checkout total button.
     */
    async openCheckoutModal() {
        await this.checkoutButton.click();
        await this.checkoutModal.expectVisible();
    }

    /**
     * Comprehensive end-to-end user flow:
     * Add Product(s) -> Handle Promo Popup (if applicable) -> Checkout -> Submit Payment Details -> Verify Success.
     */
    async completeOrderFlow(
        drinkNames: string[],
        customer: CustomerProfile,
        promoDecision: 'accept' | 'skip' = 'accept',
        expectedSuccessMessage?: string
    ) {
        // 1. Add all specified products
        for (const drink of drinkNames) {
            await this.addDrink(drink);
            // 2. Handle promo popup if it appears (every 3rd item)
            await this.promoModal.handleIfPresent(promoDecision);
        }

        // 3. Checkout
        await this.openCheckoutModal();

        // 4. Submit Payment Details
        await this.checkoutModal.submitPayment(customer);

        // 5. Verify Success
        if (expectedSuccessMessage) {
            await this.expectSuccessMessage(expectedSuccessMessage);
        }
    }
}
