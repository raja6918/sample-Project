package com.adopt.altitude.automation.frontend.validations;

import static org.junit.Assert.assertEquals;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.data.operatingFlights.OperatingFlights;

@Component
public class OperatingFlightsValidation extends Validation {

	/** The Constant LOGGER. */
	private final static Logger LOGGER = LogManager.getLogger(OperatingFlightsValidation.class);

	/**
	 * Verify Operating Flights are equals.
	 *
	 * @param expected the expected
	 * @param actual   the actual
	 */

	public void verifyOperatingFlightsAreEqual(OperatingFlights expected, OperatingFlights actual) {
		assertEquals("Operating Flights Flight Number not the same", expected.getAirline().concat(expected.getFlight()),actual.getAirline().concat(actual.getFlight()));
		assertEquals("Operating Flights Flight From Station not the same", expected.getFromStation(),actual.getFromStation());
		assertEquals("Operating Flights Flight To Station not the same", expected.getToStation(),actual.getToStation());
		assertEquals("Operating Flights Departure Time not the same", expected.getDepartureTime(),actual.getDepartureTime());
		assertEquals("Operating Flights Arrival Time not the same", expected.getArrivalTime(), actual.getArrivalTime());

		LOGGER.info("Operating Flight match correctly");
	}

	public void verifyOperatingFlightsAreEqualEdit(OperatingFlights expected, OperatingFlights actual) {
		assertEquals("Operating Flights Flight Number not the same", expected.getFlight(), actual.getAirline().concat(expected.getFlight()));
		assertEquals("Operating Flights Flight From Station not the same", expected.getFromStation(),actual.getFromStation());
		assertEquals("Operating Flights Flight To Station not the same", expected.getToStation(),actual.getToStation());
		assertEquals("Operating Flights Departure Time not the same", expected.getDepartureTime(),actual.getDepartureTime());
		assertEquals("Operating Flights Arrival Time not the same", expected.getArrivalTime(), actual.getArrivalTime());

		LOGGER.info("Operating Flight match correctly");
	}

}
