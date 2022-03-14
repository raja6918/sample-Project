@data_management @coterminals @addCoterminal
Feature: Coterminal - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-668" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT              | TUA            |
      | Name         | aut_station_from | aut_station_to |
      | Country Code | ZZ               | ZZ             |
    And I'm logged in with default credentials.

  @addCoterminal
  Scenario: I want to add a new cotermnal
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    When I enter the following data for a coterminal
      | Departure Station      | AUT - aut_station_from     |
      | Arrival Station        | TUA - aut_station_to       |
      | Transport Name         | AUT-FE Transport           |
      | Transport Type         | Taxi                       |
      | Maximum Passengers     | 2                          |
      | Timing Start           | 15:00                      |
      | Timing End             | 15:00                      |
      | Transport Time         | 30                         |
      | Connection Time Before | 60                         |
      | Connection Time After  | 60                         |
      | Cost                   | 125                        |
      | Currency               | AUT                        |
      | Cost Basis             | Per crew member            |
      | Credit Cost            | 60                         |
      | Credit Applies to      | Flight deck crew only      |
    And I add the following extra times
      | Extra Time       | 30    |
      | Extra Time Start | 18:00 |
      | Extra Time End   | 21:00 |
    And I add the coterminal transport
    Then a new coterminal is added to list

  Scenario: I want to add a new coterminal using invalid Name
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "$%#%" coterminal name
    Then the message "Transport name cannot start with a space or special character" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid maximum passengers
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "qbc" maximum passengers
    Then the message "Maximum passengers must be a positive number" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid transport time
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" transport time
    Then the message "Transport time must be a positive number (no decimals)" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid connection time before
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" connection time before
    Then the message "Must be a positive number" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid connection time after
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" connection time after
    Then the message "Must be a positive number" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid transport cost
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" transport cost
    Then the message "Transport cost must be a positive decimal number" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid credit cost
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" credit cost
    Then the message "Credit cost must be a positive number" for coterminal form is displayed

  Scenario: I want to add a new coterminal using invalid extra time
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I enter "#abc" extra time
    Then the message "Extra time must be a positive number" for coterminal form is displayed

  Scenario: I want to add more than 5 extra times
    Given I'm in the coterminals page for scenario "aut_scenario_alt-668"
    And I open the add new coterminal drawer
    When I click Add Extra time 5 times
    Then the Add Extra time button is disabled
