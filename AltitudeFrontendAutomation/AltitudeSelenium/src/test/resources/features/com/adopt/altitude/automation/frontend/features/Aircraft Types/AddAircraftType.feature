@data_management @aircraftTypes @addAircraftTypes
Feature: Aircraft Type- Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1111" is added
    And The aircraft models with following values are added
      | Name | aut_aircraft_model |
      | Code |                123 |
    And I'm logged in with default credentials.

  Scenario: I want to add a new Aircraft Type
    Given Aircraft types page for scenario "aut_scenario_alt-1111" is displayed
    When I enter the following data for an aircraft type
      | IATA Type     | TTT                |
      | Model         | aut_aircraft_model |
      | Name          | aut_aircraft_name  |
      | Rest Facility | C3 - Basic Seat    |
    And I enter crew complement as
      | Name  | CA  | FO | FA | PU |
      | Count |   1 |  1 |  1 | 1  |
    Then the new Aircraft type is displayed in the Aircraft types list

  Scenario: I want to validate Aircraft type Name error message
    Given Aircraft types page for scenario "aut_scenario_alt-1111" is displayed
    When I try to add an aircraft type with invalid name "#$%&"
    Then the message "Aircraft name cannot start with a space or special character" for Aircraft type form is displayed

  Scenario: I want to validate Aircraft type Name error message starting with space
    Given Aircraft types page for scenario "aut_scenario_alt-1111" is displayed
    When I try to add an aircraft type with invalid name "   "
    Then the message "Aircraft name cannot start with a space or special character" for Aircraft type form is displayed


  Scenario: I want to validate Aircraft type IATA type error message
    Given Aircraft types page for scenario "aut_scenario_alt-1111" is displayed
    When I try to add an aircraft type with invalid type "FA-#1"
    Then the message "Aircraft type should be in a format similar to: B77W or 773" for Aircraft type form is displayed

  Scenario: I want to add a new aircraft type using an existing code
    Given the aircraft type with default values is added
    Given Aircraft types page for scenario "aut_scenario_alt-1111" is displayed
    When I enter the following data for an aircraft type
      | IATA Type     |                123 |
      | Model         | aut_aircraft_model |
      | Name          | aut_aircraft_name  |
      | Rest Facility | C3 - Basic Seat    |
    And I enter crew complement as
      | Name  | CA  | FO | FA | PU |
      | Count |   1 |  1 |  1 |  1 |
    Then the message "The aircraftType code 123 already exists, please enter a different one." for Aircraft model form is displayed
