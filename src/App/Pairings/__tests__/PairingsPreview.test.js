import React from 'react';
import { shallow } from 'enzyme';
import storage, { localStorage } from '../../../utils/storage';
import mockedPreview, { mockScenario } from './mockedPreview.mock';

import * as solverService from '../../../services/Solver';
import scenarioService from '../../../services/Scenarios/index';

import { PairingsPreview } from '../PairingsPreview';

import { user } from '../../../reducers/__mocks__/store';

const minProps = {
  match: {
    params: {
      previewID: mockedPreview.previewId,
    },
  },
  reportError: jest.fn(),
  t: jest.fn(),
  location: {},
  userData: user.userData,
};

beforeEach(() => {
  storage.setItem('openScenario', mockScenario);
});

afterEach(() => {
  storage.clear();
  localStorage.clear();
});

test('PairingsPreview Component should not render Pairings component if both storage is empty', () => {
  const wrapper = shallow(<PairingsPreview {...minProps} />);
  expect(wrapper).toMatchSnapshot();

  // check whether previewDetails state is null
  expect(wrapper.state('previewDetails')).toBe(null);
});

test('PairingsPreview Component should render Pairings component if session storage is not empty', () => {
  // set session storage
  storage.setItem('openPreview', mockedPreview);

  const wrapper = shallow(<PairingsPreview {...minProps} />);
  expect(wrapper).toMatchSnapshot();

  // check whether local storage is set
  const openPreviews = localStorage.getItem('openPreviews') || [];
  expect(openPreviews[0]).toEqual(mockedPreview);

  // check whether previewDetails state is also set
  expect(wrapper.state('previewDetails')).toEqual(mockedPreview);
});

test('PairingsPreview Component should render Pairings component if local storage is not empty', () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);

  const wrapper = shallow(<PairingsPreview {...minProps} />);
  expect(wrapper).toMatchSnapshot();

  // check whether session storage is set
  const openPreview = storage.getItem('openPreview');
  expect(openPreview).toEqual({ ...mockedPreview, pathname: '/' });

  // check whether previewDetails state is also set
  expect(wrapper.state('previewDetails')).toEqual(mockedPreview);
});

test('check localstorage is cleared when beforeunload event is triggered', () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);

  global.dispatchEvent(new Event('beforeunload'));

  // check whether session storage is set
  const openPreviews = localStorage.getItem('openPreviews');
  expect(openPreviews).toEqual([]);
});

test('check whether handleSave function is triggered', () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  wrapper.instance().handleSave = jest.fn();
  wrapper.instance().forceUpdate();

  wrapper.find('ErrorHandler').prop('handleSave')();

  expect(wrapper.instance().handleSave).toHaveBeenCalled();

  wrapper.instance().handleSave.mockClear();
});

test('check whether snackType is set to error if error occured in savePreview', async () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  solverService.savePreview = jest.fn(() => Promise.reject());

  expect(wrapper.state('snackType')).toEqual('');

  await wrapper.instance().handleSave();

  expect(wrapper.state('snackType')).toEqual('error');
});

test('check whether snackType is set to success if savePreview service is success', async () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  solverService.savePreview = jest.fn(() =>
    Promise.resolve({ status: 'SUCCESS', scenarioId: 1015 })
  );

  expect(wrapper.state('snackType')).toEqual('');

  await wrapper.instance().handleSave();

  expect(wrapper.state('snackType')).toEqual('success');

  // check whether session storage is set
  const disableSave = storage.getItem('disableSave');
  expect(disableSave.status).toBe(true);
});

test('check whether snackType is set to info if savePreview service is success with warnings', async () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  solverService.savePreview = jest.fn(() =>
    Promise.resolve({ status: 'SUCCESS_WARNING', scenarioId: 1015 })
  );

  expect(wrapper.state('snackType')).toEqual('');

  await wrapper.instance().handleSave();

  expect(wrapper.state('snackType')).toEqual('info');

  // check whether session storage is set
  const disableSave = storage.getItem('disableSave');
  expect(disableSave.status).toBe(true);
});

test('check whether handleClose function is triggered', () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  wrapper.instance().handleClose = jest.fn();
  wrapper.instance().forceUpdate();

  wrapper.find('ErrorHandler').prop('handleClose')();

  expect(wrapper.instance().handleClose).toHaveBeenCalled();

  wrapper.instance().handleClose.mockClear();
});

test('check whether reportError is called if error occured in deleteScenario', async () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  scenarioService.deletePreview = jest.fn(() => Promise.reject());

  await wrapper.instance().handleClose();

  expect(minProps.reportError).toHaveBeenCalled();
});

test('check whether clearLocalStorage is called if deleteScenario is successfull', async () => {
  // set local storage
  localStorage.setItem('openPreviews', [mockedPreview]);
  const wrapper = shallow(<PairingsPreview {...minProps} />);

  wrapper.instance().clearLocalStorage = jest.fn();
  wrapper.instance().forceUpdate();

  scenarioService.deletePreview = jest.fn(() => Promise.resolve());

  await wrapper.instance().handleClose();

  expect(wrapper.instance().clearLocalStorage).toHaveBeenCalled();

  wrapper.instance().clearLocalStorage.mockClear();
});
