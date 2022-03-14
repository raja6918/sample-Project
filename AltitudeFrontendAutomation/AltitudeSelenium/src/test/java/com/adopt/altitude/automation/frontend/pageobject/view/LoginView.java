package com.adopt.altitude.automation.frontend.pageobject.view;

import javax.annotation.PostConstruct;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.adopt.altitude.automation.frontend.pageobject.containers.LoginPageContainer;

import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class LoginView extends AbstractPageView<LoginPageContainer> {

   private final static Logger LOGGER = LogManager.getLogger(LoginView.class);

   @PostConstruct
   public void init() throws Exception{
      container = PageFactory.initElements(driver.getWebDriver(), LoginPageContainer.class);
   }

   public void setUsernameText(String username) {
      container.getUsernameField().sendKeys(username);
   }

   public void setPasswordText(String password) {
      container.getPasswordField().sendKeys(password);
   }

   public void clickLoginButton() {
     container.getLoginButton().click();
   }

   @Override
   public boolean isDisplayedCheck() {
      LOGGER.info("Verify whether the screen is fully loaded and displayed");
      return false;
   }


}
