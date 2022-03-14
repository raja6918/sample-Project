import React from 'react';
import { mount } from 'enzyme';
import { TimelineColumnDay } from '../';

test('TimelineColumnDay Component renders', () => {
  expect(
    mount(
      <TimelineColumnDay
        className={'class-test'}
        timelineVisibleDays={5}
        hourWidthInPx={20}
        style={{
          height: '100%',
          width: 40,
        }}
      />
    )
  ).toMatchSnapshot();
});
