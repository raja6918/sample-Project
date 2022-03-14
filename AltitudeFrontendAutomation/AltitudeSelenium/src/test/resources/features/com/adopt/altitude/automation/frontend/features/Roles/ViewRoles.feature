@data_management @roles @ViewRoles
Feature: Role - View.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: Verify that the roleName,Description are included in the table
    Given I'm in the Role Page
    And Verify that the columns roleName,Description are included in the table

  Scenario: Verify that total number of roles is displayed at the bottom of the roles table
    Given I'm in the Role Page
    And I take count of roles in the roles table
    Then I verify the total number of roles is displayed at the bottom of roles table

  Scenario: Validate Long descriptions are abbreviated with an ellipsis and tooltip with complete description is displayed on the mouse hover
    Given I'm in the Role Page
    When I click on the Plus Button in Role page
    And I provide the roleName as "AutRoleView1"
    And I provide the roleDescription as "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy1234"
    And I click on permission "Scenarios" in the role page
    And I click on 'CreateRole' Button in role page
    Then I verify the Long roleDescription text, above 250 characters are abbreviated with an ellipsis and tooltip with complete description is displayed on the mouse hover
    And I click on delete button for role "AutRoleView1"

  Scenario: Verify the sort operation for the field RoleName
    Given I'm in the Role Page
    And I click on sortButton for field "Role name" in role table
    Then I verify that sort operation is done successfully for the column RoleName

  Scenario: Verify that Administrator role cannot be updated
    Given I'm in the Role Page
    When I click on view button for role "Administrator"
    Then verify that roleName should not be able to update
    Then verify that description should not be able to update
    Then I verify that permission should not be able to update

  Scenario: Verify that Administrator role cannot be deleted
    Given I'm in the Role Page
    Then I verify that delete button for role "Administrator" is disabled

  Scenario: Verify the filter operation for the field roleName and description
    Given I'm in the Role Page
    And I click on filterButton in the role page
    And I enter text "aut" on roleName searchBox
    Then I verify that filter operation for text "aut" is done successfully for the column roleName
    And I close search box in role page
    And I enter text "abc" on description searchBox
    Then I verify that filter operation for text "abc" is done successfully for the column description
    And I close search box in role page
