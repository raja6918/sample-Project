import React from 'react';
import { mount, shallow } from 'enzyme';
import TruncatedTableCell from '../TruncatedTableCell';

test('TruncatedTableCell renders correct', () => {
  const id = Date.now();
  const tooltipText = 'text';
  const wrapper = shallow(
    <TruncatedTableCell id={id} text={tooltipText}>
      text
    </TruncatedTableCell>
  );

  expect(wrapper.find('TableCell').prop('id')).toEqual(id);
  expect(wrapper.find('div').text()).toBe(tooltipText);
  wrapper.instance().checkWidth();

  let showTooltip = wrapper.state('showTooltip');

  expect(showTooltip).toBe(false);
  wrapper.setState({ showTooltip: true });
  showTooltip = wrapper.state('showTooltip');

  expect(showTooltip).toBe(true);
  wrapper.unmount();
});
