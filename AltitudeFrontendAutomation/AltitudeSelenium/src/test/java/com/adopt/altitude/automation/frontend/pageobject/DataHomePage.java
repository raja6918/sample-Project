package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.ImportDataView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * The Class DataHomePage.
 */
@Component
public class DataHomePage extends AbstractPage {

	/** The data home view. */
	@Autowired
	@Lazy(true)
	private DataHomeView dataHomeView;

	@Autowired
	@Lazy(true)
	private ImportDataView importDataView;

	/**
	 * Gets the scenario name.
	 *
	 * @return the scenario name
	 */
	public String getScenarioName() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		return dataHomeView.getCurrentScenarioName();
	}

	public String getScenarioDateRange() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		return dataHomeView.getCurrentScenarioDateRange();
	}

	/**
	 * Navigate to the stations page
	 */
	public void openStationsPage() {
		/*closeNewDataDialog();
		closeWarningsDialog();*/
		dataHomeView.clickStationCard();
	}

  public void moveToDataCard(String dataCard) throws InterruptedException {
    dataHomeView.moveToDataCard(dataCard);
  }

	/**
	 * Navigate to the countries page
	 */
	public void openCountriesPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickCountryCard();
	}

	/**
	 * Navigate to the crew bases page
	 */
	public void openCrewBasesPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickCrewBaseCard();
	}

  public void readCrewBasesPageDataCard() {
    dataHomeView.clickCrewBaseCardToRead();
  }

  public void readCurrenciesPageDataCard() {
    dataHomeView.clickCurrenciesCardToRead();
  }

  public void readPositionDataCard() {
    dataHomeView.clickPositionCardToRead();
  }

  public void readRegionDataCard() {
    dataHomeView.clickRegionCardToRead();
  }

  public void readStationDataCard() {
    dataHomeView.clickStationCardToRead();
  }

  public void readCountryDataCard() {
    dataHomeView.clickCountryCardToRead();
  }

  public void readRulesDataCard() {
    dataHomeView.clickRulesCardToRead();
  }

	/**
	 * Open currencies page.
	 */
	public void openCurrenciesPage() {
		/*closeNewDataDialog();
		closeWarningsDialog();*/
		dataHomeView.clickCurrencyCard();
	}

	public void openRegionsPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickRegionCard();
	}

	/**
	 * Open accomodations page.
	 */
	public void openAccomodationsPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickAccommodationCard();
	}

	/**
	 * Open coterminals page.
	 */
	public void openCoterminalsPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickCoterminalCard();
	}

	public void openPositionsPage() {
		//closeNewDataDialog();
		//closeWarningsDialog();
		dataHomeView.clickPositionCard();
	}

	public void openAircraftTypesPage() {
	//	closeNewDataDialog();
	//	closeWarningsDialog();
		dataHomeView.clickAircraftTypeCard();
	}

	public void verifyViewOnlyMode() {
		Assert.assertTrue(dataHomeView.getScenarioStatus().contains("view-only"));
	}

	public void isImportDataButtonEnabled() {
		/*closeNewDataDialog();
		closeWarningsDialog();*/
		Assert.assertTrue(dataHomeView.isImportDataButtonEnabled());
	}

	public void openImportDataScreen() {
		closeNewDataDialog();
 		closeWarningsDialog();
		dataHomeView.clickImportDataButton();
	}

	/**
	 * Open Operating Flights page.
	 */
	public void openOperatingFlightsPage() throws InterruptedException {
		/*TimeUnit.SECONDS.sleep(1);
		closeNewDataDialog();
		TimeUnit.SECONDS.sleep(1);
		closeWarningsDialog();
		TimeUnit.SECONDS.sleep(1);*/
		dataHomeView.clickOpearatingFlightsCard();
	}

  public void openCommercialFlightsPage() throws InterruptedException {
		dataHomeView.clickCommercialFlightsCard();
  }

	/**
	 * Open Crew Groups page.
	 */
	public void openCrewGrupsPage() throws InterruptedException {
	/*	TimeUnit.SECONDS.sleep(1);
		closeNewDataDialog();
		TimeUnit.SECONDS.sleep(1);
		closeWarningsDialog();
		TimeUnit.SECONDS.sleep(1);*/
		dataHomeView.clickCrewGrupsCard();
	}

  public void openRulesetPage() {
  //  closeNewDataDialog();
   // closeWarningsDialog();
    dataHomeView.clickRulesCard();
    dataHomeView.clickManageRulesetsLink();
  }

  public void openRulesetPageOnly() {
    dataHomeView.clickRulesCard();
	}

	public String getAccommodationsCount() {
		return dataHomeView.getDataCount("accommodations");
	}

	public String getAircraftTypesCount() {
		return dataHomeView.getDataCount("aircraft");
	}

	public String getCommercialFlightsCount() {
		return dataHomeView.getDataCount("commercial-flights");
	}

	public String getCoterminalsCount() {
		return dataHomeView.getDataCount("coterminal-transports");
	}

	public String getCountriesCount() {
		return dataHomeView.getDataCount("countries");
	}

	public String getCrewBasesCount() {
		return dataHomeView.getDataCount("crew-bases");
	}

	public String getCurrenciesCount() {
		return dataHomeView.getDataCount("currencies");
	}

	public String getOperatingFlightsCount() {
		return dataHomeView.getDataCount("operating-flights");
	}

	public String getPositionsCount() {
		return dataHomeView.getDataCount("positions");
	}

	public String getRegionsCount() {
		return dataHomeView.getDataCount("regions");
	}

	public String getRulesCount() {
		return dataHomeView.getDataCount("rules");
	}

	public String getStationsCount() {
		return dataHomeView.getDataCount("stations");
	}

	public void verifyCountsAreEqual(String dataTileCount) {
		Assert.assertEquals(dataTileCount, dataCount.toString());
	}

	public void verifyCountsAreEqualForAccomodation(String dataTileCount) {
		Assert.assertEquals(dataTileCount, dataCountForAccommodation.toString());
	}

  public void verifyCountsAreEqualForCountry(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForCountries.toString());
  }

	public void verifyCountsAreEqualForCurrency(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForCurrency.toString());
  }

  public void verifyCountsAreEqualForStation(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForSation.toString());
  }

  public void verifyCountsAreEqualForPosition(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForPosition.toString());
  }

  public void verifyCountsAreEqualForRule(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForRule.toString());
  }

  public void verifyCountsAreEqualForRegion(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForRegion.toString());
  }

  public void verifyCountsAreEqualForOPFlight(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForOPFlight.toString());
  }

  public void verifyCountsAreEqualForCommercialFlight(String dataTileCount) {
    Assert.assertEquals(dataTileCount, dataCountForCommercialFlight.toString());
  }

	private void closeNewDataDialog() {
		if (dataHomeView.isNewDataDialogDisplayed()) {
			dataHomeView.closeDialog();
		}
	}

	private void closeWarningsDialog() {
		if (dataHomeView.isWarningDialogDisplayed()) {
			try {
				TimeUnit.SECONDS.sleep(1);
				dataHomeView.closeDialog();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void clickBackArrow() {
		dataHomeView.clickBackArrow();
	}

	public void enterBinName(String name) {
		importDataView.clickNewBinRadioButton();
		importDataView.enterBinName(name);
	}

  public void clickConnect(String name) throws InterruptedException {
	  if (importDataView.isDropZoneDisplayed())
    {
      Assert.assertTrue(importDataView.isDropZoneDisplayed());
    }
    else if ((importDataView.isConnectButtonEnabled()) && (!importDataView.isDropZoneDisplayed()))
    {
     // TimeUnit.SECONDS.sleep(1);
      importDataView.clickConnect();
    }
    else
      {
      importDataView.enterBinName(name);
    //  TimeUnit.SECONDS.sleep(1);
      importDataView.clickConnect();
      }
  }
	public void validateDropFilesDialog() {
		Assert.assertTrue(importDataView.isDropZoneDisplayed());
	}

	public void waitWarningWindow() throws Exception{
		importDataView.warningImportWindow();
	}

	public void validateWarningWindow() {
		Assert.assertTrue(importDataView.isWarningWindowDisplayed());
	}

	@Override
	public boolean isPageDisplayed() {
		return dataHomeView.isDisplayedCheck();
	}

	public String getDataManagementTemplateHeader() {
		return dataHomeView.getDataManagementTemplateTitle().trim();
	}

	public void clickOtherVersion(String dataType) throws InterruptedException {
		TimeUnit.SECONDS.sleep(1);
		closeNewDataDialog();
		closeWarningsDialog();
		dataHomeView.clickOtherVersion(dataType);
	}

	public void clickNewVersion(String fileName) throws InterruptedException {
		dataHomeView.clickNewVersion(fileName);
	}

	public void clickUploadFile() throws Exception {
		TimeUnit.SECONDS.sleep(1);
		importDataView.clickUploadFile();
	}

	public void uploadFile(String fileName) throws Exception {
		TimeUnit.SECONDS.sleep(1);
		importDataView.uploadFile(fileName);
	}

	public void checkCardFileName(String fileName) throws Exception {
		TimeUnit.SECONDS.sleep(2);
		importDataView.checkCardFileName(fileName);
	}

	public void clickImportButton()throws InterruptedException {
		TimeUnit.SECONDS.sleep(2);
		importDataView.clickImportButton();
	}

  public void clickImportButtonforError()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    importDataView.clickImportButtonForError();
  }

  public void waitForError()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    importDataView.waitForImport();
  }

  public String getRefErrorMessage() {
    return importDataView.getRefErrorMessage();

  }

	public void createFileOS(String fileName) throws IOException {
		importDataView.createNewFileOS(fileName);
	}

	public void createWarningFile(String fileName) throws IOException {
		importDataView.createNewWarningFile(fileName);
	}

	public void validateDataHomeScreenInactive() throws InterruptedException {
		TimeUnit.SECONDS.sleep(10);Thread.sleep(10000);
		Assert.assertFalse(dataHomeView.isImportDataButtonEnabled());
    TimeUnit.SECONDS.sleep(10);Thread.sleep(10000);
	  dataHomeView.clickAccommodationCard();
    TimeUnit.SECONDS.sleep(1);Thread.sleep(1000);
			}

  public void validateDataHomeAlert() throws InterruptedException {
    TimeUnit.SECONDS.sleep(120);Thread.sleep(120000);
    dataHomeView.clickAlert();
    TimeUnit.SECONDS.sleep(1);Thread.sleep(1000);
    dataHomeView.clickAlertMessages();
  }

	public void isErrorIconDisplayed(String fileName) throws Exception{
		importDataView.isErrorIconDisplayed(fileName);
	}

  public void BackToHomePage() throws InterruptedException {
    dataHomeView.clickHome();
  }

  public void solverPage() throws InterruptedException {
    dataHomeView.clickSolver();
  }

  public void checkReferenceMessage() throws Exception{
    dataHomeView.checkReferenceMessages();
  }

  public void checkNoSuccessMessage() throws Exception{
	  Assert.assertTrue(dataHomeView.getNoSuccessMessage());
	}

  public void verifyError(Integer errorCode)throws InterruptedException{
    TimeUnit.SECONDS.sleep(3);
    dataHomeView.gotoErrorPage(errorCode);
    TimeUnit.SECONDS.sleep(3);
    dataHomeView.verifyError(errorCode);
  }

  public  void clickReturnLinkOnError(String linkText)throws InterruptedException{
    dataHomeView.clickReturnLinkOnError( linkText);
    TimeUnit.SECONDS.sleep(3);
  }

  public void verifyBackToPreviousPageAfterError() throws InterruptedException {
    TimeUnit.SECONDS.sleep(3);
    dataHomeView.verifyBackToPreviousPageAfterError();
  }

  public void verifyNetworkLossMessage() throws InterruptedException {
    dataHomeView.verifyNetworkLossMessage();
  }

  public void verifyDataLossAfterOffline() throws InterruptedException {
    TimeUnit.SECONDS.sleep(5);
    Assert.assertTrue(dataHomeView.verifyDataLossAfterOffline());
  }

  /**
   * Click Cancel Option in the delete confirmation dialog
   */
  public void cancelButton() {
    dataHomeView.clickCancelButton();
  }

	public void isImportButtonEnabled() {
		Assert.assertTrue(importDataView.isImportButtonEnabled());
	}

	public void isImportButtonDisabled() {
		Assert.assertFalse(importDataView.isImportButtonEnabled());
	}

  public String getAccommodationsDataSource(String dataType) {
    return dataHomeView.getDataSource(dataType);
  }

  public void verifyDataTableRecordCount() {
    dataHomeView.verifyDataTableRecordCount();
  }

  public void verifyAddButtonDisabled() throws InterruptedException
  {
    dataHomeView.verifyAddButtonDisabled();
  }

  public void verifyDataTableDelete() throws InterruptedException
  {
    dataHomeView.verifyDataTableDelete();
  }

  public void verifyDataTableInfoButton() throws InterruptedException
  {
    dataHomeView.verifyDataTableInfoButton();
  }

  public void clickDataCardLInk(String clickDataCardLInk) throws InterruptedException
  {
    dataHomeView.clickDataCardLInk(clickDataCardLInk);
  }

  public void sortData(String DataCard) throws InterruptedException
  {
    dataHomeView.sortData(DataCard);
  }

  public void clickFirstInfoButton() throws InterruptedException
  {
    dataHomeView.clickFirstInfoButton();
  }
  public void verifyAllFields() throws InterruptedException
  {
    dataHomeView.verifyAllFields();
  }

  public void clickCloseButton() throws InterruptedException
  {
    dataHomeView.clickCloseButton();
  }

  public void checkFilterDataCard(String inputString, String dataCard) throws InterruptedException
  {
    dataHomeView.checkFilterDataCard(inputString, dataCard);
  }

  public void clickRefErrorCloseButton() {
    dataHomeView.clickRefErrorCloseButton();
  }

  public void clickExpandOption() {
    importDataView.clickOnExapndOption();
  }

  public int getErrorAlertCount() {
    String alertCountInString = importDataView.getErrorAlertCount();
    int count = Integer.parseInt(alertCountInString);
    return count;
  }

  public boolean isErrorAlertIconDisplyedAfterUpload() {
    return importDataView.isErrorAlertIconDisplyedAfterUpload();
  }

  public void dontShowWarningicon() {
    importDataView.dontShowWarningIcon();
  }

  public void alertSummaryHandling() throws InterruptedException {
    Assert.assertTrue(isErrorAlertIconDisplyedAfterUpload());
    TimeUnit.SECONDS.sleep(3);
    clickExpandOption();
    TimeUnit.SECONDS.sleep(3);
    int size = getErrorAlertCount();
    for (int i = 0; i < size; i++) {
      dontShowWarningicon();
      TimeUnit.SECONDS.sleep(1);
    }
  }

  public void openRulesetPageForUAT() {
    dataHomeView.clickRulesCardForUAT();
    dataHomeView.clickManageRulesetsLink();
  }

  public void selectProperFileFormat() throws InterruptedException {
    importDataView.clickOnDropDownAndSelectFileFormat();
  }
  public void isFilesUploaded() throws InterruptedException {
    importDataView.isFileUploaded();
  }
}

