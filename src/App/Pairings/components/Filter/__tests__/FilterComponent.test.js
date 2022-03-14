import React from 'react';
import { shallow } from 'enzyme';
import { FilterComponent } from '../FilterComponent';
import { filterCriteria } from '../mockData';

describe('Test FilterComponent Component', () => {
  const minProps = {
    t: jest.fn(),
    handleCriteriaChange: jest.fn(),
    handleRemoveCriteria: jest.fn(),
    location: { state: { readOnly: false } },
  };

  const data = {
    name: 'XYZ',
    values: [1, 2],
    data: [{ display: 'JFK', value: 'JFK' }, { display: 'ABC', value: 'ABC' }],
  };

  test('handleRemoveCriteria should be called on trash icon click', () => {
    const criteria = filterCriteria[0].categories[0].criteria[1];
    const wrapper = shallow(
      <FilterComponent criteria={criteria} {...minProps} />
    );

    wrapper.find({ 'aria-label': 'close row' }).simulate('click');
    expect(minProps.handleRemoveCriteria).toBeCalled();
  });

  test('CheckboxFilter with Search Component render and work correctly', () => {
    const criteria = filterCriteria[0].categories[0].criteria[1];
    const wrapper = shallow(
      <FilterComponent criteria={criteria} {...minProps} />
    );
    expect(wrapper).toMatchSnapshot();

    // Check handleCriteriaChange is triggered correctly
    wrapper.find('ErrorHandler').prop('onChange')(data.values, data.data, true);
    expect(minProps.handleCriteriaChange).toBeCalledWith(
      criteria.crName,
      data.values,
      data.data,
      true
    );
  });

  test('CheckboxFilter without Search Component render and work correctly', () => {
    const criteria = filterCriteria[0].categories[2].criteria[1];
    const wrapper = shallow(
      <FilterComponent criteria={criteria} {...minProps} />
    );
    expect(wrapper).toMatchSnapshot();

    // Check handleCriteriaChange is triggered correctly
    wrapper.find('ErrorHandler').prop('onChange')(data.values, data.data, true);
    expect(minProps.handleCriteriaChange).toBeCalledWith(
      criteria.crName,
      data.values,
      data.data,
      true
    );
  });
});
