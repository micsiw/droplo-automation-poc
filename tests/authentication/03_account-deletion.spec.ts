import { expect, test } from "../../fixtures/authFixtures";

test.describe("Account deletion tests", () => {
  test.beforeEach(async ({ authContext }) => {
    await authContext.goToLoginPage();
  });

  test.skip("should successfully delete retailer account", async ({
    page,
    testRetailer,
    performRetailerLogin,
    performAccountDeletion,
    authContext,
  }) => {
    await performRetailerLogin(page, testRetailer.email, testRetailer.password);
    await expect(authContext.homePage.logoutButton).toBeVisible();
    await performAccountDeletion(page);
    await expect(page).toHaveURL("/account-deleted");
  });
});
