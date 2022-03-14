@data_management @users @EditUser
Feature: User - Edit.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2403" is added
    And I'm logged in with default credentials.

  Scenario: Verify that I update first name successfully
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | AUT                    |
    #  | Last Name     | Test                   |
    #  | User Name     | AUTUSER                 |
    #  | Email         | automation@ibsplc.com   |
    #  | password      | Ibs             |
    #  | Re Password   | Qwerty@123             |
    #  | Role          | Administrator                |
   # And I click on 'Add' Button in user page
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I update firstName with "AutTest"
    #Then verify successfully that user added with message "User AUT_User2 Test has been successfully updated."
    Then I verify that firstName updated successfully in the user table with new firstName "AutTest"

  Scenario: Verify that I update last name successfully
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | AUT_User               |
    #  | Last Name     | Test                   |
   #   | User Name     | AUT_User_Test3         |
    #  | Email         | Aut228@ibsplc.com      |
    #  | password      | Qwerty@123             |
    #  | Re Password   | Qwerty@123             |
    #  | Role          | Planner                |
    #And I click on 'Add' Button in user page
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I update lastName with "User"
    #Then verify successfully that user added with message "User AUT_User newLastName has been successfully updated."
    Then I verify that lastName updated successfully in the user table with new lastName "User"

  Scenario: Verify that  update of userName should not possible
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | AUT_User3              |
   #   | Last Name     | Test                   |
   #   | User Name     | AUT_User_Test11         |
   #   | Email         | Aut349@ibsplc.com      |
   #   | password      | Qwerty@123             |
   #   | Re Password   | Qwerty@123             |
   #   | Role          | Planner                |
   # And I click on 'Add' Button in user page
    When I click on edit button for username "AutUserThree_DoNotDelete"
    Then UserName filed is present in disable state


  Scenario: Verify that I update Role successfully
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I update Role with "AuthRoleDoNotDelete".
    Then I verify that role updated successfully with new role "AuthRoleDoNotDelete"

  Scenario: Verify that I update email successfully
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I update email with "automationTestingthree@ibsplc.com"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    Then I verify that email updated successfully with new email "automationTestingthree@ibsplc.com"

  Scenario: Verify that I update password successfully
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I click checkbox change password
    Then I verify password and re-password field appears
    And I click checkbox change password
    Then I verify password and re-password field disappears
    And I click checkbox change password
    And I enter password "Ibsadmin123"
    And I enter re_password "Ibsadmin123"
    And I click save button
    Then verify successfully that user added with message "User AutTest User has been successfully updated."

  Scenario: Verify the Roll dropdown
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    Then I verify all values in the dropdown of role

  Scenario: Verify that FirstName,lastName,UserName,Email and Password Validations
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I enter firstName "   edit"
    Then I verify with validation error message "First name cannot start with a space or special character"
    And I enter lastName "$edit"
    Then I verify with validation error message "Last name cannot start with a space or special character"
    #And I enter userName "   edit"
    #Then I verify with validation error message "Username should be in format similar to: jose, jose12, joe.stone, joe_stone, joe-stone"
    And I enter email "@edit"
    Then I verify with validation error message "E-mail cannot start with a space or special character"
    And I click checkbox change password
    And I enter password "Abcdef@123"
    And I enter re_password "Wqert@123"
    Then I verify the validation error message if passwords didnt match as "Passwords don't match"

  Scenario: Verify that FirstName,lastName,UserName,Email,password maximum character validation
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I enter firstName having characters greater than 50
    Then validate max "firstName" character count allowed as 50
    And I enter lastName having characters greater than 50
    Then validate max "lastName" character count allowed as 50
   # And I enter userName having characters greater than 25
   # Then validate max "userName" character count allowed as 25
    And I enter email having characters greater than 100
    Then validate max "email" character count allowed as 100
    And I click checkbox change password
    And I enter password having characters greater than 50
    Then validate max "password" character count allowed as 50
    And I enter re_password having characters greater than 50
    Then validate max "passwordRe" character count allowed as 50

  Scenario: Verify Cancel button working as expected
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I update firstName with "Automations", lastName with "Testings",userName with "AUT_New_User",email with "automationtestings@ibsplc.com", Role with "Administrator"
    And I click on Cancel Button in user page
    Then verify cancel button working as expected with unchanged firstName "AutTest",unchanged lastName "User", unchanged userName "AutUserThree_DoNotDelete"
    And I verify on clicking cancel button closes the pane

  Scenario: Verify the First Name and Last Name are displayed together in the header, beneath the "Add User" label, as it is typed in the field
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on edit button for username "AutUserThree_DoNotDelete"
    And I enter firstName "AutTest"
    And I enter lastName "User"
    Then I verify the First Name and Last Name are displayed together in the header as "AutTest User"

  Scenario: Verify the mandatory fields
    Given I'm in the User Page for scenario "aut_scenario_alt-2403"
    When I click on username "AutUserThree_DoNotDelete"
    And I clear data from field "firstName"
    Then verify that the save button is disabled
    Then I enter firstName "AutTest"
    Then verify that the save button is enabled
    And I clear data from field "lastName"
    Then verify that the save button is disabled
    Then I enter lastName "User"
    Then verify that the save button is enabled
   # And I clear data from field "userName"
   # Then verify that the save button is disabled
   # Then I enter userName "UserName"
   # Then verify that the save button is enabled
    And I clear data from field "email"
    Then verify that the save button is disabled
    Then I enter email "autuserthree@ibsplc.com"
    Then verify that the save button is enabled
    And I click save button
    Then verify successfully that user added with message "User AutTest User has been successfully updated."


