@stations @scenariosFlag
Feature: Stations Read Only feature

  Background:
    Given The Scenario "aut_scenario_station_RO" is added
    And The scenario "aut_scenario_station_RO" is opened through backend
#    And The users with following values are added
 #     | First Name | User               |
  #    | Last Name  | Automation         |
   #   | User Name  | aut_user           |
   #   | Email      | aut@konos-test.com |
    #  | Password   | Password1          |
    #  | Role       | Administrator      |
    And I open login page

  @readonly
  Scenario: I want verify the legend shows View Only for scenario in Stations
    Given I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_station_RO"
    And I click 'Open' button on the View Only Information dialog
    When I open stations page
    Then The stations page legend shows 'view-only' beside the scenario name
