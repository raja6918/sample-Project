@data_management @roles @EditRoles
Feature: Role - Edit.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: Verify that roleName cannot start with a space or special character
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleEditOne"
    And I provide the roleDescription as "AutRoleDesc"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on edit button for role "AutRoleEditOne"
    And I update roleName with "_NewRole@123"
    Then I verify with validation error message for roleName field "The role name must contain only letters or numbers"
    And I update roleName with " NewRole@123"
    Then I verify with validation error message for roleName field "The role name must contain only letters or numbers"
    And I close Add new UserRole form
    And I click on delete button for role "AutRoleEditOne"

  Scenario: Verify that roleName is successfully updated
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleEditTwo"
    And I provide the roleDescription as "AutRoleDesc"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on edit button for role "AutRoleEditTwo"
    And I update roleName with "autFERoleNew"
    And I save changes in role page
    Then verify successfully that role updated with message "The role autFERoleNew has been successfully updated."
    Then I verify roleName "autFERoleNew" is successfully updated to role table
    Then verify create role window is closed
    And I click on delete button for role "autFERoleNew"

  Scenario: Validate role description is updated successfully and validate its character count
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleEditThree"
    And I provide the roleDescription as "AutRoleDesc"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on edit button for role "AutRoleEditThree"
    And I provide the roleDescription as "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy1234"
    And I save changes in role page
    Then I verify the roleDescription text, not above 250 characters are allowed
    And I click on delete button for role "AutRoleEditThree"

  Scenario: Verify the scenario of save button enabled
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleEditFour"
    And I provide the roleDescription as "AutRoleDesc"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on edit button for role "AutRoleEditFour"
    And I update roleName with "AutMandatoryRole"
    Then I verify that save button is enabled when all mandatory fields are correctly entered and at least one permission group has been granted
    And I remove the role name
    Then I verify that save button is disabled
    And I provide the roleName as "AutMandatoryRole"
    And I click on permission "Scenarios" in the role page
    Then I verify that save button is disabled
    And I close Add new UserRole form
    And I click on delete button for role "AutRoleEditFour"

  Scenario: Verify permission is updated successfully
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleEditFive"
    And I provide the roleDescription as "AutRoleDesc"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    When I click on edit button for role "AutRoleEditFive"
    And I click on permission "Scenarios" in the role page
    And I click on permission "Templates" in the role page
    And I save changes in role page
    When I click on edit button for role "AutRoleEditFive"
    Then I verify that newly updated permission "Templates" reflected successfully
    And I close Add new UserRole form
    And I click on delete button for role "AutRoleEditFive"


