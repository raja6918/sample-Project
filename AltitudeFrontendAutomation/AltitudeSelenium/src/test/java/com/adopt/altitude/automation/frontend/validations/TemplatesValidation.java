package com.adopt.altitude.automation.frontend.validations;

import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.not;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Assert;
import org.springframework.stereotype.Component;

@Component
public class TemplatesValidation extends Validation {

   private final static Logger LOGGER = LogManager.getLogger(TemplatesValidation.class);

   public void verifyTemplateExistence(List<String> templates, String template, Boolean isNameInList) {
      assertNotNull(templates);
      LOGGER.debug("List of templates are not null");
      assertNotNull(template);
      LOGGER.debug("Template is not null");
      if (isNameInList) {
         Assert.assertThat(templates, hasItems(template));
         LOGGER.debug("Template is in list");
      }
      else {
         assertThat(templates, not(hasItems(template)));
         LOGGER.debug("Template is not in list");
      }
   }

}
