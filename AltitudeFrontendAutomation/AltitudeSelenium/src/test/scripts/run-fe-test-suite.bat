@echo off

rem usage:
rem [parameter=value] i.e. weburl=http://someurl:port, parameters are optional and have no specific order.
rem ------------------------
rem webUrl: Sets Web Url
rem userUrl: Sets User Url
rem authUrl: Sets the Auth Url
rem scenarioUrl: Sets the Scenario Url
rem dataUrl: Sets the Data Url
rem binUrl: Sets the Bin Url
rem importUrl: Sets the Import Url
rem cucumberTags: Sets Cucumber Tag
rem ------------------------

set TESTLIB_CLASSPATH=%~dp0lib\*
set DEFAULT_WEB_URL=http://localhost:3000
set DEFAULT_USER_URL=http://localhost:8081
set DEFAULT_AUTH_URL=http://localhost:8081
set DEFAULT_SCENARIO_URL=http://localhost:8082
set DEFAULT_DATA_URL=http://localhost:8086
set DEFAULT_BIN_URL=http://localhost:8084
set DEFAULT_IMPORT_URL=http://localhost:8085
set CUCUMBER_TAGS=not @wip

if [%1]==[] goto :runscript

setlocal enabledelayedexpansion

set "map=%*"
call :gettoken webUrl web
call :gettoken userUrl user
call :gettoken authUrl auth
call :gettoken scenarioUrl scenario
call :gettoken dataUrl data
call :gettoken binUrl bin
call: gettoken importUrl importData
call :gettoken cucumberTags tags

if not "%web%" == "" (
    set DEFAULT_WEB_URL=%web%
)
if not "%user%" == "" (
    set DEFAULT_USER_URL=%user%
)
if not "%auth%" == "" (
    set DEFAULT_AUTH_URL=%auth%
)
if not "%scenario%" == "" {
    set DEFAULT_SCENARIO_URL=%scenario%
}
if not "%data%" == "" {
    set DEFAULT_DATA_URL=%data%
}
if not "%bin%" == "" {
    set DEFAULT_BIN_URL=%bin%
}
if not "%importData%" == "" {
    set DEFAULT_IMPORT_URL=%importData%
}
if not "%tags%" == "" (
    set CUCUMBER_TAGS=%tags%
)

:runscript
java.exe -cp "%TESTLIB_CLASSPATH%" -Daltitude.web.url="%DEFAULT_WEB_URL%" -Daltitude.api.user.url="%DEFAULT_USER_URL%" -Daltitude.api.auth.url="%DEFAULT_USER_URL%" -Daltitude.api.scenarios.url="%DEFAULT_SCENARIO_URL%" -Daltitude.api.data.url="%DEFAULT_DATA_URL%" -Daltitude.api.bin.url="%DEFAULT_BIN_URL%" -Daltitude.api.import.url="%DEFAULT_IMPORT_URL%" -Dcucumber.options="--tags '%CUCUMBER_TAGS%'" org.junit.runner.JUnitCore com.adopt.altitude.automation.frontend.tests.CucumberTest  > stdout.log 2>&1

ECHO %errorlevel% > exitcode

popd

goto :eof
:gettoken
call set tmpvar=%%map:*%1=%%
if "%tmpvar%"=="%map%" (set "%~2=") else (
for /f "tokens=1 delims= " %%a in ("%tmpvar%") do set tmpvar=%%a
set "%~2=!tmpvar:~1!"
)
exit /b
