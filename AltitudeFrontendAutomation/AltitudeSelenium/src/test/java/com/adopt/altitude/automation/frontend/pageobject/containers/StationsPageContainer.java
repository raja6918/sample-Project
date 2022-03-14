package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

/**
 * This class defines all the elements on the Station page
 */
public class StationsPageContainer extends PageContainer {

   @FindBy(xpath = "//h2[text()='Stations']")
   private WebElement       stationsPageHeader;

   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement       addStationButton;

   @FindBy(css = "#contentContainer tbody tr")
   private List<WebElement> stationsTable;

   @FindBy(xpath = "//span[text()='Add Station']")
   private WebElement       addNewStationFormHeader;

   @FindBy(xpath = "//input[@id='IATACode']")
   private WebElement       iataCodeTextfield;

   public String stationField = "//input[@id='%s']";

   @FindBy(xpath = "//input[@id='name']")
   private WebElement       stationNameTextfield;

   @FindBy(xpath = "//input[@id='countryCode']")
   private WebElement       countryDropdown;

   @FindBy(xpath = "//label[@for='regionCode']/following-sibling::*/descendant::div[@role='button']")
   private WebElement       regionDropdown;

   @FindBy(xpath = "//input[@id='latitude']")
   private WebElement       latitudeTextfield;

   @FindBy(xpath = "//input[@id='longitude']")
   private WebElement       longitudeTextField;

//   @FindBy(xpath = "//label[@for='utcOffset']/following::div[@role='button']")
   @FindBy(xpath = "//label[@for='utcOffset']/following-sibling::*/descendant::div[@role='button']")
   private WebElement       timeZoneDropdown;

   @FindBy(xpath = "//label[@for='dstShift']/following-sibling::*/descendant::div[@role='button']")
   private WebElement       dstChangeDropdown;

   @FindBy(xpath = "//input[@id='dstStartDateTime']")
   private WebElement       dstStartDateTimeTextField;

   @FindBy(xpath = "//button//span//h6")
   private WebElement       calendarYearHeader;

   @FindBy(xpath = "//div//p[@class=\"MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter\"]")
   private WebElement calendarMonth;

   @FindBy(xpath = "(//button[1]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg'])[3]")
   private WebElement       calendarLeftArrowButton;

   @FindBy(xpath = "(//button[2]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg'])[2]")
   private WebElement       calendarRightArrowButton;

   @FindBy(xpath = "//button/following::span[text()='date_range']")
   private WebElement       calendarDateButton;

   @FindBy(xpath = "//button/following::span[text()='access_time']")
   private WebElement       calendarTimeButton;

   @FindBy(xpath = "//button/span[text()='OK']")
   private WebElement calendarOkButton;

   @FindBy(xpath = "//input[@id='dstEndDateTime']")
   private WebElement       dstEndDateTimeTextField;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement       addButton;

   @FindBy(xpath = "//button[span[text()='SAVE']]")
   private WebElement       saveButton;

   @FindBy(xpath = "//button[span[text()='Cancel']]")
   private WebElement       cancelButton;

   @FindBy(xpath = "//p[contains(@class, 'StationForm__ErrorMessage')]")
   private WebElement       stationFormErrorMessage;

   @FindBy(id = "dstEndDateTime-helper-text")
   private WebElement       endDateErrorText;

   @FindBy(xpath = "//span[text()='DELETE']")
   private WebElement       deleteButton;

   @FindBy(xpath = "//h2[text() = 'Stations']/following-sibling::p")
   private WebElement scenarioStatus;

   @FindBy(xpath = "//tbody/child::tr")
   private List<WebElement> stationsList;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[1]/th[7]/button[1]/span[1]/span")
  private WebElement clickFilter;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/table/thead/tr[2]/th[3]/div/div/input")
  private WebElement stationFilterName;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement stationCount;

  @FindBy(xpath = "//input[@id='terminals']")
  private WebElement       terminals;

