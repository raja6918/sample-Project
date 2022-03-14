package com.adopt.altitude.automation.frontend.utils;

public enum Browsers {
   FIREFOX,
   CHROME,
   IEXPLORER,
   EDGE;

   public static Browsers browserForName(String browser) throws IllegalArgumentException {
      for (Browsers b : values()) {
         if (b.toString().equalsIgnoreCase(browser)) {
            return b;
         }
      }
      throw new IllegalArgumentException(("Invalid browser [" + browser + "]"));
   }
}
