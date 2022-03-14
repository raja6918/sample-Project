@data_management @rulesManagement @scenariosFlag @readOnlyRules
Feature: Rules: Read Only feature.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2233" is added
   # And The users with following values are added
    #  | First Name | User               |
     # | Last Name  | Automation         |
      #| User Name  | aut_user           |
      #| Email      | aut@IBS-test.com   |
      #| Password   | Password1          |
      #| Role       | Administrator      |

  Scenario: I want to check Integer value is disabled.
    Then The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    And I select rule set "baseline"
    And I scroll to rule name "Maximum connection time"
    Then I expand the rule name "Maximum connection time"
    And I verify that text field is disabled
    Then I collapse the rule name "Maximum connection time"
    And I scroll to rule name "Maximum duty time"
    Then I expand the rule name "Maximum duty time"
    And I verify that text field is disabled
    Then I collapse the rule name "Maximum duty time"
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And I verify that text field is disabled
    Then I collapse the rule name "Penalty on CDO duties"
    And I scroll to rule name "Penalty on duty productivity"
    Then I expand the rule name "Penalty on duty productivity"
    And I verify that text field is disabled
    Then I collapse the rule name "Penalty on duty productivity"
    And I scroll to rule name "Penalty on minimum rest time threshold"
    Then I expand the rule name "Penalty on minimum rest time threshold"
    And I verify that text field is disabled
    Then I collapse the rule name "Penalty on minimum rest time threshold"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I verify that text field is disabled

  Scenario: I want to check Duration field value is disabled.
    Then The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    And I select rule set "baseline"
    And I scroll to rule name "Briefing time"
    Then I expand the rule name "Briefing time"
    And I verify that duration value field is disabled
    Then I collapse the rule name "Briefing time"
    And I scroll to rule name "CDO connection definition"
    Then I expand the rule name "CDO connection definition"
    And I verify that duration value field is disabled
    Then I collapse the rule name "CDO connection definition"
    And I scroll to rule name "Fatigue unit definition"
    Then I expand the rule name "Fatigue unit definition"
    And I verify that duration value field is disabled
    Then I collapse the rule name "Fatigue unit definition"
    And I scroll to rule name "Forbid short active-deadhead turns"
    Then I expand the rule name "Forbid short active-deadhead turns"
    And I verify that duration value field is disabled
    Then I collapse the rule name "Forbid short active-deadhead turns"
    And I scroll to rule name "Long connection definition"
    Then I expand the rule name "Long connection definition"
    And I verify that duration value field is disabled
    Then I collapse the rule name "Long connection definition"
    And I scroll to rule name "Maximum connection time"
    Then I expand the rule name "Maximum connection time"
    And I verify that duration value field is disabled

  Scenario: I want to verify revert button is disabled.
    Then The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    And I select rule set "baseline"
    Then I verify that revert button is disabled

  Scenario: I want to verify State ComboBox On/Off is disabled.
    Then The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    And I select rule set "baseline"
    Then I verify that State ComboBox On/Off is disabled

  Scenario: I want to verify Links inside a rule description are functional.
    Then The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    And I select rule set "baseline"
    And I scroll to rule name "Accommodation selection, costs, and room calculations"
    Then I expand the rule name "Accommodation selection, costs, and room calculations"
    And I verify the link "CDO duties" is functional
    Then I collapse the rule name "Accommodation selection, costs, and room calculations"
    And I scroll to rule name "Briefing time"
    Then I expand the rule name "Briefing time"
    And I verify the link "minimum connection time for an aircraft change" is functional
    Then I collapse the rule name "Briefing time"
    And I scroll to rule name "CDO duty definition"
    Then I expand the rule name "CDO duty definition"
    And I verify the link "CDO connection" is functional
    Then I collapse the rule name "CDO duty definition"
    And I scroll to rule name "CDO pairing definition"
    Then I expand the rule name "CDO pairing definition"
    And I verify the link "CDO duty" is functional
    Then I collapse the rule name "CDO pairing definition"
    And I scroll to rule name "Credit costs"
    Then I expand the rule name "Credit costs"
    And I verify the link "dead day" is functional
    Then I collapse the rule name "Credit costs"
    And I scroll to rule name "Fatigue unit max per duty (flight deck only)"
    Then I expand the rule name "Fatigue unit max per duty (flight deck only)"
    And I verify the link "fatigue units" is functional
    Then I collapse the rule name "Fatigue unit max per duty (flight deck only)"
    And I scroll to rule name "Forbid short active-deadhead turns"
    Then I expand the rule name "Forbid short active-deadhead turns"
    And I verify the link "turn" is functional
    Then I collapse the rule name "Forbid short active-deadhead turns"
    And I scroll to rule name "Maximum connection time"
    Then I expand the rule name "Maximum connection time"
    And I verify the link "split duty" is functional
    Then I collapse the rule name "Maximum connection time"
    And I scroll to rule name "Maximum duty time"
    Then I expand the rule name "Maximum duty time"
    And I verify the link "silent hour" is functional
    Then I collapse the rule name "Maximum duty time"
    And I scroll to rule name "Maximum flights per duty"
    Then I expand the rule name "Maximum flights per duty"
    And I verify the link "CDO duty" is functional
    Then I collapse the rule name "Maximum flights per duty"
    And I scroll to rule name "Meal costs"
    Then I expand the rule name "Meal costs"
    And I verify the link "midnight" is functional
    And I verify the link "CDO pairing" is functional
    Then I collapse the rule name "Meal costs"

  Scenario: I want to verify rule set being viewed in the Rules page can be changed.
    Given I'm logged in with default credentials.
    And I'm in the ruleset page for scenario "aut_scenario_alt-2233".
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Add child" the ruleset "AUT baseline"
    Then I provide new ruleset name as "AUT New baseline"
    Then I log out
    And The scenario "aut_scenario_alt-2233" is opened through backend
    And I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_alt-2233"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open rules page
    And I wait for rules page to load
    #Then I verify the current rule set name is "root"
    Then I verify the current rule set name is "baseline"
    When I select rule set "baseline"
    Then I verify the current rule set name is "baseline"
    When I select rule set "AUT baseline"
    Then I verify the current rule set name is "AUT baseline"
    And I select rule set "AUT New baseline"
    Then I verify the current rule set name is "AUT New baseline"
