package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.CrewGroupsView;
import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.PairingsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.util.concurrent.TimeUnit;

@Component
public class PairingsPage {

  @Autowired
  @Lazy(true)
  PairingsView pairingsView;

  @Autowired
  @Lazy(true)
  private DataHomeView dataHomeView;

  @Autowired
  @Lazy(true)
  private CrewGroupsView crewGroupsView;


  public void goToPairingsPage() {
    dataHomeView.clickHomeButton();
    pairingsView.getPairingsPage();
  }

  public void getNoneCrewGroup() {
    Assert.assertFalse(pairingsView.getNoneCrewGroup());
  }

  public void getNoneRuleset() {
    Assert.assertFalse(pairingsView.getNoneRuleset());
  }

  public void selectCrewGroupFirstTime(String crewGroup) throws InterruptedException {
    pairingsView.selectCrewGroupFirstTime(crewGroup);
  }

  public void selectPairing() throws InterruptedException {
    pairingsView.selectPairing();
  }

  public void selectOptionsFromPairing(String options) throws InterruptedException {
    pairingsView.selectOptionsFromPairing(options);
  }

  public void selectPairingWithFlagAlert(String alertText) throws InterruptedException, AWTException {
    pairingsView.selectPairingWithFlagAlert(alertText);
  }

  public void selectPairingWithInfractionAlert(String alertText) throws InterruptedException, AWTException {
    pairingsView.selectPairingWithInfractionAlert(alertText);
  }
  public void moveCursorOnCaution(String alertText) throws InterruptedException, AWTException {
    pairingsView.moveCursorOnCaution(alertText);
  }

  public void moveCursorOnFlag(String alertText) throws InterruptedException, AWTException {
    pairingsView.moveCursorOnFlag(alertText);
  }

  public void moveCursorOnInfraction(String alertText) throws InterruptedException, AWTException {
    pairingsView.moveCursorOnInfraction(alertText);
  }

  public void getNoAlertArea() throws Exception{
    Assert.assertTrue(pairingsView.getNoAlertArea());
  }

  public void selectPairingWithMoreThanThreeInfractionAlert(String alertText) throws InterruptedException, AWTException {
    pairingsView.selectPairingWithMoreThanThreeInfractionAlert(alertText);
  }

  public void scrollAndSelectPairingWithMoreThanThreeInfractionAlert(String alertText) throws InterruptedException, AWTException {
    pairingsView.scrollAndSelectPairingWithMoreThanThreeInfractionAlert(alertText);
  }

  public void selectPairingWithCautionAlert(String alertText) throws InterruptedException, AWTException {
    pairingsView.selectPairingWithCautionAlert(alertText);
  }

  public void verifyAlertTextForCaution(String alertText) {
    pairingsView.verifyAlertTextForCaution(alertText);
  }

  public void verifyAlertTextForFlag(String alertText) {
    pairingsView.verifyAlertTextForFlag(alertText);
  }

  public void verifyAlertTextForInfraction(String alertText) {
    pairingsView.verifyAlertTextForInfraction(alertText);
  }

  public void verifyEditRule(String alertText, String editRule) {
    pairingsView.verifyEditRule(alertText, editRule);
  }

  public void hoverOnAlertRow() throws InterruptedException, AWTException {
    pairingsView.hoverOnAlertRow();
  }

  public void verifyVerticalScrollBar()  {
    pairingsView.verifyVerticalScrollBar();
  }

  public void clickNewTab(String options) throws InterruptedException {
    pairingsView.clickNewTab(options);
  }

  public String getApplicationTitle(String title) throws InterruptedException {
    return pairingsView.getApplicationTitle(title);
  }

  public void isNotificationButtonEnabled(String notificationButton) {
    Assert.assertTrue(pairingsView.isNotificationButtonEnabled(notificationButton));
  }

  public void isHomeButtonDisabled() {
    Assert.assertTrue(pairingsView.isHomeButtonDisabled());
  }

  public void isUserMenuDisabled() {
    Assert.assertTrue(pairingsView.isUserMenuDisabled());
  }


  public void refreshPage()throws InterruptedException
  {
    pairingsView.refreshPage();
  }

  public String getPageTitle(String pageTitle) throws InterruptedException {
    return pairingsView.getPageTitle(pageTitle);
  }

  public String getParentTab(String ParentTab) throws InterruptedException {
    return pairingsView.getParentTab(ParentTab);
  }

  public void getParentTabScenario(String parentTabScenario) throws InterruptedException {
    pairingsView.getParentTabScenario(parentTabScenario);
  }

