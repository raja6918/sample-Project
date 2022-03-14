package com.adopt.altitude.automation.frontend.pageobject.view;

import com.adopt.altitude.automation.frontend.pageobject.containers.ImportDataPageContainer;
import com.adopt.altitude.automation.frontend.utils.selenium.CustomConditions;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.concurrent.TimeUnit;


@Component
@Scope("prototype")
public class ImportDataView extends AbstractPageView<ImportDataPageContainer> {

	String tempDir = System.getProperty("java.io.tmpdir");
	String projectPath = System.getProperty("user.dir");
	String FILE_FLIGHT_SUMMARY_ALERT = "Flight_Summary_Alert.ssim";
	String FILE_FLIGHT_SCHEDULE = "flightschedule.ssim";
	String FILE_PAIRING_SUMMARY_ALERT  = "Pairing_Summary_Alert.pairing";
	String FILE_CATASTROPHIC_FILE = "catastrophic_file.pairing";
	String FILE_PAIRING = "pairings.xml";
	String FILE_FLIGHT_BADFORMAT = "flight_badFormat.ssim";
	String FILE_PAIRINGINCOMPLETEDATA ="pairing_IncompleteData.pairing";

	@Value("classpath:features/imports/alert_files/Flight_Summary_Alert.ssim")
	private Resource resourceFlightSummaryAlertSsim;

	@Value("classpath:features/imports/alert_files/flightschedule.ssim")
   private Resource resourceFlightschedule;

	@Value("classpath:features/imports/alert_files/Pairing_Summary_Alert.pairing")
   private Resource resourcePairingSummaryAlert;

  @Value("classpath:features/imports/alert_files/catastrophic_file.pairing")
  private Resource resourceCatastrophic_file;

  @Value("classpath:features/imports/alert_files/pairings.xml")
  private Resource resourcePairings;

  @Value("classpath:features/imports/alert_files/flight_badFormat.ssim")
  private Resource resourceFlight_badFormat;

  @Value("classpath:features/imports/alert_files/pairing_IncompleteData.pairing")
  private Resource resourcePairing_IncompleteData;

	String location;
	String fileName;

	private static String OS = null;

	public static String getOsName() {
		if (OS == null) {
			OS = System.getProperty("os.name");
		}
		return OS;
	}

	public static boolean isWindows() {
		return getOsName().startsWith("Windows");
	}

	public String absuluteProjectPath(String fileName) {
		boolean oSName = getOsName().startsWith("Window");
		String absoluteProjectPath;
		if (oSName == true) {
			absoluteProjectPath = tempDir + fileName;
		} else {
			absoluteProjectPath = tempDir + "/"+ fileName;
		}
		return absoluteProjectPath;
	}

	@PostConstruct
	public void init() throws Exception {
		container = PageFactory.initElements(driver.getWebDriver(), ImportDataPageContainer.class);
	}

	public void clickNewBinRadioButton() {
		container.getNewBinRadioButton().click();
	}

	public void enterBinName(String name) {
		clearAndSetText(container.getBinNameTextfield(), name);
	}

  public void clickConnect() throws InterruptedException {
    container.getConnectButton().click();
    TimeUnit.SECONDS.sleep(3);
    if (isDropZoneDisplayed()) {
      Assert.assertTrue(isDropZoneDisplayed());
    }
   else if (container.getImportDataBinTitle().isDisplayed() || (!container.getDropZone().isDisplayed())) {
      TimeUnit.SECONDS.sleep(1);
      container.getOpRadioButton().click();
      TimeUnit.SECONDS.sleep(1);
      container.getSkipButton().click();
      TimeUnit.SECONDS.sleep(1);
      Assert.assertTrue(isDropZoneDisplayed());
    }
   else{
     TimeUnit.SECONDS.sleep(2);
   }

  }

	public boolean isConnectButtonEnabled() {
		return container.getConnectButton().isEnabled();
	}

	public boolean isDropZoneDisplayed() {
		return isElementVisible(container.getDropZone());
	}

