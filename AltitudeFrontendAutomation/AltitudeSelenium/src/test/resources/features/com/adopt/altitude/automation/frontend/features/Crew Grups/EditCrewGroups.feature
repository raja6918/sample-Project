@data_management @editCrewGroups @crewGroups
Feature: Crew Groups - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1506" is added
    And I'm logged in with default credentials.

  @editCrewGrup
  Scenario: I want to edit crew group name
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1506"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrewGrup1      |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    #When  I click on 'Filter' button for crewGroup
    #When I enter "AUT_CrewGrup1" as crewgroup name in Filter
    When I update the name to "Updated_AUT_CrewGrup" for "AUT_CrewGrup1" crewgroup
    And I save the crew group
    Then the message "Crew group Updated_AUT_CrewGrup has been successfully updated." for crewgroup is displayed

  Scenario: I want to edit a new crewgroup using invalid Name
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1506"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrwGrupX       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    #When  I click on 'Filter' button for crewGroup
    #When I enter "AUT_CrwGrupX" as crewgroup name in Filter
    When I update the name to "@@!" for "AUT_CrwGrupX" crewgroup
    Then the message "Crew group name cannot start with a space or special character" for crewgroup form is displayed

 # Scenario: I want to edit a new crewgroup using selectAll for Airlines
 #   Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1506"
 #   And I open the add new crew groups drawer
 #   When I enter the following crew groups data
  #    | Name             | AUT_CrwGrupA       |
  #    | Position         | CA                 |
  #    | Airlines         | QK                 |
  #    | Aircraft Type    |                DH1 |
  #    | Default Rule Set | baseline           |
  #  And I add the new crew group
  #  Then a new Crew Group is added to list
  #  #When  I click on 'Filter' button for crewGroup
    #When I enter "AUT_CrwGrupA" as crewgroup name in Filter
  #  When I update the Airlines to SelectAll for "AUT_CrwGrupA" crewgroup
  #  And I save the crew group
   # Then the message "Crew group AUT_CrwGrupA has been successfully updated." for crewgroup is displayed

  Scenario: I want to edit a new crewgroup using selectAll for Aircraft Type(s)
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1506"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrwGrpAT       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    #When  I click on 'Filter' button for crewGroup
    #When I enter "AUT_CrwGrpAT" as crewgroup name in Filter
    When I update the Aircraft Type(s) to SelectAll for "AUT_CrwGrpAT" crewgroup
    And I save the crew group
    Then the message "Crew group AUT_CrwGrpAT has been successfully updated." for crewgroup is displayed

  Scenario: I want to edit a new crewgroup using selectAll for Position(s)
    Given I'm in the Crew Groups page for scenario "aut_scenario_alt-1506"
    And I open the add new crew groups drawer
    When I enter the following crew groups data
      | Name             | AUT_CrwGrupP       |
      | Position         | CA                 |
      | Airlines         | QK                 |
      | Aircraft Type    |                DH1 |
      | Default Rule Set | baseline           |
    And I add the new crew group
    Then a new Crew Group is added to list
    #When  I click on 'Filter' button for crewGroup
    #When I enter "AUT_CrwGrupP" as crewgroup name in Filter
    When I update the Position(s) to SelectAll for "AUT_CrwGrupP" crewgroup
    And I save the crew group
    Then the message "Crew group AUT_CrwGrupP has been successfully updated." for crewgroup is displayed
