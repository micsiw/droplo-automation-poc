import { expect, test } from "../../fixtures/authFixtures";

test.describe("User authentication tests", () => {
  test.beforeEach(async ({ authContext }) => {
    await authContext.goToLoginPage();
  });

  test("should successfully log in retailer with valid credentials", async ({
    performRetailerLogin,
    validCredentials,
    authContext,
    page,
  }) => {
    await performRetailerLogin(
      page,
      validCredentials.username,
      validCredentials.password
    );
    await expect(authContext.homePage.logoutButton).toBeVisible();
  });

  test("should show error message with invalid credentials", async ({
    performRetailerLogin,
    authContext,
    page,
  }) => {
    await performRetailerLogin(page, "invalid@invalid.com", "credentials");
    await expect(authContext.loginPage.inputErrorMessage).toBeVisible();
  });
});
