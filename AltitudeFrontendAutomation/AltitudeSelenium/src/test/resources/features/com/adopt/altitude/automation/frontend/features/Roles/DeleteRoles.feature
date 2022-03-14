@data_management @roles @DeleteRoles
Feature: Role - Delete.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: I want to delete a role without any dependency
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoletobeDelete"
    And I provide the roleDescription as "AutRoleDesciption"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on delete button for role "AutRoletobeDelete"
    Then the message "The role AutRoletobeDelete has been successfully deleted." for role is displayed

  Scenario: I want to delete a role with dependency
    Given I'm in the Role Page
    #When I click on the Plus Button in Role page
    #And I provide the roleName as "AutRoleWithDependencyTest"
    #And I provide the roleDescription as "AutRoleDesciption"
    #And I click on permission "Scenarios" in the role page
    #And I click on 'CreateRole' Button in role page
    #Given I'm back to users Page from role page
    #When I click on the Plus Button in User page
    #And I provide the following data in the form user
    #  | First Name    | 1581User                    |
    #  | Last Name     | AutomationTest                  |
    #  | User Name     | 1589AutomationUserTEST          |
    #  | Email         | 1589@AutomationTEST.com         |
    #  | password      | Qwerty@123                  |
    #  | Re Password   | Qwerty@123                  |
    #  | Role          | AutRoleWithDependencyTest   |
    #And I click on 'Add' Button in user page
    #Given I'm back to role Page from user page
    When I click on delete button for role "AuthRoleDoNotDelete"
    Then verify the reference error for role "This role cannot be deleted because it has reference with one or more users." is displayed

