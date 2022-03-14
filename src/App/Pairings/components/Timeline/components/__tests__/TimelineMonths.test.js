import React from 'react';
import { mount } from 'enzyme';
import { TimelineMonths } from '../';

const minProps = {
  calendarData: [
    {
      days: [
        {
          dayIndex: 0,
          dayName: 'Wednesday',
          dayNumber: '25',
          dayShortName: 'We',
          isCarryIn: true,
          isCarryOut: false,
          isDayAfterPeriodEnd: false,
          isFirstDayOfMonth: false,
          isPeriodEnd: false,
          isPeriodStart: false,
          isWeekend: false,
          relativeDay: -7,
        },
        {
          dayIndex: 1,
          dayName: 'Thursday',
          dayNumber: '26',
          dayShortName: 'Th',
          isCarryIn: true,
          isCarryOut: false,
          isDayAfterPeriodEnd: false,
          isFirstDayOfMonth: false,
          isPeriodEnd: false,
          isPeriodStart: false,
          isWeekend: false,
          relativeDay: -6,
        },
      ],
      daysCount: 7,
      monthName: 'September',
      monthNumber: '8',
      year: '2018',
    },
  ],
  columnWidthInPx: 40,
  initialColumnWidthInPx: 40,
  startDay: 10,
  timelineVisibleDays: 5,
  totalTimelineDurationDays: 10,
  isZoomed: true,
  monthSelectionRef: jest.fn(),
  outerWidth: 40,
  onZoomSelection: jest.fn(),
  t: jest.fn(),
};

test('TimelineMonths Component renders', () => {
  expect(mount(<TimelineMonths {...minProps} />)).toMatchSnapshot();
});
