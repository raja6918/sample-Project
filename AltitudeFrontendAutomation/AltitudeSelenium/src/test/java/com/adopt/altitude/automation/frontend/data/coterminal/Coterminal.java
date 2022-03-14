package com.adopt.altitude.automation.frontend.data.coterminal;

public class Coterminal {

  private String departureStation;

  private String arrivalStation;

  private String transportName;

  private String transportType;

  private String maximumPassengers;

  private String timingStart;

  private String timingEnd;

  private String transportTime;

  private String connectionTimeBefore;

  private String connectionTimeAfter;

  private String cost;

  private String currency;

  private String costBasis;

  private String creditCost;

  private String creditAppliesTo;

  public String getConnectionTimeAfter() {
    return connectionTimeAfter;
  }

  public String getConnectionTimeBefore() {
    return connectionTimeBefore;
  }

  public String getCost() {
    return cost;
  }

  public String getCostBasis() {
    return costBasis;
  }

  public String getCreditAppliesTo() {
    return creditAppliesTo;
  }

  public String getCreditCost() {
    return creditCost;
  }

  public String getCurrency() {
    return currency;
  }

  public String getDepartureStation() {
    return departureStation;
  }

  public String getMaximumPassengers() {
    return maximumPassengers;
  }

  public String getTimingEnd() {
    return timingEnd;
  }

  public String getTimingStart() {
    return timingStart;
  }

  public String getArrivalStation() {
    return arrivalStation;
  }

  public String getTransportName() {
    return transportName;
  }

  public String getTransportTime() {
    return transportTime;
  }

  public String getTransportType() {
    return transportType;
  }

  public void setArrivalStation(String arrivalStation) {
    this.arrivalStation = arrivalStation;
  }

  public void setDepartureStation(String departureStation) {
    this.departureStation = departureStation;
  }

  public void setTransportName(String transportName) {
    this.transportName = transportName;
  }

  public void setTransportType(String transportType) {
    this.transportType = transportType;
  }

  public void setMaximumPassengers(String maximumPassengers) {
    this.maximumPassengers = maximumPassengers;
  }

  public void setTimingStart(String timingStart) {
    this.timingStart = timingStart;
  }

  public void setTimingEnd(String timingEnd) {
    this.timingEnd = timingEnd;
  }

  public void setTransportTime(String transportTime) {
    this.transportTime = transportTime;
  }

  public void setConnectionTimeBefore(String connectionTimeBefore) {
    this.connectionTimeBefore = connectionTimeBefore;
  }

  public void setConnectionTimeAfter(String connectionTimeAfter) {
    this.connectionTimeAfter = connectionTimeAfter;
  }

  public void setCost(String cost) {
    this.cost = cost;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

}
