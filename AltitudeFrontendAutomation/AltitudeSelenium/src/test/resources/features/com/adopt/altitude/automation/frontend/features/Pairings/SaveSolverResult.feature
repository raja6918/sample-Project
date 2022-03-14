@data_management @pairing @Save_solver_result @demo_Solver
Feature: Pairing - Save Solver Result.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1560" is added
    And I'm logged in with default credentials.

  Scenario: I want to verify the loader is displayed and verify the loader message after saving the solver result
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1560"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                  |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    And Click on "Save Pairings" button and Then Verify loader is displayed with message "Saving pairings for crew group Combo Pilots"

  Scenario: I want to save solver request and verify the message after saving the solver result successfully
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1560"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    And Click on "Save Pairings" button and Then Verify that save has been successfully done with toast message "The pairings from solver request AUT_Solver_Request have been successfully saved for crew group Combo Pilots."
    Then Verify that "Save Pairings" is disabled after the save solver result completed

  Scenario:Once the Save button is disabled, it cannot be re-enabled by refreshing the page
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1560"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    And Click on "Save Pairings" button
    Then Verify that "Save Pairings" is disabled after refreshing the page

  Scenario: I want to verify the loader when import process fails, after saving the solver result
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1560"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then i get the preview ID of the current scenario
    Then i Delete the Preview ID
    And Click on "Save Pairings" button after deleting preview ID
    Then i get Error Message saying "Something went wrong. Your pairings could not be saved. If this problem persists, please contact your network administrator."

