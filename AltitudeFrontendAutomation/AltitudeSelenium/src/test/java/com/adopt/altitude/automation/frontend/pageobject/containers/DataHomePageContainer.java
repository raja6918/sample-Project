package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

/**
 * The Class DataHomePageContainer.
 */
public class DataHomePageContainer extends PageContainer {

	@FindBy(xpath = "//h2[text()='Data home']")
	private WebElement pageTitle;

	@FindBy(xpath = "//span[text()='Stations']")
	private WebElement stationCard;

  @FindBy(xpath = "//span[text()='Rules']")
  private WebElement rulesCard;

	@FindBy(xpath = "//span[text()='Countries']")
	private WebElement countryCard;

	@FindBy(xpath = "//span[text()='Currencies']")
	private WebElement currencyCard;

	@FindBy(xpath = "//span[text()='Regions']")
	private WebElement regionCard;

	@FindBy(xpath = "//span[text()='Accommodations']")
	private WebElement accommodationCard;

	@FindBy(xpath = "//span[text()='Coterminal transports']")
	private WebElement coterminalCard;

	@FindBy(xpath = "//span[text()='Crew bases']")
	private WebElement crewBaseCard;

	@FindBy(xpath = "//span[text()='Positions']")
	private WebElement positionCard;

	@FindBy(xpath = "//span[text()='Aircraft types']")
	private WebElement aircraftTypeCard;

	@FindBy(xpath = "//span[text()='Operating flights']")
	private WebElement operatingFlightCard;

  @FindBy(xpath = "//span[text()='Commercial flights']")
  private WebElement commercialFlightCard;

	@FindBy(xpath = "//span[text()='Crew groups']")
	private WebElement crewGroupsCard;

	@FindBy(xpath = "//h2[text() = 'Data home']/following-sibling::span")
	private WebElement scenarioStatus;

	@FindBy(xpath = "//button[span[text()='IMPORT DATA']]")
	private WebElement importDataButton;

	@FindBy(xpath = "//div[contains(@class, 'NewDataDialog')]")
	private WebElement newDataDialog;

	@FindBy(xpath = "//h2[contains(text(), 'Warnings')]")
	private WebElement warningsDialog;

	@FindBy(xpath = "//div[contains(@class, 'Home__CardsContainer')]")
	private WebElement dataCards;

	public String scenarioName = "//div[contains(@class,'Home__Header')]/span";

	public String closeButton = "//button[contains(@class, 'CloseButton')]";

	public String dataCount = "//a[contains(@href, '%s')]/following-sibling::div/descendant::span[1]";

	public String dataSource = "//a[contains(@href, '%s')]/child::div[@class='extra-info']/descendant::span[1]";

	public String otherVersion = "//span[text()='%s']/following-sibling::span/descendant::span[1]";

  public String BacktoHome="//*[@id=\"root\"]/div[1]/header/div/button";

public String HamburgerDrawer=   "//p [text()= '%s']//parent::a[contains(@class, \"HamburgerDrawer\")]";

  public String DataPage="//p[contains(text(), 'Data')]";

  public String SolverPage="//p[contains(text(), 'Solver')]";

	public String fileName = "//p[text()='%s']";

  public String dataCard = "  //span[text()='%s']";

  @FindBy(xpath = "//span[text()='ALERTS']")
  private WebElement alertImport;

  @FindBy(xpath = "//span[text()='CLOSE']")
  private WebElement closeReferenceButton;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[1]/span[3]")
  private WebElement alertExpand;

  @FindBy(xpath = "//button[span[text()='Cancel']]")
  private WebElement       cancelButton;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[2]/div/div/div[2]/div[1]/div/span/span[1]/span")
  private WebElement alertClick;

  @FindBy(xpath = "//*[@id=\"root\"]/div[3]/div[1]/span[2]")
  private WebElement alertCount;

  @FindBy(xpath = "//span[contains(text(),'cannot be deleted because it is referenced by other data')]")
  private WebElement referenceError;

  @FindBy(xpath = "//*[@id=\"notification-area\"]/div/div/div/div[1]/div/div")
  private WebElement       successMessage;

	/**
	 * Gets the page title.
	 *
	 * @return the page title
	 */
	public WebElement getPageTitle() {
		return pageTitle;
	}

	/**
	 * Return the station card in data home page
	 *
	 * @return
	 */
	public WebElement getStationCard() {
		return stationCard;
	}

  public WebElement getRulesCard() {
    return rulesCard;
  }

	/**
	 * Return the country card in data home page
	 *
	 * @return
	 */
	public WebElement getCountryCard() {
		return countryCard;
	}

