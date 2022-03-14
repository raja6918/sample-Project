import React from 'react';
import { mount } from 'enzyme';
import { TimelineWindow } from '../';

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
  timelineVisibleDays: 5,
  onScrollX: jest.fn(),
  timelineWindowHeight: 100,
  id: 10,
  hourWidthInPx: 40,
  timelineWindowRef: () => {},
};

test.skip('TimelineWindow Component renders', () => {
  expect(mount(<TimelineWindow {...minProps} />)).toMatchSnapshot();
});
