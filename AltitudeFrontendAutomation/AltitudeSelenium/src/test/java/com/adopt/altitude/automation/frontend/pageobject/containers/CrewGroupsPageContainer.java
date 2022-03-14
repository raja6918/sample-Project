package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class CrewGroupsPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Crew Groups']")
  private WebElement crewGroupsPageHeader;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addNewCrewGroupsButton;

  @FindBy(xpath = "//input[@id='name']")
  private WebElement crewGroupName;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement crewGroupCancelButton;

  @FindBy(xpath = "//button[span[text()='SAVE']]")
  private WebElement crewGroupSaveButton;

  @FindBy(xpath = "//span[span[text()='close']]")
  private WebElement crewGroupCloseButton;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement crewGroupAddButton;

  @FindBy(xpath = "//button[@class=\"MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary\"]")
  private WebElement crewGroupFormAddButton;

  public WebElement getCrewGroupFormAddButton() {
    return crewGroupFormAddButton;
  }

  @FindBy(xpath = "//label[contains(text(),'Position(s)')]/parent::div/parent::div")
  private WebElement crewGroupPosition;

  @FindBy(xpath = "//label[contains(text(),'Airline')]/parent::div/parent::div")
  private WebElement crewGroupAirline;

  @FindBy(xpath = "//label[contains(text(),'Aircraft type(s)')]/parent::div/parent::div")
  private WebElement crewGroupAircraftType;

  @FindBy(xpath = "//label[contains(text(),'Default rule set')]/parent::div/parent::div")
  private WebElement crewGroupDefaultRuleSet;

  @FindBy(xpath = "//div[contains(@class, 'error')]//div//div//div//div")
  private WebElement crewGroupAddErrorMessage;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement errorMessage;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

  @FindBy(xpath = "//span[text()='Select all']")
  private WebElement       selectAll;

  @FindBy(xpath = "//span[text()='Clear all']")
  private WebElement       clearAll;

  @FindBy(xpath = "//span[text()='Flight deck']")
  private WebElement       flightDeck;

  @FindBy(xpath = "//span[text()='Cabin crew']")
  private WebElement       cabinCrew;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/thead/tr[1]/th[7]")
  private WebElement       btnDelete;

  private List < WebElement > crewGroupsList;

  public String CREW_GROUPS_VALUE = "//input[@value = '%s']/parent::span//parent::span//parent::label";
  public String CREW_GROUPS_DEFAULT_RULE_SET = "//li[contains(text(),'%s')]";
  public String DEFAULT_RULE_SET_VALUE = "//li[contains(text(),'%s')]";
  public String CREW_GROUPS_XPATH = "//td[text()='%s']//parent::tr//child::td";
  public String            EDIT_CREW_GROUPS_XPATH  = "//td[text()='%s']/following-sibling::td/button[1]";

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[7]/button[1]/span[1]/span")
  private WebElement clickFilter;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[2]/th[2]/div/div/input")
  private WebElement crewGroupFilterName;

  public WebElement getCrewGroupsPageHeader() {
    return crewGroupsPageHeader;
  }

  public WebElement getAddNewCrewGroupsButton() {
    return addNewCrewGroupsButton;
  }

  public WebElement getCrewGroupsName() {
    return crewGroupName;
  }

  public WebElement getCrewGroupsCancelButton() {
    return crewGroupCancelButton;
  }

  public WebElement getCrewGroupSaveButton() {
    return crewGroupSaveButton;
  }

  public WebElement getCrewGroupsCloseButton() {
    return crewGroupCloseButton;
  }

  public WebElement getCrewGroupsAddButton() {
    return crewGroupAddButton;
  }

  public WebElement getCrewGroupsPosition() {
    return crewGroupPosition;
  }

  public WebElement getCrewGroupsAirline() {
    return crewGroupAirline;
  }

  public WebElement getCrewGroupsAircraftType() {
    return crewGroupAircraftType;
  }

  public WebElement getCrewGroupsDefaultRuleSet() {
    return crewGroupDefaultRuleSet;
  }

  public List < WebElement > getCrewGroupsList() {
    return crewGroupsList;
  }

  public WebElement getCrewGroupFormErrorMessage() {
    return crewGroupAddErrorMessage;
  }

  public WebElement getErrorMessage() {
    return errorMessage;
  }

  public WebElement getClickFilter()
  {
    return clickFilter;
  }

  public  WebElement getCrewGroupFilterName()
  {
    return  crewGroupFilterName;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getSelectAll() {
    return selectAll;
  }

  public WebElement getClearAll() {
    return clearAll;
  }

  public WebElement getFlightDeck() {
    return flightDeck;
  }

  public WebElement getCabinCrew() {
    return cabinCrew;
  }

  public String DELETE_CREWGROUP_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() { return deleteButton; }

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  public WebElement getCancelButton() {
    return cancelButton;
  }

  @FindBy(xpath = "//p[contains(text(), 'Crew groups')]/parent::a")
  private WebElement crewGroupLeftpanelIcon;

  public WebElement clickCrewGroupLeftpanelIcon() {
    return crewGroupLeftpanelIcon;
  }

  public WebElement getBtnDelete() {
    return btnDelete;

  }

  @FindBy(xpath = "//span[(text()='Default rule set')]")
  private WebElement defaultRuleSet;

  @FindBy(xpath = "//span[(text()='filter_list')]")
  private WebElement filter_list;

  public WebElement getDefaultRuleSet() {
    return defaultRuleSet;

  }

  public WebElement getFilter_list() {
    return filter_list;

  }

}
