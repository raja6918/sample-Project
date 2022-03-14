import React from 'react';
import { shallow } from 'enzyme';

import { Templates } from '../Templates';

import API from '../../../utils/API';

jest.mock('./../../Scenarios/helpers');
jest.mock('../../../services/Templates');

const selectedTemplate = {
  id: 2,
  name: '2018 Pilot Negotiations',
  category: 'Pairing',
  description: 'template',
  createdBy: 'Fred Smith',
  creationTime: '2017-12-04T08:30:00.586Z',
  status: 'FREE',
  isTemplate: true,
  lastModified: '2018-03-12T08:30:00.586Z',
  lastModifiedBy: 'Ruben Ramos',
};
const minProps = {
  t: jest.fn(),
  reportError: jest.fn(),
  history: {},
};
const initialState = {
  templates: [],
  fetching: false,
  templateFormIsOpen: false,
  suggestions: [],
  categories: [],
  message: null,
  snackType: '',
  openLoader: false,
  subtitleLoader: '',
  deleteDialogIsOpen: false,
  getInfoFormIsOpen: false,
  selectedTemplate: {},
};
const setRouteLeaveHook = jest.fn();
const wrapper = shallow(
  <Templates {...minProps} params={{ router: setRouteLeaveHook }} />
);

test.skip('Templates component renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

test('Templates component has the right initial state', () => {
  expect(wrapper.instance().state).toMatchObject(initialState);
});

test('Templates component updates its state after connect with the API', () => {
  Promise.all([API.get('/templates'), API.get('/categories')]).then(
    ([templates, categories]) => {
      const suggestions = templates.map(suggestion => ({
        value: suggestion.id,
        label: suggestion.name,
      }));
      const mapCategories = categories.map(c => ({
        value: c,
        label: c,
      }));
      wrapper.setState({
        templates,
        suggestions,
        categories: mapCategories,
        fetching: false,
      });
      wrapper.update();
      expect(wrapper.state('templates')).toEqual(
        expect.arrayContaining(templates)
      );
      expect(wrapper.state('suggestions')).toEqual(
        expect.arrayContaining(suggestions)
      );
      expect(wrapper.state('categories')).toEqual(
        expect.arrayContaining(categories)
      );
      expect(wrapper.state('fetching')).toEqual(false);
    }
  );
});

test('Templates component opens and closes the form to add templates properly', () => {
  wrapper.instance().handleOpenForm();
  expect(wrapper.state('templateFormIsOpen')).toBe(true);
  wrapper.instance().closeTemplateForm();
  expect(wrapper.state('templateFormIsOpen')).toBe(false);
});

test('Templates component opens and closes the delete dialog and receives the right selected template', () => {
  wrapper.instance().openDeleteDialog(selectedTemplate);
  expect(wrapper.state('deleteDialogIsOpen')).toBe(true);
  expect(wrapper.state('selectedTemplate')).toEqual(selectedTemplate);
  wrapper.instance().closeDeleteDialog();
  expect(wrapper.state('deleteDialogIsOpen')).toBe(false);
});

test.skip('Templates component opens and closes the drawer form for get info option and receives the right selected template', () => {
  wrapper.instance().handleGetInfo(selectedTemplate);
  expect(wrapper.state('getInfoFormIsOpen')).toBe(true);
  expect(wrapper.state('selectedTemplate')).toEqual(selectedTemplate);
  wrapper.instance().toggleGetInfoForm();
  expect(wrapper.state('getInfoFormIsOpen')).toBe(false);
  expect(wrapper.state('selectedTemplate')).toEqual(null);
});
