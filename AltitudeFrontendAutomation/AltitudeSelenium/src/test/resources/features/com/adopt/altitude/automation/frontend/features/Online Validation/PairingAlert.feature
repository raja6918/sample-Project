@data_management @pairing @pairing_alert
Feature: Pairing - Alerts (Online Validation).

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1563" is added
    And I'm logged in with default credentials.

  @pairing_alert1
  Scenario: I want to validate Caution alert color
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
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
    Then I verify that I am in child tab containing "Pairings" details
    And I verify that Caution has yellow color with color code as "#E8BB00"

  @pairing_alert2
  Scenario: I want to validate Caution alert name text
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
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
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Caution alert and hover on "View Alerts"
    And I Verify alert text as "Caution" on View Alert of Caution

  @pairing_alert3
  Scenario: I want to validate Caution alert message area is removed from the action bar when the cursor is moved anywhere outside the area
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots             |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Caution alert and hover on "View Alerts"
    And I Verify alert text as "Caution" on View Alert of Caution
    Then I move cursor and hover on "Details" for Caution alert
    Then I verify that the alert area is removed

  @pairing_alert4
  Scenario: I want to validate line color of Caution alert
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots             |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Caution alert and hover on "View Alerts"
    And I verify that line colour as "rgba(232, 187, 0, 1)"

  @pairing_alert5
  Scenario: I want to validate Flag alert color
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    Then I verify that I am in child tab containing "Pairings" details
    And I verify that Flag has blue color with color code as "#5098E7"

  @pairing_alert6
  Scenario: I want to validate Flag alert name text
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Flag alert and hover on "View Alerts"
    And  I Verify alert text as "Flag" on View Alert of Flag

  @pairing_alert7
  Scenario: I want to validate Flag alert message area is removed from the action bar when the cursor is moved anywhere outside the area
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Flag alert and hover on "View Alerts"
    And I Verify alert text as "Flag" on View Alert of Flag
    Then I move cursor and hover on "Details" for Flag alert
    Then I verify that the alert area is removed

  @pairing_alert8
  Scenario: I want to validate line color of Flag alert
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1563"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then I verify that I am in child tab containing "Pairings" details
    And I Click on a pairing with Flag alert and hover on "View Alerts"
    And I verify that line colour as "rgba(80, 152, 231, 1)"

  @pairing_alert9
  Scenario: I want to validate Infraction alert color
    Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
    And I verify that Infraction has orange color with color code as "#FF650C"

  @pairing_alert10
  Scenario: I want to validate line color of Infraction alert
    Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
    And I verify that line colour as "rgba(255, 101, 12, 1)"

  @pairing_alert11
  Scenario: I want to Infraction alert name text
    Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
    And I Click on a pairing with Infraction alert and hover on "View Alerts"
    And  I Verify alert text as "Infraction" on View Alert of Infraction

  @pairing_alert12
  Scenario: I want to verify vertical scrollbar is displayed in the alert message area when the pairing has more than 3 alerts
   Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
   And  I Click on a pairing with Infraction alert and hover on "View Alerts" to get more than 3 alerts
  Then I click on ZoomIn multiple times
  Then I scroll to alert pairing hover on "View Alerts"
  And I hover on alert message
  Then  I verify that vertical scrollbar is displayed in the alert message area

  @pairing_alert13
  Scenario: I want to Infraction alert has Edit rule
    Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
    And I Click on a pairing with Infraction alert and hover on "View Alerts"
    And  I Verify alert text as "Infraction" on View Alert of Infraction
    Then I Verify "Infraction" alert contains "EDIT RULE" on Alert message

  @pairing_alert14
  Scenario: I want to Infraction alert message area is removed from the action bar when the cursor is moved anywhere outside the area
    Then I'm in the Pairing Page for scenario "aut_scenario_alt-1563"
    And I Click on a pairing with Infraction alert and hover on "View Alerts"
    And  I Verify alert text as "Infraction" on View Alert of Infraction
    Then I move cursor and hover on "Details" for Infraction alert
    Then I verify that the alert area is removed
