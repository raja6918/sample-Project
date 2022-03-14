@data_management @rolesAndPermission @rolesAndPermissionOnRulesPage
Feature: Role & Permission- Rules Page.

  Scenario: Verify application after "Modify rule values" access is granted
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the Role Page
   # When I click on the Plus Button in Role page
   # And I provide the roleName as "InderRoles"
   # And I provide the roleDescription as "Rules page"
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Modify rule values"
    And I click on checkbox of permission option "Manage rule sets"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
   # And I click on 'CreateRole' Button in role page
   # Then verify successfully that role added with message "The role InderRoles has been successfully created."
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
   # Then verify create role window is closed
   # Then I verify created role "InderRoles" is successfully added to role table
   # Then I go to User Page
   # When I click on the Plus Button in User page
   # And I provide the following data in the form user
   #   | First Name    | UserInderRoles         |
   #   | Last Name     | MyTest                  |
   #   | User Name     | UserInderRoles         |
   #   | Email         | Inder-ruless@ibsplc.com |
   #   | password      | Ibsadmin123                |
   #   | Re Password   | Ibsadmin123                |
   #   | Role          | InderRoles              |
   # And I click on 'Add' Button in user page
   # Then verify successfully that user added with message "User UserInderRoles MyTest has been successfully added."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2522" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I verify that the link to Manage Rule Sets is enabled and I click
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Add child" the ruleset "AUT baseline"
    Then I provide new ruleset name as "AUT New baseline"
    And I go Back To Rules
    Then I can see a list of all rules
    Then I select rule set "baseline"
    Then I can see it is possible to change the state of rule to "Off" for rules "Credit costs, Maximum connection time, Maximum duty time, Maximum rest time, Minimum connection time for aircraft changes, Minimum connection time for a turn, Penalty on CDO duties"
    And I verify the current status is updated to "Off" for rules "Credit costs, Maximum connection time, Maximum duty time, Maximum rest time, Minimum connection time for aircraft changes, Minimum connection time for a turn, Penalty on CDO duties"
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And I update integer value as "1001"
    Then I verify that integer value is updated to "1001"
    Then I collapse the rule name "Penalty on CDO duties"
    And I can see it is possible to expand rule to see its description "Apply flight deck rules during the solve, Credit costs, Crew swap definition, Domestic duty, Duty composition, Fatigue unit definition, International duty, Maximum connection time, Maximum flights per duty, Maximum number of days crossed by a pairing, Maximum rest time, Midnight definition, Penalty on duty productivity"
    Then I verify that the link to Manage Rule Sets is enabled
    Then I verify the current rule set name is "baseline"
    When I select rule set "AUT baseline"
    Then I verify the current rule set name is "AUT baseline"
    And I select rule set "AUT New baseline"
    Then I verify the current rule set name is "AUT New baseline"

  Scenario: Verify application after "Manage rule sets" access is granted
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    #And I click on checkbox of permission option "Modify rule values"
    And I click on checkbox of permission option "Manage rule sets"
    #And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    Then I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2522" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I verify that the link to Manage Rule Sets is enabled and I click
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Add child" the ruleset "AUT baseline"
    Then I provide new ruleset name as "AUT New baseline"
    And I can see that It is possible to see rule set namely "baseline, AUT baseline, AUT New baseline"
    When I collapse rule set tree for "AUT baseline, baseline"
    Then I confirm that collapse rule set tree is fine for "AUT baseline, baseline"
    When I expand rule set tree for "baseline, AUT baseline"
    Then I confirm that expand rule set tree is fine for "baseline, AUT baseline"
    And I click on three dots on "AUT New baseline"
    When I "Open" the ruleset "AUT New baseline"
    Then I verify the current rule set name is "AUT New baseline"
    Then I verify that the link to Manage Rule Sets is enabled and I click
    When I expand rule set tree for "baseline, AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Open" the ruleset "AUT baseline"
    Then I verify the current rule set name is "AUT baseline"
    Then I verify that the link to Manage Rule Sets is enabled and I click
    When I expand rule set tree for "baseline, AUT baseline"
    #When I expand rule set tree for "AUT baseline"
    And I click on three dots on "AUT New baseline"
    Then I confirm that menu items "Add child, Duplicate, Delete" are enabled
    When I "Delete" the ruleset "AUT New baseline"
    And I click delete confirmation button
    Then the delete message "Rule set AUT New baseline has been successfully deleted." for ruleset is displayed as expected
    When I click on three dots on "AUT baseline"
    When I "Duplicate" the ruleset "AUT baseline" to duplicate ruleset name
    Then I can see that It is possible to see rule set namely "Copy of AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Get/Edit info" the ruleset "AUT baseline"
    Then I verify that field Rule Set Name, Last modified by, Last modified and Description in the Get/Edit Info pane
    Then I verify that field Rule Set Name and Description in the Get/Edit Info pane are enabled

  Scenario: Verify application after "Modify rule values" access is revoked
    Given I open login page
    When I'm logged in with default credentials.
    And I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Modify rule values"
    And I click on checkbox of permission option "Manage rule sets"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    Then I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2522" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I verify that the link to Manage Rule Sets is enabled and I click
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Add child" the ruleset "AUT baseline"
    Then I provide new ruleset name as "AUT New baseline"
    And I log out
    And I login with username "admin" password "Ibsadmin123"
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    Then I click on permission "Scenarios"
    Then I uncheck on checkbox of permission option "Manage rule sets"
    Then I uncheck on checkbox of permission option "Modify rule values"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Then I open the scenario "aut_scenario_alt-2522"
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I can see a list of all rules
    Then I verify that the link to Manage Rule Sets is enabled
    Then I verify the current rule set name is "baseline"
    When I select rule set "baseline"
    Then I verify the current rule set name is "baseline"
    When I select rule set "AUT baseline"
    Then I verify the current rule set name is "AUT baseline"
    And I select rule set "AUT New baseline"
    Then I verify the current rule set name is "AUT New baseline"
    And I scroll to rule name "Penalty on CDO duties"
    Then I expand the rule name "Penalty on CDO duties"
    And  I verify that embedded in a rule description are visible and disabled
    Then I collapse the rule name "Penalty on CDO duties"
    Then I can see that state drop-down is visible and disabled for all rules namely "Apply flight deck rules during the solve, Credit costs, Crew swap definition, Domestic duty, Duty composition, Fatigue unit definition, International duty, Maximum connection time, Maximum flights per duty, Maximum number of days crossed by a pairing, Maximum rest time, Midnight definition, Penalty on duty productivity"
    And I can see it is possible to expand rule to see its description "Apply flight deck rules during the solve, Credit costs, Crew swap definition, Domestic duty, Duty composition, Fatigue unit definition, International duty, Maximum connection time, Maximum flights per duty, Maximum number of days crossed by a pairing, Maximum rest time, Midnight definition, Penalty on duty productivity"

  Scenario: Verify application after "Manage rule sets" access is revoked
    Given I open login page
    And I login with username "admin" password "Ibsadmin123"
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Modify rule values"
    And I click on checkbox of permission option "Manage rule sets"
    And I click on permission "Templates" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2522" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I verify that the link to Manage Rule Sets is enabled and I click
    And I click on three dots on "baseline"
    When I "Add child" the ruleset "baseline"
    Then I provide new ruleset name as "AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Add child" the ruleset "AUT baseline"
    Then I provide new ruleset name as "AUT New baseline"
    Then I log out
    And I login with username "admin" password "Ibsadmin123"
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    Then I click on permission "Scenarios"
    Then I uncheck on checkbox of permission option "Manage rule sets"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Then I open the scenario "aut_scenario_alt-2522"
    Then The Scenario is open in the Data Home page
    And I open rules page
    And I wait for rules page to load
    Then I verify that the link to Manage Rule Sets is enabled and I click
    When I expand rulesets "baseline","AUT baseline"
    And I can see that It is possible to see rule set namely "baseline, AUT baseline, AUT New baseline"
    When I collapse rule set tree for "AUT baseline, baseline"
    Then I confirm that collapse rule set tree is fine for "AUT baseline, baseline"
    When I expand rule set tree for "baseline, AUT baseline"
    Then I confirm that expand rule set tree is fine for "baseline, AUT baseline"
    And I click on three dots on "AUT New baseline"
    When I "Open" the ruleset "AUT New baseline"
    Then I verify the current rule set name is "AUT New baseline"
    Then I verify that the link to Manage Rule Sets is enabled and I click
    When I expand rulesets "baseline","AUT baseline"
    And I click on three dots on "AUT baseline"
    When I "Open" the ruleset "AUT baseline"
    Then I verify the current rule set name is "AUT baseline"
    Then I verify that the link to Manage Rule Sets is enabled and I click
    When I expand rulesets "baseline","AUT baseline"
    And I click on three dots on "AUT New baseline"
    Then I confirm that menu items "Add child, Duplicate, Delete" are disabled
    When I "Get/Edit info" the ruleset "AUT New baseline"
    Then I verify that field Rule Set Name, Last modified by, Last modified and Description in the Get/Edit Info pane
    Then I verify that field Rule Set Name and Description in the Get/Edit Info pane are disabled
