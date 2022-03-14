package com.adopt.altitude.automation.frontend.validations;

import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.pageobject.UserAdministrationPage;

@Component
public class UserAdministrationValidation {
   private final static Logger LOGGER = LogManager.getLogger(UserAdministrationValidation.class);

   public void verifyPageIsLoaded(UserAdministrationPage page) {
      assertNotNull(page);
      LOGGER.debug("Validated Page is not null");
      assertTrue(page.isPageDisplayed());
      LOGGER.debug("Validated Page is displayed");
   }

   public void verifyUserExistance(List<String> usernames, String user, Boolean isNameInList) {
      assertNotNull(usernames);
      LOGGER.debug("List of usernames are not null");
      assertNotNull(user);
      LOGGER.debug("user is not null");
      assertFalse(user.isBlank());
      LOGGER.debug("user is not blank");

      if (isNameInList) {
         Assert.assertThat(usernames, hasItems(user));
         LOGGER.debug("User is in list");
      }
      else {
         assertThat(usernames, not(hasItems(user)));
         LOGGER.debug("User is not in list");
      }
   }

   public void verifyMessagesMatch(String expectedMessage, String currentMessage) {
      assertEquals(expectedMessage, currentMessage);
      LOGGER.debug("Validated Error Message");
   }
  public void verifyColorCode(String ExpectedColor, String ActualColor) {
    assertEquals(ExpectedColor,ActualColor);
  }
}
