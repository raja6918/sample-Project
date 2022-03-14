import React from 'react';
import { shallow } from 'enzyme';

import GetInfoForm from '../GetInfoForm';

const selectedTemplate = {
  id: '2',
  name: '2018 Pilot Negotiations',
  category: 'Pairing',
  description: 'template',
  createdBy: 'Fred Smith',
  creationTime: '2017-12-04T08:30:00.586Z',
  status: 'FREE',
  isTemplate: true,
  lastModifiedTime: '2018-03-12T08:30:00.586Z',
  lastModifiedBy: 'Ruben Ramos',
};
const minProps = {
  template: selectedTemplate,
  isOpen: true,
  handleCancel: jest.fn(),
  handleOk: jest.fn(),
  formId: 'getInfoForm',
  t: jest.fn(),
  onClose: jest.fn(),
};
const initialState = {
  isFormDirty: false,
  categories: [],
  tabSelected: 0,
};
const wrapper = shallow(<GetInfoForm {...minProps} />);
test('Get info form  component renders', () => {
  expect(wrapper).toMatchSnapshot();
});

test('Function getItemInfo returns values as expected', () => {
  expect(wrapper.instance().getItemInfo('name')).toEqual(selectedTemplate.name);
  expect(wrapper.instance().getItemInfo('category')).toEqual(
    selectedTemplate.category
  );
  expect(wrapper.instance().getItemInfo('description')).toEqual(
    selectedTemplate.description
  );
});

test('GetInfoForm Component has the correct initial state', () => {
  expect(wrapper.instance().state).toMatchObject(initialState);
});
