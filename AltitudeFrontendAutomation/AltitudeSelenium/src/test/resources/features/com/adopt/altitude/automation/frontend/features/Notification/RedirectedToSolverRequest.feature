@data_management @solver_request @solver_request_redirect @notifications
Feature: Notifications- Solver Redirect.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2234" is added
    And I'm logged in with default credentials.

  Scenario: I want to be redirected to a solver request directly from a Toast Bar success message
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2234"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    And I go to scenario page
    Then I wait for the Toast bar message
    And I click on Solver link "AUT_Solver_Request"
    Then I verify that i redirected to "Solver request" page
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"

  Scenario: I want to be redirected to a solver request directly from a notification with correct Notification count
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2234"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Test            |
      | Solver Task    | Build Pairings             |
      | Crew Group     | Combo Pilots               |
      | Rules          | baseline                   |
      | Recipe         | Arg                        |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Test"
    Then Verify successfully launch the Solver Request "AUT_Solver_Test" with message "Completed successfully"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Notification    |
      | Solver Task    | Build Pairings             |
      | Crew Group     | Combo Pilots               |
      | Rules          | baseline                   |
      | Recipe         | Arg                        |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Notification"
    Then I Check the notification bell icon is active with count
    And I go to scenario page
    Then I wait for the Toast bar message
    Then I Check the updated notification bell icon count is incremented to 1
    Then I click on Notification bell icon
    And I click on link Solver request "AUT_Solver_Notification"
    Then I verify that i redirected to "Solver request" page
    Then Verify successfully launch the Solver Request "AUT_Solver_Notification" with message "Completed successfully"
