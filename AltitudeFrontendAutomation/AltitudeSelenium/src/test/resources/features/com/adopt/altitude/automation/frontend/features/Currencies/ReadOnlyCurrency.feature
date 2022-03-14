@currencies @scenariosFlag
Feature: Currencies Read Only feature

  Background:
    Given The Scenario "aut_scenario_currency_RO" is added
    And The scenario "aut_scenario_currency_RO" is opened through backend
  # And The users with following values are added
    #  | First Name |AAAAvjjAhhAAAhBjdjCY         |
     # | Last Name  | BBhBBjkkBBBkk         |
     #| User Name  | TESTAUTO5       |
     #| Email      | aut@TESThAjjUT1jjos-ty.com |
      #| Password   | Password1test         |
      #| Role       | Administrator      |
      #|roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    And I open login page
  @readonly
  Scenario: I want verify the legend shows View Only for scenario in Currencies
    Given I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_currency_RO"
    And I click 'Open' button on the View Only Information dialog
    When I open currencies page
    Then The currencies page legend shows 'view-only' beside the scenario name








