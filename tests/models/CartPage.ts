import { expect, type Locator, type Page } from "@playwright/test";
import type { CartItem } from "./ProductsPage";

export class CartPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly cartList: Locator;
    readonly cartItems: Locator;
    readonly itemDescriptions: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.getByTestId("shopping-cart-link");
        this.cartBadge = page.getByTestId("shopping-cart-badge");
        this.cartList = page.getByTestId("cart-list");
        this.cartItems = page.getByTestId("inventory-item");
        this.itemDescriptions = page.getByTestId("inventory-item-desc");
        this.checkoutButton = page.getByTestId("checkout");
    }

    async userProceedToCart(items: CartItem[]) {
        await expect(this.cartBadge).toHaveText(String(items.length));
        await this.cartLink.click();
        await expect(this.page).toHaveURL(/\/cart\.html/);
     
        for (const item of items) {
            const cartItem = this.cartItems.filter({ hasText: item.name });
            await expect(cartItem.getByTestId("inventory-item-name")).toHaveText(item.name);
            await expect(cartItem.getByTestId("inventory-item-price")).toHaveText(item.price);
        }
        await expect(this.itemDescriptions).toHaveCount(items.length)
        await this.checkoutButton.click();
    }

    async assertCartIsEmpty() {
        await this.cartLink.click();
        await expect(this.cartBadge).not.toBeVisible();
        await expect(this.cartItems).toHaveCount(0);
        await expect(this.cartList.getByTestId("inventory-item")).toHaveCount(0);
    }
}