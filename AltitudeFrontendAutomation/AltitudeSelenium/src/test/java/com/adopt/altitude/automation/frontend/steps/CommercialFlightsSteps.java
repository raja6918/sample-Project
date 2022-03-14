package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.commercialFlights.CommercialFlights;
import com.adopt.altitude.automation.frontend.validations.CommercialFlightsValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class CommercialFlightsSteps extends AbstractSteps implements En {

  private CommercialFlights commercialFlights = new CommercialFlights();

  @Autowired
  private CommercialFlightsValidation validator;

  public CommercialFlightsSteps() {

    Given("^I'm in the Commercial Flight page for scenario \"([^\"]*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openCommercialFlightsPage();
    });

    And("^I open the add new commercial flight drawer$", () -> {
      commercialFlightsPage.openNewCommercialDrawer();
    });

    When("^I open commercial flights page$", () -> {
      dataHomePage.openCommercialFlightsPage();
    });

    When("^I enter \"(.*)\" flight as commercial flight number$", (String flight) -> {
      commercialFlightsPage.setFlight(flight);
    });

    Then("^the message \"(.*)\" for commercial flight form is displayed$", (String message) -> {
      String currentError = commercialFlightsPage.getErrorMessage();
      validator.verifyText(message, currentError);
    });

    When("^I enter \"(.*)\" suffix for commercial flight$", (String suffix) -> {
      commercialFlightsPage.setSuffix(suffix);
    });

    When("^I enter \"(.*)\" cabin configuration for commercial flight$", (String cabinConfiguration) -> {
      commercialFlightsPage.setCabinConfiguration(cabinConfiguration);
    });

    When("^I enter \"(.*)\" aircraft for commercial flight$", (String aircraft) -> {
      commercialFlightsPage.setAircraft(aircraft);
    });

    When("^I enter \"(.*)\" airline code for commercial flight$", (String aircraft) -> {
      commercialFlightsPage.setAirlineCode(aircraft);
    });

    And("^I add the Commercial Flight$", () -> {
      commercialFlightsPage.addNewCommercialFlight();
    });

    Then("^A new Commercial Flight is added to list$", () -> {
      CommercialFlights commercialFlightsFromList = commercialFlightsPage.getCommercialFlight(commercialFlights.getFlight());
      validator.verifyCommercialFlightsAreEqual(commercialFlights, commercialFlightsFromList);
    });

    EditCommercialFlights();
  }

  @When("^I entered the following data for Commercial Flight$")
  public void createCommercialFlights(@Transpose List<CommercialFlights> commercialFlightsList) throws Exception {
    CommercialFlights newCommercialFlight = commercialFlightsList.get(0);

    commercialFlights.setAirline(newCommercialFlight.getAirline());
    commercialFlights.setFlight(newCommercialFlight.getFlight());
    commercialFlights.setSuffix(newCommercialFlight.getSuffix());
    commercialFlights.setFromStation(newCommercialFlight.getFromStation());
    commercialFlights.setTerminalFrom(newCommercialFlight.getTerminalFrom());
    commercialFlights.setToStation(newCommercialFlight.getToStation());
    commercialFlights.setTerminalTo(newCommercialFlight.getTerminalTo());
    commercialFlights.setDepartureTime(newCommercialFlight.getDepartureTime());
    commercialFlights.setArrivalTime(newCommercialFlight.getArrivalTime());
    commercialFlights.setAircraftType(newCommercialFlight.getFromStation());
    commercialFlights.setCabinConfiguration(newCommercialFlight.getFromStation());
    commercialFlights.setFlightDate(newCommercialFlight.getFlightDate());

    commercialFlightsPage.fillOutAddCommercialFlightsForm(newCommercialFlight);
  }


  @When("^I entered the following data for Commercial Flight for mandatory fields$")
  public void createCommercialFlightsWithMandatoryFields(@Transpose List<CommercialFlights> commercialFlightsList) throws Exception {
    CommercialFlights newCommercialFlight = commercialFlightsList.get(0);

    commercialFlights.setAirline(newCommercialFlight.getAirline());
    commercialFlights.setFlight(newCommercialFlight.getFlight());
    commercialFlights.setFromStation(newCommercialFlight.getFromStation());
    commercialFlights.setToStation(newCommercialFlight.getToStation());
    commercialFlights.setDepartureTime(newCommercialFlight.getDepartureTime());
    commercialFlights.setArrivalTime(newCommercialFlight.getArrivalTime());
    commercialFlights.setAircraftType(newCommercialFlight.getFromStation());
    commercialFlights.setFlightDate(newCommercialFlight.getFlightDate());

    commercialFlightsPage.fillOutAddCommercialFlightsFormWithMandatoryFields(newCommercialFlight);
  }

  public void EditCommercialFlights() {

    When("^I update the flight to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newFlight, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setFlight(newFlight);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setFlight(newFlight);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the airline to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newFlight, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setFlight(newFlight);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setAirlineCode(newFlight);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the suffix to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newSuffix, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setSuffix(newSuffix);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setSuffix(newSuffix);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the Aircraft Type to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newAircraftType, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setAircraftType(newAircraftType);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setAircraft(newAircraftType);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the Cabin Configuration to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newCabinConfiguration, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setCabinConfiguration(newCabinConfiguration);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setCabinConfiguration(newCabinConfiguration);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the flight date to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newFlightDate, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setFlightDate(newFlightDate);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setDate(newFlightDate);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the from terminal to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newTerminalFrom, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setTerminalFrom(newTerminalFrom);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.selectTerminalFrom(newTerminalFrom);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the to terminal to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newTerminalTo, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setTerminalTo(newTerminalTo);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.selectTerminalTo(newTerminalTo);
      commercialFlightsPage.saveCommercialFlight();
    });


    When("^I update the departure station to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newDepartureStation, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setFromStation(newDepartureStation);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setFromStation(newDepartureStation);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the arrival station to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newArrivalStation, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setToStation(newArrivalStation);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setToStation(newArrivalStation);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the departure time to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newDepartureTime, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setDepartureTime(newDepartureTime);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setDepartureTime(newDepartureTime);
      commercialFlightsPage.saveCommercialFlight();
    });

    When("^I update the arrival time to \"([^\"]*)\" for commercial flight \"([^\"]*)\"$", (String newArrivalTime, String flight) -> {
      commercialFlights = commercialFlightsPage.getCommercialFlight(flight);

      commercialFlights.setArrivalTime(newArrivalTime);
      commercialFlightsPage.openEditCommercialFlightDrawer(flight);
      commercialFlightsPage.setArrivalTime(newArrivalTime);
      commercialFlightsPage.saveCommercialFlight();
    });

    Then("^the updated commercial flight is displayed in the commercial flights list$", () -> {
      TimeUnit.SECONDS.sleep(1);
      commercialFlightsPage.scrollAfterEdit();;
      //commercialFlightsPage.scrollToLeftSide();
      TimeUnit.SECONDS.sleep(2);
      CommercialFlights commercialFlightsFromList = commercialFlightsPage.getCommercialFlight(commercialFlights.getFlight());
      TimeUnit.SECONDS.sleep(2);
      validator.verifyCommercialFlightsAreEqualEdit(commercialFlights, commercialFlightsFromList);
    });

    When("^I delete commercial flight \"([^\"]*)\"$", (String flight) -> {
      TimeUnit.SECONDS.sleep(3);
      commercialFlightsPage.openDeleteCommercialFlight(flight);
      TimeUnit.SECONDS.sleep(1);
      commercialFlightsPage.deleteCommercialFlightConfirmation();
      TimeUnit.SECONDS.sleep(1);
    });

    Then("^the message \"([^\"]*)\" for commercial Flight is displayed$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = commercialFlightsPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

    And("^I cancel delete commercial flight \"([^\"]*)\"$", (String flight) -> {
      commercialFlightsPage.openDeleteCommercialFlight(flight);
      commercialFlightsPage.cancelDeleteCommercialFlight();
    });

    Then("^verify successfully that no deletion happens for commercial flight$", () -> {
      TimeUnit.SECONDS.sleep(5);
      commercialFlightsPage.verifyNoSuccessMessage();
    });

    When("^I count the total commercial flights in table$", () -> {
      TimeUnit.SECONDS.sleep(1);
      commercialFlightsPage.getCommercialFlightCount();
    });

  }
}



