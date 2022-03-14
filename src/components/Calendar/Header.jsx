import React, { Component } from 'react';
import Icon from '../../components/Icon';
import Styled from 'styled-components';

const HeaderDiv = Styled.div`
  & div.counterDiv {
    background: #5098E7;
    border-radius: 2px 2px 0 0;
    height: 45px;
    width: 350px;
    color: #ffffff;
    text-align: center;

    & span.counterSpan {
      vertical-align: middle;
      display: inline-block;
      line-height: 45px;
    }
  }

  & div.dateDiv {
    background: #E5E5E5;
    height: 45px;
    width: 350px;
    color: rgba(0,0,0,0.87);
    text-align: center;

    & span.dateSpan {
      vertical-align: middle;
      display: inline-block;
      line-height: 45px;

      & span.monthSpan {
        font-size: 16px;
        margin: 0 5px 0 0;
      }

      & span.yearSpan {
        font-size: 12px;
      }
    }
  }
`;

export const Header = (flightDates, t) => {
  const datesCount = flightDates.length;
  const datesString =
    datesCount === 1
      ? t('DATA.operatingFlights.form.section.general.dateSelected')
      : t('DATA.operatingFlights.form.section.general.datesSelected');

  return (
    <HeaderDiv>
      <div className={'counterDiv'}>
        <span className={'counterSpan'}>
          {datesCount} {datesString}
        </span>
      </div>
      <div className={'dateDiv'}>
        <span className={'dateSpan'}>
          {/* <Icon
            size={16}
            iconcolor={'#000000'}
            style={{ transform: 'translateY(1px)'}}
            margin={'0 5px 0 0'}
          >
            calendar_today
          </Icon> */}
          <span id="month" className={'monthSpan'} />
          <span id="year" className={'yearSpan'} />
        </span>
      </div>
    </HeaderDiv>
  );
};
