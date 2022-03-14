package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.operatingFlights.OperatingFlights;
import com.adopt.altitude.automation.backend.api.operatingFlights.OperatingFlightsEndpoint;
import com.adopt.altitude.automation.frontend.data.operatingFlights.DefaultApiOperatingFlights;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class OperatingFlightsSteps extends AbstractApiSteps implements En {

	private static final Logger LOGGER = LogManager.getLogger(OperatingFlightsSteps.class);

	private static final String[] CUCUMBER_TAGS = new String[] { "@notRun" };

	private List<OperatingFlights> operatingFlights;

	@Autowired
	private DefaultApiOperatingFlights defaultApiOperatingFlights;

	@Autowired
	private OperatingFlightsEndpoint operatingFlightsManagement;

	public OperatingFlightsSteps() {
		Given("^the operating flight with default values is added$", () -> {
			LOGGER.info("=== Setting up {operating flights} data ===");

			operatingFlightsManagement.setAuthenticationToken(apiLogin.getToken());
			OperatingFlights newOperatingFlights = getDefaultApiOperatingFlights();
			operatingFlights = operatingFlightsManagement.addOperatingFlights(Collections.singletonList(newOperatingFlights), scenarioId);
		});

		After(CUCUMBER_TAGS, () -> {
			if (operatingFlights != null && !operatingFlights.isEmpty()) {
				LOGGER.info(String.format("Cleaning up Test Data for {Accommodations}"));

				ArrayList<Integer> idList = operatingFlights.stream().map(a -> a.getId()).collect(Collectors.toCollection(() -> new ArrayList<Integer>()));
				operatingFlightsManagement.deleteOperatingFlights(idList, scenarioId);
			}
		});
	}

	private OperatingFlights getDefaultApiOperatingFlights() {
		OperatingFlights defaultOperatingFlights = new OperatingFlights();

		defaultOperatingFlights.setAircraftConfigurationVersion(defaultApiOperatingFlights.aircraftConfigurationVersion);
		defaultOperatingFlights.setOperationalSuffix(defaultApiOperatingFlights.operationalSuffix);
		defaultOperatingFlights.setArrivalStationCode(defaultApiOperatingFlights.arrivalStationCode);
		defaultOperatingFlights.setAirlineCode(defaultApiOperatingFlights.airlineCode);
		defaultOperatingFlights.setStartTime(defaultApiOperatingFlights.startTime);
		defaultOperatingFlights.setDeadheadSeatsNumber(defaultApiOperatingFlights.deadheadSeatsNumber);
		defaultOperatingFlights.setDuration(defaultApiOperatingFlights.duration);
		defaultOperatingFlights.setPassengerTerminalDeparture(defaultApiOperatingFlights.passengerTerminalDeparture);
		defaultOperatingFlights.setFlightNumber(defaultApiOperatingFlights.flightNumber);
		defaultOperatingFlights.setServiceTypeCode(defaultApiOperatingFlights.serviceTypeCode);
		defaultOperatingFlights.setPassengerTerminalArrival(defaultApiOperatingFlights.passengerTerminalArrival);
		defaultOperatingFlights.setDepartureStationCode(defaultApiOperatingFlights.departureTime);
		defaultOperatingFlights.setOnwardFlightDesignator(defaultApiOperatingFlights.onwardFlightDesignator);
		defaultOperatingFlights.setDepartureStationCode(defaultApiOperatingFlights.departureStationCode);
		defaultOperatingFlights.setOnwardFlightDayOffset(defaultApiOperatingFlights.onwardFlightDayOffset);
		defaultOperatingFlights.setAircraftTypeCode(defaultApiOperatingFlights.aircraftTypeCode);
		defaultOperatingFlights.setTailNumber(defaultApiOperatingFlights.tailNumber);
		defaultOperatingFlights.setEndTime(defaultApiOperatingFlights.endTime);
		defaultOperatingFlights.setStartDates(defaultApiOperatingFlights.startDates);
		defaultOperatingFlights.setTags(defaultApiOperatingFlights.tags);
		defaultOperatingFlights.setSequenceNumber(defaultApiOperatingFlights.sequenceNumber);
		defaultOperatingFlights.setExtraBriefingCabin(defaultApiOperatingFlights.extraBriefingCabin);
		defaultOperatingFlights.setExtraBriefingFlightDeck(defaultApiOperatingFlights.extraBriefingFlightDeck);
		defaultOperatingFlights.setExtraDebriefingCabin(defaultApiOperatingFlights.extraDebriefingCabin);
		defaultOperatingFlights.setExtraDebriefingFlightDeck(defaultApiOperatingFlights.extraDebriefingFlightDeck);
		defaultOperatingFlights.setFlightDesignator(defaultApiOperatingFlights.flightDesignator);
		defaultOperatingFlights.setCrewComposition(defaultApiOperatingFlights.getCrewCompositions());
		defaultOperatingFlights.setFlightInstance(defaultApiOperatingFlights.getFlightInstanceDetails());
		defaultOperatingFlights.setOperationDays(defaultApiOperatingFlights.operationDays);
		defaultOperatingFlights.setFirstDepartureDate(defaultApiOperatingFlights.firstDepartureDate);
		defaultOperatingFlights.setLastDepartureDate(defaultApiOperatingFlights.lastDepartureDate);

		return defaultOperatingFlights;
	}
}
