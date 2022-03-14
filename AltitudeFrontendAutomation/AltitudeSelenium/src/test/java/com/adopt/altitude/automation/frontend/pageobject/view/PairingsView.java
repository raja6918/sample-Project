package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.PairingsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.List;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")

public class PairingsView extends AbstractPageView<PairingsPageContainer> {

  private static final Logger LOGGER = LogManager.getLogger(PairingsView.class);
  public static int cautionAlertCount;
  public static int FlagAlertCount;
  public static int infractionAlertCount;
  public static int alertRowCount;
  int widthOnFirstCrewGroup = 0;
  static String bgColor;
  public static int no_of_pairing_before;
  public static int no_of_pairing_after;
  public static int no_of_total_pairing_before;
  public static int no_of_total_pairing_after;

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), PairingsPageContainer.class);
  }

  public void getPairingsPage() {
    WebElement pairingsClick = container.clickPairingPage();
    pairingsClick.click();
    driver.waitForElement(container.getPairingPageTitle(), 120);
  }

  public boolean getNoneCrewGroup() {
    if (driver.getWebDriver().findElements(By.xpath("//span[@id='react-select-context--value']/parent::div/preceding-sibling::input")).size() == 0)
      return false;
    else
      return true;
  }

  public boolean getNoneRuleset() {
    if ((container.getNoneRuleset().getText()).equals(""))
      return false;
    else
      return true;
  }

  public void selectCrewGroupFirstTime(String crewGroup) throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    container.ClickCrewGroupInitially().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.crewGroupDropdownValue, crewGroup))).click();
  }

  public void selectPairing() throws InterruptedException {
    container.getClickPairing().click();
    TimeUnit.SECONDS.sleep(1);
  }

  public void selectOptionsFromPairing(String options) throws InterruptedException {

    driver.getWebDriver().findElement(By.xpath(String.format(container.getPairingDetails, options))).click();
    TimeUnit.SECONDS.sleep((long) 0.5);

  }

  public void clickNewTab(String options) throws InterruptedException {

    bgColor = driver.getWebDriver().findElement(By.xpath("//*[@class=\"back\"]")).getCssValue("background");
    LOGGER.info("background css " + bgColor);
    driver.getWebDriver().findElement(By.xpath(String.format(container.getPairingDetails, options))).click();
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public String getApplicationTab(String urlHeader) throws InterruptedException {
    Set<String> set = driver.getWebDriver().getWindowHandles();
    Iterator<String> it = set.iterator();
    String parent = it.next();
    String child = it.next();

    driver.getWebDriver().switchTo().window(child);
    String urlTitle = driver.getWebDriver().switchTo().window(child).getCurrentUrl();
    Assert.assertTrue(urlTitle.contains(urlHeader));
    return urlTitle;

  }

  public void checkBackNavigation() throws InterruptedException {

    String beforeNavigationURL = driver.getWebDriver().getCurrentUrl();
    LOGGER.info("beforeNavigationURL: " + beforeNavigationURL);
    driver.getWebDriver().navigate().back();
    TimeUnit.SECONDS.sleep(1);
    String afterNavigationURL = driver.getWebDriver().getCurrentUrl();
    LOGGER.info("afterNavigationURL: " + afterNavigationURL);

    Assert.assertTrue(beforeNavigationURL.equals(afterNavigationURL));

  }

  public void checkForwardNavigation() throws InterruptedException {

    String beforeNavigationURL = driver.getWebDriver().getCurrentUrl();
    LOGGER.info("beforeNavigationURL: " + beforeNavigationURL);
    driver.getWebDriver().navigate().forward();
    TimeUnit.SECONDS.sleep(1);
    String afterNavigationURL = driver.getWebDriver().getCurrentUrl();
    LOGGER.info("afterNavigationURL: " + afterNavigationURL);

    Assert.assertTrue(beforeNavigationURL.equals(afterNavigationURL));

  }

  public boolean confirmBackMessageRemoved(String linkBackMessage) {

    try {
      WebElement checkBackMessage = driver.getWebDriver().findElement(By.xpath(String.format(container.getApplicationTitle, linkBackMessage)));
      if (!(checkBackMessage.isDisplayed())) {
        return true;
      }
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;

  }

  public boolean confirmBlackBackground() {

    try {

      if ((driver.getWebDriver().findElement(By.xpath("//*[@class=\"back\"]")).getCssValue("background") == null)
      ) {
        return true;
      }
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;

  }

  public void getParentApplicationTab() throws InterruptedException {
    Set<String> set = driver.getWebDriver().getWindowHandles();
    Iterator<String> it = set.iterator();
    String parent = it.next();
    String child = it.next();

    driver.getWebDriver().switchTo().window(parent);
    String urlTitle = driver.getWebDriver().switchTo().window(parent).getCurrentUrl();
    LOGGER.info("url: " + urlTitle);

  }

  public String getApplicationTitle(String title) throws InterruptedException {

    TimeUnit.SECONDS.sleep((long) 0.5);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getApplicationTitle, title))).getText();
  }

  public boolean isNotificationButtonEnabled(String notificationButton) {
    WebElement notificationBtn = driver.getWebDriver().findElement(By.xpath(String.format(container.getApplicationTitle, notificationButton)));
    return notificationBtn.isEnabled();
  }

  public boolean isHomeButtonDisabled() {
    WebElement backHome = driver.getWebDriver().findElement(By.xpath(container.BacktoHome));
    return !(backHome.isEnabled());
  }

  public boolean isUserMenuDisabled() {
    return !(container.getUserMenu().isEnabled());
  }

  public void refreshPage() throws InterruptedException {
    driver.getWebDriver().navigate().refresh();
    TimeUnit.SECONDS.sleep(3);
  }

  public String getPageTitle(String pageTitle) throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getApplicationTitle, pageTitle))).getText();
  }

  public String getParentTab(String ParentTab) throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getParentTab, ParentTab))).getText();

  }

  public void getParentTabScenario(String parentTabScenario) throws InterruptedException {

    TimeUnit.SECONDS.sleep(1);
    String tabScenario = driver.getWebDriver().findElement(By.xpath(String.format(container.getParentTab, parentTabScenario))).getText();
    Assert.assertTrue(tabScenario.contains(parentTabScenario));

  }

  public void selectCrewGroup(String crewGroup) throws InterruptedException {
    TimeUnit.SECONDS.sleep(5);
    //List<WebElement> arrow = container.arrow_drop_down();
    container.ClickCrewGroupInitially().click();
   // driver.jsClick(arrow.get(1));
    TimeUnit.SECONDS.sleep(3);
    driver.getWebDriver().findElement(By.xpath(String.format(container.crewGroupDropdownValue, crewGroup))).click();
  }

  public String getRuleset(String ruleset) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.rulesetlink, ruleset))).getText();
  }

  public void getRulesetAndCrewGroup(String crewGroup, String ruleset) {
    String winHandleBefore = driver.getWebDriver().getWindowHandle();
    Set<String> handles = driver.getWebDriver().getWindowHandles();
    for (String windowHandle : handles) {
      if (!windowHandle.equals(winHandleBefore)) {
        driver.getWebDriver().switchTo().window(windowHandle);
        driver.waitForElement(container.getPairingPageTitle(), 120);
        String currentCrewGroup = driver.getWebDriver().findElement(By.xpath(String.format(container.currentCrewGroup, crewGroup))).getAttribute("value");
        String currentRuleSet = driver.getWebDriver().findElement(By.xpath(String.format(container.rulesetlink, ruleset))).getText();
        LOGGER.info("currentCrewGroup: " + currentCrewGroup);
        LOGGER.info("currentRuleSet: " + currentRuleSet);
        Assert.assertTrue(currentCrewGroup.equals(crewGroup));
        Assert.assertTrue(currentRuleSet.equals(ruleset));
      }
    }
  }

  public void ruleSetIsEnabled() {

    WebElement ruleSetImg = container.getRuleSetImage();
    String checkRuleSetImage = ruleSetImg.getAttribute("src");
    LOGGER.info("ruleSetImg " + ruleSetImg);
    LOGGER.info("checkRuleSetImage" + checkRuleSetImage);
    Assert.assertTrue(checkRuleSetImage.contains("rulesdisabled"));
  }

  public void crewGroupIsEnabled(String crewGroup) {
    Assert.assertFalse(driver.getWebDriver().findElement(By.xpath(String.format(container.currentCrewGroup, crewGroup))).isEnabled());
  }

  public void clickPlusButton() throws InterruptedException {
    TimeUnit.SECONDS.sleep(6);
    container.clickPlusButton().click();
  }

  public String verifyTimeline(String timeline) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.timeline, timeline))).getText();
  }

  public String getWidth() {

    List<WebElement> width = container.getWidth();
    if (!width.isEmpty()) {
      String width1 = width.get(0).getAttribute("style");
      return width1;
    } else
      return "";
  }

  public int verifyZoomIn() throws InterruptedException {
    String widthText = getWidth();
    if (!widthText.equals("")) {
      widthText = widthText.substring(7, 9);
      widthText = widthText.replace(".", "");
      int width = Integer.parseInt(widthText);
      return width;
    } else
      return 0;
  }

  public boolean validateZoomFunctionality() throws InterruptedException {
    int widthBeforeZoom = verifyZoomIn();
    clickZoomIn();
    int widthAfterZoom = verifyZoomIn();
    if (widthBeforeZoom < widthAfterZoom)
      return true;
    else
      return false;
  }

  public void clickZoomIn() throws InterruptedException {
    container.verifyZoomIn().click();
    TimeUnit.SECONDS.sleep(3);
  }

  public void clickZoomInFiveTimes() throws InterruptedException {
    if (alertRowCount > 3) {

      for (int i = 0; i < 5; i++) {
        container.verifyZoomIn().click();
        TimeUnit.SECONDS.sleep(1);
      }
    } else {
      LOGGER.info("less than 3 alert row count for current selected pairing, expected was at least 4, but actual is " + alertRowCount);
    }
  }

  public void verifyAlertColorForCaution(String colorCode) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
    int allAlerts = container.getSelectPairingsWithCaution().size();
    LOGGER.info("Caution Alert count: " + allAlerts);
    if (allAlerts > 0) {
      driver.scrollToElement(container.getSelectPairingsWithCaution().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      String verifyColorCode = container.getSelectPairingsWithCaution().get(0).getAttribute("fill");
      LOGGER.info("verifyColorCode " + verifyColorCode);
      Assert.assertTrue(verifyColorCode.equals(colorCode));
    } else {
      LOGGER.info("Caution Alert count= " + allAlerts);
    }
  }

  public void verifyAlertColorForFlag(String colorCode) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
    int allAlerts = container.getSelectPairingsWithFlag().size();
    LOGGER.info("Flag Alert count: " + allAlerts);
    if (allAlerts > 0) {
      driver.scrollToElement(container.getSelectPairingsWithFlag().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      String verifyColorCode = container.getSelectPairingsWithFlag().get(0).getAttribute("fill");
      LOGGER.info("verifyColorCode " + verifyColorCode);
      Assert.assertTrue(verifyColorCode.equals(colorCode));
    } else {
      LOGGER.info("Flag Alert count= " + allAlerts);
    }
  }

  public void verifyAlertColorForInfraction(String colorCode) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    int allAlerts = container.getSelectPairingsWithInfraction().size();
    LOGGER.info("Infraction Alert count: " + allAlerts);
    if (allAlerts > 0) {
      String verifyColorCode = container.getSelectPairingsWithInfraction().get(0).getAttribute("fill");
      LOGGER.info("verifyColorCode " + verifyColorCode);
      Assert.assertTrue(verifyColorCode.equals(colorCode));

    } else {
      LOGGER.info("Infraction Alert count= " + allAlerts);
    }
  }

  public void verifyLineColor(String colorCode) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    if (colorCode.equals("rgba(255, 101, 12, 1)")) {
      LOGGER.info("Inside Infraction Alert");
      int allAlerts = container.getSelectPairingsWithInfraction().size();
      LOGGER.info("Infraction Alert count: " + allAlerts);
      if (allAlerts > 0) {

//        driver.scrollToElement(container.getSelectPairingsWithInfractionAlert().get(0));
//        TimeUnit.SECONDS.sleep(2);
//        Robot rob= new Robot();
//        rob.keyPress(KeyEvent.VK_UP);
//        rob.keyRelease(KeyEvent.VK_UP);
//        TimeUnit.SECONDS.sleep(1);
//        rob.keyPress(KeyEvent.VK_UP);
//        rob.keyRelease(KeyEvent.VK_UP);
//        TimeUnit.SECONDS.sleep(1);

        container.getSelectPairingsWithInfractionAlert().get(0).click();

        LOGGER.info("Bottom color " + container.getSelectBottom().getCssValue("background-color"));
        System.out.println("Left color " + container.getSelectLeft().getCssValue("background-color"));
        System.out.println("Top color " + container.getSelectTop().getCssValue("background-color"));
        System.out.println("Right color " + container.getSelectRight().getCssValue("background-color"));

        Assert.assertTrue(container.getSelectBottom().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectLeft().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectTop().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectRight().getCssValue("background-color").equals(colorCode));


      } else {
        LOGGER.info("Infraction Alert count= " + allAlerts);
      }

    } else if (colorCode.equals("rgba(232, 187, 0, 1)")) {
      LOGGER.info("Inside Caution Alert");
      int allAlerts = container.getSelectPairingsWithCaution().size();
      LOGGER.info("Caution Alert count: " + allAlerts);
      if (allAlerts > 0) {

//        driver.scrollToElement(container.getSelectPairingsWithCautionAlert().get(0));
//        TimeUnit.SECONDS.sleep(2);
//        Robot rob= new Robot();
//        rob.keyPress(KeyEvent.VK_UP);
//        rob.keyRelease(KeyEvent.VK_UP);
//        TimeUnit.SECONDS.sleep(1);
//        rob.keyPress(KeyEvent.VK_UP);
//        rob.keyRelease(KeyEvent.VK_UP);
//        TimeUnit.SECONDS.sleep(1);

        container.getSelectPairingsWithCautionAlert().get(0).click();

        LOGGER.info("Bottom color " + container.getSelectBottom().getCssValue("background-color"));
        System.out.println("Left color " + container.getSelectLeft().getCssValue("background-color"));
        System.out.println("Top color " + container.getSelectTop().getCssValue("background-color"));
        System.out.println("Right color " + container.getSelectRight().getCssValue("background-color"));

        Assert.assertTrue(container.getSelectBottom().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectLeft().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectTop().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectRight().getCssValue("background-color").equals(colorCode));

      } else {
        LOGGER.info("Caution Alert count= " + allAlerts);
      }
    } else if (colorCode.equals("rgba(80, 152, 231, 1)")) {
      LOGGER.info("Inside Flag Alert");
      int allAlerts = container.getSelectPairingsWithFlag().size();
      LOGGER.info("Flag Alert count: " + allAlerts);
      if (allAlerts > 0) {
/*

        driver.scrollToElement(container.getSelectPairingsWithFlagAlert().get(0));
        TimeUnit.SECONDS.sleep(2);
        Robot rob= new Robot();
        rob.keyPress(KeyEvent.VK_UP);
        rob.keyRelease(KeyEvent.VK_UP);
        TimeUnit.SECONDS.sleep(1);
        rob.keyPress(KeyEvent.VK_UP);
        rob.keyRelease(KeyEvent.VK_UP);
        TimeUnit.SECONDS.sleep(1);
*/

        container.getSelectPairingsWithFlagAlert().get(0).click();

        LOGGER.info("Bottom color " + container.getSelectBottom().getCssValue("background-color"));
        System.out.println("Left color " + container.getSelectLeft().getCssValue("background-color"));
        System.out.println("Top color " + container.getSelectTop().getCssValue("background-color"));
        System.out.println("Right color " + container.getSelectRight().getCssValue("background-color"));

        Assert.assertTrue(container.getSelectBottom().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectLeft().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectTop().getCssValue("background-color").equals(colorCode));
        Assert.assertTrue(container.getSelectRight().getCssValue("background-color").equals(colorCode));


      } else {
        LOGGER.info("Flag Alert count= " + allAlerts);
      }
    }
  }

  public void verifyInChildTab(String pageTitle) {
    String winHandleBefore = driver.getWebDriver().getWindowHandle();
    Set<String> handles = driver.getWebDriver().getWindowHandles();
    for (String windowHandle : handles) {
      if (!windowHandle.equals(winHandleBefore)) {
        driver.getWebDriver().switchTo().window(windowHandle);
        driver.waitForElement(container.getPairingPageTitle(), 120);
        Assert.assertTrue(container.getPairingPageTitle().getText().equals(pageTitle));
      }
    }
  }

  public void selectPairingWithCautionAlert(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(5);

    cautionAlertCount = container.getSelectPairingsWithCautionAlert().size();
    LOGGER.info("Caution Alert count: " + cautionAlertCount);
    if (cautionAlertCount > 0) {
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getSelectPairingsWithCaution().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      container.getSelectPairingsWithCautionAlert().get(0).click();
      TimeUnit.SECONDS.sleep(2);
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      String verifyColorCode = container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeAfter " + verifyColorCode);
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));
      String currentAlertText = driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))).getText();
      Assert.assertTrue(currentAlertText.equals(alertText));
    } else {
      LOGGER.info("Caution Alert count= " + cautionAlertCount);
    }

  }

  public void selectPairingWithFlagAlert(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    FlagAlertCount = container.getSelectPairingsWithFlagAlert().size();
    LOGGER.info("Flag Alert count: " + FlagAlertCount);
    if (FlagAlertCount > 0) {
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getSelectPairingsWithFlag().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      container.getSelectPairingsWithFlagAlert().get(0).click();
      TimeUnit.SECONDS.sleep(2);
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      String verifyColorCode = container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeAfter " + verifyColorCode);
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));
      String currentAlertText = driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))).getText();
      Assert.assertTrue(currentAlertText.equals(alertText));
    } else {
      LOGGER.info("Flag Alert count= " + FlagAlertCount);
    }

  }

  public void selectPairingWithInfractionAlert(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    infractionAlertCount = container.getSelectPairingsWithInfractionAlert().size();
    LOGGER.info("Infraction Alert count: " + infractionAlertCount);
    if (infractionAlertCount > 0) {
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getSelectPairingsWithInfraction().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      container.getSelectPairingsWithInfractionAlert().get(0).click();
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      /*String verifyColorCode= container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeAfter "+verifyColorCode);
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getAttribute("fill"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));


      LOGGER.info(container.getAlertRowCount().get(0).getCssValue("backgroundColor"));
      LOGGER.info(container.getAlertRowCount().get(0).getCssValue("color"));
*/
      String currentAlertText = driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))).getText();
      Assert.assertTrue(currentAlertText.equals(alertText));
    } else {
      LOGGER.info("Infraction Alert count= " + infractionAlertCount);
    }

  }

  public void moveCursorOnCaution(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    LOGGER.info("inside moveCursor, cautionAlertCount " + cautionAlertCount);

    if (
      (cautionAlertCount > 0)
    ) {
      LOGGER.info("inside moveCursor count>0, cautionAlertCount " + cautionAlertCount);

      TimeUnit.SECONDS.sleep(1);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      TimeUnit.SECONDS.sleep(1);
    } else {
      LOGGER.info("outside moveCursor, cautionAlertCount " + cautionAlertCount);

    }
  }

  public void moveCursorOnFlag(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    LOGGER.info("inside moveCursor, FlagAlertCount " + FlagAlertCount);

    if (
      (FlagAlertCount > 0)
    ) {
      LOGGER.info("inside moveCursor count>0, FlagAlertCount " + FlagAlertCount);

      TimeUnit.SECONDS.sleep(1);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      TimeUnit.SECONDS.sleep(1);
    } else {
      LOGGER.info("outside moveCursor, FlagAlertCount " + FlagAlertCount);

    }
  }

  public void moveCursorOnInfraction(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    LOGGER.info("inside moveCursor, infractionAlertCount " + infractionAlertCount);

    if (
      (infractionAlertCount > 0)
    ) {
      LOGGER.info("inside moveCursor count>0, infractionAlertCount " + infractionAlertCount);

      TimeUnit.SECONDS.sleep(1);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      TimeUnit.SECONDS.sleep(1);
    } else {
      LOGGER.info("outside moveCursor, infractionAlertCount " + infractionAlertCount);

    }
  }


  public boolean getNoAlertArea() {
    if (
      (cautionAlertCount > 0) || (FlagAlertCount > 0) || (infractionAlertCount > 0)
    ) {

      try {
        if (!(container.getHoverColorTest().isDisplayed())) {
          return true;
        }
      } catch (NoSuchElementException e) {
        e.printStackTrace();

      }
    } else {
      LOGGER.info("outside moveCursor, cautionAlertCount " + cautionAlertCount);
      LOGGER.info("outside moveCursor, FlagAlertCount " + FlagAlertCount);
      LOGGER.info("outside moveCursor, infractionAlertCount " + infractionAlertCount);
    }

    return true;
  }

  public void verifyAlertTextForCaution(String alertText) {
    if (
      (cautionAlertCount > 0)
    ) {
      LOGGER.info("inside verifyAlertText, cautionAlertCount " + cautionAlertCount);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))));
      String verifyColorCode = container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeafrter " + verifyColorCode);
      container.getHoverColorTest().click();
      container.getHoverColorTest().click();
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));
      LOGGER.info("Alert 1st row name " + driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText());
      Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText().equals(alertText));
    } else {
      LOGGER.info("cautionAlertCount " + cautionAlertCount);
    }
  }

  public void verifyAlertTextForFlag(String alertText) {
    if (
      (FlagAlertCount > 0)
    ) {
      LOGGER.info("inside verifyAlertText, FlagAlertCount " + FlagAlertCount);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))));
      String verifyColorCode = container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeafrter " + verifyColorCode);
      container.getHoverColorTest().click();
      container.getHoverColorTest().click();
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));
      LOGGER.info("Alert 1st row name " + driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText());
      Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText().equals(alertText));
    } else {
      LOGGER.info("FlagAlertCount " + FlagAlertCount);
    }
  }

  public void verifyAlertTextForInfraction(String alertText) {
    if (
      (infractionAlertCount > 0)
    ) {
      LOGGER.info("inside verifyAlertText, infractionAlertCount " + infractionAlertCount);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))));
