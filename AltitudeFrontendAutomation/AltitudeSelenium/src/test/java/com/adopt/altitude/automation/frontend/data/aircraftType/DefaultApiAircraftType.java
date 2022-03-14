package com.adopt.altitude.automation.frontend.data.aircraftType;

import com.adopt.altitude.automation.backend.api.aircraftTypes.CrewComposition;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DefaultApiAircraftType {

  @Value("${default.be.aircraftType.code}")
  public String code;

  @Value("${default.be.aircraftType.modelCode}")
  public String modelCode;

  @Value("${default.be.aircraftType.name}")
  public String name;

  @Value("${default.be.aircraftType.restFacilityCode}")
  public String restFacilityCode;

  @Value("${default.be.aircraftType.crewCompositions.positionCode}")
  public String crewCompositionsPositionCode;

  @Value("${default.be.aircraftType.crewCompositions.quantity}")
  public String crewCompositionsQuantity;

  public List<CrewComposition> getCrewCompositions() {
    String[] crewCompositionsPositionCodeString = crewCompositionsPositionCode.split(",");
    String[] crewCompositionsQuantityString = crewCompositionsQuantity.split(",");

    List<CrewComposition> crewCompositions = new ArrayList<>();

    for(int i=0; i<crewCompositionsPositionCodeString.length; i++) {
      CrewComposition crewComposition = new CrewComposition();

      crewComposition.setPositionCode(crewCompositionsPositionCodeString[i]);
      crewComposition.setQuantity(Integer.parseInt(crewCompositionsQuantityString[i]));

      crewCompositions.add(crewComposition);
    }

    return crewCompositions;
  }
}
