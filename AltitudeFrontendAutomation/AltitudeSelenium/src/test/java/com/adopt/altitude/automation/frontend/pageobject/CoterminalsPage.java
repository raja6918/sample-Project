package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.coterminal.Coterminal;
import com.adopt.altitude.automation.frontend.data.extraTime.ExtraTime;
import com.adopt.altitude.automation.frontend.pageobject.view.CoterminalsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
public class CoterminalsPage extends AbstractPage{

  /** The coterminals view. */
  @Autowired
  @Lazy(true)
  private CoterminalsView coterminalsView;

  /**
   * Open new coterminal drawer.
   */
  public void openNewCoterminalDrawer() {
    coterminalsView.clickNewCoterminalButton();
  }

  /**
   * Fill out add coterminal form.
   *
   * @param newCoterminal the new coterminal
   * @throws InterruptedException the interrupted exception
   */
  public void fillOutAddCoterminalForm(Coterminal newCoterminal) throws InterruptedException, AWTException {
    coterminalsView.selectDepartureStation(newCoterminal.getDepartureStation());
    coterminalsView.selectArrivalStation(newCoterminal.getArrivalStation());
    coterminalsView.setCoterminalName(newCoterminal.getTransportName());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.selectTransportType(newCoterminal.getTransportType());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setMaximumPassengers(newCoterminal.getMaximumPassengers());
    coterminalsView.setStartTime(newCoterminal.getTimingStart());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setEndTime(newCoterminal.getTimingEnd());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setTransportTime(newCoterminal.getTransportTime());
    coterminalsView.setConnnectionTimeBefore(newCoterminal.getConnectionTimeBefore());
    coterminalsView.setConnnectionTimeAfter(newCoterminal.getConnectionTimeAfter());
    coterminalsView.setTransportCost(newCoterminal.getCost());
    coterminalsView.selectCurrency(newCoterminal.getCurrency());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.selectCostBasis(newCoterminal.getCostBasis());
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setCostCredit(newCoterminal.getCreditCost());
    coterminalsView.selectCreditApplies(newCoterminal.getCreditAppliesTo());
    TimeUnit.SECONDS.sleep(1);
  }

  public void fillOutExtraTimes(ExtraTime extraTime,Integer index) throws InterruptedException {
    coterminalsView.clickAddExtraTimeButton();
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setExtraTime(extraTime.getExtraTime(), index);
    coterminalsView.setExtraTimeStartTime(extraTime.getExtraTimeStart(), index);
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.setExtraTimeEndTime(extraTime.getExtraTimeEnd(), index);
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Adds the new coterminal.
   */
  public void addNewCoterminal() {
    coterminalsView.clickAddButton();
  }

  /**
   * Gets the coterminal.
   *
   * @param name the name
   * @return the coterminal
   */
  public Coterminal getCoterminal(String name) {
    List<String> values = coterminalsView.getCoterminal(name);

    return mapCoterminal(values);
  }

  /**
   * Sets the coterminal name.
   *
   * @param name the coterminal name
   */
  public void setCoterminalName(String name) {
    coterminalsView.setCoterminalName(name);
  }

  /**
   * Sets the maximum passengers.
   *
   * @param capacity the maximum passengers
   */
  public void setMaximumPassengers(String capacity) {
    coterminalsView.setMaximumPassengers(capacity);
  }

  /**
   * Sets the transport time.
   *
   * @param time the transport time
   */
  public void setTransportTime(String time) {
    coterminalsView.setTransportTime(time);
  }

  /**
   * Sets the connection time before.
   *
   * @param time the connection time before
   */
  public void setConnectionTimeBefore(String time) {
    coterminalsView.setConnnectionTimeBefore(time);
  }

  /**
   * Sets the connection time after.
   *
   * @param time the connection time after
   */
  public void setConnectionTimeAfter(String time) {
    coterminalsView.setConnnectionTimeAfter(time);
  }

  /**
   * Sets the transport cost.
   *
   * @param cost the transport cost
   */
  public void setTransportCost(String cost) throws InterruptedException, AWTException {
    coterminalsView.setTransportCost(cost);
  }

  /**
   * Sets the credit cost.
   *
   * @param cost the credit cost
   */
  public void setCreditCost(String cost) {
    coterminalsView.setCostCredit(cost);
  }

  /**
   * Gets the error message.
   *
   * @return the error message
   */
  public String getErrorMessage() {
    return coterminalsView.getErrorMessage();
  }

  public void clickAddExtraTimeButton() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    coterminalsView.clickAddExtraTimeButton();
  }

