package com.adopt.altitude.automation.frontend.validations;

import com.adopt.altitude.automation.frontend.data.commercialFlights.CommercialFlights;
import com.adopt.altitude.automation.frontend.data.operatingFlights.OperatingFlights;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import static org.junit.Assert.assertEquals;

@Component
public class CommercialFlightsValidation extends Validation {

	/** The Constant LOGGER. */
	private final static Logger LOGGER = LogManager.getLogger(CommercialFlightsValidation.class);

	public void verifyCommercialFlightsAreEqual(CommercialFlights expected, CommercialFlights actual) {
		assertEquals("Commercial Flights Flight Number not the same", expected.getAirline().concat(expected.getFlight()),actual.getAirline().concat(actual.getFlight()));
		assertEquals("Commercial Flights Flight From Station not the same", expected.getFromStation(),actual.getFromStation());
		assertEquals("Commercial Flights Flight To Station not the same", expected.getToStation(),actual.getToStation());
		assertEquals("Commercial Flights Departure Time not the same", expected.getDepartureTime(),actual.getDepartureTime());
		assertEquals("Commercial Flights Arrival Time not the same", expected.getArrivalTime(), actual.getArrivalTime());

		LOGGER.info("Commercial Flight match correctly");
	}

	public void verifyCommercialFlightsAreEqualEdit(CommercialFlights expected, CommercialFlights actual) {
		assertEquals("Commercial Flights Flight Number not the same", expected.getFlight(), actual.getAirline().concat(expected.getFlight()));
		assertEquals("Commercial Flights Flight From Station not the same", expected.getFromStation(),actual.getFromStation());
		assertEquals("Commercial Flights Flight To Station not the same", expected.getToStation(),actual.getToStation());
		assertEquals("Commercial Flights Departure Time not the same", expected.getDepartureTime(),actual.getDepartureTime());
		assertEquals("Commercial Flights Arrival Time not the same", expected.getArrivalTime(), actual.getArrivalTime());

		LOGGER.info("Commercial Flight match correctly");
	}

}
