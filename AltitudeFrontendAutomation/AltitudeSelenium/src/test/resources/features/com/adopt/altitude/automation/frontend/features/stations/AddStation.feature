@data_management @stations
Feature: Station - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-521" is added
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
      | Code         | TUA           |
      | Name         | aut_station_2 |
      | Country Code | ZZ            |
    And I'm logged in with default credentials.

  @addStation
  Scenario: I want to add a new station
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | AUT                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then a new station is added to list

  Scenario: I want to add a new station without IATA Code
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      |                       |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then the Add button is not Active

  Scenario: I want to add a new station without Country
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        |                       |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then the Add button is not Active

  Scenario: I want to add a new station without Time Zone
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      |                       |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then the Add button is not Active

  Scenario: I want to add a new station without DST Change
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     |                       |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then the Add button is not Active

  Scenario: I want to add a new station without DST Start Date
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date |                       |
      | DST End Date   | 2019-November-29T16:25|
    Then the Add button is not Active

  Scenario: I want to add a new station without DST End Date
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   |                       |
    Then the Add button is not Active

  Scenario: I want to add a new station with invalid IATA Code
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      |                   123 |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then I scroll to station field "IATACode"
    Then The Error message "IATA code must be 3 letters" for station form is displayed

  Scenario: I want to add a new station with invalid Latitude
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       | 234a                  |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then The Error message "Latitude must be a number between -90.000000 and 90.000000" for station form is displayed

  Scenario: I want to add a new station with invalid Longitude
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | ABC                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      | 231a                  |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then The Error message "Longitude must be a number between -180.000000 and 180.000000" for station form is displayed

  Scenario: I want to add a new sation with an existing code
    Given I'm in the stations page for scenario "aut_scenario_alt-521"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | TUA                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then The Error message "The station code TUA already exists, please enter a different one." for crew base form is displayed