  public void setExtraTime(String time) {
    coterminalsView.setExtraTime(time, 0);
  }

  public void verifyExtraTimeButtonDisabled() {
    Assert.assertFalse(coterminalsView.isExtraTimeButtonEnabled());
  }


  /**
   * Opens the edit window for the given coterminal
   * @param coterminalName
   */
  public void openEditCoterminalDrawer(String coterminalName) {
    coterminalsView.clickEditCoterminalButton(coterminalName);
  }

  /**
   * Sets the name.
   *
   * @param name the new name
   */
  public void setName(String name) {
    coterminalsView.setCoterminalName(name);
  }

  /**
   * Sets the type.
   *
   * @param type the new type
   */
  public void setType(String type) throws InterruptedException {
    coterminalsView.selectTransportType(type);
  }

  /**
   * Save coterminal.
   */
  public void saveCoterminal() {
    coterminalsView.clickSaveCoterminalButton();
  }

  /**
   * Sets the timing before.
   *
   * @param time the timing before
   */
  public void setTimingStart(String time) {
    coterminalsView.setStartTime(time);
  }

  /**
   * Sets the timing after.
   *
   * @param time the timing after
   */
  public void setTimingEnd(String time) {
    coterminalsView.setEndTime(time);
  }

  /**
   * Select currency.
   *
   * @param currency the currency
   * @throws InterruptedException the interrupted exception
   */
  public void selectCurrency(String currency) throws InterruptedException {
    coterminalsView.selectCurrency(currency);
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Select departure station.
   *
   * @param station the departure station
   * @throws InterruptedException the interrupted exception
   */
  public void selectDepartureStation(String station) throws InterruptedException {
    coterminalsView.selectDepartureStation(station);
    TimeUnit.SECONDS.sleep(1);
  }

  /**
   * Select arrival station.
   *
   * @param station the arrival station
   * @throws InterruptedException the interrupted exception
   */
  public void selectArrivalStation(String station) throws InterruptedException {
    coterminalsView.selectArrivalStation(station);
    TimeUnit.SECONDS.sleep(1);
  }

  public String getScenarioStatus() {
    return coterminalsView.getScenarioStatus();
  }

  public void  getCoterminalsCount() {
    dataCount = coterminalsView.getCoterminalsCount();
  }

  public void openDeleteCoterminal(String coterminal) {
    coterminalsView.openDeleteCoterminal(coterminal);
  }

  public void deleteCoterminalConfirmation() {

    coterminalsView.clickDeleteButton();
  }

  public String getSuccessMessage() {
    return coterminalsView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(coterminalsView.getNoSuccessMessage());
  }

  public void cancelDeleteCoterminal() {
    coterminalsView.clickCancelButton();
  }

  @Override public boolean isPageDisplayed() {
    return coterminalsView.isDisplayedCheck();
  }

  /**
   * Map coterminal.
   *
   * @param values the values
   * @return the coterminal
   */
  private Coterminal mapCoterminal(List<String> values) {
    Coterminal newCoterminal = new Coterminal();

    newCoterminal.setDepartureStation(values.get(0));
    newCoterminal.setArrivalStation(values.get(1));
    newCoterminal.setTransportName(values.get(2));
    newCoterminal.setTransportType(values.get(3));

    return newCoterminal;
  }
}
