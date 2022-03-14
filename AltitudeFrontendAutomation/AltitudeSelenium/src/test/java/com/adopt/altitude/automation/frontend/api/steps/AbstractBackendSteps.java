package com.adopt.altitude.automation.frontend.api.steps;

import com.adopt.altitude.automation.backend.api.ClientException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;

public class AbstractBackendSteps {
  private static final Logger LOGGER = LogManager.getLogger(AbstractBackendSteps.class);

  protected ClientException currentException;

  @Value("${altitude.default.username}")
  private String              defaultUsername;

  @Value("${altitude.default.password}")
  private String              defaultPassword;

  private String              currentUsername;

  @Value("${altitude.non_default_username}")
  private String              non_defaultUsername;

  @Value("${altitude.default.keycloak.username}")
  private String              defaultKeycloakUsername;

  @Value("${altitude.default.keycloak.password}")
  private String              defaultKeycloakPassword;

  @Value("${altitude.default.grant_type}")
  private String              defaultGrant_type;

  @Value("${altitude.default.client_secret}")
  private String              defaultClient_secret;

  @Value("${altitude.default.client_id}")
  private String              defaultClient_id;

  @Value("${altitude.default.userId}")
  private Integer              defaultUserId;

  public String getDefaultGrant_type() {
    return defaultGrant_type;
  }

  public String getDefaultClient_secret() {
    return defaultClient_secret;
  }

  public String getDefaultClient_id() {
    return defaultClient_id;
  }

  public String getDefaultKeycloakPassword() {
    return defaultKeycloakPassword;
  }

  public String getDefaultKeycloakUsername() {
    return defaultKeycloakUsername;
  }

  public String getDefaultPassword() {
    return defaultPassword;
  }

  public String getDefaultUsername() {
    return defaultUsername;
  }

  public String getNon_DefaultUsername() {
    return non_defaultUsername;
  }

  public String getCurrentUsername() {
    if (currentUsername == null || currentUsername.isBlank()) {
      return getDefaultUsername();
    }
    else {
      return currentUsername;
    }
  }

  public void setCurrentUsername(String currentUsername) {
    LOGGER.info("current username '{}'", currentUsername);
    this.currentUsername = currentUsername;
  }

  //Code to get UserID
  public Integer getDefaultUserId() {
    return defaultUserId;
  }

}
