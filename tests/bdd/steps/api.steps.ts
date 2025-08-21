import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { request } from '@playwright/test';
import World from '../support/world';

Given('the API is running on {string}', async function (this: World, apiUrl: string) {
  this.apiBaseUrl = apiUrl;
  // Verify API is accessible
  const apiContext = await request.newContext();
  const response = await apiContext.get(`${this.apiBaseUrl}/products`);
  expect(response.status()).toBe(200);
  await apiContext.dispose();
});

Given('there is a product with ID {int}', async function (this: World, productId: number) {
  const apiContext = await request.newContext();
  const response = await apiContext.get(`${this.apiBaseUrl}/products/${productId}`);
  expect(response.status()).toBe(200);
  await apiContext.dispose();
});

When('I send a GET request to {string}', async function (this: World, endpoint: string) {
  const apiContext = await request.newContext();
  this.lastResponse = await apiContext.get(`${this.apiBaseUrl}${endpoint}`);
  this.lastResponseStatus = this.lastResponse.status();
  await apiContext.dispose();
});

When('I send a POST request to {string} with:', async function (this: World, endpoint: string, docString: string) {
  const apiContext = await request.newContext();
  const payload = JSON.parse(docString);
  this.lastResponse = await apiContext.post(`${this.apiBaseUrl}${endpoint}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  this.lastResponseStatus = this.lastResponse.status();
  await apiContext.dispose();
});

When('I send a PUT request to {string} with updated data', async function (this: World, endpoint: string) {
  const apiContext = await request.newContext();
  const updateData = {
    name: 'Updated Product Name',
    price: 199.99,
  };
  this.lastResponse = await apiContext.put(`${this.apiBaseUrl}${endpoint}`, {
    data: updateData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  this.lastResponseStatus = this.lastResponse.status();
  await apiContext.dispose();
});

When('I send a POST request to {string} with missing required fields', async function (this: World, endpoint: string) {
  const apiContext = await request.newContext();
  const incompleteData = {
    name: 'Incomplete Product',
    // Missing required fields like price, sku, etc.
  };
  this.lastResponse = await apiContext.post(`${this.apiBaseUrl}${endpoint}`, {
    data: incompleteData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  this.lastResponseStatus = this.lastResponse.status();
  await apiContext.dispose();
});

Then('the response status should be {int}', async function (this: World, expectedStatus: number) {
  expect(this.lastResponseStatus).toBe(expectedStatus);
});

Then('the response should be a JSON array', async function (this: World) {
  const responseBody = await this.lastResponse.json();
  expect(Array.isArray(responseBody)).toBe(true);
});

Then('the response should be a JSON object', async function (this: World) {
  const responseBody = await this.lastResponse.json();
  expect(typeof responseBody).toBe('object');
  expect(Array.isArray(responseBody)).toBe(false);
});

Then('each product should have required fields:', async function (this: World, dataTable) {
  const responseBody = await this.lastResponse.json();
  const requiredFields = dataTable.hashes();
  
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
  
  const firstProduct = responseBody[0];
  for (const field of requiredFields) {
    expect(firstProduct).toHaveProperty(field.field);
    if (field.type === 'number') {
      expect(typeof firstProduct[field.field]).toBe('number');
    } else if (field.type === 'string') {
      expect(typeof firstProduct[field.field]).toBe('string');
    }
  }
});

Then('the product should have all required fields', async function (this: World) {
  const responseBody = await this.lastResponse.json();
  const requiredFields = ['productId', 'name', 'description', 'price', 'sku'];
  
  for (const field of requiredFields) {
    expect(responseBody).toHaveProperty(field);
  }
});

Then('the response should contain the created product data', async function (this: World) {
  const responseBody = await this.lastResponse.json();
  expect(responseBody).toHaveProperty('productId');
  expect(responseBody).toHaveProperty('name');
});

Then('the response should contain the updated product data', async function (this: World) {
  const responseBody = await this.lastResponse.json();
  expect(responseBody).toHaveProperty('name', 'Updated Product Name');
  expect(responseBody).toHaveProperty('price', 199.99);
});

Then('the response should contain validation errors', async function (this: World) {
  // In a real API, this would check for specific error message structure
  expect(this.lastResponseStatus).toBe(400);
});