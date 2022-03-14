package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.aircraftType.CrewComplement;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OfCrewComplement;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OfExtraTime;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OperatingFlights;
import com.adopt.altitude.automation.frontend.pageobject.view.OperatingFlightsView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.junit.Assert;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class OperatingFlightsPage.
 */
@Component
public class OperatingFlightsPage extends AbstractPage {

	@Autowired
	@Lazy(true)
	private OperatingFlightsView operatingFlightsView;

	@Override
	public boolean isPageDisplayed() {
		return operatingFlightsView.isDisplayedCheck();
	}

	/**
	 * Open new Operating Flights drawer.
	 */
	public void openNewAccommodationDrawer() throws InterruptedException {
		//TimeUnit.SECONDS.sleep(10);
		operatingFlightsView.clickNewOperatingFlightButton();
	}

	/**
	 * Fill out add accommodation form.
	 *
	 * @param newOperatingFlight the new Operation Flights
	 * @throws InterruptedException the interrupted exception
	 */
	public void fillOutAddOperatingFlightsForm(OperatingFlights newOperatingFlight) throws InterruptedException {
		operatingFlightsView.selectAirlineType(newOperatingFlight.getAirline());
		operatingFlightsView.setFlight(newOperatingFlight.getFlight());
		operatingFlightsView.setSuffix(newOperatingFlight.getSuffix());
		operatingFlightsView.selectFromStation(newOperatingFlight.getFromStation());
		operatingFlightsView.selectTerminalFrom(newOperatingFlight.getTerminalFrom());
		operatingFlightsView.selectToStation(newOperatingFlight.getToStation());
		operatingFlightsView.selectTerminalTo(newOperatingFlight.getTerminalTo());
		operatingFlightsView.selectDepartureTime(newOperatingFlight.getDepartureTime());
		operatingFlightsView.selectArrivalTime(newOperatingFlight.getArrivalTime());
		operatingFlightsView.selectServiceType(newOperatingFlight.getServiceType());
		operatingFlightsView.setOnwardFlight(newOperatingFlight.getOnwardFlight());
		operatingFlightsView.setOnwardDayOffset(newOperatingFlight.getOnwardDayOffset());
		operatingFlightsView.selectAircraftType(newOperatingFlight.getAircraftType());
		operatingFlightsView.setCabinConfiguration(newOperatingFlight.getCabinConfiguration());
		operatingFlightsView.setTailNumber(newOperatingFlight.getTailNumber());
		operatingFlightsView.setDeadheadSeats(newOperatingFlight.getDeadheadSeats());
		operatingFlightsView.setDate(newOperatingFlight.getFlightDate());
		operatingFlightsView.setFlightTag(newOperatingFlight.getFlightTags());
	}

	/**
	 * Adds the new Operating Flight.
	 *
	 * @throws InterruptedException
	 */
	public void addNewOperatingFlight() throws InterruptedException {
		operatingFlightsView.clickAddButton();
	}

	/**
	 * Edit the Operating Flight.
	 *
	 * @throws InterruptedException
	 */
	public void openEditOperatingFlightDrawer(String flight) {
		operatingFlightsView.clickEditOperatingFlightButton(flight);
	}

  public void openDeleteOperatingFlight(String flight) {
    operatingFlightsView.clickDeleteOperatingFlightButton(flight);
  }

  public void deleteOperatingFlightConfirmation() {

	  operatingFlightsView.clickDeleteButton();
  }
  public void cancelDeleteOperatingFlight() {

    operatingFlightsView.clickCancelButton();
  }

  public String getSuccessMessage() {
    return operatingFlightsView.getSuccessMessage();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(operatingFlightsView.getNoSuccessMessage());
  }

  public void clickOperatingflightLeftpanelIcon() {
    operatingFlightsView.clickOperatingflightLeftpanelIcon();
  }

  public void verifyOperatingFlightCountAfterDeletion()throws InterruptedException
  {
    int dataCountForOPFlightAfterDeletion = Integer.parseInt(operatingFlightsView.getFlightCount());
    int dataCountForOPFlightBeforeDeletion=Integer.parseInt(dataCountForOPFlight);
    Assert.assertEquals(dataCountForOPFlightBeforeDeletion,dataCountForOPFlightAfterDeletion+1);
  }

	/**
	 * Gets the Operating Flight.
	 *
	 * @param flight the flight number
	 * @return the Operating Flight
	 */
	public OperatingFlights getOperatingFlight(String flight) {
		List<String> values = operatingFlightsView.getOperatingFlight(flight);

		return mapOperatingFlights(values);
	}

	/**
	 * Sets the airline.
	 *
	 * @param airline the airline
	 */
	public void setAirline(String airline) throws InterruptedException {
		operatingFlightsView.selectAirlineType(airline);
	}

	/**
	 * Sets the Flight.
	 *
	 * @param flight the Flight
	 */
	public void setFlight(String flight) throws InterruptedException {
		operatingFlightsView.setFlight(flight);
	}

