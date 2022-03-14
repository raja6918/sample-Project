@users @usersErrorHandling @userAdministration @wip
Feature: User Administration - Error Handling.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  @duplicateUser
  Scenario Outline: I want to add a duplicate user
  #  Given The users with following values are added
  #    | First Name | User               |
  #    | Last Name  | Automation         |
  #    | User Name  | aut_userIBS3       |
   #   | Email      | aut@konos-test.com |
   #   | Password   | Password1          |
   #   | Role       | Administrator      |
   #   |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then the snackbar message "The user name entered already exists. Please enter a different user name." for users is displayed
  Examples:
    | firstName  | lastName  | username      | email                | password    | passwordConfirmation   | role          |
    | admin      | admin     | admin         | adminTest@kronos.com | Ibsadmin123 | Ibsadmin123            | Administrator |


  #@duplicateUser
  #Scenario: I want to edit a user to a username that already exists
  #  Given The users with following values are added
  #    | First Name | User_1               | User_2               |
  #    | Last Name  | Automation_1         | Automation_2         |
  #    | User Name  | user_9               | user_10               |
  #    | Email      | aut_1@konos-test9.com | aut_2@konos-test10.com |
  #    | Password   | Password1            | Password1            |
  #    | Role       | Administrator        | Administrator        |
  #    |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064| 756cbd11-4695-4e02-95b3-15382d89a064|
  #  And I enter to User administration portal
  #  When I modify the username to "user_10" for the user "user_9"
  #  And I save the changes
  #  Then the snackbar message "ERRORS.USER_USERNAME_NOT_MODIFIABLE" for users is displayed

 # @deleteUser
 # Scenario: I want to delete a user that is already deleted
 #   Given The users with following values are added
 #     | First Name | User               |
 #     | Last Name  | Automation         |
 #     | User Name  | aut_userIBS31       |
 #     | Email      | aut@konos-test31.com |
 #     | Password   | Password1          |
 #     | Role       | Administrator      |
 #     |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
 #   And I enter to User administration portal
 #   And I delete user "aut_userIBS31" through backend
 #   When I delete the user "aut_userIBS31"
  #  Then the snackbar message "This user has already been deleted. Please refresh your screen." for users is displayed
