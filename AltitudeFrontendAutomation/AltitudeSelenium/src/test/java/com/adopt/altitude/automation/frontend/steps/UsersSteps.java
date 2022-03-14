package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.user.userDetails;
import cucumber.api.Transpose;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class UsersSteps extends AbstractSteps implements En {

  public static String UNAME;
  @Autowired
  private final static Logger LOGGER = LogManager.getLogger(UsersSteps.class);
   userDetails users = new userDetails();

  public UsersSteps() {
    Given("^I'm in the User Page for scenario \"([^\"]*)\"$", (String scenarioName) -> {
      TimeUnit.SECONDS.sleep(3);
    //  scenariosPage.openDataItem(scenarioName);
    //  TimeUnit.SECONDS.sleep(5);
      usersPage.goToUsersPage();
    });

    And("^I click on the Plus Button in User page$", () -> {
      TimeUnit.SECONDS.sleep(5);
      usersPage.clickPlusButton();
    });

    And("^I click on 'Add' Button in user page$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.addButtonClick();
    });

    Then("^verify that the 'Add' button is disabled in user page$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyAddButtonEnabled();
    });

    And("^I enter firstName \"([^\"]*)\"$", (String firstName) -> {
      usersPage.enterFirstName(firstName);
    });

    Then("^I verify with validation error message \"([^\"]*)\"$", (String errorMsg) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyValidationErrorMsg(errorMsg);
    });

    And("^I enter lastName \"([^\"]*)\"$", (String lastName) -> {
      usersPage.enterLastName(lastName);
    });

    And("^I enter userName \"([^\"]*)\"$", (String userName) -> {
      usersPage.enterUserName(userName);
    });

    And("^I enter email \"([^\"]*)\"$", (String email) -> {
      usersPage.enterEmail(email);
    });

    And("^I enter password \"([^\"]*)\"$", (String password) -> {
      usersPage.enterPassword(password);
    });

    And("^I enter re_password \"([^\"]*)\"$", (String re_password) -> {
      usersPage.enterRe_Password(re_password);
    });

    And("^I enter firstName having characters greater than (\\d+)$", (Integer arg0) -> {
      usersPage.enterFirstName(users.firstNameText);
    });

    Then("^validate max \"([^\"]*)\" character count allowed as (\\d+)$", (String fieldName,Integer MaxExpectedCount) -> {
      usersPage.getTextCount(fieldName,MaxExpectedCount);
    });

    And("^I enter lastName having characters greater than (\\d+)$", (Integer MaxExpectedCount) -> {
      usersPage.enterLastName(users.lastNameText);
    });

    And("^I enter userName having characters greater than (\\d+)$", (Integer MaxExpectedCount) -> {
      usersPage.enterUserName(users.userNameText);
    });

    And("^I enter email having characters greater than (\\d+)$", (Integer MaxExpectedCount) -> {
      usersPage.enterEmail(users.emailText);
    });

    And("^I enter password having characters greater than (\\d+)$", (Integer MaxExpectedCount) -> {
      usersPage.enterPassword(users.passwordText);
    });

    And("^I enter re_password having characters greater than (\\d+)$", (Integer MaxExpectedCount) -> {
      usersPage.enterRe_Password(users.re_passwordText);
    });

    And("^I click on Cancel Button in user page and verify cancel button working as expected$", () -> {
      String beforeCancelCount=usersPage.getUsersCount();
      TimeUnit.SECONDS.sleep(3);
      usersPage.cancelButtonClick();
      TimeUnit.SECONDS.sleep(2);
      String afterCancelCount=usersPage.getUsersCount();
      Assert.assertEquals(beforeCancelCount,afterCancelCount);
    });

    And("^I verify on clicking cancel button closes the pane$", () -> {
      TimeUnit.SECONDS.sleep(2);
      usersPage.verifyIsAddPaneDisplayed();
    });

    Then("^I verify the First Name and Last Name are displayed together in the header as \"([^\"]*)\"$", (String firstPlusLastNameExpected) -> {
      usersPage.getUserPaneHeaderName(firstPlusLastNameExpected);
    });

    Then("^I verify all values in the dropdown of role$", () -> {
      usersPage.verifyRoleDropDownValues();
    });

    Then("^I verify the validation error message if passwords didnt match as \"([^\"]*)\"$", (String errorMsg) -> {
      usersPage.IsPwdMatch(errorMsg); });

    And("^I verify the password validation criteria text$", () -> {
      usersPage.verifyPwdValidationText();
    });

    When("^I click on edit button for username \"([^\"]*)\"$", (String userName) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.clickEditUsersButton(userName);
    });

    And("^I update firstName with \"([^\"]*)\"$", (String newFirstName) -> {
      usersPage.updateFirstName(newFirstName);
      usersPage.clickSaveBtn();
    });

    And("^I update lastName with \"([^\"]*)\"$", (String newLastName) -> {
      usersPage.updateLastName(newLastName);
      usersPage.clickSaveBtn();
    });

    And("^I update userName with \"([^\"]*)\"$", (String newUserName) -> {
      usersPage.updateUserName(newUserName);
      usersPage.clickSaveBtn();
    });

    Then("^I verify that firstName updated successfully in the user table with new firstName \"([^\"]*)\"$", (String newFirstName) -> {
      usersPage.verifyUpdateFirstName(newFirstName);
    });

    Then("^I verify that lastName updated successfully in the user table with new lastName \"([^\"]*)\"$", (String newLastName) -> {
      usersPage.verifyUpdateLastName(newLastName);
    });

    Then("^I verify that userName updated successfully with new userName \"([^\"]*)\"$", (String newUserName) -> {
      usersPage.verifyUpdateUserName(newUserName);
    });

    And("^I update Role with \"([^\"]*)\"$", (String role) -> {
      usersPage.updateRole(role);
      TimeUnit.SECONDS.sleep(2);
      usersPage.clickSaveBtn();
      TimeUnit.SECONDS.sleep(4);
    });
    And("^I update Role with \"([^\"]*)\".$", (String role) -> {
      usersPage.updateRole(role);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^I verify that role updated successfully with new role \"([^\"]*)\"$", (String newRole) -> {
    usersPage.verifyUpdateRole(newRole);
    });

    Then("^I verify that role \"([^\"]*)\" updated successfully with new role \"([^\"]*)\"$", (String userName,String newRole) -> {
      usersPage.verifyUpdateRoleOnUserName(userName,newRole);
    });

    And("^I update email with \"([^\"]*)\"$", (String email) -> {
      usersPage.updateEmail(email);
      usersPage.clickSaveBtn();
      TimeUnit.SECONDS.sleep(3);
    });

    Then("^I verify that email updated successfully with new email \"([^\"]*)\"$", (String email) -> {
      usersPage.verifyUpdateEmail(email);});

    And("^I click checkbox change password$", () -> {
      TimeUnit.SECONDS.sleep(2);
      usersPage.changePWdCheckBx();
    });

    Then("^I verify password and re-password field appears$", () -> {
      TimeUnit.SECONDS.sleep(2);
      usersPage.passwordFieldIsPresent();
    });

    Then("^I verify password and re-password field disappears$", () -> {
      TimeUnit.SECONDS.sleep(2);
      usersPage.passwordFieldIsNotPresent();
    });

    And("^I click on Cancel Button in user page$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.cancelButtonClick();
    });

    Then("^verify cancel button working as expected with unchanged firstName \"([^\"]*)\",unchanged lastName \"([^\"]*)\", unchanged userName \"([^\"]*)\"$", (String firstName, String lastName, String userName) -> {
      usersPage.verifyUpdateFirstName(firstName);
      usersPage.verifyUpdateLastName(lastName);
      usersPage.verifyUpdateUserName(userName);
    });

    And("^I update firstName with \"([^\"]*)\", lastName with \"([^\"]*)\",userName with \"([^\"]*)\",email with \"([^\"]*)\", Role with \"([^\"]*)\"$", (String newFirstName, String newLastName, String newUserName, String email, String role) -> {
      usersPage.updateFirstName(newFirstName);
      usersPage.updateLastName(newLastName);
     // usersPage.updateUserName(newUserName);
      usersPage.updateEmail(email);
      usersPage.updateRole(role);
    });

    And("^I click save button$", () -> {
      usersPage.clickSaveBtn();
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I clear data from field \"([^\"]*)\"$", (String fieldName) -> {
      usersPage.clearTextField(fieldName);
    });

    Then("^verify that the save button is disabled$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.saveButtonIsDisabled();
    });

    Then("^verify that the save button is enabled$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.saveButtonIsEnabled();
    });

    When("^I click on username \"([^\"]*)\"$", (String userName) -> {
      usersPage.clickUserNameFromTable(userName);
    });

    Given("^I'm in the User Page$", () -> {
      TimeUnit.SECONDS.sleep(5);
      usersPage.goToUsersPage();
    });

    And("^Verify that the columns firstName,LastName,userName and Role are included in the table$", () -> {
      usersPage.verifyColumnHeaders();
    });

    And("^I take count of users in the user table$", () -> {
      usersPage.usersCountfromTable();
    });

    Then("^I verify the total number of users is displayed at the bottom of table$", () -> {
      usersPage.UsersCountFromFooter();
    });

    And("^I take count of users in the user table again$", () -> {
      usersPage.usersCountfromTableAfterLogOut();
    });

    And("^I click on sortButton for field \"([^\"]*)\"$", (String fieldName) -> {
      usersPage.sortArrowButton(fieldName);
    });

    Then("^I verify that sort operation is done successfully for the column lastName$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifySortLastName();
    });

    Then("^I verify that sort operation is done successfully for the column FirstName$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifySortFirstName();
    });

    Then("^I verify that sort operation is done successfully for the column UserName$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifySortUserName();
    });

    Then("^I verify that sort operation is done successfully for the column role$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifySortRole();
    });

    And("^I click on filterButton in the user page$", () -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.filterButton();
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column role$", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyFilterRole(searchText);
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column firstName$", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyFilterFirstName(searchText);
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column lastName$", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyFilterLastName(searchText);
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column userName$", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.verifyFilterUserName(searchText);
    });

    And("^I enter text \"([^\"]*)\" on firstName searchBox$", (String textToSearch) -> {
      usersPage.EnterText_firstNameSearchBox(textToSearch);
    });

    And("^I enter text \"([^\"]*)\" on lastName searchBox$", (String textToSearch) -> {
      usersPage.EnterText_lastNameSearchBox(textToSearch);
    });

    And("^I enter text \"([^\"]*)\" on userName searchBox$", (String textToSearch) -> {
      usersPage.EnterText_userNameSearchBox(textToSearch);
    });

    And("^I enter text \"([^\"]*)\" on role searchBox$", (String textToSearch) -> {
      usersPage.EnterText_RoleSearchBox(textToSearch);
    });

    And("^I close search box in user page$", () -> {
      usersPage.clickCloseSearchBox();
    });

    And("^I click on delete for user \"([^\"]*)\"$", (String userName) -> {
      TimeUnit.SECONDS.sleep(3);
      usersPage.usersCountfromTable();
      usersPage.clickDeleteUsersButton(userName);
    });
    And("^I click on delete for user \"([^\"]*)\".$", (String userName) -> {
      TimeUnit.SECONDS.sleep(3);
      userName= UsersSteps.getUserName();
      usersPage.usersCountfromTable();
      usersPage.clickDeleteUsersButton(userName);
    });

    And("^I cancel the delete operation in the user page$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.clickCancelButton();
    });

    Then("^verify that no user deletion occurs and user \"([^\"]*)\" still exist\\.$", (String arg0) -> {
      usersPage.verifyNoDeletionOccurs();
    });

    And("^I confirm delete operation  in the user page$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.clickDeleteConfirmationButton();
    });

    Then("^verify that the 'Plus' button is enabled in user page$", () -> {
      TimeUnit.SECONDS.sleep(1);
      usersPage.clickAPlusButtonIsEnabled();
    });
    Then("^UserName filed is present in disable state$", () -> {
      usersPage.VerifyuserNameField();
    });
  }

  @When("^I provide the following data in the form user$")
  public void createUser(@Transpose List<userDetails> user) throws InterruptedException {
    userDetails request = user.get(0);
    String userName = request.getUserName();
    users.setUserName(userName);
    usersPage.fillOutAddSolverRequestForm(request);
  }

  @Then("^verify successfully that user added with message \"([^\"]*)\"$")
  public void verifyUserCreated(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = usersPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @Then("^verify that user deleted successfully with message \"([^\"]*)\"$")
  public void verifyDeleteCreated(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = usersPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }


 @When("^I provide the following data in the form user.$")
 public void createUser1(@Transpose List<userDetails> user) throws InterruptedException {
   userDetails request = user.get(0);
   String userName = request.getUserName();
   String usernamefinal=userName+randomString();
   users.setUserName(usernamefinal);
   String email=request.getEmail();
   String mail=randomString().toString();
   String finalemail=email+mail;
   users.setEmail(finalemail);
   UNAME= usernamefinal;
   request.setUserName(usernamefinal);
   request.setEmail(finalemail);

   usersPage.fillOutAddSolverRequestForm1(request);

 }
 public static String getUserName(){
   return UNAME;
 }

  public static String randomString(){
    String generateString= RandomStringUtils.randomAlphabetic(2);
    return generateString;
  }




}
