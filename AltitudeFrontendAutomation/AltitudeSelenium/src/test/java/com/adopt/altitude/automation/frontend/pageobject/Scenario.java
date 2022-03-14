package com.adopt.altitude.automation.frontend.pageobject;

public class Scenario {

   private String name;
   private String planningPeriod;
   private String createdBy;
   private String lastOpened;
   
   public String getName() {
      return name;
   }
   public void setName(String name) {
      this.name = name;
   }
   public String getPlanningPeriod() {
      return planningPeriod;
   }
   public void setPlanningPeriod(String planningPeriod) {
      this.planningPeriod = planningPeriod;
   }
   public String getCreatedBy() {
      return createdBy;
   }
   public void setCreatedBy(String createdBy) {
      this.createdBy = createdBy;
   }
   public String getLastOpened() {
      return lastOpened;
   }
   public void setLastOpened(String lastOpened) {
      this.lastOpened = lastOpened;
   }
}
