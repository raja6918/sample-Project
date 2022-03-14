package com.adopt.altitude.automation.frontend.pageobject;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.currency.Currency;
import com.adopt.altitude.automation.frontend.pageobject.view.CurrenciesView;

/**
 * The Class CurrenciesPage.
 */
@Component
public class CurrenciesPage extends AbstractPage {

   /** The currencies view. */
   @Autowired
   @Lazy(true)
   private CurrenciesView currenciesView;

   /**
    * Open add new currency drawer.
    */
   public void openAddNewCurrencyDrawer() {
      currenciesView.clickAddNewCurrency();
   }

   /**
    * Open edit currency drawer.
    *
    * @param currencyName the currency name
    */
   public void openEditCurrencyDrawer(String currencyName) {
      currenciesView.clickEditCurrencyButton(currencyName);
   }
   /**
    * Fill out currency form.
    *
    * @param newCurrency the new currency
    */
   public void fillOutCurrencyForm(Currency newCurrency) {
      currenciesView.enterCode(newCurrency.getCode());
      currenciesView.enterName(newCurrency.getName());
      currenciesView.enterRate(newCurrency.getExchangeRate());
   }

   /**
    * Update name.
    *
    * @param name the name
    */
   public void updateName(String name) {
      currenciesView.enterName(name);
   }

   /**
    * Update code.
    *
    * @param code the code
    */
   public void updateCode(String code) {
      currenciesView.enterCode(code);
   }

   /**
    * Update rate.
    *
    * @param rate the rate
    */
   public void updateRate(String rate) {
      currenciesView.enterRate(rate);
   }

   /**
    * Adds the currency.
    */
   public void addCurrency() throws InterruptedException {
      currenciesView.clickAdd();
   }

   /**
    * Update currency.
    */
   public void updateCurrency() {
      currenciesView.clickSave();
   }

   /**
    * Gets the currency.
    *
    * @param currencyName the currency name
    * @return the currency
    */
   public Currency getCurrency(String currencyName) {
      List<String> values = currenciesView.getCurrency(currencyName);

      return mapCurrency(values);
   }

   public String getScenarioStatus() {
     return currenciesView.getScenarioStatus();
   }

   /**
    * Map currency.
    *
    * @param values the values
    * @return the currency
    */
   private Currency mapCurrency(List<String> values) {
      Currency currency = new Currency();

      currency.setCode(values.get(0));
      currency.setName(values.get(1));
      currency.setExchangeRate(values.get(2));

      return currency;
   }

  /**
   * click filter.
   */
  public void getFilterClick() throws InterruptedException {
    currenciesView.clickFilter();
  }
  /**
   * type currency.
   *
   * @param currency the code
   */
  public void enterFilterCurrencyName(String currency) throws InterruptedException {
    currenciesView.enterFilterCurrencyName(currency);
  }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return currenciesView.getErrorMessage();
   }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return currenciesView.getSuccessMessage();
  }


  public void getCurrenciesCount() throws InterruptedException {
    dataCountForCurrency = currenciesView.getCurrenciesCount();
   }

  /**
   * click the currency link.
   */
  public void clickCurrencyLink() throws InterruptedException {
    currenciesView.clickCurrencyLink();
  }

  /**
   * Click the delete button for specified currency
   *
   * @param currencyCode
   */
  public void openDeleteCurrencyForm(String currencyCode) {
    currenciesView.clickDeleteCurrencyButton(currencyCode);
  }

  /**
   * Click Delete Option in the delete confirmation dialog
   */
  public void deleteCurrency() {
    currenciesView.clickDeleteButton();
  }

   @Override
   public boolean isPageDisplayed() {
      return currenciesView.isDisplayedCheck();
   }

}
