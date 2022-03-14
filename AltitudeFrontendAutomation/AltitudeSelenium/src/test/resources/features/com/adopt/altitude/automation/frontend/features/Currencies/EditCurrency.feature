@data_management @currencies @editCurrency
Feature: Currency - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-602" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit currency name
    Given Currencies page for scenario "aut_scenario_alt-602" is displayed
   When I add the currency "aut_currency_AUT1" with code "XXX" and exchange rate "1"
   # When  I click on 'Filter' button
   # When I enter "aut_currency_AUT1" as currency name
    When I update the name to "NEWaut_currency" for currency "aut_currency_AUT1"
    Then the message "Currency NEWaut_currency (XXX) has been successfully updated." for currency is displayed

  Scenario: I want to edit currency code
    Given Currencies page for scenario "aut_scenario_alt-602" is displayed
    When I add the currency "aut_currency_AUT2" with code "XXY" and exchange rate "1"
   # When  I click on 'Filter' button
   # When I enter "aut_currency_AUT2" as currency name
    When I update the code to "YXX" for currency "aut_currency_AUT2"
    Then the message "Currency aut_currency_AUT2 (YXX) has been successfully updated." for currency is displayed

  Scenario: I want to edit currency exchange rate
    Given Currencies page for scenario "aut_scenario_alt-602" is displayed
    When I add the currency "aut_currency_AUT3" with code "XYY" and exchange rate "1"
    #When  I click on 'Filter' button
    #When I enter "aut_currency_AUT3" as currency name
    When I update the rate to "99" for currency "aut_currency_AUT3"
    Then the message "Currency aut_currency_AUT3 (XYY) has been successfully updated." for currency is displayed


