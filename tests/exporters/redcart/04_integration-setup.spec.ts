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
  });

  test("should successfully install integration", async ({ page }) => {
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
    await homePage.marketplaceButton.click();
    await retailerMarketplacePage.installRedcart("Redcart - automated test");
    await homePage.marketplaceButton.click();
    await expect(page.getByText("Redcart - automated test")).toBeVisible();
  });

  test("should successfully establish connection with store using valid token", async ({
    page,
  }) => {
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
    await homePage.marketplaceButton.click();
    await expect(page.getByText("Redcart - automated test")).toBeVisible();
    await retailerMarketplacePage.openIntegration();
    await exporterSettingsPage.establishConnection(redcartToken);
    await expect(exporterSettingsPage.synchronizationSettingsTab).toBeVisible();
  });
});
