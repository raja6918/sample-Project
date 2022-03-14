package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.AccommodationsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class AccommodationsView.
 */
@Component
@Scope("prototype")
public class AccommodationsView extends AbstractPageView<AccommodationsPageContainer> {

   /**
    * Inits the.
    *
    * @throws Exception the exception
    */
   @PostConstruct
   public void init() throws Exception {
     container = PageFactory.initElements(driver.getWebDriver(), AccommodationsPageContainer.class);
   }

   /**
    * Click new accommodation button.
    */
   public void clickNewAccommodationButton() {
      container.getAddNewAccommodationButton().click();
   }

   /**
    * Sets the accommodation name.
    *
    * @param name the new accommodation name
    */
   public void setAccommodationName(String name) {
      clearAndSetText(container.getNameInput(), name);
      container.getNameInput().sendKeys(Keys.TAB);
   }

   /**
    * Select station.
    *
    * @param station the station
    */
   public void selectStation(String station) throws InterruptedException {
     String Stationcode = station.substring(0, 3);
     System.out.println(Stationcode);
     container.getStationsDropdownicon().click();
     TimeUnit.SECONDS.sleep(1);
     container.getStationsDropdown().sendKeys(Stationcode);
     TimeUnit.SECONDS.sleep(1);
     WebElement stationElement = driver.getWebDriver().findElement(By.xpath(String.format(container.STATION_SERVED, station)));
     driver.jsClick(stationElement);
     TimeUnit.SECONDS.sleep(2);
     driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'FormHeader')]")).click();
     //container.getStationInvisiblePanel().click();
   }

   /**
    * Select accommodation type.
    *
    * @param type the type
    */
   public void selectAccommodationType(String type) {
      container.getAccommodationTypeDropdown().click();
      driver.getWebDriver().findElement(By.xpath(String.format(container.ACCOMMODATION_TYPE, type))).click();
   }

   /**
    * Sets the capacity.
    *
    * @param capacity the new capacity
    */
   public void setCapacity(String capacity) {
      clearAndSetText(container.getCapacityInput(), capacity);
      container.getCapacityInput().sendKeys(Keys.TAB);
   }

   /**
    * Sets the contract start date.
    *
    * @param date the new contract start date
    */
   public void setContractStartDate(String date) {
      container.getStartDateInput().click();
      String[] dateArray = splitDate(date);

      selectDateFromCalendar(dateArray[2], dateArray[0], dateArray[1]);
   }

   /**
    * Sets the contract end date.
    *
    * @param date the new contract end date
    */
   public void setContractEndDate(String date) {
      container.getEndDateInput().click();
      String[] dateArray = splitDate(date);

      selectDateFromCalendar(dateArray[2], dateArray[0], dateArray[1]);
   }

   /**
    * Sets the cost.
    *
    * @param cost the new cost
    */
   public void setCost(String cost) {
      clearAndSetText(container.getCostInput(), cost);
      container.getCostInput().sendKeys(Keys.TAB);
   }

   /**
    * Select currency.
    *
    * @param currency the currency
    */
   public void selectCurrency(String currency) throws InterruptedException {
      container.getCurrencyDropdown().click();
      TimeUnit.SECONDS.sleep(1);
      driver.getWebDriver().findElement(By.xpath(String.format(container.CURRENCY_ITEM, currency))).click();
   }

   /**
    * Click 24 hour block.
    */
   public void click24HourBlock() {
      container.getHourBlockRadioInput().click();
   }

   /**
    * Click check in out.
    */
   public void clickCheckInOut() {
     driver.scrollToElement(container.getCheckInOutRadioInput());
      container.getCheckInOutRadioInput().click();
   }

   /**
    * Sets the check in time.
    *
    * @param time the new check in time
    */
   public void setCheckInTime(String time) {
      container.getCheckInInput().click();
      String[] timeArray = splitTime(time);

      selectTime(timeArray[0], timeArray[1]);
   }

   /**
    * Sets the check out time.
    *
    * @param time the new check out time
    */
   public void setCheckOutTime(String time) {
      container.getCheckOutInput().click();
      String[] timeArray = splitTime(time);

      selectTime(timeArray[0], timeArray[1]);
   }

   /**
    * Sets the cost extendend stay.
    *
    * @param cost the new cost extendend stay
    */
   public void setCostExtendendStay(String cost) {
      clearAndSetText(container.getCostExtendedStayInput(), cost);
      container.getCostExtendedStayInput().sendKeys(Keys.TAB);
   }

   /**
    * Click add button.
    */
   public void clickAddButton() {
      container.getAddButton().click();
   }

   /**
    * Click edit accommodation button.
    *
    * @param name the name
    */
   public void clickEditAccommodationButton(String name) {
      WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_ACCOMMODATION_XPATH, name)));
      driver.jsClick(editButton);
     // editButton.click();
   }

   /**
    * Click save accommodation button.
    */
   public void clickSaveAccommodationButton() throws InterruptedException {
     TimeUnit.SECONDS.sleep(2);
     container.getSaveButton().click();
     TimeUnit.SECONDS.sleep(2);
   }

   /**
    * Click cancel button.
    */
   public void clickCancelButton() {
      container.getCancelButton().click();
   }

   /**
    * Gets the accommodation.
    *
    * @param name the name
    * @return the accommodation
    */
   public List<String> getAccommodation(String name) {
      List<WebElement> accommodationElements = driver.getWebDriver().findElements(By.xpath(String.format(container.ACCOMMODATION_XPATH, name)));

      return getAccommodationValues(accommodationElements);
   }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return container.getErrorMessage().getText();
   }

  /**
   * Click button to expand transit time section
   */
  public void clickExpandTransitTimeSection() throws InterruptedException {
    driver.scrollToElement(container.getStationTransitExpandButton());
    TimeUnit.SECONDS.sleep(1);
     container.getStationTransitExpandButton().click();
   }

  /**
   * Enter the transit time for accommodation
   * @param minutes
   */
   public void enterTransitTime(String minutes) {
     clearAndSetText(container.getTransitTimeInput(), minutes);
     container.getTransitTimeInput().sendKeys(Keys.TAB);
   }

  /**
   * Enter the transit cost for an accommodation
   * @param cost
   */
  public void enterTransitCost(String cost) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    clearAndSetText(container.getTransitCostInput(), cost);
    TimeUnit.SECONDS.sleep(2);
    container.getTransitCostInput().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getTransitCostBasisDropdown());
    TimeUnit.SECONDS.sleep(2);
  }

  /**
   * Select the currency for transit cost
   * @param currency
   */
  public void selectTransitCostCurrency(String currency) throws InterruptedException {
    container.getTransitCurrencyDropdown().click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.TRANSIT_CURRENCY_ITEM, currency))).click();
  }

  /**
   * Select the Cost basis
   * @param costBasis
   */
  public void selectCostBasis(String costBasis) {
    container.getTransitCostBasisDropdown().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.COST_BASIS_ITEM, costBasis))).click();
  }

  /**
   * Click Add Extra time button
   */
  public void clickAddExtraTimeButton() throws InterruptedException {
    driver.scrollToElement(container.getAddExtraTimeButton());
    TimeUnit.SECONDS.sleep(2);
    container.getAddExtraTimeButton().click();
  }

  /**
   * Set the extra time
   * @param time
   * @param index
   */
  public void setExtraTime(String time, Integer index) {
    clearAndSetText(container.getExtraTimeInput().get(index), time);
    container.getExtraTimeInput().get(0).sendKeys(Keys.TAB);
  }

  /**
   * Set the start time for Extra time
   * @param time
   * @param index
   */
  public void setExtraTimeStartTime(String time, Integer index) {
    container.getExtraTimeStartTimeInput().get(index).click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  /**
   * Set the end time for extra time
   * @param time
   * @param index
   */
  public void setExtraTimeEndTime(String time, Integer index) {
    container.getExtraTimeEndTimeInput().get(index).click();
    String[] timeArray = splitTime(time);

    selectTime(timeArray[0], timeArray[1]);
  }

  /**
   * Click delete button to delete an added extra time
   * @param index
   */
  public void clickDeleteExtraTimeButton(Integer index) {
    container.getExtraTimeDeleteButton().get(index).click();
  }

  /**
   * Check if Extra time button is enabled
   * @return
   */
  public boolean getExtraTimeButtonEnabled() {
    if((container.getAddExtraTimeButton().getAttribute("class")).equals("disabled")) {
      return false;
    }
    else {
      return true;
    }
  }

  public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public String getAccommodationsCount() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String countText=container.getAccomodationCount().getText();
    String countValue=countText.replaceAll("[^0-9]", "");
    return  countValue;
  }

   @Override
   public boolean isDisplayedCheck() {
      return container.getAddNewAccommodationButton() != null && container.getAccommodationsPageHeader() != null;
   }

   /**
    * Gets the accommodation values.
    *
    * @param accommodationElements the accommodation elements
    * @return the accommodation values
    */
   private List<String> getAccommodationValues(List<WebElement> accommodationElements) {
      List<String> accommodationValues = new ArrayList<>();

      accommodationValues.add(accommodationElements.get(1).getText());
      accommodationValues.add(accommodationElements.get(2).getText());
      accommodationValues.add(accommodationElements.get(3).getText());
      accommodationValues.add(accommodationElements.get(4).getText());
      accommodationValues.add(accommodationElements.get(5).getText());

      return accommodationValues;
   }

   /**
    * Select date from calendar.
    *
    * @param year the year
    * @param month the month
    * @param day the day
    */
   private void selectDateFromCalendar(String year, String month, String day) {
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

      container.getCalendarOkButton().click();
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
    * Split date.
    *
    * @param date the date
    * @return the string[]
    */
   private String[] splitDate(String date) {
      return date.split("-");
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
   * Click name for sort.
   */
  public void clickName() {
    container.getName().click();
  }

  public void clickDeleteAccommodationButton(String name) {
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_ACCOMMODATION_XPATH, name)));
    driver.ScrollAction(deleteButton);
    deleteButton.click();
  }

  public void clickDeleteButton() throws InterruptedException {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
    TimeUnit.SECONDS.sleep(1);
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
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
