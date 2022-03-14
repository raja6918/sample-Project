package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.crewGroups.CrewGroups;

/**
 * The Class AccommodationsValidation.
 */
@Component
public class CrewGroupsValidation extends Validation {

   /** The Constant LOGGER. */
   private final static Logger LOGGER = LogManager.getLogger(CrewGroupsValidation.class);

   /**
    * Verify accommodations are equals.
    *
    * @param expected the expected
    * @param actual the actual
    */
   public void verifyCrewGroupsAreEquals(CrewGroups expected, CrewGroups actual) {
      assertEquals("Crew Group Name is not the same", expected.getName(), actual.getName());
      assertEquals("Crew Group Position is not the same", expected.getPosition(), actual.getPosition());
      assertEquals("Crew Group Airline is not the same", expected.getAirlines(), actual.getAirlines());

      LOGGER.info("Crew Group match correctly");
   }
}
