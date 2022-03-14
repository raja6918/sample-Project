@dataHome
Feature: Data Home - Validate data home tiles

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1272" is added
    And I'm logged in with default credentials.

  Scenario: I want to validate accommodations count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of accommodations
    And I open accommodations page
    When I count the total accommodations in table
    Then The data tiles and table counts are equal For Accommodation

  Scenario: I want to validate aircraft types count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of aircraft types
    And I open aircraft types page
    When I count the total aircraft types in table
    Then The data tiles and table counts are equal

  Scenario: I want to validate coterminal transports count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of coterminal transports
    And I open coterminals page
    When I count the total coterminals in table
    Then The data tiles and table counts are equal

  Scenario: I want to validate countries count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of countries
    And I open countries page
    When I count the total countries in table
    Then The data tiles and table counts are equal For countries

  Scenario: I want to validate crew bases count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of crew bases
    And I open crew bases page
    When I count the total crew bases in table
    Then The data tiles and table counts are equal

  Scenario: I want to validate currencies count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of currencies
    And I open currencies page
    When I count the total currencies in table
    Then The data tiles and table counts are equal For currencies

  Scenario: I want to validate positions count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of positions
    And I open positions page
    When I count the total positions in table
    Then The data tiles and table counts are equal For Position

  Scenario: I want to validate regions count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of regions
    And I open regions page
    When I count the total regions in table
    Then The data tiles and table counts are equal For Region

  Scenario: I want to validate stations count
    Given I open the scenario "aut_scenario_alt-1272"
    And I see the total count of stations
    And I open stations page
    When I count the total stations in table
    Then The data tiles and table counts are equal for stations

  Scenario: I want to validate accommodations count after I add a new accommodation
    Given The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And I'm in the accommodations page for scenario "aut_scenario_alt-1272"
    And I enter the following accommodation data with Nights Calculated By Check-in/Check-out
      | Name                | aut_accommodation |
      | Station             | AUT - aut_station |
      | Type                | City              |
      | Capacity            | 30                |
      | Contract Start Date | November-1-2019   |
      | Contract End Date   | November-30-2020  |
      | Cost                | 125.00            |
      | Currency            | AUT               |
      | Check In Time       | 15:00             |
      | Check Out Time      | 11:00             |
      | Cost Extended Stay  | 95                |
      | Transit Time        | 30                |
      | Transit Cost        | 30.00             |
      | Transit Currency    | AUT               |
      | Cost Basis          | Fixed cost        |
    #And I add the following extra times to accommodation
    #  | Extra Time       | 30    |
    #  | Extra Time Start | 18:00 |
    #  | Extra Time End   | 21:00 |
    And I add the accommodation
    And I count the total accommodations in table
    And I go back to data home page
    When I see the total count of accommodations
    Then The data tiles and table counts are equal For Accommodation

  Scenario: I want to validate aircraft types count after I add a new aircraft type
    Given The aircraft models with following values are added
      | Name | aut_aircraft_model |
      | Code | 123                |
    And Aircraft types page for scenario "aut_scenario_alt-1272" is displayed
    And I enter the following data for an aircraft type
      | IATA Type     | TTT                |
      | Model         | aut_aircraft_model |
      | Name          | aut_aircraft_name  |
      | Rest Facility | C3 - Basic Seat    |
    And I enter crew complement as
      | Name  | CA | FO | FA |
      | Count | 1   | 1  | 1  |
    And I count the total aircraft types in table
    And I go back to data home page
    When I see the total count of aircraft types
    Then The data tiles and table counts are equal

  Scenario: I want to validate coterminals count after I add a new coterminal
    Given The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT              | TUA            |
      | Name         | aut_station_from | aut_station_to |
      | Country Code | ZZ               | ZZ             |
    And I'm in the coterminals page for scenario "aut_scenario_alt-1272"
    And I enter the following data for a coterminal
      | Departure Station      | AUT - aut_station_from     |
      | Arrival Station        | TUA - aut_station_to       |
      | Transport Name         | AUT-FE Transport           |
      | Transport Type         | Taxi                       |
      | Maximum Passengers     | 2                          |
      | Timing Start           | 15:00                      |
      | Timing End             | 15:00                      |
      | Transport Time         | 30                         |
      | Connection Time Before | 60                         |
      | Connection Time After  | 60                         |
      | Cost                   | 125                        |
      | Currency               | AUT                        |
      | Cost Basis             | Per crew member            |
      | Credit Cost            | 60                         |
      | Credit Applies to      | Flight deck crew only      |
   # And I add the following extra times
   #   | Extra Time       | 30    |
   #   | Extra Time Start | 18:00 |
   #   | Extra Time End   | 21:00 |
    And I add the coterminal transport
    And I count the total coterminals in table
    And I go back to data home page
    When I see the total count of coterminal transports
    Then The data tiles and table counts are equal

  Scenario: I want to validate countries count after I add a new country
    Given The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And I'm in the countries page for scenario "aut_scenario_alt-1272"
    And I click on the 'Add' new country button
    And I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    And I count the total countries in table
    And I go back to data home page
    When I see the total count of countries
    Then The data tiles and table counts are equal For countries

  Scenario: I want to validate crew bases count after I add a new crew base
    Given The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And I'm in the crew bases page for scenario "aut_scenario_alt-1272"
    And I click on the 'Add' new crew base button
    And I provide the following data in the crew base form
      | Base Code | AUT               |
      | Base Name | aut_crewbase      |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    And I count the total crew bases in table
    And I go back to data home page
    When I see the total count of crew bases
    Then The data tiles and table counts are equal

  Scenario: I want to validate currencies count after I add a new currency
    Given Currencies page for scenario "aut_scenario_alt-1272" is displayed
    And I add the currency "aut_currency" with code "AUT" and exchange rate "1"
    And I count the total currencies in table
    And I go back to data home page
    When I see the total count of currencies
    Then The data tiles and table counts are equal For currencies

  Scenario: I want to validate positions count after I add a new position
    Given Positions page for scenario "aut_scenario_alt-1272" is displayed
    And I add the Position "aut_position" with code "AUT" type as "Cabin crew"
    And I count the total positions in table
    And I go back to data home page
    When I see the total count of positions
    Then The data tiles and table counts are equal For Position

  Scenario: I want to validate regions count after I add a new region
    Given Regions page for scenario "aut_scenario_alt-1272" is displayed
    And I add the region "aut_region" with code "AUT"
    And I count the total regions in table
    And I go back to data home page
    When I see the total count of regions
    Then The data tiles and table counts are equal For Region

  Scenario: I want to validate stations count after I add a new station
    Given The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate | 1.0          |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And I'm in the stations page for scenario "aut_scenario_alt-1272"
    And I click on the 'Add' new station button
    And I provide the following data in the form
      | Iata Code      | AUT                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region            |
      | Latitude       | 12.12                 |
      | Longitude      | 23.12                 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    And I count the total stations in table
    And I go back to data home page
    When I see the total count of stations
    Then The data tiles and table counts are equal for stations

  Scenario: I want to validate data source in Accommodations
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "accommodations"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Aircraft types
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "aircraft"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Coterminal Transports
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "coterminal-transports"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Countries
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "countries"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Crew Groups
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "crew-groups"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Crew Bases
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "crew-bases"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Currencies
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "currencies"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Positions
    Given I open the scenario "aut_scenario_alt-1272"
    Then I scroll to Data Card "Positions"
    When I see the data source of "positions"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Regions
    Given I open the scenario "aut_scenario_alt-1272"
    Then I scroll to Data Card "Regions"
    When I see the data source of "regions"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Rules
    Given I open the scenario "aut_scenario_alt-1272"
    Then I scroll to Data Card "Rules"
    When I see the data source of "rules"
    Then The data source should show "From template"

  Scenario: I want to validate data source in Operating Flights
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "operating-flights"
    Then The data source should show ""

  Scenario: I want to validate data source in Commercial Flights
    Given I open the scenario "aut_scenario_alt-1272"
    When I see the data source of "commercial-flights"
    Then The data source should show ""
