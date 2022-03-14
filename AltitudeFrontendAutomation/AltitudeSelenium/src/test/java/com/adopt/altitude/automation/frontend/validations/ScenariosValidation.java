package com.adopt.altitude.automation.frontend.validations;

import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.stereotype.Component;

@Component
public class ScenariosValidation extends Validation {
   private final static Logger LOGGER = LogManager.getLogger(ScenariosValidation.class);

   public void verifyMenuItems(List<String> expectedItems, List<String> actualItems) {
      assertNotNull(expectedItems);
      assertNotNull(actualItems);
      assertEquals(expectedItems, actualItems);
   }

   public void verifyScenariosBelongsToUser(List<String> scenariosOwners, String user, Boolean isNameInTable) {
      assertNotNull(scenariosOwners);
      assertNotNull(user);
      if (isNameInTable) {
         Assert.assertThat(scenariosOwners, hasItems(user));
      }
      else {
         Assert.assertThat(scenariosOwners, not(hasItems(user)));
      }
   }

   public void verifyScenarioExists(List<String> scenarios, String scenarioName) {
      assertNotNull(scenarios);
      LOGGER.debug("List of Scenarios is not null");
      assertNotNull(scenarioName);
      LOGGER.debug("Scenario name is not null");
      Assert.assertThat(scenarios, hasItems(scenarioName));
      LOGGER.debug("Scenario is in the list");
   }

   public void validateViewOnlyInfoDialog(boolean isReadOnly) {
     Assert.assertTrue(isReadOnly);
   }
}
