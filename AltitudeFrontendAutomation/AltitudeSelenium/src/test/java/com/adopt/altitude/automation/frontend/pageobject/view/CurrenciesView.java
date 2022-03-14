package com.adopt.altitude.automation.frontend.pageobject.view;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.pageobject.containers.CurrenciesPageContainer;

/**
 * The Class CurrenciesView.
 */
@Component
@Scope("prototype")
public class CurrenciesView extends AbstractPageView<CurrenciesPageContainer>{
   private final static Logger LOGGER = LogManager.getLogger(CountriesView.class);

   /**
    * Inits the Web elements
    *
    * @throws Exception the exception
    */
   @PostConstruct
   public void init() throws Exception {
     container = PageFactory.initElements(driver.getWebDriver(), CurrenciesPageContainer.class);
   }

   /**
    * Click add new currency.
    */
   public void clickAddNewCurrency() {
      container.getAddNewCurencyButton().click();
   }

   /**
    * Enter code.
    *
    * @param code the code
    */
   public void enterCode(String code) {
      clearAndSetText(container.getCodeInputField(), code);
   }

   /**
    * Enter name.
    *
    * @param name the name
    */
   public void enterName(String name) {
      clearAndSetText(container.getNameInputField(), name);
     container.getNameInputField().sendKeys(Keys.TAB);
   }

   /**
    * Enter rate.
    *
    * @param rate the rate
    */
   public void enterRate(String rate) {
      clearAndSetText(container.getRateInputField(), rate);
      container.getRateInputField().sendKeys(Keys.TAB);
   }

   /**
    * Click add.
    */
   public void clickAdd() throws InterruptedException {
      container.getAddCurrencyButton().click();

   }

   /**
    * Gets the currency.
    *
    * @param name the name
    * @return the currency
    */
   public List<String> getCurrency(String name) {
      List<WebElement> currencyElements = driver.getWebDriver().findElements(By.xpath(String.format(container.CURRENCY_XPATH, name)));

      return getCurrencyValues(currencyElements);
   }

   public void clickEditCurrencyButton(String name) {
      WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_CURRENCY_XPATH, name)));

      editButton.click();
   }

   public void clickSave() {
      container.getSaveCurrencyButton().click();
   }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return container.getErrorMessage().getText();
   }


  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

   public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

   public String getCurrenciesCount() throws InterruptedException {
     TimeUnit.SECONDS.sleep(1);
     String countText=container.getCurrencyCount().getText();
     String countValue=countText.replaceAll("[^0-9]", "");
     return  countValue;
   }

   /**
    * Gets the currency values.
    *
    * @param currencyElements the currency elements
    * @return the currency values
    */
   private List<String> getCurrencyValues(List<WebElement> currencyElements) {
      List<String> currencyValues = new ArrayList<>();

      currencyValues.add(currencyElements.get(1).getText());
      currencyValues.add(currencyElements.get(2).getText());
      currencyValues.add(currencyElements.get(3).getText());

      return currencyValues;
   }

  /**
   * Click filter.
   */
  public void clickFilter() throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);
  }
  /**
   * Enter currency.
   *
   * @param currency the rate
   */
  public void enterFilterCurrencyName(String currency) throws InterruptedException {
    clearAndSetText(container.getCurrencyFilterName(), currency);
    container.getCurrencyFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * click currency link.
   */
  public void clickCurrencyLink() throws InterruptedException {
     container.getCurrencyLink().click();
     TimeUnit.SECONDS.sleep(1);
     container.getCurrencyLink().click();
     TimeUnit.SECONDS.sleep(1);
  }

  public void clickDeleteCurrencyButton(String currencyCode) {
    WebElement currencyDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.deleteCurrencyButton, currencyCode)));
    currencyDeleteButton.click();
  }
  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

   @Override
   public boolean isDisplayedCheck() {
      return !container.getCurrenciesPageHeader().getText().isEmpty();
   }

}
