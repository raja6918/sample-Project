package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class CrewBasesPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Crew bases']")
  private WebElement crewBasesPageHeader;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addCrewBaseButton;

  @FindBy(xpath = "//span[text()='Add Crew Base']")
  private WebElement addNewCrewBaseFormHeader;

  @FindBy(xpath = "//input[@id='baseCode']")
  private WebElement baseCodeTextfield;

  @FindBy(xpath = "//input[@id='baseName']")
  private WebElement baseNameTextfield;

  @FindBy(xpath = "//input[@id='countryCode']")
  private WebElement countryDropdown;

  @FindBy(xpath = "//div[input[@name='stationCodes']]/div")
  private WebElement stationDropdown;

  @FindBy(xpath = "//div[@id = 'menu-stationCodes']/child::div[1]")
  private WebElement stationInvisiblePanel;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addButton;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement crewBaseFormErrorMessage;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  @FindBy(xpath = "//button/span[text()='SAVE']")
  private WebElement saveButton;

  @FindBy(xpath = "//h2[text() = 'Crew bases']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> crewBasesList;

  public String      LIST_ITEM                 = "//li[div/span[text()='%s']]";

  public String      DELETE_CREWBASE_BUTTON    = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

  public String      EDIT_CREWBASE_BUTTON      = "//td[text()='%s']/following-sibling::td/button[1]";

  public String      CREWBASE_XPATH            = "//td[text()='%s']//parent::tr//child::td";

  public WebElement getCrewBasesPageHeader() {
    return crewBasesPageHeader;
  }

  public WebElement getAddCrewBaseButton() {
    return addCrewBaseButton;
  }

  public WebElement getAddNewCrewBaseFormHeader() {
    return addNewCrewBaseFormHeader;
  }

  public WebElement getAddButton() {
    return addButton;
  }

  public WebElement getBaseCodeTextfield() {
    return baseCodeTextfield;
  }

  public WebElement getBaseNameTextfield() {
    return baseNameTextfield;
  }

  public WebElement getCountryDropdown() {
    return countryDropdown;
  }

  public WebElement getStationDropdown() {
    return stationDropdown;
  }

  public WebElement getStationInvisiblePanel() {
    return stationInvisiblePanel;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getDeleteButton() {
    return deleteButton;
  }

  public WebElement getCrewBaseFormErrorMessage() {
    return crewBaseFormErrorMessage;
  }

  public WebElement getSaveButton() {
    return saveButton;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public List<WebElement> getCrewBasesList() {
    return crewBasesList;
  }

  public String      DELETE_ACCOMMODATION_XPATH = "//td[text()='%s']/following-sibling::td/button[2]";

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement  successMessage;

  public WebElement getSuccessMessage() { return successMessage; }

  @FindBy(xpath = "//span[text()='ERROR']")
  private WebElement dependancyErrorMessage;

  public WebElement getDependancyErrorMessage() { return dependancyErrorMessage; }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() {
    return refErrorMessage;
  }

  @FindBy(xpath = "//span[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement clickRefErrorCloseButton(){ return refErrorCloseButton; }
  @FindBy(xpath = "//*[@class='MuiAutocomplete-endAdornment']/button[@aria-label='Open']")
  private WebElement stationsDropdownicon;
  public WebElement getStationsDropdownicon() {
    return stationsDropdownicon;
  }
  @FindBy(xpath = "//*[@id='stationCodes']")
  private WebElement stationsDropdown;
  public WebElement getStationsDropdown() {
    return stationsDropdown;
  }
  public String      STATION_SERVED      = "//*[@role='presentation' and @class='MuiAutocomplete-popper']/descendant::li/span[text()='%s']";
}
