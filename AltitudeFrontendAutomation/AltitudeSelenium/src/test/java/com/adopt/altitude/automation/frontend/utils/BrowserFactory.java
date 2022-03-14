package com.adopt.altitude.automation.frontend.utils;

import java.awt.Toolkit;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.springframework.beans.factory.annotation.Value;

public abstract class BrowserFactory {

   @Value("${default.driver.linux.path}")
   private String LINUX_PATH;
   @Value("${default.driver.windows.path}")
   private String WINDOWS_PATH;

   public abstract WebDriver getBrowser();

   protected void addAllBrowserSetup(WebDriver driver) {
      setDefaultImplicitWait(driver);
      /*driver.manage().window().setPosition(new Point(0, 0));
      java.awt.Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
      Dimension dim = new Dimension((int)screenSize.getWidth(), (int)screenSize.getHeight());
      driver.manage().window().setSize(dim);*/
     driver.manage().window().maximize();
   }

   protected void setDefaultImplicitWait(WebDriver driver) {
/*
     //     driver.manage().window().setPosition(new Point(0, 0));
//     driver.manage().window().setSize(new Dimension(1920, 1080));
     //driver.manage().window().maximize();
*/
   //  driver.manage().window().setSize(new Dimension(1920, 1080));
     driver.manage().timeouts().implicitlyWait(15, TimeUnit.SECONDS);
   }

   protected String getDriverPath(String driverPath) {
      String so = System.getProperty("os.name").toLowerCase();

      if (so.contains("windows")) {
         return WINDOWS_PATH.concat(driverPath).concat(".exe");
      }

      return LINUX_PATH.concat(driverPath);
   }
}
