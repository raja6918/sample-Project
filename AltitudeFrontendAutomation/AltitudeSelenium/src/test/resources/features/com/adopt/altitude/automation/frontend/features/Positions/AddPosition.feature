@data_management @positions
Feature: Position - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-704" is added
    And I'm logged in with default credentials.

  @addPosition
  Scenario: I want to add a new Position
    Given Positions page for scenario "aut_scenario_alt-704" is displayed
    When I add the Position "aut_position" with code "AUT" type as "Cabin crew"
    Then the new Position is displayed in the Positions list

  Scenario: I want to validate Position Name error message
    Given Positions page for scenario "aut_scenario_alt-704" is displayed
    When I try to add a Position with invalid name "#$%&"
    Then the message "Position name cannot start with a space or special character" for Position form is displayed

  Scenario: I want to validate Position Code error message
    Given Positions page for scenario "aut_scenario_alt-704" is displayed
    When I try to add a Position with invalid code "FA-#1"
    Then the message "Position code should be in format similar to: CPT or FA-J" for Position form is displayed

  Scenario: I want to add a Position without Type
    Given Positions page for scenario "aut_scenario_alt-704" is displayed
    When I try to add a Position with name "aut_position" and code "AUT"
    Then the Add button is disabled for Position form
