import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerSupplierButton: Locator;
  readonly registerRetailerButton: Locator;
  readonly inputErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("input#username");
    this.passwordInput = page.locator("input#password");
    this.loginButton = page.locator("input[type='submit']#kc-login");
    this.registerSupplierButton = page.locator(
      "//div[@onclick=\"redirectToRegister('supplier')\"]"
    );
    this.registerRetailerButton = page.locator(
      "//div[@onclick=\"redirectToRegister('retailer')\"]"
    );
    this.inputErrorMessage = page.locator("//span[@id='input-error']");
  }

  async goto() {
    await this.page.goto("");
  }

  async login(username: string, password: string) {
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
