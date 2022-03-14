@data_management @coterminals @editCoterminal
Feature: Coterminal - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-804" is added
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
      | Code         | AUT         | TUA           |
      | Name         | aut_station | aut_station_2 |
      | Country Code | ZZ          | ZZ            |
    And the coterminal with default values is added
    And I'm logged in with default credentials.

  Scenario: I want to update coterminal name
    Given I'm in the coterminals page for scenario "aut_scenario_alt-804"
    When I update the name to "AUT-FE Transport Updated" for coterminal "AUT-FE Transport"
    Then the updated coterminal is displayed in the coterminals list

  Scenario: I want to update coterminal type
    Given I'm in the coterminals page for scenario "aut_scenario_alt-804"
    When I update the coterminals type to "Taxi" for coterminal "AUT-FE Transport"
    Then the updated coterminal is displayed in the coterminals list

  Scenario: I want to update coterminal transport stations
    Given I'm in the coterminals page for scenario "aut_scenario_alt-804"
    When I update the coterminals departure station to "TUA" and arrival station to "AUT" for coterminal "AUT-FE Transport"
    Then the updated coterminal is displayed in the coterminals list


