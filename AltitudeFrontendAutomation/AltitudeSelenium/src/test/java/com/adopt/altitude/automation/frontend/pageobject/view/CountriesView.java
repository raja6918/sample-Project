package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.CountriesPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class CountriesView extends AbstractPageView<CountriesPageContainer> {

  private final static Logger LOGGER = LogManager.getLogger(CountriesView.class);

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), CountriesPageContainer.class);
  }

  /**
   * Click Add Button to open add a country form
   */
  public void clickAddCountryButton() {
    container.getAddCountryButton().click();
  }

  /**
   * Check if the form to add a new country opens up
   * @return
   */
  public boolean isAddNewCountryFormDislayed() {
    return isElementVisible(container.getAddNewCountryFormHeader());
  }

  /**
   * Set a country code
   * @param countryCode the country code
   */
  public void setCountryCode(String countryCode) {
     clearAndSetText(container.getCountryCodeTextfield(), countryCode);
  }

  /**
   * Sets a country name
   * @param countryName the country name
   */
  public void setCountryName(String countryName) {
     clearAndSetText(container.getCountryNameTextfield(), countryName);
  }

  /**
   * Select a currency from the currency dropdown
   * @param currency currency to be selected
   */
  public void selectCurrency(String currency) throws InterruptedException {
   // container.getCurrencyDropdown().sendKeys(currency);
    clearAndSetText(container.getCurrencyDropdown(),currency);
    Thread.sleep(2000);
    container.getCurrencyDropdown().sendKeys(Keys.ARROW_DOWN);
    Thread.sleep(2000);
    container.getCurrencyDropdown().sendKeys(Keys.ENTER);
  }

  /**
   * Click Add button to add a new country
   */
  public void clickAddButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddButton());
    driver.jsClick(container.getAddButton());
  }

  /**
   * Click Save button to save changes to the form
   */
  public void clickSaveButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getSaveButton());
    driver.jsClick(container.getSaveButton());
  }

  /**
   * Check if the new country is displayed in the table
   * @param countryCode
   * @return
   */
  public boolean isCountryDisplayed(String countryCode) {
    WebElement country = driver.getWebDriver().findElement(By.xpath(String.format(container.currentCountries, countryCode)));
    if (country.isDisplayed()) {
      return true;
    }
    return false;
  }

  /**
   * Check if the add button on the form is enabled
   * @return
   */
  public boolean isAddButtonEnabled() {
    return container.getAddButton().isEnabled();
  }

  /**
   * Get the Error messages in the country form
   * @return
   */
  public String getFieldErrorMessage() {
    return container.getCountryFormErrorMessage().getText();
  }

  /**
   * Click delete button to delete a country
   * @param countryName the country name of country to be deleted
   */
  public void clickDeleteCountryButton(String countryName) {
    WebElement countryDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.deleteCountryButton, countryName)));
    countryDeleteButton.click();
  }

  /**
   * Confirm the deletion of country
   */
  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  /**
   * Gets the country.
   *
   * @param name the name
   * @return the country
   */
  public List<String> getCountry(String name) {
    List<WebElement> countryElements = driver.getWebDriver().findElements(By.xpath(String.format(container.COUNTRY_XPATH, name)));

    return getCountryValues(countryElements);
  }

  /**
   * Click the dit country button to open the edit form
   * @param name
   */
  public void clickEditCountryButton(String name) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.editCountryButton, name)));

    editButton.click();
  }

  public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public String getCountriesCount() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String countText=container.getCountriesCount().getText();
    String countValue=countText.replaceAll("[^0-9]", "");
    return  countValue;

  }

  /**
   * Gets the country values.
   *
   * @param countryElements the country elements
   * @return the country values
   */
  private List<String> getCountryValues(List<WebElement> countryElements) {
    List<String> countryValues = new ArrayList<>();

    countryValues.add(countryElements.get(1).getText());
    countryValues.add(countryElements.get(2).getText());
    countryValues.add(countryElements.get(3).getText());

    return countryValues;
  }


  /**
   * Click filter.
   */
  public void clickFilter() throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Enter country.
   *
   * @param countryName the rate
   */
  public void enterCountryName(String countryName) throws InterruptedException {
    clearAndSetText(container.getCountryFilterName(), countryName);
    container.getCountryFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Click country link.
   */
  public void clickCountryLink() throws InterruptedException {
    container.getCountryLink().click();
    TimeUnit.SECONDS.sleep(1);
    container.getCountryLink().click();
    TimeUnit.SECONDS.sleep(1);
    container.getClickNameSort().click();
   }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  @Override public boolean isDisplayedCheck() {
     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCountriesPageHeader());
     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddCountryButton());

    return container.getAddCountryButton() != null && container.getCountriesPageHeader() != null;
  }
}
