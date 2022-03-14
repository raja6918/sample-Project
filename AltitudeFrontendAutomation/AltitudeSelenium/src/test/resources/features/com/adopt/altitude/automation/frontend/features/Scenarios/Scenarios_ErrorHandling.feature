@scenarios @scenariosErrorHandling
Feature: Scenario - Error Handling.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: I want to Delete an already Deleted Scenario.
   Given The Scenario "aut_scenario_error_handling" is added
    And I'm in the scenarios page
    When I open the Actions menu for the Scenario "aut_scenario_error_handling".
    And the "aut_scenario_error_handling" scenario is deleted through backend
    And I delete the Scenario
    Then the snackbar message "Scenario aut_scenario_error_handling can't be found. It may have been deleted by someone else." for scenarios is displayed

  Scenario: I want to Delete an Opened Scenario.
    Given I click on the Add Scenario button
    And I create the Scenario "aut_scenario_error_handling" with default values selecting the "Sierra UAT Template" template
    And I go to scenario page
    When I open the Actions menu for the Scenario "aut_scenario_error_handling"
    And I delete the Scenario
    Then the snackbar message "Can't delete an open scenario. Please close the scenario and try again." for scenarios is displayed
