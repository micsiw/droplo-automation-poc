import { type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly settingsButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.settingsButton = page.locator("a[href='/account']");
    this.logoutButton = page.locator(
      "//button[contains(@class, 'menu-link') and contains(@class, 'btn-link')]"
    );
  }
}
