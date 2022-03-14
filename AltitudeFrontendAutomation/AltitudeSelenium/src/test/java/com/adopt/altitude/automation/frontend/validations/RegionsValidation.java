package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.region.Region;

@Component
public class RegionsValidation extends Validation {
   private final static Logger LOGGER = LogManager.getLogger(RegionsValidation.class);

   public void verifyRegionsAreEquals(Region expected, Region actual) {
      assertEquals("Region code is not the same", expected.getCode(), actual.getCode());
      assertEquals("Region name is not the same", expected.getName(), actual.getName());
      LOGGER.info("Region added correctly");
   }

}
