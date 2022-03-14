package com.adopt.altitude.automation.frontend.utils;

import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Action;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.io.FileHandler;
import org.openqa.selenium.remote.UnreachableBrowserException;
import org.openqa.selenium.support.ui.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class BrowserDriver {
   private final static Logger         LOGGER = LogManager.getLogger(BrowserDriver.class);

   @Autowired
   private Map<String, BrowserFactory> browserFactories;

   @Value("${browser}")
   private String                      browserValue;

   private WebDriver                   driver;

   public synchronized void init() {
      LOGGER.info(String.format("Initializing web driver for browser {%s}.", browserValue));
      BrowserFactory browserFactory = browserFactories.get(browserValue);
      driver = browserFactory.getBrowser();
//      driver.manage().window().maximize();
   }

   public WebDriver getWebDriver() {
      return driver;
   }

   public synchronized void close() {
      try {
         getWebDriver().quit();
         driver = null;
         LOGGER.info("closing the browser");
      }
      catch (UnreachableBrowserException e) {
         LOGGER.info("cannot close browser: unreachable browser");
      }
   }

   public void loadPage(String url) {
      getWebDriver();
      LOGGER.info("Using [" + driver.getClass() + "]");
      LOGGER.info("Directing browser to:" + url);
      LOGGER.info("try to loadPage [" + url + "]");
      getWebDriver().navigate().to(url);
   }

   public void reopenAndLoadPage(String url) {
      driver = null;
      getWebDriver();
      loadPage(url);
   }

   public void takeScreenShot(String testName) {
      try {
         File ssFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
         String ssPath = Paths.get("").toAbsolutePath().toString() + File.separator + "target" + File.separator + "screenshots";

         if (!Files.isDirectory(Paths.get(ssPath))) {
            File folder = new File(ssPath);
            folder.mkdir();
         }

         String fullPath = String.format("%s%s%s_%s.png", ssPath, File.separator, testName, System.currentTimeMillis());

         LOGGER.info(fullPath);
         FileHandler.copy(ssFile, new File(fullPath));
      }
      catch (IOException e) {
         e.printStackTrace();
      }
   }

   public byte[] getScreenShot() {
      return ((TakesScreenshot)driver).getScreenshotAs(OutputType.BYTES);
   }

   public WebElement waitForElement(WebElement elementToWaitFor) {
      return waitForElement(elementToWaitFor, 10);
   }

   public WebElement waitForElement(WebElement elementToWaitFor, Integer waitTimeInSeconds) {
      WebDriverWait wait = new WebDriverWait(getWebDriver(), waitTimeInSeconds.longValue());
      return wait.pollingEvery(Duration.ofMillis(50l)).until(ExpectedConditions.visibilityOf(elementToWaitFor));
   }

   public List<WebElement> waitForElements(List<WebElement> elementsToWaitFor, Integer waitTimeInSeconds, Integer pollingTime) {
      WebDriverWait wait = new WebDriverWait(getWebDriver(), waitTimeInSeconds.longValue());
      wait.withTimeout(Duration.ofSeconds(waitTimeInSeconds.longValue())).pollingEvery(Duration.ofSeconds(pollingTime.longValue()));
      return wait.until(CustomConditions.clickabilityOfAllElements(elementsToWaitFor));
   }

   public WebElement waitForElement(WebElement elementToWaitFor, Integer waitTimeInSeconds, Integer pollingTimeInSeconds) {
      if (pollingTimeInSeconds == null) {
         pollingTimeInSeconds = Integer.valueOf(1);
      }

      FluentWait<WebDriver> wait = new FluentWait<>(getWebDriver());
      wait.withTimeout(Duration.ofSeconds(waitTimeInSeconds.longValue())).pollingEvery(Duration.ofSeconds(pollingTimeInSeconds.longValue()));
      return wait.until(ExpectedConditions.elementToBeClickable(elementToWaitFor));
   }

   public WebElement getParent(WebElement element) {
      return element.findElement(By.xpath(".."));
   }

   public List<WebElement> getDropDownOptions(WebElement webElement) {
      Select select = new Select(webElement);
      return select.getOptions();
   }

   public WebElement getDropDownOption(WebElement webElement, String value) {
      WebElement option = null;
      List<WebElement> options = getDropDownOptions(webElement);
      for (WebElement element : options) {
         if (element.getAttribute("value").equalsIgnoreCase(value)) {
            option = element;
            break;
         }
      }
      return option;
   }

   public void clickAt(int x, int y) {
      LOGGER.info(String.format("Click at location ({},{})", x, y));
      Actions actions = new Actions(driver);
      Action build = actions.moveByOffset(x, y).click().build();
      build.perform();
   }

   public Boolean waitToDisappear(By by, long amount, TimeUnit units) {
      if (units == null) {
         units = TimeUnit.SECONDS;
      }

      ExpectedCondition<Boolean> condition = ExpectedConditions.invisibilityOfElementLocated(by);
      return waitTo(condition, amount, units);
   }

   public Boolean waitToDisappear(WebElement by, long amount, TimeUnit units) {
      if (units == null) {
         units = TimeUnit.SECONDS;
      }

      ExpectedCondition<Boolean> condition = ExpectedConditions.invisibilityOf(by);
      return waitTo(condition, amount, units);
   }

   public WebElement waitForElementToMeetCondition(WebElement elementToWaitFor, ExpectedCondition<?> expectedCondition) {
      WebDriverWait wait = new WebDriverWait(getWebDriver(), 10);
      wait.until(expectedCondition);
      return elementToWaitFor;
   }

   private <ReturnType> ReturnType waitTo(ExpectedCondition<ReturnType> condition, long amount, TimeUnit units) {
      WebDriverWait wait = new WebDriverWait(driver, units.toSeconds(amount));
      ReturnType retval = wait.until(condition);
      return retval;
   }

   public void dragElementTo(WebElement element, WebElement target) {
      Actions builder = new Actions(driver);
      Action actions = builder.dragAndDrop(element, target).pause(Duration.ofSeconds(1)).build();
      actions.perform();
   }

   public void clickAction(WebElement element) {
      Actions focus = new Actions(driver);
      Action click = focus.moveToElement(element).click().build();
      click.perform();
   }

   public void forceClick(WebElement element) {
      clickAt(element.getLocation().getX(), element.getLocation().getY());
   }

   public void jsClick(WebElement element) {
      JavascriptExecutor executor = (JavascriptExecutor)driver;
      executor.executeScript("arguments[0].click();", element);
   }

   public void scrollToElement(WebElement element) {
     JavascriptExecutor executor = (JavascriptExecutor) driver;
     executor.executeScript("arguments[0].scrollIntoView();", element);
   }

   public void doubleClick(WebElement element) {
     Actions actions = new Actions(driver);
     actions.doubleClick(element).perform();
   }

  public void mouseOver(WebElement element) {
    Actions actions = new Actions(driver);
    actions.moveToElement(element).perform();
  }
  public void ScrollAction(WebElement element) {
    Actions a = new Actions(driver);
    a.moveToElement(element);
    a.perform();
  }

}
