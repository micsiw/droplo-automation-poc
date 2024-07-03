import { type Locator, type Page } from "@playwright/test";

export class RetailerRegistrationPage {
  readonly page: Page;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly inputErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.locator("input[data-ctx='input'][type='text']");
    this.emailInput = page.locator("input[type='email']");
    this.passwordInput = page.locator("input[type='password']");
    this.registerButton = page.getByRole("button", { name: "Create" });
    this.inputErrorMessage = page.locator("span[role='alert']");
  }

  async register(phone: string, username: string, password: string) {
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }
}
