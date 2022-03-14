@data_management @aircraftTypes @editAircraftType
Feature: Aircraft Type - Update.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1113" is added
    And The aircraft models with following values are added
      | Name | aut_aircraft_model | aut_aircraft_model_secondary |
      | Code |                123 |                          345 |
    And the aircraft type with default values is added
    And I'm logged in with default credentials.

  Scenario: I want to update aircraft type
    Given Aircraft types page for scenario "aut_scenario_alt-1113" is displayed
    When I update the type to "A34" for aircraft type "123"
    Then the updated aircraft type is displayed in the aircraft types list

  Scenario: I want to update aircraft type name
    Given Aircraft types page for scenario "aut_scenario_alt-1113" is displayed
    When I update the name to "TUA 321" for aircraft type "123"
    Then the updated aircraft type is displayed in the aircraft types list

  Scenario: I want to update aircraft type rest facility
    Given Aircraft types page for scenario "aut_scenario_alt-1113" is displayed
    When I update the rest facility to "C2 - Reclining Seat" for aircraft type "123"
    Then the updated aircraft type is displayed in the aircraft types list

  Scenario: I want to update aircraft type model
    Given Aircraft types page for scenario "aut_scenario_alt-1113" is displayed
    When I update the model to "aut_aircraft_model_secondary" for aircraft type "123"
    Then the updated aircraft type is displayed in the aircraft types list

  @jenkin_failTest
  Scenario: I want to edit aircraft type using an existing code
    Given Aircraft types page for scenario "aut_scenario_alt-1113" is displayed
    And I enter the following data for an aircraft type
      | IATA Type     |                124 |
      | Model         | aut_aircraft_model |
      | Name          | aut_aircraft_name  |
      | Rest Facility | C3 - Basic Seat    |
    And I enter crew complement as
      | Name  | CA  | FO | FA |
      | Count |   1 |  1 |  1 |
    When I update the type to "124" for aircraft type "123"
    Then the message "The aircraftType code 124 already exists, please enter a different one." for Aircraft model form is displayed