/*
      String verifyColorCode = container.getHoverColorTest().getAttribute("fill");
      LOGGER.info("verifyColorCodeafrter " + verifyColorCode);
      container.getHoverColorTest().click();
      container.getHoverColorTest().click();
      LOGGER.info(container.getHoverColorTest().getCssValue("backgroundColor"));
      LOGGER.info(container.getHoverColorTest().getCssValue("color"));
*/
      LOGGER.info("Alert 1st row name " + driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText());
      Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText().equals(alertText));
    } else {
      LOGGER.info("infractionAlertCount " + infractionAlertCount);
    }
  }

  public void verifyEditRule(String alertText, String editRule) {
    if (infractionAlertCount > 0) {

      LOGGER.info("inside verifyEditRule, infractionAlertCount " + infractionAlertCount);
      int alertRowCount = container.getAlertRowCount().size();
      LOGGER.info("inside alertRowCount " + alertRowCount);
      for (int i = 0; i < alertRowCount; i++) {
        if (driver.getWebDriver().findElement(By.xpath(String.format(container.alertNameDetails, alertText))).getText().equals(alertText)) {
          LOGGER.info("Row Data for " + (i + 1) + " row: " + container.getAlertRowCount().get(0).getText());
          container.getAlertRowCount().get(0).getText().contains(editRule);
        }
      }

    } else {
      LOGGER.info("infractionAlertCount " + infractionAlertCount);
    }
  }

  public void selectPairingWithMoreThanThreeInfractionAlert(String alertText) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);

    int allAlerts = container.getSelectPairingsWithInfractionAlert().size();
    LOGGER.info("Infraction Alert count: " + allAlerts);
    if (allAlerts > 0) {
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getSelectPairingsWithInfraction().get(0));
      TimeUnit.SECONDS.sleep(2);
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(2);
      container.getSelectPairingsWithInfractionAlert().get(0).click();
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      String currentAlertText = driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))).getText();
      Assert.assertTrue(currentAlertText.equals(alertText));

      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
      alertRowCount = container.getAlertRowCount().size();
      LOGGER.info("alertTextCount " + alertRowCount);
    } else {
      LOGGER.info("Infraction Alert count= " + allAlerts);
    }

  }

  public void scrollAndSelectPairingWithMoreThanThreeInfractionAlert(String alertText) throws InterruptedException, AWTException {
    if (alertRowCount > 3) {
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getSelectPairingsWithInfractionAlert().get(0));
      TimeUnit.SECONDS.sleep(2);
      container.getSelectPairingsWithInfractionAlert().get(0).click();
      TimeUnit.SECONDS.sleep(2);
      driver.mouseOver(driver.getWebDriver().findElement(By.xpath(String.format(container.alertName, alertText))));
    } else {
      LOGGER.info("alertRowCount= " + alertRowCount);
    }

  }

  public void hoverOnAlertRow() throws InterruptedException, AWTException {
    if (alertRowCount > 3) {
      Robot rob = new Robot();
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      rob.keyPress(KeyEvent.VK_UP);
      rob.keyRelease(KeyEvent.VK_UP);
      TimeUnit.SECONDS.sleep(1);
      rob.keyPress(KeyEvent.VK_LEFT);
      rob.keyRelease(KeyEvent.VK_LEFT);
      TimeUnit.SECONDS.sleep(1);
      rob.keyPress(KeyEvent.VK_LEFT);
      rob.keyRelease(KeyEvent.VK_LEFT);
      TimeUnit.SECONDS.sleep(1);
      driver.mouseOver(container.getHoverOnSecondRow());
      TimeUnit.SECONDS.sleep(2);
      container.getHoverOnSecondRow().click();
      TimeUnit.SECONDS.sleep(1);
    } else {
      LOGGER.info("alertRowCount= " + alertRowCount);
    }

  }

  public void verifyVerticalScrollBar() {
    if (alertRowCount > 3) {

      Assert.assertTrue(container.getVerticalScrollBar().isDisplayed() == true);
    } else {
      LOGGER.info("alertRowCount= " + alertRowCount);
    }

  }


  public boolean getValueOnSecondCrewgroup(String crewGroup1, String crewGroup2) throws InterruptedException {
    TimeUnit.SECONDS.sleep(5);
    widthOnFirstCrewGroup = verifyZoomIn();
    container.verifyZoomIn().click();
    TimeUnit.SECONDS.sleep(3);
    selectCrewGroup(crewGroup1);
    TimeUnit.SECONDS.sleep(5);
    selectCrewGroup(crewGroup2);
    TimeUnit.SECONDS.sleep(3);
    int widthOnSecondCrewGroup = verifyZoomIn();
    if (widthOnFirstCrewGroup == widthOnSecondCrewGroup)
      return true;
    else
      return false;
  }

  public String getCrewGroup(String crewGroup) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.crewGroupDropdownValue, crewGroup))).getText();
  }

  public void isDisplayedCrewBases(String crewBase) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    Assert.assertTrue(driver.getWebDriver().findElement(By.xpath(String.format(container.getCrewBase, crewBase))).isDisplayed());
    TimeUnit.SECONDS.sleep(2);
  }

  public void clickFilterButton_Timeline1() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    timeline1.click();
    timeline1.click();
  }

  public void clickFilterButton_Timeline2() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(2)));
    WebElement timeline2 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    timeline2.click();
    timeline2.click();
  }

  public void clickFilterButton_Timeline3() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(3)));
    WebElement timeline3 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    timeline3.click();
    timeline3.click();
  }

  public String getText_Timeline1() throws InterruptedException {
    return container.getText_Timeline1().getText();
  }

  public String getText_Timeline2() throws InterruptedException {
    return container.getText_Timeline2().getText();
  }

  public String getText_Timeline3() throws InterruptedException {
    return container.getText_Timeline3().getText();
  }

  public void clickCloseButton() throws InterruptedException {
    container.clickCloseButton().click();
  }

  public void clickCancelButton() throws InterruptedException {
    Assert.assertTrue(container.clickCancelButton().isEnabled());
    container.clickCancelButton().click();
  }

  public void clickApplyButton() throws InterruptedException {
    container.clickApplyButton().click();
  }

  public void applyButtonIsEnabled() throws InterruptedException {
    Assert.assertFalse(container.clickApplyButton().isEnabled());
  }

  public String getFilterTypeFieldText(String filterType) throws InterruptedException {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.getFilterTypeFieldText, filterType))).getText();
  }

  public boolean addButtonIsEnabled() throws InterruptedException {
    if ((container.clickAddButton().get(0).isEnabled()))
      return true;
    else
      return false;
  }

  public boolean clearAllButtonIsEnabled() throws InterruptedException {
    if ((container.clickClearAllBtn().get(1).isEnabled()))
      return true;
    else
      return false;
  }

  public void clickAddButton() throws InterruptedException {
    container.clickAddButton().get(0).click();
  }

  public void clickClearAllBtn() throws InterruptedException {
    container.clickClearAllBtn().get(1).click();
  }

  public void clickCriteriaBtn() throws InterruptedException {
    container.clickCriteriaBtn().click();
  }

  public void clickPairingFilter() throws InterruptedException {
    container.getPairing_Filter().click();
  }

  public void clickParticularCriteria(String criteria) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.clickParticularCriteria, criteria))).click();
  }

  public void clickParticularFilterType(String FilterType) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.getParticularFilterType, FilterType))).click();
  }

  public void clickAddbutton() throws InterruptedException {
    container.clickAddButton().get(0).click();
  }

  public void selectSubCriteria(String criteria) {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.selectSubCriteria, criteria))));
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), driver.getWebDriver().findElement(By.xpath(String.format(container.selectSubCriteria, criteria))));
    driver.getWebDriver().findElement(By.xpath(String.format(container.selectSubCriteria, criteria))).click();
  }

  public boolean selectSubCriteria_IsDeselected(String criteria) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.selectSubCriteria, criteria))).isSelected();
  }

  public String getSubCriteriaAfterAddOperation(String sub_criteria) {
    String sub_criteriaAdded = driver.getWebDriver().findElement(By.xpath(String.format(container.getSubCriteriaAfterAddOperation, sub_criteria))).getText();
    return sub_criteriaAdded;
  }

  public void clickSearchBox_subCriteria() {
    container.clickSearchBox_subCriteria().get(0).click();
  }

  public boolean SearchBox_subCriteria_IsCleared() {
    container.clickSearchBox_subCriteria().get(0).click();
    String text = container.clickSearchBox_subCriteria().get(0).getText();
    if (text.equals(""))
      return true;
    else
      return false;
  }

  public void SendText_SearchBox_subCriteria(String sub_criteria) {
    container.clickSearchBox_subCriteria().get(0).sendKeys(sub_criteria);
  }

  public void click_Clear_SearchBox_subCriteria() {
    container.click_Clear_SearchBox_subCriteria().click();
  }

  public void clickClearAllBtn_AfterAdd() throws InterruptedException {
    container.clickClearAllBtn().get(0).click();
  }

  public void clickDeleteBtn() throws InterruptedException {
    container.clickDeleteBtn().get(1).click();
  }

  public boolean verifyMinLabelPresent() throws InterruptedException {
    return container.minFieldLabel().get(0).isDisplayed();
  }

  public boolean verifyMaxLabelPresent() throws InterruptedException {
    return container.maxFieldLabel().get(0).isDisplayed();
  }

  public void enterMinValue(String min) throws InterruptedException {
    clearAndSetText(container.minFieldValue().get(0), min);
    container.getText_Timeline1().click();
  }

  public void enterMaxValue(String max) throws InterruptedException {
    clearAndSetText(container.maxFieldValue().get(0), max);
    container.getText_Timeline1().click();
  }

  public String verifyErrorMessage() throws InterruptedException {
    container.getText_Timeline1().click();
    return container.errorValidationMessage().get(0).getText();
  }

  public void applyButtonEnabled() throws InterruptedException {
    Assert.assertTrue(container.clickApplyButton().isEnabled());
  }

  public void clickAddButton_DutyCriteria() throws InterruptedException {
    container.clickAddButton().get(1).click();
  }

  public void selectStartTime(String time) throws InterruptedException {
    container.getClickTime().click();
    TimeUnit.SECONDS.sleep(1);
    String[] timeArray = splitTime(time);
    selectTime(timeArray[0], timeArray[1]);
  }

  public void selectEndTime(String time) throws InterruptedException {
    container.getClickEndTime().click();
    TimeUnit.SECONDS.sleep(1);
    String[] timeArray = splitTime(time);
    selectTime(timeArray[0], timeArray[1]);
  }

  private String[] splitTime(String time) {
    return time.split(":");
  }

  private void selectTime(String hour, String minute) throws InterruptedException {
    // Select an hour from calendar
    WebElement calendarHour = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.TIMEVALUE, hour)));
    driver.clickAction(calendarHour);
    // Select minutes from calendar
    WebElement calendarMinute = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.TIMEVALUE, minute)));
    driver.clickAction(calendarMinute);
    // Click Ok button to set Date to the field
    TimeUnit.SECONDS.sleep(1);
    container.getTimeOkButton().click();
  }

  private String[] splitDate(String date) {
    return date.split("-");
  }

  public void setStartDate(String date) throws InterruptedException {
    container.getStartDate().click();
    String[] dateArray = splitDate(date);
    selectDateFromCalendar(dateArray[2], dateArray[0], dateArray[1], dateArray[3], dateArray[4]);
  }

  public void setEndDate(String date) throws InterruptedException {
    container.getEndDate().click();
    String[] dateArray = splitDate(date);
    selectDateFromCalendar(dateArray[2], dateArray[0], dateArray[1], dateArray[3], dateArray[4]);
  }

  private void selectDateFromCalendar(String year, String month, String day, String hour, String minute) throws InterruptedException {
    //Select year from the calendar
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCalenderYearHeader());
    driver.jsClick(container.getCalenderYearHeader());
    WebElement calenderYear = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarYear, year)));
    TimeUnit.SECONDS.sleep(1);
    calenderYear.click();
    WebElement calenderMonth = container.getCalendarMonth();
    while (!(calenderMonth.getText().contains(month))) {
      container.getCalenderLeftArrowButton().click();
    }
    WebElement calendarDay = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarDay, day)));
    TimeUnit.SECONDS.sleep(1);
    calendarDay.click();

    if (hour.equals("23")) {
      List<WebElement> calendarHour = driver.getWebDriver().findElements(By.xpath(String.format(container.timeList, hour)));
      TimeUnit.SECONDS.sleep(1);
      driver.clickAction(calendarHour.get(0));
    } else {
      WebElement calendarHour = driver.getWebDriver()
        .findElement(By.xpath(String.format(container.TIMEVALUE, hour)));
      TimeUnit.SECONDS.sleep(1);
      driver.clickAction(calendarHour);
    }

    WebElement calendarMinute = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.TIMEVALUE, minute)));
    TimeUnit.SECONDS.sleep(1);
    driver.clickAction(calendarMinute);
    TimeUnit.SECONDS.sleep(3);
    container.getCalendarOkButton().click();
  }

  public String verifyErrorMessageOnDate() throws InterruptedException {
    return container.verifyErrorMessageOnDate().getText();
  }

  public void clickLastFilterBtn() throws InterruptedException {
    container.getLastFilter().click();
  }

  public boolean lastFilterIsEnabled() throws InterruptedException {
    if ((container.getLastFilter().isEnabled()))
      return true;
    else
      return false;
  }

  public void clickTimelineCloseBtnForTimelineTwo() throws InterruptedException {
    // container.clickTimelineCloseBtn().click();
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(2)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();
    timeline1.click();
    WebElement clearButton = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a>ul li[class=\"icon_sprite close_icon\"]"));
    actions = new Actions(driver.getWebDriver());
    actions.moveToElement(clearButton).perform();
    clearButton.click();
  }

  public void clickTimelineCloseBtnForTimelineThree() throws InterruptedException {
    // container.clickTimelineCloseBtn().click();
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(3)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();
    WebElement clearButton = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a>ul li[class=\"icon_sprite close_icon\"]"));
    actions = new Actions(driver.getWebDriver());
    actions.moveToElement(clearButton).perform();
    clearButton.click();
  }

  public void clickTimelineCloseBtnForTimelineOne() throws InterruptedException {
    // container.clickTimelineCloseBtn().click();
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();
    WebElement clearButton = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a>ul li[class=\"icon_sprite close_icon\"]"));
    actions = new Actions(driver.getWebDriver());
    actions.moveToElement(clearButton).perform();
    clearButton.click();
  }

  public void verifyDropDownValues() {
    List<WebElement> DropdownValues = container.getDropDownValues();
    List<String> listItems = new ArrayList<String>();

    for (WebElement item : DropdownValues) {
      driver.scrollToElement(item);
      listItems.add(item.getText());
    }
    ArrayList<String> expectedDropDownValue = new ArrayList<>();
    expectedDropDownValue.add("1");
    expectedDropDownValue.add("2");
    expectedDropDownValue.add("3");
    expectedDropDownValue.add("4");
    expectedDropDownValue.add("5");
    expectedDropDownValue.add("6");
    expectedDropDownValue.add("7");
    boolean verifyDropdownMatching = listItems.equals(expectedDropDownValue);
  }

  public boolean filterButton_Timeline1IsDisplayed() {
    // return container.clickFilterButton_Timeline1().isDisplayed();
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    return timeline1.isDisplayed();
  }

  public void clickAddButton_FlightCriteria() throws InterruptedException {
    container.clickAddButton().get(2).click();
  }

  public boolean getFilterCount() throws InterruptedException {
    List<Integer> values = getValuesFromFilterCount();
    int no_of_pairing = values.get(0);
    int total_pairing = values.get(1);
    if ((no_of_pairing > 0) & (total_pairing > 0))
      return true;
    else
      return false;
  }
  public boolean getFilterCount_timelineOne() throws InterruptedException {

    List<Integer> values = getValuesFromFilterCount_timelineOne();
    int no_of_pairing = values.get(0);
    int total_pairing = values.get(1);
    if ((no_of_pairing >= 0) & (total_pairing > 0))
      return true;
    else
      return false;
  }
  public boolean getFilterCount_timelineTwo() throws InterruptedException {
    List<Integer> values = getValuesFromFilterCount_timelineTwo();
    int no_of_pairing = values.get(0);
    int total_pairing = values.get(1);
    if ((no_of_pairing >= 0) & (total_pairing > 0))
      return true;
    else
      return false;
  }
  public boolean getFilterCount_timelineThree() throws InterruptedException {
    List<Integer> values = getValuesFromFilterCount_timelineThree();
    int no_of_pairing = values.get(0);
    int total_pairing = values.get(1);
    if ((no_of_pairing > 0) & (total_pairing > 0))
      return true;
    else
      return false;
  }

  public boolean verifyFilterCountBefore_AfterRefresh() throws InterruptedException {
    List<Integer> values_before = getValuesFromFilterCount_timelineOne();
    int no_of_pairing_before = values_before.get(0);
    int total_pairing_before = values_before.get(1);
    TimeUnit.SECONDS.sleep(1);
    refreshPage();
    TimeUnit.SECONDS.sleep(2);
    List<Integer> values_after = getValuesFromFilterCount_timelineOne();
    int no_of_pairing_after = values_after.get(0);
    int total_pairing_after = values_after.get(1);
    if ((no_of_pairing_before == no_of_pairing_after) && (total_pairing_before == total_pairing_after))
      return true;
    else
      return false;
  }

  public boolean verifyFilterCountBefore_AfterNavigate() throws InterruptedException {
    List<Integer> values_before = getValuesFromFilterCount();
    int no_of_pairing_before = values_before.get(0);
    int total_pairing_before = values_before.get(1);

    driver.getWebDriver().findElement(By.xpath(container.BacktoHome)).click();
    TimeUnit.SECONDS.sleep(4);
    (driver.getWebDriver().findElement(By.xpath("//p[contains(text(),'Scenarios')]/ancestor::a"))).click();
    TimeUnit.SECONDS.sleep(4);
    driver.getWebDriver().findElement(By.xpath(container.BacktoHome)).click();
    getPairingsPage();
    TimeUnit.SECONDS.sleep(4);

    List<Integer> values_after = getValuesFromFilterCount();
    int no_of_pairing_after = values_after.get(0);
    int total_pairing_after = values_after.get(1);
    if ((no_of_pairing_before == no_of_pairing_after) && (total_pairing_before == total_pairing_after))
      return true;
    else
      return false;
  }

  public boolean verifyFilterCountBefore_AfterNavigateToTimelineOne() throws InterruptedException {
    List<Integer> values_before = getValuesFromFilterCount_timelineOne();
    int no_of_pairing_before = values_before.get(0);
    int total_pairing_before = values_before.get(1);

    driver.getWebDriver().findElement(By.xpath(container.BacktoHome)).click();
    TimeUnit.SECONDS.sleep(4);
    (driver.getWebDriver().findElement(By.xpath("//p[contains(text(),'Scenarios')]/ancestor::a"))).click();
    TimeUnit.SECONDS.sleep(4);
    driver.getWebDriver().findElement(By.xpath(container.BacktoHome)).click();
    TimeUnit.SECONDS.sleep(3);
    getPairingsPage();
    TimeUnit.SECONDS.sleep(4);

    List<Integer> values_after = getValuesFromFilterCount_timelineOne();
    int no_of_pairing_after = values_after.get(0);
    int total_pairing_after = values_after.get(1);
    if ((no_of_pairing_before == no_of_pairing_after) && (total_pairing_before == total_pairing_after))
      return true;
    else
      return false;
  }


  public List<Integer> getValuesFromFilterCount() {
    String initial_value = container.getFilterCount().getText();
    String filterCount = initial_value.replaceAll("[())]", "");
    String[] stringArray = filterCount.split("/");

    String no_of_pairing = stringArray[0];
    String total_pairing = stringArray[1].replaceAll("[^0-9]", "");

    int no_of_pairing_int = Integer.parseInt(no_of_pairing);
    int total_pairing_int = Integer.parseInt(total_pairing);

    ArrayList<Integer> Values = new ArrayList<>();
    Values.add(no_of_pairing_int);
    Values.add(total_pairing_int);
    return Values;
  }

  public List<Integer> getValuesFromFilterCount_timelineOne() throws InterruptedException {

    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    timeline1.click();

    String initial_value = container.getFilterCountTimeline1().getText();
    String filterCount = initial_value.replaceAll("[())]", "");
    String[] stringArray = filterCount.split("/");

    String no_of_pairing = stringArray[0];
    String total_pairing = stringArray[1].replaceAll("[^0-9]", "");

    int no_of_pairing_int = Integer.parseInt(no_of_pairing);
    int total_pairing_int = Integer.parseInt(total_pairing);

    ArrayList<Integer> Values = new ArrayList<>();
    Values.add(no_of_pairing_int);
    Values.add(total_pairing_int);
    return Values;
  }

  public List<Integer> getValuesFromFilterCount_timelineTwo() {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(2)));
    WebElement timeline2 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    timeline2.click();

    String initial_value = container.getFilterCountTimeline2().getText();
    String filterCount = initial_value.replaceAll("[())]", "");
    String[] stringArray = filterCount.split("/");

    String no_of_pairing = stringArray[0];
    String total_pairing = stringArray[1].replaceAll("[^0-9]", "");

    int no_of_pairing_int = Integer.parseInt(no_of_pairing);
    int total_pairing_int = Integer.parseInt(total_pairing);

    ArrayList<Integer> Values = new ArrayList<>();
    Values.add(no_of_pairing_int);
    Values.add(total_pairing_int);
    return Values;
  }

  public List<Integer> getValuesFromFilterCount_timelineThree() {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(3)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();

    String initial_value = container.getFilterCountTimeline3().getText();
    String filterCount = initial_value.replaceAll("[())]", "");
    String[] stringArray = filterCount.split("/");

    String no_of_pairing = stringArray[0];
    String total_pairing = stringArray[1].replaceAll("[^0-9]", "");

    int no_of_pairing_int = Integer.parseInt(no_of_pairing);
    int total_pairing_int = Integer.parseInt(total_pairing);

    ArrayList<Integer> Values = new ArrayList<>();
    Values.add(no_of_pairing_int);
    Values.add(total_pairing_int);
    return Values;
  }

  public boolean verifyFilterExpressionCleared() throws InterruptedException {
    if (driver.getWebDriver().findElements(By.xpath("//span[@class='filter-count']")).size() == 0)
      return true;
    else
      return false;
  }

  public void clearFilterButton_Timeline1() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    WebElement ClarFilterButton = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a>ul>li+li"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(ClarFilterButton).perform();
    // container.clearFilterButton_Timeline1().click();
    TimeUnit.SECONDS.sleep(2);
    ClarFilterButton.click();
    WebElement Pairing = driver.getWebDriver().findElement(By.xpath("//*[text()='Pairings']"));
    actions.moveToElement(Pairing);

  }

  public void clearFilterButton_Timeline2() throws InterruptedException {
    //container.clearFilterButton_Timeline2().click();
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(2)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    WebElement ClarFilterButton = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a>ul>li+li"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(ClarFilterButton).perform();
    // container.clearFilterButton_Timeline1().click();
    TimeUnit.SECONDS.sleep(2);
    ClarFilterButton.click();
  }

  public String verifyErrorMessage_durationFormat() throws InterruptedException {
    container.getText_Timeline1().click();
    return container.verifyErrorMessage_durationFormat().get(0).getText();
  }

  public String verifyErrorMessage_minuteValidation() throws InterruptedException {
    container.getText_Timeline1().click();
    String value[] = (container.minFieldValue().get(0).getAttribute("value")).split("h");
    if (60 < Integer.parseInt((value[1])))
      return container.verifyErrorMessage_durationFormat().get(0).getText();
    else if (!((value[1]).length() == 2))
      return container.verifyErrorMessage_durationFormat().get(0).getText();
    else
      return null;
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getPairingPageHeader() != null;
  }

  public void verifyCanvas() throws InterruptedException {
    TimeUnit.SECONDS.sleep(4);
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0]._paneObject.scrollToPosition(1561973700000, 1)", host.get(1)));
    TimeUnit.SECONDS.sleep(4);
    HashMap<String, Integer> cordinate=new HashMap<String, Integer>();
    //cordinates
   // HashMap<String, Integer> cordinates=getCordinateMap( cordinate,  "1561973700000",  Long.valueOf(1),  host.get(1));
   // int xcord=cordinates.get("xAxis");
   // int ycord=cordinates.get("yAxis");
    //System.out.println("Position : " + xcord + " pixels");
   // System.out.println("Position : " + ycord + " pixels");
    Actions action = new Actions(driver.getWebDriver());
    action.moveToElement(host.get(1), 201, 36).contextClick().build().perform();
    TimeUnit.SECONDS.sleep(4);
