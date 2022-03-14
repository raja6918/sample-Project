@import_data-alerts @data_management
Feature: Import Alert Summary.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1504" is added
    And I'm logged in with default credentials.
    And I create a warning file "Flight_Summary_Alert.ssim" on temp directory
    And I create a warning file "Pairing_Summary_Alert.pairing" on temp directory

  Scenario: Add a Flight file and validate alert
  	Given I'm in the data home page for scenario "aut_scenario_alt-1504"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1504"
    When the import drop files area is displayed
    And I upload the file "Flight_Summary_Alert.ssim" to the import window
    Then I click button to Import and see alert summary

  Scenario: Add a Pairing file and validate alert
    Given I'm in the data home page for scenario "aut_scenario_alt-1504"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1504"
    And I upload the file "Pairing_Summary_Alert.pairing" to the import window
    Then I click button to Import and see alert summary

  Scenario: Add a Pairing file and a Flight Flle and validate alert
    Given I'm in the data home page for scenario "aut_scenario_alt-1504"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1504"
    And I upload the file "Pairing_Summary_Alert.pairing" to the import window
    And I upload the file "Flight_Summary_Alert.ssim" to the import window
    Then I click button to Import and see alert summary
