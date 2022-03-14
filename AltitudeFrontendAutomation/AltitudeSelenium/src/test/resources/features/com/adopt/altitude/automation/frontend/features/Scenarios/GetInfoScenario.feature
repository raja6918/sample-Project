@scenarios
Feature: Scenario - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_get_info" is added
    And I'm logged in with default credentials.

  @editScenario
  Scenario: I want to Edit a Scenario name.
    Given I open the Scenario Info drawer for Scenario "aut_scenario_get_info"
    When I modify the Scenario name to "aut_scenario_info_updated"
    Then The Scenario name "aut_scenario_info_updated" is updated in the table
