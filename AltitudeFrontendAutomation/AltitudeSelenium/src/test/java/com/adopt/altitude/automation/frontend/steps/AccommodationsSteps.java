package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.accommodation.Accommodation;
import com.adopt.altitude.automation.frontend.data.extraTime.ExtraTime;
import com.adopt.altitude.automation.frontend.validations.AccommodationsValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class AccommodationsSteps extends AbstractSteps implements En {

   private Accommodation            accommodation = new Accommodation();

   @Autowired
   private AccommodationsValidation validator;

   public AccommodationsSteps() {

      Given("^I'm in the accommodations page for scenario \"(.*)\"$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openAccomodationsPage();
        TimeUnit.SECONDS.sleep(2);
      });

      Then("^a new accommodation is added to list$", () -> {
         Accommodation accommodationFromList = accommodationsPage.getAccommodation(accommodation.getName());
         validator.verifyAccommodationsAreEquals(accommodation, accommodationFromList);
      });

      And("^I open the add new accommodation drawer$", () -> {
         accommodationsPage.openNewAccommodationDrawer();
         TimeUnit.SECONDS.sleep(2);
      });

      When("^I enter \"(.*)\" name$", (String name) -> {
         accommodationsPage.setName(name);
      });

      When("^I enter \"(.*)\" capacity$", (String capacity) -> {
         accommodationsPage.setCapacity(capacity);
      });

      When("^I enter \"(.*)\" cost$", (String cost) -> {
         accommodationsPage.setRateCost(cost);
      });

      When("^I enter \"(.*)\" cost for extended stay$", (String costExtendedStay) -> {
         accommodationsPage.setCostExtendendStay(costExtendedStay);
      });

      Then("^the message \"(.*)\" for accommodation form is displayed$", (String message) -> {
         String currentError = accommodationsPage.getErrorMessage();

         validator.verifyText(message, currentError);
      });

      And("^I select station \"(.*)\"$", (String station) -> {
        accommodationsPage.selectStation(station);
      });

      When("^I enter \"(.*)\" transit time$", (String time) -> {
        accommodationsPage.setTransitTime(time);
      });

      When("^I enter \"(.*)\" transit cost$", (String cost) -> {
        accommodationsPage.setTransitCost(cost);
      });

      And("^I add the accommodation$", () -> {
        accommodationsPage.addNewAccommodation();
      });

      When("^I enter \"(.*)\" extra time for accommodations$", (String time) -> {
        accommodationsPage.clickExpandTransitTimeSection();
        accommodationsPage.clickAddExtraTimeButton();
        accommodationsPage.setExtraTime(time);
      });

      When("^I click Add Extra time (.*) times for accommodations$",(Integer count) -> {
        accommodationsPage.clickExpandTransitTimeSection();
        for(int i=0; i<count ; i++) {
          accommodationsPage.clickAddExtraTimeButton();
        }
      });

      Then("^the Add Extra time button in accommodations is disabled$", () -> {
        validator.verifyState(false, accommodationsPage.getExtraTimeButtonDisabled());
      });

     When("^I open accommodations page$", () -> {
       dataHomePage.openAccomodationsPage();
     });

     Then("^The accommodations page legend shows 'view-only' beside the scenario name$", () -> {
       String scenarioStatus = accommodationsPage.getScenarioStatus();
       validator.verifyTextContains(scenarioStatus, "view-only");
     });

     When("^I count the total accommodations in table$", () -> {
       accommodationsPage.getAccommodationsCount();
     });

      EditAccommodation();

     When("^I delete the accommodation \"([^\"]*)\"$", (String accommodationName) -> {
       TimeUnit.SECONDS.sleep(4);
       accommodationsPage.openDeleteAccommodationDrawer(accommodationName);
       accommodationsPage.deleteAccommodationConfirmation();
     });

     When("^I click on Name sort$", () -> {
       accommodationsPage.clickName();
       TimeUnit.SECONDS.sleep(2);
     });


     Then("^verify the reference error for accommodation \"([^\"]*)\" is displayed$", (String expectedRefErrorMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualRefErrorMessage = accommodationsPage.getRefErrorMessage();
       validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
       accommodationsPage.clickRefErrorCloseButton();
     });

     Then("^the message \"([^\"]*)\" for accommodation is displayed as expected$", (String expectedSuccessMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualMessage = accommodationsPage.getSuccessMessage();
       validator.verifyText(expectedSuccessMessage, actualMessage);
     });

     And("^I cancel delete accommodation \"([^\"]*)\"$", (String accommodationName) -> {
       accommodationsPage.openDeleteAccommodationDrawer(accommodationName);
       accommodationsPage.cancelDeleteAccommodation();
     });

     Then("^verify successfully that no deletion happens for accommodation$", () -> {
       accommodationsPage.verifyNoSuccessMessage();
     });
   }

   @When("^I enter the following accommodation data with Nights Calculated By Check-in/Check-out$")
   public void createAccommodation(@Transpose List<Accommodation> accommodationList) throws Exception {
      Accommodation newAccommodation = accommodationList.get(0);

      accommodation.setName(newAccommodation.getName());
      String StationCode = getStationCode(newAccommodation.getStation());
      accommodation.setStation(StationCode);
      accommodation.setType(newAccommodation.getType());
      accommodation.setCost(newAccommodation.getCost());
      accommodation.setCurrency(newAccommodation.getCurrency());

      accommodationsPage.openNewAccommodationDrawer();

      accommodationsPage.fillOutAddAccommodationForm(newAccommodation, false);
   }

  @And("^I add the following extra times to accommodation$")
  public void addExtraTime(@Transpose List<ExtraTime> extraTimeList) throws Exception {
    Integer index = 0;
    for(ExtraTime extraTime: extraTimeList) {
      accommodationsPage.fillOutExtraTimes(extraTime, index);
      index++;
    }

  }

   public void EditAccommodation() {
      When("^I update the name to \"(.*)\" for accommodation \"(.*)\"$", (String newName, String accommodationName) -> {

         accommodation = accommodationsPage.getAccommodation(accommodationName);
         TimeUnit.SECONDS.sleep(1);
         accommodation.setName(newName);
         TimeUnit.SECONDS.sleep(1);
         accommodationsPage.openEditAccommodationDrawer(accommodationName);
         TimeUnit.SECONDS.sleep(2);
         accommodationsPage.setName(newName);
         TimeUnit.SECONDS.sleep(2);
         accommodationsPage.saveAccommodation();
         TimeUnit.SECONDS.sleep(2);
      });

      When("^I update the accommodations type to \"(.*)\" for accommodation \"(.*)\"$", (String newType, String accommodationName) -> {

         accommodation = accommodationsPage.getAccommodation(accommodationName);

         accommodation.setType(newType);
         accommodationsPage.openEditAccommodationDrawer(accommodationName);
         accommodationsPage.setType(newType);
         accommodationsPage.saveAccommodation();
         TimeUnit.SECONDS.sleep(1);
      });

      When("^I update the accommodations nightly rate to \"(.*)\" in currency \"(.*)\" for accommodation \"(.*)\"$", (String rateCost, String currency, String accommodationName) -> {

         accommodation = accommodationsPage.getAccommodation(accommodationName);

         accommodation.setCost(rateCost);
         accommodation.setCurrency(currency);
         accommodationsPage.openEditAccommodationDrawer(accommodationName);
         accommodationsPage.setRateCost(rateCost);
         accommodationsPage.selectCurrency(currency);
         accommodationsPage.saveAccommodation();
         TimeUnit.SECONDS.sleep(1);
      });

      When("^I update the accommodations rooms capacity to \"(.*)\" for accommodation \"(.*)\"$", (String capacity, String accommodationName) -> {

         accommodation = accommodationsPage.getAccommodation(accommodationName);

         accommodation.setCapacity(capacity);
         accommodationsPage.openEditAccommodationDrawer(accommodationName);
         accommodationsPage.setCapacity(capacity);
         accommodationsPage.saveAccommodation();
      });

      Then("^the updated accommodation is displayed in the accommodations list$", () -> {
         Accommodation currentAccommodation = accommodationsPage.getAccommodation(accommodation.getName());

         validator.verifyAccommodationsAreEquals(accommodation, currentAccommodation);
      });
   }

   private String getStationCode(String station) {
      String[] splitSpace = station.split(" ");
      String code = splitSpace[0].replaceAll("[()]", "");
      return code;
   }
}
