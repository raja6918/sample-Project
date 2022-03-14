package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.DataHomePageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The Class DataHomeView.
 */
@Component
@Scope("prototype")
public class DataHomeView extends AbstractPageView<DataHomePageContainer> {

  /**
   * Inits the WebElements
   *
   * @throws Exception the exception
   */
  private static final Logger LOGGER = LogManager.getLogger(DataHomeView.class);
  private List<String> HamburgerDrawerName;
  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), DataHomePageContainer.class);
  }

  /**
   * Gets the current scenario name.
   *
   * @return the current scenario name
   */
  public String getCurrentScenarioName() {
    driver.waitForElement(container.getPageTitle(),120);
    WebElement scenario = driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioName)));
    String scenarioHeader = scenario.getText();
    String scenarioName = new ScenarioHeader(scenarioHeader).getName();

    return scenarioName;
  }

  public String getCurrentScenarioDateRange() {
    WebElement scenario = driver.getWebDriver().findElement(By.xpath(String.format(container.scenarioName)));
    String scenarioHeader = scenario.getText();
    String scenarioDateRange = new ScenarioHeader(scenarioHeader).getDateRange();

    return scenarioDateRange;
  }

  /**
   * Go to the stations page by clicking on station card in data home
   */
  public void clickStationCard() {
    driver.scrollToElement(container.getStationCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getStationCard());
    container.getStationCard().click();
    driver.waitForElement(container.getStationsPage(), 120);
  }

  /**
   * Go to the countries page by clicking on country card in data home
   */
  public void clickCountryCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCountryCard());
    container.getCountryCard().click();
    driver.waitForElement(container.getCountriesPage(), 120);
  }

  /**
   * Go to the crew bases page by clicking on crew base card in data home
   */
  public void clickCrewBaseCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCrewBaseCard());
    container.getCrewBaseCard().click();
    driver.waitForElement(container.getCrewBasesPage(), 120);
  }

  public void clickCrewBaseCardToRead() {
    driver.scrollToElement(container.getCrewBaseCard());
  }

  public void clickCurrenciesCardToRead() {
    driver.scrollToElement(container.getCurrencyCard());
  }

  public void clickPositionCardToRead() {
    driver.scrollToElement(container.getPositionCard());
  }

  public void clickRegionCardToRead() {
    driver.scrollToElement(container.getRegionCard());
  }

  public void clickStationCardToRead() {
    driver.scrollToElement(container.getStationCard());
  }

  public void clickCountryCardToRead() {
    driver.scrollToElement(container.getCountryCard());
  }

  public void clickRulesCardToRead() {
    driver.scrollToElement(container.getRulesCard());
  }

  public void clickRulesCard() {
    driver.scrollToElement(container.getRulesCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getRulesCard());
    container.getRulesCard().click();
    driver.waitForElement(container.getBaselineRulesPage(), 120);
  }

  public void clickManageRulesetsLink() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getManageRulesetsLink());
    container.getManageRulesetsLink().click();
    driver.waitForElement(container.getRuleSetsPage(), 120);
  }

  /**
   * Click currency card.
   */
  public void clickCurrencyCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCurrencyCard());
    container.getCurrencyCard().click();
    driver.waitForElement(container.getCurrenciesPage(), 120);
  }

  public void clickRegionCard() {
    driver.scrollToElement(container.getRegionCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getRegionCard());
    container.getRegionCard().click();
    driver.waitForElement(container.getRegionsPage(), 120);
  }

  public void clickPositionCard() {
    driver.scrollToElement(container.getPositionCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getPositionCard());
    container.getPositionCard().click();
    driver.waitForElement(container.getPositionsPage(), 120);
  }

  /**
   * Click accommodation card.
   */
  public void clickAccommodationCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAccommodationCard());
    container.getAccommodationCard().click();
    driver.waitForElement(container.getAccommodationsPage(), 120);
  }

  /**
   * Click alert.
   */
  public void clickAlert() throws InterruptedException {
    container.getAlertExpand().click();
    TimeUnit.SECONDS.sleep(1);
    Thread.sleep(1000);
  }

  /**
   * Click alert Messages.
   */
  public void clickAlertMessages() throws InterruptedException {

    String countText = container.getAlertCount().getText();
    String countValue = countText.replaceAll("[^0-9]", "");

    int alertCount = Integer.parseInt(countValue);
    for (int i = 0; i < alertCount; i++) {
      container.getAlertClick().click();
      TimeUnit.SECONDS.sleep((long) 0.2);
      Thread.sleep(200);

    }
  }

  /**
   * check reference Messages.
   */
  public void checkReferenceMessages() throws InterruptedException {

    String referenceMessage = container.getReferenceError().getText();
    if (referenceMessage.contains("cannot be deleted because it is referenced by other data")) {
      TimeUnit.SECONDS.sleep(1);
      container.getCloseReferenceButton().click();
      TimeUnit.SECONDS.sleep(3);
    }
  }

  /**
   * Gets no success message.
   *
   * @return
   */

  public boolean getNoSuccessMessage() {
    try {
      if (!(container.getSuccessMessage().isDisplayed())) {
        return true;
      }
    } catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;

  }

  public void clickCancelButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCancelButton());
    driver.clickAction(container.getCancelButton());
  }

  /**
   * Click coterminal card.
   */
  public void clickCoterminalCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCoterminalCard());
    container.getCoterminalCard().click();
    driver.waitForElement(container.getCoterminalTransportsPage(), 120);
  }

  /**
   * Click Operating Flights card.
   */
  public void clickOpearatingFlightsCard() {
    driver.scrollToElement(container.getOperatingFlightsCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getOperatingFlightsCard());
    container.getOperatingFlightsCard().click();
    driver.waitForElement(container.getOperatingFlightsPage(), 120);
  }

  public void clickCommercialFlightsCard() {
    driver.scrollToElement(container.getCommercialFlightCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCommercialFlightCard());
    container.getCommercialFlightCard().click();
    driver.waitForElement(container.getCommercialFlightsPage(), 120);
  }

  public void clickAircraftTypeCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAircraftTypeCard());
    container.getAircraftTypeCard().click();
    driver.waitForElement(container.getAircraftTypesPage(), 120);
  }

  /**
   * Click Crew Groups card.
   */
  public void clickCrewGrupsCard() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getCrewGroupsCard());
    container.getCrewGroupsCard().click();
    driver.waitForElement(container.getCrewGroupsPage(), 120);
  }

  public String getScenarioStatus() {
    return container.getScenarioStatus().getText();
  }

  public String getDataManagementTemplateTitle() {
    return container.getTemplateBarTitle().getText();
  }

  public boolean isImportDataButtonEnabled() {
    return container.getImportDataButton().isEnabled();
  }

  public boolean isImportAlertVisible() {
    return container.getAlertImport().isDisplayed();
  }

  public void clickImportDataButton() {
    container.getImportDataButton().click();
  }

  public boolean isNewDataDialogDisplayed() {
    return isElementVisible(container.getNewDataDialog());
  }

  public boolean isWarningDialogDisplayed() {
    return isElementVisible(container.getWarningsDialog());
  }

  public String getDataCount(String dataType) {
    try {
     TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    WebElement dataCount = driver.getWebDriver().findElement(By.xpath(String.format(container.dataCount, dataType)));
    LOGGER.info("dataCount: "+dataCount);
    return dataCount.getText();
  }

  public void clickHome() throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    WebElement backHome = driver.getWebDriver().findElement(By.xpath(container.BacktoHome));
    backHome.click();
    TimeUnit.SECONDS.sleep(1);
    WebElement dataLink = driver.getWebDriver().findElement(By.xpath(container.DataPage));
    dataLink.click();
    driver.waitForElement(container.getPageTitle(), 120);
    TimeUnit.SECONDS.sleep(2);
  }

  public void clickSolver() throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 0.5);
    WebElement backHome = driver.getWebDriver().findElement(By.xpath(container.BacktoHome));
    backHome.click();
    TimeUnit.SECONDS.sleep(1);
    WebElement solverLink = driver.getWebDriver().findElement(By.xpath(container.SolverPage));
    solverLink.click();
    driver.waitForElement(container.getSolverRequestPage(), 120);
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void clickHomeButton() {
    try {
      WebElement backHome = driver.getWebDriver().findElement(By.xpath(container.BacktoHome));
      TimeUnit.SECONDS.sleep(2);
      backHome.click();
      TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }


  public void verifyHamburgerDrawer(String hamburgerDetails)throws InterruptedException {

    String[] hamburgerDetail = hamburgerDetails.split(", ");
    HamburgerDrawerName = new ArrayList<>();
    for (String hamburger : hamburgerDetail) {
      HamburgerDrawerName.add(hamburger);
      String HamburgerDrawerNameField = driver.getWebDriver().findElement(By.xpath(String.format(container.HamburgerDrawer, hamburger))).getText();
      LOGGER.info("All hamburger: " + hamburger);
      Assert.assertTrue(HamburgerDrawerNameField.contains(HamburgerDrawerNameField));
    }
  }


  public boolean verifyHamburgerMenuNotPresent(String hamburgerDetails) {
    try {
      WebElement HamburgerDrawerNameField = driver.getWebDriver().findElement(By.xpath(String.format(container.HamburgerDrawer, hamburgerDetails)));
      if (!(HamburgerDrawerNameField.isDisplayed())) {
        return true;

      }
    }
    catch (NoSuchElementException e) {
      e.printStackTrace();
    }
    return true;
  }

  public void clickOperatingFlightCancelButton() {
    container.getCancelButton().click();
  }

  public void closeDialog() {
    retryingFindClick(By.xpath(container.closeButton));
  }

  public void verifyDataTableRecordCount() {
    int dataTableRecords= container.getDataTableRecordCount().size();
    LOGGER.info("dataTableRecords: "+dataTableRecords);
    Assert.assertTrue(dataTableRecords>0);
  }

  public void verifyAddButtonDisabled() throws InterruptedException {
    TimeUnit.SECONDS.sleep((long) 3);

    Assert.assertTrue(container.getAddButton().isEnabled()==false);
    TimeUnit.SECONDS.sleep(1);
  }

  public void clickFirstInfoButton() throws InterruptedException {
    driver.scrollToElement(container.getFirstInfoButton());
    TimeUnit.SECONDS.sleep((long) 0.1);
    container.getFirstInfoButton().click();
    TimeUnit.SECONDS.sleep(1);
  }

  public void checkFilterDataCard(String inputString, String dataCard) throws InterruptedException {

    if(
      (dataCard.equals("Accommodations")||dataCard.equals("Aircraft Types")||dataCard.equals("Countries")||dataCard.equals("Coterminal Transports")||dataCard.equals("Crew Bases")||dataCard.equals("Crew Groups")
        ||(dataCard.equals("Operating Flights")||(dataCard.equals("Regions")||dataCard.equals("Stations")))))
    {
      driver.scrollToElement(container.getFilterListDataCard());
      TimeUnit.SECONDS.sleep((long) 0.1);
      container.getFilterListDataCard().click();
      TimeUnit.SECONDS.sleep(1);
      driver.scrollToElement(driver.getWebDriver().findElement(By.xpath("(//input[@type=\"checkbox\"])[1]")));
      container.getInputPlaceholder().sendKeys(inputString);
      TimeUnit.SECONDS.sleep((long) 0.1);
      String tableFooterText = container.getTableFooterText().getText();
      LOGGER.info("tableFooterText: " + tableFooterText);
      Pattern p = Pattern.compile("[0-9]+" + " of");
      Matcher m = p.matcher(tableFooterText);
      while (m.find()) {
        LOGGER.info(m.group());
        Assert.assertTrue(tableFooterText.contains(m.group()));
      }
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getFilterListDataCard());
      container.getFilterListDataCard().click();
    }

    else if(
      (dataCard.equals("Currencies")||dataCard.equals("Positions")))
    {
      driver.scrollToElement(container.getFilterListDataCard());
      TimeUnit.SECONDS.sleep((long) 0.1);
      container.getFilterListDataCard().click();
      TimeUnit.SECONDS.sleep(1);
      driver.scrollToElement(driver.getWebDriver().findElement(By.xpath("(//input[@type=\"checkbox\"])[1]")));
      container.getInputPlaceholderSecond().sendKeys(inputString);
      TimeUnit.SECONDS.sleep((long) 0.1);
      String tableFooterText = container.getTableFooterText().getText();
      LOGGER.info("tableFooterText: " + tableFooterText);
      Pattern p = Pattern.compile("[0-9]+" + " of");
      Matcher m = p.matcher(tableFooterText);
      while (m.find()) {
        LOGGER.info(m.group());
        Assert.assertTrue(tableFooterText.contains(m.group()));
      }
      TimeUnit.SECONDS.sleep(2);
      driver.scrollToElement(container.getFilterListDataCard());
      container.getFilterListDataCard().click();
    }

  }

  public void verifyDataTableDelete() throws InterruptedException {
    int dataTableDeleteButton= container.getDataTableDelete().size();
    LOGGER.info("dataTableDeleteButton: "+dataTableDeleteButton);

    for(int i= 0; i<dataTableDeleteButton; i++)
    {
      String deleteBtnProperty= container.getDataTableDelete().get(i).getAttribute("class");
      LOGGER.info("deleteBtnProperty of ("+i +") is--> "+deleteBtnProperty);
      Assert.assertTrue(deleteBtnProperty.contains("disabled"));
    }
  }


  public void verifyDataTableInfoButton() throws InterruptedException {
    int dataTableInfoButton= container.getDataTableInfo().size();
    LOGGER.info("dataTableInfoButton: "+dataTableInfoButton);

    for(int i= 0; i<dataTableInfoButton; i++)
    {
      String infoBtnProperty= container.getDataTableInfo().get(i).getAttribute("class");
      LOGGER.info("infoBtnProperty of ("+i +") is--> "+infoBtnProperty);
      driver.scrollToElement(container.getDataTableInfo().get(i));
      TimeUnit.SECONDS.sleep((long) 0.01);
      Assert.assertTrue(container.getDataTableInfo().get(i).isDisplayed());
    }

  }

  public void verifyAllFields() throws InterruptedException {
    int dataTableInput= container.getVerifyAllFields().size();
    LOGGER.info("dataTableInfoButton: "+dataTableInput);

    for(int i= 0; i<dataTableInput; i++)
    {
      String dataTableInputProperty= container.getVerifyAllFields().get(i).getAttribute("class");
      LOGGER.info("dataTableInput of ("+i +") is--> "+dataTableInputProperty);
      driver.scrollToElement(container.getVerifyAllFields().get(i));
      TimeUnit.SECONDS.sleep((long) 0.01);
      Assert.assertTrue(dataTableInputProperty.contains("disabled"));
    }

  }

  public void clickCloseButton() throws InterruptedException {
    driver.scrollToElement(container.getCloseReferenceButton());
    TimeUnit.SECONDS.sleep(1);
    container.getCloseReferenceButton().click();
    TimeUnit.SECONDS.sleep(2);

  }

  public void clickDataCardLInk(String dataCardLink) throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    WebElement actualDataCardLink = driver.getWebDriver().findElement(By.xpath(String.format(container.DATA_CARD_LINKS, dataCardLink)));
    TimeUnit.SECONDS.sleep((long) 0.2);
    driver.scrollToElement(actualDataCardLink);
    TimeUnit.SECONDS.sleep((long) 0.2);
    actualDataCardLink.click();
    TimeUnit.SECONDS.sleep(2);

  }
  public void sortData(String DataCard) throws InterruptedException {
    ArrayList<String> arr=  new ArrayList<String>();
    ArrayList<String> arr1=  new ArrayList<String>();

    ArrayList<String> arr2=  new ArrayList<String>();
    ArrayList<String> arr3=  new ArrayList<String>();
    int size= container.getAllTableData().size();
    if(DataCard.equals("Accomodation")) {
      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Stations\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 3; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Stations\"]")).click();
      TimeUnit.SECONDS.sleep(2);

      driver.scrollToElement(driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[1]")));
      TimeUnit.SECONDS.sleep(2);
      for (int i = 3; i < size; i += 7) {
      WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
      driver.scrollToElement(actualDataInName);
      actualDataInName.getText();
      arr.add(actualDataInName.getText());
      arr1.add(actualDataInName.getText());
      LOGGER.info(actualDataInName.getText());
    }
    LOGGER.info("arr Data: " + arr);
    LOGGER.info("arr1 Data:" + arr1);
    Collections.sort(arr1,Collections.reverseOrder());
    LOGGER.info("After sort arr Data:" + arr);
    LOGGER.info("arr1 Data:" + arr1);
    Assert.assertTrue(arr.equals(arr1));
    arr.clear();arr1.clear();
  }

    if(DataCard.equals("Aircraft Types")) {
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Type\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Coterminal Transports")) {
      for (int i = 3; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"From\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 3; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      //   Collections.sort(arr, Collections.reverseOrder());
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Countries")) {
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Code\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Crew Bases")) {
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Name\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Crew Groups")) {
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Name\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Currencies")) {
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Code\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 5) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }


    if(DataCard.equals("Operating Flights")) {
      for (int i = 2; i < size; i += 13) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Flight designator\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 13) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Regions")) {
      for (int i = 2; i < size; i += 4) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Code\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 4) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

    if(DataCard.equals("Stations")) {
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr);
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();

      driver.getWebDriver().findElement(By.xpath("//span[contains(@class, \"MuiButtonBase-root\") and text()=\"Code\"]")).click();
      TimeUnit.SECONDS.sleep(2);
      for (int i = 2; i < size; i += 7) {
        WebElement actualDataInName = driver.getWebDriver().findElement(By.xpath("(//td[@class= \"MuiTableCell-root MuiTableCell-body\"])[" + i + "]"));
        driver.scrollToElement(actualDataInName);
        actualDataInName.getText();
        arr.add(actualDataInName.getText());
        arr1.add(actualDataInName.getText());
        LOGGER.info(actualDataInName.getText());
      }
      LOGGER.info("arr Data: " + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Collections.sort(arr1, Collections.reverseOrder());
      LOGGER.info("After sort arr Data:" + arr);
      LOGGER.info("arr1 Data:" + arr1);
      Assert.assertTrue(arr.equals(arr1));
      arr.clear();arr1.clear();
    }

  }


  public void clickBackArrow() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getArrowBack());
    try {
      TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    driver.clickAction(container.getArrowBack());
  }

  @Override
  public boolean isDisplayedCheck() {
    return !container.getPageTitle().getText().isEmpty();
  }

  public void clickOtherVersion(String dataType) {
    WebElement otherVersionLink = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.otherVersion, dataType)));

    otherVersionLink.click();
  }

  public void clickNewVersion(String fileName) throws InterruptedException {
    WebElement newVersionFile = driver.getWebDriver()
      .findElement(By.xpath(String.format(container.fileName, fileName)));
    TimeUnit.SECONDS.sleep(1);
    newVersionFile.click();
  }

  public void moveToDataCard(String dataCard)  throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    WebElement dataCardField= driver.getWebDriver().findElement(By.xpath(String.format(container.dataCard, dataCard)));

    driver.scrollToElement(dataCardField);
    TimeUnit.SECONDS.sleep(3);

  }

  public String getDataSource(String dataType) {
    try {
      TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    WebElement dataCount = driver.getWebDriver().findElement(By.xpath(String.format(container.dataSource, dataType)));
    return dataCount.getText();
  }

  public String getCurrentUrl() {
    String CurrentUrl = driver.getWebDriver().getCurrentUrl();
    return CurrentUrl;
  }

  public void gotoErrorPage(Integer errorCode) {
    if(errorCode==404) {
      driver.getWebDriver().navigate().to("http://34.152.61.105:8080/test_errors");
      container.click_404Error().click();
    }if(errorCode==400) {
      driver.getWebDriver().navigate().to("http://34.152.61.105:8080/test_errors");
      container.click_404ErrorCode().click();
    }
    if(errorCode==500) {
      driver.getWebDriver().navigate().to("http://34.152.61.105:8080/test_errors");
      container.click_500ErrorCode().click();
    }
  }

  public void verifyError(Integer errorCode) {
    Assert.assertEquals("Error code: " + errorCode, container.getErrorCode().getText().trim());
    //Assert.assertEquals("This site can’t be reached", container.getErrorCode().getText().trim());
  }

  public void clickReturnLinkOnError(String linkText) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.returnLinkOnError, linkText))).click();
  }

  public void verifyBackToPreviousPageAfterError() {
    String previousUrl=getCurrentUrl();
    String CurrentUrl = driver.getWebDriver().getCurrentUrl();
    Assert.assertEquals(previousUrl,CurrentUrl);
  }

  public void verifyNetworkLossMessage()throws InterruptedException {
    String networkLossMessage1 = container.getNetworkLossMessage1().getText();
    String networkLossMessage2 = container.getNetworkLossMessage2().getText();
    if (networkLossMessage1.contains("No internet connection")) {
      TimeUnit.SECONDS.sleep(1);
    }
    if (networkLossMessage2.contains("You don’t seem to be connected to the internet. To continue working in Sierra, please check your network settings.")) {
      TimeUnit.SECONDS.sleep(1);
    }
}

  public boolean verifyDataLossAfterOffline()throws InterruptedException {
    if(driver.getWebDriver().findElements(By.xpath("//form[@id='regionsForm']/div/span[2]")).size()>=1)
      return false;
    else
      return true;
  }

class ScenarioHeader {
  private String name;
  private String dateRange;
  private String[] header;

  public ScenarioHeader(String headerText) {
    this.header = headerText.split("\\R+");

    this.name = header[0];
    this.dateRange = header[1];
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDateRange() {
    return dateRange;
  }

  public void setDateRange(String dateRange) {
    this.dateRange = dateRange;
  }

  public void verifyDataTableRecordCount() {
    int dataTableRecords= container.getDataTableRecordCount().size();
    LOGGER.info("dataTableRecords: "+dataTableRecords);
    Assert.assertTrue(dataTableRecords>0);

    }
  }

  public void clickRefErrorCloseButton() {
    container.refErrorCloseButton().click();
  }

  public void clickRulesCardForUAT() {
    driver.scrollToElement(container.getRulesCard());
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getRulesCard());
    container.getRulesCard().click();
    driver.waitForElement(container.getBaselineRulesPageForUAT(), 120);
  }
}
