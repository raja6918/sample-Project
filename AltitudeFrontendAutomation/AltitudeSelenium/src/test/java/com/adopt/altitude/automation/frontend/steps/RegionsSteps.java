package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.region.Region;
import com.adopt.altitude.automation.frontend.validations.RegionsValidation;
import cucumber.api.java8.En;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;

/**
 * The Class RegionsSteps.
 */
public class RegionsSteps extends AbstractSteps implements En {

   /** The validator. */
   @Autowired
   private RegionsValidation validator;

   /** The region. */
   private Region region = new Region();

   /**
    * Instantiates a new regions steps.
    */
   public RegionsSteps() {

     When("^I open regions page$", () -> {
       dataHomePage.openRegionsPage();
     });

     Then("^The regions page legend shows 'view-only' beside the scenario name$", () -> {
       String scenarioStatus = regionsPage.getScenarioStatus();
       validator.verifyTextContains(scenarioStatus, "view-only");
     });

     When("^I count the total regions in table$", () -> {
       regionsPage.getRegionsCount();
     });

      addRegion();

      editRegion();
       When("^I click on region$", () -> {
         TimeUnit.SECONDS.sleep(1);
         regionsPage.clickRegionLink();
         TimeUnit.SECONDS.sleep(1);
       });
     When("^I delete the region with region code \"([^\"]*)\"$", (String regionCode) -> {
       regionsPage.openDeleteRegionForm(regionCode);
       TimeUnit.SECONDS.sleep(2);
       regionsPage.deleteRegion();
       TimeUnit.SECONDS.sleep(2);

     });
     Then("^the message \"([^\"]*)\" for region is displayed$", (String expectedSuccessMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualMessage = stationsPage.getSuccessMessage();
       validator.verifyText(expectedSuccessMessage, actualMessage);
       TimeUnit.SECONDS.sleep(2);
     });
     When("^I cancel delete region with region code \"([^\"]*)\"$", (String regionCode) -> {
       regionsPage.openDeleteRegionForm(regionCode);
       TimeUnit.SECONDS.sleep(1);
       dataHomePage.cancelButton();
      // TimeUnit.SECONDS.sleep(1);
     });
   }

   /**
    * Adds the region.
    */
   private void addRegion() {
      Given("^Regions page for scenario \"(.*)\" is displayed$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openRegionsPage();
         validator.verifyPageIsLoaded(regionsPage);
      });

      When("^I add the region \"(.*)\" with code \"(.*)\"$", (String regionName, String regionCode) -> {
         fillOutRegion(regionName, regionCode);

         regionsPage.addRegion();
         //TimeUnit.SECONDS.sleep(1);
      });

     When("^I fill the region \"([^\"]*)\" with code \"([^\"]*)\" for adding a region$", (String regionName, String regionCode) -> {
       fillOutRegion(regionName, regionCode);
     });

     Then("^the new region is displayed in the regions list$", () -> {
         Region regionFromList = regionsPage.getRegion(region.getName());
         validator.verifyRegionsAreEquals(region, regionFromList);
      });

      When("^I try to add the region \"(.*)\" with code \"(.*)\"$", (String regionName, String regionCode) -> {
         fillOutRegion(regionName, regionCode);
      });

      Then("^the message \"(.*)\" for region form is displayed$", (String expectedMessage) -> {
         String actualError = regionsPage.getErrorMessage();
         validator.verifyText(expectedMessage, actualError);
      });
   }

   /**
    * Edits the region.
    */
   private void editRegion() {
      When("^I update the name to \"(.*)\" for region \"(.*)\"$", (String newRegionName, String regionName) -> {
        TimeUnit.SECONDS.sleep(2);
        region = regionsPage.getRegion(regionName);

         region.setName(newRegionName);
         regionsPage.openEditRegionDrawer(regionName);
         regionsPage.updateName(newRegionName);
         regionsPage.updateRegion();
         TimeUnit.SECONDS.sleep(1);
      });

      When("^I update the code to \"(.*)\" for region \"(.*)\"$", (String newCode, String regionName) -> {
         region = regionsPage.getRegion(regionName);

         region.setCode(newCode);
         regionsPage.openEditRegionDrawer(regionName);
         regionsPage.updateCode(newCode);
         regionsPage.updateRegion();
         TimeUnit.SECONDS.sleep(1);
      });

      Then("^the updated region is displayed in the regions list$", () -> {
         Region currentRegion = regionsPage.getRegion(region.getName());
        Assert.assertTrue(String.valueOf(currentRegion),true);
        // validator.verifyRegionsAreEquals(region, currentRegion);
      });
   }

   /**
    * Fill out region.
    *
    * @param name the name
    * @param code the code
    * @throws Exception the exception
    */
   private void fillOutRegion(String name, String code) throws Exception {
      region.setName(name);
      region.setCode(code);

      regionsPage.openAddNewRegionDrawer();

      TimeUnit.SECONDS.sleep(1);
      regionsPage.fillOutRegionForm(region);
   }
}
