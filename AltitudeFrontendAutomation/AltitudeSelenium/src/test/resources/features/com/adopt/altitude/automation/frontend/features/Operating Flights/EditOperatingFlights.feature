@data_management @operating_flights @edit_Operating_flights
Feature: Operating Flight - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1244-1465" is added
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

  Scenario: I want to update Flight
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the flight to "9999" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list edit

  Scenario: I want to update Suffix
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the suffix to "Q" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list

  Scenario: I want to update Service Type
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the service type to "passenger" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list

  Scenario: I want to update Departure Time
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the departure time to "10:00" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list

  Scenario: I want to update Departure station
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the departure station to "AUX" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list

  Scenario: I want to update Arrival station
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the arrival station to "AUX" for operating flight "1000"
    Then the updated operating flight is displayed in the operating flights list

  Scenario: I want to update flight with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the flight to "$AUT" for operating flight "1000"
    Then the message "Must be 1 to 4 digits" for operating flight form is displayed

  Scenario: I want to update Flight with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the flight to " AUT" for operating flight "1000"
    Then the message "Must be 1 to 4 digits" for operating flight form is displayed

  Scenario: I want to update Suffix with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the suffix to "$" for operating flight "1000"
    Then the message "Must be one letter" for operating flight form is displayed

  Scenario: I want to update Onward Flight with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the onward flight to "$AUT" for operating flight "1000"
    Then the message "Must be in format e.g., AZ9, CV318, ABF1467" for operating flight form is displayed

  Scenario: I want to update Onward Day Offset with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the onward day offset to "$" for operating flight "1000"
    Then the message "Must be 1 to 2 digits" for operating flight form is displayed

  Scenario: I want to update Cabin Configuration with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the cabin configuration to "$AUT" for operating flight "1000"
    Then the message "Must be a string of characters (max 20)" for operating flight form is displayed

  Scenario: I want to update Tail Number with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the tail number to "$AUT" for operating flight "1000"
    Then the message "Tail number cannot start with a space or special character" for operating flight form is displayed

  Scenario: I want to update Seats For Deadheads with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I update the seats for deadheads to "$AUT" for operating flight "1000"
    Then the message "Must be a number between 0-999" for operating flight form is displayed

  Scenario: I want to update Extra Brief Cabin with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I'm in the operating flight "1000"
    And I enter operating flight extra time as
      | Name            | Cabin crew |
      | Brief Minutes   | $A         |
      | Debrief Minutes |         30 |
    Then the message "Must be positive number" for operating flight form is displayed

  Scenario: I want to update Extra Brief Cabin with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I'm in the operating flight "1000"
    And I enter operating flight extra time as
      | Name            | Cabin crew |
      | Brief Minutes   |          1 |
      | Debrief Minutes | $A         |
    Then the message "Must be positive number" for operating flight form is displayed

  Scenario: I want to update Extra Brief Cabin with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I'm in the operating flight "1000"
    And I enter operating flight extra time as
      | Name            | Pilot |
      | Brief Minutes   | $A    |
      | Debrief Minutes |    30 |
    Then the message "Must be positive number" for operating flight form is displayed

  Scenario: I want to update Extra Brief Cabin with an invalid field
    Given I'm in the Operating Flight page for scenario "aut_scenario_alt-1244-1465"
    When I'm in the operating flight "1000"
    And I enter operating flight extra time as
      | Name            | Pilot |
      | Brief Minutes   |    10 |
      | Debrief Minutes | $A    |
    Then the message "Must be positive number" for operating flight form is displayed
