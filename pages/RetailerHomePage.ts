import { type Locator, type Page } from "@playwright/test";

export class RetailerHomePage {
  readonly page: Page;
  readonly myProductsButton: Locator;
  readonly marketplaceButton: Locator;
  readonly settingsButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myProductsButton = page.locator("a[href='/my-products']");
    this.marketplaceButton = page.locator("a[href='/marketplace']");
    this.settingsButton = page.locator("a[href='/account']");
    this.logoutButton = page.locator(
      "//button[contains(@class, 'menu-link') and contains(@class, 'btn-link')]"
    );
  }
}
