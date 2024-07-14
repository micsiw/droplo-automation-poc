import { expect, test } from "@playwright/test";
import credentials from "../../../fixtures/test-data.json";
import { LoginPage } from "../../../pages/LoginPage";
import { RetailerHomePage } from "../../../pages/RetailerHomePage";
import { RetailerMarketplacePage } from "../../../pages/RetailerMarketplacePage";

test.describe("Redcart integration deletion tests for retailer", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerMarketplacePage: RetailerMarketplacePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerMarketplacePage = new RetailerMarketplacePage(page);

    await page.goto("");
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
  });

  test("should successfully delete integration", async ({ page }) => {
    await homePage.marketplaceButton.click();
    await expect(page.getByText("Redcart - automated test")).toBeVisible();
    await retailerMarketplacePage.deleteIntegration();
  });

  test.skip("api call should verify that account have no active integrations", async () => {
    //tutaj zapytanie po api czy konto ma zainstalowane aplikacje
  });
});
