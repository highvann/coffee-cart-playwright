import { test, expect } from '../fixtures/baseFixtures';
import { DRINKS, UI_MESSAGES } from '../data/testData';

test.describe('Coffee Cart - Bonus Features Verification', () => {

    test('Bonus A: Double-click coffee title translates English name to Chinese', async ({
        menuPage,
    }) => {
        // Test translation for Espresso
        await menuPage.expectDrinkTitle(DRINKS.espresso.name, DRINKS.espresso.name);
        await menuPage.doubleClickDrinkTitle(DRINKS.espresso.name);
        await menuPage.expectDrinkTitle(DRINKS.espresso.name, DRINKS.espresso.chineseName);

        // Test translation for Cappuccino
        await menuPage.expectDrinkTitle(DRINKS.cappuccino.name, DRINKS.cappuccino.name);
        await menuPage.doubleClickDrinkTitle(DRINKS.cappuccino.name);
        await menuPage.expectDrinkTitle(DRINKS.cappuccino.name, DRINKS.cappuccino.chineseName);

        // Test translation for Mocha
        await menuPage.expectDrinkTitle(DRINKS.mocha.name, DRINKS.mocha.name);
        await menuPage.doubleClickDrinkTitle(DRINKS.mocha.name);
        await menuPage.expectDrinkTitle(DRINKS.mocha.name, DRINKS.mocha.chineseName);
    });

    test('Bonus B: Right-click coffee icon opens quick-add dialog and adds item upon confirmation', async ({
        menuPage,
        quickAddDialog,
    }) => {
        // Verify cart is initially empty
        await menuPage.expectCartCount(0);

        // Right-click Espresso icon -> opens native dialog
        await menuPage.rightClickDrinkCup(DRINKS.espresso.name);
        await quickAddDialog.expectVisible(DRINKS.espresso.name);

        // Confirm addition via "Yes" button
        await quickAddDialog.confirm();

        // Verify cart count incremented
        await menuPage.expectCartCount(1);
        await menuPage.expectTotal('$10.00');
    });

    test('Bonus B (Cancellation): Right-click dialog dismisses without adding when clicking No', async ({
        menuPage,
        quickAddDialog,
    }) => {
        await menuPage.expectCartCount(0);

        // Right-click Cafe Latte icon
        await menuPage.rightClickDrinkCup(DRINKS.cafeLatte.name);
        await quickAddDialog.expectVisible(DRINKS.cafeLatte.name);

        // Cancel dialog via "No" button
        await quickAddDialog.cancel();

        // Verify cart remains at 0
        await menuPage.expectCartCount(0);
        await menuPage.expectTotal('$0.00');
    });

    test('Bonus C: Promo coffee pop-up triggers reliably on every 3rd item in cart (multiples of 3: 3 and 6)', async ({
        menuPage,
        promoModal,
    }) => {
        // --- 1st cycle: Adding drinks until reaching 3 items in cart ---
        await menuPage.addDrink(DRINKS.espresso.name);
        await menuPage.expectCartCount(1);
        await promoModal.expectHidden();

        await menuPage.addDrink(DRINKS.cappuccino.name);
        await menuPage.expectCartCount(2);
        await promoModal.expectHidden();

        // Adding 3rd item -> triggers promo popup (count % 3 === 0)
        await menuPage.addDrink(DRINKS.mocha.name);
        await promoModal.expectVisible();
        await expect(promoModal.promoHeader).toContainText(UI_MESSAGES.promoHeaderSnippet);

        // Accept the promo coffee offer -> adds 1 promo coffee to cart (cart now has 4 items)
        await promoModal.accept();
        await menuPage.expectCartCount(4);
        await promoModal.expectHidden();

        // --- 2nd cycle: Add 5th item (no promo) and 6th item (triggers promo!) ---
        await menuPage.addDrink(DRINKS.flatWhite.name);
        await menuPage.expectCartCount(5);
        await promoModal.expectHidden();

        // Adding 6th item to cart -> triggers promo popup again (6 % 3 === 0)
        await menuPage.addDrink(DRINKS.americano.name);
        await promoModal.expectVisible();

        // This time, choose to skip the promo offer
        await promoModal.skip();
        await promoModal.expectHidden();

        // Cart remains at 6 items
        await menuPage.expectCartCount(6);

        // Adding 7th item does NOT trigger promo
        await menuPage.addDrink(DRINKS.cafeLatte.name);
        await menuPage.expectCartCount(7);
        await promoModal.expectHidden();
    });
});