  @FindBy(xpath = "//a[contains(@href,'stations')]")
  private WebElement       stationLink;

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/thead/tr[1]/th[7]")
  private WebElement       btnDelete;

   public String            tableCell           = "//td[text()='%s']";

   public String            calendarYear        = "//div[(@role='button')and(text()='%s')]";

   public String            calendarDay         = "//button[@class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day\"]//p[text()='%s']";

   public String            calendarTime        = "//span[text()='%s']";
   public String CalenderTimeValue = "//*[contains(@class,'root MuiPickersClockNumber-clockNumber') and text()='%s']";
   public String            countryCode       = "//*[contains(@id,'countryCode-option')]/span[contains(text(),'%s')]";

   public String            listValue           = "//li[contains(text(), '%s')]";

   public String            regionListItem      = "//li[text()='%s']";

   public String            currentStations     = "//td[text()='%s']";

   public String            deleteStationButton = "//td[text()='%s']/following-sibling::*/descendant::span[text()='delete']";

   public String            STATION_XPATH       = "//tr[td[text()='%s']]/child::td";

   public String            EDIT_STATION_XPATH  = "//td[text()='%s']/following-sibling::td/button[1]";

   public WebElement getStationsPageHeader() {
      return stationsPageHeader;
   }

   public WebElement getAddStationButton() {
      return addStationButton;
   }

   public List<WebElement> getStationsTable() {
      return stationsTable;
   }

   public WebElement getAddNewStationFormHeader() {
      return addNewStationFormHeader;
   }

   public WebElement getIataCodeTextfield() {
      return iataCodeTextfield;
   }

   public WebElement getStationNameTextfield() {
      return stationNameTextfield;
   }

   public WebElement getCountryDropdown() {
      return countryDropdown;
   }

   public WebElement getRegionDropdown() {
      return regionDropdown;
   }

   public WebElement getLatitudeTextfield() {
      return latitudeTextfield;
   }

   public WebElement getLongitudeTextField() {
      return longitudeTextField;
   }

   public WebElement getTimeZoneDropdown() {
      return timeZoneDropdown;
   }

   public WebElement getDstChangeDropdown() {
      return dstChangeDropdown;
   }

   public WebElement getDstStartDateTimeTextField() {
      return dstStartDateTimeTextField;
   }

   public WebElement getDstEndDateTimeTextField() {
      return dstEndDateTimeTextField;
   }

   public WebElement getAddButton() {
      return addButton;
   }

   public WebElement getSaveButton() {
      return saveButton;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getCalenderYearHeader() {
      return calendarYearHeader;
   }

   public WebElement getCalendarDateButton() {
      return calendarDateButton;
   }

   public WebElement getCalendarTimeButton() {
      return calendarTimeButton;
   }

   public WebElement getCalendarOkButton() {
     return calendarOkButton;
   }

   public WebElement getCalenderLeftArrowButton() {
      return calendarLeftArrowButton;
   }

   public WebElement getCalenderRightArrowButton() {
      return calendarRightArrowButton;
   }

   public WebElement getCalendarMonth() {
      return calendarMonth;
   }

   public WebElement getStationFormErrorMessage() {
      return stationFormErrorMessage;
   }

   public WebElement getEndDateErrorText() {
      return endDateErrorText;
   }

   public WebElement getDeleteButton() {
      return deleteButton;
   }

   public WebElement getScenarioStatus() {
     return scenarioStatus;
   }

  public List<WebElement> getStationsList() {
    return stationsList;
  }

  public WebElement getClickFilter()
  {
    return clickFilter;
  }

  public  WebElement getStationFilterName()
  {
    return  stationFilterName;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getStationLink() {
    return stationLink;
  }

  public WebElement getTerminals() {
    return terminals;
  }

  public WebElement getStationCount() {
    return stationCount;
  }

  public WebElement getBtnDelete() {
    return btnDelete;
  }
}
