package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.crewGroups.CrewGroups;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;

public class PairingsSteps extends AbstractSteps implements En {

  private CrewGroups crewGroups = new CrewGroups();
  @Autowired
  private final static Logger LOGGER = LogManager.getLogger(PairingsSteps.class);

  public PairingsSteps() {
    Given("^I'm in the Pairing Page for scenario \"([^\"]*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.goToPairingsPage();
    });

    And("^I go to Pairing Page$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.goToPairingsPage();
    });

    Then("^verify crewgroup and ruleset are none, On first time navigation to pairing page$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.getNoneCrewGroup();
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.getNoneRuleset();
    });

    When("^I do first time crewgroup \"([^\"]*)\" selection$", (String crewGroup) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.selectCrewGroupFirstTime(crewGroup);
    });

    When("^I Click on a pairing$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.selectPairing();
    });

    When("^I Click on a pairing with Caution alert and hover on \"([^\"]*)\"$", (String alertText) -> {
      pairingsPage.selectPairingWithCautionAlert(alertText);
    });

    When("^I Click on a pairing with Flag alert and hover on \"([^\"]*)\"$", (String alertText) -> {
      pairingsPage.selectPairingWithFlagAlert(alertText);
    });

    When("^I Click on a pairing with Infraction alert and hover on \"([^\"]*)\"$", (String alertText) -> {
      pairingsPage.selectPairingWithInfractionAlert(alertText);
    });

    When("^I move cursor and hover on \"([^\"]*)\" for Caution alert$", (String alertText) -> {
      pairingsPage.moveCursorOnCaution(alertText);
    });

    When("^I move cursor and hover on \"([^\"]*)\" for Flag alert$", (String alertText) -> {
      pairingsPage.moveCursorOnFlag(alertText);
    });

    When("^I move cursor and hover on \"([^\"]*)\" for Infraction alert$", (String alertText) -> {
      pairingsPage.moveCursorOnInfraction(alertText);
    });

    Then("^I verify that the alert area is removed$", () -> {
      pairingsPage.getNoAlertArea();
    });

    When("^I Click on a pairing with Infraction alert and hover on \"([^\"]*)\" to get more than 3 alerts$", (String alertText) -> {
      pairingsPage.selectPairingWithMoreThanThreeInfractionAlert(alertText);
    });

    When("^I scroll to alert pairing hover on \"([^\"]*)\"$", (String alertText) -> {
      pairingsPage.scrollAndSelectPairingWithMoreThanThreeInfractionAlert(alertText);
    });

    Then("^I Verify alert text as \"([^\"]*)\" on View Alert of Caution", (String alertText) -> {
        TimeUnit.SECONDS.sleep(1);
        pairingsPage.verifyAlertTextForCaution(alertText);
    });

    Then("^I Verify alert text as \"([^\"]*)\" on View Alert of Flag", (String alertText) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.verifyAlertTextForFlag(alertText);
    });

    Then("^I Verify alert text as \"([^\"]*)\" on View Alert of Infraction", (String alertText) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.verifyAlertTextForInfraction(alertText);
    });

    Then("^I Verify \"([^\"]*)\" alert contains \"([^\"]*)\" on Alert message$", (String alertText, String editRule) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.verifyEditRule(alertText, editRule);
    });

    Then("^I hover on alert message$", () -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.hoverOnAlertRow();
    });

    Then("^I verify that vertical scrollbar is displayed in the alert message area$", () -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.verifyVerticalScrollBar();
    });

    When("^I click on \"([^\"]*)\" button", (String options) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.selectOptionsFromPairing(options);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I click on \"([^\"]*)\" tab button", (String options) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.clickNewTab(options);
    });

    Then("^I verify that Application Title bar contains \"([^\"]*)\"$", (String title) -> {
      Assert.assertEquals(title, pairingsPage.getApplicationTitle(title));
    });

    Then("^I verify that \"([^\"]*)\" bell icon is enabled", (String notificationButton) -> {
      pairingsPage.isNotificationButtonEnabled(notificationButton);
    });

    Then("^I verify that home button is disabled", () -> {
      pairingsPage.isHomeButtonDisabled();
    });

    Then("^I verify user menu is disabled", () -> {
      pairingsPage.isUserMenuDisabled();
    });

    Then("^I confirm that I am in Parent scenario tab containing \"([^\"]*)\"$", (String parentTab) -> {
      TimeUnit.SECONDS.sleep(2);
      Assert.assertEquals(parentTab, pairingsPage.getParentTab(parentTab));

    });

    Then("^I confirm that parent tab contains scenario \"([^\"]*)\"$", (String parentTabScenario) -> {
      pairingsPage.getParentTabScenario(parentTabScenario);

    });

    When("^I confirm that Application opens in new tab containing \"([^\"]*)\"$", (String urlHeader) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.getApplicationTab(urlHeader);
    });

    When("^I refresh the page and verify that \"([^\"]*)\" is loaded correctly", (String pageTitle) -> {
      pairingsPage.refreshPage();
      Assert.assertEquals(pageTitle, pairingsPage.getPageTitle(pageTitle));
    });

    When("^I switch to parent tab$", () -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.getParentApplicationTab();
    });

    When("^I confirm back navigation is disabled$", () -> {
      TimeUnit.SECONDS.sleep((long) 0.5);
      pairingsPage.checkBackNavigation();
    });

    When("^I confirm forward navigation is disabled$", () -> {
      TimeUnit.SECONDS.sleep((long) 0.5);
      pairingsPage.checkForwardNavigation();
    });

    When("^The link \"([^\"]*)\" in the Details page is removed", (String linkBackMessage) -> {
      pairingsPage.confirmBackMessageRemoved(linkBackMessage);
    });

    When("^I confirm that black background in the details page is removed", () -> {
      pairingsPage.confirmBlackBackground();
    });

    When("^I select crewgroup \"([^\"]*)\"$", (String crewGroup) -> {
      pairingsPage.selectCrewGroup(crewGroup);
      TimeUnit.SECONDS.sleep(10);
    });

    Then("^Verify that rule Set \"([^\"]*)\" is selected as the default rule set associated with selected Crew Group \"([^\"]*)\"$", (String ruleset, String crewGroup) -> {
      Assert.assertEquals(ruleset, pairingsPage.getRuleset(ruleset));
    });

    Then("^I Verify that SR definition's Crew Group \"([^\"]*)\" and rule Set \"([^\"]*)\" is displayed in preview tab$", (String crewGroup, String ruleset) -> {
      pairingsPage.getRulesetAndCrewGroup(crewGroup, ruleset);
    });

    Then("^I verify that ruleset link is disabled on preview page$", () -> {
      pairingsPage.ruleSetIsEnabled();
    });

    Then("^I verify that crew group \"([^\"]*)\" is disabled$", (String crewGroup) -> {
      TimeUnit.SECONDS.sleep(1);
      pairingsPage.crewGroupIsEnabled(crewGroup);
    });

    And("^I click on the Plus button$", () -> {
      pairingsPage.clickPlusButton();
    });

    Then("^Verify \"([^\"]*)\",\"([^\"]*)\" is displayed in the pairing page$", (String Timeline1, String Timeline2) -> {
     TimeUnit.SECONDS.sleep(5);
//      Assert.assertEquals(Timeline1, pairingsPage.verifyTimeline(Timeline1));
//      Assert.assertEquals(Timeline2, pairingsPage.verifyTimeline(Timeline2));
//      TimeUnit.SECONDS.sleep(5);
      Assert.assertTrue(pairingsPage.TimelineOneIcon());
      Assert.assertTrue(pairingsPage.TimelineTwoIcon());
    });

    And("^I click on ZoomIn$", () -> {
      pairingsPage.clickZoomIn();
    });

    And("^I click on ZoomIn multiple times$", () -> {
      pairingsPage.clickZoomInFiveTimes();
      TimeUnit.SECONDS.sleep(2);
    });

    And("^I verify that Infraction has orange color with color code as \"([^\"]*)\"$", (String colorCode) -> {
      pairingsPage.verifyAlertColorForInfraction(colorCode);
    });

    And("^I verify that line colour as \"([^\"]*)\"$", (String colorCode) -> {
      pairingsPage.verifyLineColor(colorCode);
    });

    And("^I verify that Caution has yellow color with color code as \"([^\"]*)\"$", (String colorCode) -> {
      pairingsPage.verifyAlertColorForCaution(colorCode);
    });

    And("^I verify that Flag has blue color with color code as \"([^\"]*)\"$", (String colorCode) -> {
      pairingsPage.verifyAlertColorForFlag(colorCode);
   });

    And("^I verify that I am in child tab containing \"([^\"]*)\" details$", (String verifyInChildTab) -> {
      pairingsPage.verifyInChildTab(verifyInChildTab);
    });

    Then("^verify zoomIn works as expected$", () -> {
      boolean checkDataAvailability = pairingsPage.validateZoomFunctionality();
      if (checkDataAvailability) {
        Assert.assertTrue(checkDataAvailability);
      } else
        LOGGER.info("No data available in this Crewgroup");
      Assert.assertTrue(checkDataAvailability);
    });

    Then("^verify Zoom function reverts to default zoom when I change crewgroup \"([^\"]*)\" and again change to \"([^\"]*)\"$", (String crewGroup1, String crewGroup2) -> {
      pairingsPage.getValueOnSecondCrewgroup(crewGroup1, crewGroup2);
    });

    Then("^Verify that the value in the Crew Groups drop-down is the last Crew Group selected \"([^\"]*)\"$", (String crewGroup) -> {
      pairingsPage.getCrewGroup(crewGroup);
    });

    And("^I want to go CrewGroup Page$", () -> {
      dataHomePage.BackToHomePage();
      dataHomePage.openCrewGrupsPage();
    });

    When("^I update the ruleset to \"([^\"]*)\" for \"([^\"]*)\" crewgroup \"([^\"]*)\"$", (String newRuleset, String oldRuleset, String crewGroup) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openEditCrewGroupDrawer(crewGroup);
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.updateCrewGroup(newRuleset);
    });

    Then("^I verify crewBase \"([^\"]*)\" is displayed in the solverResult$", (String crewBase) -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.verifyCrewBases(crewBase);
    });

    When("^I click on pairing filter button for Timeline One$", () ->{
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickFilterButton_Timeline1();
    });

    When("^I click on pairing filter button for Timeline Two", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickFilterButton_Timeline2();
    });

    When("^I click on pairing filter button for Timeline Three", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickFilterButton_Timeline3();
    });

    Then("^verify filter panel opens for Timeline One$", () -> {
      pairingsPage.verifyTimeline1_Opens();
    });

    Then("^verify filter panel opens for Timeline Two$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.verifyTimeline2_Opens();
    });

    Then("^verify filter panel opens for Timeline Three$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.verifyTimeline3_Opens();
    });

    Then("^I close Timeline Filter panel$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickCloseButton();
    });

    Then("^I verify Apply button and cancel button behaves as expected$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonIsEnabled();
      pairingsPage.clickCancelButton();
    });

    Then("^I verify the default value on filter type field as \"([^\"]*)\"$", (String filterType) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.getFilterTypeFieldText(filterType);
    });

    And("^I click on Criteria and select \"([^\"]*)\"$", (String criteria) -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickCriteriaBtn();
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickParticularCriteria(criteria);
    });
    And("^I selected the FilterType as \"([^\"]*)\"$", (String FilterType) -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickPairingFilter();
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickParticularFilterType(FilterType);
    });

    Then("^verify the add button and clear button are disabled before selecting a particular criteria$", () -> {
      pairingsPage.addButtonIsDisabled();
      pairingsPage.clearAllButtonIsDisabled();
    });

    And("^I click \"([^\"]*)\" sub-criteria checkbox$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.selectSubCriteria(sub_criteria);
    });

    Then("^verify the add button and clear button are enabled after selecting a particular criteria$", () -> {
      pairingsPage.applyButtonIsEnabled();
      pairingsPage.clearAllButtonIsEnabled();
    });

    And("^I click on Criteria$", () -> {
      pairingsPage.clickCriteriaBtn();
    });

    Then("^verify the Criteria dropdown Values as expected$", () -> {
    });

    And("^I click on add button to add criteria$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickAddButton();
    });

    Then("^I verify that the criteria \"([^\"]*)\" is displayed after the add operation$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.getSubCriteriaAfterAddOperation(sub_criteria);
    });

    And("^I click clear all for the selected sub_criteria$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickClearAllBtn();
    });

    Then("^I verify that the selected sub_criteria \"([^\"]*)\" is de-selected on clear all operation$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.selectSubCriteria_IsDeselected(sub_criteria);
    });

    And("^I Search for sub-criteria \"([^\"]*)\"$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickSearchBox_subCriteria();
      pairingsPage.SendText_SearchBox_subCriteria(sub_criteria);
      ;
    });

    And("^I verify sub-criteria \"([^\"]*)\" is listed on the dropdown after the search$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.getSubCriteriaAfterAddOperation(sub_criteria);
    });

    And("^I click on clear option in search bar of sub criteria$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.click_Clear_SearchBox_subCriteria();
    });
    And("^I click on add button to add criteria.$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickAddbutton();
    });

    Then("^I verify that the text typed in the search bar is cleared$", () -> {
      pairingsPage.SearchBox_subCriteria_IsCleared();
    });

    Then("^I verify that the criteria \"([^\"]*)\" is not displayed$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.getSubCriteriaAfterAddOperationAndClearAll(sub_criteria);
    });

    And("^I click clear all for the selected sub_criteria after adding sub_criteria$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickClearAllBtn_AfterAdd();
    });

    Then("^I click on delete button for \"([^\"]*)\" sub-criteria$", (String arg0) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickDeleteBtn();
    });

    Then("^I verify Min and Max field are present$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.verifyMinLabelPresent();
      pairingsPage.verifyMaxLabelPresent();
    });

    And("^I enter value of Min as \"([^\"]*)\" field in the Filter pane$", (String value) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.enterMinValue(value);
    });

    And("^I enter value of Max field as \"([^\"]*)\" in the Filter pane$", (String value) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.enterMaxValue(value);
    });

    Then("^verify it is possible to enter the same value for Min and Max in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^verify it is possible to enter Min field smaller than Max field in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^verify it is not possible to enter Min field greater than Max field with error message \"([^\"]*)\"$", (String errorMsg) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyErrorMessage(errorMsg);
    });

    And("^I click on add button to add criteria of Duty period Criteria$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickAddButton_DutyCriteria();
    });

    And("^I enter value of Start date as \"([^\"]*)\" field in the Filter pane$", (String dateTime) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.setStartDateTime(dateTime);
    });

    And("^I enter value of End date as \"([^\"]*)\" in the Filter pane$", (String dateTime) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.setEndDateTime(dateTime);
    });

    Then("^verify it is possible to enter the same value for Start and End date in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^verify it is possible to enter Start Date as a date before End date in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^verify it is not possible to enter Start Date as a date after End date with error message as \"([^\"]*)\"$", (String errorMsg) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyErrorMessageOnDate(errorMsg);
    });

    And("^I enter value of Start time as \"([^\"]*)\" field in the Filter pane$", (String startTime) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.setStartTime(startTime);
      TimeUnit.SECONDS.sleep(2);
    });

    And("^I enter value of End time as \"([^\"]*)\" in the Filter pane$", (String endTime) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.setEndTime(endTime);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^verify it is possible to enter the same value for Start and End time in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^verify it is possible to enter Start time before End time in the Filter pane$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonEnabled();
    });

    Then("^I verify that Last Filter option is disabled$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.VerifyLastFilterDisabled();
    });

    Then("^I click on apply button$", () -> {
      pairingsPage.clickApplyButton();
      TimeUnit.SECONDS.sleep(3);
    });
    Then("^I check filter count before$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.filterCountBeforeSwitchToScenario();
    });
    Then("^I check filter count after$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.filterCountAfterSwitchToScenario();
    });

    Then("^I click on \"([^\"]*)\" option$", (String arg0) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.clickLastFilterButton();
    });

    Then("^I verify that the filtered sub_criteria \"([^\"]*)\" is selected on last filter operation$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.selectSubCriteria_IsSelected(sub_criteria);
    });

    Then("^I refresh the page$", () -> {
      pairingsPage.refreshPage();
    });

    Then("^I verify that the selected sub_criteria \"([^\"]*)\" is de-selected$", (String sub_criteria) -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.selectSubCriteria_IsDeselected(sub_criteria);
    });

    Then("^I verify that Last Filter option is enabled$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.VerifyLastFilterEnabled();
    });

    Then("^I click on cancel button$", () -> {
      pairingsPage.clickCancelButton();
    });

    Then("^I verify that filter pane is closed$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.verifyFilterPaneClosed();
    });

    Then("^I close the timeline Window$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.clickTimelineCloseBtn();
      TimeUnit.SECONDS.sleep(3);
    });

    Then("^I verify all values in the dropdown of \"([^\"]*)\"$", (String criteria) -> {
      pairingsPage.verifyDropDownValues();
    });

    And("^I click on add button to add criteria for Flight Criteria$", () -> {
      TimeUnit.SECONDS.sleep(2);
      pairingsPage.clickAddButton_FlightCriteria();
    });

   // Then("^I verify that the filter expression is generated$", () -> {
     // TimeUnit.SECONDS.sleep(5);
    //  pairingsPage.getFilterCount();
   // });

    Then("^I verify that the filter expression is generated for Timeline One$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.getFilterCount_timelineOne();
    });

    Then("^I verify that the filter expression is generated for Timeline Two$", () -> {
      //TimeUnit.SECONDS.sleep(5);
      pairingsPage.getFilterCount_timelineTwo();
    });

   /* Then("^I verify that the filter expression is generated$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.getFilterCount_timelineThree();
    }); */

    Then("^I verify that apply button is disabled$", () -> {
      TimeUnit.SECONDS.sleep(3);
      pairingsPage.applyButtonIsEnabled();
    });

    Then("^I verify that the filter expression is present in the pairing page$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.getFilterCount_timelineOne();
    });

    Then("^I verify that the filter expression is present in the pairing page even after refresh the page$", () -> {
      TimeUnit.SECONDS.sleep(4);
      pairingsPage.verifyFilterCountBefore_AfterRefresh();
    });

    Then("^I verify that the filter expression is present in the pairing page even after navigate from the page$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyFilterCountBefore_AfterNavigate();
    });

    Then("^I verify that the filter expression is cleared$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyFilterExpressionCleared();
    });

    Then("^I click on Clear filter icon$", () -> {
      pairingsPage.clearFilterButton_Timeline1();
    });

    Then("^I verify that Only durations can be typed in min-max field, else get error message \"([^\"]*)\"$", (String errorMsg) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyErrorMessage_durationFormat(errorMsg);
    });

    Then("^I verify that error message \"([^\"]*)\"$", ( String errorMsg) -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.verifyErrorMessage_minuteValidation( errorMsg);
      pairingsPage.enterMinValue("");
    });

    Then("^I verify that it is possible to enter min or max field alone and apply$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.enterMaxValue("");
      pairingsPage.applyButtonEnabled();
      pairingsPage.clickApplyButton();
    });

      And("^I verify Canvas element$", () -> {
        pairingsPage.verifyCanvas();

      });
    And("^I click on display all Pairings link$", () -> {
      pairingsPage.displayAllPairingLink();

    });
    Then("^I verify that the filter expression is cleared and count changes to zero$", () -> {
      TimeUnit.SECONDS.sleep(5);
      pairingsPage.getFilterCountAfterClickOnClear();
    });
    And("^I selected the FlightType as \"([^\"]*)\"$", (String flightFilterType) -> {
      pairingsPage.getFlightFilterType(flightFilterType);
    });

  }
}
