import React from 'react';
import { mount } from 'enzyme';
import { TimelineColumns } from '../';

const minProps = {
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
  columnWidthInPx: 40,
  rowsContainerRef: jest.fn(),
  timelineVisibleDays: 5,
  hourWidthInPx: 30,
};

test('TimelineColumns Component renders', () => {
  expect(mount(<TimelineColumns {...minProps} />)).toMatchSnapshot();
});
