@users @adduser-InvalidIputs @wip
Feature: User Administration - Validate error message on add user.

  Background:
    Given I open login page
    And I'm logged in with default credentials.

  Scenario Outline: I want to validate First Name error message
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then The message "First name cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName   | username | email              | password  | passwordConfirmation | role          |
      | ""        | Automation | aut_user | aut@konos-test.com | Password1 | Password1            | Administrator |

  Scenario Outline: I want to validate Last Name error message
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then The message "Last name cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName | username | email              | password  | passwordConfirmation | role          |
      | User      | ""       | aut_user | aut@konos-test.com | Password1 | Password1            | Administrator |

  Scenario Outline: I want to validate username error message
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then The message "Username should be in format similar to: jose, jose12, joe.stone, joe_stone, joe-stone" is displayed

    Examples:
      | firstName | lastName   | username | email              | password  | passwordConfirmation | role          |
      | User      | Automation | ""       | aut@konos-test.com | Password1 | Password1            | Administrator |

  Scenario Outline: I want to validate email error message
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then The message "E-mail cannot start with a space or special character" is displayed

    Examples:
      | firstName | lastName   | username | email | password  | passwordConfirmation | role          |
      | User      | Automation | aut_user | ""    | Password1 | Password1            | Administrator |

  Scenario Outline: I want to validate the password entered by the User meeting the acceptance criteria for the pasword field
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    #Then The message "Passwords must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number. No blank spaces please." is displayed
    Then ColorCode for No blank spaces should be changed to "rgba(104, 193, 99, 1)"
    Then ColorCode for At least one number text should be visible in "rgba(0, 0, 0, 0.38)"
    Then ColorCode for Lower and Uppercase letter text should be visible in  "rgba(0, 0, 0, 0.38)"
    Then ColorCode for Atleast Eight characters text should be visible in "rgba(0, 0, 0, 0.38)"

    Examples:
      | firstName | lastName   | username | email              | password | passwordConfirmation | role          |
      | User      | Automation | aut_user | aut@konos-test.com | ""       | ""                   | Administrator |

  Scenario Outline: I want to validate passwords don't match error message
    Given I enter to User administration portal
    And I open add new user form
    When I provide <firstName> <lastName> <username> <email> <password> <passwordConfirmation> <role> data in form
    Then The message "Passwords don't match" is displayed

    Examples:
      | firstName | lastName   | username | email              | password  | passwordConfirmation | role          |
      | User      | Automation | aut_user | aut@konos-test.com | Password1 | Password             | Administrator |
