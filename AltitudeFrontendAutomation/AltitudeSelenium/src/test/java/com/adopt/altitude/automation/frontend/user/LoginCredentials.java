package com.adopt.altitude.automation.frontend.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class LoginCredentials {

   @Value("${altitude.default.username}")
   private String username;

   @Value("${altitude.default.password}")
   private String password;

   @Value("${altitude.defaultSecond.username}")
   private String secondUsername;
  @Value("${altitude.defaultSecond.password}")
  private String secondPassword;
  @Value("${altitude.defaultSecond.role}")
  private String secondUserRole;
  public String getSecondUserRole() {
    return secondUserRole;
  }

  public void setSecondUserRole(String secondUserRole) {
    this.secondUserRole = secondUserRole;
  }


  public String getSecondUsername() {
    return secondUsername;
  }
  public void setSecondUsername(String secondUsername) {
    this.secondUsername = secondUsername;
  }
  public String getSecondPassword() {
    return secondPassword;
  }
  public void setSecondPassword(String secondPassword) {
    this.secondPassword = secondPassword;
  }

   public String getUsername() {
      return username;
   }

   public void setUsername(String username) {
      this.username = username;
   }

   public String getPassword() {
      return password;
   }

   public void setPassword(String password) {
      this.password = password;
   }
}
