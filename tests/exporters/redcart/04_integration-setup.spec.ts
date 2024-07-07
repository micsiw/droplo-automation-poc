import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import credentials from "../../../fixtures/test-data.json";
import { ExporterSettingsPage } from "../../../pages/ExporterSettingsPage";
import { LoginPage } from "../../../pages/LoginPage";
import { RetailerHomePage } from "../../../pages/RetailerHomePage";
import { RetailerMarketplacePage } from "../../../pages/RetailerMarketplacePage";

dotenv.config();

test.describe("Redcart integration tests for retailer", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerMarketplacePage: RetailerMarketplacePage;
  let exporterSettingsPage: ExporterSettingsPage;
  const redcartToken = process.env.REDCART_API_KEY as string;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerMarketplacePage = new RetailerMarketplacePage(page);
    exporterSettingsPage = new ExporterSettingsPage(page);

    await page.goto("");
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
    await homePage.marketplaceButton.click();
  });

  test("should check if account is ready for testing (clean start)", async () => {
    await expect(
      retailerMarketplacePage.integrationDropdownButton
    ).not.toBeVisible();
  });

  test("should successfully install integration", async ({ page }) => {
    await retailerMarketplacePage.installRedcart("Redcart - automated test");
    await homePage.marketplaceButton.click();
    await expect(page.getByText("Redcart - automated test")).toBeVisible();
  });

  test("should successfully establish connection with store using valid token", async ({
    page,
  }) => {
    await expect(page.getByText("Redcart - automated test")).toBeVisible();
    await retailerMarketplacePage.openIntegration();
    await exporterSettingsPage.establishConnection(redcartToken);
    await expect(exporterSettingsPage.synchronizationSettingsTab).toBeVisible();
  });

  test("should successfully setup and save synchronization settings", async ({
    page,
  }) => {
    await retailerMarketplacePage.openIntegration();
    await exporterSettingsPage.synchronizationSettingsTab.click();
    await exporterSettingsPage.marginPercentValue.fill("10");
    await exporterSettingsPage.marginFlatValue.fill("5");
    await exporterSettingsPage.defaultCurrencySetting.click();
    const defaultCurrency = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: "PLN - polish zloty" });
    await defaultCurrency.click();
    await exporterSettingsPage.redcartWarehouseSetting.click();
    const redcartWarehouse = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: "Magazyn wirtualny droplo-" });
    await redcartWarehouse.click();
    await exporterSettingsPage.exportLanguageSetting.click();
    const languageSetting = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: "Any" });
    await languageSetting.click();
    await exporterSettingsPage.saveSettingsButton.click();
  });

  test("should verify synchronization settings were saved correctly", async ({
    page,
  }) => {
    await retailerMarketplacePage.openIntegration();
    await exporterSettingsPage.synchronizationSettingsTab.click();
    await expect(exporterSettingsPage.marginPercentValue).toHaveValue("10");
    await expect(exporterSettingsPage.marginFlatValue).toHaveValue("5");
    const defaultCurrency = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("div")
      .filter({ hasText: /^PLN - polish zloty$/ })
      .first();
    await expect(defaultCurrency).toBeVisible();
    const redcartWarehouse = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("div")
      .filter({ hasText: /^Magazyn wirtualny droplo-premium$/ })
      .first();
    await expect(redcartWarehouse).toBeVisible();
    const languageSetting = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#language div")
      .filter({ hasText: "Any" })
      .first();
    await expect(languageSetting).toBeVisible();
  });
});
