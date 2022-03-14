package com.adopt.altitude.automation.frontend.data.crewGroups;

public class CrewGroups {

	private String name;

	private String position;

	private String airlines;

	private String aircraftType;

	private String defaultRuleSet;

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getPosition() {
		return position;
	}
	
	public void setPosition(String position) {
		this.position = position;
	}

	public String getAirlines() {
		return airlines;
	}
	
	public void setAirlines(String airlines) {
		this.airlines = airlines;
	}

	public String getAircraftType() {
		return aircraftType;
	}
	
	public void setAircraftType(String aircraftType) {
		this.aircraftType = aircraftType;
	}

	public String getDefaultRuleSet() {
		return defaultRuleSet;
	}
	
	public void setDefaultRuleSet(String defaultRuleSet) {
		this.defaultRuleSet = defaultRuleSet;
	}
}