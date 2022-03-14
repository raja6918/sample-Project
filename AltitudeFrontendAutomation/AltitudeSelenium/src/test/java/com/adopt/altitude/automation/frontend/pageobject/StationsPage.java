package com.adopt.altitude.automation.frontend.pageobject;

import java.util.List;
import java.util.stream.Collectors;

import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.station.Station;
import com.adopt.altitude.automation.frontend.data.station.DstDateTime;
import com.adopt.altitude.automation.frontend.pageobject.view.StationsView;

/**
 * This class holds all the actions that can be done on the Stations Page. It also contains validation methods to
 * validate actions performed on the page
 */

@Component
public class StationsPage extends AbstractPage {

   @Autowired
   @Lazy(true)
   private StationsView stationsView;

   /**
    * Open the add stations form by clicking the '+' button
    */
   public void openAddStationsForm() {
      stationsView.clickAddStationButton();
   }

   /**
    * Verify if the add station window is displayed or closed
    *
    * @param isDisplayed
    */
   public void verifyAddStationWindowDisplayed(Boolean isDisplayed) {
      if (isDisplayed)
         Assert.assertTrue(stationsView.isAddNewStationFormDislayed());
      else
         Assert.assertFalse(stationsView.isAddNewStationFormDislayed());
   }

   /**
    * Fill out the add station form with the given values
    *
    * @param station
    */
   public void fillOutAddStationForm(Station station) throws InterruptedException {
      stationsView.setIataCode(station.getIataCode());
      stationsView.setStationName(station.getStationName());
      stationsView.selectCountry(station.getCountry());
      stationsView.selectRegion(station.getRegion());
      stationsView.setLatitude(station.getLatitude());
      stationsView.setLongitude(station.getLongitude());
      stationsView.selectTimeZone(station.getTimeZone());
      stationsView.selectDstChange(station.getDstChange());

      if (!station.getDstStartDate().isEmpty()) {
         stationsView.setDstStartDate(getDstDateTime(station.getDstStartDate()));
      }

      if (!station.getDstStartDate().isEmpty() && !station.getDstEndDate().isEmpty()) {
         stationsView.setDstEndDate(getDstDateTime(station.getDstEndDate()));
      }
   }

   /**
    * Click add button to add a new station to the list
    */
   public void addStation() throws InterruptedException {
      stationsView.clickAddButton();
   }

   /**
    * Check if the station is displayed in the list by station code
    *
    * @param stationCode
    * @return
    */
   public boolean isStationPresent(String stationCode) {
      return stationsView.isStationDisplayed(stationCode);
   }

   /**
    * Verify add button is Inactive if some mandatory fields are empty
    */
   public void verifyAddButtonInactive() {
      Assert.assertFalse(stationsView.isAddButtonEnabled());
   }

   /**
    * Get the error messages for invalid field values
    *
    * @return
    */
   public String getInvalidFieldErrorMessage() {
      return stationsView.getFieldErrorMessage();
   }

   /**
    * Get the error message for end date before start date
    *
    * @return
    */
   public String getEnddateErrorMessage() {
      return stationsView.getEndDateErrorMessage();
   }

   /**
    * Click the delete button for specified station
    *
    * @param stationCode
    */
   public void openDeleteStationForm(String stationCode) throws InterruptedException {
      stationsView.clickDeleteStationButton(stationCode);
   }

   public void openEditStationDrawer(String stationName) throws InterruptedException {
      stationsView.clickEditStationButton(stationName);
   }

   public void setName(String name) {
      stationsView.setStationName(name);
   }

   public void setCode(String code) {
      stationsView.setIataCode(code);
   }

   public void setCountry(String country) {
      stationsView.selectCountry(country);
   }

   public void setTimeZone(String timeZone) throws InterruptedException {
      stationsView.selectTimeZone(timeZone);
   }

   public List<String> getStationsName() {
      return stationsView.getStationsList().stream().map(a -> a.getStationName()).collect(Collectors.toList());
   }

   public Station getStation(String name) {
      return stationsView.getStation(name);
   }

   public void saveStation() {
      stationsView.clickSaveButton();
   }

   /**
    * Click Delete Option in the delete confirmation dialog
    */
   public void deleteStation() {
      stationsView.clickDeleteButton();
   }

  /**
   * Click Cancel Option in the delete confirmation dialog
   */
  public void cancelStation() {
    stationsView.clickCancelButton();
  }

   public String getScenarioStatus() {
     return stationsView.getScenarioStatus();
   }

   public void getStationsCount() throws InterruptedException {
     dataCountForSation = stationsView.getStationsCount();
   }

   @Override
   public boolean isPageDisplayed() {
      return stationsView.isDisplayedCheck();
   }

   private DstDateTime getDstDateTime(String dstStartDate) {
      DstDateTime dstDateTime = new DstDateTime();
      String[] dstArray = dstStartDate.split("T");
      String[] dstDate = dstArray[0].split("-");
      String[] dstTime = dstArray[1].split(":");

      dstDateTime.setYear(dstDate[0]);
      dstDateTime.setMonth(dstDate[1]);
      dstDateTime.setDay(dstDate[2]);
      dstDateTime.setHour(dstTime[0]);
      dstDateTime.setMinute(dstTime[1]);

      return dstDateTime;
   }

  /**
   * click filter.
   */
  public void getFilterClick() throws InterruptedException {
    stationsView.clickFilter();
  }

  /**
   * type stationName.
   *
   * @param stationName the code
   */
  public void enterStationName(String stationName) throws InterruptedException {
    stationsView.enterStationName(stationName);
  }
  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return stationsView.getSuccessMessage();
  }

  /**
   * Sets the newLatitude.
   *
   * @param newLatitude the new latitude
   */
  public void setNewLatitude(String newLatitude) {
    stationsView.setLatitude(newLatitude);
  }

  /**
   * Sets the newLongitude.
   *
   * @param newLongitude the new longitude
   */
  public void setNewLongitude(String newLongitude) {
    stationsView.setLongitude(newLongitude);
  }

  /**
   * Sets the newTimeZone.
   *
   * @param newTimeZone the new longitude
   */
  public void selectNewTimeZone(String newTimeZone) throws InterruptedException {
    stationsView.selectTimeZone(newTimeZone);
  }

  /**
   * Sets the newDSTChange.
   *
   * @param newDSTChange the new longitude
   */
  public void selectNewDSTChange(String newDSTChange) throws InterruptedException {
    stationsView.selectDstChange(newDSTChange);
  }

  /**
   * Sets the newTerminal.
   *
   * @param newTerminal the new longitude
   */
  public void selectNewTerminal(String newTerminal) throws InterruptedException {
    stationsView.setTerminalName(newTerminal);
  }

  /**
   * click the station link.
   */
  public void clickStationLink() throws InterruptedException {
    stationsView.clickStationLink();
  }

  /**
   * update DST END Date
   */
  public void updateDstEndDate(Station station) throws InterruptedException {
    stationsView.setDstEndDate(getDstDateTime(station.getDstEndDate()));
  }

  public void moveToStationField(String stnField) throws InterruptedException {
    stationsView.moveToStationField(stnField);
  }

}
