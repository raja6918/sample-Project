@data_management @solver_request @solver_switchScenario_Notification @notifications
Feature: Notifications: Switch Scenario from Notification.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2307" is added
    And I'm logged in with default credentials.

  Scenario: I want to be redirected to a solver request directly from a notification (From scenario page, After login)
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2307"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    And I clear notification
    When I click on launch button for solver request "AUT_Solver_Request"
    Then I wait for the Toast bar message
    Then I log out
    And I'm logged in with default credentials.
    Then I click on Notification bell icon
    And I click on link Solver request "AUT_Solver_Request"
    Then I verify that i redirected to "Solver request" page
    Then I verify that I am in correct Scenario page "aut_scenario_alt-2307"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"

  Scenario: I want to be redirected to a solver request directly to correct scenario from notification
    Given The Scenario "aut_scenario_alt-2307_Different_Scenario" is added
    Then I'm in the Solver Page for scenario "aut_scenario_alt-2307"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_NewRequest |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    And I clear notification
    When I click on launch button for solver request "AUT_Solver_NewRequest"
    And I go to scenario page
    Then I'm in the data home page for scenario "aut_scenario_alt-2307_Different_Scenario"
    Then I wait for the notification
    Then I click on Notification bell icon
    And I click on link Solver request "AUT_Solver_NewRequest"
    Then I get alert pop up saying "Switch scenarios"
    Then I click on button "SWITCH SCENARIOS"
    Then I verify that I am in correct Scenario page "aut_scenario_alt-2307"
    Then Verify successfully launch the Solver Request "AUT_Solver_NewRequest" with message "Completed successfully"

  Scenario: I want to cancel redirected to a solver request directly to correct scenario from notification
    Given The Scenario "aut_scenario_alt-2307_Diff_Scenario" is added
    Then I'm in the Solver Page for scenario "aut_scenario_alt-2307"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_NewRequest |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    And I clear notification
    When I click on launch button for solver request "AUT_Solver_NewRequest"
    And I go to scenario page
    Then I'm in the data home page for scenario "aut_scenario_alt-2307_Diff_Scenario"
    Then I wait for the notification
    Then I click on Notification bell icon
    And I click on link Solver request "AUT_Solver_NewRequest"
    Then I get alert pop up saying "Switch scenarios"
    Then I click on button "Cancel"
    And I close notification
    Then I verify that I am in "Data home" page
    And I verify that I am in scenario "aut_scenario_alt-2307_Diff_Scenario"

