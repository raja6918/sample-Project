import React from 'react';
import { shallow } from 'enzyme';

import { AircraftModels } from '../AircraftModels';
import { getHeaders } from '../constants';
import * as aircraftModelsService from '../../../../../services/Data/aircraftModels';

const models = [
  {
    code: '220',
    id: 7,
    name: 'Airbus A220',
  },
  {
    code: '320',
    id: 8,
    name: 'Airbus A320',
  },
];

const minProps = {
  t: jest.fn().mockImplementation(() => 'same text'),
  reportError: jest.fn().mockImplementation(() => null),
  openItemId: '1',
  openItemName: 'Test Scenario',
  editMode: false,
  openDeleteDialog: jest.fn(),
  deleteDialogItem: models[0],
  closeDeleteDialog: jest.fn(),
};

jest.mock('../../../../../services/Data/api', () => ({
  get: jest.fn().mockImplementation(() => Promise.resolve([])),
  post: jest.fn().mockImplementation((a, b) => Promise.resolve(b.objects)),
  put: jest.fn().mockImplementation((a, b) => Promise.resolve(b.objects)),
}));

const wrapper = shallow(<AircraftModels {...minProps} />);

const getModels = () => wrapper.state().models;

describe('AircraftModels', () => {
  test('AircraftModels Component renders', () => {
    expect(shallow(<AircraftModels {...minProps} />)).toMatchSnapshot();
  });

  test('AircraftModels Component renders correctly with an initial state', () => {
    expect(shallow(<AircraftModels {...minProps} />).state()).toMatchObject({
      models: [],
      fetching: true,
      message: null,
      snackType: '',
      isFormOpen: false,
      selectedModel: null,
    });
  });

  test('getHeaders returns the right columns', () => {
    const columns = getHeaders(jest.fn());
    expect(columns.length).toBe(2);
  });

  describe('Add/Edit Models', () => {
    const model = {
      id: 1,
      code: 'A19N',
      name: 'asd',
    };

    test('addModel function works', async () => {
      const model = {
        code: 'A19N',
        name: '12',
      };
      const initialModels = getModels();

      await wrapper.instance().addModel(model);

      const updatedModels = getModels();

      expect(updatedModels).toHaveLength(initialModels.length + 1);
      expect(updatedModels).toContain(model);
    });

    test('editModel function works', async () => {
      const model = {
        id: 1,
        code: 'A19N',
        name: 'name',
      };
      const updatedModel = { ...model, name: 'updated field' };

      await wrapper.instance().addModel(model);
      const initialModels = getModels();

      await wrapper.instance().editModel(updatedModel, model.id);
      const updatedModels = getModels();

      expect(initialModels.length).toEqual(updatedModels.length);
      expect(initialModels).not.toContain(updatedModel);
      expect(updatedModels).toContain(updatedModel);
    });

    test('deleteAircraftModel method should remove AircraftModel properly if deleteAircraftModel service resolved', async () => {
      wrapper.setState({ models, fetching: false });
      wrapper.update();

      aircraftModelsService.deleteModel = jest.fn(() => Promise.resolve());

      await wrapper.instance().deleteAircraftModel(models[0]);
      expect(wrapper.state().models.length).toBe(1);
      expect(wrapper.state().models[0]).toEqual(models[1]);

      aircraftModelsService.deleteModel.mockClear();
    });

    test('Delete icon in generic table and delete button in DeleteDialog should work properly', async () => {
      wrapper.setState({ models, fetching: false });
      wrapper.update();
      wrapper.instance().deleteAircraftModel = jest.fn();

      // check whether delete icon click in generic table worked properly
      wrapper
        .find('Connect(AccessEnabler)')
        .at(1)
        .renderProp('render')({ disableComponent: false })
        .find('GenericTable')
        .prop('handleDeleteItem')(models[0]);
      expect(minProps.openDeleteDialog).toHaveBeenCalledWith(models[0]);

      //check whether delete button click in DeleteDialog worked properly
      wrapper.find('DeleteDialog').prop('handleOk')();
      expect(minProps.closeDeleteDialog).toHaveBeenCalled();
      expect(wrapper.instance().deleteAircraftModel).toHaveBeenCalledWith(
        models[0]
      );

      wrapper.instance().deleteAircraftModel.mockClear();
    });

    let readOnlyWrapper;
    test('Aircraft models component render correct in readOnly mode', () => {
      readOnlyWrapper = shallow(
        <AircraftModels {...minProps} readOnly={true} />
      );
      expect(readOnlyWrapper).toMatchSnapshot();
    });
  });
});
