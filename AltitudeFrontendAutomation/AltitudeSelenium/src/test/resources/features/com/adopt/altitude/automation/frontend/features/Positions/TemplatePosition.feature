@positions @templatesFlag
Feature: Positions in Template feature

  Background:
    Given The template "aut_template_alt-1120" with category "Pairing" description "automation" and source "Sierra UAT Template"
    And I open login page
    And I'm logged in with default credentials.
    And I'm in the templates page

  Scenario: I want verify the legend shows TEMPLATE in Positions
    Given I click on the 'Open' button for template "aut_template_alt-1120"
    When I open positions page
    Then The legend shows 'TEMPLATE' in the header section
