package com.adopt.altitude.automation.frontend.api.steps;

import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class LoginSteps extends AbstractApiSteps implements En {

  private static final Logger LOGGER        = LogManager.getLogger(LoginSteps.class);

  public LoginSteps() {
    Given("^I login with username \"(.*)\" password \"(.*)\" through backend$", (String username, String password) -> {
      userId = null;
      apiLogin.currentToken = null;
      apiLogin.login(username, password);
    });
  }
}
