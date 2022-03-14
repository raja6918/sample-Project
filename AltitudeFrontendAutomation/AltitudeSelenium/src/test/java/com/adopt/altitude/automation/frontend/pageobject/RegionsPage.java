package com.adopt.altitude.automation.frontend.pageobject;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.region.Region;
import com.adopt.altitude.automation.frontend.pageobject.view.RegionsView;

/**
 * The Class RegionsPage.
 */
@Component
public class RegionsPage extends AbstractPage {

   /** The regions view. */
   @Autowired
   @Lazy(true)
   private RegionsView regionsView;

   /**
    * Open add new region drawer.
    */
   public void openAddNewRegionDrawer() {
      regionsView.clickAddNewRegion();
   }

   /**
    * Fill out region form.
    *
    * @param newRegion the new region
    */
   public void fillOutRegionForm(Region newRegion) {
      regionsView.enterCode(newRegion.getCode());
      regionsView.enterName(newRegion.getName());
   }

   /**
    * Adds the region.
    */
   public void addRegion() {
      regionsView.clickAdd();
   }

   /**
    * Gets the region.
    *
    * @param regionName the region name
    * @return the region
    */
   public Region getRegion(String regionName) {
      List<String> values = regionsView.getRegion(regionName);

      return mapRegion(values);
   }

   /**
    * Open edit region drawer.
    *
    * @param regionName the region name
    */
   public void openEditRegionDrawer(String regionName) {
      regionsView.clickEditRegionButton(regionName);
   }

  /**
   * Click the delete button for specified region
   *
   * @param regionCode
   */
  public void openDeleteRegionForm(String regionCode) {
    regionsView.clickDeleteRegionButton(regionCode);
  }

  /**
   * Click Delete Option in the delete confirmation dialog
   */
  public void deleteRegion() {
    regionsView.clickDeleteButton();
  }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return regionsView.getSuccessMessage();
  }

   /**
    * Update name.
    *
    * @param name the name
    */
   public void updateName(String name) {
      regionsView.enterName(name);
   }

   /**
    * Update code.
    *
    * @param code the code
    */
   public void updateCode(String code) {
      regionsView.enterCode(code);
   }

   /**
    * Update region.
    */
   public void updateRegion() {
      regionsView.clickSave();
   }

   /**
    * Map region.
    *
    * @param values the values
    * @return the region
    */
   private Region mapRegion(List<String> values) {
      Region region = new Region();

      region.setCode(values.get(0));
      region.setName(values.get(1));

      return region;
   }

  /**
   * click the region link.
   */
  public void clickRegionLink() throws InterruptedException {
    regionsView.clickRegionLink();
  }

   /**
    * Gets the error message.
    *
    * @return the error message
    */
   public String getErrorMessage() {
      return regionsView.getErrorMessage();
   }

   public String getScenarioStatus() {
     return regionsView.getScenarioStatus();
  }

   public void getRegionsCount() throws InterruptedException {
     dataCountForRegion = regionsView.getRegionsCount();
   }

  /**
   * Click Cancel Option in the delete confirmation dialog
   */
  public void cancelRegion() {
    regionsView.clickCancelButton();
  }

   @Override
   public boolean isPageDisplayed() {
      return regionsView.isDisplayedCheck();
   }

}
