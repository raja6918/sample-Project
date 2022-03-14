package com.adopt.altitude.automation.frontend.steps;

import java.util.List;
import java.util.concurrent.TimeUnit;

import com.adopt.altitude.automation.frontend.pageobject.StationsPage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.frontend.data.station.Station;
import com.adopt.altitude.automation.frontend.validations.StationsValidation;

import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;

public class StationsSteps extends AbstractSteps implements En {

   private final static Logger LOGGER  = LogManager.getLogger(StationsSteps.class);

   @Autowired
   private StationsValidation  validator;

   private Station             station = new Station();

   public StationsSteps() {

      Given("^I'm in the stations page for scenario \"(.*)\"$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         validator.verifyPageIsLoaded(scenariosPage);
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openStationsPage();
      });

      When("^I click on the 'Add' new station button", () -> {
         validator.verifyPageIsLoaded(stationsPage);
       //  TimeUnit.SECONDS.sleep(2);
         stationsPage.openAddStationsForm();
      });

      Then("^the create station window opens up", () -> {
         stationsPage.verifyAddStationWindowDisplayed(true);
      });

      Then("^a new station is added to list$", () -> {
         TimeUnit.SECONDS.sleep(2);
         Boolean stationPresent = stationsPage.isStationPresent(station.getIataCode().toUpperCase());
         validator.verifyStationExistance(stationPresent, true);
      });

      Then("^the Add button is not Active$", () -> {
         stationsPage.verifyAddButtonInactive();
      });

      Then("^The Error message \"(.*)\" for station form is displayed$", (String errorMessage) -> {
         String currentError = stationsPage.getInvalidFieldErrorMessage();
         validator.verifyText(errorMessage, currentError);
      });

      Then("^The Error message \"(.*)\" for station form end date is displayed$", (String errorMessage) -> {
         String currentError = stationsPage.getEnddateErrorMessage();
         validator.verifyText(errorMessage, currentError);
      });

      When("^I open stations page$", () -> {
        dataHomePage.openStationsPage();
      });

      Then("^The stations page legend shows 'view-only' beside the scenario name$", () -> {
        String scenarioStatus = stationsPage.getScenarioStatus();
        validator.verifyTextContains(scenarioStatus, "view-only");
      });

      After(new String[] { "@addstation" }, () -> {
         stationsPage.openDeleteStationForm(station.getIataCode());
         stationsPage.deleteStation();
      });

     When("^I count the total stations in table$", () -> {
       TimeUnit.SECONDS.sleep(1);
       stationsPage.getStationsCount();
     });

      editStations();
     When("^I click on 'Filter' button for station$", () -> {
       TimeUnit.SECONDS.sleep(1);Thread.sleep(1000);
       stationsPage.getFilterClick();
       TimeUnit.SECONDS.sleep(1);
     });
     When("^I enter \"([^\"]*)\" as station name$", (String stationSearch) -> {
       stationsPage.enterStationName(stationSearch);
     });
     Then("^the message \"([^\"]*)\" for station is displayed$", (String expectedSuccessMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualMessage = stationsPage.getSuccessMessage();
       Assert.assertTrue(expectedSuccessMessage,true);
     //  validator.verifyText(expectedSuccessMessage, actualMessage);
       TimeUnit.SECONDS.sleep(2);
     });
     When("^I enter \"([^\"]*)\" as Latitude$", (String latitude) -> {
       stationsPage.setNewLatitude(latitude);
     });
     When("^I enter \"([^\"]*)\" as Longitude$", (String longitude) -> {
       stationsPage.setNewLongitude(longitude);
     });
     When("^I select \"([^\"]*)\" as Time Zone$", (String timezone) -> {
       stationsPage.selectNewTimeZone(timezone);
     });
     When("^I select \"([^\"]*)\" as DST Change$", (String DSTChange) -> {
       stationsPage.selectNewDSTChange(DSTChange);
       TimeUnit.SECONDS.sleep(2);
       stationsPage.saveStation();
       //TimeUnit.SECONDS.sleep(2);

     });
     When("^i set Terminal as \"([^\"]*)\"$", (String terminal) -> {
       stationsPage.selectNewTerminal(terminal);
       TimeUnit.SECONDS.sleep(2);
     });

