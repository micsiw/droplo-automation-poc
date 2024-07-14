import { type Locator, type Page } from "@playwright/test";

export class RetailerMyProductsPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly itemActionDropdown: Locator;
  readonly addToChannelsButton: Locator;
  readonly removeFromChannelsButton: Locator;
  readonly addProductsButton: Locator;
  readonly removeProductsButton: Locator;
  readonly redcartExporterLabel: Locator;
  readonly exportSuccessToast: Locator;
  readonly withdrawSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBar = page.getByPlaceholder("Search by name or EAN");
    this.itemActionDropdown = page.locator(
      "button[type='button'][aria-expanded='false'].dropdown-toggle"
    );
    this.addToChannelsButton = page.getByRole("button", {
      name: "Add to sales channels",
    });
    this.removeFromChannelsButton = page.getByRole("button", {
      name: "Remove from sales channels",
    });
    this.addProductsButton = page.getByRole("button", { name: "Add products" });
    this.removeProductsButton = page.getByRole("button", {
      name: "Remove products",
    });
    this.redcartExporterLabel = page.getByRole("cell", { name: "RedCart" });
    this.exportSuccessToast = page.getByText("Added 1 product to sales");
    this.withdrawSuccessToast = page.getByText("Removed 1 product from sales");
  }

  async sendItem(channelName: string, itemName: string) {
    const channelLabel = this.page
      .locator("div")
      .filter({ hasText: channelName })
      .nth(1);

    await this.searchBar.fill(itemName);
    await this.itemActionDropdown.click();
    await this.addToChannelsButton.waitFor({ state: "attached" });
    await this.addToChannelsButton.click();
    await channelLabel.click();
    await this.addProductsButton.click();
  }

  async withdrawItem(channelName: string, itemName: string) {
    const channelLabel = this.page
      .locator("div")
      .filter({ hasText: channelName })
      .nth(1);

    await this.searchBar.fill(itemName);
    await this.itemActionDropdown.click();
    await this.removeFromChannelsButton.waitFor({ state: "attached" });
    await this.removeFromChannelsButton.click();
    await channelLabel.click();
    await this.removeProductsButton.click();
  }
}
