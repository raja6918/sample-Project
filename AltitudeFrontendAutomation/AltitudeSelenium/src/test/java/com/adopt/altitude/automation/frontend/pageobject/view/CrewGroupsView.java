package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.CrewGroupsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
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

/**
 * The Class CrewGroupsView.
 */
@Component
@Scope("prototype")
public class CrewGroupsView extends AbstractPageView<CrewGroupsPageContainer> {

  /**
   * Inits the.
   *
   * @throws Exception the exception
   */
  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), CrewGroupsPageContainer.class);
  }

  /**
   * Click new Crew Group button.
   */
  public void clickNewCrewGroupsButton() {
    container.getAddNewCrewGroupsButton().click();
  }

  /**
   * Set Crew Group Name.
   */
  public void setCrewGroupName(String name) {
    clearAndSetText(container.getCrewGroupsName(), name);
    container.getCrewGroupsName().sendKeys(Keys.TAB);
  }


  public void setCrewGroupName1(String name) {
    clearAndSetText(container.getCrewGroupsName(), name);
    container.getCrewGroupsName().sendKeys(Keys.TAB);
  }

  /**
   * Select Crew Group Position.
   */
  public void selectCrewGroupPosition(String position) throws InterruptedException {
    container.getCrewGroupsPosition().click();TimeUnit.SECONDS.sleep(2);
    WebElement positionValueElement = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.CREW_GROUPS_VALUE, position)));
    positionValueElement.click();
    TimeUnit.SECONDS.sleep(2);
    container.getCrewGroupFormAddButton().click();
  }

  /**
   * Select Crew Group Airline.
   */
  public void selectCrewGroupAirline(String airline) throws InterruptedException {
    container.getCrewGroupsAirline().click();
    WebElement airlineValueElement = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.CREW_GROUPS_VALUE, airline)));
    airlineValueElement.click();
    TimeUnit.SECONDS.sleep(2);
    container.getCrewGroupFormAddButton().click();
  }

  /**
   * Select Crew Group AircraftType.
   */
  public void selectCrewGroupAircraftType(String aircraftType) throws InterruptedException {
    container.getCrewGroupsAircraftType().click();
    WebElement aircraftTypeValueElement = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.CREW_GROUPS_VALUE, aircraftType)));
    aircraftTypeValueElement.click();
    TimeUnit.SECONDS.sleep(1);
    container.getCrewGroupFormAddButton().click();
      }

  /**
   * Select Crew Group Default Rule Set.
   */
  public void selectCrewGroupDefaultRuleSet(String defaultRuleSet) throws InterruptedException {
    container.getCrewGroupsDefaultRuleSet().click();
    TimeUnit.SECONDS.sleep(1);
    WebElement defaultRuleSetValue = driver.getWebDriver().findElement(By.xpath(String.format(container.DEFAULT_RULE_SET_VALUE, defaultRuleSet)));
    defaultRuleSetValue.click();
  }

  /**
   * Click save Crew Group button.
   */
  public void clickAddButton() throws InterruptedException{
    TimeUnit.SECONDS.sleep(1);
    container.getCrewGroupsAddButton().click();
  }

  public void clickSaveButton() throws InterruptedException{
    TimeUnit.SECONDS.sleep(1);
    container.getCrewGroupSaveButton().click();
  }

  /**
   * Gets the crew group.
   *
   * @param name the name
   * @return the crew group
   */
  public List<String> getCrewGroup(String name) {
    List<WebElement> crewGroupsElements = driver.getWebDriver().findElements(By.xpath(String.format(container.CREW_GROUPS_XPATH, name)));

    return getCrewGroupsValues(crewGroupsElements);
  }

  /**
   * Gets the crew groups values.
   *
   * @param crewGroupsElements the crew groups elements
   * @return the crew groups values
   */
  private List<String> getCrewGroupsValues(List<WebElement> crewGroupsElements) {
    List<String> crewGroupsValues = new ArrayList<>();

    crewGroupsValues.add(crewGroupsElements.get(1).getText());
    crewGroupsValues.add(crewGroupsElements.get(2).getText());
    crewGroupsValues.add(crewGroupsElements.get(3).getText());
    crewGroupsValues.add(crewGroupsElements.get(4).getText());
    crewGroupsValues.add(crewGroupsElements.get(5).getText());

    return crewGroupsValues;
  }

  /**
   * Get the Error messages in the crew group form after clicking on save botton
   * @return
   */
  public String getFieldErrorMessage() {
    return container.getCrewGroupFormErrorMessage().getText();
  }

  /**
   * Gets the error message.
   *
   * @return the error message
   */
  public String getErrorMessage() {
    return container.getErrorMessage().getText();
  }


  @Override
  public boolean isDisplayedCheck() {
    return container.getAddNewCrewGroupsButton() != null && container.getCrewGroupsPageHeader() != null;
  }

  /**
   * Click filter.
   */
  public void clickFilter() throws InterruptedException {
    container.getClickFilter().click();
    TimeUnit.SECONDS.sleep(1);
  }


  /**
   * Enter crewgroupName.
   *
   * @param crewgroupName the rate
   */
  public void enterCrewgroupName(String crewgroupName) throws InterruptedException {
    clearAndSetText(container.getCrewGroupFilterName(), crewgroupName);
    container.getCrewGroupFilterName().sendKeys(Keys.TAB);
    TimeUnit.SECONDS.sleep(1);
  }

  public void setNewCrewGroupName(String newcrewgroup) {
    clearAndSetText(container.getCrewGroupsName(), newcrewgroup);
  }

  public void clickEditCrewGroupButton(String oldName) {
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_CREW_GROUPS_XPATH, oldName)));
    editButton.click();
  }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  public void getSelectAll() {
     container.getSelectAll().click();
  }

  /**
   * Select Crew Group Airline.
   */
  public void selectAllCrewGroupAirline() throws InterruptedException {
    container.getCrewGroupsAirline().click();
    TimeUnit.SECONDS.sleep(2);
    container.getSelectAll().click();
    TimeUnit.SECONDS.sleep(2);
    container.getCrewGroupsAddButton().click();
    TimeUnit.SECONDS.sleep(2);
  }

  /**
   * Select Crew Group Aircraft Type(s).
   */
  public void selectAllCrewGroupAircraft() throws InterruptedException {
    container.getCrewGroupsAircraftType().click();
    TimeUnit.SECONDS.sleep(2);
    container.getSelectAll().click();
    TimeUnit.SECONDS.sleep(2);
    container.getCrewGroupsAddButton().click();
    TimeUnit.SECONDS.sleep(2);
  }

  /**
   * Select Crew Group Position(s).
   */
  public void selectAllPositions() throws InterruptedException {
    container.getCrewGroupsPosition().click();
    TimeUnit.SECONDS.sleep(2);
    container.getClearAll().click();
    TimeUnit.SECONDS.sleep(2);
    container.getFlightDeck().click();
    TimeUnit.SECONDS.sleep(2);
    container.getCabinCrew().click();
    TimeUnit.SECONDS.sleep(2);
    container.getCrewGroupsAddButton().click();
    TimeUnit.SECONDS.sleep(2);
  }

  public void openDeleteCrewgroupDrawer(String aircraftTypeName) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getDefaultRuleSet());
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getFilter_list());
    TimeUnit.SECONDS.sleep(2);

    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_CREWGROUP_XPATH, aircraftTypeName)));
    driver.jsClick(deleteButton);
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  public void clickCancelButton() {
    container.getCancelButton().click();
  }

  public boolean getNoSuccessMessage(){
    if(driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'msg')]/span")).size()==0)
      return true;
    else
      return false;
  }

  public void clickCrewGroupLeftpanelIcon()
  {
    container.clickCrewGroupLeftpanelIcon().click();
  }

}
