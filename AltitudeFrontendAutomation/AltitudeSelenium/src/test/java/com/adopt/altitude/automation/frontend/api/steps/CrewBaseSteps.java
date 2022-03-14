package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.countries.CountriesEndpoint;
import com.adopt.altitude.automation.backend.api.countries.Country;
import com.adopt.altitude.automation.backend.api.crewBases.CrewBase;
import com.adopt.altitude.automation.backend.api.crewBases.CrewBaseEndpoint;
import com.adopt.altitude.automation.frontend.data.crewBase.DefaultApiCrewBase;

import cucumber.api.java8.En;

public class CrewBaseSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(CrewBaseSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<CrewBase>        crewBases;

   @Autowired
   private CrewBaseEndpoint      crewBaseManagement;

   @Autowired
   private CountriesEndpoint     countriesManagement;

   @Autowired
   private DefaultApiCrewBase    defaultApiCrewBase;

   @Autowired
   private ApiLogin              apiLogin;

   public CrewBaseSteps() {
      When("^The crew base with default values is added$", () -> {
         LOGGER.info("=== Setting up {crew base} data ===");

         crewBaseManagement.setAuthenticationToken(apiLogin.getToken());
         CrewBase newCrewBase = getDefaultCrewBase();
         crewBases = crewBaseManagement.addCrewBases(Collections.singletonList(newCrewBase), scenarioId);
      });

      After(CUCUMBER_TAGS, () -> {
         if (crewBases != null && !crewBases.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {crew bases}"));

            List<String> codeList = crewBases.stream().map(c -> c.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            crewBaseManagement.deleteCrewBases(codeList, scenarioId);
         }
      });
   }

   private CrewBase getDefaultCrewBase() throws ClientException {
      CrewBase defaultCrewBase = new CrewBase();

      defaultCrewBase.setCode(defaultApiCrewBase.code);
      defaultCrewBase.setName(defaultApiCrewBase.name);
      defaultCrewBase.setCountryCode(defaultApiCrewBase.countryCode);
      defaultCrewBase.setStationCodes(defaultApiCrewBase.stationsCode);

      return defaultCrewBase;
   }

   private String getCountryName(String code) throws ClientException {
      List<Country> countries = null;
      countriesManagement.setAuthenticationToken(apiLogin.getToken());
      countries = countriesManagement.getCountries(scenarioId);

      return countries.stream().filter(c -> c.getCode().equals(code)).findFirst().get().getName();
   }

}
