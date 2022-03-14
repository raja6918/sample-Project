@rolesAndPermission @DataHomePermission @data_management
Feature: Role & Permission- Data Home & Tables.

  Scenario: Verify application after "View and manage" scenario access
    Given I open login page
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    #When I click on the Plus Button in Role page
    #And I provide the roleName as "DataHomeAut"
    #And I provide the roleDescription as "Data and Template Test page"
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Dashboard" in the role page
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Import data to a scenario"
    And I click on permission "Templates" in the role page
    And I click on permission "Users" in the role page
   # And I click on 'CreateRole' Button in role page
    And I save changes in role page
   # Then verify successfully that role added with message "The role DataHomeAut has been successfully created."
    Then verify successfully that role added with message "The role AuthRoleDoNotDelete has been successfully updated."
    #Then verify create role window is closed
    #Then I verify created role "DataHomeAut" is successfully added to role table
    #Then I go to User Page
    #When I click on the Plus Button in User page
    #And I provide the following data in the form user
    #  | First Name    | IDataHomeAut            |
    #  | Last Name     | MyTest                  |
    #  | User Name     | IDataHomeAut            |
    #  | Email         | IDataHomeAut@ibsplc.com |
    #  | password      | Abc@1234                |
    #  | Re Password   | Abc@1234                |
    #  | Role          | DataHomeAut             |
   # And I click on 'Add' Button in user page
   # Then verify successfully that user added with message "User IDataHomeAut MyTest has been successfully added."
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I click on the Add Scenario button
    When I create the Scenario "aut_scenario_alt-2519" with default values selecting the "Sierra UAT Template" template
    Then The Scenario is open in the Data Home page
    Then I open regions page
    When I add the region "aut_region" with code "AUT"
    Then the new region is displayed in the regions list
    When I update the name to "aut_region_updated" for region "aut_region"
    Then the updated region is displayed in the regions list
    Then I click on data card link "Positions"
    When I add the Position "aut_position" with code "AUT" type as "Cabin crew"
    Then the new Position is displayed in the Positions list
    When I update the name to "aut_position_updated" for position "aut_position"
    Then the updated position is displayed in the positions list
    Then I click on data card link "Currencies"
    When I add the currency "aut_currency" with code "AUT" and exchange rate "1"
    Then the new currency is displayed in the currencies list
    When I update the rate to "99" for currency "aut_currency"
    Then the message "Currency aut_currency (AUT) has been successfully updated." for currency is displayed
    Then I click on data card link "Countries"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then a new country is added to list
    When I update the code to "YY" for country "aut_country"
    Then the updated country is displayed in the countries list
    Then I click on data card link "Stations"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | AUT                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region_updated    |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T4:25|
      | DST End Date   | 2019-November-29T5:25|
    Then a new station is added to list
    When I update the Time Zone to "UTC+6:00" for "aut_station" station
    When i set Terminal as "T2"
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "0h30" as DST Change
    Then the message "Station aut_station has been successfully updated." for station is displayed
    Then I click on data card link "Aircraft types" and open Aircraft Models
    When I add the aircraft model "aut_aircraft_model" with code "123"
    Then the new Aircraft model is displayed in the Aircraft models list
    When I update the name to "AUT-FE model Updated" for aircraft model "aut_aircraft_model"
    Then the updated aircraft model is displayed in the aircraft models list
    Then I click on data card link "Aircraft types"
    When I enter the following data for an aircraft type
      | IATA Type     | TTT                  |
      | Model         | AUT-FE model Updated |
      | Name          | aut_aircraft_name    |
      | Rest Facility | C3 - Basic Seat      |
    And I enter crew complement as
      | Name  | CA  | FO | FA |
      | Count |   1 |  1 |  1 |
    Then the new Aircraft type is displayed in the Aircraft types list
    When I update the name to "AUT 123" for aircraft type "aut_aircraft_name"
    Then the updated aircraft type is displayed in the aircraft types list
    Then I click on data card link "Crew bases"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT                       |
      | Base Name | aut_crewbase              |
      | Country   | aut_country, YY           |
      | Station   | AUT - aut_station |
    Then a new crew base is added to list
    When I update the name to "aut_crewbase_updated" for crew base "aut_crewbase"
    Then the updated crew base is displayed in the crew bases list
    Then I click on data card link "Accommodations"
    When I enter the following accommodation data with Nights Calculated By Check-in/Check-out
      | Name                | aut_accommodation |
      | Station             | AUT - aut_station |
      | Type                | City              |
      | Capacity            | 30                |
      | Contract Start Date | November-1-2019   |
      | Contract End Date   | November-30-2020  |
      | Cost                | 125.00            |
      | Currency            | AUT               |
      | Check In Time       | 15:00             |
      | Check Out Time      | 11:00             |
      | Cost Extended Stay  | 95                |
      | Transit Time        | 30                |
      | Transit Cost        | 30.00             |
      | Transit Currency    | AUT               |
      | Cost Basis          | Fixed cost        |
    #And I add the following extra times to accommodation
    #  | Extra Time       | 30    |
    #  | Extra Time Start | 18:00 |
     # | Extra Time End   | 21:00 |
    And I add the accommodation
    Then a new accommodation is added to list
    When I update the name to "aut_accommodation_updated" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list
    When I delete the accommodation "aut_accommodation_updated"
    Then the message "Accommodation aut_accommodation_updated has been successfully deleted." for accommodation is displayed as expected
    Then I click on data card link "Operating flights"
    And I open the add new operating flight drawer
    When I entered the following data for Operating Flight
      | Airline            | QK              |
      | Flight             |            9999 |
      | Suffix             |                 |
      | FromStation        | AUT             |
      | TerminalFrom       |     T2          |
      | ToStation          | AUT             |
      | TerminalTo         |       T2        |
      | DepartureTime      | 15:00           |
      | ArrivalTime        | 18:00           |
      | ServiceType        |                 |
      | OnwardFlight       |                 |
      | OnwardDayOffset    |                 |
      | AircraftType       |              DH1|
      | CabinConfiguration |                 |
      | TailNumber         |                 |
      | DeadheadSeats      |                 |
      | FlightDate         |              27 |
      | FlightTags         |                 |
    And I add the Operating Flight
    Then a new Operating Flight is added to list
    When I update the flight to "1000" for operating flight "9999"
    Then the updated operating flight is displayed in the operating flights list edit
    When I delete operating flight "1000"
    Then the message "Operating flight QK1000 has been successfully deleted." for operating Flight is displayed
    Then I click on data card link "Crew bases"
    When I delete the crewBase "aut_crewbase_updated"
    Then the message "Crew base aut_crewbase_updated has been successfully deleted." for crewBase is displayed as expected
    Then I click on data card link "Stations"
    When I delete station with Iata code "AUT"
    Then the message "Station AUT has been successfully deleted." for station is displayed
    Then I click on data card link "Aircraft types"
    And I want to delete AirCraft with aircraft type "TTT"
    Then the message "Aircraft type TTT has been successfully deleted." for aircraft is displayed

  Scenario: Verify application after "View Only" scenario access
    Given I open login page
    And The Scenario "aut_scenario_alt-2519" is added
    And I'm logged in with default credentials.
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Scenarios" in the role page
    And I click on radio button permission option "View only"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    And I open the view only scenario "aut_scenario_alt-2519"
    When I click 'Open' button on the View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the scenario name
    And I open accommodations page
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "@@" and confirm that filter is working fine for "Accommodations"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Accomodation"
    Then I click on data card link "Aircraft types"
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "31" and confirm that filter is working fine for "Aircraft types"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Aircraft types"
    Then I click on data card link "Coterminal transports"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "lg" and confirm that filter is working fine for "Coterminal Transports"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Coterminal transports"
    Then I click on data card link "Countries"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "X" and confirm that filter is working fine for "Countries"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Countries"
    Then I click on data card link "Crew bases"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "on" and confirm that filter is working fine for "Crew bases"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Crew bases"
    Then I click on data card link "Crew groups"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "320" and confirm that filter is working fine for "Crew groups"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Crew groups"
    Then I click on data card link "Currencies"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "dollar" and confirm that filter is working fine for "Currencies"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Currencies"
    Then I click on data card link "Operating flights"
    And I verify that add button is disabled and visible and Perform the operations based on count
   # And I verify that add button is visible and disabled.
   # Then I verify that i can see a list of all records in the table
   # Then I click on the info icon
   # And I verify that all the fields are disabled
   # Then I see that Close button is displayed at the bottom of the right pan and i click on close button
   # Then I click on the filter and send input as "Ar11" and confirm that filter is working fine for "Operating Flights"
   # And I verify that all the delete icon is visible and disabled
   # And I verify that all the pencil icon is replaced with the info icon
   # And I verify that sort is fine for ascending and descending order for "Operating Flights"
    Then I click on data card link "Positions"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "C" and confirm that filter is working fine for "Positions"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    Then I click on data card link "Regions"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "Can" and confirm that filter is working fine for "Regions"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Regions"
    Then I click on data card link "Stations"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "yy" and confirm that filter is working fine for "Stations"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Stations"

  Scenario Outline: Verify application after "View and manage Template" access is provided
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View and manage"
    And I click on checkbox of permission option "Delete templates"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
 #   Given I'm in the templates page
 #   And I click on the 'Add' button
 #   When I provide <sourceTemplate> <templateName> <category> <description> data in the form
 #   And I click on the 'CREATE' button
  #  Then a new template is added to list
    Then I open the template "aut_Data_Home"
    Then I open regions page
    When I add the region "aut_region" with code "AUT"
    Then the new region is displayed in the regions list
    When I update the name to "aut_region_updated" for region "aut_region"
    Then the updated region is displayed in the regions list
    Then I click on data card link "Positions"
    When I add the Position "aut_position" with code "AUT" type as "Cabin crew"
    Then the new Position is displayed in the Positions list
    When I update the name to "aut_position_updated" for position "aut_position"
    Then the updated position is displayed in the positions list
    Then I click on data card link "Currencies"
    When I add the currency "aut_currency" with code "AUT" and exchange rate "1"
    Then the new currency is displayed in the currencies list
    When I update the rate to "99" for currency "aut_currency"
    Then the message "Currency aut_currency (AUT) has been successfully updated." for currency is displayed
    Then I click on data card link "Countries"
    And I click on the 'Add' new country button
    When I provide the following data in the country form
      | Country Code | ZZ           |
      | Country Name | aut_country  |
      | Currency     | aut_currency |
    Then a new country is added to list
    When I update the code to "YY" for country "aut_country"
    Then the updated country is displayed in the countries list
    Then I click on data card link "Stations"
    And I click on the 'Add' new station button
    When I provide the following data in the form
      | Iata Code      | AUT                   |
      | Station Name   | aut_station           |
      | Country        | aut_country           |
      | Region         | aut_region_updated    |
      | Latitude       |                 12.12 |
      | Longitude      |                 23.12 |
      | Time Zone      | UTC-9:30              |
      | DST Change     | 0h30                  |
      | DST Start Date | 2018-November-27T16:25|
      | DST End Date   | 2019-November-29T16:25|
    Then a new station is added to list
    When I update the Time Zone to "UTC+6:00" for "aut_station" station
    When i set Terminal as "T2"
    When I enter "14" as Latitude
    When I enter "24" as Longitude
    When I select "0h30" as DST Change
    Then the message "Station aut_station has been successfully updated." for station is displayed
    Then I click on data card link "Aircraft types" and open Aircraft Models
    When I add the aircraft model "aut_aircraft_model" with code "123"
    Then the new Aircraft model is displayed in the Aircraft models list
    When I update the name to "AUT-FE model Updated" for aircraft model "aut_aircraft_model"
    Then the updated aircraft model is displayed in the aircraft models list
    Then I click on data card link "Aircraft types"
    When I enter the following data for an aircraft type
      | IATA Type     | TTT                  |
      | Model         | AUT-FE model Updated |
      | Name          | aut_aircraft_name    |
      | Rest Facility | C3 - Basic Seat      |
    And I enter crew complement as
      | Name  | CA  | FO | FA |
      | Count |   1 |  1 |  1 |
    Then the new Aircraft type is displayed in the Aircraft types list
    When I update the name to "AUT 123" for aircraft type "aut_aircraft_name"
    Then the updated aircraft type is displayed in the aircraft types list
    Then I click on data card link "Crew bases"
    And I click on the 'Add' new crew base button
    When I provide the following data in the crew base form
      | Base Code | AUT                       |
      | Base Name | aut_crewbase              |
      | Country   | aut_country, YY           |
      | Station   | AUT - aut_station |
    Then a new crew base is added to list
    When I update the name to "aut_crewbase_updated" for crew base "aut_crewbase"
    Then the updated crew base is displayed in the crew bases list
    Then I click on data card link "Accommodations"
    When I enter the following accommodation data with Nights Calculated By Check-in/Check-out
      | Name                | aut_accommodation |
      | Station             | AUT - aut_station |
      | Type                | City              |
      | Capacity            | 30                |
      | Contract Start Date | November-1-2019   |
      | Contract End Date   | November-30-2020  |
      | Cost                | 125.00            |
      | Currency            | AUT               |
      | Check In Time       | 15:00             |
      | Check Out Time      | 11:00             |
      | Cost Extended Stay  | 95                |
      | Transit Time        | 30                |
      | Transit Cost        | 30.00             |
      | Transit Currency    | AUT               |
      | Cost Basis          | Fixed cost        |
    #And I add the following extra times to accommodation
    #  | Extra Time       | 30    |
    #  | Extra Time Start | 18:00 |
    #  | Extra Time End   | 21:00 |
    And I add the accommodation
    Then a new accommodation is added to list
    When I update the name to "aut_accommodation_updated" for accommodation "aut_accommodation"
    Then the updated accommodation is displayed in the accommodations list
    When I delete the accommodation "aut_accommodation_updated"
    Then the message "Accommodation aut_accommodation_updated has been successfully deleted." for accommodation is displayed as expected
    Then I click on data card link "Crew bases"
    When I delete the crewBase "aut_crewbase_updated"
    Then the message "Crew base aut_crewbase_updated has been successfully deleted." for crewBase is displayed as expected
    Then I click on data card link "Stations"
    When I delete station with Iata code "AUT"
    Then the message "Station AUT has been successfully deleted." for station is displayed
    Then I click on data card link "Aircraft types"
    And I want to delete AirCraft with aircraft type "TTT"
    Then the message "Aircraft type TTT has been successfully deleted." for aircraft is displayed
    Then I log out
    And I'm logged in with default credentials.
    And I go to template page
    When I click on the 'Delete' button for template "aut_Data_Home"
    Then the template "aut_Data_Home" is deleted from the list

    Examples:
      | sourceTemplate     | templateName     | category | description |
      | Sierra UAT Template | aut_Data_Home    |         | test        |


  Scenario Outline: Verify application after "View Only" Template access is provided
    Given I open login page
    And I'm logged in with default credentials.
    Given I'm in the templates page
    And I click on the 'Add' button
    When I provide <sourceTemplate> <templateName> <category> <description> data in the form
    And I click on the 'CREATE' button
    Then a new template is added to list
    Then I'm in the Role Page
    When I click on edit button for role "AuthRoleDoNotDelete"
    And I turn of all the roles permission
    And I click on permission "Templates" in the role page
    And I click on radio button permission option "View only"
    And I save changes in role page
    And I log out
    And I login with username "AutUserOne_DoNotDelete" password "Ibsadmin123"
    Given I'm in the templates page
    And I open the template "aut_Data_Home_TEST"
    When I click 'Open' button on the template View Only Information dialog
    Then The legend shows 'VIEW-ONLY' beside the template name
    And I open accommodations page
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "@@" and confirm that filter is working fine for "Accommodations"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Accomodation"
    Then I click on data card link "Aircraft types"
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "31" and confirm that filter is working fine for "Aircraft types"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Aircraft types"
    Then I click on data card link "Coterminal transports"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "lg" and confirm that filter is working fine for "Coterminal transports"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Coterminal transports"
    Then I click on data card link "Countries"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "X" and confirm that filter is working fine for "Countries"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Countries"
    Then I click on data card link "Crew bases"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "on" and confirm that filter is working fine for "Crew bases"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Crew bases"
    Then I click on data card link "Crew groups"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "320" and confirm that filter is working fine for "Crew groups"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Crew groups"
    Then I click on data card link "Currencies"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "dollar" and confirm that filter is working fine for "Currencies"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Currencies"
    Then I click on data card link "Positions"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "C" and confirm that filter is working fine for "Positions"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    Then I click on data card link "Regions"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "Can" and confirm that filter is working fine for "Regions"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Regions"
    Then I click on data card link "Stations"
    And I verify that add button is visible and disabled.
    Then I verify that i can see a list of all records in the table
    Then I click on the info icon
    And I verify that all the fields are disabled
    Then I see that Close button is displayed at the bottom of the right pan and i click on close button
    Then I click on the filter and send input as "yy" and confirm that filter is working fine for "Stations"
    And I verify that all the delete icon is visible and disabled
    And I verify that all the pencil icon is replaced with the info icon
    And I verify that sort is fine for ascending and descending order for "Stations"
    Then I log out
    And I'm logged in with default credentials.
    And I go to template page
    When I click on the 'Delete' button for template "aut_Data_Home_TEST"
    Then the template "aut_Data_Home_TEST" is deleted from the list

  Examples:
      | sourceTemplate     | templateName           | category | description |
      | Sierra UAT Template | aut_Data_Home_TEST    |          | test        |
