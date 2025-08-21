import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import World from './world';

let browser: Browser;

BeforeAll(async function () {
  browser = await chromium.launch();
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

Before(async function (this: World) {
  this.browser = browser;
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.initializePageObjects();
});

After(async function (this: World) {
  if (this.context) {
    await this.context.close();
  }
});

// Reset data between scenarios
Before({ tags: '@api' }, async function (this: World) {
  // Reset API data if needed
  // You could call a reset endpoint here
});

Before({ tags: '@ui' }, async function (this: World) {
  // Reset UI state if needed
  // Clear local storage, cookies, etc.
  await this.page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});