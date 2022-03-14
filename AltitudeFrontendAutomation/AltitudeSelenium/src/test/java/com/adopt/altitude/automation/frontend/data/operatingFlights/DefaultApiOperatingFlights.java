package com.adopt.altitude.automation.frontend.data.operatingFlights;

import com.adopt.altitude.automation.backend.api.operatingFlights.CoverageBalance;
import com.adopt.altitude.automation.backend.api.operatingFlights.CrewComposition;
import com.adopt.altitude.automation.backend.api.operatingFlights.FlightInstance;
import com.adopt.altitude.automation.backend.api.operatingFlights.FlightInstancePairing;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DefaultApiOperatingFlights {

	@Value("${default.be.operatingFlights.airlineCode}")
	public String airlineCode;

	@Value("${default.be.operatingFlights.flightNumber}")
	public Integer flightNumber;

	@Value("${default.be.operatingFlights.operationalSuffix}")
	public String operationalSuffix;

	@Value("${default.be.operatingFlights.departureStationCode}")
	public String departureStationCode;

	@Value("${default.be.operatingFlights.arrivalStationCode}")
	public String arrivalStationCode;

	@Value("${default.be.operatingFlights.passengerTerminalDeparture}")
	public String passengerTerminalDeparture;

	@Value("${default.be.operatingFlights.passengerTerminalArrival}")
	public String passengerTerminalArrival;

	@Value("${default.be.operatingFlights.departureTime}")
	public String departureTime;

	@Value("${default.be.operatingFlights.arrivalTime}")
	public String arrivalTime;

	@Value("${default.be.operatingFlights.serviceTypeCode}")
	public String serviceTypeCode;

	@Value("${default.be.operatingFlights.onwardFlightDesignator}")
	public String onwardFlightDesignator;

	@Value("${default.be.operatingFlights.onwardFlightDayOffset}")
	public Integer onwardFlightDayOffset;

	@Value("${default.be.operatingFlights.aircraftTypeCode}")
	public String aircraftTypeCode;

	@Value("${default.be.operatingFlights.aircraftConfigurationVersion}")
	public String aircraftConfigurationVersion;

	@Value("${default.be.operatingFlights.tailNumber}")
	public String tailNumber;

	@Value("${default.be.operatingFlights.deadheadSeatsNumber}")
	public Integer deadheadSeatsNumber;

	@Value("${default.be.operatingFlights.startDates}")
	public List<String> startDates;

	@Value("${default.be.operatingFlights.startTime}")
	public String startTime;

	@Value("${default.be.operatingFlights.crewCompositions.positionCode}")
	public String crewCompositionsPositionCode;

	@Value("${default.be.operatingFlights.crewCompositions.quantity}")
	public String crewCompositionsQuantity;

	@Value("${default.be.operatingFlights.tags}")
	public List<String> tags;

	@Value("${default.be.operatingFlights.endTime}")
	public String endTime;

	@Value("${default.be.operatingFlights.duration}")
	public String duration;

	@Value("${default.be.operatingFlights.sequenceNumber}")
	public Integer sequenceNumber;

	@Value("${default.be.operatingFlights.extraBriefingCabin}")
	public Integer extraBriefingCabin;

	@Value("${default.be.operatingFlights.extraBriefingFlightDeck}")
	public Integer extraBriefingFlightDeck;

	@Value("${default.be.operatingFlights.extraDebriefingCabin}")
	public Integer extraDebriefingCabin;

	@Value("${default.be.operatingFlights.extraDebriefingFlightDeck}")
	public Integer extraDebriefingFlightDeck;

	@Value("${default.be.operatingFlights.flightDesignator}")
	public String flightDesignator;

	@Value("${default.be.operatingFlights.flightInstance.coverageBalance.balance}")
	public String flightInstancesCoverageBalance;

	@Value("${default.be.operatingFlights.flightInstance.coverageBalance.positionCode}")
	public String flightInstancesCoverageBalancePositionCode;

	@Value("${default.be.operatingFlights.flightInstance.pairings.id}")
	public String flightInstancesPairingsId;

	@Value("${default.be.operatingFlights.flightInstance.pairings.name}")
	public String flightInstancesPairingsName;

	@Value("${default.be.operatingFlights.flightInstance.endDateTime}")
	public String flightInstancesEndDateTime;

	@Value("${default.be.operatingFlights.flightInstance.id}")
	public String flightInstancesId;

	@Value("${default.be.operatingFlights.flightInstance.startDateTime}")
	public String flightInstancesStartDateTime;

	@Value("${default.be.operatingFlights.operationDays.operationDays}")
	public List<Integer> operationDays;

	@Value("${default.be.operatingFlights.firstDepartureDate}")
	public String firstDepartureDate;

	@Value("${default.be.operatingFlights.lastDepartureDate}")
	public String lastDepartureDate;



	public List<FlightInstance> getFlightInstanceDetails() {
		String[] flightInstancesEndDateTimeString = flightInstancesEndDateTime.split(",");
		String[] flightInstancesIdString = flightInstancesId.split(",");
		String[] flightInstancesStartDateTimeString = flightInstancesStartDateTime.split(",");
		List<FlightInstance> flightInstancesList = new ArrayList<FlightInstance>();

		for (int i = 0; i < flightInstancesEndDateTimeString.length; i++) {
			FlightInstance flightInstances = new FlightInstance();

			flightInstances.setEndDateTime(flightInstancesEndDateTimeString[i]);
			flightInstances.setId(Integer.parseInt(flightInstancesIdString[i]));
			flightInstances.setStartDateTime(flightInstancesStartDateTimeString[i]);
			flightInstances.setCoverageBalance(getCoverageBalance());
			flightInstances.setPairings(getPairings());

			flightInstancesList.add(flightInstances);
		}

		return flightInstancesList;
	}

	public List<CoverageBalance> getCoverageBalance() {
		String[] coverageBalanceString = flightInstancesCoverageBalance.split(",");
		String[] coverageBalancePositionCodeString = flightInstancesCoverageBalancePositionCode.split(",");
		List<CoverageBalance> coverageBalanceList = new ArrayList<CoverageBalance>();

		for (int i = 0; i < coverageBalanceString.length; i++) {
			CoverageBalance coverageBalance = new CoverageBalance();

			coverageBalance.setBalance(Integer.parseInt(coverageBalanceString[i]));coverageBalance.setPositionCode(coverageBalancePositionCodeString[i]);

			coverageBalanceList.add(coverageBalance);
		}

		return coverageBalanceList;
	}

	public List<FlightInstancePairing> getPairings() {
		String[] pairingsIdString = flightInstancesPairingsId.split(",");
		String[] pairingsNameString = flightInstancesPairingsName.split(",");
		List<FlightInstancePairing> pairingsList = new ArrayList<FlightInstancePairing>();

		for (int i = 0; i < pairingsIdString.length; i++) {
			FlightInstancePairing pairings = new FlightInstancePairing();

			pairings.setId(Integer.parseInt(pairingsIdString[i]));
			pairings.setName(pairingsNameString[i]);

			pairingsList.add(pairings);
		}

		return pairingsList;
	}

	public List<CrewComposition> getCrewCompositions() {
		String[] crewCompositionsPositionCodeString = crewCompositionsPositionCode.split(",");
		String[] crewCompositionsQuantityString = crewCompositionsQuantity.split(",");

		List<CrewComposition> crewCompositions = new ArrayList<>();

		for (int i = 0; i < crewCompositionsPositionCodeString.length; i++) {
			CrewComposition crewComposition = new CrewComposition();

			crewComposition.setPositionCode(crewCompositionsPositionCodeString[i]);
			crewComposition.setQuantity(Integer.parseInt(crewCompositionsQuantityString[i]));

			crewCompositions.add(crewComposition);
		}

		return crewCompositions;
	}
}
