@data_management @crewBases @deleteCrewBase
Feature: Crew Base - Delete.

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
    And The crew base with default values is added
    And I'm logged in with default credentials.

  @PositiveScenario
  Scenario: I want to delete a crewBase with no dependency
    Given I'm in the crew bases page for scenario "aut_scenario_alt-1599"
    When I delete the crewBase "aut_crewbase"
    Then the message "Crew base aut_crewbase has been successfully deleted." for crewBase is displayed as expected

  Scenario: I want to cancel delete crewBase
    Given I'm in the crew bases page for scenario "aut_scenario_alt-1599"
    And I cancel delete crewBase "aut_crewbase"
    Then verify successfully that no deletion happens for crewBase

  @negativeScenario
  Scenario: I want to delete an crewBase having dependency
    Given I'm in the Pairing Page for scenario "aut_scenario_alt-1599"
    When I do first time crewgroup "Combo Pilots" selection
    #Then I verify crewBase "YHZ" is displayed in the solverResult
    Then I go to crewBase page
    When I delete the crewBase "Halifax"
    Then verify the reference error for crewBase "This crew base cannot be deleted because it is referenced by other data in your scenario. To remove this item, first delete all dependant data and then try again." is displayed
