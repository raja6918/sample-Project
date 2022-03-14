package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.coterminal.Coterminal;
import com.adopt.altitude.automation.frontend.data.extraTime.ExtraTime;
import com.adopt.altitude.automation.frontend.validations.CoterminalsValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class CoterminalsSteps extends AbstractSteps implements En {

  private Coterminal coterminal = new Coterminal();

  @Autowired
  private CoterminalsValidation validator;

  public CoterminalsSteps() {

    Given("^I'm in the coterminals page for scenario \"(.*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openCoterminalsPage();
    });

    Then("^a new coterminal is added to list$", () -> {
      Coterminal coterminalFromList = coterminalsPage.getCoterminal(coterminal.getTransportName());
      validator.verifyCoterminalsAreEquals(coterminal, coterminalFromList);
    });

    And("^I open the add new coterminal drawer$", () -> {
      coterminalsPage.openNewCoterminalDrawer();
    });

    When("^I enter \"(.*)\" coterminal name$", (String name) -> {
      coterminalsPage.setCoterminalName(name);
    });

    When("^I enter \"(.*)\" maximum passengers", (String capacity) -> {
      coterminalsPage.setMaximumPassengers(capacity);
    });

    When("^I enter \"(.*)\" transport time", (String time) -> {
      coterminalsPage.setTransportTime(time);
    });

    When("^I enter \"(.*)\" connection time before", (String time) -> {
      coterminalsPage.setConnectionTimeBefore(time);
    });

    When("^I enter \"(.*)\" connection time after", (String time) -> {
      coterminalsPage.setConnectionTimeAfter(time);
    });

    When("^I enter \"(.*)\" transport cost", (String cost) -> {
      coterminalsPage.setTransportCost(cost);
    });

    When("^I enter \"(.*)\" credit cost", (String cost) -> {
      coterminalsPage.setCreditCost(cost);
    });

    Then("^the message \"(.*)\" for coterminal form is displayed$", (String message) -> {
      String currentError = coterminalsPage.getErrorMessage();

      validator.verifyText(message, currentError);
    });

    And("^I add the coterminal transport$", () -> {
      TimeUnit.SECONDS.sleep(2);
      coterminalsPage.addNewCoterminal();
    });

    When("^I enter \"(.*)\" extra time$", (String time) -> {
      coterminalsPage.clickAddExtraTimeButton();
      coterminalsPage.setExtraTime(time);
    });

    When("^I click Add Extra time (.*) times$", (Integer count) -> {
      for(int i=0; i<count ; i++) {
        coterminalsPage.clickAddExtraTimeButton();
      }
    });

    Then("^the Add Extra time button is disabled$", () -> {
      coterminalsPage.verifyExtraTimeButtonDisabled();
    });

    When("^I open coterminals page$", () -> {
      dataHomePage.openCoterminalsPage();
    });

    Then("^The coterminals page legend shows 'view-only' beside the scenario name$", () -> {
      String scenarioStatus = coterminalsPage.getScenarioStatus();
      validator.verifyTextContains(scenarioStatus, "view-only");
    });

    When("^I count the total coterminals in table$", () -> {
      TimeUnit.SECONDS.sleep(1);
      coterminalsPage.getCoterminalsCount();
    });

    EditCoterminal();
      When("^I delete the coterminal \"([^\"]*)\"$", (String coterminal) -> {
        coterminalsPage.openDeleteCoterminal(coterminal);
        coterminalsPage.deleteCoterminalConfirmation();
      });

    Then("^the message \"([^\"]*)\" for coterminal is displayed as expected$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = coterminalsPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

    And("^I cancel delete coterminal \"([^\"]*)\"$", (String coterminal) -> {
      coterminalsPage.openDeleteCoterminal(coterminal);
      coterminalsPage.cancelDeleteCoterminal();
    });

    Then("^verify successfully that no deletion happens for coterminal$", () -> {
      crewBasesPage.verifyNoSuccessMessage();
    });
  }

    @When("^I enter the following data for a coterminal$")
    public void createCoterminal(@Transpose List<Coterminal> coterminalList) throws Exception {
      Coterminal newCoterminal = coterminalList.get(0);

      coterminal.setTransportName(newCoterminal.getTransportName());
      String departureStationCode = getStationCode(newCoterminal.getDepartureStation());
      coterminal.setDepartureStation(departureStationCode);
      String arrivalStationCode = getStationCode(newCoterminal.getArrivalStation());
      coterminal.setArrivalStation(arrivalStationCode);
      coterminal.setTransportType(newCoterminal.getTransportType());

      coterminalsPage.openNewCoterminalDrawer();

      coterminalsPage.fillOutAddCoterminalForm(newCoterminal);
    }

    @And("^I add the following extra times$")
    public void addExtraTime(@Transpose List<ExtraTime> extraTimeList) throws Exception {
      Integer index = 0;
      for(ExtraTime extraTime: extraTimeList) {
        coterminalsPage.fillOutExtraTimes(extraTime, index);
        index++;
      }

    }

  public void EditCoterminal() {
    When("^I update the name to \"(.*)\" for coterminal \"(.*)\"$", (String newName, String coterminalName) -> {
      coterminal = coterminalsPage.getCoterminal(coterminalName);

      coterminal.setTransportName(newName);
      coterminalsPage.openEditCoterminalDrawer(coterminalName);
      coterminalsPage.setName(newName);
      coterminalsPage.saveCoterminal();
      TimeUnit.SECONDS.sleep(2);
    });

    When("^I update the coterminals type to \"(.*)\" for coterminal \"(.*)\"$", (String newType, String coterminalName) -> {
      coterminal = coterminalsPage.getCoterminal(coterminalName);

      coterminal.setTransportType(newType);
      coterminalsPage.openEditCoterminalDrawer(coterminalName);
      TimeUnit.SECONDS.sleep(1);
      coterminalsPage.setType(newType);
      coterminalsPage.saveCoterminal();
      TimeUnit.SECONDS.sleep(2);
    });

    When("^I update the coterminals departure station to \"(.*)\" and arrival station to \"(.*)\" for coterminal \"(.*)\"$", (String departureStation, String arrivalStation, String coterminalName) -> {
      coterminal = coterminalsPage.getCoterminal(coterminalName);

      coterminal.setDepartureStation(departureStation);
      coterminal.setArrivalStation(arrivalStation);
      coterminalsPage.openEditCoterminalDrawer(coterminalName);
      coterminalsPage.selectDepartureStation(departureStation);
      coterminalsPage.selectArrivalStation(arrivalStation);
      coterminalsPage.saveCoterminal();
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^the updated coterminal is displayed in the coterminals list$", () -> {
      Coterminal currentCoterminal = coterminalsPage.getCoterminal(coterminal.getTransportName());

      validator.verifyCoterminalsAreEquals(coterminal, currentCoterminal);
    });

  }

    private String getStationCode(String station) {
      String[] splitSpace = station.split(" ");
      String code = splitSpace[0].replaceAll("[()]", "");
      return code;
    }
}
