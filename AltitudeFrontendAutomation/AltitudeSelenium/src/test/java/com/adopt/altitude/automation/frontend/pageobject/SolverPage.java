package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.frontend.data.solverRequest.SolverRequest;
import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.SolverView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class SolverPage {

  @Autowired
  @Lazy(true)
  SolverView solverView;

  @Autowired
  @Lazy(true)
  private DataHomeView dataHomeView;

  public void goToSolverPage() {
    dataHomeView.clickHomeButton();
    solverView.getSolverpage();
  }

  public void addSolverRequest() throws InterruptedException {
    solverView.clickAddSolverRequest();
  }

  public void verifyAddSolverRequestButtonEnabled() throws InterruptedException {
    solverView.verifyAddSolverRequestButtonEnabled();
  }

  public void clickStatistics() throws InterruptedException {
    solverView.clickStatistics();
  }

  public void clickCompare() throws InterruptedException {
    solverView.clickCompare();
  }

  public void clickDelete() throws InterruptedException {
    solverView.clickDelete();
  }

  public void clickCrewBaseDropdown(String crewGroup) throws InterruptedException {
     solverView.clickCrewBaseDropdown(crewGroup);
  }

  public void verifyValueAlphabetical() throws InterruptedException, AWTException {
    solverView.verifyValueAlphabetical();
  }

  public void addRowData(String rowData) throws InterruptedException, AWTException {
    solverView.addRow(rowData);
  }

  public void addSameRowData(String addSameRowData, String message) throws InterruptedException, AWTException {
    solverView.addSameRowData(addSameRowData, message);
  }

  public void verifyValueNotInList(String addSameRowData) throws InterruptedException, AWTException {
    solverView.verifyValueNotInList(addSameRowData);
  }

  public void clickOnFilter() throws InterruptedException {
    solverView.clickFilter();
  }

  public void deselectAllSolver() throws InterruptedException {
    solverView.clickSelectAllRequests();
  }

  public String getNoMessageSolver() {
    return solverView.getMessageNoSolver();
  }

  public void filterSolverName(String solverName) throws InterruptedException {
    solverView.enterFilterSolverName(solverName);
  }

  public void deSelectSolverName(String solverName) throws InterruptedException {
    solverView.deSelectSolverName(solverName);
  }

  public void testChkBox(String solverName) throws InterruptedException {
    solverView.testChkBox(solverName);
  }


  public void verifyStatistics(String position, String value) throws InterruptedException {
     solverView.verifyStatistics(position, value);
  }

  public void changeStatistics(String currentStatistics, String newStatistics) throws InterruptedException, AWTException {
    solverView.changeStatistics(currentStatistics, newStatistics);
  }

  public void verifyNewCrewData(String value) throws InterruptedException {
    solverView.verifyNewCrewData(value);
  }

  public void verifyHeaderData(String firstHeader, String secondHeader) throws InterruptedException {
    solverView.verifyHeaderTitle(firstHeader, secondHeader);
  }

  public void viewSolverValue(String firstHeader, String secondHeader)  {
    solverView.viewSolverValue(firstHeader, secondHeader);
  }

  public void viewSolverValue(String firstHeader, String secondHeader, String crewBase) throws InterruptedException {
    solverView.viewSolverValue(firstHeader, secondHeader, crewBase);
  }

  public void verifyRemoveHeaderData(String removeHeader) throws InterruptedException {
    solverView.verifyRemoveHeaderTitle(removeHeader);
  }


  public void fillOutAddSolverRequestForm(SolverRequest solverRequest)throws InterruptedException {
    solverView.setRequestName(solverRequest.getRequestName());
    solverView.selectSolverTask(solverRequest.getSolverTask());
    solverView.selectCrewGroup(solverRequest.getCrewGroup());
    solverView.selectRules(solverRequest.getRules());
    solverView.selectRecipe(solverRequest.getRecipe());
  }

  public void addButtonClick() {
    solverView.addButtonClick();
  }

  public void verifyAddButtonEnabled() {
    Assert.assertFalse(solverView.isAddButtonEnabled());
  }

  public void EnterTextDescriptionBox() {
    solverView.EnterTextdescriptionBox();
  }

  public void EnterTextDescriptionBox(String description) {
    solverView.EnterTextdescriptionBox(description);
  }

  public void clickOnCreatedSolverRequest(String requestName) {
    solverView.getSelectCreatedSolverRequest(requestName);
  }

  public Integer getdescriptionTextCount() {
    return solverView.getdescriptionTextCount();
  }

  public String getSuccessMessage() {
    return solverView.getSuccessMessage();
  }

  public String getInvalidRequestNameMessage() {
    return solverView.getInvalidRequestNameMessage();
  }

  public void setRequestName(String name) {
    solverView.setRequestName(name);
  }

  public void updateSolverRequestName(String newName) {
    solverView.updateRequestName(newName);
  }

  public String getEditedRequestName(String RequestName) {
    return solverView.getUpdatedRequestName(RequestName);
  }

  public void updateCrewGroup(String newCrewGroup) {
    solverView.updateCrewGroup(newCrewGroup);
  }

  public String getEditedCrewGroup(String newCrewGroup) {
    return solverView.getUpdatedCrewGroup(newCrewGroup);
  }

  public void updateRule(String newRule) {
    solverView.updateRule(newRule);
  }

  public String getEditedRule(String newRule) {
    return solverView.getUpdatedRule(newRule);
  }

  public void updateRecipe(String newRecipe) throws InterruptedException {
    solverView.updateRecipe(newRecipe);
  }

  public String getEditedRecipe(String newRecipe) {
    return solverView.getUpdatedRecipe(newRecipe);
  }

  public void updateDescription(String newDescription) {
    solverView.updateDescription(newDescription);
  }

  public String getEditedDescription() {
    return solverView.getUpdateDescription();
  }

  public void clickLaunchButton() {
    solverView.getLaunchButton();
  }

  public String getLaunchMessage(String LaunchMessage) throws InterruptedException {
    return solverView.getLaunchMessage(LaunchMessage);
  }

  public void verifyFieldIsEnabled() {
    Assert.assertFalse(solverView.verifyCrewGroupIsEnabled());
    Assert.assertFalse(solverView.verifySolverTaskIsEnabled());
    Assert.assertFalse(solverView.verifyRulesIsEnabled());
    Assert.assertFalse(solverView.verifyRecipeIsEnabled());
    Assert.assertFalse(solverView.verifyScopeIsEnabled());
  }

  public String verifyLeftPanelIcon(String requestName) {
    return solverView.verifyLeftPanelIcon(requestName);
  }

  public String verifyTimestamp() {
    Format formatter = new SimpleDateFormat("dd-MMM-yyyy");
    String date = formatter.format(new Date());
    return date;
  }

  public String getTimeStampText(String text) {
    return solverView.getTimeStampText(text);
  }

  public String getProgressBarMessage(String progressBarMessage) {
    return solverView.getProgressBarMessage(progressBarMessage);
  }

  public String getProgressBarMessageForLaunching(String progressBarMessage) throws InterruptedException {
    return solverView.getProgressBarMessageForLaunching(progressBarMessage);
  }

  public void verifyButtonEnabled(String buttonText) {
    if ((buttonText == "Stop")) {
      Assert.assertTrue(solverView.isButtonEnabled(buttonText));
    }

    else if(((buttonText == "Launch"))) {
      Assert.assertFalse(solverView.isButtonEnabled(buttonText));
    }

  }

  public void verifyButtonEnabledOnStop(String buttonText) throws InterruptedException {
    if ((buttonText == "Stop") || (buttonText == "Favorite") || (buttonText == "Preview"))  {
      Assert.assertFalse(solverView.isButtonEnabledAfterStop(buttonText));
    }

   else if ((buttonText == "Launch")) {
      Assert.assertTrue(solverView.isButtonEnabledAfterStop(buttonText));
    }

  }

  public void clickStopButton() throws InterruptedException
  {
    solverView.clickStopButton();
  }

  public void clickPreviewButton(String buttonText) throws InterruptedException
  {
    solverView.clickPreviewButton(buttonText);
  }

  public void clickSavePairing(String buttonText) throws InterruptedException
  {
    solverView.clickSavePairing(buttonText);
  }

  public void clickSavePairingForError(String buttonText) throws InterruptedException
  {
    solverView.clickSavePairingForError(buttonText);
  }

  public void verifySavePairing(String expectedMessage,String buttonText) throws InterruptedException
  {
    solverView.verifySavePairing(expectedMessage,buttonText);
  }

  public void verifyCrewGroupOnPairing(String crewGroupName) throws InterruptedException
  {
    solverView.verifyCrewGroupOnPairing(crewGroupName);
  }

  public void verifyBaselineOnPairing(String baseline) throws InterruptedException
  {
    solverView.verifyBaselineOnPairing(baseline);
  }

  public void verifyButtonDisabled() throws InterruptedException
  {
    solverView.verifyButtonDisabled();
  }

  public void verifyPairingOptionButton(String optionButton) throws InterruptedException
  {
    solverView.verifyPairingOptionButton(optionButton);
  }

  public void displayOnPairing(String utcDisplay) throws InterruptedException
  {
    solverView.displayOnPairing(utcDisplay);
  }


  public void clickSavePairingButton(String buttonText,String expectedLoaderMessage) throws InterruptedException
  {
    solverView.verifyLoader(buttonText, expectedLoaderMessage);
  }

  public void verifySavePairingButtonEnabled(String buttonText)
  {
    Assert.assertFalse(solverView.IsSavePairingButtonEnabled(buttonText));
  }

  public void closeTab()
  {
    solverView.closeTab();
  }


  public void refreshPage()throws InterruptedException
  {
    solverView.refreshPage();
  }

  public void getUrl()throws InterruptedException
  {
    solverView.getURL();
  }

  public void deletePreview() throws InterruptedException, ClientException {
    solverView.deletePreview();
  }

  public String getMessage() {
    return solverView.getMessage();
  }

  public String getCurrentScenario(String scenario)throws InterruptedException {
    return solverView.getCurrentScenario( scenario);
  }

  public String getCurrentSolverReqName(String solverReqName) {
    return solverView.getCurrentSolverReqName(solverReqName);
  }

  public void ClickNotificationIcon()throws InterruptedException {
    solverView.ClickNotificationIcon();
  }
  public void clearNotifications()throws InterruptedException {
    solverView.clearNotifications();
  }

  public void closeNotifications()throws InterruptedException {
    solverView.closeNotifications();
  }

  public void WaitForToastMessage()throws InterruptedException {
    solverView.WaitForToastMessage();
  }

  public void clickSolverLink(String solverLink) throws InterruptedException {
    solverView.clickSolverLink(solverLink);
  }

  public void clickNotifications()throws InterruptedException {
    solverView.clickNotifications();
  }

  public void solverLinkOnNotification(String solverLinkOnNotification) throws InterruptedException {
    solverView.solverLinkOnNotification(solverLinkOnNotification);
  }

  public String getActualPage(String actualPage) throws InterruptedException {
    return solverView.getActualPage(actualPage);
  }

  public void CheckNotificationBellCount()throws InterruptedException {
    solverView.CheckNotificationBellCount();
  }

  public String getActualScenarioNameOnNotification(String expectedScenarioName) throws InterruptedException {
    return solverView.getActualScenarioNameOnNotification(expectedScenarioName);
  }

  public String getActualSolverNameOnNotification(String expectedSolverName) throws InterruptedException {
    return solverView.getActualSolverNameOnNotification(expectedSolverName);
  }

  public void CheckStatusImage()throws InterruptedException {
    solverView.CheckStatusImage();
  }

  public void getUpdatedNotificationCount(Integer UpdatedNotificationCount)throws InterruptedException {
    solverView.getUpdatedNotificationCount(UpdatedNotificationCount);
  }

  public void waitForNotificationBellCount()throws InterruptedException {
    solverView.waitForNotificationBellCount();
  }

  public String getActualSolverPageName(String expectedSolverPageName) throws InterruptedException {
    return solverView.getActualSolverPageName(expectedSolverPageName);
  }

  public String getActualPopUp(String actualPopUp) throws InterruptedException {
    return solverView.getActualPopUp(actualPopUp);
  }

  public void switchScenario(String switchScenarioButton) throws InterruptedException {
    solverView.switchScenario(switchScenarioButton);
  }

  public void getPageDetails( String pageName) throws InterruptedException {
    solverView.getPageDetails(pageName);
  }

  public void getScenarioDetails(String expectedScenarioName) throws InterruptedException {
    solverView.getScenarioDetails(expectedScenarioName);
  }

  public String getPopoverMessage(String expectedPopover) throws InterruptedException {
    return solverView.getPopoverMessage(expectedPopover);
  }

  public void CheckTrashCanIcon()throws InterruptedException {
    solverView.CheckTrashCanIcon();
  }

  public void CheckNotificationUnreadIcon()throws InterruptedException {
    solverView.CheckNotificationUnreadIcon();
  }

  public void verifyNoNotifications()throws InterruptedException {
    Assert.assertTrue(solverView.verifyNoNotifications());
  }

  public void clickDeleteIcon()throws InterruptedException {
    solverView.clickDeleteIcon();
  }

  public void dataTimeOfNotification()throws InterruptedException {
    solverView.dataTimeOfNotification();
  }

  public void crewGroupTooltipMessage(String crewGroupTooltipMessage) throws InterruptedException {
    solverView.crewGroupTooltipMessage(crewGroupTooltipMessage);
  }

  public void ruleSetTooltipMessage(String ruleSetTooltipMessage) throws InterruptedException {
    solverView.ruleSetTooltipMessage(ruleSetTooltipMessage);
  }

  public String currentCrewGroup(String currentCrewGroup) throws InterruptedException {
    return solverView.currentCrewGroup(currentCrewGroup);
  }

  public String currentRuleSet(String currentRuleSet) throws InterruptedException {
    return solverView.currentRuleSet(currentRuleSet);
  }

  public void verifyCrewGroup(String crewGroup) throws InterruptedException {
    solverView.verifyCrewGroup(crewGroup);
  }

  public void verifyEditedCrewGroup(String crewGroup) throws InterruptedException {
    solverView.verifyEditedCrewGroup(crewGroup);
  }

  public void verifyRuleSet(String ruleSet) throws InterruptedException, AWTException {
    solverView.verifyRuleSet(ruleSet);
  }

  public void verifyEditedRuleSet(String ruleSet) throws InterruptedException {
    solverView.verifyEditedRuleSet(ruleSet);
  }

  public void verifyWarningIcon() throws InterruptedException {
    solverView.verifyWarningIcon();
  }

  public void verifyWarningIconCrewGroup() throws InterruptedException {
    solverView.verifyWarningIconCrewGroup();
  }

  public void verifyWarningIconRuleSet() throws InterruptedException {
    solverView.verifyWarningIconRuleSet();
  }

  public void crewGroupTooltipMessageWithRuleSet(String crewGroupTooltipMessage) throws InterruptedException {
    solverView.crewGroupTooltipMessageWithRuleSet(crewGroupTooltipMessage);
  }

  public void ruleSetTooltipMessageWithCrewGroup(String ruleSetTooltipMessage) throws InterruptedException {
    solverView.ruleSetTooltipMessageWithCrewGroup(ruleSetTooltipMessage);
  }

  public void verifyChkBoxEnabled() throws InterruptedException {
    solverView.verifyChkBoxEnabled();
  }

  public void verifyFilter(String solverName) throws InterruptedException {
    solverView.verifyFilter(solverName);
  }

  public void verifySolverNameOnFilter(String solverName) throws InterruptedException {
    solverView.verifySolverNameOnFilter(solverName);
  }

  public void selectSolver(String solverNames) throws InterruptedException {
    solverView.selectSolver(solverNames);
  }

  public void listOfSolver(String solverNames) throws InterruptedException {
    solverView.listOfSolver(solverNames);
  }

  public void SolverClick(String solverNames) throws InterruptedException {
    solverView.SolverClick(solverNames);
  }

  public void verifyStatisticsHeader(String solverNames) throws InterruptedException {
    solverView.verifyStatisticsHeader(solverNames);
  }

  public void verifyStatisticsHeaderRemoved(String solverNames) throws InterruptedException {
    solverView.verifyStatisticsHeaderRemoved(solverNames);
  }

  public void verifyCompare(String compare) throws InterruptedException {
    solverView.verifyCompare(compare);
  }

  public void verifyFavoriteButtonDisabled() throws InterruptedException {
    solverView.verifyFavoriteButtonDisabled();
  }

  public void verifyFavoriteButtonEnabled() throws InterruptedException {
    solverView.verifyFavoriteButtonEnabled();
  }

  public void verifyFavoriteSolver(String solverRequestName) throws InterruptedException {
    solverView.verifyFavoriteSolver(solverRequestName);
  }

  public void isButtonDisabledOnSolver(String buttonText) throws InterruptedException {
    solverView.isButtonDisabledOnSolver(buttonText);
  }

  public void isFieldsDisabledOnSolver() throws InterruptedException {
    solverView.isFieldsDisabledOnSolver();
  }
  public void isErrorPopUpDisplyed(){
    boolean isErrorPopUpDisplayed=solverView.isPopUpWindowDisplayed();
    Assert.assertEquals(true,isErrorPopUpDisplayed);
  }

  public void isSummaryTitleDispalyed() throws InterruptedException {
    solverView.isSummaryTitleDispalyed();
  }

  public void clickSelectRequests() throws InterruptedException {
    solverView.clickSelectRequests();
  }
  public void moveToSummaryLocation() throws InterruptedException {
    solverView.goToSummaryTextLocation();
  }

}
