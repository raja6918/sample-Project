package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.data.position.Position;
import com.adopt.altitude.automation.frontend.pageobject.containers.PositionsPageContainer;
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

/**
 * The Class PositionsView.
 */
@Component
@Scope("prototype")
public class PositionsView extends AbstractPageView<PositionsPageContainer> {

   /**
    * Inits Web Elements
    *
    * @throws Exception the exception
    */
   @PostConstruct
   public void init() throws Exception {
     container = PageFactory.initElements(driver.getWebDriver(), PositionsPageContainer.class);
   }

   /**
    * Click new position button.
    */
   public void clickNewPositionButton() {
      container.getNewPositionButton().click();
   }

   /**
    * Sets the name.
    *
    * @param name the new name
    */
   public void setName(String name) {
      clearAndSetText(container.getNameTextField(), name);
   }

   /**
    * Send tab in name.
    */
   public void sendTabInName() {
      container.getNameTextField().sendKeys(Keys.TAB);
   }

   /**
    * Sets the code.
    *
    * @param code the new code
    */
   public void setCode(String code) {
      clearAndSetText(container.getCodeTextField(), code);
   }

   /**
    * Send tab in code.
    */
   public void sendTabInCode() {
      container.getCodeTextField().sendKeys(Keys.TAB);
   }

   /**
    * Click type menu.
    */
   public void clickTypeMenu() {
      container.getTypeMenu().click();
   }

   /**
    * Click type element.
    *
    * @param type the type
    */
   public void clickTypeElement(String type) {
      driver.getWebDriver().findElement(By.xpath(String.format(container.TYPE_ELEMENT_XPATH, type))).click();
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
    * Click cancel button.
    */
   public void clickCancelButton() {
      container.getCancelButton().click();
   }

   /**
    * Click add position button.
    */
   public void clickAddPositionButton() {
      WebElement addButton = container.getAddPositionButton();
      driver.jsClick(addButton);
   }

   /**
    * Click edit position button.
    *
    * @param positionName the position name
    */
   public void clickEditPositionButton(String positionName) {
      WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_POSITION_XPATH, positionName)));

      editButton.click();
   }

   /**
    * Click save position button.
    */
   public void clickSavePositionButton() {
      container.getSavePositionButton().click();
   }

   /**
    * Gets the position.
    *
    * @param name the name
    * @return the position
    */
   public Position getPosition(String name) {
      List<WebElement> position = driver.getWebDriver().findElements(By.xpath(String.format(container.POSITION_XPATH, name)));
      return mapPosition(position);
   }

   /**
    * Gets the adds the button state.
    *
    * @return the adds the button state
    */
   public boolean getAddButtonState() {
      return container.getAddPositionButton().isEnabled();
   }

   public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public String getPositionCount() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String countText=container.getPositionCount().getText();
    String countValue=countText.replaceAll("[^0-9]", "");
    return  countValue;
  }


   @Override
   public boolean isDisplayedCheck() {
      return !container.getPositionsPageHeader().getText().isEmpty() && container.getPositionsPageHeader().isDisplayed();
   }

   /**
    * Map position.
    *
    * @param positionElement the position element
    * @return the position
    */
   private Position mapPosition(List<WebElement> positionElement) {
      Position position = new Position();

      position.setCode(positionElement.get(2).getText());
      position.setName(positionElement.get(3).getText());

    return position;
  }


  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }


  public void clickPositionLeftpanelIcon()
  {
    container.clickPositionLeftpanelIcon().click();
  }

  public void openDeletePositionDrawer(String position) {
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_POSITION_XPATH, position)));
    deleteButton.click();
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  public boolean getNoSuccessMessage(){
    if(driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'msg')]/span")).size()==0)
      return true;
    else
      return false;
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
  }
}
