package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.OperatingFlightsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * The Class OperatingFlightsView.
 */
@Component
@Scope("prototype")
public class OperatingFlightsView extends AbstractPageView<OperatingFlightsPageContainer> {

	/**
	 * Inits the.
	 *
	 * @throws Exception the exception
	 */
	@PostConstruct
	public void init() throws Exception {
		container = PageFactory.initElements(driver.getWebDriver(), OperatingFlightsPageContainer.class);
	}

	/**
	 * Click new Operating Flight button.
	 */
	public void clickNewOperatingFlightButton() {
		container.getAddNewOperatingFlightButton().click();
	}

	/**
	 * Click edit operating flight button.
	 *
	 * @param flight the flight
	 */
	public void clickEditOperatingFlightButton(String flight) {
		WebElement editButton = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.EDIT_OPERATINGFLIGHT_XPATH, flight)));
    driver.scrollToElement(editButton);
		editButton.click();
	}

  public void clickDeleteOperatingFlightButton(String flight) {
    WebElement deleteButton = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.DELETE_OPERATINGFLIGHT_XPATH, flight)));
    driver.scrollToElement(deleteButton);
    deleteButton.click();
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }
  public String getSuccessMessage() {
    return container.getSuccessMessage().getText();
  }

  public boolean getNoSuccessMessage(){
    if(driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'msg')]/span")).size()==0)
      return true;
    else
      return false;
  }

  public void clickOperatingflightLeftpanelIcon()
  {
    container.clickOperatingflightLeftpanelIcon().click();
  }

	/**
	 * Select Operating Flight Airline.
	 *
	 * @param airline the airline code
	 */
	public void selectAirlineType(String airline) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
	  if(container.getAirlineDropdown().isDisplayed()) {
      container.getAirlineDropdown().click();
      TimeUnit.SECONDS.sleep(2);
    }
	  TimeUnit.SECONDS.sleep(2);
		WebElement airlineElement = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_AIRLINE, airline)));
		airlineElement.click();
	}

	/**
	 * Sets the Operating Flight Flight Number.
	 *
	 * @param flight the flight number.
	 */
	public void setFlight(String flight) throws InterruptedException {
		clearAndSetText(container.getFlightNumber(), flight);
		container.getFlightNumber().sendKeys(Keys.TAB);
	}

	/**
	 * Sets the Operating Flight Suffix Number.
	 *
	 * @param suffix the suffix number.
	 */
	public void setSuffix(String suffix) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		clearAndSetText(container.getSuffixNumber(), suffix);
		container.getSuffixNumber().sendKeys(Keys.TAB);
	}

	/**
	 * Select Operating Flight From Station.
	 *
	 * @param fromStation the Station code
	 */
	public void selectFromStation(String fromStation) throws InterruptedException {
		//container.getFromStation().sendKeys(fromStation);
		clearAndSetText(container.getFromStation(),fromStation);
		TimeUnit.SECONDS.sleep(1);
    WebElement from_station = driver.getWebDriver().findElement(By.xpath(String.format(container.DEPARTURE_STATIONCODE, fromStation)));
    from_station.click();
    TimeUnit.SECONDS.sleep(1);
		container.getFromStation().sendKeys(Keys.TAB);
	}

	/**
	 * Select Operating Flight Terminal From.
	 *
	 * @param terminalFrom the terminal code
	 */
	public void selectTerminalFrom(String terminalFrom) throws InterruptedException {
		container.getTerminalFrom().click();
		WebElement terminalFromElement = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TERMINAL, terminalFrom)));
		terminalFromElement.click();
	}

	/**
	 * Select Operating Flight To Station.
	 *
	 * @param toStation the Station code
	 */
	public void selectToStation(String toStation) throws InterruptedException {
		clearAndSetText(container.getToStation(), toStation);
    WebElement to_Station = driver.getWebDriver().findElement(By.xpath(String.format(container.ARRIVAL_STATIONCODE, toStation)));
    TimeUnit.SECONDS.sleep(1);
    to_Station.click();
    TimeUnit.SECONDS.sleep(1);
		container.getToStation().sendKeys(Keys.TAB);
	}

	/**
	 * Select Operating Flight Terminal To.
	 *
	 * @param terminalTo the terminal code
	 */
	public void selectTerminalTo(String terminalTo) throws InterruptedException {
		container.getTerminalTo().click();
		WebElement terminalToElement = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TERMINAL, terminalTo)));
		terminalToElement.click();
	}

	/**
	 * Select Operating Flight Departure Time.
	 *
	 * @param departureTime the Departure time.
	 */
	public void selectDepartureTime(String departureTime) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		container.getDepartureTime().click();
		String[] timeArray = splitTime(departureTime);
		selectTime(timeArray[0], timeArray[1]);
	}

	/**
	 * Select Operating Flight Arrival Time.
	 *
	 * @param arrivalTime the Arrival time.
	 */
	public void selectArrivalTime(String arrivalTime) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		container.getArrivalTime().click();
		String[] timeArray = splitTime(arrivalTime);
		selectTime(timeArray[0], timeArray[1]);
	}

	/**
	 * Select Operating Flight Service Type.
	 *
	 * @param serviceType the Service Type.
	 */
	public void selectServiceType(String serviceType) throws InterruptedException {
		clearAndSetText(container.getServiceType(), serviceType);
		TimeUnit.SECONDS.sleep(1);
		container.getServiceType().sendKeys(Keys.TAB);
	}

	/**
	 * Select Operating Flights Onward Flight
	 *
	 * @param onwardFlight the Onward Flight.
	 */
	public void setOnwardFlight(String onwardFlight) {
		clearAndSetText(container.getOnwardFlight(), onwardFlight);
	}

	/**
	 * Select Operating Flights Onward Day Offset
	 *
	 * @param onwardDayOffset the Onward Day offset.
	 */
	public void setOnwardDayOffset(String onwardDayOffset) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		clearAndSetText(container.getOndwardDayOffset(), onwardDayOffset);
	}

	/**
	 * Select Operating Flight Aircraft Type.
	 *
	 * @param aircraftType the Arrival time.
	 */
	public void selectAircraftType(String aircraftType) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    driver.scrollToElement(container.getAircraftType());
    TimeUnit.SECONDS.sleep(1);

		container.getAircraftType().click();
		WebElement aircraftTypeElement = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPEARTINGFLIGHTS_AIRCRAFT, aircraftType)));
		aircraftTypeElement.click();
	}

	/**
	 * Select Operating Flights Cabin Configuration
	 *
	 * @param cabinConfiguration the Cabin Configuration.
	 */
	public void setCabinConfiguration(String cabinConfiguration) {
		clearAndSetText(container.getCabinConfigurationr(), cabinConfiguration);
	}

	/**
	 * Select Operating Flights Tail Number
	 *
	 * @param tailNumber the Tail Number.
	 */
	public void setTailNumber(String tailNumber) {
		clearAndSetText(container.getTailNumber(), tailNumber);
	}

	/**
	 * Select Operating Flights Seat For Deadheads
	 *
	 * @param deadheadSeats the Seat For Deadheads.
	 */
	public void setDeadheadSeats(String deadheadSeats) {
		clearAndSetText(container.getDeadheadSeatsNumber(), deadheadSeats);
	}

	/**
	 * Select Operating Flights date
	 *
	 * @param date the date
	 */
	public void setDate(String date) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    WebElement dateField= driver.getWebDriver().findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_CALENDAR, date)));

    driver.scrollToElement(dateField);
    TimeUnit.SECONDS.sleep(3);

		WebElement dateCalendar = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_CALENDAR, date)));
		dateCalendar.click();
	}

	/**
	 * Set Operating Flight Crew complement.
	 *
	 * @param crewName the crew complement
	 */
	public void setCrewComplement(String crewName, int count) throws InterruptedException {
		WebElement crewComplement = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.CREW_COMPLEMENT_XPATH, crewName)));
    driver.scrollToElement(crewComplement);
    TimeUnit.SECONDS.sleep(2);
		TimeUnit.SECONDS.sleep(1);
		crewComplement.click();
		TimeUnit.SECONDS.sleep(1);
		driver.getWebDriver().findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_CREW, count))).click();
	}

	/**
	 * Set Operating Flight Extra Time.
	 *
	 * @param briefMinues the Extra Time
	 */

	public void setExtraTime(String name, String briefMinues, String debriefMinutes) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
	  driver.scrollToElement(container.getTags());
    TimeUnit.SECONDS.sleep(1);
		WebElement extraBrief = driver.getWebDriver().findElement(By.xpath(String.format(container.EXTRA_BRIEF, name)));
		TimeUnit.SECONDS.sleep(1);
		extraBrief.clear();
		extraBrief.sendKeys(briefMinues);
		TimeUnit.SECONDS.sleep(1);
		WebElement extraDebrief = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.EXTRA_DEBRIEF, name)));
		TimeUnit.SECONDS.sleep(1);
		extraDebrief.clear();
		extraDebrief.sendKeys(debriefMinutes);
	}

	/**
	 * Set Operating Flight Tag.
	 *
	 * @param flightTag the Tag
	 */
	public void setFlightTag(String flightTag) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.getTags());
    TimeUnit.SECONDS.sleep(2);
		TimeUnit.SECONDS.sleep(1);
		container.getTags().sendKeys(flightTag);
		TimeUnit.SECONDS.sleep(1);
		container.getTags().sendKeys(Keys.TAB);
	}

	/**
	 * Click Add button
	 */
	public void clickAddButton() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    WebElement addButton = container.getAddButton();
    driver.jsClick(addButton);
	}

	/**
	 * Click Cancel button
	 */
	public void clickCancelButton() {
		container.getCancelButton().click();
	}

	/**
	 * Click close button
	 */
	public void clickCloseButton() {
		container.getCloseButton().click();
	}

	/**
	 * Click save operating flight button.
	 */
	public void clickSaveOperatingFlightButton() throws InterruptedException {
	 CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getSaveButton());
	    driver.jsClick(container.getSaveButton());
      TimeUnit.SECONDS.sleep(1);
      driver.scrollToElement(container.getTblHeader());
      TimeUnit.SECONDS.sleep(1);
	  }

	/**
	 * Get the error message
	 */
	public String getErrorMessage() {
		return container.getErrorMessage().getText();
	}

	/**
	 * Gets the Operating Flight.
	 *
	 * @param flight the flight designator
	 * @return the operatingFlight
	 */
	public List<String> getOperatingFlight(String flight) {
		List<WebElement> operatingFlightElements = driver.getWebDriver()
				.findElements(By.xpath(String.format(container.FLIGHT_DESIGNATOR, flight)));

		return getOperatingFlightsValues(operatingFlightElements);
	}

	public Integer getOperatingFLightsCount() {
	  return container.getOperatingFlightsList().size();
  }

	/**
	 * Gets the Operating Flights values.
	 *
	 * @param operatingFlightsElements the Operating Flights elements
	 * @return the Operating Flights values
	 */
	private List<String> getOperatingFlightsValues(List<WebElement> operatingFlightsElements) {
		List<String> operatingFlightsValues = new ArrayList<>();
		operatingFlightsValues.add(operatingFlightsElements.get(0).getText());
		operatingFlightsValues.add(operatingFlightsElements.get(1).getText());
		operatingFlightsValues.add(operatingFlightsElements.get(2).getText());
		operatingFlightsValues.add(operatingFlightsElements.get(3).getText());
		operatingFlightsValues.add(operatingFlightsElements.get(4).getText());
		operatingFlightsValues.add(operatingFlightsElements.get(5).getText());
operatingFlightsValues.add(operatingFlightsElements.get(6).getText());
		return operatingFlightsValues;
	}

	private void selectTime(String hour, String minute) {
		// Select an hour from calendar
		WebElement calendarHour = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TIME, hour)));
		driver.clickAction(calendarHour);

		// Select minutes from calendar
		WebElement calendarMinute = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.OPERATINGFLIGHTS_TIME, minute)));
		driver.clickAction(calendarMinute);

		// Click Ok button to set Date to the field
		container.getTimeOkButton().click();
	}

  public String getFlightCount() throws InterruptedException {
    String value="";
    Boolean status = driver.getWebDriver().findElements(By.xpath("//*[contains(@class,'DataNotFound__StyledMessage')]/p")).size()>0;
    TimeUnit.SECONDS.sleep(1);
    if (!status) {
      String countText = container.getFlightCount().getText();
      String countValue = countText.replaceAll("[^/,0-9]", "");
       value=countValue.substring(countValue.lastIndexOf("/") + 1);
       return value;
    }else{
      return "0";
    }
  }

	/**
	 * Split time.
	 *
	 * @param time the time
	 * @return the string[]
	 */
	private String[] splitTime(String time) {
		return time.split(":");
	}

	@Override
	public boolean isDisplayedCheck() {
		return container.getAddNewOperatingFlightButton() != null && container.getOperatingFlightPageHeader() != null;
	}
}
