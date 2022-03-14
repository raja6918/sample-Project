package com.adopt.altitude.automation.frontend.api.steps;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.countries.CountriesEndpoint;
import com.adopt.altitude.automation.backend.api.countries.Country;
import com.adopt.altitude.automation.backend.api.currencies.CurrenciesEndpoint;
import com.adopt.altitude.automation.backend.api.currencies.Currency;

import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;

public class CountrySteps extends AbstractApiSteps implements En {

   private static final Logger   LOGGER        = LogManager.getLogger(CountrySteps.class);

   private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

   private List<Country>         countries;

   @Autowired
   private CountriesEndpoint     countryManagement;

   @Autowired
   private CurrenciesEndpoint    currencyManagement;

   /**
    * Instantiates new country steps.
    */
   public CountrySteps() {
      After(CUCUMBER_TAGS, () -> {
         if (countries != null && !countries.isEmpty()) {
            LOGGER.info(String.format("Cleaning up Test Data for {Countries}"));

            ArrayList<String> codeList = countries.stream().map(c -> c.getCode()).collect(Collectors.toCollection(() -> new ArrayList<String>()));
            countryManagement.deleteCountries(codeList, scenarioId);
         }
      });
   }

   /**
    * Create countries
    *
    * @param countryList The countries to be added
    */
   @When("^The countries with following values are added$")
   public void createMultipleCountries(@Transpose List<Country> countryList) throws Exception {
      LOGGER.info("=== Setting up {countries} data ===");

      countryManagement.setAuthenticationToken(apiLogin.getToken());
      List<Country> newCountries = new ArrayList<Country>();

      for (int i = 0; i < countryList.size(); i++) {
         newCountries.add(getCountry(countryList.get(i).getName(), countryList.get(i).getCode(), countryList.get(i).getCurrencyCode()));
      }

      countries = countryManagement.addCountries(newCountries, scenarioId);
   }

   /**
    * Gets the country.
    *
    * @param name the country name
    * @param countryCode the country code
    * @param currencyCode the currency code for the country's currency
    * @return the country
    */
   private Country getCountry(String name, String countryCode, String currencyCode) {
      Country newCountry = new Country();
      newCountry.setName(name);
      newCountry.setCode(countryCode);
      newCountry.setCurrencyCode(currencyCode);

      return newCountry;
   }

   /**
    * Get the currency Id from currency code
    *
    * @param code
    * @return the currency Id
    */
   private Integer getCurrencyId(String code) {
      List<Currency> currencies = null;
      try {
         currencyManagement.setAuthenticationToken(apiLogin.getToken());
         currencies = currencyManagement.getCurrencies(scenarioId);
         for (Currency currency : currencies) {
            if (currency.getCode().equals(code)) {
               return currency.getId();
            }
         }
      }
      catch (ClientException e) {
         e.printStackTrace();
      }
      return 0;
   }

}
