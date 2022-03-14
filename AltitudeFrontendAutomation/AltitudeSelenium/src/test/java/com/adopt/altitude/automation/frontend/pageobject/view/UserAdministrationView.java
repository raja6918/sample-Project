package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.UserAdministrationPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")
public class UserAdministrationView extends AbstractPageView<UserAdministrationPageContainer> {
   @PostConstruct
   public void init() {
      container = PageFactory.initElements(driver.getWebDriver(), UserAdministrationPageContainer.class);
   }

   public void clickAddUserButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddUserButton());
      driver.clickAction(container.getAddUserButton());
   }

   public void setFirstname(String firstname) {
      clearAndSetText(container.getFirstNameTextField(), firstname);
   }

   public void setLastname(String lastname) {
      clearAndSetText(container.getLastNameTextField(), lastname);
   }

   public void setUsername(String username) {
      clearAndSetText(container.getUsernameTextField(), username);
   }

   public void setEmail(String email) {
      clearAndSetText(container.getEmailTextField(), email);
   }

   public void setPassword(String password) {
      clearAndSetText(container.getPasswordTextField(), password);
   }

   public void clickRoleUserDropdown(String role) throws InterruptedException {
      driver.waitForElement(container.getRoleDropdown()).click();
      WebElement element = null;

      switch (role) {
         case "Administrator":
            element = container.getAdministratorRoleItem();
            break;

         case "Planner":
            element = container.getPlannerRoleItem();
            break;

         case "Reviewer":
            element = container.getReviewerRoleItem();
            break;
        case "AuthRoleDoNotDelete":
          element = container.getAuthRoleItem();
          break;

         default:
            break;
      }
     driver.ScrollAction(element);
     TimeUnit.SECONDS.sleep(2);
      element.click();
   }

   public void setConfirmationPassword(String passwordconfirmation) {
      clearAndSetText(container.getPasswordReTextField(), passwordconfirmation);
   }

   public void clickAddButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddButton());
      driver.jsClick(container.getAddButton());

   }

   public void checkUser(String user)  throws InterruptedException {
     TimeUnit.SECONDS.sleep(2);
     WebElement userName= driver.getWebDriver().findElement(By.xpath(String.format(container.autUserCheck, user)));

     driver.ScrollAction(userName);
     TimeUnit.SECONDS.sleep(3);

   }

   public void clickOptionsButton(String username) {
     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getUserOptionsButton(username));
     driver.clickAction(container.getUserOptionsButton(username));
   }

   public void clickEditItemOptionMenu() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getEditItem());
      driver.clickAction(container.getEditItem());
   }
  public void clickEditItemOptionMenu(String Username) {
    WebElement EditButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EditParticularUser, Username)));
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), EditButton);
    driver.jsClick(EditButton);
  }

   public void clickSaveButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getSaveButton());
      driver.jsClick(container.getSaveButton());
   }

   public void clickChangePasswordCheckBox() {
      driver.clickAction(container.getChangePasswordCheckBox());
   }

   public void clickDeleteItemOptionMenu() {
      driver.waitForElement(container.getDeleteItem()).click();
   }
  public void clickDeleteItemOptionMenu(String Username) {
    WebElement DeleteIcon = driver.getWebDriver().findElement(By.xpath(String.format(container.DeleteParticularUser, Username)));
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), DeleteIcon);
    driver.jsClick(DeleteIcon);
  }

   public void clickDeleteButton() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
      driver.clickAction(container.getDeleteButton());
   }

   public List<String> getUsers() {
      List<WebElement> webElements = container.getCurrentUsers();
      List<String> usernames = new ArrayList<>();

      for (WebElement element : webElements) {
        // ExpectedConditions.visibilityOf(element);
         driver.ScrollAction(element);
         usernames.add(element.getText());
      }

      return usernames;
   }

   public boolean isUsernameInTable(String username) {
      return getUsers().contains(username);
   }

   public String getVisibleErrorMessage() {
      List<WebElement> errorMessages = container.getErrorMessages();

      return errorMessages
             .stream()
             .filter(e -> e.isDisplayed())
             .findFirst().get()
             .getText();
   }

  public String getNoBlankSpace_color () {
    WebElement noblank = container.getColorCode_NoBlankSpace();
    String color_noblankspace=noblank.getCssValue("color");
    return  color_noblankspace;
  }
  public String getAtLeastOneNumber_Color() {
    WebElement atleastonenumber = container.getColorCode_atleastonenumber_color();
    String color_atLeastOneNumebr=atleastonenumber.getCssValue("color");
    return  color_atLeastOneNumebr;
  }
  public String getLowerAndUpperCaseLetter_Color() {
    WebElement lowerandUpper = container.getColorCode_LowerAndUpperCase_color();
    String color_atLeastOneNumebr=lowerandUpper.getCssValue("color");
    return  color_atLeastOneNumebr;
  }
  public String getAtLeastEightCharacter_Color() {
    WebElement atleasteightcharacters = container.getColorCode_atleastEightcharater_color();
    String color_atLeastOneNumebr=atleasteightcharacters.getCssValue("color");
    return  color_atLeastOneNumebr;
  }

   public List<String> getNames() {
      List<WebElement> webElements = container.getCurrentNames();
      List<String> names = new ArrayList<>();

      for (WebElement element : webElements) {
         //ExpectedConditions.visibilityOf(element);
        driver.ScrollAction(element);
         names.add(element.getText());
      }

      return names;
   }

  /**
   * Gets the snackbar error message.
   *
   * @return the snackbar error message
   */
  public String getSnackbarErrorMessage() {
    return driver.waitForElement(container.getSnackbarErrorMessage(), 5, 1).getText();
  }

  /**
   * Gets the error message.
   *
   * @return the error message
   */
  public String getErrorMessage() {
    return container.getErrorDetailsItem().getText();
  }

   @Override
   public boolean isDisplayedCheck() {
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getUserAdminHeader());
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getAddUserButton());

      return container.getAddUserButton() != null && container.getUserAdminHeader() != null;
   }
   public void clickFilterList(){
    container.getFilterList().click();
   }
  public String EnterUserNameinSearchPlaceHolder(String username){
    WebElement UserNamePlaceholder=driver.getWebDriver().findElement(By.xpath("//*[contains(@class,'MuiTableRow-root filters TableHead__CollapsableTableRow')]/descendant::input[3]"));
    UserNamePlaceholder.click();
    UserNamePlaceholder.sendKeys(username);
    String FirstName=driver.getWebDriver().findElement(By.xpath("//*[@class='MuiTableBody-root']/tr/td[2]")).getText();
    String lastName=driver.getWebDriver().findElement(By.xpath("//*[@class='MuiTableBody-root']/tr/td[3]")).getText();
    return FirstName+" "+lastName;
  }
}
