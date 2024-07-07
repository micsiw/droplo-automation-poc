import { type Locator, type Page } from "@playwright/test";

export class ExporterSettingsPage {
  readonly page: Page;
  readonly tokenInput: Locator;
  readonly connectIntegrationButton: Locator;
  readonly myProductsTab: Locator;
  readonly categoryMappingTab: Locator;
  readonly connectionsSettingsTab: Locator;
  readonly synchronizationSettingsTab: Locator;
  readonly marginPercentValue: Locator;
  readonly marginFlatValue: Locator;
  readonly defaultCurrencySetting: Locator;
  readonly redcartWarehouseSetting: Locator;
  readonly exportLanguageSetting: Locator;
  readonly taxSetting: Locator;
  readonly saveSettingsButton: Locator;

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
    this.marginPercentValue = page
      .frameLocator('iframe[title="app-frame"]')
      .locator('input[name="margin_percent"]');
    this.marginFlatValue = page
      .frameLocator('iframe[title="app-frame"]')
      .locator('input[name="amount_to_add"]');
    this.defaultCurrencySetting = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("svg")
      .nth(1);
    this.redcartWarehouseSetting = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#SELECT_WAREHOUSE svg");
    this.exportLanguageSetting = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#language svg");
    this.taxSetting = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("svg")
      .nth(4);
    this.saveSettingsButton = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("button", { name: "Save" });
  }

  async establishConnection(token: string) {
    await this.tokenInput.fill(token);
    await this.connectIntegrationButton.click();
  }
}
