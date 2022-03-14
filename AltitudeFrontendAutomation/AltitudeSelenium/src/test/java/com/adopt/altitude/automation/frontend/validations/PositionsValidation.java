package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.position.Position;

@Component
public class PositionsValidation extends Validation {

   private final static Logger LOGGER = LogManager.getLogger(PositionsValidation.class);

   public void verifyPositionsAreEquals(Position expected, Position actual) {
      assertEquals("Position code is not the same", expected.getCode(), actual.getCode());
      assertEquals("Position name is not the same", expected.getName(), actual.getName());
      LOGGER.info("Positions match correctly");
   }
}
