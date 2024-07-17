import { APIRequestContext, Page, test as base } from "@playwright/test";
import dotenv from "dotenv";
import { ExporterSettingsPage } from "../pages/ExporterSettingsPage";
import { LoginPage } from "../pages/LoginPage";
import { RetailerHomePage } from "../pages/RetailerHomePage";
import { RetailerMarketplacePage } from "../pages/RetailerMarketplacePage";
import { RetailerMyProductsPage } from "../pages/RetailerMyProductsPage";

dotenv.config();

const redcartApiKey = process.env.REDCART_REQUEST_KEY as string;
const redcartToken = process.env.REDCART_API_KEY as string;
const login = process.env.ACC_REDCART_LOGIN as string;
const password = process.env.ACC_REDCART_PWD as string;

interface RedcartRequestParams {
  module: string;
  method: string;
  params?: Array<Record<string, any>>;
}

interface TestFixtures {
  redcartApi: RedcartClient;
  testData: TestData;
  performLogin: (page: Page) => Promise<void>;
  redcartContext: RedcartContext;
}

interface TestData {
  productName: string;
  channelName: string;
  loginCredentials: {
    login: string;
    password: string;
  };
}

class RedcartClient {
  private context: APIRequestContext;

  constructor(context: APIRequestContext) {
    this.context = context;
  }

