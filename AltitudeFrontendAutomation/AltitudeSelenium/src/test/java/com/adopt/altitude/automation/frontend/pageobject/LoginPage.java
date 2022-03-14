package com.adopt.altitude.automation.frontend.pageobject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.pageobject.view.LoginView;
@Component
public class LoginPage extends AbstractPage {

   @Autowired
   @Lazy(true)
   private LoginView loginView;

   public void setUsername(String username) {
      loginView.setUsernameText(username);
   }

   public void setPassword(String password) {
      loginView.setPasswordText(password);
   }

   public void clickLogin() throws InterruptedException {
      loginView.clickLoginButton();
   }

   public void login(String username, String password) throws InterruptedException {
      setUsername(username);
      setPassword(password);
      clickLogin();
   }

   @Override
   public boolean isPageDisplayed() {
      return loginView.isDisplayedCheck();
   }
}
