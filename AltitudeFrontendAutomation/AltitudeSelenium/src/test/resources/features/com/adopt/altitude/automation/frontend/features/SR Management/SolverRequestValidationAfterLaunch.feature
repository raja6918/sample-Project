@data_management @SR_validation @SR_validation-EditAndAfterLaunch
Feature: Solver Management- Preview, Edit crew group & ruleSet.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2334" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit a crew group and verify its updated in created Solver request also
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2334"
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
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup" crewgroup
    And I save the crew group
    Then the message "Crew group Updated_AUT_CrewGrup has been successfully updated." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then I Verify name of the edited Crew Group "AUT_CrewGrup" is displayed in the field
    When I update the crew group "AUT_CrewGrup" to "Combo Pilots" of request "AUT_Solver_Request"
    Then I verify that the edited Crew Group "Updated_AUT_CrewGrup" is updated in the crew group list

  Scenario: I want to verify tooltip message for edited crew group in Solver request
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2334"
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
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup" crewgroup
    And I save the crew group
    Then the message "Crew group Updated_AUT_CrewGrup has been successfully updated." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    And I verify a warning icon is displayed next to the field
    Then I verify crew group tool tip error message as "This crew group has either been renamed or does not exist in this scenario."

  Scenario: I want to edit a crew group and verify Launch button is disabled for created Solver request
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-2334"
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
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup" crewgroup
    And I save the crew group
    Then the message "Crew group Updated_AUT_CrewGrup has been successfully updated." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully "Launch" Button should be disabled as expected

  Scenario: I want to edit a rule set and verify its updated in created Solver request also
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Get/Edit info" the ruleset "Aut_Ruleset"
    When I update the name to "Updated_Aut_Ruleset"
    Then verify with message "Rule set Updated_Aut_Ruleset has been successfully updated." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then I Verify name of the edited Rule Set "Aut_Ruleset" is displayed in the field
    When I update the rules "Aut_Ruleset" to "baseline" of request "AUT_Solver_Request"
    Then I verify that the edited Rule Set Group "Aut_Ruleset" is updated in the list

  Scenario: I want to verify tooltip message for edited Rule Set in Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
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
    When I "Get/Edit info" the ruleset "Aut_Ruleset"
    When I update the name to "Updated_Aut_Ruleset"
    Then verify with message "Rule set Updated_Aut_Ruleset has been successfully updated." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    And I verify a warning icon is displayed next to the field
    Then I verify Rule Set tool tip error message as "This rule set has either been renamed or does not exist in this scenario."

  Scenario: I want to edit a rule set and verify Launch button is disabled for created Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
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
    When I "Get/Edit info" the ruleset "Aut_Ruleset"
    When I update the name to "Updated_Aut_Ruleset"
    Then verify with message "Rule set Updated_Aut_Ruleset has been successfully updated." for ruleset is displayed as expected
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully "Launch" Button should be disabled as expected

  Scenario: I want to verify tooltip message for edited CrewGroup and edited Rule Set in Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to crewGroup page
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                |
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
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Get/Edit info" the ruleset "Aut_Ruleset"
    When I update the name to "Updated_Aut_Ruleset"
    Then verify with message "Rule set Updated_Aut_Ruleset has been successfully updated." for ruleset is displayed as expected
    Then I go to crewGroup page
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup" crewgroup
    And I save the crew group
    Then the message "Crew group Updated_AUT_CrewGrup has been successfully updated." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
   And I verify a warning icon is displayed next to the field Crew group
    Then I verify tool tip error message as "This crew group has either been renamed or does not exist in this scenario." for crew group
   And I verify a warning icon is displayed next to the field Rule Set
    Then I verify tool tip error message as "This rule set has either been renamed or does not exist in this scenario." for Rule Set

  Scenario: I want to verify tooltip message for deleted CrewGroup and deleted Rule Set in Solver request
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to crewGroup page
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
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Delete" the ruleset "Aut_Ruleset"
    And I click delete confirmation button
    Then the delete message "Rule set Aut_Ruleset has been successfully deleted." for ruleset is displayed as expected
    Then I go to crewGroup page
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    And I verify a warning icon is displayed next to the field Crew group
    Then I verify tool tip error message as "This crew group has either been renamed or does not exist in this scenario." for crew group
    And I verify a warning icon is displayed next to the field Rule Set
    Then I verify tool tip error message as "This rule set has either been renamed or does not exist in this scenario." for Rule Set

  Scenario: I want to verify in Preview tab, deleted Crew Group and Rule Set is displayed as per SR definition and is disabled.
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to crewGroup page
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
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I click on launch button for solver request "AUT_Solver_Request"
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Delete" the ruleset "Aut_Ruleset"
    And I click delete confirmation button
    Then the delete message "Rule set Aut_Ruleset has been successfully deleted." for ruleset is displayed as expected
    Then I go to crewGroup page
    When I delete crewgroup "AUT_CrewGrup"
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then Error Pop Up Should display with the Error Messages
   # Then I Verify that SR definition's Crew Group "AUT_CrewGrup" and rule Set "Aut_Ruleset" is displayed in preview tab
    #Then I verify that crew group "AUT_CrewGrup" is disabled
    #Then I verify that ruleset link is disabled on preview page

  Scenario: I want to verify in Preview tab, edited Crew Group and Rule Set is displayed as per SR definition and is disabled.
    Given I'm in the ruleset page for scenario "aut_scenario_alt-2334"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "Aut_Ruleset"
    Then I go to crewGroup page
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
      | Rules          | Aut_Ruleset           |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I click on launch button for solver request "AUT_Solver_Request"
    Then I go to rule set page
    And I expand rule set tree for "baseline"
    And I click on three dots on "Aut_Ruleset"
    When I "Get/Edit info" the ruleset "Aut_Ruleset"
    When I update the name to "Updated_Aut_Ruleset"
    Then verify with message "Rule set Updated_Aut_Ruleset has been successfully updated." for ruleset is displayed as expected
    Then I go to crewGroup page
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup" crewgroup
    And I save the crew group
    Then I go to solver page
    And I click on created solver "AUT_Solver_Request"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request" with message "Completed successfully"
    And Click on "Preview" button for solver request AUT_Solver_Request
    Then Error Pop Up Should display with the Error Messages
   # Then I Verify that SR definition's Crew Group "AUT_CrewGrup" and rule Set "Aut_Ruleset" is displayed in preview tab
   # Then I verify that crew group "AUT_CrewGrup" is disabled
   # Then I verify that ruleset link is disabled on preview page