  async sendRequest({
    module,
    method,
    params = [],
  }: RedcartRequestParams): Promise<any> {
    const jsonRequestBody = {
      key: redcartApiKey,
      viewType: "json",
      module,
      method,
      parameters: params,
    };

    const formParams: Record<string, string> = {
      json: JSON.stringify(jsonRequestBody),
    };

    const response = await this.context.post(
      "https://api2.redcart.pl?input=json",
      {
        form: formParams,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.json();
  }

  async getProduct(productName: string): Promise<any> {
    const response = await this.sendRequest({
      module: "products",
      method: "select",
      params: [{ products_name: productName }],
    });

    if (response.count < 1) {
      return { noProduct: true, response };
    }

    const product = response.products.find(
      (prod: any) => prod.products_name === productName
    );

    return product;
  }
}

class RedcartContext {
  private page: Page;
  loginPage: LoginPage;
  homePage: RetailerHomePage;
  retailerMarketplacePage: RetailerMarketplacePage;
  retailerMyProductsPage: RetailerMyProductsPage;
  exporterSettingsPage: ExporterSettingsPage;

  private config = {
    channelName: "Redcart - automated test",
    productName: "Some example product added by cypress: 1680257521361",
    productPriceNet: 100,
    categoryName: "Test",
    marginPercent: 10,
    marginFlat: 5,
    defaultCurrency: "PLN - polish zloty",
    redcartWarehouse: "Magazyn wirtualny droplo-",
    exportLanguage: "Any",
    redcartWarehouseFullName: "Magazyn wirtualny droplo-premium",
  };

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.homePage = new RetailerHomePage(page);
    this.retailerMarketplacePage = new RetailerMarketplacePage(page);
    this.retailerMyProductsPage = new RetailerMyProductsPage(page);
    this.exporterSettingsPage = new ExporterSettingsPage(page);
  }

  getExportInfo() {
    return {
      channelName: this.config.channelName,
      productName: this.config.productName,
    };
  }

  getMarginValues() {
    return {
      marginPercent: this.config.marginPercent,
      marginFlat: this.config.marginFlat,
    };
  }

  calculatePriceWithMargin() {
    const priceWithMargin = (
      this.config.productPriceNet * (1 + this.config.marginPercent / 100) +
      this.config.marginFlat
    ).toFixed(2);
    return priceWithMargin;
  }

  async goToMarketplace() {
    await this.homePage.marketplaceButton.click();
  }

  async goToMyProducts() {
    await this.homePage.myProductsButton.click();
  }

  async installRedcartIntegration() {
    await this.retailerMarketplacePage.installRedcart(this.config.channelName);
    await this.goToMarketplace();
    await expect(this.page.getByText(this.config.channelName)).toBeVisible();
  }

  async deleteRedcartIntegration() {
    await this.goToMarketplace();
    await expect(this.page.getByText(this.config.channelName)).toBeVisible();
    await this.retailerMarketplacePage.deleteIntegration();
    await expect(
      this.retailerMarketplacePage.deleteIntegrationSuccessToast
    ).toBeVisible();
  }

  async establishConnection() {
    await this.exporterSettingsPage.establishConnection(redcartToken);
  }

  async setupSynchronizationSettings() {
    await this.exporterSettingsPage.synchronizationSettingsTab.click();
    await this.exporterSettingsPage.marginPercentValue.fill(
      this.config.marginPercent.toString()
    );
    await this.exporterSettingsPage.marginFlatValue.fill(
      this.config.marginFlat.toString()
    );
    await this.exporterSettingsPage.defaultCurrencySetting.click();
    const defaultCurrency = this.page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: this.config.defaultCurrency });
    await defaultCurrency.click();
    await this.exporterSettingsPage.redcartWarehouseSetting.click();
    const redcartWarehouse = this.page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: this.config.redcartWarehouse });
    await redcartWarehouse.click();
    await this.exporterSettingsPage.exportLanguageSetting.click();
    const languageSetting = this.page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: this.config.exportLanguage });
    await languageSetting.click();
    await this.exporterSettingsPage.saveSettingsButton.click();
  }

  async verifySynchronizationSettings() {
    await this.exporterSettingsPage.synchronizationSettingsTab.click();
    await expect(this.exporterSettingsPage.marginPercentValue).toHaveValue(
      this.config.marginPercent.toString()
    );
    await expect(this.exporterSettingsPage.marginFlatValue).toHaveValue(
      this.config.marginFlat.toString()
    );
    const defaultCurrency = this.page
      .frameLocator('iframe[title="app-frame"]')
      .locator("div")
      .filter({ hasText: new RegExp(`^${this.config.defaultCurrency}$`) })
      .first();
    await expect(defaultCurrency).toBeVisible();
    const redcartWarehouse = this.page
      .frameLocator('iframe[title="app-frame"]')
      .locator("div")
      .filter({
        hasText: new RegExp(`^${this.config.redcartWarehouseFullName}$`),
      })
      .first();
    await expect(redcartWarehouse).toBeVisible();
    const languageSetting = this.page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#language div")
      .filter({ hasText: this.config.exportLanguage })
      .first();
    await expect(languageSetting).toBeVisible();
  }

  async mapCategories() {
    await this.homePage.marketplaceButton.click();
    await this.retailerMarketplacePage.openIntegration();
    await this.exporterSettingsPage.categoryMappingTab.click();
    const productCategorySelector = this.page
      .frameLocator('iframe[title="app-frame"]')
      .locator("#reason div")
      .first();
    await productCategorySelector.click();
    const testCategory = this.page
      .frameLocator('iframe[title="app-frame"]')
      .getByRole("option", { name: this.config.categoryName });
    await testCategory.click();
    await this.exporterSettingsPage.saveSettingsButton.click();
    await this.exporterSettingsPage.myProductsTab.click();
    await this.exporterSettingsPage.categoryMappingTab.click();
    const selectedCategory = this.page
      .frameLocator('iframe[title="app-frame"]')
      .getByText(this.config.categoryName);
    await expect(selectedCategory).toBeVisible();
  }
}

const test = base.extend<TestFixtures>({
  redcartApi: async ({ request }, use) => {
    const client = new RedcartClient(request);
    await use(client);
  },

  testData: async ({ redcartContext }, use) => {
    const { productName, channelName } = redcartContext.getExportInfo();
    const data: TestData = {
      productName: productName,
      channelName: channelName,
      loginCredentials: {
        login: login,
        password: password,
      },
    };
    await use(data);
  },

  performLogin: async ({ testData }, use) => {
    const loginFunction = async (page: Page) => {
      const loginPage = new LoginPage(page);

      await page.goto("");
      await loginPage.login(
        testData.loginCredentials.login,
        testData.loginCredentials.password
      );
    };

    await use(loginFunction);
  },

  redcartContext: async ({ page }, use) => {
    await use(new RedcartContext(page));
  },
});

export { test };
export const expect = test.expect;
