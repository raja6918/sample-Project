package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class UserAdministrationPageContainer extends PageContainer {
   @FindBy(xpath = "//button[@aria-label='add']")
   private WebElement       addUserButton;

   @FindBy(xpath = "//a[text()='SIERRA']")
   private WebElement       userAdminHeader;

   @FindBy(xpath = "//h2[text()='Add New User']")
   private WebElement       addNewUserFormHeader;

   @FindBy(id = "firstName")
   private WebElement       firstNameTextField;

   @FindBy(id = "lastName")
   private WebElement       lastNameTextField;

   @FindBy(id = "userName")
   private WebElement       usernameTextField;

   @FindBy(id = "email")
   private WebElement       emailTextField;

   @FindBy(id = "password")
   private WebElement       passwordTextField;

   @FindBy(id = "passwordRe")
   private WebElement       passwordReTextField;

   @FindBy(xpath = "//div[@role='button']")
   private WebElement       roleDropdown;

   @FindBy(xpath = "//button/span[text()='Cancel']")
   private WebElement       cancelButton;

   @FindBy(xpath = "//button[span[text()='ADD']]")
   private WebElement       addButton;


   public String autUserCheck = "//*[text()='%s']/ancestor::tr";
  //*[@id="main-container"]//p[text()='%s']
  @FindBy(xpath = "//ul[@role='listbox']/child :: li/p[contains(text(),'Administrator')]")
   private WebElement       administratorRoleItem;

   @FindBy(xpath = "//ul[@role='listbox']/child :: li/p[contains(text(),'Planner')]")
   private WebElement       plannerRoleItem;

   @FindBy(xpath = "//ul[@role='listbox']/child :: li/p[contains(text(),'Reviewer')]")
  private WebElement       reviewerRoleItem;

  @FindBy(xpath = "//ul[@role='listbox']/child :: li/p[contains(text(),'AuthRoleDoNotDelete')]")
  private WebElement       autRole;

   @FindBy(xpath = "//p[text()='edit']/..")
   private WebElement       editItem;

   @FindBy(xpath = "//span[text()='SAVE']")
   private WebElement       saveButton;

   @FindBy(xpath = "//p[text()='delete']/..")
   private WebElement       deleteItem;

   @FindBy(xpath = "//input[@type='checkbox']")
   private WebElement       changePasswordCheckBox;

   @FindBy(xpath = "//span[text()='DELETE']")
   private WebElement       deleteButton;

   @FindBy(xpath = "//td[4]")
   //div[contains(@class,'UsersInfo')]/descendant::p[contains(@class,'UsersSubtext')]
   private List<WebElement> currentUsers;

  @FindBy(xpath = "//td[4]")
  private List<WebElement> currentNames;
  //div[contains(@class,'UsersInfo')]/descendant::p[contains(@class,'UsersText')]
  @FindBy(xpath = "//table[@class='MuiTable-root']") private WebElement usersTable;

  @FindBy(xpath = "//form[@id='userform']/descendant::div/p")
  //form[@id='userform']/descendant::span[contains(@class, 'ErrorMessage')]
  private List<WebElement> errorMessages;

  @FindBy(xpath = "//div[contains(@class, 'msg')]") private WebElement snackbarErrorMessage;

  @FindBy(xpath = "//div[contains(@class, 'error-details')]/p")
  private WebElement errorDetailsItem;

  public List<WebElement> getErrorMessages() {
    return errorMessages;
  }
  public List<WebElement> getErrorMessages1() {
    return errorMessages;
  }

  @FindBy(xpath = "//*[contains(@class,'PasswordValidator__Container')]//child::div[4]")
  private WebElement noblankspace_color;
  public  WebElement getColorCode_NoBlankSpace(){
   return  noblankspace_color;
  }

  @FindBy(xpath = "//*[contains(@class,'PasswordValidator__Container')]//child::div[3]")
  private WebElement atleastonenumber_color;
  public  WebElement getColorCode_atleastonenumber_color(){
    return  atleastonenumber_color;
  }
  @FindBy(xpath = "//*[contains(@class,'PasswordValidator__Container')]//child::div[2]")
  private WebElement LowerAndUpperCase_color;
  public  WebElement getColorCode_LowerAndUpperCase_color(){
    return  LowerAndUpperCase_color;
  }
  @FindBy(xpath = "//*[contains(@class,'PasswordValidator__Container')]//child::div[1]")
  private WebElement atleastEightcharater_color;
  public  WebElement getColorCode_atleastEightcharater_color(){
    return  atleastEightcharater_color;
  }
 @FindBy(xpath = "//*[text()='filter_list']")
 private WebElement filetList;
  public WebElement getUsersTable() {
    return usersTable;
  }

   public List<WebElement> getCurrentNames() {
      return currentNames;
   }

   public WebElement getUserOptionsButton(String username) {
    WebElement usersTable = this.getUsersTable();
     return usersTable.findElement(By.xpath(String.format(".//tr[td//p[text()='%s']]//button", username)));
   }
   public String EditParticularUser="//td[text()='%s']/ancestor::tr/td[6]/button/span/span[text()='edit']";
   public  String DeleteParticularUser="//td[text()='%s']/ancestor::tr/td[6]/button/span/span[text()='delete']";
  public WebElement getUserOptionsButton1() {
    return deleteButton;
  }

   public List<WebElement> getCurrentUsers() {
      return currentUsers;
   }

   public WebElement getDeleteButton() {
      return deleteButton;
   }

   public WebElement getChangePasswordCheckBox() {
      return changePasswordCheckBox;
   }

   public WebElement getDeleteItem() {
      return deleteItem;
   }

   public WebElement getSaveButton() {
      return saveButton;
   }

   public WebElement getEditItem() {
      return editItem;
   }

   public WebElement getAdministratorRoleItem() {
      return administratorRoleItem;
   }

   public WebElement getPlannerRoleItem() {
      return plannerRoleItem;
   }

   public WebElement getReviewerRoleItem() {
      return reviewerRoleItem;
   }
  public WebElement getAuthRoleItem() {
    return autRole;
  }

   public WebElement getAddNewUserFormHeader() {
      return addNewUserFormHeader;
   }

   public WebElement getFirstNameTextField() {
      return firstNameTextField;
   }

   public WebElement getLastNameTextField() {
      return lastNameTextField;
   }

   public WebElement getUsernameTextField() {
      return usernameTextField;
   }

   public WebElement getEmailTextField() {
      return emailTextField;
   }

   public WebElement getPasswordTextField() {
      return passwordTextField;
   }

   public WebElement getPasswordReTextField() {
      return passwordReTextField;
   }

   public WebElement getRoleDropdown() {
      return roleDropdown;
   }

   public WebElement getCancelButton() {
      return cancelButton;
   }

   public WebElement getAddButton() {
      return addButton;
   }

   public WebElement getAddUserButton() {
      return addUserButton;
   }

   public WebElement getUserAdminHeader() {
      return userAdminHeader;
   }

  public WebElement getSnackbarErrorMessage() {
    return snackbarErrorMessage;
  }

  public WebElement getErrorDetailsItem() {
    return errorDetailsItem;
  }
  public WebElement getFilterList() {
    return filetList;
  }
}
