import { type Locator, type Page } from "@playwright/test";

export class RetailerMarketplacePage {
  readonly page: Page;
  readonly redcartIntegrationInstallButton: Locator;
  readonly redcartChannelNameInput: Locator;
  readonly redcartChannelNameSaveButton: Locator;
  readonly integrationDropdownButton: Locator;
  readonly openIntegrationButton: Locator;
  readonly deleteIntegrationButton: Locator;
  readonly deleteIntegrationConfirmationButton: Locator;
  readonly tokenInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.redcartIntegrationInstallButton = page.locator(
      "div:nth-child(4) > .pb-7 > .card > .p-5 > div:nth-child(2) > .d-flex > .btn-light-primary"
    );
    this.redcartChannelNameInput = page.locator("input[id^='input-text-']");
    this.redcartChannelNameSaveButton = page.getByRole("button", {
      name: "Save",
    });
    //locator below is not unique, but since button id is generated randomly we are using this locator until better option occurs
    this.integrationDropdownButton = page.locator(
      "//div[@class='card']//div[@class='dropdown']/button"
    );
    this.openIntegrationButton = page.getByRole("button", {
      name: "Go to integration",
    });
    this.deleteIntegrationButton = page.getByRole("button", {
      name: "Remove integration",
    });
    this.deleteIntegrationConfirmationButton = page.getByRole("button", {
      name: "Delete",
    });
    this.tokenInput = page
      .frameLocator("iframe[title='app-frame']")
      .locator("input[name='token']");
  }

  async installRedcart(name: string) {
    await this.redcartIntegrationInstallButton.click();
    await this.redcartChannelNameInput.fill(name);
    await this.redcartChannelNameSaveButton.click();
  }

  async openIntegration() {
    await this.integrationDropdownButton.click();
    await this.openIntegrationButton.click();
  }

  async deleteIntegration() {
    await this.integrationDropdownButton.click();
    await this.deleteIntegrationButton.click();
    await this.deleteIntegrationConfirmationButton.click();
  }
}
