@data_management @operating_flights @delete_Operating_flights
Feature: Operating Flight, Aircraft type, Aircraft model  - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1602" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate |          1.0 |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And The default stations with following values are added
      | Code         | AUX             |
      | Name         | aut_station_two |
      | Country Code | ZZ              |
    And The aircraft models with following values are added
      | Name | aut_aircraft_model | aut_aircraft_model_secondary |
      | Code |                123 |                          345 |
    And the aircraft type with default values is added
    And the operating flight with default values is added
    And I'm logged in with default credentials.

  @PositiveScenario
  Scenario: I want to delete Flight, Aircraft type and Aircraft model with no dependent data
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1602"
    When I delete operating flight "1000"
    Then the message "Operating flight QK1000 has been successfully deleted." for operating Flight is displayed
    And I want to back home
    When I open aircraft types page
    And I want to delete AirCraft with aircraft type "AUT123"
    Then the message "Aircraft type 123 has been successfully deleted." for aircraft is displayed
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then the message "Aircraft model 123 has been successfully deleted." for aircraft model is displayed

  Scenario: I want to cancel delete Flight, Aircraft type and Aircraft model
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1602"
    And I cancel delete operating flight "1000"
    Then verify successfully that no deletion happens
    And I want to back home
    When I open aircraft types page
    And I want to cancel AirCraft with aircraft type "AUT123"
    Then verify successfully that no deletion happens in Aircraft Type
    And I want to back home
    When I open aircraft models page
    And I want to cancel Aircraft model "aut_aircraft_model"
    Then verify successfully that no deletion happens in Aircraft model

  Scenario: I want to delete Operating Flight after verifying dependent data and then delete Aircraft type and Aircraft model
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1602"
    And I open the add new operating flight drawer
    When I entered the following data for Operating Flight
      | Airline            | QK              |
      | Flight             |            1001 |
      | Suffix             |                 |
      | FromStation        | AUT             |
      | TerminalFrom       |               1 |
      | ToStation          | AUT             |
      | TerminalTo         |               1 |
      | DepartureTime      | 15:00           |
      | ArrivalTime        | 18:00           |
      | ServiceType        |                 |
      | OnwardFlight       |                 |
      | OnwardDayOffset    |                 |
      | AircraftType       |              123|
      | CabinConfiguration |                 |
      | TailNumber         |                 |
      | DeadheadSeats      |                 |
      | FlightDate         |              29 |
      | FlightTags         |                 |
    And I add the Operating Flight
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then verify the reference error "This aircraft model cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button
    When I click on "Back to Aircraft Types" link
    And I want to delete AirCraft with aircraft type "AUT123"
    Then verify the reference error "This aircraft type cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button
    When I click on operating flight icon in left panel
    Then I count the total Operating flights in table
    When I delete operating flight "1001"
    Then the message "Operating flight QK1001 has been successfully deleted." for operating Flight is displayed
    Then Verify successfully that operating flight count decreased by one after deletion
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then verify the reference error "This aircraft model cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button
    When I click on "Back to Aircraft Types" link
    And I want to delete AirCraft with aircraft type "AUT123"
    Then verify the reference error "This aircraft type cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
    And I click on close button
    When I click on operating flight icon in left panel
    When I delete operating flight "1000"
    Then the message "Operating flight QK1000 has been successfully deleted." for operating Flight is displayed
    And I want to back home
    When I open aircraft types page
    And I want to delete AirCraft with aircraft type "AUT123"
    Then the message "Aircraft type 123 has been successfully deleted." for aircraft is displayed
    And I want to back home
    When I open aircraft models page
    And I want to delete Aircraft model "aut_aircraft_model"
    Then the message "Aircraft model 123 has been successfully deleted." for aircraft model is displayed





