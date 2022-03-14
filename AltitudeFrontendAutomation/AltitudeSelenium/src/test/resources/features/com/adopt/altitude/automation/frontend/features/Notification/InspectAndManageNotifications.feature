@data_management @solver_request @manage_notifications @notifications
Feature: Notifications- Inspect and Manage.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2235" is added
    And I'm logged in with default credentials.

  Scenario: I want to clear all messages and then verify "There are no notifications" is displayed in the popover
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2235"
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
    Then Verify successfully launch the Solver Request "AUT_Solver_Notification" with message "Completed successfully"
    Then I clear notification
    And I verify that "There are no notifications" is displayed in the popover

  Scenario: I want to verify message card contains Date and Time stamp when the notification was created
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2235"
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
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    Then I Check the notification bell icon is active with count
    Then I click on Notification bell icon
    And I validate Date and Time for notification, <Example: Notification Date: 26 February , 2021, Notification Time 10:06>

  Scenario: I want to verify message card contains Success/failure icon, scenario name, Trash can icon
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2235"
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
    Then I Check the notification bell icon is active with count
    Then I click on Notification bell icon
    And I verify that Notification details has either Solver's Fail or Completed image
    And I verify that Notification details has same scenario name "aut_scenario_alt-2235"
    And I verify that Notification details has same solver name "AUT_Solver_Request"
    And I verify that Notification details has Trash can icon
    And I verify that Notification details has Notification unread icon as New message indicator

  Scenario: I want to verify the (encircled) number above the icon is removed when notification is read
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2235"
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
    Then I click on Notification bell icon
    And I close notification
    Then I verify that encircled number above the bell icon is removed

  Scenario: I want to delete message individually
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2235"
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
    Then Verify successfully launch the Solver Request "AUT_Solver_Notification" with message "Completed successfully"
    Then I delete notification one by one
    And I verify that "There are no notifications" is displayed in the popover
