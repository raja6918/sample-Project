package com.adopt.altitude.automation.frontend.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Navigation {

   private final static Logger LOGGER = LogManager.getLogger(Navigation.class);

   @Autowired
   private BrowserDriver       browser;

   @Value("${altitude.web.url}")
   private String              defaultURL;

   public void loadPage() {
      loadPage(defaultURL);
   }

   public void loadPage(String url) {
      LOGGER.info("loading page: " + url);
      LOGGER.info("with browser " + browser.toString());
      browser.loadPage(url);
   }

   public BrowserDriver getBrowser() {
      return browser;
   }

   public void setBrowser(BrowserDriver browser) {
      this.browser = browser;
   }

}
