package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.util.AssertionErrors.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.crewBase.CrewBase;
import com.adopt.altitude.automation.frontend.pageobject.CrewBasesPage;

@Component
public class CrewBasesValidation {

   private final static Logger LOGGER = LogManager.getLogger(CrewBasesValidation.class);

   public void verifyPageIsLoaded(CrewBasesPage page) {
      assertNotNull(page);
      LOGGER.debug("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.debug("Validated Page is displayed");
   }

   public void verifyCrewBasesAreEqual(CrewBase expected, CrewBase actual) {
      assertEquals("Base Name is not the same", expected.getBaseName(), actual.getBaseName());
      assertEquals("Country is not the same", expected.getCountry(), actual.getCountry());
      assertEquals("Station is not the same", expected.getStation(), actual.getStation());
      LOGGER.info("Crew base added correctly");
   }
}
