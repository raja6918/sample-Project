package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import cucumber.api.java.en.And;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.currencies.CurrenciesEndpoint;
import com.adopt.altitude.automation.backend.api.currencies.Currency;

import cucumber.api.Transpose;
import cucumber.api.java8.En;

public class CurrencySteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(CurrencySteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Currency>        currencies;

   @Autowired
   private CurrenciesEndpoint    currencyManagement;

   /**
    * Instantiates new currency steps.
    */
   public CurrencySteps() {
      After(CUCUMBER_TAGS, () -> {
         if (currencies != null && !currencies.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Currencies}"));

            ArrayList<String> codeList = currencies.stream().map(c -> c.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            currencyManagement.deleteCurrencies(codeList, scenarioId);
         }
      });
   }

   @And("^The currencies with following values are added$")
   public void createMultipleCurrencies(@Transpose List<Currency> currencyList) throws Exception {
      LOGGER.info("=== Setting up {currencies} data ===");

      currencyManagement.setAuthenticationToken(apiLogin.getToken());
      List<Currency> newCurrencies = new ArrayList<Currency>();

      for (int i = 0; i < currencyList.size(); i++) {
         newCurrencies.add(getCurrency(currencyList.get(i).getName(), currencyList.get(i).getCode(), currencyList.get(i).getExchangeRate()));
      }

      currencies = currencyManagement.addCurrencies(newCurrencies, scenarioId);
      TimeUnit.SECONDS.sleep(1);
   }

   /**
    * Gets the currency.
    *
    * @param name the currency name
    * @param code the currency code
    * @param exchangeRate the exchange rate compared to base currency
    * @return the currency
    */
   private Currency getCurrency(String name, String code, float exchangeRate) {
      Currency newCurrency = new Currency();
      newCurrency.setName(name);
      newCurrency.setCode(code);
      newCurrency.setExchangeRate(exchangeRate);

      return newCurrency;
   }

}
