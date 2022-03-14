@data_management @pairing @Filter @ComboBoxValidation
Feature: Pairing Filter - Combo Box with Static Value Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2227" is added
    And I'm logged in with default credentials.

  Scenario: Verify the dropdown vales for criteria TOG aircraft Change and verify whether it is possible to select TOG aircraft Change's sub-criteria in the Filter pane
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2227"
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

  Scenario: Verify the dropdown vales for criteria Flight arrival weekday in the Filter pane for Timeline One
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2227"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Flight criteria"
    And I click "Flight arrival weekday" sub-criteria checkbox
    And I click on add button to add criteria for Flight Criteria
    Then I verify all values in the dropdown of "Flight arrival weekday"
    And I click "1" sub-criteria checkbox
    And I click "3" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "1" is selected on last filter operation
    Then I verify that the filtered sub_criteria "3" is selected on last filter operation

  Scenario: Verify the dropdown vales for criteria Flight departure weekday in the Filter pane for Timeline One
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2227"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Flight criteria"
    And I click "Flight departure weekday" sub-criteria checkbox
    And I click on add button to add criteria for Flight Criteria
    Then I verify all values in the dropdown of "Flight departure weekday"
    And I click "5" sub-criteria checkbox
    And I click "3" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "5" is selected on last filter operation
    Then I verify that the filtered sub_criteria "3" is selected on last filter operation

  Scenario: Verify the dropdown vales for criteria Flight Start DOW in the Filter pane for Timeline Two
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2227"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    When I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline Two
    And I selected the FilterType as "Flights filter"
    And I selected the FlightType as "Operating"
    And I click on Criteria and select "Flight criteria"
    And I click "Flight start DOW" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify all values in the dropdown of "Flight start DOW"
    And I click "4" sub-criteria checkbox
    And I click "2" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline Two
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "4" is selected on last filter operation
    Then I verify that the filtered sub_criteria "2" is selected on last filter operation

  Scenario: Verify the dropdown vales for criteria Flight End DOW in the Filter pane for Timeline Two
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2227"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    When I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline Two
    And I selected the FilterType as "Flights filter"
    And I selected the FlightType as "Operating"
    And I click on Criteria and select "Flight criteria"
    And I click "Flight end DOW" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify all values in the dropdown of "Flight end DOW"
    And I click "4" sub-criteria checkbox
    And I click "2" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline Two
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "4" is selected on last filter operation
    Then I verify that the filtered sub_criteria "2" is selected on last filter operation


