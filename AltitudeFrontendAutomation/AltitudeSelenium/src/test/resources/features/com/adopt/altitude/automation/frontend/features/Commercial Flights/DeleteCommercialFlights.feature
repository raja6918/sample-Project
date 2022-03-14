@data_management @commercial_flights @delete_commercial_flights
Feature: Commercial Flight - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2790" is added
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
    Then I'm in the Commercial Flight page for scenario "aut_scenario_alt-2790"
    And I open the add new commercial flight drawer
    Then I entered the following data for Commercial Flight for mandatory fields
      | Airline            | QK              |
      | Flight             |            9999 |
      | FromStation        | AUT             |
      | ToStation          | AUT             |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | AircraftType       |             CS1 |
      | FlightDate         |              27 |
    And I add the Commercial Flight
    Then A new Commercial Flight is added to list

  Scenario: I want to delete commercial Flight
    When I delete commercial flight "QK9999"
    Then the message "Commercial flight QK9999 has been successfully deleted." for commercial Flight is displayed

  Scenario: I want to cancel delete option for  commercial Flight
    And I cancel delete commercial flight "QK9999"
    Then verify successfully that no deletion happens for commercial flight
