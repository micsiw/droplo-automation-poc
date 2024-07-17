import { APIRequestContext, Page, test as base } from "@playwright/test";
import dotenv from "dotenv";
import { LoginPage } from "../pages/LoginPage";

dotenv.config();

const redcartApiKey = process.env.REDCART_REQUEST_KEY as string;
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

const test = base.extend<TestFixtures>({
  redcartApi: async ({ request }, use) => {
    const client = new RedcartClient(request);
    await use(client);
  },

  testData: async ({}, use) => {
    const data: TestData = {
      productName: "Some example product added by cypress: 1680257521361",
      channelName: "Redcart - automated test",
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
});

export { test };
export const expect = test.expect;

// export const calculatePriceWithMargin = (buyPrice: number, testData: TestData) => {
//   return (buyPrice * testData.priceWithMarginMultiplier + testData.priceWithMarginAddition).toFixed(2);
// };
