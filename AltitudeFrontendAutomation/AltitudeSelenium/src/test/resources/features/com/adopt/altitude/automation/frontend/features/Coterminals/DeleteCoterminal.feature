@data_management @coterminals @deleteCoterminal
Feature: Coterminal - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1599" is added
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
    And the coterminal with default values is added
    And I'm logged in with default credentials.

  Scenario: I want to delete coterminal
    Given I'm in the coterminals page for scenario "aut_scenario_alt-1599"
    When I delete the coterminal "AUT-FE Transport"
    Then the message "Coterminal transport AUT-FE Transport has been successfully deleted." for coterminal is displayed as expected

  Scenario: I want to cancel delete coterminal
    Given I'm in the coterminals page for scenario "aut_scenario_alt-1599"
    And I cancel delete coterminal "AUT-FE Transport"
    Then verify successfully that no deletion happens for coterminal
