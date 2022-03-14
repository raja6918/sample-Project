package com.adopt.altitude.automation.frontend.data.accommodation;

public class Accommodation {

   private String name;

   private String station;

   private String type;

   private String cost;

   private String capacity;

   private String contractStartDate;

   private String contractEndDate;

   private String currency;

   private String checkInTime;

   private String checkOutTime;

   private String costExtendedStay;

   private String transitTime;

   private String transitCost;

   private String transitCurrency;

   private String costBasis;

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getStation() {
      return station;
   }

   public void setStation(String station) {
      this.station = station;
   }

   public String getType() {
      return type;
   }

   public void setType(String type) {
      this.type = type;
   }

   public String getCost() {
      return cost;
   }

   public void setCost(String cost) {
      this.cost = cost;
   }

   public String getCapacity() {
      return capacity;
   }

   public void setCapacity(String capacity) {
      this.capacity = capacity;
   }

   public String getContractStartDate() {
      return contractStartDate;
   }

   public void setContractStartDate(String contractStartDate) {
      this.contractStartDate = contractStartDate;
   }

   public String getContractEndDate() {
      return contractEndDate;
   }

   public void setContractEndDate(String contractEndDate) {
      this.contractEndDate = contractEndDate;
   }

   public String getCurrency() {
      return currency;
   }

   public void setCurrency(String currency) {
      this.currency = currency;
   }

//   public String getPaymentType() {
//      return paymentType;
//   }
//
//   public void setPaymentType(String paymentType) {
//      this.paymentType = paymentType;
//   }

   public String getCheckInTime() {
      return checkInTime;
   }

   public void setCheckInTime(String checkInTime) {
      this.checkInTime = checkInTime;
   }

   public String getCheckOutTime() {
      return checkOutTime;
   }

   public void setCheckOutTime(String checkOutTime) {
      this.checkOutTime = checkOutTime;
   }

   public String getCostExtendedStay() {
      return costExtendedStay;
   }

   public void setCostExtendedStay(String costExtendedStay) {
      this.costExtendedStay = costExtendedStay;
   }

   public String getTransitTime() {
     return transitTime;
   }

   public String getTransitCost() {
     return transitCost;
   }

   public String getTransitCurrency() {
     return transitCurrency;
   }

   public String getCostBasis() {
     return costBasis;
   }
}
