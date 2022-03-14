@templates @scenariosFlag
Feature: Template - Status

  Background:
    Given I open login page
    And The template "aut_template_alt-1011" with category "Pairing" description "Test" and source "Sierra UAT Template"
    And The template "aut_template_alt-1011" is opened through backend
   # And The users with following values are added
    #  | First Name | User               |
    #  | Last Name  | Automation         |
     # | User Name  | aut_user           |
     # | Email      | aut@konos-test.com |
     # | Password   | Password1          |
     # | Role       | Administrator      |

  Scenario: I want verify the read only icon for template
    Given I'm logged with default SecondUser credentials.
    When I'm in the templates page
    Then The template "aut_template_alt-1011" shows in ReadOnly mode

  Scenario: I want verify the read only warning for template
    Given I'm logged with default SecondUser credentials.
    And  I'm in the templates page
    When I open the template "aut_template_alt-1011"
    Then The View Only mode information dialog for template shows up

  Scenario: I want verify the legend shows View Only for template
    Given I'm logged with default SecondUser credentials.
    And  I'm in the templates page
    And I open the template "aut_template_alt-1011"
    When I click 'Open' button on the template View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the template name
