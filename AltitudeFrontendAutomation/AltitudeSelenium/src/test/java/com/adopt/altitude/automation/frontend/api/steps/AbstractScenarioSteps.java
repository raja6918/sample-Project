package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.scenarios.Actions;
import com.adopt.altitude.automation.backend.api.scenarios.Scenario;
import com.adopt.altitude.automation.backend.api.scenarios.ScenariosEndpoint;
import com.adopt.altitude.automation.backend.api.users.UsersEndpoint;

public abstract class AbstractScenarioSteps extends AbstractApiSteps {

   @Autowired
   protected UsersEndpoint     usersEndpoint;

   @Autowired
   protected ScenariosEndpoint scenariosEndpoint;

   protected abstract ArrayList<Integer> getIdList() throws Exception;

   /**
    * Get user id for given username.
    *
    * @param username the username
    * @return the user id
    * @throws ClientException the client exception
    */
   protected Integer getUserId(String username) throws ClientException {
      if (userId == null || userId == 0) {
         usersEndpoint.setAuthenticationToken(apiLogin.getToken());
         userId = usersEndpoint.getUser(username).getId();
      }

      return userId;
   }

   /**
    * Get the template Id from template name.
    *
    * @param name the name
    * @return the template id
    * @throws ClientException the client exception
    */
   protected int getTemplateId(String name) throws ClientException {
      List<Scenario> templates = null;
      templates = scenariosEndpoint.getScenariosSummary(getUserId(getCurrentUsername()), true);

      return templates.stream().filter(t -> t.getName().equals(name)).findFirst().get().getId();
   }

   /**
    * Gets the closed scenarios.
    *
    * @param scenarios the scenarios
    * @return the closed scenarios
    * @throws ClientException the client exception
    */
   protected ArrayList<Integer> getClosedScenarios(List<Scenario> scenarios) throws ClientException {
      List<Scenario> autScenarios = scenarios.stream().filter(s -> s.getName().contains("aut_")).collect(Collectors.toList());
      List<Scenario> closedScenarios = closeScenarios(autScenarios);
      ArrayList<Integer> ids = closedScenarios.stream().map(s -> s.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>()));

      return ids;
   }

   protected Scenario openScenario(Scenario autScenario) throws ClientException {
       Scenario scenario = scenariosEndpoint.getScenario(autScenario.getId(), userId);
       Scenario openedScenario = scenariosEndpoint.setScenarioAction(autScenario.getId(), scenario.getCreatedByUserId(), Actions.OPEN);

       return openedScenario;

   }

   /**
    * Close scenarios.
    *
    * @param autScenarios the aut scenarios
    * @return the list
    * @throws ClientException the client exception
    */
   private List<Scenario> closeScenarios(List<Scenario> autScenarios) throws ClientException {
      List<Scenario> closedScenarios = new ArrayList<>();

      for (Scenario autScenario : autScenarios) {
         if (!autScenario.getStatus().equals("Free")) {
            Scenario scenario = scenariosEndpoint.getScenario(autScenario.getId(), userId);
            autScenario = scenariosEndpoint.setScenarioAction(autScenario.getId(), scenario.getIsOpenedById(), Actions.CLOSE);
         }

         closedScenarios.add(autScenario);
      }

      return closedScenarios;
   }
}
