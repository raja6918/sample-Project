package com.adopt.altitude.automation.frontend.api.steps;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.adopt.altitude.automation.backend.api.ClientException;

import cucumber.api.java.Before;

public class ApiHooks extends AbstractApiSteps {

   private static final Logger LOGGER = LogManager.getLogger(ApiHooks.class);

   @Before(order = Integer.MIN_VALUE)
   public void performLogin() throws ClientException {
      LOGGER.info(String.format("Setting up API Token"));

      apiLogin.login(getDefaultUsername(), getDefaultPassword());
   }

}
