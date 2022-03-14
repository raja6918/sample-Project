package com.adopt.altitude.automation.frontend.validations;

import com.adopt.altitude.automation.frontend.data.aircraftModel.AircraftModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertEquals;

@Component
public class AircraftModelsValidation extends Validation {

  private final static Logger LOGGER = LogManager.getLogger(AircraftModelsValidation.class);

  public void verifyAircraftModelsAreEquals(AircraftModel expected, AircraftModel actual) {
    assertEquals("Aircraft model code is not the same", expected.getCode(), actual.getCode());
    assertEquals("Aircraft model name is not the same", expected.getName(), actual.getName());
    LOGGER.info("Aircraft models match correctly");
  }
}