	/**
	 * Sets the Suffix.
	 *
	 * @param suffix the Suffix
	 */
	public void setSuffix(String suffix) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		operatingFlightsView.setSuffix(suffix);
	}

	/**
	 * Sets the From Station.
	 *
	 * @param fromStation the From Station
	 */
	public void setFromStation(String fromStation) throws InterruptedException {
		operatingFlightsView.selectFromStation(fromStation);
	}

	/**
	 * Sets the Terminal From.
	 *
	 * @param terminalFrom the Terminal From
	 */
	public void setTerminalFrom(String terminalFrom) throws InterruptedException {
		operatingFlightsView.selectTerminalFrom(terminalFrom);
	}

	/**
	 * Sets the To Station.
	 *
	 * @param toStation the To Station
	 */
	public void setToStation(String toStation) throws InterruptedException {
		operatingFlightsView.selectToStation(toStation);
	}

	/**
	 * Sets the Terminal From.
	 *
	 * @param terminalTo the Terminal To
	 */
	public void setTerminalTo(String terminalTo) throws InterruptedException {
		operatingFlightsView.selectTerminalTo(terminalTo);
	}

	/**
	 * Sets the Departure Time.
	 *
	 * @param departureTime the Departure Time
	 */
	public void setDepartureTime(String departureTime) throws InterruptedException {
		operatingFlightsView.selectDepartureTime(departureTime);
	}

	/**
	 * Sets the Arrival Time.
	 *
	 * @param arrivalTime the Departure Time
	 */
	public void setArrivalTime(String arrivalTime) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		operatingFlightsView.selectArrivalTime(arrivalTime);
	}

	/**
	 * Sets the Service Type.
	 *
	 * @param serviceType the Service Type
	 */
	public void setServiceType(String serviceType) throws InterruptedException {
		operatingFlightsView.selectServiceType(serviceType);
	}

	/**
	 * Sets the Onward Flight.
	 *
	 * @param onwardFlight the Onward Flight
	 */
	public void setOnwardFlight(String onwardFlight) throws InterruptedException {
		operatingFlightsView.setOnwardFlight(onwardFlight);
	}

	/**
	 * Sets the Onward Day Offset.
	 *
	 * @param onwardDayOffset the Onward Day Offset
	 */
	public void setOnwardDayOffset(String onwardDayOffset) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		operatingFlightsView.setOnwardDayOffset(onwardDayOffset);
	}

	/**
	 * Sets the Aircraft Type.
	 *
	 * @param aircraftType the Aircraft Type
	 */
	public void setAircraftType(String aircraftType) throws InterruptedException {
		operatingFlightsView.selectAircraftType(aircraftType);
	}

	/**
	 * Sets the Cabin Configuration.
	 *
	 * @param cabinConfiguration the Cabin Configuration
	 */
	public void setCabinConfiguration(String cabinConfiguration) throws InterruptedException {
		operatingFlightsView.setCabinConfiguration(cabinConfiguration);
	}

	/**
	 * Sets the Tail Number.
	 *
	 * @param tailNumber the Tail Number
	 */
	public void setTailNumber(String tailNumber) throws InterruptedException {
		operatingFlightsView.setTailNumber(tailNumber);
	}

	/**
	 * Sets the Seats for Deadheads.
	 *
	 * @param deadheadSeats the Seats for Deadheads
	 */
	public void setDeadheadSeats(String deadheadSeats) throws InterruptedException {
		operatingFlightsView.setDeadheadSeats(deadheadSeats);
	}

	/**
	 * Sets the Crew Complement.
	 *
	 * @param crewComplement the crew complement
	 */
	public void fillInCrewComplementCount(OfCrewComplement crewComplement) throws InterruptedException {
		operatingFlightsView.setCrewComplement(crewComplement.getCrewName(), crewComplement.getCount());
	}

	/**
	 * Sets the Cabin crew Extra Time.
	 *
	 * @param extraTime the operating flight extra time
	 */

	public void fillInExtraTime(OfExtraTime extraTime) throws InterruptedException {
		operatingFlightsView.setExtraTime(extraTime.getName(), extraTime.getBriefMinutes(),
				extraTime.getDebriefMinutes());
	}

	/**
	 * Sets the Tags.
	 *
	 * @param flightTags the Tags
	 */
	public void setFlightTags(String flightTags) throws InterruptedException {
		operatingFlightsView.setFlightTag(flightTags);
	}

	/**
	 * Save operating flight.
	 */
	public void saveOperatingFlight() throws InterruptedException {
		operatingFlightsView.clickSaveOperatingFlightButton();
	}

	/**
	 * Gets the error message.
	 */
	public String getErrorMessage() {
		return operatingFlightsView.getErrorMessage();
	}

	public void fillInCrewComplementCount(CrewComplement crewComplement) throws InterruptedException {
		operatingFlightsView.setCrewComplement(crewComplement.getName(), crewComplement.getCount());
	}

  public void getOperatingFlightCount() throws InterruptedException {
    dataCountForOPFlight = operatingFlightsView.getFlightCount();
  }

	/**
	 * Map Operating Flight.
	 *
	 * @param values the values
	 * @return the operating Flight
	 */
	private OperatingFlights mapOperatingFlights(List<String> values) {
		OperatingFlights newOperatingFlight = new OperatingFlights();

		newOperatingFlight.setAirline(values.get(0));
		newOperatingFlight.setFlight(values.get(1));
		newOperatingFlight.setFromStation(values.get(2));
		newOperatingFlight.setToStation(values.get(3));
		newOperatingFlight.setDepartureTime(values.get(4));
		newOperatingFlight.setArrivalTime(values.get(5));

		return newOperatingFlight;
	}

  public String getOperatingFlightCountAndPerformOperations() throws InterruptedException {
    dataCountForOPFlight = operatingFlightsView.getFlightCount();
    return dataCountForOPFlight;
  }
}
