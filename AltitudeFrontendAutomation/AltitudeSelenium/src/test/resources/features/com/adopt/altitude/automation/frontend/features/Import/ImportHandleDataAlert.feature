@import_handle_data-alerts @data_management
Feature: Import Handle Alert.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1508" is added
    And I'm logged in with default credentials.
    And I create a warning file "Flight_Summary_Alert.ssim" on temp directory
    And I create a warning file "Pairing_Summary_Alert.pairing" on temp directory
  #  And I create a warning file "flightschedule.ssim" on temp directory
  #  And I create a warning file "trip_sierra.xml" on temp directory

  Scenario: Add a Flight file and validate alert
  	Given I'm in the data home page for scenario "aut_scenario_alt-1508"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1508"
    And I upload the file "Flight_Summary_Alert.ssim" to the import window
    Then I click button to Import and see alert summary
    Then I click button to Import and handle alert summary

  Scenario: Add a Pairing file and validate alert
    Given I'm in the data home page for scenario "aut_scenario_alt-1508"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1508"
    And I upload the file "Pairing_Summary_Alert.pairing" to the import window
    Then I click button to Import and see alert summary
    Then I click button to Import and handle alert summary

  Scenario: Add a Pairing file and a Flight Flle and validate alert
    Given I'm in the data home page for scenario "aut_scenario_alt-1508"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1508"
    And I upload the file "Pairing_Summary_Alert.pairing" to the import window
    And I upload the file "Flight_Summary_Alert.ssim" to the import window
    Then I click button to Import and see alert summary
    Then I click button to Import and handle alert summary

 # Scenario: checking the pairing filters
  #  Given I'm in the data home page for scenario "aut_scenario_alt-1508"
   # And I click on Import Data button
  #  And I add the bin with name "aut_bin_1508"
   # And I upload the file "flightschedule.ssim" to the import window
   # Then I click button to Import and see alert summary
  #  Then I click button to Import and handle alert summary
   # And I click on Import Data button
   # And I add the bin with name "aut_bin_1508"
   # And I upload the file "trip_sierra.xml" to the import window
   # Then I click button to Import and see alert summary
  #  Then I click button to Import and handle alert summary
  # Then I select the Proper FileFormat
  #  Then I click button to Import and see alert summary
  #   Then I go to Pairing Page
  #  When I select crewgroup "Combo Pilots"
  #  And I click on the Plus button
  #  When I click on pairing filter button for Timeline One
  #     When I click on display all Pairings link
  #  When I click on pairing filter button for Timeline One
  #  When The Data with following values are added for aircraft types
  #    | startIndex | 0        |
   #   | endIndex   | 1        |
   #   | scope      | pairings |
   # Then I verify that "startIndex" is added to the response data of filter
   # Then I verify that "endIndex" is added to the response data of filter
   # Then I verify that "totalDataSize" is added to the response data of filter
  #  Then I verify that "data" is added to the response data of filter
   # Then I verify that "display" is added to the response data of filter
   # Then I verify that "value" is added to the response data of filter
   # Then I verify that "key" is added to the response data of filter

   # When The Data with following values are added for aircraft types
   #   | startIndex | 0   |
   #   | endIndex   | 1   |
   #   | scope      |     |
   # Then I receive filter error 400 with message "Field Validation error"








