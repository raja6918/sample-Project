package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.ClientHttpException;
import com.adopt.altitude.automation.backend.api.pairing.Pairing;
import com.adopt.altitude.automation.backend.api.pairing.PairingEndpoint;
import com.adopt.altitude.automation.backend.api.pairing.impl.PairingEndpointImpl;
import com.adopt.altitude.automation.backend.api.pairingFlightFilters.GanttFilter;
import com.adopt.altitude.automation.backend.api.pairingFlightFilters.GanttFilterEndpoint;
import com.adopt.altitude.automation.backend.api.pairingFlightFilters.impl.GanttFilterEndpointImpl;
import cucumber.api.Transpose;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

public class pairingFlightFiltersSteps extends AbstractApiSteps implements En {
  private static final Logger LOGGER = LogManager.getLogger(pairingFlightFiltersSteps.class);
  // HelperScenarioSteps helperScenarioSteps=new HelperScenarioSteps();
  @Autowired
  protected GanttFilterEndpoint ganttFilterEndpoint;
  @Autowired
  protected GanttFilterEndpointImpl implData;
  protected ClientException currentException;
  @Autowired
  protected PairingEndpoint pairingEndpoint;

  @Autowired
  protected PairingEndpointImpl pairingimplData;

  private List<Pairing> pairings;

  private List<GanttFilter> GanttFilter;

  @When("^The Data with following values are added for aircraft types$")
  public void GanttFilterRequestForAircraftType(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());

    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterAircraftTypes("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));
    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for country$")
  public void GanttFilterRequestForCountry(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterCountries("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for Fight crewComposition$")
  public void GanttFilterRequestForFightCrewComposition(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterCrewComposition("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for stations$")
  public void GanttFilterRequestForStations(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterStations("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for regions$")
  public void GanttFilterRequestForRegions(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterRegions("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^I call the get request for pairings$")
  public void getPairingRequest() throws Exception {
    pairingEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<Pairing> newPairingTypes = new ArrayList<>();

    try {
      pairingEndpoint.getPairing("", scenarioId);

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for pairings$")
  public void pairingRequest(@Transpose List<Pairing> PairingList) throws Exception {
    pairingEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<Pairing> newPairingTypes = new ArrayList<>();
    newPairingTypes.add(mapData(PairingList.get(0).getStartIndex(), PairingList.get(0).getEndIndex()));
    Pairing newPairingObj = newPairingTypes.get(0);
    try {
      pairings = pairingEndpoint.addPairing("", newPairingObj, scenarioId);
      pairings = Collections.singletonList(pairings.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for bases$")
  public void GanttFilterRequestForBases(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterBases("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));

    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for layovers$")
  public void GanttFilterRequestForLayover(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterlayovers("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));
    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  @When("^The Data with following values are added for name$")
  public void GanttFilterRequestForName(@Transpose List<GanttFilter> GanttFilterList) throws Exception {
    ganttFilterEndpoint.setAuthenticationToken(apiLogin.getToken());
    List<GanttFilter> newGanttFilterTypes = new ArrayList<>();
    newGanttFilterTypes.add(mapData(GanttFilterList.get(0).getStartIndex(), GanttFilterList.get(0).getEndIndex(), GanttFilterList.get(0).getScope()));
    GanttFilter newGanttFilterObj = newGanttFilterTypes.get(0);
    try {
      GanttFilter = ganttFilterEndpoint.addganttFilterName("", newGanttFilterObj, scenarioId, 2);
      GanttFilter = Collections.singletonList(GanttFilter.get(0));
    } catch (ClientException exception) {
      currentException = exception;
    }
  }

  private Pairing mapData(Integer startIndex, Integer endIndex) {
    Pairing pairing = new Pairing();
    pairing.setStartIndex(startIndex);
    pairing.setEndIndex(endIndex);
    return pairing;
  }

  private GanttFilter mapData(Integer startIndex, Integer endIndex, String scope) {
    GanttFilter GanttFilter = new GanttFilter();
    GanttFilter.setStartIndex(startIndex);
    GanttFilter.setEndIndex(endIndex);
    GanttFilter.setScope(scope);
    return GanttFilter;
  }

  @Then("^I verify that \"([^\"]*)\" is added to the response data of filter$")
  public void iVerifyThatIsAddedToTheResponseData(String data) throws Throwable {

    ResponseEntity<String> responseData = GanttFilterEndpointImpl.response;
    Assert.assertTrue(responseData.toString().contains(data));
    LOGGER.info("responseData: " + responseData.toString());
    LOGGER.info("responseData: " + responseData.toString().contains(data));
  }

  @Then("^I verify that \"([^\"]*)\" is added to the response data of pairing$")
  public void iVerifyThatAddedToTheResponseData(String data) throws Throwable {

    ResponseEntity<String> responseData = PairingEndpointImpl.response;
    Assert.assertTrue(responseData.toString().contains(data));
    LOGGER.info("responseData: " + responseData.toString());
    LOGGER.info("responseData: " + responseData.toString().contains(data));
  }

  @Then("^I receive filter error (\\d+) with message \"([^\"]*)\"$")
  public void iReceiveFilterErrorWithMessage(int code, String message) throws Throwable {
    assertNotNull(currentException);
    assertNotNull(currentException.getCause());
    LOGGER.info("Response cause: {}", currentException.getCause());
    assertTrue(currentException instanceof ClientHttpException);
    ClientHttpException httpException = (ClientHttpException) currentException;
    assertEquals(code, httpException.getCode().intValue());
    LOGGER.info("Response code: {}", httpException.getCode().intValue());
    assertEquals(message, httpException.getErrorMessage());
    LOGGER.info("Response message: {}", httpException.getErrorMessage());
  }

  @Then("^I receive pairing error (\\d+) with message \"([^\"]*)\"$")
  public void iReceivePairingErrorWithMessage(int code, String message) throws Throwable {
    assertNotNull(currentException);
    assertNotNull(currentException.getCause());
    LOGGER.info("Response cause: {}", currentException.getCause());
    assertTrue(currentException instanceof ClientHttpException);
    ClientHttpException httpException = (ClientHttpException) currentException;
    assertEquals(code, httpException.getCode().intValue());
    LOGGER.info("Response code: {}", httpException.getCode().intValue());
    assertEquals(message, httpException.getErrorMessage());
    LOGGER.info("Response message: {}", httpException.getErrorMessage());
  }
}
