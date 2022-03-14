package com.adopt.altitude.automation.frontend.utils.browserdriver;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.utils.BrowserFactory;

@Component(value = "CHROME")
@Scope("prototype")
public class ChromeBrowserFactory extends BrowserFactory {

   @Value("${default.chromedriver}")
   private String CHROMEDRIVER;

   @Override
   public WebDriver getBrowser() {
      System.setProperty("webdriver.chrome.driver", getDriverPath(CHROMEDRIVER));
      ChromeOptions options = new ChromeOptions();
     options.addArguments("disable-infobars");
     options.addArguments("--start-maximized");
     options.addArguments("--disable-extensions");
     WebDriver driver = new ChromeDriver(options);

      addAllBrowserSetup(driver);
      /*
    // driver.manage().window().maximize();*/
      return driver;
   }

   @Override
   protected void addAllBrowserSetup(WebDriver driver) {
      setDefaultImplicitWait(driver);
   }

}
