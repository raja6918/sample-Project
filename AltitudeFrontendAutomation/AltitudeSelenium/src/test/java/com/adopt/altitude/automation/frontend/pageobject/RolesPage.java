package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.RolesView;
import com.adopt.altitude.automation.frontend.pageobject.view.UsersView;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RolesPage {

  @Autowired
  @Lazy(true)
  RolesView rolesView;

  @Autowired
  @Lazy(true)
  UsersView usersView;

  @Autowired
  @Lazy(true)
  private DataHomeView dataHomeView;

  public void goToRolesPage() throws InterruptedException {
    dataHomeView.clickHomeButton();
    usersView.getUsersPage();
    TimeUnit.SECONDS.sleep(1);
    rolesView.GoToRolesPage();
  }

  public void GoToUsersPage() throws InterruptedException {
    rolesView.GoToUsersPage();
    TimeUnit.SECONDS.sleep(1);
  }

  public void clickPlusButton() throws InterruptedException {
    rolesView.clickPlusButton();
  }

  public void createRoleButton() throws InterruptedException {
    rolesView.createRoleButton();
  }

  public boolean createRoleButtonIsEnabled() throws InterruptedException {
    return rolesView.createRoleButtonIsEnabled();
  }

  public void selectAllButton() throws InterruptedException {
    rolesView.selectAllButton();
  }

  public void clearAllButton() throws InterruptedException {
    rolesView.clearAllButton();
  }

  public boolean selectAllButtonIsEnabled() throws InterruptedException {
    return rolesView.selectAllButtonIsEnabled();
  }

  public boolean clearAllButtonIsEnabled() throws InterruptedException {
    return rolesView.clearAllButtonIsEnabled();
  }

  public boolean verifyAllCheckboxSelected() throws InterruptedException {
    return rolesView.verifyAllCheckboxSelected();
  }

  public boolean verifyNoCheckboxSelected() throws InterruptedException {
    return rolesView.verifyNoCheckboxSelected();
  }

  public void enterRoleName(String roleName) throws InterruptedException {
    rolesView.enterRoleName(roleName);
  }

  public void removeRoleName() throws InterruptedException {
    rolesView.removeRoleName();
  }

  public void enterDescription(String description) throws InterruptedException {
    rolesView.enterDescription(description);
  }

  public String getSuccessMessage() {
    return rolesView.getSuccessMessage();
  }

  public void clickToggleIcon(String permissionType) throws InterruptedException {
    rolesView.clickToggleIcon(permissionType);
  }

  public void verifyErrorValidation_RoleName(String expectedErrorMsg) throws InterruptedException {
    rolesView.verifyErrorValidation_RoleName(expectedErrorMsg);
  }

  public Integer getdescriptionTextCount() {
    return rolesView.getdescriptionTextCount();
  }

  public void radioBtnOptions_permission(String radioBtnOptionName) throws InterruptedException {
    rolesView.radioBtnOptions_permission(radioBtnOptionName);
  }

  public void checkboxOptions_permission(String checkboxOptionName) throws InterruptedException {
    rolesView.checkboxOptions_permission(checkboxOptionName);
  }

  public void unCheckboxOptions_permission(String checkboxOptionName) throws InterruptedException {
    rolesView.unCheckboxOptions_permission(checkboxOptionName);
  }

  public void verifyRoleAddedinTable(String roleName) {
    rolesView.verifyRoleAddedinTable(roleName);
  }

  public boolean createRoleWindow() throws InterruptedException {
    return rolesView.createRoleWindow();
  }

  public void clickEditRoleButton(String role) {
    rolesView.clickEditRoleButton(role);
  }

  public void updateRoleName(String role) {
    rolesView.updateRoleName(role);
  }

  public void clickSaveBtn() {
    rolesView.clickSaveBtn();
  }

  public boolean saveButtonIsEnabled() throws InterruptedException {
    return rolesView.saveButtonIsEnabled();
  }

  public void clickPermission(String permissionType) throws InterruptedException {
    rolesView.clickPermission(permissionType);
  }

  public void IsRadioButtonSelected() {
    rolesView.IsRadioButtonSelected();
  }

  public void verifyColumnHeaders() {
    Assert.assertTrue(rolesView.verifyColumnHeaders());
  }

  public void rolesCountfromTable() {
    rolesView.rolesCountfromTable();
  }

  public void rolesCountFromFooter() {
    rolesView.rolesCountFromFooter();
  }

  public void verifyLongDescriptionWithEllipsis() {
    rolesView.getLongDescriptionWithEllipsis();
  }

  public void getDescriptionTextOnTooltip() {
    rolesView.getDescriptionTextOnTooltip();
  }

  public void sortArrowButton(String fieldName) {
    rolesView.sortArrowButton(fieldName);
  }

  public void verifySortRoleName() {
    Assert.assertTrue(rolesView.verifySortRoleName());
  }

  public void clickViewBtn_administrator(String roleName) {
    rolesView.clickViewBtn_administrator(roleName);
  }

  public void descriptionFieldIsDisabled() {
    rolesView.descriptionFieldIsDisabled();
  }

  public void roleNameFieldIsDisabled() {
    rolesView.roleNameFieldIsDisabled();
  }

  public boolean permissionsIsDisabled() throws InterruptedException {
    return rolesView.permissionsIsDisabled();
  }

  public void deleteButtonIsDisabled(String role) {
    rolesView.deleteRoleButtonIsDisabled(role);
  }

  public void filterButton() {
    rolesView.filterButton();
  }

  public void EnterText_RoleNameSearchBox(String textToSearch) {
    rolesView.EnterText_RoleNameSearchBox(textToSearch);
  }

  public void verifyFilterRoleName(String searchText) {
    rolesView.verifyFilterRoleName(searchText);
  }

  public void EnterText_DescriptionSearchBox(String textToSearch) {
    rolesView.EnterText_DescriptionSearchBox(textToSearch);
  }

  public void verifyFilterDescription(String searchText) {
    rolesView.verifyFilterDescription(searchText);
  }
    public void clickCloseSearchBox() {
    rolesView.clickCloseSearchBox();
  }

  public void clickDeleteRoleButton(String role) {
    rolesView.clickDeleteRoleButton(role);
  }

  public void deleteRoleConfirmation() {
    rolesView.clickDeleteButton();
  }

  public String getRefErrorMessage() {
    return rolesView.getRefErrorMessage();
  }

  public void clickRefErrorCloseButton() {
    rolesView.clickRefErrorCloseButton();
  }

  public void goToRolesPageFromUserPage() throws InterruptedException {
    TimeUnit.SECONDS.sleep(1);
    rolesView.GoToRolesPage();
  }

  public void BackToUsersLink() {
    rolesView.BackToUsersLink();
  }

  public void verifyRolePageAccess() {
    rolesView.verifyRolePageAccess();
  }

  public void closeNewUserRoleForm() {
    rolesView.closeNewUserRoleForm();
  }

  public void turnOffAllPersmisson() throws InterruptedException {
    rolesView.trunOffAllPermisson();
  }
}
