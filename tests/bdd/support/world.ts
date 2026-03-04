import { Browser, BrowserContext, Page } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { AdminProductsPage } from '../pages/AdminProductsPage';

export class World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  catalogPage!: CatalogPage;
  adminProductsPage!: AdminProductsPage;
  
  // API testing
  apiBaseUrl = 'http://localhost:3000';
  lastResponse: any;
  lastResponseStatus: number = 0;

  constructor() {
    // Initialize page objects when page is available
  }

  initializePageObjects() {
    this.catalogPage = new CatalogPage(this.page);
    this.adminProductsPage = new AdminProductsPage(this.page);
  }
}

export default World;