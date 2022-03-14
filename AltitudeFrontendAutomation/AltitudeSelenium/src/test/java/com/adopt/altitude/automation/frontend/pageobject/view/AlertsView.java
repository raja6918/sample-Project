package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.AlertsContainer;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@Scope("prototype")
public class AlertsView extends AbstractPageView<AlertsContainer> {

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), AlertsContainer.class);
  }

  public void clickExpandAlertWindow() {
    container.getExpandAlerts().click();
  }

  public void clickCollapseAlertWindow() {
    container.getCollapseAlerts().click();
  }

  public String getAlertCount() {
    return container.getAlertTitle().getText();
  }

  public void clickNextArrow() {
    container.getNextButton().click();
  }

  public void clickBackArrow() {
    container.getBackButton().click();
  }

  public void clickHideAlertButton(Integer index) {
    container.getHideAlertButton().get(index).click();
  }

  public String getAlertMessage(Integer index) {
    return container.getAlertsList().get(index).getText();
  }

  public void clickAlertType(String type) {
    WebElement alertType = driver.getWebDriver().findElement(By.xpath(String.format(container.alertType, type)));
    alertType.click();
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getAlertWindow() != null;
  }
}
