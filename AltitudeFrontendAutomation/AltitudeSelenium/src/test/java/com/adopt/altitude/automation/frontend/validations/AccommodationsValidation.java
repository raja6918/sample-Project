package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.accommodation.Accommodation;

/**
 * The Class AccommodationsValidation.
 */
@Component
public class AccommodationsValidation extends Validation {

   /** The Constant LOGGER. */
   private final static Logger LOGGER = LogManager.getLogger(AccommodationsValidation.class);

   /**
    * Verify accommodations are equals.
    *
    * @param expected the expected
    * @param actual the actual
    */
   public void verifyAccommodationsAreEquals(Accommodation expected, Accommodation actual) {
      assertEquals("Accommodation Name is not the same", expected.getName(), actual.getName());
      assertEquals("Accommodation Station is not the same", expected.getStation(), actual.getStation());
      assertEquals("Accommodation Type is not the same", expected.getType(), actual.getType());
      assertEquals("Accommodation Cost is not the same", expected.getCost(), actual.getCost());
      assertEquals("Accommodation Currency is not the same", expected.getCurrency(), actual.getCurrency());
      LOGGER.info("Accommodations match correctly");
   }
}
