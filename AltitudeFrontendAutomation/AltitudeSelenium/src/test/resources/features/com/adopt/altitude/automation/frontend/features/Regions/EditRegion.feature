@data_management @regions @editRegion
Feature: Region - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-583" is added
    And The region "aut_region" with code "AUT" is added
    And The region "aut_region_2" with code "TUA" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit region name
    Given Regions page for scenario "aut_scenario_alt-583" is displayed
    When I update the name to "aut_region_updated" for region "aut_region"
    Then the updated region is displayed in the regions list

  Scenario: I want to edit region code
    Given Regions page for scenario "aut_scenario_alt-583" is displayed
    When I update the code to "TUA_CODE_UPDATE" for region "aut_region"
    Then the updated region is displayed in the regions list

  Scenario: I want to edit region code with an existing code
    Given Regions page for scenario "aut_scenario_alt-583" is displayed
    When I update the code to "AUT" for region "aut_region_2"
    Then The Error message "The region code AUT already exists, please enter a different one." for crew base form is displayed