  public String getApplicationTab(String urlHeader) throws InterruptedException {
    return pairingsView.getApplicationTab(urlHeader);
  }

  public void getParentApplicationTab() throws InterruptedException {
    pairingsView.getParentApplicationTab();
  }

  public void checkBackNavigation() throws InterruptedException {
    pairingsView.checkBackNavigation();
  }

  public void confirmBackMessageRemoved(String linkBackMessage) {
    Assert.assertTrue(pairingsView.confirmBackMessageRemoved(linkBackMessage));
  }

  public void confirmBlackBackground() {
    Assert.assertTrue(pairingsView.confirmBlackBackground());
  }

  public void checkForwardNavigation() throws InterruptedException {
    pairingsView.checkForwardNavigation();
  }

  public void selectCrewGroup(String crewGroup) throws InterruptedException {
    pairingsView.selectCrewGroup(crewGroup);
  }

  public void getRulesetAndCrewGroup(String crewGroup, String ruleset) {
    pairingsView.getRulesetAndCrewGroup(crewGroup, ruleset);
  }

  public void ruleSetIsEnabled() {
    pairingsView.ruleSetIsEnabled();
  }

  public void crewGroupIsEnabled(String crewGroup) {
    pairingsView.crewGroupIsEnabled(crewGroup);
  }

  public String getRuleset(String ruleset) {
    return pairingsView.getRuleset(ruleset);
  }

  public void clickPlusButton() throws InterruptedException {
    pairingsView.clickPlusButton();
  }

  public String verifyTimeline(String timeline) {
    return pairingsView.verifyTimeline(timeline);
  }

  public void clickZoomIn() throws InterruptedException {
    pairingsView.clickZoomIn();
  }

  public void clickZoomInFiveTimes() throws InterruptedException {
    pairingsView.clickZoomInFiveTimes();
  }

   public void verifyAlertColorForCaution(String colorCode) throws InterruptedException, AWTException {
    pairingsView.verifyAlertColorForCaution(colorCode);
  }

  public void verifyAlertColorForFlag(String colorCode) throws InterruptedException, AWTException {
    pairingsView.verifyAlertColorForFlag(colorCode);
  }

  public void verifyAlertColorForInfraction(String colorCode) throws InterruptedException {
    pairingsView.verifyAlertColorForInfraction(colorCode);
  }

  public void verifyLineColor(String colorCode) throws InterruptedException, AWTException {
    pairingsView.verifyLineColor(colorCode);
  }

  public void verifyInChildTab(String verifyInChildTab) throws InterruptedException {
    pairingsView.verifyInChildTab(verifyInChildTab);
  }

  public boolean validateZoomFunctionality() throws InterruptedException {
    return pairingsView.validateZoomFunctionality();
  }

  public void getValueOnSecondCrewgroup(String crewGroup1,String crewGroup2) throws InterruptedException {
    Assert.assertTrue(pairingsView.getValueOnSecondCrewgroup(crewGroup1,crewGroup2));
  }

  public void getCrewGroup(String crewGroup){
    Assert.assertEquals(crewGroup,pairingsView.getCrewGroup(crewGroup));
  }

  public void updateCrewGroup(String newRuleset)throws InterruptedException{
    crewGroupsView.selectCrewGroupDefaultRuleSet(newRuleset);
    crewGroupsView.clickSaveButton();
    TimeUnit.SECONDS.sleep(2);
  }

  public void verifyCrewBases(String crewBase) throws InterruptedException{
    pairingsView.isDisplayedCrewBases(crewBase);
  }

  public void clickFilterButton_Timeline1 ()throws InterruptedException{
    pairingsView.clickFilterButton_Timeline1();
  }

  public void clickFilterButton_Timeline2 ()throws InterruptedException{
    pairingsView.clickFilterButton_Timeline2();
  }

  public void clickFilterButton_Timeline3 ()throws InterruptedException{
    pairingsView.clickFilterButton_Timeline3();
  }

  public void verifyTimeline1_Opens()throws InterruptedException{
    Assert.assertEquals("Timeline #1",pairingsView.getText_Timeline1());
  }

  public void verifyTimeline2_Opens()throws InterruptedException {
    Assert.assertEquals("Timeline #2", pairingsView.getText_Timeline2());
  }

  public void verifyTimeline3_Opens()throws InterruptedException{
    Assert.assertEquals("Timeline #3",pairingsView.getText_Timeline3());
  }

  public void clickCloseButton()throws InterruptedException{
    pairingsView.clickCloseButton();
  }

  public void clickCancelButton()throws InterruptedException{
    pairingsView.clickCancelButton();
  }

