package com.adopt.altitude.automation.frontend.steps;

import java.sql.Time;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.frontend.template.Template;
import com.adopt.altitude.automation.frontend.validations.TemplatesValidation;

import cucumber.api.java8.En;

public class TemplatesSteps extends AbstractSteps implements En {

   private final static Logger LOGGER   = LogManager.getLogger(TemplatesSteps.class);

   @Autowired
   private TemplatesValidation templatesValidator;

   private Template            template = new Template();

   public TemplatesSteps() {

      Given("^I'm in the templates page$", () -> {
        TimeUnit.SECONDS.sleep(2);
         scenariosPage.openHamburgerMenu();
         LOGGER.info("Open Hamburguer Menu.");
         scenariosPage.openTemplatesItem();
         LOGGER.info("Open Templates page.");
         templatesValidator.verifyPageIsLoaded(templatesPage);
         LOGGER.info("Templates page is loaded.");
        TimeUnit.SECONDS.sleep(2);
      });

      When("^I click on the 'Add' button", () -> {
         templatesValidator.verifyPageIsLoaded(templatesPage);
         TimeUnit.SECONDS.sleep(2);
         templatesPage.openAddTemplatesForm();
      });

      Then("^the create template window opens up", () -> {
         templatesPage.verifyAddTemplateWindowDisplayed(true);
      });

      When("^I provide (.*) (.*) (.*) (.*) data in the form$", (String sourceTemplate, String name, String category, String description) -> {
         filloutForm(name, category, description, sourceTemplate);
      });

      Then("^a new template is added to list$", () -> {
         TimeUnit.SECONDS.sleep(2);
         List<String> templates = templatesPage.getTemplates();
         templatesValidator.verifyTemplateExistence(templates, template.getName(), false);
        TimeUnit.SECONDS.sleep(10);
      });

      Then("^the create button is not Active$", () -> {
         boolean buttonStatus = templatesPage.isCreateButtonInactive();
         templatesValidator.verifyState(false, buttonStatus);
      });

      When("^I click on 'Cancel' button", () -> {
         templatesPage.cancelTemplate();
      });

      Then("^the create template window closes", () -> {
         LOGGER.info("Open selected Template.");
         templatesPage.verifyAddTemplateWindowDisplayed(false);
      });

      When("^I click on the 'Open' button for template \"(.*)\"", (String templateName) -> {
         templatesPage.displayOptions(templateName);
         templatesPage.openEditTemplatePage();
      });

      When("^I click on the 'Get Info' button for template \"(.*)\"", (String templateName) -> {
         templatesPage.displayOptions(templateName);
         templatesPage.openGetInfoTemplatePage();
      });

     When("^I verify that The Template Name field is disabled$", () -> {
       templatesPage.verifyTemplateNameDisabled();
     });

     When("^I verify that The Category field is disabled$", () -> {
       templatesPage.verifyTemplateCategoryDisabled();
     });

     When("^I verify that The template option \"(.*)\" is enabled$", (String templateOption) -> {
       templatesPage.verifyTemplateOptionEnabled(templateOption);
     });

     When("^I Click on template option \"(.*)\"$", (String templateOption) -> {
       templatesPage.clickTemplateOption(templateOption);
     });

     When("^I verify that The Description field is disabled$", () -> {
       templatesPage.verifyTemplateDescriptionDisabled();
     });
      Then("^the data home page opens up$", () -> {
         dataHomePage.isPageDisplayed();
      });

      When("^I edit (.*) (.*) (.*) in the form$", (String name, String category, String description) -> {
         template.setName(name);
         template.setCategory(category);
         template.setDescription(description);
         templatesPage.fillOutEditTemplateForm(template);
         if (!name.isBlank()) {
            templatesPage.SaveInfo();
         }
      });

      Then("^the changes are saved in the template$", () -> {
         TimeUnit.SECONDS.sleep(2);
         templatesPage.displayOptions(template.getName());
         templatesPage.openGetInfoTemplatePage();
         templatesPage.verifyTemplateDetails(template.getName(), template.getCategory(), template.getDescription());
      });

      Then("^the save button is not Active$", () -> {
         templatesPage.verifySaveButtonInactive();
      });

      When("^I click on the 'Delete' button for template \"(.*)\"$", (String templateName) -> {

         templatesPage.displayOptions(templateName);
         templatesPage.openDeleteTemplateForm();
         templatesPage.deleteTemplate();
      });

      Then("^the template \"(.*)\" is deleted from the list$", (String templateName) -> {
         TimeUnit.SECONDS.sleep(2);
         List<String> templates = templatesPage.getTemplates();
         templatesValidator.verifyTemplateExistence(templates, templateName, false);
      });

      Given("^I open the template \"(.*)\"$", (String templateName) -> {
       templatesPage.openDataItem(templateName);
      });

     Given("^I click on Action Menu of template \"(.*)\"$", (String templateName) -> {
       TimeUnit.SECONDS.sleep(2);
       templatesPage.displayOptions(templateName);
     });

      Then("^The template \"(.*)\" shows in ReadOnly mode$", (String templateName) -> {
         templatesPage.validateReadOnlyMode(templateName);
      });

      Then("^The View Only mode information dialog for template shows up$", () -> {
         templatesPage.validateViewOnlyInfoDialog();
      });

      When("^I click 'Open' button on the template View Only Information dialog$", () -> {
         templatesPage.openTemplateReadOnlyMode();
      });

      Then("^The legend shows 'VIEW-ONLY' beside the template name$", () -> {
         dataHomePage.verifyViewOnlyMode();
         TimeUnit.SECONDS.sleep(5);
      });

     Then("^I verify that It is possible to see all Templates$", () -> {
       templatesPage.checkAllTemplates();
     });

     Then("^I verify that all templates have the Read-only status$", () -> {
       templatesPage.checkAllReadOnlyTemplates();
     });

     Given("^I verify tooltip message for all templates as \"(.*)\"$", (String message) -> {
       templatesPage.checkAllTemplatesReadOnlyMessage(message);
     });

      Then("^The legend shows '(.*)' in the header section$", (String legend) -> {
         String header = dataHomePage.getDataManagementTemplateHeader();
         templatesValidator.verifyText(legend, header);
      });

      errorHandlingSteps();
   }

   private void errorHandlingSteps() {
      When("^I add a new Template as \"(.*)\" with category \"(.*)\", description \"(.*)\" and source \"(.*)\"$",
         (String templateName, String category, String description, String source) -> {
            templatesPage.openAddTemplatesForm();
            addTemplate(templateName, category, description, source);
            TimeUnit.SECONDS.sleep(4);
         });

      Then("^the snackbar message \"(.*)\" for templates is displayed$", (String snackbarMessage) -> {
         String currentMessange = templatesPage.getSnackbarMessage();
         templatesValidator.verifyText(snackbarMessage, currentMessange);
      });
   }

   private void addTemplate(String templateName, String category, String description, String source) {
      filloutForm(templateName, category, description, source);
      templatesPage.addTemplate();
   }

   private void filloutForm(String templateName, String category, String description, String source) {
      template.setSourceTemplate(source);
      template.setName(templateName);
      template.setCategory(category);
      template.setDescription(description);
      templatesPage.fillOutAddTemplateForm(template);
   }
}
