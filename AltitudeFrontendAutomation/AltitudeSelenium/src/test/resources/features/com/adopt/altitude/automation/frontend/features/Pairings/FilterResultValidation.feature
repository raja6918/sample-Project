@data_management @pairing @Filter @FilterResultValidation
Feature: Pairing Filter - Filter Result Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2372" is added
    And I'm logged in with default credentials.
    And I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2372"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully


  Scenario: Verify that based on on the criteria specified in the filter pane a filter expression is produced for timeline one
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Flight criteria"
    And I click "Flight arrival weekday" sub-criteria checkbox
    And I click on add button to add criteria for Flight Criteria
    And I click "1" sub-criteria checkbox
    And I click "3" sub-criteria checkbox
    Then I click on apply button
    Then I verify that the filter expression is generated for Timeline One

  Scenario: Verify that based on on the criteria specified in the filter pane a filter expression is produced for timeline two
    Given I go to Pairing Page
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
    Then I verify that the filter expression is generated for Timeline Two

  Scenario: Verify that Apply button is disabled whenever a validation error is triggered in any of the criteria in the filter pane
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Duty days" sub-criteria checkbox
    And I click on add button to add criteria
    And I enter value of Min as "2" field in the Filter pane
    And I enter value of Max field as "1" in the Filter pane
    Then verify it is not possible to enter Min field greater than Max field with error message "The minimum value must be smaller than or same as the maximum."
    Then I verify that apply button is disabled

  Scenario: that filter expression is cleared by opening another scenario
    Given The Scenario "aut_scenario_alt-2372_Different_Scenario" is added
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    Then I click on apply button
    Then I check filter count before
    And I go to scenario page
    Then I'm in the data home page for scenario "aut_scenario_alt-2372_Different_Scenario"
    And I go to scenario page
    And I'm in the Pairing Page for scenario "aut_scenario_alt-2372"
    Then I check filter count after
    Then I verify that the filter expression is cleared

  Scenario: Verify that filter expression is cleared by log out the application
    Given I go to Pairing Page
    And I select crewgroup "Combo Pilots"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    Then I click on apply button
    Then I verify that the filter expression is present in the pairing page
    Then I log out
    And I'm logged in with default credentials.
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2372"
    Then I verify that the filter expression is cleared

  Scenario: Verify whether it is possible to reload the entire data set by clicking the Clear Filter icon
      Given I go to Pairing Page
      And I select crewgroup "Combo Pilots"
      And I click on the Plus button
      When I click on pairing filter button for Timeline One
      And I click on Criteria and select "Pairing criteria"
      And I click "Crew base" sub-criteria checkbox
      And I click on add button to add criteria
      And I click "YUL" sub-criteria checkbox
      Then I click on apply button
      Then I verify that the filter expression is present in the pairing page
      Then I click on Clear filter icon
      Then I verify that the filter expression is cleared and count changes to zero

  Scenario: Verify that the filter results is available after refreshing the screen
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
    Then I verify that the filter expression is present in the pairing page even after refresh the page

  Scenario: Verify that filter results is available after navigating away from the Pairings page and returning back
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
    Then I verify that the filter expression is present in the pairing page even after navigate from the page












