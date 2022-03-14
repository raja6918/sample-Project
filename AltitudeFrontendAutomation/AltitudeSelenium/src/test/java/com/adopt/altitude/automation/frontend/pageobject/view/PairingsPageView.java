package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.PairingsPageContainer;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@Scope("prototype")
public class PairingsPageView extends AbstractPageView<PairingsPageContainer> {

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), PairingsPageContainer.class);
  }

  public void clickAddNewTimeline() {
    container.getAddTimelineButton().click();
  }

  public void clickCloseTimeline(String timeline) {
    WebElement closeBtn = driver.getWebDriver().findElement(By.xpath(String.format(container.closeTimelineButton, timeline)));
    closeBtn.click();
  }

  public void clickCollapseTimeline(String timeline) {
    WebElement collapseBtn = driver.getWebDriver().findElement(By.xpath(String.format(container.collapseTimelineButton, timeline)));
    collapseBtn.click();
  }

  public void clickZoomIn() {
    container.getZoomInButton().click();
  }

  public void clickZoomOut() {
    container.getZoomOutButton().click();
  }

  public void selectTimeLineReference(String timelineReference) {
    container.getTimeReferenceDropdown().sendKeys(timelineReference);
    container.getTimeReferenceDropdown().sendKeys(Keys.TAB);
  }

  public void selectContext(String context) {
    container.getContextDropdown().sendKeys(context);
    container.getContextDropdown().sendKeys(Keys.TAB);
  }

  public void expandCollapseActionbar() {
    container.getExpandCollapseActionBar().click();
  }

  public void doubleClickDate(String date) {
    WebElement calendarDate = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarDate, date)));
    driver.doubleClick(calendarDate);
  }

  public void selectDateRange(String fromDate, String toDate) {
    WebElement fromDateCalendar = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarDate, fromDate)));
    fromDateCalendar.click();
    WebElement toDateCalendar = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarDate, toDate)));
    toDateCalendar.click();
  }

  public void selectPairing(String pairingName) {
    WebElement pairing = driver.getWebDriver().findElement(By.xpath(String.format(container.pairing, pairingName)));
    pairing.click();
  }

  public void clickEditName() {
    container.getPairingEditDropdown().click();
    container.getPairingEditNameItem().click();
  }

  public void closePairingToolbar() {
    container.getClosePairingToolbar().click();
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getPairingPageHeader() != null;
  }
}
