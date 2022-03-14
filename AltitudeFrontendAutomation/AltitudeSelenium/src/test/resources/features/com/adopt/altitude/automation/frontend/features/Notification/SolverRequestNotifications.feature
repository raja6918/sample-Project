@data_management @solver_request @solver_request_implement @notifications
Feature: Notifications: Implement Solver Notification.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2236" is added
    And I'm logged in with default credentials.

  Scenario: I want to Implement Notification service for solver requests
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2236"
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
    And I verify that Notification details has same scenario name "aut_scenario_alt-2236"
    And I verify that Notification details has same solver name "AUT_Solver_Request"
    And I verify that Notification details has either Solver's Fail or Completed image

