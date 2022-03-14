package com.adopt.altitude.automation.frontend.pageobject.containers;

import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class CurrenciesPageContainer extends PageContainer {

   @FindBy(xpath = "//h2[text()='Currencies']")
   private WebElement       currenciesPageHeader;

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement       addNewCurencyButton;

   @FindBy(id = "currencyCode")
   private WebElement       codeInputField;

   @FindBy(id = "currencyName")
   private WebElement       nameInputField;

   @FindBy(id = "currencyRate")
   private WebElement       rateInputField;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement       addCurrencyButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement       saveCurrencyButton;

   @FindBy(xpath = "//button[span[text()='Cancel']]")
   private WebElement       cancelButton;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement       deleteButton;

  @FindBy(xpath = "//a[contains(@href,'currencies')]")
  private WebElement       currencyLink;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[2]/span")
  private WebElement clickNameSort;

   @FindBy(xpath = "//div[contains(@class, 'CurrenciesForm__Input')]/following::p")
  private WebElement       errorMessage;

/*  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div/span")
  private WebElement       successMessage;*/

  @FindBy(xpath = "//*[@id=\"notification-area\"]/descendant::span")
  private WebElement       successMessage;

   @FindBy(xpath = "//tbody/tr")
   private List<WebElement> currenciesList;

   @FindBy(xpath = "//h2[text() = 'Currencies']/following-sibling::p")
   private WebElement scenarioStatus;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[5]/button[1]/span[1]/span")
  private WebElement clickFilter;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[2]/th[3]/div/div/input")
  private WebElement currencyFilterName;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement currencyCount;


   public String            CURRENCY_XPATH      = "//td[text()='%s']//parent::tr//child::td";

   public String            EDIT_CURRENCY_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

  public String            deleteCurrencyButton = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

   public WebElement getCurrenciesPageHeader() {
      return currenciesPageHeader;
   }

   public WebElement getAddNewCurencyButton() {
      return addNewCurencyButton;
   }

   public WebElement getCodeInputField() {
      return codeInputField;
   }

   public WebElement getNameInputField() {
      return nameInputField;
   }

   public WebElement getRateInputField() {
      return rateInputField;
   }

   public WebElement getAddCurrencyButton() {
      return addCurrencyButton;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getErrorMessage() {
      return errorMessage;
   }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

   public List<WebElement> getCurrenciesList() {
      return currenciesList;
   }

   public WebElement getSaveCurrencyButton() {
      return saveCurrencyButton;
   }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public  WebElement getCurrencyFilterName()
  {
    return  currencyFilterName;
  }
  public WebElement getClickFilter()
  {
    return clickFilter;
  }

  public WebElement getCurrencyCount() {
    return currencyCount;
  }

  public WebElement getCurrencyLink() {
    return currencyLink;
  }

  public WebElement getClickNameSort() {
    return clickNameSort;
  }

  public WebElement getDeleteButton() {
    return deleteButton;
  }
}
