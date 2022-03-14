package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.data.station.DstDateTime;
import com.adopt.altitude.automation.frontend.data.station.Station;
import com.adopt.altitude.automation.frontend.pageobject.containers.StationsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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

@Component
@Scope("prototype")
public class StationsView extends AbstractPageView<StationsPageContainer> {

   private final static Logger LOGGER = LogManager.getLogger(StationsView.class);

   @PostConstruct
   public void init() throws Exception {
      container = PageFactory.initElements(driver.getWebDriver(), StationsPageContainer.class);
   }

   public void clickAddStationButton() {
      container.getAddStationButton().click();
   }

   public boolean isAddNewStationFormDislayed() {
      return isElementVisible(container.getAddNewStationFormHeader());
   }

   public void setIataCode(String iataCode) {
      clearAndSetText(container.getIataCodeTextfield(), iataCode);
   }

  public void moveToStationField(String stnField)  throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement stationField= driver.getWebDriver().findElement(By.xpath(String.format(container.stationField, stnField)));

    driver.scrollToElement(stationField);
    TimeUnit.SECONDS.sleep(1);

  }

   public void setStationName(String stationName) {
      clearAndSetText(container.getStationNameTextfield(), stationName);
   }

   public void selectCountry(String country) {
     // container.getCountryDropdown().sendKeys(country);
     if(country.equals("")){
       System.out.println("Country is empty ...");
     }else {
       clearAndSetText(container.getCountryDropdown(), country);
       WebElement countryCode = driver.getWebDriver().findElement(By.xpath(String.format(container.countryCode, country)));
       driver.jsClick(countryCode);
       // container.getCountryDropdown().sendKeys(Keys.TAB);
     }
   }

   public void selectRegion(String region) throws InterruptedException {
     TimeUnit.SECONDS.sleep(1);
     driver.scrollToElement(container.getDstChangeDropdown());
     TimeUnit.SECONDS.sleep(1);
      container.getRegionDropdown().click();
      WebElement regionField = driver.getWebDriver().findElement(By.xpath(String.format(container.regionListItem, region)));
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), regionField);
      driver.jsClick(regionField);
     TimeUnit.SECONDS.sleep(2);
   }

   public void setLatitude(String latitude) {
      try {
        TimeUnit.SECONDS.sleep(1);
        driver.scrollToElement(container.getDstChangeDropdown());
        TimeUnit.SECONDS.sleep(1);
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }

      clearAndSetText(container.getLatitudeTextfield(), latitude);
   }

   public void setLongitude(String longitude) {
     try {
       TimeUnit.SECONDS.sleep(1);
     }
     catch (InterruptedException e) {
       e.printStackTrace();
     }
     clearAndSetText(container.getLongitudeTextField(), longitude);
   }

   public void selectTimeZone(String timeZone) throws InterruptedException {
     TimeUnit.SECONDS.sleep(1);
     driver.scrollToElement(container.getDstChangeDropdown());
     TimeUnit.SECONDS.sleep(2);
      if (!timeZone.isEmpty()) {
         container.getTimeZoneDropdown().click();
         TimeUnit.SECONDS.sleep(1);
         WebElement timeZoneField = driver.getWebDriver().findElement(By.xpath(String.format(container.listValue, timeZone)));
         CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), timeZoneField);
         driver.jsClick(timeZoneField);
      }

   }

   public void selectDstChange(String dstChange) throws InterruptedException {
      if (!dstChange.isEmpty()) {
         CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDstChangeDropdown());
         TimeUnit.SECONDS.sleep(1);
         container.getDstChangeDropdown().click();
         TimeUnit.SECONDS.sleep(1);
         WebElement dstChangeField = driver.getWebDriver().findElement(By.xpath(String.format(container.listValue, dstChange)));
         CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), dstChangeField);
         driver.jsClick(dstChangeField);
      }
   }

   public void setDstStartDate(DstDateTime startDate) throws InterruptedException {
      try {
        TimeUnit.SECONDS.sleep(1);
      }
      catch (InterruptedException e) {
        e.printStackTrace();
      }
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDstStartDateTimeTextField());
      TimeUnit.SECONDS.sleep(1);
      container.getDstStartDateTimeTextField().click();
      TimeUnit.SECONDS.sleep(1);
      selectDateFromCalendar(startDate.getYear(), startDate.getMonth(), startDate.getDay(), startDate.getHour(), startDate.getMinute());
   }

   public void setDstEndDate(DstDateTime endDate) throws InterruptedException {
     TimeUnit.SECONDS.sleep(2);
     driver.scrollToElement(container.getDstChangeDropdown());
     TimeUnit.SECONDS.sleep(2);
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDstEndDateTimeTextField());
      TimeUnit.SECONDS.sleep(1);
      container.getDstEndDateTimeTextField().click();
      TimeUnit.SECONDS.sleep(1);
      try {
         TimeUnit.SECONDS.sleep(2);
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }
      selectDateFromCalendar(endDate.getYear(), endDate.getMonth(), endDate.getDay(), endDate.getHour(), endDate.getMinute());
   }

   public void clickAddButton() throws InterruptedException {
      try {
         TimeUnit.SECONDS.sleep(2);
      }
      catch (InterruptedException e) {
         e.printStackTrace();
      }
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddButton());
      driver.jsClick(container.getAddButton());
     TimeUnit.SECONDS.sleep(2);
   }

   private void selectDateFromCalendar(String year, String month, String day, String hour, String minute) {
      // Select year from the calendar
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCalenderYearHeader());
      driver.jsClick(container.getCalenderYearHeader());
      WebElement calenderYear = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarYear, year)));
      driver.jsClick(calenderYear);

      // Click calendar month
      WebElement calenderMonth = container.getCalendarMonth();
      while (!(calenderMonth.getText().contains(month))) {
         container.getCalenderRightArrowButton().click();
      }

      // Select the calendar day
      WebElement calendarDay = driver.getWebDriver().findElement(By.xpath(String.format(container.calendarDay, day)));
      calendarDay.click();

      // Select an hour from calendar
      WebElement calendarHour = driver.getWebDriver().findElement(By.xpath(String.format(container.CalenderTimeValue, hour)));
      driver.clickAction(calendarHour);

      // Select minutes from calendar
      WebElement calendarMinute = driver.getWebDriver().findElement(By.xpath(String.format(container.CalenderTimeValue, minute)));
      driver.clickAction(calendarMinute);

      // Click Ok button to set Date to the
      container.getCalendarOkButton().click();
   }

   public boolean isStationDisplayed(String stationCode) {
      WebElement station = driver.getWebDriver().findElement(By.xpath(String.format(container.currentStations, stationCode)));
      if (station.isDisplayed()) {
         return true;
      }
      return false;
   }

   public boolean isAddButtonEnabled() {
      return container.getAddButton().isEnabled();
   }

   public String getFieldErrorMessage() {
      return container.getStationFormErrorMessage().getText();
   }

   public String getEndDateErrorMessage() {
      return container.getEndDateErrorText().getText();
   }

  public void clickDeleteStationButton(String stationCode) throws InterruptedException {
    WebElement countLocation = driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'TableFooter__FooterText')]"));
    String countText = countLocation.getText();
    String countValue = countText.replaceAll("[^,0-9]", "");
    LOGGER.info("Count: " + countValue);
    int countValueInInteger = Integer.parseInt(countValue);
    for (int i = 1; i <= countValueInInteger; i++) {
      WebElement Location = driver.getWebDriver().findElement(By.xpath("//tbody/tr[" + i + "]/td[2]"));
      driver.ScrollAction(Location);
      String LocationText = Location.getText();
      if (LocationText.equals(stationCode)) {
        WebElement stationDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.deleteStationButton, stationCode)));
        //driver.scrollToElement(stationDeleteButton);
        driver.jsClick(stationDeleteButton);
       // stationDeleteButton.click();
        break;
      } else {

      }
    }
  }

   public void clickDeleteButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
      driver.clickAction(container.getDeleteButton());
   }

  public void clickCancelButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCancelButton());
    driver.clickAction(container.getCancelButton());
  }

   public void clickEditStationButton(String stationName) throws InterruptedException {
     TimeUnit.SECONDS.sleep(2);
     driver.scrollToElement(container.getBtnDelete());
     TimeUnit.SECONDS.sleep(2);
      WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_STATION_XPATH, stationName)));
      editButton.click();
   }

   public void clickSaveButton() {
      container.getSaveButton().click();
   }

   public List<Station> getStationsList() {
      List<Station> stations = mapStations(container.getStationsTable());

      return stations;
   }

   public Station getStation(String stationName) {
      List<WebElement> stationRowValues = driver.getWebDriver().findElements(By.xpath(String.format(container.STATION_XPATH, stationName)));

      Station station = mapStation(stationRowValues);

      return station;
   }

   public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

   public String getStationsCount() throws InterruptedException {
     TimeUnit.SECONDS.sleep(1);
     String countText=container.getStationCount().getText();
     String countValue=countText.replaceAll("[^0-9]", "");
     return  countValue;
   }

   @Override
   public boolean isDisplayedCheck() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getStationsPageHeader());
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddStationButton());

      return container.getAddStationButton() != null && container.getStationsPageHeader() != null;
   }

   private List<Station> mapStations(List<WebElement> stationsValues) {
      List<Station> stations = new ArrayList<>();

      for (WebElement webElement : stationsValues) {
         stations.add(mapStation(webElement.findElements(By.xpath(".//td"))));
      }

      return stations;
   }

   private Station mapStation(List<WebElement> stationRowValues) {
      Station station = new Station();

      station.setIataCode(stationRowValues.get(1).getText());
      station.setStationName(stationRowValues.get(2).getText());
      station.setCountry(stationRowValues.get(3).getText());
      station.setRegion(stationRowValues.get(4).getText());
      station.setTimeZone(stationRowValues.get(5).getText());

      return station;
   }

  /**
   * Click filter.
   */
  public void clickFilter() throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Enter station.
   *
   * @param stationName the rate
   */
  public void enterStationName(String stationName) throws InterruptedException {
    clearAndSetText(container.getStationFilterName(), stationName);
    container.getStationFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
  }


  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  /**
   * Set terminal  Name.
   */
  public void setTerminalName(String name) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getTerminals());
    TimeUnit.SECONDS.sleep(2);
    clearAndSetText(container.getTerminals(), name);
    container.getTerminals().sendKeys(Keys.TAB);
  }

  /**
   * Click station link.
   */
  public void clickStationLink() throws InterruptedException {
    container.getStationLink().click();
    TimeUnit.SECONDS.sleep(1);
    container.getStationLink().click();

  }
}
