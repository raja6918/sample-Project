package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

/**
 * This class defines all the elements on the Country page
 */
public class CountriesPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Countries']")
  private WebElement countriesPageHeader;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addCountryButton;

  @FindBy(xpath = "//span[text()='Add Country']")
  private WebElement addNewCountryFormHeader;

  @FindBy(xpath = "//input[@id='countryCode']")
  private WebElement countryCodeTextfield;

  @FindBy(xpath = "//input[@id='countryName']")
  private WebElement countryNameTextfield;

  @FindBy(xpath = "//input[@id='currencyCode']")
  private WebElement currencyDropdown;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addButton;

  @FindBy(xpath = "//button[span[text()='SAVE']]")
  private WebElement saveButton;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement countryFormErrorMessage;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  @FindBy(xpath = "//h2[text() = 'Countries']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> countriesList;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[5]/button[1]/span[1]/span")
  private WebElement clickFilter;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[2]/span")
  private WebElement clickNameSort;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[2]/th[3]/div/div/input")
  private WebElement countryFilterName;

  @FindBy(xpath = "//a[contains(@href,'countries')]")
  private WebElement       countryLink;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement countriesCount;

  public String tableCell = "//td[text()='%s']";

  public String currentCountries = "//td[text()='%s']";

  public String COUNTRY_XPATH      = "//td[text()='%s']//parent::tr//child::td";

  public String deleteCountryButton = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

  public String editCountryButton = "//td[text()='%s']/following-sibling::td/button[1]";

  public WebElement getCountriesPageHeader() {
    return countriesPageHeader;
  }

  public WebElement getAddCountryButton() {
    return addCountryButton;
  }

  public WebElement getAddNewCountryFormHeader() {
    return addNewCountryFormHeader;
  }

  public WebElement getCountryCodeTextfield() {
    return countryCodeTextfield;
  }

  public WebElement getCountryNameTextfield() {
    return countryNameTextfield;
  }

  public WebElement getCurrencyDropdown() {
    return currencyDropdown;
  }

  public WebElement getAddButton() {
    return addButton;
  }

  public WebElement getSaveButton() { return saveButton; }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getCountryFormErrorMessage() {
    return countryFormErrorMessage;
  }

  public WebElement getDeleteButton() {
    return deleteButton;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public List<WebElement> getCountriesList() {
    return countriesList;
  }

  public WebElement getClickFilter()
  {
    return clickFilter;
  }

  public  WebElement getCountryFilterName()
  {
    return  countryFilterName;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getCountriesCount() {
    return countriesCount;
  }

  public WebElement getCountryLink() {
    return countryLink;
  }

  public WebElement getClickNameSort() {
    return clickNameSort;
  }

}
