@data_management @rulesets @Edit_Ruleset @wip
Feature: Ruleset - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1552" is added
    And I'm logged in with default credentials.

  @PositiveScenario
  Scenario: I want to update the ruleset with a valid name
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
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
    And I click on three dots on "ruleset for solverRequest 1"
    When I "Get/Edit info" the ruleset "ruleset for solverRequest 1"
    When I update the name to "AUT_RULESET_UPDATED"
    Then verify with message "Rule set AUT_RULESET_UPDATED has been successfully updated." for ruleset is displayed as expected

  Scenario: I want to update the ruleset name with more than 50 character
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
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
    When I "Get/Edit info" the ruleset "ruleset for solverRequest 1"
    And I update name having characters greater than 50
    Then verify with message "Rule set abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx has been successfully updated." for ruleset is displayed as expected
    Then verify rulesetName field allows max character count as 50 for Ruleset "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx"

  Scenario: I want to update the ruleset description and validate description character count when more than 1000
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
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
    When I "Get/Edit info" the ruleset "ruleset for solverRequest 1"
    And I update description having characters greater than 1000
    Then verify with message "Rule set ruleset for solverRequest 1 has been successfully updated." for ruleset is displayed as expected
    And I click on three dots on "ruleset for solverRequest 1"
    When I "Get/Edit info" the ruleset "ruleset for solverRequest 1"
    Then verify description field allows max character count as 1000 for Ruleset "ruleset for solverRequest 1"

  Scenario: I want to update the ruleset's last modified
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
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
    And I click on three dots on "baseline"
    When I "Get/Edit info" the ruleset "baseline"
    When I try update the name to "AUT_RULESET_UPDATED" and verify lastmodified is updated successfully.

  Scenario: I want to update the ruleset's last modified by
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
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
    When I "Get/Edit info" the ruleset "ruleset for solverRequest 1"
    When I try update the name to "AUT_RULESET_UPDATED" and verify last modified by is updated successfully.

  Scenario: I want to verify the last modified date is displayed on the root rule set
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1552"
    Then I verify that last modified date is displayed on the root rule set "baseline"


