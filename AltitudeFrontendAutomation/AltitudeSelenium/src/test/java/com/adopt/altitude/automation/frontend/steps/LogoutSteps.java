package com.adopt.altitude.automation.frontend.steps;


  import cucumber.api.java8.En;
  import org.apache.logging.log4j.LogManager;
  import org.apache.logging.log4j.Logger;

  import java.util.concurrent.TimeUnit;

public class LogoutSteps extends AbstractSteps implements En {

  private final static Logger LOGGER = LogManager.getLogger(LogoutSteps.class);

  public LogoutSteps() {
    And("^I log out$", () -> {
      TimeUnit.SECONDS.sleep(2);
      scenariosPage.openUserMenu();
      TimeUnit.SECONDS.sleep(2);
      scenariosPage.signOut();
      TimeUnit.SECONDS.sleep(3);
    });
  }
}
