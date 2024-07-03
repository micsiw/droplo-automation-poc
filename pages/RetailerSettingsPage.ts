import { type Locator, type Page } from "@playwright/test";

export class RetailerSettingsPage {
  readonly page: Page;
  readonly deleteAccButton: Locator;
  readonly deleteConfirmationCheckbox: Locator;
  readonly deleteAccConfirmationButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deleteAccButton = page.getByRole("button", { name: "Delete" });
    this.deleteConfirmationCheckbox = page.getByLabel(
      "I want to delete my account"
    );
    this.deleteAccConfirmationButton = page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete account" });
  }

  async deleteAccount() {
    await this.deleteAccButton.click();
    await this.deleteConfirmationCheckbox.click();
    await this.deleteAccConfirmationButton.click();
  }
}
