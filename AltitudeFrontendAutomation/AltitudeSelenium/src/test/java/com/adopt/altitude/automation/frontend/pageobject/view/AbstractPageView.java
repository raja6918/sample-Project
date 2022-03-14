package com.adopt.altitude.automation.frontend.pageobject.view;


import com.adopt.altitude.automation.frontend.pageobject.containers.PageContainer;
import com.adopt.altitude.automation.frontend.utils.BrowserDriver;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class AbstractPageView<T extends PageContainer> implements PageView<T> {

   @Autowired
   protected BrowserDriver driver;

   protected T             container;

   @Override
   public abstract boolean isDisplayedCheck();

   public T getContainer() {
      return container;
   }

   public void setText(WebElement element, String text) {
      element.click();
      element.clear();
      element.sendKeys(text);
   }

   public void clearAndSetText(WebElement element, String text) {
      selectText(element);
      clearTextWithBackspace(element);
      element.sendKeys(text);
   }

  public void clearTextWithBackspace(WebElement element) {
      while(!element.getAttribute("value").isBlank()) {
         element.sendKeys(Keys.BACK_SPACE);
      }
   }

   public void selectText(WebElement element) {
      new Actions(driver.getWebDriver())
          .click(element)
          .pause(200)
          .keyDown(Keys.CONTROL)
          .sendKeys("a")
          .keyUp(Keys.CONTROL)
          .pause(200)
          .perform();
   }

  public boolean isElementVisible(WebElement element) {
    try {
      element.isDisplayed();
      return true;
    } catch (NoSuchElementException e) {
      return false;
    }
  }

  public void retryingFindClick(By by) {
    int attempts = 0;
    while(attempts < 2) {
      try {
        driver.getWebDriver().findElement(by).click();
        break;
      }
      catch(StaleElementReferenceException e) {
      }
      catch (NoSuchElementException e) {
          driver.clickAction(driver.getWebDriver().findElement(by));
      }
      attempts++;
    }
  }

}
