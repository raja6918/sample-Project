import React from 'react';
import { shallow, mount } from 'enzyme';

import ModalLoader from '../ModalLoader.jsx';

const t = jest.fn();

test('ModalLoader component render correct', () => {
  const wrapper = shallow(<ModalLoader t={t} />);
  expect(wrapper).toMatchSnapshot();
});

test('Render title correct', () => {
  const wrapper = mount(
    <ModalLoader title="Opening" subtitle="New scenario" open />
  );
  expect(wrapper.find('h2').text()).toBe('Opening');
});

test('Render subtitle correct', () => {
  const wrapper = mount(
    <ModalLoader title="Opening" subtitle="New scenario" open />
  );
  expect(wrapper.find('p').text()).toBe('New scenario');
});

test('Render loader correct', () => {
  const wrapper = mount(
    <ModalLoader title="Opening" subtitle="New scenario" open />
  );
  expect(wrapper.find('circle').length).toBe(1);
});
