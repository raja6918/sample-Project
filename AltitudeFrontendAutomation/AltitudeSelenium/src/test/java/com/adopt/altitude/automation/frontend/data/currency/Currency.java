package com.adopt.altitude.automation.frontend.data.currency;

public class Currency {

   private String name;
   
   private String code;
   
   private String exchangeRate;

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getCode() {
      return code;
   }

   public void setCode(String code) {
      this.code = code;
   }

   public String getExchangeRate() {
      return exchangeRate;
   }

   public void setExchangeRate(String exchangeRate) {
      this.exchangeRate = exchangeRate;
   }
}
