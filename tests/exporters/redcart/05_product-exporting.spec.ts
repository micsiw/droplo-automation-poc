import { expect, test } from "../../../fixtures/redcartFixtures";

test.describe("Exporting product to Redcart sales channel tests for retailer", () => {
  test.beforeEach(async ({ page, performLogin }) => {
    await performLogin(page);
  });

  test("should successfully map category for existing product", async ({
    redcartContext,
  }) => {
    await redcartContext.mapCategories();
  });

  test("should successfully export product to Redcart channel using my-products section", async ({
    testData,
    redcartContext,
  }) => {
    await redcartContext.homePage.myProductsButton.click();
    await redcartContext.retailerMyProductsPage.sendItem(
      testData.channelName,
      testData.productName
    );
    await expect(
      redcartContext.retailerMyProductsPage.exportSuccessToast
    ).toBeVisible();
    await expect(
      redcartContext.retailerMyProductsPage.redcartExporterLabel
    ).toBeVisible();
  });
});

test.describe("Sending api requests to Redcart to confirm success of export process", () => {
  let product: any;

  test.beforeEach(
    "sending request for tested product",
    async ({ redcartApi, testData }) => {
      product = await redcartApi.getProduct(testData.productName);
      expect(product).toBeDefined();
    }
  );

  test("product was exported successfully", async ({ testData }) => {
    expect(product.products_name).toBe(testData.productName);
    expect(product.quantity_all).toBe("20");
  });

  test("product margin was correctly applied", async ({ redcartContext }) => {
    const priceWithMargin = redcartContext.calculatePriceWithMargin();

    expect(product.products_price).toBe(priceWithMargin);
  });
});
