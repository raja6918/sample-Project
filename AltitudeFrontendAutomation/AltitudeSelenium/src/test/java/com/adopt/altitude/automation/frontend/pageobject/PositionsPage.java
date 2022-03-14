package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.position.Position;
import com.adopt.altitude.automation.frontend.pageobject.view.PositionsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import java.util.concurrent.TimeUnit;

/**
 * The Class PositionsPage.
 */
@Component
public class PositionsPage extends AbstractPage {

   /** The positions view. */
   @Autowired
   @Lazy(true)
   PositionsView positionsView;

  /**
   * Open new position drawer.
   */
  public void openNewPositionDrawer() throws InterruptedException {
    positionsView.clickNewPositionButton();
  //  TimeUnit.SECONDS.sleep(5);

  }

   /**
    * Open edit position drawer.
    *
    * @param positionName the position name
    */
   public void openEditPositionDrawer(String positionName) {
      positionsView.clickEditPositionButton(positionName);
   }

   /**
    * Fill in position form.
    *
    * @param position the position
    */
   public void fillInPositionForm(Position position) throws InterruptedException {
      positionsView.setCode(position.getCode());
      TimeUnit.SECONDS.sleep(1);
      positionsView.setName(position.getName());
      TimeUnit.SECONDS.sleep(1);
      positionsView.clickTypeMenu();
      TimeUnit.SECONDS.sleep(1);
      positionsView.clickTypeElement(position.getType());
   }

   /**
    * Sets the name.
    *
    * @param name the new name
    */
   public void setName(String name) {
      positionsView.setName(name);
      positionsView.sendTabInName();
   }

   /**
    * Sets the code.
    *
    * @param code the new code
    */
   public void setCode(String code) {
      positionsView.setCode(code);
      positionsView.sendTabInCode();
   }

   /**
    * Select type.
    *
    * @param type the type
    */
   public void selectType(String type) {
      positionsView.clickTypeMenu();
      positionsView.clickTypeElement(type);
   }

   /**
    * Adds the position.
    */
   public void addPosition() {
      positionsView.clickAddPositionButton();
   }

   /**
    *
    * @return true, if is adds the button enabled
    */
   public boolean isAddButtonEnabled() {
      return positionsView.getAddButtonState();
   }

   /**
    * Cancel position.
    */
   public void cancelPosition() {
      positionsView.clickCancelButton();
   }

   /**
    * Save position.
    */
   public void savePosition() {
      positionsView.clickSavePositionButton();
   }

   /**
    * Gets the position.
    *
    * @param name the name
    * @return the position
    */
   public Position getPosition(String name) {
      return positionsView.getPosition(name);
   }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return positionsView.getErrorMessage();
   }

   public String getScenarioStatus() {
     return positionsView.getScenarioStatus();
   }

   public void getPositionsCount() throws InterruptedException {
     dataCountForPosition = positionsView.getPositionCount();
   }
  @Override
  public boolean isPageDisplayed() {
    return positionsView.isDisplayedCheck();
  }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return positionsView.getSuccessMessage();
  }

  public void clickPositionLeftpanelIcon() {
    positionsView.clickPositionLeftpanelIcon();
  }

  public void openDeletePositionDrawer(String position) {
    positionsView.openDeletePositionDrawer(position);
  }

  public void deletePositionConfirmation() {
    positionsView.clickDeleteButton();
  }

  public void cancelDeletePosition() {
    positionsView.clickCancelButton();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(positionsView.getNoSuccessMessage());
  }

  public String getRefErrorMessage() {
    return positionsView.getRefErrorMessage();
  }

  public void clickRefErrorCloseButton() {
    positionsView.clickRefErrorCloseButton();
  }
}
