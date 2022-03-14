@data_management @pairing @See_solver_result
Feature: Pairing - See Solver Result.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1561" is added
    And I'm logged in with default credentials.

  Scenario: I want to verify, that rule Set link is the default rule set associated with the selected Crew Group
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    When I do first time crewgroup "Combo Pilots" selection
    Then Verify that rule Set "baseline" is selected as the default rule set associated with selected Crew Group "Combo Pilots"

  @wip
  Scenario: I want to verify that the value in the Crew Groups drop-down is the last Crew Group selected
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    When I do first time crewgroup "Combo Pilots" selection
    When I select crewgroup "CR7 Pilots"
    And I go to solver page
    And I go to Pairing Page
    Then Verify that the value in the Crew Groups drop-down is the last Crew Group selected "CR7 Pilots"

  @wip
  Scenario: I want to verify that the updated ruleset is reflected as the default rule set associated with the selected Crew Group
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1561"
    When I click on three dots on "baseline"
    And I "Add child" the ruleset "baseline"
    And I provide new ruleset name as "<ruleset for solverRequest 1>"
    #And I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    And I go to Pairing Page
    When I do first time crewgroup "Combo Pilots" selection
    Then Verify that rule Set "baseline" is selected as the default rule set associated with selected Crew Group "Combo Pilots"
    And I want to go CrewGroup Page
    When I update the ruleset to "<ruleset for solverRequest 1>" for "baseline" crewgroup "Combo Pilots"
    And I go to Pairing Page
    When I select crewgroup "CR7 Pilots"
    When I select crewgroup "Combo Pilots"
    Then Verify that rule Set "<ruleset for solverRequest 1>" is selected as the default rule set associated with selected Crew Group "Combo Pilots"

  Scenario: I want to verify  "Timeline 1","Timeline 2" in the pairing page
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    When I do first time crewgroup "Combo Pilots" selection
    And I click on the Plus button
    Then Verify "Timeline #1","Timeline #2" is displayed in the pairing page

  Scenario: I want to verify Zoom function as expected in the pairing page
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    When I do first time crewgroup "Combo Pilots" selection
    And I click on ZoomIn
   # Then verify zoomIn works as expected

  @wip
  Scenario: I want to verify Zoom function reverts to default zoom ,When a new crew group selection is made
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1561"
    When I do first time crewgroup "Combo Pilots" selection
    Then verify Zoom function reverts to default zoom when I change crewgroup "CR7 Pilots" and again change to "Combo Pilots"