	/**
	 * Gets the currency card.
	 *
	 * @return the currency card
	 */
	public WebElement getCurrencyCard() {
		return currencyCard;
	}

	public WebElement getRegionCard() {
		return regionCard;
	}

	/**
	 * Gets the accommodation card.
	 *
	 * @return the accommodation card
	 */
	public WebElement getAccommodationCard() {
		return accommodationCard;
	}

	/**
	 * Gets the coterminal card.
	 *
	 * @return the coterminal card
	 */
	public WebElement getCoterminalCard() {
		return coterminalCard;
	}

	/**
	 * Gets the crew base card
	 *
	 * @return the crew base card
	 */
	public WebElement getCrewBaseCard() {
		return crewBaseCard;
	}

	public WebElement getPositionCard() {
		return positionCard;
	}

	public WebElement getScenarioStatus() {
		return scenarioStatus;
	}

	public WebElement getAircraftTypeCard() {
		return aircraftTypeCard;
	}

	public WebElement getImportDataButton() {
		return importDataButton;
	}

	/**
	 * Gets the Operating Flights card
	 *
	 * @return the Operating Flights card
	 */
	public WebElement getOperatingFlightsCard() {
		return operatingFlightCard;
	}

  public WebElement getCommercialFlightCard() {
    return commercialFlightCard;
  }

	/**
	 * Gets the Crew Groups card
	 *
	 * @return the Crew Groups card
	 */
	public WebElement getCrewGroupsCard() {
		return crewGroupsCard;
	}

	public WebElement getNewDataDialog() {
		return newDataDialog;
	}

	public WebElement getWarningsDialog() {
		return warningsDialog;
	}

	public WebElement getDataCards() {
		return dataCards;
	}


  /**
   * Gets the alert details
   * @return the alert details
   */
  public WebElement getAlertImport() {
    return alertImport;
  }

  public WebElement getAlertExpand() {
    return alertExpand;
  }

  public WebElement getAlertClick() {
    return alertClick;
  }

  public WebElement getAlertCount() {
    return alertCount;
  }

  public WebElement getReferenceError() {
    return referenceError;
  }

  public WebElement getCloseReferenceButton() {
    return closeReferenceButton;
  }

  public WebElement getSuccessMessage() {
    return successMessage;
  }

  public WebElement getCancelButton() {
    return cancelButton;
  }

  @FindBy(xpath = "//p[@class='error-code']")
  private WebElement errorCode;

  public WebElement getErrorCode() {
    return errorCode;
  }

  @FindBy(xpath = "//button[text()='fake 400 error']")
  private WebElement _404ErrorCode;

  public WebElement click_404ErrorCode() {
    return _404ErrorCode;
  }
  @FindBy(xpath = "//button[text()='404 error']")
  private WebElement _404Error;

  public WebElement click_404Error() {
    return _404Error;
  }

  @FindBy(xpath = "//button[text()='fake 500 error']")
  private WebElement _500ErrorCode;

  public WebElement click_500ErrorCode() {
    return _500ErrorCode;
  }

  public String returnLinkOnError = "//span[text()='%s']";

  @FindBy(xpath = "//a[text()='Manage rule sets']")
  private WebElement manageRulesetsLink;

  public WebElement getManageRulesetsLink() {
    return manageRulesetsLink;
  }

  @FindBy(xpath = "//div[@class='msg']/h3")
  private WebElement networkLossMessage1;

  public WebElement getNetworkLossMessage1() { return networkLossMessage1;}

  @FindBy(xpath = "//div[@class='msg']/span")
  private WebElement networkLossMessage2;

  public WebElement getNetworkLossMessage2() { return networkLossMessage2; }

  @FindBy(xpath = "//h2[text()='Accommodations']")
  private WebElement accommodationsPage;

  public WebElement getAccommodationsPage() { return accommodationsPage;}

  @FindBy(xpath = "//h2[text()='Aircraft types']")
  private WebElement aircraftTypesPage;

  public WebElement getAircraftTypesPage() { return aircraftTypesPage;}

  @FindBy(xpath = "//h2[text()='Coterminal transports']")
  private WebElement coterminalTransportsPage;

  public WebElement getCoterminalTransportsPage() { return coterminalTransportsPage;}

  @FindBy(xpath = "//h2[text()='Countries']")
  private WebElement countriesPage;

  public WebElement getCountriesPage() { return countriesPage;}

  @FindBy(xpath = "//h2[text()='Crew groups']")
  private WebElement crewGroupsPage;

  public WebElement getCrewGroupsPage() { return crewGroupsPage;}

