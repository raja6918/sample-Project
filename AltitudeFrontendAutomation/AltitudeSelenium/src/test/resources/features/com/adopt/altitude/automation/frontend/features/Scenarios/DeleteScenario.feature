@scenarios
Feature: Scenario - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-494" is added
    And I'm logged in with default credentials.

  @deleteScenario
  Scenario: I want to Delete a Scenario.
    Given I open the Actions menu for the Scenario "aut_scenario_alt-494"
    When I delete the Scenario
    Then The Scenario "aut_scenario_alt_494" is deleted from the list
