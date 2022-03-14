package com.adopt.altitude.automation.frontend.validations;

import com.adopt.altitude.automation.frontend.data.aircraftType.AircraftType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertEquals;

@Component
public class AircraftTypesValidation extends Validation {

  private final static Logger LOGGER = LogManager.getLogger(AircraftTypesValidation.class);

  public void verifyAircraftTypesAreEqual(AircraftType expected, AircraftType actual) {
    assertEquals("Aircraft type is not the same", expected.getIataType(), actual.getIataType());
    assertEquals("Aircraft type name is not the same", expected.getName(), actual.getName());
    assertEquals("Aircraft type rest facility is not the same", expected.getRestFacility(), actual.getRestFacility());
    LOGGER.info("Aircraft types match correctly");
  }
}
