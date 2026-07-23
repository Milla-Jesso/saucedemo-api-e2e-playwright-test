import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId("username");
        this.passwordInput = page.getByTestId("password");
        this.loginButton = page.getByTestId("login-button");
        this.errorMessage = page.getByTestId("error");
    }

    async attemptLogin(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }


    async login(username: string, password: string) {
        await this.attemptLogin(username, password);
        if (await this.errorMessage.isVisible()) {
            const errorText = await this.errorMessage.textContent();
            throw new Error(`Login failed with error: ${errorText}`);
        }
    }

    async expectLoginError(messageSubstring: string) {
        await expect(this.errorMessage).toBeVisible();
        await expect(this.errorMessage).toContainText(messageSubstring);
    }
}