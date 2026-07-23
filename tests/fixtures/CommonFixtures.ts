import { test as base } from "@playwright/test";
import { LoginPage } from "../models/LoginPage";
import { ProductsPage } from "../models/ProductsPage";
import { CartPage } from "../models/CartPage";
import { CheckoutPage } from "../models/CheckoutPage";
import { PostsApiClient } from "../api/clients/PostsApiClient";

type CommonFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    postsApiClient: PostsApiClient;
};

export const test = base.extend<CommonFixture>({
    loginPage: async ({ page }, use) => {
        await page.goto('/');
        await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    postsApiClient: async ({ request }, use) => {
        await use(new PostsApiClient(request));
    }
});

export * from "@playwright/test";