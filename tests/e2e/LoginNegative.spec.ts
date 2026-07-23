import { expect, test } from "../fixtures/CommonFixtures";

const STANDARD_USER = process.env["USERNAME"];
const WRONG_PASSWORD = process.env["WRONG_PASSWORD"];

if (!STANDARD_USER || !WRONG_PASSWORD) {
    throw new Error(
        "STANDARD_USER, WRONG_PASSWORD, and E2E_SAUCEDEMO_BASE_URL must be set (see .env.example). " +
        "Failing fast here beats a confusing login-form failure deep in the test."
    );
}

test.describe('Login - negative cases', {
    tag: ['@e2e', '@smoke', '@regression']
}, () => {
    /**
     * GIVEN the user provides an invalid username or password
     * WHEN the user attempts to log in
     * THEN an error message indicating username and password do not match any user in this service should be displayed
     * AND the user should remain on the login page
     */
    test('invalid username shows a credential-mismatch error and blocks login', async ({
        loginPage
    }) => {
        await loginPage.attemptLogin(STANDARD_USER, WRONG_PASSWORD);
        await loginPage.expectLoginError('Username and password do not match any user in this service');
    });
});