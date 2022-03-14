@rolesAndPermission @rolesAndPermissionOnSolver @data_management
Feature: Role & Permission- Solver Requests page.

  Scenario: Verify application after "Solver" access is granted
    Given I open login page
    And The Scenario "aut_scenario_alt-2518" is added
    And I'm logged in with default credentials.
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2518"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    Then I'm in the Role Page
    #When I click on the Plus Button in Role page
    #And I provide the roleName as "User2520Aut"
    #And I provide the roleDescription as "Solver Test page"
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Manage solver requests"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    #And I click on 'CreateRole' Button in role page
    #Then verify successfully that role added with message "The role User2520Aut has been successfully created."
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    #Then verify create role window is closed
    #Then I verify created role "User2520Aut" is successfully added to role table
    #Then I go to User Page
    #When I click on the Plus Button in User page
    #And I provide the following data in the form user
    #  | First Name    | IUser2519Aut            |
    #  | Last Name     | MyTest                  |
    #  | User Name     | IUser2520Aut            |
    #  | Email         | IUser2520Aut@ibsplc.com |
    #  | password      | Abc@1234                |
    #  | Re Password   | Abc@1234                |
    #  | Role          | User2520Aut             |
    #And I click on 'Add' Button in user page
    #Then verify successfully that user added with message "User IUser2519Aut MyTest has been successfully added."
    And I log out
    And The Scenario "aut_scenario_alt-2518" is added
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2518"
    #And I click on the Add Scenario button
    #When I create the Scenario "aut_scenario_alt-2518" with default values selecting the "Template Number Nine" template
    #Then The Scenario is open in the Data Home page
    #And I go to solver page now
    #Then I verify that The Add button is visible and enabled
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the name to "AUT_Solver_Request_updated" for "AUT_Solver_Request" Request Name
    Then Verify successfully the request name "AUT_Solver_Request_updated" is updated as expected
    When I update the crew group "Combo Pilots" to "CR7 Pilots" of request "AUT_Solver_Request_updated"
    Then Verify successfully the crew group  "CR7 Pilots" is updated as expected
    Then I verify that Favorite icon is disabled
    When I click on launch button for solver request "AUT_Solver_Request_updated"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request_updated" with message "Completed successfully"
    And I verify that Favorite icon is enabled and i click on favourite
    Then I confirm that Solver request "AUT_Solver_Request_updated" is marked as favourite
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Role_Solver_Request   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    Then I verify that Favorite icon is disabled
    When I click on launch button for solver request "Role_Solver_Request"
    Then Verify successfully launch the Solver Request "Role_Solver_Request" with message "Completed successfully"
  #  When I click on the 'Add' Solver Request
  #  And I provide the following data in the form Solver Request
  #   | Request Name   | Stop_Solver_Request    |
  #   | Solver Task    | Build Pairings        |
  #   | Crew Group     | 777 787 CM FA         |
  #   | Rules          | baseline              |
  #   | Recipe         | Monthly: 320 Pilot     |
  #  And I click on 'Add' Button
  #  When I click on launch button for solver request "Stop_Solver_Request"
  #  And I click on Stop button for solver request
  #  Then Verify successfully message "Stopped by user" is displayed in the progress bar after Solver Stop as expected
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Revoke_Solver_Request    |
      | Solver Task    | Build Pairings           |
      | Crew Group     | Combo Pilots             |
      | Rules          | baseline                 |
      | Recipe         | Arg                      |
    And I click on 'Add' Button
    And I verify that all checkboxes are enabled
