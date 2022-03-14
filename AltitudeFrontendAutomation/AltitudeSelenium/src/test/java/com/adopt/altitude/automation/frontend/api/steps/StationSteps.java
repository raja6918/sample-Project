package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.stations.StationsEndpoint;
import com.adopt.altitude.automation.backend.api.stations.Station;
import com.adopt.altitude.automation.frontend.data.station.DefaultApiStation;

import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;

/**
 * The Class StationSteps.
 */
public class StationSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(StationSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Station>         stations;

   /** The default api station. */
   @Autowired
   private DefaultApiStation     defaultApiStation;

   /** The station management. */
   @Autowired
   private StationsEndpoint      stationManagement;

   /**
    * Instantiates a new station steps.
    */
   public StationSteps() {
      After(CUCUMBER_TAGS, () -> {
         if (stations != null && !stations.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Stations}"));

            ArrayList<String> codeList = stations.stream().map(a -> a.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            stationManagement.deleteStations(codeList, scenarioId);
         }
      });
   }

   /**
    * Create stations
    *
    * @param stationList The stations to be added
    */
   @When("^The default stations with following values are added$")
   public void createMultipleStations(@Transpose List<Station> stationList) throws Exception {
      LOGGER.info("=== Setting up {stations} data ===");

      stationManagement.setAuthenticationToken(apiLogin.getToken());
      List<Station> newStations = new ArrayList<Station>();

      for (int i = 0; i < stationList.size(); i++) {
         newStations.add(getDefaultApiStation(stationList.get(i).getName(),
            stationList.get(i).getCode(),
            stationList.get(i).getCountryCode()));
      }

      stations = stationManagement.addStations(newStations, scenarioId);
   }

   /**
    * Gets the default api station.
    *
    * @return the default api station
    */
   private Station getDefaultApiStation(String name, String code, String countryCode) {
      Station newStation = new Station();

      newStation.setCode(code);
      newStation.setCountryCode(countryCode);
      newStation.setDstShift(defaultApiStation.dstShift);
      newStation.setDstEndDateTime(defaultApiStation.dstEndDateTime);
      newStation.setDstStartDateTime(defaultApiStation.dstStartDateTime);
      newStation.setLatitude(defaultApiStation.latitude);
      newStation.setLongitude(defaultApiStation.longitude);
      newStation.setName(name);
      newStation.setRegionCode(defaultApiStation.regionCode);
      newStation.setUtcOffset(defaultApiStation.utcOffset);
      newStation.setTerminals(defaultApiStation.terminals);

      return newStation;
   }

}
