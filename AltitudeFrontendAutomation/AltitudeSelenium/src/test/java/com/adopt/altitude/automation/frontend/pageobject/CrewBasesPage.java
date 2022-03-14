package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.crewBase.CrewBase;
import com.adopt.altitude.automation.frontend.pageobject.view.CrewBasesView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * This class holds all the actions that can be done on the Crew bases Page. It also contains validation methods to validate actions performed on the page
 */
@Component
public class CrewBasesPage extends AbstractPage {

  @Autowired
  @Lazy(true)
  private CrewBasesView crewBasesView;

  /**
   * Open the add crew bases form by clicking the '+' button
   */
  public void openAddCrewBasesForm() {
    crewBasesView.clickAddCrewBaseButton();
  }

  /**
   * Verify if the add crew base window is displayed or closed
   *
   * @param isDisplayed
   */
  public void verifyAddCrewBaseWindowDisplayed(Boolean isDisplayed) {
    if (isDisplayed)
      Assert.assertTrue(crewBasesView.isAddNewCrewBaseFormDislayed());
    else
      Assert.assertFalse(crewBasesView.isAddNewCrewBaseFormDislayed());
  }

  /**
   * Fill out the add crew base form with the given values
   *
   * @param crewBase The Crew base to be added
   */
  public void fillOutAddCrewBaseForm(CrewBase crewBase) throws InterruptedException {
    crewBasesView.setBaseCode(crewBase.getBaseCode());
    crewBasesView.setBaseName(crewBase.getBaseName());
    crewBasesView.selectCountry(crewBase.getCountry());
    crewBasesView.selectUnselectStation(crewBase.getStation(), true);
  }

  /**
   * Click add button to add a new crew base to the list
   */
  public void addCrewBase() {
    crewBasesView.clickAddButton();
  }

  /**
   * Gets the crew base.
   *
   * @param name the name
   * @return the crew base
   */
  public CrewBase getCrewBase(String name) {
    List<String> values = crewBasesView.getCrewBase(name);

    return mapCrewBase(values);
  }

  /**
   * Sets the name.
   *
   * @param name the name
   */
  public void setBaseName(String name) {
    crewBasesView.setBaseName(name);
  }

  public void setBaseCode(String code) {
    crewBasesView.setBaseCode(code);
  }

  /**
   * Sets the country.
   *
   * @param name the country
   */
  public void setCountry(String name) {
    crewBasesView.selectCountry(name);
  }

  /**
   * Sets the station.
   *
   * @param name the station
   */
  public void setStation(String name) throws InterruptedException {
    crewBasesView.selectUnselectStation(name, true);
  }

  /**
   * Un selects the station.
   *
   * @param name the station
   */
  public void unselectStation(String name) throws InterruptedException {
    crewBasesView.selectUnselectStation(name, false);
  }

  /**
   * Verify add button is Inactive if some mandatory fields are empty
   */
  public void verifyAddButtonInactive() {
    Assert.assertFalse(crewBasesView.isAddButtonEnabled());
  }

  /**
   * Get the error messages for invalid field values
   *
   * @return
   */
  public String getInvalidFieldErrorMessage() {
    return crewBasesView.getFieldErrorMessage();
  }

  /**
   * Click the delete button for specified crew base
   *
   * @param baseName
   */
  public void openDeleteCrewBaseForm(String baseName) {
    crewBasesView.clickDeleteCrewBaseButton(baseName);
  }

  /**
   * Click Delete Option in the delete confirmation dialog
   */
  public void deleteCrewBase() {
    crewBasesView.clickDeleteButton();
  }

  /**
   * Click the Edit button for specified crew base
   * @param crewBaseName
   */
  public void openEditCrewBaseDrawer(String crewBaseName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    crewBasesView.clickEditCrewBaseButton(crewBaseName);
  }

  /**
   * Save crew base.
   */
  public void saveCrewBase() {
    crewBasesView.clickSaveCrewBaseButton();
  }

  public String getScenarioStatus() {
    return crewBasesView.getScenarioStatus();
  }

  public void getCrewBasesCount() {
    dataCount = crewBasesView.getCrewBasesCount();
  }

  public void deleteCrewBaseConfirmation() {

    crewBasesView.clickDeleteButton();
  }

  public String getRefErrorMessage() {
    return crewBasesView.getRefErrorMessage();
  }

  public void clickRefErrorCloseButton() {
    crewBasesView.clickRefErrorCloseButton();
  }

  public String getSuccessMessage() {
    return crewBasesView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(crewBasesView.getNoSuccessMessage());
  }

  public void cancelDeleteCrewBase() {
    crewBasesView.clickCancelButton();
  }

  @Override public boolean isPageDisplayed() {
    return crewBasesView.isDisplayedCheck();
  }

  /**
   * Map crew base.
   *
   * @param values the values
   * @return the crew base
   */
  private CrewBase mapCrewBase(List<String> values) {
    CrewBase crewBase = new CrewBase();

    crewBase.setBaseName(values.get(0));
    crewBase.setCountry(values.get(1));
    crewBase.setStation(values.get(2));

    return crewBase;
  }
}
