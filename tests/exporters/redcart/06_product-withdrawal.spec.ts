import { expect, test } from "@playwright/test";
import { redcartApi } from "../../../fixtures/redcartFixtures";
import credentials from "../../../fixtures/test-data.json";
import { LoginPage } from "../../../pages/LoginPage";
import { RetailerHomePage } from "../../../pages/RetailerHomePage";
import { RetailerMyProductsPage } from "../../../pages/RetailerMyProductsPage";

test.describe("Withdrawing product from Redcart sales channel tests for retailer", () => {
  let homePage: RetailerHomePage;
  let loginPage: LoginPage;
  let retailerMyProductsPage: RetailerMyProductsPage;

  const productName = "Some example product added by cypress: 1680257521361";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new RetailerHomePage(page);
    retailerMyProductsPage = new RetailerMyProductsPage(page);

    await page.goto("");
    await loginPage.login(
      credentials.accounts[1].username,
      credentials.accounts[1].password
    );
    await expect(homePage.logoutButton).toBeVisible();
  });

  test("should successfully withdraw product from Redcart channel using my-products section", async () => {
    await homePage.myProductsButton.click();
    await retailerMyProductsPage.withdrawItem(
      "Redcart - automated test",
      productName
    );
    await expect(retailerMyProductsPage.withdrawSuccessToast).toBeVisible();
  });

  test("sending api request to redcart channel to confirm that product was withdrawn successfully", async ({
    request,
  }) => {
    const redcartApiClient = redcartApi(request);

    const response = await redcartApiClient.sendRequest("products", "select", [
      {
        products_name: productName,
      },
    ]);

    expect(response).toHaveProperty("count", 0);
  });
});
