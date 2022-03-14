@ErrorValidations @HttpErrorValidation
Feature: ErrorValidations.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1538" is added
    And I'm logged in with default credentials.

  Scenario: I want to return to the previous page when I hit an  404 error page
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1538"
    When 404 error occurs
    And click on return link " you can go back where you were."
    Then verify that I can return to the previous page where I before.

  Scenario: I want to return to the previous page when I hit an  500 error page
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1538"
    When 500 error occurs
    And click on return link " Just go back to where you were "
    Then verify that I can return to the previous page where I before.

  Scenario: I want to return to the previous page when I hit any other Error Codes other than 404 and 500.
    Given I'm in the Solver Page for scenario "aut_scenario_alt-1538"
    When 400 error occurs
    And click on return link " you can go back where you were."
    Then verify that I can return to the previous page where I before.
