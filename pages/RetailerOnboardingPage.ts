import { type Locator, type Page } from "@playwright/test";

export class RetailerOnboardingPage {
  readonly page: Page;
  readonly surveyB2BConfirmation: Locator;
  readonly surveyB2BDenial: Locator;
  readonly surveySellingPlatformSelector: Locator;
  readonly surveyIndustrySelector: Locator;
  readonly surveyDropshippingConfirmation: Locator;
  readonly surveyDropshippingDenial: Locator;
  readonly surveySubmitButton: Locator;
  readonly onboardingNextPageButton: Locator;
  readonly onboardingLastButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.surveyB2BConfirmation = page.locator(
      "(//input[@name='is_running_business'])[1]"
    );
    this.surveyB2BDenial = page.locator(
      "(//input[@name='is_running_business'])[2]"
    );
    this.surveySellingPlatformSelector = page.locator(
      "//div[@id='react-select-2-placeholder']"
    );
    this.surveyIndustrySelector = page.locator(".css-19bb58m");
    this.surveyDropshippingConfirmation = page.locator(
      "(//input[@name='wants_sell_dropshipping'])[1]"
    );
    this.surveyDropshippingDenial = page.locator(
      "(//input[@name='wants_sell_dropshipping'])[2]"
    );
    this.surveySubmitButton = page.locator("button[type='submit']");
  }

  async skipSurvey() {
    console.log(this.surveyB2BConfirmation);
    await this.surveyB2BDenial.click();
    await this.surveySellingPlatformSelector.click();
    await this.page.locator("//div[@id='react-select-2-option-0']").click();
    await this.surveyIndustrySelector.click();
    await this.page.locator("//div[@id='react-select-3-option-1']").click();
    await this.surveyDropshippingDenial.click();
    await this.surveySubmitButton.click();
  }

  async skipOnboarding() {
    let onboardingLastButton = this.page.getByRole("button", {
      name: "Go to Droplo",
    });

    for (let i = 0; i < 3; i++) {
      let onboardingNextPageButton = this.page
        .getByRole("button", { name: "Next" })
        .nth(i);

      await onboardingNextPageButton.click();
      await this.page.waitForTimeout(100);
    }
    await onboardingLastButton.click();
  }
}
