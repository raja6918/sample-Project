@data_management @rolesAndPermission @rolesAndPermissionOnMainNavigation
Feature: Role & Permission- Main Navigation Page.

  Scenario: Verify permission groups with access granted appear in the "hamburger menu"
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the Role Page
  #  When I click on the Plus Button in Role page
  #  And I provide the roleName as "RoleAndPermission"
  #  And I provide the roleDescription as "Roles And Permission Checking"
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
   # And I click on 'CreateRole' Button in role page
   # Then verify successfully that role added with message "The role RoleAndPermission has been successfully created."
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
   # Then verify create role window is closed
   # Then I verify created role "AuthRoleDoNotDelete" is successfully added to role table
   # Then I go to User Page
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | RoleAndPermissionUser               |
   #   | Last Name     | RoleAndPermissionUser               |
   #   | User Name     | RoleAndPermissionUser               |
   #   | Email         | RoleAndPermissionUser@ibsplc.com    |
   #   | password      | Abc@1234                            |
   #   | Re Password   | Abc@1234                            |
   #   | Role          | RoleAndPermission                   |
   # And I click on 'Add' Button in user page
   # Then verify successfully that user added with message "User RoleAndPermissionUser RoleAndPermissionUser has been successfully added."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Then I click on hamburger menu
    And I verify "Dashboard, Scenarios, Templates, Users" on menu navigation bar

  Scenario: Verify permission groups with access denied do not appear "hamburger menu"
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Users" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on permission "Templates" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Then I click on hamburger menu
    And I verify "Templates" on menu navigation bar
    And I verify "Scenarios" on menu navigation bar
    And I verify "Users" on menu navigation bar
    And I verify "Dashboard" not present on menu navigation bar
