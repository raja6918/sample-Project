package com.adopt.altitude.automation.frontend.utils.browserdriver;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.edge.EdgeDriver;

import com.adopt.altitude.automation.frontend.utils.BrowserFactory;

public class EdgeBrowserFactory extends BrowserFactory {
   
   @Override
   public WebDriver getBrowser() {
      WebDriver driver;
      driver = new EdgeDriver();
      addAllBrowserSetup(driver);
      return driver;
   }

}
