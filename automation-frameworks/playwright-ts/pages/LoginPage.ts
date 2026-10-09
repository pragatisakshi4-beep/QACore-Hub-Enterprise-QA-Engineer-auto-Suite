import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model representation of the QA Core Login Page
 */
export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorMessage: Locator;
    readonly dashboardHeader: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('#sb-email');
        this.passwordInput = page.locator('#sb-password');
        this.submitButton = page.locator('#sb-submit-btn');
        this.errorMessage = page.locator('.error-feedback');
        this.dashboardHeader = page.locator('.page-title');
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async fillCredentials(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async verifyErrorVisible(expectedText: string) {
        await expect(this.errorMessage).toContainText(expectedText);
    }
}
