package com.adopt.altitude.automation.frontend.utils;

public class NavigatorFactory {
   private static Navigation navigator = null;

   public static synchronized Navigation getNavigator() {
      if (navigator == null) {
         navigator = new Navigation();
      }
      return navigator;
   }
}
