import React from 'react';
import { shallow } from 'enzyme';

import MenuItem from '../Menu/MenuItem';
import Select from '@material-ui/core/Select';
import ModelSelector from '../ModelSelector';

const fixture = {
  label: 'label',
  name: 'role',
  items: ['Administrator', 'Planner', 'Reviewer'],
};

test('ModelSelector Component renders', () => {
  const wrapper = shallow(
    <ModelSelector
      label={fixture.label}
      name={fixture.name}
      items={fixture.items}
      required={true}
    />
  );

  wrapper.find(MenuItem).forEach((node, i) => {
    expect(node.props().value).toBe(fixture.items[i][fixture.name]);

    expect(
      node
        .children()
        .children()
        .text()
    ).toBe(fixture.items[i]);
  });
});

test('ModelSelector Component renders with a desired value selected', () => {
  const selected = fixture.items[1];

  const wrapper = shallow(
    <ModelSelector
      label={fixture.label}
      name={fixture.name}
      items={fixture.items}
      required={true}
      selected={selected}
    />
  );

  expect(wrapper.find(Select).props().value).toBe(selected);
});

test('ModelSelector Component change state when selecting other options', () => {
  const wrapper = shallow(
    <ModelSelector
      label={fixture.label}
      name={fixture.name}
      items={fixture.items}
    />
  );

  const initValue = fixture.items[0];
  const value = fixture.items[2];

  expect(wrapper.state().value).toBe(initValue);
  wrapper.find(Select).simulate('change', { target: { value } });
  expect(wrapper.state().value).toBe(value);
});
