package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class TemplatesPageContainer extends PageContainer {

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement       addTemplateButton;

   @FindBy(xpath = "//p[text() = 'Templates']")
   private WebElement       templatesPageHeader;

  @FindBy(xpath = "//*[text()='Create a new template']")
   private WebElement       addNewTemplateFormHeader;

   @FindBy(xpath = "//div[text() = \"Source template *\"]")
   private WebElement       sourceTemplateDropdown;

   @FindBy(xpath = "//span[@title='Clear value']")
   private WebElement       clearSourceTemplate;

   @FindBy(xpath = "//input[@id='templateName']")
   private WebElement       templateNameTextfield;

   @FindBy(xpath = "//label[text()= \"Category\"]//parent::div")
   private WebElement       categoryDropdown;

   @FindBy(xpath = "//textarea[@id='description']")
   private WebElement       descriptionTextfield;

   @FindBy(xpath = "//span[text()='CANCEL']")
   private WebElement       cancelButton;

   @FindBy(xpath = "//button[span[text()='CREATE']]")
   private WebElement       createButton;

   @FindBy(xpath = "//li[@role='menuitem']/child::*[text()='Open']")
   private WebElement       editItem;

   @FindBy(xpath = "//li[@role='menuitem']/child::*[text()='Get/Edit info']")
   private WebElement       getInfoItem;

   @FindBy(xpath = "//li[@role='menuitem']/child::*[text()='Delete']")
   private WebElement       deleteItem;

   @FindBy(xpath = "//button[span[text()='DELETE']]")
   private WebElement       deleteButton;

   @FindBy(xpath = "//input[@id='name']")
   private WebElement       infoTemplateNameTextField;

   @FindBy(xpath = "//label[text()='Category']/following-sibling::*/descendant::div")
   private WebElement       infoCategoryDropdown;

   @FindBy(xpath = "//textarea[@id='description']")
   private WebElement       infoDescriptionTextField;

   @FindBy(xpath = "//span[text()='Cancel']")
   private WebElement       infoCancelButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement       infoSaveButton;

   @FindBy(xpath = "//div[contains(@class, 'TemplateCard')]/child::p[1]")
   private List<WebElement> currentTemplates;

   @FindBy(xpath = "//div[@id='notification-area']/descendant::div[@class='msg']")
   private WebElement       snackbar;

   @FindBy(xpath = "//div[contains(@class, 'DialogTitle')]/child::h2[text()='Open Scenario in View-Only Mode?']")
   private WebElement       readOnlyDialogTitle;

   @FindBy(xpath = "//button[span[text() = 'Open']]")
   private WebElement       openButton;

   public String            optionsButton                 = "//p[text()='%s']/parent::*/following-sibling::*/child::button";

   public String            templateButton                 = "//p[text()= '%s']//parent::li";

   public String            newTemplatesHeader            = "//h2[text()='Create a New Template']";

   public String            TEMPLATE_CARD                 = "//p[text()='%s']/parent::div[contains(@class, 'TemplateCard__TemplateHead')]";

   public String            TEMPLATE_CARD_READONLY        = "//div[contains(@class, 'TemplateCard')]/child::p[text()='%s']/following-sibling::div";

   public String            NEW_TEMPLATE_DROPDOWN_ELEMENT = "//div[@class='Select-menu-outer']//div[text()='%s']";

   public WebElement getTemplatesPageHeader() {
      return templatesPageHeader;
   }

   public WebElement getAddTemplateButton() {
      return addTemplateButton;
   }

   public WebElement getAddNewTemplateFormHeader() {
      return addNewTemplateFormHeader;
   }

   public WebElement getSourceTemplateDropdown() {
      return sourceTemplateDropdown;
   }

   public WebElement getClearSourceTemplate() {
      return clearSourceTemplate;
   }

   public WebElement getTemplateNameTextfield() {
      return templateNameTextfield;
   }

   public WebElement getCategoryDropdown() {
      return categoryDropdown;
   }

   public WebElement getDescriptionTextfield() {
      return descriptionTextfield;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getCreateButton() {
      return createButton;
   }

   public WebElement getDeleteItem() {
      return deleteItem;
   }

   public WebElement getDeleteButton() {
      return deleteButton;
   }

   public WebElement getEditItem() {
      return editItem;
   }

   public WebElement getGetInfoItem() {
      return getInfoItem;
   }

   public WebElement getInfoTemplateNameTextField() {
      return infoTemplateNameTextField;
   }

   public WebElement getInfoCategoryDropdown() {
      return infoCategoryDropdown;
   }

   public WebElement getInfoDescriptionTextField() {
      return infoDescriptionTextField;
   }

   public WebElement getInfoCancelButton() {
      return infoCancelButton;
   }

   public WebElement getInfoSaveButton() {
      return infoSaveButton;
   }

   public List<WebElement> getCurrentTemplates() {
      return currentTemplates;
   }

   public WebElement getSnackbar() {
      return snackbar;
   }

   public WebElement getReadOnlyDialogTitle() {
      return readOnlyDialogTitle;
   }

   public WebElement getOpenButton() {
      return openButton;
   }

  @FindBy(xpath = "//*[@class='tippy-popper']//div[@class='tippy-tooltip-content']/p")
  private WebElement  tooltipTemplateMessage;

  public WebElement  getTooltipTemplateMessage() { return tooltipTemplateMessage; }

  @FindBy(xpath = "//h2[text()= \"Data Home\"]")
  private WebElement  openDataHome;

  public WebElement  getOpenDataHome() { return openDataHome; }

  @FindBy(xpath = "//div[contains(@class, 'TemplateCard__Holder')]")
  private List<WebElement> AllTemplates;

  public List<WebElement> getAllTemplates() { return AllTemplates;}

  @FindBy(xpath = "//span[contains(@class,\"material-icons\") and text()=\"visibility\"]")
  private List<WebElement> AllTemplatesReadOnly;

  public List<WebElement> getAllTemplatesReadOnly() { return AllTemplatesReadOnly;}

  @FindBy(xpath = "//*[@class='tippy-popper']/descendant::div/p")
  private WebElement  tooltipTemplateMessageReadOnly;

  public WebElement  getTooltipTemplateMessageReadOnly() { return tooltipTemplateMessageReadOnly; }

  @FindBy(xpath = "//label[text()='Category']/following-sibling::*/descendant::div")
  private WebElement       infoCategoryDropdownStatus;

  public WebElement  getInfoCategoryDropdownStatus() { return infoCategoryDropdownStatus; }

  @FindBy(xpath = "//span[text()=\"CLOSE\"]//parent::button")
  private WebElement       closeBtn;

  public WebElement  getCloseBtn() { return closeBtn; }

  @FindBy(xpath = "//div[@role=\"button\"]")
  private WebElement categoryInfo;

  public WebElement getCategoryInfo() { return categoryInfo; }

  public String selectCategory = "//ul[@role='listbox']/li/p[text()='%s']";
}
