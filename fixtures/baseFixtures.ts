import { test as base } from '@playwright/test';
import {
    MenuPage,
    CartPage,
    CheckoutModal,
    PromoModal,
    QuickAddDialog,
} from '../pages';

/**
 * Custom fixture types extending Playwright's default test context.
 * Enables zero-boilerplate test authoring for engineers.
 */
export type FrameworkFixtures = {
    menuPage: MenuPage;
    cartPage: CartPage;
    checkoutModal: CheckoutModal;
    promoModal: PromoModal;
    quickAddDialog: QuickAddDialog;
};

/**
 * Extended Playwright test instance with pre-configured Page Objects
 * and managed navigation lifecycle.
 */
export const test = base.extend<FrameworkFixtures>({
    menuPage: async ({ page }, use) => {
        const menuPage = new MenuPage(page);
        await menuPage.goto('/');
        await use(menuPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    checkoutModal: async ({ page }, use) => {
        const checkoutModal = new CheckoutModal(page);
        await use(checkoutModal);
    },

    promoModal: async ({ page }, use) => {
        const promoModal = new PromoModal(page);
        await use(promoModal);
    },

    quickAddDialog: async ({ page }, use) => {
        const quickAddDialog = new QuickAddDialog(page);
        await use(quickAddDialog);
    },
});

export { expect } from '@playwright/test';
