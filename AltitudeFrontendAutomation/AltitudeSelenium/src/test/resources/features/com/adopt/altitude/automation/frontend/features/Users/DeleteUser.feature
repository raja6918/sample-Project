@data_management @users @DeleteUser
Feature: User - Delete.

  Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2471" is added
    And I'm logged in with default credentials.

  Scenario: Verify that canceling delete operation for user is working as expected
    Given I'm in the User Page
  #  When I click on the Plus Button in User page
  #  And I provide the following data in the form user.
   #   | First Name    | SampleUser1             |
   #   | Last Name     | Automation1             |
   #   | User Name     | SampleUserAut1         |
   #   | Email         | Aut989@ibsplc.com      |
   #   | password      | Qwerty@123             |
    #  | Re Password   | Qwerty@123             |
    #  | Role          | Administrator          |
   # And I click on 'Add' Button in user page
    And I click on delete for user "AutUserThree_DoNotDelete"
    And I cancel the delete operation in the user page
    Then verify that no user deletion occurs and user "AutUserThree_DoNotDelete" still exist.

  #Scenario: Verify that the delete operation for user is working as expected
  #  Given I'm in the User Page
  #  And I click on delete for user "SampleUserAut1"
  #  And I confirm delete operation  in the user page
  #  Then verify that user deleted successfully with message "User SampleUser1 Automation1 has been successfully deleted."
