@users @editUser @invalidInputs @wip
Feature: User Administration - Validate error message on edit user.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario Outline: I want to validate First Name error message
   # Given The users with following values are added
   #   | First Name | User12               |
   #   | Last Name  | Automation12         |
   #   | User Name  | aut_userIBS14        |
   #   | Email      | aut@konos-test7.com |
   #   | Password   | Password1          |
   #   | Role       | Administrator      |
   #   |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    And I enter to User administration portal
    When I modify the information <firstName> <lastName> <email> <role> for the user "AutUserTwo_DoNotDelete"
    And I save the changes
    Then The message "First name cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName   | email                          | role          |
      | ""        | Automation | editAutomation@kronos-test.com | Administrator |

  Scenario Outline: I want to validate Last Name error message
   # Given The users with following values are added
   #   | First Name | User               |
   #   | Last Name  | Automation         |
   #   | User Name  | aut_userIBS15        |
   #   | Email      | aut@konos-test8.com |
   #   | Password   | Password1          |
   #   | Role       | Administrator      |
   #   |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    And I enter to User administration portal
    When I modify the information <firstName> <lastName> <email> <role> for the user "AutUserTwo_DoNotDelete"
    And I save the changes
    Then The message "Last name cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName | email                          | role          |
      | User      | ""       | editAutomation@kronos-test.com | Administrator |

  Scenario Outline: I want to validate email error message
    #Given The users with following values are added
    #  | First Name | User               |
    #  | Last Name  | Automation         |
    #  | User Name  | aut_userIBS16        |
    #  | Email      | aut@konos-test9.com |
    #  | Password   | Password1          |
    #  | Role       | Administrator      |
    #  |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    And I enter to User administration portal
    When I modify the information <firstName> <lastName> <email> <role> for the user "AutUserTwo_DoNotDelete"
    And I save the changes
    Then The message "E-mail cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName   | email | role          |
      | User      | Automation | ""    | Administrator |
