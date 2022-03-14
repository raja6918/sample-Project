package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class AircraftModelsPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Aircraft models']")
  private WebElement aircraftModelsPageHeader;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement newAircraftModelButton;

  @FindBy(id = "modelCode")
  private WebElement codeTextField;

  @FindBy(id = "modelName")
  private WebElement nameTextField;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addAircraftModelButton;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  @FindBy(xpath = "//button[span[text()='SAVE']]")
  private WebElement saveAircraftModelButton;

  @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
  private WebElement errorMessage;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement  successMessage;

  @FindBy(xpath = "//span[text()='ERROR']")
  private WebElement dependancyErrorMessage;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> aircraftModelsList;

  public String      AIRCRAFT_MODEL_XPATH      = "//td[text()='%s']//parent::tr//child::td";

  public String      EDIT_AIRCRAFT_MODEL_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

  public String      DELETE_AIRCRAFT_MODEL_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

  public WebElement getDeleteButton() { return deleteButton; }

  public WebElement clickCloseButton() { return closeButton; }

  public WebElement getSuccessMessage() { return successMessage; }

  public WebElement getDependancyErrorMessage() { return dependancyErrorMessage; }

  public WebElement getAircraftModelsPageHeader() {
    return aircraftModelsPageHeader;
  }

  public WebElement getNewAircraftModelButton() {
    return newAircraftModelButton;
  }

  public WebElement getNameTextField() {
    return nameTextField;
  }

  public WebElement getCodeTextField() {
    return codeTextField;
  }

  public WebElement getAddAircraftModelButton() {
    return addAircraftModelButton;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getSaveAircraftModelButton() {
    return saveAircraftModelButton;
  }

  public WebElement getErrorMessage() {
    return errorMessage;
  }

  public List<WebElement> getAircraftModelsList() {
    return aircraftModelsList;
  }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() {
    return refErrorMessage;
  }

  @FindBy(xpath = "//a[contains(text(),'Back to aircraft types')]")
  private WebElement backToAircraftLink;

  public WebElement clickBackToAircraftLink() { return backToAircraftLink; }

  @FindBy(xpath = "//span[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement clickRefErrorCloseButton(){ return refErrorCloseButton; }
}
