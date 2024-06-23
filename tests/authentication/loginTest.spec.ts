import { test } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";

test.describe("Login TEST", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test("login", async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto("");

    await loginPage.login("wemasaw864@wlmycn.com", "test1234");
    await homePage.isLoggedIn();
  });
});
