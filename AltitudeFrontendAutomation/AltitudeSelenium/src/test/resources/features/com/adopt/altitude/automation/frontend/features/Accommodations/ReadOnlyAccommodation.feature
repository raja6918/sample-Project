@accommodations @scenariosFlag
Feature: Accommodations Read Only feature

  Background:
    Given The Scenario "aut_scenario_acc_RO" is added
    And The scenario "aut_scenario_acc_RO" is opened through backend
   # And The users with following values are added
    #  | First Name | Username               |
     # | Last Name  | Automation     |
      #| User Name  | admin_testtest        |
      #| Email      | aut@konos-testtt.com |
      #| Password   | Ibsadmin1234_test          |
      #| Role       | Administrator      |
      #|roleId      | 756cbd11-4695-4e02-95b3-15382d89a064                  |

    And I open login page

  @readonly
  Scenario: I want verify the legend shows View Only for scenario in Accommodations
    Given I'm logged with default SecondUser credentials.
    And I filter by "Anyone"
    And I open the view only scenario "aut_scenario_acc_RO"
    And I click 'Open' button on the View Only Information dialog
    When I open accommodations page
    Then The accommodations page legend shows 'view-only' beside the scenario name
