@data_management @accommodations @addAccommodation
Feature: Accommodation - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-205" is added
    And The currencies with following values are added
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
    And I'm logged in with default credentials.

  @addAccommodation_1
  Scenario: I want to add a new accommodation
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    When I enter the following accommodation data with Nights Calculated By Check-in/Check-out
      | Name                | aut_accommodation |
      | Station             | AUT - aut_station |
      | Type                | City              |
      | Capacity            | 30                |
      | Contract Start Date | November-1-2021   |
      | Contract End Date   | November-30-2021  |
      | Cost                | 125.00            |
      | Currency            | AUT               |
      | Check In Time       | 15:00             |
      | Check Out Time      | 11:00             |
      | Cost Extended Stay  | 95                |
      | Transit Time        | 30                |
      | Transit Cost        | 30.00             |
      | Transit Currency    | AUT               |
      | Cost Basis          | Fixed cost        |
   # And I add the following extra times to accommodation
   #   | Extra Time       | 30    |
   #   | Extra Time Start | 18:00 |
   #   | Extra Time End   | 21:00 |
    And I add the accommodation
    Then a new accommodation is added to list

  Scenario: I want to add a new accommodation using invalid Name
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    When I enter "$%#%" name
    Then the message "Accommodation name cannot start with a space or special character" for accommodation form is displayed

  Scenario: I want to add a new accommodation using invalid capacity number
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    When I enter "qbc" capacity
    Then the message "Negotiated rooms must be a number between 0-1000" for accommodation form is displayed

  Scenario: I want to add a new accommodation using invalid price number
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    When I enter "#abc" cost
    Then the message "Nightly rate must be greater than 0" for accommodation form is displayed

  Scenario: I want to add a new accommodation using invalid Cost for Extended Stay number
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    When I enter "#abc" cost for extended stay
    Then the message "% cost must be a number between 0-100" for accommodation form is displayed

  Scenario: I want to add a new accommodation using invalid transit time
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    And I select station "AUT - aut_station"
    When I enter "#abc" transit time
    Then the message "Transit time must be a positive number" for accommodation form is displayed

  Scenario: I want to add a new accommodation using invalid transit cost
    Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
    And I open the add new accommodation drawer
    And I select station "AUT - aut_station"
    When I enter "abc" transit cost
    Then the message "Transit cost must be a positive number" for accommodation form is displayed

 # Scenario: I want to add a new accommodation using invalid extra time
   #  Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
   # And I open the add new accommodation drawer
   # And I select station "(AUT) aut_station"
   # When I enter "abc#" extra time for accommodations
   # Then the message "Extra time must be a positive number" for accommodation form is displayed

  #Scenario: I want to add more than 5 extra times
   # Given I'm in the accommodations page for scenario "aut_scenario_alt-205"
   # And I open the add new accommodation drawer
   # And I select station "(AUT) aut_station"
   # When I click Add Extra time 5 times for accommodations
   # Then the Add Extra time button in accommodations is disabled



