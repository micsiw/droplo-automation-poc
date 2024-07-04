import { expect, test } from "@playwright/test";
import credentials from "../../fixtures/test-data.json";
import { LoginPage } from "../../pages/LoginPage";
import { RetailerHomePage } from "../../pages/RetailerHomePage";

test.describe("User authentication tests", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    await page.goto("");
  });

  test("should successfully log in retailer with valid credentials", async () => {
    await loginPage.login(
      credentials.accounts[0].username,
      credentials.accounts[0].password
    );
    await expect(homePage.logoutButton).toBeVisible();
  });

  test("should show error message with invalid credentials", async () => {
    await loginPage.login("invalid@invalid.com", "credentials");
    await expect(loginPage.inputErrorMessage).toBeVisible();
  });
});
