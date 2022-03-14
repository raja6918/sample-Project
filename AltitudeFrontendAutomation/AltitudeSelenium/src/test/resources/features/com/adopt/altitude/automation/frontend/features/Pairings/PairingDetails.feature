#@data_management @pairing_details @wip
#Feature: Pairing - Details Page.

 # Background:
 #   Given I open login page
 #   And The Scenario "aut_scenario_alt-1935" is added for Jazz Template with Pairings
 #   And I'm logged in with default credentials.

  #Scenario: Application title bar is included, with all icons disabled (except for the bell icon) in a new tab in the browser
  #  Given I'm in the Pairing Page for scenario "aut_scenario_alt-1935"
   # When I Click on a pairing
    #Then I click on "Details" button
   # When I click on "open_in_new" button
   # Then I confirm that Application opens in new tab containing "pairing-details"
   # Then I verify that Application Title bar contains "SIERRA"
   # Then I verify that "notifications" bell icon is enabled
   # Then I verify that home button is disabled
   # And I verify user menu is disabled

  #Scenario: Reverts to the Pairings page, in the parent scenario tab
  #  Given I'm in the Pairing Page for scenario "aut_scenario_alt-1935"
  #  When I Click on a pairing
  #  Then I click on "Details" button
 #   When I click on "open_in_new" button
  #  Then I switch to parent tab
  #  Then I confirm that I am in Parent scenario tab containing "Pairings"
  #  Then I confirm that parent tab contains scenario "aut_scenario_alt-1935"

  #Scenario: It is possible to refresh the page
  #  Given I'm in the Pairing Page for scenario "aut_scenario_alt-1935"
  #  When I Click on a pairing
  #  Then I click on "Details" button
  #  When I click on "open_in_new" button
  #  Then I confirm that Application opens in new tab containing "pairing-details"
  #  Then I refresh the page and verify that "Pairing Details" is loaded correctly
  #  Then I verify that Application Title bar contains "SIERRA"

 # Scenario: Verify it is not possible to navigate to any other page in the application
 #   Given I'm in the Pairing Page for scenario "aut_scenario_alt-1935"
 #   When I Click on a pairing
 #   Then I click on "Details" button
 #   When I click on "open_in_new" tab button
 #   Then I confirm that Application opens in new tab containing "pairing-details"
 #   Then I confirm back navigation is disabled
 #   Then I confirm forward navigation is disabled

 # Scenario: The link "back to Pairing" and (black) background in the Details page is removed
 #   Given I'm in the Pairing Page for scenario "aut_scenario_alt-1935"
 #   When I Click on a pairing
 #   Then I click on "Details" button
 #   When I click on "open_in_new" tab button
 #   Then The link "Back to Pairing" in the Details page is removed
 #   Then I confirm that black background in the details page is removed
