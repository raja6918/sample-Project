package com.adopt.altitude.automation.frontend.steps;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.test.context.ContextConfiguration;

import cucumber.api.java8.En;

import java.util.concurrent.TimeUnit;

@ContextConfiguration("classpath:features/cucumber.xml")
public class LoginSteps extends AbstractSteps implements En {
   private final static Logger LOGGER = LogManager.getLogger(LoginSteps.class);

   public LoginSteps() {
      Given("^I open login page$", () -> {
         LOGGER.info("Open login page.");
         navigator.loadPage();
      });

      Given("^I'm logged in with default credentials.$", () -> {
         LOGGER.info("Loging in using default username and password.");
         loginPage.login(defaultUser.getUsername(), defaultUser.getPassword());
      });

     Given("^I'm logged with default SecondUser credentials.$", () -> {
       loginPage.login(defaultUser.getUsername(), defaultUser.getPassword());
       TimeUnit.SECONDS.sleep(2);
       rolesPage.goToRolesPage();
       TimeUnit.SECONDS.sleep(2);
       rolesPage.clickEditRoleButton(defaultUser.getSecondUserRole());
       rolesPage.turnOffAllPersmisson();
       rolesPage.clickToggleIcon("Dashboard");
       TimeUnit.SECONDS.sleep(2);
       rolesPage.clickToggleIcon("Scenarios");
       TimeUnit.SECONDS.sleep(1);
      // rolesPage.radioBtnOptions_permission("View and manage");
       rolesPage.clickToggleIcon("Templates");
       TimeUnit.SECONDS.sleep(1);
       rolesPage.radioBtnOptions_permission("View and manage");
       rolesPage.clickToggleIcon("Users");
       rolesPage.clickSaveBtn();
       scenariosPage.openUserMenu();
       TimeUnit.SECONDS.sleep(1);
       scenariosPage.signOut();
       TimeUnit.SECONDS.sleep(1);
       LOGGER.info("Loging in using default Another username and password.");
       loginPage.login(defaultUser.getSecondUsername(), defaultUser.getSecondPassword());
     });

      Given("^I login with user \"(.*)\"$", (String username) -> {
         loginPage.setUsername(username);
      });

      And("^I login with password \"(.*)\"$", (String password) -> {
         loginPage.setPassword(password);
      });

      When("^I click on login button$", () -> {
         loginPage.clickLogin();
      });

     Then("^Scenarios page is displayed$", () -> {
       TimeUnit.SECONDS.sleep(3);
       Boolean scenarioTitleDisplayed = scenariosPage.getScenarioHeaderTitle().isDisplayed();
       Assert.assertTrue(scenarioTitleDisplayed);
       LOGGER.info("Scenarios page is displayed");
     });

      When("^I login with username \"(.*)\" password \"(.*)\"$", (String username, String password) -> {
        loginPage.setUsername(username);
        loginPage.setPassword(password);
        loginPage.clickLogin();
      });

     When("^I login with username \"(.*)\" password \"(.*)\".$", (String username, String password) -> {

       String UNAME=UsersSteps.getUserName();
       loginPage.setUsername(UNAME);
       loginPage.setPassword(password);
       loginPage.clickLogin();

     });

   }
}
