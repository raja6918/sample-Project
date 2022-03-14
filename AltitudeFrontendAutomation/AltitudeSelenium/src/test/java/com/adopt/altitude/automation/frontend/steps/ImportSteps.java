package com.adopt.altitude.automation.frontend.steps;

import com.adopt.altitude.automation.frontend.validations.ImportValidation;
import cucumber.api.java8.En;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.concurrent.TimeUnit;

public class ImportSteps extends AbstractSteps implements En {

  @Autowired
  private ImportValidation validator;

	private final static Logger LOGGER = LogManager.getLogger(ImportSteps.class);

	public ImportSteps() {
		Given("^I'm in the data home page for scenario \"(.*)\"$", (String scenarioName) -> {
      scenariosPage.clickOnFilterCreatedByAnyone();
			scenariosPage.openDataItem(scenarioName);
		});
   Then("^I click button to Import and handle alert summary$", () -> {
     TimeUnit.SECONDS.sleep(20);
      dataHomePage.alertSummaryHandling();
    });

		Then("^The Import Data button is Active$", () -> {
			dataHomePage.isImportDataButtonEnabled();
		});

    Then("^The Import Data button is Active now$", () -> {
      dataHomePage.isImportDataButtonEnabled();
      TimeUnit.SECONDS.sleep(2);
    });

		When("^I click on Import Data button$", () -> {
		  System.out.println("I clicked on The Import Data Button the Data home page ..");
			dataHomePage.openImportDataScreen();
		});

		Then("^The initial Import Screen is displayed$", () -> {
			LOGGER.info("Import Data screen is displayed");
		});

		When("^I add the bin with name \"(.*)\"$", (String name) -> {
			dataHomePage.clickConnect(name);
		});

		Then("^the import drop files area is displayed$", () -> {
			dataHomePage.validateDropFilesDialog();
		});

		When("^I upload the file \"(.*)\" at location \"(.*)\" to the import window$",
				(String filePath, String location) -> {
					dataHomePage.clickUploadFile();
					dataHomePage.uploadFile(filePath);
				});

		When("^^I upload the file \"([^\"]*)\" to the import window$",
				(String filePath) -> {
					//dataHomePage.clickUploadFile();
					dataHomePage.uploadFile(filePath);
				});

		Then("^The card for file \"(.*)\" is displayed$", (String fileName) -> {
			dataHomePage.checkCardFileName(fileName);
		});

		Then("^The import button is enabled$", () -> {
			dataHomePage.isImportButtonEnabled();
		});

		And("^I create a file \"(.*)\" on temp directory$", (String fileName) -> {
			dataHomePage.createFileOS(fileName);
		});

		And("^I create a warning file \"(.*)\" on temp directory$",(String fileName) -> {
			dataHomePage.createWarningFile(fileName);
		});

    And("^I create a error file \"(.*)\" on temp directory$",(String fileName) -> {
      dataHomePage.createWarningFile(fileName);
    });

		When("^I click button to Import Data$", () -> {
			dataHomePage.clickImportButton();
		});

		And("The error tooltip icon is displayed for \"(.*)\" card$", (String fileName) -> {
			dataHomePage.isErrorIconDisplayed(fileName);
		});

		And("^The import button is disabled$", () -> {
			dataHomePage.isImportButtonDisabled();
		});

		Then("^the warning window is displayed$",() ->{
			dataHomePage.waitWarningWindow();
			dataHomePage.validateWarningWindow();
		});
    Then("^I validate the Data Home Alert$", () -> {
      dataHomePage.validateDataHomeAlert();
    });
    Then("^I click button to Import and see alert summary$", () -> {
      dataHomePage.clickImportButton();
      TimeUnit.SECONDS.sleep(30);
    });

    Then("^I click button to Import$", () -> {
      dataHomePage.clickImportButtonforError();
      TimeUnit.SECONDS.sleep(40);
    });

    And("^I wait for the import process to complete$", () -> {
      dataHomePage.waitForError();
      TimeUnit.SECONDS.sleep(15);
    });

    Then("^I get pop up for Import Failed saying \"([^\"]*)\"$", (String expectedRefErrorMessage) -> {
      TimeUnit.SECONDS.sleep(1);
      String actualRefErrorMessage = dataHomePage.getRefErrorMessage();
      validator.verifyText(expectedRefErrorMessage, actualRefErrorMessage);
      TimeUnit.SECONDS.sleep(2);
      TimeUnit.SECONDS.sleep(2);
    });

    And("^I click on close button for pop up$", () -> {
      dataHomePage.clickRefErrorCloseButton();
      TimeUnit.SECONDS.sleep(2);
    });

    Then("^I see summary of Alert$", () -> {
      dataHomePage.validateDataHomeAlert();
    });
    Then("^I select the Proper FileFormat$", () -> {
      dataHomePage.selectProperFileFormat();
    });
    And("^I create a file with name \"([^\"]*)\" on temp directory$", (String fileName) -> {
      System.out.println("Creating the file in the temp directory --->"+fileName);
      dataHomePage.createWarningFile(fileName);
    });
    When("^I upload the file \"([^\"]*)\" to the import window.$", (String filePath) -> {
      TimeUnit.SECONDS.sleep(2);
       //dataHomePage.clickUploadFile();
       TimeUnit.SECONDS.sleep(2);
       dataHomePage.uploadFile(filePath);
      TimeUnit.SECONDS.sleep(1);
      dataHomePage.selectProperFileFormat();
    });
    And("^I add bin with name \"([^\"]*)\" and I uploaded the file \"([^\"]*)\"$", (String binName, String fileName) -> {

    });
    And("^I upload the Files \"([^\"]*)\" and \"([^\"]*)\" to the import windows$", (String fileName1, String fileName2) -> {
     // dataHomePage.clickUploadFile();
      TimeUnit.SECONDS.sleep(2);
      dataHomePage.uploadFile(fileName1);
      System.out.println("Uploading the file 1  --->"+fileName1);
      TimeUnit.SECONDS.sleep(10);
      //dataHomePage.clickUploadFile();
      TimeUnit.SECONDS.sleep(3);
      dataHomePage.uploadFile(fileName2);
      TimeUnit.SECONDS.sleep(10);
      System.out.println("Uploading the file 2 "+fileName2);
      dataHomePage.selectProperFileFormat();
      System.out.println("I select the proper fromat ");
    });
    And("^I wait until files uploaded successfully$", () -> {
      dataHomePage.isFilesUploaded();
    });

  }
}
