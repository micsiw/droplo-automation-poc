import { expect, test } from "../../../fixtures/redcartFixtures";

test.describe("Withdrawing product from Redcart sales channel tests for retailer", () => {
  test.beforeEach(async ({ page, performLogin }) => {
    await performLogin(page);
  });

  test("should successfully withdraw product from Redcart channel using my-products section", async ({
    testData,
    redcartContext,
  }) => {
    await redcartContext.homePage.myProductsButton.click();
    await redcartContext.retailerMyProductsPage.withdrawItem(
      testData.channelName,
      testData.productName
    );
    await expect(
      redcartContext.retailerMyProductsPage.withdrawSuccessToast
    ).toBeVisible();
  });

  test("sending api request to redcart channel to confirm that product was withdrawn successfully", async ({
    redcartApi,
    testData,
  }) => {
    const result = await redcartApi.getProduct(testData.productName);
    expect(result.response.count).toBe(0);
  });
});
