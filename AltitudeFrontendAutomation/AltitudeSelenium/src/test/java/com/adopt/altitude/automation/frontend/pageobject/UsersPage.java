package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.data.user.userDetails;
import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.UsersView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.awt.*;

@Component
public class UsersPage {

  @Autowired
  @Lazy(true)
  UsersView usersView;

  @Autowired
  @Lazy(true)
  private DataHomeView dataHomeView;


  public void goToUsersPage() {
    dataHomeView.clickHomeButton();
    usersView.getUsersPage();
  }

  public void clickPlusButton() throws InterruptedException {
    usersView.clickAPlusButton();
  }

  public void addButtonClick() throws InterruptedException {
    usersView.clickAddButton();
  }

  public void cancelButtonClick() throws InterruptedException {
    usersView.clickCancelButton();
  }

  public String getUsersCount() throws InterruptedException {
    return usersView.getUsersCount();
  }

  public void getUserPaneHeaderName(String firstPlusLastNameExpected) throws InterruptedException {
    Assert.assertEquals(firstPlusLastNameExpected, usersView.getUserPaneHeaderName());
  }

  public void verifyAddButtonEnabled() throws InterruptedException {
    Assert.assertFalse(usersView.addButtonIsEnabled());
  }

  public String getSuccessMessage() {
    return usersView.getSuccessMessage();
  }

  public void fillOutAddSolverRequestForm(userDetails users) throws InterruptedException {
    usersView.setFirstName(users.getFirstName());
    usersView.setLastName(users.getLastName());
    usersView.setUserName(users.getUserName());
    usersView.setEmail(users.getEmail());
    usersView.setPassword(users.getPassword());
    usersView.setRe_Password(users.getRe_password());
    usersView.setRole(users.getRole());
  }

  public void enterFirstName(String firstName) throws InterruptedException {
    usersView.setFirstName(firstName);
  }

  public void enterLastName(String lastName) throws InterruptedException {
    usersView.setLastName(lastName);
  }

  public void enterUserName(String userName) throws InterruptedException {
    usersView.setUserName(userName);
  }

  public void enterEmail(String email) throws InterruptedException {
    usersView.setEmail(email);
  }

  public void enterPassword(String password) throws InterruptedException {
    usersView.setPassword(password);
  }

  public void enterRe_Password(String re_password) throws InterruptedException {
    usersView.setRe_Password(re_password);
  }

  public void verifyValidationErrorMsg(String expectedErrorMsg) throws InterruptedException {
    Assert.assertEquals(usersView.verifyValidationErrorMsg(expectedErrorMsg), expectedErrorMsg);
  }

  public void verifyIsAddPaneDisplayed() {
    Assert.assertFalse(usersView.verifyIsAddPaneDisplayed());
  }

  public void getTextCount(String firstName, Integer MaxExpectedCount) throws InterruptedException, AWTException {
    usersView.getTextCount(firstName, MaxExpectedCount);
  }
  public void verifyRoleDropDownValues() throws InterruptedException {
    usersView.verifyRoleDropDownValues();
  }

  public void IsPwdMatch(String validationMsg) throws InterruptedException {
    usersView.IsPwdMatch(validationMsg);
  }

  public void verifyPwdValidationText() throws InterruptedException {
    usersView.verifyPwdValidationText();
  }

  public void clickEditUsersButton(String userName) throws InterruptedException {
    usersView.clickEditUsersButton(userName);
  }

  public void updateFirstName(String firstName){
    usersView.setFirstName(firstName);
  }

  public void updateLastName(String lastName) {
    usersView.setLastName(lastName);
  }

  public void updateUserName(String userName)  {
    usersView.setUserName(userName);
  }

  public void updateEmail(String email)  {
    usersView.setEmail(email);
  }

  public void updateRole(String role) throws InterruptedException {
    usersView.setRole(role);
  }

  public void clickSaveBtn()  {
    usersView.clickSaveBtn();
  }

  public void verifyUpdateFirstName(String newFirstName) {
    usersView.verifyUpdateFirstName(newFirstName);
  }

  public void verifyUpdateLastName(String newLastName) {
    usersView.verifyUpdateLastName(newLastName);;
  }

  public void verifyUpdateUserName(String userName) {
    usersView.verifyUpdateUserName(userName);
  }

  public void verifyUpdateRole(String role) {
    usersView.verifyUpdateRole(role);
  }