  public void clickApplyButton()throws InterruptedException{
    pairingsView.clickApplyButton();
  }
  public void applyButtonIsEnabled()throws InterruptedException{
   pairingsView.applyButtonIsEnabled();
  }

  public void getFilterTypeFieldText(String filterType)throws InterruptedException{
    Assert.assertEquals(filterType,pairingsView.getFilterTypeFieldText(filterType));
  }

  public void addButtonIsEnabled()throws InterruptedException{
    Assert.assertTrue(pairingsView.addButtonIsEnabled());
  }

  public void addButtonIsDisabled()throws InterruptedException{
    Assert.assertFalse(pairingsView.addButtonIsEnabled());
  }

  public void clearAllButtonIsEnabled()throws InterruptedException{
    Assert.assertTrue(pairingsView.clearAllButtonIsEnabled());
  }

  public void clearAllButtonIsDisabled()throws InterruptedException{
    Assert.assertFalse(pairingsView.clearAllButtonIsEnabled());
  }

  public void clickAddButton()throws InterruptedException {
    pairingsView.clickAddButton();
  }

  public void clickClearAllBtn()throws InterruptedException {
    pairingsView.clickClearAllBtn();
  }

  public void clickClearAllBtn_AfterAdd()throws InterruptedException {
    pairingsView.clickClearAllBtn_AfterAdd();
  }
  public void clickCriteriaBtn()throws InterruptedException {
    pairingsView.clickCriteriaBtn();
  }
  public void clickPairingFilter()throws InterruptedException {
    pairingsView.clickPairingFilter();
  }

  public  void clickParticularCriteria(String criteria){
    pairingsView.clickParticularCriteria(criteria);
  }
  public  void clickParticularFilterType(String FilterType){
    pairingsView.clickParticularFilterType(FilterType);
  }
  public void clickAddbutton()throws InterruptedException {
    pairingsView.clickAddbutton();
  }

  public  void selectSubCriteria(String sub_criteria){
    pairingsView.selectSubCriteria(sub_criteria);
  }

  public void selectSubCriteria_IsDeselected(String sub_criteria){
    Assert.assertFalse(pairingsView.selectSubCriteria_IsDeselected(sub_criteria));
  }

  public void getSubCriteriaAfterAddOperation(String sub_criteria){
    Assert.assertEquals(sub_criteria,pairingsView.getSubCriteriaAfterAddOperation(sub_criteria));
  }

  public void getSubCriteriaAfterAddOperationAndClearAll(String sub_criteria){
    Assert.assertEquals("",pairingsView.getSubCriteriaAfterAddOperation(sub_criteria));
  }

  public void clickSearchBox_subCriteria() {
    pairingsView.clickSearchBox_subCriteria();
  }

  public void  SearchBox_subCriteria_IsCleared(){
    Assert.assertTrue(pairingsView.SearchBox_subCriteria_IsCleared());
  }

  public void SendText_SearchBox_subCriteria(String sub_criteria){
    pairingsView.SendText_SearchBox_subCriteria(sub_criteria);
  }

  public void click_Clear_SearchBox_subCriteria() {
    pairingsView.click_Clear_SearchBox_subCriteria();
  }

  public void clickDeleteBtn() throws InterruptedException {
    pairingsView.clickDeleteBtn();
  }

  public void verifyMinLabelPresent()throws InterruptedException{
    Assert.assertTrue( pairingsView.verifyMinLabelPresent());  }

  public void verifyMaxLabelPresent()throws InterruptedException{
    Assert.assertTrue(  pairingsView.verifyMaxLabelPresent());  }

  public void enterMinValue(String min)throws InterruptedException{
    pairingsView.enterMinValue(min);
  }

  public void enterMaxValue(String max)throws InterruptedException{
    pairingsView.enterMaxValue(max);
  }

  public void   verifyErrorMessage(String msg)throws InterruptedException{
    Assert.assertEquals( pairingsView.verifyErrorMessage(),msg);
  }

  public void applyButtonEnabled()throws InterruptedException{
    pairingsView.applyButtonEnabled();
  }
  public void clickAddButton_DutyCriteria()throws InterruptedException {
    pairingsView.clickAddButton_DutyCriteria();
  }

  public void setStartTime(String startTime) throws InterruptedException {
    pairingsView.selectStartTime(startTime);
  }

  public void setEndTime(String endTime) throws InterruptedException {
    pairingsView.selectEndTime(endTime);
  }
  public void setStartDateTime(String startDateTime) throws InterruptedException {
    pairingsView.setStartDate(startDateTime);
  }

