import { test, expect } from '../fixtures/baseFixtures';
import { DRINKS, CUSTOMER_PROFILES, UI_MESSAGES } from '../data/testData';

test.describe('Coffee Cart - Core E2E Order & Cart Flows', () => {

    test('TC-01: End-to-End Flow: Add Product -> Handle Promo Popup -> Checkout -> Submit Payment -> Verify Success', async ({
        menuPage,
    }) => {
        // Step 1: Add products to cart (3 items to trigger the promo pop-up condition)
        await menuPage.addDrink(DRINKS.espresso.name);
        await menuPage.addDrink(DRINKS.cappuccino.name);
        await menuPage.addDrink(DRINKS.mocha.name);

        // Step 2: Handle Promo Popup (accept discounted promo coffee)
        await menuPage.promoModal.expectVisible();
        await menuPage.promoModal.accept();

        // Verify cart count includes 3 initial drinks + 1 accepted promo coffee
        await menuPage.expectCartCount(4);

        // Step 3: Open Checkout Modal
        await menuPage.openCheckoutModal();

        // Step 4: Submit Payment Details using isolated customer profile
        await menuPage.checkoutModal.submitPayment(CUSTOMER_PROFILES.valid);

        // Step 5: Verify Order Success
        await menuPage.expectSuccessMessage(UI_MESSAGES.checkoutSuccess);

        // Verify cart is reset to 0 after successful checkout
        await menuPage.expectCartCount(0);
    });

    test('TC-02: Single Product Checkout without Promo: Add Product -> Checkout -> Submit Payment -> Verify Success', async ({
        menuPage,
    }) => {
        // Step 1: Add a single product (no promo triggered)
        await menuPage.addDrink(DRINKS.espresso.name);
        await menuPage.expectCartCount(1);
        await menuPage.expectTotal('$10.00');

        // Step 2: Handle Promo Popup if applicable (safely bypasses if not present)
        await menuPage.promoModal.handleIfPresent('skip');

        // Step 3 & 4: Open checkout and complete payment
        await menuPage.openCheckoutModal();
        await menuPage.checkoutModal.submitPayment(CUSTOMER_PROFILES.validAlternative);

        // Step 5: Verify order completion
        await menuPage.expectSuccessMessage(UI_MESSAGES.checkoutSuccess);
        await menuPage.expectCartCount(0);
    });

    test('TC-03: Cart view management: Adjust quantities and remove items', async ({
        menuPage,
        cartPage,
    }) => {
        // Add item from menu and navigate to cart
        await menuPage.addDrink(DRINKS.flatWhite.name);
        await menuPage.openCart();

        // Verify initial line item and total ($18.00)
        await cartPage.expectTotal('$18.00');

        // Increase quantity (+1) -> Total becomes $36.00
        await cartPage.increaseItemQuantity(DRINKS.flatWhite.name);
        await cartPage.expectTotal('$36.00');
        await cartPage.expectCartCount(2);

        // Decrease quantity (-1) -> Total returns to $18.00
        await cartPage.decreaseItemQuantity(DRINKS.flatWhite.name);
        await cartPage.expectTotal('$18.00');
        await cartPage.expectCartCount(1);

        // Remove item completely -> Cart empty state
        await cartPage.removeItem(DRINKS.flatWhite.name);
        await cartPage.expectEmptyCart();
        await cartPage.expectCartCount(0);
    });

    test('TC-04: Checkout directly from Cart review page', async ({
        menuPage,
        cartPage,
    }) => {
        // Add 2 drinks from menu
        await menuPage.addDrink(DRINKS.americano.name);
        await menuPage.addDrink(DRINKS.cafeLatte.name);
        await menuPage.openCart();

        // Total: Americano ($7) + Cafe Latte ($16) = $23.00
        await cartPage.expectTotal('$23.00');

        // Initiate and complete checkout directly from Cart page
        await cartPage.openCheckoutModal();
        await cartPage.checkoutModal.submitPayment(CUSTOMER_PROFILES.valid);

        // Assert success notification and cleared cart
        await cartPage.expectSuccessMessage(UI_MESSAGES.checkoutSuccess);
        await cartPage.expectCartCount(0);
    });
});
