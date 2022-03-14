package com.adopt.altitude.automation.frontend.validations;

import com.adopt.altitude.automation.frontend.pageobject.DataHomePage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;


@Component
public class ImportValidation extends Validation {

   private final static Logger LOGGER = LogManager.getLogger(ImportValidation.class);

   public void verifyPageIsLoaded(DataHomePage page) {
      assertNotNull(page);
      LOGGER.debug("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.debug("Validated Page is displayed");
   }

}
