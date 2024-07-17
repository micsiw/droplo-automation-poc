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
    const maxAttempts = 3;
    const retryDelay = 1000;

    const channelLabel = this.page
      .locator("div")
      .filter({ hasText: channelName })
      .nth(1);

    await this.searchBar.fill(itemName);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.itemActionDropdown.waitFor({
          state: "attached",
          timeout: 3000,
        });
        await this.itemActionDropdown.click();
        await this.addToChannelsButton.waitFor({
          state: "visible",
          timeout: 3000,
        });
        await this.addToChannelsButton.click();
        await channelLabel.waitFor({ state: "visible", timeout: 3000 });
        await channelLabel.click();
        await this.addProductsButton.click();

        break;
      } catch (error) {
        console.log(
          `Attempt: ${attempt + 1} to add product failed, retrying...`
        );
        if (attempt === maxAttempts - 1) {
          throw new Error(
            `Failed to add item after ${maxAttempts} attempts: ${error}`
          );
        }

        await this.page.waitForTimeout(retryDelay);
      }
    }
  }

  async withdrawItem(channelName: string, itemName: string) {
    const maxAttempts = 3;
    const retryDelay = 1000;

    const channelLabel = this.page
      .locator("div")
      .filter({ hasText: channelName })
      .nth(1);

    await this.searchBar.fill(itemName);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        await this.itemActionDropdown.waitFor({
          state: "attached",
          timeout: 3000,
        });
        await this.itemActionDropdown.click();
        await this.removeFromChannelsButton.waitFor({
          state: "visible",
          timeout: 3000,
        });
        await this.removeFromChannelsButton.click();
        await channelLabel.waitFor({ state: "visible", timeout: 3000 });
        await channelLabel.click();
        await this.removeProductsButton.click();

        break;
      } catch (error) {
        console.log(
          `Attempt: ${attempt + 1} to withdraw product failed, retrying...`
        );
        if (attempt === maxAttempts - 1) {
          throw new Error(
            `Failed to withdraw item after ${maxAttempts} attempts: ${error}`
          );
        }

        await this.page.waitForTimeout(retryDelay);
      }
    }
  }
}
