package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.crewGroups.CrewGroups;
import com.adopt.altitude.automation.frontend.validations.CrewGroupsValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class CrewGroupsSteps extends AbstractSteps implements En {

	private CrewGroups crewGroups = new CrewGroups();

	@Autowired
	   private CrewGroupsValidation validator;

	public CrewGroupsSteps() {

		Given("^I'm in the Crew Groups page for scenario \"(.*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
			scenariosPage.openDataItem(scenarioName);
			dataHomePage.openCrewGrupsPage();
		});

		And("^I open the add new crew groups drawer$", () -> {
			crewGroupsPage.openNewCrewGroupsDrawer();
		});

		And("^I add the new crew group$", () -> {
			crewGroupsPage.addNewCrewGroup();
      TimeUnit.SECONDS.sleep(2);
		});

    And("^I save the crew group$", () -> {
      crewGroupsPage.saveCrewGroup();
      TimeUnit.SECONDS.sleep(2);
    });

		Then("^a new Crew Group is added to list$",() ->{
			  CrewGroups crewGroupsFromLIst = crewGroupsPage.getCrewGroup(crewGroups.getName());
			  validator.verifyCrewGroupsAreEquals(crewGroups, crewGroupsFromLIst);

		});
    When("^I enter \"([^\"]*)\" as crew group name$", (String name) -> {
      crewGroupsPage.setName(name);
    });
    Then("^the message \"([^\"]*)\" for crewgroup form is displayed$", (String errorMessage) -> {
      String currentError = crewGroupsPage.getErrorMessage();
      validator.verifyText(errorMessage, currentError);
    });
    Then("^The Error message for same crewgroupname \"([^\"]*)\" for crew group form is displayed$", (String errorMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String currentError = crewGroupsPage.getInvalidFieldErrorMessage();
      validator.verifyText(errorMessage, currentError);
    });
    When("^I click on 'Filter' button for crewGroup$", () -> {
      TimeUnit.SECONDS.sleep(1);Thread.sleep(1000);
      crewGroupsPage.getFilterClick();
      TimeUnit.SECONDS.sleep(1);
       });
    When("^I enter \"([^\"]*)\" as crewgroup name in Filter$", (String crewGroupName) -> {
      crewGroupsPage.enterCrewgroupName(crewGroupName);
    });
    When("^I update the name to \"([^\"]*)\" for \"([^\"]*)\" crewgroup$", (String newName, String oldName) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openEditCrewGroupDrawer(oldName);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.setNewCrewGroupName(newName);
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^the message \"([^\"]*)\" for crewgroup is displayed$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(3);
      String actualMessage = crewGroupsPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

    When("^I click on CrewGroup icon in left panel$", () -> {
      TimeUnit.SECONDS.sleep(1);
      crewGroupsPage.clickCrewGroupLeftpanelIcon();
    });

    When("^I delete crewgroup \"([^\"]*)\"$", (String crewgroup) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openDeleteCrewgroupDrawer(crewgroup);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.deleteCrewgroupConfirmation();
    });

    And("^I cancel delete crewgroup \"([^\"]*)\"$", (String crewgroup) -> {
      TimeUnit.SECONDS.sleep(1);
      crewGroupsPage.openDeleteCrewgroupDrawer(crewgroup);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.cancelDeleteCrewgroup();
    });

    Then("^verify successfully that no deletion happens for CrewGroup$", () -> {
      TimeUnit.SECONDS.sleep(3);
      crewGroupsPage.verifyNoSuccessMessage();
    });

    Then("^I go to crewGroup page$", () -> {
      dataHomePage.BackToHomePage();
      dataHomePage.openCrewGrupsPage();
    });


    When("^I update the Airlines to SelectAll for \"([^\"]*)\" crewgroup$", (String oldName) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openEditCrewGroupDrawer(oldName);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.getSelectAllAirlines();

    });
    When("^I update the Aircraft Type\\(s\\) to SelectAll for \"([^\"]*)\" crewgroup$", (String oldName) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openEditCrewGroupDrawer(oldName);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.getSelectAllAircraft();
    });
    When("^I update the Position\\(s\\) to SelectAll for \"([^\"]*)\" crewgroup$", (String oldName) -> {
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.openEditCrewGroupDrawer(oldName);
      TimeUnit.SECONDS.sleep(2);
      crewGroupsPage.getSelectAllPosition();
    });
  }

	@When("^I enter the following crew groups data$")

	public void createCrewgroup(@Transpose List<CrewGroups> crewGroupList) throws Exception {
		CrewGroups newCrewGroups = crewGroupList.get(0);

		crewGroups.setName(newCrewGroups.getName());
		crewGroups.setPosition(newCrewGroups.getPosition());
		crewGroups.setAirlines(newCrewGroups.getAirlines());
		crewGroups.setAircraftType(newCrewGroups.getAircraftType());
		crewGroups.setDefaultRuleSet(newCrewGroups.getDefaultRuleSet());

		crewGroupsPage.fillOutCrewGroupsForm(newCrewGroups);
	}
}
