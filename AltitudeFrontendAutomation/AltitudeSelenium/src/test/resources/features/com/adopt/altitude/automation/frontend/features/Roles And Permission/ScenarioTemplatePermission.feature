@rolesAndPermission @Scenarios_Templates_Permission @data_management
Feature: Role & Permission- Scenarios and Templates pages.

  Scenario: Verify application after "View and Manage" access is granted to the Scenarios capabilities
    Given I open login page
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    #When I click on the Plus Button in Role page
   # And I provide the roleName as "RoleAndPermission"
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    #And I provide the roleDescription as "Scenario and Template Test page"
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete scenarios"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete templates"
    And I click on permission "Users" in the role page
    #And I click on 'CreateRole' Button in role page
    And I save changes in role page
    #Then verify successfully that role added with message "The role TempScenaUTestR has been successfully created."
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
   # Then verify create role window is closed
   # Then I verify created role "TempScenaUTestR" is successfully added to role table
   # Then I go to User Page
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | User                              |
   #   | Last Name     | Automation_01R                    |
   #   | User Name     | RoleAndPermissionUser1            |
   #   | Email         | RoleAndPermissionUser1@ibsplc.com |
   #   | password      | Abc@1234                          |
   #   | Re Password   | Abc@1234                          |
   #   | Role          | RoleAndPermission                 |
   # And I click on 'Add' Button in user page
   # Then verify successfully that user added with message "User User Automation_01R has been successfully added."
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
    #  | First Name    | User                              |
    #  | Last Name     | Automation_02R                    |
    #  | User Name     | RoleAndPermissionUser2            |
    #  | Email         | RoleAndPermissionUser2@ibsplc.com |
    #  | password      | Abc@1234                          |
    #  | Re Password   | Abc@1234                          |
    #  | Role          | RoleAndPermission                 |
    #And I click on 'Add' Button in user page
    #Then verify successfully that user added with message "User User Automation_02R has been successfully added."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I verify that The Add button is visible and enabled
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2516" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I go to scenario page
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2516New" with default values selecting the "Sierra UAT Template" template
    Then I log out
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_user2" with default values selecting the "Sierra UAT Template" template
   # Then The Scenario is open in the Data Home page
    Then I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    When I filter by "Not me"
    Then the listed scenarios are not belonging to:
      | Automation Testing |
    And I can see list of Scenarios
    When I filter by "Anyone"
    Then the listed scenarios belongs to:
      # |FirstName Lastname|
      | Automation Testing |
      | Testing Automation |
    And I can see list of Scenarios
    Then I can see Scenarios have statuses as Edit or Open or Read-Only
    When I filter by "Me"
    Then the listed scenarios belongs to:
      | Automation Testing |
    And I can see list of Scenarios
    And I open the Scenario drawer for Scenario "aut_scenario_alt-2516" and verify that Get/Edit Info, Save as Template and Delete option is enabled
    Then I click on Get/Edit Info option
    When I modify the Scenario name to "aut_scenario_alt-2516_updated"
    Then The Scenario name "aut_scenario_alt-2516_updated" is updated in the table
    And I open the Scenario Info drawer for Scenario "aut_scenario_alt-2516_updated"
    Then I update the description as "Automation Description"
    And the message "Scenario aut_scenario_alt-2516_updated has been successfully updated." is displayed
    Given I select 'Save as Template' for Scenario "aut_scenario_alt-2516_updated"
    When I fill out the form for the "aut_template_from_scenarioR" Template with category "" and  "Test Automation" as description
    And I click on the 'CREATE' button
    Then the snackbar message "Template aut_template_from_scenarioR has been created." for scenarios is displayed
    And I go to template page
    When I click on the 'Delete' button for template "aut_template_from_scenarioR"
    Then the template "aut_template_from_scenarioR" is deleted from the list
    And I go to scenario page
    And I open the Actions menu for the Scenario "aut_scenario_alt-2516_updated"
    When I delete the Scenario
    Then The Scenario "aut_scenario_alt-2516_updated" is deleted from the list

  Scenario: Verify application after "View Only" access is granted to the Scenarios capabilities
    Given I open login page
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete scenarios"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete templates"
    And I click on permission "Users" in the role page
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I verify that The Add button is visible and enabled
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2516" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I go to scenario page
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2516New" with default values selecting the "Sierra UAT Template" template
    Then I log out
    And I login with username "AutUserTwo_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_user2" with default values selecting the "Sierra UAT Template" template
    Then I log out
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View only"
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View only"
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I verify that add button is visible and disabled.
    Then I open the Scenario drawer for Scenario "aut_scenario_alt-2516New"
    And I verify that option "Save as template" is disabled
    And I verify that option "Delete" is disabled
    And I verify that option "Save as template" is disabled
    And I verify that option "Get/Edit info" is enabled
    And I verify that the Scenario Name field is disabled
    And I verify that the Description field is disabled and i click on Cancel button
    When I filter by "Not me"
    Then the listed scenarios are not belonging to:
      | Automation Testing |
    And I can see list of Scenarios
    When I filter by "Anyone"
    Then the listed scenarios belongs to:
      | Automation Testing     |
      | Testing Automation     |
    And I can see list of Scenarios
    Then I can see Scenarios have statuses as Read-Only
    When I filter by "Me"
    Then the listed scenarios belongs to:
      | Automation Testing |
    And I can see list of Scenarios

  Scenario: Verify application after "View Only" access is granted to the Template capabilities
    Given I open login page
    And The template "aut_template_from_scenario" with category "" description "Test" and source "Sierra UAT Template"
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View only"
    And I save changes in role page
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I'm in the templates page
    And I verify that add button is visible and disabled.
    Then I verify that It is possible to see all Templates
    And I verify that all templates have the Read-only status
    Then I verify tooltip message for all templates as "This template can be opened only in view-only mode"
    Then I click on Action Menu of template "aut_template_from_scenario"
    And I verify that option "Delete" is disabled
    And I verify that option "Get/Edit info" is enabled and i click
    Then I verify that The Template Name field is disabled
    Then I verify that The Category field is disabled
    Then I verify that The Description field is disabled
    And I open the template "aut_template_from_scenario"
    When I click 'Open' button on the template View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the template name
    Then I log out
    And I'm logged in with default credentials.
    And I go to template page
    When I click on the 'Delete' button for template "aut_template_from_scenario"
    Then the template "aut_template_from_scenario" is deleted from the list

  Scenario Outline: Verify application after "View and Manage" access is granted to the Template capabilities
    Given I open login page
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete templates"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I'm in the templates page
    And I verify that The Add button is visible and enabled
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list
    And I'm in the templates page
    Then I verify that It is possible to see all Templates
    Then I click on Action Menu of template "Template_2516"
    And I verify that The template option "Open" is enabled
    And I verify that The template option "Get/Edit info" is enabled
    And I verify that The template option "Delete" is enabled
    Then I Click on template option "Open"
    And I'm in the templates page
    Then I log out
    And I'm logged in with default credentials.
    And I go to template page
    When I click on the 'Delete' button for template "Template_2516"
    Then the template "Template_2516" is deleted from the list

    Examples:
      | sourceTemplate      | templateName     | category | description |
      | Sierra UAT Template | Template_2516    |          | test        |

  Scenario Outline: Verify application after "View and Manage" access is granted to the Template capabilities and edit the templateinfo
    Given I open login page
    And The template "aut_template_alt-toEdit" with category "" description "Test" and source "Sierra UAT Template"
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete templates"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I'm in the templates page
    When I click on the 'Get Info' button for template "aut_template_alt-toEdit"
    And I edit <templateName> <category> <description> in the form
    Then the changes are saved in the template
    Then I log out
    And I'm logged in with default credentials.
    And I go to template page
    When I click on the 'Delete' button for template "aut_template_2516_updated"
    Then the template "aut_template_2516_updated" is deleted from the list

    Examples:
      | templateName              | category | description |
      | aut_template_2516_updated | Pairing  | Pairing     |
