@data_management @rulesManagement @validation_parameter_value
Feature: RulesManagement: Validation ParameterValue.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2197" is added
    And I'm logged in with default credentials.

  Scenario: I want to check Integer Validation Messages.
    Given I open the scenario "aut_scenario_alt-2197"
    And I open rules page
    And I wait for rules page to load
    When I select rule set "baseline"
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And I update integer value as "1001"
    Then I verify that integer value is updated to "1001"
    And I update integer value as "-1001"
    Then verify with message "The possible values for this parameter range from 0 to 10000. Please try again." for rule is displayed as expected
    Then I verify that integer value is not updated to "-1001"
    Then I collapse the rule name "Penalty on CDO duties"
    And I scroll to rule name "Penalty on duty productivity"
    Then I expand the rule name "Penalty on duty productivity"
    And I update integer value as "2212"
    Then I verify that integer value is updated to "2212"
    And I update integer value as "-2"
    Then verify with message "For this parameter, a value of 0 or greater is expected. Please try again." for rule is displayed as expected
    Then I verify that integer value is not updated to "-2"
    Then I collapse the rule name "Penalty on duty productivity"
    And I scroll to rule name "Penalty on minimum rest time threshold"
    Then I expand the rule name "Penalty on minimum rest time threshold"
    And I update integer value as "100"
    Then I verify that integer value is updated to "100"
    And I update integer value as "-12"
    Then I verify that integer value is updated to "-12"
    Then I collapse the rule name "Penalty on minimum rest time threshold"
    And I scroll to rule name "Penalty on minimum rest time threshold"
    Then I expand the rule name "Penalty on minimum rest time threshold"
    And I update decimal value as "100.2"
    Then I verify that decimal value is updated to "100.2"
    And I update decimal value as "-12.3"
    Then I verify that decimal value is updated to "-12.3"
    Then I collapse the rule name "Penalty on minimum rest time threshold"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I update integer value as "1001"
    Then I verify that integer value is updated to "1001"

  Scenario: I want to check Duration Validation Messages.
    Given I open the scenario "aut_scenario_alt-2197"
    And I open rules page
    And I wait for rules page to load
    When I select rule set "baseline"
    And I scroll to rule name "Long connection definition"
    Then I expand the rule name "Long connection definition"
    And I update duration time value as "22222h00"
    Then I verify that duration value is updated to "22222h00"
    And I update duration value as "1111"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    Then I collapse the rule name "Long connection definition"
    And I scroll to rule name "Fatigue unit definition"
    Then I expand the rule name "Fatigue unit definition"
    And I update duration time value as "13h30"
    Then I verify that duration value is updated to "13h30"
    And I update duration value as "1111"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    Then I collapse the rule name "Fatigue unit definition"
    And I scroll to rule name "Mark rests that are close to the minimum limit"
    Then I expand the rule name "Mark rests that are close to the minimum limit"
    And I update duration time value as "12h67"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    And I update duration time value as "12h27"
    Then I verify that duration value is updated to "12h27"
    Then I collapse the rule name "Mark rests that are close to the minimum limit"
    And I scroll to rule name "Maximum airplane changes per duty and per pairing"
    Then I expand the rule name "Maximum airplane changes per duty and per pairing"
    And I update duration time value as "1256"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    And I update duration time value as "12h56"
    Then I verify that duration value is updated to "12h56"
    Then I collapse the rule name "Maximum airplane changes per duty and per pairing"
    And I scroll to rule name "Maximum connection time"
    Then I expand the rule name "Maximum connection time"
    And I update duration time value as "12h67"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    And I update duration time value as "12h27"
    Then I verify that duration value is updated to "12h27"
    Then I collapse the rule name "Maximum connection time"
    And I scroll to rule name "Maximum duty time"
    Then I expand the rule name "Maximum duty time"
    And I update duration time value as "12h"
    Then verify with message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)" for rule is displayed as expected
    And I update duration time value as "12h27"
    Then I verify that duration value is updated to "12h27"
    Then I collapse the rule name "Maximum duty time"
