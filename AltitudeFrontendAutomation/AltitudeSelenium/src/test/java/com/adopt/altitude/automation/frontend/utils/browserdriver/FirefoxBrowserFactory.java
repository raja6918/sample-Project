package com.adopt.altitude.automation.frontend.utils.browserdriver;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.utils.BrowserFactory;

@Component(value = "FIREFOX")
@Scope("prototype")
public class FirefoxBrowserFactory extends BrowserFactory {

   @Value("${default.firefoxdriver}")
   private String FIREFOXDRIVER;

   @Override
   public WebDriver getBrowser() {
      FirefoxOptions firefoxOptions = new FirefoxOptions();

      System.setProperty("webdriver.gecko.driver", getDriverPath(FIREFOXDRIVER));
      firefoxOptions.setCapability("marionette", true);
      firefoxOptions.setCapability("acceptInsecureCerts", true);
      
      WebDriver driver = new FirefoxDriver(firefoxOptions);
      driver.manage().window().maximize();
      
      return driver;
   }
}