package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.RolesPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
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

public class RolesView  extends AbstractPageView<RolesPageContainer> {

  public static int rolesTableCount;


  public static String longDescription;

  public static String longDescriptionTooltip ="abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy";;

  public String ExpectedLongDescription_Ellipsis = "abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefg...";

  private static final Logger LOGGER = LogManager.getLogger(UsersView.class);

  @PostConstruct
  public void init() throws Exception {
    container = PageFactory.initElements(driver.getWebDriver(), RolesPageContainer.class);
  }

  @Override
  public boolean isDisplayedCheck() {
    return container.getPairingPageHeader() != null;
  }

  public void GoToRolesPage() {
    WebElement rolesClick = container.GoToRolesPage();
    rolesClick.click();
  }

  public void GoToUsersPage() {
    WebElement usersClick = container.GoToUsersPage();
    usersClick.click();
  }

  public void clickPlusButton() throws InterruptedException {
    container.clickPlusButton().click();
  }

  public void createRoleButton() throws InterruptedException {
    container.createRoleButton().click();
  }

  public boolean createRoleButtonIsEnabled() throws InterruptedException {
    return container.createRoleButton().isEnabled();
  }

  public void selectAllButton() throws InterruptedException {
    container.selectAllButton().click();
  }

  public void clearAllButton() throws InterruptedException {
    driver.scrollToElement(container.clearAllButton());
    container.clearAllButton().click();
  }

  public boolean selectAllButtonIsEnabled() throws InterruptedException {
    return container.selectAllButton().isEnabled();
  }

  public boolean clearAllButtonIsEnabled() throws InterruptedException {
    return container.clearAllButton().isEnabled();
  }

  public boolean verifyAllCheckboxSelected() throws InterruptedException {
    List<WebElement> checkboxOptionsList = container.getAllCheckboxList();
    boolean selectedAllOptions = true;
    for (WebElement item : checkboxOptionsList) {
      if (!item.isSelected()) {
        selectedAllOptions = false;
        break;
      }
    }
    return selectedAllOptions;
  }

  public boolean verifyNoCheckboxSelected() throws InterruptedException {
    List<WebElement> checkboxOptionsList = container.getAllCheckboxList();
    boolean selectedAllOptions = false;
    for (int i = 1; i < checkboxOptionsList.size(); i++) {
      if (checkboxOptionsList.get(i).isSelected()) {
        selectedAllOptions = true;
        break;
      }
    }
    return selectedAllOptions;
  }

  public void enterRoleName(String roleName) {
    clearAndSetText((container.roleNameTextBox()), roleName);
  }

  public void removeRoleName() {
    clearTextWithBackspace(container.roleNameTextBox());
  }

  public void enterDescription(String description) {
    clearAndSetText((container.descriptionTextBox()), description);
   // longDescription = description.substring(0, 250);
  }

  public void verifyErrorValidation_RoleName(String errMsg_Expected) {
    String actual_errMsg = driver.getWebDriver().findElement(By.xpath(String.format(container.validationErrMsg_RoleName, errMsg_Expected))).getText();
    Assert.assertEquals(actual_errMsg, errMsg_Expected);
  }

