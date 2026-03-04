import { Page, Locator, expect } from '@playwright/test';

export class AdminProductsPage {
  readonly page: Page;
  readonly addProductButton: Locator;
  readonly productForm: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly priceInput: Locator;
  readonly skuInput: Locator;
  readonly saveButton: Locator;
  readonly productList: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addProductButton = page.locator('[data-testid="add-product-btn"]');
    this.productForm = page.locator('[data-testid="product-form"]');
    this.nameInput = page.locator('[data-testid="product-name"]');
    this.descriptionInput = page.locator('[data-testid="product-description"]');
    this.priceInput = page.locator('[data-testid="product-price"]');
    this.skuInput = page.locator('[data-testid="product-sku"]');
    this.saveButton = page.locator('[data-testid="save-product-btn"]');
    this.productList = page.locator('[data-testid="products-list"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
  }

  async goto() {
    await this.page.goto('/admin');
  }

  async clickAddProduct() {
    await this.addProductButton.click();
  }

  async fillProductForm(productData: { [key: string]: string }) {
    if (productData.name) {
      await this.nameInput.fill(productData.name);
    }
    if (productData.description) {
      await this.descriptionInput.fill(productData.description);
    }
    if (productData.price) {
      await this.priceInput.fill(productData.price);
    }
    if (productData.sku) {
      await this.skuInput.fill(productData.sku);
    }
  }

  async saveProduct() {
    await this.saveButton.click();
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyProductInList(productName: string) {
    await expect(this.productList.locator(`text=${productName}`)).toBeVisible();
  }

  async editProduct(productName: string) {
    await this.page.click(`[data-testid="edit-${productName}"]`);
  }

  async deleteProduct(productName: string) {
    await this.page.click(`[data-testid="delete-${productName}"]`);
  }

  async confirmDeletion() {
    await this.page.click('[data-testid="confirm-delete"]');
  }

  async updatePrice(newPrice: string) {
    await this.priceInput.clear();
    await this.priceInput.fill(newPrice);
  }

  async verifyValidationErrors() {
    await expect(this.page.locator('.error-message')).toBeVisible();
  }

  async verifyProductNotInList(productName: string) {
    await expect(this.productList.locator(`text=${productName}`)).not.toBeVisible();
  }
}