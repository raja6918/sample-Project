@data_management @pairing @Filter @generalFilterValidation
Feature: Pairing - General Filter Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2194_2739" is added
    And I'm logged in with default credentials.

  Scenario: Verify whether filter Panel is opens on clicking filter button on respective Timelines
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2194_2739"
    And I click on the Plus button
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    Then verify filter panel opens for Timeline One
    Then I close Timeline Filter panel
    When I click on pairing filter button for Timeline Two
    Then verify filter panel opens for Timeline Two
    Then I close Timeline Filter panel
    When I click on pairing filter button for Timeline Three
    Then verify filter panel opens for Timeline Three
    Then I close Timeline Filter panel

  Scenario: Verify The cancel and Apply button working properly on all the Timelines
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2194_2739"
    And I click on the Plus button
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    Then verify filter panel opens for Timeline One
    Then I verify Apply button and cancel button behaves as expected
    When I click on pairing filter button for Timeline Two
    Then verify filter panel opens for Timeline Two
    Then I verify Apply button and cancel button behaves as expected
    When I click on pairing filter button for Timeline Three
    Then verify filter panel opens for Timeline Three
    Then I verify Apply button and cancel button behaves as expected

  Scenario: Verify the default value on filter type field on each Timeline
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-2194_2739"
    And I click on the Plus button
    And I click on the Plus button
    When I click on pairing filter button for Timeline One
    Then I verify the default value on filter type field as "Pairings filter"
    Then I close Timeline Filter panel
    When I click on pairing filter button for Timeline Two
    Then I verify the default value on filter type field as "Pairings filter"
    Then I close Timeline Filter panel
    When I click on pairing filter button for Timeline Three
    Then I verify the default value on filter type field as "Pairings filter"
    Then I close Timeline Filter panel

 #Scenario: Verify canvas element
    #Given I'm in the Pairing Page for scenario "aut_scenario_alt-2194_2739"
    #And I click on ZoomIn
    #And I verify Canvas element










