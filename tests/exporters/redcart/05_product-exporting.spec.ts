import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import credentials from "../../../fixtures/test-data.json";
import { ExporterSettingsPage } from "../../../pages/ExporterSettingsPage";
import { LoginPage } from "../../../pages/LoginPage";
import { RetailerHomePage } from "../../../pages/RetailerHomePage";
import { RetailerMarketplacePage } from "../../../pages/RetailerMarketplacePage";
import { RetailerMyProductsPage } from "../../../pages/RetailerMyProductsPage";

dotenv.config();

test.describe("Exporting product to Redcart sales channel tests", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerMarketplacePage: RetailerMarketplacePage;
  let exporterSettingsPage: ExporterSettingsPage;
  let retailerMyProductsPage: RetailerMyProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerMarketplacePage = new RetailerMarketplacePage(page);
    exporterSettingsPage = new ExporterSettingsPage(page);
    retailerMyProductsPage = new RetailerMyProductsPage(page);

    await page.goto("");
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
  });

  test("should successfully map category for existing product", async ({
    page,
  }) => {
    await homePage.marketplaceButton.click();
    await retailerMarketplacePage.openIntegration();
    await exporterSettingsPage.categoryMappingTab.click();
    const productCategorySelector = page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#reason div")
      .first();
    await productCategorySelector.click();
    const testCategory = page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: "Test" });
    await testCategory.click();
    await exporterSettingsPage.saveSettingsButton.click();
    await exporterSettingsPage.myProductsTab.click();
    await exporterSettingsPage.categoryMappingTab.click();
    const selectedCategory = page
      .frameLocator('iframe[title="app-frame"]')
      .getByText("Test");
    await expect(selectedCategory).toBeVisible();
  });

  test("should successfully export product from my-products section", async () => {
    await homePage.myProductsButton.click();
    await retailerMyProductsPage.sendItem(
      "Redcart - automated test",
      "Rower Speedy Bonzo"
    );
    await expect(retailerMyProductsPage.redcartExporterLabel).toBeVisible();
  });
});
