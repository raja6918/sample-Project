package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class AccommodationsPageContainer extends PageContainer {

   @FindBy(xpath = "//h2[text()='Accommodations']")
   private WebElement accommodationsPageHeader;

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement addNewAccommodationButton;

   @FindBy(id = "name")
   private WebElement nameInput;

   @FindBy(xpath = "//*[@id='stations']")
  private WebElement stationsDropdown;

  @FindBy(xpath = "//*[@class='MuiAutocomplete-endAdornment']/button[@aria-label='Open']")
  private WebElement stationsDropdownicon;

   @FindBy(xpath = "//div[@id = 'menu-stations']/child::div[1]")
   private WebElement stationInvisiblePanel;
  @FindBy(xpath = "//*[@role='button' and @class='MuiChip-root MuiAutocomplete-tag MuiChip-deletable']/span")
  private List<WebElement> stationsVisiblePanel;

   @FindBy(xpath = "//div[input[@name='typeCode']]/div")
   private WebElement accommodationTypeDropdown;

   @FindBy(id = "capacity")
   private WebElement capacityInput;

   @FindBy(id = "contractStartDate")
   private WebElement startDateInput;

   @FindBy(id = "contractLastDate")
   private WebElement endDateInput;

   @FindBy(id = "cost")
   private WebElement costInput;

   @FindBy(xpath = "//div[input[@name='currencyCode']]/div")
   private WebElement currencyDropdown;

   @FindBy(xpath = "//input[@value='PER_24H_BLOCKS']")
   private WebElement hourBlockRadioInput;

   @FindBy(xpath = "//input[@value='CHECKIN_CHECKOUT']")
   private WebElement checkInOutRadioInput;

   @FindBy(id = "checkInTime")
   private WebElement checkInInput;

   @FindBy(id = "checkOutTime")
   private WebElement checkOutInput;

   @FindBy(id = "extendedStayCostFactor")
   private WebElement costExtendedStayInput;

   @FindBy(xpath = "//button[span[text()='Cancel']]")
   private WebElement cancelButton;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement addButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement saveButton;

   @FindBy(xpath = "//button//span//h6")
   private WebElement calendarYearHeader;

  @FindBy(xpath = "//div//p[@class=\"MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter\"]")
   private WebElement calendarMonth;

   @FindBy(xpath = "//button/span[text()='OK']")
   private WebElement calendarOkButton;

   @FindBy(xpath = "(//button[1]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg'])[3]")
   private WebElement calendarLeftArrowButton;

   @FindBy(xpath = "(//button[2]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg'])[2]")
   private WebElement calendarRightArrowButton;

   @FindBy(xpath = "//button/following::span[text()='date_range']")
   private WebElement calendarDateButton;

   @FindBy(xpath = "//button/following::span[text()='access_time']")
   private WebElement calendarTimeButton;

   @FindBy(xpath = "//div[contains(@class, 'error')]/following::p")
   private WebElement errorMessage;

   @FindBy(xpath = "//div[contains(@class, 'ExpansionPanel')]")
   private WebElement stationTransitExpandButton;

   @FindBy(id = "duration")
   private WebElement transitTimeInput;

   @FindBy(id = "transportCost")
   private WebElement transitCostInput;

   @FindBy(xpath = "//div[input[@name='transportCurrencyCode']]/div")
   private WebElement transitCurrencyDropdown;

   @FindBy(xpath = "//div[input[@name='billingPolicyCode']]/div")
   private WebElement transitCostBasisDropdown;

  @FindBy(xpath = "//span[text()='Add extra time']")
  private WebElement addExtraTimeButton;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/div/p")
  private WebElement accomodationCount;

  @FindBy(id = "extraTime")
  private List<WebElement> extraTimeInput;

  @FindBy(xpath = "//input[@id='extraTime']/following::input[@id='startTime']")
  private  List<WebElement> extraTimeStartTimeInput;

  @FindBy(xpath = "//input[@id='extraTime']/following::input[@id='endTime']")
  private List<WebElement> extraTimeEndTimeInput;

  @FindBy(xpath = "//span[text()='delete'")
  private  List<WebElement> extraTimeDeleteButton;

  @FindBy(xpath = "//h2[text() = 'Accommodations']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]//span[text()='Name']")
  private  WebElement name;

  @FindBy(xpath = "//tbody/child::tr")
  private List<WebElement> accommodationsList;

   public String      ACCOMMODATION_TYPE  = "//li[text()='%s']";

   public String      STATION_SERVED      = "//*[@role='presentation' and @class='MuiAutocomplete-popper']/descendant::li/span[text()='%s']";

   public String      CURRENCY_ITEM       = "//li[text()='%s']";

   public String      CALENDAR_YEAR       = "//div[(@role='button')and(text()='%s')]";

   public String      CALENDAR_DAY        = "//button[@class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day\"]//p[text()='%s']";

   public String      CALENDAR_TIME       = "//span[text()='%s']";

   public String      ACCOMMODATION_XPATH = "//td[text()='%s']//parent::tr//child::td";

   public String      EDIT_ACCOMMODATION_XPATH = "//td[text()='%s']/following-sibling::td/button[1]";

   public String      TRANSIT_CURRENCY_ITEM = "//li[text()='%s']";

   public String      COST_BASIS_ITEM = "//li[text()='%s']";

  public WebElement getName() {
    return name;
  }

   public WebElement getAccommodationsPageHeader() {
      return accommodationsPageHeader;
   }

   public WebElement getAddNewAccommodationButton() {
      return addNewAccommodationButton;
   }

   public WebElement getNameInput() {
      return nameInput;
   }

   public WebElement getStationsDropdown() {
      return stationsDropdown;
   }
  public WebElement getStationsDropdownicon() {
    return stationsDropdownicon;
  }

   public WebElement getStationInvisiblePanel() {
      return stationInvisiblePanel;
   }
  public List<WebElement> getStationsInvisiblePanel() {
    return stationsVisiblePanel;
  }

   public WebElement getAccommodationTypeDropdown() {
      return accommodationTypeDropdown;
   }

   public WebElement getCapacityInput() {
      return capacityInput;
   }

   public WebElement getStartDateInput() {
      return startDateInput;
   }

   public WebElement getEndDateInput() {
      return endDateInput;
   }

   public WebElement getCostInput() {
      return costInput;
   }

   public WebElement getCurrencyDropdown() {
      return currencyDropdown;
   }

   public WebElement getHourBlockRadioInput() {
      return hourBlockRadioInput;
   }

   public WebElement getCheckInOutRadioInput() {
      return checkInOutRadioInput;
   }

   public WebElement getCheckInInput() {
      return checkInInput;
   }

   public WebElement getCheckOutInput() {
      return checkOutInput;
   }

   public WebElement getCostExtendedStayInput() {
      return costExtendedStayInput;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getAddButton() {
      return addButton;
   }

   public WebElement getSaveButton() {
      return saveButton;
   }

   public WebElement getCalendarYearHeader() {
      return calendarYearHeader;
   }

   public WebElement getCalendarMonth() {
      return calendarMonth;
   }

   public WebElement getCalendarOkButton() {
      return calendarOkButton;
   }

   public WebElement getCalendarLeftArrowButton() {
      return calendarLeftArrowButton;
   }

   public WebElement getCalendarRightArrowButton() {
      return calendarRightArrowButton;
   }

   public WebElement getCalendarDateButton() {
      return calendarDateButton;
   }

   public WebElement getCalendarTimeButton() {
      return calendarTimeButton;
   }

   public WebElement getErrorMessage() {
      return errorMessage;
   }

  public List<WebElement> getExtraTimeDeleteButton() {
    return extraTimeDeleteButton;
  }

  public List<WebElement> getExtraTimeEndTimeInput() {
    return extraTimeEndTimeInput;
  }

  public List<WebElement> getExtraTimeStartTimeInput() {
    return extraTimeStartTimeInput;
  }

  public List<WebElement> getExtraTimeInput() {
    return extraTimeInput;
  }

  public WebElement getAddExtraTimeButton() {
    return addExtraTimeButton;
  }

  public WebElement getStationTransitExpandButton() {
    return stationTransitExpandButton;
  }

  public WebElement getTransitCostBasisDropdown() {
    return transitCostBasisDropdown;
  }

  public WebElement getTransitCostInput() {
    return transitCostInput;
  }

  public WebElement getTransitCurrencyDropdown() {
    return transitCurrencyDropdown;
  }

  public WebElement getTransitTimeInput() {
    return transitTimeInput;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public WebElement getAccomodationCount() {
    return accomodationCount;
  }

  public List<WebElement> getAccommodationsList() {
    return accommodationsList;
  }

  public String      DELETE_ACCOMMODATION_XPATH = "//td[text()='%s']/following-sibling::td/button[2]";

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() { return deleteButton; }

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement  successMessage;

  public WebElement getSuccessMessage() { return successMessage; }

  @FindBy(xpath = "//span[text()='ERROR']")
  private WebElement dependancyErrorMessage;

  public WebElement getDependancyErrorMessage() { return dependancyErrorMessage; }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() {
    return refErrorMessage;
  }

  @FindBy(xpath = "//span[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement clickRefErrorCloseButton(){ return refErrorCloseButton; }
}
