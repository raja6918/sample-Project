@data_management @commercial_flights @add_commercial_flights
Feature: Commercial Flight - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2788" is added

  Scenario: I want to add a new Commercial Flight
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
    And I'm logged in with default credentials.
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight
      | Airline            | QK              |
      | Flight             |            9999 |
      | Suffix             | A               |
      | FromStation        | AUT             |
      | TerminalFrom       |               1 |
      | ToStation          | AUT             |
      | TerminalTo         |               1 |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | CabinConfiguration | ASD             |
      | FlightDate         |              29 |
      | FlightTags         | x               |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list

  Scenario: I want to add a new Commercial Flight filling mandatory fields only
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
    And I'm logged in with default credentials.
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight for mandatory fields
      | Airline            | QK              |
      | Flight             |            9999 |
      | FromStation        | AUT             |
      | ToStation          | AUT             |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | FlightDate         |              29 |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list

  Scenario: I want to add a new Commercial flight using invalid airline code
    Then I'm logged in with default credentials.
    And I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    When I enter "$Au" airline code for commercial flight
    Then the message "Must be 2 to 3 letters" for commercial flight form is displayed

  Scenario: I want to add a new Commercial using invalid Flight
    Then I'm logged in with default credentials.
    And I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    When I enter "$Aut" flight as commercial flight number
    Then the message "Must be 1 to 4 digits" for commercial flight form is displayed

  Scenario: I want to add a new Commercial flight using invalid Suffix
    Then I'm logged in with default credentials.
    And I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    When I enter "$" suffix for commercial flight
    Then the message "Must be one letter" for commercial flight form is displayed

  Scenario: I want to add a new Commercial flight using invalid aircraft
    Then I'm logged in with default credentials.
    And I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    When I enter "$Aut" aircraft for commercial flight
    Then the message "Aircraft type should be in a format similar to: B77W or 773" for commercial flight form is displayed

  Scenario: I want to add a new Commercial flight using invalid Cabin Configuration
    Then I'm logged in with default credentials.
    And I'm in the Commercial Flight page for scenario "aut_scenario_alt-2788"
    And I open the add new commercial flight drawer
    When I enter "$Aut" cabin configuration for commercial flight
    Then the message "Must be a string of characters (max 20)" for commercial flight form is displayed
