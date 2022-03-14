@data_management @count_rules
Feature: Rules- Validate Count.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1548" is added
    And I'm logged in with default credentials.

  Scenario: I want to validate rules count
    Given I open the scenario "aut_scenario_alt-1548"
    And I see the total count of rules
    And I open rules page
    When I count the total rule in table
    Then The data tiles and table counts are equal For Rule
