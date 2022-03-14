package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class SolverPageContainer extends PageContainer {

  @FindBy(xpath = "//input[@id='solverTask']")
  private WebElement solvertaskName;

  @FindBy(xpath = "//input[@id='crewGroup']")
  private WebElement CrewGroupNameDropdown;

  @FindBy(xpath = "//input[@id='rule']")
  private WebElement ruleNameDropdown;

  @FindBy(xpath = "//form//input[@id='recipe']")
  private WebElement recipeNameDropdown;

  @FindBy(xpath = "//button[span[text()='ADD']]")
  private WebElement addButtonDisabled;

  @FindBy(xpath = "//textarea[@id='description']")
  private WebElement descriptionBox;

  @FindBy(xpath = "//h2[text() = 'Solver Request']")
  private WebElement solverPageHeader;

  @FindBy(xpath = "//h2[text() = 'Solver Request']/following-sibling::p")
  private WebElement scenarioStatus;

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addSolverRequestButton;

  @FindBy(xpath = "//span[contains(text(),'Statistics')]")
  private WebElement clickStatistics;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[1]/div/button[2]/span[1]/span")
  private WebElement clickDots;

  @FindBy(xpath = "//*[@id=\"long-menu\"]/div[3]/ul/li[1]/p")
  private WebElement clickCompare;

  @FindBy(xpath = "//span[text()='delete']")
  private WebElement buttonDelete;

  @FindBy(xpath = "//div[contains(@class,'root')]/following-sibling::div")
  private WebElement dropDownValue;

  @FindBy(xpath = "//span[contains (@aria-label, 'Clear value')]")
  private WebElement clearValue;

  @FindBy(id = "mui-component-select-crewBaseSelected")
  private WebElement crewBaseDropdown;

  @FindBy(xpath = "//span[text()=\"filter_list\"]")
  private WebElement clickFilter;

  @FindBy(xpath = "//input[@placeholder=\"Search\"]")
  private WebElement solverFilterName;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[1]/ul/div/div[1]/div[2]/div[1]/span/span[1]/input")
  private WebElement selectSolverFilterName;


  @FindBy(xpath = "//div[contains(@class, 'FilterContainer')]/descendant::input[@type='checkbox']")
  private WebElement selectAllCheckbox;

  @FindBy(xpath = "//span[text()='filter_list']/ancestor::button")
  private WebElement filterRequestButton;

  @FindBy(xpath = "//button[@aria-label='More']")
  private WebElement moreOptionsButton;

  @FindBy(xpath = "//p[text()='Compare']")
  private WebElement compareRequestsButton;

  @FindBy(xpath = "//p[text()='Launch']")
  private WebElement launchRequestsButton;

  @FindBy(xpath = "//p[text()='Delete']")
  private WebElement deleteRequestsButton;

  @FindBy(xpath = "//input[@placeholder='search']")
  private WebElement searchRequestTextField;

  @FindBy(xpath = "//button[contains(@class,'ClearButton')]")
  private WebElement clearSearchButton;

  @FindBy(xpath = "//div[contains(@class,'SolverStatusBar')]/child::p")
  private WebElement requestStatus;

  @FindBy(xpath = "//span[text()='play_arrow']/ancestor::button")
  private WebElement launchRequestButton;

  @FindBy(xpath = "//span[text()='stop']/ancestor::button")
  private WebElement stopRequestButton;

  @FindBy(xpath = "//span[text()='visibility']/ancestor::button")
  private WebElement previewRequestButton;

  @FindBy(xpath = "//span[text()='Favorite']/ancestor::button")
  private WebElement favoriteRequestButton;

  @FindBy(xpath = "//span[text()='More']/ancestor::button")
  private WebElement requestMoreOptionButton;

  @FindBy(xpath = "//label[@for='solverTask']/following-sibling::div")
  private WebElement solverTaskDropdown;

  @FindBy(xpath = "//label[@for='crewGroup']/following-sibling::div")
  private WebElement crewGroupDropdown;

  @FindBy(xpath = "//label[@for='targets']/following-sibling::div")
  private WebElement targetsDropdown;

  @FindBy(id = "description")
  private WebElement descriptionTextField;

  @FindBy(xpath = "//label[@for='scope']/following-sibling::div")
  private WebElement scopeDropdown;

  @FindBy(xpath = "//label[@for='rule']/following-sibling::div")
  private WebElement rulesDropdown;

  @FindBy(xpath = "//label[contains(text(),'Request name')]//following-sibling::div/input")
  private WebElement requestNameTextbox;

  @FindBy(xpath = "//form//label[@for='recipe']/following-sibling::div")
  private WebElement recipeDropdown;

  @FindBy(xpath = "//*[@id='notification-area']//div[@class='msg']")
  private WebElement successMessage;

  @FindBy(xpath = "//p[contains(text(),'Solver name cannot start with a space or special character')]")
  private WebElement InvalidRequestNameMessage;

  @FindBy(xpath = "//label[@for='crewComplements']/following-sibling::div")
  private WebElement crewComplementsDropdown;

  @FindBy(xpath = "//label[@for='rules']/parent::div/parent::div/following-sibling::div/child::button")
  private WebElement editRulesButton;

  @FindBy(xpath = "//label[@for='scope']/parent::div/parent::div/following-sibling::div/child::button")
  private WebElement editScopeButton;

  @FindBy(xpath = "//label[@for='recipe']/parent::div/parent::div/following-sibling::div/child::button")
  private WebElement editRecipeButton;

  @FindBy(xpath = "//label[@for='crewComplements']/parent::div/parent::div/following-sibling::div/child::button")
  private WebElement editCrewComplementButton;

  @FindBy(xpath = "//span[text()='Statistics']/ancestor::button")
  private WebElement statisticsTab;

  @FindBy(xpath = "//span[text()='Summary']/ancestor::button")
  private WebElement summaryTab;

  @FindBy(xpath = "//span[text()='settings']/ancestor::button")
  private WebElement settingsButton;

  @FindBy(xpath = "//p[contains(text(),'Solver')]/ancestor::a")
  private WebElement SolverLink;

  @FindBy(xpath = "//p[contains(text(),'Ready to launch!')]/parent::div/following::input[@id='name']")
  private WebElement editRequestName;

  @FindBy(xpath = "//label[@for='crewGroupName']/following::div[@id='mui-component-select-crewGroupName']")
  private WebElement editCrewGroup;

  @FindBy(xpath = "//label[@for='rulesetName']/following::div[@id='mui-component-select-rulesetName']")
  private WebElement editRule;
  //label[@for='solverRecipeName']/following::div[@id='mui-component-select-solverRecipeName']

  @FindBy(xpath = "//*[@id='react-select-recipe--value']")
  private WebElement editRecipe;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/div/div/div[2]/div/div[1]/div[2]/div[13]/div/div[1]")
  private WebElement addSameRowData;

  @FindBy(xpath = "//div[contains(@class,'Select-placeholder')]")
  private WebElement addRowValue;

  public String staticValue = "//div[text()='%s']";

  public String testCheckBox = "//div[contains(@class, 'SolverCard__Holder-hPUOPI bXwzSC') and contains(.//p, '%s')]";

  public String solverRequestInfo = "//p[contains(text(), '%s')]/parent::div[contains(@class, 'RequestInfo')]";

  public String solverRequestSelectCheckbox = "//p[contains(text(), '%s')]/ancestor::li/descendant::input[@type='checkbox']";

  public String itemServedXpath = "//li[p[text()='%s']]";

  public String addButton = "//span[contains(text(),'ADD')]";

  public String SelectCreatedSolverRequest = "//p[contains(text(),'%s')]//parent::div//parent::div";

  public String getTextFromCreatedSolverRequest = "//p[contains(text(),'%s')]";

  public String getTextFromRuleDropdown = "//p[contains(text(),'%s')]";

  public String getTextFromRecipeDropdown = "//*[contains(text(),'%s')]";

  public String updateRequestName = "//input[@value= '%s']/parent::div";

  public String editCrewGroupDropdown = "//p[contains(text(),'%s')]/parent::li";

  public String editRuleDropdown = "//p[contains(text(),'%s')]/parent::li";

  public String editRecipeDropdown = "//*[@class=\"Select-menu-outer\"]//div[@id='react-select-recipe--list']/div[text()='%s']";

  public String verifyStatisticsSequence = "//input[contains(@id, position)]";

  public String verifyStatistics = "//div[contains(text(), value)]";

  public String crewGroupDropDown = "//li[text()='%s']";

  public WebElement SOLVERTASK() {
    return solvertaskName;
  }

  public WebElement CREWGROUP() {
    return CrewGroupNameDropdown;
  }

  public WebElement RULES() {
    return ruleNameDropdown;
  }

  public WebElement RECIPE() {
    return recipeNameDropdown;
  }

  public WebElement getAddButton() {
    return addButtonDisabled;
  }

  public WebElement getdescriptionBox() {
    return descriptionBox;
  }

  public WebElement clickSolver() {
    return SolverLink;
  }

  public WebElement getSolverPageHeader() {
    return solverPageHeader;
  }

  public WebElement getScenarioStatus() {
    return scenarioStatus;
  }

  public WebElement getAddSolverRequestButton() {
    return addSolverRequestButton;
  }

  public WebElement getSelectAllCheckbox() {
    return selectAllCheckbox;
  }

  public WebElement getFilterRequestButton() {
    return filterRequestButton;
  }

  public WebElement getMoreOptionsButton() {
    return moreOptionsButton;
  }

  public WebElement getSearchRequestTextField() {
    return searchRequestTextField;
  }

  public WebElement getRequestStatus() {
    return requestStatus;
  }

  public WebElement getLaunchRequestButton() {
    return launchRequestButton;
  }

  public WebElement getStopRequestButton() {
    return stopRequestButton;
  }

  public WebElement getPreviewRequestButton() {
    return previewRequestButton;
  }

  public WebElement getFavoriteRequestButton() {
    return favoriteRequestButton;
  }

  public WebElement getRequestMoreOptionButton() {
    return requestMoreOptionButton;
  }

  public WebElement getSolverTaskDropdown() {
    return solverTaskDropdown;
  }

  public WebElement getRules() {
    return rulesDropdown;
  }

  public WebElement getRequestName() {
    return requestNameTextbox;
  }

  public WebElement getRecipe() {
    return recipeDropdown;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getInvalidRequestNameMessage() {
    return InvalidRequestNameMessage;
  }

  public WebElement getCrewGroupDropdown() {
    return crewGroupDropdown;
  }

  public WebElement getTargetsDropdown() {
    return targetsDropdown;
  }

  public WebElement getDescriptionTextField() {
    return descriptionTextField;
  }

  public WebElement getScopeDropdown() {
    return scopeDropdown;
  }

  public WebElement getRulesDropdown() {
    return rulesDropdown;
  }

  public WebElement getStatisticsTab() {
    return statisticsTab;
  }

  public WebElement getSummaryTab() {
    return summaryTab;
  }

  public WebElement getSettingsButton() {
    return settingsButton;
  }

  public WebElement getCompareRequestsButton() {
    return compareRequestsButton;
  }

  public WebElement getLaunchRequestsButton() {
    return launchRequestsButton;
  }

  public WebElement getDeleteRequestsButton() {
    return deleteRequestsButton;
  }

  public WebElement getClearSearchButton() {
    return clearSearchButton;
  }

  public WebElement getRecipeDropdown() {
    return recipeDropdown;
  }

  public WebElement getCrewComplementsDropdown() {
    return crewComplementsDropdown;
  }

  public WebElement getEditRequestNameTextBox() {
    return editRequestName;
  }

  public WebElement getEditCrewGroupTextBox() {
    return editCrewGroup;
  }

  public WebElement getEditRuleTextBox() {
    return editRule;
  }

  public WebElement getEditRecipeTextBox() {
    return editRecipe;
  }

  public String getLeftPanelIcon = "//p[contains(text(),'%s')]/parent::div/following-sibling::img";

  public String getTimeStampText = "//span[contains(@class,'ElapsedTime__TimeWrapper')]/parent::p[contains(text(),'%s')]";

  public String getLaunchOrStopButton = "//span[span[text()='%s']]/parent::button";

  public String getFieldText = "//div[contains(@class, \"MuiSelect-root\")]//child::p[text()='%s']";

  public String getLaunchMessage = "//p[contains(text(),'%s')]";

  @FindBy(xpath = "//span[contains(text(),'Launch')]/parent::span/parent::button")
  private WebElement LaunchButton;

  public WebElement clickLaunchButton() {
    return LaunchButton;
  }

  @FindBy(xpath = "//input[@id='crewGroupName']")
  private WebElement crewGroup_Launch;

  public WebElement crewGroupIsEnabled() {
    return crewGroup_Launch;
  }

  @FindBy(xpath = "//input[@id='solverTaskName']")
  private WebElement solverTask_Launch;

  public WebElement solverTaskIsEnabled() {
    return solverTask_Launch;
  }

  @FindBy(xpath = "//input[@id='rulesetName']")
  private WebElement rules_Launch;

  public WebElement rulesIsEnabled() {
    return rules_Launch;
  }

  @FindBy(xpath = "//*//*[@for='recipe']/following-sibling::div/descendant::input")
  private WebElement recipe_Launch;

  public WebElement recipeIsEnabled() {
    return recipe_Launch;
  }

  @FindBy(xpath = "//input[@id='solverScopeId']")
  private WebElement scope_Launch;

  @FindBy(xpath = "//p[contains(text(),'No solver request has been selected')]")
  private WebElement messageNoSolverSelected;

  public WebElement scopeIsEnabled() {
    return scope_Launch;
  }

  @FindBy(xpath = "//div[contains(@class,'Solver__SolverStatusBar')]/child::P")
  private WebElement progressBarMessage;

  public WebElement getProgressBarMessage() { return progressBarMessage; }

  @FindBy(xpath = "//span[contains(text(),'Stop')]/parent::span/parent::button")
  private WebElement stopButton;

  public WebElement clickStopButton() {
    return stopButton;
  }

  @FindBy(xpath = "//*[text()='Stop solver request']/parent::button")
  private WebElement stopConfirmation;

  public WebElement clickStopConfirmation() {
    return stopConfirmation;
  }

  @FindBy(xpath = "//div[@id='form-dialog-title']")
  private WebElement loader;

  public WebElement getLoader() {
    return loader;
  }

  public String previewButton = "//span[text()='%s']/ancestor::button";

  public String clickSavePairingOrClosepreview = "//span[text()='%s']/parent::button";

  public WebElement getClickStatistics() {
    return clickStatistics;
  }

  public WebElement getClickFilter() {
    return clickFilter;
  }

  public WebElement getSolverFilterName() {
    return solverFilterName;
  }

  public WebElement getSelectSolverFilterName() {
    return selectSolverFilterName;
  }

  public WebElement getClickDots() {
    return clickDots;
  }

  public WebElement getClickCompare() {
    return clickCompare;
  }

  public WebElement getButtonDelete() {
    return buttonDelete;
  }

  public WebElement getDropDownValue() {
    return dropDownValue;
  }

  public WebElement getMessageNoSolverSelected() {
    return messageNoSolverSelected;
  }

  public WebElement getCrewBaseDropdown() {
    return crewBaseDropdown;
  }

  public WebElement getAddRowValue() {
    return addRowValue;
  }

  public WebElement getAddSameRowData() {
    return addSameRowData;
  }

  public WebElement getClearValue() {
    return clearValue;
  }

  @FindBy(xpath = "//div[contains(@class,'NotificationCard__Row1')]/child::span[2]/span")
  private List<WebElement>  currentScenario;

  public List<WebElement> getCurrentScenario_AlertPopUp() { return currentScenario; }

  @FindBy(xpath = "//div[contains(@class,'NotificationCard__Row2')]/div")
  private List<WebElement>  currentSolverReqName;

  public List<WebElement>  getCurrentSolverReqName_AlertPopUp() { return currentSolverReqName; }

  @FindBy(xpath = "//span[text()='notifications']/ancestor::button")
  private WebElement  notificationIcon;

  public WebElement  clickNotificationIcon() { return notificationIcon; }

  @FindBy(xpath = "//span[text()='notifications']/following-sibling::span[contains(text(),'1')]")
  private WebElement  notificationCount;

  public WebElement  clickNotificationIconCount() { return notificationCount; }

  @FindBy(xpath = "//span[text()='Notifications']//following-sibling::*[local-name() = 'svg' and @class='MuiSvgIcon-root']")
  private WebElement  clearNotificationBtn;

  public WebElement  clearNotificationButton() { return clearNotificationBtn; }

  @FindBy(xpath = "//span[text()='close']/ancestor::button")
  private WebElement  closeNotificationBtn;

  public WebElement  closeNotificationButton() { return closeNotificationBtn; }

  // new implementation for solver
  @FindBy(xpath = "//p[contains(text(),'Completed successfully')]")
  private WebElement  completedSuccessfully;

  public WebElement  getCompletedSuccessfully() { return completedSuccessfully; }

  @FindBy(xpath = "//p[contains(text(),'Running...')] | //p[contains(text(),'Sending the job')] | /p[contains(text(),'Waiting for an available computer resource...')]")
  private WebElement  statusRunningOrSendingTheJob;

  public WebElement  getStatusRunningOrSendingTheJob() { return statusRunningOrSendingTheJob; }

  @FindBy(xpath = "//p[contains(text(),'Stopped by user')] | //p[contains(text(),'Stopped internally: something went wrong')] | //p[contains(text(),'Stopped internally: something went wrong')]")
  private WebElement  StoppedByUser;

  public WebElement  getStoppedByUser() { return StoppedByUser; }

  public String solverRequest = "//span[text()='%s']";

  public String scenarioName = "//span[text()='%s']";

  public String pageHeader = "//h2[text()='%s']";

  public String allCheckBox = "//input[@type ='%S']";

  @FindBy(xpath = "//input[@type=\"checkbox\"]")
  private List<WebElement>   allCheckBoxes;

  public List<WebElement>  getAllCheckBoxes() { return allCheckBoxes; }

  @FindBy(xpath = "//span[@class=\"MuiBadge-badge MuiBadge-anchorOriginTopRightRectangle MuiBadge-colorSecondary\"]")
  private WebElement  notificationBellCount;

  public WebElement  getNotificationBellCount() { return notificationBellCount; }

  @FindBy(xpath = "//div[contains(@class,'NotificationCard__Row1')]//img[contains(@src, 'Solver-Completed-icon') or //img[contains(@src, 'Solver-Failed-icon')]]")
  private WebElement  solverStatusImage;

  public WebElement  getSolverStatusImage() { return solverStatusImage; }

  public String solverPageDetail = "//p[text() = '%s']";

  public String popUpHeader = "//*[text()='%s']";

  public String switchScenario = "//span[@class= \"MuiButton-label\" and text()='%s']";

  public String pageDetails = "//h2[text()='%s']";

  @FindBy(css = "[class*='Home__Header']")
  private WebElement  pageDataDetails;

  public WebElement  getPageDataDetails() { return pageDataDetails; }

 //  This is old one --> public String getPopoverMessage = "//div[@class=\"NotificationPane__ClearMessage-lclgGh hbDEtd\" and text()='%s']";
  public String getPopoverMessage = "//*[text()='%s']";
 // @FindBy(xpath = "//div[@class= \"NotificationPane__FormBody-ZcPiS jEEiOr\"]//following-sibling::*[local-name() = 'svg' and @class='MuiSvgIcon-root']")
  @FindBy(css="[class*='NotificationCard__Card'] svg")
  private WebElement  trashCanIcon;

  public WebElement  getTrashCanIcon() { return trashCanIcon; }

  @FindBy(xpath = "//img[@alt=\"notification unread icon\"]")
  private WebElement  notificationUnreadIcon;

  public WebElement  getNotificationUnreadIcon() { return notificationUnreadIcon; }

  @FindBy(css = "[class*='NotificationCard__Card'] svg")
  private WebElement  deleteIcon;

  public WebElement  getDeleteIcon() { return deleteIcon; }

  @FindBy(xpath = "//*[contains(@class,'NotificationCard__Row3')]")
  private WebElement  dateTimeOfNotification;

  public WebElement  getDateTimeOfNotification() { return dateTimeOfNotification; }

  @FindBy(xpath = "//*[local-name()='svg' and @style ]/*[local-name()='path']")
  private WebElement  errorIcon;

  public WebElement  getErrorIcon() { return errorIcon; }

  @FindBy(xpath = "(//*[local-name()='svg' and @style ]/*[local-name()='path'])[1]")
  private WebElement  crewGroupErrorIcon;

  public WebElement  getCrewGroupErrorIcon() { return crewGroupErrorIcon; }

  @FindBy(xpath = "(//*[local-name()='svg' and @style ]/*[local-name()='path'])[2]")
  private WebElement  ruleSetErrorIcon;

  public WebElement  getRuleSetErrorIcon() { return ruleSetErrorIcon; }

  @FindBy(xpath = "//*[text()='This crew group has either been renamed or does not exist in this scenario.']")
  private WebElement  crewGroupErrorMessage;

  public WebElement  getCrewGroupErrorMessage() { return crewGroupErrorMessage; }

  @FindBy(xpath = "//*[text()='This rule set has either been renamed or does not exist in this scenario.']")
  private WebElement  ruleSetErrorMessage;

  public WebElement  getRuleSetErrorMessage() { return ruleSetErrorMessage; }

  @FindBy(xpath = "//ul[@class=\"MuiList-root MuiMenu-list MuiList-padding\"]")
  private WebElement  dropDownValues;

  public WebElement  getDropDownValues() { return dropDownValues; }

  @FindBy(xpath = "//h2[text()='Solver request']")
  private WebElement solverPageTitle;

  public WebElement getSolverPageTitle() {
    return solverPageTitle;
  }

  @FindBy(xpath = "//span[text()= \"more_vert\"]")
  private WebElement compareThreeDots;

  public WebElement getCompareThreeDots() {
    return compareThreeDots;
  }

  @FindBy(xpath = "//div[@class= \"rt-tr\"]")
  private WebElement statisticsHeader;

  public WebElement getStatisticsHeader() {
    return statisticsHeader;
  }


  public String SolverFilterName= "//div[contains(@class, \"SolverCard__RequestInfo\")]//child::p[text()= '%s']";

  public String selectSolver= "//div[contains(@class, \"SolverCard__RequestHolder\")]//descendant::p[text()= '%s']//ancestor::div[contains(@class, \"SolverCard__Holder\")]//descendant::input";

  public String textOnPairingPage=  "//span[text()='%s']/parent::button";

  public String textOnPairingPageBaseline=  "//*[text()='%s']";

  public String compareOption=  "//p[text()= '%s']";

  public String clickSolver=  "//p[text()= '%s']";

  public String displayOnPairing=  "//div[text()= '%s']/parent::div";

  public  String detailsFavoriteSolver ="//div[contains(@class, \"SolverCard__RequestHolder\")]//descendant::p[text()='%s']//ancestor::div[contains(@class, \"SolverCard__RequestHolder\")]";

  public  String favoriteSolver = "//div[contains(@class, \"SolverCard__RequestHolder\")]//descendant::p[text()= '%s']//ancestor::div[contains(@class, \"SolverCard__RequestHolder\")]//child::span[text()=\"favorite\"]";
  @FindBy(xpath = "//*[@class='MuiDialog-root']//descendant::div/span[text()='Errors']")
  public WebElement errorPopUpWindow;
  public WebElement isErrorPopUpWindowDiaplyed()
  { return errorPopUpWindow;}
  public String deSelectParticulatSolver = "//*[text()='%s']//ancestor::div[contains(@class,'SolverCard__RequestHolder')]/preceding-sibling::div/descendant::span/input";
  @FindBy(xpath = "//*[text()='Summary']")
  public WebElement summaryText;
  public WebElement getSummaryText(){
    return summaryText;
  }
}
