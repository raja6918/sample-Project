import {
  formatDate,
  generateCrewComposition,
  getDaysDiff,
  getPairingsString,
} from './tooltip';
import { t } from 'i18next';

export const flightTemplate = (activity, context) => {
  const { crewDescription, coverage, balance } = generateCrewComposition(
    activity.crewComposition,
    activity.coverageBalance,
    context
  );

  return `
<span class="sierra-tooltip-header">${t(
    `PAIRINGS.activities.tooltips.titles.flight${activity.coverageSummary}`,
    { flightNumber: activity.flightDesignator }
  )}
<span>
${balance}
</span>
</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.departureStationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span
              ><i class="material-icons icon-line rotate-icon">flight</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
        <div class="aircraftTypeCode-label">${activity.aircraftTypeCode}</div>
      </div>
      <span class="end-label elements-2 FLT">
        <span>${activity.arrivalStationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text">
      <div class="names">${t(
        'PAIRINGS.activities.tooltips.common.required'
      )}</div>
      <div>
        ${crewDescription}
      </div>
    </span>
    <span class="pa-tooltip-text">
    <div class="names">${t(
      'PAIRINGS.activities.tooltips.body.coveredHere'
    )}</div>
    <div>
      ${coverage}
    </div>
  </span>
    <span class="pa-tooltip-text">
      <div class="names">${t(
        'PAIRINGS.activities.tooltips.body.inPairings'
      )}</div>
      <div>${getPairingsString(activity.pairings)}</div>
    </span></span>
</span>
`;
};

export const briefTemplate = activity =>
  `<span class="sierra-tooltip-header"
  >${
    activity.type === 'BRF'
      ? `${t('PAIRINGS.activities.tooltips.titles.signOn')}`
      : `${t('PAIRINGS.activities.tooltips.titles.signOff')}`
  }
  ${activity.stationCode}
</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.stationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span><i class="material-icons icon-line">assignment</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
      </div>
      <span class="end-label elements-2 BRF">
        <span>${activity.stationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text"> 
      <div class="names">${t(
        'PAIRINGS.activities.tooltips.body.acclReference'
      )}</div>
      <div>${activity.stationCode}</div>
    </span>
  </span>
</span>`;

export const connectionTemplate = activity => `
<span class="sierra-tooltip-header">
${
  activity.type === 'CNX'
    ? `${t('PAIRINGS.activities.tooltips.titles.connection')}`
    : `${t('PAIRINGS.activities.tooltips.titles.longConnection')}`
} at
  ${activity.stationCode}</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.stationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span><i class="material-icons icon-line">autorenew</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
      </div>
      <span class="end-label elements-2 CNX">
        <span>${activity.stationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text inner-text"
      >${
        activity.aircraftChange
          ? `${t(
              'PAIRINGS.activities.tooltips.body.connectionWithAircraftChange'
            )}`
          : `${t(
              'PAIRINGS.activities.tooltips.body.connectionWithoutAircraftChange'
            )}`
      }</span
    >
  </span>
</span>
`;

export const restTemplate = activity => `
<span class="sierra-tooltip-header">Rest at ${
  activity.arrivalStationCode
}</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.arrivalStationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span><i class="material-icons icon-line">hotel</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
      </div>
      <span class="end-label LO">
        <span>${activity.departureStationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
        <span
          >${getDaysDiff(activity.startDateTime, activity.endDateTime)}</span
        >
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text inner-text"
      >${activity.accommodationName}</span
    >
  </span>
</span>`;

export const deadHeadTemplate = activity => `
<span class="sierra-tooltip-header">${t(
  'PAIRINGS.activities.tooltips.titles.dhi',
  { dhiNumber: activity.flightDesignator }
)}</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.departureStationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span
              ><i class="material-icons icon-line"
                >airline_seat_recline_extra</i
              ></span
            >
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
        <div class="aircraftTypeCode-label">${
          activity.aircraftTypeCode ? activity.aircraftTypeCode : ''
        }</div>
      </div>
      <span class="end-label elements-2 DHI">
        <span>${activity.arrivalStationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text inner-text">${t(
      'PAIRINGS.activities.tooltips.body.internalDeadhead'
    )}</span>
  </span>
</span>
`;

export const CommercialDeadHeadTemplate = activity => `
<span class="sierra-tooltip-header">${t(
  'PAIRINGS.activities.tooltips.titles.cmlFlight',
  { flightNumber: activity.flightDesignator }
)}</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.departureStationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span><i class="material-icons icon-line">airline_seat_recline_extra</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
        <div class="aircraftTypeCode-label">${
          activity.aircraftTypeCode ? activity.aircraftTypeCode : ''
        }</div>
      </div>
      <span class="end-label elements-2 CML">
        <span>${activity.arrivalStationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text inner-text">${t(
      'PAIRINGS.activities.tooltips.body.commercialDeadhead'
    )}</span>
  </span>
</span>
`;

export const coterminalTemplate = activity => `
<span class="sierra-tooltip-header">
${t('PAIRINGS.activities.tooltips.titles.coterminalTransport')}</span>
<span class="pa-tooltip">
  <span class="activity-duration-container">
    <div class="activity-duration">
      <span class="start-label">
        <span>${activity.departureStationCode}</span>
        <span>${formatDate(activity.startDateTime, 'HH:mm')}</span>
      </span>
      <div class="containerDiv">
        <div class="duration-label">${activity.duration}</div>
        <div class="centerDiv">
          <span class="bullet"></span>
          <span class="line auto-grow"></span>
          <span class="duration">
            <span></span>
            <span><i class="material-icons icon-line">airport_shuttle</i></span>
          </span>
          <span class="line auto-grow"></span>
          <span class="bullet"></span>
        </div>
      </div>
      <span class="end-label elements-2 CNX">
        <span>${activity.arrivalStationCode}</span>
        <span>${formatDate(activity.endDateTime, 'HH:mm')}</span>
      </span>
    </div>
  </span>
  <span class="activity-description">
    <span class="pa-tooltip-text"> 
      <div class="names coterm">${t(
        'PAIRINGS.activities.tooltips.body.type'
      )}</div>
      <div>${t(
        `PAIRINGS.activities.tooltips.body.${activity.transportTypeCode}`
      )}</div>
    </span>
  </span>
</span>
`;