#    Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, Stop_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I verify that Filter icon is enabled and i search for solver request "Role_Solver_Request"
    And I verify that using Filter it is possible to search solver request "Role_Solver_Request"
    Then I select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I verify that "Compare" option is enabled and i click
    Then I verify that i can see "AUT_Solver_Request_updated, Role_Solver_Request" in the Statistics comparision table
    Then I de-select solver requests "AUT_Solver_Request_updated"
    And I confirm that "AUT_Solver_Request_updated" is removed from the Statistics comparision table
    Then I select solver requests "AUT_Solver_Request_updated"
    Then I verify that i can see "AUT_Solver_Request_updated" in the Statistics comparision table
    And I select crew group as "YUL"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "YUL"
    And I select crew group as "All crew bases"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "All crew bases"
    And I click on statistics value "Total (real) cost" and change to "Duty hours" and verify all the values in the corresponding row are changed
    Then I should be able to delete statistic from the table
    Then I de-select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I click solver requests "Role_Solver_Request"
    Then I verify "Preview" button is enabled and i click
    And Click on "Save Pairings" button and Then Verify that save has been successfully done with toast message "The pairings from solver request Role_Solver_Request have been successfully saved for crew group Combo Cabin."
    And I verify that crew group "Combo Pilots" is displayed and disabled on page
    And I verify that "Close Preview" is displayed on the page and is enabled
    And I verify that "UTC" is displayed on the pairing page
    And I verify that "baseline" is displayed on the page
    Then Verify that "Save Pairings" is disabled after the save solver result completed
    Then Then I close Preview tab

  Scenario: Verify application after "Solver" access is revoked
    Given I open login page
    And The Scenario "aut_scenario_alt-2518" is added
    And I'm logged in with default credentials.
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2518"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Manage solver requests"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2518"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the name to "AUT_Solver_Request_updated" for "AUT_Solver_Request" Request Name
    Then Verify successfully the request name "AUT_Solver_Request_updated" is updated as expected
    When I update the crew group "Combo Pilots" to "CR7 Pilots" of request "AUT_Solver_Request_updated"
    Then Verify successfully the crew group  "CR7 Pilots" is updated as expected
    Then I verify that Favorite icon is disabled
    When I click on launch button for solver request "AUT_Solver_Request_updated"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request_updated" with message "Completed successfully"
    And I verify that Favorite icon is enabled and i click on favourite
    Then I confirm that Solver request "AUT_Solver_Request_updated" is marked as favourite
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Role_Solver_Request   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Role_Solver_Request"
    Then Verify successfully launch the Solver Request "Role_Solver_Request" with message "Completed successfully"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Revoke_Solver_Request    |
      | Solver Task    | Build Pairings           |
      | Crew Group     | Combo Pilots              |
      | Rules          | baseline                 |
      | Recipe         | Arg                      |
    And I click on 'Add' Button
    When I click on launch button for solver request "Revoke_Solver_Request"
    Then Verify successfully launch the Solver Request "Revoke_Solver_Request" with message "Completed successfully"
    Then I log out
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    #And I click on checkbox of permission option "Manage solver requests"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Then I open the scenario "aut_scenario_alt-2518"
    And I go to solver page now
    And I verify that add button is visible and disabled
  #  Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, Stop_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I verify that Filter icon is enabled and i search for solver request "Role_Solver_Request"
    And I verify that using Filter it is possible to search solver request "Role_Solver_Request"
    Then I select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I verify that "Compare" option is enabled and i click
    Then I verify that i can see "AUT_Solver_Request_updated, Role_Solver_Request" in the Statistics comparision table
    Then I de-select solver requests "AUT_Solver_Request_updated"
    And I confirm that "AUT_Solver_Request_updated" is removed from the Statistics comparision table
    Then I select solver requests "AUT_Solver_Request_updated"
    Then I verify that i can see "AUT_Solver_Request_updated" in the Statistics comparision table
    And I select crew group as "YUL"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "YUL"
    And I select crew group as "All crew bases"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "All crew bases"
    And I click on statistics value "Total (real) cost" and change to "Duty hours" and verify all the values in the corresponding row are changed
    Then I should be able to delete statistic from the table
    Then I de-select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I click solver requests "Revoke_Solver_Request"
    Then Verify successfully "Stop" Button should be disabled as expected
    Then Verify successfully "Launch" Button should be disabled as expected
    Then Verify successfully "Favorite" Button should be disabled as expected
    And I Verify successfully that all fields are disabled as expected
    And I click solver requests "Role_Solver_Request"
    And I verify that Favorite icon is enabled and i click on favourite
    Then I confirm that Solver request "Role_Solver_Request" is marked as favourite
    Then I verify "Preview" button is enabled and i click
    And I verify that crew group "Combo pilots" is displayed and disabled on page
    And I verify that "Close Preview" is displayed on the page and is enabled
    And I verify that "UTC" is displayed on the pairing page
    And I verify that "baseline" is displayed on the page
    Then Verify that "Save Pairings" is disabled in preview
    Then Then I close Preview tab

  Scenario: Verify application after "View Only" scenario access
    Given I open login page
    And The Scenario "aut_scenario_alt-2518" is added
    And I'm logged in with default credentials.
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2518"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Manage solver requests"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2518"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots           |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I update the name to "AUT_Solver_Request_updated" for "AUT_Solver_Request" Request Name
    Then Verify successfully the request name "AUT_Solver_Request_updated" is updated as expected
    When I update the crew group "Combo Pilots" to "CR7 Pilots" of request "AUT_Solver_Request_updated"
    Then Verify successfully the crew group  "CR7 Pilots" is updated as expected
    Then I verify that Favorite icon is disabled
    When I click on launch button for solver request "AUT_Solver_Request_updated"
    Then Verify successfully launch the Solver Request "AUT_Solver_Request_updated" with message "Completed successfully"
    And I verify that Favorite icon is enabled and i click on favourite
    Then I confirm that Solver request "AUT_Solver_Request_updated" is marked as favourite
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Role_Solver_Request   |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Role_Solver_Request"
    Then Verify successfully launch the Solver Request "Role_Solver_Request" with message "Completed successfully"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Revoke_Solver_Request    |
      | Solver Task    | Build Pairings           |
      | Crew Group     | Combo Pilots              |
      | Rules          | baseline                 |
      | Recipe         | Arg                      |
    And I click on 'Add' Button
    When I click on launch button for solver request "Revoke_Solver_Request"
    Then Verify successfully launch the Solver Request "Revoke_Solver_Request" with message "Completed successfully"
    Then I log out
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View only"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I open the view only scenario "aut_scenario_alt-2518"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I go to solver page now
    And I verify that add button is visible and disabled
  #  Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, Stop_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I confirm that possible to see a list of all Solver Requests "Revoke_Solver_Request, AUT_Solver_Request_updated, Role_Solver_Request"
    Then I verify that Filter icon is enabled and i search for solver request "Role_Solver_Request"
    And I verify that using Filter it is possible to search solver request "Role_Solver_Request"
    Then I select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I verify that "Compare" option is enabled and i click
    Then I verify that i can see "AUT_Solver_Request_updated, Role_Solver_Request" in the Statistics comparision table
    Then I de-select solver requests "AUT_Solver_Request_updated"
    And I confirm that "AUT_Solver_Request_updated" is removed from the Statistics comparision table
    Then I select solver requests "AUT_Solver_Request_updated"
    Then I verify that i can see "AUT_Solver_Request_updated" in the Statistics comparision table
    And I select crew group as "YUL"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "YUL"
    And I select crew group as "All crew bases"
    Then I can view value of solver "AUT_Solver_Request_updated" and "Role_Solver_Request" for crewbase "All crew bases"
    And I click on statistics value "Total (real) cost" and change to "Duty hours" and verify all the values in the corresponding row are changed
    Then I should be able to delete statistic from the table
    Then I de-select solver requests "AUT_Solver_Request_updated, Role_Solver_Request"
    And I click solver requests "Revoke_Solver_Request"
    And I click solver requests "Revoke_Solver_Request"
    Then Verify successfully "Stop" Button should be disabled as expected
    Then Verify successfully "Launch" Button should be disabled as expected
    Then Verify successfully "Favorite" Button should be disabled as expected
    And I Verify successfully that all fields are disabled as expected
    And I click solver requests "Role_Solver_Request"
   # And I verify that Favorite icon is enabled and i click on favourite
   # Then I confirm that Solver request "Role_Solver_Request" is marked as favourite
    Then I verify "Preview" button is enabled and i click
    And I verify that crew group "Combo pilots" is displayed and disabled on page
    And I verify that "Close Preview" is displayed on the page and is enabled
    And I verify that "UTC" is displayed on the pairing page
    And I verify that "baseline" is displayed on the page
    Then Verify that "Save Pairings" is disabled in preview
    Then Then I close Preview tab

