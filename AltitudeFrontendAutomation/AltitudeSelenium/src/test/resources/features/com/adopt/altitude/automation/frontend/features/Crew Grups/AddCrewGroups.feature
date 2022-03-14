@data_management @crewGroups
Feature: Crew Groups - Create.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1505" is added
    And I'm logged in with default credentials.

  @addCrewGrup
  Scenario: I want to add a new crew groups
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1505"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list


  Scenario: I want to add a new crew groups with same name
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1505"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then The Error message for same crewgroupname "The crewGroup name AUT_CrewGrup already exists, please enter a different one." for crew group form is displayed

  Scenario: I want to Verify save button is Inactive if some mandatory fields are empty
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1505"
    And I open the add new crew groups drawer
    When I enter "AUT_CrewGrup" as crew group name
    #Then the save button is not Active
    Then the Add button is not Active

  Scenario: I want to add a new crewgroup using invalid Name
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1505"
    And I open the add new crew groups drawer
    When I enter "@@!" as crew group name
    Then the message "Crew group name cannot start with a space or special character" for crewgroup form is displayed
