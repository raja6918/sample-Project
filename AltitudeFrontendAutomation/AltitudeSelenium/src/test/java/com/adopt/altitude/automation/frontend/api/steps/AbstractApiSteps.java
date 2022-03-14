package com.adopt.altitude.automation.frontend.api.steps;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.adopt.altitude.automation.backend.api.authentication.AuthenticationToken;

/**
 * The Class AbstractApiSteps.
 */
public abstract class AbstractApiSteps {

   private static final Logger LOGGER = LogManager.getLogger(AbstractApiSteps.class);

   protected AuthenticationToken    currentToken;

   @Autowired
   protected ApiLogin apiLogin;

   protected static Integer scenarioId;

   protected static Integer userId;

   @Value("${altitude.api.default.username}")
   private String defaultUsername;

   @Value("${altitude.api.default.password}")
   private String defaultPassword;

   protected static String currentUsername;

   /**
    * Gets the default password.
    *
    * @return the default password
    */
   public String getDefaultPassword() {
      return defaultPassword;
   }

   /**
    * Gets the default username.
    *
    * @return the default username
    */
   public String getDefaultUsername() {
      return defaultUsername;
   }

   /**
    * Gets the current username.
    *
    * @return the current username
    */
   public String getCurrentUsername() {
      if (currentUsername == null || currentUsername.isBlank()) {
         return getDefaultUsername();
      }
      else {
         return currentUsername;
      }
   }

   /**
    * Sets the current username.
    *
    * @param currentUsername the new current username
    */
   public void setCurrentUsername(String currentUsername) {
      LOGGER.info("current username '{}'", currentUsername);
      this.currentUsername = currentUsername;
   }

}
