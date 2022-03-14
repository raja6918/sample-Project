@data_management @rulesManagement @change_parameter_value @wip
Feature: RulesManagement: ChangeParameterValue.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1547" is added
    And I'm logged in with default credentials.

  Scenario: I want to check parameter change triggers a server-side validation error
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And I update integer value as "-1001"
    Then verify with message "The possible values for this parameter range from 0 to 10000. Please try again." for rule is displayed as expected

  Scenario: I want to check that it is possible to change the state (On/Off) of any rule.
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I Change the status to "Off" for rule name "Accommodation selection, costs, and room calculations"
    And I Change the status to "Off" for rule name "Duty composition"
    And I Change the status to "On" for rule name "Deadhead costs"
    And I Change the status to "Off" for rule name "Fatigue unit max per duty (flight deck only)"
    And I Change the status to "On" for rule name "Maximum connection time"
    And I Change the status to "On" for rule name "Maximum flights per duty"
    Then I verify the current status for "Accommodation selection, costs, and room calculations" is updated to "Off"
    Then I verify the current status for "Duty composition" is updated to "Off"
    Then I verify the current status for "Deadhead costs" is updated to "On"
    Then I verify the current status for "Fatigue unit max per duty (flight deck only)" is updated to "Off"
    Then I verify the current status for "Maximum connection time" is updated to "On"
    Then I verify the current status for "Maximum flights per duty" is updated to "On"

  Scenario: I want to check that the change is saved when the planner clicks away from the parameter.
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I wait for rules page to load
    When I select rule set "baseline"
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And I update integer value as "2212"
    Then I click away from the parameter
    Then I verify that integer value is updated to "2212"

  Scenario: I want to check that if the user try to update with Invalid value then it should not get saved when user click away from the parameter
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I wait for rules page to load
    When I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I update integer value as "-1001"
    Then verify with message "For this parameter, a value of 0 or greater is expected. Please try again." for rule is displayed as expected
    Then I verify that integer value is not updated to "-1001"

  #Scenario: I want to check Enumeration change.
  #  Given I open the scenario "aut_scenario_alt-1547"
  #  And I open rules page
  #  And I scroll to rule name "Duty credit"
   # Then I expand the rule name "Duty credit"
   # And I select "excluded" for deadheads
   # Then I verify the current deadhead value is updated to "excluded"
   # And I select "included" for deadheads
   # Then I verify the current deadhead value is updated to "included"
   # And I scroll to down to max duty credit
   # And I select "breakfast" for meals
   # Then I verify the current meal type is updated to "breakfast"
   # And I select "lunch" for meals
   # Then I verify the current meal type is updated to "lunch"
   # And I select "diner" for meals
   # Then I verify the current meal type is updated to "diner"
   # And I select "snack" for meals
   # Then I verify the current meal type is updated to "snack"

  Scenario: I want to check Decimal input is expandable to 11 characters (positive/negative number).
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Penalty on duty productivity"
    Then I expand the rule name "Penalty on duty productivity"
    And I update softCostPenalityValue as "-12.345678901234567890"
    Then I click away from the parameter
    Then I verify Decimal input is expandable is updated to 11 character
    And I update softCostPenalityValue as "1.345678901234567890"
    Then I click away from the parameter
    Then I verify Decimal input is expandable is updated to 11 character

  Scenario: I want to check Time duration input is expandable to 11 characters.
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Maximum duty time"
    Then I expand the rule name "Maximum duty time"
    And I update duration time value as "12345678901234567890h59"
    Then I verify Time duration input is expandable is expandable up to 11 character

  Scenario: I want to check Time duration is in the format HHhMM.
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Maximum duty time"
    Then I expand the rule name "Maximum duty time"
    And I verify current duration is in HHhMM format

  Scenario: I want to check the Time Selection
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Early duty definition"
    Then I expand the rule name "Early duty definition"
    And I update the time to "13:25"
    Then I verify the time is updated to "13:25"

 # Scenario: I want to check Text input is expandable up to 50 characters.
 #   Given I open the scenario "aut_scenario_alt-1547"
 #   And I open rules page
 #  And I scroll to rule name "Duty credit"
 #   Then I expand the rule name "Duty credit"
 #   And I scroll to down to max duty credit
 #   And I update special tag value as "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
 #   Then I click away from the parameter
 #   Then I verify Text input is expandable is updated to 50 character

 # Scenario: I want to check Integer input is expandable up to 100 characters.
 #   Given I open the scenario "aut_scenario_alt-1547"
 #   And I open rules page
 #   And I scroll to rule name "Duty credit"
 #   Then I expand the rule name "Duty credit"
 #   And I scroll to down to max duty credit
 #   And I update special tail number value as "-12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
 #   Then I verify Integer input is expandable is updated to 100 character

 # Scenario: I want to check Time selection.
 #   Given I open the scenario "aut_scenario_alt-1547"
 #   And I open rules page
 #   And I scroll to rule name "Duty credit"
 #   Then I expand the rule name "Duty credit"
 #   Then I update the briefing time to "4:30"
 #   And I verify the briefing time is updated to "04:30"

  #@dateSelection
  #Scenario: I want to check Date selection.
  #  Given I open the scenario "aut_scenario_alt-1547"
  #  And I open rules page
  #  And I scroll to rule name "Duty credit"
  #  Then I expand the rule name "Duty credit"
  #  And I update the flight date to "December-31-2020"
  #  And  I verify the flight date is updated to "30/12/2020"

 # Scenario: I want to check The parameter value change is displayed everywhere on the page where the parameter can been seen
 #   Given I open the scenario "aut_scenario_alt-1547"
 #   And I open rules page
 #   And I scroll to rule name "Duty credit"
 #   Then I expand the rule name "Duty credit"
 #   Then I update the briefing time to "5:45"
 #   And I update otherwise value as "2.43443434"
 #   Then I click away from the parameter
 #   And I scroll to rule name "Maximum duty credit"
 #   Then I expand the rule name "Maximum duty credit"
 #   And I click on link "Duty credit"
 #   Then I verify that briefing time is updated to "05:45" for other page too
 #   Then I verify that otherwise value is updated to "2.43443434" for other page too

