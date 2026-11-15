import { Page, Locator, expect } from '@playwright/test';
import { CustomerProfile } from '../../data/testData';

/**
 * CheckoutModal encapsulates the Payment details dialog that appears
 * upon clicking the Checkout button from either the Menu or Cart views.
 */
export class CheckoutModal {
    readonly page: Page;
    readonly modalContainer: Locator;
    readonly title: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly promotionCheckbox: Locator;
    readonly submitButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modalContainer = page.locator('div.modal-content');
        this.title = page.getByRole('heading', { name: 'Payment details' });
        this.nameInput = page.getByLabel('Name');
        this.emailInput = page.getByLabel('Email');
        this.promotionCheckbox = page.getByLabel('Promotion checkbox');
        this.submitButton = page.locator('#submit-payment');
        this.closeButton = page.locator('button.close');
    }

    /**
     * Checks if the checkout modal is currently visible on screen.
     */
    async isVisible(): Promise<boolean> {
        return await this.modalContainer.isVisible();
    }

    /**
     * Asserts that the checkout modal is open and visible.
     */
    async expectVisible() {
        await expect(this.modalContainer).toBeVisible();
        await expect(this.title).toBeVisible();
    }

    /**
     * Asserts that the checkout modal has closed/hidden.
     */
    async expectHidden() {
        await expect(this.modalContainer).toBeHidden();
    }

    /**
     * Fills in customer payment and contact details.
     */
    async fillPaymentDetails(customer: CustomerProfile) {
        await this.expectVisible();
        await this.nameInput.fill(customer.name);
        await this.emailInput.fill(customer.email);

        if (customer.subscribePromo) {
            await this.promotionCheckbox.check();
        } else {
            await this.promotionCheckbox.uncheck();
        }
    }

    /**
     * Submits the payment form.
     */
    async submit() {
        await this.submitButton.click();
    }

    /**
     * Helper to fill details and submit payment in one consolidated action.
     */
    async submitPayment(customer: CustomerProfile) {
        await this.fillPaymentDetails(customer);
        await this.submit();
    }

    /**
     * Dismisses the modal using the close (x) button.
     */
    async close() {
        await this.closeButton.click();
        await this.expectHidden();
    }
}

