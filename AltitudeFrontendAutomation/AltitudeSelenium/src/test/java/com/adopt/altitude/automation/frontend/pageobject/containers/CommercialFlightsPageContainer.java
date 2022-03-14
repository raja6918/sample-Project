package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class CommercialFlightsPageContainer extends PageContainer {

	@FindBy(xpath = "//h2[text()='Commercial Flights']")
	private WebElement commercialFlightPageHeader;

	@FindBy(xpath = "//button[@aria-label='add']")
	private WebElement addNewCommercialFlightButton;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/thead/tr[1]/th[1]")
  private  WebElement tblHeader;

	@FindBy(xpath = "//input[@id= \"airlineCode\"]")
	private WebElement airlineCode;

	@FindBy(xpath = "//input[@name='flightNumber']")
	private WebElement flightNumberInput;

  @FindBy(xpath = "//div[contains(@class,'msg')]/span")
  private WebElement noSuccessMessage;

	@FindBy(xpath = "//input[@id='operationalSuffix']")
	private WebElement suffixNumberInput;

	@FindBy(xpath = "//input[@id='departureStationCode']")
	private WebElement fromStationDropdown;

	@FindBy(xpath = "//div[input[@name='passengerTerminalDeparture']]/div")
	private WebElement terminalFromDropdown;

	@FindBy(xpath = "//div[input[@name='passengerTerminalArrival']]/div")
	private WebElement terminalToDropdown;

	@FindBy(xpath = "//input[@id='arrivalStationCode']")
	private WebElement toStationDropdown;

	@FindBy(xpath = "//input[@id='startTime']")
	private WebElement departureTimeClock;

	@FindBy(xpath = "//input[@id='endTime']")
	private WebElement arrivalTimeclock;

	@FindBy(xpath = "//input[@id='serviceTypeCode']")
	private WebElement serviceTypeDropdown;

	@FindBy(xpath = "//input[@name= 'onwardFlightDesignator']")
	private WebElement onwardFlightInput;

	@FindBy(id = "onwardFlightDayOffset")
	private WebElement ondwardDayOffsetInput;

	@FindBy(xpath = "//input[@id= \"aircraftType\"]")
	private WebElement aircraftTypeInput;

	@FindBy(xpath = "//input[@name='aircraftConfigurationVersion']")
	private WebElement cabinConfigurationInput;

	@FindBy(id = "tailNumber")
	private WebElement tailNumberInput;

	@FindBy(id = "deadheadSeatsNumber")
	private WebElement deadheadSeatsInput;

	@FindBy(xpath = "//div[@class='value-container']/descendant::input")
	private WebElement tagsInput;

	@FindBy(xpath = "//button[span[text()='Cancel']]")
	private WebElement cancelButton;

	@FindBy(xpath = "//button[span[text()='ADD']]")
	private WebElement addButton;

	@FindBy(xpath = "//span[span[text()='close']]")
	private WebElement closeButton;

	@FindBy(xpath ="//button[span[text()='SAVE']]")
	private WebElement saveButton;

	@FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
	private WebElement errorMessage;

	@FindBy(xpath = "//button/span[text()='OK']")
	private WebElement timeOkButton;

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement successMessage;

	@FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> operatingFlightsList;

  @FindBy(xpath = "//p[contains(@class,\"TableFooter\")]")
  private WebElement flightCount;

	public String OPERATINGFLIGHTS_TERMINAL = "//li[@data-value='%s']";

	public String OPERATINGFLIGHTS_TIME = "//span[text()='%s']";

	public String OPERATINGFLIGHTS_CALENDAR = "//li[text()='%s']";

	public String FLIGHT_DESIGNATOR = "//td[contains(text(),'%s')]//parent::tr//child::td";

  public String FLIGHT_DESIGNATOR_TEXT = "//td[contains(text(),'%s')]";
  public String SELECT_STATION = "//*[@class='Select-menu']/descendant::div[contains(@title,'%s')]";

  public String DEPARTURE_STATIONCODE = "//*[@id='departureStationCode-popup']//li/span[contains(text(),'%s')]";
  public String ARRIVAL_STATIONCODE = "//*[@id='arrivalStationCode-popup']//li/span[contains(text(),'%s')]";
	public String EDIT_OPERATINGFLIGHT_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button[1]";

  public String DELETE_COMMERCIAL_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

	public WebElement getCommercialFlightPageHeader() {
		return commercialFlightPageHeader;
	}

	public WebElement getAddNewCommercialFlightButton() {
		return addNewCommercialFlightButton;
	}

  public WebElement getDeleteButton() { return deleteButton; }

  public WebElement getSuccessMessage() { return successMessage; }

	public WebElement getAirlineCode() {
		return airlineCode;
	}

	public WebElement getFlightNumber() {
		return flightNumberInput;
	}

	public WebElement getSuffixNumber() {
		return suffixNumberInput;
	}

	public WebElement getFromStation() {
		return fromStationDropdown;
	}

	public WebElement getTerminalFrom() {
		return terminalFromDropdown;
	}

	public WebElement getTerminalTo() {
		return terminalToDropdown;
	}

	public WebElement getToStation() {
		return toStationDropdown;
	}

	public WebElement getDepartureTime() {
		return departureTimeClock;
	}

	public WebElement getArrivalTime() {
		return arrivalTimeclock;
	}

	public WebElement getAircraftTypeInput() {
		return aircraftTypeInput;
	}

	public WebElement getCabinConfigurationr() {
		return cabinConfigurationInput;
	}

	public WebElement getTags() {
		return tagsInput;
	}

	public WebElement getCancelButton() {
		return cancelButton;
	}

	public WebElement getAddButton() {
		return addButton;
	}

	public WebElement getCloseButton() {
		return closeButton;
	}

	public WebElement getSaveButton() {
		return saveButton;
	}

	public WebElement getErrorMessage() {
		return errorMessage;
	}

	public WebElement getTimeOkButton() {
		return timeOkButton;
	}

   public WebElement getTblHeader() {
    return tblHeader;
  }

  public WebElement getFlightCount() { return flightCount; }
}
