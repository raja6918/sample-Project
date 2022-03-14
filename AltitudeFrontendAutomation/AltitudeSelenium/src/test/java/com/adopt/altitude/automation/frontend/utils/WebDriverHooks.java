package com.adopt.altitude.automation.frontend.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import cucumber.api.Scenario;
import cucumber.api.java.After;
import cucumber.api.java.Before;

public class WebDriverHooks {

	private static final Logger LOGGER = LogManager.getLogger(WebDriverHooks.class);
	
	@Autowired
	private BrowserDriver driver;
	
	@Before(order = Integer.MAX_VALUE)
	public void loadWebDriver(Scenario scenario) {
      LOGGER.info("########## Test: {} ##########", scenario.getName());
      LOGGER.info("Initializing web driver");
      driver.init();
   }

	@After(order = Integer.MIN_VALUE)
	public void destroyWebDriver(Scenario scenario) {
		LOGGER.info("Closing web driver");
		if (scenario.isFailed()) {
		   scenario.embed(driver.getScreenShot(), "image/png");
		   driver.takeScreenShot(scenario.getName());
		}
		
		if (driver != null) {
		   driver.close();
		}
	}

}
