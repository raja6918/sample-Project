package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class UsersPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text() = 'Pairings']")
  private WebElement pairingPageHeader;

  public WebElement getPairingPageHeader() { return pairingPageHeader; }

  @FindBy(xpath = "//p[contains(text(),'Users')]/ancestor::a")
  private WebElement UsersLink;

  public WebElement clickUsersPage() { return UsersLink; }

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement plusButton;

  public WebElement clickPlusButton() { return plusButton; }

  @FindBy(xpath = "//span[text()='ADD']/parent::button")
  private WebElement addButton;

  public WebElement clickAddButton() { return addButton; }

  @FindBy(xpath = "//span[text()='Cancel']/parent::button")
  private WebElement cancelButton;

  public WebElement clickCancelButton() { return cancelButton; }

  @FindBy(xpath = "//p[contains(@class,'TableFooter__FooterText')]")
  private WebElement usersCount;

  public WebElement getUsersCount() { return usersCount; }

  @FindBy(xpath = "//input[@id='firstName']")
  private WebElement firstName;

  public WebElement firstNameTextBox() { return firstName; }

  @FindBy(xpath = "//input[@id='lastName']")
  private WebElement lastName;

  public WebElement lastNameTextBox() { return lastName; }

  @FindBy(xpath = "//input[@id='userName']")
  private WebElement userName;

  public WebElement userNameTextBox() { return userName; }

  @FindBy(xpath = "//input[@id='email']")
  private WebElement email;

  public WebElement emailTextBox() { return email; }

  @FindBy(xpath = "//input[@id='password']")
  private WebElement password;

  public WebElement passwordTextBox() { return password; }

  @FindBy(xpath = "//input[@id='passwordRe']")
  private WebElement passwordRe;

  public WebElement re_enter_Pwd_TextBox() { return passwordRe; }

  @FindBy(xpath = "//div[@role=\"button\"]/parent::div")
  private WebElement role;

  public WebElement click_role() { return role; }

  @FindBy(xpath = "//div[contains(@class,'FormHeader')]/span[2]")
  private WebElement userPaneHeaderTextName;

  public WebElement getUserPaneHeaderName() { return userPaneHeaderTextName; }

  @FindBy(xpath = "//Form[@id='userform']")
  private List<WebElement> AddPane;

  public List<WebElement> AddPane() { return AddPane; }

  @FindBy(xpath = "//ul[@role='listbox']/li")
  private List<WebElement> roleDropDownValues;

  public List<WebElement>  getRoleDropDownValues() { return roleDropDownValues; }

  @FindBy(xpath = "//*[@id='notification-area']//div[@class='msg']")
  private WebElement successMessage;

  public WebElement getSuccessMessage() {return successMessage; }

  public String selectRole = "//ul[@role='listbox']/li/p[text()='%s']";

  public String validationErrorMsg = "//p[text()='%s']";

  public String textBox ="//input[@id='%s']";

  public String EDIT_USERS = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'edit')]";

  public String DELETE_USERS = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";

  public String getUserNameFromTable ="//td[contains(text(),'%s')]";

  public String getRoleFromTable ="//td[(text()='AutUserThree_DoNotDelete')]/following-sibling::td[text()='%s']";

  public String getFirstOrLastNameFromTable ="//td[contains(text(),'AutUserThree_DoNotDelete')]/preceding-sibling::td[text()='%s']";

  @FindBy(xpath = "//p[text()=\"Passwords don't match\"]")
  private WebElement pwd_IsMatchMessage;

  public WebElement pwd_IsMatchMessage() {return pwd_IsMatchMessage; }

  @FindBy(xpath = "//div[contains(@class,'PasswordValidator')]")
  private List<WebElement> verifyPwdValidationText;

  public List<WebElement>  verifyPwdValidationText() { return verifyPwdValidationText; }

  @FindBy(xpath = "//button[@type='submit']")
  private WebElement saveBtn;

  public WebElement saveBtn() {return saveBtn; }

  @FindBy(xpath = "//input[@name='changePassword']")
  private WebElement changePWdCheckBx;

  public WebElement changePWdCheckBx() {return changePWdCheckBx; }

  @FindBy(xpath = "//span[text()='*']")
  private List<WebElement> Asterisk;

  public List<WebElement> getAsterisk() {return Asterisk; }

  @FindBy(xpath = "//span[text()='DELETE']/parent::button")
  private WebElement deleteButton;

  public WebElement clickDeleteButton() { return deleteButton; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[2]")
  private List<WebElement> firstNameList;

  public List<WebElement> getfirstNameList() { return firstNameList; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[3]")
  private List<WebElement> lastNameList;

  public List<WebElement> getLastNameList() { return lastNameList; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[4]")
  private List<WebElement> userNameList;

  public List<WebElement> getUserNameList() { return userNameList; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[5]")
  private List<WebElement> roleList;

  public List<WebElement> getRoleList() { return roleList; }

  @FindBy(xpath = "//p[contains(@class,'TableFooter__FooterText')]")
  private WebElement UsersCountFromFooter;

  public WebElement UsersCountFromFooter() { return UsersCountFromFooter; }

  @FindBy(xpath = "//tr[contains(@class,'MuiTableRow-root MuiTableRow-head')]/th")
  private List<WebElement> verifyColumnHeaders;

  public List<WebElement> verifyColumnHeaders() { return verifyColumnHeaders; }

  public String sortArrowButton ="//tr[contains(@class,'MuiTableRow-root MuiTableRow-head')]/th/span[text()='%s']";

  @FindBy(xpath = "//span[text()='filter_list']/parent::span/parent::button")
  private WebElement filterButton;

  public WebElement clickFilterButton() { return filterButton; }

  @FindBy(xpath = "//span[text()='highlight_off']/parent::span/parent::button")
  private WebElement closeSearchBox;

  public WebElement clickCloseSearchBox() { return closeSearchBox; }

  @FindBy(xpath = "//tr[contains(@class,'MuiTableRow-root filters')]/th/div/div/input")
  private List<WebElement> searchBox;

  public List<WebElement> searchBox() { return searchBox; }


  @FindBy(xpath = "//*[@id='firstName']")
  private  WebElement FIRSTNAME;
  public WebElement getFIRSTNAME(){return FIRSTNAME ; }

  @FindBy(xpath = "//*[@id='lastName']")
  private  WebElement LASTNAME;
  public WebElement getLASTNAME(){return LASTNAME ; }

  @FindBy(xpath = "//*[@id='userName']")
  private WebElement USERNAME;
  public  WebElement getUSERNAME(){return USERNAME ; }

  @FindBy(xpath = "//*[@id='email']")
  private   WebElement EMAIL;
  public WebElement getEMAIL(){return EMAIL ; }

  @FindBy(xpath = "//*[@id='password']")
  private  WebElement PASSWORD;
  public  WebElement getPASSWORD(){return PASSWORD ; }

  @FindBy(xpath = "//*[@id='passwordRe']")
  private   WebElement REPASSWORD;
  public WebElement getREPASSWORD(){return REPASSWORD ; }

  @FindBy(xpath = "//*[@id='mui-component-select-roleId']")
  private   WebElement ROLE;
  public  WebElement getROLE(){return ROLE ; }
  public String ROLESELECTION = "//*[@role='listbox']/descendant::li/p[text()='%s']";

}

