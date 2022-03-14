package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.RulesetView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;

@Component
public class RulesetPage extends AbstractPage {

  @Autowired
  @Lazy(true)
  private RulesetView rulesetView;

  @Override
  public boolean isPageDisplayed() {
    return rulesetView.isDisplayedCheck();
  }

  public void clickRulesLeftpanelIcon() {
    rulesetView.clickRulesLeftpanelIcon();
  }

  public void openRulesetPage() {
    rulesetView.clickRulesCardToRead();
    rulesetView.clickManageRulesetsLink();
  }

  public void clickManageRulesetsLink() {
    rulesetView.clickManageRulesetsLink();
  }

  public void expandRuleset(String rulesetName1, String rulesetName2) throws InterruptedException {
    rulesetView.clickExpandButton(rulesetName1, rulesetName2);
  }

  public void clickThreeDots(String rulesetName) {
    rulesetView.clickThreeDots(rulesetName);
  }

  public void clickAction(String action) throws InterruptedException {
    rulesetView.clickAction(action);
  }

  public void clickActionDuplicate(String action) throws InterruptedException, AWTException {
    rulesetView.clickActionDuplicate(action);
  }
  public void networkOffline() throws InterruptedException, IOException {
    rulesetView.networkOffline();
  }

  public void networkOnline() throws InterruptedException, IOException {
    rulesetView.networkOnline();
  }

  public void getCurrentSelection() throws InterruptedException, AWTException {
    rulesetView.getCurrentSelection();
  }

  public void getRuleCount() throws InterruptedException {
    dataCountForRule = rulesetView.getRuleCount();
  }

  public void getCurrentFocus(String data) throws InterruptedException, AWTException {
    rulesetView.getCurrentFocus(data);
  }

  public void getNewRulesetName(String data) throws InterruptedException, AWTException {
    rulesetView.getNewRulesetName(data);
  }

   public void verifyChildDetails(String childOfString, String parentRuleName) throws InterruptedException {
    rulesetView.verifyChildDetails(childOfString, parentRuleName);
  }

  public String getAddedRulesetName(String rulesetName){
    return rulesetView.getAddedRulesetName(rulesetName);
  }

  public void checkLabelDetails(String rulesetName) {
    rulesetView.checkLabelDetails(rulesetName);
  }

  public void deleteRulesetConfirmation() {
    rulesetView.clickDeleteButton();
  }

  public String getRefErrorMessage() {
    return rulesetView.getRefErrorMessage();
  }

  public void clickRefErrorCloseButton() {
    rulesetView.clickRefErrorCloseButton();
  }

