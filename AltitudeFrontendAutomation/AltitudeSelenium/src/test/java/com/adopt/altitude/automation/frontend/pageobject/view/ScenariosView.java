package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.Scenario;
import com.adopt.altitude.automation.frontend.pageobject.containers.ScenariosPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class ScenariosView extends AbstractPageView<ScenariosPageContainer> {

  private static final org.apache.logging.log4j.Logger LOGGER = LogManager.getLogger(ScenariosView.class);

   @PostConstruct
   public void init() throws Exception {
      container = PageFactory.initElements(driver.getWebDriver(), ScenariosPageContainer.class);
   }

   public String getPageTitleText() {
      return container.getHeaderTitle().getText();
   }

   public void clickCreatedByMenu() {
      container.getCreatedByMenu().click();
   }

   public void clickOnFilterByItem(String itemList) {
      switch (itemList) {
         case "Me":
            container.getCreateByMeItem().click();
            break;
         case "Anyone":
            container.getCreateAnyoneMeItem().click();
            break;
         case "Not me":
            container.getCreateByNotMeItem().click();
         default:
            break;
      }
   }

   public List<Scenario> getTableRows() {
      List<Scenario> scenarios = mapScenarios(container.getScenarios());

      return scenarios;
   }

   public List<String> getCreatedByItems() {
      List<WebElement> items = container.getCreatedByItems();
      List<String> listItems = new ArrayList<String>();

      for (WebElement item : items) {
         listItems.add(item.getText());
      }

      return listItems;
   }

   public void clickHamburgerButton() {
      container.getHamburgerButton().click();
   }

   public void clickUserAdministrationItem() {
      WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 10);
      wait.until(ExpectedConditions.elementToBeClickable(container.getProfileUserAdministrationItem()));

      container.getProfileUserAdministrationItem().click();
   }

   public void clickAddScenarioButton() throws InterruptedException {
      container.getAddScenarioButton().click();
      TimeUnit.SECONDS.sleep(2);
   }

   public void clickOnTemplate(String templateName) {
      try {
         TimeUnit.SECONDS.sleep(1);
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }

      WebElement template = driver.getWebDriver().findElement(By.xpath(String.format(container.TEMPLATE_XPATH, templateName)));
      template.click();
   }

   public void setScenarioName(String scenarioName) {
      clearAndSetText(container.getScenarioNameTextInput(), scenarioName);
   }

   public void clickOnSaveScenarioButton() {
      driver.waitForElement(container.getCreateScenarioButton(), 5, 1).click();
   }

   public void setDuration(String duration) {
      clearAndSetText(container.getPeriodTextInput(), duration);
   }

   public String getDurationErrorMessage() {
      return container.getDurationErrorText().getText();
   }

  public String getCurrentReference(String referenceData) {
    WebElement refData = driver.getWebDriver().findElement(By.xpath(String.format(container.REFERENCE_DATA, referenceData)));
    System.out.println(refData.getText());
    return refData.getText();
  }

  public void getScenarioPage() {
    container.getScenarioLink().click();
  }

  public void getTemplatePage() {
    container.getTemplateLink().click();
  }

  public void clickCancelButton() {
    container.getCancelButton().click();
  }


  public String getStartDate() {
      WebElement startDateElement = container.getStartDateTextinput();
      String startDateValue = startDateElement.getAttribute("value");
      String[] startDateArray = startDateValue.split(" ");

      return startDateArray[0];
   }

   public void selectStartDate(String startDate) {
      container.getStartDateTextinput().click();
      String[] date = startDate.split("-");
      selectDateFromCalendar(date[0], date[1], date[2]);
   }

   private void selectDateFromCalendar(String month, String day, String year) {
      WebElement calenderMonth = container.getCalendarMonth();
      while(!(calenderMonth.getText().contains(month))) {
        container.getCalendarRightArrowButton().click();
      }

      WebElement calendarDay = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_DAY, day)));
      calendarDay.click();

      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCalendarYearHeader());
      container.getCalendarYearHeader().click();
      WebElement calenderYear = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_YEAR, year)));
      calenderYear.click();

      container.getCalendarOkButton().click();
    }

   public String getDatesPeriod() {
      return container.getDatesPeriodText().getText();
   }

   public void clickOptionsButton(String scenarioName) throws InterruptedException {
       WebElement scenarioNameCell = driver.getWebDriver().findElement(By.xpath(String.format(container.SCENARIO_OPTIONS_BUTTON_XPATH, scenarioName)));
       driver.ScrollAction(scenarioNameCell);
       scenarioNameCell.click();
   }

   public void clickDeleteOption() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteScenarioOption());
      driver.clickAction(container.getDeleteScenarioOption());
   }

   public void clickConfirmDeleteButton() {
      container.getConfirmDeleteButton().click();
   }

   public void clickGetInfoOption() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getGetInfoOption());
      driver.clickAction(container.getGetInfoOption());
   }

   public void clickSaveAsTemplate() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getSaveAsTemplateOption());
      driver.clickAction(container.getSaveAsTemplateOption());
   }

   public void setScenarioNameInDrawer(String scenarioName) {
      clearAndSetText(container.getScenarioNameDrawerTextInput(), scenarioName);
   }

   @Override
   public boolean isDisplayedCheck() {
      driver.waitForElement(container.getAddScenarioButton(), 10);
      return container.getHeaderTitle().isDisplayed() && container.getAddScenarioButton().isDisplayed();
   }

   private List<Scenario> mapScenarios(List<WebElement> rows) {
      List<Scenario> scenarios = new ArrayList<Scenario>();
      for(int i = 0; i< rows.size(); i++) {
         driver.ScrollAction(rows.get(i));
         Scenario scenario = new Scenario();
         scenario.setName(container.getScenarioName(rows.get(i)).getText());
         scenario.setPlanningPeriod(container.getPlaningPeriod(rows.get(i)).getText());
         scenario.setCreatedBy(container.getCreatedBy(rows.get(i)).getText());
         scenario.setLastOpened(container.getLastOpened(rows.get(i)).getText());
         scenarios.add(scenario);
      }
      return scenarios;
   }

   public void clickTemplatesItem() {
      WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 10);
      wait.until(ExpectedConditions.elementToBeClickable(container.getProfileTemplatesItem()));

      container.getProfileTemplatesItem().click();
   }

   public void openDataItem(String scenarioName) throws InterruptedException {
       WebElement scenarioNameCell = driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioNameCell, scenarioName)));
       driver.ScrollAction(scenarioNameCell);
       TimeUnit.SECONDS.sleep(2);
       scenarioNameCell.click();
       TimeUnit.SECONDS.sleep(2);
       driver.waitForElement(container.getPageTitle(), 120);
     }

  public void openDataItemViewOnly(String scenarioName) throws InterruptedException {
       WebElement scenarioNameCell = driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioNameCell, scenarioName)));
       TimeUnit.SECONDS.sleep(1);
       driver.ScrollAction(scenarioNameCell);
       TimeUnit.SECONDS.sleep(2);
       scenarioNameCell.click();
  }

   public String getSnackbarText() {
      return driver.waitForElement(container.getSnackbar(), 10).getText();
   }

   public void clickUserMenu() {
     driver.jsClick(container.getUserMenu());
   }

   public void clickSignOut() {
     container.getSignOutButton().click();
   }

   public String getScenarioMode(String scenarioName) throws InterruptedException {
     WebElement scenarioNameCell = driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioNameCell, scenarioName)));
     driver.ScrollAction(scenarioNameCell);
     TimeUnit.SECONDS.sleep(1);
     WebElement scenario = driver.getWebDriver().findElement(By.xpath(String.format(container.SCENARIO_STATUS_XPATH, scenarioName)));
     TimeUnit.SECONDS.sleep(1);
     return scenario.getAttribute("scenariostatus");
   }

  public boolean isReadOnlyInfoDialogDisplayed() {
    return container.getReadOnlyDialogTitle() != null;
  }

  public void clickOpenScenarioInReadOnlyMode() {
     container.getOpenButton().click();
    driver.waitForElement(container.getPageTitle(), 120);
  }

  public void clickPairingItem() {
    WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 1);
    wait.until(ExpectedConditions.elementToBeClickable(container.getProfilePairingsItem()));

    container.getProfilePairingsItem().click();
  }

  public void clickSolverItem() {
    WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 1);
    wait.until(ExpectedConditions.elementToBeClickable(container.getProfileSolverItem()));

    container.getProfileSolverItem().click();
  }

  public void checkScenarioNameList() {
    int scenarioName = container.getScenariosNameList().size();
    LOGGER.info("Scenario List size: "+scenarioName);
    Assert.assertTrue(scenarioName>0);

  }

  public void checkScenarioStatus() {
    int scenarioName = container.getScenarioStatus().size();
    LOGGER.info("Scenario List size: "+scenarioName);
    Assert.assertTrue(scenarioName>0);

    for(int i = 0; i<scenarioName; i++)
    {
      container.getScenarioStatus().get(i).getText();
      String currentScenarioName=      container.getScenariosNameList().get(i).getText();
      driver.scrollToElement(container.getScenarios().get(i));
      LOGGER.info( currentScenarioName+" status is--> "+container.getScenarioStatus().get(i).getText());
    }
  }

  public void checkScenarioStatusReadOnly() {
    int scenarioName = container.getScenarioStatus().size();
    LOGGER.info("Scenario List size: "+scenarioName);
    Assert.assertTrue(scenarioName>0);

    for(int i = 0; i<scenarioName; i++)
    {
      container.getScenarioStatus().get(i).getText();
      String currentScenarioName=      container.getScenariosNameList().get(i).getText();
      driver.scrollToElement(container.getScenarios().get(i));
      LOGGER.info( currentScenarioName+" status is--> "+container.getScenarioStatusReadOnly().get(i).getText());
    }
  }

  public void verifyGetInfoOption() {
    Assert.assertTrue(container.getGetInfoOption().isEnabled()==true);
    Assert.assertTrue(container.getSaveAsTemplateOption().isEnabled()==true);
    Assert.assertTrue(container.getDeleteOption().isEnabled()==true);
  }

  public void updateDescription(String newDescription) {
    container.getDescriptionBox().click();
    container.getDescriptionBox().sendKeys(newDescription);
  }

  public void verifyScenarioOptionDisabled(String scenarioOptions) {
    WebElement scenarioOption= driver.getWebDriver().findElement(By.xpath(String.format(container.SCENARIO_OPTION, scenarioOptions)));
    String optionDetails = scenarioOption.getAttribute("class");
    LOGGER.info("Scenario Option: "+optionDetails);
    Assert.assertTrue(optionDetails.contains("disabled"));
  }

  public void verifyScenarioOptionEnabled(String scenarioOptions) throws InterruptedException {
    WebElement scenarioOption= driver.getWebDriver().findElement(By.xpath(String.format(container.SCENARIO_OPTION, scenarioOptions)));
    String optionDetails = scenarioOption.getAttribute("class");
    LOGGER.info("Scenario Option: "+optionDetails);
    Assert.assertTrue(!(optionDetails.contains("disabled")));
    driver.clickAction(container.getGetInfoOption());
   }

  public void verifyEditScenarioNameDisabled()  {
    WebElement scenarioOption= container.getEditScenarioName();
    String optionDetails = scenarioOption.getAttribute("class");
    LOGGER.info("Scenario Option: "+optionDetails);
    Assert.assertTrue(optionDetails.contains("disabled"));
  }

  public void verifyEditScenarioDescriptionDisabled()  {
    WebElement scenarioOption= container.getDescriptionBox();
    String optionDetails = scenarioOption.getAttribute("class");
    LOGGER.info("Scenario Option: "+optionDetails);
    Assert.assertTrue(optionDetails.contains("disabled"));
    container.getCloseOption().click();
  }

  public WebElement getScenarioHeaderTitle() {
    return container.getHeaderTitle();
  }

}
