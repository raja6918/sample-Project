package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.UserAdministrationView;
import com.adopt.altitude.automation.frontend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserAdministrationPage extends AbstractPage {

   @Autowired
   @Lazy(true)
   private UserAdministrationView userAdministrationView;

   public void openAddUserForm() {
      userAdministrationView.clickAddUserButton();
   }

   public void displayOptions(String username) {
      userAdministrationView.clickOptionsButton(username);
   }

   public void editUser() {
      userAdministrationView.clickEditItemOptionMenu();
   }
  public void editUser(String Username) {
    userAdministrationView.clickEditItemOptionMenu(Username);
  }

   public void changePassword() {
      userAdministrationView.clickChangePasswordCheckBox();
   }

   public void openDeleteUserForm() {
      userAdministrationView.clickDeleteItemOptionMenu();
   }
  public void openDeleteUserForm(String Username) {
    userAdministrationView.clickDeleteItemOptionMenu(Username);
  }

   public void deleteUser() {
      userAdministrationView.clickDeleteButton();
   }

   public void changePassword(User user) {
      userAdministrationView.setPassword(user.getPassword());
      userAdministrationView.setConfirmationPassword(user.getConfirmedPassword());
      userAdministrationView.clickSaveButton();
   }

   public void updateUser(User user) throws InterruptedException {
      userAdministrationView.setFirstname(user.getFirstname());
      userAdministrationView.setLastname(user.getLastname());
      userAdministrationView.setEmail(user.getEmail());
      userAdministrationView.clickRoleUserDropdown(user.getRole());
      userAdministrationView.clickSaveButton();
   }

  public void updateUsername(User user) {
    userAdministrationView.setUsername(user.getUsername());
    userAdministrationView.clickSaveButton();
  }

   public void addUser(User user) throws InterruptedException {
      userAdministrationView.setFirstname(user.getFirstname());
      userAdministrationView.setLastname(user.getLastname());
      userAdministrationView.setUsername(user.getUsername());
      userAdministrationView.setEmail(user.getEmail());
      userAdministrationView.setPassword(user.getPassword());
      userAdministrationView.setConfirmationPassword(user.getConfirmedPassword());
      userAdministrationView.clickRoleUserDropdown(user.getRole());
      userAdministrationView.clickAddButton();
   }

   public void checkUser(String user) throws InterruptedException {
     userAdministrationView.checkUser(user);
   }

   public void saveChanges() {
      userAdministrationView.clickSaveButton();
   }

   @Override
   public boolean isPageDisplayed() {
      return userAdministrationView.isDisplayedCheck();
   }

   public String getErrorMessage() {
      return userAdministrationView.getVisibleErrorMessage();
   }


  public String getColorCodeBeforeForNotBlankSpace() {
   String ColorCodeBefore=  userAdministrationView.getNoBlankSpace_color();
   return  ColorCodeBefore;
  }
  public String getColorCodeAfterForNotBlankSpace() {
    String ColorCodeAfter=  userAdministrationView.getNoBlankSpace_color();
    return  ColorCodeAfter;
  }
  public String getColorCodeBeforeForAtLeastOneNumber() {
    String ColorCodeBefore=  userAdministrationView.getAtLeastOneNumber_Color();
    return  ColorCodeBefore;
  }
  public String getColorCodeAfterForAtLeastOneNumber() {
    String ColorCodeAfter=  userAdministrationView.getAtLeastOneNumber_Color();
    return  ColorCodeAfter;
  }
  public String getColorCodeBeforeForLowerAndUppercase() {
    String ColorCodeBefore=  userAdministrationView.getLowerAndUpperCaseLetter_Color();
    return  ColorCodeBefore;
  }
  public String getColorCodeAfterForLowerAndUpperCase() {
    String ColorCodeAfter=  userAdministrationView.getLowerAndUpperCaseLetter_Color();
    return  ColorCodeAfter;
  }
  public String getColorCodeBeforeForAtleastEightCharacters() {
    String ColorCodeBefore=  userAdministrationView.getAtLeastEightCharacter_Color();
    return  ColorCodeBefore;
  }
  public String getColorCodeAfterForAtLeastEightCharacters() {
    String ColorCodeAfter=  userAdministrationView.getAtLeastEightCharacter_Color();
    return  ColorCodeAfter;
  }

   public List<String> getUsernames() {
      return userAdministrationView.getUsers();
   }

   public List<String> getNames() {
      return userAdministrationView.getNames();
   }

  public String getSnackbarErrorMessage() {
    return userAdministrationView.getSnackbarErrorMessage();
  }

  public String getPageErrorMessage() {
    return userAdministrationView.getErrorMessage();
  }

public boolean isUsernameInTable(String username) {
   return userAdministrationView.isUsernameInTable(username);

}

  public void  clickFilterList() {
    userAdministrationView.clickFilterList();
   }
  public String  EnterUserNameinSearchPlaceHolder(String username) {
   return  userAdministrationView.EnterUserNameinSearchPlaceHolder(username);
  }

}
