import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.locator(
      "//button[contains(@class, 'menu-link') and contains(@class, 'btn-link')]"
    );
  }

  async isLoggedIn() {
    await expect(this.logoutButton).toBeVisible();
  }
}
