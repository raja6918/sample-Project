package com.adopt.altitude.automation.frontend.utils.selenium;

import java.lang.reflect.Field;

import org.openqa.selenium.SearchContext;
import org.openqa.selenium.support.pagefactory.DefaultElementLocator;
import org.openqa.selenium.support.pagefactory.ElementLocator;
import org.openqa.selenium.support.pagefactory.ElementLocatorFactory;

public class SearchContextLocatorFactory implements ElementLocatorFactory {
   
   private final SearchContext context;
   
   public SearchContextLocatorFactory(SearchContext context){
      this.context = context;
   }
   
   public ElementLocator createLocator(Field field){
      return new DefaultElementLocator(context, field);
   }

}
