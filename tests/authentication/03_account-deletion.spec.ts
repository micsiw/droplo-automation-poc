import { expect, test } from "../../fixtures/authFixtures";
import { LoginPage } from "../../pages/LoginPage";
import { RetailerHomePage } from "../../pages/RetailerHomePage";
import { RetailerSettingsPage } from "../../pages/RetailerSettingsPage";

test.describe("Account deletion tests", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerSettingsPage: RetailerSettingsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerSettingsPage = new RetailerSettingsPage(page);
    await page.goto("");
  });

  test.skip("should successfully delete retailer account", async ({
    page,
    testRetailer,
  }) => {
    await loginPage.login(testRetailer.email, testRetailer.password);
    await expect(homePage.logoutButton).toBeVisible();
    await homePage.settingsButton.click();
    await retailerSettingsPage.deleteAccount();
    await expect(page).toHaveURL("/account-deleted");
  });
});
