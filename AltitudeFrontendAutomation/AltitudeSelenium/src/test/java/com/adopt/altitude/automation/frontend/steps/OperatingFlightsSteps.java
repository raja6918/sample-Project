package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.data.operatingFlights.OfCrewComplement;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OfExtraTime;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OperatingFlights;
import com.adopt.altitude.automation.frontend.validations.OperatingFlightsValidation;
import cucumber.api.Transpose;
import cucumber.api.java.en.And;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class OperatingFlightsSteps extends AbstractSteps implements En {

	private OperatingFlights operatingFlights = new OperatingFlights();

	private OfCrewComplement ofCrewComplement = new OfCrewComplement();

	private OfExtraTime ofExtraTime = new OfExtraTime();

	@Autowired
	private OperatingFlightsValidation validator;

	public OperatingFlightsSteps() {

    Given("^I'm in the Operating Flight page for scenario \"([^\"]*)\"$",(String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
      scenariosPage.openDataItem(scenarioName);
      dataHomePage.openOperatingFlightsPage();
    });

    When("^I open operating flights page$", () -> {
      dataHomePage.openOperatingFlightsPage();
    });

		And("^I add the Operating Flight$", () -> {
			operatingFlightsPage.addNewOperatingFlight();
		});

		Then("^a new Operating Flight is added to list$", () -> {
			OperatingFlights opeartingFlightsFromList = operatingFlightsPage.getOperatingFlight(operatingFlights.getFlight());
			validator.verifyOperatingFlightsAreEqual(operatingFlights, opeartingFlightsFromList);
		});

		Then("^the message \"(.*)\" for operating flight form is displayed$", (String message) -> {
			String currentError = operatingFlightsPage.getErrorMessage();
			validator.verifyText(message, currentError);
		});

		When("^I enter \"(.*)\" flight$", (String flight) -> {
			operatingFlightsPage.setFlight(flight);
		});

		When("^I enter \"(.*)\" suffix$", (String suffix) -> {
			operatingFlightsPage.setSuffix(suffix);
		});

		When("^I enter \"(.*)\" onward flight$", (String onwardFlight) -> {
			operatingFlightsPage.setOnwardFlight(onwardFlight);
		});

		When("^I enter \"(.*)\" onward day offset$", (String onwardDayOffset) -> {
			operatingFlightsPage.setOnwardDayOffset(onwardDayOffset);
		});

		When("^I enter \"(.*)\" cabin configuration$", (String cabinConfiguration) -> {
			operatingFlightsPage.setCabinConfiguration(cabinConfiguration);
		});

		When("^I enter \"(.*)\" tail number$", (String tailNumber) -> {
			operatingFlightsPage.setTailNumber(tailNumber);
		});

		When("^I enter \"(.*)\" seat for deadheads$", (String deadheadSeats) -> {
			operatingFlightsPage.setDeadheadSeats(deadheadSeats);
		});

		And("^I open the add new operating flight drawer$", () -> {
			operatingFlightsPage.openNewAccommodationDrawer();
		});

		EditOperatingFlights();


    When("^I delete operating flight \"([^\"]*)\"$", (String flight) -> {
      TimeUnit.SECONDS.sleep(3);
      operatingFlightsPage.openDeleteOperatingFlight(flight);
      TimeUnit.SECONDS.sleep(1);
      operatingFlightsPage.deleteOperatingFlightConfirmation();
      TimeUnit.SECONDS.sleep(1);
    });
    Then("^the message \"([^\"]*)\" for operating Flight is displayed$", (String expectedSuccessMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualMessage = operatingFlightsPage.getSuccessMessage();
      validator.verifyText(expectedSuccessMessage, actualMessage);
    });

    And("^I want to back home$", () -> {
      TimeUnit.SECONDS.sleep(2);
      dataHomePage.BackToHomePage();
    });
    And("^I cancel delete operating flight \"([^\"]*)\"$", (String flight) -> {
      operatingFlightsPage.openDeleteOperatingFlight(flight);
      operatingFlightsPage.cancelDeleteOperatingFlight();
    });
    Then("^verify successfully that no deletion happens$", () -> {
      operatingFlightsPage.verifyNoSuccessMessage();
    });

    Then("^verify the reference error \"([^\"]*)\" is displayed$", (String expectedRefErrorMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualRefErrorMessage = aircraftModelsPage.getRefErrorMessage();
      validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
    });

    When("^I click on \"([^\"]*)\" link$", (String link) -> {
      TimeUnit.SECONDS.sleep(1);
      aircraftModelsPage.clickBackToAircraftLink();
    });

    When("^I click on operating flight icon in left panel$", () -> {
      TimeUnit.SECONDS.sleep(1);
      operatingFlightsPage.clickOperatingflightLeftpanelIcon();
    });

    And("^I click on close button$", () -> {
      aircraftModelsPage.clickRefErrorCloseButton();
    });

    Then("^Verify successfully that operating flight count decreased by one after deletion$", () -> {
      operatingFlightsPage.verifyOperatingFlightCountAfterDeletion();
    });
  }

	@When("^I entered the following data for Operating Flight$")
	public void createOperatingFlights(@Transpose List<OperatingFlights> extraTimeList) throws Exception {
		OperatingFlights newOperatingFlight = extraTimeList.get(0);

		operatingFlights.setAirline(newOperatingFlight.getAirline());
		operatingFlights.setFlight(newOperatingFlight.getFlight());
		operatingFlights.setSuffix(newOperatingFlight.getSuffix());
		operatingFlights.setFromStation(newOperatingFlight.getFromStation());
		operatingFlights.setTerminalFrom(newOperatingFlight.getTerminalFrom());
		operatingFlights.setToStation(newOperatingFlight.getToStation());
		operatingFlights.setTerminalTo(newOperatingFlight.getTerminalTo());
		operatingFlights.setDepartureTime(newOperatingFlight.getDepartureTime());
		operatingFlights.setArrivalTime(newOperatingFlight.getArrivalTime());
		operatingFlights.setServiceType(newOperatingFlight.getServiceType());
		operatingFlights.setOnwardFlight(newOperatingFlight.getOnwardFlight());
		operatingFlights.setOnwardDayOffset(newOperatingFlight.getFromStation());
		operatingFlights.setAircraftType(newOperatingFlight.getFromStation());
		operatingFlights.setCabinConfiguration(newOperatingFlight.getFromStation());
		operatingFlights.setTailNumber(newOperatingFlight.getFromStation());
		operatingFlights.setDeadheadSeats(newOperatingFlight.getFromStation());
		operatingFlights.setFlightDate(newOperatingFlight.getFlightDate());

		operatingFlightsPage.fillOutAddOperatingFlightsForm(newOperatingFlight);
	}

	@And("^I enter operating flight crew complement as$")
	public void addOfCrewComplement(@Transpose List<OfCrewComplement> operatingFlightsList) throws Exception {
		for (OfCrewComplement newOfCrewComplement : operatingFlightsList) {
			ofCrewComplement.setCrewName(newOfCrewComplement.getCrewName());
			ofCrewComplement.setCount(newOfCrewComplement.getCount());
			operatingFlightsPage.fillInCrewComplementCount(ofCrewComplement);

		}
	}

	@And("^I enter operating flight extra time as$")
	public void addOfExtraTime(@Transpose List<OfExtraTime> operatingFlightsList) throws Exception {
		for (OfExtraTime newOfExtraTime : operatingFlightsList) {
			ofExtraTime.setName(newOfExtraTime.getName());
			ofExtraTime.setBriefMinutes(newOfExtraTime.getBriefMinutes());
			ofExtraTime.setDebriefMinutes(newOfExtraTime.getDebriefMinutes());
			operatingFlightsPage.fillInExtraTime(ofExtraTime);
		}
	}

	@When("^I entered the following mandatory data for Operating Flight$")
	public void mandatoryOperatingFlights(@Transpose List<OperatingFlights> operatingFlightsList) throws Exception {
		TimeUnit.SECONDS.sleep(1);
		OperatingFlights newOperatingFlight = operatingFlightsList.get(0);

		operatingFlights.setAirline(newOperatingFlight.getAirline());
		operatingFlights.setFlight(newOperatingFlight.getFlight());
		operatingFlights.setFromStation(newOperatingFlight.getFromStation());
		operatingFlights.setTerminalFrom(newOperatingFlight.getTerminalFrom());
		operatingFlights.setToStation(newOperatingFlight.getToStation());
		operatingFlights.setTerminalTo(newOperatingFlight.getTerminalTo());
		operatingFlights.setDepartureTime(newOperatingFlight.getDepartureTime());
		operatingFlights.setArrivalTime(newOperatingFlight.getArrivalTime());
		operatingFlights.setAircraftType(newOperatingFlight.getFromStation());
		operatingFlights.setFlightDate(newOperatingFlight.getFlightDate());
	}

	public void EditOperatingFlights() {

		When("^I update the flight to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newFlight, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setFlight(newFlight);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setFlight(newFlight);
			operatingFlightsPage.saveOperatingFlight();
		});




		When("^I update the suffix to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newSuffix, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setSuffix(newSuffix);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setSuffix(newSuffix);
			operatingFlightsPage.saveOperatingFlight();
		});

		When("^I update the service type to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newServiceType, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setServiceType(newServiceType);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setServiceType(newServiceType);
			operatingFlightsPage.saveOperatingFlight();
		});

		When("^I update the departure time to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newDepartureTime, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setDepartureTime(newDepartureTime);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setDepartureTime(newDepartureTime);
			operatingFlightsPage.saveOperatingFlight();
		});

		When("^I update the departure station to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newDepartureStation, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setFromStation(newDepartureStation);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setFromStation(newDepartureStation);
			operatingFlightsPage.saveOperatingFlight();
		});

		When("^I update the arrival station to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newArrivalStation, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setToStation(newArrivalStation);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setToStation(newArrivalStation);
			operatingFlightsPage.saveOperatingFlight();
		});

		When("^I update the onward flight to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newOnwardFlight, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setOnwardFlight(newOnwardFlight);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setOnwardFlight(newOnwardFlight);
		});

		When("^I update the onward day offset to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newOnwardDayOffset, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setOnwardDayOffset(newOnwardDayOffset);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setOnwardDayOffset(newOnwardDayOffset);
		});

		When("^I update the cabin configuration to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newCabinConfiguration, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setCabinConfiguration(newCabinConfiguration);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setCabinConfiguration(newCabinConfiguration);
		});

		When("^I update the tail number to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newTailNumber, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setTailNumber(newTailNumber);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setTailNumber(newTailNumber);
		});

		When("^I update the seats for deadheads to \"([^\"]*)\" for operating flight \"([^\"]*)\"$", (String newSeatsForDeadheads, String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);

			operatingFlights.setDeadheadSeats(newSeatsForDeadheads);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
			operatingFlightsPage.setDeadheadSeats(newSeatsForDeadheads);
		});

		When("^I'm in the operating flight \"([^\"]*)\"$", (String flight) -> {
			operatingFlights = operatingFlightsPage.getOperatingFlight(flight);
			operatingFlightsPage.openEditOperatingFlightDrawer(flight);
		});


    When("^I count the total Operating flights in table$", () -> {
      TimeUnit.SECONDS.sleep(1);
      operatingFlightsPage.getOperatingFlightCount();
    });

		Then("^the updated operating flight is displayed in the operating flights list$", () -> {
			TimeUnit.SECONDS.sleep(1);
			OperatingFlights opeartingFlightsFromList = operatingFlightsPage.getOperatingFlight(operatingFlights.getFlight());
			validator.verifyOperatingFlightsAreEqual(operatingFlights, opeartingFlightsFromList);
		});

		Then("^the updated operating flight is displayed in the operating flights list edit$", () -> {
			TimeUnit.SECONDS.sleep(1);
			OperatingFlights opeartingFlightsFromList = operatingFlightsPage.getOperatingFlight(operatingFlights.getFlight());
			validator.verifyOperatingFlightsAreEqualEdit(operatingFlights, opeartingFlightsFromList);
		});

	}



    //@And("^I click on the 'Add' new Flight button$")
  public void iClickOnTheAddNewFlightButton() {
  }//


}



