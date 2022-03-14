@data_management @solver_request @Launch_solver_request @demo_Solver
Feature: Solver Request - Launch.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1541" is added
    And I'm logged in with default credentials.

  Scenario: I want to launch solver request
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
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

  Scenario: On launch solver request, all fields in the Solver Request Details are deactivated
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify Successfully all fields in the Solver Request Details are deactivated

  Scenario: On launch solver request, status icon in the left panel changes from 'Ready to Launch' to Waiting
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully status icon in the left panel changes from 'Ready to Launch' to Waiting of "AUT_Solver_Request"

  Scenario: On launch solver request, status "Launching..." is displayed in the left pane
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully the status 'Launching...' is displayed in the left pane of "AUT_Solver_Request"

  Scenario: On launch solver request, message 'Launching...' is displayed in the progress bar as expected
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully message "Launching..." is displayed in the progress bar as expected for launch

  Scenario: On launch solver request, Stop Button should be enabled as expected
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request1   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request1"
    Then Verify successfully "Stop" Button should be enabled as expected

  Scenario: After launching the solver request, Launch Button should be disabled as expected
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1541"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots         |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request"
    Then Verify successfully "Launch" Button should be disabled as expected
