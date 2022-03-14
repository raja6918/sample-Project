@SR_validation @SR_validation-BeforeLaunch @data_management
Feature: Solver Management- Delete crew group & ruleSet.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2333" is added
    And I'm logged in with default credentials.

  @data_management
  Scenario: I want to delete a crew group and verify its delete from created Solver request also
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2333"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | AUT_CrewGrup          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to crewGroup page
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then I Verify name of the deleted Crew Group "AUT_CrewGrup" is displayed in the field
    When I update the crew group "AUT_CrewGrup" to "Combo Pilots" of request "AUT_Solver_Request"
    Then I verify that the deleted Crew Group "AUT_CrewGrup" is not in the list

  @data_management
  Scenario: I want to verify tooltip message for deleted crew group in Solver request
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2333"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | AUT_CrewGrup          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to crewGroup page
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    And I verify a warning icon is displayed next to the field
    Then I verify crew group tool tip error message as "This crew group has either been renamed or does not exist in this scenario."

  @data_management
  Scenario: I want to delete a crew group and verify Launch button is disabled for created Solver request
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2333"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | AUT_CrewGrup          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to crewGroup page
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully "Launch" Button should be disabled as expected

  Scenario: I want to delete a rule set and verify its delete from created Solver request also
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2333"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Delete" the ruleset "Aut_Ruleset"
    And I click delete confirmation button
    Then the delete message "Rule set Aut_Ruleset has been successfully deleted." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then I Verify name of the deleted Rule Set "Aut_Ruleset" is displayed in the field
    When I update the rules "Aut_Ruleset" to "baseline" of request "AUT_Solver_Request"
    Then I verify that the deleted Rule Set Group "Aut_Ruleset" is not in the list


  @data_management
  Scenario: I want to verify tooltip message for deleted Rule Set in Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2333"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Delete" the ruleset "Aut_Ruleset"
    And I click delete confirmation button
    Then the delete message "Rule set Aut_Ruleset has been successfully deleted." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    And I verify a warning icon is displayed next to the field
    Then I verify Rule Set tool tip error message as "This rule set has either been renamed or does not exist in this scenario."

  @data_management
  Scenario: I want to delete a rule set and verify Launch button is disabled for created Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2333"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Delete" the ruleset "Aut_Ruleset"
    And I click delete confirmation button
    Then the delete message "Rule set Aut_Ruleset has been successfully deleted." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully "Launch" Button should be disabled as expected
