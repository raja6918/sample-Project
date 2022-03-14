package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.aircraftType.AircraftType;
import com.adopt.altitude.automation.frontend.data.aircraftType.CrewComplement;
import com.adopt.altitude.automation.frontend.pageobject.view.AircraftTypesView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class AircraftTypesPage extends AbstractPage {

  @Autowired
  @Lazy(true)
  private AircraftTypesView aircraftTypesView;

  public void openAircraftModelsPage() {
    aircraftTypesView.clickAircraftModelLink();
  }

  public void openNewAircraftTypesDrawer() {
    aircraftTypesView.clickNewAircraftTypeButton();
  }

  public void fillInAircraftTypeForm(AircraftType aircraftType) throws InterruptedException {
    aircraftTypesView.setIataType(aircraftType.getIataType());
    aircraftTypesView.selectModel(aircraftType.getModel());
    aircraftTypesView.setName(aircraftType.getName());
    aircraftTypesView.selectRestFacility(aircraftType.getRestFacility());
  }

  public void fillInCrewComplementCount(CrewComplement crewComplement) throws InterruptedException {
    aircraftTypesView.setCrewComplement(crewComplement.getName(), crewComplement.getCount());
  }

  public void setName(String name) {
    aircraftTypesView.setName(name);
    aircraftTypesView.sendTabInName();
  }

  public void setType(String type) {
    aircraftTypesView.setIataType(type);
    aircraftTypesView.sendTabInType();
  }

  public void selectRestFacility(String restFacility) {
    aircraftTypesView.selectRestFacility(restFacility);
  }

  public void selectModel(String model) throws InterruptedException {
    aircraftTypesView.selectModel(model);
  }

  public void addAircraftType() {
    aircraftTypesView.clickAddAircraftTypeButton();
  }

  public AircraftType getAircraftType(String name) {
    return aircraftTypesView.getAircraftType(name);
  }

  public String getErrorMessage() {
    return aircraftTypesView.getErrorMessage();
  }

  public void openEditAircraftTypeDrawer(String aircraftTypeName) {
    aircraftTypesView.clickEditAircraftTypeButton(aircraftTypeName);
  }
  public void openDeleteAircraftTypeDrawer(String aircraftTypeName) throws InterruptedException {
    aircraftTypesView.clickDeleteAircraftTypeButton(aircraftTypeName);
  }
  public void deleteAircraftTypeConfirmation() {

    aircraftTypesView.clickDeleteButton();
  }
  public void cancelDeleteAircraftType() {

    aircraftTypesView.clickCancelButton();
  }

  public String getSuccessMessage() {
    return aircraftTypesView.getSuccessMessage();
  }
  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(aircraftTypesView.getNoSuccessMessage());
  }

  public void saveAircraftType() {
    aircraftTypesView.clickSaveAircraftTypeButton();
  }

  public void getAircraftTypesCount() throws InterruptedException {
    dataCount = aircraftTypesView.getAircraftTypesCount();
  }
  public void clickRefErrorCloseButton() {
    aircraftTypesView.clickRefErrorCloseButton();
  }

  @Override
  public boolean isPageDisplayed() {
    return aircraftTypesView.isDisplayedCheck();
  }
}
