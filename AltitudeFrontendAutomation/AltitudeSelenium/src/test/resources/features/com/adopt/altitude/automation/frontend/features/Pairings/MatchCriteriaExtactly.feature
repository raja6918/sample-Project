@data_management @pairing @Filter @MinMaxFilterValidation
Feature: Pairing - Min-Max Filter Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2225" is added
    And I'm logged in with default credentials.

  Scenario: Verify whether Min and Max field are present for sub-criteria Duty Days and flights.
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2225"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duty days" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify Min and Max field are present
    And I click on Criteria and select "Duty period criteria"
    And I click "Flights (in duty)" sub-criteria checkbox
    And I click on add button to add criteria of Duty period Criteria
    Then I verify Min and Max field are present

  Scenario: Verify whether it is possible to enter the same value for Min and Max in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2225"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duty days" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Min as "3" field in the Filter pane
    And I enter value of Max field as "3" in the Filter pane
    Then verify it is possible to enter the same value for Min and Max in the Filter pane

  Scenario: Verify whether it is possible to enter Min field smaller than Max field in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2225"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duty days" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Min as "2" field in the Filter pane
    And I enter value of Max field as "5" in the Filter pane
    Then verify it is possible to enter Min field smaller than Max field in the Filter pane

  Scenario: Verify whether it is not possible to enter Min field greater than Max field in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2225"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duty days" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Min as "2" field in the Filter pane
    And I enter value of Max field as "1" in the Filter pane
    Then verify it is not possible to enter Min field greater than Max field with error message "The minimum value must be smaller than or same as the maximum."
