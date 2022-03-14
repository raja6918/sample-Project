@scenarios @templates @saveAsTemplate
Feature: Scenario - save existing Scenario as Template.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_base" is added
    And I'm logged in with default credentials.

  Scenario: Save as Template
    Given I select 'Save as Template' for Scenario "aut_scenario_base"
    When I fill out the form for the "aut_template_from_scenario" Template with category "Pairing" and  "Lorem ipsum dolor sit amet" as description
    And I click on the 'CREATE' button
    Then the snackbar message "Template aut_template_from_scenario has been created." for scenarios is displayed

  Scenario: Save as Template using existing Template name
    Given The template "aut_scenario_as_template" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I select 'Save as Template' for Scenario "aut_scenario_base"
    When I fill out the form for the "aut_scenario_as_template" Template with category "Pairing" and  "Lorem ipsum dolor sit amet" as description
    And I click on the 'CREATE' button
    Then the snackbar message "Another template with this name already exists. Please change the name and try again." for scenarios is displayed

    Scenario: Save as Template without name
    Given I select 'Save as Template' for Scenario "aut_scenario_base"
    When I fill out the form for the "" Template with category "Pairing" and  "Lorem ipsum dolor sit amet" as description
    Then the create button is not Active
