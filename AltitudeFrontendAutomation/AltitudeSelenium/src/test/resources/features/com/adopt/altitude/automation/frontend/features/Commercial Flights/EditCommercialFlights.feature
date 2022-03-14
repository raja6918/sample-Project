@data_management @commercial_flights @edit_commercial_flights
Feature: Commercial Flight - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2789" is added
    Then The currencies with following values are added
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
      | Code         | TUA             |
      | Name         | aut_station_two |
      | Country Code | ZZ              |
    And The default stations with following values are added
      | Code         | ABC               |
      | Name         | aut_station_three |
      | Country Code | ZZ                |
    And I'm logged in with default credentials.
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2789"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight for mandatory fields
      | Airline            | AO              |
      | Flight             |            9999 |
      | FromStation        | AUT             |
      | ToStation          | TUA             |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | FlightDate         |              29 |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list

  Scenario: I want to update Airline
    When I update the airline to "AU" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Flight number
    When I update the flight to "1000" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Suffix
    When I update the suffix to "Q" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Aircraft Type
    When I update the Aircraft Type to "77W" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Cabin Configuration
    When I update the Cabin Configuration to "ASD" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Flight Date
    When I update the flight date to "30" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Flight Terminals
    When I update the from terminal to "1" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list
    When I update the to terminal to "1" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update departure and arrival station
    When I update the departure station to "TUA" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list
    When I update the arrival station to "ABC" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Departure and Arrival Time
    When I update the departure time to "10:00" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list
    When I update the arrival time to "21:15" for commercial flight "9999"
    Then the updated commercial flight is displayed in the commercial flights list

  Scenario: I want to update Commercial flight using invalid airline code
    When I update the airline to "@AU" for commercial flight "9999"
    Then the message "Must be 2 to 3 letters" for commercial flight form is displayed

  Scenario: I want to update Commercial flight using invalid Flight
    When I update the flight to "$Aut" for commercial flight "9999"
    Then the message "Must be 1 to 4 digits" for commercial flight form is displayed

  Scenario: I want to update Commercial flight using invalid Suffix
    When I update the suffix to "$" for commercial flight "9999"
    Then the message "Must be one letter" for commercial flight form is displayed

  Scenario: I want to update Commercial flight using invalid aircraft
    When I update the Aircraft Type to "$Aut" for commercial flight "9999"
    Then the message "Aircraft type should be in a format similar to: B77W or 773" for commercial flight form is displayed

  Scenario: I want to update Commercial flight using invalid Cabin Configuration
    When I update the Cabin Configuration to "$Aut" for commercial flight "9999"
    Then the message "Must be a string of characters (max 20)" for commercial flight form is displayed
