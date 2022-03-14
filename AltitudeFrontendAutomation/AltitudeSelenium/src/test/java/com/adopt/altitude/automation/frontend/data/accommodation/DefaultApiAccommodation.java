package com.adopt.altitude.automation.frontend.data.accommodation;

import java.util.ArrayList;
import java.util.List;

import com.adopt.altitude.automation.backend.api.accommodations.AccommodationTransport;
import com.adopt.altitude.automation.backend.api.accommodations.ExtraTravelTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DefaultApiAccommodation {

   @Value("${default.be.accommodation.name}")
   public String name;

   @Value("${default.be.accommodation.typeCode}")
   public String typeCode;

   @Value("${default.be.accommodation.cost}")
   public String cost;

   @Value("${default.be.accommodation.capacity}")
   public String capacity;

   @Value("${default.be.accommodation.contractStartDate}")
   public String contractStartDate;

   @Value("${default.be.accommodation.contractLastDate}")
   public String contractLastDate;

   @Value("${default.be.accommodation.currencyCode}")
   public String currency;

   @Value("${default.be.accommodation.billingPolicyCode}")
   public String billingPolicyCode;

   @Value("${default.be.accommodation.checkInTime}")
   public String checkInTime;

   @Value("${default.be.accommodation.checkOutTime}")
   public String checkOutTime;

   @Value("${default.be.accommodation.extendedStayCostFactor}")
   public String extendedStayCostFactor;

   @Value("${default.be.accommodation.transports.stationCode}")
   public String transportsStationCode;

   @Value("${default.be.accommodation.transports.duration}")
   public String transportsDuration;

   @Value("${default.be.accommodation.transports.cost}")
   public String transportsCost;

   @Value("${default.be.accommodation.transports.currencyCode}")
   public String transportsCurrencyCode;

   @Value("${default.be.accommodation.transports.billingPolicyCode}")
   public String transportsBillingPolicyCode;

   @Value("${default.be.accommodation.transports.extraTravelTimes.duration}")
   public String transportsExtraTravelTimesDuration;

   @Value("${default.be.accommodation.transports.extraTravelTimes.startTime}")
   public String transportsExtraTravelTimesStartTime;

   @Value("${default.be.accommodation.transports.extraTravelTimes.endTime}")
   public String transportsExtraTravelTimesEndTime;

   public List<AccommodationTransport> getTransportDetails() {
     String[] transportsStationCodeString = transportsStationCode.split(",");
     String[] transportsDurationString = transportsDuration.split(",");
     String[] transportsCostString = transportsCost.split(",");
     String[] transportsCurrencyCodeString = transportsCurrencyCode.split(",");
     String[] transportsBillingPolicyCodeString = transportsBillingPolicyCode.split(",");
     List<AccommodationTransport> transportsList = new ArrayList<AccommodationTransport>();

     for(int i=0; i<transportsStationCodeString.length; i++) {
       AccommodationTransport transports = new AccommodationTransport();

       transports.setStationCode(transportsStationCodeString[i]);
       transports.setDuration(transportsDurationString[i]);
       transports.setCost(transportsCostString[i]);
       transports.setCurrencyCode(transportsCurrencyCodeString[i]);
       transports.setBillingPolicyCode(transportsBillingPolicyCodeString[i]);
       transports.setExtraTravelTimes(getExtraTimes());

       transportsList.add(transports);
     }

     return transportsList;
   }

   public List<ExtraTravelTime> getExtraTimes() {
    String[] extraTimesDurationString = transportsExtraTravelTimesDuration.split(",");
    String[] extraTimesStartTimeString = transportsExtraTravelTimesStartTime.split(",");
    String[] extraTimesEndTimeString = transportsExtraTravelTimesEndTime.split(",");
    List<ExtraTravelTime> extraTimes = new ArrayList<ExtraTravelTime>();

    for(int i=0; i<extraTimesDurationString.length; i++) {
      ExtraTravelTime extraTime = new ExtraTravelTime();

      extraTime.setDuration(extraTimesDurationString[i]);
      extraTime.setStartTime(extraTimesStartTimeString[i]);
      extraTime.setEndTime(extraTimesEndTimeString[i]);

      extraTimes.add(extraTime);
    }

    return extraTimes;
  }
}
