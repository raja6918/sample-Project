@data_management @pairing @Filter @Duties_LayoverDuration_TOGAircraftChange
Feature: Pairing Filter - Duties,LayoverDuration,TOG Aircraft Change Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1556" is added
    And I'm logged in with default credentials.

  Scenario: Verify the Duties criteria's min-max component
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-1556"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    When I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duties" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify Min and Max field are present
    And I enter value of Min as "3" field in the Filter pane
    And I enter value of Max field as "3" in the Filter pane
    Then verify it is possible to enter the same value for Min and Max in the Filter pane
    And I enter value of Min as "2" field in the Filter pane
    And I enter value of Max field as "1" in the Filter pane
    Then verify it is not possible to enter Min field greater than Max field with error message "The minimum value must be smaller than or same as the maximum."
    And I enter value of Min as "2" field in the Filter pane
    And I enter value of Max field as "5" in the Filter pane
    Then verify it is possible to enter Min field smaller than Max field in the Filter pane
    Then I click on apply button
    Then I verify that the filter expression is generated for Timeline One

  Scenario: Verify the dropdown vales for criteria TOG aircraft Change and verify whether it is possible to select TOG aircraft Change's sub-criteria in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1556"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "TOG aircraft change" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "With change" sub-criteria checkbox
    And I click "Without change" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "With change" is selected on last filter operation
    Then I verify that the filtered sub_criteria "Without change" is selected on last filter operation

  Scenario: Verify the Layover Duration criteria's min-max component
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1556"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Layover duration" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify Min and Max field are present
    And I enter value of Min as "3" field in the Filter pane
    Then I verify that Only durations can be typed in min-max field, else get error message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)"
    And I enter value of Min as "05h70" field in the Filter pane
    Then I verify that error message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)"
    And I enter value of Min as "6h7" field in the Filter pane
    Then I verify that error message "Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)"
    And I enter value of Min as "1000h45" field in the Filter pane
    And I enter value of Max field as "09h30" in the Filter pane
    Then verify it is not possible to enter Min field greater than Max field with error message "The minimum value must be smaller than or same as the maximum."
    And I enter value of Min as "10h07" field in the Filter pane
    Then I verify that it is possible to enter min or max field alone and apply
