package com.adopt.altitude.automation.frontend.validations;

import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;

import com.adopt.altitude.automation.frontend.pageobject.AbstractPage;

/**
 * The Class Validation.
 */
public abstract class Validation {

   private final static Logger LOGGER = LogManager.getLogger(Validation.class);

   public void verifyPageIsLoaded(AbstractPage page) {
      assertNotNull(page);
      LOGGER.info("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.info("Validated Page is displayed");
   }

   /**
    * Verify text.
    *
    * @param expectedText the expected text
    * @param currentText the current text
    */
   public void verifyText(String expectedText, String currentText) {
      assertEquals(expectedText, currentText);

      LOGGER.info(String.format("Expected Text '%s' matches Current Text '%s'", expectedText, currentText));
   }

   public void verifyTextContains(String currentText, String expectedText) {
     Assert.assertTrue(currentText.contains(expectedText));

     LOGGER.info(String.format("Expected Text '%s' contains Current Text '%s'", expectedText, currentText));
   }

   public void verifyElementInList(List<String> list, String element, Boolean isInList) {
      assertNotNull(list);
      LOGGER.debug("List is not null");
      assertNotNull(element);
      LOGGER.debug("element is not null");
      if (isInList) {
         Assert.assertThat(list, hasItems(element));
         LOGGER.debug("element is in list");
      }
      else {
         assertThat(list, not(hasItems(element)));
         LOGGER.debug("element is not in list");
      }
   }

   public void verifyState(boolean expected, boolean actual) {
      assertEquals("The State is incorrect", expected, actual);
      LOGGER.info("The State is correct");
   }

}
