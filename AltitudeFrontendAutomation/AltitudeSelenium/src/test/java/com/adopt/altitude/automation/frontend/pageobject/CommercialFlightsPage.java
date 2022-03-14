package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.commercialFlights.CommercialFlights;
import com.adopt.altitude.automation.frontend.pageobject.view.CommercialFlightsView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * The Class OperatingFlightsPage.
 */
@Component
public class CommercialFlightsPage extends AbstractPage {

	@Autowired
	@Lazy(true)

  private CommercialFlightsView commercialFlightsView;
	@Override
	public boolean isPageDisplayed() {
		return commercialFlightsView.isDisplayedCheck();
	}

	/**
	 * Open new Commercial Flights drawer.
	 */
	public void openNewCommercialDrawer() throws InterruptedException {
		//TimeUnit.SECONDS.sleep(10);
    commercialFlightsView.clickNewCommercialFlightButton();
	}

  public void setFlight(String flight) throws InterruptedException {
    commercialFlightsView.setFlight(flight);
  }

  public String getErrorMessage() {
    return commercialFlightsView.getErrorMessage();
  }

  public void setSuffix(String suffix) throws InterruptedException {
   // TimeUnit.SECONDS.sleep(1);
    commercialFlightsView.setSuffix(suffix);
  }

  public void setCabinConfiguration(String cabinConfiguration) throws InterruptedException {
    commercialFlightsView.setCabinConfiguration(cabinConfiguration);
  }

  public void setAircraft(String aircraft) throws InterruptedException {
    commercialFlightsView.setAircraft(aircraft);
  }

  public void setAirlineCode(String airlineCode) throws InterruptedException {
    commercialFlightsView.setAirlineCode(airlineCode);
  }

  public void fillOutAddCommercialFlightsForm(CommercialFlights newCommercialFlight) throws InterruptedException {
    commercialFlightsView.setAirlineCode(newCommercialFlight.getAirline());
    commercialFlightsView.setFlight(newCommercialFlight.getFlight());
    commercialFlightsView.setSuffix(newCommercialFlight.getSuffix());
    commercialFlightsView.selectFromStation(newCommercialFlight.getFromStation());
    commercialFlightsView.selectTerminalFrom(newCommercialFlight.getTerminalFrom());
    commercialFlightsView.selectToStation(newCommercialFlight.getToStation());
    commercialFlightsView.selectTerminalTo(newCommercialFlight.getTerminalTo());
    commercialFlightsView.selectDepartureTime(newCommercialFlight.getDepartureTime());
    commercialFlightsView.selectArrivalTime(newCommercialFlight.getArrivalTime());
    commercialFlightsView.setAircraft(newCommercialFlight.getAircraftType());
    commercialFlightsView.setCabinConfiguration(newCommercialFlight.getCabinConfiguration());
    commercialFlightsView.setDate(newCommercialFlight.getFlightDate());
    commercialFlightsView.setFlightTag(newCommercialFlight.getFlightTags());
  }


  public void fillOutAddCommercialFlightsFormWithMandatoryFields(CommercialFlights newCommercialFlight) throws InterruptedException {
    commercialFlightsView.setAirlineCode(newCommercialFlight.getAirline());
    commercialFlightsView.setFlight(newCommercialFlight.getFlight());
    commercialFlightsView.selectFromStation(newCommercialFlight.getFromStation());
    commercialFlightsView.selectToStation(newCommercialFlight.getToStation());
    commercialFlightsView.selectDepartureTime(newCommercialFlight.getDepartureTime());
    commercialFlightsView.selectArrivalTime(newCommercialFlight.getArrivalTime());
    commercialFlightsView.setAircraft(newCommercialFlight.getAircraftType());
    commercialFlightsView.setDate(newCommercialFlight.getFlightDate());
  }


  public void addNewCommercialFlight() throws InterruptedException {
    commercialFlightsView.clickAddButton();
  }

  public CommercialFlights getCommercialFlight(String flight) {
    List<String> values = commercialFlightsView.getCommercialFlight(flight);

    return mapCommercialFlights(values);
  }
  public void scrollAfterEdit() {
	  commercialFlightsView.scrollAfterEdit();
  }

  private CommercialFlights mapCommercialFlights(List<String> values) {
    CommercialFlights newCommercialFlight = new CommercialFlights();

    newCommercialFlight.setAirline(values.get(0));
    newCommercialFlight.setFlight(values.get(1));
    newCommercialFlight.setFromStation(values.get(2));
    newCommercialFlight.setToStation(values.get(3));
    newCommercialFlight.setDepartureTime(values.get(4));
    newCommercialFlight.setArrivalTime(values.get(5));

    return newCommercialFlight;
  }

  public void openEditCommercialFlightDrawer(String flight) {
    commercialFlightsView.clickEditCommercialFlightButton(flight);
  }

  public void saveCommercialFlight() throws InterruptedException {
    commercialFlightsView.clickSaveCommercialFlightButton();
  }

  public void setFromStation(String fromStation) throws InterruptedException {
    commercialFlightsView.selectFromStation(fromStation);
  }

  public void setToStation(String toStation) throws InterruptedException {
    commercialFlightsView.selectToStation(toStation);
  }

  public void setDepartureTime(String departureTime) throws InterruptedException {
    commercialFlightsView.selectDepartureTime(departureTime);
  }

  public void setArrivalTime(String arrivalTime) throws InterruptedException {
    commercialFlightsView.selectArrivalTime(arrivalTime);
  }

  public void setDate(String flightDate) throws InterruptedException {
    commercialFlightsView.setDate(flightDate);
  }

  public void selectTerminalFrom(String terminalFrom) throws InterruptedException {
    commercialFlightsView.selectTerminalFrom(terminalFrom);
  }

  public void selectTerminalTo(String terminalTo) throws InterruptedException {
    commercialFlightsView.selectTerminalTo(terminalTo);
  }

  public void openDeleteCommercialFlight(String flight) {
    commercialFlightsView.clickDeleteCommercialFlightButton(flight);
  }

  public void deleteCommercialFlightConfirmation() {
    commercialFlightsView.clickDeleteButton();
  }

  public String getSuccessMessage() {
    return commercialFlightsView.getSuccessMessage();
  }

  public void cancelDeleteCommercialFlight() {
    commercialFlightsView.clickCancelButton();
  }

  public void verifyNoSuccessMessage() throws Exception{
    Assert.assertTrue(commercialFlightsView.getNoSuccessMessage());
  }

  public void getCommercialFlightCount() throws InterruptedException {
    dataCountForCommercialFlight = commercialFlightsView.getFlightCount();
  }

}
