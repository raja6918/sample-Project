package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.station.Station;

@Component
public class StationsValidation extends Validation {

   private final static Logger LOGGER = LogManager.getLogger(StationsValidation.class);

   public void verifyStationExistance(Boolean station, Boolean isNameInList) {
      assertNotNull(station);

      LOGGER.debug("List of station are not null");
      if (isNameInList) {
         Assert.assertTrue(station);
         LOGGER.debug("Station is in list");
      }
      else {
         Assert.assertFalse(station);
         LOGGER.debug("Station is not in list");
      }
   }

   public void verifyStationsAreEquals(Station expected, Station actual) {
      assertEquals("Station Code is not the same", expected.getIataCode(), actual.getIataCode());
      assertEquals("Station Name is not the same", expected.getStationName(), actual.getStationName());
      assertEquals("Station Country is not the same", expected.getCountry(), actual.getCountry());
      assertEquals("Station Region is not the same", expected.getRegion(), actual.getRegion());
      assertEquals("Station Time Zone is not the same", expected.getTimeZone(), actual.getTimeZone());
      LOGGER.info("Stations match correctly");
   }

}
