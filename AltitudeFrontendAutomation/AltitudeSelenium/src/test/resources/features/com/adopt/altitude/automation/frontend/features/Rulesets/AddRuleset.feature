@data_management @rulesets @Add_Ruleset
Feature: Ruleset - Add.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1551" is added
    And I'm logged in with default credentials.

  Scenario: I want to check the new rule set is displayed as a child of ABC
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I get current content of the ruleset displayed
    Then I verify new rule set is displayed as "Child of" "baseline"

  Scenario: I want to check focus is placed on the new rule set's name
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I check focus and provide new ruleset name as "Current Focus Here"

  Scenario: I want to verify it is not possible to enter a blank name
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "               "
    Then I confirm that the previous name is restored as "Child of baseline"

  Scenario: I want to verify No more than 50 characters can be entered for the name
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwfhdjfhjdhfj"
    Then verify rulesetName field allows max character count as 50 for Ruleset "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwf"

  Scenario: I want to verify the name must be unique
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "baseline"
    Then verify with message "Another rule set with this name already exists. Please change the name and try again in the get/edit info pane." for ruleset is displayed as expected

  Scenario: I want to verify the request fails after network is turned OFF
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    Then I turn network to Offline mode
    Then verify with message "No internet connection" and "You don’t seem to be connected to the internet. To continue working in Sierra, please check your network settings."
#    When I "Add Child" the ruleset "baseline"
#    Then verify with message "Something went wrong. The new rule set could not be created.If this problem persists, please contact your Network Administrator" for ruleset is displayed as expected

  Scenario: I want to verify the text field is converted to a label
    Given I'm in the ruleset page for scenario "aut_scenario_alt-1551"
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "label_checking"
    Then I confirm that added ruleset "label_checking" is in a label