  public void setEndDateTime(String startDateTime) throws InterruptedException {
    pairingsView.setEndDate(startDateTime);
  }
  public void verifyErrorMessageOnDate(String msg)throws InterruptedException{
    Assert.assertEquals( pairingsView.verifyErrorMessageOnDate(),msg);
  }

  public void VerifyLastFilterEnabled()throws InterruptedException{
    Assert.assertTrue( pairingsView.lastFilterIsEnabled());
  }

  public void VerifyLastFilterDisabled()throws InterruptedException{
    Assert.assertFalse( pairingsView.lastFilterIsEnabled());
  }

  public void clickLastFilterButton()throws InterruptedException{
     pairingsView.clickLastFilterBtn();
  }

  public void selectSubCriteria_IsSelected(String sub_criteria){
    Assert.assertTrue(pairingsView.selectSubCriteria_IsDeselected(sub_criteria));
  }

  public void verifyFilterPaneClosed() {
    Assert.assertTrue(pairingsView.filterButton_Timeline1IsDisplayed());
  }

  public void clickTimelineCloseBtn()throws InterruptedException{
    pairingsView.clickTimelineCloseBtnForTimelineTwo();
  }

  public void verifyDropDownValues()throws InterruptedException{
    pairingsView.verifyDropDownValues();
  }

  public void clickAddButton_FlightCriteria()throws InterruptedException{
    pairingsView.clickAddButton_FlightCriteria();
  }

  public void getFilterCount()throws InterruptedException{
    Assert.assertTrue(pairingsView.getFilterCount());
  }

  public void getFilterCount_timelineOne()throws InterruptedException{
    Assert.assertTrue(pairingsView.getFilterCount_timelineOne());
  }
  public void getFilterCount_timelineTwo()throws InterruptedException{
    Assert.assertTrue(pairingsView.getFilterCount_timelineTwo());
  }
  public void getFilterCount_timelineThree()throws InterruptedException{
    Assert.assertTrue(pairingsView.getFilterCount_timelineThree());
  }
  public void verifyFilterExpressionCleared()throws InterruptedException{
    Assert.assertTrue(pairingsView.verifyFilterExpressionClearedForTimelineOne());
  }

  public void clearFilterButton_Timeline1 ()throws InterruptedException{
    pairingsView.clearFilterButton_Timeline1();
  }

  public void clearFilterButton_Timeline2 ()throws InterruptedException{
    pairingsView.clearFilterButton_Timeline2();
  }

  public void verifyFilterCountBefore_AfterRefresh()throws InterruptedException{
    Assert.assertTrue(pairingsView.verifyFilterCountBefore_AfterRefresh());
  }

  //public void verifyFilterCountBefore_AfterNavigate()throws InterruptedException{
    //Assert.assertTrue(pairingsView.verifyFilterCountBefore_AfterNavigate());
 // }
  public void verifyFilterCountBefore_AfterNavigate()throws InterruptedException{
    Assert.assertTrue(pairingsView.verifyFilterCountBefore_AfterNavigateToTimelineOne());
  }

  public void verifyErrorMessage_durationFormat(String msg)throws InterruptedException{
    Assert.assertEquals( pairingsView.verifyErrorMessage_durationFormat(),msg);
  }

  public void verifyErrorMessage_minuteValidation(String msg)throws InterruptedException{
    Assert.assertEquals( pairingsView.verifyErrorMessage_minuteValidation(),msg);
  }

    public void verifyCanvas() throws InterruptedException{
    pairingsView.verifyCanvas();

    }
  public boolean TimelineOneIcon ()throws InterruptedException{
    if(pairingsView.isTimelineOneIconDisplayed()){
      return true;
    }else {
      return false;
  }}
  public boolean TimelineTwoIcon ()throws InterruptedException{
    if(pairingsView.isTimelineTwoIconDisplayed()){
      return true;
    }else {
      return false;
    }}

  public void displayAllPairingLink() {
    pairingsView.clickOnDisplayAllPairing();
  }

  public void filterCountBeforeSwitchToScenario() throws InterruptedException {
    pairingsView.getFilterCount_timelineOne_before_switchToScenario();
  }

  public void filterCountAfterSwitchToScenario() throws InterruptedException {
    pairingsView.getFilterCount_timelineOne_after_switchToScenario();
  }

  public void getFilterCountAfterClickOnClear() throws InterruptedException {
    Assert.assertTrue(pairingsView.getFilterCountAfterClickOnClearFilter());
  }

  public void getFlightFilterType(String filterType) throws InterruptedException {
    pairingsView.getFlightFilterType(filterType);
  }
  }

