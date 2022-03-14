@filters
Feature: Scenario - Filter.

  Background:
    Given I open login page

  Scenario: I want to verify filter menu.
    Given I'm logged in with default credentials.
    And I'm in the scenarios page
    When I click on the 'Created By' filter
    Then The following items should be listed:
      | Me     |
      | Anyone |
      | Not me |

  Scenario: I want to filter by me only
    Given I login with username "admin" password "Ibsadmin123" through backend
    #And The users with following values are added
    #  | First Name | User             | User             |
    #  | Last Name  | Automation_01    | Automation_02    |
    #  | User Name  | test_user1       | test_user2       |
    #  | Email      | test1@kronos.com | test2@kronos.com |
    #  | Password   | Password1        | Password1        |
    #  | Role       | Administrator    | Administrator    |
    #  |Role Id     | 756cbd11-4695-4e02-95b3-15382d89a064 |756cbd11-4695-4e02-95b3-15382d89a064|
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_1" is added for user "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_2" is added for user "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    When I filter by "Me"
    Then the listed scenarios belongs to:
      | Automation Testing |

  Scenario: I want to filter scenarios by anyone
    Given I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_1" is added for user "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_2" is added for user "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    When I filter by "Anyone"
    Then the listed scenarios belongs to:
      | Automation Testing |
      | Testing Automation |

  Scenario: I want to filter scenarios from others
    Given I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_1" is added
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123" through backend
    And The Scenario "aut_scenario_2" is added
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    When I filter by "Not me"
    Then the listed scenarios are not belonging to:
      | Automation Testing |
