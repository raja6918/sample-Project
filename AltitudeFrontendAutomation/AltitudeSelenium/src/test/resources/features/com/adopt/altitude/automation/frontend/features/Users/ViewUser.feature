@data_management @users @ViewUser
Feature: User - View.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2404" is added
    And I'm logged in with default credentials.

  Scenario: Verify that the firstName,LastName,userName and Role are included in the table
    Given I'm in the User Page
    And Verify that the columns firstName,LastName,userName and Role are included in the table

  Scenario: Verify to view all existing users inside user table
    Given I'm in the User Page
    And I take count of users in the user table
    Then I log out
    And I login with username "admin" password "Ibsadmin123"
    Given I'm in the User Page
    And I take count of users in the user table again

  Scenario: Verify that total number of users is displayed at the bottom of the users table
    Given I'm in the User Page
    And I take count of users in the user table
    Then I verify the total number of users is displayed at the bottom of table

  Scenario: Verify the sort operation for the field lastName
    Given I'm in the User Page
    And I click on sortButton for field "Last name"
    Then I verify that sort operation is done successfully for the column lastName

  Scenario: Verify the sort operation for the field firstName
    Given I'm in the User Page
    Then I verify that sort operation is done successfully for the column FirstName

  Scenario: Verify the sort operation for the field userName
    Given I'm in the User Page
    And I click on sortButton for field "Username"
    Then I verify that sort operation is done successfully for the column UserName

  Scenario: Verify the sort operation for the field role
    Given I'm in the User Page
    And I click on sortButton for field "Role"
    Then I verify that sort operation is done successfully for the column role

  Scenario: Verify the filter operation for the field firstName,lastName,userName and Role
    Given I'm in the User Page
    And I click on filterButton in the user page
    And I enter text "us" on firstName searchBox
    Then I verify that filter operation for text "us" is done successfully for the column firstName
    And I close search box in user page
    And I enter text "nqa" on lastName searchBox
    Then I verify that filter operation for text "na" is done successfully for the column lastName
    And I close search box in user page
    And I enter text "tE" on userName searchBox
    Then I verify that filter operation for text "tE" is done successfully for the column userName
    And I close search box in user page
    And I enter text "min" on role searchBox
    Then I verify that filter operation for text "min" is done successfully for the column role
    And I close search box in user page




