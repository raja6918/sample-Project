import React, { Fragment, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getAlertColor } from './helpers';
import { convertTime } from '../Chronos/utils';
import { services } from '../Chronos/iFlightGantt/core';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 103px;
  margin: 0 24px;
  border-bottom: 1px solid #e5e5e5;
`;

const Bar = styled.div`
  height: 38px;
  max-width: 500px;
`;

const Duty = styled.span`
  height: 38px;
  float: left;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;

  & .pa-label {
    &.hide {
      display: none;
    }
  }
`;

const Line = styled.span`
  height: 4px;
  position: absolute;
  top: 25px;
`;

const Layover = styled.span`
  height: 28px;
  float: left;
  margin-top: 5px;
  border-top: 1px solid #a0a0a0;
  border-bottom: 1px solid #a0a0a0;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 12px;
  color: #000000;
`;

const LayoverLabel = styled.div`
  padding-top: 1px;
`;

const DutyLabel = styled.div`
  padding-top: 3px;
  padding-left: 4px;
`;

const LeftLabel = styled.span`
  color: #000000;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  padding-right: 4px;
  padding-bottom: 20px;
`;

const RightLabel = styled.span`
  color: #000000;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  padding-left: 4px;
  padding-top: 25px;
`;

const BAR_WIDTH = 495;
const moduleName = 'OPS';

const getGradient = configuration => {
  if (configuration && configuration.bar && configuration.bar.fillColor) {
    const colorsArr = configuration.bar.fillColor.split(',');
    if (Array.isArray(colorsArr) && colorsArr.length > 1) {
      return `linear-gradient(180deg, #${colorsArr[0]} ${colorsArr[1]}%, #${colorsArr[2]} ${colorsArr[3]}%)`;
    }
  }
  return 'transparent';
};

const getActivityLabels = configuration => {
  const labels = {};
  if (configuration && configuration.label) {
    for (const key of Object.keys(configuration.label)) {
      const label = configuration.label[key];
      labels[label.position] = label.text;
    }
  }
  return labels;
};

const getActivityConfiguration = (activity, timePerPixal) => {
  const startDate = convertTime(activity.startDateTime);
  const endDate = convertTime(activity.endDateTime);
  const timeDiff = endDate - startDate;
  const width = timeDiff / timePerPixal;

  activity.ganttItemType = activity.type;
  const barConfiguration = services.getConfiguration(activity, moduleName);
  const bgColor = getGradient(barConfiguration);
  const labels = getActivityLabels(barConfiguration);

  return {
    width,
    bgColor,
    labels,
  };
};

const processLabels = containerRef => {
  const labels = containerRef.querySelectorAll('.pa-label');

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const parent = labels[i].parentElement;

    // To handle BOTTOM_CENTER case
    const previousSibling = labels[i].previousSibling;
    let previousSiblingWidth = 0;
    if (previousSibling) {
      previousSiblingWidth = previousSibling.offsetWidth;
    }

    if (previousSiblingWidth + label.offsetWidth + 10 >= parent.clientWidth) {
      label.classList.add('hide');
    }
  }
};

const PairingBar = ({ pairing, alertSelected }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    processLabels(containerRef.current);
  }, []);

  const totalTimeDiff = pairing.endDate - pairing.startDate;
  const timePerPixal = totalTimeDiff / BAR_WIDTH;
  return (
    <span ref={containerRef}>
      <Container>
        <LeftLabel>{pairing.baseCode}</LeftLabel>
        <Bar>
          {Array.isArray(pairing.activities) &&
            pairing.activities.map((activity, index) => {
              if (activity.type === 'LO') {
                const { width, bgColor, labels } = getActivityConfiguration(
                  activity,
                  timePerPixal
                );
                return (
                  <Layover
                    key={index}
                    style={{ background: bgColor, width: `${width}px` }}
                  >
                    <LayoverLabel>
                      <span className="pa-label">{labels.TOP_CENTER}</span>
                    </LayoverLabel>
                    <LayoverLabel>
                      <span className="pa-label">{labels.BOTTOM_CENTER}</span>
                    </LayoverLabel>
                  </Layover>
                );
              } else {
                return (
                  <Duty key={index}>
                    {activity.type === 'DUT' &&
                      Array.isArray(activity.activities) &&
                      activity.activities.map(activity => {
                        const {
                          width,
                          bgColor,
                          labels,
                        } = getActivityConfiguration(activity, timePerPixal);
                        return (
                          <Fragment key={activity.id}>
                            <Duty
                              style={{
                                background: bgColor,
                                width: `${width}px`,
                              }}
                            >
                              {alertSelected &&
                                alertSelected.flightNumber ===
                                  activity.flightNumber && (
                                  <Line
                                    style={{
                                      width: `${width}px`,
                                      background: getAlertColor(
                                        alertSelected.alertType
                                      ),
                                    }}
                                  >
                                    {' '}
                                  </Line>
                                )}
                              <DutyLabel>
                                <span className="pa-label">
                                  {labels.TOP_LEFT}
                                </span>
                              </DutyLabel>
                              <DutyLabel>
                                <span className="pa-label">
                                  {labels.BOTTOM_LEFT}
                                </span>
                                {labels.BOTTOM_CENTER && (
                                  <span className="pa-label">
                                    {' ' + labels.BOTTOM_CENTER}
                                  </span>
                                )}
                              </DutyLabel>
                            </Duty>
                          </Fragment>
                        );
                      })}
                  </Duty>
                );
              }
            })}
        </Bar>
        <RightLabel>{pairing.arrivalStationCode}</RightLabel>
      </Container>
    </span>
  );
};

PairingBar.propTypes = {
  pairing: PropTypes.shape({
    baseCode: PropTypes.string,
    arrivalStationCode: PropTypes.string,
    startDate: PropTypes.number,
    endDate: PropTypes.endDate,
    activities: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  alertSelected: PropTypes.shape({
    alertType: PropTypes.string,
    flightNumber: PropTypes.number,
  }),
};

PairingBar.defaultProps = {
  alertSelected: null,
};

export default PairingBar;
