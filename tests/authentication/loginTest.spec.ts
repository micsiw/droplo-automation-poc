import { test } from "@playwright/test";
import credentials from "../../fixtures/test-data.json";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login TEST", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test("login", async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto("");

    await loginPage.login(
      credentials.accounts[0].username,
      credentials.accounts[0].password
    );
    await homePage.isLoggedIn();
  });
});
