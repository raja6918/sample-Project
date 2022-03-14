@data_management @solver_request @Create_solver_request
Feature: Solver Request - Add.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1535" is added
    And I'm logged in with default credentials.

  Scenario: I want to create a solver request with mandatory data
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then verify successfully that solver request added with message "Solver request AUT_Solver_Request has been successfully added."

  Scenario: I want to create a solver request with invalid Request Name
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I enter "$%#%" Request Name
    Then verify the warning message "Solver name cannot start with a space or special character" is displayed

  Scenario: I want to create a solver request with all mandatory data except recipe
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         |                       |
    Then verify that the 'Add' button is disabled

  Scenario: I want to create a solver request with all mandatory data except rule
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          |                       |
      | Recipe         | Arg                   |
    Then verify that the 'Add' button is disabled

  Scenario: I want to create a solver request with all mandatory data except CrewGroup
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     |                       |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    Then verify that the 'Add' button is disabled

  Scenario: I want to create a solver request with all mandatory data except Solver Task
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    |                       |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    Then verify that the 'Add' button is disabled

  Scenario: I want to create a solver request with all mandatory data except Request Name
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   |                       |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    Then verify that the 'Add' button is disabled

  Scenario: I want to create a solver request with all data and validate description character count
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1535"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I enter description having characters greater than 1000
    And I click on 'Add' Button
    Then verify successfully that solver request added with message "Solver request AUT_Solver_Request has been successfully added."
    Then validate description character count as 1000 for Request "AUT_Solver_Request"













