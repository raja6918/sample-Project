package com.adopt.altitude.automation.frontend.tests;

import org.junit.runner.RunWith;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;

@RunWith(Cucumber.class)
@CucumberOptions(glue = {"com.adopt.altitude.automation.frontend.steps", "com.adopt.altitude.automation.frontend.api.steps", "com.adopt.altitude.automation.frontend.utils"},
                 features = "classpath:features",
                 monochrome = true,
                 plugin = { "pretty", "json:target/json-report.json", "html:target/html-report" },
                 tags = {"@disabled"})
public class CucumberTest {
}
