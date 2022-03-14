package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.aircraftModel.AircraftModel;
import com.adopt.altitude.automation.frontend.pageobject.view.AircraftModelsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class AircraftModelsPage extends AbstractPage {

  @Autowired
  @Lazy(true)
  private AircraftModelsView aircraftModelsView;

  public void openNewAircraftModelsDrawer() {
    aircraftModelsView.clickNewAircraftModelButton();
  }

  public void fillInAircraftModelForm(AircraftModel aircraftModel) {
    aircraftModelsView.setCode(aircraftModel.getCode());
    aircraftModelsView.setName(aircraftModel.getName());
  }

  public void setName(String name) {
    aircraftModelsView.setName(name);
    aircraftModelsView.sendTabInName();
  }

  public void setCode(String code) {
    aircraftModelsView.setCode(code);
    aircraftModelsView.sendTabInCode();
  }
  public void openDeleteAircraftModelDrawer(String aircraftModelName) {
    aircraftModelsView.clickDeleteAircraftModelButton(aircraftModelName);
  }
  public void deleteAircraftModelConfirmation() {

    aircraftModelsView.clickDeleteButton();
  }

  public void cancelDeleteAircraftModel() {

    aircraftModelsView.clickCancelButton();
  }
  public String getSuccessMessage() {
    return aircraftModelsView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(aircraftModelsView.getNoSuccessMessage());
  }
  public String getDependancyErrorMessage() {
    return aircraftModelsView.getDependancyErrorMessage();
  }
  public void closeButtonClick() {
    aircraftModelsView.clickCloseButton();
  }

  public void addAircraftModel() {
    aircraftModelsView.clickAddAircraftModelButton();
  }

  public AircraftModel getAircraftModel(String name) {
    return aircraftModelsView.getAircraftModel(name);
  }

  public String getErrorMessage() {
    return aircraftModelsView.getErrorMessage();
  }

  public void openEditAircraftModelDrawer(String aircraftModelName) {
    aircraftModelsView.clickEditAircraftModelButton(aircraftModelName);
  }

  public void saveAircraftModel() {
    aircraftModelsView.clickSaveAircraftModelButton();
  }

  public String getRefErrorMessage() {
    return aircraftModelsView.getRefErrorMessage();
  }

  public void clickBackToAircraftLink() {
     aircraftModelsView.clickBackToAircraftLink();
  }

  public void clickRefErrorCloseButton() {
    aircraftModelsView.clickRefErrorCloseButton();
  }

  @Override public boolean isPageDisplayed() {
    return aircraftModelsView.isDisplayedCheck();
  }
}