  public void clickToggleIcon(String permissionItem) {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.toggleIcon, permissionItem))));
    driver.getWebDriver().findElement(By.xpath(String.format(container.toggleIcon, permissionItem))).click();
  }

  public String getSuccessMessage() {
    WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 15);
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='notification-area']//div[@class='msg']")));
    return container.getSuccessMessage().getText();
  }

  public Integer getdescriptionTextCount() {

    Actions action = new Actions(driver.getWebDriver());
    action.moveToElement(container.moveToDescription()).perform();

    String text = "abcdefghijklmno";
    String getDescription = driver.getWebDriver().findElement(By.xpath(String.format(container.tooltip_description, text))).getText();

    Integer descriptionTextCount = getDescription.length();
    return descriptionTextCount;
  }

  public void radioBtnOptions_permission(String radioBtnOptionName) {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.radioBtnOptions_permission, radioBtnOptionName))));
    driver.getWebDriver().findElement(By.xpath(String.format(container.radioBtnOptions_permission, radioBtnOptionName))).click();
  }

  public void checkboxOptions_permission(String checkboxOptionsName) {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))));
   if(!(driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))).isSelected())) {
     LOGGER.info(checkboxOptionsName+ " is not selected" );
     driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))).click();
   }
   }

  public void unCheckboxOptions_permission(String checkboxOptionsName) throws InterruptedException {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))));
    if(driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))).isSelected()) {
      LOGGER.info(checkboxOptionsName+ " is selected" );
      driver.getWebDriver().findElement(By.xpath(String.format(container.checkboxOptions_permission, checkboxOptionsName))).click();
    }
    TimeUnit.SECONDS.sleep((long) 0.5);
  }

  public void verifyRoleAddedinTable(String roleName) {
    //driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.roleAdded_Table, roleName))));
    List<String> roleNameList = new ArrayList<String>();
    rolesTableCount = container.getRoleNameList().size();
    for (int i = 0; i < rolesTableCount; i++) {
      driver.scrollToElement(container.getRoleNameList().get(i));
      roleNameList.add(container.getRoleNameList().get(i).getText());
    }
    //String roleFromTable = driver.getWebDriver().findElement(By.xpath(String.format(container.roleAdded_Table, roleName))).getText();
   // Assert.assertEquals(roleFromTable, roleName);
    Assert.assertTrue(roleNameList.contains(roleName));
  }

  public boolean createRoleWindow() throws InterruptedException {
    if (driver.getWebDriver().findElements(By.xpath("//div[contains(@class,'MuiDialogContent-root Form')]")).size() == 0)
      return true;
    else
      return false;
  }

  public void clickEditRoleButton(String role) {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), (driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_Role, role)))));
    WebElement editButton = driver.getWebDriver().findElement(By.xpath(String.format(container.EDIT_Role, role)));
    driver.scrollToElement(editButton);
    editButton.click();
  }

  public void clickSaveBtn() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.saveBtn());
    container.saveBtn().click();
    WebDriverWait wait = new WebDriverWait(driver.getWebDriver(), 15);
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//*[@id='notification-area']//div[@class='msg']")));
  }

  public boolean saveButtonIsEnabled() throws InterruptedException {
    if ((container.saveBtn().isEnabled()))
      return true;
    else
      return false;
  }

  public void updateRoleName(String roleName) {
    clearAndSetText((container.roleNameTextBox()), roleName);
  }

  public void clickPermission(String permissionType) throws InterruptedException {
    driver.getWebDriver().findElement(By.xpath(String.format(container.clickPermission, permissionType))).click();
    TimeUnit.SECONDS.sleep(1);
  }

  public void IsRadioButtonSelected() {
    boolean val = driver.getWebDriver().findElement(By.xpath(String.format(container.radioBtnOptions_permission, "View only"))).isSelected();
    Assert.assertTrue(val);
  }

  public boolean verifyColumnHeaders() {
    if ((container.verifyColumnHeaders().get(1).getText()).equals("Role name") & (container.verifyColumnHeaders().get(2).getText()).equals("Description")) {
      return true;
    } else
      return false;
  }

  public void rolesCountfromTable() {
    rolesTableCount = container.getRoleNameList().size();
  }

  public void rolesCountFromFooter() {
    String[] roleCountText = container.RolesCountFromFooter().getText().split(" ");
    Assert.assertEquals(Integer.parseInt(roleCountText[0]), rolesTableCount);
  }

  public void getLongDescriptionWithEllipsis() {
    String longDescription_Ellipsis_Actual = container.moveToDescription().getText();
    Assert.assertEquals(ExpectedLongDescription_Ellipsis, longDescription_Ellipsis_Actual);
  }

  public void getDescriptionTextOnTooltip() {

    Actions action = new Actions(driver.getWebDriver());
    action.moveToElement(container.moveToDescription()).perform();

    String text = "abcdefghijklmno";
    String getDescriptionText_Actual = driver.getWebDriver().findElement(By.xpath(String.format(container.tooltip_description, text))).getText();
    Assert.assertEquals(longDescriptionTooltip, getDescriptionText_Actual);
  }

  public void sortArrowButton(String fieldName) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.sortArrowButton, fieldName))).click();
    driver.getWebDriver().findElement(By.xpath(String.format(container.sortArrowButton, fieldName))).click();
  }

  public boolean verifySortRoleName() {
    List<String> roleNameList = new ArrayList<String>();
    rolesTableCount = container.getRoleNameList().size();
    for (int i = 0; i < rolesTableCount; i++) {
      driver.scrollToElement(container.getRoleNameList().get(i));
      roleNameList.add(container.getRoleNameList().get(i).getText());
    }
    List copy = new ArrayList(roleNameList);
    Collections.sort(copy, String.CASE_INSENSITIVE_ORDER);
    return copy.equals(roleNameList);
  }

  public void clickViewBtn_administrator(String roleName) {
    driver.getWebDriver().findElement(By.xpath(String.format(container.View_Role, roleName))).click();
  }

  public void roleNameFieldIsDisabled() {
    Assert.assertFalse(container.roleNameTextBox().isEnabled());
  }

  public void descriptionFieldIsDisabled() {
    Assert.assertFalse(container.descriptionTextBox().isEnabled());
  }

  public boolean permissionsIsDisabled() {
    List<WebElement> permissionList = container.getPermissionList();
    boolean selectedAllOptions = true;
    for (WebElement item : permissionList) {
      if (item.isEnabled()) {
        selectedAllOptions = false;
        break;
      }
    }
    return selectedAllOptions;
  }

  public void clickDeleteRoleButton(String role) {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), (driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_Role, role)))));
    WebElement deleteButton = driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_Role, role)));
    driver.scrollToElement(deleteButton);
    deleteButton.click();
  }

  public void deleteRoleButtonIsDisabled(String role) {
    driver.scrollToElement(driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_Role_Admin, role))));
    String IsDisabled=driver.getWebDriver().findElement(By.xpath(String.format(container.DELETE_Role_Admin, role))).getAttribute("aria-hidden");
    Assert.assertEquals(IsDisabled,"true");
  }

  public void filterButton() {
    container.clickFilterButton().click();
  }

  public void EnterText_RoleNameSearchBox(String textToSearch) {
    container.searchBox().get(0).sendKeys(textToSearch);
  }

  public boolean verifyFilterRoleName(String searchText) {
    List<String> roleList = new ArrayList<String>();
    rolesTableCount=container.getRoleNameList().size();
    for(int i=0;i<rolesTableCount;i++){
      driver.scrollToElement(container.getRoleNameList().get(i));
      roleList.add(container.getRoleNameList().get(i).getText());
    }
    for(int i=0;i<rolesTableCount;i++) {
      if (!(roleList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  public void EnterText_DescriptionSearchBox(String textToSearch) {
    container.searchBox().get(0).sendKeys(textToSearch);
  }

  public boolean verifyFilterDescription(String searchText) {
    List<String> descriptionList = new ArrayList<String>();
    rolesTableCount=container.getDescriptionList().size();
    for(int i=0;i<rolesTableCount;i++){
      driver.scrollToElement(container.getDescriptionList().get(i));
      descriptionList.add(container.getDescriptionList().get(i).getText());
    }
    for(int i=0;i<rolesTableCount;i++) {
      if (!(descriptionList.get(i)).contains(searchText))
        return false;
      break;
    }
    return true;
  }

  public void clickCloseSearchBox() {
    container.clickCloseSearchBox().click();
  }

  public void BackToUsersLink() {
    WebElement back_to_userClick = container.BackToUsersLink();
    back_to_userClick.click();
  }

  public void clickDeleteButton() {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getDeleteButton());
    driver.clickAction(container.getDeleteButton());
  }

  public String getRefErrorMessage() {
    return container.getRefErrorMessage().getText();
  }

  public void clickRefErrorCloseButton()
  {
    container.clickCloseButton().click();
  }

    public void verifyRolePageAccess() {
      boolean isEnabled = "none".equals(container.GoToRolesPage().getCssValue("pointer-events"));
      Assert.assertTrue(isEnabled);
    }

  public void closeNewUserRoleForm() {
    container.getCloseNewUserForm().click();
  }

  public void trunOffAllPermisson() throws InterruptedException {
    List<WebElement> checkedStatus = driver.getWebDriver().findElements(By.xpath("//form//*[contains(@class,'NewUserRole__ResourceDiv')]/child::div/div/div/span/descendant::input"));
    List<WebElement> isChecked = driver.getWebDriver().findElements(By.xpath("//form//*[contains(@class,'NewUserRole__ResourceDiv')]/child::div/div/div/span/span[@aria-disabled='false']"));

    int size = isChecked.size();
    for (int i = 0; i < size; i++) {
      String status = isChecked.get(i).getAttribute("class");
      if (status.contains("checked")) {
        checkedStatus.get(i).click();
        TimeUnit.SECONDS.sleep(2);
      } else {
        System.out.print("already Turn off ");
      }
    }

    }
}
