import { faker } from "@faker-js/faker";
import { Page, test as base } from "@playwright/test";
import dotenv from "dotenv";
import { LoginPage } from "../pages/LoginPage";
import { RetailerHomePage } from "../pages/RetailerHomePage";
import { RetailerOnboardingPage } from "../pages/RetailerOnboardingPage";
import { RetailerRegistrationPage } from "../pages/RetailerRegistrationPage";
import { RetailerSettingsPage } from "../pages/RetailerSettingsPage";

dotenv.config();

const retailerLogin = process.env.ACC_AUTH_LOGIN as string;
const retailerPassword = process.env.ACC_AUTH_PWD as string;

interface AuthFixtures {
  testRetailer: {
    phone: string;
    email: string;
    password: string;
  };
  validCredentials: {
    username: string;
    password: string;
  };
  performRetailerLogin: (
    page: Page,
    email: string,
    password: string
  ) => Promise<void>;
  performRetailerRegistration: (page: Page) => Promise<void>;
  performAccountDeletion: (page: Page) => Promise<void>;
  authContext: AuthContext;
}

class AuthContext {
  private page: Page;
  loginPage: LoginPage;
  homePage: RetailerHomePage;
  retailerRegistrationPage: RetailerRegistrationPage;
  retailerOnboardingPage: RetailerOnboardingPage;
  retailerSettingsPage: RetailerSettingsPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.homePage = new RetailerHomePage(page);
    this.retailerRegistrationPage = new RetailerRegistrationPage(page);
    this.retailerOnboardingPage = new RetailerOnboardingPage(page);
  }

  async goToLoginPage() {
    await this.page.goto("");
  }

  async goToRetailerRegistrationPage() {
    await this.goToLoginPage();
    await this.loginPage.registerRetailerButton.click();
  }

  async goToSettingsPage() {
    await this.homePage.settingsButton.click();
  }

  async skipOnboarding() {
    await this.retailerOnboardingPage.skipSurvey();
    await this.retailerOnboardingPage.skipOnboarding();
  }

  async deleteAccount() {
    await this.retailerSettingsPage.deleteAccount();
  }
}

const generatePolishMobileNumber = () => {
  const prefixes = [
    "50",
    "51",
    "53",
    "57",
    "60",
    "66",
    "69",
    "72",
    "73",
    "78",
    "79",
    "88",
  ];
  const prefix = faker.helpers.arrayElement(prefixes);
  const rest = faker.string.numeric(7);
  return prefix + rest;
};

export const test = base.extend<AuthFixtures>({
  testRetailer: async ({}, use) => {
    const testRetailerData = {
      phone: generatePolishMobileNumber(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await use(testRetailerData);
  },

  validCredentials: async ({}, use) => {
    await use({
      username: retailerLogin,
      password: retailerPassword,
    });
  },

  performRetailerLogin: async ({}, use) => {
    const loginFunction = async (
      page: Page,
      email: string,
      password: string
    ) => {
      const loginPage = new LoginPage(page);
      await page.goto("");
      await loginPage.login(email, password);
    };
    await use(loginFunction);
  },

  performRetailerRegistration: async ({ testRetailer }, use) => {
    const registrationFunction = async (page: Page) => {
      const retailerRegistrationPage = new RetailerRegistrationPage(page);
      await page.goto("");
      const loginPage = new LoginPage(page);
      await loginPage.registerRetailerButton.click();
      await retailerRegistrationPage.register(
        testRetailer.phone,
        testRetailer.email,
        testRetailer.password
      );
    };
    await use(registrationFunction);
  },

  performAccountDeletion: async ({}, use) => {
    const deletionFunction = async (page: Page) => {
      const homePage = new RetailerHomePage(page);
      const settingsPage = new RetailerSettingsPage(page);
      await homePage.settingsButton.click();
      await settingsPage.deleteAccount();
    };
    await use(deletionFunction);
  },

  authContext: async ({ page }, use) => {
    await use(new AuthContext(page));
  },
});

export const expect = test.expect;
