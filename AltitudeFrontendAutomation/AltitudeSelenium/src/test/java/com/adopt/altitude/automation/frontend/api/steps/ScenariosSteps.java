package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.scenarios.Filters;
import com.adopt.altitude.automation.backend.api.scenarios.Scenario;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * The Class ScenariosSteps.
 */
public class ScenariosSteps extends AbstractScenarioSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(ScenariosSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@addScenario or @editScenario or @data_management or @scenariosErrorHandling or @scenariosFlag or @import_data or @saveAsTemplate or @filters or @dataHome or @bin_management" };

   private Scenario              scenario;

   /**
    * Instantiates a new scenarios steps.
    */
   public ScenariosSteps() {
      Given("^The Scenario \"(.*)\" is added$", (String scenarioName) -> {
         LOGGER.info("=== Setting up {scenarios} data ===");

         scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
         Scenario newScenario = getDefaultScenario(scenarioName);
         Integer userId = getUserId(getCurrentUsername());
         scenario = scenariosEndpoint.addScenarios(Collections.singletonList(newScenario), userId).get(0);
         scenarioId = scenario.getId();
      });

     Given("^The Scenario \"(.*)\" is added for Jazz Template with Pairings$", (String scenarioName) -> {
       LOGGER.info("=== Setting up {scenarios} data ===");

       scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
       Scenario newScenario = getJazzScenario(scenarioName);
       Integer userId = getUserId(getCurrentUsername());
       scenario = scenariosEndpoint.addScenarios(Collections.singletonList(newScenario), userId).get(0);
       scenarioId = scenario.getId();
       });

     Given("^The Scenario \"(.*)\" is added for user \"(.*)\" password \"(.*)\"$", (String scenarioName, String username, String password) -> {
       LOGGER.info("=== Setting up {scenarios} data ===");

       scenariosEndpoint.setAuthenticationToken(apiLogin.getToken(username, password));
       Scenario newScenario = getDefaultScenario(scenarioName);
       Integer userId = getUserId(getCurrentUsername());
       scenario = scenariosEndpoint.addScenarios(Collections.singletonList(newScenario), userId).get(0);
       scenarioId = scenario.getId();
     });

     And("^The Scenario \"([^\"]*)\" is added for Sierra UAT template$", (String scenarioName) -> {
       LOGGER.info("=== Setting up {scenarios} data ===");
       scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
       Scenario newScenario = getUATTemplateScenario(scenarioName);
       Integer userId = getUserId(getCurrentUsername());
       scenario = scenariosEndpoint.addScenarios(Collections.singletonList(newScenario), userId).get(0);
       scenarioId = scenario.getId();
     });


      Given("^the \"(.*)\" scenario is deleted through backend$", (String scenarioName) -> {
         scenariosEndpoint.deleteScenarios(new ArrayList<>(List.of(scenario.getId())), getUserId(getCurrentUsername()));
      });

      And("^The scenario \"(.*)\" is opened through backend$", (String scenarioName) -> {
        openScenario(scenario);
      });


      After(CUCUMBER_TAGS, () -> {
         scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
         ArrayList<Integer> idList = getIdList();

         if (!idList.isEmpty()) {
           LOGGER.info("Cleaning up Test Data for Automation Scenarios: "+idList);

            LOGGER.info(String.format("Cleaning up Test Data for {Scenarios}"));

            scenariosEndpoint.deleteScenarios(idList, getUserId(getCurrentUsername()));
         }
      });
   }

   /**
    * Gets a scenario with default values.
    *
    * @param scenarioName the scenario name
    * @return the scenario
    * @throws ClientException
    */
   private Scenario getDefaultScenario(String scenarioName) throws ClientException {
     String startDate = "2021-10-01T10:19:19.000Z";
     String endDate = "2021-10-30T10:19:19.000Z";
     String createdBy = "me";
     String creationTime = "2021-10-01T10:19:19.000Z";
     String lastOpenedByMe = "2021-10-01T10:19:19.000Z";
     String sourceTemplate = "Sierra UAT Template";
     boolean isTemplate = false;

      Scenario scenario = new Scenario();

      scenario.setName(scenarioName);
      scenario.setStartDate(startDate);
      scenario.setEndDate(endDate);
      scenario.setCreatedBy(createdBy);
      scenario.setCreationTime(creationTime);
      scenario.setLastOpenedByMe(lastOpenedByMe);
      scenario.setSourceId(getTemplateId(sourceTemplate));
      scenario.setIsTemplate(isTemplate);

      return scenario;
   }

  private Scenario getJazzScenario(String scenarioName) throws ClientException {
    String startDate = "2007-07-01T10:19:19.000Z";
    String endDate = "2007-07-30T10:19:19.000Z";
    String createdBy = "me";
    String creationTime = "2007-07-01T10:19:19.000Z";
    String lastOpenedByMe = "2007-07-01T10:19:19.000Z";
    String sourceTemplate = "Jazz Template with Pairings";
    boolean isTemplate = false;

    Scenario scenario = new Scenario();

    scenario.setName(scenarioName);
    scenario.setStartDate(startDate);
    scenario.setEndDate(endDate);
    scenario.setCreatedBy(createdBy);
    scenario.setCreationTime(creationTime);
    scenario.setLastOpenedByMe(lastOpenedByMe);
    scenario.setSourceId(getTemplateId(sourceTemplate));
    scenario.setIsTemplate(isTemplate);

    return scenario;
  }
  private Scenario getUATTemplateScenario(String scenarioName) throws ClientException {
    String startDate = "2022-01-01T00:00:00.000Z";
    String endDate = "2022-01-30T00:00:00.000Z";
    String createdBy = "me";
    String creationTime = "2022-01-01T00:00:00.000Z";
    String lastOpenedByMe = "2022-01-01T00:00:00.000Z";
    String sourceTemplate = "Sierra UAT Template";
    boolean isTemplate = false;
    Scenario scenario = new Scenario();
    scenario.setName(scenarioName);
    scenario.setStartDate(startDate);
    scenario.setEndDate(endDate);
    scenario.setCreatedBy(createdBy);
    scenario.setCreationTime(creationTime);
    scenario.setLastOpenedByMe(lastOpenedByMe);
    scenario.setSourceId(getTemplateId(sourceTemplate));
    scenario.setIsTemplate(isTemplate);
    return scenario;
  }
   @Override
   protected ArrayList<Integer> getIdList() throws Exception {
      List<Scenario> scenarios = scenariosEndpoint.getScenariosSummary(getUserId(getCurrentUsername()), false, Filters.ANYONE.name());
      return getClosedScenarios(scenarios);
   }
}
