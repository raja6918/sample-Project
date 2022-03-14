package com.adopt.altitude.automation.frontend.data.crewBase;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.crewBases.ServingStation;

@Component
public class DefaultApiCrewBase {

   @Value("${default.be.crewbase.code}")
   public String    code;

   @Value("${default.be.crewbase.name}")
   public String    name;

   @Value("${default.be.crewbase.stations.code}")
   public List<String>    stationsCode;

   @Value("${default.be.crewbase.countryCode}")
   public String    countryCode;
}
