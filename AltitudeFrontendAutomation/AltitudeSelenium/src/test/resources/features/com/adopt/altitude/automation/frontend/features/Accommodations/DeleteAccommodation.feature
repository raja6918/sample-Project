@data_management @accommodations @deleteAccommodation
Feature: Accommodation - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1599" is added
    And The currencies with following values are added
      | Name          | currency_1 | currency_2 |
      | Code          | AUT        | TUA        |
      | Exchange Rate | 1.0        | 1.0        |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And the accommodation with default values is added
    And I'm logged in with default credentials.

  @negativeScenario
  Scenario: I want to delete an accommodation with some dependencies
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-1599"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    And I open accommodations page
   # Given I'm in the accommodations page for scenario "aut_scenario_alt-1599"
    When I click on Name sort
    When I delete the accommodation "The Westin Toronto Airport"
    Then verify the reference error for accommodation "This accommodation cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed

  @positiveScenario
  Scenario: I want to delete an accommodation with no dependency
    Given I'm in the accommodations page for scenario "aut_scenario_alt-1599"
    When I delete the accommodation "aut_accommodation"
    Then the message "Accommodation aut_accommodation has been successfully deleted." for accommodation is displayed as expected

  Scenario: I want to cancel delete accommodation
    Given I'm in the accommodations page for scenario "aut_scenario_alt-1599"
    And I cancel delete accommodation "aut_accommodation"
    Then verify successfully that no deletion happens for accommodation







