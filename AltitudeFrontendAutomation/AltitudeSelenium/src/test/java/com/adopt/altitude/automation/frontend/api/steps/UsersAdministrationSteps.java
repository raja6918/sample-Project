package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.adopt.altitude.automation.frontend.steps.UsersSteps;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.adopt.altitude.automation.backend.api.ClientBusinessException;
import com.adopt.altitude.automation.backend.api.users.User;
import com.adopt.altitude.automation.backend.api.users.UsersEndpoint;
import com.adopt.altitude.automation.frontend.pageobject.UserAdministrationPage;

import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;

/**
 * The Class UsersAdministrationSteps.
 */
public class UsersAdministrationSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(UsersAdministrationSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "(@editUser or @invalidInputs or @usersErrorHandling or @scenariosFlag) and not @deleteUser" };

   private List<User>            users;

   @Autowired
   private UsersEndpoint         userManagement;

   @Autowired
   @Lazy(true)
   protected UserAdministrationPage userAdministrationPage;

   /**
    * Instantiates a new users administration steps.
    */
   public UsersAdministrationSteps() {
      When("^The user \"(.*)\" with password \"(.*)\" is added as \"(.*)\" for \"(.*)\" \"(.*)\" \"(.*)\" \"(.*)\"$",
         (String userName, String password, String role, String firstName, String lastName, String email,String roleId) -> {
            LOGGER.info("=== Setting up {users} data ===");

            userManagement.setAuthenticationToken(apiLogin.getToken());
            User newUser = getUser(userName, password, role, firstName, lastName, email,roleId);
            users = userManagement.addUsers(Collections.singletonList(newUser));
         });

      After(CUCUMBER_TAGS, () -> {
         if (users != null && !users.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {users}"));

            userManagement.setAuthenticationToken(apiLogin.getToken());
            ArrayList<Integer> idList = users.stream().map(u -> u.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>()));
            userManagement.deleteUsers(idList);
         }

      });
   }

   /**
    * Create users
    *
    * @param userList The users to be added
    */
   @When("^The users with following values are added$")
   public void createMultipleUsers(@Transpose List<User> userList) throws Exception {
      LOGGER.info("=== Setting up {users} data ===");

      userManagement.setAuthenticationToken(apiLogin.getToken());
      List<User> newUsers = new ArrayList<User>();

      for (int i = 0; i < userList.size(); i++) {
         newUsers.add(getUser(userList.get(i).getUserName(),
            userList.get(i).getPassword(),
            userList.get(i).getRole(),
            userList.get(i).getFirstName(),
            userList.get(i).getLastName(),
            userList.get(i).getEmail(),
           userList.get(i).getRoleId()));

      }
      users = userManagement.addUsers(newUsers);
   }

   @And("^I delete user \"(.*)\" through backend$")
   public void deleteUser(String username) throws Exception {
//      TimeUnit.SECONDS.sleep(3);
      LOGGER.info("***** I delete user {} through backend *****", username);

      boolean isVisible = userAdministrationPage.isUsernameInTable(username);
      LOGGER.info("     -- user is visible {}", isVisible);
      if (isVisible) {
         User user = users.stream().filter(u -> u.getUserName().equals(username)).findFirst().orElseThrow();
         LOGGER.info("     -- user id {}", user.getId());
         LOGGER.info("     -- deleting user");
         userManagement.deleteUsers(new ArrayList<Integer>(Arrays.asList(user.getId())));
         LOGGER.info("     -- user deleted");
      }
      else {
         LOGGER.info("     -- user is not visible {}", isVisible);
         LOGGER.info("     -- exception {}", ClientBusinessException.class);
         throw new ClientBusinessException(400, "Username not found in the table");
      }
   }

  @And("^I delete user \"(.*)\" through backend.$")
  public void deleteUser1(String username) throws Exception {
//      TimeUnit.SECONDS.sleep(3);
    String UNAME= UsersSteps.getUserName();
  LOGGER.info("***** I delete user {} through backend *****", UNAME);

    boolean isVisible = userAdministrationPage.isUsernameInTable(UNAME);
    LOGGER.info("     -- user is visible {}", isVisible);
    if (isVisible) {
      User user = users.stream().filter(u -> u.getUserName().equals(UNAME)).findFirst().orElseThrow();
      LOGGER.info("     -- user id {}", user.getId());
      LOGGER.info("     -- deleting user");
      userManagement.deleteUsers(new ArrayList<Integer>(Arrays.asList(user.getId())));
      LOGGER.info("     -- user deleted");
    }
    else {
      LOGGER.info("     -- user is not visible {}", isVisible);
      LOGGER.info("     -- exception {}", ClientBusinessException.class);
      throw new ClientBusinessException(400, "Username not found in the table");
    }
  }
   /**
    * Gets the user.
    *
    * @param userName the user name
    * @param password the password
    * @param role the role
    * @param firstName the first name
    * @param lastName the last name
    * @param email the email
    * @return the user
    */
   private User getUser(String userName, String password, String role, String firstName, String lastName, String email,String roleId) {
      User newUser = new User();
      newUser.setFirstName(firstName);
      newUser.setLastName(lastName);
      newUser.setEmail(email);
      newUser.setUserName(userName);
      newUser.setPassword(password);
      newUser.setRole(role);
      newUser.setRoleId(roleId);

      return newUser;
   }


}
