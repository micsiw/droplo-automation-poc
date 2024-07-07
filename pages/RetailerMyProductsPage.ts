import { type Locator, type Page } from "@playwright/test";

export class RetailerMyProductsPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly itemActionDropdown: Locator;
  readonly addToChannelsButton: Locator;
  readonly addProductsButton: Locator;
  readonly redcartExporterLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.getByPlaceholder("Search by name or EAN");
    this.itemActionDropdown = page.locator(".dropdown");
    this.addToChannelsButton = page.getByRole("button", {
      name: "Add to sales channels",
    });
    this.addProductsButton = page.getByRole("button", { name: "Add products" });
    this.redcartExporterLabel = page.getByRole("cell", { name: "RedCart" });
  }

  async sendItem(channelName: string, itemName: string) {
    await this.searchBar.fill(itemName);
    await this.itemActionDropdown.click();
    await this.addToChannelsButton.click();
    const channelLabel = this.page
      .locator("div")
      .filter({ hasText: channelName })
      .nth(1);
    await channelLabel.click();
    await this.addProductsButton.click();
  }
}
