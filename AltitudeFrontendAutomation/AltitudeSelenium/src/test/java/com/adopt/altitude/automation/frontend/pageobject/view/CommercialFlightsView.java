package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.CommercialFlightsPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
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
public class CommercialFlightsView extends AbstractPageView<CommercialFlightsPageContainer> {

  private static final Logger LOGGER = LogManager.getLogger(CommercialFlightsView.class);
	/**
	 * Inits the.
	 *
	 * @throws Exception the exception
	 */
	@PostConstruct
	public void init() throws Exception {
		container = PageFactory.initElements(driver.getWebDriver(), CommercialFlightsPageContainer.class);
	}

	/**
	 * Click new Commercial Flight button.
	 */
	public void clickNewCommercialFlightButton() throws InterruptedException {
	  //TimeUnit.SECONDS.sleep(2);
		container.getAddNewCommercialFlightButton().click();
	}

	/**
	 * Click edit operating flight button.
	 *
	 * @param flight the flight
	 */
	public void clickEditCommercialFlightButton(String flight) {
		WebElement editButton = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.EDIT_OPERATINGFLIGHT_XPATH, flight)));
    driver.scrollToElement(editButton);
		editButton.click();
	}

  public void clickDeleteCommercialFlightButton(String flight) {
    WebElement deleteButton = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.DELETE_COMMERCIAL_XPATH, flight)));
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

  public void setAirlineCode(String airlineCode) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    clearAndSetText(container.getAirlineCode(), airlineCode);
    container.getAirlineCode().sendKeys(Keys.TAB);
  }

	/**
	 * Sets the Operating Flight Flight Number.
	 *
	 * @param flight the flight number.
	 */
	public void setFlight(String flight) {
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
    clearAndSetText(container.getFromStation(), fromStation);
   // container.getFromStation().sendKeys(fromStation);
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
	  TimeUnit.SECONDS.sleep(2);
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
    TimeUnit.SECONDS.sleep(2);
		clearAndSetText(container.getToStation(), toStation);
    TimeUnit.SECONDS.sleep(1);
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
	  TimeUnit.SECONDS.sleep(2);
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

  public void setAircraft(String aircraft) throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    clearAndSetText(container.getAircraftTypeInput(), aircraft);
    container.getAircraftTypeInput().sendKeys(Keys.TAB);
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
	  driver.jsClick(container.getAddButton());
	  TimeUnit.SECONDS.sleep(1);
		//container.getAddButton().click();
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
	public List<String> getCommercialFlight(String flight) {
		List<WebElement> commercialFlightElements = driver.getWebDriver()
				.findElements(By.xpath(String.format(container.FLIGHT_DESIGNATOR, flight)));

		return getCommercialFlightsValues(commercialFlightElements);
	}
  public void scrollAfterEdit() {
	  WebElement mouseHoverOnTableToViewScrollBar = driver.getWebDriver().findElement(By.xpath("//table[@class='MuiTable-root']/thead/tr"));
	  driver.mouseOver(mouseHoverOnTableToViewScrollBar);
    WebElement element=driver.getWebDriver().findElement(By.xpath("//*[@class='MuiTableHead-root']/tr/th"));
    driver.scrollToElement(element);
  }


	private List<String> getCommercialFlightsValues(List<WebElement> commercialFlightsElements) {
		List<String> commercialFlightsValues = new ArrayList<>();
    commercialFlightsValues.add(commercialFlightsElements.get(0).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(1).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(2).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(3).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(4).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(5).getText());
    commercialFlightsValues.add(commercialFlightsElements.get(6).getText());
		return commercialFlightsValues;
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

  public void clickSaveCommercialFlightButton() throws InterruptedException {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getSaveButton());
    driver.jsClick(container.getSaveButton());
    TimeUnit.SECONDS.sleep(1);
    driver.scrollToElement(container.getTblHeader());
    TimeUnit.SECONDS.sleep(1);
  }

  public String getFlightCount() throws InterruptedException {
    String value = "";
    Boolean status = driver.getWebDriver().findElements(By.xpath("//*[contains(@class,'DataNotFound__StyledMessage')]/p")).size() > 0;
    TimeUnit.SECONDS.sleep(1);
    if (!status) {
      String countText = container.getFlightCount().getText();
      String countValue = countText.replaceAll("[^/,0-9]", "");
      value = countValue.substring(countValue.lastIndexOf("/") + 1);
      return value;
    } else {
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
    return container.getAddNewCommercialFlightButton() != null && container.getCommercialFlightPageHeader() != null;
  }

}
