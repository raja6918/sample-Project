package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.template.Template;
import com.adopt.altitude.automation.frontend.validations.ScenariosValidation;
import cucumber.api.DataTable;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class ScenariosSteps extends AbstractSteps implements En {
   private final static Logger LOGGER               = LogManager.getLogger(ScenariosSteps.class);
   private final static String DATE_FORMAT          = "yyyy/MM/dd";
   private final static String DATE_MONTH_FORMAT    = "MMM dd";
   private final static String DATE_LONG_FORMAT     = "MMM dd, yyyy";
   private final static String DATE_DAY_YEAR_FORMAT = "dd, yyyy";

   @Autowired
   private ScenariosValidation validator;

   private String              expectedScenarioName;

   public ScenariosSteps() {

      Given("^I navigate to Scenarios page$", () -> {
         TimeUnit.SECONDS.sleep(2);
         navigator.loadPage();
      });

      Given("^I'm in the scenarios page$", () -> {
         validator.verifyPageIsLoaded(scenariosPage);
      });

      When("^I click on the 'Created By' filter$", () -> {
         LOGGER.debug("Openning Menu: 'Created By'");
         scenariosPage.openCreateByMenu();
      });

      When("^I filter by \"(.*)\"$", (String filterBy) -> {
        TimeUnit.SECONDS.sleep(1);
         scenariosPage.openCreateByMenu();
        TimeUnit.SECONDS.sleep(3);
         scenariosPage.SelectFilter(filterBy);
        TimeUnit.SECONDS.sleep(4);
      });

      Then("^the listed scenarios belongs to:$", (DataTable users) -> {
         verifyScenariosOwner(users, true);
      });

      Then("^the listed scenarios are not belonging to:$", (DataTable users) -> {
         verifyScenariosOwner(users, false);
      });

      Then("^The following items should be listed:$", (DataTable itemsList) -> {
         List<String> menuItems = scenariosPage.getCreatedByItems();

         validator.verifyMenuItems(itemsList.asList(String.class), menuItems);
      });

      Given("^I open the scenario \"(.*)\"$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         TimeUnit.SECONDS.sleep(2);
        scenariosPage.openDataItem(scenarioName);
      });

     Given("^I open the view only scenario \"(.*)\"$", (String scenarioName) -> {
       scenariosPage.clickOnFilterCreatedByAnyone();
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.openDataItemViewOnly(scenarioName);
       TimeUnit.SECONDS.sleep(2);
     });

      Then("^The scenario \"(.*)\" shows in ReadOnly mode$", (String scenarioName) -> {
        scenariosPage.validateReadOnlyMode(scenarioName);
      });

      Then("^The View Only mode information dialog shows up$", () -> {
        boolean isReadOnly = scenariosPage.isReadOnlyInfoDialogDisplayed();
        validator.validateViewOnlyInfoDialog(isReadOnly);
      });

      When("^I click 'Open' button on the View Only Information dialog$", () -> {
        TimeUnit.SECONDS.sleep(2);
        scenariosPage.openScenarioReadOnlyMode();
      });

      Then("^The legend shows 'VIEW-ONLY' beside the scenario name$", () -> {
        dataHomePage.verifyViewOnlyMode();
      });

      addScenarioSteps();

      getInfoSteps();

      deleteScenarioSteps();

      errorHandlingSteps();

      saveAsTemplateSteps();
   }

   private void addScenarioSteps() {
      Given("^I click on the Add Scenario button$", () -> {
         scenariosPage.openAddScenarioScreen();
      });

      And("^I select the template \"(.*)\"$", (String templateName) -> {
         scenariosPage.selectTemplate(templateName);
      });

      When("^I create the Scenario \"(.*)\" with default values selecting the \"(.*)\" template$", (String scenarioName, String templateName) -> {
         expectedScenarioName = scenarioName;
         scenariosPage.selectTemplate(templateName);
         scenariosPage.enterScenarioName(scenarioName);
         scenariosPage.saveScenario();
      });

      When("^I create the Scenario \"(.*)\" starting on \"(.*)\" with a duration of \"(.*)\" days and selecting the \"(.*)\" template$", (String scenarioName, String date, String durationDays, String templateName) -> {
         expectedScenarioName = scenarioName;
         scenariosPage.selectTemplate(templateName);
         scenariosPage.enterScenarioName(scenarioName);
         scenariosPage.setStartDate(date);
         scenariosPage.setDuration(durationDays);
         scenariosPage.saveScenario();
      });

      Then("^The Scenario is open in the Data Home page$", () -> {
         String currentScenarioName = dataHomePage.getScenarioName();

         validator.verifyText(expectedScenarioName, currentScenarioName);
      });

      Then("^the date range message \"(.*)\" is displayed in the Data Home page$" , (String dateLabel) -> {
         String currentScenarioRange = dataHomePage.getScenarioDateRange();

         validator.verifyText(dateLabel, currentScenarioRange);
      });

      When("^I set duration to \"(.*)\" days$", (String duration) -> {
         scenariosPage.setDuration(duration);
      });

     When("^I can see list of Scenarios$", () -> {
       scenariosPage.checkScenarioNameList();
     });

     When("^I can see Scenarios have statuses as Edit or Open or Read-Only$", () -> {
       scenariosPage.checkScenarioStatus();
     });

     When("^I can see Scenarios have statuses as Read-Only$", () -> {
       scenariosPage.checkScenarioStatus();
     });

      Then("^The Error message \"(.*)\" is displayed$", (String errorMessage) -> {
         String currentError = scenariosPage.getDurationErrorMessage();
         validator.verifyText(errorMessage, currentError);
      });

     Then("^I verify the reference data is \"(.*)\"$", (String referenceData) -> {
       TimeUnit.SECONDS.sleep(2);
       String currentReference = scenariosPage.getCurrentReference(referenceData);
       validator.verifyText(referenceData, currentReference);
     });

     And("^I go to scenario page$", () -> {
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.goToScenarioPage();
     });

     And("^I click on hamburger menu$", () -> {
       scenariosPage.clickHamburgerMenu();
     });

     And("^I verify \"([^\"]*)\" on menu navigation bar$", (String hamburgerDetails) -> {
       scenariosPage.verifyHamburgerDrawer(hamburgerDetails);
       TimeUnit.SECONDS.sleep(1);
     });

     And("^I verify \"([^\"]*)\" not present on menu navigation bar$", (String hamburgerDetails) -> {
       scenariosPage.verifyHamburgerMenuNotPresent(hamburgerDetails);
      });

     And("^I go to template page$", () -> {
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.goToTemplatePage();
     });

     Then("^I click on Cancel button for Get Info", () -> {
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.cancelButton();
     });

      Then("^The Start Date is today$", () -> {
         String today = LocalDate.now().format(DateTimeFormatter.ofPattern(DATE_FORMAT));
         String defaultDate = scenariosPage.getDefaultStartDate();
         validator.verifyText(today, defaultDate);
      });

     When("^i Set the start date as \"([^\"]*)\"$", (String date) -> {
       scenariosPage.setStartDate(date);
     });

      Then("^The date range is computed correctly for the following durations:$", (DataTable durationTable) -> {
         List<Integer> durations = durationTable.asList(Integer.class);
         LocalDate startDate = LocalDate.parse(scenariosPage.getDefaultStartDate(), DateTimeFormatter.ofPattern(DATE_FORMAT));

         for (Integer duration : durations) {
            scenariosPage.setDuration(duration.toString());

            String currentRange = scenariosPage.getDatesPeriod();

            String expectedRange = getFormattedRange(startDate, duration);

            expectedRange= expectedRange.replace(".", "");

            validator.verifyText(expectedRange, currentRange);
         }
      });
   }

   private void getInfoSteps() {
      Given("^I open the Scenario drawer for Scenario \"(.*)\" and verify that Get/Edit Info, Save as Template and Delete option is enabled$", (String scenarioName) -> {
        TimeUnit.SECONDS.sleep(2);
         scenariosPage.openOptionsMenu(scenarioName);
        TimeUnit.SECONDS.sleep(2);
         scenariosPage.verifyGetInfoOption();
      });

     When("^I open the Scenario drawer for Scenario \"([^\"]*)\"$", (String scenarioName) -> {
       TimeUnit.SECONDS.sleep(1);
       scenariosPage.openOptionsMenu(scenarioName);
      });

     When("^I verify that option \"([^\"]*)\" is disabled$", (String scenarioOptions) -> {
       TimeUnit.SECONDS.sleep(1);
       scenariosPage.verifyScenarioOptionDisabled(scenarioOptions);
     });

     When("^I verify that option \"([^\"]*)\" is enabled", (String scenarioOptions) -> {
       TimeUnit.SECONDS.sleep(1);
       scenariosPage.verifyScenarioOptionEnabled(scenarioOptions);
       TimeUnit.SECONDS.sleep(3);
     });

     When("^I update the description as \"([^\"]*)\"$", (String newDescription) -> {
       TimeUnit.SECONDS.sleep(1);
       scenariosPage.updateDescription(newDescription);
       scenariosPage.saveScenario();
     });

     When("^I verify that the Scenario Name field is disabled", () -> {
       TimeUnit.SECONDS.sleep(3);
       scenariosPage.verifyEditScenarioNameDisabled();
     });

     When("^I verify that the Description field is disabled and i click on Cancel button", () -> {
       scenariosPage.verifyEditScenarioDescriptionDisabled();
     });

     Given("^I open the Scenario Info drawer for Scenario \"(.*)\"$", (String scenarioName) -> {
       scenariosPage.clickOnFilterCreatedByAnyone();
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.openOptionsMenu(scenarioName);
       TimeUnit.SECONDS.sleep(2);
       scenariosPage.openInfoForm();
     });

     Given("^I click on Get/Edit Info option$", () -> {
       scenariosPage.openInfoForm();
     });

      When("^I modify the Scenario name to \"(.*)\"$", (String newScenarioName) -> {
         scenariosPage.enterNewScenarioName(newScenarioName);
         scenariosPage.saveScenario();
         TimeUnit.SECONDS.sleep(2);
      });

      Then("^The Scenario name \"(.*)\" is updated in the table$", (String scenarioName) -> {
         List<String> scenarios = scenariosPage.getScenariosFromTable("Name");

         validator.verifyElementInList(scenarios, scenarioName, true);
      });
   }

   private void deleteScenarioSteps() {
      Given("^I open the Actions menu for the Scenario \"(.*)\"$", (String scenarioName) -> {
       scenariosPage.clickOnFilterCreatedByAnyone();
        TimeUnit.SECONDS.sleep(3);
        scenariosPage.openOptionsMenu(scenarioName);
      });
     When("^I open the Actions menu for the Scenario \"([^\"]*)\"\\.$", (String scenarioName) -> {
       scenariosPage.clickOnFilterCreatedByAnyone();
       TimeUnit.SECONDS.sleep(3);
       scenariosPage.openOptionsMenu(scenarioName);
     });

      When("^I delete the Scenario$", () -> {
         scenariosPage.deleteScenario();
         scenariosPage.confirmDelete();
      });

      Then("^The Scenario \"(.*)\" is deleted from the list$", (String scenarioName) -> {
         TimeUnit.SECONDS.sleep(2);

         List<String> scenarios = scenariosPage.getScenariosFromTable("Name");

         validator.verifyElementInList(scenarios, scenarioName, false);
      });
   }

   private void errorHandlingSteps() {
      Then("^the snackbar message \"(.*)\" for scenarios is displayed$", (String snackbarMessage) -> {
         String currentMessange = scenariosPage.getSnackbarMessage();
         validator.verifyText(snackbarMessage, currentMessange);
      });
   }

   private void saveAsTemplateSteps() {
      Given("I select 'Save as Template' for Scenario \"(.*)\"", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
      TimeUnit.SECONDS.sleep(3);
         scenariosPage.openOptionsMenu(scenarioName);
         scenariosPage.openSaveAsTemplateForm();
      });

      When("I fill out the form for the \"(.*)\" Template with category \"(.*)\" and  \"(.*)\" as description" , (String name, String category, String description) -> {
         Template template = new Template();
         template.setName(name);
         template.setCategory(category);
         template.setDescription(description);

         templatesPage.fillOutTemplateForm(template);
      });

      And("I click on the 'CREATE' button", () -> {
         templatesPage.addTemplate();
      });
   }

   private String getFormattedRange(LocalDate startDate, Integer duration) {
      LocalDate endDate = startDate.plusDays(duration - 1);
      boolean sameYear = startDate.getYear() == endDate.getYear();
      boolean sameMonth = startDate.getMonthValue() == endDate.getMonthValue();

      String startFormatted = startDate.format(DateTimeFormatter.ofPattern(sameYear ? DATE_MONTH_FORMAT : DATE_LONG_FORMAT));
      String endFormatted = endDate.format(DateTimeFormatter.ofPattern(sameYear && sameMonth ? DATE_DAY_YEAR_FORMAT : DATE_LONG_FORMAT));

      return String.format("(%s - %s)", startFormatted, endFormatted).toUpperCase();
   }

   private void verifyScenariosOwner(DataTable users, Boolean isNameInTable) {
      List<String> scenariosOwners = scenariosPage.getScenariosFromTable("Created By");

      for (String user : users.asList(String.class)) {
         validator.verifyScenariosBelongsToUser(scenariosOwners, user, isNameInTable);
      }
   }

}
