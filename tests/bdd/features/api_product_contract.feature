Feature: API Product Contract
  As a client application
  I want to interact with the product API
  So that I can manage product data programmatically

  Background:
    Given the API is running on "http://localhost:3000"

  Scenario: Get all products
    When I send a GET request to "/products"
    Then the response status should be 200
    And the response should be a JSON array
    And each product should have required fields:
      | field       | type   |
      | productId   | number |
      | name        | string |
      | description | string |
      | price       | number |
      | sku         | string |

  Scenario: Get a specific product
    Given there is a product with ID 1
    When I send a GET request to "/products/1"
    Then the response status should be 200
    And the response should be a JSON object
    And the product should have all required fields

  Scenario: Create a new product
    When I send a POST request to "/products" with:
      """
      {
        "productId": 999,
        "supplierId": 1,
        "name": "Test Product",
        "description": "A test product",
        "price": 99.99,
        "sku": "TEST-001",
        "unit": "piece"
      }
      """
    Then the response status should be 201
    And the response should contain the created product data

  Scenario: Update an existing product
    Given there is a product with ID 1
    When I send a PUT request to "/products/1" with updated data
    Then the response status should be 200
    And the response should contain the updated product data

  Scenario: Handle product not found
    When I send a GET request to "/products/99999"
    Then the response status should be 404

  Scenario: Validate required fields for product creation
    When I send a POST request to "/products" with missing required fields
    Then the response status should be 400
    And the response should contain validation errors