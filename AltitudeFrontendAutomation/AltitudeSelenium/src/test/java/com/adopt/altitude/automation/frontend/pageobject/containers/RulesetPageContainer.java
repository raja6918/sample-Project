package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class RulesetPageContainer extends PageContainer {

  public String expandButton = "//div[contains(text(),'%s')]/ancestor::div[@class='rst__rowWrapper']//preceding-sibling::div/button";

  public String threeDotsLink = "//div[contains(text(),'%s')]/ancestor::div[@class='rst__rowLabel']//following-sibling::div[@class='rst__rowToolbar']/div/div/button";

  public String click_Open_Get_Add_Duplicate_Delete = "//p[text()='%s']//parent::li";

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() {
    return deleteButton;
  }

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeButton;

  public WebElement clickCloseButton() { return closeButton; }

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement successMessage;

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement cancelButton;

  public WebElement getCancelButton() {
    return cancelButton;
  }

  @FindBy(xpath = "//span[text()='ERROR']")
  private WebElement dependancyErrorMessage;

  public WebElement getDependancyErrorMessage() {
    return dependancyErrorMessage;
  }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() {
    return refErrorMessage;
  }

  @FindBy(xpath = "//span[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement clickRefErrorCloseButton() {
    return refErrorCloseButton;
  }

  @FindBy(xpath = "//p[contains(text(), 'Rules')]/parent::a")
  private WebElement rulesLeftpanelIcon;

  public WebElement clickRulesLeftpanelIcon() { return rulesLeftpanelIcon; }

  @FindBy(xpath = "//span[text()='Rules']")
  private WebElement rulesCard;

  public WebElement getRulesCard() {return rulesCard; }

  @FindBy(xpath = "//a[text()='Manage rule sets']")
  private WebElement manageRulesetsLink;

  public WebElement getManageRulesetsLink() { return manageRulesetsLink; }

  @FindBy(xpath = "//input[@id='name']")
  private WebElement editRulesetNameTextBox;

  public WebElement getEditRulesetNameTextbox() { return editRulesetNameTextBox; }

  @FindBy(xpath = "//*[text()='SAVE']")
  private WebElement saveButton;

  public WebElement getSaveButton() {
    return saveButton;
  }

  public String getRulesetName = "//*[@class='basicTtlcls']/div[text()='%s']";
  public String getRulesetNameforCheckingName = "//div[text()='%s']";

  public String getLastModifiedTextOnRulsetTab = "//div[@class='ruleset-tooltip' and text()='Baseline']/ancestor::span[@class='rst__rowTitle rst__rowTitleWithSubtitle']//following-sibling::span[@class='rst__rowSubtitle']";

  @FindBy(xpath = "//textarea[@id='description']")
  private WebElement descriptionBox;

  public WebElement getDescriptionTextField() {
    return descriptionBox;
  }

  @FindBy(xpath = "//p[text()='Last modified']")
  private WebElement lastModifiedText;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/p")
  private WebElement ruleCount;

  public WebElement getRuleCount() {
    return ruleCount;
  }

  public WebElement getLastModifiedText() {
    return lastModifiedText;
  }

  @FindBy(xpath = "//p[text()='Last modified by']")
  private WebElement lastModifiedByText;

  public WebElement getLastModifiedByText() {
    return lastModifiedByText;
  }

  public String getLastModifiedTextOnRulesetTab= "//div[text()='%s']/ancestor::span[@class='rst__rowTitle rst__rowTitleWithSubtitle']//following-sibling::span[@class='rst__rowSubtitle']";

  public String rulesName = "//*[text()='%s']";

  public String expandRulesName = "//*[text()='%s']/parent::td/preceding-sibling::td/button";

  @FindBy(xpath = "//*[text()='Maximum duties per pairing']/parent::td/parent::tr/following-sibling::tr[1]/descendant::td/descendant::span[2][@class='rule-description-input']/div/div/input")
  private WebElement legsValue;

  public WebElement getLegsValue() {
    return legsValue;
  }

  public String ruleState = "//*[(text()='%s')]/ancestor::tr/td[3]/child::span/span[contains(@class,'MuiSwitch-root')]/span";

  public String rulePageDropDown = "//*[text()='%s']";
  public  String OnOffStatus = "//*[(text()='%s')]/ancestor::tr/td[3]/child::span/span[@class='switchLabelBold']";

  @FindBy(xpath = "//*[text()='Maximum flights per duty']/parent::td/parent::tr/following-sibling::tr[1]/descendant::td/descendant::span[2][@class='rule-description-input']/div/div/input")
  //*[@id="contentContainer"]/div/div/table/div/tbody/tr[8]/td/div/div/div/div/div/span/div/div/input
  //*[text()='Maximum flights per duty']/parent::td/parent::tr/following-sibling::tr[1]/descendant::td/descendant::span[2][@class='rule-description-input']/div/div/input
  private WebElement dutiesValue;

  public WebElement getDutiesValue() {
    return dutiesValue;
  }

  @FindBy(xpath = "//*[contains(@class,'RuleDescription__PrimarySession')]")

  //div[@class='NavBar__ContainerBTNs-dHtBJh ckjQMF']
  private WebElement clicksAway;

  public WebElement getClicksAway() {
    return clicksAway;
  }

  public String getUpdatedDutiesValues = "//input[@value='%s']";

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[9]/div/div")
  private WebElement deadheadsValue;

  public WebElement getDeadheadsValue() {
    return deadheadsValue;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[10]/div/div/input")
  private WebElement maxDutyCredit;

  public WebElement getMaxDutyCredit() {
    return maxDutyCredit;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[14]/div/div")
  private WebElement mealType;

  public WebElement getMealType() {
    return mealType;
  }

  @FindBy(xpath = "//input[contains(@placeholder,'') and @class=\"MuiInputBase-input MuiInput-input\"]")
  private WebElement otherwiseValue;

  public WebElement getOtherwiseValue() {
    return otherwiseValue;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[10]/td/div/div/div/div/div/span[1]/div/div/input")
  private WebElement noMoreThanValue;
  public WebElement getNoMoreThanValue() {
    return noMoreThanValue;
  }
  @FindBy(xpath = "//*[@class='rule-description']/descendant::div/input")
  private WebElement timeValidator;
  public WebElement getTimeValidator(){return timeValidator;}

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[7]/div/div/input")
  private WebElement commercialDeadheads;

  public WebElement getCommercialDeadheads() {
    return commercialDeadheads;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[12]/div/div/input")
  private WebElement specialTagValue;

  public WebElement getSpecialTagValue() {
    return specialTagValue;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[13]/div/div/input")
  private WebElement specialTailNumber;

  public WebElement getSpecialTailNumber() {
    return specialTailNumber;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[1]/div/div/input")
  private WebElement clickTime;

  public WebElement getClickTime() {
    return clickTime;
  }

  public String OPERATINGFLIGHTS_TIME = "//span[text()='%s']";

  @FindBy(xpath = "//button/span[text()='OK']")
  private WebElement timeOkButton;

  public WebElement getTimeOkButton() {
    return timeOkButton;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[4]/td/div/div/div/div/div/span[5]/div/div/input")
  private WebElement clickDate;

  public WebElement getClickDate() {
    return clickDate;
  }

  @FindBy(xpath = "//button//span//h6")
  private WebElement calendarYearHeader;

  public WebElement getCalendarYearHeader() {
    return calendarYearHeader;
  }

  public String      CALENDAR_YEAR       = "//div[(@role='button')and(text()='%s')]";

  @FindBy(xpath = "//div//p[@class=\"MuiTypography-root MuiTypography-body1 MuiTypography-alignCenter\"]")
  private WebElement calendarMonth;

  public WebElement getCalendarMonth() {
    return calendarMonth;
  }

  @FindBy(xpath = "//button[2]//span[contains(@class, 'MuiIconButton-label')]//*[name()='svg']")
  private WebElement calendarRightArrowButton;

  public WebElement getCalendarRightArrowButton() {
    return calendarRightArrowButton;
  }

  public String      CALENDAR_DAY        = "//button[@class=\"MuiButtonBase-root MuiIconButton-root MuiPickersDay-day\"]//p[text()='%s']";

  @FindBy(xpath = "//button/span[text()='OK']")
  private WebElement calendarOkButton;

  public WebElement getCalendarOkButton() {
    return calendarOkButton;
  }

  public String      LINK_TEXT       = "//span[contains(@class,'Description__HyperLink') and text()='%s']";

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[10]/td/div/div/div/div/div[2]/div[2]/span[2]/span[2]/div/div/input")
  private WebElement briefTime;

  public WebElement getBriefTime() {
    return briefTime;
  }

  @FindBy(xpath = "//*[@id=\"contentContainer\"]/div/div/table/div/tbody/tr[10]/td/div/div/div/div/div[2]/div[2]/span[2]/span[4]/div/div/input")
  private WebElement otherWiseValue;

  public WebElement getOtherWiseValue() {
    return otherwiseValue;
  }


  @FindBy(xpath = "//span[text() = \"Name\"]")
  private WebElement tableHeader;

  public WebElement getTableHeader() {
    return tableHeader;
  }

  @FindBy(xpath = "//input[contains(@placeholder,'') and @class=\"MuiInputBase-input MuiInput-input\"]")
  private WebElement currentPlaceHolderValue;

  public WebElement getCurrentPlaceHolderValue() {
    return currentPlaceHolderValue;
  }

  @FindBy(xpath = "//div[@class=\"overlay\"]")
  private WebElement overlay;

  public WebElement getOverlay() {
    return overlay;
  }

  @FindBy(xpath = "//input[contains(@disabled,'') and @class=\"MuiInputBase-input MuiInput-input Mui-disabled Mui-disabled\"]")
  private WebElement currentPlaceHolder;

  public WebElement getCurrentPlaceHolder() {
    return currentPlaceHolder;
  }

  @FindBy(xpath = "//button[@class=\"MuiButtonBase-root MuiIconButton-root Mui-disabled MuiIconButton-sizeSmall Mui-disabled\"]")
  private List <WebElement> revertButton;

  public List<WebElement> getRevertButton() {
    return revertButton;
  }

  @FindBy(xpath = "//*[@class=\"MuiSvgIcon-root MuiSelect-icon Mui-disabled\"]")
  private List <WebElement> stateComboBoxOnOff;

  public List<WebElement> getStateComboBoxOnOff() {
    return stateComboBoxOnOff;
  }

  @FindBy(xpath = "//div[contains(@class, 'MuiInputBase')]//child::div//child::p")
  private WebElement currentRuleSet;

  public WebElement getCurrentRuleSet() {
    return currentRuleSet;
  }

  public String SELECT_RULESET = "//p[text()='%s']";

  @FindBy(xpath = "//span[contains(@class, 'ellipsisTransformer')]")
  private List <WebElement> allRules;

  public List<WebElement> getAllRules() {
    return allRules;
  }

  @FindBy(xpath = "//div[contains(@class, \"RuleDescription\")]")
  private List <WebElement> ruleDescription;

  public List<WebElement> getRuleDescription() {
    return ruleDescription;
  }


  @FindBy(xpath = "//a[@href=\"rules/rule-sets\"]")
  private WebElement manageRuleLink;

  public WebElement getManageRuleLink() {
    return manageRuleLink;
  }

  @FindBy(xpath = "//a[@href=\"../rules\"]")
  private WebElement backToRules;

  public WebElement getBackToRules() {
    return backToRules;
  }

  @FindBy(xpath = "//div[contains(@class, \"RuleDescription\")]//child::span/span/div/div/input")
  private WebElement RuleDescriptionValue;

  public WebElement getRuleDescriptionValue() {
    return RuleDescriptionValue;
  }

  public String COLLAPSE_BUTTON = "//div[text()= '%s']//ancestor::div[contains(@class, \"rst__rowWrapper\")]//preceding-sibling::div/button[contains(@class, \"collapseButton\")]";
  public String EXPAND_BUTTON = "//div[text()= '%s']//ancestor::div[contains(@class, \"rst__rowWrapper\")]//preceding-sibling::div/button[contains(@class, \"expandButton\")]";

  public String RULE_SET_NAME= "//label[text()= '%s']";
  public String RULE_SET_EDIT= "//div[contains(@class, \"MuiGrid\")]//child::p[text()= '%s']";

  @FindBy(xpath = "//h2[text()='root']")
  private WebElement baselineRulesPageForUAT;

  public WebElement getBaselineRulesPageForUAT() {
    return baselineRulesPageForUAT;
  }

  @FindBy(xpath = "//*[@class='rule-description']/descendant::span[contains(@class,'MuiSwitch-root GenericSwitchField')]")
  private List<WebElement> toggleButtons;

  public List<WebElement> getToggleButtons() {
    return toggleButtons;
  }

  @FindBy(xpath = "//*[@class='rule-description']/descendant::span[@class='date-time-pointer']/descendant::div/input")
  private WebElement selectTime;

  public WebElement getSelectTime() {
    return selectTime;
  }

  @FindBy(xpath = "//*[@class='rule-description']/descendant::div/descendant::span[@class='rule-description-input']/descendant::div/input")
  private WebElement intAndDecimalValue;

  public WebElement getIntAndDecimalValue() {
    return intAndDecimalValue;
  }

  public String changeRuleParameterValue = "//*[contains(text(),'%s')]/span[@class='rule-description-input']/descendant::div/input";
  @FindBy(xpath = "//*[@class='rule-description']/descendant::div/input")
  List<WebElement> inputFields;

  public List<WebElement> getInputFields() {
    return inputFields;
  }

  @FindBy(xpath = "//*[contains(@class,'MuiDialogTitle-root Base__StyledDialog')]")
  private WebElement getTabePopUpWindow;

  public WebElement getTablePopUpWindow() {
    return getTabePopUpWindow;
  }

  @FindBy(xpath = "//*[@id='dynamic-table-container']//tbody/tr/td")
  private List<WebElement> insertTableData;

  public List<WebElement> getInsertDataLocation() {
    return insertTableData;
  }

  @FindBy(xpath = "//*[@id='dynamic-table']/descendant::div[@class='scrollbar-container ps']/table/descendant::tbody/tr")
  private List<WebElement> numberOfRowsForTable;

  public List<WebElement> getNumberOfRows() {
    return numberOfRowsForTable;
  }

  @FindBy(xpath = "//*[text()='CANCEL']/parent::button")
  private WebElement clickCancelButton;

  public WebElement clickCancelButton() {
    return clickCancelButton;
  }

}
