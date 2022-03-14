package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import com.adopt.altitude.automation.frontend.utils.BrowserDriver;

public class PageContainer {

	protected BrowserDriver browser;

	@FindBy(xpath = "//span[contains(@class, 'EditModeBar')]")
	private WebElement templateBarTitle;

	@FindBy(xpath = "//span[text()='arrow_back']")
  private WebElement arrowBack;

   public WebElement getTemplateBarTitle() {
      return templateBarTitle;
   }

  public WebElement getArrowBack() {
    return arrowBack;
  }
}
