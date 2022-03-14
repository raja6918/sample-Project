@data_management @countries @addcountry
Feature: Country - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-522" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And I'm logged in with default credentials.

    Scenario: I want to add a new country
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then a new country is added to list

  Scenario: I want to add a new country without Country Code
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code |              |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then the Add Country button is not Active

  Scenario: I want to add a new country without Country Name
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name |              |
      | Currency     | aut_currency |
    Then the Add Country button is not Active

  Scenario: I want to add a new country without Currency
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ          |
      | Country Name | aut_country |
      | Currency     |             |
    Then the Add Country button is not Active

  Scenario: I want to add a new country with invalid Country Code
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | 11           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then The Error message "Country code must be two letters" for country form is displayed

  Scenario: I want to add a new country with special character Country Code
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code |    @#        |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then The Error message "Country code must be two letters" for country form is displayed

  Scenario: I want to add a new country with invalid Country Name
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | !aut_country |
      | Currency     | aut_currency |
    Then The Error message "Country name cannot start with space, number or special character" for country form is displayed

   Scenario: I want to add a new country with an existing code
    Given I'm in the countries page for scenario "aut_scenario_alt-522"
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

