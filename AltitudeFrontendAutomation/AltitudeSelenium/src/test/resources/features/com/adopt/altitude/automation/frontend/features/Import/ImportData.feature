@import_data @data_management
Feature: Import Management.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1093" is added
    And I'm logged in with default credentials.
    And I create a file "pairing_1.pairing" on temp directory
    And I create a file "flight_1.ssim" on temp directory
    And I create a file "pairing_2.pairing" on temp directory
    And I create a file "flight_2.ssim" on temp directory
    And I create a file "unrecognized.aut" on temp directory
    And I create a warning file "flight_badFormat.ssim" on temp directory
    And I create a warning file "pairing_IncompleteData.pairing" on temp directory

  Scenario: I want to validate Import Data button is active
    When I'm in the data home page for scenario "aut_scenario_alt-1093"
    Then The Import Data button is Active

  Scenario: I want to validate Import screen
    Given I'm in the data home page for scenario "aut_scenario_alt-1093"
    When I click on Import Data button
    Then The initial Import Screen is displayed

  Scenario: I want to validate the data home screen is Inactive while import in progress
    Given I'm in the data home page for scenario "aut_scenario_alt-1093"
    And I click on Import Data button
    And I add the bin with name "AUT_Bin_"
    And I upload the file "pairing_1.pairing" to the import window
    When I click button to Import Data
    And I wait until files uploaded successfully
    #Then The data home screen is Inactive

  Scenario: Add an Unrecognized file
    Given I'm in the data home page for scenario "aut_scenario_alt-1093"
    And I click on Import Data button
    And I add the bin with name "AUT_Bin_1"
   # And the import drop files area is displayed
    When I upload the file "unrecognized.aut" to the import window
    Then The error tooltip icon is displayed for "unrecognized.aut" card
    And The import button is disabled

  @wip
   Scenario: Add more than 1 Pairing file
    Given I'm in the data home page for scenario "aut_scenario_alt-1093"
    And I click on Import Data button
    And I add the bin with name "AUT_Bin_1"
    #And the import drop files area is displayed
    When I upload the file "pairing_1.pairing" to the import window
    And I upload the file "pairing_2.pairing" to the import window
    Then The error tooltip icon is displayed for "pairing_1.pairing" card
    And The error tooltip icon is displayed for "pairing_2.pairing" card
    And The import button is disabled

  @wip
   Scenario: Add more than 1 Operating Flight file
    Given I'm in the data home page for scenario "aut_scenario_alt-1093"
    And I click on Import Data button
    And I add the bin with name "AUT_Bin_1"
    #And the import drop files area is displayed
    When I upload the file "flight_1.ssim" to the import window
    And I upload the file "flight_2.ssim" to the import window
    Then The error tooltip icon is displayed for "flight_1.ssim" card
    And The error tooltip icon is displayed for "flight_2.ssim" card
    And The import button is disabled
