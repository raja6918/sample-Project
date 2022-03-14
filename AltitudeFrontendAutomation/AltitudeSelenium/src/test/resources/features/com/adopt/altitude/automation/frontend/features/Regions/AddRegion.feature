@data_management @regions @addRegion
Feature: Region - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-582" is added
    And I'm logged in with default credentials.

  Scenario: I want to add a new region
    Given Regions page for scenario "aut_scenario_alt-582" is displayed
    When I add the region "aut_region" with code "AUT"
    Then the new region is displayed in the regions list

  Scenario: I want to validate Region Code error message
    Given Regions page for scenario "aut_scenario_alt-582" is displayed
    When I try to add the region "aut_region" with code "#123"
    Then the message "Region code should be in format similar to: EMEA or ASIA-PAC" for region form is displayed

  Scenario: I want to validate Region Name error message
    Given Regions page for scenario "aut_scenario_alt-582" is displayed
    When I try to add the region "#$%" with code "AUT"
    Then the message "Region name cannot start with space, number or special character" for region form is displayed

  Scenario: I want to add a new region with an existing code
    Given Regions page for scenario "aut_scenario_alt-582" is displayed
    And The region "aut_region" with code "AUT" is added
    When I add the region "aut_region" with code "AUT"
    Then The Error message "The region code AUT already exists, please enter a different one." for crew base form is displayed
