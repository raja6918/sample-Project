package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class OperatingFlightsPageContainer extends PageContainer {

	@FindBy(xpath = "//h2[text()='Operating Flights']")
	private WebElement operatingFlightPageHeader;

	@FindBy(xpath = "//button[@aria-label='add']")
	private WebElement addNewOperatingFlightButton;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/thead/tr[1]/th[1]")
  private  WebElement tblHeader;

	@FindBy(xpath = "//input[@name='airlineCode']/parent::div")
	private WebElement airlineDropdown;

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

	@FindBy(xpath = "//div[input[@name='aircraftTypeCode']]/div")
	private WebElement aircraftTypeDropdown;

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

  @FindBy(xpath = "//div//p[contains(@class,\"TableFooter\")]")
  private WebElement flightCount;

	public String OPERATINGFLIGHTS_AIRLINE = "//li[@data-value='%s']";

	public String OPERATINGFLIGHTS_TERMINAL = "//li[@data-value='%s']";

	public String OPERATINGFLIGHTS_TIME = "//span[text()='%s']";

	public String OPERATINGFLIGHTS_CALENDAR = "//*[@class='Cal__Month__row Cal__Month__partial']/descendant::li[@class='Cal__Day__root Cal__Day__enabled' and text()='%s']";

	public String CREW_COMPLEMENT_XPATH = "//label[contains(text(),'%s')]/parent::div/parent::div";

	public String OPEARTINGFLIGHTS_AIRCRAFT = "//li[text()='%s']";

	public String OPERATINGFLIGHTS_CREW = "//li[@data-value='%s']";

	public String EXTRA_BRIEF = "//div[p[text()= '%s']]/following-sibling::div/descendant::input[contains(@id, 'extraBriefing')]";

	public String EXTRA_DEBRIEF = "//div[p[text()= '%s']]/following-sibling::div/descendant::input[contains(@id, 'extraDebriefing')]";

	public String OPERATINGFLIGHTS_XPATH = "//td[text()='%s']";

	public String EXTRA_TIME = "//input[@id='%S']";

	public String FLIGHT_DESIGNATOR = "//td[contains(text(),'%s')]//parent::tr//child::td";

	public String EDIT_OPERATINGFLIGHT_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button[1]";

  public String SELECT_STATION = "//*[@class='Select-menu']/descendant::div[contains(@title,'%s')]";
  public String DEPARTURE_STATIONCODE = "//*[@id='departureStationCode-popup']//li/span[contains(text(),'%s')]";
  public String ARRIVAL_STATIONCODE = "//*[@id='arrivalStationCode-popup']//li/span[contains(text(),'%s')]";

  public String DELETE_OPERATINGFLIGHT_XPATH = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

	public WebElement getOperatingFlightPageHeader() {
		return operatingFlightPageHeader;
	}

	public WebElement getAddNewOperatingFlightButton() {
		return addNewOperatingFlightButton;
	}

  public WebElement getDeleteButton() { return deleteButton; }

  public WebElement getSuccessMessage() { return successMessage; }

  public WebElement getFlightCount() { return flightCount; }

	public WebElement getAirlineDropdown() {
		return airlineDropdown;
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

	public WebElement getServiceType() {
		return serviceTypeDropdown;
	}

	public WebElement getOnwardFlight() {
		return onwardFlightInput;
	}

	public WebElement getOndwardDayOffset() {
		return ondwardDayOffsetInput;
	}

	public WebElement getAircraftType() {
		return aircraftTypeDropdown;
	}

	public WebElement getCabinConfigurationr() {
		return cabinConfigurationInput;
	}

	public WebElement getTailNumber() {
		return tailNumberInput;
	}

	public WebElement getDeadheadSeatsNumber() {
		return deadheadSeatsInput;
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

  public WebElement getTblHeader() {
    return tblHeader;
  }

	public WebElement getTimeOkButton() {
		return timeOkButton;
	}

  public List<WebElement> getOperatingFlightsList() {
    return operatingFlightsList;
  }

  @FindBy(xpath = "//p[contains(text(), 'Operating flights')]/parent::a")
  private WebElement operatingflightLeftpanelIcon;

  public WebElement clickOperatingflightLeftpanelIcon() {
    return operatingflightLeftpanelIcon;
  }

}
