@data_management @roles @AddRoles
Feature: Role - Add.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1586" is added
    And I'm logged in with default credentials.

  Scenario: Verify that role add successfully
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRole"
    And I provide the roleDescription as "AutRoleDesciption"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then verify successfully that role added with message "The role AutRole has been successfully created."
    Then verify create role window is closed
    Then I verify created role "AutRole" is successfully added to role table
    And I click on delete button for role "AutRole"

  Scenario: Verify that duplicate role cannot add successfully
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleTest"
    And I provide the roleDescription as "AutRoleDesciption"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then verify successfully that role added with message "The role AutRoleTest has been successfully created."
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleTest"
    And I provide the roleDescription as "AutRoleDesciptionNew"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then verify successfully that role added with message "The user role AutRoleTest already exists, Please enter a different one."
    And I close Add new UserRole form
    And I click on delete button for role "AutRoleTest"

  Scenario: Try to create role in invalid roleName
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "Aut_Role"
    Then I verify with validation error message for roleName field "The role name must contain only letters or numbers"

  Scenario: Validate role description character count
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleNew"
    And I provide the roleDescription as "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy1234"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then I verify the roleDescription text, not above 250 characters are allowed
    And I click on delete button for role "AutRoleNew"

  Scenario: Verify the selectAll option of permissions in role page
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on selectAll option in role page
    Then Verify that selectAll button is disabled
    Then Verify that all checkbox are selected

  Scenario: Verify the clearAll option of permissions in role page
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Modify rule values"
    And I click on checkbox of permission option "Manage rule sets"
    And I click on clearAll option in role page
    Then Verify that no checkbox are selected
    Then Verify that clearAll button is disabled
    And I click on checkbox of permission option "Manage rule sets"
    Then Verify that clearAll button is enabled

  Scenario: Verify the scenario of create button enabled
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleTest"
    And I click on permission "Scenarios" in the role page
    Then I verify that create button is enabled when all mandatory fields are correctly entered and at least one permission group has been granted
    And I remove the role name
    Then I verify that create button is disabled
    And I provide the roleName as "AutRoleNewRole"
    And I click on permission "Scenarios" in the role page
    Then I verify that create button is disabled

