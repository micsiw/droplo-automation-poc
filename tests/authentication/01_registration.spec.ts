import { expect } from "@playwright/test";
import { test } from "../../fixtures/authFixtures";
import { LoginPage } from "../../pages/LoginPage";
import { RetailerHomePage } from "../../pages/RetailerHomePage";
import { RetailerOnboardingPage } from "../../pages/RetailerOnboardingPage";
import { RetailerRegistrationPage } from "../../pages/RetailerRegistrationPage";

test.describe("Account creation tests", () => {
  let retailerRegistrationPage: RetailerRegistrationPage;
  let retailerOnboardingPage: RetailerOnboardingPage;
  let loginPage: LoginPage;
  let homePage: RetailerHomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerRegistrationPage = new RetailerRegistrationPage(page);
    retailerOnboardingPage = new RetailerOnboardingPage(page);
    await page.goto("");
  });

  //skip dopoki nie ogarniemy obejscia CAPTCHA
  test.skip("should successfully create retailer account with valid credentials", async ({
    testRetailer,
  }) => {
    await loginPage.registerRetailerButton.click();
    await retailerRegistrationPage.register(
      testRetailer.phone,
      testRetailer.email,
      testRetailer.password
    );
    await retailerOnboardingPage.skipSurvey();
    await retailerOnboardingPage.skipOnboarding();
    await expect(homePage.logoutButton).toBeVisible();
  });
});
