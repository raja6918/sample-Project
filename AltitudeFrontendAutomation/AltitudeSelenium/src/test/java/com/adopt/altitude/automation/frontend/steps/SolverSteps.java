package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.solverRequest.SolverRequest;
import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.awt.*;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class SolverSteps extends AbstractSteps implements En {
  @Autowired
  private final static Logger LOGGER = LogManager.getLogger(StationsSteps.class);
  private SolverRequest solverRequest = new SolverRequest();

  public SolverSteps() {
    Given("^I'm in the Solver Page for scenario \"([^\"]*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
     scenariosPage.openDataItem(scenarioName);
      solverPage.goToSolverPage();
    });

    And("^I enter \"([^\"]*)\" Request Name$", (String requestName) -> {
      solverPage.setRequestName(requestName);
    });

    And("^I click on 'Add' Button$", () -> {
      solverPage.addButtonClick();
    });

    And("^I click on created solver \"([^\"]*)\"$", (String selectSolver) -> {
      solverPage.clickOnCreatedSolverRequest(selectSolver);
    });

    And("^I verify crew group tool tip error message as \"([^\"]*)\"$", (String crewGroupTooltipMessage) -> {
      solverPage.crewGroupTooltipMessage(crewGroupTooltipMessage);
    });

    And("^I verify Rule Set tool tip error message as \"([^\"]*)\"$", (String ruleSetTooltipMessage) -> {
      solverPage.ruleSetTooltipMessage(ruleSetTooltipMessage);
    });

    And("^I verify tool tip error message as \"([^\"]*)\" for crew group$", (String crewGroupTooltipMessage) -> {
      solverPage.crewGroupTooltipMessageWithRuleSet(crewGroupTooltipMessage);
    });

    And("^I verify tool tip error message as \"([^\"]*)\" for Rule Set$", (String ruleSetTooltipMessage) -> {
      solverPage.ruleSetTooltipMessageWithCrewGroup(ruleSetTooltipMessage);
    });

    And("^I verify a warning icon is displayed next to the field$", () -> {
      solverPage.verifyWarningIcon();
    });

    And("^I verify a warning icon is displayed next to the field Crew group$", () -> {
      solverPage.verifyWarningIconCrewGroup();
    });

    And("^I verify a warning icon is displayed next to the field Rule Set$", () -> {
      solverPage.verifyWarningIconRuleSet();
    });


    Then("^I Verify name of the deleted Crew Group \"([^\"]*)\" is displayed in the field$", (String expectedCrewGroupName) -> {
      String actualCrewGroupName = solverPage.currentCrewGroup(expectedCrewGroupName);
      assertEquals(actualCrewGroupName, expectedCrewGroupName);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^I Verify name of the edited Crew Group \"([^\"]*)\" is displayed in the field$", (String expectedCrewGroupName) -> {
      String actualCrewGroupName = solverPage.currentCrewGroup(expectedCrewGroupName);
      assertEquals(actualCrewGroupName, expectedCrewGroupName);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^I Verify name of the deleted Rule Set \"([^\"]*)\" is displayed in the field$", (String expectedRuleSetName) -> {
      String actualRuleSetName = solverPage.currentRuleSet(expectedRuleSetName);
      assertEquals(actualRuleSetName, expectedRuleSetName);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^I Verify name of the edited Rule Set \"([^\"]*)\" is displayed in the field$", (String expectedRuleSetName) -> {
      String actualRuleSetName = solverPage.currentRuleSet(expectedRuleSetName);
      assertEquals(actualRuleSetName, expectedRuleSetName);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^verify that the 'Add' button is disabled$", () -> {
      solverPage.verifyAddButtonEnabled();
    });

    And("^I enter description having characters greater than (\\d+)$", (Integer arg0) -> {
      solverPage.EnterTextDescriptionBox();
    });

    Then("^validate description character count as (\\d+) for Request \"([^\"]*)\"$", (Integer ExpectedDescriptionTextCount, String requestName) -> {
      TimeUnit.SECONDS.sleep(4);
      solverPage.clickOnCreatedSolverRequest(requestName);
      Integer actualDescriptionTextCount = solverPage.getdescriptionTextCount();
      assertEquals(ExpectedDescriptionTextCount, actualDescriptionTextCount);
    });

    When("^I update the name to \"([^\"]*)\" for \"([^\"]*)\" Request Name$", (String newRequestName, String existingRequestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(existingRequestName);
      solverPage.updateSolverRequestName(newRequestName);
    });

    Then("^Verify successfully the request name \"([^\"]*)\" is updated as expected$", (String newRequestName) -> {
      String actualRequestName = solverPage.getEditedRequestName(newRequestName);
      assertEquals(actualRequestName, newRequestName);
    });

    When("^I update the crew group \"([^\"]*)\" to \"([^\"]*)\" of request \"([^\"]*)\"$", (String existingCrewGroup, String newCrewGroup, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      solverPage.updateCrewGroup(newCrewGroup);
    });

    When("^I verify that the deleted Crew Group \"([^\"]*)\" is not in the list$", (String crewGroupName) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyCrewGroup(crewGroupName);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I verify that the edited Crew Group \"([^\"]*)\" is not in the list$", (String crewGroupName) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyCrewGroup(crewGroupName);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I verify that the edited Crew Group \"([^\"]*)\" is updated in the crew group list$", (String crewGroupName) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyEditedCrewGroup(crewGroupName);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I verify that the deleted Rule Set Group \"([^\"]*)\" is not in the list$", (String ruleSet) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyRuleSet(ruleSet);
      TimeUnit.SECONDS.sleep(1);
    });

    When("^I verify that the edited Rule Set Group \"([^\"]*)\" is updated in the list$", (String ruleSet) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyEditedRuleSet(ruleSet);
      TimeUnit.SECONDS.sleep(1);
    });

    Then("^Verify successfully the crew group  \"([^\"]*)\" is updated as expected$", (String newCrewGroup) -> {
      TimeUnit.SECONDS.sleep(2);
      String actualCrewGroup = solverPage.getEditedCrewGroup(newCrewGroup);
      assertEquals(actualCrewGroup, newCrewGroup);
    });

    When("^I update the rules \"([^\"]*)\" to \"([^\"]*)\" of request \"([^\"]*)\"$", (String existingRule, String newRule, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      solverPage.updateRule(newRule);
    });

    And("^I go to solver page$", () -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.goToSolverPage();
    });

    Then("^Verify successfully the rule \"([^\"]*)\" of request \"([^\"]*)\" is updated as expected$", (String newRule, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      String actualRule = solverPage.getEditedRule(newRule);
      assertEquals(actualRule, newRule);
    });

    When("^I update the recipe \"([^\"]*)\" to \"([^\"]*)\" of request \"([^\"]*)\"$", (String existingRecipe, String newRecipe, String requestName) -> {
      TimeUnit.SECONDS.sleep(6);
      solverPage.clickOnCreatedSolverRequest(requestName);
      solverPage.updateRecipe(newRecipe);
    });

    Then("^Verify successfully the Recipe \"([^\"]*)\" of request \"([^\"]*)\" is updated as expected$", (String newRecipe, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      String actualRecipe = solverPage.getEditedRecipe(newRecipe);
      assertEquals(actualRecipe, newRecipe);
    });

    And("^I provide the description as \"([^\"]*)\"$", (String description) -> {
      solverPage.EnterTextDescriptionBox(description);
    });

    When("^I update the description \"([^\"]*)\" to \"([^\"]*)\" of request \"([^\"]*)\"$", (String existingDescription, String newDescription, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      solverPage.updateDescription(newDescription);
    });

    Then("^Verify successfully the description \"([^\"]*)\" of request \"([^\"]*)\" is updated as expected$", (String newDescription, String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      String actualDescription = solverPage.getEditedDescription();
      assertEquals(actualDescription, newDescription);
    });

    When("^I click on launch button for solver request \"([^\"]*)\"$", (String requestName) -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.clickOnCreatedSolverRequest(requestName);
      solverPage.moveToSummaryLocation();
      solverPage.clickLaunchButton();
    });

    Then("^Verify successfully launch the Solver Request \"([^\"]*)\" with message \"([^\"]*)\"$", (String requestName, String launchMessage) -> {
     // TimeUnit.SECONDS.sleep(10);
      String actualMessage = solverPage.getLaunchMessage(launchMessage);
      assertEquals(launchMessage, actualMessage);
    });

    Then("^I verify that \"([^\"]*)\" is displayed in the popover$", (String expectedPopover) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualPopover = solverPage.getPopoverMessage(expectedPopover);
      assertEquals(expectedPopover, actualPopover);
    });

    Then("^I verify that Notification details has Trash can icon$", () -> {
      solverPage.CheckTrashCanIcon();
    });

    Then("^I verify that Notification details has Notification unread icon as New message indicator$", () -> {
      solverPage.CheckNotificationUnreadIcon();
    });

    Then("^I verify that encircled number above the bell icon is removed$", () -> {
      solverPage.verifyNoNotifications();
    });

    Then("^I delete notification one by one$", () -> {
      solverPage.clickDeleteIcon();
    });

    Then("^I wait for the Toast bar message$", () -> {
      solverPage.WaitForToastMessage();
    });

    Then("^I click on Solver link \"([^\"]*)\"$", (String solverLink) -> {
      solverPage.clickSolverLink(solverLink);
    });

    Then("^I click on Notification bell icon$", () -> {
      solverPage.clickNotifications();
    });

    Then("^I validate Date and Time for notification, <Example: Notification Date: 26 February , 2021, Notification Time 10:06>$", () -> {
      solverPage.dataTimeOfNotification();
    });

    Then("^I click on link Solver request \"([^\"]*)\"$", (String solverLinkOnNotification) -> {
      solverPage.solverLinkOnNotification(solverLinkOnNotification);
    });

    Then("^I verify that i redirected to \"([^\"]*)\" page$", (String expectedPageName) -> {
      String actualPageName = solverPage.getActualPage(expectedPageName);
      assertEquals(expectedPageName, actualPageName);
    });

    Then("^I get alert pop up saying \"([^\"]*)\"$", (String expectedPopUp) -> {
      String actualPopUp = solverPage.getActualPopUp(expectedPopUp);
      assertEquals(expectedPopUp, actualPopUp);
    });

    Then("^I verify that I am in \"([^\"]*)\" page$", (String pageName) -> {
      solverPage.getPageDetails(pageName);

    });

    Then("^I verify that I am in scenario \"([^\"]*)\"$", (String expectedScenarioName) -> {
      solverPage.getScenarioDetails(expectedScenarioName);

    });

    Then("^I click on button \"([^\"]*)\"$", (String switchScenarioButton) -> {
      solverPage.switchScenario(switchScenarioButton);
    });

    Then("^I Check the notification bell icon is active with count$", () -> {
      solverPage.CheckNotificationBellCount();
    });

    Then("^I verify that Notification details has same scenario name \"([^\"]*)\"$", (String expectedScenarioName) -> {
      String actualScenarioName = solverPage.getActualScenarioNameOnNotification(expectedScenarioName);
      assertEquals(expectedScenarioName, actualScenarioName);
    });

    Then("^I verify that Notification details has same solver name \"([^\"]*)\"$", (String expectedSolverName) -> {
      String actualSolverName = solverPage.getActualScenarioNameOnNotification(expectedSolverName);
      assertEquals(expectedSolverName, actualSolverName);
    });

    Then("^I verify that Notification details has either Solver's Fail or Completed image$", () -> {
      solverPage.CheckStatusImage();
    });

    Then("^I Check the updated notification bell icon count is incremented to (\\d+)$", (Integer expectedUpdatedNotificationCount) -> {
      solverPage.getUpdatedNotificationCount(expectedUpdatedNotificationCount);

    });

    Then("^I wait for the notification$", () -> {
      solverPage.waitForNotificationBellCount();
    });

    Then("^I verify that I am in correct Scenario page \"([^\"]*)\"$", (String expectedSolverPageName) -> {
      TimeUnit.SECONDS.sleep(8);
      String actualSolverPageName = solverPage.getActualSolverPageName(expectedSolverPageName);
      Assert.assertTrue(actualSolverPageName.contains(expectedSolverPageName));
    });

    Then("^Verify successfully launch the Solver Request \"([^\"]*)\" with message \"([^\"]*)\" for Daily$", (String requestName, String launchMessage) -> {
      TimeUnit.SECONDS.sleep(20);
      String actualMessage = solverPage.getLaunchMessage(launchMessage);
      assertEquals(launchMessage, actualMessage);
    });

    Then("^Verify Successfully all fields in the Solver Request Details are deactivated$", () -> {
      solverPage.verifyFieldIsEnabled();
    });

    Then("^Verify successfully status icon in the left panel changes from 'Ready to Launch' to Waiting of \"([^\"]*)\"$", (String requestName) -> {
      String existingIcon=solverRequest.leftPanelIcon;
      String getIcon = solverPage.verifyLeftPanelIcon(requestName);
      String result=getIcon.substring(getIcon.lastIndexOf("/"), getIcon.lastIndexOf(".")).replaceAll("/", "");
      String actualIcon=result.substring(0,result.indexOf("."));
      assertEquals(existingIcon, actualIcon);
    });

    Then("^Verify successfully the status 'Launching...' is displayed in the left pane of \"([^\"]*)\"$", (String requestName) -> {
      String existingIcon=solverRequest.leftPanelIcon;
      String getIcon = solverPage.verifyLeftPanelIcon(requestName);
      String result=getIcon.substring(getIcon.lastIndexOf("/"), getIcon.lastIndexOf(".")).replaceAll("/", "");
      String actualIcon=result.substring(0,result.indexOf("."));
      assertEquals(existingIcon, actualIcon);
    });

    Then("^Verify successfully timestamp is displayed in the left panel of solver request \"([^\"]*)\"$", (String requestName) -> {
      String timestamp=solverRequest.timestampText;
      String timestampText=timestamp+solverPage.verifyTimestamp();
      String getTimestampText = solverPage.getTimeStampText(timestamp);
      String actualTimestampText=(getTimestampText.substring(0,26));
      assertEquals(timestampText, actualTimestampText);
    });

    Then("^Verify successfully message \"([^\"]*)\" is displayed in the progress bar as expected for launch$", (String progressBarMessage) -> {
      String actualMessage = solverPage.getProgressBarMessageForLaunching(progressBarMessage);
      assertEquals(progressBarMessage, actualMessage);
    });

    Then("^^Verify successfully \"([^\"]*)\" Button should be enabled as expected$", (String buttonText) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyButtonEnabled(buttonText);
    });

    Then("^^Verify successfully \"([^\"]*)\" Button should be disabled as expected$", (String buttonText) -> {
      TimeUnit.SECONDS.sleep(1);
      solverPage.verifyButtonEnabled(buttonText);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^^I Verify successfully that buttons \"([^\"]*)\" are disabled as expected$", (String buttonText) -> {
      solverPage.isButtonDisabledOnSolver(buttonText);
    });

    Then("^^I Verify successfully that all fields are disabled as expected$", () -> {
      solverPage.isFieldsDisabledOnSolver();
    });

    Then("^Verify successfully message \"([^\"]*)\" is displayed in the progress bar after Solver Stop as expected$", (String progressBarMessage) -> {
      TimeUnit.SECONDS.sleep(20);
      String actualMessage = solverPage.getProgressBarMessage(progressBarMessage);
      if (actualMessage.equals("Stopped by user")) {
        assertEquals(progressBarMessage, actualMessage);
      } else {
        progressBarMessage = "Stopped internally: something went wrong";
        assertEquals(progressBarMessage, actualMessage);
      }
    });

    Then("^^Verify successfully \"([^\"]*)\" Button should be enabled after Solver Stop as expected$", (String buttonText) -> {
      TimeUnit.SECONDS.sleep(5);
      solverPage.verifyButtonEnabledOnStop(buttonText);
    });

    Then("^^Verify successfully \"([^\"]*)\" Button should be disabled after Solver Stop as expected$", (String buttonText) -> {
      TimeUnit.SECONDS.sleep(10);
      solverPage.verifyButtonEnabledOnStop(buttonText);
      TimeUnit.SECONDS.sleep(20);

    });

    And("^I click on Stop button for solver request$", () -> {
     // TimeUnit.SECONDS.sleep((long) 0.5);
      solverPage.clickStopButton();
    });

    And("^I verify that all checkboxes are enabled$", () -> {
      solverPage.verifyChkBoxEnabled();
    });

    And("^I verify that Filter icon is enabled and i search for solver request \"([^\"]*)\"$", (String solverName) -> {
      solverPage.verifyFilter(solverName);
    });

    And("^I verify that using Filter it is possible to search solver request \"([^\"]*)\"$", (String solverName) -> {
      solverPage.verifySolverNameOnFilter(solverName);
    });

    And("^I select solver requests \"([^\"]*)\"$", (String solverNames) -> {
      solverPage.selectSolver(solverNames);
    });

    And("^I confirm that possible to see a list of all Solver Requests \"([^\"]*)\"$", (String solverNames) -> {
      solverPage.listOfSolver(solverNames);
    });

    And("^I click solver requests \"([^\"]*)\"$", (String solverNames) -> {
      solverPage.SolverClick(solverNames);
    });


    And("^I de-select solver requests \"([^\"]*)\"$", (String solverNames) -> {
      solverPage.selectSolver(solverNames);
    });

    And("^I verify that i can see \"([^\"]*)\" in the Statistics comparision table$", (String solverNames) -> {
      solverPage.verifyStatisticsHeader(solverNames);
    });

    And("^I confirm that \"([^\"]*)\" is removed from the Statistics comparision table$", (String solverNames) -> {
      solverPage.verifyStatisticsHeaderRemoved(solverNames);
    });

    And("^I verify that \"([^\"]*)\" option is enabled and i click$", (String compare) -> {
      solverPage.verifyCompare(compare);
    });

    And("^I verify that Favorite icon is disabled$", () -> {
      solverPage.verifyFavoriteButtonDisabled();
    });

    And("^I verify that Favorite icon is enabled and i click on favourite$", () -> {
      solverPage.verifyFavoriteButtonEnabled();
    });

    And("^I confirm that Solver request \"([^\"]*)\" is marked as favourite$", (String solverRequestName) -> {
      solverPage.verifyFavoriteSolver(solverRequestName);
    });

    And("^Click on \"([^\"]*)\" button for solver request AUT_Solver_Request$", (String buttonText) -> {
      solverPage.clickPreviewButton(buttonText);
    });

    And("^I verify \"([^\"]*)\" button is enabled and i click$", (String buttonText) -> {
      solverPage.clickPreviewButton(buttonText);
    });

    And("^Click on \"([^\"]*)\" button and Then Verify that save has been successfully done with toast message \"([^\"]*)\"$", (String buttonText, String expectedSaveMessage) -> {
      solverPage.verifySavePairing(expectedSaveMessage,buttonText);
    });

    And("^I verify that crew group \"([^\"]*)\" is displayed and disabled on page$", (String crewGroupName) -> {
      solverPage.verifyCrewGroupOnPairing(crewGroupName);
    });

    And("^I verify that \"([^\"]*)\" is displayed on the page$", (String baseline) -> {
      solverPage.verifyBaselineOnPairing(baseline);
    });

    And("^I verify that add button is visible and disabled$", () -> {
      solverPage.verifyButtonDisabled();
    });

    And("^I verify that \"([^\"]*)\" is displayed on the pairing page$", (String utcDisplay) -> {
      solverPage.displayOnPairing(utcDisplay);
    });

    And("^I verify that \"([^\"]*)\" is displayed on the page and is enabled$", (String optionButton) -> {
      solverPage.verifyPairingOptionButton(optionButton);
    });

    Then("^Verify that \"([^\"]*)\" is disabled after the save solver result completed$", (String buttonText) -> {
      solverPage.verifySavePairingButtonEnabled(buttonText);
     // TimeUnit.SECONDS.sleep(20);
    });

    Then("^Verify that \"([^\"]*)\" is disabled in preview$", (String buttonText) -> {
      solverPage.verifySavePairingButtonEnabled(buttonText);
      // TimeUnit.SECONDS.sleep(20);
    });

    Then("^Then I close Preview tab$", () -> {
      solverPage.closeTab();
      // TimeUnit.SECONDS.sleep(20);
    });

    And("^I click on Solver Request \"([^\"]*)\"$", (String requestName) -> {
      solverPage.clickOnCreatedSolverRequest(requestName);
    });

    And("^Click on \"([^\"]*)\" button and Then Verify loader is displayed with message \"([^\"]*)\"$", (String buttonText,String expectedLoaderMessage) -> {
      solverPage.clickSavePairingButton(buttonText, expectedLoaderMessage);
      TimeUnit.SECONDS.sleep(5);
    });

    And("^Click on \"([^\"]*)\" button$", (String buttonText) -> {
      solverPage.clickSavePairing(buttonText);
    });

    And("^Click on \"([^\"]*)\" button after deleting preview ID$", (String buttonText) -> {
      TimeUnit.SECONDS.sleep(3);
      solverPage.clickSavePairingForError(buttonText);
    });
    Then("^Verify that \"([^\"]*)\" is disabled after refreshing the page$", (String buttonText) -> {
      solverPage.refreshPage();
      solverPage.verifySavePairingButtonEnabled(buttonText);
      TimeUnit.SECONDS.sleep(20);
    });
    Then("^i get the preview ID of the current scenario$", () -> {
      solverPage.getUrl();
      TimeUnit.SECONDS.sleep(5);
    });
    Then("^i Delete the Preview ID$", () -> {
      TimeUnit.SECONDS.sleep(2);
      solverPage.deletePreview();
      TimeUnit.SECONDS.sleep(80);

    });
    Then("^i get Error Message saying \"([^\"]*)\"$", (String errorMessage) -> {
      String currentError = solverPage.getMessage();
      Assert.assertEquals(errorMessage,currentError);
      TimeUnit.SECONDS.sleep(10);
    });
    Then("^I select \"([^\"]*)\" as solver name$", (String solverSearch) -> {
      solverPage.filterSolverName(solverSearch);
    });

    And("^Now I deselect \"([^\"]*)\" as solver name$", (String solverSearch) -> {
      solverPage.deSelectSolverName(solverSearch);
    });

    Then("^I select \"([^\"]*)\" from solver list$", (String solverChk) -> {
      solverPage.testChkBox(solverChk);
    });

    Then("^I see view reverts to solver detail mode saying \"([^\"]*)\"", (String expectedRefMessage) -> {
      TimeUnit.SECONDS.sleep(2);
      String currentMessage = solverPage.getNoMessageSolver();
      Assert.assertEquals(expectedRefMessage,currentMessage);

    });

    And("^I go to solver page now$", () -> {
      TimeUnit.SECONDS.sleep(2);
      dataHomePage.solverPage();
    });

    Then("^verify the alert count is updated with the notifications for scenario \"([^\"]*)\" with message \"([^\"]*)\"$", (String expectedScenario, String requestName) -> {
      TimeUnit.SECONDS.sleep(50);
      solverPage.ClickNotificationIcon();
      String actualScenario = solverPage.getCurrentScenario(expectedScenario);
      Assert.assertEquals(expectedScenario,actualScenario);
      String actualRequestName = solverPage.getCurrentSolverReqName(requestName);
      Assert.assertEquals(requestName,actualRequestName);
    });

    And("^I clear notification$", () -> {
      solverPage.clearNotifications();
    });

    And("^I close notification$", () -> {
      solverPage.closeNotifications();
    });

  }

  @Then("^verify successfully that solver request stopped with message \"([^\"]*)\"$")
  public void verifySolverRequestStopped(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = solverPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @When("^I provide the following data in the form Solver Request$")
  public void createSolverRequest(@Transpose List<SolverRequest> solverRequestList) throws InterruptedException {
    SolverRequest newRequest = solverRequestList.get(0);
    String RequestName = newRequest.getRequestName();
    solverRequest.setRequestName(newRequest.getRequestName());
    solverPage.fillOutAddSolverRequestForm(newRequest);
  }

  @When("^I click on the 'Add' Solver Request$")
  public void iClickOnTheAddSolverRequest() throws InterruptedException {
  //  TimeUnit.SECONDS.sleep(1);
    solverPage.addSolverRequest();
  }

  @When("^I verify that The Add button is visible and enabled$")
  public void iVerifyAddButtonVisibleEnabled() throws InterruptedException {
     solverPage.verifyAddSolverRequestButtonEnabled();
  }


  @And("^I click on Statistics$")
  public void iClickOnStatistics() throws InterruptedException {
    solverPage.clickStatistics();
  }

  @Then("^I click on Compare$")
  public void iClickOnCompare() throws InterruptedException {
    solverPage.clickCompare();
  }

  @And("^I select crew group as \"([^\"]*)\"$")
  public void iSelectCrewGroup(String crewGroup) throws InterruptedException {
    solverPage.clickCrewBaseDropdown(crewGroup);
  }

  @And("^I add static row data \"([^\"]*)\"$")
  public void iAddStaticRowData (String rowData) throws InterruptedException, AWTException {
    solverPage.addRowData(rowData);
  }

  @And("^I add same static row data \"([^\"]*)\" and get Message \"([^\"]*)\"$")
  public void iAddSameStaticRowData (String addSameRowData, String message) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
    solverPage.addSameRowData(addSameRowData, message);
  }

  @And("^I confirm that \"([^\"]*)\" is removed from the list of available statistics$")
  public void removeFromListStaticRowData (String addSameRowData) throws InterruptedException, AWTException {
    TimeUnit.SECONDS.sleep(1);
    solverPage.verifyValueNotInList(addSameRowData);
  }

  @Then("^I Verify that added crewgroup value has data as \"([^\"]*)\"$")
  public void iVerifyThatAddedCrewGroupValueHasDataAs(String data) throws InterruptedException {
    solverPage.verifyNewCrewData(data);
  }

  @And("^I click on 'Filter' for Solver$")
  public void iClickOnFilterForSolver() throws InterruptedException {
    solverPage.clickOnFilter();
  }

  @And("^I deselect all Solver Request$")
  public void iDeselectAllSelectedSolver() throws InterruptedException {
    solverPage.deselectAllSolver();
  }

  @Then("^I should be able to delete statistic from the table$")
  public void iClickOnDelete() throws InterruptedException {
    solverPage.clickDelete();
  }

  @Then("^I verify statistic types displayed in the combo-box of each row are listed in alphabetical order$")
  public void verifyValueAlphabetical() throws InterruptedException, AWTException {
    solverPage.verifyValueAlphabetical();
  }

  @Then("^I confirm the columns \"([^\"]*)\", \"([^\"]*)\" are added$")
  public void iVerifyTheColumnAreAdded(String firstHeader, String secondHeader) throws InterruptedException {
    solverPage.verifyHeaderData(firstHeader, secondHeader);
  }

  @Then("^I can view value of solver \"([^\"]*)\" and \"([^\"]*)\"$")
  public void ICanViewValueOfSolver(String firstHeader, String secondHeader) throws InterruptedException {
    solverPage.viewSolverValue(firstHeader, secondHeader);
  }

  @Then("^I can view value of solver \"([^\"]*)\" and \"([^\"]*)\" for crewbase \"([^\"]*)\"$")
  public void ICanViewValueOfSolver(String firstHeader, String secondHeader, String crewBase) throws InterruptedException {
    solverPage.viewSolverValue(firstHeader, secondHeader, crewBase);
  }

  @Then("^I confirm the columns \"([^\"]*)\" is removed$")
  public void iVerifyTheColumnAreAdded(String removeHeader) throws InterruptedException {
    solverPage.verifyRemoveHeaderData(removeHeader);
  }


  @Then("^verify successfully that solver request added with message \"([^\"]*)\"$")
  public void verifySolverRequestCreated(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = solverPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @Then("^verify the warning message \"([^\"]*)\" is displayed$")
  public void verifyInvalidRequestName(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = solverPage.getInvalidRequestNameMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @Then("^I confirm that at position \"([^\"]*)\" the statistics value is \"([^\"]*)\"$")
  public void iConfirmThatAtPositionTheStatisticsValueIs(String position, String value) throws InterruptedException {
    solverPage.verifyStatistics(position,value);

  }

  @Then("^I click on statistics value \"([^\"]*)\" and change to \"([^\"]*)\" and verify all the values in the corresponding row are changed$")
  public void iChangeStatisticsValue(String currentStatistics, String newStatistics) throws InterruptedException, AWTException {
    solverPage.changeStatistics(currentStatistics,newStatistics);

  }

  @Then("^Error Pop Up Should display with the Error Messages$")
  public void errorPopUpShouldDisplayWithTheErrorMessages() {
    solverPage.isErrorPopUpDisplyed();
  }

  @And("^I see view reverts to solver detail mode$")
  public void isSummaryTitleDispalyed() throws InterruptedException {
    solverPage.isSummaryTitleDispalyed();
  }

  @And("^I deselect Solver Request$")
  public void iDeselectSelectedSolver() throws InterruptedException {
    solverPage.clickSelectRequests();
  }
}
