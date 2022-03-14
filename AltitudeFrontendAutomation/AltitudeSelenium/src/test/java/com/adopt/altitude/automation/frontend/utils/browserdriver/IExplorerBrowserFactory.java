package com.adopt.altitude.automation.frontend.utils.browserdriver;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.utils.BrowserFactory;

@Component("IEXPLORER")
@Scope("prototype")
public class IExplorerBrowserFactory extends BrowserFactory {

   private static final Logger LOGGER = LogManager.getLogger(IExplorerBrowserFactory.class);

   @Value("${default.iedriver}")
   private String              IEDRIVER;

   @Override
   public WebDriver getBrowser() {
      System.setProperty("webdriver.ie.driver", getDriverPath(IEDRIVER));
      LOGGER.debug("Value of webdriver.ie.driver property: {}.", IEDRIVER);
      WebDriver driver;
      driver = new InternetExplorerDriver();
      addAllBrowserSetup(driver);
      return driver;
   }
}
