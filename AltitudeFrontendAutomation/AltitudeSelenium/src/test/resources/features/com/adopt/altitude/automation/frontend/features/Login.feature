@login
Feature: Login.

Background:
	Given I open login page

  Scenario: Login
    Given I login with user "admin"
    And I login with password "Ibsadmin123"
    When I click on login button
    Then Scenarios page is displayed

