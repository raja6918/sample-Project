@data_management @aircraftModels @editAircraftModel
Feature: Aircraft Model - Update.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1114" is added
    And The aircraft models with following values are added
      | Name | aut_aircraft_model |
      | Code |                123 |
    And I'm logged in with default credentials.

  Scenario: I want to update aircraft model name
    Given Aircraft models page for scenario "aut_scenario_alt-1114" is displayed
    When I update the name to "AUT-FE model Updated" for aircraft model "aut_aircraft_model"
    Then the updated aircraft model is displayed in the aircraft models list

  Scenario: I want to update aircraft model code
    Given Aircraft models page for scenario "aut_scenario_alt-1114" is displayed
    When I update the code to "456" for aircraft model "aut_aircraft_model"
    Then the updated aircraft model is displayed in the aircraft models list

  Scenario: I want to update aircraft model code using an existing code
    Given The aircraft models with following values are added
      | Name | aut_aircraft_model_2 |
      | Code |                  124 |
    Given Aircraft models page for scenario "aut_scenario_alt-1114" is displayed
    When I update the code to "123" for aircraft model "aut_aircraft_model_2"
    Then the message "The aircraftModel code 123 already exists, please enter a different one." for Aircraft model form is displayed
