package com.adopt.altitude.automation.frontend.pageobject.view;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.pageobject.containers.RegionsPageContainer;

/**
 * The Class RegionsView.
 */
@Component
@Scope("prototype")
public class RegionsView extends AbstractPageView<RegionsPageContainer>{

   /**
    * Inits the web elements.
    *
    * @throws Exception the exception
    */
   @PostConstruct
   public void init() throws Exception {
     container = PageFactory.initElements(driver.getWebDriver(), RegionsPageContainer.class);
   }

   /**
    * Click add new region.
    */
   public void clickAddNewRegion() {
      container.getAddNewRegionButton().click();
   }

   /**
    * Enter code.
    *
    * @param code the code
    */
   public void enterCode(String code) {
      clearAndSetText(container.getCodeInput(), code);
   }

   /**
    * Enter name.
    *
    * @param name the name
    */
   public void enterName(String name) {
      clearAndSetText(container.getNameInput(), name);
      container.getNameInput().sendKeys(Keys.TAB);
   }

   /**
    * Click add.
    */
   public void clickAdd() {
      container.getAddRegionButton().click();
   }

  /**
   * Click region link.
   */
  public void clickRegionLink() throws InterruptedException {
    container.getRegionLink().click();
    TimeUnit.SECONDS.sleep(1);
    container.getRegionLink().click();
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

   /**
    * Gets the region.
    *
    * @param name the name
    * @return the region
    */
   public List<String> getRegion(String name) {
      List<WebElement> regionElements = driver.getWebDriver().findElements(By.xpath(String.format(container.REGION_XPATH, name)));

      return getRegionValues(regionElements);
   }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return container.getErrorMessage().getText();
   }

   /**
    * Click edit region button.
    *
    * @param name the name
    */
   public void clickEditRegionButton(String name) {
      WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_REGION_XPATH, name)));

      editButton.click();
   }

  public void clickDeleteRegionButton(String regionCode) {
    WebElement regionDeleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.deleteRegionButton, regionCode)));
    regionDeleteButton.click();
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

   /**
    * Click save.
    */
   public void clickSave() {
      container.getSaveRegionButton().click();
   }

   public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public String getRegionsCount() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String countText=container.getRegionCount().getText();
    String countValue=countText.replaceAll("[^0-9]", "");
    return  countValue;
  }

   /**
    * Gets the region values.
    *
    * @param regionElements the region elements
    * @return the region values
    */
   private List<String> getRegionValues(List<WebElement> regionElements) {
      List<String> regionValues = new ArrayList<>();

      regionValues.add(regionElements.get(1).getText());
      regionValues.add(regionElements.get(2).getText());

      return regionValues;
   }

  public void clickCancelButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCancelButton());
    driver.clickAction(container.getCancelButton());
  }

   @Override
   public boolean isDisplayedCheck() {
      return !container.getRegionsPageHeader().getText().isEmpty();
   }

}
