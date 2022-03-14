package com.adopt.altitude.automation.frontend.api.steps;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.aircraftModels.AircraftModel;
import com.adopt.altitude.automation.backend.api.aircraftModels.AircraftModelEndpoint;

import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;

public class AircraftModelSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER = LogManager.getLogger(AircraftModelSteps.class);

   private List<AircraftModel>   aircraftModels;

   @Autowired
   private AircraftModelEndpoint aircraftModelManagement;

   @When("^The aircraft models with following values are added$")
   public void createMultipleAircraftModels(@Transpose List<AircraftModel> aircraftModelList) throws Exception {
      LOGGER.info("=== Setting up {aircraft models} data ===");

      aircraftModelManagement.setAuthenticationToken(apiLogin.getToken());
      aircraftModels = aircraftModelManagement.addAircraftModels(aircraftModelList, scenarioId);
   }
}
