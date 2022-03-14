@data_management @crewBases
Feature: Crew Base - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-671" is added
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
    And I'm logged in with default credentials.

  @addCrewBase
  Scenario: I want to add a new crew base
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT               |
      | Base Name | aut_crewbase      |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    Then a new crew base is added to list

  Scenario: I want to add a new crew base without Base Name
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT               |
      | Base Name |                   |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    Then the Add Crew Base button is not Active

  Scenario: I want to add a new crew base without Base Code
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code |                   |
      | Base Name | aut_crewbase      |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    Then the Add Crew Base button is not Active

  Scenario: I want to add a new crew base without Station
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I enter "aut_crewbase" base name
    Then the Add Crew Base button is not Active

  Scenario: I want to add a new crew base using invalid Base Name
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I enter "$%#%" base name
    Then The Error message "Crew Base name cannot start with a space or special character" for crew base form is displayed

  Scenario: I want to add a new crew base using invalid Base Code
    Given I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I enter "123" base code
    Then The Error message "Base Code must be 3 letters" for crew base form is displayed

  Scenario: I want to add a new crew base with an existing code
    Given The crew base with default values is added
    And I'm in the crew bases page for scenario "aut_scenario_alt-671"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT               |
      | Base Name | aut_crewbase      |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    Then The Error message "The base code AUT already exists, please enter a different one." for crew base form is displayed
