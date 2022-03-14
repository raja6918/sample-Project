package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class ScenariosPageContainer extends PageContainer {

   @FindBy(xpath = "//h6[text()='Scenarios']")
   private WebElement       headerTitle;

   @FindBy(css = "ul li button")
   private WebElement       createdByMenu;

   @FindBy(xpath = "//li[@role='menuitem']/child::p")
   private List<WebElement> createdByItems;

   @FindBy(css = "#main-container tr")
   private List<WebElement> scenariosTable;

   @FindBy(xpath = "//p[text()='Me']")
   private WebElement       createByMeItem;

   @FindBy(xpath = "//p[text()='Anyone']")
   private WebElement       createByAnyoneItem;

   @FindBy(xpath = "//p[text()='Not me']")
   private WebElement       createByNotMeItem;

   @FindBy(css = "button[aria-label='add']")
   private WebElement       addScenarioButton;

   @FindBy(xpath = "//div[contains(@class,'TemplateCard__Holder')]")
   private List<WebElement> templatesList;

   @FindBy(id = "scenarioName")
   private WebElement       scenarioNameTextInput;

   @FindBy(id = "name")
   private WebElement       scenarioNameDrawerTextInput;

   @FindBy(xpath = "//button[@type='submit']")
   private WebElement       createScenarioButton;

   @FindBy(id = "scenarioDuration")
   private WebElement       periodTextInput;

   @FindBy(xpath = "//div[contains(@class, 'DatesContainer')]/span")
   private WebElement       datesPeriodText;

   @FindBy(id = "startDate")
   private WebElement       startDateTextinput;

   @FindBy(id = "scenarioDuration-helper-text")
   private WebElement       durationErrorText;

   @FindBy(xpath = "//button[contains(@class, 'HamburgerDrawer')]")
   private WebElement       hamburgerButton;

   @FindBy(xpath = "//span[contains(text(),'arrow_drop_down')]")
   private WebElement       openProfileButton;

   @FindBy(xpath = "//a[@href='/users']")
   private WebElement       profileUserAdministrationItem;

   @FindBy(xpath = "//span[text()='delete']")
   private WebElement       deleteScenarioOption;

   @FindBy(xpath = "//span[text()='DELETE']/parent::button")
   private WebElement       confirmDeleteButton;

   @FindBy(xpath = "//button[span[text()='CANCEL']]")
   private WebElement cancelButton;

   @FindBy(xpath = "//p[contains(text(),'Scenarios')]/ancestor::a")
   private WebElement ScenarioLink;

   @FindBy(xpath = "//p[contains(text(),'Templates')]/ancestor::a")
   private WebElement TemplateLink;

   @FindBy(xpath = "//p[text()='Get/Edit info']")
   private WebElement       getInfoOption;

   @FindBy(xpath = "//p[text()='Save as template']")
   private WebElement       saveAsTemplateOption;

   @FindBy(xpath = "//p[text()='Delete']")
   private WebElement       deleteOption;

   @FindBy(xpath = "//a[@href='/templates']")
   private WebElement       profileTemplatesItem;

   @FindBy(xpath = "//a[contains(@class, 'HamburgerDrawer')]/child::p[text()='Data']")
   private WebElement       dataItem;

   @FindBy(xpath = "//div[@id='notification-area']/descendant::div[@class='msg']")
   private WebElement       snackbar;

   @FindBy(xpath = "//button[contains(@class,'ProfileBTN')]")
   private WebElement       userMenu;

   @FindBy(xpath = "//p[text() = 'Sign out']/parent::a")
   private WebElement       signOutButton;

   @FindBy(xpath = "//div[contains(@class, 'DialogTitle')]/child::h2[text()='Open Scenario in View-Only Mode?']")
   private WebElement       readOnlyDialogTitle;

   @FindBy(xpath = "//button[span[text() = 'Open']]")
   private WebElement       openButton;

   @FindBy(xpath = "//button//span//h6")
   private WebElement       calendarYearHeader;

   @FindBy(xpath = "//div//p[@class=\"MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter\"]")
   private WebElement       calendarMonth;

   @FindBy(xpath = "(//button[1]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg'])[2]")
   private WebElement       calendarLeftArrowButton;

   @FindBy(xpath = "//button[2]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg']")
   private WebElement       calendarRightArrowButton;

   @FindBy(xpath = "//button/span[text()='OK']")
   private WebElement       calendarOkButton;

   @FindBy(xpath = "//button/following::span[text()='date_range']")
   private WebElement       calendarDateButton;

   @FindBy(xpath = "//a[contains(@href,'/pairings')]")
   private WebElement       profilePairingsItem;

   @FindBy(xpath = "//a[contains(@href,'/solver')]")
   private WebElement       profileSolverItem;

   public String            CALENDAR_YEAR                 = "//div[(@role='button')and(text()='%s')]";

  public String            CALENDAR_DAY                  = "//*[@class='MuiPickersCalendar-week']/descendant::p[text()='%s']";

   public final String      scenarioNameCell              = "//td[contains(@id, 'name')]/div[text() = '%s']";

   public final String      SCENARIO_OPTIONS_BUTTON_XPATH = "//div[text()='%s']/parent::*/following-sibling::*/child::button";

   public final String      TEMPLATE_XPATH                = "//div[contains(@class,'TemplateHead')]/p[text()='%s']";

   public final String      SCENARIO_STATUS_XPATH         = "//div[text()='%s']/parent::*/parent::tr";

   public final String      REFERENCE_DATA                ="//span[text()='%s']";

  public final String      SCENARIO_OPTION                ="//p[text()= '%s']//parent::li";

   @FindBy(xpath = "//h2[text()='Data home']")
   private WebElement pageTitle;

  public WebElement getPageTitle() {
    return pageTitle;
  }

  public WebElement getAddScenarioButton() {
      return addScenarioButton;
   }

   public List<WebElement> getTemplates() {
      return templatesList;
   }

   public WebElement getTemplate(String templateName) {
      return templatesList.stream().filter(e -> e.getText().contains(templateName)).findFirst().get();
   }

   public WebElement getScenarioNameTextInput() {
      return scenarioNameTextInput;
   }

   public WebElement getCreateScenarioButton() {
      return createScenarioButton;
   }

   public WebElement getPeriodTextInput() {
      return periodTextInput;
   }

   public WebElement getDatesPeriodText() {
      return datesPeriodText;
   }

   public WebElement getDurationErrorText() {
      return durationErrorText;
   }

   public WebElement getStartDateTextinput() {
      return startDateTextinput;
   }

   public WebElement getHeaderTitle() {
      return headerTitle;
   }

   public WebElement getCreatedByMenu() {
      return createdByMenu;
   }

   public List<WebElement> getCreatedByItems() {
      return createdByItems;
   }

   public WebElement getCreateByMeItem() {
      return createByMeItem;
   }

   public WebElement getCreateAnyoneMeItem() {
      return createByAnyoneItem;
   }

   public WebElement getCreateByNotMeItem() {
      return createByNotMeItem;
   }

   public List<WebElement> getScenarios() {
      return scenariosTable;
   }

   public WebElement getScenarioName(WebElement scenarioRow) {
      return scenarioRow.findElement(By.xpath(".//td[2]/div"));
   }

   public WebElement getPlaningPeriod(WebElement scenarioRow) {
      return scenarioRow.findElement(By.xpath(".//td[3]/div"));
   }

   public WebElement getCreatedBy(WebElement scenarioRow) {
      return scenarioRow.findElement(By.xpath(".//td[4]/div"));
   }

   public WebElement getLastOpened(WebElement scenarioRow) {
      return scenarioRow.findElement(By.xpath(".//td[5]/div"));
   }

   public WebElement getProfileUserAdministrationItem() {
      return profileUserAdministrationItem;
   }

   public WebElement getHamburgerButton() {
      return hamburgerButton;
   }

   public WebElement getProfileTemplatesItem() {
      return profileTemplatesItem;
   }

   public WebElement getDeleteScenarioOption() {
      return deleteScenarioOption;
   }

   public WebElement getConfirmDeleteButton() {
      return confirmDeleteButton;
   }

   public WebElement getGetInfoOption() {
      return getInfoOption;
   }

   public WebElement getScenarioNameDrawerTextInput() {
      return scenarioNameDrawerTextInput;
   }

   public WebElement getDataItem() {
      return dataItem;
   }

   public WebElement getSnackbar() {
      return snackbar;
   }

   public WebElement getUserMenu() {
      return userMenu;
   }

   public WebElement getSignOutButton() {
      return signOutButton;
   }

   public WebElement getReadOnlyDialogTitle() {
      return readOnlyDialogTitle;
   }

   public WebElement getOpenButton() {
      return openButton;
   }

   public WebElement getCalendarYearHeader() {
      return calendarYearHeader;
   }

   public void setCalendarYearHeader(WebElement calendarYearHeader) {
      this.calendarYearHeader = calendarYearHeader;
   }

   public WebElement getCalendarMonth() {
      return calendarMonth;
   }

   public void setCalendarMonth(WebElement calendarMonth) {
      this.calendarMonth = calendarMonth;
   }

   public WebElement getCalendarLeftArrowButton() {
      return calendarLeftArrowButton;
   }

   public void setCalendarLeftArrowButton(WebElement calendarLeftArrowButton) {
      this.calendarLeftArrowButton = calendarLeftArrowButton;
   }

   public WebElement getCalendarRightArrowButton() {
      return calendarRightArrowButton;
   }

   public void setCalendarRightArrowButton(WebElement calendarRightArrowButton) {
      this.calendarRightArrowButton = calendarRightArrowButton;
   }

   public WebElement getCalendarDateButton() {
      return calendarDateButton;
   }

   public void setCalendarDateButton(WebElement calendarDateButton) {
      this.calendarDateButton = calendarDateButton;
   }

   public WebElement getCalendarOkButton() {
      return calendarOkButton;
   }

   public void setCalendarOkButton(WebElement calendarOkButton) {
      this.calendarOkButton = calendarOkButton;
   }

   public WebElement getSaveAsTemplateOption() {
      return saveAsTemplateOption;
   }

  public WebElement getDeleteOption() {
    return deleteOption;
  }

  public WebElement getProfilePairingsItem() {
    return profilePairingsItem;
  }

  public WebElement getProfileSolverItem() {
    return profileSolverItem;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  public WebElement getScenarioLink() {
    return ScenarioLink;
  }

  public WebElement getTemplateLink() {
    return TemplateLink;
  }

  @FindBy(xpath = "//td[contains(@id ,\"name\")]")
  private List<WebElement> ScenariosNameList;

  public List<WebElement> getScenariosNameList() { return ScenariosNameList;}

  @FindBy(xpath = "//span[contains(@class, \"material-icons\") and (text()= \"visibility\" or text()=\"description\" or text()=\"create\")]")
  private List<WebElement> ScenarioStatus;

  public List<WebElement> getScenarioStatus() { return ScenarioStatus;}

  @FindBy(xpath = "//span[contains(@class, \"material-icons\") and (text()= \"visibility\" )]")
  private List<WebElement> ScenarioStatusReadOnly;

  public List<WebElement> getScenarioStatusReadOnly() { return ScenarioStatusReadOnly;}

  @FindBy(xpath = "//textarea[@id='description']")
  private WebElement descriptionBox;

  public WebElement getDescriptionBox() { return descriptionBox;}

  @FindBy(xpath ="//input[\"name\"]")
  private WebElement EditScenarioName;

  public WebElement getEditScenarioName() { return EditScenarioName;}

  @FindBy(xpath = "//*[text()='close']")
  private WebElement closeOption;

  public WebElement getCloseOption() {
    return closeOption;
  }

}
