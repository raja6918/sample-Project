package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.UsersPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Scope("prototype")

public class UsersView extends AbstractPageView<UsersPageContainer> {


  public static int UserTableCount;

  private static final Logger LOGGER = LogManager.getLogger(UsersView.class);

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), UsersPageContainer.class);
  }

  public void getUsersPage() {
    WebElement pairingsClick = container.clickUsersPage();
    pairingsClick.click();
  }

  public void clickAPlusButton()throws InterruptedException{
    container.clickPlusButton().click();
  }

  public void clickAPlusButtonIsEnabled()throws InterruptedException{
    Assert.assertTrue(container.clickPlusButton().isEnabled());
  }

  public void clickAddButton()throws InterruptedException{
    driver.scrollToElement(container.clickAddButton());
    container.clickAddButton().click();
  }

  public void clickCancelButton()throws InterruptedException{
    Assert.assertTrue(container.clickCancelButton().isEnabled());
    container.clickCancelButton().click();
  }

  public String getUsersCount()throws InterruptedException{
    return container.getUsersCount().getText();
  }

  public String getUserPaneHeaderName() throws InterruptedException{
    return container.getUserPaneHeaderName().getText();
  }

  public boolean verifyIsAddPaneDisplayed(){
    if (container.AddPane().size()==0)
      return false;
    else
      return true;
  }

  public boolean addButtonIsEnabled()throws InterruptedException{
    if((container.clickAddButton().isEnabled()))
      return true;
    else
      return false;
  }

  public String getSuccessMessage() {
    WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 15);
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='notification-area']//div[@class='msg']")));
    return container.getSuccessMessage().getText();
  }

  public void setFirstName(String firstName) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "firstName"))),firstName);
  }

  public void setLastName(String lastName) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "lastName"))),lastName);
  }

  public void setUserName(String userName) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "userName"))),userName);
  }

  public void setEmail(String email) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "email"))),email);
  }

  public void setPassword(String password) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "password"))),password);
  }

  public void setRe_Password(String re_password) {
    clearAndSetText (driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "passwordRe"))),re_password);
  }

  public void setRole(String role) throws InterruptedException {
    driver.scrollToElement(container.click_role());
    TimeUnit.SECONDS.sleep(2);
    container.click_role().click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.selectRole, role))).click();
    TimeUnit.SECONDS.sleep(1);
    LOGGER.info("Selected role: "+container.click_role().getText());
    if(container.click_role().getText().equals(role))
    {
      LOGGER.info("Role OK ");
    }
    else
    {
      container.click_role().click();
      TimeUnit.SECONDS.sleep(1);
      driver.getWebDriver().findElement(By.xpath(String.format(container.selectRole, role))).click();
      TimeUnit.SECONDS.sleep(1);
    }

  }

  public String verifyValidationErrorMsg(String expectedErrorMsg) {
    return driver.getWebDriver().findElement(By.xpath(String.format(container.validationErrorMsg, expectedErrorMsg))).getText();
  }

  public void getTextCount(String fieldName,Integer MaxExpectedCount) throws InterruptedException{
    TimeUnit.SECONDS.sleep(1);
    String text = driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, fieldName))).getAttribute("value");
    Integer countActual=text.length();
    Assert.assertEquals(countActual,MaxExpectedCount);
  }

  public void IsPwdMatch(String validationMsg)throws InterruptedException{
    TimeUnit.SECONDS.sleep(2);
    driver.scrollToElement(container.pwd_IsMatchMessage());
    String actualValidationMsg =container.pwd_IsMatchMessage().getText();
    Assert.assertEquals(actualValidationMsg,validationMsg);
  }

  public boolean verifyRoleDropDownValues() {
    List<WebElement> DropdownValues = container.getRoleDropDownValues();
    List<String> listItems = new ArrayList<String>();

    for (WebElement item : DropdownValues) {
      driver.scrollToElement(item);
      listItems.add(item.getText());
    }
    ArrayList<String> expectedDropDownValue = new ArrayList<>();
    expectedDropDownValue.add("Administrator");
    expectedDropDownValue.add("Planner");
    expectedDropDownValue.add("Reviewer");
    boolean verifyDropdownMatching=listItems.equals(expectedDropDownValue);
    return verifyDropdownMatching;
  }

  public void verifyPwdValidationText()throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    String text1[]=(container.verifyPwdValidationText().get(1).getText()).split("\\r?\\n");
    String text2[]=(container.verifyPwdValidationText().get(2).getText()).split("\\r?\\n");
    String text3[]=(container.verifyPwdValidationText().get(3).getText()).split("\\r?\\n");
    String text4[]=(container.verifyPwdValidationText().get(4).getText()).split("\\r?\\n");

    Assert.assertEquals(text1[1],"At least 8 characters");
    Assert.assertEquals(text2[1],"Lower and upper case letters");
    Assert.assertEquals(text3[1],"At least one number");
    Assert.assertEquals(text4[1],"No blank spaces");
  }

  public void clickEditUsersButton(String userName) throws InterruptedException {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), (driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_USERS, userName)))));
    TimeUnit.SECONDS.sleep(1);
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_USERS, userName)));
    driver.scrollToElement(editButton);
    editButton.click();
  }

  public void clickSaveBtn() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.saveBtn());
    container.saveBtn().click();
  }

  public boolean saveButtonIsEnabled()throws InterruptedException{
    if((container.saveBtn().isEnabled()))
      return true;
    else
      return false;
  }

  public void verifyUpdateFirstName(String expectedFirstName) {
    String ActualFirstNameOnTable=driver.getWebDriver().findElement(By.xpath(String.format(container.getFirstOrLastNameFromTable, expectedFirstName))).getText();
    Assert.assertEquals(ActualFirstNameOnTable,expectedFirstName);
  }
  public void verifyUpdateLastName(String expectedLastName) {
    String ActualLastNameOnTable=driver.getWebDriver().findElement(By.xpath(String.format(container.getFirstOrLastNameFromTable, expectedLastName))).getText();
    Assert.assertEquals(ActualLastNameOnTable,expectedLastName);
  }

  public void verifyUpdateUserName(String expectedUserName) {
    String ActualUserNameOnTable=driver.getWebDriver().findElement(By.xpath(String.format(container.getUserNameFromTable, expectedUserName))).getText();
    Assert.assertEquals(ActualUserNameOnTable,expectedUserName);
  }

  public void verifyUpdateRole(String expectedRole) {
    String ActualRoleOnTable=driver.getWebDriver().findElement(By.xpath(String.format(container.getRoleFromTable, expectedRole))).getText();
    Assert.assertEquals(ActualRoleOnTable,expectedRole);
  }

  public void verifyUpdateRoleOnUserName(String userName,String expectedRole) {
    String ActualRoleOnTable=driver.getWebDriver().findElement(By.xpath("//td[(text()=\""+userName+"\")]/following-sibling::td[text()=\""+expectedRole+"\"]")).getText();
    Assert.assertEquals(ActualRoleOnTable,expectedRole);
  }

  public void verifyUpdateEmail(String expectedEmail ) {
    String ActualEmailOnTable = driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "email"))).getAttribute("value");
    Assert.assertEquals(ActualEmailOnTable,expectedEmail);
  }

  public void changePWdCheckBx() {
    container.changePWdCheckBx().click();
  }

  public boolean passwordFieldIsPresent(){
    if(container.getAsterisk().size()>=5)
      return true;
    else
      return false;
  }

  public void clearTextField(String fieldName)
  {
    selectText(driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, fieldName))));
    WebElement element=driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, fieldName)));
      while(!element.getAttribute("value").isBlank()) {
        element.sendKeys(Keys.BACK_SPACE);
      }
  }

  public void clickUserNameFromTable(String expectedUserName){
    driver.getWebDriver().findElement(By.xpath(String.format(container.getUserNameFromTable, expectedUserName))).click();
  }

  public void usersCountfromTable() {
    UserTableCount=container.getUserNameList().size();
  }

  public void usersCountfromTableAfterLogOut() {
    UserTableCount=container.getUserNameList().size();
  }

  public void UsersCountFromFooter() {
   String [] userCountText= container.UsersCountFromFooter().getText().split(" ");
   Assert.assertEquals(Integer.parseInt(userCountText[0]),UserTableCount);
  }

  public boolean verifyColumnHeaders() {
    if((container.verifyColumnHeaders().get(1).getText()).equals("First name")  & (container.verifyColumnHeaders().get(2).getText()).equals("Last name") &
      (container.verifyColumnHeaders().get(3).getText()).equals("Username")& (container.verifyColumnHeaders().get(4).getText()).equals("Role") )
    {
      return true;
    }
    else
      return false;
  }

  public void sortArrowButton(String fieldName){
    driver.getWebDriver().findElement(By.xpath(String.format(container.sortArrowButton, fieldName))).click();
  }

  public boolean  verifySortLastName(){
    List<String> lastNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getLastNameList().get(i));
      lastNameList.add(container.getLastNameList().get(i).getText());
    }
    List copy = new ArrayList(lastNameList);
    System.out.println("before"+copy);
    Collections.sort(copy,String.CASE_INSENSITIVE_ORDER);
    System.out.println("After- "+copy);
    return copy.equals(lastNameList);
  }

  public boolean  verifySortFirstName(){
    List<String> firstNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getfirstNameList().get(i));
      firstNameList.add(container.getfirstNameList().get(i).getText());
    }
    List copy = new ArrayList(firstNameList);
    System.out.println("before"+copy);
    Collections.sort(copy,String.CASE_INSENSITIVE_ORDER);
    System.out.println("After- "+copy);
    return copy.equals(firstNameList);
  }

  public boolean  verifySortUserName(){
    List<String> userNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getUserNameList().get(i));
      userNameList.add(container.getUserNameList().get(i).getText());
    }
    List copy = new ArrayList(userNameList);
    Collections.sort(copy,String.CASE_INSENSITIVE_ORDER);
    return copy.equals(userNameList);
  }


  public boolean verifySortRole() {
    List<String> roleList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getRoleList().get(i));
      roleList.add(container.getRoleList().get(i).getText());
    }
    List copy = new ArrayList(roleList);
    Collections.sort(copy,String.CASE_INSENSITIVE_ORDER);
    return copy.equals(roleList);
  }

  public void filterButton() {
    container.clickFilterButton().click();
  }

  public void EnterText_firstNameSearchBox(String textToSearch) {
    container.searchBox().get(0).sendKeys(textToSearch);
  }

  public void EnterText_lastNameSearchBox(String textToSearch) {
    container.searchBox().get(1).sendKeys(textToSearch);
  }

  public void EnterText_userNameSearchBox(String textToSearch) {
    container.searchBox().get(2).sendKeys(textToSearch);
  }

  public void EnterText_RoleSearchBox(String textToSearch) {
    container.searchBox().get(3).sendKeys(textToSearch);
  }

  public void clickCloseSearchBox() {
    container.clickCloseSearchBox().click();
  }

  public boolean verifyFilterFirstName(String searchText) {
    List<String> firstNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getfirstNameList().get(i));
      firstNameList.add(container.getfirstNameList().get(i).getText());
    }
    for(int i=0;i<UserTableCount;i++) {
      if (!(firstNameList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  public boolean verifyFilterLastName(String searchText) {
    List<String> lastNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getLastNameList().get(i));
      lastNameList.add(container.getLastNameList().get(i).getText());
    }
    for(int i=0;i<UserTableCount;i++) {
      if (!(lastNameList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  public boolean verifyFilterUserName(String searchText) {
    List<String> userNameList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getUserNameList().get(i));
      userNameList.add(container.getUserNameList().get(i).getText());
    }
    for(int i=0;i<UserTableCount;i++) {
      if (!(userNameList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  public boolean verifyFilterRole(String searchText) {
    List<String> roleList = new ArrayList<String>();
    UserTableCount=container.getUserNameList().size();
    for(int i=0;i<UserTableCount;i++){
      driver.scrollToElement(container.getRoleList().get(i));
      roleList.add(container.getRoleList().get(i).getText());
    }
    for(int i=0;i<UserTableCount;i++) {
      if (!(roleList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getPairingPageHeader() != null;
  }

  public void clickDeleteUsersButton(String userName) {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), (driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_USERS, userName)))));
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_USERS, userName)));
    driver.scrollToElement(deleteButton);
    deleteButton.click();
  }

  public void clickDeleteConfirmationButton() {
    container.clickDeleteButton().click();
  }

  public void verifyNoDeletionOccurs() {
    int countBeforeDelete=UserTableCount;
    int countAfterDelete=container.getUserNameList().size();
    Assert.assertEquals(countBeforeDelete,countAfterDelete);
  }

  public   void getUserData() throws InterruptedException {
    UsersPageContainer container=new UsersPageContainer();
    String firstName="AUTUSER";
    String lastname="AUTUSER";
    String username="aut_"+randomString();
    String email="aut"+randomString().concat("@ibsplc.com");
    String password="Ibsadmin123";
    String repassword="Ibsadmin123";
    String role="Administrator";
    container.getFIRSTNAME().sendKeys(firstName);
    container.getLASTNAME().sendKeys(lastname);
    container.getUSERNAME().sendKeys(username);
    container.getEMAIL().sendKeys(email);
    container.getPASSWORD().sendKeys(password);
    container.getREPASSWORD().sendKeys(repassword);
    container.getROLE().click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.ROLESELECTION,role))).click();

  }
  public static String randomString(){
    String generateString= RandomStringUtils.randomAlphabetic(4);
    return generateString;
  }
  public void isUserNameFieldEnabled()throws InterruptedException{
    driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "userName"))).isEnabled();
    Assert.assertFalse(driver.getWebDriver().findElement(By.xpath(String.format(container.textBox, "userName"))).isEnabled());
  }
  public void updateRole(String role) throws InterruptedException {
    driver.scrollToElement(container.click_role());
    TimeUnit.SECONDS.sleep(2);
    container.click_role().click();
    TimeUnit.SECONDS.sleep(1);
    driver.getWebDriver().findElement(By.xpath(String.format(container.selectRole, role))).click();
    TimeUnit.SECONDS.sleep(1);
    LOGGER.info("Selected role: "+container.click_role().getText());
    if(container.click_role().getText().equals(role))
    {
      LOGGER.info("Role OK ");
    }
    else
    {
      container.click_role().click();
      TimeUnit.SECONDS.sleep(1);
      driver.getWebDriver().findElement(By.xpath(String.format(container.selectRole, role))).click();
      TimeUnit.SECONDS.sleep(1);
      CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.saveBtn());
      container.saveBtn().click();

    }

  }
}
