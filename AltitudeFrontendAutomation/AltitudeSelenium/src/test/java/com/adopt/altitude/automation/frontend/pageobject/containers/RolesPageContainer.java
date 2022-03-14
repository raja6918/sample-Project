package com.adopt.altitude.automation.frontend.pageobject.containers;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;

public class RolesPageContainer extends PageContainer {

  @FindBy(xpath = "//h2[text() = 'Pairings']")
  private WebElement pairingPageHeader;

  public WebElement getPairingPageHeader() { return pairingPageHeader; }

  @FindBy(xpath = "//a[contains(@href, '/users/roles')]")
  private WebElement goToRolesPage;

  public WebElement GoToRolesPage() { return goToRolesPage; }

  @FindBy(xpath = "//button[@aria-label='add']")
  private WebElement plusButton;

  public WebElement clickPlusButton() { return plusButton; }

  @FindBy(xpath = "//span[text()='CREATE NEW ROLE']/parent::button")
  private WebElement createRoleBtn;

  public WebElement createRoleButton() { return createRoleBtn; }

  @FindBy(xpath = "//span[text()='Select all']/parent::button")
  private WebElement selectAllButton;

  public WebElement selectAllButton() { return selectAllButton; }

  @FindBy(xpath = "//span[text()='Clear all']/parent::button")
  private WebElement clearAllButton;

  public WebElement clearAllButton() { return clearAllButton; }

  @FindBy(xpath = "//input[@id='name']")
  private WebElement roleName;

  public WebElement roleNameTextBox() { return roleName; }

  @FindBy(xpath = "//textarea[@id='description']")
  private WebElement description;

  public WebElement descriptionTextBox() { return description; }

  @FindBy(xpath = "//div[contains(@class,'MuiPaper-root MuiDialog-paper')]")
  private List<WebElement> createRoleWindow;

  public List<WebElement> createRoleWindow() { return createRoleWindow; }

  @FindBy(xpath = "//table[@class='MuiTable-root']/descendant::td/child::div[contains(text(),'abcdefgh')]")
//div[contains(text(),'abcdefgh')]/parent::td
  private WebElement moveToDescription;

  public WebElement moveToDescription() { return moveToDescription; }

  @FindBy(xpath = "//*[@id='notification-area']//div[@class='msg']")
  private WebElement successMessage;

  public WebElement getSuccessMessage() {return successMessage; }

  @FindBy(xpath = "//div[contains(@class,'Access__OptionsContent')]/div/div[@class='MuiFormGroup-root']/div/div/div[@class='MuiFormGroup-root']/label/span/span/input")
  private List<WebElement> allCheckboxList;

  public List<WebElement> getAllCheckboxList() {return allCheckboxList; }

  @FindBy(xpath = "//button[@type='submit']")
  private WebElement saveBtn;

  public WebElement saveBtn() {return saveBtn; }

  @FindBy(xpath = "//tr[contains(@class,'MuiTableRow-root MuiTableRow-head')]/th")
  private List<WebElement> verifyColumnHeaders;

  public List<WebElement> verifyColumnHeaders() { return verifyColumnHeaders; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[2]")
  private List<WebElement> roleNameList;

  public List<WebElement> getRoleNameList() { return roleNameList; }

  @FindBy(xpath = "//tr[@class='MuiTableRow-root MuiTableRow MuiTableRow-hover hover']/td[2]")
  private List<WebElement> getDescriptionList;

  public List<WebElement> getDescriptionList() { return getDescriptionList; }

  @FindBy(xpath = "//div[contains(@class,'NewUserRole__PermissionCard')]/div//span[contains(@class,'MuiIconButton-label')]/input")
  private List<WebElement> permissionList;

  public List<WebElement> getPermissionList() { return permissionList; }

  @FindBy(xpath = "//p[contains(@class,'TableFooter__FooterText')]")
  private WebElement RolesCountFromFooter;

  public WebElement RolesCountFromFooter() { return RolesCountFromFooter; }

  @FindBy(xpath = "//span[text()='filter_list']/parent::span/parent::button")
  private WebElement filterButton;

  public WebElement clickFilterButton() { return filterButton; }

  @FindBy(xpath = "//tr[contains(@class,'MuiTableRow-root filters')]/th/div/div/input")
  private List<WebElement> searchBox;

  public List<WebElement> searchBox() { return searchBox; }

  @FindBy(xpath = "//span[text()='highlight_off']/parent::span/parent::button")
  private WebElement closeSearchBox;

  @FindBy(xpath = "//a[contains(@href, '/users')]")
  private WebElement goToUsersPage;

  public WebElement GoToUsersPage() { return goToUsersPage; }

  public WebElement clickCloseSearchBox() { return closeSearchBox; }

  @FindBy(xpath = "//a[contains(@href, '/users')]")
  private WebElement BackToUsersLink;

  public WebElement BackToUsersLink() { return BackToUsersLink; }

  @FindBy(xpath = "//span[text()='DELETE']")
  private WebElement deleteButton;

  public WebElement getDeleteButton() { return deleteButton; }

  @FindBy(xpath = "//div[contains(@class,'MuiDialogTitle-root')]/following-sibling::div[1]")
  private WebElement refErrorMessage;

  public WebElement getRefErrorMessage() { return refErrorMessage; }

  @FindBy(xpath = "//span[text()='CLOSE']/parent::button")
  private WebElement refErrorCloseButton;

  public WebElement clickCloseButton(){ return refErrorCloseButton; }


  public String sortArrowButton ="//tr[contains(@class,'MuiTableRow-root MuiTableRow-head')]/th/span[text()='%s']";

  public String validationErrMsg_RoleName ="//p[contains(text(),'%s')]";

  public String clickPermission ="//p[text()='%s']/parent::div";

  public String radioBtnOptions_permission ="//span[text()='%s']/preceding-sibling::span/span/input";

  public String checkboxOptions_permission ="//span[text()='%s']/preceding-sibling::span/span/input";

  public String toggleIcon ="//p[text()='%s']/parent::div/preceding-sibling::div//span[contains(@class,'MuiIconButton-label')]/input";

  public String tooltip_description="//*[@class='tippy-popper']/descendant::p[contains(text(),'%s')]";
  //div[@class='tippy-tooltip-content']/p[contains(text(),'%s')]
  public String roleAdded_Table ="//td[text()='%s']";

  public String View_Role = "//i[contains(text(),'Administrator')]/parent::td//following-sibling::td/button//span[contains(text(),'info')]";

  public String EDIT_Role = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'edit')]";

  public String DELETE_Role_Admin ="//i/parent::td/following-sibling::td/button//span[contains(text(),'delete')]";

  public String DELETE_Role = "//td[contains(text(),'%s')]/following-sibling::td/button//span[contains(text(),'delete')]";
  @FindBy(xpath = "//*[contains(@class,'Base__CloseButton')]")
  private WebElement closeNewUserForm;

  public WebElement getCloseNewUserForm() {
    return closeNewUserForm;
  }

}
