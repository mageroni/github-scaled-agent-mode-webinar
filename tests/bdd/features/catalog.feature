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

  Scenario: View product details
    Given I am on the products page
    When I click on a product "SmartLitter Pro 3000"
    Then I should see the product detail page
    And I should see the product name "SmartLitter Pro 3000"
    And I should see the product description
    And I should see the product price

  Scenario: Filter products by search
    Given I am on the products page
    When I search for "Smart"
    Then I should see products containing "Smart" in their name
    And I should not see products that don't match the search