  public void verifyUpdateRoleOnUserName(String userName,String role) {
    usersView.verifyUpdateRoleOnUserName(userName,role);
  }

  public void verifyUpdateEmail(String email) {
    usersView.verifyUpdateEmail(email);
  }

  public void changePWdCheckBx() {
    usersView.changePWdCheckBx();
  }

  public void passwordFieldIsPresent() throws InterruptedException {
    Assert.assertTrue(usersView.passwordFieldIsPresent());
  }

  public void passwordFieldIsNotPresent() throws InterruptedException {
    Assert.assertFalse(usersView.passwordFieldIsPresent());
  }

  public void clearTextField(String fieldName) {
    usersView.clearTextField(fieldName);
  }

  public void saveButtonIsDisabled() throws InterruptedException {
    Assert.assertFalse(usersView.saveButtonIsEnabled());
  }

  public void saveButtonIsEnabled() throws InterruptedException {
    Assert.assertTrue(usersView.saveButtonIsEnabled());
  }

  public void clickUserNameFromTable(String userName) {
    usersView.clickUserNameFromTable(userName);
  }

  public void usersCountfromTable() {
    usersView.usersCountfromTable();
  }

  public void UsersCountFromFooter() {
    usersView.UsersCountFromFooter();
  }

  public void usersCountfromTableAfterLogOut() {
    usersView.usersCountfromTableAfterLogOut();
  }

  public void verifyColumnHeaders() {
    Assert.assertTrue(usersView.verifyColumnHeaders());
  }

  public void sortArrowButton(String fieldName) {
    usersView.sortArrowButton(fieldName);
  }

  public void verifySortLastName() {
    Assert.assertTrue(usersView.verifySortLastName());
  }

  public void verifySortFirstName() {
    Assert.assertTrue(usersView.verifySortFirstName());
  }

  public void verifySortUserName() {
    Assert.assertTrue(usersView.verifySortUserName());
  }

  public void verifySortRole() {
    Assert.assertTrue(usersView.verifySortRole());
  }

  public void filterButton() {
    usersView.filterButton();
  }

  public void EnterText_firstNameSearchBox(String textToSearch) {
    usersView.EnterText_firstNameSearchBox(textToSearch);
  }

  public void EnterText_lastNameSearchBox(String textToSearch) {
    usersView.EnterText_lastNameSearchBox(textToSearch);
  }

  public void EnterText_userNameSearchBox(String textToSearch) {
    usersView.EnterText_userNameSearchBox(textToSearch);
  }

  public void EnterText_RoleSearchBox(String textToSearch) {
    usersView.EnterText_RoleSearchBox(textToSearch);
  }

  public void clickCloseSearchBox() {
    usersView.clickCloseSearchBox();
  }

  public void verifyFilterFirstName(String searchText) {
    usersView.verifyFilterFirstName(searchText);
  }

  public void verifyFilterLastName(String searchText) {
    usersView.verifyFilterLastName(searchText);
  }

  public void verifyFilterUserName(String searchText) {
    usersView.verifyFilterUserName(searchText);
  }

  public void verifyFilterRole(String searchText) {
   usersView.verifyFilterRole(searchText);
  }

  public void clickDeleteUsersButton(String userName) {
    usersView.clickDeleteUsersButton(userName);
  }

  public void clickDeleteConfirmationButton() {
    usersView.clickDeleteConfirmationButton();
  }

  public void clickCancelButton() throws InterruptedException {
    usersView.clickCancelButton();
  }

  public void verifyNoDeletionOccurs() {
    usersView.verifyNoDeletionOccurs();
  }

  public void clickAPlusButtonIsEnabled() throws InterruptedException {
    usersView.clickAPlusButtonIsEnabled();
  }
public  void getDynamicDate() throws InterruptedException {
  UsersView usersView=new UsersView();
  usersView.getUserData();
}
  public void fillOutAddSolverRequestForm1(userDetails users) throws InterruptedException {
    usersView.setFirstName(users.getFirstName());
    usersView.setLastName(users.getLastName());
    usersView.setUserName(users.getUserName());
    usersView.setEmail(users.getEmail());
    usersView.setPassword(users.getPassword());
    usersView.setRe_Password(users.getRe_password());
    usersView.setRole(users.getRole());
  }

  public void VerifyuserNameField() throws InterruptedException {
    usersView.clickAPlusButtonIsEnabled();
  }
}
