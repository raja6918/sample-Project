@data_management @accommodations @editAccommodation
Feature: Accommodation - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-204-1695" is added
    And The currencies with following values are added
      | Name          | currency_1 | currency_2 |
      | Code          | AUT        | TUA        |
      | Exchange Rate | 1.0        | 1.0        |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And the accommodation with default values is added
    And I'm logged in with default credentials.

  Scenario: I want to update accommodation name
    Given I'm in the accommodations page for scenario "aut_scenario_alt-204-1695"
    When I update the name to "aut_accommodation updated" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list

  Scenario: I want to update accommodation type
    Given I'm in the accommodations page for scenario "aut_scenario_alt-204-1695"
    When I update the accommodations type to "Day room" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list

  Scenario: I want to update accommodation nightly rate
    Given I'm in the accommodations page for scenario "aut_scenario_alt-204-1695"
    When I update the accommodations nightly rate to "999.00" in currency "TUA" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list

  Scenario: I want to update accommodation rooms capacity
    Given I'm in the accommodations page for scenario "aut_scenario_alt-204-1695"
    When I update the accommodations rooms capacity to "50" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list
