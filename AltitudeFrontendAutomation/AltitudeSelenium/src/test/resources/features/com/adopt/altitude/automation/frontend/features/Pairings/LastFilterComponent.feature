@data_management @pairing @Filter @LastFilterComponent
Feature: Pairing - Last Filter Component Validation

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2326" is added
    And I'm logged in with default credentials.
    And I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2326"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully

  Scenario: Verify the last filter option is disabled before applying any filter
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    Then I verify that Last Filter option is disabled

  Scenario: Verify that filter pane is filled and replaced with the filtered criteria that were last applied
    #Given I'm in the Pairing Page for scenario "aut_scenario_alt-2326"
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "YUL" is selected on last filter operation
    Then I verify that the filtered sub_criteria "YVR" is selected on last filter operation
    Then I click on delete button for "Crew base" sub-criteria
    And I click on Criteria and select "Pairing criteria"
    And I click "Layover at" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YSJ" sub-criteria checkbox
    And I click "YYZ" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "YSJ" is selected on last filter operation
    Then I verify that the filtered sub_criteria "YYZ" is selected on last filter operation

  Scenario: Verify that the last filter is available after refreshing the screen
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    Then I refresh the page
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "YUL" is selected on last filter operation
    Then I verify that the filtered sub_criteria "YVR" is selected on last filter operation

  Scenario: Verify thatThe last filter is available after navigating away from the Pairings page and returning back
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    Then I go to scenario page
    Then I go to Pairing Page
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "YUL" is selected on last filter operation
    Then I verify that the filtered sub_criteria "YVR" is selected on last filter operation

  Scenario: Verify that Changing criteria values is possible on last filtered values
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    And I click "YUL" sub-criteria checkbox
    And I click "YYZ" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the filtered sub_criteria "YYZ" is selected on last filter operation
    Then I verify that the selected sub_criteria "YUL" is de-selected

  Scenario: Verify that Add and delete operation is possible on last filtered values
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I click on delete button for "Crew base" sub-criteria
    Then I verify that Last Filter option is enabled
    Then I verify that the criteria "Crew base" is not displayed
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify that the criteria "Crew base" is displayed after the add operation
    Then I verify that Last Filter option is enabled

  Scenario: Verify that cancel button working as expected
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Layover at" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YSJ" sub-criteria checkbox
    And I click "YYZ" sub-criteria checkbox
    Then I click on cancel button
    Then I verify that filter pane is closed
    When I click on pairing filter button for Timeline One
    Then I click on "Last Filter" option
    Then I verify that the criteria "Layover at" is not displayed

  Scenario: When I closed the timeline window
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline Two
    And I selected the FilterType as "Flights filter"
    And I selected the FlightType as "Operating"
    And I click on Criteria and select "Flight criteria"
    And I click "Flight designator" sub-criteria checkbox
    And I click on add button to add criteria.
    And I click "QK8580" sub-criteria checkbox
    Then I click on apply button
    When I click on pairing filter button for Timeline Two
    Then I verify that Last Filter option is enabled
    Then I click on cancel button
    Then I close the timeline Window
    And I click on the Plus button
    When I click on pairing filter button for Timeline Two
    Then I verify that Last Filter option is disabled

  Scenario: When I Switch to another scenario and return back
    Given The Scenario "aut_scenario_alt-2326_Different_Scenario" is added
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    Then I click on apply button
    And I go to scenario page
    Then I'm in the data home page for scenario "aut_scenario_alt-2326_Different_Scenario"
    And I go to scenario page
    And I'm in the Pairing Page for scenario "aut_scenario_alt-2326"
    When I click on pairing filter button for Timeline One
    Then I verify that Last Filter option is disabled

  Scenario: When I changed to crew group and return back
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click "YVR" sub-criteria checkbox
    Then I click on apply button
    When I do first time crewgroup "CRJ Pilots" selection
    When I do first time crewgroup "Combo Pilots" selection
    When I click on pairing filter button for Timeline One
    Then I verify that Last Filter option is disabled





