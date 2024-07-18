import { expect, test } from "../../fixtures/authFixtures";

test.describe("Account creation tests", () => {
  //skip dopoki nie ogarniemy obejscia CAPTCHA
  test.skip("should successfully create retailer account with valid credentials", async ({
    performRetailerRegistration,
    authContext,
    page,
  }) => {
    await performRetailerRegistration(page);
    await authContext.skipOnboarding();
    await expect(authContext.homePage.logoutButton).toBeVisible();
  });
});
