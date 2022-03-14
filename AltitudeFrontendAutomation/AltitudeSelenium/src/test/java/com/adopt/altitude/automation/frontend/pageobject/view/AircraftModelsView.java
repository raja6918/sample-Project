package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.data.aircraftModel.AircraftModel;
import com.adopt.altitude.automation.frontend.pageobject.containers.AircraftModelsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;

@Component
@Scope("prototype")
public class AircraftModelsView extends AbstractPageView<AircraftModelsPageContainer> {

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), AircraftModelsPageContainer.class);
  }

  public void clickNewAircraftModelButton() {
    container.getNewAircraftModelButton().click();
  }

  public void setName(String name) {
    clearAndSetText(container.getNameTextField(), name);
  }

  public void sendTabInName() {
    container.getNameTextField().sendKeys(Keys.TAB);
  }

  public void setCode(String code) {
    clearAndSetText(container.getCodeTextField(), code);
  }

  public void sendTabInCode() {
    container.getCodeTextField().sendKeys(Keys.TAB);
  }

  public String getErrorMessage() {
    return container.getErrorMessage().getText();
  }

  public void clickAddAircraftModelButton() {
    container.getAddAircraftModelButton().click();
  }

  public AircraftModel getAircraftModel(String name) {
    List<WebElement> aircraftModel = driver.getWebDriver().findElements(By.xpath(String.format(container.AIRCRAFT_MODEL_XPATH, name)));
    return mapAircraftModel(aircraftModel);
  }
  public void clickDeleteAircraftModelButton(String aircraftModelName) {
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_AIRCRAFT_MODEL_XPATH, aircraftModelName)));
    deleteButton.click();
  }
  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
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

  public String getDependancyErrorMessage() {
    return container.getDependancyErrorMessage().getText();
  }
  public void clickCloseButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.clickCloseButton());
    driver.clickAction(container.clickCloseButton());
  }


  public void clickEditAircraftModelButton(String aircraftModelName) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_AIRCRAFT_MODEL_XPATH, aircraftModelName)));
    editButton.click();
  }

  public void clickSaveAircraftModelButton() {
    container.getSaveAircraftModelButton().click();
  }

  private AircraftModel mapAircraftModel(List<WebElement> aircraftModelElement) {
    AircraftModel aircraftModel = new AircraftModel();

    aircraftModel.setCode(aircraftModelElement.get(1).getText());
    aircraftModel.setName(aircraftModelElement.get(2).getText());

    return aircraftModel;
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickBackToAircraftLink() {
     container.clickBackToAircraftLink().click();
  }
  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
  }

  @Override public boolean isDisplayedCheck() {
    return !container.getAircraftModelsPageHeader().getText().isEmpty() && container.getAircraftModelsPageHeader().isDisplayed();
  }
}
