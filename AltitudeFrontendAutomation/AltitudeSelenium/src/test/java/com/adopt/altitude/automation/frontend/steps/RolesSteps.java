package com.adopt.altitude.automation.frontend.steps;

import cucumber.api.java.en.Then;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;


public class RolesSteps extends AbstractSteps implements En {

  @Autowired
  private final static Logger LOGGER = LogManager.getLogger(RolesSteps.class);
  public RolesSteps() {

    Given("^I'm in the Role Page$", () -> {
      TimeUnit.SECONDS.sleep(2);
      rolesPage.goToRolesPage();
    });

    Given("^I go to User Page$", () -> {
      rolesPage.GoToUsersPage();
    });

    And("^I click on the Plus Button in Role page$", () -> {
      TimeUnit.SECONDS.sleep(5);
      rolesPage.clickPlusButton();
    });

    And("^I provide the roleName as \"([^\"]*)\"$", (String roleName) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.enterRoleName(roleName);
    });

    And("^I provide the roleDescription as \"([^\"]*)\"$", (String description) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.enterDescription(description);
    });

    And("^I click on permission \"([^\"]*)\" in the role page$", (String permissionType) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.clickToggleIcon(permissionType);
    });

    And("^I click on 'CreateRole' Button in role page$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.createRoleButton();
    });

    Then("^I verify with validation error message for roleName field \"([^\"]*)\"$", (String errorMsg) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.verifyErrorValidation_RoleName(errorMsg);
    });

    Then("^I verify the roleDescription text, not above (\\d+) characters are allowed$", (Integer ExpectedDescriptionTextCount) -> {
      TimeUnit.SECONDS.sleep(4);
      Integer actualDescriptionTextCount = rolesPage.getdescriptionTextCount();
      assertEquals(ExpectedDescriptionTextCount, actualDescriptionTextCount);
    });

    And("^I click on radio button permission option \"([^\"]*)\"$", (String radioBtnOptionName) -> {
      rolesPage.radioBtnOptions_permission(radioBtnOptionName);
    });

    And("^I click on checkbox of permission option \"([^\"]*)\"$", (String checkboxOptionName) -> {
      rolesPage.checkboxOptions_permission(checkboxOptionName);
    });

    And("^I uncheck on checkbox of permission option \"([^\"]*)\"$", (String checkboxOptionName) -> {
      rolesPage.unCheckboxOptions_permission(checkboxOptionName);
    });

    And("^I click on selectAll option in role page$", () -> {
      rolesPage.selectAllButton();
    });

    And("^I click on clearAll option in role page$", () -> {
      rolesPage.clearAllButton();
    });

    Then("^Verify that selectAll button is disabled$", () -> {
      Assert.assertFalse(rolesPage.selectAllButtonIsEnabled());
    });

    Then("^Verify that all checkbox are selected$", () -> {
      Assert.assertTrue(rolesPage.verifyAllCheckboxSelected());
    });

    Then("^Verify that no checkbox are selected$", () -> {
      Assert.assertFalse(rolesPage.verifyNoCheckboxSelected());
    });

    Then("^Verify that clearAll button is disabled$", () -> {
      Assert.assertFalse(rolesPage.clearAllButtonIsEnabled());
    });

    Then("^Verify that clearAll button is enabled$", () -> {
      Assert.assertTrue(rolesPage.clearAllButtonIsEnabled());
    });

    Then("^I verify that create button is enabled when all mandatory fields are correctly entered and at least one permission group has been granted$", () -> {
      Assert.assertTrue(rolesPage.createRoleButtonIsEnabled());
    });

    And("^I remove the role name$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.removeRoleName();
    });

    Then("^I verify that create button is disabled$", () -> {
      Assert.assertFalse(rolesPage.selectAllButtonIsEnabled());
    });

    Then("^I verify created role \"([^\"]*)\" is successfully added to role table$", (String roleName) -> {
      rolesPage.verifyRoleAddedinTable(roleName);
    });

    Then("^verify create role window is closed$", () -> {
      TimeUnit.SECONDS.sleep(3);
      Assert.assertTrue(rolesPage.createRoleWindow());
    });

    When("^I click on edit button for role \"([^\"]*)\"$", (String role) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.clickEditRoleButton(role);
    });

    And("^I update roleName with \"([^\"]*)\"$", (String newRoleName) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.updateRoleName(newRoleName);
    });

    Then("^I verify roleName \"([^\"]*)\" is successfully updated to role table$", (String roleName) -> {
      rolesPage.verifyRoleAddedinTable(roleName);
    });

    And("^I save changes in role page$", () -> {
      rolesPage.clickSaveBtn();
    });

    Then("^I verify that save button is enabled when all mandatory fields are correctly entered and at least one permission group has been granted$", () -> {
      Assert.assertTrue(rolesPage.saveButtonIsEnabled());
    });

    Then("^I verify that save button is disabled$", () -> {
      Assert.assertFalse(rolesPage.saveButtonIsEnabled());
    });

    Then("^I verify that newly updated permission \"([^\"]*)\" reflected successfully$", (String permissionType) -> {
      rolesPage.clickPermission(permissionType);
      rolesPage.IsRadioButtonSelected();
    });

    Then("^I click on permission \"([^\"]*)\"$", (String permissionType) -> {
      rolesPage.clickPermission(permissionType);
     });


    And("^Verify that the columns roleName,Description are included in the table$", () -> {
      rolesPage.verifyColumnHeaders();
    });

    And("^I take count of roles in the roles table$", () -> {
      rolesPage.rolesCountfromTable();
    });

    Then("^I verify the total number of roles is displayed at the bottom of roles table$", () -> {
      rolesPage.rolesCountFromFooter();
    });

    Then("^I verify the Long roleDescription text, above (\\d+) characters are abbreviated with an ellipsis and tooltip with complete description is displayed on the mouse hover$", (Integer arg0) -> {
      TimeUnit.SECONDS.sleep(4);
      rolesPage.verifyLongDescriptionWithEllipsis();
      rolesPage.getDescriptionTextOnTooltip();
    });

    And("^I click on sortButton for field \"([^\"]*)\" in role table$", (String fieldName) -> {
      rolesPage.sortArrowButton(fieldName);
    });

    Then("^I verify that sort operation is done successfully for the column RoleName$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.verifySortRoleName();
    });

    When("^I click on view button for role \"([^\"]*)\"$", (String roleName) -> {
      rolesPage.clickViewBtn_administrator(roleName);
    });

    Then("^verify that roleName should not be able to update$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.roleNameFieldIsDisabled();
    });

    Then("^verify that description should not be able to update$", () -> {
      rolesPage.descriptionFieldIsDisabled();
    });

    Then("^I verify that permission should not be able to update$", () -> {
      rolesPage.permissionsIsDisabled();
    });

    When("^I verify that delete button for role \"([^\"]*)\" is disabled$", (String role) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.deleteButtonIsDisabled(role);
    });

    And("^I click on filterButton in the role page$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.filterButton();
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column roleName$", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.verifyFilterRoleName(searchText);
    });

    And("^I enter text \"([^\"]*)\" on roleName searchBox$", (String textToSearch) -> {
      rolesPage.EnterText_RoleNameSearchBox(textToSearch);
    });

    Then("^I verify that filter operation for text \"([^\"]*)\" is done successfully for the column description", (String searchText) -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.verifyFilterDescription(searchText);
    });

    And("^I enter text \"([^\"]*)\" on description searchBox$", (String textToSearch) -> {
      rolesPage.EnterText_DescriptionSearchBox(textToSearch);
    });

    And("^I close search box in role page$", () -> {
      rolesPage.clickCloseSearchBox();
    });

    Given("^I'm back to users Page from role page$", () -> {
      TimeUnit.SECONDS.sleep(2);
      rolesPage.BackToUsersLink();
    });

    Given("^I'm back to role Page from user page$", () -> {
      TimeUnit.SECONDS.sleep(4);
      rolesPage.goToRolesPageFromUserPage();
    });

    When("^I click on delete button for role \"([^\"]*)\"$", (String role) -> {
      TimeUnit.SECONDS.sleep(4);
      rolesPage.clickDeleteRoleButton(role);
      TimeUnit.SECONDS.sleep(3);
      rolesPage.deleteRoleConfirmation();
    });

    And("^I verify the role page link is disabled$", () -> {
      TimeUnit.SECONDS.sleep(5);
      rolesPage.verifyRolePageAccess();
    });
    And("^I close Add new UserRole form$", () -> {
      TimeUnit.SECONDS.sleep(3);
      rolesPage.closeNewUserRoleForm();
    });
    When("^I turn of all the roles permission$", () -> {
      rolesPage.turnOffAllPersmisson();
    });
  }

  @Then("^verify successfully that role added with message \"([^\"]*)\"$")
  public void verifyRoleCreated(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = rolesPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @Then("^verify successfully that role updated with message \"([^\"]+)\"$")
  public void verifyRoleUpdated(String expectedSuccessMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualMessage = rolesPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }

  @Then("^verify the reference error for role \"([^\"]*)\" is displayed$")
  public void verifyRoleDelete_withDependency(String expectedRefErrorMessage) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String actualRefErrorMessage = rolesPage.getRefErrorMessage();
    assertEquals(expectedRefErrorMessage, actualRefErrorMessage);
  }

  @Then("^the message \"([^\"]*)\" for role is displayed$")
  public void verifyRoleDeleted(String expectedSuccessMessage) throws InterruptedException {
   // TimeUnit.SECONDS.sleep(1);
    String actualMessage = rolesPage.getSuccessMessage();
    assertEquals(expectedSuccessMessage, actualMessage);
  }


}

