package com.adopt.altitude.automation.frontend.api.steps;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.backend.api.ClientException;
import com.adopt.altitude.automation.backend.api.authentication.AuthenticationEndpoint;
import com.adopt.altitude.automation.backend.api.authentication.AuthenticationToken;
import com.adopt.altitude.automation.backend.api.authentication.Credentials;

/**
 * The Class ApiLogin.
 */
@Component
public class ApiLogin extends AbstractApiSteps {

   private static final Logger    LOGGER = LogManager.getLogger(ApiLogin.class);

   @Autowired
   @Lazy(true)
   private AuthenticationEndpoint authEndpoint;

   /**
    * Gets the token.
    *
    * @return the token
    * @throws ClientException
    */
   public AuthenticationToken getToken() throws ClientException {
      apiLogin.login(getDefaultUsername(), getDefaultPassword());

      return currentToken;
   }

  protected AuthenticationToken getToken(String username, String password) throws ClientException {
    apiLogin.login(username, password);

    return currentToken;
  }

   /**
    * Login.
    *
    * @param username the username
    * @param password the password
    * @throws ClientException
    */
   protected void login(String username, String password) throws ClientException {
      LOGGER.info(String.format("Login with credentials. username: {%s}, Password: {%s}", username, password));
      Credentials credentials = new Credentials();
      credentials.setUsername(username);
      credentials.setPassword(password);
      setCurrentUsername(username);

      currentToken = authEndpoint.authenticate(credentials);
   }
}
