import { type Locator, type Page } from "@playwright/test";

export class ExporterSettingsPage {
  readonly page: Page;
  readonly tokenInput: Locator;
  readonly connectIntegrationButton: Locator;
  readonly myProductsTab: Locator;
  readonly categoryMappingTab: Locator;
  readonly connectionsSettingsTab: Locator;
  readonly synchronizationSettingsTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tokenInput = page
      .frameLocator("iframe[title='app-frame']")
      .locator("input[name='token']");
    this.connectIntegrationButton = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("button", { name: "Connect" });
    this.myProductsTab = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("link", { name: "My products" });
    this.categoryMappingTab = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("link", { name: "Category mapping" });
    this.connectionsSettingsTab = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("link", { name: "Connections settings" });
    this.synchronizationSettingsTab = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("link", { name: "Synchronization" });
  }

  async establishConnection(token: string) {
    await this.tokenInput.fill(token);
    await this.connectIntegrationButton.click();
  }
}
