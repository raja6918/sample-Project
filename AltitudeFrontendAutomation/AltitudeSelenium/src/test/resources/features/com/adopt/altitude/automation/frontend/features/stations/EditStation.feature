@data_management @stations @editStation
Feature: Station - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-805" is added
    And The currencies with following values are added
      | Name          | currency_1 |
      | Code          | AUT        |
      | Exchange Rate |        1.0 |
    And The countries with following values are added
      | Name          | aut_country | aut_country_2 |
      | Code          | ZZ          | YY            |
      | Currency Code | AUT         | AUT           |
    And The region "aut_region" with code "AUT" is added
    And I'm logged in with default credentials.

  Scenario: I want to edit station name
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | XXX                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    When I update the name to "aut_station_updated" for "aut_station" station
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "UTC-9:30" as Time Zone
    When I select "0h30" as DST Change
    Then the message "Station aut_station_updated has been successfully updated." for station is displayed

  Scenario: I want to edit station code
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | XXY                   |
      | Station Name   | aut_station1          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    When I update the code to "SRA" for "aut_station1" station
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "UTC-9:30" as Time Zone
    When I select "0h30" as DST Change
    Then the message "Station aut_station1 has been successfully updated." for station is displayed

  Scenario: I want to edit station country
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | XYY                   |
      | Station Name   | aut_station2          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    When I update the country to "aut_country_2, YY" for "aut_station2" station
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "UTC-9:30" as Time Zone
    When I select "0h30" as DST Change
    Then the message "Station aut_station2 has been successfully updated." for station is displayed

  Scenario: I want to edit station Time Zone
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | XYX                   |
      | Station Name   | aut_station3          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    When I update the Time Zone to "UTC+6:00" for "aut_station3" station
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "0h30" as DST Change
    Then the message "Station aut_station3 has been successfully updated." for station is displayed

  Scenario: I want to edit station Terminal
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | XTU                   |
      | Station Name   | aut_station4          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    When I update the Time Zone to "UTC+6:00" for "aut_station4" station
    When i set Terminal as "T2"
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "0h30" as DST Change
    Then the message "Station aut_station4 has been successfully updated." for station is displayed

  Scenario: I want to edit station code with an existing code
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | TUA                   |
      | Station Name   | aut_station5          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | TUA                   |
      | Station Name   | aut_station5          |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then The Error message "The station code TUA already exists, please enter a different one." for crew base form is displayed

  Scenario: I want to Edit a station with DST End Date before start date
    Given I'm in the stations page for scenario "aut_scenario_alt-805"
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
      | DST Start Date | 2018-November-7T16:25 |
      | DST End Date   | 2019-November-8T13:25 |
    Then a new station is added to list
    When I update DST END Date to "2018-November-7T13:25" for "aut_station" station
    Then the save button is not Active
