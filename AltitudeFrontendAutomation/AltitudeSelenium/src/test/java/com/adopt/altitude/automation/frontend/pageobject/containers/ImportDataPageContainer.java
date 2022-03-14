package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class ImportDataPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text()='Connect to an import data bin']")
  private WebElement pageTitle;

  @FindBy(id = "name")
  private WebElement binNameTextfield;

  @FindBy(xpath = "//span[text()='CONNECT']/parent::button")
  private WebElement connectButton;

  @FindBy(xpath = "//*[@id=\"ImportErrorForm\"]/div[1]/div/div[2]/p[2]")
  private WebElement catastrophicError;

  @FindBy(xpath = "//div[contains(@class,'DropZone')]")
  private WebElement dropZone;

  @FindBy(xpath = "//span[text()='Create a new bin']/preceding-sibling::span/descendant::input")
  private WebElement newBinRadioButton;

  @FindBy(xpath = "//span[text()='click here']/parent::button")
  private WebElement clickHereLink;

  @FindBy(xpath = "//li[text()='Import from my computer']")
  private WebElement importFromComputerButton;

  @FindBy(xpath = "//span[text()='IMPORT']/parent::button")
  private WebElement importButton;

  @FindBy(xpath = "//h2[text()='Step 1 - Warnings']")
  private WebElement warningWindow;

  @FindBy(xpath = "//span[text() ='IGNORE AND CONTINUE']")
  private WebElement ignoreButton;

  @FindBy(xpath = "//h2[text()='Import data from this bin']")
  private WebElement importPopupButton;

  @FindBy(xpath = "//*[@id=\"newDataForm\"]/div[1]/div/div/fieldset/div/label[1]/span[1]/span/input")
  private WebElement opRadioButton;

  @FindBy(xpath = "//span[text() ='SKIP']")
  private WebElement skipButton;

  @FindBy(xpath = "//*[contains(@class,\"MuiPaper-root MuiDialog-paper\")]/div/h2[text()='Import data from this bin']")
  private WebElement importDataBinTitle;


  public String FILE_NAME_XPATH = "//p[text()='%s']";

  public String ERROR_TOOLTIP_XPATH = "//p[text()='%s']/following-sibling::div/descendant::span";

  public WebElement getPageTitle() {
    return pageTitle;
  }

  public WebElement getImportPopupButton() {
    return importPopupButton;
  }

  public WebElement getOpRadioButton() {
    return opRadioButton;
  }

  public WebElement getSkipButton() {
    return skipButton;
  }

  public WebElement getBinNameTextfield() {
    return binNameTextfield;
  }

  public WebElement getConnectButton() {
    return connectButton;
  }

  public WebElement getDropZone() {
    return dropZone;
  }


  public WebElement getImportDataBinTitle() {
    return importDataBinTitle;
  }

  public WebElement getNewBinRadioButton() {
    return newBinRadioButton;
  }

  public WebElement getClickHereLink() {
    return clickHereLink;
  }

  public WebElement getImportFromComputerButton() {
    return importFromComputerButton;
  }

  public WebElement getImportButton() {
    return importButton;
  }

  public WebElement getWarningWindow() {
    return warningWindow;
  }

  public WebElement getIgnoreButton() {
    return ignoreButton;
  }

  @FindBy(xpath = "//button[span[text()='IMPORT DATA']]")
  private WebElement importDataButton;

  public WebElement getImportDataButton() {
    return importDataButton;
  }

  public WebElement getCatastrophicError() {
    return catastrophicError;
  }

  @FindBy(xpath = "//*[contains(@class,'IntegrationsAlerts__StyledTitle')]/span[text()='error']")
  private WebElement errorIcon;

  public WebElement geterrorIcon() {
    return errorIcon;
  }

  @FindBy(xpath = "//*[contains(@class,'IntegrationsAlerts__StyledTitle')]/span[3]")
  private WebElement expandAlertsIcon;

  public WebElement getExpandalertIcon() {
    return expandAlertsIcon;
  }

  @FindBy(xpath = "//*[contains(@class,'IntegrationsAlerts__StyledTitle')]/span[2]")
  private WebElement errorIconalertCount;

  public WebElement getErrorIconalertCount() {
    return errorIconalertCount;
  }

  @FindBy(xpath = "//div[contains(@class,'IntegrationsAlerts__StyledAlertRow')]/div/span")
  private WebElement dontShowWarningIcon;

  public WebElement getDontShowWarningIcon() {
    return dontShowWarningIcon;
  }

  @FindBy(xpath = "//*[@class='infoContainer']//*[local-name()='svg']")
  private WebElement dropdownMenuToCorrectFileFormat;

  public WebElement getDropdownMenuToCorrectFileFormat() {
    return dropdownMenuToCorrectFileFormat;
  }
}
