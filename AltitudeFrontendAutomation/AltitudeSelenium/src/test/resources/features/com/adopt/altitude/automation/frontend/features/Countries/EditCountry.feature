@data_management @countries @editCountry
Feature: Country - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-666" is added
    And The currencies with following values are added
      | Name          | aut_currency | aut_currency1 |
      | Code          | AUT          | TUA           |
      | Exchange Rate | 1.0          | 1.0           |
    And I'm logged in with default credentials.

  Scenario: I want to edit Country code
    Given I'm in the countries page for scenario "aut_scenario_alt-666"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | AA           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
   When I update the code to "YY" for country "aut_country"
    Then the updated country is displayed in the countries list
   #Then the message "Country aut_country has been successfully updated." for country is displayed

  Scenario: I want to edit Country name
    Given I'm in the countries page for scenario "aut_scenario_alt-666"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | AB           |
      | Country Name | aut_country1 |
      | Currency     | aut_currency |
    When I update the name to "aut_country_updated" for country "aut_country1"
    Then the updated country is displayed in the countries list
#    Then the message "Country aut_country_updated has been successfully updated." for country is displayed

  Scenario: I want to edit Country currency
    Given I'm in the countries page for scenario "aut_scenario_alt-666"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | AC           |
      | Country Name | aut_country2 |
      | Currency     | aut_currency |
    When I update the currency to "TUA" for country "aut_country2"
    Then the updated country is displayed in the countries list
#    Then the message "Country aut_country2 has been successfully updated." for country is displayed

  Scenario: I want to edit Country code with an existing code
    Given I'm in the countries page for scenario "aut_scenario_alt-666"
    And I click on the 'Add' new country button
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then The Error message "The country code ZZ already exists, please enter a different one." for country form is displayed
