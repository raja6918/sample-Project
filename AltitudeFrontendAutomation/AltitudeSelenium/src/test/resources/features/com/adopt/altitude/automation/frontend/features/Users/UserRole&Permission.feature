@data_management @users @rolesAndPermission @roles&PermissionOnUserPage
Feature: Role & Permission- User & Role Page.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: verify the access to the Users page with Manage Users privilege
    Given I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Users" in the role page
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And Verify that the columns firstName,LastName,userName and Role are included in the table
    And I take count of users in the user table
    Then I verify the total number of users is displayed at the bottom of table
    Then verify that the 'Plus' button is enabled in user page
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name  | Automation                  |
   #   | Last Name   | Testing                     |
   #   | User Name   | AutUserEdit_DoNotDelete     |
   #   | Email       | automation@ibsplc.com       |
   #   | password    | Ibsadmin123                 |
   #   | Re Password | Ibsadmin123                 |
   #   | Role        |  AuthRoleDoNotDelete        |
   # And I click on 'Add' Button in user page
    When I click on edit button for username "AutUserTwo_DoNotDelete"
    And I update Role with "AuthRoleDoNotDelete".
    Then I verify that role updated successfully with new role "AuthRoleDoNotDelete"


  Scenario: When I access to the Role page with Manage Role privilege
    Given I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Users" in the role page
    And I click on checkbox of permission option "Manage user roles"
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRole25206Add"
    And I provide the roleDescription as "AutRoleDesciption"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then verify successfully that role added with message "The role AutRole25206Add has been successfully created."
    When I click on edit button for role "AutRole25206Add"
    And I update roleName with "autNew25206Add"
    And I save changes in role page
    Then verify successfully that role updated with message "The role autNew25206Add has been successfully updated."
    Then I verify roleName "autNew25206Add" is successfully updated to role table
    And I click on delete button for role "autNew25206Add"

  Scenario: When I access to the Role page with Manage Users privilege, and should be denied
    Given I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Users" in the role page
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I verify the role page link is disabled
