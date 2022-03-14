package com.adopt.altitude.automation.frontend.utils.selenium;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class CustomConditions {

	private CustomConditions() {
		// Intentionally blank
	}

	public static final ExpectedCondition<List<WebElement>> clickabilityOfAllElements(List<WebElement> elements) {
		return new ClickabilityOfAllElementsCondition(elements);
	}

	public static WebElement waitForElementToBeClickable(WebDriver driver, WebElement element) {
		ExpectedCondition<WebElement> elementToBeClickable = ExpectedConditions.elementToBeClickable(element);
		WebElement apply = elementToBeClickable.apply(driver);
		if (apply == null) {
			return null;
		}
		return apply;
	}
}
