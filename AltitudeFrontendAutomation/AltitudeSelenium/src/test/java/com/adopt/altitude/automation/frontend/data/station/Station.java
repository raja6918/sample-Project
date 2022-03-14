package com.adopt.altitude.automation.frontend.data.station;

public class Station {

  private String iataCode;
  private String stationName;
  private String country;
  private String region;
  private String latitude;
  private String longitude;
  private String timeZone;
  private String dSTChange;
  private String dSTStartDate;
  private String dSTEndDate;

  public String getIataCode() {
    return iataCode;
  }

  public void setIataCode(String iataCode) {
    this.iataCode = iataCode;
  }

  public String getStationName() {
    return stationName;
  }

  public void setStationName(String stationName) {
    this.stationName = stationName;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getRegion() {
    return region;
  }

  public void setRegion(String region) {
    this.region = region;
  }

  public String getLatitude() {
    return latitude;
  }

  public void setLatitude(String latitude) {
    this.latitude = latitude;
  }

  public String getLongitude() {
    return longitude;
  }

  public void setLongitude(String longitude) {
    this.longitude = longitude;
  }

  public String getTimeZone() {
    return timeZone;
  }

  public void setTimeZone(String timeZone) {
    this.timeZone = timeZone;
  }

  public String getDstChange() {
    return dSTChange;
  }

  public void setDstChange(String dSTChange) {
    this.dSTChange = dSTChange;
  }

  public String getDstStartDate() {
    return dSTStartDate;
  }

  public void setDstStartDate(String dSTStartDate) {
    this.dSTStartDate = dSTStartDate;
  }

  public String getDstEndDate() {
    return dSTEndDate;
  }

  public void setDstEndDate(String dSTEndDate) {
    this.dSTEndDate = dSTEndDate;
  }
}
