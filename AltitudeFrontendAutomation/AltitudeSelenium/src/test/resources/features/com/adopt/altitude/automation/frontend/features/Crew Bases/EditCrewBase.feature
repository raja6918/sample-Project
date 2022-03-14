@data_management @crewBases @editCrewBase
Feature: Crew Base - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-672" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate |          1.0 |
    And The countries with following values are added
      | Name          | aut_country | aut_country_2 |
      | Code          | ZZ          | YY            |
      | Currency Code | AUT         | AUT           |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         | TUA           | UTA           |
      | Name         | aut_station | aut_station_2 | aut_station_3 |
      | Country Code | ZZ          | ZZ            | YY            |
    And The crew base with default values is added
    And I'm logged in with default credentials.

  Scenario: I want to edit crew base name
    Given I'm in the crew bases page for scenario "aut_scenario_alt-672"
    When I update the name to "aut_crewbase_updated" for crew base "aut_crewbase"
    Then the updated crew base is displayed in the crew bases list

  Scenario: I want to edit crew base code
    Given I'm in the crew bases page for scenario "aut_scenario_alt-672"
    When I update the code to "TUA" for crew base "aut_crewbase"
    Then the updated crew base is displayed in the crew bases list

  Scenario: I want to edit crew base country
    Given I'm in the crew bases page for scenario "aut_scenario_alt-672"
    When I update the country to "aut_country_2, YY" for crew base "aut_crewbase"
    And I update the station to "UTA - aut_station_3" for the selected country
    Then the updated crew base is displayed in the crew bases list

  Scenario: I want to edit crew base station
    Given I'm in the crew bases page for scenario "aut_scenario_alt-672"
    When I update the station from "AUT - aut_station" to "TUA - aut_station_2" for crew base "aut_crewbase"
    Then the updated crew base is displayed in the crew bases list

  Scenario: I want to edit Country code with an existing code
    Given I'm in the crew bases page for scenario "aut_scenario_alt-672"
    And I click on the 'Add' new crew base button
    And I provide the following data in the crew base form
      | Base Code | TUA               |
      | Base Name | aut_crewbase_2    |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    When I update the code to "TUA" for crew base "aut_crewbase"
    Then The Error message "The base code TUA already exists, please enter a different one." for crew base form is displayed
