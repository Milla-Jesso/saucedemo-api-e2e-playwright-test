import { test } from "../fixtures/CommonFixtures";

const STANDARD_USER = process.env["USERNAME"];
const STANDARD_PASSWORD = process.env["PASSWORD"];

if (!STANDARD_USER || !STANDARD_PASSWORD) {
    throw new Error(
        "STANDARD_USER and STANDARD_PASSWORD must be set (see .env.example). " +
        "Failing fast here beats a confusing login-form failure deep in the test."
    );
}

test.describe("Checkout flow", {
    tag: ['@e2e']
}, () => {
    /**
     * GIVEN the user is logged in with valid credentials
     * WHEN the user adds two items to the cart
     * AND proceeds to checkout
     * AND submits valid checkout information
     * AND completes the purchase
     * THEN an order-confirmation message should be displayed
     * AND the cart should be empty
     */

    test("logs in, adds two items, completes checkout, and empties the cart", async ({ loginPage, productsPage, cartPage, checkoutPage }) => {
        await loginPage.login(STANDARD_USER, STANDARD_PASSWORD);
        const addedItems = await productsPage.addProductToCart();
        await cartPage.userProceedToCart(addedItems);
        await checkoutPage.userCheckoutAndCompleteOrder(addedItems);
        await cartPage.assertCartIsEmpty();
    });
});