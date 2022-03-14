import React from 'react';
import { shallow } from 'enzyme';
import FilterPane from '../FilterPane';
import { filterCriteria } from '../mockData';

describe('Test FilterPane Component', () => {
  const minProps = {
    t: jest.fn(),
    id: 1,
    isOpen: true,
    handleCancel: jest.fn(),
    filterCriteria: filterCriteria,
    location: { state: { readOnly: false } },
    setFilter: jest.fn(),
  };

  let wrapper;
  beforeAll(() => {
    wrapper = shallow(<FilterPane {...minProps} />);
  });

  afterAll(() => {
    wrapper.unmount();
  });

  test('FilterPane Component renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('FilterPane Component calls handleCancel when cancel button is clicked', () => {
    wrapper.find('FilterPaneFooter').prop('handleCancel')();
    expect(minProps.handleCancel).toBeCalled();
  });

  test('FilterPane Component calls handleCancel when close icon is clicked', () => {
    wrapper.find('Base').prop('handleCancel')();
    expect(minProps.handleCancel).toBeCalled();
  });

  test('filterId state is changed and selectedCriteria state is resetted when user change filter type', () => {
    const criteria = filterCriteria[0].categories[2].criteria[1];
    expect(wrapper.state('filterId')).toBe(minProps.id);
    wrapper.setState({ selectedCriteria: [criteria] });
    expect(wrapper.state('selectedCriteria')).toEqual([criteria]);

    wrapper.find('SelectInput').prop('onChange')(2);
    expect(wrapper.state('filterId')).toBe(2);
    expect(wrapper.state('selectedCriteria')).toEqual([]);
  });

  test('filterCriteria state and selectedCriteria state reset when clear all icon clicked', () => {
    // Setting selectedCriteria with some mock values
    const criteria = filterCriteria[0].categories[2].criteria[1];
    wrapper.setState({ selectedCriteria: [criteria] });

    wrapper.find('FormBodyTitle').prop('handleClearAll')();
    expect(wrapper.state('filterCriteria')).toEqual(minProps.filterCriteria);
    expect(wrapper.state('selectedCriteria')).toEqual([]);
  });

  test('Check criteria is added to selectedCriteria and removed from filterCriteria when handleAddCriteria is called', () => {
    const categoryId = 1;
    const criteria = filterCriteria[1].categories[0].criteria[1];
    const noOfCriteria = filterCriteria[1].categories[0].criteria.length;
    wrapper.find('CriteriaFilter').prop('getfilteredCriteria')(
      [criteria],
      categoryId
    );
    expect(wrapper.state('selectedCriteria')).toEqual([
      {
        ...criteria,
        categoryId,
      },
    ]);
    expect(
      wrapper.state('filterCriteria')[1].categories[0].criteria.length
    ).toBe(noOfCriteria - 1);
  });

  test('Check Apply Button is disabled when filterApplied is empty', () => {
    expect(wrapper.state('filterApplied')).toEqual({});
    expect(wrapper.find('FilterPaneFooter').prop('enableSave')).toBe(false);
  });

  test('Check value is added to filterApplied and criteriaErrors is empty when handleCriteriaChange is called', () => {
    const name = 'testCriteriaName';
    const value = ['TestValue'];
    expect(wrapper.state('filterApplied')).toEqual({});
    wrapper.find('withRouter(FilterComponent)').prop('handleCriteriaChange')(
      name,
      value,
      null,
      null
    );
    expect(wrapper.state('filterApplied')).toEqual({
      [name]: {
        value,
        type: '',
      },
    });
    expect(wrapper.state('criteriaErrors')).toEqual([]);
  });

  test('Check Apply Button is enabled when filterApplied is not empty and criteriaErrors is empty', () => {
    expect(wrapper.state('filterApplied')).not.toEqual({});
    expect(wrapper.state('criteriaErrors')).toEqual([]);
    expect(wrapper.find('FilterPaneFooter').prop('enableSave')).toBe(true);
  });

  test('Check value is added to filterApplied and criteriaErrors is set when handleCriteriaChange is called with errors', () => {
    const name = 'testCriteriaName';
    const value = ['TestValue'];
    const error = true;
    wrapper.find('withRouter(FilterComponent)').prop('handleCriteriaChange')(
      name,
      value,
      null,
      error
    );
    expect(wrapper.state('filterApplied')).toEqual({
      [name]: {
        value,
        type: '',
      },
    });
    expect(wrapper.state('criteriaErrors')).toEqual([name]);
  });

  test('Check Apply Button is disabled when criteriaErrors is not empty', () => {
    expect(wrapper.state('filterApplied')).not.toEqual({});
    expect(wrapper.state('criteriaErrors')).not.toEqual([]);
    expect(wrapper.find('FilterPaneFooter').prop('enableSave')).toBe(false);
  });

  test('Check value is added to filterApplied and value is removed from criteriaErrors when handleCriteriaChange is called with no errors', () => {
    const name = 'testCriteriaName';
    const value = ['TestValue'];
    const error = false;
    wrapper.find('withRouter(FilterComponent)').prop('handleCriteriaChange')(
      name,
      value,
      null,
      error
    );
    expect(wrapper.state('filterApplied')).toEqual({
      [name]: {
        value,
        type: '',
      },
    });
    expect(wrapper.state('criteriaErrors')).toEqual([]);
  });

  test('Check value is removed from filterApplied and criteriaErrors is empty when handleCriteriaChange is called with null value', () => {
    const name = 'testCriteriaName';
    const value = null;
    expect(wrapper.state('filterApplied')).not.toEqual({});
    wrapper.find('withRouter(FilterComponent)').prop('handleCriteriaChange')(
      name,
      value,
      null,
      null
    );
    expect(wrapper.state('filterApplied')).toEqual({});
    expect(wrapper.state('criteriaErrors')).toEqual([]);
  });

  test('Check criteria is removed from selectedCriteria and added back to filterCriteria when handleRemoveCriteria is called', () => {
    const categoryId = 1;
    const criteria = filterCriteria[1].categories[0].criteria[1];
    const noOfCriteria = filterCriteria[1].categories[0].criteria.length;
    wrapper.find('withRouter(FilterComponent)').prop('handleRemoveCriteria')({
      ...criteria,
      categoryId,
    });
    expect(wrapper.state('selectedCriteria')).toEqual([]);
    expect(
      wrapper.state('filterCriteria')[1].categories[0].criteria.length
    ).toBe(noOfCriteria);
  });

  test('Check whether setFilter and handleCancel are called when Apply button is clicked', () => {
    const name = 'testCriteriaName';
    const value = ['TestValue'];
    const filterApplied = {
      [name]: {
        value,
        type: '',
      },
    };

    wrapper.setState({
      filterApplied: filterApplied,
    });

    const categoryId = 1;
    const criteria = filterCriteria[1].categories[0].criteria[1];
    wrapper.setState({
      selectedCriteria: [
        {
          ...criteria,
          categoryId,
        },
      ],
    });

    wrapper.find('FilterPaneFooter').prop('handleApply')();

    const filterBody = {
      type: 'apply',
      filterCriteria: filterApplied,
      filterLoaded: '',
      selectedCriteria: [
        {
          ...criteria,
          categoryId,
        },
      ],
    };
    // Check whether setFilter is called
    expect(minProps.setFilter).toBeCalledWith('legs', {
      ...filterBody,
      render: 'legs',
    });

    // Check whether states are cleared
    expect(wrapper.state('filterApplied')).toEqual({});
    expect(wrapper.state('criteriaErrors')).toEqual([]);
    expect(wrapper.state('selectedCriteria')).toEqual([]);

    // Check whether handleCancel is called and filter pane is closed
    expect(minProps.handleCancel).toBeCalled();
  });
});
