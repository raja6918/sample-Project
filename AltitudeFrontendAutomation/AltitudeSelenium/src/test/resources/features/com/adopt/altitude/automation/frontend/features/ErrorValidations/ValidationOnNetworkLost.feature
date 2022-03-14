@data_management @ErrorValidations @NetworkLostValidation
Feature: InternetLoss - Validation.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2175" is added
    And I'm logged in with default credentials.

  Scenario: When network connection is lost.
    Given Regions page for scenario "aut_scenario_alt-2175" is displayed
    When I fill the region "aut_region" with code "AUT" for adding a region
    Then I turn network to Offline mode
    Then verify with message "No internet connection" and "You don’t seem to be connected to the internet. To continue working in Sierra, please check your network settings."

  Scenario: When network connection is re-established.
    Given Regions page for scenario "aut_scenario_alt-2175" is displayed
    When I fill the region "aut_region" with code "AUT" for adding a region
    Then I turn network to Offline mode
    Then I turn network to Online mode
    Then verify that data loss is happens on currently doing things prior to the network disruption.

  @demo_Solver
  Scenario: I want to verify the alert count is updated with the notifications that were generated while the internet was down
    Given I'm in the Solver Page for scenario "aut_scenario_alt-2175"
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver_Request    |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots            |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    And I clear notification
    When I click on launch button for solver request "AUT_Solver_Request"
    Then I turn network to Offline mode
    Then I turn network to Online mode
    Then verify the alert count is updated with the notifications for scenario "aut_scenario_alt-2175" with message "Solver request AUT_Solver_Request completed successfully!"
