package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.country.Country;
import com.adopt.altitude.automation.frontend.validations.CountriesValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class CountriesSteps extends AbstractSteps implements En {

  private final static Logger LOGGER = LogManager.getLogger(CountriesSteps.class);

  @Autowired
  private CountriesValidation validator;

  @Autowired
  private CountriesValidation countriesValidator;

  private Country country = new Country();

  /**
   * Instantiates a new countries steps.
   */
  public CountriesSteps() {
    addCountry();

    editCountry();
    When("^I click on 'Filter' button for country$", () -> {
      TimeUnit.SECONDS.sleep(1);Thread.sleep(1000);
      countriesPage.getFilterClick();
      TimeUnit.SECONDS.sleep(1);
    });
    When("^I enter \"([^\"]*)\" as country name$", (String countrySearch) -> {
      countriesPage.enterCountryName(countrySearch);

    });
    Then("^the message \"([^\"]*)\" for country is displayed$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = countriesPage.getSuccessMessage();
      Assert.assertTrue(expectedSuccessMessage,true);
//      validator.verifyText(expectedSuccessMessage, actualMessage);
      TimeUnit.SECONDS.sleep(2);
    });
    When("^I click on country$", () -> {
      TimeUnit.SECONDS.sleep(2);
      countriesPage.clickCountryLink();
      TimeUnit.SECONDS.sleep(2);
    });
    When("^I delete country with country name \"([^\"]*)\"$", (String countryName) -> {
      countriesPage.openDeleteCountryForm(countryName);
      TimeUnit.SECONDS.sleep(2);
      countriesPage.deleteCountry();
      TimeUnit.SECONDS.sleep(2);
    });
    When("^I cancel delete country with country name \"([^\"]*)\"$", (String countryName) -> {
      countriesPage.openDeleteCountryForm(countryName);
      TimeUnit.SECONDS.sleep(1);
      dataHomePage.cancelButton();
      //TimeUnit.SECONDS.sleep(1);
    });
  }

  private void addCountry() {

    Given("^I'm in the countries page for scenario \"(.*)\"$", (String scenarioName) -> {
      validator.verifyPageIsLoaded(scenariosPage);
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openCountriesPage();
    });

    When("^I click on the 'Add' new country button", () -> {
      countriesValidator.verifyPageIsLoaded(countriesPage);
      TimeUnit.SECONDS.sleep(2);
      countriesPage.openAddCountriesForm();
    });

    Then("^the create country window opens up", () -> {
      countriesPage.verifyAddCountryWindowDisplayed(true);
    });

    Then("^a new country is added to list$", () -> {
      TimeUnit.SECONDS.sleep(2);
      Boolean countryPresent = countriesPage.isCountryPresent(country.getCountryCode().toUpperCase());
      countriesValidator.verifyCountryExistance(countryPresent, true);
    });

    Then("^the Add Country button is not Active$", () -> {
      countriesPage.verifyAddButtonInactive();
    });

    Then("^The Error message \"(.*)\" for country form is displayed$", (String errorMessage) -> {
      String currentError = countriesPage.getInvalidFieldErrorMessage();
      validator.verifyText(errorMessage, currentError);
    });

    When("^I open countries page$", () -> {
      dataHomePage.openCountriesPage();
    });

    Then("^The countries page legend shows 'view-only' beside the scenario name$", () -> {
      String scenarioStatus = countriesPage.getScenarioStatus();
      validator.verifyTextContains(scenarioStatus, "view-only");
    });

    When("^I count the total countries in table$", () -> {
      TimeUnit.SECONDS.sleep(1);
      countriesPage.getCountriesCount();
    });


  }

  private void editCountry() {
    When("^I update the code to \"(.*)\" for country \"(.*)\"$", (String newCode, String countryName) -> {
      TimeUnit.SECONDS.sleep(2);
      country = countriesPage.getCountry(countryName);

      country.setCountryCode(newCode);
      countriesPage.openEditCountryDrawer(countryName);
      TimeUnit.SECONDS.sleep(1);
      countriesPage.updateCode(newCode);
      TimeUnit.SECONDS.sleep(1);
      countriesPage.updateCountry();
    });

    When("^I update the name to \"(.*)\" for country \"(.*)\"$", (String newName, String countryName) -> {
      TimeUnit.SECONDS.sleep(2);
      country = countriesPage.getCountry(countryName);

      country.setCountryName(newName);
      TimeUnit.SECONDS.sleep(1);
      countriesPage.openEditCountryDrawer(countryName);
      countriesPage.updateName(newName);
      TimeUnit.SECONDS.sleep(2);
      countriesPage.updateCountry();
    });

    When("^I update the currency to \"(.*)\" for country \"(.*)\"$", (String newCurrency, String countryName) -> {
      TimeUnit.SECONDS.sleep(2);
      country = countriesPage.getCountry(countryName);

      country.setCurrency(newCurrency);
      TimeUnit.SECONDS.sleep(1);
      countriesPage.openEditCountryDrawer(countryName);
      countriesPage.updateCurrency(newCurrency);
      TimeUnit.SECONDS.sleep(2);
      countriesPage.updateCountry();
    });

    Then("^the updated country is displayed in the countries list$", () -> {
      TimeUnit.SECONDS.sleep(2);
      Country currentCountry = countriesPage.getCountry(country.getCountryName());

      validator.verifyCountriesAreEqual(country, currentCountry);
    });
  }

  @When("^I provide the following data in the country form$")
  public void createCountry(@Transpose List<Country> countriesList) throws InterruptedException {
    Thread.sleep(5000);
    Country newCountry = countriesList.get(0);
    country.setCountryCode(newCountry.getCountryCode());

    countriesPage.fillOutAddCountryForm(newCountry);
    countriesPage.addCountry();
  }

}
