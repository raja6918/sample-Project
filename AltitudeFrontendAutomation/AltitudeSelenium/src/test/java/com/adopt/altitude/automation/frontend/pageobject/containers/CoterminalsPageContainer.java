package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class CoterminalsPageContainer extends PageContainer{

  @FindBy(xpath = "//h2[text()='Coterminal Transports']")
  private WebElement coterminalsPageHeader;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addNewCoterminalButton;

  @FindBy(id = "departureStationCode") ////input[@id='departureStationCode']/ancestor::div[contains(@class, 'Select--single')]"
  private WebElement departureStationDropdown;

  @FindBy(id = "arrivalStationCode")
  private WebElement arrivalStationDropdown;

  @FindBy(id = "name")
  private WebElement transportNameInput;

  @FindBy(xpath = "//div[input[@name='typeCode']]/div")
  private WebElement transportTypeDropdown;

  @FindBy(id = "capacity")
  private WebElement maximumPassengersInput;

  @FindBy(xpath = "//input[@id='outboundFirstDepartureTime']")
  private WebElement startTimeInput;

  @FindBy(xpath = "//input[@id='outboundLastDepartureTime']")
  private WebElement endTimeInput;

  @FindBy(xpath = "//button/span[text()='OK']")
  private WebElement calendarOkButton;

  @FindBy(id = "outboundDuration")
  private WebElement transportTimeInput;

  @FindBy(id = "outboundConnectionTimeBefore")
  private WebElement connectionTimeBeforeInput;

  @FindBy(id = "outboundConnectionTimeAfter")
  private WebElement connectionTimeAfterInput;

  @FindBy(id = "cost")
  private WebElement transportCostInput;

  @FindBy(xpath = "//*[@name='currencyCode']//*[@class='MuiAutocomplete-endAdornment']/button[@aria-label='Open']")
  private WebElement currencyDropdown;

  @FindBy(xpath = "//div[input[@name='billingPolicyCode']]/div")
  private WebElement costBasisDropdown;

  @FindBy(id = "credit")
  private WebElement creditCostInput;

  @FindBy(xpath = "//div[input[@name='creditPolicyCode']]/div")
  private WebElement creditAppliedDropdown;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addButton;

  @FindBy(xpath = "//button[span[text()='SAVE']]")
  private WebElement saveButton;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement errorMessage;

  @FindBy(xpath = "//span[text()='Add extra time']")
  private WebElement addExtraTimeButton;

  @FindBy(id = "extraTime")
  private List<WebElement>  extraTimeInput;

  @FindBy(xpath = "//input[@id='extraTime']/following::input[@id='startTime']")
  private  List<WebElement> extraTimeStartTimeInput;

  @FindBy(xpath = "//input[@id='extraTime']/following::input[@id='endTime']")
  private List<WebElement> extraTimeEndTimeInput;

  @FindBy(xpath = "//span[text()='delete_outline'")
  private  List<WebElement> extraTimeDeleteButton;

  @FindBy(xpath = "//h2[text() = 'Coterminal transports']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> coterminalsList;

  public String      TRANSPORT_TYPE  = "//li[text()='%s']";

  public String      CALENDAR_TIME       = "//span[text()='%s']";

  public String      CURRENCY_ITEM       = "//*[contains(@id,'currencyCode-option')]/span[text()='%s']";

  public String      COST_BASIS_ITEM       = "//li[text()='%s']";

  public String      CREDIT_APPLIES_ITEM       = "//li[text()='%s']";

  public String      COTERMINAL_XPATH = "//td[text()='%s']//parent::tr//child::td";

  public String      EDIT_COTERMINAL_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

  public String     FROM_STATION = "//*[@class='Select-menu-outer']/descendant::div[contains(text(),'%s')]";
  public String DEPARTURE_STATIONCODE = "//*[@id='departureStationCode-popup']//li/span[contains(text(),'%s')]";
  public String ARRIVAL_STATIONCODE = "//*[@id='arrivalStationCode-popup']//li/span[contains(text(),'%s')]";

  public WebElement getCoterminalsPageHeader() {
    return coterminalsPageHeader;
  }

  public WebElement getAddNewCoterminalButton() {
    return addNewCoterminalButton;
  }

  public WebElement getDepartureStationDropdown() {
    return departureStationDropdown;
  }

  public WebElement getArrivalStationDropdown() {
    return arrivalStationDropdown;
  }

  public WebElement getTransportNameInput() {
    return transportNameInput;
  }

  public WebElement getTransportTypeDropdown() {
    return transportTypeDropdown;
  }

  public WebElement getMaximumPassengersInput() {
    return maximumPassengersInput;
  }

  public WebElement getStartTimeInput() {
    return startTimeInput;
  }

  public WebElement getEndTimeInput() {
    return endTimeInput;
  }

  public WebElement getCalendarOkButton() {
    return calendarOkButton;
  }

  public WebElement getTransportTimeInput() {
    return transportTimeInput;
  }

  public WebElement getConnectionTimeBeforeInput() {
    return connectionTimeBeforeInput;
  }

  public WebElement getConnectionTimeAfterInput() {
    return connectionTimeAfterInput;
  }

  public WebElement getTransportCostInput() {
    return transportCostInput;
  }

  public WebElement getCurrencyDropdown() {
    return currencyDropdown;
  }

  public WebElement getCostBasisDropdown() {
    return costBasisDropdown;
  }

  public WebElement getCreditCostInput() {
    return creditCostInput;
  }

  public WebElement getCreditAppliedDropdown() {
    return creditAppliedDropdown;
  }

  public WebElement getSaveButton() {
    return saveButton;
  }

  public WebElement getAddButton() {
    return addButton;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getErrorMessage() {
    return errorMessage;
  }

  public WebElement getAddExtraTimeButton() {
    return addExtraTimeButton;
  }

  public List<WebElement> getExtraTimeInput() {
    return extraTimeInput;
  }

  public List<WebElement> getExtraTimeStartTimeInput() {
    return extraTimeStartTimeInput;
  }

  public List<WebElement> getExtraTimeEndTimeInput() {
    return extraTimeEndTimeInput;
  }

  public List<WebElement> getExtraTimeDeleteButton() {
    return extraTimeDeleteButton;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public List<WebElement> getCoterminalsList() {
    return coterminalsList;
  }
  public String      DELETE_COTERMINAL_BUTTON    = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement  successMessage;

  public WebElement getSuccessMessage() { return successMessage; }

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() {
    return deleteButton;
  }
}
