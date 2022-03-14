package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class PositionsPageContainer extends PageContainer {

   @FindBy(xpath = "//h2[text()='Positions']")
   private WebElement positionsPageHeader;

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement newPositionButton;

   @FindBy(id = "positionCode")
   private WebElement codeTextField;

   @FindBy(id = "positionName")
   private WebElement nameTextField;

   @FindBy(xpath = "//label[text()='Position type']/following-sibling::div")
   private WebElement typeMenu;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement addPositionButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement savePositionButton;

   @FindBy(xpath = "//button[span[text()='Cancel']]")
   private WebElement cancelButton;

   @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
   private WebElement errorMessage;

   @FindBy(xpath = "//h2[text() = 'Positions']/following-sibling::p")
   private WebElement scenarioStatus;

/*  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div/span")
  private WebElement       successMessage;*/

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

  @FindBy(xpath = "//tr[contains(@id, 'tablerow')]")
  private List<WebElement> positionsList;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement positionCount;

   public String      TYPE_ELEMENT_XPATH  = "//li[p[text()='%s']]";

   public String      POSITION_XPATH      = "//td[text()='%s']//parent::tr//child::td";

   public String      EDIT_POSITION_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

   public WebElement getPositionsPageHeader() {
      return positionsPageHeader;
   }

   public WebElement getNewPositionButton() {
      return newPositionButton;
   }

   public WebElement getCodeTextField() {
      return codeTextField;
   }

   public WebElement getNameTextField() {
      return nameTextField;
   }

   public WebElement getTypeMenu() {
      return typeMenu;
   }

   public WebElement getAddPositionButton() {
      return addPositionButton;
   }

   public WebElement getSavePositionButton() {
      return savePositionButton;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getErrorMessage() {
      return errorMessage;
   }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public List<WebElement> getPositionsList() {
    return positionsList;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getPositionCount() {
    return positionCount;
  }

  @FindBy(xpath = "//p[contains(text(), 'Positions')]/parent::a")
  private WebElement positionLeftpanelIcon;

  public WebElement clickPositionLeftpanelIcon() {
    return positionLeftpanelIcon;
  }

  public String DELETE_POSITION_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() { return deleteButton; }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() {
    return refErrorMessage;
  }

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }
}
