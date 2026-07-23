import { expect, type Locator, type Page } from "@playwright/test";
import type { CartItem } from "./ProductsPage";

interface CheckoutInfo {
    firstName: string;
    lastName: string;
    postalCode: string;
}

export class CheckoutPage {
    readonly page: Page;

    readonly pageTitle: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;

    readonly paymentInfoLabel: Locator;
    readonly shippingInfoLabel: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;

    readonly completeContainer: Locator;
    readonly ponyExpressImage: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly generatePdfButton: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageTitle = page.getByTestId("title");
        this.firstNameInput = page.getByTestId("firstName");
        this.lastNameInput = page.getByTestId("lastName");
        this.postalCodeInput = page.getByTestId("postalCode");
        this.continueButton = page.getByTestId("continue");

        this.paymentInfoLabel = page.getByTestId("payment-info-label");
        this.shippingInfoLabel = page.getByTestId("shipping-info-label");
        this.subtotalLabel = page.getByTestId("subtotal-label");
        this.taxLabel = page.getByTestId("tax-label");
        this.totalLabel = page.getByTestId("total-label");
        this.finishButton = page.getByTestId("finish");

        this.completeContainer = page.getByTestId("checkout-complete-container");
        this.ponyExpressImage = page.getByTestId("pony-express");
        this.completeHeader = page.getByTestId("complete-header");
        this.completeText = page.getByTestId("complete-text");
        this.generatePdfButton = page.getByTestId("generate-pdf-order");
        this.backToProductsButton = page.getByTestId("back-to-products");
    }

    private parseCurrency(text: string): number {
        const match = text.match(/\$([\d.]+)/);
        return match ? parseFloat(match[1]) : NaN;
    }

    async userCheckoutAndCompleteOrder(
        items: CartItem[],
        info: CheckoutInfo = { firstName: "Milla", lastName: "Jesso", postalCode: "23232" }
    ) {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText("Checkout: Your Information");

        await this.firstNameInput.fill(info.firstName);
        await this.lastNameInput.fill(info.lastName);
        await this.postalCodeInput.fill(info.postalCode);
        await this.continueButton.click();
        await expect(this.paymentInfoLabel).toBeVisible();
        await expect(this.paymentInfoLabel).toHaveText(/Payment Information/);
        await expect(this.shippingInfoLabel).toBeVisible();
        await expect(this.shippingInfoLabel).toHaveText(/Shipping Information/);
        await expect(this.subtotalLabel).toBeVisible();
        const subtotalText = await this.subtotalLabel.textContent();
        const subtotal = this.parseCurrency(subtotalText ?? "");

        const expectedSubtotal = items.reduce(
            (sum, item) => sum + this.parseCurrency(item.price),
            0
        );
        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        await expect(this.taxLabel).toBeVisible();
        const taxText = await this.taxLabel.textContent();
        const tax = this.parseCurrency(taxText ?? "");

        await expect(this.totalLabel).toBeVisible();
        const totalText = await this.totalLabel.textContent();
        const total = this.parseCurrency(totalText ?? "");
        expect(total).toBeCloseTo(subtotal + tax, 2);
        await this.finishButton.click();
        await expect(this.pageTitle).toBeVisible();
        await expect(this.pageTitle).toHaveText("Checkout: Complete!");
        await expect(this.completeContainer).toBeVisible();
        await expect(this.ponyExpressImage).toBeVisible();
        await expect(this.completeHeader).toBeVisible();
        await expect(this.completeText).toBeVisible();
        const downloadPromise = this.page.waitForEvent("download");
        await this.generatePdfButton.click();
        await downloadPromise;
        await expect(this.backToProductsButton).toBeVisible();
    }
}