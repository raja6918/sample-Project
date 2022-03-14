package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.accommodation.Accommodation;
import com.adopt.altitude.automation.frontend.data.extraTime.ExtraTime;
import com.adopt.altitude.automation.frontend.pageobject.view.AccommodationsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class AccommodationsPage.
 */
@Component
public class AccommodationsPage extends AbstractPage {

   /** The accommodations view. */
   @Autowired
   @Lazy(true)
   private AccommodationsView accommodationsView;

   /* (non-Javadoc)
    * @see com.adopt.altitude.automation.frontend.pageobject.PageObject#isPageDisplayed()
    */
   @Override
   public boolean isPageDisplayed() {
      return accommodationsView.isDisplayedCheck();
   }

   /**
    * Open new accommodation drawer.
    */
   public void openNewAccommodationDrawer() {
      accommodationsView.clickNewAccommodationButton();
   }

   /**
    * Fill out add accommodation form.
    *
    * @param newAccommodation the new accommodation
    * @param check24hrBlock the check 24 hr block
    * @throws InterruptedException the interrupted exception
    */
   public void fillOutAddAccommodationForm(Accommodation newAccommodation, boolean check24hrBlock) throws InterruptedException {
      accommodationsView.setAccommodationName(newAccommodation.getName());
      accommodationsView.selectStation(newAccommodation.getStation());
      TimeUnit.SECONDS.sleep(1);
      accommodationsView.selectAccommodationType(newAccommodation.getType());
      TimeUnit.SECONDS.sleep(1);
      accommodationsView.setCapacity(newAccommodation.getCapacity());
      accommodationsView.setContractStartDate(newAccommodation.getContractStartDate());
      TimeUnit.SECONDS.sleep(1);
      accommodationsView.setContractEndDate(newAccommodation.getContractEndDate());
      TimeUnit.SECONDS.sleep(1);
      accommodationsView.setCost(newAccommodation.getCost());
      accommodationsView.selectCurrency(newAccommodation.getCurrency());
      TimeUnit.SECONDS.sleep(1);

      if (check24hrBlock) {
         accommodationsView.click24HourBlock();
      }
      else {
         accommodationsView.clickCheckInOut();
         accommodationsView.setCheckInTime(newAccommodation.getCheckInTime());
         TimeUnit.SECONDS.sleep(1);
         accommodationsView.setCheckOutTime(newAccommodation.getCheckOutTime());
         TimeUnit.SECONDS.sleep(1);
      }

      accommodationsView.setCostExtendendStay(newAccommodation.getCostExtendedStay());
      accommodationsView.clickExpandTransitTimeSection();
      accommodationsView.enterTransitTime(newAccommodation.getTransitTime());
      accommodationsView.enterTransitCost(newAccommodation.getTransitCost());
      accommodationsView.selectTransitCostCurrency(newAccommodation.getTransitCurrency());
      TimeUnit.SECONDS.sleep(1);
      accommodationsView.selectCostBasis(newAccommodation.getCostBasis());
      TimeUnit.SECONDS.sleep(1);
   }

   public void fillOutExtraTimes(ExtraTime extraTime,Integer index) throws InterruptedException {
     accommodationsView.clickAddExtraTimeButton();
     TimeUnit.SECONDS.sleep(1);
     accommodationsView.setExtraTime(extraTime.getExtraTime(), index);
     accommodationsView.setExtraTimeStartTime(extraTime.getExtraTimeStart(), index);
     TimeUnit.SECONDS.sleep(1);
     accommodationsView.setExtraTimeEndTime(extraTime.getExtraTimeEnd(), index);
     TimeUnit.SECONDS.sleep(1);
   }

   public void openEditAccommodationDrawer(String accommodationName) throws InterruptedException {
    accommodationsView.clickEditAccommodationButton(accommodationName);
    TimeUnit.SECONDS.sleep(1);
   }

   /**
    * Sets the name.
    *
    * @param name the new name
    */
   public void setName(String name) {
      accommodationsView.setAccommodationName(name);
   }

   /**
    * Sets the type.
    *
    * @param type the new type
    * @throws InterruptedException the interrupted exception
    */
   public void setType(String type) throws InterruptedException {
      accommodationsView.selectAccommodationType(type);
      TimeUnit.SECONDS.sleep(1);
   }
   /**
    * Sets the capacity.
    *
    * @param capacity the new capacity
    */
   public void setCapacity(String capacity) {
      accommodationsView.setCapacity(capacity);
   }

