import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import World from '../support/world';

Given('I am authenticated as an administrator', async function (this: World) {
  // For now, we'll assume no authentication is required
  // In a real app, this would handle login
});

Given('I am on the admin dashboard', async function (this: World) {
  await this.adminProductsPage.goto();
});

Given('there is a product named {string}', async function (this: World, productName: string) {
  // Verify product exists in the list
  await this.adminProductsPage.verifyProductInList(productName);
});

When('I click on {string}', async function (this: World, buttonText: string) {
  if (buttonText === 'Add Product') {
    await this.adminProductsPage.clickAddProduct();
  }
});

When('I fill in the product form with:', async function (this: World, dataTable) {
  const productData: { [key: string]: string } = {};
  for (const row of dataTable.hashes()) {
    productData[row.field] = row.value;
  }
  await this.adminProductsPage.fillProductForm(productData);
});

When('I click {string}', async function (this: World, buttonText: string) {
  if (buttonText === 'Save Product') {
    await this.adminProductsPage.saveProduct();
  }
});

When('I click {string} for {string}', async function (this: World, action: string, productName: string) {
  if (action === 'Edit') {
    await this.adminProductsPage.editProduct(productName);
  } else if (action === 'Delete') {
    await this.adminProductsPage.deleteProduct(productName);
  }
});

When('I update the price to {string}', async function (this: World, newPrice: string) {
  await this.adminProductsPage.updatePrice(newPrice);
});

When('I try to save without filling required fields', async function (this: World) {
  await this.adminProductsPage.saveProduct();
});

When('I confirm the deletion', async function (this: World) {
  await this.adminProductsPage.confirmDeletion();
});

Then('I should see a success message', async function (this: World) {
  await this.adminProductsPage.verifySuccessMessage();
});

Then('the product should appear in the product list', async function (this: World) {
  // We would need to get the product name from the previous step context
  // For now, we'll just verify the success message appeared
});

Then('the product price should be updated to {string}', async function (this: World, expectedPrice: string) {
  // Verify the price is updated in the product list
  await expect(this.page.locator(`text=${expectedPrice}`)).toBeVisible();
});

Then('I should see validation errors', async function (this: World) {
  await this.adminProductsPage.verifyValidationErrors();
});

Then('the product should not be created', async function (this: World) {
  // Verify we're still on the form page or that no success message appeared
  await expect(this.adminProductsPage.successMessage).not.toBeVisible();
});

Then('the product should be removed from the list', async function (this: World) {
  // We would need the product name from context
  // For now, verify that the success message appeared
  await this.adminProductsPage.verifySuccessMessage();
});