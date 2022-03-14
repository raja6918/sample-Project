@compare_solver_result @data_management
Feature: Solver Request - Compare Solver Result.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-1545" is added
    And The currencies with following values are added
      | Name          | aut_currency |
      | Code          | AUT          |
      | Exchange Rate |          1.0 |
    And The countries with following values are added
      | Name          | aut_country |
      | Code          | ZZ          |
      | Currency Code | AUT         |
    And The region "aut_region" with code "AUT" is added
    And The default stations with following values are added
      | Code         | AUT         |
      | Name         | aut_station |
      | Country Code | ZZ          |
    And I'm logged in with default credentials.
    When I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-1545"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully


  Scenario: Verify statistics table contents
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    Then I confirm that at position "1" the statistics value is "Total (real) cost"
    Then I confirm that at position "2" the statistics value is "Salaries cost"
    Then I confirm that at position "3" the statistics value is "Accommodations cost"
    Then I confirm that at position "4" the statistics value is "Pairings (occurrences)"
    Then I confirm that at position "5" the statistics value is "Pairing patterns"
    Then I confirm that at position "6" the statistics value is "Block hours"
    Then I confirm that at position "7" the statistics value is "Duty days"
    Then I confirm that at position "8" the statistics value is "Average block per duty day"
    Then I confirm that at position "9" the statistics value is "Duty periods"
    Then I confirm that at position "10" the statistics value is "Aircraft changes"
    Then I confirm that at position "11" the statistics value is "Time away from base"

  Scenario: When no solver requests are selected, the view reverts to solver detail mode
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    And I deselect Solver Request
    #Then I see view reverts to solver detail mode saying "No solver request has been selected"
    Then I see view reverts to solver detail mode

  Scenario: Remove statistic (row) from the table
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    Then I should be able to delete statistic from the table

  Scenario: Verify Combo-box of each row are listed in alphabetical order
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    Then I should be able to delete statistic from the table
    And I verify statistic types displayed in the combo-box of each row are listed in alphabetical order

  Scenario: Add a statistic (row) to the table
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    And I add static row data "Duty hours"
    And I add static row data "Percent 1-day pairings"
    And I add static row data "OAL deadheads cost"
    And I add static row data "Average block per duty period"
    And I add static row data "Internal deadheads"
    And I add static row data "Number of 3-day pairings"
    And I add static row data "Percent 5-or-more-day pairings"

  Scenario: Once a statistic type is selected in the table, it is removed from the list of available statistics
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I click on Compare
    Then I confirm that at position "11" the statistics value is "Time away from base"
    And I add same static row data "Time away from base" and get Message "No results found"

  Scenario: Add a new crewbase, launch Solver and verify columns for new crewbase is filled with two dashes "–"
    Given I go to crewBase page
    When I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT               |
      | Base Name | aut_crewbase      |
      | Country   | aut_country, ZZ   |
      | Station   | AUT - aut_station |
    Then a new crew base is added to list
    And I go to solver page now
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver1           |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver1"
    Then Verify successfully launch the Solver Request "AUT_Solver1" with message "Completed successfully" for Daily
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I select "AUT_Solver1" as solver name
    Then I click on Compare
    #And I select crew group as "AUT"
    #Then I Verify that added crewgroup value has data as "--"

  Scenario: Columns are added/removed dynamically as solver requests are selected/de-selected in the left-pane
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver1           |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver1"
    Then Verify successfully launch the Solver Request "AUT_Solver1" with message "Completed successfully" for Daily
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I select "AUT_Solver1" as solver name
    Then I click on Compare
    Then I confirm the columns "Test_Solver1", "AUT_Solver1" are added
    And I click on 'Filter' for Solver
    And Now I deselect "AUT_Solver1" as solver name
    Then I confirm the columns "AUT_Solver1" is removed

  Scenario: View values for each selected solver request in the table columns
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver1           |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver1"
    Then Verify successfully launch the Solver Request "AUT_Solver1" with message "Completed successfully" for Daily
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I select "AUT_Solver1" as solver name
    Then I click on Compare
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1"

  Scenario: Table are compared with crewbase values
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver1           |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver1"
    Then Verify successfully launch the Solver Request "AUT_Solver1" with message "Completed successfully" for Daily
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I select "AUT_Solver1" as solver name
    Then I click on Compare
    And I select crew group as "YUL"
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "YUL"
    And I select crew group as "YVR"
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "YVR"
    And I select crew group as "YYC"
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "YYC"
    And I select crew group as "YYZ"
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "YYZ"
    #And I select crew group as "AUT"
    #Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "AUT"
    And I select crew group as "All crew bases"
    Then I can view value of solver "AUT_Solver1" and "Test_Solver1" for crewbase "All crew bases"

  Scenario: When the selected statistic for a row is changed, all the values in the corresponding row are changed
    Given I go to solver page
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | AUT_Solver1           |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "AUT_Solver1"
    Then Verify successfully launch the Solver Request "AUT_Solver1" with message "Completed successfully" for Daily
    When I click on the 'Add' Solver Request
    And I provide the following data in the form Solver Request
      | Request Name   | Test_Solver1          |
      | Solver Task    | Build Pairings        |
      | Crew Group     | Combo Pilots          |
      | Rules          | baseline              |
      | Recipe         | Arg                   |
    And I click on 'Add' Button
    When I click on launch button for solver request "Test_Solver1"
    Then Verify successfully launch the Solver Request "Test_Solver1" with message "Completed successfully" for Daily
    And I click on 'Filter' for Solver
    Then I select "Test_Solver1" as solver name
    Then I select "AUT_Solver1" as solver name
    Then I click on Compare
    And I click on statistics value "Total (real) cost" and change to "Duty hours" and verify all the values in the corresponding row are changed
