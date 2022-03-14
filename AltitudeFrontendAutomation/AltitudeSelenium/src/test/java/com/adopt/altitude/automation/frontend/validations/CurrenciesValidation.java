package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.currency.Currency;
import com.adopt.altitude.automation.frontend.pageobject.CurrenciesPage;

@Component
public class CurrenciesValidation extends Validation {
   private final static Logger LOGGER = LogManager.getLogger(CurrenciesValidation.class);

   public void verifyPageIsLoaded(CurrenciesPage page) {
      assertNotNull(page);
      LOGGER.info("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.info("Validated Page is displayed");
   }

   public void verifyCurrenciesAreEquals(Currency expected, Currency actual) {
      assertEquals("Currency code is not the same", expected.getCode(), actual.getCode());
      assertEquals("Currency name is not the same", expected.getName(), actual.getName());
      assertEquals("Currency exchange rate is not the same", expected.getExchangeRate(), actual.getExchangeRate());
      LOGGER.info("Currency added correctly");
   }
}
