package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.position.Position;
import com.adopt.altitude.automation.frontend.validations.PositionsValidation;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.concurrent.TimeUnit;

public class PositionsSteps extends AbstractSteps implements En {

   @Autowired
   private PositionsValidation validator;

   private Position            position = new Position();

   public PositionsSteps() {

     When("^I open positions page$", () -> {
       dataHomePage.openPositionsPage();
     });

     When("^I open rules page$", () -> {
       dataHomePage.openRulesetPageOnly();
     });

     Then("^The positions page legend shows 'view-only' beside the scenario name$", () -> {
       String scenarioStatus = positionsPage.getScenarioStatus();
       validator.verifyTextContains(scenarioStatus, "view-only");
     });

     When("^I count the total positions in table$", () -> {
       TimeUnit.SECONDS.sleep(1);
       positionsPage.getPositionsCount();
     });

      addPosition();

    editPosition();
    Then("^the message \"([^\"]*)\" for position is displayed$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = positionsPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

     When("^I click on Positions icon in left panel$", () -> {
       TimeUnit.SECONDS.sleep(1);
       positionsPage.clickPositionLeftpanelIcon();
     });

     When("^I delete position \"([^\"]*)\"$", (String position) -> {
       TimeUnit.SECONDS.sleep(1);
       positionsPage.openDeletePositionDrawer(position);
       positionsPage.deletePositionConfirmation();
     });

     Then("^verify the reference error for position \"([^\"]*)\" is displayed$", (String expectedRefErrorMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualRefErrorMessage = positionsPage.getRefErrorMessage();
       validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
     });

     And("^I click on close button for the reference error in Position$", () -> {
       positionsPage.clickRefErrorCloseButton();
     });

     Then("^the message \"([^\"]*)\" is displayed$", (String expectedSuccessMessage) -> {
       TimeUnit.SECONDS.sleep(1);
       String actualMessage = positionsPage.getSuccessMessage();
       validator.verifyText(expectedSuccessMessage, actualMessage);
     });

     When("^I cancel delete position \"([^\"]*)\"$", (String position) -> {
       TimeUnit.SECONDS.sleep(1);
       positionsPage.openDeletePositionDrawer(position);
       positionsPage.cancelDeletePosition();
     });

     Then("^verify successfully that no deletion happens for Position$", () -> {
       positionsPage.verifyNoSuccessMessage();
     });
   }

   private void addPosition() {
      Given("^Positions page for scenario \"(.*)\" is displayed$", (String scenarioName) -> {
        scenariosPage.clickOnFilterCreatedByAnyone();
         scenariosPage.openDataItem(scenarioName);
         dataHomePage.openPositionsPage();
         validator.verifyPageIsLoaded(positionsPage);
      });

      When("^I add the Position \"(.*)\" with code \"(.*)\" type as \"(.*)\"$", (String name, String code, String type) -> {
         position.setCode(code);
         position.setName(name);
         position.setType(type);

         positionsPage.openNewPositionDrawer();
         positionsPage.fillInPositionForm(position);

         TimeUnit.SECONDS.sleep(1);
         positionsPage.addPosition();
      });

      When("^I try to add a Position with invalid name \"(.*)\"$", (String name) -> {
         positionsPage.openNewPositionDrawer();
         positionsPage.setName(name);
      });

      When("^I try to add a Position with invalid code \"(.*)\"$", (String code) -> {
         positionsPage.openNewPositionDrawer();
         positionsPage.setCode(code);
      });

      When("^I try to add a Position with name \"(.*)\" and code \"(.*)\"$", (String name, String code) -> {
         positionsPage.openNewPositionDrawer();
         positionsPage.setCode(code);
         positionsPage.setName(name);
      });

      Then("^the Add button is disabled for Position form$", () -> {
         validator.verifyState(false, positionsPage.isAddButtonEnabled());
      });

      Then("^the message \"(.*)\" for Position form is displayed$", (String message) -> {
         String currentMessage = positionsPage.getErrorMessage();

         validator.verifyText(message, currentMessage);
      });

      Then("^the new Position is displayed in the Positions list$", () -> {
         Position currentPosition = positionsPage.getPosition(position.getName());

         validator.verifyPositionsAreEquals(position, currentPosition);
      });
   }

   private void editPosition() {
      When("^I update the name to \"(.*)\" for position \"(.*)\"$", (String newName, String positionName) -> {
        TimeUnit.SECONDS.sleep(2);
        position = positionsPage.getPosition(positionName);
         position.setName(newName);

         positionsPage.openEditPositionDrawer(positionName);
         positionsPage.setName(newName);
         positionsPage.savePosition();
      });

    When("^I update the code to \"(.*)\" for position \"(.*)\"$", (String newCode, String positionName) -> {
      TimeUnit.SECONDS.sleep(1);
      position = positionsPage.getPosition(positionName);
      position.setCode(newCode);

      positionsPage.openEditPositionDrawer(positionName);
      positionsPage.setCode(newCode);
      positionsPage.savePosition();
      TimeUnit.SECONDS.sleep(1);
    });

      When("I update the type to \"(.*)\" for position \"(.*)\"$", (String newType, String positionName) -> {
         position = positionsPage.getPosition(positionName);
         position.setType(newType);

         positionsPage.openEditPositionDrawer(positionName);
         TimeUnit.SECONDS.sleep(1);
         positionsPage.selectType(newType);
         TimeUnit.SECONDS.sleep(1);
         positionsPage.savePosition();
      });

      Then("^the updated position is displayed in the positions list$", () -> {
         TimeUnit.SECONDS.sleep(1);
         Position currentPosition = positionsPage.getPosition(position.getName());

         validator.verifyPositionsAreEquals(position, currentPosition);
      });
   }
}
