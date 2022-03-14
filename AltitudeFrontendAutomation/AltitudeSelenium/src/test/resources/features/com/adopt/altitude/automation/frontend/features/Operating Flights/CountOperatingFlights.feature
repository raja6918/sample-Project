@data_management @operating_flights @count_operating_flights
Feature: Operating Flight - Validate Count.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1537" is added
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

  Scenario: I want to validate Operating Flight count after i add new Operating Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1537"
    And I open the add new operating flight drawer
    When I entered the following data for Operating Flight
      | Airline            | QK              |
      | Flight             |            9999 |
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
    Then a new Operating Flight is added to list
    Then I count the total Operating flights in table
    And I go back to data home page
    Then I scroll to Data Card "Operating flights"
    When I see the total count of operating flights
    Then The data tiles and table counts are equal for operating flight

  Scenario: I want to validate Operating Flight count after i delete Operating Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1537"
    When I delete operating flight "1000"
    Then the message "Operating flight QK1000 has been successfully deleted." for operating Flight is displayed
    Then I count the total Operating flights in table
    And I go back to data home page
    Then I scroll to Data Card "Operating flights"
    When I see the total count of operating flights
    Then The data tiles and table counts are equal for operating flight
