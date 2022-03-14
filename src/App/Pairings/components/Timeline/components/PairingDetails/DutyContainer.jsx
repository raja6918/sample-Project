import React from 'react';
import moment from 'moment';

import { mergeArrayObjects } from './../../../../../../_shared/helpers';
import ActivityDuration from './ActivityDuration';
import MultiRowContainer from './MultiRowContainer';

const translationKey = 'PAIRINGS.details';

class DutyContainer extends React.Component {
  state = {
    showMore: false,
  };

  handleToggleStatistics = () => {
    this.setState(prevState => ({ showMore: !prevState.showMore }));
  };

  generateDutyTags = tags => {
    const getTagData = tagKey => {
      const tagData = {
        'Early Start': { text: 'Early start', icon: 'alarm' },
        Domestic: { text: 'Domestic', icon: 'home' },
        DEFAULT: { text: tagKey, icon: 'local_offer' },
      };
      return tagData[tagKey] || tagData.DEFAULT;
    };

    /* Only return up to 2 tags, due available space */
    return tags.slice(0, 2).map((tag, idx) => {
      const tagData = getTagData(tag);
      return (
        <span className="duty-remark-item" key={idx}>
          <i className="material-icons">{tagData.icon}</i>
          <span>{tagData.text}</span>
        </span>
      );
    });
  };

  generateTableData = activities => {
    const fligthsAndConn = activities.filter(activity => {
      if (activity.type === 'BRF' || activity.type === 'DBRF') {
        return false;
      }
      return true;
    });

    const rows = [];
    const { t } = this.props;

    for (let index = 0; index < fligthsAndConn.length; index += 2) {
      const mainActivity = fligthsAndConn[index];
      const connObject = fligthsAndConn[index + 1] || {};
      let reportColumnText = mainActivity.flightNumber;

      if (mainActivity.type === 'COTRM') {
        reportColumnText = t(
          `PAIRINGS.transportTypes.${mainActivity.transportTypeCode}.shortName`
        );
      }

      const flightCheckpoint = [{ duration: mainActivity.duration }];
      const flightStartTime = moment
        .utc(mainActivity.startDateTime)
        .format('HH:mm');
      const flightEndTime = moment
        .utc(mainActivity.endDateTime)
        .format('HH:mm');
      const flightStartDate = moment
        .utc(mainActivity.startDateTime)
        .startOf('day');
      const flightEndDate = moment.utc(mainActivity.endDateTime).startOf('day');
      const flightDaysDiff = flightEndDate.diff(flightStartDate, 'days');

      const tableData = {
        status: mainActivity.status,
        timeOnGround: {
          duration: connObject.duration || '',
          isAircraftChange: connObject.aircraftChange || false,
        },
        aircraftType: mainActivity.aircraftTypeCode,
        required: mergeArrayObjects(
          mainActivity.crewComposition,
          mainActivity.coverageBalance
        ),
        credit: mainActivity.stats.credit,
      };

      rows.push(
        <div className="row" role="rowgroup" key={`$row-${index}`}>
          <div className="cell" role="cell">
            <span className="hightlight">
              {(mainActivity.type === 'DHI' || mainActivity.type === 'CML') && (
                <i className="material-icons left-icon">
                  airline_seat_recline_extra
                </i>
              )}
              <span>{reportColumnText}</span>
            </span>
          </div>
          <div className="cell" role="cell">
            <ActivityDuration
              className="cell"
              startLabel={
                <span>
                  {`${flightStartTime} `}
                  <span className="bold">
                    {mainActivity.departureStationCode}
                  </span>
                </span>
              }
              endLabel={
                <span>
                  <span className="bold">
                    {mainActivity.arrivalStationCode}
                  </span>
                  {` ${flightEndTime}`}
                  {flightDaysDiff > 0 && (
                    <span className="days-diff">{`(+${flightDaysDiff})`}</span>
                  )}
                </span>
              }
              checkpoints={flightCheckpoint}
            />
          </div>
          <MultiRowContainer data={tableData} />
        </div>
      );
    }

    return rows;
  };