   /**
    * Sets the rate cost.
    *
    * @param cost the new rate cost
    */
   public void setRateCost(String cost) {
      accommodationsView.setCost(cost);
   }

   /**
    * Select currency.
    *
    * @param currency the currency
    * @throws InterruptedException the interrupted exception
    */
   public void selectCurrency(String currency) throws InterruptedException {
      accommodationsView.selectCurrency(currency);
      TimeUnit.SECONDS.sleep(1);
   }

   /**
    * Sets the cost extendend stay.
    *
    * @param costExtendedStay the new cost extendend stay
    */
   public void setCostExtendendStay(String costExtendedStay) {
      accommodationsView.setCostExtendendStay(costExtendedStay);
   }

   /**
    * Adds the new accommodation.
    */
   public void addNewAccommodation() {
      accommodationsView.clickAddButton();
   }

   /**
    * Save accommodation.
    */
   public void saveAccommodation() throws InterruptedException {
      accommodationsView.clickSaveAccommodationButton();
   }

   /**
    * Gets the accommodation.
    *
    * @param name the name
    * @return the accommodation
    */
   public Accommodation getAccommodation(String name) {
      List<String> values = accommodationsView.getAccommodation(name);

      return mapAccommodation(values);
   }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return accommodationsView.getErrorMessage();
   }

  /**
   * Selects an station for the accommodation
   * @param station
   * @throws InterruptedException
   */
   public void selectStation(String station) throws InterruptedException {
     accommodationsView.selectStation(station);
     TimeUnit.SECONDS.sleep(1);

   }

  /**
   * Sets the Transit time for accommodation
   * @param transitTime
   */
   public void setTransitTime(String transitTime) throws InterruptedException {
     accommodationsView.clickExpandTransitTimeSection();
     accommodationsView.enterTransitTime(transitTime);
   }

  /**
   * Sets the transit cost for accommodation
   * @param transitCost
   */
   public void setTransitCost(String transitCost) throws InterruptedException {
     accommodationsView.clickExpandTransitTimeSection();
     accommodationsView.enterTransitCost(transitCost);
   }

  /**
   * Expands the transit time section
   * @throws InterruptedException
   */
   public void clickExpandTransitTimeSection() throws InterruptedException {
     accommodationsView.clickExpandTransitTimeSection();
     TimeUnit.SECONDS.sleep(1);
   }

  /**
   * Click Add Extra time button
   */
  public void clickAddExtraTimeButton() throws InterruptedException {
     accommodationsView.clickAddExtraTimeButton();
   }

  /**
   * Sets the extra time for accommodation
   * @param time
   */
   public void setExtraTime(String time) {
    accommodationsView.setExtraTime(time, 0);
   }

  /**
   * Return the extra time button state
   */
  public boolean getExtraTimeButtonDisabled() {
    return accommodationsView.getExtraTimeButtonEnabled();
  }

  public String getScenarioStatus() {
    return accommodationsView.getScenarioStatus();
  }

  public void getAccommodationsCount() throws InterruptedException {
    dataCountForAccommodation = accommodationsView.getAccommodationsCount();
  }

   /**
    * Map accommodation.
    *
    * @param values the values
    * @return the accommodation
    */
   private Accommodation mapAccommodation(List<String> values) {
      Accommodation newAccommodation = new Accommodation();

      newAccommodation.setName(values.get(0));
      newAccommodation.setStation(values.get(1));
      newAccommodation.setType(values.get(2));
      String[] rateArray = values.get(3).split(" ");
      newAccommodation.setCost(rateArray[0]);
      newAccommodation.setCurrency(rateArray[1]);
      newAccommodation.setCapacity(values.get(4));

      return newAccommodation;
   }

  /**
   * Clicks the name.
   *
   */
  public void clickName() {
    accommodationsView.clickName();
  }

  public void openDeleteAccommodationDrawer(String accommodationName) throws InterruptedException {
    accommodationsView.clickDeleteAccommodationButton(accommodationName);
    TimeUnit.SECONDS.sleep(1);
  }

  public void deleteAccommodationConfirmation() throws InterruptedException {
    accommodationsView.clickDeleteButton();
  }
  public String getRefErrorMessage() {
    return accommodationsView.getRefErrorMessage();
  }

  public void clickRefErrorCloseButton() {
    accommodationsView.clickRefErrorCloseButton();
  }

  public String getSuccessMessage() {
    return accommodationsView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(accommodationsView.getNoSuccessMessage());
  }

  public void cancelDeleteAccommodation() {
    accommodationsView.clickCancelButton();
  }
}
