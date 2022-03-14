package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.rulesetParameter.RulesetParameterEndpoint;
import com.adopt.altitude.automation.backend.api.scenarios.Scenario;
import com.adopt.altitude.automation.backend.api.scenarios.ScenariosEndpoint;
import com.adopt.altitude.automation.backend.api.solver.Solver;
import com.adopt.altitude.automation.backend.api.solver.SolverEndpoint;
import com.adopt.altitude.automation.backend.api.users.UsersEndpoint;
import cucumber.api.DataTable;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class HelperScenarioSteps extends  AbstractBackendSteps{
  protected Scenario scenario;

  protected Solver solver;

  protected static Integer             scenarioId;

  protected List<Scenario> scenarios;

//  //@Autowired
// // protected ScenariosValidation validator;
//
//  @Autowired
//  protected SolverValidation solverValidator;
//
//  @Autowired
//  protected RuleParameterValidation ruleValidator;

  @Autowired
  protected ScenariosEndpoint scenarioManagement;

  @Autowired
  private UsersEndpoint userManagement;

  @Autowired
  protected LoginSteps          login;

  @Autowired
  protected SolverEndpoint solverManagement;

  @Autowired
  protected RulesetParameterEndpoint rulesetEndpoint;

  @Autowired
  protected UsersAdministrationSteps userDetails;

  protected Integer getUserId(String username) throws ClientException {
   // userManagement.setAuthenticationToken(login.getToken());
    return userManagement.getUser(username).getId();
  }

  protected Integer getSourceId(String name) throws ClientException {
    if (name.isBlank())
      return null;

    Integer sourceId = null;
    List<Scenario> scenarios = scenarioManagement.getScenariosSummary(getUserId(getCurrentUsername()), true);
    for (Scenario scenario : scenarios) {
      if (scenario.getName().equals(name)) {
        sourceId = scenario.getId();
      }
    }
    return sourceId;
  }

  protected void validateResponse(DataTable expectedDataTable) {
    List<Scenario> expectedList = expectedDataTable.asList(Scenario.class);

    for (Scenario expected : expectedList) {
      //validator.verifyDetails(expected, scenario);
    }
  }

  protected void validateGetResponse(DataTable expectedDataTable) {
    List<Scenario> expectedList = expectedDataTable.asList(Scenario.class);

    for (Scenario expected : expectedList) {
      //validator.verifyGetDetails(expected, scenario);
    }
  }

  protected void deleteScenario() throws ClientException {
    if (scenario != null) {
      ArrayList<Integer> scenariosId = new ArrayList<>(Collections.singletonList(scenario.getId()));
      Integer userId = getUserId(getCurrentUsername());
      scenarioManagement.deleteScenarios(scenariosId, userId);
    }
  }

  protected void updateScenarioName(String name) throws ClientException {
    scenario.setName(name);
    Integer userId = getUserId(getCurrentUsername());
    try {
      scenario = scenarioManagement.editScenarios(Collections.singletonList(scenario), userId).get(0);
    }
    catch (ClientException exception) {
      currentException = exception;
    }
  }

  protected void addTemplate(String templateName, String sourceTemplate, String category, String description) throws ClientException {
   // scenarioManagement.setAuthenticationToken(login.getToken());

    Scenario newScenario = mapTemplate(templateName, sourceTemplate, category, description);

    scenarios = Collections.singletonList(newScenario);
    Integer userId = getUserId(getCurrentUsername());

    try {
      scenario = scenarioManagement.addScenarios(scenarios, userId).get(0);
    }
    catch (ClientException exception) {
      currentException = exception;
    }
  }

  private Scenario mapTemplate(String name, String sourceTemplate, String category, String description) throws ClientException {
    Scenario template = new Scenario();
    template.setName(name);
    template.setIsTemplate(true);
    template.setStatus("Free");
    template.setCategory(category);
    template.setDescription(description);
    template.setSourceId(getSourceId(sourceTemplate));

    return template;
  }

  protected Scenario mapScenario(String scenarioName, String startDate, String endDate, String sourceTemplate, String isTemplate, String status)
    throws ClientException {
    Scenario newScenario = new Scenario();
    newScenario.setName(scenarioName);
    newScenario.setStartDate(startDate);
    newScenario.setEndDate(endDate);
    newScenario.setIsTemplate(Boolean.parseBoolean(isTemplate));
    newScenario.setStatus(status);
    newScenario.setSourceId(getSourceId(sourceTemplate));

    return newScenario;
  }

}
