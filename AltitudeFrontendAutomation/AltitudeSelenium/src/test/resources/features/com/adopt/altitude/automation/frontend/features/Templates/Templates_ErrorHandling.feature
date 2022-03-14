@templates @templatesErrorHandling
Feature: Template - Error Handling.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: I want to Add a Template with an existing name.
    Given The template "aut_template_error_handling" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    When I add a new Template as "aut_template_error_handling" with category "Pairing", description "Test" and source "Sierra UAT Template"
    Then the snackbar message "Another template with this name already exists. Please change the name and try again." for templates is displayed

  Scenario: I want to Delete an Opened Template.
    Given I'm in the templates page
    And I add a new Template as "aut_template_error_handling" with category "Pairing", description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    When I click on the 'Delete' button for template "aut_template_error_handling"
    Then the snackbar message "Can't delete an open template. Please close the template and try again." for templates is displayed

  Scenario: I want to Delete an already Deleted Template.
    Given The template "aut_template_error_handling" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    And the "aut_template_error_handling" template is deleted through backend
    When I click on the 'Delete' button for template "aut_template_error_handling"
    Then the snackbar message "Template aut_template_error_handling can't be found. It may have been deleted by someone else." for templates is displayed
