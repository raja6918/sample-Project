@templates
Feature: Template - Add, Edit, Delete.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario: I want to verify create template window.
    Given I'm in the templates page
    When I click on the 'Add' button
    Then the create template window opens up

  Scenario Outline: I want to add a new template
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list

    Examples:
      | sourceTemplate    | templateName     | category       | description |
      | Sierra UAT Template | aut_new_template | Pairing      | test        |

  Scenario Outline: I want to create a new template with only name
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    Then the create button is not Active

    Examples:
      | sourceTemplate | templateName         | category | description |
      |                | aut_template_alt-460 |          |             |

  Scenario Outline: I want to create a new template with only source template
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    Then the create button is not Active

    Examples:
      | sourceTemplate    | templateName | category | description |
      | Sierra UAT Template |              |          |             |

  Scenario Outline: I want to create template with only mandatory fields
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list

    Examples:
      | sourceTemplate      | templateName       | category | description |
      | Sierra UAT Template | aut_basic_template |          |             |

  Scenario: I want to cancel the creation of template
    Given I'm in the templates page
    And I click on the 'Add' button
    When I click on 'Cancel' button
    Then the create template window closes

  Scenario: I want to verify edit template window
    Given The template "aut_template_alt-493" with category "Pairing" description "automation" and source "Sierra UAT Template"
    And I'm in the templates page
    When I click on the 'Open' button for template "aut_template_alt-493"
    Then the data home page opens up

    @jenkin_failTest
  Scenario Outline: I want to update all template information
    Given The template "aut_template_alt-493" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    When I click on the 'Get Info' button for template "aut_template_alt-493"
    And I edit <templateName> <category> <description> in the form
    Then the changes are saved in the template

    Examples:
      | templateName             | category | description |
      | aut_template_493_updated | Pairing  | Pairing     |

  @edittemplate
  Scenario Outline: I want to remove mandatory template information
    Given The template "aut_template_alt-493" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    When I click on the 'Get Info' button for template "aut_template_alt-493"
    And I edit <templateName> <category> <description> in the form
    Then the save button is not Active

    Examples:
      | templateName | category | description |
      |              | Pairing  | template    |

  Scenario: I want to delete a template
    Given The template "aut_template_alt-493" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And I'm in the templates page
    When I click on the 'Delete' button for template "aut_template_alt-493"
    Then the template "aut_template_alt-493" is deleted from the list
