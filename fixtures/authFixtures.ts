import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

type AuthFixtures = {
  testRetailer: {
    phone: string;
    email: string;
    password: string;
  };
};

export const test = base.extend<AuthFixtures>({
  testRetailer: async ({}, use) => {
    await use(testRetailerData);
  },
});

export { expect } from "@playwright/test";

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

//Data below is generated only once per test to share credentials if needed
const testRetailerData: AuthFixtures["testRetailer"] = {
  phone: generatePolishMobileNumber(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
