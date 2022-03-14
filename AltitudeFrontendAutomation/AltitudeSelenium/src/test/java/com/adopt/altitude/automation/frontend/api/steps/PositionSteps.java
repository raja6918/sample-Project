package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.adopt.altitude.automation.backend.api.ClientException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.positions.Position;
import com.adopt.altitude.automation.backend.api.positions.PositionsEndpoint;

import cucumber.api.java8.En;

public class PositionSteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(PositionSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Position>        positions;

   @Autowired
   private PositionsEndpoint     positionManagement;

   public PositionSteps() {
      Given("^The position \"(.*)\" with code \"(.*)\" of type \"(.*)\" and order \"(.*)\" is added$", (String name, String code, String type, String order) -> {
         LOGGER.info("=== Setting up {positions} data ===");

         positionManagement.setAuthenticationToken(apiLogin.getToken());
         Position newPosition = mapPosition(name, code, type, order);
         positions = positionManagement.addPositions(Collections.singletonList(newPosition), scenarioId);
      });

      After(CUCUMBER_TAGS, () -> {
         if (positions != null && !positions.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Positions}"));

            ArrayList<String> codeList = getCreatedPositions().stream().map(c -> c.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            positionManagement.deletePositions(codeList, scenarioId);
         }
      });

   }

   private List<Position> getCreatedPositions() throws ClientException {
     List<Position> positionsToBeDeleted = new ArrayList<Position>();
     List<Position> allPositions = positionManagement.getPositions(scenarioId);
     for(int i = 0; i <allPositions.size(); i++) {
       if(allPositions.get(i).getName().contains("aut")) {
         positionsToBeDeleted.add(allPositions.get(i));
       }
     }
       return positionsToBeDeleted;
   }

   private Position mapPosition(String name, String code, String type, String order) {
      Position position = new Position();

      position.setCode(code);
      position.setName(name);
      position.setType(Types.valueOf(type).value);
      position.setTypeCode(Types.valueOf(type).code);
      position.setOrder(Integer.parseInt(order));

      return position;
   }

   private enum Types {
      FLIGHT_DECK("Flight Deck", "FD"),
      CABIN("Cabin", "CC");

      private String  value;
      private String code;

      Types(String value, String code) {
         this.value = value;
         this.code = code;
      }

   }
}
