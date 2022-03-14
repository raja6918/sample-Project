@data_management @aircraftModels
Feature: Aircraft Model - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1112" is added
    And I'm logged in with default credentials.

  Scenario: I want to add a new Aircraft Model
    Given Aircraft models page for scenario "aut_scenario_alt-1112" is displayed
    When I add the aircraft model "aut_aircraft_model" with code "123"
    Then the new Aircraft model is displayed in the Aircraft models list

  Scenario: I want to validate Aircraft model Name error message
    Given Aircraft models page for scenario "aut_scenario_alt-1112" is displayed
    When I try to add an aircraft model with invalid name "#$%&"
    Then the message "Aircraft model Name cannot start with a space or special character" for Aircraft model form is displayed

  Scenario: I want to validate Aircraft model Code error message
    Given Aircraft models page for scenario "aut_scenario_alt-1112" is displayed
    When I try to add an aircraft model with invalid code "FA-#1"
    Then the message "Aircraft model should be in a format similar to: 777" for Position form is displayed

  Scenario: I want to add a new aircraft model using an existing code
    Given The aircraft models with following values are added
      | Name | aut_aircraft_model_2 |
      | Code |                  124 |
    Given Aircraft models page for scenario "aut_scenario_alt-1112" is displayed
    When I add the aircraft model "aut_aircraft_model" with code "124"
    Then the message "The aircraftModel code 124 already exists, please enter a different one." for Aircraft model form is displayed
