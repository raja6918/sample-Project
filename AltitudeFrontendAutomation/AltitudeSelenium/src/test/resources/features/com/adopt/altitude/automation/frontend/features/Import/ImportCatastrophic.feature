@import_catastrophic_error @data_management
Feature: Import Catastrophic Error.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1507" is added
    And I'm logged in with default credentials.
    And I create a error file "catastrophic_file.pairing" on temp directory

  Scenario: Add a file and validate Catastrophic error
  	Given I'm in the data home page for scenario "aut_scenario_alt-1507"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the file "catastrophic_file.pairing" to the import window
    Then I click button to Import
    And I wait for the import process to complete
    Then I get pop up for Import Failed saying "-The format of the file is not proper XML"
    Then I click on close button for pop up
    And The Import Data button is Active now
