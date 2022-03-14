import React from 'react';
import { mount } from 'enzyme';
import { TimelineHeader } from '../';

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
  onZoomSelection: jest.fn(),
  timelineVisibleDays: 5,
  width: 200,
  timelineHeaderRef: jest.fn(),
  leftScroll: 0,
  initialColumnWidthInPx: 40,
  outerWidth: 500,
  totalTimelineDurationDays: 10,
  isZoomed: true,
  startDay: 10,
  monthSelectionRef: jest.fn(),
  t: jest.fn(),
};

test('TimelineHeader Component renders', () => {
  expect(mount(<TimelineHeader {...minProps} />)).toMatchSnapshot();
});
