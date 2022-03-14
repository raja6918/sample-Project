package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.crewGroups.CrewGroups;
import com.adopt.altitude.automation.frontend.pageobject.view.CrewGroupsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class OperatingFlightsPage.
 */
@Component
public class CrewGroupsPage extends AbstractPage {

	@Autowired
	@Lazy(true)
	private CrewGroupsView crewGroupsView;

	@Override
	public boolean isPageDisplayed() {
		return crewGroupsView.isDisplayedCheck();
	}

	/**
	 * Open new CrewGroups drawer.
	 */
	public void openNewCrewGroupsDrawer() throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.clickNewCrewGroupsButton();
	}

	/**
	 * Fill out Crew Groups Form.
	 * @param
	 */
	public void fillOutCrewGroupsForm(CrewGroups newCrewGroups) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.setCrewGroupName(newCrewGroups.getName());
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.selectCrewGroupPosition(newCrewGroups.getPosition());
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.selectCrewGroupAirline(newCrewGroups.getAirlines());
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.selectCrewGroupAircraftType(newCrewGroups.getAircraftType());
		TimeUnit.SECONDS.sleep(1);
		crewGroupsView.selectCrewGroupDefaultRuleSet(newCrewGroups.getDefaultRuleSet());
	}

	/**
	 * Adds the new Crew Group.
	 */
	public void addNewCrewGroup() throws InterruptedException {
		crewGroupsView.clickAddButton();
	}

  public void saveCrewGroup() throws InterruptedException {
    crewGroupsView.clickSaveButton();
  }
  /**
   * Get the error messages for invalid field values
   *
   * @return
   */
  public String getInvalidFieldErrorMessage() {
    return crewGroupsView.getFieldErrorMessage();
  }

  /**
   * Sets the name.
   *
   * @param name the new name
   */
  public void setName(String name) {
    crewGroupsView.setCrewGroupName(name);
  }

  /**
   * Gets the error message.
   *
   * @return the error message
   */
  public String getErrorMessage() {
    return crewGroupsView.getErrorMessage();
  }
	 /**
	    * Gets the Crew Group.
	    *
	    * @param name the name
	    * @return the crewGroup
	    */
	   public CrewGroups getCrewGroup(String name) {
	      List<String> values = crewGroupsView.getCrewGroup(name);

	      return mapCrewGropus(values);
	   }

	   /**
	    * Map crew groups.
	    *
	    * @param values the values
	    * @return the crewGroup
	    */
	   private CrewGroups mapCrewGropus(List<String> values) {
	      CrewGroups newCrewGroups = new CrewGroups();

	      newCrewGroups.setName(values.get(0));
	      newCrewGroups.setPosition(values.get(1));
	      newCrewGroups.setAirlines(values.get(2));

	      return newCrewGroups;
	   }

  /**
   * click filter.
   */
  public void getFilterClick() throws InterruptedException {
    crewGroupsView.clickFilter();
  }

  /**
   * type crewgroupName.
   *
   * @param crewgroupName the code
   */
  public void enterCrewgroupName(String crewgroupName) throws InterruptedException {
    crewGroupsView.enterCrewgroupName(crewgroupName);
  }

  public void setNewCrewGroupName(String name) {
    crewGroupsView.setNewCrewGroupName(name);
  }

  public void openEditCrewGroupDrawer(String crewgroupname) {
    crewGroupsView.clickEditCrewGroupButton(crewgroupname);
  }

  /**
   * Gets the success message.
   *
   * @return the success message
   */
  public String getSuccessMessage() {
    return crewGroupsView.getSuccessMessage();
  }

  public void getSelectAllAirlines() throws InterruptedException {
    crewGroupsView.selectAllCrewGroupAirline();
  }

  public void getSelectAllAircraft() throws InterruptedException {
    crewGroupsView.selectAllCrewGroupAircraft();
  }

  public void getSelectAllPosition() throws InterruptedException {
    crewGroupsView.selectAllPositions();
  }

  public void openDeleteCrewgroupDrawer(String crewgroup) throws InterruptedException {
    crewGroupsView.openDeleteCrewgroupDrawer(crewgroup);
  }

  public void deleteCrewgroupConfirmation() {
    crewGroupsView.clickDeleteButton();
  }

  public void cancelDeleteCrewgroup() {
    crewGroupsView.clickCancelButton();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(crewGroupsView.getNoSuccessMessage());
  }

  public void clickCrewGroupLeftpanelIcon() {
    crewGroupsView.clickCrewGroupLeftpanelIcon();
  }
}
