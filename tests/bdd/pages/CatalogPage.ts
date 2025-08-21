import { Page, Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly productsGrid: Locator;
  readonly searchInput: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsGrid = page.locator('[data-testid="products-grid"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.productCards = page.locator('[data-testid="product-card"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToProducts() {
    await this.page.click('text=Products');
    await this.page.waitForURL('**/products');
  }

  async clickProduct(productName: string) {
    await this.page.click(`text=${productName}`);
  }

  async searchForProducts(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    await this.page.keyboard.press('Enter');
  }

  async verifyProductsVisible() {
    await expect(this.productCards.first()).toBeVisible();
  }

  async verifyProductDetails(productName: string) {
    await expect(this.page.locator('h1')).toContainText(productName);
  }

  async verifySearchResults(searchTerm: string) {
    const productNames = await this.productCards.locator('h3').allTextContents();
    const matchingProducts = productNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(matchingProducts.length).toBeGreaterThan(0);
  }

  async verifyProductCardElements() {
    const firstCard = this.productCards.first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Product name
    await expect(firstCard.locator('text=/\\$/")).toBeVisible(); // Price
    await expect(firstCard.locator('img')).toBeVisible(); // Image
  }
}