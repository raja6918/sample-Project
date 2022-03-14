
package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.scenarios.ScenariosEndpoint;
import com.adopt.altitude.automation.frontend.api.steps.ApiLogin;
import com.adopt.altitude.automation.frontend.data.solverRequest.SolverRequest;
import com.adopt.altitude.automation.frontend.pageobject.containers.SolverPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.util.List;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.Assert.assertEquals;

@Component
@Scope("prototype")
public class SolverView extends AbstractPageView<SolverPageContainer> {

  static  String previewID = "";
  static  ArrayList<Integer> previewId;
  private List<String> solverName;

  private static final Logger LOGGER = LogManager.getLogger(SolverView.class);

  public static Integer currentBellCount;

  @Autowired
  private ScenariosEndpoint    scenarioManagement;

  @Autowired
  protected ApiLogin apiLogin;

  SolverRequest solverRequest = new SolverRequest();

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), SolverPageContainer.class);
  }

  public void clickAddSolverRequest() throws InterruptedException {
  //  TimeUnit.SECONDS.sleep(1);
    container.getAddSolverRequestButton().click();
  }

  public void verifyAddSolverRequestButtonEnabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    Assert.assertTrue(container.getAddSolverRequestButton().isDisplayed()==true);
    Assert.assertTrue(container.getAddSolverRequestButton().isEnabled()==true);

  }

  public void clickStatistics() throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    container.getClickStatistics().click();
  }

  public void clickCompare() throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);
    container.getClickDots().click();
    TimeUnit.SECONDS.sleep(1);
    container.getClickCompare().click();
    TimeUnit.SECONDS.sleep(3);

  }

  public void clickDelete() throws InterruptedException {

int countDelete= driver.getWebDriver().findElements(By.xpath("//span[text()='delete']")).size();
    LOGGER.info("Delete Button "+countDelete);
   for(int i=0; i<countDelete;i++)
    {
      container.getButtonDelete().click();
      TimeUnit.SECONDS.sleep((long) 0.2);

    }
  }

  public void verifyValueAlphabetical()  {

    container.getDropDownValue().click();

    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'Select-menu-outer')]"));
    LOGGER.info("size= "+allOptions.size());

    List<String> originalList = new ArrayList();
    for(WebElement element : allOptions)
    {
    originalList.add(element.getText());
    }
    List<String> sortedList= originalList;
    Collections.sort(sortedList);

    LOGGER.info("Sorted List:\n"+sortedList);
    LOGGER.info("Original List:\n"+originalList);
    Assert.assertEquals(sortedList, originalList);

  }

  public void addRow(String rowData) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
   driver.scrollToElement(container.getAddRowValue());
    TimeUnit.SECONDS.sleep(2);

    Robot r= new Robot();
    TimeUnit.SECONDS.sleep((long) 0.2);
    container.getAddRowValue().click();
    TimeUnit.SECONDS.sleep(1);
    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'Select-menu-outer')]"));
    TimeUnit.SECONDS.sleep((long) 0.2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.staticValue, rowData))).click();
    TimeUnit.SECONDS.sleep((long) 1.5);
  }

  public void addSameRowData(String rowData, String message) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
    driver.scrollToElement(container.getAddRowValue());
    TimeUnit.SECONDS.sleep(2);
    Robot rob= new Robot();
    TimeUnit.SECONDS.sleep((long) 0.2);
    container.getAddRowValue().click();
    TimeUnit.SECONDS.sleep(1);
    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'Select-menu-outer')]"));
    Clipboard userclipboard = Toolkit.getDefaultToolkit()
      .getSystemClipboard();
    StringSelection stringSelectionuser = new StringSelection(rowData);
    userclipboard.setContents(stringSelectionuser, null);
    TimeUnit.SECONDS.sleep(1);
    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_CONTROL);
    TimeUnit.SECONDS.sleep(3);
    String currentMessage= driver.getWebDriver().findElement(By.xpath("//div[contains(@class,'Select-menu-outer')]")).getText();
   LOGGER.info("current message= "+currentMessage);

    Assert.assertEquals(message,currentMessage);
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyValueNotInList(String rowData) throws AWTException, InterruptedException {

    Robot rob= new Robot();
    rob.keyPress(KeyEvent.VK_ESCAPE);
    rob.keyRelease(KeyEvent.VK_ESCAPE);
    TimeUnit.SECONDS.sleep(1);

    driver.getWebDriver().findElement(By.xpath("//div[contains(@class,'Select-placeholder')]")).click();
    TimeUnit.SECONDS.sleep(1);
    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'Select-menu-outer')]"));
    LOGGER.info("size= "+allOptions.size());

    List<String> originalList = new ArrayList();
    for(WebElement element : allOptions)
    {
      originalList.add(element.getText());
    }
    LOGGER.info("Original List:\n"+originalList);
    Assert.assertTrue(!(originalList.contains(rowData)));

  }

  public void testChkBox(String testChkBox) throws InterruptedException {
    driver.getWebDriver().findElement(By.xpath(String.format(container.testCheckBox, testChkBox))).click();
    TimeUnit.SECONDS.sleep((long) 1.5);
    TimeUnit.SECONDS.sleep((long) 1.5);
    LOGGER.info("test "+testChkBox);
  }

  public void clickFilter() throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    container.getClickFilter().click();
  }

  public void enterFilterSolverName(String solver) throws InterruptedException {
    clearAndSetText(container.getSolverFilterName(), solver);
    container.getSolverFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
    container.getSelectSolverFilterName().click();
    TimeUnit.SECONDS.sleep(1);

  }

  public void deSelectSolverName(String solver) throws InterruptedException {
    clearAndSetText(container.getSolverFilterName(), solver);
    container.getSolverFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
    container.getSelectSolverFilterName().click();
    TimeUnit.SECONDS.sleep(1);
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);

  }

  public void verifyStatistics(String position, String value) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement lastField= driver.getWebDriver().findElement(By.xpath("//*[@id=\"react-select-2--value\"]"));

    driver.scrollToElement(lastField);
    TimeUnit.SECONDS.sleep(2);

    String positionData= driver.getWebDriver().findElement(By.xpath("//*[@id=\"react-select-"+position+"--value\"]")).getText();
    String valueData= driver.getWebDriver().findElement(By.xpath("//*[text()='"+value+"']")).getText();
    LOGGER.info("At position: "+position+ "Expected Data is: "+positionData );
    LOGGER.info("At position: "+position+ "Actual Data is: "+valueData );

    Assert.assertEquals(positionData,valueData);

  }

  public void changeStatistics(String currentStatistics, String newStatistics) throws InterruptedException, AWTException {

    Robot rob = new Robot();
    Clipboard userclipboard = Toolkit.getDefaultToolkit()
      .getSystemClipboard();
    StringSelection stringSelectionuser = new StringSelection(newStatistics);
    userclipboard.setContents(stringSelectionuser, null);
    TimeUnit.SECONDS.sleep(1);

    String currentStatisticsFirstSolverInitialValue=driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[2]/span")).getText();
    String currentStatisticsSecondSolverInitialValue=driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[3]/span")).getText();
    LOGGER.info("currentStatisticsFirstSolverInitialValue: "+currentStatisticsFirstSolverInitialValue);
    LOGGER.info("currentStatisticsSecondSolverInitialValue: "+currentStatisticsSecondSolverInitialValue);

    driver.getWebDriver().findElement(By.xpath("//div[contains(text(), '"+currentStatistics+"')]")).click();
    TimeUnit.SECONDS.sleep(2);

    container.getClearValue().click();

    TimeUnit.SECONDS.sleep(2);
    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_CONTROL);
    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_ENTER);
    rob.keyRelease(KeyEvent.VK_ENTER);
    TimeUnit.SECONDS.sleep(1);

    String currentStatisticsFirstSolverUpdatedValue=driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[2]/span")).getText();
    String currentStatisticsSecondSolverUpdatedValue=driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[1]/div/div[3]/span")).getText();
    LOGGER.info("currentStatisticsFirstSolverUpdatedValue: "+currentStatisticsFirstSolverUpdatedValue);
    LOGGER.info("currentStatisticsSecondSolverUpdatedValue: "+currentStatisticsSecondSolverUpdatedValue);

    TimeUnit.SECONDS.sleep(1);
    Assert.assertTrue(!(currentStatisticsFirstSolverInitialValue.equals(currentStatisticsFirstSolverUpdatedValue)));
    Assert.assertTrue(!(currentStatisticsSecondSolverInitialValue.equals(currentStatisticsSecondSolverUpdatedValue)));

  }

  public void verifyHeaderTitle(String firstHeader, String secondHeader)  {

    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[@class=\"rt-th table-cell table-header\"]"));
    LOGGER.info("size= "+allOptions.size());

    List<String> originalList = new ArrayList();
    for(WebElement element : allOptions)
    {
      originalList.add(element.getText());
    }

    LOGGER.info("Header Data 1: "+originalList);
    Assert.assertTrue(originalList.contains(firstHeader));
    Assert.assertTrue(originalList.contains(secondHeader));
  }

  public void viewSolverValue(String firstHeader, String secondHeader)  {

    for(int i=1; i<=5; i++) {

      String firstHeaderSolverValue = driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[" + i + "]/div/div[2]/span")).getText();
      String secondHeaderSolverValue = driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[" + i + "]/div/div[3]/span")).getText();
      String valueData = driver.getWebDriver().findElement(By.xpath("//*[@id=\"react-select-" + i + "--value\"]")).getText();
      LOGGER.info("Solver's " + firstHeader + ": " + valueData + " is: " + firstHeaderSolverValue);
      LOGGER.info("Solver's " + secondHeader + ": " + valueData + " is: " + secondHeaderSolverValue);
      //Assert.assertTrue(!firstHeaderSolverValue.equals(secondHeaderSolverValue));
    }
  }

  public void viewSolverValue(String firstHeader, String secondHeader, String crewBase) throws InterruptedException {

    for(int i=1; i<=5; i++) {

      String firstHeaderSolverValue = driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[" + i + "]/div/div[2]/span")).getText();
      String secondHeaderSolverValue = driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[" + i + "]/div/div[3]/span")).getText();
      String valueData = driver.getWebDriver().findElement(By.xpath("//*[@id=\"react-select-" + i + "--value\"]")).getText();
      LOGGER.info("For Crew Base -> " + crewBase + "-> Solver's " + firstHeader + ": " + valueData + " is: " + firstHeaderSolverValue);
      LOGGER.info("For Crew Base -> " + crewBase + "-> Solver's " + secondHeader + ": " + valueData + " is: " + secondHeaderSolverValue);

    }
  }

  public void verifyRemoveHeaderTitle(String removeHeader)  {

    List<WebElement>  allOptions = driver.getWebDriver().findElements(By.xpath("//div[@class=\"rt-th table-cell table-header\"]"));
    LOGGER.info("size= "+allOptions.size());

    List<String> originalList = new ArrayList();
    for(WebElement element : allOptions)
    {
      originalList.add(element.getText());
    }

    LOGGER.info("Header Data 1: "+originalList);
    Assert.assertTrue(!(originalList.contains(removeHeader)));
  }

  public void verifyNewCrewData(String expectedValue) throws InterruptedException {
    expectedValue= "--";
    for(int i=1; i<=5; i++)
    {
      String actualValue=driver.getWebDriver().findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[2]/div/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div["+i+"]/div/div[3]/span")).getText();
      LOGGER.info("At position "+i+ " expectedValue: "+expectedValue+ " actualValue: "+actualValue);
      Assert.assertEquals(expectedValue,actualValue);
    }
  }

  public void clickSelectAllRequests() throws InterruptedException {
    container.getSelectAllCheckbox().click();
    TimeUnit.SECONDS.sleep((long)1);
    container.getSelectAllCheckbox().click();
    TimeUnit.SECONDS.sleep((long) 1);
  }

  public void clickFilterButton() {
    container.getFilterRequestButton().click();
  }

  public void clickCrewBaseDropdown(String crewGroup) throws InterruptedException {
    container.getCrewBaseDropdown().click();
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.crewGroupDropDown, crewGroup))).click();
    TimeUnit.SECONDS.sleep(2);
  }

  public String getMessageNoSolver() {
    return container.getMessageNoSolverSelected().getText();
  }

  public void enterFilterSearch(String filter) {
    clearAndSetText(container.getSearchRequestTextField(), filter);
  }

  public void clickMoreOptionsButton() {
    container.getMoreOptionsButton().click();
  }

  public void clickCompareButton() {
    container.getCompareRequestsButton().click();
  }

  public void clickLaunchRequestsButton() {
    container.getLaunchRequestsButton().click();
  }

  public void clickDeleteButton() {
    container.getDeleteRequestsButton().click();
  }

  public void getSolverpage() {
    WebElement solverClick = container.clickSolver();
    solverClick.click();
    driver.waitForElement(container.getSolverPageTitle(),120);
  }

  public void clickRequest(String requestDescription) {
    WebElement request = driver.getWebDriver().findElement(By.xpath(String.format(container.solverRequestInfo, requestDescription)));
    request.click();
  }

  public void setRequestName(String requestName) {
    clearAndSetText(container.getRequestName(), requestName);
  }

  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  public String getInvalidRequestNameMessage() {
    return container.getInvalidRequestNameMessage().getText();
  }

  public boolean isAddButtonEnabled() {
    return container.getAddButton().isEnabled();
  }

  public void EnterTextdescriptionBox() {
    container.getdescriptionBox().click();
    container.getdescriptionBox().sendKeys(solverRequest.descriptionText);
  }

  public void EnterTextdescriptionBox(String description) {
    container.getdescriptionBox().click();
    container.getdescriptionBox().sendKeys(description);
  }

  public void getSelectCreatedSolverRequest(String solverRequesName) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.SelectCreatedSolverRequest, solverRequesName))).click();
  }

  public void getSelectCreatedSolverRequest() {
    driver.getWebDriver().findElement(By.xpath(String.format(container.SelectCreatedSolverRequest))).click();
  }

  public Integer getdescriptionTextCount() {
    Integer descriptionTextCount = container.getdescriptionBox().getText().length();
    return descriptionTextCount;
  }

  public void selectSolverTask(String solverTask) {
    if (!solverTask.equals("")) {
      container.getSolverTaskDropdown().click();
      container.SOLVERTASK().sendKeys(solverTask);
      container.SOLVERTASK().sendKeys(Keys.TAB);
    } else {
      container.getSolverTaskDropdown().click();
      container.SOLVERTASK().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    }
  }

  public void selectCrewGroup(String crewGroup) {
    if (!crewGroup.equals("")) {
      container.getCrewGroupDropdown().click();
      container.CREWGROUP().sendKeys(crewGroup);
      container.CREWGROUP().sendKeys(Keys.TAB);
    }
  }

  public void selectRules(String rules) throws InterruptedException {
    driver.scrollToElement(container.getRecipe());
    TimeUnit.SECONDS.sleep(1);

    if (!rules.equals("")) {
      container.getRulesDropdown().click();
      container.RULES().sendKeys(rules);
      container.RULES().sendKeys(Keys.TAB);
    } else {
      container.getRulesDropdown().click();
      container.RULES().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
      container.getSolverTaskDropdown().click();
    }
  }

  public void selectRecipe(String recipe) {
    if (!recipe.equals("")) {
      container.getRecipeDropdown().click();
      container.RECIPE().sendKeys(recipe);
      container.RECIPE().sendKeys(Keys.TAB);
    }
  }

  public void addButtonClick() {
    WebElement addButtonClick = driver.getWebDriver().findElement(By.xpath(String.format(container.addButton)));
    addButtonClick.click();
  }

  public void clickRequestCheckbox(String requestDescription) {
    WebElement requestCheckbox = driver.getWebDriver().findElement(By.xpath(String.format(container.solverRequestSelectCheckbox, requestDescription)));
    requestCheckbox.click();
  }

  public void clickLaunchRequestButton() {
    container.getLaunchRequestButton().click();
  }

  public void clickStopRequestButton() {
    container.getStopRequestButton().click();
  }

  public void clickPreviewRequestButton() {
    container.getPreviewRequestButton().click();
  }

  public String getRequestStatus() {
    return container.getRequestStatus().getText();
  }

  public void selectTargets(String target) {
    container.getTargetsDropdown().click();
    clickDropdownElement(target);
  }

  public void enterDescription(String description) {
    clearAndSetText(container.getDescriptionTextField(), description);
  }

  public void clickFavoriteButton() {
    container.getFavoriteRequestButton().click();
  }

  private void clickDropdownElement(String element) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.itemServedXpath, element))).click();
  }

  public void updateRequestName(String newRequestName) {
    container.getEditRequestNameTextBox().click();
    container.getEditRequestNameTextBox().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getEditRequestNameTextBox().sendKeys(newRequestName);
    String firstCharacter = newRequestName.substring(0, 1);
    if ((firstCharacter.matches("^[A-Za-z0-9]")) && (firstCharacter != "_") && (firstCharacter != "") && (!firstCharacter.isEmpty())) {
      container.getdescriptionBox().click();
    }
  }

  public String getUpdatedRequestName(String RequestName) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getTextFromCreatedSolverRequest, RequestName))).getText();
  }

  public void updateCrewGroup(String newCrewGroup) {
    container.getEditCrewGroupTextBox().click();
    WebElement crewgroupValue=driver.getWebDriver().findElement(By.xpath(String.format(container.editCrewGroupDropdown, newCrewGroup)));
    driver.jsClick(crewgroupValue);
  }

  public String getUpdatedCrewGroup(String newCrewGroup) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getTextFromCreatedSolverRequest, newCrewGroup))).getText();
  }

  public void updateRule(String newRule) {
    container.getEditRuleTextBox().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.editRuleDropdown, newRule))).click();
  }

  public String getUpdatedRule(String newRule) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getTextFromRuleDropdown, newRule))).getText();
  }

  public void updateRecipe(String newRecipe) throws InterruptedException {
    driver.scrollToElement(container.getEditRecipeTextBox());
    TimeUnit.SECONDS.sleep(1);
    container.getEditRecipeTextBox().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.editRecipeDropdown, newRecipe))).click();
  }

  public String getUpdatedRecipe(String newRecipe) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getTextFromRecipeDropdown, newRecipe))).getText();
  }

  public void updateDescription(String newDescription) {
    container.getdescriptionBox().click();
    container.getdescriptionBox().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getdescriptionBox().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getdescriptionBox().sendKeys(newDescription);
  }

  public String getUpdateDescription() {
    return container.getdescriptionBox().getText();
  }

  public void getLaunchButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(),container.clickLaunchButton());
    container.clickLaunchButton().click();
  }

  public String getLaunchMessage(String LaunchMessage) throws InterruptedException {
    driver.waitForElement(container.getCompletedSuccessfully(), 600);
    TimeUnit.SECONDS.sleep(2);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getLaunchMessage, LaunchMessage))).getText();
  }

  public boolean verifyCrewGroupIsEnabled() {
    return container.crewGroupIsEnabled().isDisplayed();
  }

  public boolean verifySolverTaskIsEnabled() {
    return container.solverTaskIsEnabled().isDisplayed();
  }

  public boolean verifyRulesIsEnabled() {
    return container.rulesIsEnabled().isDisplayed();
  }

  public boolean verifyRecipeIsEnabled() {
    return container.recipeIsEnabled().isEnabled();
  }

  public boolean verifyScopeIsEnabled() {
    return container.scopeIsEnabled().isDisplayed();
  }

  public String verifyLeftPanelIcon(String requestName) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getLeftPanelIcon, requestName))).getAttribute("src");
  }

  public String getTimeStampText(String text) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getTimeStampText, text))).getText();
  }

  public String getProgressBarMessage(String text) {
    driver.waitForElement(container.getStoppedByUser(),100);
    return container.getProgressBarMessage().getText();
  }

  public String getProgressBarMessageForLaunching(String text) throws InterruptedException {
    //TimeUnit.SECONDS.sleep(2);
    return container.getProgressBarMessage().getText();
  }

  public boolean isButtonEnabled(String buttonText) {
    driver.waitForElement(container.getStatusRunningOrSendingTheJob(),120);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getLaunchOrStopButton, buttonText))).isEnabled();
  }

  public boolean isButtonEnabledAfterStop(String buttonText) throws InterruptedException {
    driver.waitForElement(container.getStoppedByUser(),120);
    TimeUnit.SECONDS.sleep(5);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getLaunchOrStopButton, buttonText))).isEnabled();
  }

  public boolean confirmButtonEnabled(String buttonText) {

    return driver.getWebDriver().findElement(By.xpath(String.format(container.getLaunchOrStopButton, buttonText))).isEnabled();
  }

  public void clickStopButton() throws InterruptedException {
    driver.waitForElement(container.getStatusRunningOrSendingTheJob(),250);
    container.clickStopButton().click();
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.clickStopConfirmation().click();
  }

  public void clickPreviewButton(String buttonText) throws InterruptedException {
    TimeUnit.SECONDS.sleep(6);
    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.previewButton, buttonText))).isEnabled()==true);
    driver.getWebDriver().findElement(By.xpath(String.format(container.previewButton, buttonText))).click();
    TimeUnit.SECONDS.sleep(40);
  }


  public void verifySavePairing(String expectedMessage, String buttonText) throws InterruptedException {
    TimeUnit.SECONDS.sleep(10);
    String winHandleBefore = driver.getWebDriver().getWindowHandle();
    Set<String> handles = driver.getWebDriver().getWindowHandles();
    for (String windowHandle : handles) {
      if (!windowHandle.equals(winHandleBefore)) {
        driver.getWebDriver().switchTo().window(windowHandle);
        TimeUnit.SECONDS.sleep(5);
        driver.getWebDriver().findElement(By.xpath(String.format(container.clickSavePairingOrClosepreview, buttonText))).click();
        TimeUnit.MILLISECONDS.sleep(2500);
        LOGGER.info(container.getSuccessMessage().getText());
        assertEquals(expectedMessage, container.getSuccessMessage().getText());
        if (driver.getWebDriver().findElements(By.xpath("//div[@id='form-dialog-title']")).size() == 0) {
          LOGGER.info(driver.getWebDriver().findElements(By.xpath("//div[@id='form-dialog-title']")).size());
          Assert.assertFalse(false);
        } else {
          LOGGER.info(driver.getWebDriver().findElements(By.xpath("//div[@id='form-dialog-title']")).size());
          Assert.assertFalse(true);
        }
      }
    }
  }

  public void clickSavePairing( String buttonText) throws InterruptedException {
    TimeUnit.SECONDS.sleep(20);
    String winHandleBefore = driver.getWebDriver().getWindowHandle();
    Set<String> handles = driver.getWebDriver().getWindowHandles();
    for (String windowHandle : handles) {
      if (!windowHandle.equals(winHandleBefore)) {
        driver.getWebDriver().switchTo().window(windowHandle);
        TimeUnit.SECONDS.sleep(15);
        driver.getWebDriver().findElement(By.xpath(String.format(container.clickSavePairingOrClosepreview, buttonText))).click();
        TimeUnit.MILLISECONDS.sleep(2500);
      }
    }
  }

  public void clickSavePairingForError( String buttonText) throws InterruptedException {
        TimeUnit.SECONDS.sleep(2);
        driver.getWebDriver().findElement(By.xpath(String.format(container.clickSavePairingOrClosepreview, buttonText))).click();
        TimeUnit.SECONDS.sleep(5);

  }

  public boolean IsSavePairingButtonEnabled(String buttonText) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.clickSavePairingOrClosepreview, buttonText))).isEnabled();
  }

  public void closeTab() {
driver.getWebDriver().close();
  }

  public void refreshPage()throws InterruptedException {
    driver.getWebDriver().navigate().refresh();
    TimeUnit.SECONDS.sleep(5);
  }

  public void getURL()throws InterruptedException {
    Set<String> set = driver.getWebDriver().getWindowHandles();
    Iterator<String> it = set.iterator();
    String parent = it.next();
    String child = it.next();
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().switchTo().window(child);
    TimeUnit.SECONDS.sleep(2);
    String currentURL = driver.getWebDriver().switchTo().window(child).getCurrentUrl();
    TimeUnit.SECONDS.sleep(2);
    previewID = currentURL.substring(currentURL.length() - 5);
    previewId = new ArrayList<Integer>();
    previewId.add(Integer.parseInt(previewID));

  }

  public void deletePreview() throws InterruptedException, ClientException {

    scenarioManagement.setAuthenticationToken(apiLogin.getToken());
    String previewPath = "/scenarios/close-preview";
    Integer userId = 2;
    scenarioManagement.deleteScenarios("", "true", previewId, previewPath, userId);

  }

  public String getMessage() {
    return container.getSuccessMessage().getText();
  }

  public String getCurrentScenario(String scenario)throws InterruptedException {
    TimeUnit.SECONDS.sleep(30);
    List<WebElement> scenarios_WebElements = container.getCurrentScenario_AlertPopUp();
    String currentScenarioText="";

    for (WebElement element : scenarios_WebElements) {
       currentScenarioText=element.getText();
      if (currentScenarioText.equals(scenario))
      break;
    }
    return currentScenarioText;
  }

  public String getCurrentSolverReqName(String solverReqName) {
    List<WebElement> solverReqName_WebElements = container.getCurrentSolverReqName_AlertPopUp();
    String currentRequestName="";

    for (WebElement element : solverReqName_WebElements) {
       currentRequestName=element.getText();
      if (currentRequestName.equals(solverReqName))
       break;
    }
    return currentRequestName;
  }

  public void ClickNotificationIcon()throws InterruptedException
  {
    driver.getWebDriver().navigate().refresh();
    TimeUnit.SECONDS.sleep(8);
    verifyNotificationCountIncremented();
    WebDriverWait wt = new WebDriverWait(driver.getWebDriver(),100);
    wt.until(ExpectedConditions.elementToBeClickable(container.clickNotificationIcon()));
    container.clickNotificationIcon().click();
  }

  public void verifyNotificationCountIncremented()throws InterruptedException
  {
    WebDriverWait wt = new WebDriverWait(driver.getWebDriver(),150);
    wt.until(ExpectedConditions.elementToBeClickable(container.clickNotificationIconCount()));
  }

  public void clearNotifications()throws InterruptedException {
    TimeUnit.SECONDS.sleep(5);
    container.clickNotificationIcon().click();
    WebDriverWait wt = new WebDriverWait(driver.getWebDriver(),60);
    wt.until(ExpectedConditions.elementToBeClickable(container.clearNotificationButton()));
    container.clearNotificationButton().click();
    container.closeNotificationButton().click();
  }

  public void closeNotifications()throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.1);
    container.closeNotificationButton().click();
  }

  public void verifyLoader(String buttonText, String expectedLoaderMessage) throws InterruptedException {
   // TimeUnit.SECONDS.sleep(10);
    String winHandleBefore = driver.getWebDriver().getWindowHandle();
    Set<String> handles = driver.getWebDriver().getWindowHandles();
    for (String windowHandle : handles) {
      if (!windowHandle.equals(winHandleBefore)) {
        driver.getWebDriver().switchTo().window(windowHandle);
        TimeUnit.SECONDS.sleep(5);
        driver.getWebDriver().findElement(By.xpath(String.format(container.clickSavePairingOrClosepreview, buttonText))).click();
        Assert.assertTrue(container.getLoader().isDisplayed());
        assertEquals(expectedLoaderMessage, container.getLoader().getText());
      }
    }
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getSolverPageHeader() != null;
  }


  public void WaitForToastMessage() throws InterruptedException {
    driver.waitForElement(container.getSuccessMessage(),500);
    TimeUnit.SECONDS.sleep(1);

  }

  public void clickSolverLink(String solverLink) throws InterruptedException {
    //driver.waitForElement(container.getSuccessMessage(),500);
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.linkText(solverLink)).click();
    TimeUnit.SECONDS.sleep(2);

  }

  public void clickNotifications()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.clickNotificationIcon().click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void solverLinkOnNotification(String solverLinkOnNotification) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.solverRequest, solverLinkOnNotification))).click();
    TimeUnit.SECONDS.sleep(3);
  }

  public String getActualPage(String actualPage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.pageHeader, actualPage))).getText();
  }


  public void CheckNotificationBellCount()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String bellCount= container.getNotificationBellCount().getText();
    currentBellCount=Integer.parseInt(bellCount);
    LOGGER.info("Bell Count= "+currentBellCount);
    TimeUnit.SECONDS.sleep(2);
  }

  public String getActualScenarioNameOnNotification(String expectedScenarioName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    LOGGER.info("scenario name= "+driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioName, expectedScenarioName))).getText());
    return driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioName, expectedScenarioName))).getText();
  }

  public String getActualSolverNameOnNotification(String expectedSolverName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    LOGGER.info("scenario name= "+driver.getWebDriver().findElement(By.xpath(String.format(container.solverRequest, expectedSolverName))).getText());
    return driver.getWebDriver().findElement(By.xpath(String.format(container.solverRequest, expectedSolverName))).getText();
  }

  public void CheckStatusImage()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement imgValue= container.getSolverStatusImage();
    LOGGER.info("Img value "+imgValue.getAttribute("src"));

    Assert.assertTrue(container.getSolverStatusImage().isDisplayed()==true);

  }

  public void getUpdatedNotificationCount(Integer UpdatedNotificationCount) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String bellCount= container.getNotificationBellCount().getText();
    UpdatedNotificationCount=Integer.parseInt(bellCount);
    LOGGER.info("Previous BellCount "+currentBellCount);
    LOGGER.info("UpdatedNotificationCount "+UpdatedNotificationCount);
    Assert.assertTrue(UpdatedNotificationCount==currentBellCount+1);

  }

  public void waitForNotificationBellCount()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.waitForElement(container.getNotificationBellCount(),500);
    TimeUnit.SECONDS.sleep(2);
  }

  public String getActualSolverPageName(String expectedSolverPageName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.solverPageDetail, expectedSolverPageName))).getText();
  }

  public String getActualPopUp(String actualPopUp) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.popUpHeader, actualPopUp))).getText();
  }

  public void switchScenario(String switchScenarioButton) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.switchScenario, switchScenarioButton))).click();
    TimeUnit.SECONDS.sleep(1);
  }

  public void getPageDetails(String pageName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String pageTitle= driver.getWebDriver().findElement(By.xpath(String.format(container.pageDetails, pageName))).getText();
    LOGGER.info("page "+pageTitle);
    Assert.assertTrue(pageTitle.equals(pageName));

  }

  public void getScenarioDetails(String expectedScenarioName) throws InterruptedException {
    String scenarioDetails=container.getPageDataDetails().getText();
    LOGGER.info("scenarioDetails" +scenarioDetails);
    Assert.assertTrue(scenarioDetails.contains(expectedScenarioName));

  }

  public String getPopoverMessage(String expectedPopover) throws InterruptedException {
    container.clickNotificationIcon().click();
    TimeUnit.SECONDS.sleep(1);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getPopoverMessage, expectedPopover))).getText();
  }

  public void CheckTrashCanIcon()throws InterruptedException {
    Assert.assertTrue(container.getTrashCanIcon().isDisplayed()==true);

  }

  public void CheckNotificationUnreadIcon()throws InterruptedException {
    Assert.assertTrue(container.getNotificationUnreadIcon().isDisplayed()==true);

  }

  public boolean verifyNoNotifications()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);

    if(driver.getWebDriver().findElements(By.xpath("//span[@class=\"MuiBadge-badge MuiBadge-anchorOriginTopRightRectangle MuiBadge-colorSecondary\"]")).size()==0)
      return true;
    else
      return false;
  }

  public void clickDeleteIcon()throws InterruptedException {
    container.clickNotificationIcon().click();
    TimeUnit.SECONDS.sleep(1);
    WebElement deleteNotificationIndividually= container.getDeleteIcon();
    LOGGER.info("delete icon count: "+driver.getWebDriver().findElements(By.cssSelector("[class*='NotificationCard__Card'] svg")).size());
    while(driver.getWebDriver().findElements(By.cssSelector("[class*='NotificationCard__Card'] svg")).size()!=0)
    {
      deleteNotificationIndividually.click();
      TimeUnit.SECONDS.sleep(1);
    }

    container.closeNotificationButton().click();

  }

  public void dataTimeOfNotification() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String dateTimeOfNotification= container.getDateTimeOfNotification().getText();
    LOGGER.info("Date and Time Of Notification: "+dateTimeOfNotification+"");
    //getDate(dateTimeOfNotification);

  }

  public void getDate(String dateTimeOfNotification)
  {
    StringBuffer sb= new StringBuffer(dateTimeOfNotification);
    String notificationDate=	sb.substring(0, sb.length() - 9);
    String notificationTime=  sb.substring(sb.length() - 5);
    LOGGER.info("notificationDate: "+notificationDate);
    LOGGER.info("notificationTime: "+notificationTime);
    LOGGER.info("notificationDate-> "+notificationDate + ": "  + isValidDate(notificationDate));
    LOGGER.info("notificationTime-> "+notificationTime + ": "  + isValidTime(notificationTime));

  }

  public static boolean isValidTime(String notificationTime)
  {
    String regex="^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$";
    Pattern p = Pattern.compile(regex);

    if (notificationTime == null) {
      return false;
    }

    Matcher m = p.matcher(notificationTime);
    LOGGER.info("Time Format "+m.matches());
    Assert.assertTrue(m.matches()==true);
    return m.matches();
  }


  public static boolean isValidDate(String notificationDate)
  {
    String regex = "^((31(?!\\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\\b|t)t?|Nov)(ember)?)))|((30|29)(?!\\ Feb(ruary)?))|(29(?=\\ Feb(ruary)?\\ (((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\\d|2[0-8])\\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\\b|t)t?|Nov|Dec)(ember)?)\\ , ((1[6-9]|[2-9]\\d)\\d{2})$";
    Pattern p = Pattern.compile(regex);

    if (notificationDate == null) {
      return false;
    }

    Matcher m = p.matcher(notificationDate);
    LOGGER.info("Date format: "+m.matches());
    Assert.assertTrue(m.matches()==true);
    return m.matches();
  }

  public void crewGroupTooltipMessage(String crewGroupTooltipMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement currentHoverMessage= container.getErrorIcon();

    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), currentHoverMessage);
    driver.mouseOver(currentHoverMessage);

    TimeUnit.SECONDS.sleep(2);
    String actualCrewGroupTooltipMessage=container.getCrewGroupErrorMessage().getText();
    LOGGER.info("crewGroupTooltipMessage-->"+actualCrewGroupTooltipMessage);

    Assert.assertTrue(actualCrewGroupTooltipMessage.equals(crewGroupTooltipMessage));

  }

  public void ruleSetTooltipMessage(String ruleSetTooltipMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement currentHoverMessage= container.getErrorIcon();

    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), currentHoverMessage);
    driver.mouseOver(currentHoverMessage);

    TimeUnit.SECONDS.sleep(2);
    String actualRuleSetTooltipMessage=container.getRuleSetErrorMessage().getText();
    LOGGER.info("actualRuleSetTooltipMessage-->"+actualRuleSetTooltipMessage);

    Assert.assertTrue(actualRuleSetTooltipMessage.equals(ruleSetTooltipMessage));

  }

  public String currentCrewGroup(String currentCrewGroup) {
   String crewGroupName= container.getEditCrewGroupTextBox().getText();
   LOGGER.info("crewGroupName: "+crewGroupName);
  return crewGroupName;
  }

  public String currentRuleSet(String currentRuleSet) {
    String ruleSetName= container.getEditRuleTextBox().getText();
    LOGGER.info("ruleSetName: "+ruleSetName);
    return ruleSetName;
  }

  public void verifyCrewGroup(String crewGroup) throws InterruptedException {

    container.getEditCrewGroupTextBox().click();
    TimeUnit.SECONDS.sleep(1);

    String allCrewGroup = container.getDropDownValues().getText();
    LOGGER.info("allCrewGroup: "+allCrewGroup);

    Assert.assertTrue(!(allCrewGroup.contains(crewGroup)));

    }

  public void verifyEditedCrewGroup(String crewGroup) throws InterruptedException {

    container.getEditCrewGroupTextBox().click();
    TimeUnit.SECONDS.sleep(1);

    String allCrewGroup = container.getDropDownValues().getText();
    LOGGER.info("allCrewGroup: "+allCrewGroup);

    Assert.assertTrue(allCrewGroup.contains(crewGroup));

  }

  public void verifyRuleSet(String ruleSet) throws InterruptedException, AWTException {

    container.getEditRuleTextBox().click();
    TimeUnit.SECONDS.sleep(1);

    String allRuleSet = container.getDropDownValues().getText();
    LOGGER.info("allRuleSet: "+allRuleSet);

    Assert.assertTrue(!(allRuleSet.contains(ruleSet)));

    Robot rob= new Robot();
    rob.keyPress(KeyEvent.VK_TAB);
    rob.keyRelease(KeyEvent.VK_TAB);
    TimeUnit.SECONDS.sleep(1);

  }

  public void verifyEditedRuleSet(String ruleSet) throws InterruptedException {

    container.getEditRuleTextBox().click();
    TimeUnit.SECONDS.sleep(1);

    String allRuleSet = container.getDropDownValues().getText();
    LOGGER.info("allRuleSet: "+allRuleSet);

    Assert.assertTrue(allRuleSet.contains(ruleSet));

  }

  public void verifyWarningIcon() throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    Assert.assertTrue(container.getErrorIcon().isDisplayed()==true);

  }

  public void verifyWarningIconCrewGroup() throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    Assert.assertTrue(container.getCrewGroupErrorIcon().isDisplayed()==true);

  }

  public void verifyWarningIconRuleSet() throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    Assert.assertTrue(container.getRuleSetErrorIcon().isDisplayed()==true);

  }

  public void crewGroupTooltipMessageWithRuleSet(String crewGroupTooltipMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement currentHoverMessage= container.getCrewGroupErrorIcon();

    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), currentHoverMessage);
    driver.mouseOver(currentHoverMessage);

    TimeUnit.SECONDS.sleep(2);
    String actualCrewGroupTooltipMessage=container.getCrewGroupErrorMessage().getText();
    LOGGER.info("crewGroupTooltipMessage-->"+actualCrewGroupTooltipMessage);

    Assert.assertTrue(actualCrewGroupTooltipMessage.equals(crewGroupTooltipMessage));

  }

  public void ruleSetTooltipMessageWithCrewGroup(String ruleSetTooltipMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement currentHoverMessage= container.getRuleSetErrorIcon();

    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), currentHoverMessage);
    driver.mouseOver(currentHoverMessage);

    TimeUnit.SECONDS.sleep(2);
    String actualRuleSetTooltipMessage=container.getRuleSetErrorMessage().getText();
    LOGGER.info("actualRuleSetTooltipMessage-->"+actualRuleSetTooltipMessage);

    Assert.assertTrue(actualRuleSetTooltipMessage.equals(ruleSetTooltipMessage));

  }

  public void verifyChkBoxEnabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    int solverCheckBox= container.getAllCheckBoxes().size();
    LOGGER.info("CheckBox Count: "+solverCheckBox);
    for(int i= 0; i<solverCheckBox ; i++)
    {
      Assert.assertTrue(container.getAllCheckBoxes().get(i).isEnabled()==true);
    }
  }

  public void verifyFilter(String solverName) throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep((long) 0.25);
    Assert.assertTrue(container.getSolverFilterName().isEnabled()==true);
    TimeUnit.SECONDS.sleep((long) 0.25);
    container.getSolverFilterName().sendKeys(solverName);
    TimeUnit.SECONDS.sleep((long) 0.65);

  }

  public void verifySolverNameOnFilter(String solverName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.SolverFilterName, solverName))).getText().equals(solverName));
    container.getClickFilter().click();

  }

  public void selectSolver(String solverNames)throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    String[] solvers = solverNames.split(", ");
    solverName = new ArrayList<>();
    for (String solver : solvers) {
      solverName.add(solver);

      driver.getWebDriver().findElement(By.xpath(String.format(container.selectSolver, solver))).click();
      TimeUnit.SECONDS.sleep((long) 1.2);

    }
  }

  public void listOfSolver(String solverNames)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String[] solvers = solverNames.split(", ");
    solverName = new ArrayList<>();
    for (String solver : solvers) {
      solverName.add(solver);

      driver.getWebDriver().findElement(By.xpath(String.format(container.clickSolver, solver))).isDisplayed();
      TimeUnit.SECONDS.sleep((long) 0.2);

    }
  }

  public void SolverClick(String solverNames)throws InterruptedException {

      driver.getWebDriver().findElement(By.xpath(String.format(container.clickSolver, solverNames))).click();
      TimeUnit.SECONDS.sleep((long) 1.2);
    }


  public void verifyStatisticsHeader(String solverNames)throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    String[] solvers = solverNames.split(", ");
    solverName = new ArrayList<>();
    for (String solver : solvers) {
      solverName.add(solver);

      Assert.assertTrue(container.getStatisticsHeader().getText().contains(solver));
      TimeUnit.SECONDS.sleep((long) 0.2);

    }
  }

  public void verifyStatisticsHeaderRemoved(String solverNames)throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    String[] solvers = solverNames.split(", ");
    solverName = new ArrayList<>();
    for (String solver : solvers) {
      solverName.add(solver);

      Assert.assertFalse(container.getStatisticsHeader().getText().contains(solver));
      TimeUnit.SECONDS.sleep((long) 0.2);

    }
  }

  public void verifyCompare(String compare)throws InterruptedException {
      container.getCompareThreeDots().click();
      TimeUnit.SECONDS.sleep((long) 0.2);
    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.compareOption, compare))).isEnabled()==true);
    driver.getWebDriver().findElement(By.xpath(String.format(container.compareOption, compare))).click();
    TimeUnit.SECONDS.sleep(5);

     }

  public void verifyFavoriteButtonDisabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    Assert.assertTrue(container.getFavoriteRequestButton().isEnabled()==false);

  }
  public void verifyFavoriteButtonEnabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    Assert.assertTrue(container.getFavoriteRequestButton().isEnabled()==true);
    TimeUnit.SECONDS.sleep(1);
    container.getFavoriteRequestButton().click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyFavoriteSolver(String solverRequestName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);

    String favorite= driver.getWebDriver().findElement(By.xpath(String.format(container.favoriteSolver, solverRequestName))).getText();
    LOGGER.info("favorite "+favorite);
    String solverRequest= driver.getWebDriver().findElement(By.xpath(String.format(container.detailsFavoriteSolver, solverRequestName))).getText();
    LOGGER.info("solverRequest details: "+solverRequest);
    Assert.assertTrue(solverRequest.contains(solverRequestName) && solverRequest.contains("favorite"));
    TimeUnit.SECONDS.sleep((long) 0.5);

  }

  public void verifyCrewGroupOnPairing(String crewGroupName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);

    Set<String> handles = driver.getWebDriver().getWindowHandles();
    Iterator<String> it = handles.iterator();
    if(handles.size()==1)
    {
      TimeUnit.SECONDS.sleep(15);
    }
    String parentWindow=    it.next();
    String childWindow=    it.next();

    if(driver.getWebDriver().getCurrentUrl().contains("preview")) {
      String crewGroupNameText = driver.getWebDriver().findElement(By.xpath(String.format(container.updateRequestName, crewGroupName))).getAttribute("class");
      LOGGER.info("crewGroupNameText: " + crewGroupNameText);
      Assert.assertTrue(crewGroupNameText.contains("disabled"));
    }

    else
    {
      driver.getWebDriver().switchTo().window(childWindow);
      String crewGroupNameText = driver.getWebDriver().findElement(By.xpath(String.format(container.updateRequestName, crewGroupName))).getAttribute("class");
      LOGGER.info("crewGroupNameText: " + crewGroupNameText);
      Assert.assertTrue(crewGroupNameText.contains("disabled"));
    }
  }

  public void verifyButtonDisabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.1);

    Assert.assertTrue(container.getAddSolverRequestButton().isEnabled()==false);
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyBaselineOnPairing(String baseline) throws InterruptedException {

    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.textOnPairingPageBaseline, baseline))).isDisplayed()==true);

  }

  public void displayOnPairing(String utcDisplay) throws InterruptedException {

    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.displayOnPairing, utcDisplay))).isDisplayed()==true);

  }

  public void verifyPairingOptionButton(String optionButton) throws InterruptedException {

    String winHandleBefore = driver.getWebDriver().getCurrentUrl();
    LOGGER.info("url: "+winHandleBefore);

        Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.textOnPairingPage, optionButton))).isEnabled() == true);
   }

  public void isButtonDisabledOnSolver(String buttonText) throws InterruptedException {

    String[] solversButton = buttonText.split(", ");
    solverName = new ArrayList<>();
    for (String solver : solversButton) {
      solverName.add(solver);

      Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.getLaunchOrStopButton, solver))).isEnabled()==false);
      TimeUnit.SECONDS.sleep((long) 0.2);
    }
  }

  public void isFieldsDisabledOnSolver() throws InterruptedException {

    for(int i =2; i<=7 ; i++)
    {
      TimeUnit.SECONDS.sleep((long) 0.);
      String disabledFiled= driver.getWebDriver().findElement(By.xpath("(//div[contains(@class, \"MuiInputBase-root\")])["+i+"]")).getAttribute("class");
      LOGGER.info("disabledFiled: "+ i+" value is "+disabledFiled);
      Assert.assertTrue(disabledFiled.contains("disabled"));
    }

  }

  public boolean isPopUpWindowDisplayed(){
    if(container.isErrorPopUpWindowDiaplyed().isDisplayed()){
      return true;
    }else {
      return false;
    }
  }

  public void isSummaryTitleDispalyed() throws InterruptedException {
    WebElement summary = driver.getWebDriver().findElement(By.xpath("//*[text()='Summary']"));
    Assert.assertTrue(summary.isDisplayed());
    TimeUnit.SECONDS.sleep((long) 1);
  }
  public void  goToSummaryTextLocation() throws InterruptedException {
    WebElement summaryText=container.getSummaryText();
    driver.scrollToElement(summaryText);
  }

  public void clickSelectRequests() throws InterruptedException {
    container.getSelectAllCheckbox().click();
    TimeUnit.SECONDS.sleep((long) 1);
  }
}
