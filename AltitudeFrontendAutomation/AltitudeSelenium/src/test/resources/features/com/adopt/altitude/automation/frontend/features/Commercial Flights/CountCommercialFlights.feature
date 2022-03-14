@data_management @commercial_flights @count_commercial_flights
Feature: Commercial Flight - Validate Count.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2841" is added

  Scenario: I want to validate Commercial Flight count
    And I'm logged in with default credentials.
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2841"
    Then I count the total commercial flights in table
    And I go back to data home page
    Then I scroll to Data Card "Commercial flights"
    When I see the total count of commercial flights
    Then The data tiles and table counts are equal for commercial flight

  Scenario: I want to validate Commercial Flight count after i add new Commercial Flight
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
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2841"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight for mandatory fields
      | Airline            | AO              |
      | Flight             |            9999 |
      | FromStation        | AUT             |
      | ToStation          | AUT             |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | FlightDate         |              29 |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list
    Then I count the total commercial flights in table
    And I go back to data home page
    Then I scroll to Data Card "Commercial flights"
    When I see the total count of commercial flights
    Then The data tiles and table counts are equal for commercial flight

  Scenario: I want to validate Commercial Flight count after i add/delete Commercial Flight
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
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2841"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight for mandatory fields
      | Airline            | AA              |
      | Flight             |            1000 |
      | FromStation        | AUT             |
      | ToStation          | AUT             |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | FlightDate         |              29 |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list
    Then I count the total commercial flights in table
    And I go back to data home page
    Then I scroll to Data Card "Commercial flights"
    When I see the total count of commercial flights
    Then The data tiles and table counts are equal for commercial flight
    And I click on data card link "Commercial flights"
    When I delete commercial flight "AA1000"
    Then the message "Commercial flight AA1000 has been successfully deleted." for commercial Flight is displayed
    Then I count the total commercial flights in table
    And I go back to data home page
    Then I scroll to Data Card "Commercial flights"
    When I see the total count of commercial flights
    Then The data tiles and table counts are equal for commercial flight
