package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.pageobject.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import com.adopt.altitude.automation.frontend.user.LoginCredentials;
import com.adopt.altitude.automation.frontend.utils.Navigation;

public class AbstractSteps {
   private final static Logger LOGGER = LogManager.getLogger(AbstractSteps.class);

   @Autowired
   @Lazy(true)
   protected Navigation        navigator;

   @Autowired
   @Lazy(true)
   protected LoginPage loginPage;

   @Autowired
   @Lazy(true)
   protected ScenariosPage scenariosPage;

   @Autowired
   @Lazy(true)
   protected TemplatesPage templatesPage;

   @Autowired
   @Lazy(true)
   protected DataHomePage dataHomePage;

  @Autowired
  @Lazy(true)
  protected PairingsPage pairingsPage;

  @Autowired
  @Lazy(true)
  protected SolverPage solverPage;

  @Autowired
  @Lazy(true)
  protected StationsPage stationsPage;

  @Autowired
  @Lazy(true)
  protected CountriesPage countriesPage;

  @Autowired
  @Lazy(true)
  protected CurrenciesPage currenciesPage;

  @Autowired
  @Lazy(true)
  protected RegionsPage regionsPage;

   @Autowired
   @Lazy(true)
   protected UserAdministrationPage userAdministrationPage;

   @Autowired
   @Lazy(true)
   protected AccommodationsPage accommodationsPage;

  @Autowired
  @Lazy(true)
  protected CoterminalsPage coterminalsPage;

   @Autowired
   @Lazy(true)
   protected PositionsPage positionsPage;

  @Autowired
  @Lazy(true)
  protected CrewBasesPage crewBasesPage;

  @Autowired
  @Lazy(true)
  protected AircraftTypesPage aircraftTypesPage;

  @Autowired
  @Lazy(true)
  protected AircraftModelsPage aircraftModelsPage;

  @Autowired
  @Lazy(true)
  protected OperatingFlightsPage operatingFlightsPage;

  @Autowired
  @Lazy(true)
  protected CommercialFlightsPage commercialFlightsPage;

  @Autowired
  @Lazy(true)
  protected CrewGroupsPage crewGroupsPage;

  @Autowired
  @Lazy(true)
  protected RulesetPage rulesetPage;

  @Autowired
  @Lazy(true)
  protected UsersPage usersPage;

  @Autowired
  @Lazy(true)
  protected RolesPage rolesPage;

   @Autowired
   protected LoginCredentials              defaultUser;

   public Navigation getNavigator() {
      return navigator;
   }

   public void setNavigator(Navigation navigator) {
      this.navigator = navigator;
   }
}
