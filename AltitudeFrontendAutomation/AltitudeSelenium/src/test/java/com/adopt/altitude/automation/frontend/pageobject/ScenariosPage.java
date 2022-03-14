package com.adopt.altitude.automation.frontend.pageobject;

import com.adopt.altitude.automation.frontend.pageobject.view.DataHomeView;
import com.adopt.altitude.automation.frontend.pageobject.view.ScenariosView;
import org.junit.Assert;
import org.openqa.selenium.WebElement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ScenariosPage extends AbstractPage {

   @Autowired
   @Lazy(true)
   private ScenariosView scenariosView;

  @Autowired
  @Lazy(true)
  private DataHomeView dataHomeView;

   public String getPageTitle() {
      return scenariosView.getPageTitleText();
   }

   public void openCreateByMenu() {
      scenariosView.clickCreatedByMenu();
   }

   public void SelectFilter(String item) {
      scenariosView.clickOnFilterByItem(item);
   }

   public List<String> getCreatedByItems() {
      return scenariosView.getCreatedByItems();
   }

   public List<String> getScenariosFromTable(String column) {
      List<Scenario> scenarios = scenariosView.getTableRows();
      Function<? super Scenario, ? extends String> function;

      switch (column) {
         case "Created By":
            function = Scenario::getCreatedBy;
            break;
         case "Name":
            function = Scenario::getName;
            break;
         case "Planning Period":
            function = Scenario::getPlanningPeriod;
            break;
         case "Last Opened":
            function = Scenario::getLastOpened;
            break;
         default:
            function = null;
      }

      return scenarios.stream().map(function).collect(Collectors.toList());
   }

   @Override
   public boolean isPageDisplayed() {
      return scenariosView.isDisplayedCheck();
   }

   public void openHamburgerMenu() {
      scenariosView.clickHamburgerButton();
   }

	public void openUserAdministrationItem() {
		scenariosView.clickUserAdministrationItem();
	}

	public void openAddScenarioScreen() throws InterruptedException {
	   scenariosView.clickAddScenarioButton();
	}

	public void selectTemplate(String templateName) {
	   scenariosView.clickOnTemplate(templateName);
	}

	public void enterScenarioName(String scenarioName) {
	   scenariosView.setScenarioName(scenarioName);
	}

	public void enterNewScenarioName(String scenarioName) {
      scenariosView.setScenarioNameInDrawer(scenarioName);
   }

	public void saveScenario() {
	   scenariosView.clickOnSaveScenarioButton();
	}

	public void setStartDate(String startDate) {
	   scenariosView.selectStartDate(startDate);
	}

	public void setDuration(String duration) {
	   scenariosView.setDuration(duration);
	}

	public String getDurationErrorMessage() {
	   return scenariosView.getDurationErrorMessage();
	}

  public void goToScenarioPage() {
    dataHomeView.clickHomeButton();
    scenariosView.getScenarioPage();
  }

  public void goToTemplatePage() {
    dataHomeView.clickHomeButton();
    scenariosView.getTemplatePage();
  }

  public String getCurrentReference(String referenceData) {
    return scenariosView.getCurrentReference(referenceData);
  }

   public void cancelButton() {
    scenariosView.clickCancelButton();
  }

	public String getDefaultStartDate() {
	   return scenariosView.getStartDate();
	}

	public String getDatesPeriod() {
	   return scenariosView.getDatesPeriod();
	}

	public void openOptionsMenu(String scenarioName) throws InterruptedException {
	   scenariosView.clickOptionsButton(scenarioName);
	}

  public void openScenario(String scenarioName) throws InterruptedException {
    scenariosView.clickOptionsButton(scenarioName);
  }

	public void deleteScenario() {
	   scenariosView.clickDeleteOption();
	}

	public void confirmDelete() {
	   scenariosView.clickConfirmDeleteButton();
	}

	public void openInfoForm() {
	   scenariosView.clickGetInfoOption();
	}

  public void verifyGetInfoOption() {
    scenariosView.verifyGetInfoOption();
  }

  public void verifyScenarioOptionDisabled(String scenarioOptions) {
    scenariosView.verifyScenarioOptionDisabled(scenarioOptions);
  }

  public void verifyScenarioOptionEnabled(String scenarioOptions) throws InterruptedException {
    scenariosView.verifyScenarioOptionEnabled(scenarioOptions);
  }

	public void openSaveAsTemplateForm() {
      scenariosView.clickSaveAsTemplate();
   }

	public void openTemplatesItem() {
     scenariosView.clickTemplatesItem();
  }

   public void openDataItem(String scenarioName)throws InterruptedException {
      scenariosView.openDataItem(scenarioName);
   }
  public void openDataItemViewOnly(String scenarioName) throws InterruptedException {
    scenariosView.openDataItemViewOnly(scenarioName);
  }

   public String getSnackbarMessage() {
      return scenariosView.getSnackbarText();
   }

   public void openUserMenu() {
     scenariosView.clickUserMenu();
   }

   public void signOut() {
     scenariosView.clickSignOut();
   }

   public void validateReadOnlyMode(String scenarioName) throws InterruptedException {
     Assert.assertEquals("ReadOnly", scenariosView.getScenarioMode(scenarioName));
   }

   public boolean isReadOnlyInfoDialogDisplayed() {
    return scenariosView.isReadOnlyInfoDialogDisplayed();
   }

   public void openScenarioReadOnlyMode() {
     scenariosView.clickOpenScenarioInReadOnlyMode();
   }

   public void openPairingsItem() {
     scenariosView.clickPairingItem();
   }

   public void openSolverItem() {
     scenariosView.clickSolverItem();
   }


  public void clickHamburgerMenu() {
    dataHomeView.clickHomeButton();
  }

  public void verifyHamburgerDrawer(String hamburgerDetails) throws InterruptedException {
    dataHomeView.verifyHamburgerDrawer(hamburgerDetails);
  }

  public void verifyHamburgerMenuNotPresent(String hamburgerDetails)  {
    Assert.assertTrue(dataHomeView.verifyHamburgerMenuNotPresent(hamburgerDetails));
  }
  public void checkScenarioNameList() {
    scenariosView.checkScenarioNameList();
  }

  public void checkScenarioStatus() {
    scenariosView.checkScenarioStatus();
  }

  public void checkScenarioStatusReadOnly() {
    scenariosView.checkScenarioStatusReadOnly();
  }

  public void updateDescription(String newDescription) {
    scenariosView.updateDescription(newDescription);
  }

  public void verifyEditScenarioNameDisabled() {
    scenariosView.verifyEditScenarioNameDisabled();
  }

  public void verifyEditScenarioDescriptionDisabled() {
    scenariosView.verifyEditScenarioDescriptionDisabled();
  }

  public void clickOnFilterCreatedByAnyone() throws InterruptedException {
    TimeUnit.SECONDS.sleep(2);
    scenariosView.clickCreatedByMenu();
    TimeUnit.SECONDS.sleep(2);
    scenariosView.clickOnFilterByItem("Anyone");
    TimeUnit.SECONDS.sleep(2);
  }

  public WebElement getScenarioHeaderTitle() {
    return scenariosView.getScenarioHeaderTitle();
  }

}
