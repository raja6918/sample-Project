package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.util.AssertionErrors.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.country.Country;
import com.adopt.altitude.automation.frontend.pageobject.CountriesPage;

@Component
public class CountriesValidation extends Validation {

   private final static Logger LOGGER = LogManager.getLogger(CountriesValidation.class);

   public void verifyPageIsLoaded(CountriesPage page) {
      assertNotNull(page);
      LOGGER.debug("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.debug("Validated Page is displayed");
   }

   public void verifyCountryExistance(Boolean country, Boolean isNameInList) {
      assertNotNull(country);

      LOGGER.debug("List of countries are not null");
      if (isNameInList) {
         Assert.assertTrue(country);
         LOGGER.debug("Country is in list");
      }
      else {
         Assert.assertFalse(country);
         LOGGER.debug("Country is not in list");
      }
   }

   public void verifyCountriesAreEqual(Country expected, Country actual) {
      assertEquals("Country code is not the same", expected.getCountryCode(), actual.getCountryCode());
      assertEquals("Country name is not the same", expected.getCountryName(), actual.getCountryName());
      assertEquals("Country currency is not the same", expected.getCurrency(), actual.getCurrency());
      LOGGER.info("Country edited correctly");
   }
}
