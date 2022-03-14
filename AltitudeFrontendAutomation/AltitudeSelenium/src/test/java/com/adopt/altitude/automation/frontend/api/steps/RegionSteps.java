package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.regions.Region;
import com.adopt.altitude.automation.backend.api.regions.RegionsEndpoint;

import cucumber.api.java8.En;

public class RegionSteps extends AbstractApiSteps implements En {

   private static final Logger LOGGER = LogManager.getLogger(RegionSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Region>        regions;

   @Autowired
   private RegionsEndpoint     regionManagement;

   /**
    * Instantiates new region steps.
    */
   public RegionSteps() {
      When("^The region \"(.*)\" with code \"(.*)\" is added$", (String name, String code) -> {
         LOGGER.info("=== Setting up {regions} data ===");

         regionManagement.setAuthenticationToken(apiLogin.getToken());
         Region newRegion = getRegion(name, code);
         regions = regionManagement.addRegions(Collections.singletonList(newRegion), scenarioId);
      });

      After(CUCUMBER_TAGS, () -> {
         if (regions != null && !regions.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Regions}"));

            ArrayList<String> codeList = regions.stream().map(r -> r.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            regionManagement.deleteRegions(codeList, scenarioId);
         }
      });
   }

   /**
    * Gets the region.
    *
    * @param name the region name
    * @param code the region code
    * @return the region
    */
   private Region getRegion(String name, String code) {
      Region newRegion = new Region();
      newRegion.setName(name);
      newRegion.setCode(code);

      return newRegion;
   }

}