  render() {
    const { showMore } = this.state;
    const { t, activity } = this.props;
    const formattedStartDate = moment
      .utc(activity.startDateTime)
      .format('ddd, Do MMM YYYY');
    const showMoreConfig = !showMore
      ? ['expand_more', t(`${translationKey}.seeMore`)]
      : ['expand_less', t(`${translationKey}.seeLess`)];

    const signOnActivity = activity.activities.find(
      activity => activity.type === 'BRF'
    );

    const signOnStartTime = moment
      .utc(signOnActivity.startDateTime)
      .format('HH:mm');
    const signOnEndTime = moment
      .utc(signOnActivity.endDateTime)
      .format('HH:mm');

    const signOffActivity = activity.activities.find(
      activity => activity.type === 'DBRF'
    );
    const signOffStartTime = moment
      .utc(signOffActivity.startDateTime)
      .format('HH:mm');
    const signOffEndTime = moment
      .utc(signOffActivity.endDateTime)
      .format('HH:mm');

    const signOnCheckPoints = [{ duration: signOnActivity.duration }];
    const signOffCheckPoints = [{ duration: signOffActivity.duration }];

    return (
      <div className="duty-container">
        <div className="duty">
          <span className="date">
            <span>
              <span className="bold">
                {t(`${translationKey}.day`)} {activity._relativeDay} -
              </span>
              {` ${formattedStartDate}`}
            </span>
          </span>
          <span className="statistic-overview">
            <span className="statistic-item">
              <span>Duty time:</span>
              {` ${activity.duration}`}
            </span>
            <span className="statistic-item">
              <span>FDP:</span>
              {` ${activity.stats.fdp}`}
            </span>
            <span className="statistic-item">
              <span>Flight time:</span>
              {` ${activity.stats.blockTime}`}
            </span>
            <span className="statistic-item">
              <span>Credit time:</span>
              {` ${activity.stats.credit}`}
            </span>
          </span>
          <span className="duty-remarks-overview">
            {this.generateDutyTags(activity.tags)}
          </span>
          <span className="more-info" onClick={this.handleToggleStatistics}>
            <i className="material-icons">{showMoreConfig[0]}</i>
            <span>{showMoreConfig[1]}</span>
          </span>
        </div>
        {showMore && (
          <div className="duty-statistics">
            <span>{t(`${translationKey}.statistics`)}</span>
            <div className="statistics-full">
              <div className="statistic-item">
                <span>Reference station:</span> YXZ
              </div>
              <div className="statistic-item">
                <span>FDP maximum extension:</span> 01h30
              </div>
              <div className="statistic-item">
                <span>FDP maximum buffer:</span> 00h30
              </div>
              <div className="statistic-item">
                <span>FDP split FDP maximum:</span> 00h00
              </div>
              <div className="statistic-item">
                <span>Aircraft class:</span> N/A
              </div>
              <div className="statistic-item">
                <span>In flight 4crew:</span> Yes
              </div>
              <div className="statistic-item">
                <span>Easa duty type:</span> reg.
              </div>
              <div className="statistic-item">
                <span>Reference station:</span> YXZ
              </div>
              <div className="statistic-item">
                <span>FDP maximum extension:</span> 01h30
              </div>
              <div className="statistic-item">
                <span>FDP maximum buffer:</span> 00h30
              </div>
              <div className="statistic-item">
                <span>FDP split FDP maximum:</span> 00h00
              </div>
              <div className="statistic-item">
                <span>Aircraft class:</span> N/A
              </div>
              <div className="statistic-item">
                <span>In flight 4crew:</span> Yes
              </div>
              <div className="statistic-item">
                <span>Easa duty type:</span> reg.
              </div>
              <div className="statistic-item">
                <span>Reference station:</span> YXZ
              </div>
              <div className="statistic-item">
                <span>FDP maximum extension:</span> 01h30
              </div>
              <div className="statistic-item">
                <span>FDP maximum buffer:</span> 00h30
              </div>
              <div className="statistic-item">
                <span>FDP split FDP maximum:</span> 00h00
              </div>
              <div className="statistic-item">
                <span>Aircraft class:</span> N/A
              </div>
              <div className="statistic-item">
                <span>In flight 4crew:</span> Yes
              </div>
              <div className="statistic-item">
                <span>Easa duty type:</span> reg.
              </div>
            </div>
          </div>
        )}
        <div className="activities-detail table-container">
          <div className="row" role="rowgroup">
            <div className="cell" role="cell">
              <span className="bold">Brief</span>
            </div>
            <div className="cell" role="cell">
              <ActivityDuration
                className="cell"
                startLabel={
                  <span>
                    {`${signOnStartTime} `}
                    <span className="bold">{signOnActivity.stationCode}</span>
                  </span>
                }
                endLabel={
                  <span>
                    <span className="bold">{signOnActivity.stationCode}</span>
                    {` ${signOnEndTime}`}
                  </span>
                }
                checkpoints={signOnCheckPoints}
              />
            </div>
            <div className="multi-row-container">
              <div className="row">
                <div className="cell header" role="cell">
                  <i className="material-icons">local_offer</i>
                  <span>Status</span>
                </div>
                <div className="cell header" role="cell">
                  <i className="material-icons">flight_land</i>
                  <span>Time on ground</span>
                </div>
                <div className="cell header" role="cell">
                  <i className="material-icons">flight</i>
                  <span>Aircraft type</span>
                </div>
                <div className="cell header actions" role="cell">
                  <i className="material-icons">more_horiz</i>
                </div>
                <div className="cell header auto-hide" role="cell">
                  <i className="material-icons">group</i>
                  <span>Required</span>
                </div>
                <div className="cell header auto-hide" role="cell">
                  <i className="material-icons">account_balance_wallet</i>
                  <span>Credit</span>
                </div>
              </div>
            </div>
          </div>
          {this.generateTableData(activity.activities)}
          <div className="row" role="rowgroup">
            <div className="cell" role="cell">
              <span className="bold">Debrief</span>
            </div>
            <div className="cell" role="cell">
              <ActivityDuration
                className="cell"
                startLabel={
                  <span>
                    {`${signOffStartTime} `}
                    <span className="bold">{signOffActivity.stationCode}</span>
                  </span>
                }
                endLabel={
                  <span>
                    <span className="bold">{signOffActivity.stationCode}</span>
                    {` ${signOffEndTime}`}
                  </span>
                }
                checkpoints={signOffCheckPoints}
              />
            </div>
            <div className="cell empty" role="cell">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DutyContainer;
