@data_management @pairing @Filter @DateTimePickerValidation
Feature: Pairing Filter - Date and Time Picker Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2226" is added
    And I'm logged in with default credentials.

  Scenario: Verify whether it is possible to enter the same value for Start and End date in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Pairing start date" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Start date as "August-1-2021-9-45" field in the Filter pane
    And I enter value of End date as "August-1-2021-9-45" in the Filter pane
   Then verify it is possible to enter the same value for Start and End date in the Filter pane

  Scenario: Verify whether it is possible to enter Start Date as a date before End date in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Pairing start date" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Start date as "August-1-2021-3-50" field in the Filter pane
    And I enter value of End date as "August-2-2021-9-50" in the Filter pane
    Then verify it is possible to enter Start Date as a date before End date in the Filter pane

  Scenario: Verify whether it is not possible to enter Start Date as a date after End date in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Pairing start date" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Start date as "August-1-2021-23-45" field in the Filter pane
    And I enter value of End date as "August-1-2021-3-45" in the Filter pane
    Then verify it is not possible to enter Start Date as a date after End date with error message as "The start of the date/time range must occur either before or should be the same as the end of the specified range."

  @time
    Scenario: Verify whether it is possible to enter the same value for Start and End time in the Filter pane
      Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
      And I click on the Plus button
      When I click on pairing filter button for Timeline One
      And I click on Criteria and select "Pairing criteria"
      And I click "Pairing start time" sub-criteria checkbox
      And I click on add button to add criteria
      And I enter value of Start time as "2:00" field in the Filter pane
      And I enter value of End time as "2:00" in the Filter pane
      Then verify it is possible to enter the same value for Start and End time in the Filter pane

  Scenario: Verify whether it is possible to enter Start time before End time in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Pairing start time" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Start time as "3:50" field in the Filter pane
    And I enter value of End time as "2:50" in the Filter pane
    Then verify it is possible to enter Start time before End time in the Filter pane

  Scenario: Verify whether it is possible to enter Start time after End date in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2226"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Pairing start time" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Start time as "3:00" field in the Filter pane
    And I enter value of End time as "4:00" in the Filter pane


