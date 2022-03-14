package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.CoterminalsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class CoterminalsView.
 */
@Component
@Scope("prototype")
public class CoterminalsView extends AbstractPageView<CoterminalsPageContainer> {

  /**
   * Inits the.
   *
   * @throws Exception the exception
   */
  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), CoterminalsPageContainer.class);
  }

  /**
   * Click new coterminal button.
   */
  public void clickNewCoterminalButton() {
    driver.scrollToElement(container.getAddNewCoterminalButton());
    container.getAddNewCoterminalButton().click();
  }

  /**
   * Sets the coterminal name.
   *
   * @param name the new coterminal name
   */
  public void setCoterminalName(String name) {
    clearAndSetText(container.getTransportNameInput(), name);
    container.getTransportNameInput().sendKeys(Keys.TAB);
  }

  /**
   * Select departure station.
   *
   * @param station the station
   */
  public void selectDepartureStation(String station) {
    String stationCode = station.substring(0,3);
    clearAndSetText(container.getDepartureStationDropdown(),stationCode);
   // container.getDepartureStationDropdown().sendKeys(station);
    WebElement from_station = driver.getWebDriver().findElement(By.xpath(String.format(container.DEPARTURE_STATIONCODE, station)));
    from_station.click();
    container.getDepartureStationDropdown().sendKeys(Keys.TAB);
  }

  /**
   * Select arrival station.
   *
   * @param station the station
   */
  public void selectArrivalStation(String station) {
    String stationCode = station.substring(0,3);
   // container.getArrivalStationDropdown().sendKeys(station);
    clearAndSetText(container.getArrivalStationDropdown(),stationCode);
    WebElement to_station = driver.getWebDriver().findElement(By.xpath(String.format(container.ARRIVAL_STATIONCODE, station)));
    to_station.click();
    container.getArrivalStationDropdown().sendKeys(Keys.TAB);
  }

  /**
   * Select transport type.
   *
   * @param type the type
   */
  public void selectTransportType(String type) throws InterruptedException {
    container.getTransportTypeDropdown().click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.TRANSPORT_TYPE, type))).click();
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Sets the maximum passengers.
   *
   * @param capacity the maximum passengers
   */
  public void setMaximumPassengers(String capacity) {
    clearAndSetText(container.getMaximumPassengersInput(), capacity);
    container.getMaximumPassengersInput().sendKeys(Keys.TAB);
  }

  /**
   * Sets the start timing.
   *
   * @param time the start time of transport
   */
  public void setStartTime(String time) {
    container.getStartTimeInput().click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  /**
   * Sets the end timing.
   *
   * @param time the end time of transport
   */
  public void setEndTime(String time) {
    container.getEndTimeInput().click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  /**
   * Sets the transport time.
   *
   * @param time the transport time
   */
  public void setTransportTime(String time) {
    clearAndSetText(container.getTransportTimeInput(), time);
    container.getTransportTimeInput().sendKeys(Keys.TAB);
  }

  /**
   * Sets the minimum connection time before.
   *
   * @param time the minimum connection time before
   */
  public void setConnnectionTimeBefore(String time) {
    driver.scrollToElement(container.getConnectionTimeBeforeInput());
    clearAndSetText(container.getConnectionTimeBeforeInput(), time);
    container.getConnectionTimeBeforeInput().sendKeys(Keys.TAB);
  }

  /**
   * Sets the minimum connection time after.
   *
   * @param time the minimum connection time after
   */
  public void setConnnectionTimeAfter(String time) {
    driver.scrollToElement(container.getConnectionTimeAfterInput());
    clearAndSetText(container.getConnectionTimeAfterInput(), time);
    container.getConnectionTimeAfterInput().sendKeys(Keys.TAB);
  }

  /**
   * Sets the transport cost.
   *
   * @param cost the transport cost
   */
  public void setTransportCost(String cost) throws InterruptedException, AWTException {
    Robot rob = new Robot();
    clearAndSetText(container.getTransportCostInput(), cost);
    container.getTransportCostInput().sendKeys(Keys.TAB);

    rob.keyPress(KeyEvent.VK_TAB);
    rob.keyRelease(KeyEvent.VK_TAB);
    TimeUnit.SECONDS.sleep(1);

    rob.keyPress(KeyEvent.VK_TAB);
    rob.keyRelease(KeyEvent.VK_TAB);
    TimeUnit.SECONDS.sleep(1);

  }

  /**
   * Select currency.
   *
   * @param currency the currency
   */
  public void selectCurrency(String currency) throws InterruptedException {
    container.getCurrencyDropdown().click();
    TimeUnit.SECONDS.sleep(1);
    WebElement currencyItem =driver.getWebDriver().findElement(By.xpath(String.format(container.CURRENCY_ITEM, currency)));
    driver.jsClick(currencyItem);
  }

  /**
   * Select cost basis.
   *
   * @param costBasis the cost basis
   */
  public void selectCostBasis(String costBasis) {
    container.getCostBasisDropdown().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.COST_BASIS_ITEM, costBasis))).click();
  }

  /**
   * Sets the cost credit.
   *
   * @param costCredit the cost credit
   */
  public void setCostCredit(String costCredit) {
    clearAndSetText(container.getCreditCostInput(), costCredit);
    container.getCreditCostInput().sendKeys(Keys.TAB);
  }

  /**
   * Select credit applies.
   *
   * @param creditAppliesTo the cost basis
   */
  public void selectCreditApplies(String creditAppliesTo) {
    container.getCreditAppliedDropdown().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.CREDIT_APPLIES_ITEM, creditAppliesTo))).click();
  }

  /**
   * Click add button.
   */
  public void clickAddButton() {
    container.getAddButton().click();
  }

  /**
   * Gets the coterminal.
   *
   * @param name the name
   * @return the coterminal
   */
  public List<String> getCoterminal(String name) {
    List<WebElement> coterminalElements = driver.getWebDriver().findElements(By.xpath(String.format(container.COTERMINAL_XPATH, name)));

    return getCoterminalValues(coterminalElements);
  }

  /**
   * Gets the error message.
   *
   * @return the error message
   */
  public String getErrorMessage() {
    return container.getErrorMessage().getText();
  }

  public void clickAddExtraTimeButton() {
    driver.scrollToElement(container.getAddExtraTimeButton());
    container.getAddExtraTimeButton().click();
  }

  public void setExtraTime(String time, Integer index) {
    clearAndSetText(container.getExtraTimeInput().get(index), time);
    container.getExtraTimeInput().get(0).sendKeys(Keys.TAB);
  }

  public void setExtraTimeStartTime(String time, Integer index) {
    container.getExtraTimeStartTimeInput().get(index).click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  public void setExtraTimeEndTime(String time, Integer index) {
    container.getExtraTimeEndTimeInput().get(index).click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  public void clickDeleteExtraTimeButton(Integer index) {
    container.getExtraTimeDeleteButton().get(index).click();
  }

  public boolean isExtraTimeButtonEnabled() {
    if((container.getAddExtraTimeButton().getAttribute("class")).equals("disabled")) {
      return false;
    }
    else {
      return true;
    }
  }

  public void clickEditCoterminalButton(String name) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_COTERMINAL_XPATH, name)));

    editButton.click();
  }

  /**
   * Click save coterminal button.
   */
  public void clickSaveCoterminalButton() {
    container.getSaveButton().click();
  }

  public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public Integer getCoterminalsCount() {
    return container.getCoterminalsList().size();
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getAddNewCoterminalButton() != null && container.getCoterminalsPageHeader() != null;
  }

  /**
   * Select time.
   *
   * @param hour the hour
   * @param minute the minute
   */
  private void selectTime(String hour, String minute) {
    //Select an hour from calendar
    WebElement calendarHour = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_TIME, hour)));
    driver.clickAction(calendarHour);

    //Select minutes from calendar
    WebElement calendarMinute = driver.getWebDriver().findElement(By.xpath(String.format(container.CALENDAR_TIME, minute)));
    driver.clickAction(calendarMinute);

    //Click Ok button to set Date to the field
    container.getCalendarOkButton().click();
  }

  /**
   * Split time.
   *
   * @param time the time
   * @return the string[]
   */
  private String[] splitTime(String time) {
    return time.split(":");
  }

  /**
   * Gets the coterminal values.
   *
   * @param coterminalElements the coterminal elements
   * @return the coterminal values
   */
  private List<String> getCoterminalValues(List<WebElement> coterminalElements) {
    List<String> coterminalValues = new ArrayList<>();

    coterminalValues.add(coterminalElements.get(2).getText());
    coterminalValues.add(coterminalElements.get(3).getText());
    coterminalValues.add(coterminalElements.get(4).getText());
    coterminalValues.add(coterminalElements.get(5).getText());

    return coterminalValues;
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  public void openDeleteCoterminal(String coterminal) {
    WebElement coterminalDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_COTERMINAL_BUTTON, coterminal)));
    coterminalDeleteButton.click();
  }

  public void clickCancelButton() {
    container.getCancelButton().click();
  }

  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  public boolean getNoSuccessMessage(){
    if(driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'msg')]/span")).size()==0)
      return true;
    else
      return false;
  }
}
