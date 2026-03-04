# Testing Guide

This document provides comprehensive guidance for testing the OctoCAT Supply Chain Management application.

## Overview

Our testing strategy includes multiple layers:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint testing with property-based testing
- **BDD Tests**: Behavior-driven development with Gherkin scenarios
- **E2E Tests**: End-to-end testing with Playwright
- **Coverage**: 70% minimum coverage with target of 80-85%

## Test Structure

```
├── api/src/routes/          # API unit tests
│   ├── *.test.ts           # Standard unit tests
│   └── *.property.test.ts  # Property-based tests
├── frontend/src/test/       # Frontend unit tests
│   ├── components/         # Component tests
│   └── contexts/           # Context tests
└── tests/bdd/              # BDD tests (shared)
    ├── features/           # Gherkin feature files
    ├── steps/              # Step definitions
    ├── pages/              # Page Objects
    └── support/            # Hooks and world
```

## Running Tests

### All Tests
```bash
npm test                    # Run all tests
npm run test:coverage      # Run with coverage report
```

### API Tests
```bash
npm run test:api           # API unit tests
npm run test:coverage --workspace=api  # With coverage
```

### Frontend Tests
```bash
npm run test:frontend      # Frontend unit tests
npm run test:coverage --workspace=frontend  # With coverage
```

### E2E Tests
```bash
npm run test:install-playwright  # Install Playwright browsers (first time)
npm run test:e2e               # Run E2E tests
npm run test:e2e:headed        # Run with browser visible
npm run test:e2e:report        # View test report
```

### BDD Tests
```bash
npm run test:bdd           # Run Cucumber BDD tests
```

## Writing Tests

### Unit Tests (API)

Use Vitest with Supertest for API testing:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
```

### Unit Tests (Frontend)

Use Vitest with React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Welcome from '../components/Welcome';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Welcome Component', () => {
  it('renders welcome heading', () => {
    renderWithProviders(<Welcome />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
```

### BDD Feature Files

Write features in Gherkin syntax:

```gherkin
Feature: Product Catalog
  As a customer
  I want to browse and view product details
  So that I can make informed purchasing decisions

  Background:
    Given the application is running
    And the product catalog contains sample data

  Scenario: View product catalog
    Given I am on the homepage
    When I navigate to the products page
    Then I should see a list of available products
    And each product should display name, price, and image
```

### Step Definitions

Implement step definitions with Playwright:

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import World from '../support/world';

Given('I am on the homepage', async function (this: World) {
  await this.catalogPage.goto();
});

When('I navigate to the products page', async function (this: World) {
  await this.catalogPage.navigateToProducts();
});

Then('I should see a list of available products', async function (this: World) {
  await this.catalogPage.verifyProductsVisible();
});
```

### Page Objects

Create reusable page objects:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly productsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsGrid = page.locator('[data-testid="products-grid"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyProductsVisible() {
    await expect(this.productsGrid).toBeVisible();
  }
}
```

## Test Data Management

### Seed Data
- Use existing `seedData.ts` for consistent test data
- API tests use in-memory data that resets between test suites
- Frontend tests mock API responses

### Data Isolation
- Each test should be independent
- Use `beforeEach` hooks to reset state
- Mock external dependencies

## Test-Driven Development (TDD)

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Property-Based Testing

Use fast-check for property-based tests:

```typescript
import fc from 'fast-check';

it('should handle various valid product names', () => {
  fc.assert(fc.property(
    fc.string({ minLength: 1, maxLength: 100 }),
    async (name) => {
      // Test with generated data
      const product = { name, /* other fields */ };
      const response = await request(app).post('/products').send(product);
      expect([201, 400]).toContain(response.status);
    }
  ));
});
```

## Coverage Requirements

### Minimum Thresholds (Current)
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

### Target Thresholds (Phase 2)
- Lines: 80-85%
- Functions: 80-85%
- Branches: 80-85%
- Statements: 80-85%

### Excluded from Coverage
- Configuration files
- Test files
- Type definitions (*.d.ts)
- Build artifacts

## Debugging Tests

### Frontend Tests
```bash
# Run tests in watch mode
npm run test --workspace=frontend -- --watch

# Debug specific test file
npm run test --workspace=frontend -- Navigation.test.tsx
```

### E2E Tests
```bash
# Run with browser visible
npm run test:e2e:headed

# Debug mode
npx playwright test --debug

# View trace
npx playwright show-trace trace.zip
```

### BDD Tests
```bash
# Run specific feature
npx cucumber-js tests/bdd/features/catalog.feature

# Generate step definitions
npx cucumber-js --dry-run --format snippets
```

## Data Test IDs

Use `data-testid` attributes for stable selectors:

```tsx
// Component
<div data-testid="products-grid">
  <div data-testid="product-card">
    <h3 data-testid="product-name">{product.name}</h3>
    <p data-testid="product-price">${product.price}</p>
  </div>
</div>

// Test
const productsGrid = page.locator('[data-testid="products-grid"]');
const productName = page.locator('[data-testid="product-name"]');
```

## CI/CD Integration

### GitHub Actions Workflow
- **Lint**: Code style and quality checks
- **Unit Tests**: Run in parallel for API and Frontend
- **E2E Tests**: Full application testing
- **Coverage**: Upload to Codecov
- **Artifacts**: Store test reports and traces

### Coverage Reporting
- HTML reports generated in `coverage/` directories
- JSON reports for CI integration
- Failed builds if coverage below threshold

## Best Practices

### General
- Keep tests simple and focused
- Use descriptive test names
- Test behavior, not implementation
- Write tests before fixing bugs

### API Tests
- Test all HTTP methods and status codes
- Validate response structure and data types
- Test error conditions and edge cases
- Use property-based testing for validation

### Frontend Tests
- Test user interactions and workflows
- Mock external dependencies (APIs)
- Test accessibility features
- Use React Testing Library best practices

### E2E Tests
- Focus on critical user journeys
- Keep tests independent and isolated
- Use Page Object Model for maintainability
- Handle async operations properly

### BDD Tests
- Write scenarios from user perspective
- Use business language, not technical terms
- Keep scenarios focused and concise
- Reuse step definitions across features

## Troubleshooting

### Common Issues

**Coverage below threshold**
- Add tests for uncovered code paths
- Check excluded files in coverage config
- Review complex conditional logic

**E2E tests flaky**
- Add proper waits for async operations
- Use stable selectors (data-testid)
- Ensure test data consistency
- Check for race conditions

**BDD steps not found**
- Verify step definition files are loaded
- Check step pattern matching
- Ensure proper import paths

**Frontend tests failing**
- Mock all external dependencies
- Provide required context providers
- Check async operations and promises

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure coverage thresholds are met
3. Add BDD scenarios for user-facing features
4. Update this documentation for new patterns
5. Run full test suite before submitting PR

For questions or issues, please check the existing tests for examples or reach out to the development team.