// below line is temporary purpose
   // action.moveToElement(shadowRoot, xcord + 172, ycord).click().build().perform();
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    //timeline1.click();
    TimeUnit.SECONDS.sleep(3);
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();
    TimeUnit.SECONDS.sleep(4);
    WebElement maximize = shadowRoot.findElement(By.cssSelector(" div:nth-child(3)>div:nth-child(3)>a>ul:nth-child(2)>li:nth-child(6)"));
    actions.moveToElement(maximize).perform();
    actions.click().build().perform();
    TimeUnit.SECONDS.sleep(4);
  }

  private HashMap<String, Integer> getCordinateMap(HashMap<String, Integer> cordinates, String average, Long yValue, WebElement canvas) {

    Long paneOffsetTop;
    Long paneOffsetLeft;
    Long plotOffsetTop;
    Long plotOffsetLeft;
    Long xAxisL, yAxisL;
    Object xCords, yCords;

    Double xAxis, yAxisD, yAxis;
    Double xAxisD;
    Double total;
    // js.executeScript("return
    // angular.element(arguments[0])._paneObject.collapseAllRows()",canvas);

    //  WebElement shadowRoot = (WebElement) (js.executeScript("" +
    //  "return arguments[0]._paneObject.scrollToPosition(1561973700000, 1)", host.get(1)));


    System.out.println("yValue  " + yValue);
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    xCords = js.executeScript(
      "return arguments[0]._paneObject.getSeries().xaxis.p2c(" + average + ")",
      canvas);
    System.out.println("xCords  " + xCords);
    yCords = js.executeScript(
      "return arguments[0]._paneObject.getSeries().yaxis.p2c(" + yValue + ")",
      canvas);
    System.out.println("yCords  " + yCords);
    paneOffsetTop = (Long) js
      .executeScript("return arguments[0]._paneObject.offset().top", canvas);
    System.out.println("paneOffsetTop  " + paneOffsetTop);
    paneOffsetLeft = (Long) js
      .executeScript("return arguments[0]._paneObject.offset().left", canvas);
    System.out.println("paneOffsetLeft  " + paneOffsetLeft);
    plotOffsetTop = (Long) js
      .executeScript("return arguments[0]._paneObject.getPlotOffset().top", canvas);
    System.out.println("plotOffsetTop  " + plotOffsetTop);
    plotOffsetLeft = (Long) js.executeScript(
      "return arguments[0]._paneObject.getPlotOffset().left", canvas);
    System.out.println("plotOffsetLeft  " + plotOffsetLeft);

    // xAxis=xAxis+paneOffsetLeft+plotOffsetLeft;
    if (xCords.getClass().getName().contains("Double")) {
      xAxisD = (Double) xCords;
      xAxisL = 0L;
    } else {
      xAxisL = (Long) xCords;
      xAxisD = 0.0;
    }

    if (yCords.getClass().getName().contains("Double")) {
      yAxisD = (Double) yCords;
      yAxisL = 0L;
    } else {
      yAxisL = (Long) yCords;
      yAxisD = 0.0;
    }

    total = xAxisL + xAxisD;
    xAxis = total + paneOffsetLeft + plotOffsetLeft;

    yAxis = yAxisL + yAxisD;
    if (yAxis < 0) {
      yAxis = plotOffsetTop + 5.0;
    } else {
      yAxis = yAxis + plotOffsetTop;
    }

    int xAxisValue = xAxis.intValue();
    int yAxisValue = yAxis.intValue();
    cordinates.put("xAxis", xAxisValue);
    cordinates.put("yAxis", yAxisValue);
    System.out.println("xAxis=" + xAxisValue);
    System.out.println("yAxis=" + yAxisValue);

    return cordinates;
  }

  public WebElement expandRootElement(WebElement element) {
    WebElement ele = (WebElement) ((JavascriptExecutor) driver.getWebDriver())
      .executeScript("return arguments[0].shadowRoot", element);
    return ele;
  }

  public boolean isTimelineOneIconDisplayed() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    return timeline1.isDisplayed();
  }

  public boolean isTimelineTwoIconDisplayed() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(2)));
    WebElement timeline2 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    return timeline2.isDisplayed();
  }

  public void clickOnDisplayAllPairing() {
    container.getDisplayAllPairingLink().click();
  }


  public void getFilterCount_timelineOne_before_switchToScenario() throws InterruptedException {
    List<Integer> values = getValuesFromFilterCount_timelineOne();
    no_of_pairing_before = values.get(0);
    no_of_total_pairing_before = values.get(1);
  }

  public void getFilterCount_timelineOne_after_switchToScenario() throws InterruptedException {
    List<Integer> values = getValuesFromFilterCount_timelineOne();
    no_of_pairing_after = values.get(0);
    no_of_total_pairing_after = values.get(1);
  }

  public boolean verifyFilterExpressionClearedForTimelineOne() throws InterruptedException {
    if ((no_of_pairing_before != no_of_pairing_after) && (no_of_total_pairing_before == no_of_total_pairing_after))
      return true;
    else
      return false;
  }

  public boolean getFilterCountAfterClickOnClearFilter() throws InterruptedException {
    List<WebElement> host = driver.getWebDriver().findElements(By.tagName("iflight-gantt"));
    JavascriptExecutor js = (JavascriptExecutor) driver.getWebDriver();
    WebElement shadowRoot = (WebElement) (js.executeScript("return " +
      "arguments[0].shadowRoot", host.get(1)));
    WebElement timeline1 = shadowRoot.findElement(By.cssSelector("div:nth-child(3)>div:nth-child(3)>a"));
    Actions actions = new Actions(driver.getWebDriver());
    actions.moveToElement(timeline1).perform();

    String initial_value = container.getFilterCountTimeline1().getText();
    String no_of_pairing = initial_value.replaceAll("[^0-9]", "");
    int no_of_pairing_int = Integer.parseInt(no_of_pairing);

    if ((no_of_pairing_int == 0))
      return true;
    else
      return false;
  }

  public void getFlightFilterType(String flightFilterType) throws InterruptedException {
    WebElement flightFilter = driver.getWebDriver().findElement(By.xpath(String.format(container.flightFilterType, flightFilterType)));
    TimeUnit.SECONDS.sleep(1);
    flightFilter.click();
  }

}
