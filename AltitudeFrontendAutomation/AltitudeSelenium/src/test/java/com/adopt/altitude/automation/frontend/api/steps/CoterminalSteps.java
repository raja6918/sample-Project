package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.coterminals.Coterminal;
import com.adopt.altitude.automation.backend.api.coterminals.CoterminalsEndpoint;
import com.adopt.altitude.automation.frontend.data.coterminal.DefaultApiCoterminal;

import cucumber.api.java8.En;

public class CoterminalSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(CoterminalSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Coterminal>      coterminals;

   @Autowired
   private DefaultApiCoterminal  defaultApiCoterminal;

   @Autowired
   private CoterminalsEndpoint   coterminalsManagement;

   public CoterminalSteps() {
      Given("^the coterminal with default values is added$", () -> {
         LOGGER.info("=== Setting up {coterminal} data ===");

         coterminalsManagement.setAuthenticationToken(apiLogin.getToken());
         Coterminal newCoterminal = getDefaultApiCoterminal();
         coterminals = coterminalsManagement.addCoterminals(Collections.singletonList(newCoterminal), scenarioId);
      });

      After(CUCUMBER_TAGS, () -> {
         if (coterminals != null && !coterminals.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Coterminals}"));

            ArrayList<Integer> idList = coterminals.stream().map(c -> c.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>()));
            coterminalsManagement.deleteCoterminals(idList, scenarioId);
         }
      });
   }

   private Coterminal getDefaultApiCoterminal() {
      Coterminal defaultCoterminal = new Coterminal();

      defaultCoterminal.setName(defaultApiCoterminal.name);
      defaultCoterminal.setDepartureStationCode(defaultApiCoterminal.departureStationCode);
      defaultCoterminal.setArrivalStationCode(defaultApiCoterminal.arrivalStationCode);
      defaultCoterminal.setTypeCode(defaultApiCoterminal.typeCode);
      defaultCoterminal.setCapacity(defaultApiCoterminal.capacity);
      defaultCoterminal.setBillingPolicyCode(defaultApiCoterminal.billingPolicyCode);
      defaultCoterminal.setCost(defaultApiCoterminal.cost);
      defaultCoterminal.setCurrencyCode(defaultApiCoterminal.currencyCode);
      defaultCoterminal.setCredit(defaultApiCoterminal.credit);
      defaultCoterminal.setCreditPolicyCode(defaultApiCoterminal.creditPolicyCode);
      defaultCoterminal.setOutboundTiming(defaultApiCoterminal.geTransportTiming());
      defaultCoterminal.setIsBidirectional(defaultApiCoterminal.isBidirectional);

      return defaultCoterminal;
   }
}
