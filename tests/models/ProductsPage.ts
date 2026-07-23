import { expect, type Locator, type Page } from "@playwright/test";

export interface CartItem {
    name: string;
    price: string;
}

export class ProductsPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly cartIcon: Locator;
    readonly cartBadge: Locator;
    readonly pageTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.getByTestId("inventory-item");
        this.pageTitle = page.getByTestId("title");
        this.cartBadge = page.getByTestId("shopping-cart-badge");
        this.cartIcon = page.getByTestId("shopping-cart-link");
    }

    /**
     * Adds the first two items in the current inventory listing to the cart.
     * I deliberately NOT hardcoded to a specific product name/slug, so the test
     * keeps working even if saucedemo reorders its catalog.
     *
     * Returns the {name, price} of each item added this is the source of
     * truth that CartPage and CheckoutPage validate against downstream,
     * instead of each page re-deriving or hardcoding the same values.
     */
    async addProductToCart(): Promise<CartItem[]> {
        const addedItems: CartItem[] = [];
        const itemsToAdd = 2;
        for (let i = 0; i < itemsToAdd; i++) {
            const item = this.inventoryItems.nth(i);

            const name = (await item.getByTestId("inventory-item-name").textContent()) ?? "";
            const price = (await item.getByTestId("inventory-item-price").textContent()) ?? "";

            const addButton = item.getByRole("button", { name: "Add to cart" });
            await addButton.click();
            await expect(item.getByRole("button", { name: "Remove" })).toBeVisible();

            addedItems.push({ name, price });
        }

        return addedItems;
    }
}