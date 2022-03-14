package com.adopt.altitude.automation.frontend.pageobject.containers;

import java.util.List;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class RegionsPageContainer extends PageContainer {

   @FindBy(xpath = "//h2[text()='Regions']")
   private WebElement       regionsPageHeader;

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement       addNewRegionButton;

   @FindBy(xpath = "//input[@id='regionCode']")
   private WebElement       codeInput;

   @FindBy(xpath = "//input[@id='regionName']")
   private WebElement       nameInput;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement       addRegionButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement       saveRegionButton;

   @FindBy(xpath = "//button[span[text()='Cancel']]")
   private WebElement       cancelButton;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement       deleteButton;

  @FindBy(xpath = "//a[contains(@href,'regions')]")
  private WebElement       regionLink;

  @FindBy(xpath = "//div[contains(@class, 'RegionsForm__Input')]/following::p")
  private WebElement       errorMessage;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

   @FindBy(xpath = "//tbody/tr")
   private List<WebElement> regionsList;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement regionCount;

  @FindBy(xpath = "//h2[text() = 'Regions']/following-sibling::p")
  private WebElement scenarioStatus;

   public String            REGION_XPATH = "//td[text()='%s']//parent::tr//child::td";

   public String            EDIT_REGION_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

  public String            deleteRegionButton = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

   public WebElement getRegionsPageHeader() {
      return regionsPageHeader;
   }

   public WebElement getAddNewRegionButton() {
      return addNewRegionButton;
   }

   public WebElement getCodeInput() {
      return codeInput;
   }

   public WebElement getNameInput() {
      return nameInput;
   }

   public WebElement getAddRegionButton() {
      return addRegionButton;
   }

   public WebElement getSaveRegionButton() {
      return saveRegionButton;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

  public WebElement getRegionLink() {
    return regionLink;
  }

  public WebElement getDeleteButton() {
    return deleteButton;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

   public WebElement getErrorMessage() {
      return errorMessage;
   }

   public List<WebElement> getRegionsList() {
      return regionsList;
   }

  public WebElement getRegionCount() {
    return regionCount;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }
}
