import { expect, test } from "../../../fixtures/redcartFixtures";

test.describe("Redcart integration configuration tests for retailer", () => {
  test.beforeEach(async ({ redcartContext, performLogin, page }) => {
    page.setDefaultTimeout(10000);
    await performLogin(page);
    await redcartContext.goToMarketplace();
  });

  test.skip("should check if account is ready for testing (clean start)", async () => {
    // warto dodać test który upewni się, ze na koncie nie ma zadnych aktywnych integracji, najlepiej po api
  });

  test("should successfully install integration", async ({
    redcartContext,
  }) => {
    await redcartContext.installRedcartIntegration();
  });

  test("should successfully establish connection with store using valid token", async ({
    redcartContext,
  }) => {
    await redcartContext.retailerMarketplacePage.openIntegration();
    await redcartContext.establishConnection();
    await expect(
      redcartContext.exporterSettingsPage.synchronizationSettingsTab
    ).toBeVisible();
  });

  test("should successfully setup and save synchronization settings", async ({
    redcartContext,
  }) => {
    await redcartContext.retailerMarketplacePage.openIntegration();
    await redcartContext.setupSynchronizationSettings();
  });

  test("should verify synchronization settings were saved correctly", async ({
    redcartContext,
  }) => {
    await redcartContext.retailerMarketplacePage.openIntegration();
    await redcartContext.verifySynchronizationSettings();
  });
});
