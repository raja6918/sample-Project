package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.validations.ScenariosValidation;
import cucumber.api.java8.En;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class RulesetSteps extends AbstractSteps implements En {

  @Autowired
  private ScenariosValidation validator;

  String Last_Modified;
  String Last_modifiedBy;

  public RulesetSteps() {

    Given("^I'm in the ruleset page for scenario \"([^\"]*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openRulesetPage();
      //TimeUnit.SECONDS.sleep(1);
    });

    When("^I expand rulesets \"([^\"]*)\",\"([^\"]*)\"$", (String rulesetName1, String rulesetName2) -> {
      rulesetPage.expandRuleset(rulesetName1, rulesetName2);
    });

    And("^I click on three dots on \"([^\"]*)\"$", (String rulesetName) -> {
      rulesetPage.clickThreeDots(rulesetName);
    });

    When("^I \"([^\"]*)\" the ruleset \"([^\"]*)\"$", (String action, String rulesetName) -> {
      rulesetPage.clickAction(action);
      TimeUnit.SECONDS.sleep(2);
    });

    When("^I \"([^\"]*)\" the ruleset \"([^\"]*)\" to duplicate ruleset name$", (String action, String rulesetName) -> {
      rulesetPage.clickActionDuplicate(action);
      TimeUnit.SECONDS.sleep(2);
    });

    When("^I get current content of the ruleset displayed", () -> {
      rulesetPage.getCurrentSelection();
    });

    Then("^I go to rule set page$", () -> {
      dataHomePage.BackToHomePage();
      dataHomePage.openRulesetPage();
    });

    When("^I turn network to Offline mode", () -> {
      rulesetPage.networkOffline();
    });

    Then("^I turn network to Online mode$", () -> {
      rulesetPage.networkOnline();

    });

    When("^I verify new rule set is displayed as \"([^\"]*)\" \"([^\"]*)\"$", (String childOfString, String parentRuleName) -> {
      rulesetPage.verifyChildDetails(childOfString, parentRuleName);
    });

    And("^I check focus and provide new ruleset name as \"([^\"]*)\"$", (String data) -> {
      rulesetPage.getCurrentFocus(data);
    });

    And("^I provide new ruleset name as \"([^\"]*)\"$", (String data) -> {
      rulesetPage.getNewRulesetName(data);
    });

    Then("^I confirm that the previous name is restored as \"([^\"]*)\"$", (String rulesetName) -> {
      String currentRulesetName = rulesetPage.getAddedRulesetName(rulesetName);
      Assert.assertTrue(currentRulesetName.equals(rulesetName));
    });

    When("^I count the total rule in table$", () -> {
      TimeUnit.SECONDS.sleep(1);
      rulesetPage.getRuleCount();
    });

    And("^I confirm that added ruleset \"([^\"]*)\" is in a label$", (String rulesetName) -> {
      rulesetPage.checkLabelDetails(rulesetName);
    });

    And("^I click delete confirmation button$", () -> {
      TimeUnit.SECONDS.sleep(1);
      rulesetPage.deleteRulesetConfirmation();
      TimeUnit.SECONDS.sleep(1);
    });

    Then("^the delete message \"([^\"]*)\" for ruleset is displayed as expected$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = rulesetPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

    Then("^verify the reference error for ruleset \"([^\"]*)\" is displayed$", (String expectedRefErrorMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualRefErrorMessage = rulesetPage.getRefErrorMessage();
      validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
      rulesetPage.clickRefErrorCloseButton();
    });

    And("^I click cancel button$", () -> {
      rulesetPage.cancelDeleteRuleset();
    });

    Then("^verify successfully that no deletion happens for ruleset$", () -> {
      rulesetPage.verifyNoSuccessMessage();
    });

    Then("^verify successfully that no \"([^\"]*)\" option is present for root ruleset$", (String action) -> {
      rulesetPage.verifyDeleteOption(action);
    });

    When("^I click on Rules icon in left panel$", () -> {
      TimeUnit.SECONDS.sleep(1);
      rulesetPage.clickRulesLeftpanelIcon();
    });

    And("^I click Manage Rule Sets Link$", () -> {
      rulesetPage.clickManageRulesetsLink();
    });

    When("^I update the name to \"([^\"]*)\"$", (String rulesetName) -> {
      rulesetPage.updateRulesetName(rulesetName);
    });

    When("^I verify that field Rule Set Name, Last modified by, Last modified and Description in the Get/Edit Info pane$", () -> {
      rulesetPage.verifyGetInfoOnEdit();
    });

    When("^I verify that field Rule Set Name and Description in the Get/Edit Info pane are enabled$", () -> {
      rulesetPage.verifyEditableFiledOnEditIsEnabled();
    });

    When("^I verify that field Rule Set Name and Description in the Get/Edit Info pane are disabled$", () -> {
      rulesetPage.verifyEditableFiledOnEditIsDisabled();
    });

    Then("^verify with message \"([^\"]*)\" for ruleset is displayed as expected$", (String expectedSuccessMessage) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualMessage = rulesetPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I update name having characters greater than (\\d+)$", (Integer arg0) -> {
      rulesetPage.updateRulesetName_FiftyPlusCharacter();
    });

    Then("^I scroll to rule name \"(.*)\"$", (String rulesName) -> {
      rulesetPage.moveToRulesName(rulesName);
    });

    And("^I expand the rule name \"([^\"]*)\"$", (String rulesName) -> {
      rulesetPage.expandRulesName(rulesName);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I collapse the rule name \"([^\"]*)\"$", (String rulesName) -> {
      TimeUnit.SECONDS.sleep(1);
      rulesetPage.expandRulesName(rulesName);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I wait for rules page to load$", () -> {
      rulesetPage.waitForRulePage();
    });

    And("^I can see it is possible to expand rule to see its description \"([^\"]*)\"$", (String rulesName) -> {
      rulesetPage.verifyExpandRulesAndDescription(rulesName);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I can see it is possible to change the state of rule to \"([^\"]*)\" for rules \"([^\"]*)\"$", (String state, String rulesName) -> {
      rulesetPage.changeRuleState(state, rulesName);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I can see that state drop-down is visible and disabled for all rules namely \"([^\"]*)\"$", (String rulesName) -> {
      rulesetPage.verifyDisabledRuleState(rulesName);
    });

    And("^I can see that It is possible to see rule set namely \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.verifyRuleSetName(ruleSetName);
    });



    And("^I collapse rule set tree for \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.clickCollapseButton(ruleSetName);
    });

    And("^I confirm that collapse rule set tree is fine for \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.getNoCollapseButton(ruleSetName);
    });

    And("^I expand rule set tree for \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.clickExpandButton(ruleSetName);
    });

    And("^I confirm that expand rule set tree is fine for \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.getNoExpandButton(ruleSetName);
    });

    And("^I confirm that menu items \"([^\"]*)\" are enabled$", (String action) -> {
      rulesetPage.verifyRuleSetAction(action);
    });

    And("^I confirm that menu items \"([^\"]*)\" are disabled", (String action) -> {
      rulesetPage.verifyRuleSetActionDisabled(action);
    });

    And("^I verify the current status is updated to \"([^\"]*)\" for rules \"([^\"]*)\"$", (String state, String rulesName) -> {
      rulesetPage.verifyRuleState(state, rulesName);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I update the value as \"([^\"]*)\"$", (String value) -> {
      rulesetPage.updateRuleDescriptionValue(value);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I verify that embedded in a rule description are visible and disabled$", () -> {
      rulesetPage.verifyDisableRuleDescriptionValue();
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I confirm that value is updated to \"([^\"]*)\"$", (String value) -> {
      rulesetPage.updateRuleDescriptionValue(value);
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I verify that the link to Manage Rule Sets is enabled and I click$", () -> {
      rulesetPage.verifyManageRuleLinkTextAndClick();
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I verify that the link to Manage Rule Sets is enabled$", () -> {
      rulesetPage.verifyManageRuleLinkText();
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I go Back To Rules$", () -> {
      rulesetPage.goBackToRules();
      TimeUnit.SECONDS.sleep(1);
    });

    And("^I can see a list of all rules$", () -> {
      rulesetPage.verifyRulesInRulesPageList();
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I update legs value \"([^\"]*)\"$", (String updateLegsValue) -> {
      rulesetPage.updateLegsValue(updateLegsValue);
    });

    When("^I update duties value as \"([^\"]*)\"$", (String updateDutiesValue) -> {
      rulesetPage.updateDutiesValue(updateDutiesValue);
    });

    When("^I update integer value as \"([^\"]*)\"$", (String integerValue) -> {
      rulesetPage.updateIntegerValue(integerValue);
    });

    Then("^I verify that text field is disabled$", () -> {
      rulesetPage.currentPlaceHolderIsEnabled();
    });

    Then("^I verify that duration value field is disabled$", () -> {
      rulesetPage.currentPlaceHolderIsEnabled();
    });

    Then("^I verify that revert button is disabled$", () -> {
      rulesetPage.revertButtonIsEnabled();
    });

    Then("^I verify that State ComboBox On/Off is disabled$", () -> {
      rulesetPage.StateComboBoxOnOffIsEnabled();
    });

    When("^I verify the link \"([^\"]*)\" is functional$", (String linkText) -> {
      rulesetPage.verifyRuleLinkText(linkText);
    });

    When("^I verify the current rule set name is \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.verifyCurrentRuleSetName(ruleSetName);
    });

    When("^I select rule set \"([^\"]*)\"$", (String ruleSetName) -> {
      rulesetPage.selectRuleSet(ruleSetName);
      TimeUnit.SECONDS.sleep(2);
    });

    When("^I update duration value as \"([^\"]*)\"$", (String durationValue) -> {
      rulesetPage.updateDurationValue(durationValue);
    });

    When("^I verify that integer value is not updated to \"([^\"]*)\"$", (String integerValue) -> {
      rulesetPage.verifyIntegerValueNotUpdated(integerValue);
    });

    When("^I verify that duration value is not updated to \"([^\"]*)\"$", (String durationValue) -> {
      rulesetPage.verifyDurationValue(durationValue);
    });

    Then("^verify with message \"([^\"]*)\" for rule is displayed as expected$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = rulesetPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I Change the status to \"([^\"]*)\" for rule name \"([^\"]*)\"$", (String state, String ruleName) -> {
      rulesetPage.selectRuleState(state, ruleName);
    });

    When("^I select \"([^\"]*)\" for deadheads$", (String changeDeadheadsValue) -> {
      rulesetPage.selectDeadheadsValue(changeDeadheadsValue);
    });

    When("^I verify the current status for \"([^\"]*)\" is updated to \"([^\"]*)\"$", (String ruleName, String expectedState) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualState = rulesetPage.getCurrentRuleStatus(ruleName);
      validator.verifyText(expectedState, actualState);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    And("^I click away from the parameter$", () -> {
      rulesetPage.clicksAwayFromParameter();
    });

    When("^I verify the current duties value is updated to \"([^\"]*)\"$", (String expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualValue = rulesetPage.getCurrentDutiesValue(expectedValue);
      validator.verifyText(expectedValue, actualValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I verify the current deadhead value is updated to \"([^\"]*)\"$", (String expectedDeadheadsValue) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualDeadheadsValue = rulesetPage.getCurrentDeadheadsStatus();
      validator.verifyText(expectedDeadheadsValue, actualDeadheadsValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    Then("^I scroll to down to max duty credit$", () -> {
      rulesetPage.moveToElementMaxDutyCredit();
    });

    When("^I select \"([^\"]*)\" for meals", (String newMeal) -> {
      rulesetPage.selectMealValues(newMeal);
    });

    When("^I verify the current meal type is updated to \"([^\"]*)\"$", (String expectedMealDetails) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualMealDetails = rulesetPage.getCurrentMealDetails();
      validator.verifyText(expectedMealDetails, actualMealDetails);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I update otherwise value as \"([^\"]*)\"$", (String otherwiseValue) -> {
      rulesetPage.updateOtherwiseValue(otherwiseValue);
    });

    When("^I verify Decimal input is expandable is updated to (\\d+) character$", (Integer expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      Integer actualCount = rulesetPage.getCurrentCharacterCount();
      assertEquals(expectedValue, actualCount );
      TimeUnit.MILLISECONDS.sleep(500);
    });

    Then("^verify rulesetName field allows max character count as (\\d+) for Ruleset \"([^\"]*)\"$", (Integer count, String rulesetName) -> {
      TimeUnit.SECONDS.sleep(4);
      Integer actualNameTextCount = rulesetPage.getRulesetNameTextCount(rulesetName);
      assertEquals(count, actualNameTextCount);
    });

    When("^I update no more than value as \"([^\"]*)\"$", (String noMoreThanValue) -> {
      rulesetPage.updateNoMoreThanValue(noMoreThanValue);
    });

    When("^I verify Time duration input is expandable is expandable up to (\\d+) character$", (Integer expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      Integer actualCount = rulesetPage.getCurrentCharacterCountForNoMoreThan();
      assertEquals(expectedValue, actualCount);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    And("^I verify current duration is in HHhMM format$", () -> {
      rulesetPage.checkDurationFormat();
    });

    When("^I update commercial Deadheads value as \"([^\"]*)\"$", (String commercialDeadheads) -> {
      rulesetPage.updateCommercialDeadheadsValue(commercialDeadheads);
    });

    When("^I verify Percentage input value is expandable up to (\\d+) character$", (Integer expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      Integer actualCount = rulesetPage.getUpdatedCommercialDeadheadsValue();
      assertEquals(expectedValue, actualCount);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I update special tag value as \"([^\"]*)\"$", (String specialTagValue) -> {
      rulesetPage.updateSpecialTagValue(specialTagValue);
    });

    When("^I verify Text input is expandable is updated to (\\d+) character$", (Integer expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      Integer actualCount = rulesetPage.getCurrentCharacterCountForSpecialTagValue();
      assertEquals(expectedValue, actualCount );
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I update special tail number value as \"([^\"]*)\"$", (String specialTailNumber) -> {
      rulesetPage.updateSpecialTailNumber(specialTailNumber);
    });

    When("^I verify Integer input is expandable is updated to (\\d+) character$", (Integer expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      Integer actualCount = rulesetPage.getCurrentCharacterCountForSpecialTailNumber();
      assertEquals(expectedValue, actualCount );
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I update the briefing time to \"([^\"]*)\"$", (String newDepartureTime) -> {
      rulesetPage.setDepartureTime(newDepartureTime);
      TimeUnit.SECONDS.sleep(2);
     });

    When("^I verify the briefing time is updated to \"([^\"]*)\"$", (String expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualValue = rulesetPage.getUpdatedTime();
      validator.verifyText(expectedValue, actualValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I update the flight date to \"([^\"]*)\"$", (String date) -> {
      rulesetPage.selectDate(date);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I verify the flight date is updated to \"([^\"]*)\"$", (String expectedValue) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualValue = rulesetPage.getUpdatedDate();
      validator.verifyText(expectedValue, actualValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I click on datacard link \"([^\"]*)\"$", (String linkText) -> {
      rulesetPage.clickLinkText(linkText);
    });

    When("^I verify that briefing time is updated to \"([^\"]*)\" for other page too$", (String expectedBriefingTime) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualBriefingTime = rulesetPage.getUpdatedBriefTime();
      validator.verifyText(expectedBriefingTime, actualBriefingTime);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    When("^I verify that otherwise value is updated to \"([^\"]*)\" for other page too$", (String expectedOtherwiseValue) -> {
      TimeUnit.MILLISECONDS.sleep(500);
      String actualOtherwiseValue = rulesetPage.getUpdatedOtherwiseValue();
      validator.verifyText(expectedOtherwiseValue, actualOtherwiseValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });

    And("^I update description having characters greater than (\\d+)$", (Integer arg0) -> {
      rulesetPage.updateRulesetDescription();
    });

    Then("^verify description field allows max character count as (\\d+) for Ruleset \"([^\"]*)\"$", (Integer count, String rulesetName) -> {
      TimeUnit.SECONDS.sleep(3);
      Integer actualNameTextCount = rulesetPage.getRulesetDescriptionTextCount(rulesetName);
      assertEquals(count, actualNameTextCount);
    });

    When("^I try update the name to \"([^\"]*)\" and verify lastmodified is updated successfully.$", (String rulesetName) -> {
      String Last_Modified = rulesetPage.getLastModifiedText(rulesetName);
      rulesetPage.updateRulesetName(rulesetName);
      TimeUnit.SECONDS.sleep(10);
      rulesetPage.clickThreeDots(rulesetName);
      rulesetPage.clickAction("Get/Edit info");
      String Last_Modified_New = rulesetPage.getLastModifiedText(rulesetName);
      Assert.assertNotEquals(Last_Modified,Last_Modified_New);
    });

    When("^I try update the name to \"([^\"]*)\" and verify last modified by is updated successfully\\.$", (String rulesetName) -> {
      String Last_Modified_By= rulesetPage.getLastModifiedByText(rulesetName);
      rulesetPage.updateRulesetName(rulesetName);
      rulesetPage.clickThreeDots(rulesetName);
      rulesetPage.clickAction("Get/Edit info");
      String Last_Modified_By_New = rulesetPage.getLastModifiedByText(rulesetName);
      Assert.assertNotEquals(Last_Modified,Last_Modified_By_New);
    });

    Then("^I verify that last modified date is displayed on the root rule set \"([^\"]*)\"$", (String rulesetName) -> {
      String Last_Modified = rulesetPage.getLastModifiedTextOnRulesetTab(rulesetName);
      Assert.assertTrue(Last_Modified.contains("Last modified:"));
    });
    When("^I open rules page.$", () -> {
      rulesetPage.openRulesetPageForUAT();
    });
    And("^I click on Toggle Buttons$", () -> {
      rulesetPage.clickToggleButtons();
    });
    Then("^I verify that duration value is updated to \"([^\"]*)\"$", (String durationValue) -> {
      rulesetPage.verifyDurationValueAreEqual(durationValue);
    });
    When("^I update duration time value as \"([^\"]*)\"$", (String durationValue) -> {
      rulesetPage.updateDurationTimeValue(durationValue);
    });
    Then("^I update the time to \"([^\"]*)\"$", (String time) -> {
      rulesetPage.setSelectTime(time);
      TimeUnit.SECONDS.sleep(2);
    });
    When("^I verify the time is updated to \"([^\"]*)\"$", (String time) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualValue = rulesetPage.getUpdatedTimeValue();
      validator.verifyText(time, actualValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });
    When("^I update default cost value as \"([^\"]*)\"$", (String defaultCostValue) -> {
      rulesetPage.updateIntAndDecimalValue(defaultCostValue);
    });
    And("^I provide value as \"([^\"]*)\" for \"([^\"]*)\" parameter$", (String data, String parameterName) -> {
      rulesetPage.updateParameterValue(data, parameterName);
      TimeUnit.SECONDS.sleep(2);
    });
    Then("^I verify the value is updated to \"([^\"]*)\" for \"([^\"]*)\" parameter$", (String value, String parameterName) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualValue = rulesetPage.getUpdatedValue(parameterName);
      validator.verifyText(value, actualValue);
      TimeUnit.MILLISECONDS.sleep(500);
    });
    Then("^I verify that all fields are disabled$", () -> {
      rulesetPage.getInputParameterStatus();
    });
    Then("^I verify that integer value is updated to \"([^\"]*)\"$", (String value) -> {
      rulesetPage.verifyIntegerValueAreEqual(value);
    });
    Then("^I click on the this table link$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rulesetPage.getTable();
    });
    Then("^I click on add button on table$", () -> {
      rulesetPage.plusButtonForTable();
    });
    Then("^I add the data \"([^\"]*)\" and \"([^\"]*)\" to the table$", (String value1, String value2) -> {
      rulesetPage.addDataTotheTable(value1, value2);
    });
    Then("^I verify the data \"([^\"]*)\" and \"([^\"]*)\" is added to the table$", (String value1, String value2) -> {
      rulesetPage.verifyDataOfTable(value1, value2);
    });
    And("^I Click On Save Button$", () -> {
      rulesetPage.clickSave();
    });
    And("^I Click On CANCEL Button$", () -> {
      TimeUnit.SECONDS.sleep(2);
      rulesetPage.clickCancel();
    });
    Then("^I verify the data \"([^\"]*)\" and \"([^\"]*)\" is not added to the table$", (String value1, String value2) -> {
      TimeUnit.SECONDS.sleep(2);
      rulesetPage.verifyDataIsNotAdded(value1, value2);
    });
    And("^I click on delete row Option$", () -> {
      TimeUnit.SECONDS.sleep(1);
      rulesetPage.deleteRow();
    });
    Then("^I verify that record is deleted from table$", () -> {
     // rulesetPage.recordIsdeleted();
    });
    And("^I click on insert row above Option$", () -> {
      rulesetPage.clickInsertRowAbove();
    });
    Then("^I verify that record is inserted above$", () -> {
     // rulesetPage.verifyInsertRecordAbove();
    });
    And("^I click on insert row below Option$", () -> {
      rulesetPage.clickInsertRowBelow();
    });
    Then("^I verify that record is inserted below$", () -> {
    //  rulesetPage.verifyInsertRecordBelow(String value1,String value2);
    });
    Given("^I'm in the ruleset page for scenario \"([^\"]*)\".$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openRulesetPageForUAT();
      TimeUnit.SECONDS.sleep(1);
    });
    And("^I update decimal value as \"([^\"]*)\"$", (String value) -> {
      rulesetPage.updateDecimalValue(value);
    });
    Then("^I verify that decimal value is updated to \"([^\"]*)\"$", (String value) -> {
      rulesetPage.verifyDecimalValueAreEqual(value);
    });
    When("^I update softCostPenalityValue as \"([^\"]*)\"$", (String otherwiseValue) -> {
      rulesetPage.updateOtherwiseValue(otherwiseValue);
    });
    And("^Save button is in Disable state$", () -> {
      rulesetPage.saveButtonIsInDisableState();
    });
    Then("^I verify that record with data \"([^\"]*)\" and \"([^\"]*)\" is not available on the table$", (String value1, String value2) -> {
     rulesetPage.recordIsdeleted(value1,value2);
    });
    And("^I verify that record is inserted above for row of data \"([^\"]*)\" and \"([^\"]*)\"$", (String value1, String value2) -> {
      rulesetPage.verifyInsertRecordAbove(value1,value2);
    });
    And("^I verify that record is inserted below for row of data \"([^\"]*)\" and \"([^\"]*)\"$", (String value1, String value2) -> {
      rulesetPage.verifyInsertRecordBelow( value1, value2);
    });


  }
}
