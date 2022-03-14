@data_management @rulesets @Delete_Ruleset @wip
Feature: Ruleset - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1553" is added
    And I'm logged in with default credentials.

  @PositiveScenario
  Scenario: I want to delete a ruleset with no dependency
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1553"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "widebody"
    And I click on three dots on "widebody"
    When I "Add child" the ruleset "widebody"
    Then I provide new ruleset name as "base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Add child" the ruleset "base9-apply-bcd-10"
    Then I provide new ruleset name as "ruleset for solverRequest 1"
    #When I expand rulesets "widebody","base9-apply-bcd-10"
    And I click on three dots on "ruleset for solverRequest 1"
    When I "Delete" the ruleset "ruleset for solverRequest 1"
    And I click delete confirmation button
    Then the delete message "Rule set ruleset for solverRequest 1 has been successfully deleted." for ruleset is displayed as expected

  @negativeScenario
  Scenario: I want to delete a ruleset with dependency
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1553"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "widebody"
    And I click on three dots on "widebody"
    When I "Add child" the ruleset "widebody"
    Then I provide new ruleset name as "base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Add child" the ruleset "base9-apply-bcd-10"
    Then I provide new ruleset name as "ruleset for solverRequest 1"
    #When I expand rulesets "widebody","base9-apply-bcd-10"
    And I click on three dots on "widebody"
    When I "Delete" the ruleset "widebody"
    And I click delete confirmation button
    Then verify the reference error for ruleset "This rule set cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed

  Scenario: I want to delete a root ruleset
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1553"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "widebody"
    And I click on three dots on "widebody"
    When I "Add child" the ruleset "widebody"
    Then I provide new ruleset name as "base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Add child" the ruleset "base9-apply-bcd-10"
    Then I provide new ruleset name as "ruleset for solverRequest 1"
   # When I expand rulesets "widebody","base9-apply-bcd-10"
    And I click on three dots on "baseline"
    Then verify successfully that no "delete" option is present for root ruleset

  Scenario: I want to delete a ruleset which having dependency on Crew group page
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1553"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "widebody"
    And I click on three dots on "widebody"
    When I "Add child" the ruleset "widebody"
    Then I provide new ruleset name as "base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Add child" the ruleset "base9-apply-bcd-10"
    Then I provide new ruleset name as "ruleset for solverRequest 1"
    #And I'm in the Crew Groups page for scenario "aut_scenario_alt-1553"
    And I click on data card link "Crew groups"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT                          |
      | Position         | CA                           |
      | Airlines         | QK                           |
      | Aircraft Type    | DH1                          |
      | Default Rule Set | ruleset for solverRequest 1  |
    And I add the new crew group
    When I click on Rules icon in left panel
    And I click Manage Rule Sets Link
    And I expand rule set tree for "baseline"
    When I expand rulesets "widebody","base9-apply-bcd-10"
    And I click on three dots on "ruleset for solverRequest 1"
    When I "Delete" the ruleset "ruleset for solverRequest 1"
    And I click delete confirmation button
    Then verify the reference error for ruleset "This rule set cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed

  Scenario: I want to cancel delete ruleset
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1553"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "widebody"
    And I click on three dots on "widebody"
    When I "Add child" the ruleset "widebody"
    Then I provide new ruleset name as "base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Add child" the ruleset "base9-apply-bcd-10"
    Then I provide new ruleset name as "ruleset for solverRequest 1"
    #When I expand rulesets "widebody","base9-apply-bcd-10"
    And I click on three dots on "base9-apply-bcd-10"
    When I "Delete" the ruleset "base9-apply-bcd-10"
    And I click cancel button
    Then verify successfully that no deletion happens for ruleset