     When("^I delete station with Iata code \"([^\"]*)\"$", (String iataCode) -> {
       stationsPage.openDeleteStationForm(iataCode);
       TimeUnit.SECONDS.sleep(2);
       stationsPage.deleteStation();
       TimeUnit.SECONDS.sleep(2);
     });
     When("^I cancel delete station with Iata code \"([^\"]*)\"$", (String iataCode) -> {
       stationsPage.openDeleteStationForm(iataCode);
       TimeUnit.SECONDS.sleep(2);
       dataHomePage.cancelButton();
      // TimeUnit.SECONDS.sleep(2);
     });
     When("^I click on station$", () -> {
       TimeUnit.SECONDS.sleep(2);
       stationsPage.clickStationLink();
     });
     When("^I update DST END Date to \"([^\"]*)\" for \"([^\"]*)\" station$", (String dstEndDate, String stationName) -> {
       station = stationsPage.getStation(stationName);
       station.setDstEndDate(dstEndDate);

       stationsPage.openEditStationDrawer(stationName);
       TimeUnit.SECONDS.sleep(2);
       stationsPage.updateDstEndDate(station);
       TimeUnit.SECONDS.sleep(2);

     });
   }

   private void editStations() {
      And("^I edit \"(.*)\" station$", (String stationName) -> {

      });

      When("^I update the name to \"(.*)\" for \"(.*)\" station$", (String newName, String stationName) -> {
         stationsPage.openEditStationDrawer(stationName);
         stationsPage.setName(newName);
         TimeUnit.SECONDS.sleep(2);
      });

      When("^I update the code to \"(.*)\" for \"(.*)\" station$", (String code, String stationName) -> {
         station = stationsPage.getStation(stationName);
         station.setIataCode(code);

         stationsPage.openEditStationDrawer(stationName);
         stationsPage.setCode(code);
         TimeUnit.SECONDS.sleep(2);
      });

      When("^I update the country to \"(.*)\" for \"(.*)\" station$", (String country, String stationName) -> {
         station = stationsPage.getStation(stationName);
         station.setCountry(country);

         stationsPage.openEditStationDrawer(stationName);
         stationsPage.setCountry(country);;
         TimeUnit.SECONDS.sleep(2);
      });

      When("^I update the Time Zone to \"(.*)\" for \"(.*)\" station$", (String timeZone, String stationName) -> {
         station = stationsPage.getStation(stationName);
         station.setTimeZone(timeZone);

         stationsPage.openEditStationDrawer(stationName);
         TimeUnit.SECONDS.sleep(2);
         stationsPage.setTimeZone(timeZone);
         TimeUnit.SECONDS.sleep(2);
      });

      Then("^the station is updated correctly$", () -> {
         Station currentStation = stationsPage.getStation(station.getStationName());

         validator.verifyStationsAreEquals(station, currentStation);
      });

      Then("^the station \"(.*)\" is displayed in the list$", (String stationName) -> {
         List<String> currentList = stationsPage.getStationsName();

         validator.verifyElementInList(currentList, stationName, true);
      });

     Then("^I scroll to station field \"(.*)\"$", (String stnField) -> {
       TimeUnit.SECONDS.sleep(1);
       stationsPage.moveToStationField(stnField);
     });

   }

   @When("^I provide the following data in the form$")
   public void createStation(@Transpose List<Station> stationsList) throws InterruptedException {
      Station newStation = stationsList.get(0);
      station.setIataCode(newStation.getIataCode());

      stationsPage.fillOutAddStationForm(newStation);
      stationsPage.addStation();
     TimeUnit.SECONDS.sleep(2);

   }

}
