package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.CrewBasesPageContainer;
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
public class CrewBasesView extends AbstractPageView<CrewBasesPageContainer> {

  private final static Logger LOGGER = LogManager.getLogger(CrewBasesView.class);

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), CrewBasesPageContainer.class);
  }

  /**
   * Click Add Button to open add a crew base form
   */
  public void clickAddCrewBaseButton() {
    container.getAddCrewBaseButton().click();
  }

  /**
   * Check if the form to add a new crew base opens up
   * @return
   */
  public boolean isAddNewCrewBaseFormDislayed() {
    return isElementVisible(container.getAddNewCrewBaseFormHeader());
  }

  public void setBaseCode(String baseCode) {
    if (container.getBaseCodeTextfield().isDisplayed()) {
      container.getBaseCodeTextfield().click();
      setText(container.getBaseCodeTextfield(), baseCode);
      container.getBaseNameTextfield().sendKeys(Keys.TAB);
    }
  }

  /**
   * Set a base name
   * @param baseName the base name
   */
  public void setBaseName(String baseName) {
    setText(container.getBaseNameTextfield(), baseName);
    container.getBaseNameTextfield().sendKeys(Keys.TAB);
  }

  /**
   * Select a country from the country dropdown
   * @param country country to be selected
   */
  public void selectCountry(String country) {
    container.getCountryDropdown().sendKeys(country);
    container.getCountryDropdown().sendKeys(Keys.TAB);
  }

  /**
   * Select or unselect an station from the station dropdown
   * @param station station to be selected
   * @param select the flag to select or unselect an Station
   */
  public void selectUnselectStation(String station, boolean select) throws InterruptedException {
    String stationCode = station.substring(0, 3);
    System.out.println(stationCode);
    //container.getStationsDropdownicon().click();
    TimeUnit.SECONDS.sleep(1);
    //container.getStationsDropdown().sendKeys(stationCode);
    clearAndSetText(container.getStationsDropdown(),stationCode);
    TimeUnit.SECONDS.sleep(1);
    WebElement stationElement = driver.getWebDriver().findElement(By.xpath(String.format(container.STATION_SERVED, station)));
    driver.jsClick(stationElement);

//    TimeUnit.SECONDS.sleep(1);
//    container.getStationDropdown().click();
//    TimeUnit.SECONDS.sleep(1);
//
//    WebElement stationElement = driver.getWebDriver().findElement(By.xpath(String.format(container.LIST_ITEM, station)));
//    Boolean isStationSelected = ((RemoteWebElement)stationElement).findElementByTagName("input").isSelected();
//
//    if(select && !isStationSelected) {
//      stationElement.click();
//    }
//    else if(!select && isStationSelected) {
//      stationElement.click();
//    }
//    container.getStationInvisiblePanel().click();
  }

  /**
   * Click Add button to add a new crew base
   */
  public void clickAddButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddButton());
    driver.jsClick(container.getAddButton());
  }

  /**
   * Check if the add button on the form is enabled
   * @return
   */
  public boolean isAddButtonEnabled() {
    return container.getAddButton().isEnabled();
  }

  /**
   * Gets the crew base.
   *
   * @param name the name
   * @return the crew base
   */
  public List<String> getCrewBase(String name) {
    List<WebElement> crewBaseElements = driver.getWebDriver().findElements(By.xpath(String.format(container.CREWBASE_XPATH, name)));

    return getCrewBaseValues(crewBaseElements);
  }

  /**
   * Get the Error messages in the crew base form
   * @return
   */
  public String getFieldErrorMessage() {
    return container.getCrewBaseFormErrorMessage().getText();
  }

  /**
   * Click delete button to delete a crew base
   * @param baseName the base name of crew base to be deleted
   */
  public void clickDeleteCrewBaseButton(String baseName) {
    WebElement crewBaseDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_CREWBASE_BUTTON, baseName)));
    crewBaseDeleteButton.click();
  }

  /**
   * Confirm the deletion of crew base
   */
  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  /**
   * Click edit button to edit a crew base
   * @param name the name of the crew base to be edited
   */
  public void clickEditCrewBaseButton(String name) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_CREWBASE_BUTTON, name)));

    editButton.click();
  }

  /**
   * Click save crew base button.
   */
  public void clickSaveCrewBaseButton() {
    driver.jsClick(container.getSaveButton());
  }

  public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public Integer getCrewBasesCount() {
    return container.getCrewBasesList().size();
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
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

  @Override public boolean isDisplayedCheck() {
     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCrewBasesPageHeader());
     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddCrewBaseButton());

    return container.getAddCrewBaseButton() != null && container.getCrewBasesPageHeader() != null;
  }

  /**
   * Gets the crew base values.
   *
   * @param crewBaseElements the crew base elements
   * @return the crew base values
   */
  private List<String> getCrewBaseValues(List<WebElement> crewBaseElements) {
    List<String> crewBaseValues = new ArrayList<>();

    crewBaseValues.add(crewBaseElements.get(1).getText());
    crewBaseValues.add(crewBaseElements.get(2).getText());
    crewBaseValues.add(crewBaseElements.get(3).getText());

    return crewBaseValues;
  }
}
