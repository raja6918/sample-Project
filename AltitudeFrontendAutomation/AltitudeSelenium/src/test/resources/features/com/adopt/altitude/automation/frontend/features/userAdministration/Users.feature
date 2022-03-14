@users @userAdministration @wip
Feature: User Administration - Add, Edit, Delete.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  #@addUser
     #Scenario Outline: I want to add a new user
     #Given I enter to User administration portal
    #And I open add new user form
    #When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    #When I check User "aut_userIBS28C"
    #Then User is added to list

    #Examples:
     # | firstName | lastName   | username     | email              | password  | passwordConfirmation | role          |
     # | User1      | Automation1 | aut_userIBS28C | aut@konos-test28C.com | Password1 | Password1            | Administrator |

  @editUser
  Scenario Outline: I want to edit a user
    #Given The users with following values are added
    #  | First Name | User5               |
    #  | Last Name  | Automation3         |
    #  | User Name  | aut_userIBS42B       |
    #  | Email      | aut@konos-test42B.com |
    #  | Password   | Password1          |
    #  | Role       | Administrator      |
    #  |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
    And I enter to User administration portal
    When I modify the information <firstName> <lastName> <email> <role> for the user "AutUserThree_DoNotDelete"
    Then The user details are updated for "AutUserThree_DoNotDelete"

    Examples:
      | firstName | lastName | email                          | role    |
      | AutTest    | User     | autuserthree@ibsplc.com | AuthRoleDoNotDelete |

 # @deleteUser
 # Scenario: I want to delete a user
  #  Given The users with following values are added
  #    | First Name | User                 |
  #    | Last Name  | Automation           |
  #    | User Name  | aut_userIBS38Z         |
   #   | Email      | aut@konos-test38Z.com   |
   #   | Password   | Password1            |
   #   | Role       | Administrator        |
   #   |roleId      | 756cbd11-4695-4e02-95b3-15382d89a064|
   # And I enter to User administration portal
   # When I delete the user "aut_userIBS38Z"
   # Then User "aut_userIBS38Z" is deleted from users list