Scenario: I want to check record is added to the table data for the rule 'Deadhead costs' with positive numbers
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    And  I expand the rule name "Deadhead costs"
    And I click on the this table link
    And I click on add button on table
    And I add the data "100" and "100" to the table
    And I Click On Save Button
    And I click on the this table link
    And I verify the data "100" and "100" is added to the table

  Scenario: I want to check that system should not allow to add Negative values
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I click on the this table link
    And I click on add button on table
    And I add the data "-100" and "-100" to the table
    And I Click On Save Button
    Then verify with message "One or more of the values you have entered are invalid." for rule is displayed as expected


  Scenario: Save Button should not enable if user try to update the Field values with Text Format
     Given I open the scenario "aut_scenario_alt-1547"
     And I open rules page
     And I select rule set "baseline"
     And I scroll to rule name "Deadhead costs"
     Then I expand the rule name "Deadhead costs"
     And I click on the this table link
     And I click on add button on table
     And I add the data "TEST" and "TEST" to the table
     And Save button is in Disable state



  Scenario: I want to to delete the added record from the table
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I click on the this table link
    And I click on add button on table
    And I add the data "87" and "3" to the table
    And I Click On Save Button
    And I click on the this table link
    And I click on delete row Option
    Then I verify that record with data "87" and "3" is not available on the table

  Scenario: I want to check the insert row above functionality
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I click on the this table link
    And I click on add button on table
    And I add the data "67" and "10" to the table
    And I Click On Save Button
    And I click on the this table link
    And I click on insert row above Option
    And I verify that record is inserted above for row of data "67" and "10"


  Scenario: I want to check the insert row below functionality
    Given I open the scenario "aut_scenario_alt-1547"
    And I open rules page
    And I select rule set "baseline"
    And I scroll to rule name "Deadhead costs"
    Then I expand the rule name "Deadhead costs"
    And I click on the this table link
    And I click on add button on table
    And I add the data "67" and "10" to the table
    And I Click On Save Button
    And I click on the this table link
    And I click on insert row below Option
    And I verify that record is inserted below for row of data "67" and "10"