  public String getSuccessMessage() {
    return rulesetView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception {
    Assert.assertTrue(rulesetView.getNoSuccessMessage());
  }

  public void cancelDeleteRuleset() {
    rulesetView.clickCancelButton();
  }

  public void verifyDeleteOption(String action) throws InterruptedException {
    Assert.assertTrue(rulesetView.verifyDeleteOption(action));
  }

  public void updateRulesetName(String newName) throws InterruptedException {
    rulesetView.updateRulesetName(newName);
    rulesetView.saveChanges();
  }

  public void updateRulesetName_FiftyPlusCharacter() throws InterruptedException {
    rulesetView.updateRulesetName_FiftyPlusCharacter();
    rulesetView.saveChanges();
  }

  public Integer getRulesetNameTextCount(String rulesetName){
   return rulesetView.getRulesetName(rulesetName);
  }

  public void updateRulesetDescription() throws InterruptedException {
    rulesetView.updateRulesetDescription();
    rulesetView.saveChanges();
  }

  public Integer getRulesetDescriptionTextCount(String rulesetName){
    return rulesetView.getRulesetDescription(rulesetName);
  }

  public String getLastModifiedText(String rulesetName){
    return rulesetView.getLastModifiedText(rulesetName);
  }

  public String getLastModifiedByText(String rulesetName){
    return rulesetView.getLastModifiedByText(rulesetName);
  }

  public String getLastModifiedTextOnRulesetTab(String rulesetName){
    return rulesetView.getLastModifiedTextOnRulesetTab(rulesetName);
  }

  public void moveToRulesName(String rulesName) throws InterruptedException {
    rulesetView.moveToRulesName(rulesName);
  }

  public void expandRulesName(String rulesName) throws InterruptedException {
    rulesetView.expandRulesName(rulesName);
  }

  public void updateLegsValue(String legsValue) throws InterruptedException {
    rulesetView.updateLegsValue(legsValue);

  }

  public void selectRuleState(String state, String ruleName) throws InterruptedException {
    rulesetView.moveToRulesName(ruleName);
    rulesetView.selectRuleState(state, ruleName);

  }

  public String getCurrentRuleStatus(String ruleName) throws InterruptedException {
    rulesetView.moveToRulesName(ruleName);
    return rulesetView.getCurrentRuleStatus(ruleName);
  }

  public void updateDutiesValue(String dutiesValue) throws InterruptedException {
    rulesetView.updateDutiesValue(dutiesValue);

  }

  public void clicksAwayFromParameter() throws InterruptedException {
    rulesetView.clicksAwayFromParameter();

  }

  public String getCurrentDutiesValue(String dutiesValue) {
    return rulesetView.getCurrentDutiesValue(dutiesValue);
  }

  public void selectDeadheadsValue(String changeDeadheadsValue) throws InterruptedException {
    rulesetView.selectDeadheadsValue(changeDeadheadsValue);

  }

  public String getCurrentDeadheadsStatus() {
    return rulesetView.getCurrentDeadheadsStatus();
  }

  public void moveToElementMaxDutyCredit() throws InterruptedException {
    rulesetView.moveToElementMaxDutyCredit();
  }

  public void selectMealValues(String newMeal) throws InterruptedException {
    rulesetView.selectMealValues(newMeal);

  }

  public String getCurrentMealDetails() {
    return rulesetView.getCurrentMealDetails();
  }

  public void updateOtherwiseValue(String otherwiseValue) throws InterruptedException {
    rulesetView.updateOtherwiseValue(otherwiseValue);

  }

  public Integer getCurrentCharacterCount() {
    return rulesetView.getCurrentCharacterCount();
  }

  public void updateNoMoreThanValue(String noMoreThanValue) throws InterruptedException {
    rulesetView.updateNoMoreThanValue(noMoreThanValue);

  }

  public Integer getCurrentCharacterCountForNoMoreThan() {
    return rulesetView.getCurrentCharacterCountForNoMoreThan();
  }

  public void checkDurationFormat() {
    rulesetView.checkDurationFormat();
  }

  public void updateCommercialDeadheadsValue(String commercialDeadheads) throws InterruptedException {
    rulesetView.updateCommercialDeadheadsValue(commercialDeadheads);

  }

  public Integer getUpdatedCommercialDeadheadsValue() {
    return rulesetView.getUpdatedCommercialDeadheadsValue();
  }

  public void updateSpecialTagValue(String specialTagValue) throws InterruptedException {
    rulesetView.updateSpecialTagValue(specialTagValue);

  }

  public Integer getCurrentCharacterCountForSpecialTagValue() {
    return rulesetView.getCurrentCharacterCountForSpecialTagValue();
  }

  public void updateSpecialTailNumber(String specialTailNumber) throws InterruptedException {
    rulesetView.updateSpecialTailNumber(specialTailNumber);

  }

  public Integer getCurrentCharacterCountForSpecialTailNumber() {
    return rulesetView.getCurrentCharacterCountForSpecialTailNumber();
  }

  public void setDepartureTime(String departureTime) throws InterruptedException {
    rulesetView.selectDepartureTime(departureTime);
  }

  public String getUpdatedTime() {
    return rulesetView.getUpdatedTime();
  }

  public void selectDate(String date) throws InterruptedException {
    rulesetView.selectDate(date);
  }

  public String getUpdatedDate() {
    return rulesetView.getUpdatedDate();
  }

  public void clickLinkText(String linkText) throws InterruptedException {
    rulesetView.clickLinkText(linkText);

  }

  public String getUpdatedBriefTime() {
    return rulesetView.getUpdatedBriefTime();
  }

  public String getUpdatedOtherwiseValue() {
    return rulesetView.getUpdatedOtherwiseValue();
  }

  public void waitForRulePage() {
    rulesetView.waitForRulePage();
  }

  public void updateIntegerValue(String integerValue) throws InterruptedException {
    rulesetView.updateIntegerValue(integerValue);
  }

  public void currentPlaceHolderIsEnabled() {
    rulesetView.currentPlaceHolderIsEnabled();
  }

  public void revertButtonIsEnabled() throws InterruptedException {
    rulesetView.revertButtonIsEnabled();
  }

  public void StateComboBoxOnOffIsEnabled() throws InterruptedException {
    rulesetView.StateComboBoxOnOffIsEnabled();
  }

  public void verifyRuleLinkText(String linkText) throws InterruptedException {
    rulesetView.verifyRuleLinkText(linkText);
  }

  public void verifyCurrentRuleSetName(String ruleSetName) throws InterruptedException {
    rulesetView.verifyCurrentRuleSetName(ruleSetName);
  }

  public void selectRuleSet(String ruleSetName) throws InterruptedException {
    rulesetView.selectRuleSet(ruleSetName);
  }

  public void verifyIntegerValueNotUpdated(String integerValue) throws InterruptedException {
    rulesetView.verifyIntegerValueNotUpdated(integerValue);
  }

  public void updateDurationValue(String durationValue) throws InterruptedException {
    rulesetView.updateDurationValue(durationValue);
  }

  public void verifyDurationValue(String durationValue) throws InterruptedException {
    rulesetView.verifyDurationValue(durationValue);
  }

  public void verifyRulesInRulesPageList() throws InterruptedException {
    rulesetView.verifyRulesInRulesPageList();
  }

  public void verifyExpandRulesAndDescription(String rulesName) throws InterruptedException {
    rulesetView.verifyExpandRulesAndDescription(rulesName);
  }

  public void changeRuleState(String state, String rulesName) throws InterruptedException {
    rulesetView.changeRuleState(state, rulesName);
  }

  public void verifyDisabledRuleState(String rulesName) throws InterruptedException {
    rulesetView.verifyDisabledRuleState(rulesName);
  }

  public void verifyRuleState(String state, String rulesName) throws InterruptedException {
    rulesetView.verifyRuleState(state, rulesName);
  }

  public void verifyManageRuleLinkTextAndClick() throws InterruptedException {
    rulesetView.verifyManageRuleLinkTextAndClick();
  }

  public void verifyManageRuleLinkText() throws InterruptedException {
    rulesetView.verifyManageRuleLinkText();
  }

  public void goBackToRules() throws InterruptedException {
    rulesetView.goBackToRules();
  }

  public void updateRuleDescriptionValue(String ruleValue) throws InterruptedException {
    rulesetView.updateRuleDescriptionValue(ruleValue);
  }

  public void verifyDisableRuleDescriptionValue() throws InterruptedException {
    rulesetView.verifyDisableRuleDescriptionValue();
  }

  public void verifyUpdateRuleDescriptionValue(String ruleValue) throws InterruptedException {
    rulesetView.verifyUpdateRuleDescriptionValue(ruleValue);
  }

  public void verifyRuleSetName(String ruleSetName) throws InterruptedException {
    rulesetView.verifyRuleSetName(ruleSetName);
  }

  public void clickCollapseButton(String ruleSetName) throws InterruptedException {
    rulesetView.clickCollapseButton(ruleSetName);
  }

  public void getNoCollapseButton(String ruleSetName) throws InterruptedException {
    Assert.assertTrue(rulesetView.getNoCollapseButton(ruleSetName));
  }

  public void clickExpandButton(String ruleSetName) throws InterruptedException {
    rulesetView.clickExpandButton(ruleSetName);
  }

  public void getNoExpandButton(String ruleSetName) throws InterruptedException {
    Assert.assertTrue(rulesetView.getNoExpandButton(ruleSetName));
  }

  public void verifyRuleSetAction(String action) throws InterruptedException {
    rulesetView.verifyRuleSetAction(action);
  }

  public void verifyRuleSetActionDisabled(String action) throws InterruptedException {
    rulesetView.verifyRuleSetActionDisabled(action);
  }

  public void verifyGetInfoOnEdit() throws InterruptedException {
    rulesetView.verifyGetInfoOnEdit();
  }

  public void verifyEditableFiledOnEditIsEnabled() throws InterruptedException {
    rulesetView.verifyEditableFiledOnEditIsEnabled();
  }

  public void verifyEditableFiledOnEditIsDisabled() throws InterruptedException {
    rulesetView.verifyEditableFiledOnEditIsDisabled();
  }

  public void openRulesetPageForUAT() {
    rulesetView.clickRulesCardForUAT();
  }

  public void clickToggleButtons() throws InterruptedException {
    rulesetView.clickToggleButtonsOfParticularRule();
  }

  public void verifyDurationValueAreEqual(String durationValue) throws InterruptedException {
    rulesetView.verifyDurationValueAreEqual(durationValue);
  }

  public void updateDurationTimeValue(String durationValue) throws InterruptedException {
    rulesetView.updateDurationTimeValue(durationValue);
  }

  public void setSelectTime(String departureTime) throws InterruptedException {
    rulesetView.selectTime(departureTime);
  }

  public String getUpdatedTimeValue() {
    return rulesetView.getUpdatedTimeValue();
  }

  public void updateIntAndDecimalValue(String defaultCostValue) throws InterruptedException {
    rulesetView.getIntAndDecimalValue(defaultCostValue);
  }

  public void updateParameterValue(String value, String parameterText) throws InterruptedException {
    rulesetView.updateParameterValue(value, parameterText);
  }

  public String getUpdatedValue(String parameterName) {
    return rulesetView.getUpdatedValue(parameterName);
  }

  public void getInputParameterStatus() {
    rulesetView.getInputParameterStatus();
  }

  public void verifyIntegerValueAreEqual(String durationValue) throws InterruptedException {
    rulesetView.verifyIntegerValueAreEqual(durationValue);
  }

  public void getTable() throws InterruptedException {
    rulesetView.getTableLink();
  }

  public void plusButtonForTable() throws InterruptedException {
    rulesetView.getAddButtonTable();
  }

  public void addDataTotheTable(String value1, String value2) throws InterruptedException {
    rulesetView.addDataTotheTable(value1, value2);
  }

  public void verifyDataOfTable(String value1, String value2) throws InterruptedException {
    rulesetView.verifyDataOfTable(value1, value2);
  }

  public void clickSave() {
    rulesetView.clickSave();
  }

  public void clickCancel() {
    rulesetView.clickCancel();
  }

  public void verifyDataIsNotAdded(String value1, String value2) throws InterruptedException {
    rulesetView.verifyDataIsNotAdded(value1, value2);
  }

  public void deleteRow() throws InterruptedException {
    rulesetView.deleteRow();
  }

  public void recordIsdeleted(String value1,String value2) throws InterruptedException {
    rulesetView.recordIsdeleted(value1,value2);
  }

  public void clickInsertRowAbove() throws InterruptedException {
    rulesetView.clickInsertRowAbove();
  }

  public void verifyInsertRecordAbove(String value1,String value2) throws InterruptedException {
    rulesetView.verifyInsertRecordAbove(value1,value2);
  }

  public void clickInsertRowBelow() throws InterruptedException {
    rulesetView.clickInsertRowBelow();
  }

  public void verifyInsertRecordBelow(String value1,String value2) throws InterruptedException {
    rulesetView.verifyInsertRecordBelow(value1,value2);
  }
  public void updateDecimalValue(String value) throws InterruptedException {
    rulesetView.updatDecimalValue(value);
  }
  public void verifyDecimalValueAreEqual(String durationValue) throws InterruptedException {
    rulesetView.verifyDecimalValueAreEqual(durationValue);
  }
//  public void verifyDecimalValueAreNotEqual(Integer durationValue) throws InterruptedException {
//    rulesetView.verifyIntegerValueAreEqual(durationValue);
//  }
public void updateSoftCostValue(String otherwiseValue) throws InterruptedException {
  rulesetView.updateSoftCostValue(otherwiseValue);
}
public void saveButtonIsInDisableState(){
  rulesetView.saveButtonIsDisabled();
  }
}




