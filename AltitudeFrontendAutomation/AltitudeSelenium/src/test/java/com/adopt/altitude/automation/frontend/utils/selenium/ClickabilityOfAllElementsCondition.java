package com.adopt.altitude.automation.frontend.utils.selenium;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;

/**
 * A custom Selenium condition that expects that a list of web elements are
 * clickable.
 * 
 */
public class ClickabilityOfAllElementsCondition implements ExpectedCondition<List<WebElement>> {

	private final List<WebElement> elements;

	ClickabilityOfAllElementsCondition(List<WebElement> elements) {
		this.elements = elements;
	}

	@Override
	public List<WebElement> apply(WebDriver driver) {

		for (WebElement element : elements) {
			ExpectedCondition<WebElement> elementToBeClickable = ExpectedConditions.elementToBeClickable(element);
			WebElement apply = elementToBeClickable.apply(driver);
			if (apply == null) {
				return null;
			}
		}

		return elements.size() > 0 ? elements : null;

	}
	
		
}
