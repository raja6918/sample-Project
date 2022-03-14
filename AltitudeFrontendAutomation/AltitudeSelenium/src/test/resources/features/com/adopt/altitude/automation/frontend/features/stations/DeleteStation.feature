@data_management @stations @deleteStation
Feature: Station, Region, Country, Currency - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1592" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AAA          |
      | Exchange Rate |        1.0   |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | AA          |
      | Currency Code | AAA         |
    And The region "aut_region" with code "AUT" is added
    And I'm logged in with default credentials.

  Scenario: I want to delete station, region, country, currency with no dependent data
    Given I'm in the stations page for scenario "aut_scenario_alt-1592"
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
    When I delete station with Iata code "AUT"
    Then the message "Station AUT has been successfully deleted." for station is displayed
    And I want to back home
    When I open regions page
    When I delete the region with region code "AUT"
    Then the message "Region aut_region has been successfully deleted." for region is displayed
    And I want to back home
    When I open countries page
    When I delete country with country name "aut_country"
    Then the message "Country aut_country has been successfully deleted." for country is displayed
    And I want to back home
    When I open currencies page
    When I delete currency with currency code "AAA"
    Then the message "Currency aut_currency has been successfully deleted." for currency is displayed

  Scenario: I remove dependency to delete currency, country, region, station
    Given I'm in the stations page for scenario "aut_scenario_alt-1592"
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
    And I want to back home
    When I open currencies page
    When I delete currency with currency code "AAA"
    Then I get Data Reference Error
    And I want to back home
    When I open countries page
    When I delete country with country name "aut_country"
    Then I get Data Reference Error
    And I want to back home
    When I open regions page
    When I delete the region with region code "AUT"
    Then I get Data Reference Error
    And I want to back home
    When I open stations page
    When I delete station with Iata code "AUT"
    Then the message "Station AUT has been successfully deleted." for station is displayed
    And I want to back home
    When I open regions page
    When I delete the region with region code "AUT"
    Then the message "Region aut_region has been successfully deleted." for region is displayed
    And I want to back home
    When I open countries page
    When I delete country with country name "aut_country"
    Then the message "Country aut_country has been successfully deleted." for country is displayed
    And I want to back home
    When I open currencies page
    When I delete currency with currency code "AAA"
    Then the message "Currency aut_currency has been successfully deleted." for currency is displayed

  Scenario: I want to check cancel Button for station, region, country, currency
    Given I'm in the stations page for scenario "aut_scenario_alt-1592"
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
    When I cancel delete station with Iata code "AUT"
    Then I should not get any Success Message
    And I want to back home
    When I open regions page
    When I cancel delete region with region code "AUT"
    Then I should not get any Success Message
    And I want to back home
    When I open countries page
    When I cancel delete country with country name "aut_country"
    Then I should not get any Success Message
    And I want to back home
    When I open currencies page
    When I cancel delete currency with currency code "AAA"
    Then I should not get any Success Message
