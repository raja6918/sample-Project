package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.data.aircraftType.AircraftType;
import com.adopt.altitude.automation.frontend.pageobject.containers.AircraftTypesPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class AircraftTypesView extends AbstractPageView<AircraftTypesPageContainer> {

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), AircraftTypesPageContainer.class);
  }

  public void clickAircraftModelLink() {
    container.getAircraftModelsPageLink().click();
  }

  public void clickNewAircraftTypeButton() {
    container.getNewAircraftTypeButton().click();
  }

  public void setName(String name) {
    clearAndSetText(container.getNameTextField(), name);
  }

  public void sendTabInName() {
    container.getNameTextField().sendKeys(Keys.TAB);
  }

  public void setIataType(String type) {clearAndSetText(container.getIataTypeTextField(), type); }

  public void sendTabInType() {
    container.getIataTypeTextField().sendKeys(Keys.TAB);
  }

  public void selectModel(String model) throws InterruptedException {
    container.getAircraftModelDropdown().click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.ITEM_SERVED_XPATH, model))).click();
    if(container.getModelSelect().getText().equals(model))
    {
      System.out.println("OK Model");
    }
    else
    {
      container.getAircraftModelDropdown().click();
      TimeUnit.SECONDS.sleep(1);
      driver.getWebDriver().findElement(By.xpath(String.format(container.ITEM_SERVED_XPATH, model))).click();
    }
  }

  public void selectRestFacility(String restFacility) {
    container.getRestFacilityDropdown().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.ITEM_SERVED_XPATH, restFacility))).click();
  }

  public void setCrewComplement(String name, int count) throws InterruptedException {
    driver.scrollToElement(container.getStandardCrewComplement());
    TimeUnit.SECONDS.sleep(1);
    WebElement crewComplement = driver.getWebDriver().findElement(By.xpath(String.format(container.CREW_COMPLEMENT_XPATH, name)));
    TimeUnit.SECONDS.sleep(1);
    crewComplement.click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.ITEM_SERVED_XPATH, count))).click();
  }

  public String getErrorMessage() {
    return container.getErrorMessage().getText();
  }

  public void clickAddAircraftTypeButton() {
    container.getAddAircraftTypeButton().click();
  }

  public AircraftType getAircraftType(String name) {
    List<WebElement> aircraftType = driver.getWebDriver().findElements(By.xpath(String.format(container.AIRCRAFT_TYPE_XPATH, name)));
    return mapAircraftType(aircraftType);
  }

  public void clickEditAircraftTypeButton(String aircraftTypeName) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_AIRCRAFT_TYPE_XPATH, aircraftTypeName)));
    editButton.click();
  }
  public void clickDeleteAircraftTypeButton(String aircraftTypeName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getBtnDelete());
    TimeUnit.SECONDS.sleep(2);
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_AIRCRAFT_TYPE_XPATH, aircraftTypeName)));
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

  public void clickSaveAircraftTypeButton() {
    container.getSaveAircraftTypeButton().click();
  }

  public Integer getAircraftTypesCount() {
    return container.getAircraftTypesList().size();
  }

  private AircraftType mapAircraftType(List<WebElement> aircraftTypeElement) {
    AircraftType aircraftType = new AircraftType();

    aircraftType.setIataType(aircraftTypeElement.get(1).getText());
    aircraftType.setModel(aircraftTypeElement.get(2).getText());
    aircraftType.setName(aircraftTypeElement.get(3).getText());
    aircraftType.setRestFacility(aircraftTypeElement.get(4).getText());

    return aircraftType;
  }

  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
  }

  @Override
  public boolean isDisplayedCheck() {
    return !container.getAircraftTypesPageHeader().getText().isEmpty() && container.getAircraftTypesPageHeader().isDisplayed();
  }
}
