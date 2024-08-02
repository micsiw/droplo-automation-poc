import { test } from "../../../fixtures/redcartFixtures";

test.describe("Redcart integration deletion tests for retailer", () => {
  test.beforeEach(async ({ page, performLogin }) => {
    await performLogin(page);
  });

  test("should successfully delete integration", async ({ redcartContext }) => {
    await redcartContext.deleteRedcartIntegration();
  });

  test.skip("api call should verify that account have no active integrations", async () => {
    //tutaj zapytanie po api czy konto ma zainstalowane aplikacje
  });
});
