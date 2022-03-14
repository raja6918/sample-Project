package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class AircraftTypesPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Aircraft types']")
  private WebElement aircraftTypesPageHeader;

  @FindBy(xpath = "//a[contains(@href, 'aircraft/models')]")
  private WebElement aircraftModelsPageLink;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement newAircraftTypeButton;

  @FindBy(id = "aircraftType")
  private WebElement iataTypeTextField;

  @FindBy(xpath = "//div[input[@name='aircraftModel']]/div")
  private WebElement aircrafttModelDropdown;

  @FindBy(xpath = "//div[contains(@class, 'MuiBackdrop-invisible')]")
  private WebElement itemInvisiblePanel;

  @FindBy(id = "aircraftName")
  private WebElement nameTextField;

  @FindBy(xpath = "//div[input[@name='restFacility']]/div")
  private WebElement restFacilityDropdown;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addAircraftTypeButton;

  @FindBy(xpath = "//button[span[text()='SAVE']]")
  private WebElement saveAircraftTypeButton;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement errorMessage;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> aircraftTypesList;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement successMessage;

  public String      AIRCRAFT_TYPE_XPATH    = "//td[text()='%s']//parent::tr//child::td";

  public String      ITEM_SERVED_XPATH      = "//li[p[text()='%s']]";

  public String      CREW_COMPLEMENT_XPATH  = "//label[contains(text(), '%s')]/parent::div/parent::div[contains(@class,'StandardCrewComplement')]";

  public String      EDIT_AIRCRAFT_TYPE_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

  public String      DELETE_AIRCRAFT_TYPE_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/thead/tr[1]/th[7]")
  private WebElement       btnDelete;

  public WebElement getDeleteButton() { return deleteButton; }

  @FindBy(xpath = "(//p[contains(@class, \"MuiTypography-root\")]//parent::div)[1]")
  private WebElement       modelSelect;

  public WebElement getModelSelect() { return modelSelect; }

  public WebElement getSuccessMessage() { return successMessage; }

  public WebElement getAircraftTypesPageHeader() {
    return aircraftTypesPageHeader;
  }

  public WebElement getAircraftModelsPageLink() {
    return aircraftModelsPageLink;
  }

  public WebElement getNameTextField() {
    return nameTextField;
  }

  public WebElement getAddAircraftTypeButton() {
    return addAircraftTypeButton;
  }

  public WebElement getErrorMessage() {
    return errorMessage;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getRestFacilityDropdown() {
    return restFacilityDropdown;
  }

  public WebElement getNewAircraftTypeButton() {
    return newAircraftTypeButton;
  }

  public WebElement getIataTypeTextField() {
    return iataTypeTextField;
  }

  public WebElement getAircraftModelDropdown() {
    return aircrafttModelDropdown;
  }

  public WebElement getItemInvisiblePanel() {
    return itemInvisiblePanel;
  }

  public WebElement getSaveAircraftTypeButton() {
    return saveAircraftTypeButton;
  }

  public List<WebElement> getAircraftTypesList() {
    return aircraftTypesList;
  }

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }

  public WebElement getBtnDelete() {
    return btnDelete;
  }

  @FindBy(xpath = "//h2[text()=\"Standard crew complement\"]")
  private WebElement       standardCrewComplement;

  public WebElement getStandardCrewComplement() {
    return standardCrewComplement;
  }
}
