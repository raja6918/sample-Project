@data_management @currencies
Feature: Currency - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-566" is added
    And I'm logged in with default credentials.

  @addCurrency
  Scenario: I want to add a new currency
    Given Currencies page for scenario "aut_scenario_alt-566" is displayed
    When I add the currency "aut_currency" with code "AUT" and exchange rate "1"
    Then the new currency is displayed in the currencies list

  Scenario: I want to validate Code error message
    Given Currencies page for scenario "aut_scenario_alt-566" is displayed
    When I try to add the currency "aut_currency" with code "123" and exchange rate "1"
    Then the message "Currency code must be three letters" for currency form is displayed

  Scenario: I want to validate Name error message
    Given Currencies page for scenario "aut_scenario_alt-566" is displayed
    When I try to add the currency "#$%" with code "AUT" and exchange rate "1"
    Then the message "Currency name cannot start with a space or special character" for currency form is displayed

  Scenario: I want to validate Exchange rate error message
    Given Currencies page for scenario "aut_scenario_alt-566" is displayed
    When I try to add the currency "aut_currency" with code "AUT" and exchange rate "abc"
    Then the message "Exchange rate must be a number greater than zero" for currency form is displayed

  Scenario: I want to add a new currency with an existing code
    Given Currencies page for scenario "aut_scenario_alt-566" is displayed
    And The currencies with following values are added
      | Name          | aut_currency_2 |
      | Code          | AUT            |
      | Exchange Rate |            1.0 |
    When I add the currency "aut_currency" with code "AUT" and exchange rate "1"
    Then The Error message "The currency code AUT already exists, please enter a different one." for crew base form is displayed
