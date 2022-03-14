package com.adopt.altitude.automation.frontend.pageobject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.adopt.altitude.automation.frontend.utils.BrowserDriver;

public abstract class AbstractPage implements PageObject {

   @Autowired
   @Lazy(true)
   private BrowserDriver driver;

   protected static Integer dataCount;

  protected static String dataCountForAccommodation;

  protected static String dataCountForCountries;

  protected static String dataCountForCurrency;

  protected static String dataCountForSation;

  protected static String dataCountForPosition;

  protected static String dataCountForOPFlight;

  protected static String dataCountForCommercialFlight;

  protected static String dataCountForRegion;

  protected static String dataCountForRule;


   public BrowserDriver getDriver() {
      return driver;
   }
}
