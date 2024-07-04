import { expect, test } from "../../fixtures/authFixtures";
import { LoginPage } from "../../pages/LoginPage";
import { HomePage } from "../../pages/RetailerHomePage";
import { RetailerOnboardingPage } from "../../pages/RetailerOnboardingPage";
import { RetailerRegistrationPage } from "../../pages/RetailerRegistrationPage";

test.describe("Account creation tests", () => {
  let retailerRegistrationPage: RetailerRegistrationPage;
  let retailerOnboardingPage: RetailerOnboardingPage;
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    retailerRegistrationPage = new RetailerRegistrationPage(page);
    retailerOnboardingPage = new RetailerOnboardingPage(page);
    await page.goto("");
  });

  test("should successfully create retailer account with valid credentials", async ({
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