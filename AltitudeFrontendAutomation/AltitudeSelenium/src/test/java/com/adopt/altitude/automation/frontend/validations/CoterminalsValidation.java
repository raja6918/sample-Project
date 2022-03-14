package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.coterminal.Coterminal;

@Component
public class CoterminalsValidation extends Validation {

   /** The Constant LOGGER. */
   private final static Logger LOGGER = LogManager.getLogger(CoterminalsValidation.class);

   /**
    * Verify coterminals are equals.
    *
    * @param expected the expected
    * @param actual the actual
    */
   public void verifyCoterminalsAreEquals(Coterminal expected, Coterminal actual) {
      assertEquals("Coterminal Name is not the same", expected.getTransportName(), actual.getTransportName());
      assertEquals("Coterminal Departure Station is not the same", expected.getDepartureStation(), actual.getDepartureStation());
      assertEquals("Coterminal Arrival Station is not the same", expected.getArrivalStation(), actual.getArrivalStation());
      assertEquals("Coterminal Type is not the same", expected.getTransportType(), actual.getTransportType());
      assertEquals("Coterminal Cost is not the same", expected.getCost(), actual.getCost());
      assertEquals("Coterminal Currency is not the same", expected.getCurrency(), actual.getCurrency());
      LOGGER.info("Coterminals match correctly");
   }
}
