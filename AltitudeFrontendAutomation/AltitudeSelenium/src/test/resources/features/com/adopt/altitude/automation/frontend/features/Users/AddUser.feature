@data_management @users @AddUser
Feature: User - Add.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2402" is added
    And I'm logged in with default credentials.

 # Scenario: Verify that user add successfully
 #   Given I'm in the User Page for scenario "aut_scenario_alt-2402"
 #   When I click on the Plus Button in User page
 #   And I provide the following data in the form user
 #     | First Name    | AUT_User128            |
 #     | Last Name     | Test                   |
 #     | User Name     | AUT_User_Test9         |
 #     | Email         | Aut619@ibsplc.com      |
 #     | password      | Qwerty@123             |
 #     | Re Password   | Qwerty@123             |
 #     | Role          | Administrator          |
 #   And I click on 'Add' Button in user page
 #   Then verify successfully that user added with message "User AUT_User128 Test has been successfully added."

  Scenario: Verify that First Name is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    |                       |
      | Last Name     | BuildPairings         |
      | User Name     | AUT_User1             |
      | Email         | Aut517@ibsplc.com     |
      | password      | Qwerty@123            |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator         |
    Then verify that the 'Add' button is disabled in user page

  Scenario: Verify that Last Name is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    |  AUT_User1            |
      | Last Name     |                       |
      | User Name     | AUT_User1             |
      | Email         | Aut517@ibsplc.com     |
      | password      | Qwerty@123            |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator         |
    Then verify that the 'Add' button is disabled in user page

  Scenario: Verify that User Name is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    | AUT_User1             |
      | Last Name     | BuildPairings         |
      | User Name     |                       |
      | Email         | Aut517@ibsplc.com     |
      | password      | Qwerty@123            |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator         |
    Then verify that the 'Add' button is disabled in user page

  Scenario: Verify that Email is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    | AUT_User1             |
      | Last Name     | BuildPairings         |
      | User Name     | AUT_User1             |
      | Email         |                       |
      | password      | Qwerty@123            |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator         |
    Then verify that the 'Add' button is disabled in user page

  Scenario: Verify that Password is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    | AUT_User1             |
      | Last Name     | BuildPairings         |
      | User Name     | AUT_User1             |
      | Email         | Aut517@ibsplc.com     |
      | password      |                       |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator               |
    Then verify that the 'Add' button is disabled in user page

  Scenario: Verify that Re_password is mandatory
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    | AUT_User1             |
      | Last Name     | BuildPairings         |
      | User Name     | AUT_User1             |
      | Email         | Aut517@ibsplc.com     |
      | password      | Qwerty@123            |
      | Re Password   |                       |
      | Role          | Administrator         |
    Then verify that the 'Add' button is disabled in user page
    And I enter password " d"
    And I enter re_password " d"

  Scenario: Verify that FirstName,lastName,UserName,Email Validations
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I enter firstName "  d"
    Then I verify with validation error message "First name cannot start with a space or special character"
    And I enter lastName "@d"
    Then I verify with validation error message "Last name cannot start with a space or special character"
    And I enter userName "  d"
    Then I verify with validation error message "Username should be in format similar to: jose, jose12, joe.stone, joe_stone, joe-stone"
    And I enter email "@d"
    Then I verify with validation error message "E-mail cannot start with a space or special character"

  Scenario: Verify that FirstName,lastName,UserName,Email maximum character validation
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I enter firstName having characters greater than 50
    Then validate max "firstName" character count allowed as 50
    And I enter lastName having characters greater than 50
    Then validate max "lastName" character count allowed as 50
    And I enter userName having characters greater than 25
    Then validate max "userName" character count allowed as 25
    And I enter email having characters greater than 100
    Then validate max "email" character count allowed as 100
    And I enter password having characters greater than 50
    Then validate max "password" character count allowed as 50
    And I enter re_password having characters greater than 50
    Then validate max "passwordRe" character count allowed as 50

  Scenario: Verify the First Name and Last Name are displayed together in the header, beneath the "Add User" label, as it is typed in the field
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I enter firstName "AUT"
    And I enter lastName "User"
    Then I verify the First Name and Last Name are displayed together in the header as "AUT User"

  Scenario: Verify Cancel button working as expected
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I provide the following data in the form user
      | First Name    | AUT_User              |
      | Last Name     | BuildPairings         |
      | User Name     | AUT_User2108          |
      | Email         | Aut2013@gibsplc.com   |
      | password      | Qwerty@123            |
      | Re Password   | Qwerty@123            |
      | Role          | Administrator         |
    And I click on Cancel Button in user page and verify cancel button working as expected
    And I verify on clicking cancel button closes the pane

  Scenario: Verify the Roll dropdown
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    Then I verify all values in the dropdown of role

  Scenario: Verify the password and re-password matching
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I enter password "Qwert@123"
    And I enter re_password "Abcdef@123"
    Then I verify the validation error message if passwords didnt match as "Passwords don't match"

  Scenario: Verify the password validation criteria text
    Given I'm in the User Page for scenario "aut_scenario_alt-2402"
    When I click on the Plus Button in User page
    And I verify the password validation criteria text
