@data_management @solver_request @Edit_solver_request
Feature: Solver Request - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1536" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit an existing solver request
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the name to "AUT_Solver_Request_updated" for "AUT_Solver_Request" Request Name
    Then Verify successfully the request name "AUT_Solver_Request_updated" is updated as expected

  Scenario: I want to edit an existing solver request with an invalid request name
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the name to " %#%" for "AUT_Solver_Request" Request Name
    Then verify the warning message "Solver name cannot start with a space or special character" is displayed

  Scenario: I want to edit an existing solver request by changing crew group
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the crew group "Combo Pilots" to "CR7 Pilots" of request "AUT_Solver_Request"
    Then Verify successfully the crew group  "CR7 Pilots" is updated as expected

  @wip
  Scenario: I want to edit an existing solver request by changing Rules
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1536"
    When I click on three dots on "baseline"
    And I "Add child" the ruleset "baseline"
    And I provide new ruleset name as "<ruleset for solverRequest 1>"
    #And I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    And I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the rules "baseline" to "<ruleset for solverRequest 1>" of request "AUT_Solver_Request"
    And I want to back home
    And I go to solver page
    Then Verify successfully the rule "<ruleset for solverRequest 1>" of request "AUT_Solver_Request" is updated as expected

  @jenkin_failTest
  Scenario: I want to edit an existing solver request by changing Recipe
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the recipe "Arg" to "Change_Bases" of request "AUT_Solver_Request"
    And I want to back home
    And I go to solver page
    Then Verify successfully the Recipe "Change_Bases" of request "AUT_Solver_Request" is updated as expected

  Scenario: I want to edit an existing solver request by changing description
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1536"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots            |
      | Rules          | baseline              |
      | Recipe         | Arg    |
    And I provide the description as "Solver description"
    And I click on 'Add' Button
    When I update the description "Solver description" to "Solver description_updated" of request "AUT_Solver_Request"
    And I want to back home
    And I go to solver page
    Then Verify successfully the description "Solver description_updated" of request "AUT_Solver_Request" is updated as expected
