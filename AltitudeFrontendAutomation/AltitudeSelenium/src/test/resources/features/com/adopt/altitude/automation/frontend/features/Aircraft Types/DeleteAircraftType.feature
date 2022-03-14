@data_management @aircraftTypes @deleteAircraftType @crewGroups
Feature: Aircraft Type, Position, Crew Group - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1596" is added
    And The aircraft models with following values are added
      | Name | aut_aircraft_model | aut_aircraft_model_secondary |
      | Code |                123 |                          345 |
    And the aircraft type with default values is added
    And The position "aut_position" with code "AUT" of type "CABIN" and order "1" is added
    And I'm logged in with default credentials.

  @PositiveScenario
  Scenario: I want to delete aircraft type
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1596"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | AUT                |
      | Airlines         | QK                 |
      | Aircraft Type    | 123                |
      | Default Rule Set | baseline           |
    And I add the new crew group
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    When I click on Positions icon in left panel
    When I delete position "AUT"
    Then the message "Position AUT has been successfully deleted." is displayed
    And I want to back home
    When I open aircraft types page
    When I want to delete AirCraft with aircraft type "123"
    Then the message "Aircraft type 123 has been successfully deleted." for aircraft is displayed
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then the message "Aircraft model 123 has been successfully deleted." for aircraft model is displayed

   @cancelDeleteAircraft
  Scenario: I want to cancel delete Aircraft
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1596"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup1      |
      | Position         | AUT                |
      | Airlines         | QK                 |
      | Aircraft Type    | 123                |
      | Default Rule Set | baseline           |
    And I add the new crew group
    And I cancel delete crewgroup "AUT_CrewGrup1"
    Then verify successfully that no deletion happens for CrewGroup
    When I click on Positions icon in left panel
    When I cancel delete position "AUT"
    Then verify successfully that no deletion happens for Position
    And I want to back home
    When I open aircraft types page
    And I want to cancel AirCraft with aircraft type "123"
    Then verify successfully that no deletion happens in Aircraft Type
    And I want to back home
    When I open aircraft models page
    And I want to cancel Aircraft model "aut_aircraft_model"
    Then verify successfully that no deletion happens in Aircraft model

  Scenario: I want to delete AircraftType after verifying dependent data and then delete Position, CrewGroup
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1596"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | AUT                |
      | Airlines         | QK                 |
      | Aircraft Type    | 123                |
      | Default Rule Set | baseline           |
    And I add the new crew group
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then verify the reference error for aircraft model "This aircraft model cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button for the reference error in aircraft model
    When I click on "Back to Aircraft Types" link
    And I want to delete AirCraft with aircraft type "123"
    Then verify the reference error for aircraft type "This aircraft type cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button for the reference error in AirCraft Type
    When I click on Positions icon in left panel
    When I delete position "AUT"
    Then verify the reference error for position "This position cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button for the reference error in Position
    When I click on CrewGroup icon in left panel
    When I delete crewgroup "AUT_CrewGrup"
    Then the message "Crew group AUT_CrewGrup has been successfully deleted." for crewgroup is displayed
    When I click on Positions icon in left panel
    When I delete position "AUT"
    Then the message "Position AUT has been successfully deleted." is displayed
    And I want to back home
    When I open aircraft types page
    When I want to delete AirCraft with aircraft type "123"
    Then the message "Aircraft type 123 has been successfully deleted." for aircraft is displayed
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then the message "Aircraft model 123 has been successfully deleted." for aircraft model is displayed

