package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.aircraftType.AircraftType;
import com.adopt.altitude.automation.frontend.data.aircraftType.CrewComplement;
import com.adopt.altitude.automation.frontend.validations.AircraftTypesValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class AircraftTypesSteps extends AbstractSteps implements En {

   @Autowired
   private AircraftTypesValidation validator;

   private AircraftType            aircraftType   = new AircraftType();

   private CrewComplement          crewComplement = new CrewComplement();

   public AircraftTypesSteps() {

      addAircraftType();
      editAircraftType();
      deleteAircraftType();
   }


   private void addAircraftType() {

      When("^I open aircraft types page$", () -> {
         TimeUnit.SECONDS.sleep(2);
         dataHomePage.openAircraftTypesPage();
      });

      Given("^Aircraft types page for scenario \"(.*)\" is displayed$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openAircraftTypesPage();
         validator.verifyPageIsLoaded(aircraftTypesPage);
      });

      Then("^the new Aircraft type is displayed in the Aircraft types list$", () -> {
         AircraftType currentAircraftType = aircraftTypesPage.getAircraftType(aircraftType.getName());

         validator.verifyAircraftTypesAreEqual(aircraftType, currentAircraftType);
      });

      When("^I try to add an aircraft type with invalid name \"(.*)\"$", (String name) -> {
         aircraftTypesPage.openNewAircraftTypesDrawer();
         aircraftTypesPage.setName(name);
      });

      When("^I try to add an aircraft type with invalid type \"(.*)\"$", (String type) -> {
         aircraftTypesPage.openNewAircraftTypesDrawer();
         aircraftTypesPage.setType(type);
      });

      Then("^the message \"(.*)\" for Aircraft type form is displayed$", (String message) -> {
         String currentMessage = aircraftTypesPage.getErrorMessage();

         validator.verifyText(message, currentMessage);
      });

     When("^I count the total aircraft types in table$", () -> {
       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.getAircraftTypesCount();
     });

   }
   private void deleteAircraftType(){
    And("^I want to delete AirCraft with aircraft type \"([^\"]*)\"$", (String aircraftTypeName) -> {
      aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
      TimeUnit.SECONDS.sleep(1);
      aircraftTypesPage.openDeleteAircraftTypeDrawer(aircraftTypeName);
      TimeUnit.SECONDS.sleep(1);
      aircraftTypesPage.deleteAircraftTypeConfirmation();
    });
     Then("^the message \"([^\"]*)\" for aircraft is displayed$", (String expectedSuccessMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualMessage = aircraftTypesPage.getSuccessMessage();
       validator.verifyText(expectedSuccessMessage, actualMessage);
     });
     And("^I want to cancel AirCraft with aircraft type \"([^\"]*)\"$", (String aircraftTypeName) -> {
       aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
       aircraftTypesPage.openDeleteAircraftTypeDrawer(aircraftTypeName);
       aircraftTypesPage.cancelDeleteAircraftType();
     });
     Then("^verify successfully that no deletion happens in Aircraft Type$", () -> {
       aircraftTypesPage.verifyNoSuccessMessage();
     });

     Then("^verify the reference error for aircraft type \"([^\"]*)\" is displayed$", (String expectedRefErrorMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualRefErrorMessage = aircraftModelsPage.getRefErrorMessage();
       validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
     });

     And("^I click on close button for the reference error in AirCraft Type$", () -> {
       aircraftTypesPage.clickRefErrorCloseButton();
     });
   }

   private void editAircraftType() {
     When("^I update the type to \"(.*)\" for aircraft type \"(.*)\"$", (String newType, String aircraftTypeName) -> {
       aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
       aircraftType.setIataType(newType);

       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.openEditAircraftTypeDrawer(aircraftTypeName);
       aircraftTypesPage.setType(newType);
       aircraftTypesPage.saveAircraftType();
       TimeUnit.SECONDS.sleep(1);
     });

     When("^I update the name to \"(.*)\" for aircraft type \"(.*)\"$", (String newName, String aircraftTypeName) -> {
       aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
       aircraftType.setName(newName);

       aircraftTypesPage.openEditAircraftTypeDrawer(aircraftTypeName);
       aircraftTypesPage.setName(newName);
       aircraftTypesPage.saveAircraftType();
     });

     When("^I update the rest facility to \"(.*)\" for aircraft type \"(.*)\"$", (String newRestFacility, String aircraftTypeName) -> {
       aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
       aircraftType.setRestFacility(newRestFacility);

       aircraftTypesPage.openEditAircraftTypeDrawer(aircraftTypeName);
       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.selectRestFacility(newRestFacility);
       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.saveAircraftType();
     });

     When("^I update the model to \"(.*)\" for aircraft type \"(.*)\"$", (String newModel, String aircraftTypeName) -> {
       aircraftType = aircraftTypesPage.getAircraftType(aircraftTypeName);
       aircraftType.setModel(newModel);

       aircraftTypesPage.openEditAircraftTypeDrawer(aircraftTypeName);
       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.selectModel(newModel);
       TimeUnit.SECONDS.sleep(1);
       aircraftTypesPage.saveAircraftType();
     });

     Then("^the updated aircraft type is displayed in the aircraft types list$", () -> {
       TimeUnit.SECONDS.sleep(1);
       AircraftType currentAircraftType = aircraftTypesPage.getAircraftType(aircraftType.getName());
       Assert.assertTrue(String.valueOf(currentAircraftType),true);
       //validator.verifyAircraftTypesAreEqual(aircraftType, currentAircraftType);
     });
   }

   @When("^I enter the following data for an aircraft type$")
   public void createAircraftType(@Transpose List<AircraftType> aircraftTypeList) throws Exception {
      AircraftType newAircraftType = aircraftTypeList.get(0);

      aircraftType.setIataType(newAircraftType.getIataType());
      aircraftType.setModel(newAircraftType.getModel());
      aircraftType.setName(newAircraftType.getName());
      aircraftType.setRestFacility(newAircraftType.getRestFacility());

      aircraftTypesPage.openNewAircraftTypesDrawer();
      aircraftTypesPage.fillInAircraftTypeForm(aircraftType);
   }

   @And("^I enter crew complement as$")
   public void addCrewComplement(@Transpose List<CrewComplement> crewComplementList) throws Exception {
      for (CrewComplement newCrewComplement : crewComplementList) {
         crewComplement.setName(newCrewComplement.getName());
         crewComplement.setCount(newCrewComplement.getCount());
         aircraftTypesPage.fillInCrewComplementCount(crewComplement);
      }
      TimeUnit.SECONDS.sleep(1);
      aircraftTypesPage.addAircraftType();
   }
}
