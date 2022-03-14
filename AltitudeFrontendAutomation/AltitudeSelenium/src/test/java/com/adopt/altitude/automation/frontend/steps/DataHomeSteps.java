package com.adopt.altitude.automation.frontend.steps;

import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;

import java.util.concurrent.TimeUnit;

public class DataHomeSteps extends AbstractSteps implements En {

  /**
   * The Constant LOGGER.
   */
  private final static Logger LOGGER = LogManager.getLogger(DataHomeSteps.class);

  public String dataTilesCount;

  public String dataSource;

  public DataHomeSteps() {
    When("^I see the total count of accommodations$", () -> {
      dataTilesCount = dataHomePage.getAccommodationsCount();
    });

    Then("^The data tiles and table counts are equal$", () -> {
      dataHomePage.verifyCountsAreEqual(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For Accommodation$", () -> {
      dataHomePage.verifyCountsAreEqualForAccomodation(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For countries$", () -> {
      dataHomePage.verifyCountsAreEqualForCountry(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For currencies$", () -> {
      dataHomePage.verifyCountsAreEqualForCurrency(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal for stations$", () -> {
      dataHomePage.verifyCountsAreEqualForStation(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal for operating flight$", () -> {
      dataHomePage.verifyCountsAreEqualForOPFlight(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal for commercial flight$", () -> {
      dataHomePage.verifyCountsAreEqualForCommercialFlight(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For Position$", () -> {
      dataHomePage.verifyCountsAreEqualForPosition(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For Rule$", () -> {
      dataHomePage.verifyCountsAreEqualForRule(dataTilesCount);
    });

    Then("^The data tiles and table counts are equal For Region", () -> {
      dataHomePage.verifyCountsAreEqualForRegion(dataTilesCount);
    });

    When("^I see the total count of aircraft types", () -> {
      dataTilesCount = dataHomePage.getAircraftTypesCount();
    });

    When("^I see the total count of coterminal transports", () -> {
      dataTilesCount = dataHomePage.getCoterminalsCount();
    });

    When("^I see the total count of countries", () -> {
      dataHomePage.readCountryDataCard();
      dataTilesCount = dataHomePage.getCountriesCount();
    });

    When("^I verify that i can see a list of all records in the table", () -> {
      dataHomePage.verifyDataTableRecordCount();
    });

    And("^I verify that add button is visible and disabled.$", () -> {
      dataHomePage.verifyAddButtonDisabled();
    });
    And("^I verify that add button is disabled and visible and Perform the operations based on count$", () -> {
      dataHomePage.verifyAddButtonDisabled();
      TimeUnit.SECONDS.sleep(2);
      String value = operatingFlightsPage.getOperatingFlightCountAndPerformOperations();
      TimeUnit.SECONDS.sleep(2);
      if (!(value.equals("0"))) {
        dataHomePage.verifyDataTableRecordCount();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.clickFirstInfoButton();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.verifyAllFields();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.clickCloseButton();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.checkFilterDataCard("Ar11", "Operating Flights");
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.verifyDataTableDelete();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.verifyDataTableInfoButton();
        TimeUnit.SECONDS.sleep(2);
        dataHomePage.sortData("Operating Flights");
      } else {

      }
    });

    And("^I verify that all the delete icon is visible and disabled$", () -> {
      dataHomePage.verifyDataTableDelete();
    });

    And("^I verify that all the pencil icon is replaced with the info icon$", () -> {
      dataHomePage.verifyDataTableInfoButton();
    });

    And("^I verify that all the fields are disabled$", () -> {
      dataHomePage.verifyAllFields();
    });

    And("^I see that Close button is displayed at the bottom of the right pan and i click on close button$", () -> {
      dataHomePage.clickCloseButton();
    });

    And("^I click on the info icon$", () -> {
      dataHomePage.clickFirstInfoButton();
    });

    And("^I click on the filter and send input as \"(.*)\" and confirm that filter is working fine for \"(.*)\"$", (String inputString, String dataCard) -> {
      dataHomePage.checkFilterDataCard(inputString, dataCard);
    });

    And("^I click on data card link \"(.*)\"$", (String clickDataCardLInk) -> {
      dataHomePage.clickDataCardLInk(clickDataCardLInk);
    });

    And("^I click on data card link \"(.*)\" and open Aircraft Models$", (String clickDataCardLInk) -> {
      dataHomePage.clickDataCardLInk(clickDataCardLInk);
      aircraftTypesPage.openAircraftModelsPage();
    });

    And("^I verify that sort is fine for ascending and descending order for \"(.*)\"$", (String DataCard) -> {
      dataHomePage.sortData(DataCard);
    });

    When("^I see the total count of crew bases", () -> {
      dataHomePage.readCrewBasesPageDataCard();
      dataTilesCount = dataHomePage.getCrewBasesCount();
    });

    When("^I see the total count of currencies", () -> {
      dataHomePage.readCurrenciesPageDataCard();
      dataTilesCount = dataHomePage.getCurrenciesCount();
    });

    When("^I see the total count of operating flights", () -> {
      //TimeUnit.SECONDS.sleep(5);
      dataTilesCount = dataHomePage.getOperatingFlightsCount();
    });

    When("^I see the total count of commercial flights", () -> {
       dataTilesCount = dataHomePage.getCommercialFlightsCount();
    });

    When("^I see the total count of positions", () -> {
      dataHomePage.readPositionDataCard();
      dataTilesCount = dataHomePage.getPositionsCount();
    });

    When("^I see the total count of rules", () -> {
      dataHomePage.readRulesDataCard();
      dataTilesCount = dataHomePage.getRulesCount();
    });

    When("^I see the total count of regions", () -> {
      dataHomePage.readRegionDataCard();
      dataTilesCount = dataHomePage.getRegionsCount();
    });

    When("^I see the total count of stations", () -> {
      dataHomePage.readStationDataCard();
      dataTilesCount = dataHomePage.getStationsCount();
    });

    Then("^I go back to data home page$", () -> {
      dataHomePage.clickBackArrow();
    });

    When("^I click on the other version link for \"(.*)\"$", (String dataType) -> {
      dataHomePage.clickOtherVersion(dataType);
    });

    Then("^The file \"(.*)\" is displayed$", (String fileName) -> {
      dataHomePage.clickNewVersion(fileName);
    });

    Then("^The data home screen is Inactive$", () -> {
      dataHomePage.validateDataHomeScreenInactive();
    });

    When("^I see the data source of \"(.*)\"$", (String dataType) -> {
      dataSource = dataHomePage.getAccommodationsDataSource(dataType);
    });

    Then("^The data source should show \"(.*)\"$", (String source) -> {
      Assert.assertEquals(dataSource, source);
    });

    Then("^I scroll to Data Card \"(.*)\"$", (String dataCard) -> {
      TimeUnit.SECONDS.sleep(1);
      dataHomePage.moveToDataCard(dataCard);
    });

    Then("^I get Data Reference Error$", () -> {
      dataHomePage.checkReferenceMessage();
    });

    Then("^I should not get any Success Message$", () -> {
      dataHomePage.checkNoSuccessMessage();
    });

    When("^(\\d+) error occurs$", (Integer errorCode) -> {
      dataHomePage.verifyError(errorCode);
    });

    And("^click on return link \"([^\"]*)\"$", (String linkText) -> {
      dataHomePage.clickReturnLinkOnError(linkText);
    });

    Then("^verify that I can return to the previous page where I before\\.$", () -> {
      dataHomePage.verifyBackToPreviousPageAfterError();
    });

    Then("^verify with message \"([^\"]*)\" and \"([^\"]*)\"$", (String arg0, String arg1) -> {
      dataHomePage.verifyNetworkLossMessage();
    });

    Then("^verify that data loss is happens on currently doing things prior to the network disruption\\.$", () -> {
      dataHomePage.verifyDataLossAfterOffline();
    });
  }
}
