@data_management @pairing @Filter @FilterGenericComponent
Feature: Pairing - Filter Generic Component Validation

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2195" is added
    And I'm logged in with default credentials.

  Scenario: Verify the add button and clear all button before and after selecting criteria checkBox
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    Then verify the add button and clear button are disabled before selecting a particular criteria
    And I click "Crew base" sub-criteria checkbox
    Then verify the add button and clear button are enabled after selecting a particular criteria

  Scenario: Verify the add criteria operation
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify that the criteria "Crew base" is displayed after the add operation

  Scenario: Verify the clear all operation of sub_criteria
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click clear all for the selected sub_criteria
    Then I verify that the selected sub_criteria "Crew base" is de-selected on clear all operation

  Scenario: Verify the search option for criteria
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I Search for sub-criteria "taf"
    And I verify sub-criteria "TAFB" is listed on the dropdown after the search
    And I click on clear option in search bar of sub criteria
    And I Search for sub-criteria "TAF"
    And I verify sub-criteria "TAFB" is listed on the dropdown after the search
    And I click on clear option in search bar of sub criteria
    Then I verify that the text typed in the search bar is cleared

  Scenario: Verify the search option for criteria after add criteria
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2195"
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
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I Search for sub-criteria "YU"
    And I verify sub-criteria "YUL" is listed on the dropdown after the search
    And I click on clear option in search bar of sub criteria
    And I Search for sub-criteria "YY"
    And I click on clear option in search bar of sub criteria
    Then I verify that the text typed in the search bar is cleared

  Scenario: Verify the clear all the checkbox for the selected criteria after the add operation
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2195"
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
    And I click "Crew base" sub-criteria checkbox
    And I click on add button to add criteria
    And I click "YUL" sub-criteria checkbox
    And I click clear all for the selected sub_criteria
    Then I verify that the selected sub_criteria "YUL" is de-selected on clear all operation

  Scenario: Verify the clear all option for the selected criteria after the add operation
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click "Layover at" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify that the criteria "Crew base" is displayed after the add operation
    And I click clear all for the selected sub_criteria after adding sub_criteria
    Then I verify that the criteria "Crew base" is not displayed
    Then I verify that the criteria "Layover at" is not displayed

  Scenario: Verify the delete option for the selected criteria after the add operation
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2195"
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    And I click on Criteria and select "Pairing criteria"
    And I click "Crew base" sub-criteria checkbox
    And I click "Layover at" sub-criteria checkbox
    And I click on add button to add criteria
    Then I verify that the criteria "Crew base" is displayed after the add operation
    Then I verify that the criteria "Layover at" is displayed after the add operation
    Then I click on delete button for "Crew base" sub-criteria
    Then I verify that the criteria "Crew base" is not displayed
    Then I verify that the criteria "Layover at" is displayed after the add operation




