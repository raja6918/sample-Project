package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class PairingsPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text() = 'Pairings']")
  private WebElement pairingPageHeader;

  @FindBy(xpath = "//h2[text() = 'Pairings']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addTimelineButton;

  @FindBy(xpath = "//span[text()='expand_more']")
  private WebElement expandCollapseActionBar;

  @FindBy(id = "timelineReference")
  private WebElement timeReferenceDropdown;

  @FindBy(xpath = "//button[contains(@class, 'FilterButton']")
  private WebElement filterButton;

  @FindBy(xpath = "button[contains(@class, 'MenuDotsButton']")
  private WebElement menuButton;

  @FindBy(xpath = "//span[text()='camera_alt']/ancestor::button")
  private WebElement cameraButton;

  @FindBy(xpath = "//span[text()='bar_chart']/ancestor::button")
  private WebElement barChartButton;

  @FindBy(xpath = "//span[text()='undo']/ancestor::button")
  private WebElement undoButton;

  @FindBy(xpath = "//span[text()='redo']/ancestor::button")
  private WebElement redoButton;

  @FindBy(xpath = "//span[text()='link']/ancestor::button")
  private WebElement linkButton;

  @FindBy(xpath = "//span[text()='visibility_off']/ancestor::button")
  private WebElement hideButton;

  @FindBy(xpath = "//span[text()='lock']/ancestor::button")
  private WebElement lockButton;

  @FindBy(id = "context")
  private WebElement contextDropdown;

  @FindBy(xpath = "//span[text()='error']/ancestor::button")
  private WebElement showErrorsButton;

  @FindBy(xpath = "//span[text()='not_interested']/ancestor::button")
  private WebElement notInterestedButton;

  @FindBy(xpath = ".//*[local-name() = 'g'][contains(@id,'zoom-out')]/ancestor::button")
  private WebElement zoomOutButton;

  @FindBy(xpath = "//i[contains(text(),'loupe')]/ancestor::button")
  private WebElement zoomInButton;

  @FindBy(xpath = "//span[text()='Details']")
  private WebElement pairingDetailsItem;

  @FindBy(xpath = "//span[text()='Multi-select']")
  private WebElement pairingMultiSelectItem;

  @FindBy(xpath = "//span[text()='Select all']")
  private WebElement pairingSelectAllItem;

  @FindBy(xpath = "//span[text()='Edit']")
  private WebElement pairingEditDropdown;

  @FindBy(xpath = "//span[text()='Edit name']")
  private WebElement pairingEditNameItem;

  @FindBy(xpath = "//span[text()='Edit C/C']")
  private WebElement pairingEditCrewItem;

  @FindBy(xpath = "//span[text()='Join']")
  private WebElement pairingJoinItem;

  @FindBy(xpath = "//span[text()='Lock']")
  private WebElement pairingLockItem;

  @FindBy(xpath = "//span[text()='Zoom']")
  private WebElement pairingZoomItem;

  @FindBy(xpath = "//i[text()='close']")
  private WebElement closePairingToolbar;

  public String collapseTimelineButton = "//span[text()='%s']/following-sibling::button[@class='collapse-btn']";

  public String closeTimelineButton = "//span[text()='%s']/following-sibling::button[@class='close-btn']";

  public String pairing = "//span[text()='%s']/ancestor::div[@class='pairing-container']";

  public String calendarDate = "//div[@class='month-day'][@title='%s']";

  public WebElement getPairingPageHeader() {
    return pairingPageHeader;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public WebElement getAddTimelineButton() {
    return addTimelineButton;
  }

  public WebElement getExpandCollapseActionBar() {
    return expandCollapseActionBar;
  }

  public WebElement getTimeReferenceDropdown() {
    return timeReferenceDropdown;
  }

  public WebElement getFilterButton() {
    return filterButton;
  }

  public WebElement getMenuButton() {
    return menuButton;
  }

  public WebElement getCameraButton() {
    return cameraButton;
  }

  public WebElement getBarChartButton() {
    return barChartButton;
  }

  public WebElement getUndoButton() {
    return undoButton;
  }

  public WebElement getRedoButton() {
    return redoButton;
  }

  public WebElement getLinkButton() {
    return linkButton;
  }

  public WebElement getHideButton() {
    return hideButton;
  }

  public WebElement getLockButton() {
    return lockButton;
  }

  public WebElement getContextDropdown() {
    return contextDropdown;
  }

  public WebElement getShowErrorsButton() {
    return showErrorsButton;
  }

  public WebElement getNotInterestedButton() {
    return notInterestedButton;
  }

  public WebElement getZoomOutButton() {
    return zoomOutButton;
  }

  public WebElement getZoomInButton() {
    return zoomInButton;
  }

  public WebElement getPairingDetailsItem() {
    return pairingDetailsItem;
  }

  public WebElement getPairingMultiSelectItem() {
    return pairingMultiSelectItem;
  }

  public WebElement getPairingSelectAllItem() {
    return pairingSelectAllItem;
  }

  public WebElement getPairingEditDropdown() {
    return pairingEditDropdown;
  }

  public WebElement getPairingEditNameItem() {
    return pairingEditNameItem;
  }

  public WebElement getPairingEditCrewItem() {
    return pairingEditCrewItem;
  }

  public WebElement getPairingJoinItem() {
    return pairingJoinItem;
  }

  public WebElement getPairingLockItem() {
    return pairingLockItem;
  }

  public WebElement getPairingZoomItem() {
    return pairingZoomItem;
  }

  public WebElement getClosePairingToolbar() {
    return closePairingToolbar;
  }

  public String crewGroupDropdownValue = "//div[text()='%s']";

  public String crewGroupDropdown = "//div[text()='%s']/ancestor::span";

  public String rulesetlink = "//*[text()='%s']";

  public String currentCrewGroup = "//input[@id='context' and @value='%s']";

  public String timeline = "//span[text()='%s']";

  public String getCrewBase= "//span[text()='%s']";

  public String getPairingDetails= "//span[contains(text(),'%s')]";

  public String getApplicationTitle= "//span[text()='%s']";

  public String getParentTab= "//div[text()='%s']";

  public String BacktoHome="//*[@id=\"root\"]/div[1]/header/div/button";

  @FindBy(xpath = "//button[contains(@class,'ProfileBTN')]")
  private WebElement       userMenu;

  @FindBy(xpath = "//*[@id=\"pt-window-0\"]/div[2]/div[1]/div/div[2]/div[1]/div/div")
  private WebElement clickPairing;

  @FindBy(xpath = "//p[contains(text(),'Pairings')]/ancestor::a")
  private WebElement PairingLink;

  public WebElement clickPairingPage() { return PairingLink; }

  @FindBy(xpath = "//span[@id='react-select-context--value']/parent::div/preceding-sibling::input")
  private WebElement crewGroup;

  public WebElement getCrewGroup() { return crewGroup; }

  @FindBy(xpath = "//*[@id=\"react-select-context--value\"]")
  private WebElement crewGroupInitially;

  public WebElement ClickCrewGroupInitially() { return crewGroupInitially; }

  @FindBy(xpath = "//span[text()='gavel']/following-sibling::span")
  private WebElement ruleset;

  public WebElement getNoneRuleset() { return ruleset; }

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement plusButton;

  public WebElement clickPlusButton() { return plusButton; }

  @FindBy(xpath = "//span[text()='loupe']/ancestor::button")
  private WebElement zoomIn;

  public WebElement verifyZoomIn() { return zoomIn;}

  @FindBy(xpath = "//span[text()='arrow_drop_down']")
  private List<WebElement> arrow_drop_down;

  public List<WebElement> arrow_drop_down() { return arrow_drop_down;}

  @FindBy(xpath = "//span[@class='pairing-block']")
  private List<WebElement> verifyWidth;

  public List<WebElement> getWidth() { return verifyWidth; }

  public WebElement getClickPairing() {
    return clickPairing;
  }

  public WebElement getUserMenu() {
    return userMenu;
  }

  @FindBy(xpath = "//div[@id='filterIconContainer-1']/button[2]")
  private WebElement filterButton_Timeline1;

  public WebElement clickFilterButton_Timeline1() { return filterButton_Timeline1; }

  @FindBy(xpath = "//div[@id='filterIconContainer-2']/button[2]")
  private WebElement filterButton_Timeline2;

  public WebElement clickFilterButton_Timeline2() { return filterButton_Timeline2; }

  @FindBy(xpath = "//div[@id='filterIconContainer-3']/button[2]")
  private WebElement filterButton_Timeline3;

  public WebElement clickFilterButton_Timeline3() { return filterButton_Timeline3; }

  @FindBy(xpath = "//span[text()='Filters']//preceding-sibling::span")
  private WebElement getText_Timeline1;

  public WebElement getText_Timeline1() { return getText_Timeline1; }

  @FindBy(xpath = "//span[text()='Filters']//preceding-sibling::span")
  private WebElement getText_Timeline2;

  public WebElement getText_Timeline2() { return getText_Timeline2; }

  @FindBy(xpath = "//span[text()='Filters']//preceding-sibling::span")
  private WebElement getText_Timeline3;

  public WebElement getText_Timeline3() { return getText_Timeline3; }

  @FindBy(xpath = "//span[text()='close']/parent::span/parent::button")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }

  @FindBy(xpath = "//span[text()='cancel']/parent::button")
  private WebElement cancelButton;

  public WebElement clickCancelButton() { return cancelButton; }

  @FindBy(xpath = "//span[text()='apply']/parent::button")
  private WebElement applyButton;

  public WebElement clickApplyButton() { return applyButton; }

  public String getFilterTypeFieldText= "//div[text()='%s']";

  public String getSubCriteriaAfterAddOperation= "//div[text()='%s']";

  public String clickParticularCriteria= "//div[ @class='MuiListItemText-root']/span[text()='%s']";

  public String selectSubCriteria="//div[text()='%s']/preceding-sibling::span/span[@class='MuiIconButton-label']/input";

  @FindBy(xpath = " //span[text()='Criteria']/parent::button")
  private WebElement criteriaButton;

  public WebElement clickCriteriaBtn() { return criteriaButton; }
  @FindBy(xpath = "//*[text()='Pairings filter']/parent::div")
  private WebElement Pairing_Filter;
  public WebElement getPairing_Filter() { return Pairing_Filter; }
 public String getParticularFilterType="//*[@class='MuiList-root MuiMenu-list MuiList-padding']/li[text()='%s']";

  @FindBy(xpath = "//div[ @class='MuiListItemText-root']/span ")
  private List <WebElement> CriteriaElementList;

  public List <WebElement> getCriteriaElementList() { return CriteriaElementList; }

  @FindBy(xpath = "//span[text()='ADD']/parent::button")
  private List <WebElement> addButton;

  public List <WebElement> clickAddButton() { return addButton; }

  @FindBy(xpath = "//span[text()='Clear all']/parent::button")
  private List <WebElement> clearAllButton;

  public List <WebElement> clickClearAllBtn() { return clearAllButton; }

  @FindBy(xpath = "//input[@placeholder='Search']")
  private  List <WebElement> searchBox_subCriteria;

  public  List <WebElement> clickSearchBox_subCriteria() { return searchBox_subCriteria; }

  @FindBy(xpath = "//span[text()='highlight_off']/parent::span/parent::button")
  private WebElement clear_SearchBox_subCriteria;

  public WebElement click_Clear_SearchBox_subCriteria() { return clear_SearchBox_subCriteria; }

  @FindBy(xpath = "//button//span[@class='MuiIconButton-label']/child::*[local-name() = 'svg']/child::*[local-name() = 'path']")
  private List <WebElement> deleteButton;

  public List <WebElement> clickDeleteBtn() { return deleteButton; }

  @FindBy(xpath = ".//*[local-name() = 'label'][text()='Min']")
  private  List <WebElement> minFieldLabel;

  public  List <WebElement> minFieldLabel() { return minFieldLabel; }

  @FindBy(xpath = ".//*[local-name() = 'label'][text()='Max']")
  private  List <WebElement> maxFieldLabel;

  public  List <WebElement> maxFieldLabel() { return maxFieldLabel; }

  @FindBy(xpath = ".//*[local-name() = 'label'][text()='Min']/following-sibling::div/input")
  private  List <WebElement> minFieldValue;

  public  List <WebElement> minFieldValue() { return minFieldValue; }

  @FindBy(xpath = ".//*[local-name() = 'label'][text()='Max']/following-sibling::div/input")
  private  List <WebElement> maxFieldValue;

  public  List <WebElement> maxFieldValue() { return maxFieldValue; }

  @FindBy(xpath = "//span[text()='The minimum value must be smaller than or same as the maximum.']")
  private  List <WebElement> errorValidationMessage;

  public  List <WebElement> errorValidationMessage() { return errorValidationMessage; }

  @FindBy(xpath = "//input[@name='startTime' and @placeholder='YY/MM/DD HH:MM']")
  private WebElement startDate;
  public WebElement getStartDate() { return startDate; }

  @FindBy(xpath = "//input[@name='endTime' and @placeholder='YY/MM/DD HH:MM']")
  private WebElement endDate;
  public WebElement getEndDate() { return endDate; }


  @FindBy(xpath = "//input[@name='startTime' and @placeholder='HH:MM']")
  private WebElement clickTime;
  public WebElement getClickTime() {
    return clickTime;
  }

  @FindBy(xpath = "//input[@name='endTime' and @placeholder='HH:MM']")
  private WebElement clickEndTime;
  public WebElement getClickEndTime() {
    return clickEndTime;
  }

  public String timeList =  "//span[text()='23']";

  public String TIME = "//span[text()='%s']";
  public String TIMEVALUE ="//*[contains(@class,\'root MuiPickersClockNumber-clockNumber\') and text()=\'%s\']";

  @FindBy(xpath = "//button/span[text()='OK']")
  private WebElement timeOkButton;
  public WebElement getTimeOkButton() {
    return timeOkButton;
  }

  @FindBy(xpath = "//input[@id='dstStartDateTime']")
  private WebElement       dstStartDateTimeTextField;
  public WebElement getDstStartDateTimeTextField() {
    return dstStartDateTimeTextField;
  }

  @FindBy(xpath = "//button/span[text()='OK']")
  private WebElement calendarOkButton;
  public WebElement getCalendarOkButton() { return calendarOkButton; }

  @FindBy(xpath = "//input[@id='dstEndDateTime']")
  private WebElement       dstEndDateTimeTextField;
  public WebElement getDstEndDateTimeTextField() {
    return dstEndDateTimeTextField;
  }

  @FindBy(xpath = "//label[@for='dstShift']/following-sibling::*/descendant::div[@role='button']")
  private WebElement       dstChangeDropdown;
  public WebElement getDstChangeDropdown() { return dstChangeDropdown; }

  @FindBy(xpath = "//button//span//h6")
  private WebElement     calendarYearHeader;
  public WebElement getCalenderYearHeader() { return calendarYearHeader; }


  @FindBy(xpath = "//button[@class='MuiButtonBase-root MuiIconButton-root MuiPickersCalendarHeader-iconButton']")
  private WebElement       calendarLeftArrowButton;
  public WebElement getCalenderLeftArrowButton() {
    return calendarLeftArrowButton;
  }

  @FindBy(xpath = "//p[@class=\"MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter\"]")
  private WebElement calendarMonth;
  public WebElement getCalendarMonth() {return calendarMonth; }

  @FindBy(xpath = "//h3/parent::span/parent::button")
  private  List <WebElement> timeField;
  public  List <WebElement> clickTimeField() { return timeField; }

  @FindBy(xpath = "//button[@class='MuiButtonBase-root MuiTab-root MuiTab-textColorInherit Mui-selected MuiTab-fullWidth']")
  private WebElement clock;
  public WebElement clickClock() {return clock; }

  @FindBy(xpath = "//span[text()='The start of the date/time range must occur either before or should be the same as the end of the specified range.']")
  private WebElement  errorMessageOnDate;
  public WebElement verifyErrorMessageOnDate() {return errorMessageOnDate; }

  @FindBy(xpath = "//span[text()='Last filter']/parent::button")
  private WebElement lastFilter;
  public WebElement getLastFilter() {return lastFilter; }

  @FindBy(xpath = "//button[@class='close-btn']")
  private WebElement timelineCloseBtn;
  public WebElement clickTimelineCloseBtn() { return timelineCloseBtn; }

  @FindBy(xpath = "//div[@class='CheckboxFilter__StyledSubComponent-kQXOvf hFZqlc']/div[3]/div/div/div")
  private  List <WebElement> getDropDownValues;
  public  List <WebElement> getDropDownValues() { return getDropDownValues; }


  @FindBy(xpath = "//*[@class='timeline-label']/span[text()='T1']/following-sibling::span")
  private WebElement getFilterCountTimeline1;
  public WebElement getFilterCountTimeline1() { return getFilterCountTimeline1; }

  @FindBy(xpath = "//*[@class='timeline-label']/span[text()='T2']/following-sibling::span")
  private WebElement getFilterCountTimeline2;
  public WebElement getFilterCountTimeline2() { return getFilterCountTimeline2; }

  @FindBy(xpath = "//*[@class='timeline-label']/span[text()='T3']/following-sibling::span")
  private WebElement getFilterCountTimeline3;
  public WebElement getFilterCountTimeline3() { return getFilterCountTimeline3; }

  @FindBy(xpath = "//span[@class='filter-count']")
  private WebElement filterCount;
  public WebElement getFilterCount() { return filterCount; }


  @FindBy(xpath = "//div[@id='filterIconContainer-1']/button[1]")
  private WebElement clearFilterButton_Timeline1;

  public WebElement clearFilterButton_Timeline1() { return clearFilterButton_Timeline1; }

  @FindBy(xpath = "//div[@id='filterIconContainer-2']/button[1]")
  private WebElement clearFilterButton_Timeline2;

  public WebElement clearFilterButton_Timeline2() { return clearFilterButton_Timeline2; }

  public String            calendarYear        = "//div[(text()='%s')]";

  public String            calendarDay         = "//button[@class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day\"]//p[text()='%s']";

  public String            calendarTime        = "//span[text()='%s']";

  @FindBy(xpath = "//div[text()=\"Pairings\"]")
  private WebElement pairingPageTitle;

  public WebElement getPairingPageTitle() {
    return pairingPageTitle;
  }

  @FindBy(xpath = "//img[@class=\"rules_icon\"]")
  private WebElement ruleSetImage;

  public WebElement getRuleSetImage() {
    return ruleSetImage;
  }

  public String            pairingCalendarDay        = "//span[(text()='%s')]";

  public String            pairingTime        = "(//div[@class=\"hours\" and text()='%s'])[8]";

  @FindBy(xpath = "(//div[@class=\"pairings-row\"])[1]")
  private WebElement pairingsRow;

  public WebElement getPairingsRow() {
    return pairingsRow;
  }

  @FindBy(xpath = "//*[@id=\"Path-Copy-5\"]")
  private List <WebElement> selectPairingsWithCaution;

  public List <WebElement> getSelectPairingsWithCaution() {
    return selectPairingsWithCaution;
  }

  @FindBy(xpath = "//*[@id=\"Path\"]")
  private List <WebElement> selectPairingsWithFlag;

  public List <WebElement> getSelectPairingsWithFlag() {
    return selectPairingsWithFlag;
  }

  @FindBy(xpath = "//*[@id=\"Path-Copy-4\"]")
  private List <WebElement> selectPairingsWithInfraction;

  public List <WebElement> getSelectPairingsWithInfraction() {
    return selectPairingsWithInfraction;
  }

  @FindBy(xpath = "//span[@class=\"pairing-select bottom\"]")
  private WebElement selectBottom;

  public WebElement getSelectBottom() {
    return selectBottom;
  }

  @FindBy(xpath = "//span[@class=\"pairing-select left\"]")
  private WebElement selectLeft;

  public WebElement getSelectLeft() {
    return selectLeft;
  }

  @FindBy(xpath = "//span[@class=\"pairing-select top\"]")
  private WebElement selectTop;

  public WebElement getSelectTop() {
    return selectTop;
  }

  @FindBy(xpath = "//span[@class=\"pairing-select right\"]")
  private WebElement selectRight;

  public WebElement getSelectRight() {
    return selectRight;
  }

  @FindBy(xpath = "//*[@id=\"Path-Copy-5\"]//ancestor::button/following-sibling::div[@class='pairing-container']")
  private List <WebElement> selectPairingsWithCautionAlert;

  public List <WebElement> getSelectPairingsWithCautionAlert() {
    return selectPairingsWithCautionAlert;
  }

  @FindBy(xpath = "//*[@id=\"Path\"]//ancestor::button/following-sibling::div[@class='pairing-container']")
  private List <WebElement> selectPairingsWithFlagAlert;

  public List <WebElement> getSelectPairingsWithFlagAlert() {
    return selectPairingsWithFlagAlert;
  }

  @FindBy(xpath = "//*[@id=\"Path-Copy-4\"]//ancestor::button/following-sibling::div[@class='pairing-container']")
  private List <WebElement> selectPairingsWithInfractionAlert;

  public List <WebElement> getSelectPairingsWithInfractionAlert() {
    return selectPairingsWithInfractionAlert;
  }

  public String alertName= "//span[text()='%s']";

  public String alertNameDetails= "(//div[text()='%s'])[1]";

  @FindBy(xpath = "(//div[@class=\"AlertList__AlertRow-hyfJgV kOGbvO\"])[1]")
  private WebElement hoverColorTest;

  public WebElement getHoverColorTest() {
    return hoverColorTest;
  }

  @FindBy(xpath = "//div[@class=\"AlertList__AlertRow-hyfJgV kOGbvO\"]")
  private List <WebElement> alertRowCount;

  public List <WebElement> getAlertRowCount() {
    return alertRowCount;
  }

  @FindBy(xpath = "(//div[@class=\"AlertList__AlertRow-hyfJgV kOGbvO\"])[2]")
  private WebElement hoverOnSecondRow;

  public WebElement getHoverOnSecondRow() {
    return hoverOnSecondRow;
  }

  @FindBy(xpath = "//span[@class=\"alert-icon-outer-container\"]")
  private WebElement verticalScrollBar;

  public WebElement getVerticalScrollBar() {
    return verticalScrollBar;
  }

  @FindBy(xpath = "//span[text()='Enter a duration in the format HHhMM (e.g., 2h04 or 23h59)']")
  private  List <WebElement> verifyErrorMessage_durationFormat;

  public  List <WebElement> verifyErrorMessage_durationFormat() { return verifyErrorMessage_durationFormat; }

  @FindBy(xpath = "//a[@class='gantt_pane_icons_wrap']")
  private WebElement canvasTimeline1;

  public WebElement clickCanvasTimeline1() {
    return canvasTimeline1;
  }
  @FindBy(xpath = "//*[text()='Display all pairings']")
  private WebElement displayAllPairingLink;
  public WebElement getDisplayAllPairingLink(){
    return displayAllPairingLink;
  }
  public String  flightFilterType         = "//*[contains(@class,'FilterComponent__TitleSession')]/parent::div/descendant::div[text()='%s']/preceding-sibling::span/span/input";


}
