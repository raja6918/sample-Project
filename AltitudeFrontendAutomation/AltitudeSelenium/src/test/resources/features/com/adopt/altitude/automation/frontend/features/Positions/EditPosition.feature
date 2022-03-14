@data_management @positions @editPosition
Feature: Position - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-705" is added
    And The position "aut_position" with code "AUT" of type "CABIN" and order "1" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit Position name
    Given Positions page for scenario "aut_scenario_alt-705" is displayed
    When I update the name to "aut_position_updated" for position "aut_position"
    Then the updated position is displayed in the positions list

  Scenario: I want to edit position code
    Given Positions page for scenario "aut_scenario_alt-705" is displayed
    When I update the code to "CODE_UPTD" for position "aut_position"
    Then the updated position is displayed in the positions list

  Scenario: I want to edit position type
    Given Positions page for scenario "aut_scenario_alt-705" is displayed
    When I update the type to "Flight deck" for position "aut_position"
    Then the updated position is displayed in the positions list

  Scenario: I want to edit position code with an existing code
    Given Positions page for scenario "aut_scenario_alt-705" is displayed
    When The position "aut_position" with code "TUA" of type "CABIN" and order "1" is added
    Then I update the code to "AAA" for position "aut_position"
    Then the message "Position aut_position (AAA) has been successfully updated." for position is displayed

