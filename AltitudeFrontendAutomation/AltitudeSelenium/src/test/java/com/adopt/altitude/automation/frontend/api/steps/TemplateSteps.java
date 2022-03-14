package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.scenarios.Scenario;

import cucumber.api.java8.En;

public class TemplateSteps extends AbstractScenarioSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(TemplateSteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@templates or @edittemplate or @templatesErrorHandling or @templatesFlag or @saveAsTemplate" };

   private List<Scenario>        templates;

   /**
    * Instantiates new template steps.
    */
   public TemplateSteps() {
      When("^The template \"(.*)\" with category \"(.*)\" description \"(.*)\" and source \"(.*)\"$",
         (String name, String category, String description, String source) -> {
            LOGGER.info("=== Setting up {templates} data ===");

            scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
            Scenario newTemplate = createTemplate(name, category, description, source);
            templates = scenariosEndpoint.addScenarios(Collections.singletonList(newTemplate), getUserId(getCurrentUsername()));
         });

      Given("^the \"(.*)\" template is deleted through backend$", (String templateName) -> {
         scenariosEndpoint.deleteScenarios(templates.stream().map(s -> s.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>())),
            getUserId(getCurrentUsername()));
      });
      
      Given("^The template \"(.*)\" is opened through backend$", (String templateName) -> {
         Scenario template = templates.stream().filter(t -> t.getName().equals(templateName)).findFirst().get();
         openScenario(template);
       });

      After(CUCUMBER_TAGS, () -> {
         scenariosEndpoint.setAuthenticationToken(apiLogin.getToken());
         ArrayList<Integer> idList = getIdList();

         if (!idList.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Templates}"));

            scenariosEndpoint.deleteScenarios(idList, getUserId(getCurrentUsername()));
         }
      });
   }

   /**
    * Gets the template.
    *
    * @param name the template name
    * @param category the category
    * @param description the description
    * @param source the source
    * @return the template
    * @throws ClientException
    */
   private Scenario createTemplate(String name, String category, String description, String source) throws ClientException {
      Scenario newTemplate = new Scenario();
      newTemplate.setName(name);
      newTemplate.setCategory(category);
      newTemplate.setDescription(description);
      newTemplate.setSourceId(getTemplateId(source));
      newTemplate.setIsTemplate(true);

      return newTemplate;
   }
   
   @Override
   protected ArrayList<Integer> getIdList() throws Exception {
      List<Scenario> templates = scenariosEndpoint.getScenariosSummary(getUserId(getCurrentUsername()), true);
      return getClosedScenarios(templates);
   }
}
