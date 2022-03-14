package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPageContainer extends PageContainer {

   @FindBy(name = "username")
   private WebElement usernameField;

   @FindBy(name = "password")
   private WebElement passwordField;

   @FindBy(css = "div button")
   private WebElement loginButton;

   public WebElement getUsernameField() {
      return usernameField;
   }

   public WebElement getPasswordField() {
      return passwordField;
   }

   public WebElement getLoginButton() {
      return loginButton;
   }
}
