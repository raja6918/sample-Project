package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.accommodations.Accommodation;
import com.adopt.altitude.automation.backend.api.accommodations.AccommodationsEndpoint;
import com.adopt.altitude.automation.frontend.data.accommodation.DefaultApiAccommodation;

import cucumber.api.java8.En;

public class AccommodationsSteps extends AbstractApiSteps implements En {

   private static final Logger     LOGGER        = LogManager.getLogger(AccommodationsSteps.class);

   private static final String[]   CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Accommodation>     accommodations;

   @Autowired
   private DefaultApiAccommodation defaultApiAccommodation;

   @Autowired
   private AccommodationsEndpoint  accommodationManagement;

   public AccommodationsSteps() {
      Given("^the accommodation with default values is added$", () -> {
         LOGGER.info("=== Setting up {accommodation} data ===");

         accommodationManagement.setAuthenticationToken(apiLogin.getToken());
         Accommodation newAccommodation = getDefaultApiAccommodation();
         accommodations = accommodationManagement.addAccommodations(Collections.singletonList(newAccommodation), scenarioId);
      });

      After(CUCUMBER_TAGS, () -> {
         if (accommodations != null && !accommodations.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Accommodations}"));

            ArrayList<Integer> idList = accommodations.stream().map(a -> a.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>()));
            accommodationManagement.deleteAccommodations(idList, scenarioId);
         }
      });
   }

   private Accommodation getDefaultApiAccommodation() {
      Accommodation defaultAccommodation = new Accommodation();

      defaultAccommodation.setCapacity(defaultApiAccommodation.capacity);
      defaultAccommodation.setCheckInTime(defaultApiAccommodation.checkInTime);
      defaultAccommodation.setCheckOutTime(defaultApiAccommodation.checkOutTime);
      defaultAccommodation.setContractLastDate(defaultApiAccommodation.contractLastDate);
      defaultAccommodation.setContractStartDate(defaultApiAccommodation.contractStartDate);
      defaultAccommodation.setCost(defaultApiAccommodation.cost);
      defaultAccommodation.setExtendedStayCostFactor(defaultApiAccommodation.extendedStayCostFactor);
      defaultAccommodation.setCurrencyCode(defaultApiAccommodation.currency);
      defaultAccommodation.setName(defaultApiAccommodation.name);
      defaultAccommodation.setBillingPolicyCode(defaultApiAccommodation.billingPolicyCode);
      defaultAccommodation.setTypeCode(defaultApiAccommodation.typeCode);
      defaultAccommodation.setTransports(defaultApiAccommodation.getTransportDetails());

      return defaultAccommodation;
   }
}
