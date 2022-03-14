@scenarios @scenariosFlag
Feature: Scenario - Flag

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1010" is added
    #And The users with following values are added
    #  | First Name | User               |
    # | Last Name  | Automation         |
     # | User Name  | aut_user           |
     # | Email      | aut@konos-test.com |
     # | Password   | Password1          |
     # | Role       | Administrator      |

  Scenario: I want verify the read only icon for scenario
    When I'm logged with default SecondUser credentials.
    Given The scenario "aut_scenario_alt-1010" is opened through backend
    And I filter by "Anyone"
    Then The scenario "aut_scenario_alt-1010" shows in ReadOnly mode

  @readonly
  Scenario: I want verify the read only warning for scenario
    Given The scenario "aut_scenario_alt-1010" is opened through backend
    When I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-1010"
    Then The View Only mode information dialog shows up

  @readonly
  Scenario: I want verify the legend shows View Only for scenario
    Given The scenario "aut_scenario_alt-1010" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-1010"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
