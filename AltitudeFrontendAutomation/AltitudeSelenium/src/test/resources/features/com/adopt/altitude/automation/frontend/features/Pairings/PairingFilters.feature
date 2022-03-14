@data_management
Feature: get filter aircraftType.


    Background:
    Given I open login page
    And The Scenario "aut_scenario_alt-2117" is added
    And I'm logged in with default credentials.
    And I create a file with name "flightschedule.ssim" on temp directory
    And I create a file with name "pairings.xml" on temp directory
    And I'm in the data home page for scenario "aut_scenario_alt-2117"
    And I click on Import Data button
    And I add the bin with name "aut_bin_1507"
    And I upload the Files "flightschedule.ssim" and "pairings.xml" to the import windows
    And  I click button to Import
    And I wait until files uploaded successfully
    And I go to Pairing Page
    And I select crewgroup "Combo Pilots"


  Scenario: To Get the whole list of filter aircraft types
    When The Data with following values are added for aircraft types
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter aircraft types without start index
    When The Data with following values are added for aircraft types
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter aircraft types without end index
    When The Data with following values are added for aircraft types
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
     Then I verify that "display" is added to the response data of filter
     Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter aircraft types without start and end index
    When The Data with following values are added for aircraft types
      | startIndex |          |
      | endIndex   |          |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
     Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter aircraft types without scope
    When The Data with following values are added for aircraft types
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter aircraft types with invalid start index
    When The Data with following values are added for aircraft types
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | flights |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter aircraft types with invalid end index
    When The Data with following values are added for aircraft types
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | flights |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter aircraft types with invalid scope
    When The Data with following values are added for aircraft types
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter aircraft types with special character invalid scope
    When The Data with following values are added for aircraft types
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter country

    When The Data with following values are added for country
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter country without start index
    When The Data with following values are added for country
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter country without end index
    When The Data with following values are added for country
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter country without start and end index
    When The Data with following values are added for country
      | startIndex |          |
      | endIndex   |          |
      | scope      | flights |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter country without scope
    When The Data with following values are added for country
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter country with invalid start index
    When The Data with following values are added for country
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | flights |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter country with invalid end index
    When The Data with following values are added for country
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | flights |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter country with invalid scope
    When The Data with following values are added for country
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter country with special character invalid scope
    When The Data with following values are added for country
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter Fight crewComposition
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter
    Then I verify that "tooltip" is added to the response data of filter


  Scenario: To Get the filter Fight crewComposition without start index
    When The Data with following values are added for Fight crewComposition
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter
    Then I verify that "tooltip" is added to the response data of filter


  Scenario: To Get the filter Fight crewComposition without end index
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter
    Then I verify that "tooltip" is added to the response data of filter


  Scenario: To Get the filter Fight crewComposition without start and end index
    When The Data with following values are added for Fight crewComposition
      | startIndex |          |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter
    Then I verify that "tooltip" is added to the response data of filter

  Scenario: To Get the filter Fight crewComposition without scope
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter Fight crewComposition with invalid start index
    When The Data with following values are added for Fight crewComposition
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter Fight crewComposition with invalid end index
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter Fight crewComposition with invalid scope
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter Fight crewComposition with special character invalid scope
    When The Data with following values are added for Fight crewComposition
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter stations
    When The Data with following values are added for stations
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter stations without start index
    When The Data with following values are added for stations
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter stations without end index
    When The Data with following values are added for stations
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter stations without start and end index
    When The Data with following values are added for stations
      | startIndex |          |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter stations without scope
    When The Data with following values are added for stations
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter stations with invalid start index
    When The Data with following values are added for stations
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter stations with invalid end index
    When The Data with following values are added for stations
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter stations with invalid scope
    When The Data with following values are added for stations
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter stations with special character invalid scope
    When The Data with following values are added for stations
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter regions
    When The Data with following values are added for regions
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter regions without start index
    When The Data with following values are added for regions
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter regions without end index
    When The Data with following values are added for regions
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter regions without start and end index
    When The Data with following values are added for regions
      | startIndex |          |
      | endIndex   |          |
      | scope      | flights  |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter regions without scope
    When The Data with following values are added for regions
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter regions with invalid start index
    When The Data with following values are added for regions
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter regions with invalid end index
    When The Data with following values are added for regions
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | flights  |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter regions with invalid scope
    When The Data with following values are added for regions
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter regions with special character invalid scope
    When The Data with following values are added for regions
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the details of pairing
    When I call the get request for pairings
    Then I verify that "type" is added to the response data of pairing
    Then I verify that "startDateTime" is added to the response data of pairing
    Then I verify that "endDateTime" is added to the response data of pairing
    Then I verify that "duration" is added to the response data of pairing
    Then I verify that "id" is added to the response data of pairing
    Then I verify that "departureStationCode" is added to the response data of pairing
    Then I verify that "arrivalStationCode" is added to the response data of pairing
    Then I verify that "baseCode" is added to the response data of pairing
    Then I verify that "name" is added to the response data of pairing
    Then I verify that "stats" is added to the response data of pairing

  Scenario: To Get the whole list of pairing
    When The Data with following values are added for pairings
      | startIndex | 0        |
      | endIndex   | 1        |
    Then I verify that "startIndex" is added to the response data of pairing
    Then I verify that "endIndex" is added to the response data of pairing
    Then I verify that "totalDataSize" is added to the response data of pairing
    Then I verify that "totalPairingNb" is added to the response data of pairing
    Then I verify that "filteredPairingNb" is added to the response data of pairing
    Then I verify that "lastFilter" is added to the response data of pairing
    Then I verify that "data" is added to the response data of pairing

  Scenario: To Get the whole list of pairing without startIndex
    When The Data with following values are added for pairings
      | startIndex |          |
      | endIndex   | 1        |
    Then I verify that "startIndex" is added to the response data of pairing
    Then I verify that "endIndex" is added to the response data of pairing
    Then I verify that "totalDataSize" is added to the response data of pairing
    Then I verify that "totalPairingNb" is added to the response data of pairing
    Then I verify that "filteredPairingNb" is added to the response data of pairing
    Then I verify that "lastFilter" is added to the response data of pairing
    Then I verify that "data" is added to the response data of pairing

  Scenario: To Get the whole list of pairing without endIndex
    When The Data with following values are added for pairings
      | startIndex | 0       |
      | endIndex   |         |
    Then I verify that "startIndex" is added to the response data of pairing
    Then I verify that "endIndex" is added to the response data of pairing
    Then I verify that "totalDataSize" is added to the response data of pairing
    Then I verify that "totalPairingNb" is added to the response data of pairing
    Then I verify that "filteredPairingNb" is added to the response data of pairing
    Then I verify that "lastFilter" is added to the response data of pairing
    Then I verify that "data" is added to the response data of pairing

  Scenario: To Get the whole list of pairing without start and endIndex
    When The Data with following values are added for pairings
      | startIndex |         |
      | endIndex   |         |
    Then I verify that "startIndex" is added to the response data of pairing
    Then I verify that "endIndex" is added to the response data of pairing
    Then I verify that "totalDataSize" is added to the response data of pairing
    Then I verify that "totalPairingNb" is added to the response data of pairing
    Then I verify that "filteredPairingNb" is added to the response data of pairing
    Then I verify that "lastFilter" is added to the response data of pairing
    Then I verify that "data" is added to the response data of pairing

  Scenario: To Get the list of pairing with invalid start index
    When The Data with following values are added for pairings
      | startIndex | -1       |
      | endIndex   | 1        |
    Then I receive pairing error 400 with message "Field Validation error"

  Scenario: To Get the list of pairing with invalid end index
    When The Data with following values are added for pairings
      | startIndex | 0       |
      | endIndex   | -1      |
    Then I receive pairing error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter bases
    When The Data with following values are added for bases
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter bases without start index
    When The Data with following values are added for bases
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter bases without end index
    When The Data with following values are added for bases
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter bases without start and end index
    When The Data with following values are added for bases
      | startIndex |          |
      | endIndex   |          |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter bases without scope
    When The Data with following values are added for bases
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter bases with invalid start index
    When The Data with following values are added for bases
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | pairings |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter bases with invalid end index
    When The Data with following values are added for bases
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | pairings |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter bases with invalid scope
    When The Data with following values are added for bases
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter bases with special character invalid scope
    When The Data with following values are added for bases
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter layovers
    When The Data with following values are added for layovers
      | startIndex | 0        |
      | endIndex   | 1        |
      | scope      | layovers |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter layovers without scope
    When The Data with following values are added for layovers
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter layovers with invalid start index
    When The Data with following values are added for layovers
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | layovers |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter layovers with invalid end index
    When The Data with following values are added for layovers
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | layovers |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter layovers with invalid scope
    When The Data with following values are added for layovers
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter layovers with special character invalid scope
    When The Data with following values are added for layovers
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter layovers without start index
    When The Data with following values are added for layovers
      | startIndex |          |
      | endIndex   | 3        |
      | scope      | layovers |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter layovers without end index
    When The Data with following values are added for layovers
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | layovers |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter layovers without start and end index
    When The Data with following values are added for layovers
      | startIndex |          |
      | endIndex   |          |
      | scope      | layovers |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the whole list of filter name
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | 3        |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter name without start index
    When The Data with following values are added for name
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter name without end index
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter name without start and end index
    When The Data with following values are added for name
      | startIndex |          |
      | endIndex   |          |
      | scope      | pairings |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter name without scope
    When The Data with following values are added for name
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid start index
    When The Data with following values are added for name
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | pairings |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid end index
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | pairings |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid scope
    When The Data with following values are added for name
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with special character invalid scope
    When The Data with following values are added for name
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the whole list of filter name
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | 3        |
      | scope      | pairings |
      | filter     | z45      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter name without start index
    When The Data with following values are added for name
      | startIndex |          |
      | endIndex   | 1        |
      | scope      | pairings |
      | filter     | z45      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter name without end index
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   |          |
      | scope      | pairings |
      | filter     | z45      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the filter name without start and end index
    When The Data with following values are added for name
      | startIndex |          |
      | endIndex   |          |
      | scope      | pairings |
      | filter     | z45      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter

  Scenario: To Get the filter name without scope
    When The Data with following values are added for name
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      |     |
      | filter     | z45 |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid start index
    When The Data with following values are added for name
      | startIndex | -1       |
      | endIndex   | 1        |
      | scope      | pairings |
      | filter     | z45      |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid end index
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | -1       |
      | scope      | pairings |
      | filter     | z45      |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with invalid scope
    When The Data with following values are added for name
      | startIndex | 0   |
      | endIndex   | 1   |
      | scope      | ABC |
      | filter     | z45 |
    Then I receive filter error 400 with message "Field Validation error"

  Scenario: To Get the filter name with special character invalid scope
    When The Data with following values are added for name
      | startIndex | 0    |
      | endIndex   | 1    |
      | scope      | @#@# |
      | filter     | z45  |
    Then I receive filter error 400 with message "Field Validation error"


  Scenario: To Get the whole list of filter name without filter
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | 3        |
      | scope      | pairings |
      | filter     |          |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
    Then I verify that "display" is added to the response data of filter
    Then I verify that "value" is added to the response data of filter
    Then I verify that "key" is added to the response data of filter


  Scenario: To Get the whole list of filter name with invalid filter
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | 3        |
      | scope      | pairings |
      | filter     | ABC      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter


  Scenario: To Get the whole list of filter name with invalid character filter
    When The Data with following values are added for name
      | startIndex | 0        |
      | endIndex   | 3        |
      | scope      | pairings |
      | filter     | &$%      |
    Then I verify that "startIndex" is added to the response data of filter
    Then I verify that "endIndex" is added to the response data of filter
    Then I verify that "totalDataSize" is added to the response data of filter
    Then I verify that "data" is added to the response data of filter
