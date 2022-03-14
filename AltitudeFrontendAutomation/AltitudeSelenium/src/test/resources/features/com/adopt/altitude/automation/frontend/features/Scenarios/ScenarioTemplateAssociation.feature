@ScenarioTemplateAssociation @data_management
Feature: Scenario - Template Association.
  # commenting the jazz related since we have only one template (Sierra UAT Template ) avaialble
  Scenario: I want to know the template associated with Scenario.
    Given I open login page
    And The Scenario "aut_scenario_sierra-1936" is added
   # And The Scenario "aut_scenario_sierra-1936.1" is added for Jazz Template with Pairings
    And I'm logged in with default credentials.
    Given I open the Scenario Info drawer for Scenario "aut_scenario_sierra-1936"
    Then I verify the reference data is "Sierra UAT Template (template)"
    Then I click on Cancel button for Get Info
   # Given I open the Scenario Info drawer for Scenario "aut_scenario_sierra-1936.1"
   # Then I verify the reference data is "Jazz Template with Pairings (template)"
   # Then I click on Cancel button for Get Info

  Scenario Outline: I want to know the template associated with Scenario (negative case)
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list
    Then I go to scenario page
    Then I click on the Add Scenario button
    When I create the Scenario "aut_scenario_sierra-1936.2" with default values selecting the "aut_new_template" template
    Then The Scenario is open in the Data Home page
    Then I go to scenario page
    And I open the Scenario Info drawer for Scenario "aut_scenario_sierra-1936.2"
    Then I verify the reference data is "aut_new_template (template)"
    Then I click on Cancel button for Get Info
    And I go to template page
    When I click on the 'Delete' button for template "aut_new_template"
    Then the template "aut_new_template" is deleted from the list
    Then I go to scenario page
    And I open the Scenario Info drawer for Scenario "aut_scenario_sierra-1936.2"
    Then I verify the reference data is "Deleted template"


    Examples:
      | sourceTemplate      | templateName     | category | description |
      | Sierra UAT Template | aut_new_template |       | test        |


