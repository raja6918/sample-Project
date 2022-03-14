package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.TemplatesView;
import com.adopt.altitude.automation.frontend.template.Template;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TemplatesPage extends AbstractPage {

   @Autowired
   @Lazy(true)
   private TemplatesView templatesView;

   /**
    * Open the add templates form by clicking the '+' button
    */
   public void openAddTemplatesForm() {
      templatesView.clickAddTemplateButton();
   }

   /**
    * Fill out the add template form with the given values
    *
    * @param template
    */
   public void fillOutAddTemplateForm(Template template) {
      templatesView.setSourceTemplate(template.getSourceTemplate());
      fillOutTemplateForm(template);
   }

   public void fillOutTemplateForm(Template template) {
      templatesView.setTemplateName(template.getName());
      templatesView.setCategory(template.getCategory());
      templatesView.setDescription(template.getDescription());
   }

   /**
    * Click create button to add a new template to the list
    */
   public void addTemplate() {
      templatesView.clickCreateButton();
   }

   /**
    * Verify create button is Inactive if some mandatory fields are empty
    */
   public boolean isCreateButtonInactive() {
      return templatesView.isCreateButtonEnabled();
   }

   /**
    * Cancel the creation of template
    */
   public void cancelTemplate() {
      templatesView.clickCancelButton();
   }

   /**
    * Close the add template window
    */
   public void closeAddTemplateWindow() {
      templatesView.clickCancelButton();
   }

   /**
    * Get all the templates on the page
    *
    * @return
    */
   public List<String> getTemplates() {
      return templatesView.getTemplates();
   }

   /**
    * Verify if the add template window is displayed or closed
    *
    * @param isDisplayed
    */
   public void verifyAddTemplateWindowDisplayed(Boolean isDisplayed) {
      if (isDisplayed)
         Assert.assertTrue(templatesView.isAddNewTemplateFormDislayed());
      else
         Assert.assertTrue(templatesView.isAddNewTemplateFormNotDisplayed());
   }

   /**
    * Display the options of actions that can be performed on a template
    *
    * @param templateName
    */
   public void displayOptions(String templateName) {
      templatesView.clickOptionsButton(templateName);
   }

  public void verifyTemplateNameDisabled() {
    templatesView.verifyTemplateNameDisabled();
  }

  public void verifyTemplateCategoryDisabled() {
    templatesView.verifyTemplateCategoryDisabled();
  }

  public void verifyTemplateDescriptionDisabled() throws InterruptedException {
    templatesView.verifyTemplateDescriptionDisabled();
  }

   /**
    * Open the delete templates form
    */
   public void openDeleteTemplateForm() {
      templatesView.clickDeleteItemOptionMenu();
   }

   /**
    * Delete a template
    */
   public void deleteTemplate() {
      templatesView.clickDeleteButton();
   }

   /**
    * Open the edit templates page
    */
   public void openEditTemplatePage() {
      templatesView.clickEditItemOptionMenu();
   }

   /**
    * Open the get info templates page
    */
   public void openGetInfoTemplatePage() {
      templatesView.clickGetInfoItemOptionMenu();
   }

   /**
    * Fill out the edit template form with the given values
    *
    * @param template
    */
   public void fillOutEditTemplateForm(Template template) throws InterruptedException {
      templatesView.setTemplateNameInInfo(template.getName());
      templatesView.setCategoryInInfo(template.getCategory());
      templatesView.setDescriptionInInfo(template.getDescription());
   }

   /**
    * Click Save button in Info to save changes to template
    */
   public void SaveInfo() {
      templatesView.clickSaveInfoButton();
   }

   public String getSnackbarMessage() {
      return templatesView.getSnackbarMessage();
   }

   /**
    * Verify all the given fields for the template to assure the edited changes have been saved
    *
    * @param name
    * @param category
    * @param description
    */
   public void verifyTemplateDetails(String name, String category, String description) {
      Assert.assertEquals(templatesView.getTemplateNameInInfo(), name);
      Assert.assertEquals(templatesView.getCategoryInInfo(), category);
      Assert.assertEquals(templatesView.getDescriptionInInfo(), description);
   }

   /**
    * Verify save button is Inactive if some mandatory fields are empty
    */
   public void verifySaveButtonInactive() {
      Assert.assertFalse(templatesView.isSaveButtonEnabled());
   }

   public void openDataItem(String templateName) throws InterruptedException {
    templatesView.openDataItem(templateName); }

    public void validateReadOnlyMode(String templateName) throws InterruptedException {
     Assert.assertEquals("This template is being viewed by someone else", templatesView.getTemplateMode(templateName));
   }

   public void validateViewOnlyInfoDialog() {
     Assert.assertTrue(templatesView.isReadOnlyInfoDialogDisplayed());
   }

   public void openTemplateReadOnlyMode() {
     templatesView.clickOpenTemplateInReadOnlyMode();
   }

  public void checkAllTemplates() throws InterruptedException {
    templatesView.checkAllTemplates();
  }

  public void checkAllReadOnlyTemplates() {
    templatesView.checkAllReadOnlyTemplates();
  }

  public void checkAllTemplatesReadOnlyMessage(String Message) throws InterruptedException {
    templatesView.checkAllTemplatesReadOnlyMessage(Message);
  }

  public void verifyTemplateOptionEnabled(String templateOption) throws InterruptedException {
    templatesView.verifyTemplateOptionEnabled(templateOption);
  }

  public void clickTemplateOption(String templateOption) throws InterruptedException {
    templatesView.clickTemplateOption(templateOption);
  }

   /**
    * Check if templates page is displayed
    *
    * @return
    */
   @Override
   public boolean isPageDisplayed() {
      return templatesView.isDisplayedCheck();
   }
}
