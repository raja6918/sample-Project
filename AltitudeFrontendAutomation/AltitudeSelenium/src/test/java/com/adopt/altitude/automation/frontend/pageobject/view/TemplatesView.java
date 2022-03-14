package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.TemplatesPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class TemplatesView extends AbstractPageView<TemplatesPageContainer> {

   private final static Logger LOGGER = LogManager.getLogger(TemplatesView.class);

   static int templateCount;

   @PostConstruct
   public void init() throws Exception {
      container = PageFactory.initElements(driver.getWebDriver(), TemplatesPageContainer.class);
   }

   public void clickAddTemplateButton() {
      container.getAddTemplateButton().click();
   }

   public void setSourceTemplate(String sourceTemplate) {
      if (!sourceTemplate.isBlank()) {
         container.getSourceTemplateDropdown().click();
         clickDropdownElement(sourceTemplate);
      }
   }

   public void setTemplateName(String templateName) {
      clearAndSetText(container.getTemplateNameTextfield(), templateName);
   }

   public void setCategory(String category) {
      if (!category.isBlank()) {
         container.getCategoryDropdown().click();
         clickDropdownElement(category);
      }
   }

   public void setDescription(String description) {
      container.getDescriptionTextfield().sendKeys(description);
   }

   public void clickCancelButton() {
      container.getCancelButton().click();
   }

   public void clickCreateButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCreateButton());
      container.getCreateButton().click();
   }

   public boolean isCreateButtonEnabled() {
      return container.getCreateButton().isEnabled();
   }

   public List<String> getTemplates() {
      List<WebElement> webElements = container.getCurrentTemplates();
      List<String> templates = new ArrayList<>();

      for (WebElement element : webElements) {
         ExpectedConditions.visibilityOf(element);
         templates.add(element.getText());
      }

      return templates;
   }

   public boolean isAddNewTemplateFormNotDisplayed() {
      return driver.waitToDisappear(By.xpath(String.format(container.newTemplatesHeader)), 2, TimeUnit.SECONDS);
   }

   public boolean isAddNewTemplateFormDislayed() {
      return isElementVisible(container.getAddNewTemplateFormHeader());
   }

   public void clickOptionsButton(String templateName) {
      WebElement templateOptionsButton = driver.getWebDriver().findElement(By.xpath(String.format(container.optionsButton, templateName)));
      driver.scrollToElement(templateOptionsButton);
      driver.waitForElement(templateOptionsButton, 10, 1).click();
   }

   public void clickDeleteItemOptionMenu() {
      driver.waitForElement(container.getDeleteItem(), 10, 1).click();
   }

   public void clickDeleteButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
      driver.clickAction(container.getDeleteButton());
   }

   public void clickEditItemOptionMenu() {
      driver.waitForElement(container.getEditItem()).click();
   }

   public void clickGetInfoItemOptionMenu() {
      driver.waitForElement(container.getGetInfoItem()).click();
   }

   public void setTemplateNameInInfo(String templateName) {
      clearAndSetText(container.getInfoTemplateNameTextField(), templateName);
   }

   public void setCategoryInInfo(String category) throws InterruptedException {
    // driver.scrollToElement(container.getInfoCategoryDropdown());
      container.getCategoryInfo().click();
     TimeUnit.SECONDS.sleep(1);
     driver.getWebDriver().findElement(By.xpath(String.format(container.selectCategory, category))).click();
     TimeUnit.SECONDS.sleep(1);
     // container.getInfoCategoryDropdown().sendKeys(category);


   }

   public void setDescriptionInInfo(String description) throws InterruptedException {
     driver.scrollToElement(container.getInfoDescriptionTextField());
     TimeUnit.SECONDS.sleep(1);
      clearAndSetText(container.getInfoDescriptionTextField(), description);
   }

   public String getTemplateNameInInfo() {
      return container.getInfoTemplateNameTextField().getAttribute("value");
   }

   public String getCategoryInInfo() {
      return container.getInfoCategoryDropdown().getText();
   }

   public String getDescriptionInInfo() {
      return container.getInfoDescriptionTextField().getText();
   }

   public void clickCancelInfoButton() {
      container.getInfoCancelButton().click();
   }

   public void clickSaveInfoButton() {
      driver.jsClick(container.getInfoSaveButton());
   }

   public boolean isSaveButtonEnabled() {
      return container.getInfoSaveButton().isEnabled();
   }

   public String getSnackbarMessage() {
      return container.getSnackbar().getText();
   }

   public void openDataItem(String templateName) throws InterruptedException {
     WebElement templateNameCard = driver.getWebDriver().findElement(By.xpath(String.format(container.TEMPLATE_CARD, templateName)));
     TimeUnit.SECONDS.sleep(3);
     driver.jsClick(templateNameCard);
   }

   public String getTemplateMode(String templateName) throws InterruptedException {
     WebElement template = driver.getWebDriver().findElement(By.xpath(String.format(container.TEMPLATE_CARD_READONLY, templateName)));
     driver.scrollToElement(template);
     TimeUnit.SECONDS.sleep(1);
     driver.mouseOver(template);
     TimeUnit.SECONDS.sleep(2);
     String actualTooltipMessage=container.getTooltipTemplateMessage().getText();
     TimeUnit.SECONDS.sleep(1);
     LOGGER.info("actualTooltipMessage "+actualTooltipMessage);
     return actualTooltipMessage;
     // return template.getAttribute("title");
  }

  public boolean isReadOnlyInfoDialogDisplayed() {
     return container.getReadOnlyDialogTitle() != null;
   }

  public void clickOpenTemplateInReadOnlyMode() {
    container.getOpenButton().click();
  }

   @Override
   public boolean isDisplayedCheck() {
      driver.waitForElement(container.getAddTemplateButton(), 10);
      return container.getTemplatesPageHeader().isDisplayed() && container.getAddTemplateButton().isDisplayed();
   }

   private void clickDropdownElement(String element) {
      driver.getWebDriver().findElement(By.xpath(String.format(container.NEW_TEMPLATE_DROPDOWN_ELEMENT, element))).click();
   }

  public void checkAllTemplates() throws InterruptedException {
     TimeUnit.SECONDS.sleep(2);
    templateCount = container.getAllTemplates().size();
    LOGGER.info("templateCount: "+templateCount);
    Assert.assertTrue(templateCount>0);
  }

  public void checkAllReadOnlyTemplates() {
    int readOnlyTemplateCount = container.getAllTemplatesReadOnly().size();
    LOGGER.info("readOnlyTemplateCount: "+readOnlyTemplateCount);
    Assert.assertTrue(templateCount==readOnlyTemplateCount);

  }

  public void checkAllTemplatesReadOnlyMessage(String Message) throws InterruptedException {
    templateCount = container.getAllTemplates().size();
    LOGGER.info("templateCount: "+templateCount);
    for(int i= 0;i<templateCount; i++)
    {
      driver.scrollToElement(container.getAllTemplates().get(i));
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(container.getAllTemplatesReadOnly().get(i));
      TimeUnit.SECONDS.sleep(2);
      String actualTooltipMessage=container.getTooltipTemplateMessageReadOnly().getText();

      LOGGER.info("actualTooltipMessage: "+actualTooltipMessage);
      Assert.assertTrue(actualTooltipMessage.equals(Message));
      TimeUnit.SECONDS.sleep(2);
    }

  }

  public void verifyTemplateNameDisabled()  {
    WebElement TemplateName = container.getInfoTemplateNameTextField();
    String optionDetails = TemplateName.getAttribute("class");
    LOGGER.info("TemplateName: " + TemplateName);
    Assert.assertTrue(optionDetails.contains("disabled"));
  }

  public void verifyTemplateCategoryDisabled()  {
    WebElement TemplateName = container.getInfoCategoryDropdownStatus();
    String optionDetails = TemplateName.getAttribute("class");
    LOGGER.info("TemplateName: " + TemplateName);
    Assert.assertTrue(optionDetails.contains("disabled"));
  }

  public void verifyTemplateDescriptionDisabled() throws InterruptedException {
    WebElement templateDescription = container.getInfoDescriptionTextField();
    String templateDescriptionDetail = templateDescription.getAttribute("class");
    LOGGER.info("templateDescriptionDetail: " + templateDescriptionDetail);
    Assert.assertTrue(templateDescriptionDetail.contains("disabled"));
    container.getCloseBtn().click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyTemplateOptionEnabled(String templateOption) throws InterruptedException {
    WebElement templateOptions =       driver.getWebDriver().findElement(By.xpath(String.format(container.templateButton, templateOption)));
    String templateDescriptionDetail = templateOptions.getAttribute("class");
    LOGGER.info("templateDescriptionDetail: " + templateDescriptionDetail);
    Assert.assertTrue(!(templateDescriptionDetail.contains("disabled")));
  }

  public void clickTemplateOption(String templateOption) throws InterruptedException {
    WebElement templateOptions =       driver.getWebDriver().findElement(By.xpath(String.format(container.templateButton, templateOption)));
   templateOptions.click();
   TimeUnit.SECONDS.sleep(2);
  }

}
