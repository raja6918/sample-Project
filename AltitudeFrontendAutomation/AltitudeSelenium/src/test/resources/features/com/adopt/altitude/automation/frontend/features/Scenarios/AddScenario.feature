@scenarios
Feature: Scenario - Create.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  @addScenario
  Scenario: I want to Add a new Scenario with default values.
    Given I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-206" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page

  @addScenario
  Scenario: I want to validate Scenario Duration range in Data Home Page
    Given I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-206" starting on "October-1-2021" with a duration of "30" days and selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    And the date range message "From October 1st 2021 to October 30th 2021 (30 days)" is displayed in the Data Home page

  Scenario: I want to validate the Scenario duration limit
    Given I click on the Add Scenario button
    And I select the template "Sierra UAT Template"
    When I set duration to "367" days
    Then The Error message "The duration of a scenario cannot exceed 366 days" is displayed

  Scenario: I want to validate Default Start Date value
    Given I click on the Add Scenario button
    When I select the template "Sierra UAT Template"
    Then The Start Date is today

  Scenario: I want to validate Scenario Duration range
    Given I click on the Add Scenario button
    When I select the template "Sierra UAT Template"
    When i Set the start date as "January-17-2022"
    Then The date range is computed correctly for the following durations:
      | 5   |
      | 18  |
      | 30  |
      | 60  |
      | 120 |
      | 240 |
      | 366 |
