package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.user.User;
import com.adopt.altitude.automation.frontend.validations.ScenariosValidation;
import com.adopt.altitude.automation.frontend.validations.UserAdministrationValidation;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.fail;

/**
 * The Class UserAdministrationSteps.
 */
public class UserAdministrationSteps extends AbstractSteps implements En {

   private final static Logger          LOGGER = LogManager.getLogger(LoginSteps.class);

   @Autowired
   private ScenariosValidation          validator;

   @Autowired
   private UserAdministrationValidation userValidator;

   private User                         user   = new User();

   /**
    * Instantiates a new user administration steps.
    */
   public UserAdministrationSteps() {
      Given("^I open add new user form$", () -> {
         userValidator.verifyPageIsLoaded(userAdministrationPage);
         userAdministrationPage.openAddUserForm();
      });

      When("^I enter to User administration portal$", () -> {
         validator.verifyPageIsLoaded(scenariosPage);
         scenariosPage.openHamburgerMenu();
         scenariosPage.openUserAdministrationItem();
      });

      When("^I provide (.+) (.+) (.+) (.+) (.+) (.+) (.+) data in form$",
         (String firstname, String lastname, String username, String email, String password, String passwordconfirmation, String role) -> {
            user.setFirstname(firstname);
            user.setLastname(lastname);
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setConfirmedPassword(passwordconfirmation);
            user.setRole(role);
            userAdministrationPage.addUser(user);
         });

      When("^I modify the information (.+) (.+) (.+) (.+) for the user \"(.*)\"$",
         (String firstname, String lastname, String email, String role, String selectedUser) -> {
           // userAdministrationPage.displayOptions(selectedUser);
           // userAdministrationPage.editUser();
           userAdministrationPage.editUser(selectedUser);
            user.setFirstname(firstname);
            user.setLastname(lastname);
            user.setUsername(selectedUser);
            user.setEmail(email);
            user.setRole(role);
            userAdministrationPage.updateUser(user);
         });

      When("^I modify the username to \"(.+)\" for the user \"(.*)\"$", (String newUserName, String selectedUser) -> {
        // userAdministrationPage.displayOptions(selectedUser);
        userAdministrationPage.editUser(selectedUser);
        // userAdministrationPage.editUser();
         user.setUsername(newUserName);
         userAdministrationPage.updateUsername(user);
      });


      And("I save the changes", () -> {
         userAdministrationPage.saveChanges();
      });

      Then("The message \"(.*)\" is displayed$", (String message) -> {
         String currentMessage = userAdministrationPage.getErrorMessage();
         userValidator.verifyMessagesMatch(message, currentMessage);
      });
     Then("^ColorCode for No blank spaces should be changed to \"([^\"]*)\"$", (String ExpectedColor) -> {
       String color=ExpectedColor;
       System.out.println(userAdministrationPage.getColorCodeBeforeForNotBlankSpace());
       String afterColorCode = userAdministrationPage.getColorCodeAfterForNotBlankSpace();
       userValidator.verifyColorCode(color, afterColorCode);
     });
     Then("^ColorCode for Atleast Eight characters text should be visible in \"([^\"]*)\"$", (String ExpectedColor) -> {
       String color=ExpectedColor;
       System.out.println(userAdministrationPage.getColorCodeBeforeForAtleastEightCharacters());
       String afterColorCode = userAdministrationPage.getColorCodeAfterForAtLeastEightCharacters();
       userValidator.verifyColorCode(color, afterColorCode);
     });
     Then("^ColorCode for Lower and Uppercase letter text should be visible in  \"([^\"]*)\"$", (String ExpectedColor) -> {
       String color=ExpectedColor;
       System.out.println(userAdministrationPage.getColorCodeBeforeForLowerAndUppercase());
       String afterColorCode = userAdministrationPage.getColorCodeAfterForLowerAndUpperCase();
       userValidator.verifyColorCode(color, afterColorCode);
     });
     Then("^ColorCode for At least one number text should be visible in \"([^\"]*)\"$", (String ExpectedColor) -> {
       String color=ExpectedColor;
       System.out.println(userAdministrationPage.getColorCodeBeforeForAtLeastOneNumber());
       String afterColorCode = userAdministrationPage.getColorCodeAfterForLowerAndUpperCase();
       userValidator.verifyColorCode(color, afterColorCode);
     });


     When("^I enter new password as \"([^\"]*)\"$", (String password) -> {
         userAdministrationPage.displayOptions(user.getUsername());
         userAdministrationPage.editUser();
         userAdministrationPage.changePassword();

         User user = new User();
         user.setPassword(password);
         user.setConfirmedPassword(password);
         userAdministrationPage.changePassword(user);
      });

      When("^I delete the user \"(.*)\"$", (String username) -> {
       //  userAdministrationPage.displayOptions(username);
         userAdministrationPage.openDeleteUserForm(username);
         userAdministrationPage.deleteUser();
      });

     When("^I delete the user \"(.*)\".$", (String username) -> {
       username=UsersSteps.getUserName();
       userAdministrationPage.displayOptions(username);
       userAdministrationPage.openDeleteUserForm();
       userAdministrationPage.deleteUser();
     });


     Then("^User is added to list$", () -> {
         TimeUnit.SECONDS.sleep(2);
         List<String> usernames = userAdministrationPage.getUsernames();
         userValidator.verifyUserExistance(usernames, user.getUsername(), true);
      });

     Then("^I check User \"(.*)\"$", (String username) -> {
       TimeUnit.SECONDS.sleep(1);
       userAdministrationPage.checkUser(username);
     });

      Then("^The user is updated$", () -> {
         TimeUnit.SECONDS.sleep(2);
         List<String> names = userAdministrationPage.getNames();
         userValidator.verifyUserExistance(names, String.format("%s %s", user.getFirstname(), user.getLastname()), true);
      });
     Then("^The user details are updated for \"([^\"]*)\"$", (String Username) -> {
       TimeUnit.SECONDS.sleep(3);
       userAdministrationPage.clickFilterList();
       TimeUnit.SECONDS.sleep(1);
       List<String> names= Collections.singletonList(userAdministrationPage.EnterUserNameinSearchPlaceHolder(Username));
       TimeUnit.SECONDS.sleep(1);
       userValidator.verifyUserExistance(names, String.format("%s %s", user.getFirstname(), user.getLastname()), true);
     });

      Then("^User password is updated$", () -> {
         fail("Waiting for snackbar implementation!");
      });

      Then("^User \"(.*)\" is deleted from users list$", (String username) -> {
         TimeUnit.SECONDS.sleep(2);
         List<String> usernames = userAdministrationPage.getUsernames();
         userValidator.verifyUserExistance(usernames, username, false);
      });

      Then("^the snackbar message \"(.*)\" for users is displayed$", (String message) -> {
         String currentError = userAdministrationPage.getSnackbarErrorMessage();

         validator.verifyText(message, currentError);
      });

      After(new String[] { "@addUser" }, () -> {
       //  userAdministrationPage.displayOptions(user.getUsername());
        userAdministrationPage.openDeleteUserForm(user.getUsername());
        //userAdministrationPage.openDeleteUserForm();
         userAdministrationPage.deleteUser();
      });
   }
}
