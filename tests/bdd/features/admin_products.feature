Feature: Admin Product Management
  As an administrator
  I want to manage products in the catalog
  So that I can maintain accurate product information

  Background:
    Given the application is running
    And I am authenticated as an administrator

  Scenario: Create a new product
    Given I am on the admin dashboard
    When I click on "Add Product"
    And I fill in the product form with:
      | field       | value                    |
      | name        | CatTracker AI Collar     |
      | description | Smart tracking collar    |
      | price       | 149.99                   |
      | sku         | CAT-COLLAR-002           |
    And I click "Save Product"
    Then I should see a success message
    And the product should appear in the product list

  Scenario: Edit an existing product
    Given I am on the admin dashboard
    And there is a product named "SmartLitter Pro 3000"
    When I click "Edit" for "SmartLitter Pro 3000"
    And I update the price to "179.99"
    And I click "Save Product"
    Then I should see a success message
    And the product price should be updated to "179.99"

  Scenario: Validate product form requirements
    Given I am on the admin dashboard
    When I click on "Add Product"
    And I try to save without filling required fields
    Then I should see validation errors
    And the product should not be created

  Scenario: Delete a product
    Given I am on the admin dashboard
    And there is a product named "Test Product"
    When I click "Delete" for "Test Product"
    And I confirm the deletion
    Then the product should be removed from the list