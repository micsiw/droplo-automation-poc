import { expect, test } from "@playwright/test";
import { redcartApi } from "../../../fixtures/redcartFixtures";
import credentials from "../../../fixtures/test-data.json";
import { ExporterSettingsPage } from "../../../pages/ExporterSettingsPage";
import { LoginPage } from "../../../pages/LoginPage";
import { RetailerHomePage } from "../../../pages/RetailerHomePage";
import { RetailerMarketplacePage } from "../../../pages/RetailerMarketplacePage";
import { RetailerMyProductsPage } from "../../../pages/RetailerMyProductsPage";

test.describe("Exporting product to Redcart sales channel tests for retailer", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerMarketplacePage: RetailerMarketplacePage;
  let exporterSettingsPage: ExporterSettingsPage;
  let retailerMyProductsPage: RetailerMyProductsPage;

  const productName = "Some example product added by cypress: 1680257521361";

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

  test("should successfully export product to Redcart channel using my-products section", async () => {
    await homePage.myProductsButton.click();
    await retailerMyProductsPage.sendItem(
      "Redcart - automated test",
      productName
    );
    await expect(retailerMyProductsPage.exportSuccessToast).toBeVisible();
    await expect(retailerMyProductsPage.redcartExporterLabel).toBeVisible();
  });

  test("sending api request to redcart channel to confirm that product was exported successfully", async ({
    request,
  }) => {
    const redcartApiClient = redcartApi(request);

    const response = await redcartApiClient.sendRequest("products", "select", [
      {
        products_name: productName,
        quantity: 20,
      },
    ]);

    expect(response).toHaveProperty("count", 1);
    expect(response).toHaveProperty("products");

    const product = response.products.find(
      (prod: any) => prod.products_name === productName
    );

    expect(product).toBeDefined();
    expect(product.products_name).toBe(productName);
    expect(product.quantity_all).toBe("20");
  });
});
