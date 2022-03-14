#!/bin/bash

## usage:
## [parameter]=[value] i.e. WEB_URL=http://someurl:port, parameters are optional and have no specific order, if a value has spaces, enclose it with single quotes.
##------------------------
## WEB_URL: 		Sets Web Url
## USER_API: 		Sets Users Url
## AUTH_API: 		Sets Ath Url
## SCENARIOS_API:	Sets Scenarios Url
## DATA_API:		Sets Data Managements Url
## BIN_API:     Sets Bin Management Url
## IMPORT_API:  Sets Import Url
## CUCUMBER_TAGS:	Sets Cucumber Tag
##------------------------

WEB_URL=http://localhost:3000
USER_API=http://localhost:8081
AUTH_API=http://localhost:8081
SCENARIOS_API=http://localhost:8082
DATA_API=http://localhost:8083
BIN_API=http://localhost:8084
IMPORT_API=http://localhost:8085
CUCUMBER_TAGS="not @wip"

for ARGUMENT in "$@"
do

    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            WEB_URL)		WEB_URL=${VALUE} ;;
            USER_API)		USER_API=${VALUE} ;;
			AUTH_API)		AUTH_API=${VALUE} ;;
			SCENARIOS_API)	SCENARIOS_API=${VALUE} ;;
			DATA_API)		DATA_API=${VALUE} ;;
	    BIN_API)		BIN_API=${VALUE} ;;
      IMPORT_API)		IMPORT_API=${VALUE} ;;
			CUCUMBER_TAGS)	CUCUMBER_TAGS=${VALUE} ;;
            *)
    esac


done

java -cp "./lib/*" -Daltitude.web.url=${WEB_URL%} -Daltitude.api.user.url=${USER_API} -Daltitude.api.auth.url=${AUTH_API} -Daltitude.api.scenarios.url=${SCENARIOS_API} -Daltitude.api.data.url=${DATA_API} -Daltitude.api.bin.url=${BIN_API} -Daltitude.api.import.url=${IMPORT_API} -Dcucumber.options="--tags '${CUCUMBER_TAGS}'" org.junit.runner.JUnitCore com.adopt.altitude.automation.frontend.tests.CucumberTest

echo $? > exitcode