	 public void warningImportWindow() throws Exception{
		 TimeUnit.SECONDS.sleep(45);Thread.sleep(45000);
	     CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getIgnoreButton());
	    try {
	    	 TimeUnit.SECONDS.sleep(1);
	    } catch (InterruptedException e) {
	      e.printStackTrace();
	    }
	  }

  public boolean isWarningWindowDisplayed() {
	    return isElementVisible(container.getWarningWindow());
	     }

	@Override
	public boolean isDisplayedCheck() {
		return !container.getPageTitle().getText().isEmpty();
	}

	public void clickUploadFile() {
		container.getClickHereLink().click();
	}

	public void createNewFileOS(String fileName) {
		String absoluteFilePath = absuluteProjectPath(fileName);
		System.out.println("AbsoluteFilePath Location is -->"+ absoluteFilePath);
		File fileCreated = new File(absoluteFilePath);
		try {
			if (!fileCreated.exists()) {
				fileCreated.createNewFile();
				System.out.println("File is created on the specified Operating system");
			}

		} catch (IOException e) {

		}
	}

  public void createNewWarningFile(String fileName) throws IOException {

    if (getOsName().startsWith("Window")) {
      String resourcesPath = "AltitudeFrontendAutomation/AltitudeSelenium/src/test/resources/features/imports/alert_files/";
      String absoluteFilePath = absuluteProjectPath(fileName);
      System.out.println(("temp directory of the file ..." + absoluteFilePath));
      // temp directory of the file .../tmp/catastrophic_file.pairing
      File originalFile = new File(resourcesPath + fileName);
      originalFile.getAbsolutePath();
      File warningFile = new File(absoluteFilePath);
      System.out.println("tem file locations-->" + warningFile.getAbsolutePath());
      // tem file locations-->/tmp/catastrophic_file.pairing
      String current = new java.io.File(".").getCanonicalPath();
      System.out.println("File location Inside the project-->" + originalFile.getAbsolutePath());
      System.out.println("project directory -->" + current);
      try {
        if (!warningFile.exists()) {
          warningFile = new File(absoluteFilePath);
          System.out.println("Inside the if for warning file ...");
          Files.copy(originalFile.toPath(), warningFile.toPath());
        } else {
          System.out.println("on the temp location file is already available ...");
          Files.copy(originalFile.toPath(), warningFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
          System.out.println("File is Coped from the source location -->"
            + originalFile.toPath()
            + " To the Destination Locations "
            + warningFile.toPath());
        }
      } catch (Exception e) {
        System.out.println("Exception Caught while performing the Copying the file from project location to temp locations ....");
      }
    } else {
      //code for the linux uploading the file and creating on the temp dircetory
    //  String seleniumProjectLocation = "/opt/jenkins-slave/workspace/Altitude_Frontend/AltitudeFrontendAutomation/AltitudeSelenium/src/test/resources/features/imports/alert_files/";
    //  String seleniumProjectLocation = "./Altitude_Frontend/AltitudeFrontendAutomation/AltitudeSelenium/src/test/resources/features/imports/alert_files/";
      String seleniumProjectLocation = "features/imports/alert_files/";
      String absoluteFilePath = absuluteProjectPath(fileName);
      System.out.println(("temp directory of the file in the Linux operating system ..." + absoluteFilePath));
      File originalFile = new File(seleniumProjectLocation + fileName);
      originalFile.getAbsolutePath();
      File warningFile = new File(absoluteFilePath);
      System.out.println("tem file locations-->" + warningFile.getAbsolutePath());
      String current = new java.io.File(".").getCanonicalPath();
      System.out.println("File location Inside the project-->" + originalFile.getAbsolutePath());
      System.out.println("project directory -->" + current);

      InputStream originalInputStream = getResourceBasedOnFileName(fileName).getInputStream();
      try {
        if (!warningFile.exists()) {
          createNewFileOS(fileName);
          System.out.println("Inside the if for warning file ...");
          Files.copy(originalInputStream, warningFile.toPath());
          printFileContent(warningFile);
        } else {
          System.out.println("on the temp location file is already available ...");
          Files.copy(originalInputStream, warningFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
          printFileContent(warningFile);
          System.out.println("File is copied sucessfully to -->" + warningFile.toPath());
        }
      } catch (Exception e) {
        System.out.println("Exception Caught while performing the Copying the file from project location to temp locations ....");
      }
    }
  }

	private void printFileContent(File file) throws IOException {
		String content = new String(Files.readAllBytes(file.toPath()));
		System.out.println("File Content ===>" + content);
	}

  private File getResourceFile(final String fileName) {
    URL url = this.getClass()
      .getClassLoader()
      .getResource(fileName);
    System.out.println("URL is-->"+url);

    if (url == null) {
      throw new IllegalArgumentException(fileName + " is not found 1");
    }

    File file = new File(url.getFile());
    System.out.println("Inside get Resource method -->File absolute path is -->"+file.getAbsolutePath());

    return file;
  }

	public void uploadFile(String fileName) throws Exception {
		System.out.println("tempDir" + tempDir);
		System.out.println("projectPath" + projectPath);
		TimeUnit.SECONDS.sleep(1);
		//container.getImportFromComputerButton().click();
		System.out.println("clicked on import from computer ......");
    TimeUnit.SECONDS.sleep(1);
		String absoluteFilePath = absuluteProjectPath(fileName);
		System.out.println("absoluteFilePath" + absoluteFilePath);
		//driver.getWebDriver().findElement(By.xpath("//input[@type='file']")).sendKeys("/tmp/catastrophic_file.pairing");
    driver.getWebDriver().findElement(By.xpath("//input[@type='file']")).sendKeys(absoluteFilePath);
		//driver.getScreenShot();

		/*Robot robot = new Robot();
		System.out.println("Trying to Upload the file using robot class...");
		StringSelection str = new StringSelection(absoluteFilePath);
		Toolkit.getDefaultToolkit().getSystemClipboard().setContents(str, null);
		System.out.println("strSelection" + str);

		TimeUnit.SECONDS.sleep(2);
		robot.keyPress(KeyEvent.VK_CONTROL);
		robot.keyPress(KeyEvent.VK_V);
		robot.setAutoDelay(2000);

		robot.keyRelease(KeyEvent.VK_CONTROL);
		robot.keyRelease(KeyEvent.VK_V);
		robot.setAutoDelay(2000);
		robot.keyPress(KeyEvent.VK_ENTER);
		robot.keyRelease(KeyEvent.VK_ENTER);
		System.out.println("File is sucessfully uploaded with the help of robot class"); */
	}

	public void checkCardFileName(String fileName) throws Exception {
		TimeUnit.SECONDS.sleep(2);
		WebElement cardFileName = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.FILE_NAME_XPATH, fileName)));
		cardFileName.isDisplayed();
	}

	public void clickImportButton() {
		CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getImportButton());
		driver.jsClick(container.getImportButton());
	}

  public void clickImportButtonForError() throws InterruptedException {
    CustomConditions.waitForElementToBeClickable(driver.getWebDriver(), container.getImportButton());
    driver.jsClick(container.getImportButton());
  }

  public void waitForImport()
  {
    driver.waitForElement(container.getCatastrophicError(),600);
  }

  public String getRefErrorMessage()  {
    return container.getCatastrophicError().getText();

  }

	public void isErrorIconDisplayed(String fileName) throws Exception {
		TimeUnit.SECONDS.sleep(2);
		WebElement errorIcon = driver.getWebDriver()
				.findElement(By.xpath(String.format(container.ERROR_TOOLTIP_XPATH, fileName)));
    TimeUnit.SECONDS.sleep(2);
		errorIcon.isDisplayed();
    TimeUnit.SECONDS.sleep(2);
	}

	public boolean isImportButtonEnabled() {
		return container.getImportButton().isEnabled();
	}

  public boolean isErrorAlertIconDisplyedAfterUpload() {
    return container.geterrorIcon().isDisplayed();
  }

  public void clickOnExapndOption() {
    container.getExpandalertIcon().click();
  }

  public String getErrorAlertCount() {
    String errorIconAlertCount = container.getErrorIconalertCount().getText();
    return errorIconAlertCount.replaceAll("[^,0-9]", "");
  }

  public void dontShowWarningIcon() {
    container.getDontShowWarningIcon().click();
  }
  public void clickOnDropDownAndSelectFileFormat() throws InterruptedException {
	 // container.getDropdownMenuToCorrectFileFormat().click();
    driver.getWebDriver().findElement(By.xpath("//*[text()='Unrecognized']")).click();
	  TimeUnit.SECONDS.sleep(1);
	  driver.getWebDriver().findElement(By.xpath("//*[@role='listbox']//li[text()='Pairings']")).click();
	  TimeUnit.SECONDS.sleep(2);
  }
  public void isFileUploaded() throws InterruptedException {
   CustomConditions.waitForElementToBeClickable(driver.getWebDriver(),container.getImportDataButton());
   TimeUnit.SECONDS.sleep(2);
  }

  private Resource getResourceBasedOnFileName(String fileName) {
		if (FILE_FLIGHT_SUMMARY_ALERT.equals(fileName)) {
			return resourceFlightSummaryAlertSsim;
		} else if (FILE_FLIGHT_SCHEDULE.equals(fileName)) {
			return resourceFlightschedule;
		} else if (FILE_PAIRING_SUMMARY_ALERT.equals(fileName)) {
			return resourcePairingSummaryAlert;
		} else if (FILE_CATASTROPHIC_FILE.equals(fileName)) {
      return resourceCatastrophic_file;
    } else if (FILE_PAIRING.equals(fileName)) {
      return resourcePairings;
    }else if (FILE_FLIGHT_BADFORMAT.equals(fileName)) {
      return resourceFlight_badFormat;
    }else if (FILE_PAIRINGINCOMPLETEDATA.equals(fileName)) {
      return resourcePairing_IncompleteData;
    }
		return resourceFlightSummaryAlertSsim;
  }
}
