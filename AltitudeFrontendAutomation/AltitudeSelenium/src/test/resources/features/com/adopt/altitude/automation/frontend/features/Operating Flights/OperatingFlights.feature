@data_management @operating_flights @add_operating_flights
Feature: Operating Flight - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1234" is added
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
      | Code         | ZZX         |
      | Name         | zzx_station |
      | Country Code | ZZ          |
    And I'm logged in with default credentials.

  @addOpearatingFlight
  Scenario: I want to add a new Operating Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I entered the following data for Operating Flight
      | Airline            | QK              |
      | Flight             |            9999 |
      | Suffix             | A               |
      | FromStation        | AUT             |
      | TerminalFrom       |               1 |
      | ToStation          | ZZX             |
      | TerminalTo         |               1 |
      | DepartureTime      | 23:00           |
      | ArrivalTime        | 15:00           |
      | ServiceType        | Cargo/Mail      |
      | OnwardFlight       | ABC1234         |
      | OnwardDayOffset    |              99 |
      | AircraftType       |             DH1 |
      | CabinConfiguration | ASD             |
      | TailNumber         | 123_ASD 456     |
      | DeadheadSeats      |             999 |
      | FlightDate         |              29 |
      | FlightTags         | x               |
    And I enter operating flight crew complement as
      | Crew Name | CA | FO | PU | FA |
      | Count     |   7 |  8 |  9 |  5 |
    And I enter operating flight extra time as
      | Name            | Cabin crew | Pilot |
      | Brief Minutes   |         20 |    30 |
      | Debrief Minutes |         30 |    20 |
    And I add the Operating Flight
    Then a new Operating Flight is added to list

  @addOFMandatoryFields
  Scenario: I wan to add a new Operating Flight filling mandatory fields only
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
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
      | AircraftType       |              DH1|
      | CabinConfiguration |                 |
      | TailNumber         |                 |
      | DeadheadSeats      |                 |
      | FlightDate         |              29 |
      | FlightTags         |                 |
    And I add the Operating Flight
    Then a new Operating Flight is added to list

  Scenario: I want to add a new operatign flight using invalid Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" flight
    Then the message "Must be 1 to 4 digits" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Suffix
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" suffix
    Then the message "Must be one letter" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Onward Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" onward flight
    Then the message "Must be in format e.g., AZ9, CV318, ABF1467" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Onward Day Offset
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "Aut0" onward flight
    And I enter "$Aut" onward day offset
    Then the message "Must be 1 to 2 digits" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Cabin Configuration
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" cabin configuration
    Then the message "Must be a string of characters (max 20)" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Tail Number
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" tail number
    Then the message "Tail number cannot start with a space or special character" for operating flight form is displayed

  Scenario: I want to add a new operatign flight using invalid Seats For Deadheads
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1234"
    And I open the add new operating flight drawer
    When I enter "$Aut" seat for deadheads
    Then the message "Must be a number between 0-999" for operating flight form is displayed
