package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.data.rulesets.Rulesets;
import com.adopt.altitude.automation.frontend.pageobject.containers.RulesetPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import com.google.common.collect.ImmutableMap;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.remote.Command;
import org.openqa.selenium.remote.CommandExecutor;
import org.openqa.selenium.remote.Response;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.awt.*;
import java.awt.datatransfer.*;
import java.awt.event.KeyEvent;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Scope("prototype")
public class RulesetView extends AbstractPageView<RulesetPageContainer> {

  private static final Logger LOGGER = LogManager.getLogger(RulesetView.class);

  Rulesets ruleset= new Rulesets();
  public static String copyResult;
  private List<String> ruleName;
  private static int size;


  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), RulesetPageContainer.class);
  }

  @Override
  public boolean isDisplayedCheck() {
    return true;
  }

  public void clickRulesLeftpanelIcon() {
    container.clickRulesLeftpanelIcon().click();
  }

  public void clickRulesCardToRead() {
    driver.scrollToElement(container.getRulesCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getRulesCard());
    container.getRulesCard().click();
  }

  public void clickManageRulesetsLink() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getManageRulesetsLink());
    container.getManageRulesetsLink().click();
  }

  public void clickExpandButton(String rulesetName1, String rulesetName2) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.expandButton, rulesetName1))).click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.expandButton, rulesetName2))).click();
  }

  public void clickThreeDots(String rulesetName) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.threeDotsLink, rulesetName))).click();
  }

  public void clickAction(String action) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.click_Open_Get_Add_Duplicate_Delete, action))).click();
  }

  public void clickActionDuplicate(String action) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.click_Open_Get_Add_Duplicate_Delete, action))).click();
    TimeUnit.SECONDS.sleep(1);

    Robot rob = new Robot();
    rob.keyPress(KeyEvent.VK_ENTER);
    rob.keyRelease(KeyEvent.VK_ENTER);

    TimeUnit.SECONDS.sleep(1);

  }

  public void networkOffline() throws InterruptedException, IOException {
    TimeUnit.SECONDS.sleep(1);
    Map map = new HashMap();
    map.put("offline", true);
    map.put("latency", 5);
    map.put("download_throughput", 500);
    map.put("upload_throughput", 1024);


    CommandExecutor executor = ((ChromeDriver)driver.getWebDriver()).getCommandExecutor();
    Response response = executor.execute(
      new Command(((ChromeDriver)driver.getWebDriver()).getSessionId(), "setNetworkConditions", ImmutableMap.of("network_conditions", ImmutableMap.copyOf(map))));
  LOGGER.info("response: "+response);
  }

  public void networkOnline() throws InterruptedException, IOException {
    TimeUnit.SECONDS.sleep(1);
    Map map = new HashMap();
    map.put("offline", false);
    map.put("latency", 5);
    map.put("download_throughput", 5000);
    map.put("upload_throughput", 1024);

    CommandExecutor executor = ((ChromeDriver)driver.getWebDriver()).getCommandExecutor();
    Response response = executor.execute(
      new Command(((ChromeDriver)driver.getWebDriver()).getSessionId(), "setNetworkConditions", ImmutableMap.of("network_conditions", ImmutableMap.copyOf(map))));
    LOGGER.info("response: "+response);
  }

  public void getCurrentSelection() throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    Robot rob = new Robot();
    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(1);

    WebElement currentElement = driver.getWebDriver().switchTo().activeElement();
    LOGGER.info("here "+currentElement);

    String className =  currentElement.getAttribute("class");
    String id = currentElement.getAttribute("id");

    LOGGER.info("className "+className);
    LOGGER.info("id "+id);

    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_C);
    rob.keyRelease(KeyEvent.VK_C);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(1);

    Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    Transferable contents = clipboard.getContents(null);
    boolean hasTransferableText = (contents != null) && contents.isDataFlavorSupported(DataFlavor.stringFlavor);
    if (hasTransferableText) {

      try {
        copyResult = (String) contents.getTransferData(DataFlavor.stringFlavor);
        System.out.print("Copy Result is: "+copyResult);
      } catch (UnsupportedFlavorException | IOException ex) {
        LOGGER.info(ex);
        ex.printStackTrace();
      }

    }
  }

  public void getCurrentFocus(String currentFocusHere) throws InterruptedException, AWTException {

    TimeUnit.SECONDS.sleep(1);

    Robot rob = new Robot();
    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_DELETE);
    rob.keyRelease(KeyEvent.VK_DELETE);
    TimeUnit.SECONDS.sleep(1);

    Clipboard passclipboard = Toolkit.getDefaultToolkit()
      .getSystemClipboard();
    StringSelection stringSelectionpass = new StringSelection(currentFocusHere);
    passclipboard.setContents(stringSelectionpass, null);

    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(2);

  }

  public void getNewRulesetName(String rulSetName) throws InterruptedException, AWTException {

    TimeUnit.SECONDS.sleep(1);

    Robot rob = new Robot();
    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_A);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_DELETE);
    rob.keyRelease(KeyEvent.VK_DELETE);
    TimeUnit.SECONDS.sleep(1);

    Clipboard passclipboard = Toolkit.getDefaultToolkit().getSystemClipboard();
    StringSelection stringSelectionpass = new StringSelection(rulSetName);
    passclipboard.setContents(stringSelectionpass, null);

    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_CONTROL);
    rob.keyPress(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_V);
    rob.keyRelease(KeyEvent.VK_CONTROL);

    TimeUnit.SECONDS.sleep(3);

    rob.keyPress(KeyEvent.VK_ENTER);
    rob.keyRelease(KeyEvent.VK_ENTER);

    TimeUnit.SECONDS.sleep(1);

  }

  public String getAddedRulesetName(String rulesetName){
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getRulesetNameforCheckingName, rulesetName))).getText();

  }

  public void checkLabelDetails(String rulesetName){
    WebElement theSpan = driver.getWebDriver().findElement(By.xpath(String.format(container.getRulesetNameforCheckingName, rulesetName)));
    String title = theSpan.getAttribute("title");
    String label = theSpan.getText();
    LOGGER.info("label Title: "+title); // will return "the Title of SPAN"
    LOGGER.info("label value: "+label); // will return "The Text"
    Assert.assertTrue(label.length()>0);
  }

  public void verifyChildDetails(String childOfString, String parentRuleName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);

    String childString = "";
    childString = copyResult.substring(0, 8);
    LOGGER.info("child Details: "+childString);

    Assert.assertTrue(childOfString.equals(childString));

    String parentString="";
    parentString=copyResult.substring(9);
    LOGGER.info("parentString Details: "+parentString);

    Assert.assertTrue(parentRuleName.equals(parentString));

  }

  public boolean verifyDeleteOption(String action) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    if ((driver.getWebDriver().findElements(By.xpath(String.format(container.click_Open_Get_Add_Duplicate_Delete, action))).size()) == 0)
      return true;
    else
      return false;
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  public String getSuccessMessage() {
    LOGGER.info(container.getSuccessMessage().getText());
    return container.getSuccessMessage().getText();
  }

  public void clickCancelButton() {
    container.getCancelButton().click();
  }

  public boolean getNoSuccessMessage() {
    if (driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'msg')]/span")).size() == 0)
      return true;
    else
      return false;
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickRefErrorCloseButton() {
    container.clickCloseButton().click();
  }

  public void updateRulesetName(String newName)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getEditRulesetNameTextbox().click();
    container.getEditRulesetNameTextbox().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getEditRulesetNameTextbox().sendKeys(newName);
  }

  public void saveChanges()throws InterruptedException {
    container.getSaveButton().click();
    TimeUnit.SECONDS.sleep(1);
  }

  public void updateRulesetName_FiftyPlusCharacter(){
    container.getEditRulesetNameTextbox().click();
    container.getEditRulesetNameTextbox().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getEditRulesetNameTextbox().sendKeys(ruleset.rulesetName);
  }

  public Integer getRulesetName(String rulesetName){
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getRulesetNameforCheckingName, rulesetName))).getText().length();
  }

  public Integer getRulesetDescription(String rulesetName){
    return container.getDescriptionTextField().getText().length();
  }

  public void updateRulesetDescription(){
    container.getDescriptionTextField().click();
    container.getDescriptionTextField().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getDescriptionTextField().sendKeys(ruleset.descriptionText);
  }

  public String getRuleCount() throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    String countText=container.getRuleCount().getText();
    String countValue=countText.replaceAll("[^0-9]", "");
    return  countValue;
  }

  public String getLastModifiedText(String rulesetName){
    return container.getLastModifiedText().getText();
  }

  public String getLastModifiedByText(String rulesetName){
    return container.getLastModifiedByText().getText();
  }
  public String getLastModifiedTextOnRulesetTab(String rulesetName){
   return  driver.getWebDriver().findElement(By.xpath(String.format( container.getLastModifiedTextOnRulesetTab,rulesetName))).getText();
  }


  public void moveToRulesName(String rulesName) throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    String count = getRuleCount();
    int countValues = Integer.parseInt(count);
    int finalCount = 2 * countValues;
    for (int i = 1; i <= finalCount; i = i + 2) {
      WebElement ruleTextRow = driver.getWebDriver().findElement(By.xpath("//*[@class='MuiTableBody-root']//tr[" + i + "]/td[2]"));
      driver.scrollToElement(ruleTextRow);
      String text = ruleTextRow.getText();
      if (rulesName.equals(text)) {
        break;
      }
    }
  }

  public void expandRulesName(String rulesName) throws InterruptedException {
    WebElement elementLocation = driver.getWebDriver().findElement(By.xpath(String.format(container.expandRulesName, rulesName)));
    driver.jsClick(elementLocation);
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void updateLegsValue(String legsValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getLegsValue().click();
    container.getLegsValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getLegsValue().sendKeys(legsValue);
    TimeUnit.SECONDS.sleep(1);
    container.getLegsValue().sendKeys(Keys.chord((Keys.TAB)));
    driver.waitForElement(container.getSuccessMessage(),20);
    TimeUnit.SECONDS.sleep(1);
  }

  public void selectRuleState(String state, String ruleName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    WebElement toCheckRuleIsOnorOff=driver.getWebDriver().findElement(By.xpath(String.format(container.OnOffStatus, ruleName)));
    String currentStausofRule=toCheckRuleIsOnorOff.getText();
    if(currentStausofRule.equals(state)){
      System.out.println("rule is already present in your  mentioned status , ");
    }else {
      driver.getWebDriver().findElement(By.xpath(String.format(container.ruleState, ruleName))).click();
    }

  }

  public String getCurrentRuleStatus(String ruleName) {
     return driver.getWebDriver().findElement(By.xpath(String.format(container.OnOffStatus, ruleName))).getText();
  }

  public void updateDutiesValue(String dutiesValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getDutiesValue().click();
    container.getDutiesValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getDutiesValue().sendKeys(dutiesValue);
    TimeUnit.SECONDS.sleep(1);

  }

  public void clicksAwayFromParameter()throws InterruptedException {
    container.getClicksAway().click();
    TimeUnit.SECONDS.sleep(5);

  }

  public String getCurrentDutiesValue(String dutiesValue) {

    return driver.getWebDriver().findElement(By.xpath(String.format(container.getUpdatedDutiesValues, dutiesValue))).getAttribute("value");
  }

  public void selectDeadheadsValue(String changeDeadheadsValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    container.getDeadheadsValue().click();
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.rulePageDropDown, changeDeadheadsValue))).click();
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public String getCurrentDeadheadsStatus() {
    return container.getDeadheadsValue().getText();
  }

  public void moveToElementMaxDutyCredit()  throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.scrollToElement(container.getMaxDutyCredit());
    TimeUnit.SECONDS.sleep(1);

  }

  public void selectMealValues(String newMeal) throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    container.getMealType().click();
    TimeUnit.SECONDS.sleep(2);
    driver.getWebDriver().findElement(By.xpath(String.format(container.rulePageDropDown, newMeal))).click();
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public String getCurrentMealDetails() {
    return container.getMealType().getText();
  }

  public void updateOtherwiseValue(String otherwiseValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getOtherwiseValue().click();
    container.getOtherwiseValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getOtherwiseValue().sendKeys(otherwiseValue);
    TimeUnit.SECONDS.sleep(1);

  }

  public Integer getCurrentCharacterCount() {

    String currentString= container.getIntAndDecimalValue().getAttribute("value");
    int count = 0;

    //Counts each character except space
    for(int i = 0; i < currentString.length(); i++) {
      if(currentString.charAt(i) != ' ')
        count++;
    }
    return count;
  }

  public void updateNoMoreThanValue(String noMoreThanValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getTimeValidator().click();
    container.getTimeValidator().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getTimeValidator().sendKeys(noMoreThanValue);
    TimeUnit.SECONDS.sleep(1);

  }

  public Integer getCurrentCharacterCountForNoMoreThan() {

    String currentString= container.getTimeValidator().getAttribute("value");
    int count = 0;

    //Counts each character except space
    for(int i = 0; i < currentString.length(); i++) {
      if(currentString.charAt(i) != ' ')
        count++;
    }
    return count;
  }

  public void checkDurationFormat() {

    String currentString= container.getTimeValidator().getAttribute("value");
    System.out.println("Data "+currentString);

    // Regex to check valid time in 24-hour format.
    String regex = "([01]?[0-9]|2[0-3])h[0-5][0-9]";
    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(currentString);

    Assert.assertTrue(m.matches()==true);

  }

  public void updateCommercialDeadheadsValue(String commercialDeadheads)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getCommercialDeadheads().click();
    container.getCommercialDeadheads().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getCommercialDeadheads().sendKeys(commercialDeadheads);
    TimeUnit.SECONDS.sleep(1);

  }

  public Integer getUpdatedCommercialDeadheadsValue() {

    String currentString= container.getCommercialDeadheads().getAttribute("value");
    int count = 0;

    //Counts each character except space
    for(int i = 0; i < currentString.length(); i++) {
      if(currentString.charAt(i) != ' ')
        count++;
    }
    return count;
  }

  public void updateSpecialTagValue(String specialTagValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getSpecialTagValue().click();
    container.getSpecialTagValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getSpecialTagValue().sendKeys(specialTagValue);
    TimeUnit.SECONDS.sleep(1);

  }

  public Integer getCurrentCharacterCountForSpecialTagValue() {

    String currentString= container.getSpecialTagValue().getAttribute("value");
    int count = 0;

    //Counts each character except space
    for(int i = 0; i < currentString.length(); i++) {
      if(currentString.charAt(i) != ' ')
        count++;
    }
    return count;
  }

  public void updateSpecialTailNumber(String specialTailNumber)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getSpecialTailNumber().click();
    container.getSpecialTailNumber().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getSpecialTailNumber().sendKeys(specialTailNumber);
    TimeUnit.SECONDS.sleep(1);

  }

  public Integer getCurrentCharacterCountForSpecialTailNumber() {

    String currentString= container.getSpecialTailNumber().getAttribute("value");
    int count = 0;

    //Counts each character except space
    for(int i = 0; i < currentString.length(); i++) {
      if(currentString.charAt(i) != ' ')
        count++;
    }
    return count;
  }

  public void selectDepartureTime(String departureTime) throws InterruptedException {

    container.getClickTime().click();
    TimeUnit.SECONDS.sleep(1);
    String[] timeArray = splitTime(departureTime);
    selectTime(timeArray[0], timeArray[1]);

  }

  private String[] splitTime(String time) {
    return time.split(":");
  }

  private void selectTime(String hour, String minute) throws InterruptedException {
    // Select an hour from calendar
    WebElement calendarHour = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TIME, hour)));
    driver.clickAction(calendarHour);

    // Select minutes from calendar
    WebElement calendarMinute = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TIME, minute)));
    driver.clickAction(calendarMinute);

    // Click Ok button to set Date to the field
    TimeUnit.SECONDS.sleep(1);
    container.getTimeOkButton().click();
  }

  public String getUpdatedTime() {

    return container.getClickTime().getAttribute("value");
  }

  public void selectDate(String date) throws InterruptedException {

    container.getClickDate().click();
    TimeUnit.SECONDS.sleep(1);

    String[] dateArray = splitDate(date);

    selectDateFromCalendar(dateArray[2], dateArray[0], dateArray[1]);

  }

  private String[] splitDate(String date) {
    return date.split("-");
  }

  private void selectDateFromCalendar(String year, String month, String day) throws InterruptedException {
    //Select year from the calendar
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCalendarYearHeader());
    driver.jsClick(container.getCalendarYearHeader());
    WebElement calenderYear = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_YEAR, year)));
    driver.jsClick(calenderYear);

    //Click calendar month
    WebElement calenderMonth = container.getCalendarMonth();
    while(!(calenderMonth.getText().contains(month))) {
      container.getCalendarRightArrowButton().click();
    }

    //Select the calendar day
    WebElement calendarDay = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_DAY, day)));
    calendarDay.click();

    TimeUnit.SECONDS.sleep(1);
    container.getCalendarOkButton().click();
  }

  public String getUpdatedDate() {

    return container.getClickDate().getAttribute("value");
  }

  public void clickLinkText(String linkText)throws InterruptedException {
    WebElement getLinkText=driver.getWebDriver().findElement(By.xpath(String.format(container.LINK_TEXT, linkText)));
    getLinkText.click();
    TimeUnit.SECONDS.sleep(1);
    driver.scrollToElement(getLinkText);
    TimeUnit.SECONDS.sleep(1);

  }

  public String getUpdatedBriefTime() {

    return container.getBriefTime().getAttribute("value");
  }

  public String getUpdatedOtherwiseValue() {

    return container.getOtherWiseValue().getAttribute("value");
  }

  public void waitForRulePage() {
    driver.waitForElement(container.getTableHeader(),60);
  }

  public void updateIntegerValue(String integerValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().click();
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getCurrentPlaceHolderValue().sendKeys(String.valueOf(integerValue));
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.TAB)));
  }

  public void currentPlaceHolderIsEnabled() {
    WebElement currentPlaceHolder = container.getCurrentPlaceHolder();
    LOGGER.info("textPlaceHolder is enabled (true or false): " +currentPlaceHolder.isEnabled());
    Assert.assertTrue(!(currentPlaceHolder.isEnabled()));
  }


  public void verifyRuleLinkText(String linkText)throws InterruptedException {
    String getLinkText=driver.getWebDriver().findElement(By.xpath(String.format(container.LINK_TEXT, linkText))).toString();

    LOGGER.info("getLinkText "+getLinkText);
    Assert.assertTrue(getLinkText.contains("HyperLink"));
    }

  public void verifyCurrentRuleSetName(String ruleSetName)throws InterruptedException {
    String CurrentRuleSet=container.getCurrentRuleSet().getText();

    LOGGER.info("CurrentRuleSet "+CurrentRuleSet);
    Assert.assertTrue(CurrentRuleSet.equals(ruleSetName));
    TimeUnit.SECONDS.sleep(1);
  }

  public void selectRuleSet(String ruleSetName) throws InterruptedException {
    String rulesetNameText = container.getCurrentRuleSet().getText();
    if(rulesetNameText.equals(ruleSetName)){
      System.out.println("current Rule set already selected..");
    }else {
      TimeUnit.SECONDS.sleep(2);
      container.getCurrentRuleSet().click();
      TimeUnit.SECONDS.sleep(1);
      driver.getWebDriver().findElement(By.xpath(String.format(container.SELECT_RULESET, ruleSetName))).click();
      TimeUnit.SECONDS.sleep(1);
    }
  }

  public void revertButtonIsEnabled() throws InterruptedException {
    int revertButtonCount = container.getRevertButton().size();
    LOGGER.info("revertButtonCount "+revertButtonCount);
    for(int i=0; i<revertButtonCount; i++)
    {
      LOGGER.info("revert button at "+(i+1)+ " is enabled (true or false): " +container.getRevertButton().get(i).isEnabled());
      Assert.assertTrue(!(container.getRevertButton().get(i).isEnabled()));
      TimeUnit.SECONDS.sleep((long) 0.5);
    }

  }

  public void StateComboBoxOnOffIsEnabled() throws InterruptedException {
    List<WebElement> StateComboBoxOnOff = container.getStateComboBoxOnOff();
    int StateComboBoxOnOffCount= StateComboBoxOnOff.size();
    LOGGER.info("StateComboBoxOnOffCount "+StateComboBoxOnOffCount);
    for(int i=0; i<StateComboBoxOnOffCount; i++) {

      String checkStateComboBoxOnOff = StateComboBoxOnOff.get(i).getAttribute("class");
      LOGGER.info("checkStateComboBoxOnOff class details at row "+(i+1)+ " is:  " + checkStateComboBoxOnOff);
       Assert.assertTrue(checkStateComboBoxOnOff.contains("disabled"));
      TimeUnit.SECONDS.sleep((long) 0.5);
    }
  }


  public void verifyIntegerValueNotUpdated(String integerValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getOverlay().click();
    TimeUnit.SECONDS.sleep((long) 0.5);
    Assert.assertFalse(container.getCurrentPlaceHolderValue().getAttribute("value").equals(integerValue));
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void updateDurationValue(String durationValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 1);
    container.getCurrentPlaceHolderValue().click();
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getCurrentPlaceHolderValue().sendKeys(String.valueOf(durationValue));
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.TAB)));
    driver.waitForElement(container.getSuccessMessage(),60);
  }

  public void verifyDurationValue(String durationValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getOverlay().click();
    TimeUnit.SECONDS.sleep((long) 0.5);
    Assert.assertFalse(container.getCurrentPlaceHolderValue().getAttribute("value").equals(durationValue));
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void verifyExpandRulesAndDescription(String rulesNameList) throws InterruptedException {

    String[] rules = rulesNameList.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      moveToRulesName(rule);
      driver.getWebDriver().findElement(By.xpath(String.format(container.expandRulesName, rule))).click();
      TimeUnit.SECONDS.sleep(1);
      LOGGER.info("All rules: " + rule);
    }
    String value = getRuleCount();
    int ruleCount = Integer.parseInt(value);
    LOGGER.info("total rules: " + ruleCount);
    int ruleDescription = container.getRuleDescription().size();
    LOGGER.info("total rule description : " + ruleDescription);
    Assert.assertTrue(ruleCount >= ruleDescription);
  }

  public void verifyRulesInRulesPageList() throws InterruptedException {
    String value=getRuleCount();
    int ruleCount =Integer.parseInt(value);
    LOGGER.info("total rules: "+ruleCount);
    Assert.assertTrue(ruleCount>0);

  }

  public void changeRuleState(String state, String rulesName)throws InterruptedException {

    String[] rules = rulesName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      moveToRulesName(rule);
      LOGGER.info("All rules: " + rule);
      TimeUnit.SECONDS.sleep(1);
      WebElement toCheckRuleIsOnorOff = driver.getWebDriver().findElement(By.xpath(String.format(container.OnOffStatus, rule)));
      String currentStausofRule = toCheckRuleIsOnorOff.getText();
      if (currentStausofRule.equals(state)) {
        System.out.println("rule is already present in your  mentioned status , ");
      } else {
        driver.getWebDriver().findElement(By.xpath(String.format(container.ruleState, rule))).click();
      }

    }
  }

  public void verifyDisabledRuleState(String rulesName)throws InterruptedException {

    String[] rules = rulesName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      moveToRulesName(rule);
      WebElement ruleNameField = driver.getWebDriver().findElement(By.xpath(String.format(container.rulesName, rule)));
      driver.scrollToElement(ruleNameField);
      String disableDrop =  driver.getWebDriver().findElement(By.xpath(String.format(container.ruleState, rule))).getAttribute("class");

      TimeUnit.SECONDS.sleep((long) 0.65);
      LOGGER.info("All rules: " + rule+ "disableDrop "+disableDrop);
      Assert.assertTrue(disableDrop.contains("disabled"));
    }
  }


  public void verifyRuleState(String state, String rulesName)throws InterruptedException {

    String[] rules = rulesName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      moveToRulesName(rule);
      LOGGER.info("All rules: " + rule);
      TimeUnit.SECONDS.sleep(3);
      WebElement toCheckRuleIsOnorOff = driver.getWebDriver().findElement(By.xpath(String.format(container.OnOffStatus, rule)));
      String currentStausofRule = toCheckRuleIsOnorOff.getText();
      Assert.assertTrue(currentStausofRule.equals(state));
      TimeUnit.SECONDS.sleep((long) 1.5);
      LOGGER.info("All rules: " + rule);
    }
  }

  public void verifyManageRuleLinkTextAndClick() throws InterruptedException {
    String getLinkText=container.getManageRuleLink().getAttribute("class");
    String hrefText=container.getManageRuleLink().getAttribute("href");
    LOGGER.info("getLinkText "+getLinkText);
    LOGGER.info("hrefText "+hrefText);
    Assert.assertTrue(getLinkText.contains("Link"));
    Assert.assertTrue(hrefText.contains("http://"));
    container.getManageRuleLink().click();
    TimeUnit.SECONDS.sleep((long) 1.5);
  }

  public void verifyManageRuleLinkText() throws InterruptedException {
    String getLinkText=container.getManageRuleLink().getAttribute("class");
    String hrefText=container.getManageRuleLink().getAttribute("href");
    LOGGER.info("getLinkText "+getLinkText);
    LOGGER.info("hrefText "+hrefText);
    Assert.assertTrue(getLinkText.contains("Link"));
    Assert.assertTrue(hrefText.contains("http://"));
   }


  public void goBackToRules() throws InterruptedException {
    container.getBackToRules().click();
    TimeUnit.SECONDS.sleep((long) 1.5);
  }

  public void updateRuleDescriptionValue(String ruleValue) throws InterruptedException {
    container.getRuleDescriptionValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getRuleDescriptionValue().sendKeys(ruleValue);
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getRuleDescription().get(0).click();
    TimeUnit.SECONDS.sleep(3);
  }

  public void verifyDisableRuleDescriptionValue() throws InterruptedException {

    TimeUnit.SECONDS.sleep((long) 0.5);
    String embeddedValue= container.getRuleDescriptionValue().getAttribute("class");
    String actualValue= container.getRuleDescriptionValue().getAttribute("value");
    String value= container.getRuleDescriptionValue().getText();
    LOGGER.info("embeddedValue: "+embeddedValue+"  value: "+value);
    LOGGER.info("actualValue: "+actualValue);
    Assert.assertTrue(embeddedValue.contains("disabled"));
    Assert.assertTrue(!(actualValue.isBlank()));
    TimeUnit.SECONDS.sleep(3);
  }

  public void verifyUpdateRuleDescriptionValue(String ruleValue) throws InterruptedException {
    LOGGER.info("Rule Value: "+container.getRuleDescriptionValue().getText());
    Assert.assertTrue(ruleValue.equals(container.getRuleDescriptionValue().getText()));
    TimeUnit.SECONDS.sleep((long) 0.5);

  }

  public void verifyRuleSetName(String ruleSetName)throws InterruptedException {

    String[] rules = ruleSetName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);

      String actualRuleSetName=      driver.getWebDriver().findElement(By.xpath(String.format(container.getRulesetName, rule))).getText();
      TimeUnit.SECONDS.sleep((long) 0.2);
      LOGGER.info("All expectedRuleSetName: " + ruleSetName);
      LOGGER.info("All actualRuleSetName: " + actualRuleSetName);

      Assert.assertTrue(ruleSetName.contains(actualRuleSetName));

    }
  }

  public void clickCollapseButton(String ruleSetName)throws InterruptedException {
    String[] rules = ruleSetName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      TimeUnit.SECONDS.sleep(2);
      driver.getWebDriver().findElement(By.xpath(String.format(container.COLLAPSE_BUTTON, rule))).click();
    }
  }

  public boolean getNoCollapseButton(String ruleSetName) {
    try {
      String[] rules = ruleSetName.split(", ");
      ruleName = new ArrayList<>();
      for (String rule : rules) {
        ruleName.add(rule);
        WebElement checkCollapseButton= driver.getWebDriver().findElement(By.xpath(String.format(container.COLLAPSE_BUTTON, rule)));
        if (!(checkCollapseButton.isDisplayed())) {
          return true;
        }
      }
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;

  }

  public void clickExpandButton(String ruleSetName)throws InterruptedException {
    String[] rules = ruleSetName.split(", ");
    ruleName = new ArrayList<>();
    for (String rule : rules) {
      ruleName.add(rule);
      TimeUnit.SECONDS.sleep(2);
      driver.getWebDriver().findElement(By.xpath(String.format(container.EXPAND_BUTTON, rule))).click();
    }
  }

  public boolean getNoExpandButton(String ruleSetName) {
    try {
      String[] rules = ruleSetName.split(", ");
      ruleName = new ArrayList<>();
      for (String rule : rules) {
        ruleName.add(rule);
        WebElement checkCollapseButton= driver.getWebDriver().findElement(By.xpath(String.format(container.EXPAND_BUTTON, rule)));
        if (!(checkCollapseButton.isDisplayed())) {
          return true;
        }
      }
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;

  }

  public void verifyRuleSetAction(String RuleSetAction)throws InterruptedException {

    String[] actions = RuleSetAction.split(", ");
    ruleName = new ArrayList<>();
    for (String action : actions) {
      ruleName.add(action);

      String actionAttribute=      driver.getWebDriver().findElement(By.xpath(String.format(container.click_Open_Get_Add_Duplicate_Delete, action))).getAttribute("class");
      TimeUnit.SECONDS.sleep((long) 0.2);
      LOGGER.info("All RuleSetAction: " + RuleSetAction);
      LOGGER.info("All actualRuleSetName: " + actionAttribute);

      Assert.assertTrue(!(actionAttribute.contains("disabled")));

    }
  }

  public void verifyRuleSetActionDisabled(String RuleSetAction)throws InterruptedException {

    String[] actions = RuleSetAction.split(", ");
    ruleName = new ArrayList<>();
    for (String action : actions) {
      ruleName.add(action);

      String actionAttribute=      driver.getWebDriver().findElement(By.xpath(String.format(container.click_Open_Get_Add_Duplicate_Delete, action))).getAttribute("class");
      TimeUnit.SECONDS.sleep((long) 0.2);
      LOGGER.info("All RuleSetAction: " + RuleSetAction);
      LOGGER.info("All actualRuleSetName: " + actionAttribute);

      Assert.assertTrue(actionAttribute.contains("disabled"));

    }
  }


  public void verifyGetInfoOnEdit()throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(2);
    Assert.assertTrue(container.getEditRulesetNameTextbox().isDisplayed());
    Assert.assertTrue(container.getLastModifiedText().isDisplayed());
    Assert.assertTrue(container.getLastModifiedByText().isDisplayed());
    Assert.assertTrue(container.getDescriptionTextField().isDisplayed());
  }

  public void verifyEditableFiledOnEditIsEnabled()throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(1);
       Assert.assertTrue(container.getEditRulesetNameTextbox().isEnabled()==true);
    Assert.assertTrue(container.getDescriptionTextField().isEnabled()==true);

  }

  public void verifyEditableFiledOnEditIsDisabled()throws InterruptedException {
    TimeUnit.MILLISECONDS.sleep(1);
    Assert.assertTrue(container.getEditRulesetNameTextbox().isEnabled()==false);
    Assert.assertTrue(container.getDescriptionTextField().isEnabled()==false);

  }

  public void clickRulesCardForUAT() {
    driver.scrollToElement(container.getRulesCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getRulesCard());
    container.getRulesCard().click();
    driver.waitForElement(container.getBaselineRulesPageForUAT(), 120);
  }

  public void clickToggleButtonsOfParticularRule() throws InterruptedException {
    List<WebElement> toggleButtons = container.getToggleButtons();
    int size = toggleButtons.size();
    for (int i = 0; i < size; i++) {
      toggleButtons.get(i).click();
      TimeUnit.SECONDS.sleep(1);
    }
  }

  public void verifyDurationValueAreEqual(String durationValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    Assert.assertTrue(container.getCurrentPlaceHolderValue().getAttribute("value").equals(durationValue));
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void updateDurationTimeValue(String durationValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().click();
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getCurrentPlaceHolderValue().sendKeys(String.valueOf(durationValue));
    TimeUnit.SECONDS.sleep((long) 1);
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.TAB)));
    TimeUnit.SECONDS.sleep((long) 1);
  }

  public void selectTime(String time) throws InterruptedException {
    container.getSelectTime().click();
    TimeUnit.SECONDS.sleep(1);
    String[] timeArray = splitTime(time);
    selectTime(timeArray[0], timeArray[1]);
  }

  public String getUpdatedTimeValue() {
    return container.getSelectTime().getAttribute("value");
  }

  public void getIntAndDecimalValue(String defaultCostValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getIntAndDecimalValue().click();
    container.getIntAndDecimalValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getIntAndDecimalValue().sendKeys(defaultCostValue);
    TimeUnit.SECONDS.sleep(1);
  }

  public void updateParameterValue(String value, String parameterText) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement parameter = driver.getWebDriver().findElement(By.xpath(String.format(container.changeRuleParameterValue, parameterText)));
    parameter.click();
    parameter.sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    parameter.sendKeys(String.valueOf(value));
    TimeUnit.SECONDS.sleep((long) 1);
    parameter.sendKeys(Keys.chord((Keys.TAB)));
    TimeUnit.SECONDS.sleep((long) 1);
  }

  public String getUpdatedValue(String parameterText) {
    WebElement parameter = driver.getWebDriver().findElement(By.xpath(String.format(container.changeRuleParameterValue, parameterText)));
    return parameter.getAttribute("value");
  }

  public void getInputParameterStatus() {
    List<WebElement> inputLocator = container.getInputFields();
    int size = inputLocator.size();
    for (int i = 0; i < size; i++) {
      LOGGER.info("textPlaceHolder is enabled (true or false): " + inputLocator.get(i).isEnabled());
      Assert.assertTrue(!(inputLocator.get(i).isEnabled()));
    }
  }

  public void verifyIntegerValueAreEqual(String durationValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 3);
    Boolean status = container.getCurrentPlaceHolderValue().getAttribute("value").equals(durationValue);
    Assert.assertTrue(status);
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void getTableLink() throws InterruptedException {
    driver.getWebDriver().findElement(By.xpath("((//*[@class=\"rule-description\"]//descendant::span/button))")).click();
    TimeUnit.SECONDS.sleep(3);
    WebElement getTablePopUpwindow = container.getTablePopUpWindow();
    Assert.assertTrue(getTablePopUpwindow.isDisplayed());
  }

  public void getAddButtonTable() throws InterruptedException {
    driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//descendant::button/span")).click();
    TimeUnit.SECONDS.sleep(3);

  }

  public void addDataTotheTable(String value1, String value2) throws InterruptedException {

    List<WebElement> NumberOfRowsAvailable = driver.getWebDriver().findElements(By.xpath("//*[@id='dynamic-table']//*[contains(@id,'tablerow')]"));
    size = NumberOfRowsAvailable.size();
    if(size == 0){
      WebElement deadHeadDurationHours =driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr/td//div//input[@placeholder='Deadhead duration (hours)']"));
      deadHeadDurationHours.click();
      deadHeadDurationHours.sendKeys(value1);
      TimeUnit.SECONDS.sleep(2);
      WebElement two = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr/td//div//input[@placeholder='Cost']"));
      two.click();
      TimeUnit.SECONDS.sleep(2);
      two.sendKeys(value2);
      driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiDialogTitle-root Base__StyledDial')]")).click();
    }else{
      if(size>0){
        WebElement deadHeadDurationHours = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr["+size+"]/td//div//input[@placeholder='Deadhead duration (hours)']"));
        deadHeadDurationHours.click();
        deadHeadDurationHours.sendKeys(value1);
        TimeUnit.SECONDS.sleep(2);
        WebElement cost = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr["+size+"]/td//div//input[@placeholder='Cost']"));
        cost.click();
        TimeUnit.SECONDS.sleep(2);
        cost.sendKeys(value2);
        driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiDialogTitle-root Base__StyledDial')]")).click();


      }
    }
  }

  public void verifyDataOfTable(String value1, String value2) throws InterruptedException {
    if(size==0){
      WebElement deadHeadDurationHours = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr/td//div//input[@placeholder='Deadhead duration (hours)']"));
      Assert.assertTrue(deadHeadDurationHours.getAttribute("value").equals(value1));
      TimeUnit.SECONDS.sleep(2);
      WebElement cost = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr/td//div//input[@placeholder='Cost']"));
      Assert.assertTrue(cost.getAttribute("value").equals(value2));
      TimeUnit.SECONDS.sleep(2);

    }else{
      WebElement deadHeadDurationHours = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr["+size+"]/td//div//input[@placeholder='Deadhead duration (hours)']"));
      Assert.assertTrue(deadHeadDurationHours.getAttribute("value").equals(value1));
      TimeUnit.SECONDS.sleep(2);
      WebElement cost = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']//tbody//tr["+size+"]/td//div//input[@placeholder='Cost']"));
      Assert.assertTrue(cost.getAttribute("value").equals(value2));
      TimeUnit.SECONDS.sleep(2);
    }
  }

  public void clickSave() {
    container.getSaveButton().click();
  }

  public void clickCancel() {
    container.clickCancelButton().click();
  }

  public void verifyDataIsNotAdded(String value1, String value2) throws InterruptedException {

    boolean status = driver.getWebDriver().findElement(By.xpath("//*[text()='No data found']")).isDisplayed();
    Assert.assertTrue(status);
  }

  public void deleteRow() throws InterruptedException {
    clickOnThreeDotMenuOption();
    WebElement deleteRowOption = driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiPaper-root MuiMenu-paper MuiPopover-paper MuiPaper')]/ul/child::li[text()='Delete row']"));
    driver.scrollToElement(deleteRowOption);
    deleteRowOption.click();
    TimeUnit.SECONDS.sleep(2);

  }

  public void recordIsdeleted(String value1,String value2) throws InterruptedException {
    List<WebElement> deadHeadDurationValue = driver.getWebDriver().findElements(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Deadhead duration (hours)']"));
    for (WebElement deadHeadDuration : deadHeadDurationValue) {
      String isDeleted = deadHeadDuration.getAttribute("value");
      Assert.assertTrue(!isDeleted.equals(value1));
    }
    List<WebElement> cost = driver.getWebDriver().findElements(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Cost']"));
    for (WebElement costs : cost) {
      String isDeleted = costs.getAttribute("value");
      Assert.assertTrue(!isDeleted.equals(value1));
    }
  }


  public void clickOnThreeDotMenuOption() throws InterruptedException {
    if(size==0) {
      WebElement locationOfRecord = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr"));
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(locationOfRecord);
      TimeUnit.SECONDS.sleep(2);
      WebElement threeDots = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr/td[3]/descendant::button"));
      TimeUnit.SECONDS.sleep(1);
      driver.ScrollAction(threeDots);
      TimeUnit.SECONDS.sleep(2);
      threeDots.click();
      TimeUnit.SECONDS.sleep(2);
    }else{
      WebElement locationOfRecord = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr["+size+"]"));
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(locationOfRecord);
      TimeUnit.SECONDS.sleep(2);
      WebElement threeDots = driver.getWebDriver().findElement(By.xpath("//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr["+size+"]/td[3]/descendant::button"));
      TimeUnit.SECONDS.sleep(1);
      driver.ScrollAction(threeDots);
      TimeUnit.SECONDS.sleep(2);
      threeDots.click();
      TimeUnit.SECONDS.sleep(2);
    }
  }

  public void clickInsertRowAbove() throws InterruptedException {
    clickOnThreeDotMenuOption();
    WebElement insertRowabove = driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiPaper-root MuiMenu-paper MuiPopover-paper MuiPaper')]/ul/child::li[text()='Insert row above']"));
    driver.scrollToElement(insertRowabove);
    insertRowabove.click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyInsertRecordAbove(String value1,String value2) throws InterruptedException {
    WebElement insertAboveDeadHeadDuration =driver.getWebDriver().findElement(By.xpath("(//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Deadhead duration (hours)'])[last()]"));
    Assert.assertTrue(insertAboveDeadHeadDuration.getAttribute("value").equals(value1));
    TimeUnit.SECONDS.sleep(2);
    WebElement insertAboveCost =driver.getWebDriver().findElement(By.xpath("(//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Cost'])[last()]"));
    Assert.assertTrue(insertAboveCost.getAttribute("value").equals(value2));
  }

  public void clickInsertRowBelow() throws InterruptedException {
    clickOnThreeDotMenuOption();
    WebElement insertRowabove = driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiPaper-root MuiMenu-paper MuiPopover-paper MuiPaper')]/ul/child::li[text()='Insert row below']"));
    driver.scrollToElement(insertRowabove);
    insertRowabove.click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyInsertRecordBelow(String value1,String value2) throws InterruptedException {
    WebElement insertBelowDeadHeadDuration =driver.getWebDriver().findElement(By.xpath("(//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Deadhead duration (hours)'])[last()]"));
    Assert.assertFalse(insertBelowDeadHeadDuration.getAttribute("value").equals(value1));
    TimeUnit.SECONDS.sleep(2);
    WebElement insertBelowCost =driver.getWebDriver().findElement(By.xpath("(//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr//input[@placeholder='Cost'])[last()]"));
    Assert.assertFalse(insertBelowCost.getAttribute("value").equals(value2));

  }
  public void updatDecimalValue(String value)throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().click();
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getCurrentPlaceHolderValue().sendKeys(String.valueOf(value));
    TimeUnit.SECONDS.sleep((long) 0.5);
    container.getCurrentPlaceHolderValue().sendKeys(Keys.chord((Keys.TAB)));
  }
  public void verifyDecimalValueAreEqual(String durationValue) throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 3);
    String value = durationValue.toString();
    Boolean status = container.getCurrentPlaceHolderValue().getAttribute("value").equals(value);
    Assert.assertTrue(status);
    TimeUnit.SECONDS.sleep((long) 0.5);
  }
  public void updateSoftCostValue(String otherwiseValue)throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    container.getOtherwiseValue().click();
    container.getOtherwiseValue().sendKeys(Keys.chord((Keys.CONTROL), "a", Keys.DELETE));
    container.getOtherwiseValue().sendKeys(otherwiseValue);
    TimeUnit.SECONDS.sleep(1);

  }
  public void saveButtonIsDisabled(){
    WebElement submitButton =driver.getWebDriver().findElement(By.xpath("//*[@type='submit']"));
    Assert.assertTrue(submitButton.getAttribute("class").contains("disabled"));
  }

}


