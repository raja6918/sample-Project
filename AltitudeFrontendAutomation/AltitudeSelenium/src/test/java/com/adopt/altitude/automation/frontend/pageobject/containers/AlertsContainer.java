package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class AlertsContainer extends PageContainer {

  @FindBy(xpath = "//div[contains(@class, 'IntegrationAlerts')]")
  private WebElement alertWindow;

  @FindBy(xpath = "//span[contains(text(), 'ALERTS')]")
  private WebElement alertTitle;

  @FindBy(xpath = "//span[contains(text(), 'expand_less')]")
  private WebElement expandAlerts;

  @FindBy(xpath = "//span[contains(text(), 'expand_more')]")
  private WebElement collapseAlerts;

  @FindBy(xpath = "//div[@role='tablist']/following-sibling::button")
  private WebElement nextButton;

  @FindBy(xpath = "//div[@role='tablist']/preceding-sibling::button")
  private WebElement backButton;

  @FindBy(xpath = "//div[contains(@class, 'AlertRow')]/descendant::span[text()='visibility_off']")
  private List<WebElement> hideAlertButton;

  @FindBy(xpath = "//div[contains(@class, 'AlertRow')]/child::span[@class='text']")
  private List<WebElement> alertsList;

  public String alertType = "//div[@role='tablist']/descendant::div[text()='%s']";

  public WebElement getTemplateBarTitle() {
    return super.getTemplateBarTitle();
  }

  public List<WebElement> getAlertsList() {
    return alertsList;
  }

  public WebElement getAlertTitle() {
    return alertTitle;
  }

  public WebElement getAlertWindow() {
    return alertWindow;
  }

  public WebElement getBackButton() {
    return backButton;
  }

  public WebElement getExpandAlerts() {
    return expandAlerts;
  }

  public WebElement getCollapseAlerts() {
    return collapseAlerts;
  }

  public List<WebElement> getHideAlertButton() {
    return hideAlertButton;
  }

  public WebElement getNextButton() {
    return nextButton;
  }
}