  @FindBy(xpath = "//h2[text()='Crew bases']")
  private WebElement crewBasesPage;

  public WebElement getCrewBasesPage() { return crewBasesPage;}

  @FindBy(xpath = "//h2[text()='Currencies']")
  private WebElement currenciesPage;

  public WebElement getCurrenciesPage() { return currenciesPage;}

  @FindBy(xpath = "//h2[text()='Operating flights']")
  private WebElement operatingFlightsPage;

  @FindBy(xpath = "//h2[text()='Commercial flights']")
  private WebElement commercialFlightsPage;

  public WebElement getOperatingFlightsPage() { return operatingFlightsPage;}

  public WebElement getCommercialFlightsPage() { return commercialFlightsPage;}

  @FindBy(xpath = "//h2[text()='Positions']")
  private WebElement positionsPage;

  public WebElement getPositionsPage() { return positionsPage;}

  @FindBy(xpath = "//h2[text()='Regions']")
  private WebElement regionsPage;

  public WebElement getRegionsPage() { return regionsPage;}

  @FindBy(xpath = "//h2[text()='Stations']")
  private WebElement stationsPage;

  public WebElement getStationsPage() { return stationsPage;}

  @FindBy(xpath = "//h2[text()='baseline']")
  private WebElement baselineRulesPage;

  public WebElement getBaselineRulesPage() { return baselineRulesPage;}

  @FindBy(xpath = "//h2[text()='Rule sets']")
  private WebElement ruleSetsPage;

  public WebElement getRuleSetsPage() { return ruleSetsPage;}

  @FindBy(xpath = "//h2[text()='Solver request']")
  private WebElement solverRequestPage;

  public WebElement getSolverRequestPage() { return solverRequestPage;}

  @FindBy(xpath = "//tr[contains(@class, \"MuiTableRow-hover hover\")]")
  private  List<WebElement> dataTableRecordCount;

  public List<WebElement> getDataTableRecordCount() { return dataTableRecordCount;}

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement addButton;

  public WebElement getAddButton() {
    return addButton;
  }

  @FindBy(xpath = "//span[text()= \"delete\"]//ancestor::button")
  private  List<WebElement> dataTableDelete;

  public List<WebElement> getDataTableDelete() { return dataTableDelete;}

  @FindBy(xpath = "//span[text()= \"info\"]//ancestor::button")
  private  List<WebElement> dataTableInfo;

  public List<WebElement> getDataTableInfo() { return dataTableInfo;}

  public String DATA_CARD_LINKS = "//*[text()= '%s']//parent::a";

  @FindBy(xpath = "//td[@class= \"MuiTableCell-root MuiTableCell-body\"]")
  private  List<WebElement> allTableData;

  public List<WebElement> getAllTableData() { return allTableData;}

  @FindBy(xpath = "(//span[text()= \"info\"]//ancestor::button)[1]")
  private WebElement firstInfoButton;

  public WebElement getFirstInfoButton() {
    return firstInfoButton;
  }

  @FindBy(xpath = "//div[contains(@class, \"MuiInputBase-root\")]//child::input[@class=\"MuiInputBase-input MuiInput-input Mui-disabled Mui-disabled\"]")
  private  List<WebElement> verifyAllFields;

  public List<WebElement> getVerifyAllFields() { return verifyAllFields;}

  @FindBy(xpath = "//span[contains(@class, \"material-icons\") and text()= \"filter_list\"]")
  private WebElement filterListDataCard;

  public WebElement getFilterListDataCard() {
    return filterListDataCard;
  }

  @FindBy(xpath = "//input[@placeholder='Search']")
  private WebElement inputPlaceholder;

  public WebElement getInputPlaceholder() {
    return inputPlaceholder;
  }

  @FindBy(xpath = "(//*[@placeholder=\"Search\"])[2]")
  private WebElement inputPlaceholderSecond;

  public WebElement getInputPlaceholderSecond() {
    return inputPlaceholderSecond;
  }

  @FindBy(xpath = "//p[contains(@class, \"TableFooter\")]")
  private WebElement tableFooterText;

  public WebElement getTableFooterText() {
    return tableFooterText;
  }

  @FindBy(xpath = "//*[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement refErrorCloseButton() {
    return refErrorCloseButton;
  }

  @FindBy(xpath = "//h2[text()='root']")
  private WebElement minimalRulesPage;

  public WebElement getMinimalRulesPage() {
    return minimalRulesPage;
  }

  @FindBy(xpath = "//*[text()='root']")
  private WebElement baselineRulesPageForUAT;

  public WebElement getBaselineRulesPageForUAT() {
    return baselineRulesPageForUAT;
  }
}
