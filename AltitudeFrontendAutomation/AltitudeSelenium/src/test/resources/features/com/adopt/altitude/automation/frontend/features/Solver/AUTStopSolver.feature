@data_management @solver_request @Stop_solver_request @demo_Solver
Feature: Solver Request - Stop.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1542" is added
    And I'm logged in with default credentials.

  Scenario: I want to stop solver request successfully and check message on progress bar
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request1   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request1"
    And I click on Stop button for solver request
    Then Verify successfully message "Stopped by user" is displayed in the progress bar after Solver Stop as expected

  Scenario: I want to stop solver request and check message in toast bar
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request2   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request2"
    And I click on Stop button for solver request
    Then verify successfully that solver request stopped with message "A signal has been sent to stop solver request AUT_Solver_Request2."

  Scenario:After Stopping, launch solver request, Launch Button should be enabled
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request3   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request3"
    And I click on Stop button for solver request
    Then Verify successfully "Launch" Button should be enabled after Solver Stop as expected

  Scenario: After launching the solver request, Stop Button should be disabled
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request4   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request4"
    And I click on Stop button for solver request
    Then Verify successfully "Stop" Button should be disabled after Solver Stop as expected

  Scenario: After launching the solver request, Preview Button should be disabled
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request5   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request5"
    And I click on Stop button for solver request
    Then Verify successfully "Preview" Button should be disabled after Solver Stop as expected

  Scenario: After launching the solver request, Favorite Button should be disabled
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1542"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request5   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver_Request5"
    And I click on Stop button for solver request
    Then Verify successfully "Favorite" Button should be disabled after Solver Stop as expected
