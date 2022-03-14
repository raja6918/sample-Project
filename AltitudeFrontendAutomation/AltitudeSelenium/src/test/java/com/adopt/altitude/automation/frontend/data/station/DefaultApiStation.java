package com.adopt.altitude.automation.frontend.data.station;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DefaultApiStation {

   @Value("${default.be.station.code}")
   public String code;

   @Value("${default.be.station.countryCode}")
   public String countryCode;

   @Value("${default.be.station.dstShift}")
   public String dstShift;

   @Value("${default.be.station.dstEndDateTime}")
   public String dstEndDateTime;

   @Value("${default.be.station.dstStartDateTime}")
   public String dstStartDateTime;

   @Value("${default.be.station.latitude}")
   public String latitude;

   @Value("${default.be.station.longitude}")
   public String longitude;

   @Value("${default.be.station.name}")
   public String name;

   @Value("${default.be.station.regionCode}")
   public String regionCode;

   @Value("${default.be.station.utcOffset}")
   public String utcOffset;

   @Value("${default.be.station.terminals}")
   public List<String> terminals;
}
