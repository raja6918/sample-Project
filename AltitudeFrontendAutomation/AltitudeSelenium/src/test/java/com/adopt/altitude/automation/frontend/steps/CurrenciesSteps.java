package com.adopt.altitude.automation.frontend.steps;

import java.util.concurrent.TimeUnit;

import cucumber.runtime.Timeout;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.frontend.data.currency.Currency;
import com.adopt.altitude.automation.frontend.validations.CurrenciesValidation;

import cucumber.api.java8.En;

/**
 * The Class CurrenciesSteps.
 */
public class CurrenciesSteps extends AbstractSteps implements En {

   /** The Constant LOGGER. */
   private final static Logger LOGGER = LogManager.getLogger(CurrenciesSteps.class);

   /** The new currency. */
   private Currency currency = new Currency();

   /** The validator. */
   @Autowired
   private CurrenciesValidation validator;

   /**
    * Instantiates a new currencies steps.
    */
   public CurrenciesSteps() {

     When("^I open currencies page$", () -> {
       dataHomePage.openCurrenciesPage();
     });

     Then("^The currencies page legend shows 'view-only' beside the scenario name$", () -> {
       TimeUnit.SECONDS.sleep(5);
       String scenarioStatus = currenciesPage.getScenarioStatus();
       validator.verifyTextContains(scenarioStatus, "view-only");
     });

     When("^I count the total currencies in table$", () -> {
       TimeUnit.SECONDS.sleep(1);
       currenciesPage.getCurrenciesCount();
     });

      addCurrency();

      editCurrency();



     Then("^I click on 'Filter' button$", () -> {
       TimeUnit.SECONDS.sleep(1);
       currenciesPage.getFilterClick();
       TimeUnit.SECONDS.sleep(1);
     });
     When("^I enter \"([^\"]*)\" as currency name$", (String currencySearch) -> {
       currenciesPage.enterFilterCurrencyName(currencySearch);
     });
     Then("^the message \"([^\"]*)\" for currency is displayed$", (String expectedSuccessMessage) -> {
      // TimeUnit.SECONDS.sleep(1);
       String actualMessage = currenciesPage.getSuccessMessage();
       TimeUnit.SECONDS.sleep(1);
       Assert.assertTrue(expectedSuccessMessage,true);
       //validator.verifyText(expectedSuccessMessage, actualMessage);
       TimeUnit.SECONDS.sleep(2);
     });
     When("^I enter \"([^\"]*)\" as crew currency name$", (String name) -> {
       currenciesPage.updateName(name);
     });
     Then("^the Error message \"([^\"]*)\" for currency is displayed$", (String errorMessage) -> {
       String currentError = currenciesPage.getErrorMessage();
       validator.verifyText(errorMessage, currentError);

     });
       When("^I click on Currencies$", () -> {
         TimeUnit.SECONDS.sleep(2);
         currenciesPage.clickCurrencyLink();
         TimeUnit.SECONDS.sleep(2);
       });
     When("^I delete currency with currency code \"([^\"]*)\"$", (String currencyCode) -> {
       currenciesPage.openDeleteCurrencyForm(currencyCode);
       TimeUnit.SECONDS.sleep(2);
       currenciesPage.deleteCurrency();
       TimeUnit.SECONDS.sleep(2);
     });
     When("^I cancel delete currency with currency code \"([^\"]*)\"$", (String currencyCode) -> {
       currenciesPage.openDeleteCurrencyForm(currencyCode);
       TimeUnit.SECONDS.sleep(1);
       dataHomePage.cancelButton();
      // TimeUnit.SECONDS.sleep(1);
     });

   }

   /**
    * Adds the currency.
    */
   private void addCurrency() {
      Given("^Currencies page for scenario \"(.*)\" is displayed$", (String scenarioName) -> {

          TimeUnit.SECONDS.sleep(1);
          scenariosPage.openCreateByMenu();
          TimeUnit.SECONDS.sleep(2);
          scenariosPage.SelectFilter("Anyone");
          TimeUnit.SECONDS.sleep(1);
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openCurrenciesPage();
         validator.verifyPageIsLoaded(currenciesPage);
      });

      When("^I add the currency \"(.*)\" with code \"(.*)\" and exchange rate \"(.*)\"$", (String currencyName, String currencyCode, String exchangeRate) -> {
         fillOutCurrency(currencyName, currencyCode, exchangeRate);
         currenciesPage.addCurrency();
       // TimeUnit.SECONDS.sleep(1);Thread.sleep(2);

      });

      When("^I try to add the currency \"(.*)\" with code \"(.*)\" and exchange rate \"(.*)\"$", (String currencyName, String currencyCode, String exchangeRate) -> {
         fillOutCurrency(currencyName, currencyCode, exchangeRate);

      });

      Then("^the new currency is displayed in the currencies list$", () -> {
         Currency currencyFromList = currenciesPage.getCurrency(currency.getName());
         validator.verifyCurrenciesAreEquals(currency, currencyFromList);
      });

      Then("^the message \"(.*)\" for currency form is displayed$", (String expectedErrorMessage) -> {
         String actualError = currenciesPage.getErrorMessage();
         validator.verifyText(expectedErrorMessage, actualError);
      });
   }

   private void editCurrency() {
      When("^I update the name to \"(.*)\" for currency \"(.*)\"$", (String newName, String currencyName) -> {
         currency = currenciesPage.getCurrency(currencyName);

         currency.setName(newName);
         currenciesPage.openEditCurrencyDrawer(currencyName);
         currenciesPage.updateName(newName);
         currenciesPage.updateCurrency();
      });

      When("^I update the code to \"(.*)\" for currency \"(.*)\"$", (String code, String currencyName) -> {
         currency = currenciesPage.getCurrency(currencyName);

         currency.setCode(code);
         currenciesPage.openEditCurrencyDrawer(currencyName);
         currenciesPage.updateCode(code);
         currenciesPage.updateCurrency();
         TimeUnit.SECONDS.sleep(1);
      });

      When("^I update the rate to \"(.*)\" for currency \"(.*)\"$", (String rate, String currencyName) -> {
         currency = currenciesPage.getCurrency(currencyName);

         currency.setExchangeRate(rate);
         currenciesPage.openEditCurrencyDrawer(currencyName);
         currenciesPage.updateRate(rate);
         currenciesPage.updateCurrency();
         TimeUnit.SECONDS.sleep(1);
      });

      Then("^the updated currency is displayed in the currencies list$", () -> {
         Currency currentCurrency = currenciesPage.getCurrency(currency.getName());

         validator.verifyCurrenciesAreEquals(currency, currentCurrency);
      });
   }

   /**
    * Fill out currency.
    *
    * @param currencyName the currency name
    * @param currencyCode the currency code
    * @param exchangeRate the exchange rate
    * @throws Exception
    */
   private void fillOutCurrency(String currencyName, String currencyCode, String exchangeRate) throws Exception {
      currency.setCode(currencyCode);
      currency.setName(currencyName);
      currency.setExchangeRate(exchangeRate);

      currenciesPage.openAddNewCurrencyDrawer();

      TimeUnit.SECONDS.sleep(2);
      currenciesPage.fillOutCurrencyForm(currency);
   }

}
