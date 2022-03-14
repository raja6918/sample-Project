package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.country.Country;
import com.adopt.altitude.automation.frontend.pageobject.view.CountriesView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * This class holds all the actions that can be done on the Countries Page. It also contains validation methods to validate actions performed on the page
 */
@Component
public class CountriesPage extends AbstractPage {

  @Autowired
  @Lazy(true)
  private CountriesView countriesView;

  /**
   * Open the add countries form by clicking the '+' button
   */
  public void openAddCountriesForm() {
    countriesView.clickAddCountryButton();
  }

  /**
   * Verify if the add country window is displayed or closed
   *
   * @param isDisplayed
   */
  public void verifyAddCountryWindowDisplayed(Boolean isDisplayed) {
    if (isDisplayed)
      Assert.assertTrue(countriesView.isAddNewCountryFormDislayed());
    else
      Assert.assertFalse(countriesView.isAddNewCountryFormDislayed());
  }

  /**
   * Fill out the add country form with the given values
   *
   * @param country The Country to be added
   */
  public void fillOutAddCountryForm(Country country) throws InterruptedException {
    countriesView.setCountryCode(country.getCountryCode());
    countriesView.setCountryName(country.getCountryName());
    countriesView.selectCurrency(country.getCurrency());
  }

  /**
   * Update code.
   *
   * @param code the code
   */
  public void updateCode(String code) {
    countriesView.setCountryCode(code);
  }

  /**
   * Update name.
   *
   * @param name the name
   */
  public void updateName(String name) {
    countriesView.setCountryName(name);
  }

  /**
   * Update currency.
   *
   * @param currency the currency
   */
  public void updateCurrency(String currency) throws InterruptedException {
    countriesView.selectCurrency(currency);
  }

  /**
   * Click add button to add a new country to the list
   */
  public void addCountry() {
    countriesView.clickAddButton();
  }

  /**
   * Update country.
   */
  public void updateCountry() {
    countriesView.clickSaveButton();
  }

  /**
   * Check if the country is displayed in the list by country code
   *
   * @param countryCode
   * @return
   */
  public boolean isCountryPresent(String countryCode) {
    return countriesView.isCountryDisplayed(countryCode);
  }

  /**
   * Verify add button is Inactive if some mandatory fields are empty
   */
  public void verifyAddButtonInactive() {
    Assert.assertFalse(countriesView.isAddButtonEnabled());
  }

  /**
   * Get the error messages for invalid field values
   *
   * @return
   */
  public String getInvalidFieldErrorMessage() {
    return countriesView.getFieldErrorMessage();
  }

  /**
   * Click the delete button for specified country
   *
   * @param countryName
   */
  public void openDeleteCountryForm(String countryName) {
    countriesView.clickDeleteCountryButton(countryName);
  }

  /**
   * Click Delete Option in the delete confirmation dialog
   */
  public void deleteCountry() {
    countriesView.clickDeleteButton();
  }

  /**
   * Gets the country.
   *
   * @param countryName the country name
   * @return the country
   */
  public Country getCountry(String countryName) {
    List<String> values = countriesView.getCountry(countryName);

    return mapCountry(values);
  }

  /**
   * Open edit country drawer.
   *
   * @param countryName the country name
   */
  public void openEditCountryDrawer(String countryName) {
    countriesView.clickEditCountryButton(countryName);
  }

  public String getScenarioStatus() {
    return countriesView.getScenarioStatus();
  }

  public void getCountriesCount() throws InterruptedException {
    dataCountForCountries = countriesView.getCountriesCount();
  }

  /**
   * Map country.
   *
   * @param values the values
   * @return the country
   */
  private Country mapCountry(List<String> values) {
    Country country = new Country();

    country.setCountryCode(values.get(0));
    country.setCountryName(values.get(1));
    country.setCurrency(values.get(2));

    return country;
  }

  /**
   * click filter.
   */
  public void getFilterClick() throws InterruptedException {
    countriesView.clickFilter();
  }


  /**
   * type countryName.
   *
   * @param countryName the code
   */
  public void enterCountryName(String countryName) throws InterruptedException {
    countriesView.enterCountryName(countryName);
  }

  /**
   * click the country link.
   */
  public void clickCountryLink() throws InterruptedException {
    countriesView.clickCountryLink();
  }


  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return countriesView.getSuccessMessage();
  }

  @Override
  public boolean isPageDisplayed() {
    return countriesView.isDisplayedCheck();
  }
}
