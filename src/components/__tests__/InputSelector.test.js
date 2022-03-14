import React from 'react';
import { shallow } from 'enzyme';

import MenuItem from '../Menu/MenuItem';
import Select from '@material-ui/core/Select';
import InputSelector from '../InputSelector';

const minProps = {
  label: 'Solver Task',
  name: 'sovlerTask',
  items: [
    {
      id: 1,
      name: 'Build pairings'
    },
    {
      id: 2,
      name: 'Repair pairings'
    },
    {
      id: 3,
      name: 'Re-optimize pairings'
    }
  ],
  handleChange: jest.fn()
};

test('InputSelector Component renders', () => {
  const wrapper = shallow(
    <InputSelector
      label={minProps.label}
      name={minProps.name}
      items={minProps.items}
      required={false}
    />
  );

  wrapper.find(MenuItem).forEach((node, i) => {
    expect(node.props().value).toBe(minProps.items[i].id);

    expect(
      node
        .children()
        .children()
        .text()
    ).toBe(minProps.items[i].name);
  });
});

test('InputSelector Component renders with a desired value selected', () => {
  const selected = minProps.items[1].id;

  const wrapper = shallow(
    <InputSelector
      label={minProps.label}
      name={minProps.name}
      items={minProps.items}
      required={false}
      selected={selected}
    />
  );
  expect(wrapper.find(Select).props().value).toBe(selected);
});

test('InputSelector Component change state when selecting other options', () => {
  const initValue = minProps.items[0].id;
  const value = minProps.items[2].id;
  const wrapper = shallow(
    <InputSelector
      label={minProps.label}
      name={minProps.name}
      items={minProps.items}
      selected={initValue}
      handleChange={minProps.handleChange}
    />
  );

  expect(wrapper.state().value).toBe(initValue);
  wrapper.find(Select).simulate('change', { target: { value } });
  expect(wrapper.state().value).toBe(value);
});

test('componentWillReceiveProps() updates state when selected prop changes', () => {
  let initValue = minProps.items[0].id;
  const wrapper = shallow(
    <InputSelector
      label={minProps.label}
      name={minProps.name}
      items={minProps.items}
      selected={initValue}
    />
  );
  initValue = minProps.items[1].id;
  // triggers componentWillReceiveProps
  wrapper.setProps({ selected: initValue });
  expect(wrapper.state().value).toBe(initValue);
});
