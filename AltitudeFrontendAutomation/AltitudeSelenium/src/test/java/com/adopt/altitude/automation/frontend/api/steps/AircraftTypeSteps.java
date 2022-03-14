package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.aircraftTypes.AircraftType;
import com.adopt.altitude.automation.backend.api.aircraftTypes.AircraftTypesEndpoint;
import com.adopt.altitude.automation.frontend.data.aircraftType.DefaultApiAircraftType;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.List;

public class AircraftTypeSteps extends AbstractApiSteps implements En {

  private static final Logger LOGGER = LogManager.getLogger(AircraftTypeSteps.class);

  private List<AircraftType> aircraftTypes;

  @Autowired
  private DefaultApiAircraftType defaultApiAircraftType;

  @Autowired
  private AircraftTypesEndpoint aircraftTypesManagement;

  public AircraftTypeSteps() {
    Given("^the aircraft type with default values is added$", () -> {
      LOGGER.info("=== Setting up {aircraftType} data ===");

      aircraftTypesManagement.setAuthenticationToken(apiLogin.getToken());
      AircraftType newAircraftType = getDefaultApiAircraftType();
      aircraftTypes = aircraftTypesManagement.addAircraftTypes(Collections.singletonList(newAircraftType), scenarioId);
    });
  }

  private AircraftType getDefaultApiAircraftType() {
    AircraftType defaultAircraftType = new AircraftType();

    defaultAircraftType.setCode(defaultApiAircraftType.code);
    defaultAircraftType.setModelCode(defaultApiAircraftType.modelCode);
    defaultAircraftType.setName(defaultApiAircraftType.name);
    defaultAircraftType.setRestFacilityCode(defaultApiAircraftType.restFacilityCode);
    defaultAircraftType.setCrewComposition(defaultApiAircraftType.getCrewCompositions());

    return defaultAircraftType;
  }
}
